# -*- coding: utf-8 -*-
"""
选题过滤器 V9.0 - 三层架构版
优先级公式：priority = layer_score × timeliness × type_weight × brand_tier ÷ risk
"""

import sys
import re
from pathlib import Path
from typing import Dict, List, Optional, Set
from dataclasses import dataclass, field
from datetime import datetime

# 添加config目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent.parent))
from config.loader import load_config


@dataclass
class TopicType:
    """选题类型"""
    name: str
    weight: float
    keywords: List[str]


@dataclass
class FilterResultV8:
    """V8过滤结果 - 三层架构版"""
    # 基础信息
    layer: str  # "layer1" / "layer2" / "layer3" / "rejected"
    worth_writing: bool
    priority_score: float  # 优先级分数

    # 工具/品牌信息
    tool_matched: Optional[str]
    tool_tier: Optional[str]  # S/A/B
    avg_reads_estimate: int

    # 分类信息（可多选）
    topic_types: List[str]  # ["热点型", "教程型"] 等
    timeliness: str  # "紧急热点" / "近期更新" / "常青内容"
    risk_level: str  # "low" / "medium" / "high"

    # 策略建议
    strategy: str
    deadline_hint: str  # "24小时内" / "72小时内" / "可打磨"

    # 分析明细
    insights: List[str]
    score_breakdown: Dict[str, float]  # 分数拆解


