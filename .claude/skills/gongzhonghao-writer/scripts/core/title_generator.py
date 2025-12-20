# -*- coding: utf-8 -*-
"""
爆款标题生成器 V9.0 - 配置驱动版
从formulas_config.json动态读取爆款规律
"""

import re
import sys
import random
from typing import List, Dict, Optional
from dataclasses import dataclass
from pathlib import Path

# 添加config目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent.parent))
from config.loader import load_config as _load_config


def load_config():
    """从配置中心加载爆款规律（动态读取，不硬编码）"""
    try:
        return _load_config('formulas_config')
    except FileNotFoundError:
        print(f"⚠️ 配置文件不存在，使用默认配置")
        return get_default_config()
    except Exception as e:
        print(f"⚠️ 配置加载失败：{e}，使用默认配置")
        return get_default_config()


def get_default_config():
    """默认配置（兜底方案）"""
    return {
        "formulas": {
            "top_formulas": [
                {"name": "品牌+白嫖", "rank": 1, "templates": ["[品牌]免费用，老金教你白嫖"]},
                {"name": "老金+神器", "rank": 2, "templates": ["老金用[工具]才知道，少了这个神器"]},
                {"name": "手把手+教程", "rank": 3, "templates": ["手把手教你[操作]"]}
            ]
        },
        "keywords": {
            "must_include": [
                {"keyword": "品牌词", "examples": ["Claude", "Gemini", "Cursor"]},
                {"keyword": "教程词", "examples": ["手把手", "教程"]},
                {"keyword": "效果词", "examples": ["神器", "白嫖"]}
            ]
        }
    }


# 加载配置（全局变量，启动时加载一次）
CONFIG = load_config()


@dataclass
class TitleFormula:
    """标题公式"""
    name: str
    pattern: str
    example: str
    suitable_for: List[str]  # 适用场景


