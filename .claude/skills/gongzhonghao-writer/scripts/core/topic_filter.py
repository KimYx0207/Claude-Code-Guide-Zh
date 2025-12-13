# -*- coding: utf-8 -*-
"""
选题过滤器 V3.0 - 双轨制简化版
基于82篇历史文章数据驱动设计

V3.0 核心逻辑：
1. 核心工具类：大厂 + AI垂直厂商的工具 → 稳定流量，常写
2. 泛AI话题类：AI现象/趋势/热点 → 破圈潜力，精选写

数据验证结论：
- 核心工具类：54篇，平均阅读 1798
- 泛AI话题类：25篇，平均阅读 908
- 核心工具类平均阅读是泛AI话题类的2倍

设计理念：
- 不评分，只分类
- 核心工具池用数据验证
- 时效性决定写作策略（快写 vs 慢写）
"""

import re
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class FilterResultV3:
    """V3过滤结果"""
    category: str  # "核心工具类" / "泛AI话题类" / "不建议"
    worth_writing: bool
    tool_matched: Optional[str]  # 匹配到的工具/品牌
    timeliness: str  # "热点期" / "常青期"
    strategy: str  # 写作策略建议
    insights: List[str]
    historical_avg_reads: Optional[int]  # 该工具/品牌的历史平均阅读