class TopicFilterV8:
    """选题过滤器 V8.0 - 三层架构+多类型+优先级公式"""

    def __init__(self):
        """初始化：从配置加载"""
        # 加载配置
        self.tools_config = load_config('core_tools_pool')
        self.quality_config = load_config('quality_config')
        self.brands_config = load_config('brands_config')

        # 解析配置
        self._load_layer1_tools()
        self._load_layer2_ecosystem()
        self._load_topic_types()
        self._load_timeliness_rules()
        self._load_priority_formula()

    def _load_layer1_tools(self):
        """加载Layer1核心工具"""
        layer1 = self.tools_config.get('layer1_official', {}).get('tools', {})
        self.layer1_tools = {}
        for name, info in layer1.items():
            self.layer1_tools[name] = {
                'keywords': [k.lower() for k in info.get('keywords', [name.lower()])],
                'tier': info.get('tier', 'B'),
                'avg_reads': info.get('avg_reads', 1000)
            }

    def _load_layer2_ecosystem(self):
        """加载Layer2生态关键词"""
        layer2 = self.tools_config.get('layer2_ecosystem', {})
        self.ecosystem_keywords = []
        rules = layer2.get('github_filter_rules', {})
        self.ecosystem_keywords = [k.lower() for k in rules.get('must_contain_any', [])]

        self.ecosystem_categories = layer2.get('categories', {})

    def _load_topic_types(self):
        """加载选题类型"""
        types_config = self.tools_config.get('topic_types', {}).get('types', {})
        self.topic_types = {}
        for name, info in types_config.items():
            self.topic_types[name] = TopicType(
                name=name,
                weight=info.get('weight', 1.0),
                keywords=[k.lower() for k in info.get('keywords', [])]
            )

        # 默认类型（如果配置为空）
        if not self.topic_types:
            self.topic_types = {
                "热点型": TopicType("热点型", 1.6, ["发布", "更新", "官宣", "首发"]),
                "工具型": TopicType("工具型", 1.5, ["神器", "工具", "插件", "扩展", "mcp"]),
                "教程型": TopicType("教程型", 1.4, ["手把手", "教你", "教程", "入门", "指南"]),
                "羊毛型": TopicType("羊毛型", 1.3, ["免费", "白嫖", "薅羊毛", "省钱"]),
                "痛点型": TopicType("痛点型", 1.4, ["解决", "报错", "问题", "修复", "避坑"]),
                "测评型": TopicType("测评型", 1.2, ["测评", "对比", "实测", "体验"]),
            }

    def _load_timeliness_rules(self):
        """加载时效性规则"""
        rules = self.tools_config.get('timeliness_rules', {})
        hot_signals = rules.get('hot_signals', {})

        self.immediate_keywords = hot_signals.get('immediate', {}).get('keywords', [
            "刚刚", "今天", "发布", "上线", "官宣", "breaking"
        ])
        self.immediate_boost = hot_signals.get('immediate', {}).get('priority_boost', 2.0)

        self.recent_keywords = hot_signals.get('recent', {}).get('keywords', [
            "最新", "更新", "新版", "升级"
        ])
        self.recent_boost = hot_signals.get('recent', {}).get('priority_boost', 1.5)

        self.evergreen_keywords = rules.get('evergreen', {}).get('keywords', [
            "教程", "入门", "指南", "详解", "原理"
        ])

    def _load_priority_formula(self):
        """加载优先级公式参数"""
        formula = self.tools_config.get('priority_formula', {})

        self.layer_scores = formula.get('layer_scores', {
            "layer1": 100,
            "layer2": 75,
            "layer3": 40
        })

        self.brand_tiers = formula.get('brand_tiers', {
            "S": 1.5,
            "A": 1.2,
            "B": 1.0,
            "none": 0.7
        })

        self.risk_factors = formula.get('risk_factors', {
            "low": 1.0,
            "medium": 1.3,
            "high": 1.8
        })

    def filter(self, topic: str, context: Optional[str] = None) -> FilterResultV8:
        """
        过滤选题

        Args:
            topic: 选题描述
            context: 额外上下文

        Returns:
            FilterResultV8: 过滤结果
        """
        full_text = f"{topic} {context or ''}".lower()
        insights = []
        score_breakdown = {}

        # Step 1: 判断Layer层级
        layer, tool_matched, tool_info = self._determine_layer(full_text)
        score_breakdown['layer_base'] = self.layer_scores.get(layer, 40)

        # Step 2: 判断选题类型（可多选）
        matched_types = self._match_topic_types(full_text)
        type_weight = 1.0
        for t in matched_types:
            type_weight *= self.topic_types[t].weight
        # 限制最大权重
        type_weight = min(type_weight, 3.0)
        score_breakdown['type_weight'] = type_weight

        # Step 3: 判断时效性
        timeliness, timeliness_boost = self._check_timeliness(full_text)
        score_breakdown['timeliness_boost'] = timeliness_boost

        # Step 4: 判断品牌加成
        brand_tier = tool_info.get('tier', 'none') if tool_info else 'none'
        brand_boost = self.brand_tiers.get(brand_tier, 0.7)
        score_breakdown['brand_boost'] = brand_boost

        # Step 5: 判断风险系数
        risk_level = self._assess_risk(layer, tool_matched)
        risk_factor = self.risk_factors.get(risk_level, 1.0)
        score_breakdown['risk_factor'] = risk_factor

        # Step 6: 计算优先级分数
        priority_score = (
            score_breakdown['layer_base'] *
            score_breakdown['timeliness_boost'] *
            score_breakdown['type_weight'] *
            score_breakdown['brand_boost']
        ) / score_breakdown['risk_factor']
        priority_score = round(priority_score, 1)

        # Step 7: 生成分析
        insights = self._generate_insights(
            layer, tool_matched, tool_info, matched_types,
            timeliness, risk_level, priority_score
        )

        # Step 8: 生成策略建议
        strategy, deadline = self._generate_strategy(
            layer, timeliness, priority_score, matched_types
        )

        # 预估阅读量
        avg_reads = self._estimate_reads(layer, tool_info, priority_score)

        return FilterResultV8(
            layer=layer,
            worth_writing=priority_score >= 40,
            priority_score=priority_score,
            tool_matched=tool_matched,
            tool_tier=brand_tier if brand_tier != 'none' else None,
            avg_reads_estimate=avg_reads,
            topic_types=matched_types,
            timeliness=timeliness,
            risk_level=risk_level,
            strategy=strategy,
            deadline_hint=deadline,
            insights=insights,
            score_breakdown=score_breakdown
        )

    def _determine_layer(self, text: str) -> tuple:
        """判断Layer层级"""
        # 检查Layer1：核心工具官方
        for tool_name, info in self.layer1_tools.items():
            for kw in info['keywords']:
                if kw in text:
                    return "layer1", tool_name, info

        # 检查Layer2：核心工具生态
        for kw in self.ecosystem_keywords:
            if kw in text:
                # 找到关联的核心工具
                for tool_name, info in self.layer1_tools.items():
                    for tool_kw in info['keywords']:
                        if tool_kw in text:
                            return "layer2", tool_name, info
                # 有生态关键词但未匹配具体工具
                return "layer2", None, None

        # 检查Layer3：泛AI话题
        ai_keywords = ["ai", "人工智能", "大模型", "llm", "agent", "智能体",
                       "机器学习", "深度学习", "生成式", "aigc"]
        for kw in ai_keywords:
            if kw in text:
                return "layer3", None, None

        # 不相关
        return "rejected", None, None

    def _match_topic_types(self, text: str) -> List[str]:
        """匹配选题类型（可多选）"""
        matched = []
        for type_name, type_info in self.topic_types.items():
            for kw in type_info.keywords:
                if kw in text:
                    matched.append(type_name)
                    break
        return matched if matched else ["通用型"]

    def _check_timeliness(self, text: str) -> tuple:
        """检查时效性"""
        # 紧急热点
        for kw in self.immediate_keywords:
            if kw in text:
                return "紧急热点", self.immediate_boost

        # 近期更新
        for kw in self.recent_keywords:
            if kw in text:
                return "近期更新", self.recent_boost

        # 版本号检测
        if re.search(r'[vV]\d+(\.\d+)?|\b\d+\.\d+\b', text):
            return "近期更新", self.recent_boost

        # 常青内容
        return "常青内容", 1.0

    def _assess_risk(self, layer: str, tool_matched: Optional[str]) -> str:
        """评估风险等级"""
        if layer == "layer1" and tool_matched:
            return "low"
        elif layer == "layer2":
            return "medium" if tool_matched else "high"
        elif layer == "layer3":
            return "high"
        return "high"

    def _estimate_reads(self, layer: str, tool_info: Optional[dict],
                        priority_score: float) -> int:
        """预估阅读量"""
        base_reads = {
            "layer1": 2200,
            "layer2": 1450,
            "layer3": 908,
            "rejected": 500
        }
        base = base_reads.get(layer, 500)

        if tool_info and tool_info.get('avg_reads'):
            base = tool_info['avg_reads']

        # 根据优先级分数调整
        if priority_score > 200:
            return int(base * 1.3)
        elif priority_score > 100:
            return int(base * 1.1)
        return base

    def _generate_insights(self, layer, tool, tool_info, types,
                          timeliness, risk, score) -> List[str]:
        """生成分析洞察"""
        insights = []

        # Layer信息
        layer_names = {
            "layer1": "核心工具官方",
            "layer2": "核心工具生态",
            "layer3": "泛AI话题",
            "rejected": "不相关"
        }
        insights.append(f"🏷️ Layer: {layer.upper()} ({layer_names.get(layer, '未知')})")

        # 工具信息
        if tool:
            tier = tool_info.get('tier', 'B') if tool_info else 'B'
            insights.append(f"🔧 关联工具: {tool} ({tier}级)")
            if tool_info and tool_info.get('avg_reads'):
                insights.append(f"📊 历史平均阅读: {tool_info['avg_reads']}")

        # 类型信息
        if types and types != ["通用型"]:
            type_icons = {
                "热点型": "🔥", "工具型": "🛠️", "教程型": "📚",
                "羊毛型": "💸", "痛点型": "🔧", "测评型": "📊"
            }
            type_str = " + ".join([f"{type_icons.get(t, '📌')}{t}" for t in types])
            insights.append(f"📂 类型: {type_str}")

        # 时效性
        time_icons = {"紧急热点": "🔴", "近期更新": "🟡", "常青内容": "🟢"}
        insights.append(f"⏰ 时效: {time_icons.get(timeliness, '⚪')}{timeliness}")

        # 风险
        risk_icons = {"low": "✅低风险", "medium": "⚠️中风险", "high": "🚨高风险"}
        insights.append(f"⚡ 风险: {risk_icons.get(risk, '未知')}")

        # 优先级评判
        if score >= 200:
            insights.append(f"🎯 优先级: {score}分 → 强烈推荐！")
        elif score >= 100:
            insights.append(f"🎯 优先级: {score}分 → 推荐")
        elif score >= 40:
            insights.append(f"🎯 优先级: {score}分 → 可写（需要角度）")
        else:
            insights.append(f"🎯 优先级: {score}分 → 不推荐")

        return insights

    def _generate_strategy(self, layer, timeliness, score, types) -> tuple:
        """生成策略建议"""
        if score >= 200:
            if timeliness == "紧急热点":
                return "🔥 抢首发！紧急追热点，快速产出", "24小时内"
            else:
                return "✅ 重点推荐！高优先级选题", "48小时内"

        elif score >= 100:
            if "教程型" in types:
                return "📚 做深度教程，打磨质量", "可打磨"
            elif timeliness == "紧急热点":
                return "⚡ 追热点，快速产出", "24小时内"
            else:
                return "👍 值得写，找好角度", "72小时内"

        elif score >= 40:
            if layer == "layer3":
                return "🤔 谨慎写，需要独特角度才能破圈", "可打磨"
            else:
                return "📝 可以写，但优先级不高", "可打磨"

        else:
            return "❌ 不建议写，与核心工具无关，风险过高", "不建议"

    def generate_report(self, result: FilterResultV8, topic: str) -> str:
        """生成评估报告"""
        lines = [
            "╔" + "═" * 58 + "╗",
            "║" + "🎯 选题过滤器 V8.0 - 三层架构版".center(50) + "║",
            "╚" + "═" * 58 + "╝",
            "",
            f"📝 选题：{topic}",
            "",
            "─" * 60,
        ]

        # 核心判断
        if result.worth_writing:
            lines.append(f"✅ 判断：值得写（{result.priority_score}分）")
        else:
            lines.append(f"❌ 判断：不建议（{result.priority_score}分）")

        lines.append("")

        # 分析明细
        lines.append("📊 分析明细：")
        for insight in result.insights:
            lines.append(f"  {insight}")

        lines.extend([
            "",
            "─" * 60,
            f"📋 策略：{result.strategy}",
            f"⏰ 时间：{result.deadline_hint}",
            f"📈 预估阅读：{result.avg_reads_estimate}",
            "",
            "─" * 60,
        ])

        # 分数拆解
        lines.append("🔢 分数拆解：")
        bd = result.score_breakdown
        lines.append(f"  Layer基础分: {bd.get('layer_base', 0)}")
        lines.append(f"  × 时效性加成: {bd.get('timeliness_boost', 1.0)}")
        lines.append(f"  × 类型权重: {bd.get('type_weight', 1.0):.2f}")
        lines.append(f"  × 品牌加成: {bd.get('brand_boost', 1.0)}")
        lines.append(f"  ÷ 风险系数: {bd.get('risk_factor', 1.0)}")
        lines.append(f"  ────────────")
        lines.append(f"  = 最终分: {result.priority_score}")

        lines.extend([
            "",
            "═" * 60,
            "📊 V8数据基准（82篇验证）：",
            "═" * 60,
            "  Layer1（核心工具官方）：平均阅读 2200，爆款率 71%",
            "  Layer2（核心工具生态）：平均阅读 1450，爆款率 24%",
            "  Layer3（泛AI话题）：平均阅读 908，爆款率 5%",
            "",
            "  优先级阈值：>200强推 | >100推荐 | >40可写 | <40不推荐",
            "",
        ])

        return "\n".join(lines)


def main():
    """命令行入口"""
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    if len(sys.argv) < 2:
        print("用法: python topic_filter.py <选题描述> [额外上下文]")
        print("")
        print("示例:")
        print("  python topic_filter.py 'Claude Code 2.1发布了'")
        print("  python topic_filter.py 'Cursor最新MCP插件教程'")
        print("  python topic_filter.py 'AI会取代程序员吗'")
        print("  python topic_filter.py 'browsertools-mcp神器推荐'")
        sys.exit(1)

    topic = sys.argv[1]
    context = sys.argv[2] if len(sys.argv) > 2 else None

    filter_tool = TopicFilterV8()
    result = filter_tool.filter(topic, context)
    print(filter_tool.generate_report(result, topic))


if __name__ == "__main__":
    main()
