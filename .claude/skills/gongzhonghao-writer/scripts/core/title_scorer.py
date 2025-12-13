# -*- coding: utf-8 -*-
"""
标题评分器 V7.1 - 基于82篇文章数据验证
输入标题，输出爆款概率评分（0-100分）

根据 data/rule_validation_report.json 的验证结果更新（2025-12-09）
核心发现（按effectiveness排序）：
- 工具推荐公式: 5.25x（最强！用了X时间才知道+神器）
- 教程词(手把手/教程): 1.95x, lift +66.3%
- 效率承诺(一键/秒): 1.68x, lift +56.0%
- 痛点解决公式: 1.65x, lift +47.4%
- 品牌词(Claude/Cursor): 1.59x, lift +16.3%

⚠️ 无效规则（已删除评分）：
- 情绪词(惊了/麻了): 0.32x 负相关！
- FOMO词(99%不知道): 0.00x 零命中！
- 标题长度15-25字: 0.50x 反向指标！
"""

import re
from typing import Dict, List, Tuple
from dataclasses import dataclass


@dataclass
class ScoreItem:
    """评分项"""
    dimension: str
    score: int
    max_score: int
    matched: List[str]
    suggestion: str


class TitleScorer:
    """标题评分器"""

    # 品牌词库（按热度排序）
    # V7.1更新：区分国际+国内市场，国内头部产品同样是S级
    BRAND_WORDS = {
        "S级": [
            # 国际头部
            "Claude", "Cursor", "GPT", "ChatGPT", "Gemini", "Google", "OpenAI", "Anthropic",
            # 国内头部（月活过亿/垂直天花板）
            "DeepSeek", "豆包", "Doubao", "通义", "Qwen", "千问", "Kimi", "智谱", "ChatGLM",
            # 视频生成天花板
            "可灵", "Kling", "即梦", "海螺", "MiniMax", "Suno", "Midjourney", "Runway",
        ],
        "A级": [
            # 国际知名
            "Copilot", "v0", "Bolt", "Windsurf", "Perplexity", "Lovart", "Pika", "Luma",
            # 国内知名
            "文心", "ERNIE", "百度", "腾讯混元", "讯飞", "月之暗面", "零一万物", "Yi",
            "Vidu", "PixVerse", "清影", "通义万相",
        ],
        "B级": ["Ollama", "LLaMA", "Mistral", "Stable Diffusion", "SDXL", "Flux"],
    }

    # 动作词库
    ACTION_WORDS = {
        "强": ["手把手", "教你怎么", "完整教程"],  # 强动作词 +15分
        "中": ["教程", "攻略", "指南", "教你"],    # 中动作词 +10分
        "弱": ["分享", "介绍", "说说"],            # 弱动作词 +5分
    }

    # 效率词库
    SPEED_WORDS = ["一键", "秒", "分钟", "3步", "5步", "快速", "立即", "马上"]

    # 情绪词库 - V7.1更新：数据显示情绪词effectiveness=0.32x（负相关）
    # 保留检测但不再正向评分，仅作为风险提示
    EMOTION_WORDS = {
        "强": ["神器", "炸裂", "牛逼", "绝了", "真香", "爆"],  # 神器保留（属于工具词，有效）
        "中": ["强", "好用", "推荐", "必看"],
        "弱": ["不错", "还行", "可以"],
    }

    # V7.1新增：工具推荐公式关键词（effectiveness=5.25x，最强！）
    TOOL_RECOMMEND_PATTERNS = [
        r"用.{1,10}(才知道|才发现)",  # "用了半年才知道"
        r"一直(少|没|缺)",  # "一直少装了"
    ]

    # 问题解决词
    PROBLEM_WORDS = ["？", "?", "怎么", "如何", "解决", "搞定", "修复"]

    # 数字模式
    NUMBER_PATTERN = r"\d+"

    # 版本号模式
    VERSION_PATTERN = r"[vV]?\d+\.?\d*\.?\d*"

    def __init__(self):
        self.score_items: List[ScoreItem] = []

    def score(self, title: str) -> Dict:
        """
        评分标题

        Args:
            title: 待评分的标题

        Returns:
            评分结果字典
        """
        self.score_items = []
        total_score = 0

        # 1. 品牌词评分（最高35分）
        brand_score = self._score_brand(title)
        total_score += brand_score.score
        self.score_items.append(brand_score)

        # 2. 动作词评分（最高15分）
        action_score = self._score_action(title)
        total_score += action_score.score
        self.score_items.append(action_score)

        # 3. 效率词评分（最高10分）
        speed_score = self._score_speed(title)
        total_score += speed_score.score
        self.score_items.append(speed_score)

        # 4. 情绪词检测（V7.1：不再正向评分，改为风险提示）
        emotion_score = self._score_emotion(title)
        # V7.1: 情绪词effectiveness=0.32x，不加分
        self.score_items.append(emotion_score)

        # 4.5 V7.1新增：工具推荐公式检测（effectiveness=5.25x，最强！）
        tool_formula_score = self._score_tool_formula(title)
        total_score += tool_formula_score.score
        self.score_items.append(tool_formula_score)

        # 5. 问题解决词评分（最高10分）
        problem_score = self._score_problem(title)
        total_score += problem_score.score
        self.score_items.append(problem_score)

        # 6. 数字/版本号评分（最高10分）
        number_score = self._score_number(title)
        total_score += number_score.score
        self.score_items.append(number_score)

        # 7. 长度评分（最高5分）
        length_score = self._score_length(title)
        total_score += length_score.score
        self.score_items.append(length_score)

        # 计算爆款概率
        probability = self._calculate_probability(total_score)

        # V7.1: 新的最高分 = 35+15+10+0+20+10+10+5 = 105分
        # 但为了评分体验，仍然显示满分100
        return {
            "title": title,
            "total_score": min(total_score, 100),  # V7.1: 封顶100分
            "max_score": 100,
            "probability": probability,
            "grade": self._get_grade(total_score),
            "items": self.score_items,
            "suggestions": self._generate_suggestions(),
        }

    def _score_brand(self, title: str) -> ScoreItem:
        """品牌词评分"""
        matched = []
        score = 0
        title_lower = title.lower()

        for level, brands in self.BRAND_WORDS.items():
            for brand in brands:
                if brand.lower() in title_lower:
                    matched.append(f"{brand}({level})")
                    if level == "S级":
                        score = max(score, 35)
                    elif level == "A级":
                        score = max(score, 25)
                    else:
                        score = max(score, 15)

        suggestion = ""
        if score == 0:
            suggestion = "建议添加热门品牌词如Claude/Cursor/Gemini"
        elif score < 35:
            suggestion = "可升级为S级品牌词(Claude/Cursor/GPT)"

        return ScoreItem(
            dimension="品牌词",
            score=score,
            max_score=35,
            matched=matched,
            suggestion=suggestion
        )

    def _score_action(self, title: str) -> ScoreItem:
        """动作词评分"""
        matched = []
        score = 0

        for level, words in self.ACTION_WORDS.items():
            for word in words:
                if word in title:
                    matched.append(f"{word}({level})")
                    if level == "强":
                        score = max(score, 15)
                    elif level == "中":
                        score = max(score, 10)
                    else:
                        score = max(score, 5)

        suggestion = ""
        if score == 0:
            suggestion = "建议添加'手把手教你'或'教程'"
        elif score < 15:
            suggestion = "可升级为'手把手教你怎么xxx'"

        return ScoreItem(
            dimension="动作词",
            score=score,
            max_score=15,
            matched=matched,
            suggestion=suggestion
        )

    def _score_speed(self, title: str) -> ScoreItem:
        """效率词评分"""
        matched = [w for w in self.SPEED_WORDS if w in title]
        score = min(10, len(matched) * 5) if matched else 0

        suggestion = ""
        if score == 0:
            suggestion = "建议添加'一键/秒/X分钟'"

        return ScoreItem(
            dimension="效率词",
            score=score,
            max_score=10,
            matched=matched,
            suggestion=suggestion
        )

    def _score_emotion(self, title: str) -> ScoreItem:
        """情绪词检测 - V7.1更新：不再正向评分
        数据显示情绪词(惊了/麻了)的effectiveness=0.32x，是负相关因素
        但'神器'属于工具词，仍然有效，在_score_speed中处理
        """
        matched = []
        # V7.1: 检测但不评分，仅作为参考
        negative_emotions = ["惊了", "麻了", "吓到", "慌了", "懵了"]

        for word in negative_emotions:
            if word in title:
                matched.append(f"{word}(⚠️无效)")

        # 检测"绝了/真香"等词，提示用户数据显示效果一般
        for level, words in self.EMOTION_WORDS.items():
            for word in words:
                if word in title and word != "神器":  # 神器属于工具词，有效
                    if word not in [m.split("(")[0] for m in matched]:
                        matched.append(f"{word}(效果一般)")

        suggestion = ""
        if matched:
            suggestion = "⚠️ V7.1数据显示情绪词效果有限，建议用'手把手/一键'替代"

        return ScoreItem(
            dimension="情绪词",
            score=0,  # V7.1: 不再给正分
            max_score=0,  # V7.1: 最高分也是0
            matched=matched,
            suggestion=suggestion
        )

    def _score_tool_formula(self, title: str) -> ScoreItem:
        """V7.1新增：工具推荐公式评分（effectiveness=5.25x，最强！）
        公式：用了X时间才知道 + 神器/工具
        示例：老金用AI写了半年代码才知道，原来一直少装了这个神器
        """
        matched = []
        score = 0

        # 检测"用了X才知道"模式
        for pattern in self.TOOL_RECOMMEND_PATTERNS:
            if re.search(pattern, title):
                matched.append("工具推荐公式")
                score = 20  # 给高分，因为5.25x效果
                break

        # 检测"神器"关键词（工具词，effectiveness=1.48x）
        if "神器" in title:
            if not matched:
                matched.append("神器(工具词)")
            score = max(score, 15)

        suggestion = ""
        if score == 0:
            suggestion = "💡 推荐使用'用了X才知道+神器'公式（效果5.25倍！）"

        return ScoreItem(
            dimension="工具推荐公式",
            score=score,
            max_score=20,
            matched=matched,
            suggestion=suggestion
        )

    def _score_problem(self, title: str) -> ScoreItem:
        """问题解决词评分"""
        matched = [w for w in self.PROBLEM_WORDS if w in title]
        score = min(10, len(matched) * 5) if matched else 0

        suggestion = ""
        if score == 0:
            suggestion = "可添加'？'表示解决问题"

        return ScoreItem(
            dimension="问题解决",
            score=score,
            max_score=10,
            matched=matched,
            suggestion=suggestion
        )

    def _score_number(self, title: str) -> ScoreItem:
        """数字/版本号评分"""
        matched = []
        score = 0

        # 检查版本号
        version_matches = re.findall(self.VERSION_PATTERN, title)
        if version_matches:
            matched.extend([f"版本:{v}" for v in version_matches])
            score += 5

        # 检查普通数字
        number_matches = re.findall(self.NUMBER_PATTERN, title)
        if number_matches:
            # 过滤掉版本号中的数字
            real_numbers = [n for n in number_matches if n not in "".join(version_matches)]
            if real_numbers:
                matched.extend([f"数字:{n}" for n in real_numbers[:3]])
                score += 5

        suggestion = ""
        if score == 0:
            suggestion = "建议添加具体数字如'3步/5分钟'"

        return ScoreItem(
            dimension="数字/版本",
            score=min(10, score),
            max_score=10,
            matched=matched,
            suggestion=suggestion
        )

    def _score_length(self, title: str) -> ScoreItem:
        """长度评分 - V7.1更新：数据显示15-25字是反向指标
        effectiveness=0.50x, avg_read_when_hit=742 vs miss=1487
        数据表明：较长标题（>25字）反而表现更好！
        """
        length = len(title)

        # V7.1: 根据数据调整评分逻辑
        if length > 30:
            score = 5
            matched = [f"{length}字(长标题，数据显示效果好)"]
            suggestion = ""
        elif 25 < length <= 30:
            score = 3
            matched = [f"{length}字(适中)"]
            suggestion = ""
        elif length <= 25:
            score = 0
            matched = [f"{length}字(偏短)"]
            suggestion = "⚠️ V7.1数据：较长标题(>25字)阅读量更高"

        return ScoreItem(
            dimension="标题长度",
            score=score,
            max_score=5,
            matched=matched,
            suggestion=suggestion
        )

    def _calculate_probability(self, score: int) -> str:
        """计算爆款概率"""
        if score >= 80:
            return "🔥🔥🔥 极高(>80%)"
        elif score >= 65:
            return "🔥🔥 较高(60-80%)"
        elif score >= 50:
            return "🔥 中等(40-60%)"
        elif score >= 35:
            return "⚠️ 较低(20-40%)"
        else:
            return "❌ 很低(<20%)"

    def _get_grade(self, score: int) -> str:
        """获取评级"""
        if score >= 85:
            return "S"
        elif score >= 70:
            return "A"
        elif score >= 55:
            return "B"
        elif score >= 40:
            return "C"
        else:
            return "D"

    def _generate_suggestions(self) -> List[str]:
        """生成改进建议"""
        suggestions = []
        for item in self.score_items:
            if item.suggestion and item.score < item.max_score:
                suggestions.append(f"[{item.dimension}] {item.suggestion}")
        return suggestions

    def generate_report(self, result: Dict) -> str:
        """生成评分报告"""
        lines = [
            "=" * 60,
            "📊 标题评分报告",
            "=" * 60,
            "",
            f"标题：{result['title']}",
            f"总分：{result['total_score']}/{result['max_score']}分",
            f"评级：{result['grade']}",
            f"爆款概率：{result['probability']}",
            "",
            "-" * 60,
            "📋 评分明细：",
            "-" * 60,
        ]

        for item in result["items"]:
            status = "✅" if item.score == item.max_score else ("⚠️" if item.score > 0 else "❌")
            matched_str = ", ".join(item.matched) if item.matched else "无"
            lines.append(f"{status} {item.dimension}: {item.score}/{item.max_score}分")
            lines.append(f"   匹配：{matched_str}")
            if item.suggestion:
                lines.append(f"   建议：{item.suggestion}")
            lines.append("")

        if result["suggestions"]:
            lines.extend([
                "-" * 60,
                "💡 改进建议：",
                "-" * 60,
            ])
            for i, sug in enumerate(result["suggestions"], 1):
                lines.append(f"{i}. {sug}")

        lines.extend([
            "",
            "=" * 60,
        ])

        return "\n".join(lines)


def main():
    """命令行入口"""
    import sys

    if len(sys.argv) < 2:
        print("用法: python title_scorer.py <标题>")
        print("示例: python title_scorer.py 'Claude更新了，手把手教你用新功能'")
        sys.exit(1)

    title = sys.argv[1]

    scorer = TitleScorer()
    result = scorer.score(title)

    print(scorer.generate_report(result))


if __name__ == "__main__":
    main()
