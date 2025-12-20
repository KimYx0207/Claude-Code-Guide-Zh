# -*- coding: utf-8 -*-
"""
生态项目过滤器 V9.0 - 配置驱动版
过滤GitHub项目是否属于核心工具生态（Layer1/Layer2）
"""

import sys
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

# 添加config目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent.parent))
from config.loader import load_config


@dataclass
class EcosystemFilterResult:
    """生态过滤结果"""
    is_ecosystem: bool  # 是否属于核心工具生态
    layer: str  # "layer1" / "layer2" / "layer3" / "rejected"
    related_tool: Optional[str]  # 关联的核心工具
    category: Optional[str]  # MCP服务器/IDE插件/CLI工具等
    confidence: float  # 置信度 0-1
    reasons: List[str]  # 判断理由
    avg_reads_estimate: int  # 预估阅读量


class EcosystemFilter:
    """GitHub项目生态过滤器"""

    def __init__(self):
        """初始化：从配置加载"""
        self.tools_config = load_config('core_tools_pool')

        # 加载Layer1核心工具
        self.layer1_tools = self.tools_config.get('layer1_official', {}).get('tools', {})

        # 加载Layer2生态规则
        layer2 = self.tools_config.get('layer2_ecosystem', {})
        self.ecosystem_categories = layer2.get('categories', {})
        self.github_filter_rules = layer2.get('github_filter_rules', {})

        # 构建关键词集合
        self._build_keyword_sets()

    def _build_keyword_sets(self):
        """构建关键词集合用于快速匹配"""
        # 核心工具关键词
        self.tool_keywords = {}
        for tool_name, tool_info in self.layer1_tools.items():
            keywords = tool_info.get('keywords', [])
            prefixes = tool_info.get('ecosystem_prefix', [])
            self.tool_keywords[tool_name] = {
                'keywords': [k.lower() for k in keywords],
                'prefixes': [p.lower() for p in prefixes],
                'tier': tool_info.get('tier', 'B'),
                'avg_reads': tool_info.get('avg_reads', 1000)
            }

        # 必须包含的关键词（来自配置）
        self.must_contain = [
            k.lower() for k in
            self.github_filter_rules.get('must_contain_any', [])
        ]

        # 排除关键词
        self.exclude_keywords = [
            k.lower() for k in
            self.github_filter_rules.get('exclude_keywords', [])
        ]

        # 生态类别关键词
        self.category_keywords = {}
        for cat_name, cat_info in self.ecosystem_categories.items():
            self.category_keywords[cat_name] = {
                'keywords': [k.lower() for k in cat_info.get('keywords', [])],
                'related_tools': cat_info.get('related_tools', []),
                'avg_reads': cat_info.get('avg_reads', 1400)
            }

    def filter(self, project_name: str, description: str = "",
               stars: int = 0, language: str = "") -> EcosystemFilterResult:
        """
        过滤GitHub项目

        Args:
            project_name: 项目名称
            description: 项目描述
            stars: Star数量
            language: 编程语言

        Returns:
            EcosystemFilterResult: 过滤结果
        """
        full_text = f"{project_name} {description}".lower()
        reasons = []

        # Step 1: 检查排除条件
        for exclude in self.exclude_keywords:
            if exclude in full_text:
                return EcosystemFilterResult(
                    is_ecosystem=False,
                    layer="rejected",
                    related_tool=None,
                    category=None,
                    confidence=0.9,
                    reasons=[f"包含排除关键词: {exclude}"],
                    avg_reads_estimate=500
                )

        # Step 2: 检查最低Star要求
        min_stars = self.github_filter_rules.get('min_stars', 50)
        if stars > 0 and stars < min_stars:
            return EcosystemFilterResult(
                is_ecosystem=False,
                layer="rejected",
                related_tool=None,
                category=None,
                confidence=0.8,
                reasons=[f"Star数不足: {stars} < {min_stars}"],
                avg_reads_estimate=500
            )

        # Step 3: 匹配核心工具
        matched_tool, tool_info = self._match_tool(full_text)

        if matched_tool:
            # 找到关联的核心工具
            category = self._match_category(full_text)

            if tool_info['tier'] in ['S', 'A']:
                # S/A级工具的生态项目 = Layer2
                reasons.append(f"关联{tool_info['tier']}级核心工具: {matched_tool}")
                if category:
                    reasons.append(f"生态类别: {category}")

                avg_reads = tool_info['avg_reads']
                if category and category in self.ecosystem_categories:
                    avg_reads = self.ecosystem_categories[category].get('avg_reads', avg_reads)

                return EcosystemFilterResult(
                    is_ecosystem=True,
                    layer="layer2",
                    related_tool=matched_tool,
                    category=category,
                    confidence=0.85,
                    reasons=reasons,
                    avg_reads_estimate=avg_reads
                )
            else:
                # B级工具的生态项目，置信度较低
                reasons.append(f"关联B级工具: {matched_tool}")
                return EcosystemFilterResult(
                    is_ecosystem=True,
                    layer="layer2",
                    related_tool=matched_tool,
                    category=category,
                    confidence=0.6,
                    reasons=reasons,
                    avg_reads_estimate=1200
                )

        # Step 4: 检查是否包含必须关键词（但未匹配具体工具）
        matched_must = []
        for kw in self.must_contain:
            if kw in full_text:
                matched_must.append(kw)

        if matched_must:
            # 包含AI/LLM等通用关键词，但未关联具体工具 = Layer3
            reasons.append(f"包含AI相关关键词: {', '.join(matched_must[:3])}")
            reasons.append("未关联具体核心工具，风险较高")

            return EcosystemFilterResult(
                is_ecosystem=False,  # 不算生态项目
                layer="layer3",
                related_tool=None,
                category=None,
                confidence=0.5,
                reasons=reasons,
                avg_reads_estimate=908
            )

        # Step 5: 完全不相关
        return EcosystemFilterResult(
            is_ecosystem=False,
            layer="rejected",
            related_tool=None,
            category=None,
            confidence=0.9,
            reasons=["与核心工具生态无关"],
            avg_reads_estimate=500
        )

    def _match_tool(self, text: str) -> Tuple[Optional[str], Optional[dict]]:
        """匹配核心工具"""
        for tool_name, info in self.tool_keywords.items():
            # 检查关键词
            for kw in info['keywords']:
                if kw in text:
                    return tool_name, info
            # 检查前缀
            for prefix in info['prefixes']:
                if prefix in text:
                    return tool_name, info
        return None, None

    def _match_category(self, text: str) -> Optional[str]:
        """匹配生态类别"""
        for cat_name, cat_info in self.category_keywords.items():
            for kw in cat_info['keywords']:
                if kw in text:
                    return cat_name
        return None

    def generate_report(self, result: EcosystemFilterResult,
                       project_name: str) -> str:
        """生成评估报告"""
        lines = [
            "=" * 60,
            "🔍 GitHub生态项目过滤器 V1.0",
            "=" * 60,
            "",
            f"📦 项目：{project_name}",
            "",
            "-" * 60,
        ]

        if result.is_ecosystem:
            lines.append(f"✅ 判断：属于核心工具生态")
            lines.append(f"🏷️ Layer：{result.layer.upper()}")
            if result.related_tool:
                lines.append(f"🔧 关联工具：{result.related_tool}")
            if result.category:
                lines.append(f"📂 类别：{result.category}")
        else:
            lines.append(f"❌ 判断：不属于核心工具生态")
            lines.append(f"🏷️ Layer：{result.layer.upper()}")

        lines.extend([
            f"📊 预估阅读：{result.avg_reads_estimate}",
            f"🎯 置信度：{result.confidence:.0%}",
            "",
            "-" * 60,
            "💡 判断理由：",
        ])

        for reason in result.reasons:
            lines.append(f"  • {reason}")

        lines.extend([
            "",
            "=" * 60,
            "📋 写作建议：",
        ])

        if result.layer == "layer2" and result.is_ecosystem:
            lines.append("  ✅ 推荐写！核心工具生态项目，平均阅读1450+")
            lines.append(f"  💡 角度：介绍如何配合{result.related_tool}使用")
        elif result.layer == "layer3":
            lines.append("  ⚠️ 谨慎写！泛AI项目，平均阅读908")
            lines.append("  💡 需要找独特角度，否则风险高")
        else:
            lines.append("  ❌ 不推荐！与核心工具无关")

        lines.append("")

        return "\n".join(lines)


def main():
    """命令行入口"""
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    if len(sys.argv) < 2:
        print("用法: python ecosystem_filter.py <项目名> [描述] [stars]")
        print("")
        print("示例:")
        print("  python ecosystem_filter.py 'browsertools-mcp' 'MCP server for browser automation' 1200")
        print("  python ecosystem_filter.py 'cursor-pro' 'Cursor enhancement plugin'")
        print("  python ecosystem_filter.py 'random-ai-project' 'Some AI project'")
        sys.exit(1)

    project_name = sys.argv[1]
    description = sys.argv[2] if len(sys.argv) > 2 else ""
    stars = int(sys.argv[3]) if len(sys.argv) > 3 else 0

    filter_tool = EcosystemFilter()
    result = filter_tool.filter(project_name, description, stars)
    print(filter_tool.generate_report(result, project_name))


if __name__ == "__main__":
    main()