class TitleGenerator:
    """爆款标题生成器"""

    # V8.0：从配置加载，不再硬编码
    def __init__(self):
        """初始化：从配置加载爆款公式"""
        self.config = CONFIG
        self.formulas = self._load_formulas_from_config()
        self.brand_words = self._load_brand_words_from_config()

    def _load_formulas_from_config(self) -> List[TitleFormula]:
        """从配置加载公式模板"""
        formulas = []

        for formula_data in self.config.get('formulas', {}).get('top_formulas', []):
            name = formula_data.get('name', '')
            templates = formula_data.get('templates', [])

            if templates:
                formulas.append(TitleFormula(
                    name=name,
                    pattern=templates[0],  # 使用第一个模板
                    example=formula_data.get('examples', [templates[0]])[0] if formula_data.get('examples') else templates[0],
                    suitable_for=["通用"]  # 简化处理
                ))

        return formulas if formulas else self._get_default_formulas()

    def _get_default_formulas(self) -> List[TitleFormula]:
        """默认公式（兜底）"""
        return [
            TitleFormula(
                name="老金+神器",
                pattern="老金用{brand}才知道，原来一直少了这个神器",
                example="老金用Claude写代码才知道，原来一直少装了这个神器",
                suitable_for=["工具推荐"]
            ),
            TitleFormula(
                name="手把手+教程",
                pattern="手把手教你用{brand}，{effect}",
                example="手把手教你用Claude Code，10分钟搞定AI编程",
                suitable_for=["教程"]
            )
        ]

    def _load_brand_words_from_config(self) -> List[str]:
        """从配置加载品牌词"""
        keywords = self.config.get('keywords', {}).get('must_include', [])

        brands = []
        for kw in keywords:
            if kw.get('keyword') == '品牌词':
                brands = kw.get('examples', [])
                break

        # 扩展品牌词库（保留常用的）
        if not brands:
            brands = ["Claude", "Cursor", "Gemini", "GPT"]

        # 补充完整品牌词库
        extended_brands = brands + [
            "ChatGPT", "Google", "OpenAI", "Anthropic",
            "DeepSeek", "Kimi", "Coze", "MiniMax",
            "Copilot", "Windsurf", "v0", "Bolt"
        ]

        return list(set(extended_brands))  # 去重

    # 品牌词库（V8.0：从配置动态加载）
    @property
    def BRAND_WORDS(self):
        return self.brand_words

    # 公式列表（V8.0：从配置动态加载）
    @property
    def FORMULAS(self):
        return self.formulas
    ACTION_WORDS = ["手把手", "教你", "教程", "攻略", "指南", "实战"]

    # 效率词库（爆款+11%）
    SPEED_WORDS = ["一键", "秒", "分钟", "3步", "5分钟", "10分钟"]

    # V7.1更新：情绪词effectiveness=0.32x（负相关），不再作为正向指标
    # 但"神器"属于工具词（effectiveness=1.48x），仍然有效
    TOOL_WORDS = ["神器", "工具", "利器", "插件", "扩展"]  # 工具词有效
    # 以下情绪词仅保留用于检测，不作为推荐
    EMOTION_WORDS_DEPRECATED = ["绝了", "真香", "爆", "牛逼", "炸裂", "惊了", "麻了"]

    def generate(
        self,
        topic: str,
        brand: Optional[str] = None,
        scenario: Optional[str] = None,
        count: int = 5
    ) -> List[Dict]:
        """
        生成爆款标题

        Args:
            topic: 主题/关键词
            brand: 品牌词（可选，会自动检测）
            scenario: 场景类型（问题解决/工具推荐/版本更新等）
            count: 生成数量

        Returns:
            标题列表，每个包含 title, formula, score
        """
        # 自动检测品牌词
        if not brand:
            brand = self._detect_brand(topic)

        # 自动判断场景
        if not scenario:
            scenario = self._detect_scenario(topic)

        titles = []

        # 根据场景筛选合适的公式
        suitable_formulas = [
            f for f in self.FORMULAS
            if any(s in scenario for s in f.suitable_for)
        ] or self.FORMULAS

        # 生成标题
        for i in range(count):
            formula = suitable_formulas[i % len(suitable_formulas)]
            title = self._apply_formula(formula, topic, brand)
            score = self._score_title(title, brand)

            titles.append({
                "title": title,
                "formula": formula.name,
                "score": score,
                "recommended": score >= 70
            })

        # 按分数排序
        titles.sort(key=lambda x: x["score"], reverse=True)

        # 标记推荐
        if titles:
            titles[0]["recommended"] = True

        return titles

    def _detect_brand(self, topic: str) -> Optional[str]:
        """从主题中检测品牌词"""
        topic_lower = topic.lower()
        for brand in self.BRAND_WORDS:
            if brand.lower() in topic_lower:
                return brand
        return None

    def _detect_scenario(self, topic: str) -> str:
        """检测主题场景"""
        topic_lower = topic.lower()

        if any(w in topic_lower for w in ["更新", "版本", "发布", "新功能"]):
            return "版本更新"
        elif any(w in topic_lower for w in ["问题", "报错", "失败", "不能", "怎么"]):
            return "问题解决"
        elif any(w in topic_lower for w in ["免费", "省钱", "白嫖", "额度"]):
            return "羊毛"
        elif any(w in topic_lower for w in ["推荐", "工具", "神器", "插件"]):
            return "工具推荐"
        else:
            return "效率提升"

    def _apply_formula(
        self,
        formula: TitleFormula,
        topic: str,
        brand: Optional[str]
    ) -> str:
        """应用公式生成标题"""

        # V7.1关键：品牌词占35分，必须优先使用真正的品牌词！
        # 如果topic中没有品牌词，随机选一个常用品牌词
        effective_brand = brand
        if not effective_brand:
            # 优先选择S级品牌词（Claude/Cursor/Gemini是最有效的）
            effective_brand = random.choice(["Claude", "Cursor", "Gemini", "Claude Code"])

        # 清理topic中的品牌词，避免重复（如 "Claude省钱" -> "省钱"）
        clean_topic = topic
        if brand:
            clean_topic = topic.replace(brand, "").strip()

        # 准备替换变量
        replacements = {
            "brand": effective_brand,
            "problem": self._extract_problem(topic),
            "solution": self._extract_solution(topic),
            "action": random.choice(["写代码", "搞开发", "做项目", "用AI"]),
            "time": random.choice(["半年", "3个月", "一年", "很久"]),
            "tool": "这个神器",
            "speed": random.choice(self.SPEED_WORDS),
            "effect": self._generate_effect(topic),
            "version": self._extract_version(topic) or "新版",
            "highlight": "亮点和避坑都在了！",
            "method": clean_topic if len(clean_topic) < 20 else clean_topic[:20],
            "benefit": self._generate_benefit(topic),
        }

        # 应用公式
        title = formula.pattern
        for key, value in replacements.items():
            title = title.replace("{" + key + "}", value or "")

        return title

    def _extract_key_noun(self, topic: str) -> str:
        """提取关键名词"""
        # 简单处理：取前10个字符
        return topic[:10] if len(topic) > 10 else topic

    def _extract_problem(self, topic: str) -> str:
        """提取问题描述"""
        problem_patterns = [
            r"(不能|无法|失败|报错|问题|限制)",
            r"(开始|要求|需要|必须)",
        ]
        for pattern in problem_patterns:
            match = re.search(pattern, topic)
            if match:
                return match.group(1)
        return "限制"

    def _extract_solution(self, topic: str) -> str:
        """提取解决方案"""
        return "搞定它" if "怎么" not in topic else "怎么过"

    def _extract_version(self, topic: str) -> Optional[str]:
        """提取版本号"""
        match = re.search(r"(\d+\.?\d*\.?\d*)", topic)
        return match.group(1) if match else None

    def _generate_effect(self, topic: str) -> str:
        """生成效果描述"""
        effects = [
            "效率翻倍",
            "省下一大笔钱",
            "再也不用担心了",
            "彻底解决问题",
            "用起来真香",
        ]
        return random.choice(effects)

    def _generate_benefit(self, topic: str) -> str:
        """生成收益描述"""
        benefits = [
            "每天省下25刀",
            "效率提升10倍",
            "白嫖无限额度",
            "再也不怕限制",
        ]
        return random.choice(benefits)

    def _score_title(self, title: str, brand: Optional[str]) -> int:
        """
        评分标题（0-100分）
        基于爆款规律分析的评分维度
        """
        score = 50  # 基础分

        # 品牌词（+30分，因为爆款占比83% vs 41%）
        if brand and brand.lower() in title.lower():
            score += 30
        elif any(b.lower() in title.lower() for b in self.BRAND_WORDS):
            score += 25

        # 动作词（+15分）
        if any(w in title for w in self.ACTION_WORDS):
            score += 15

        # 效率词（+10分）
        if any(w in title for w in self.SPEED_WORDS):
            score += 10

        # V7.1: 工具词（+10分），替代情绪词
        if any(w in title for w in self.TOOL_WORDS):
            score += 10

        # V7.1: 检测工具推荐公式（+15分额外加成）
        if re.search(r"用.{1,10}(才知道|才发现)", title) or "一直少" in title:
            score += 15  # 工具推荐公式效果5.25x，额外加分

        # V7.1: 长度检查（数据显示>25字效果更好）
        title_len = len(title)
        if title_len > 30:
            score += 5  # 长标题效果好
        elif 25 < title_len <= 30:
            score += 3
        # V7.1: 短标题不再加分（15-25字effectiveness=0.50x）

        # 问号加分（表示解决问题）
        if "？" in title or "?" in title:
            score += 5

        # 数字加分
        if re.search(r"\d+", title):
            score += 5

        return min(100, max(0, score))

    def _calculate_star_rating(self, score: int) -> str:
        """
        将分数转换为1-5星评级

        Args:
            score: 0-100分的评分

        Returns:
            星级字符串，如 "⭐⭐⭐⭐⭐"
        """
        if score >= 90:
            return "⭐⭐⭐⭐⭐"
        elif score >= 80:
            return "⭐⭐⭐⭐"
        elif score >= 70:
            return "⭐⭐⭐"
        elif score >= 60:
            return "⭐⭐"
        else:
            return "⭐"

    def _generate_reason(self, title: str, formula_name: str, score: int, brand: Optional[str]) -> str:
        """
        生成推荐理由

        Args:
            title: 标题内容
            formula_name: 使用的公式名称
            score: 评分
            brand: 品牌词

        Returns:
            推荐理由字符串
        """
        reasons = []

        # 公式优势
        formula_reasons = {
            "工具推荐型": "工具推荐公式效果5.25x，\"用了X时间才知道\"制造真实感+神器推荐激发好奇心",
            "痛点解决型": "痛点共鸣+教程承诺，读者一看就知道能解决自己的问题",
            "效率承诺型": "效率是刚需，\"一键/秒\"等词汇直击用户痛点",
            "版本解读型": "版本更新自带时效性热度，\"实测\"增加可信度",
            "系列IP型": "老金IP加持+邪修法则系列辨识度高，粉丝粘性强",
        }
        if formula_name in formula_reasons:
            reasons.append(formula_reasons[formula_name])

        # 品牌词优势
        if brand:
            s_tier = ["Claude", "Cursor", "Gemini", "GPT", "ChatGPT", "Kimi", "DeepSeek", "可灵", "即梦"]
            if brand in s_tier:
                reasons.append(f"{brand}是S级品牌词，自带流量和搜索热度")
            else:
                reasons.append(f"包含品牌词{brand}，提升搜索可见性")

        # 长度优势
        if len(title) > 30:
            reasons.append("标题超30字，信息量足够吸引点击")
        elif len(title) > 25:
            reasons.append("标题长度适中，兼顾信息量和可读性")

        # 数字优势
        if re.search(r"\d+", title):
            reasons.append("包含具体数字，增强说服力和可信度")

        # 问号优势
        if "？" in title or "?" in title:
            reasons.append("问句式标题引发好奇，提升点击欲望")

        # 工具词优势
        if any(w in title for w in self.TOOL_WORDS):
            reasons.append("\"神器/工具\"等词汇暗示实用价值")

        # 综合评价
        if score >= 90:
            reasons.append("综合评分90+，具备冲百万阅读的潜力！")
        elif score >= 80:
            reasons.append("综合评分80+，是优质爆款标题")

        return "；".join(reasons) if reasons else "符合基本爆款规律"

    def generate_with_reasons(
        self,
        topic: str,
        brand: Optional[str] = None,
        scenario: Optional[str] = None,
        count: int = 5
    ) -> List[Dict]:
        """
        生成爆款标题（包含完整推荐理由）

        V7.2新增方法，供所有写作命令统一调用

        Args:
            topic: 主题/关键词
            brand: 品牌词（可选，会自动检测）
            scenario: 场景类型（问题解决/工具推荐/版本更新等）
            count: 生成数量

        Returns:
            标题列表，每个包含：
            - title: 标题内容
            - formula: 公式名称
            - score: 评分（0-100）
            - star_rating: 星级（1-5星）
            - reason: 推荐理由
            - recommended: 是否推荐
        """
        # 自动检测品牌词
        if not brand:
            brand = self._detect_brand(topic)

        # 自动判断场景
        if not scenario:
            scenario = self._detect_scenario(topic)

        titles = []

        # 根据场景筛选合适的公式
        suitable_formulas = [
            f for f in self.FORMULAS
            if any(s in scenario for s in f.suitable_for)
        ] or self.FORMULAS

        # 生成标题
        for i in range(count):
            formula = suitable_formulas[i % len(suitable_formulas)]
            title = self._apply_formula(formula, topic, brand)
            score = self._score_title(title, brand)
            star_rating = self._calculate_star_rating(score)
            reason = self._generate_reason(title, formula.name, score, brand)

            titles.append({
                "title": title,
                "formula": formula.name,
                "score": score,
                "star_rating": star_rating,
                "reason": reason,
                "recommended": False  # 先全部设为False
            })

        # 按分数排序
        titles.sort(key=lambda x: x["score"], reverse=True)

        # 只标记第一个（分数最高的）为推荐
        if titles:
            titles[0]["recommended"] = True

        return titles

    def generate_full_report(self, titles: List[Dict], topic: str = "") -> str:
        """
        生成完整的标题报告（统一输出格式）

        V7.2新增方法，与/write命令输出格式完全一致
        供所有写作命令统一调用

        Args:
            titles: generate_with_reasons()返回的标题列表
            topic: 原始主题（用于报告标题）

        Returns:
            格式化的报告字符串
        """
        lines = [
            "=" * 60,
            f"📌 爆款标题生成报告" + (f"：{topic}" if topic else ""),
            "=" * 60,
            "",
        ]

        # 找到推荐的标题索引
        recommended_idx = 1
        for i, t in enumerate(titles):
            if t.get("recommended"):
                recommended_idx = i + 1
                break

        for i, t in enumerate(titles, 1):
            rec_mark = " ← 推荐" if t.get("recommended") else ""
            star = t.get("star_rating", "⭐⭐⭐")

            lines.append(f"【推荐标题{i}】{t['title']}{rec_mark}")
            lines.append(f"公式：{t['formula']}")
            lines.append(f"SEO评分：{t['score']}分")
            lines.append(f"爆款指数：{star}")
            lines.append("")

        # 添加推荐理由
        if titles:
            best = titles[0]
            lines.extend([
                "-" * 60,
                f"**老金推荐使用：标题{recommended_idx}**",
                f"推荐理由：{best.get('reason', '综合评分最高')}",
                "-" * 60,
            ])

        # 添加评分说明
        lines.extend([
            "",
            "💡 V7.2评分说明（基于82篇数据验证）：",
            "  - 品牌词(Claude/Cursor/Gemini)：+30分 [1.59x]",
            "  - 动作词(手把手/教你)：+15分 [1.95x]",
            "  - 效率词(一键/秒)：+10分 [1.68x]",
            "  - 工具词(神器/工具)：+10分 [1.48x]",
            "  - 工具推荐公式(用了X才知道)：+15分 [5.25x最强！]",
            "  - 长标题(>30字)：+5分",
            "  - ⚠️ 已删除：情绪词(惊了/麻了) [0.32x负相关]",
            "=" * 60,
        ])

        return "\n".join(lines)

    def generate_report(self, titles: List[Dict]) -> str:
        """生成标题报告"""
        lines = [
            "=" * 60,
            "📌 爆款标题生成报告",
            "=" * 60,
            "",
        ]

        for i, t in enumerate(titles, 1):
            rec = "← 推荐" if t.get("recommended") else ""
            lines.append(f"{i}、{t['title']}")
            lines.append(f"   公式：{t['formula']} | 评分：{t['score']}分 {rec}")
            lines.append("")

        lines.extend([
            "-" * 60,
            "💡 V7.1评分说明（基于82篇数据验证）：",
            "  - 品牌词(Claude/Cursor/Gemini)：+30分 [1.59x]",
            "  - 动作词(手把手/教你)：+15分 [1.95x]",
            "  - 效率词(一键/秒)：+10分 [1.68x]",
            "  - 工具词(神器/工具)：+10分 [1.48x]",
            "  - 工具推荐公式(用了X才知道)：+15分 [5.25x最强！]",
            "  - 长标题(>30字)：+5分",
            "  - ⚠️ 已删除：情绪词(惊了/麻了) [0.32x负相关]",
            "-" * 60,
        ])

        return "\n".join(lines)


