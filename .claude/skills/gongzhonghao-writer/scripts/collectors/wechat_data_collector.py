# -*- coding: utf-8 -*-
"""
微信公众号数据收集器
用于收集公众号后台文章数据（阅读数、点赞、在看等）

作者：老金
日期：2025-11-29
"""

import json
import os
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional


# 获取项目根目录：从脚本位置向上4级（scripts -> prompts -> gongzhonghao-writer -> skills -> .claude -> 项目根）
# 或使用环境变量CLAUDE_PROJECT_DIR
PROJECT_ROOT = Path(os.getenv('CLAUDE_PROJECT_DIR', Path(__file__).parent.parent.parent.parent.parent))
DEFAULT_DATA_DIR = PROJECT_ROOT / "data"


class WeChatDataCollector:
    """微信公众号数据收集器"""

    def __init__(self, data_dir: Path = None):
        """
        初始化数据收集器

        Args:
            data_dir: 数据存储目录（Path对象或None使用默认）
                     修复：使用绝对路径，避免相对路径"data"导致的路径错误
        """
        # 使用传入的data_dir，如果为None则使用默认的项目根/data
        if data_dir is None:
            data_dir = DEFAULT_DATA_DIR
        elif isinstance(data_dir, str):
            # 向后兼容：如果传入字符串，转为Path并解析为绝对路径
            data_dir = Path(data_dir)
            if not data_dir.is_absolute():
                data_dir = PROJECT_ROOT / data_dir

        self.data_dir = data_dir
        self.data_dir.mkdir(exist_ok=True, parents=True)
        self.data_file = self.data_dir / "wechat_articles.json"
        self.history_file = self.data_dir / "wechat_history.json"

    def parse_simple_text(self, text: str) -> List[Dict]:
        """
        解析简化文本格式（用户手动复制的数据）

        格式示例:
        今天 17:29
        已发表
        香港2亿AI诈骗案细节曝光，视频会议里只有你是真人
        原创
        673 13 48 5 3 4 ¥0.00 0

        Args:
            text: 简化文本

        Returns:
            文章数据列表
        """
        articles = []
        lines = [line.strip() for line in text.split('\n') if line.strip()]

        i = 0
        while i < len(lines):
            current_article = {}

            # 1. 发布时间
            if i < len(lines) and re.match(r'^(今天|昨天|星期[一二三四五六日]|[\d]+月[\d]+日)(\s+\d+:\d+)?$', lines[i]):
                current_article['publish_time'] = lines[i]
                i += 1
            else:
                i += 1
                continue

            # 2. "已发表" 标记（跳过）
            if i < len(lines) and lines[i] == '已发表':
                i += 1

            # 3. 文章标题
            if i < len(lines) and len(lines[i]) > 10 and lines[i] != '原创':
                current_article['title'] = lines[i]
                i += 1
            else:
                i += 1
                continue

            # 4. "原创" 标记（跳过）
            if i < len(lines) and lines[i] == '原创':
                i += 1

            # 5. 数据行: "673 13 48 5 3 4 ¥0.00 0"
            if i < len(lines):
                parts = lines[i].split()
                if len(parts) >= 3:
                    try:
                        current_article['read_count'] = int(parts[0].replace(',', ''))
                        current_article['like_count'] = int(parts[1].replace(',', ''))
                        current_article['look_count'] = int(parts[2].replace(',', ''))
                        current_article['comment_count'] = int(parts[3].replace(',', '')) if len(parts) > 3 else 0
                        current_article['share_count'] = int(parts[4].replace(',', '')) if len(parts) > 4 else 0
                        current_article['underline_count'] = int(parts[5].replace(',', '')) if len(parts) > 5 else 0
                        current_article['reward_amount'] = parts[6] if len(parts) > 6 else '¥0.00'
                    except (ValueError, IndexError):
                        pass
                i += 1

            # 添加文章（必须有标题和发布时间）
            if 'title' in current_article and 'publish_time' in current_article:
                # 设置默认值
                current_article.setdefault('read_count', 0)
                current_article.setdefault('like_count', 0)
                current_article.setdefault('look_count', 0)
                current_article.setdefault('comment_count', 0)
                current_article.setdefault('share_count', 0)
                current_article.setdefault('underline_count', 0)
                current_article.setdefault('reward_amount', '¥0.00')
                current_article.setdefault('url', '')

                articles.append(current_article)

            # 跳过空行
            while i < len(lines) and not lines[i]:
                i += 1

        return articles

    def parse_snapshot_text(self, snapshot_text: str) -> List[Dict]:
        """
        从Playwright snapshot文本中解析文章数据

        Args:
            snapshot_text: snapshot文本内容

        Returns:
            文章数据列表
        """
        articles = []
        lines = snapshot_text.split('\n')

        # 临时存储当前文章数据
        current_article = {}

        # 记录是否在文章区域（已发表）
        in_article_section = False

        for line in lines:
            # 提取StaticText内容
            static_text_match = re.search(r'StaticText "([^"]+)"', line)
            if not static_text_match:
                continue

            text_content = static_text_match.group(1)

            # 提前检测发布时间（包括第一篇在"已发表"之前的文章）
            time_match = re.match(r'^(今天|昨天|星期[一二三四五六日]|[\d]+月[\d]+日)(\s+\d+:\d+)?$', text_content)
            if time_match:
                # 保存前一篇文章（只要有时间就算一篇文章）
                if current_article and 'publish_time' in current_article:
                    articles.append(current_article)
                # 开始新文章，并自动进入文章区域
                current_article = {'publish_time': text_content}
                in_article_section = True
                continue

            # 检测是否进入文章区域
            if text_content == "已发表":
                in_article_section = True
                continue

            if not in_article_section:
                continue

            # 提取文章标题和URL
            # 标题：长文本（>10字符），不是"原创"，不是空格，不包含数字
            if text_content != '原创' and len(text_content) > 10 and not re.match(r'^[\s\u200b]+$', text_content):
                # 检查是否是纯数字或标点
                if not re.match(r'^[\d,.\s¥]+$', text_content):
                    # 如果当前文章还没有标题，这就是标题
                    if 'title' not in current_article:
                        current_article['title'] = text_content
                        # 尝试从当前行或前一行提取URL
                        url_match = re.search(r'url="(https://mp\.weixin\.qq\.com/s/[^"]+)"', line)
                        if url_match:
                            current_article['url'] = url_match.group(1)
                continue

            # 提取数字数据（阅读、点赞、在看、评论、转发）
            # 必须是纯数字（可能包含逗号，如"1,079"）
            num_match = re.match(r'^([\d,]+)$', text_content)
            if num_match:
                # 移除逗号
                num_str = num_match.group(1).replace(',', '')
                num = int(num_str)

                # 按顺序识别：阅读、点赞、在看、评论、转发
                if 'read_count' not in current_article:
                    current_article['read_count'] = num
                elif 'like_count' not in current_article:
                    current_article['like_count'] = num
                elif 'look_count' not in current_article:
                    current_article['look_count'] = num
                elif 'comment_count' not in current_article:
                    current_article['comment_count'] = num
                elif 'share_count' not in current_article:
                    current_article['share_count'] = num
                continue

            # 提取划线数（在mpunderline链接中）
            if 'mpunderline' in line:
                underline_match = re.match(r'^\d+$', text_content)
                if underline_match:
                    current_article['underline_count'] = int(text_content)
                continue

            # 提取赞赏金额
            if '¥' in text_content:
                reward_match = re.search(r'¥([\d.]+)', text_content)
                if reward_match:
                    current_article['reward_amount'] = float(reward_match.group(1))
                continue

        # 保存最后一篇文章
        if current_article and 'publish_time' in current_article:
            articles.append(current_article)

        return articles

    def load_existing_data(self) -> List[Dict]:
        """
        加载已存在的数据

        Returns:
            现有文章数据列表
        """
        if self.data_file.exists():
            with open(self.data_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def save_data(self, articles: List[Dict]):
        """
        保存文章数据

        Args:
            articles: 文章数据列表
        """
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(articles, f, ensure_ascii=False, indent=2)

    def save_history_snapshot(self, articles: List[Dict], snapshot_date: str):
        """
        保存历史快照

        Args:
            articles: 文章数据列表
            snapshot_date: 快照日期
        """
        history = {}
        if self.history_file.exists():
            with open(self.history_file, 'r', encoding='utf-8') as f:
                history = json.load(f)

        history[snapshot_date] = articles

        with open(self.history_file, 'w', encoding='utf-8') as f:
            json.dump(history, f, ensure_ascii=False, indent=2)

    def merge_incremental_data(self, new_articles: List[Dict]) -> Dict:
        """
        增量合并数据

        Args:
            new_articles: 新爬取的文章列表

        Returns:
            合并统计信息
        """
        existing = self.load_existing_data()
        existing_titles = {article.get('title') for article in existing if 'title' in article}

        # 找出新增文章
        new_count = 0
        updated_count = 0
        skipped_count = 0

        for article in new_articles:
            # 跳过没有title的文章
            if 'title' not in article:
                skipped_count += 1
                continue

            if article['title'] not in existing_titles:
                existing.append(article)
                new_count += 1
            else:
                # 更新已存在文章的数据
                for i, old_article in enumerate(existing):
                    if old_article.get('title') == article['title']:
                        existing[i] = article
                        updated_count += 1
                        break

        # 保存合并后的数据
        self.save_data(existing)

        # 保存历史快照
        today = datetime.now().strftime("%Y-%m-%d")
        self.save_history_snapshot(existing, today)

        return {
            'total': len(existing),
            'new': new_count,
            'updated': updated_count
        }

    def generate_report(self) -> str:
        """
        生成数据收集报告

        Returns:
            报告文本
        """
        articles = self.load_existing_data()

        if not articles:
            return "[ERROR] 暂无数据"

        # 统计数据
        total_read = sum(a.get('read_count', 0) for a in articles)
        total_like = sum(a.get('like_count', 0) for a in articles)
        total_look = sum(a.get('look_count', 0) for a in articles)
        avg_read = total_read // len(articles) if articles else 0

        # 找出爆款文章（阅读数>1000）
        hot_articles = [a for a in articles if a.get('read_count', 0) > 1000]
        hot_articles.sort(key=lambda x: x.get('read_count', 0), reverse=True)

        report = f"""
========== 微信公众号数据收集报告 ==========
{'='*50}

[总体统计]
- 文章总数：{len(articles)}篇
- 总阅读数：{total_read:,}
- 总点赞数：{total_like}
- 总在看数：{total_look}
- 平均阅读：{avg_read:,}/篇

[爆款文章（阅读>1000）]
"""

        for i, article in enumerate(hot_articles[:10], 1):
            report += f"\n{i}、{article['title']}"
            report += f"\n   阅读：{article.get('read_count', 0):,} | 点赞：{article.get('like_count', 0)} | 在看：{article.get('look_count', 0)}"

        return report

    def generate_incremental_report(self, new_articles: List[Dict], skipped_count: int, pages_collected: int) -> str:
        """
        生成增量收集报告（包含增量信息和总体统计）

        Args:
            new_articles: 新增文章列表
            skipped_count: 跳过的文章数（重复）
            pages_collected: 收集的页数

        Returns:
            增量报告文本
        """
        all_articles = self.load_existing_data()

        if not all_articles:
            return "[ERROR] 暂无数据"

        # 计算总体统计
        total_read = sum(a.get('read_count', 0) for a in all_articles)
        total_like = sum(a.get('like_count', 0) for a in all_articles)
        total_look = sum(a.get('look_count', 0) for a in all_articles)
        avg_read = total_read // len(all_articles) if all_articles else 0

        # 计算新增文章的统计
        new_read = sum(a.get('read_count', 0) for a in new_articles)
        new_like = sum(a.get('like_count', 0) for a in new_articles)
        new_look = sum(a.get('look_count', 0) for a in new_articles)

        # 找出爆款文章
        hot_articles = [a for a in all_articles if a.get('read_count', 0) > 1000]
        hot_articles.sort(key=lambda x: x.get('read_count', 0), reverse=True)

        # 生成报告
        report = f"""
========== 微信公众号增量数据收集报告 ==========
{'='*50}

[收集概况]
- 收集时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- 收集页数：{pages_collected}页（智能停止）
- 停止原因：{'检测到重复文章' if skipped_count > 0 else '完成收集'}

[增量统计]
- 新增文章：{len(new_articles)}篇
- 跳过文章：{skipped_count}篇（重复）
- 新增阅读：+{new_read:,}
- 新增点赞：+{new_like}
- 新增在看：+{new_look}

[总体统计]
- 文章总数：{len(all_articles)}篇
- 总阅读数：{total_read:,}
- 总点赞数：{total_like}
- 总在看数：{total_look}
- 平均阅读：{avg_read:,}/篇

[新增文章列表]
"""

        for i, article in enumerate(new_articles, 1):
            report += f"\n{i}、{article['title']}（{article.get('publish_time', '未知')}）"
            report += f"\n   阅读{article.get('read_count', 0)} | 点赞{article.get('like_count', 0)} | 在看{article.get('look_count', 0)}"

        report += "\n\n[爆款文章 TOP 10]"

        for i, article in enumerate(hot_articles[:10], 1):
            report += f"\n\n{i}、{article['title']}"
            report += f"\n   阅读：{article.get('read_count', 0):,} | 点赞：{article.get('like_count', 0)} | 在看：{article.get('look_count', 0)}"

        return report


if __name__ == "__main__":
    # 测试代码
    collector = WeChatDataCollector()
    print("✅ 数据收集器初始化成功")
    print(f"📁 数据目录：{collector.data_dir.absolute()}")
