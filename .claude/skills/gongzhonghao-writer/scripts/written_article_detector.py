#!/usr/bin/env python3
"""
已写文章检测器
检测热点是否已被写过，避免重复创作
"""

import os
import re
import json
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
from difflib import SequenceMatcher


class WrittenArticleDetector:
    """已写文章检测器"""

    def __init__(self, articles_dir: str = None):
        """
        初始化检测器

        Args:
            articles_dir: 文章目录路径，默认使用项目articles目录
        """
        if articles_dir is None:
            # 默认路径
            self.articles_dir = Path(__file__).parent.parent.parent.parent.parent / "articles"
        else:
            self.articles_dir = Path(articles_dir)

        self.articles_cache: List[Dict] = []
        self._load_articles()

    def _load_articles(self) -> None:
        """加载所有已写文章"""
        self.articles_cache = []

        if not self.articles_dir.exists():
            return

        for file_path in self.articles_dir.glob("*.md"):
            article = self._parse_article(file_path)
            if article:
                self.articles_cache.append(article)

        # 按日期排序
        self.articles_cache.sort(key=lambda x: x.get("date", ""), reverse=True)

    def _parse_article(self, file_path: Path) -> Optional[Dict]:
        """
        解析文章文件

        Args:
            file_path: 文章文件路径

        Returns:
            文章信息字典
        """
        try:
            filename = file_path.name

            # 解析文件名格式: 2025-11-24_标题_老金风格.md
            match = re.match(r"(\d{4}-\d{2}-\d{2})_(.+?)(?:_老金风格)?\.md", filename)
            if not match:
                return None

            date_str = match.group(1)
            title = match.group(2)

            # 读取文章内容提取关键词
            content = file_path.read_text(encoding="utf-8")
            keywords = self._extract_keywords(title, content)

            return {
                "path": str(file_path),
                "filename": filename,
                "date": date_str,
                "title": title,
                "keywords": keywords,
                "content_preview": content[:500] if content else ""
            }
        except Exception as e:
            return None

    def _extract_keywords(self, title: str, content: str) -> List[str]:
        """
        从标题和内容中提取关键词

        Args:
            title: 文章标题
            content: 文章内容

        Returns:
            关键词列表
        """
        keywords = set()

        # 常见AI相关关键词
        ai_keywords = [
            "Claude", "GPT", "ChatGPT", "OpenAI", "Anthropic", "Google", "Gemini",
            "MCP", "Agent", "LLM", "大模型", "AI", "人工智能",
            "Cursor", "Copilot", "Code", "编程", "开发",
            "Midjourney", "Stable Diffusion", "DALL-E", "AI绘画",
            "Suno", "AI音乐", "语音",
            "Hook", "Skill", "Command", "命令", "技巧",
            "效率", "工具", "配置", "教程"
        ]

        text = f"{title} {content[:2000]}".lower()

        for kw in ai_keywords:
            if kw.lower() in text:
                keywords.add(kw)

        # 从标题中提取特殊词
        title_words = re.findall(r'[\u4e00-\u9fff]+|[a-zA-Z]+', title)
        for word in title_words:
            if len(word) >= 2:
                keywords.add(word)

        return list(keywords)

    def check_hotspot(self, hotspot_title: str, hotspot_keywords: List[str] = None) -> Dict:
        """
        检查热点是否已被写过

        Args:
            hotspot_title: 热点标题
            hotspot_keywords: 热点关键词列表

        Returns:
            检测结果字典
        """
        if hotspot_keywords is None:
            hotspot_keywords = []

        # 合并标题中的关键词
        title_keywords = re.findall(r'[\u4e00-\u9fff]+|[a-zA-Z]+', hotspot_title)
        all_keywords = set(hotspot_keywords + [k for k in title_keywords if len(k) >= 2])

        result = {
            "hotspot_title": hotspot_title,
            "is_written": False,
            "similar_articles": [],
            "recommendation": "可以写",
            "confidence": 0.0
        }

        for article in self.articles_cache:
            similarity = self._calculate_similarity(
                hotspot_title,
                all_keywords,
                article
            )

            if similarity > 0.3:  # 相似度阈值
                result["similar_articles"].append({
                    "title": article["title"],
                    "date": article["date"],
                    "similarity": round(similarity, 2),
                    "path": article["path"]
                })

        # 按相似度排序
        result["similar_articles"].sort(key=lambda x: x["similarity"], reverse=True)

        # 判断是否已写过
        if result["similar_articles"]:
            top_similarity = result["similar_articles"][0]["similarity"]
            result["confidence"] = top_similarity

            if top_similarity >= 0.7:
                result["is_written"] = True
                result["recommendation"] = f"⚠️ 高度相似！已有文章《{result['similar_articles'][0]['title']}》({result['similar_articles'][0]['date']})"
            elif top_similarity >= 0.5:
                result["is_written"] = False
                result["recommendation"] = f"⚡ 有相似文章，建议换角度：《{result['similar_articles'][0]['title']}》"
            else:
                result["recommendation"] = "✅ 可以写，无高度相似文章"

        return result

    def _calculate_similarity(self, hotspot_title: str, hotspot_keywords: set, article: Dict) -> float:
        """
        计算热点与已有文章的相似度

        Args:
            hotspot_title: 热点标题
            hotspot_keywords: 热点关键词集合
            article: 已有文章信息

        Returns:
            相似度分数 (0-1)
        """
        scores = []

        # 1. 标题相似度 (权重 0.4)
        title_sim = SequenceMatcher(None, hotspot_title.lower(), article["title"].lower()).ratio()
        scores.append(("title", title_sim, 0.4))

        # 2. 关键词重叠度 (权重 0.4)
        article_keywords = set(k.lower() for k in article.get("keywords", []))
        hotspot_kw_lower = set(k.lower() for k in hotspot_keywords)

        if hotspot_kw_lower and article_keywords:
            overlap = len(hotspot_kw_lower & article_keywords)
            total = len(hotspot_kw_lower | article_keywords)
            keyword_sim = overlap / total if total > 0 else 0
        else:
            keyword_sim = 0
        scores.append(("keywords", keyword_sim, 0.4))

        # 3. 特定产品/工具名称完全匹配 (权重 0.2)
        product_names = ["Claude", "GPT", "Gemini", "Cursor", "MCP", "Midjourney", "Suno"]
        product_match = 0
        for product in product_names:
            if product.lower() in hotspot_title.lower() and product.lower() in article["title"].lower():
                product_match = 1
                break
        scores.append(("product", product_match, 0.2))

        # 计算加权总分
        total_score = sum(score * weight for _, score, weight in scores)

        return total_score

    def batch_check(self, hotspots: List[Dict]) -> List[Dict]:
        """
        批量检查多个热点

        Args:
            hotspots: 热点列表，每个热点包含title和keywords

        Returns:
            检测结果列表
        """
        results = []
        for hotspot in hotspots:
            title = hotspot.get("title", "")
            keywords = hotspot.get("keywords", [])
            result = self.check_hotspot(title, keywords)
            result["original_hotspot"] = hotspot
            results.append(result)

        return results

    def get_recent_topics(self, days: int = 7) -> List[str]:
        """
        获取近期已写的主题

        Args:
            days: 天数

        Returns:
            主题列表
        """
        cutoff_date = datetime.now() - timedelta(days=days)
        recent_topics = []

        for article in self.articles_cache:
            try:
                article_date = datetime.strptime(article["date"], "%Y-%m-%d")
                if article_date >= cutoff_date:
                    recent_topics.append(article["title"])
            except:
                continue

        return recent_topics

    def generate_report(self, results: List[Dict]) -> str:
        """
        生成检测报告

        Args:
            results: 批量检测结果

        Returns:
            报告字符串
        """
        report = []
        report.append("=" * 60)
        report.append("              📝 已写文章检测报告")
        report.append("=" * 60)
        report.append("")

        can_write = []
        need_angle = []
        already_written = []

        for r in results:
            if r["is_written"]:
                already_written.append(r)
            elif r["similar_articles"] and r["similar_articles"][0]["similarity"] >= 0.5:
                need_angle.append(r)
            else:
                can_write.append(r)

        # 可以写的
        if can_write:
            report.append("✅ 可以写（无相似文章）：")
            report.append("-" * 40)
            for r in can_write:
                report.append(f"  • {r['hotspot_title']}")
            report.append("")

        # 需要换角度的
        if need_angle:
            report.append("⚡ 建议换角度（有相似文章）：")
            report.append("-" * 40)
            for r in need_angle:
                similar = r['similar_articles'][0]
                report.append(f"  • {r['hotspot_title']}")
                report.append(f"    ↳ 相似文章：《{similar['title']}》({similar['date']}) 相似度:{similar['similarity']}")
            report.append("")

        # 已写过的
        if already_written:
            report.append("⚠️ 已写过（不建议重复）：")
            report.append("-" * 40)
            for r in already_written:
                similar = r['similar_articles'][0]
                report.append(f"  • {r['hotspot_title']}")
                report.append(f"    ↳ 已有文章：《{similar['title']}》({similar['date']}) 相似度:{similar['similarity']}")
            report.append("")

        # 统计
        report.append("=" * 60)
        report.append(f"📊 统计：可写 {len(can_write)} | 换角度 {len(need_angle)} | 已写过 {len(already_written)}")
        report.append("=" * 60)

        return "\n".join(report)


def main():
    """测试入口"""
    detector = WrittenArticleDetector()

    # 测试热点
    test_hotspots = [
        {"title": "Claude 3.5更新，代码能力大幅提升", "keywords": ["Claude", "代码", "更新"]},
        {"title": "MCP工具使用指南", "keywords": ["MCP", "工具", "指南"]},
        {"title": "Suno v5发布，AI音乐新时代", "keywords": ["Suno", "AI音乐", "v5"]},
        {"title": "Cursor Pro降价40%", "keywords": ["Cursor", "降价"]},
        {"title": "新的AI视频工具发布", "keywords": ["AI", "视频", "工具"]},
    ]

    results = detector.batch_check(test_hotspots)
    print(detector.generate_report(results))

    # 打印近7天写过的主题
    print("\n📅 近7天已写主题：")
    for topic in detector.get_recent_topics(7):
        print(f"  • {topic}")


if __name__ == "__main__":
    main()