def main():
    """命令行入口"""
    import sys

    if len(sys.argv) < 2:
        print("爆款标题生成器 V7.2")
        print("")
        print("用法: python title_generator.py <主题> [品牌词] [数量] [--full]")
        print("")
        print("参数:")
        print("  主题      必需，文章主题关键词")
        print("  品牌词    可选，指定品牌词（如Claude/Cursor）")
        print("  数量      可选，生成标题数量，默认5")
        print("  --full    可选，使用完整报告格式（含推荐理由）")
        print("")
        print("示例:")
        print("  python title_generator.py 'Claude更新了新功能'")
        print("  python title_generator.py 'Claude更新了新功能' Claude 5")
        print("  python title_generator.py 'Claude更新了新功能' Claude 5 --full")
        sys.exit(1)

    topic = sys.argv[1]
    brand = None
    count = 5
    use_full = "--full" in sys.argv

    # 解析参数
    args = [a for a in sys.argv[2:] if a != "--full"]
    if len(args) >= 1 and not args[0].isdigit():
        brand = args[0]
        if len(args) >= 2:
            count = int(args[1])
    elif len(args) >= 1:
        count = int(args[0])

    generator = TitleGenerator()

    if use_full:
        # V7.2: 使用完整报告格式（含推荐理由）
        titles = generator.generate_with_reasons(topic, brand=brand, count=count)
        print(generator.generate_full_report(titles, topic))
    else:
        # 原有格式（向后兼容）
        titles = generator.generate(topic, brand=brand, count=count)
        print(generator.generate_report(titles))


if __name__ == "__main__":
    main()
