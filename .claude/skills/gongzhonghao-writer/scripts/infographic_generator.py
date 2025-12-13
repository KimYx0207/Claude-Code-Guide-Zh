#!/usr/bin/env python3
"""
信息图生成器 - V6.0.1兼容版
功能：自动检测文章类型并生成信息图（对比/流程/数据）
作者: Claude Code AI
创建时间: 2025-11-09
"""

import os
import re
import json
import sys
import subprocess
import logging
from pathlib import Path
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
from datetime import datetime

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class InfoGraphicType(Enum):
    """信息图类型枚举"""
    COMPARISON = "comparison"  # 对比表格
    FLOWCHART = "flowchart"    # 流程图
    DATACARD = "datacard"      # 数据卡片
    UNKNOWN = "unknown"        # 未知类型


@dataclass
class ComparisonItem:
    """对比项数据类"""
    name: str
    features: List[str]


@dataclass
class FlowChartStep:
    """流程步骤数据类"""
    order: int
    title: str
    description: str


@dataclass
class DataCard:
    """数据卡片数据类"""
    title: str
    value: str
    description: str
    icon: str = "📊"


class InfographicGenerator:
    """信息图生成器"""

    def __init__(self, article_path: str):
        """
        初始化信息图生成器

        Args:
            article_path: 文章文件路径

        Raises:
            FileNotFoundError: 如果文章文件不存在
        """
        self.article_path = Path(article_path)
        if not self.article_path.exists():
            raise FileNotFoundError(f"文章文件不存在: {article_path}")

        self.article_content = self._read_article()
        self.infographic_type: Optional[InfoGraphicType] = None
        self.output_dir = self.article_path.parent / "infographics"
        self.output_dir.mkdir(exist_ok=True)

        logger.info(f"初始化信息图生成器: {self.article_path}")

    def _read_article(self) -> str:
        """读取文章内容"""
        try:
            with open(self.article_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            logger.error(f"读取文章失败: {e}")
            raise

    def detect_article_type(self) -> InfoGraphicType:
        """
        检测文章类型

        Returns:
            信息图类型
        """
        logger.info("检测文章类型...")

        content_lower = self.article_content.lower()

        # 检测对比类关键词
        comparison_keywords = [
            'vs', '对比', '比较', '区别', '优缺点',
            '差异', 'vs.', '哪个更好', '选择'
        ]
        comparison_score = sum(
            1 for keyword in comparison_keywords
            if keyword in content_lower
        )

        # 检测流程类关键词
        flowchart_keywords = [
            '步骤', '流程', '如何', '怎么', '教程',
            '第一步', '第二步', '接下来', '然后', '最后'
        ]
        flowchart_score = sum(
            1 for keyword in flowchart_keywords
            if keyword in content_lower
        )

        # 检测数据类关键词（数字、百分比等）
        data_pattern = r'\d+%|\d+(?:万|千|百|亿)|[\d.]+(?:倍|次|个|项)'
        data_matches = re.findall(data_pattern, self.article_content)
        datacard_score = len(data_matches)

        logger.info(f"类型评分 - 对比:{comparison_score}, 流程:{flowchart_score}, 数据:{datacard_score}")

        # 根据评分判断类型
        scores = {
            InfoGraphicType.COMPARISON: comparison_score,
            InfoGraphicType.FLOWCHART: flowchart_score,
            InfoGraphicType.DATACARD: datacard_score
        }

        max_score = max(scores.values())
        if max_score >= 3:  # 至少有3个关键词匹配
            self.infographic_type = max(scores.items(), key=lambda x: x[1])[0]
        else:
            self.infographic_type = InfoGraphicType.UNKNOWN

        logger.info(f"检测到文章类型: {self.infographic_type.value}")
        return self.infographic_type

    def extract_comparison_data(self) -> List[ComparisonItem]:
        """
        提取对比数据

        Returns:
            对比项列表
        """
        logger.info("提取对比数据...")

        items: List[ComparisonItem] = []

        # 查找对比主体（通常在标题或开头）
        title_match = re.search(r'^#\s+(.+?vs\.?.+?)$', self.article_content, re.MULTILINE | re.IGNORECASE)
        if title_match:
            title = title_match.group(1)
            # 提取对比的两个主体
            subjects = re.split(r'\s+vs\.?\s+', title, flags=re.IGNORECASE)
            subjects = [s.strip() for s in subjects if s.strip()][:2]
        else:
            subjects = []

        # 如果标题中没有，尝试从内容中提取
        if not subjects:
            h2_headings = re.findall(r'^##\s+(.+)$', self.article_content, re.MULTILINE)
            subjects = h2_headings[:2] if len(h2_headings) >= 2 else []

        if subjects:
            for subject in subjects:
                # 查找该主体的特性描述（通常是列表或段落）
                pattern = rf'##\s+{re.escape(subject)}.*?\n(.*?)(?=\n##|\Z)'
                match = re.search(pattern, self.article_content, re.DOTALL)

                features = []
                if match:
                    content = match.group(1)
                    # 提取列表项
                    features = re.findall(r'^[\d、\-\*]\s*(.+)$', content, re.MULTILINE)
                    features = [f.strip() for f in features if f.strip()][:5]

                items.append(ComparisonItem(
                    name=subject,
                    features=features if features else ["功能强大", "易于使用", "性价比高"]
                ))

        logger.info(f"提取到 {len(items)} 个对比项")
        return items

    def extract_flowchart_data(self) -> List[FlowChartStep]:
        """
        提取流程数据

        Returns:
            流程步骤列表
        """
        logger.info("提取流程数据...")

        steps: List[FlowChartStep] = []

        # 匹配带序号的段落
        # 支持格式：1、xxx  或  第一步：xxx  或  步骤1：xxx
        patterns = [
            r'(\d+)、\s*([^。\n]+)(?:[。\n](.{0,100}))?',
            r'第([一二三四五六七八九十]+)步[：:]\s*([^。\n]+)(?:[。\n](.{0,100}))?',
            r'步骤\s*(\d+)[：:]\s*([^。\n]+)(?:[。\n](.{0,100}))?'
        ]

        for pattern in patterns:
            matches = re.findall(pattern, self.article_content, re.MULTILINE)
            if matches:
                for match in matches:
                    order_str = match[0]
                    # 转换中文数字
                    chinese_nums = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
                                  '六': 6, '七': 7, '八': 8, '九': 9, '十': 10}
                    order = chinese_nums.get(order_str, int(order_str) if order_str.isdigit() else 0)

                    title = match[1].strip()
                    description = match[2].strip() if len(match) > 2 else ""

                    if order > 0 and title:
                        steps.append(FlowChartStep(
                            order=order,
                            title=title,
                            description=description
                        ))

                if steps:
                    break  # 找到一种格式就停止

        # 按顺序排序
        steps.sort(key=lambda x: x.order)

        logger.info(f"提取到 {len(steps)} 个流程步骤")
        return steps[:8]  # 最多8个步骤

    def extract_datacard_data(self) -> List[DataCard]:
        """
        提取数据卡片数据

        Returns:
            数据卡片列表
        """
        logger.info("提取数据卡片数据...")

        cards: List[DataCard] = []

        # 提取包含数字的重要句子
        # 匹配格式：某某达到/超过/增长 XX%/XX万/XX倍
        patterns = [
            r'([^。，\n]{2,20}?)[达到超过增长提升]\s*(\d+[%万千亿倍次])',
            r'([^。，\n]{2,20}?)[：:]\s*(\d+[%万千亿倍次个项])',
            r'(\d+[%万千亿倍次])\s*(?:的|地)\s*([^。，\n]{2,20})'
        ]

        for pattern in patterns:
            matches = re.findall(pattern, self.article_content)
            for match in matches:
                if len(match) == 2:
                    title = match[0].strip()
                    value = match[1].strip()

                    # 过滤太短或太长的标题
                    if 2 <= len(title) <= 20:
                        cards.append(DataCard(
                            title=title,
                            value=value,
                            description=f"{title}达到{value}",
                            icon="📊"
                        ))

        # 去重（根据value）
        seen_values = set()
        unique_cards = []
        for card in cards:
            if card.value not in seen_values:
                seen_values.add(card.value)
                unique_cards.append(card)

        logger.info(f"提取到 {len(unique_cards)} 个数据卡片")
        return unique_cards[:6]  # 最多6个卡片

    def generate_comparison_html(self, items: List[ComparisonItem]) -> str:
        """生成对比表格HTML"""
        if not items:
            return ""

        html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>对比图</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }}
        .container {{
            max-width: 1000px;
            width: 100%;
        }}
        .comparison-table {{
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }}
        .title {{
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            color: #333;
            margin-bottom: 40px;
        }}
        .comparison-grid {{
            display: grid;
            grid-template-columns: repeat({len(items)}, 1fr);
            gap: 30px;
        }}
        .comparison-item {{
            text-align: center;
            padding: 30px;
            border-radius: 15px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            transition: transform 0.3s ease;
        }}
        .comparison-item:hover {{
            transform: translateY(-5px);
        }}
        .item-name {{
            font-size: 24px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 20px;
        }}
        .item-features {{
            text-align: left;
            list-style: none;
        }}
        .item-features li {{
            padding: 10px 0;
            font-size: 16px;
            color: #555;
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }}
        .item-features li:before {{
            content: "✓";
            color: #667eea;
            font-weight: bold;
            margin-right: 10px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="comparison-table">
            <div class="title">功能对比</div>
            <div class="comparison-grid">
"""

        for item in items:
            html += f"""
                <div class="comparison-item">
                    <div class="item-name">{item.name}</div>
                    <ul class="item-features">
"""
            for feature in item.features:
                html += f"                        <li>{feature}</li>\n"

            html += """                    </ul>
                </div>
"""

        html += """            </div>
        </div>
    </div>
</body>
</html>
"""
        return html

    def generate_flowchart_html(self, steps: List[FlowChartStep]) -> str:
        """生成流程图HTML"""
        if not steps:
            return ""

        html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>流程图</title>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
        }}
        .flowchart {{
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }}
        .title {{
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            color: #333;
            margin-bottom: 40px;
        }}
        .steps {{
            display: flex;
            flex-direction: column;
            gap: 20px;
        }}
        .step {{
            display: flex;
            align-items: center;
            gap: 20px;
        }}
        .step-number {{
            flex-shrink: 0;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
        }}
        .step-content {{
            flex: 1;
            padding: 20px 30px;
            border-radius: 15px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }}
        .step-title {{
            font-size: 20px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }}
        .step-description {{
            font-size: 16px;
            color: #666;
            line-height: 1.6;
        }}
        .arrow {{
            text-align: center;
            color: #667eea;
            font-size: 24px;
            margin: 0 0 0 30px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="flowchart">
            <div class="title">操作流程</div>
            <div class="steps">
"""

        for i, step in enumerate(steps):
            html += f"""
                <div class="step">
                    <div class="step-number">{step.order}</div>
                    <div class="step-content">
                        <div class="step-title">{step.title}</div>
                        {f'<div class="step-description">{step.description}</div>' if step.description else ''}
                    </div>
                </div>
"""
            if i < len(steps) - 1:
                html += '                <div class="arrow">↓</div>\n'

        html += """            </div>
        </div>
    </div>
</body>
</html>
"""
        return html

    def generate_datacard_html(self, cards: List[DataCard]) -> str:
        """生成数据卡片HTML"""
        if not cards:
            return ""

        html = """<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>数据看板</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
            padding: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        .dashboard {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .title {
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            color: #333;
            margin-bottom: 40px;
        }
        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        .data-card {
            padding: 30px;
            border-radius: 15px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            text-align: center;
            transition: transform 0.3s ease;
        }
        .data-card:hover {
            transform: translateY(-5px);
        }
        .card-icon {
            font-size: 48px;
            margin-bottom: 15px;
        }
        .card-value {
            font-size: 36px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 10px;
        }
        .card-title {
            font-size: 18px;
            color: #555;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="dashboard">
            <div class="title">关键数据</div>
            <div class="cards-grid">
"""

        for card in cards:
            html += f"""
                <div class="data-card">
                    <div class="card-icon">{card.icon}</div>
                    <div class="card-value">{card.value}</div>
                    <div class="card-title">{card.title}</div>
                </div>
"""

        html += """            </div>
        </div>
    </div>
</body>
</html>
"""
        return html

    def generate_html(self, data: Dict) -> str:
        """
        根据类型生成HTML信息图

        Args:
            data: 提取的数据

        Returns:
            HTML内容
        """
        logger.info(f"生成 {self.infographic_type.value} 类型的HTML...")

        if self.infographic_type == InfoGraphicType.COMPARISON:
            return self.generate_comparison_html(data.get('items', []))
        elif self.infographic_type == InfoGraphicType.FLOWCHART:
            return self.generate_flowchart_html(data.get('steps', []))
        elif self.infographic_type == InfoGraphicType.DATACARD:
            return self.generate_datacard_html(data.get('cards', []))
        else:
            return ""

    def screenshot_html(self, html_path: str) -> Optional[str]:
        """
        使用Playwright MCP截图

        Args:
            html_path: HTML文件路径

        Returns:
            截图文件路径或None
        """
        logger.info(f"使用Playwright截图: {html_path}")

        try:
            # 生成截图文件名
            screenshot_path = self.output_dir / f"{self.article_path.stem}_{self.infographic_type.value}.png"

            # 调用Playwright MCP
            # 注意：这里需要根据实际MCP服务调用方式调整
            cmd = [
                'claude', 'mcp', 'call',
                'playwright',
                'browser_take_screenshot',
                '--url', f'file:///{html_path}',
                '--filename', str(screenshot_path),
                '--fullPage', 'true'
            ]

            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30,
                encoding='utf-8'
            )

            if result.returncode == 0:
                logger.info(f"截图成功: {screenshot_path}")
                return str(screenshot_path)
            else:
                logger.warning(f"截图失败: {result.stderr}")
                return None

        except subprocess.TimeoutExpired:
            logger.error("Playwright截图超时")
            return None
        except Exception as e:
            logger.error(f"Playwright截图异常: {e}")
            return None

    def run(self) -> Dict:
        """
        执行信息图生成流程

        Returns:
            执行结果字典
        """
        logger.info("="*50)
        logger.info("开始信息图生成流程")
        logger.info("="*50)

        result = {
            "success": False,
            "article_path": str(self.article_path),
            "type": "unknown",
            "data": {},
            "html_path": "",
            "screenshot_path": "",
            "errors": []
        }

        try:
            # 1. 检测文章类型
            article_type = self.detect_article_type()
            result["type"] = article_type.value

            if article_type == InfoGraphicType.UNKNOWN:
                result["errors"].append("无法识别文章类型")
                return result

            # 2. 提取数据
            data = {}
            if article_type == InfoGraphicType.COMPARISON:
                items = self.extract_comparison_data()
                if not items:
                    result["errors"].append("未能提取到对比数据")
                    return result
                data["items"] = [{"name": i.name, "features": i.features} for i in items]

            elif article_type == InfoGraphicType.FLOWCHART:
                steps = self.extract_flowchart_data()
                if not steps:
                    result["errors"].append("未能提取到流程数据")
                    return result
                data["steps"] = [
                    {"order": s.order, "title": s.title, "description": s.description}
                    for s in steps
                ]

            elif article_type == InfoGraphicType.DATACARD:
                cards = self.extract_datacard_data()
                if not cards:
                    result["errors"].append("未能提取到数据卡片")
                    return result
                data["cards"] = [
                    {"title": c.title, "value": c.value, "icon": c.icon}
                    for c in cards
                ]

            result["data"] = data

            # 3. 生成HTML
            html_content = self.generate_html(data)
            if not html_content:
                result["errors"].append("生成HTML失败")
                return result

            # 保存HTML
            html_path = self.output_dir / f"{self.article_path.stem}_{article_type.value}.html"
            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(html_content)

            result["html_path"] = str(html_path)
            logger.info(f"HTML生成成功: {html_path}")

            # 4. 截图
            screenshot_path = self.screenshot_html(str(html_path))
            if screenshot_path:
                result["screenshot_path"] = screenshot_path
                result["success"] = True
                logger.info(f"信息图生成完成: {screenshot_path}")
            else:
                result["errors"].append("截图失败，但HTML已生成")
                result["success"] = True  # HTML生成成功也算部分成功

        except Exception as e:
            logger.error(f"信息图生成失败: {e}", exc_info=True)
            result["errors"].append(str(e))

        logger.info("="*50)
        logger.info("信息图生成流程结束")
        logger.info("="*50)

        return result


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print("用法: python infographic_generator.py <article_path>")
        print("示例: python infographic_generator.py ../articles/test.md")
        sys.exit(1)

    article_path = sys.argv[1]

    try:
        generator = InfographicGenerator(article_path)
        result = generator.run()

        # 输出结果
        print("\n" + "="*50)
        print("信息图生成结果")
        print("="*50)
        print(json.dumps(result, ensure_ascii=False, indent=2))

        if result["success"]:
            print(f"\n✅ 信息图生成成功！")
            print(f"类型: {result['type']}")
            print(f"HTML文件: {result['html_path']}")
            if result.get('screenshot_path'):
                print(f"截图文件: {result['screenshot_path']}")
            sys.exit(0)
        else:
            print(f"\n❌ 信息图生成失败！")
            print(f"错误: {', '.join(result['errors'])}")
            sys.exit(1)

    except Exception as e:
        print(f"\n❌ 执行失败: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