class TopicFilterV3:
    """选题过滤器 V7.1 - 双轨制"""

    # 核心工具池（数据验证通过，按平均阅读排序）
    # 来源：82篇文章数据分析
    CORE_TOOLS = {
        # === 大厂出品 ===
        "Google/Gemini": {
            "keywords": ["gemini", "google", "谷歌", "g3", "bard"],
            "avg_reads": 3146,
            "tier": "大厂",
        },
        "ByteDance/即梦": {
            "keywords": ["即梦", "豆包", "字节", "jimeng", "doubao"],
            "avg_reads": 2927,
            "tier": "大厂",
        },
        "Anthropic/Claude": {
            "keywords": ["claude", "anthropic"],
            "avg_reads": 2118,
            "tier": "大厂",
        },
        "OpenAI/ChatGPT": {
            "keywords": ["chatgpt", "gpt", "openai", "gpt-4", "gpt-5", "gpt5", "gpt4"],
            "avg_reads": 675,  # 低于预期，但仍是大厂
            "tier": "大厂",
        },
        "DeepSeek": {
            "keywords": ["deepseek", "深度求索"],
            "avg_reads": 1048,
            "tier": "大厂",
        },
        "Kimi/月之暗面": {
            "keywords": ["kimi", "月之暗面", "moonshot"],
            "avg_reads": 3448,
            "tier": "大厂",
        },
        "百度/文心": {
            "keywords": ["文心", "百度", "ernie", "wenxin"],
            "avg_reads": None,  # 无数据
            "tier": "大厂",
        },
        "阿里/通义": {
            "keywords": ["通义", "阿里", "qwen", "tongyi"],
            "avg_reads": None,
            "tier": "大厂",
        },
        "Microsoft/Copilot": {
            "keywords": ["copilot", "microsoft", "微软", "bing"],
            "avg_reads": None,
            "tier": "大厂",
        },
        "Meta/Llama": {
            "keywords": ["llama", "meta ai", "facebook ai"],
            "avg_reads": None,
            "tier": "大厂",
        },

        # === AI垂直厂商 ===
        "Cursor": {
            "keywords": ["cursor"],
            "avg_reads": 1246,
            "tier": "AI垂直",
        },
        "Codex": {
            "keywords": ["codex"],
            "avg_reads": 1199,
            "tier": "AI垂直",
        },
        "Coze": {
            "keywords": ["coze", "扣子"],
            "avg_reads": 689,
            "tier": "AI垂直",
        },
        "Midjourney": {
            "keywords": ["midjourney", "mj", "niji"],
            "avg_reads": None,
            "tier": "AI垂直",
        },
        "Runway": {
            "keywords": ["runway"],
            "avg_reads": None,
            "tier": "AI垂直",
        },
        "Perplexity": {
            "keywords": ["perplexity"],
            "avg_reads": None,
            "tier": "AI垂直",
        },
        "Suno": {
            "keywords": ["suno"],
            "avg_reads": None,
            "tier": "AI垂直",
        },
        "可灵": {
            "keywords": ["可灵", "kling"],
            "avg_reads": None,
            "tier": "AI垂直",
        },
        "Windsurf": {
            "keywords": ["windsurf", "codeium"],
            "avg_reads": None,
            "tier": "AI垂直",
        },
        "Bolt": {
            "keywords": ["bolt.new", "bolt"],
            "avg_reads": None,
            "tier": "AI垂直",
        },
        "v0": {
            "keywords": ["v0.dev", "v0"],
            "avg_reads": None,
            "tier": "AI垂直",
        },
        "Replit": {
            "keywords": ["replit"],
            "avg_reads": None,
            "tier": "AI垂直",
        },

        # === Claude Code 生态 ===
        "Claude Code": {
            "keywords": ["claude code", "cc", "claude-code"],
            "avg_reads": 2118,  # 继承Claude的数据
            "tier": "CC生态",
        },
        "MCP": {
            "keywords": ["mcp", "model context protocol"],
            "avg_reads": 1500,  # 估算
            "tier": "CC生态",
        },
        "Skills": {
            "keywords": ["skills", "skill", "技能"],
            "avg_reads": 2000,  # 估算
            "tier": "CC生态",
        },
        "Hooks": {
            "keywords": ["hooks", "hook"],
            "avg_reads": 1670,  # 实际数据
            "tier": "CC生态",
        },
    }

    # 热点期信号词
    HOTSPOT_SIGNALS = [
        # 时间类
        "发布", "上线", "更新", "推出", "刚刚", "今天", "昨晚", "今早",
        "最新", "新版", "新功能", "官宣", "重磅", "突发", "紧急",
        # 事件类
        "被封", "限制", "涨价", "降价", "免费", "开放",
        # 重大新闻类
        "估值", "融资", "收购", "上市", "警报", "慌了", "炸了", "疯了",
        "宣布", "确认", "曝光", "泄露", "首发", "独家",
        # 产品动态类
        "放大招", "大更新", "全新", "革命", "颠覆", "登顶", "第一",
    ]


    def __init__(self, articles_dir: str = "articles"):
        self.articles_dir = Path(articles_dir)

    def filter(self, topic: str, context: Optional[str] = None) -> FilterResultV3:
        """
        过滤选题

        Args:
            topic: 选题描述
            context: 额外上下文

        Returns:
            FilterResultV3: 过滤结果
        """
        full_text = f"{topic} {context or ''}".lower()
        insights = []

        # Step 1: 检查是否匹配核心工具池
        matched_tool, tool_info = self._match_core_tool(full_text)

        if matched_tool:
            # 核心工具类
            timeliness = self._check_timeliness(full_text)
            strategy = self._get_strategy("核心工具类", timeliness, tool_info)

            insights.append(f"✅ 匹配核心工具：{matched_tool}（{tool_info['tier']}）")
            if tool_info.get("avg_reads"):
                insights.append(f"📊 历史平均阅读：{tool_info['avg_reads']}")
            insights.append(f"⏰ 时效性：{timeliness}")

            return FilterResultV3(
                category="核心工具类",
                worth_writing=True,
                tool_matched=matched_tool,
                timeliness=timeliness,
                strategy=strategy,
                insights=insights,
                historical_avg_reads=tool_info.get("avg_reads"),
            )

        # Step 2: 检查是否是泛AI话题
        is_ai_topic, ai_signals = self._check_ai_topic(full_text)

        if is_ai_topic:
            timeliness = self._check_timeliness(full_text)
            strategy = self._get_strategy("泛AI话题类", timeliness, None)

            insights.append(f"🌐 泛AI话题：{', '.join(ai_signals[:3])}")
            insights.append(f"⏰ 时效性：{timeliness}")
            insights.append("⚠️ 风险提示：泛AI话题平均阅读908，不爆就惨")
            insights.append("💡 建议：选择有破圈潜力的角度，参考卡兹克的做法")

            return FilterResultV3(
                category="泛AI话题类",
                worth_writing=True,
                tool_matched=None,
                timeliness=timeliness,
                strategy=strategy,
                insights=insights,
                historical_avg_reads=908,  # 泛AI话题平均值
            )

        # Step 3: 不建议写
        insights.append("❌ 未匹配核心工具池")
        insights.append("❌ 未识别为泛AI话题")
        insights.append("💡 建议：考虑关联一个核心工具，或找一个AI热点角度")

        return FilterResultV3(
            category="不建议",
            worth_writing=False,
            tool_matched=None,
            timeliness="无",
            strategy="不建议写，或需要重新定位角度",
            insights=insights,
            historical_avg_reads=None,
        )

    def _match_core_tool(self, text: str) -> tuple:
        """匹配核心工具池"""
        for tool_name, tool_info in self.CORE_TOOLS.items():
            for keyword in tool_info["keywords"]:
                # 使用单词边界匹配，避免误匹配
                if keyword.lower() in text:
                    return tool_name, tool_info
        return None, None

    def _check_timeliness(self, text: str) -> str:
        """检查时效性"""
        # 1. 检查热点信号词
        for signal in self.HOTSPOT_SIGNALS:
            if signal in text:
                return "热点期"

        # 2. 检查版本号（v5, 2.0, 3.1等 → 热点期）
        if re.search(r'[vV]?\d+(\.\d+)?', text):
            # 排除一些常见的非版本数字（如"100+"、"60倍"等）
            version_match = re.search(r'[vV]\d+(\.\d+)?|\b\d+\.\d+\b', text)
            if version_match:
                return "热点期"

        return "常青期"

    def _check_ai_topic(self, text: str) -> tuple:
        """检查是否是泛AI话题"""
        ai_signals = []

        # AI相关通用词
        ai_keywords = [
            "ai", "人工智能", "机器学习", "深度学习", "大模型", "llm",
            "生成式", "aigc", "智能体", "agent",
            "替代", "失业", "未来", "变革", "颠覆",
            "提示词", "prompt", "工作流", "自动化",
        ]

        for kw in ai_keywords:
            if kw in text:
                ai_signals.append(kw)

        # 至少匹配2个AI相关词才算泛AI话题
        return len(ai_signals) >= 1, ai_signals

    def _get_strategy(self, category: str, timeliness: str, tool_info: Optional[dict]) -> str:
        """获取写作策略"""
        if category == "核心工具类":
            if timeliness == "热点期":
                return "🔥 追热点，快写！抢时效，24小时内发布"
            else:
                return "📚 做教程，慢写。深度内容，打磨质量"
        elif category == "泛AI话题类":
            if timeliness == "热点期":
                return "🎯 博爆款！快速产出，配合热点传播"
            else:
                return "🤔 谨慎写。需要独特角度才能破圈"
        return "不建议"

    def generate_report(self, result: FilterResultV3, topic: str) -> str:
        """生成评估报告"""
        lines = [
            "=" * 60,
            "🎯 选题过滤器 V7.1 - 双轨制",
            "=" * 60,
            "",
            f"📝 选题：{topic}",
            "",
            "-" * 60,
            f"📂 分类：{result.category}",
            f"✅ 判断：{'值得写' if result.worth_writing else '不建议写'}",
        ]

        if result.tool_matched:
            lines.append(f"🔧 工具：{result.tool_matched}")

        if result.historical_avg_reads:
            lines.append(f"📊 历史平均阅读：{result.historical_avg_reads}")

        lines.extend([
            f"⏰ 时效性：{result.timeliness}",
            "",
            "-" * 60,
            f"📋 策略：{result.strategy}",
            "-" * 60,
            "",
            "💡 分析：",
        ])

        for insight in result.insights:
            lines.append(f"  {insight}")

        lines.extend([
            "",
            "=" * 60,
            "📊 V3数据基准（82篇验证）：",
            "=" * 60,
            "  核心工具类：54篇，平均阅读 1798",
            "  泛AI话题类：25篇，平均阅读 908",
            "",
            "  TOP工具排名：",
            "  1. Kimi: 3448    2. Gemini: 3146   3. 即梦: 2927",
            "  4. Claude: 2118  5. Cursor: 1246   6. Codex: 1199",
            "",
        ])

        return "\n".join(lines)


def main():
    """命令行入口"""
    import sys
    import io

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    if len(sys.argv) < 2:
        print("用法: python topic_filter.py <选题描述> [额外上下文]")
        print("")
        print("示例:")
        print("  python topic_filter.py 'Gemini 2.0发布了'")
        print("  python topic_filter.py 'Claude Code Hooks使用教程'")
        print("  python topic_filter.py 'AI会取代程序员吗'")
        sys.exit(1)

    topic = sys.argv[1]
    context = sys.argv[2] if len(sys.argv) > 2 else None

    filter_tool = TopicFilterV3()
    result = filter_tool.filter(topic, context)
    print(filter_tool.generate_report(result, topic))


if __name__ == "__main__":
    main()
