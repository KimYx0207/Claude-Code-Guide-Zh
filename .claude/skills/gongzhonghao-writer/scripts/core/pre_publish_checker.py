# -*- coding: utf-8 -*-
"""
发文前检查器 V9.0 - 配置驱动版
确保文章满足爆款必要条件后再发布
"""

import sys
from pathlib import Path

# 添加config目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent.parent))
from config.loader import load_config

import re
import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from datetime import datetime, timedelta


@dataclass
class CheckItem:
    """检查项"""
    name: str
    passed: bool
    score: int
    max_score: int
    details: str
    suggestion: str = ""


@dataclass
class CheckResult:
    """检查结果"""
    passed: bool
    total_score: int
    max_score: int
    items: List[CheckItem] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    suggestions: List[str] = field(default_factory=list)


class PrePublishChecker:
    """发文前检查器 V9.0 - 配置驱动"""

    def __init__(self, articles_dir: str = "articles"):
        """初始化：从配置加载检查规则"""
        self.articles_dir = Path(articles_dir)

        # 加载配置
        brands_config = load_config('brands_config')
        quality_config = load_config('quality_config')

        # 从配置加载词库
        self.BRAND_WORDS = self._load_brands(brands_config)
        self.ACTION_WORDS = quality_config.get('action_words', {}).get('high', []) + \
                           quality_config.get('action_words', {}).get('mid', [])
        self.PAIN_POINTS = quality_config.get('pre_publish', {}).get('pain_points', ["问题", "报错"])
        self.TIMELY_WORDS = quality_config.get('pre_publish', {}).get('timely_words', ["更新", "发布"])
        self.EMOTION_WORDS = quality_config.get('pre_publish', {}).get('emotion_words', ["神器", "绝了", "真香"])

    def _load_brands(self, config):
        """加载品牌词"""
        brands = config.get('core_brands', {})
        all_brands = brands.get('s_tier', []) + brands.get('a_tier', [])
        return all_brands if all_brands else ["Claude", "Cursor", "Gemini"]

    def check(
        self,
        title: str,
        content: str,
        topic: Optional[str] = None
    ) -> CheckResult:
        """
        执行发文前检查

        Args:
            title: 文章标题
            content: 文章内容
            topic: 文章主题/热点（可选）

        Returns:
            检查结果
        """
        items = []
        warnings = []
        suggestions = []

        # 1. 标题品牌词检查（必要条件）
        brand_check = self._check_brand_word(title)
        items.append(brand_check)
        if not brand_check.passed:
            warnings.append("⚠️ 标题缺少品牌词，爆款概率下降42%")

        # 2. 标题动作词检查
        action_check = self._check_action_word(title)
        items.append(action_check)
        if not action_check.passed:
            suggestions.append("建议添加'手把手/教你/一键'等动作词")

        # 3. 标题情绪词检查
        emotion_check = self._check_emotion_word(title)
        items.append(emotion_check)

        # 4. 痛点匹配检查
        pain_check = self._check_pain_point(title, content)
        items.append(pain_check)
        if not pain_check.passed:
            warnings.append("⚠️ 未检测到明显痛点，读者可能不知道为什么要看")

        # 5. 时效性检查
        timely_check = self._check_timeliness(title, content, topic)
        items.append(timely_check)

        # 6. 内容实用性检查
        practical_check = self._check_practicality(content)
        items.append(practical_check)

        # 7. 内容独特性检查（检查是否与已有文章重复）
        unique_check = self._check_uniqueness(title, content)
        items.append(unique_check)
        if not unique_check.passed:
            warnings.append("⚠️ 与已有文章主题相似，需要差异化角度")

        # 8. 传播性检查（互动率预估）
        viral_check = self._check_viral_potential(title, content)
        items.append(viral_check)

        # 计算总分
        total_score = sum(item.score for item in items)
        max_score = sum(item.max_score for item in items)

        # 判断是否通过（必须满足品牌词+动作词）
        must_pass = brand_check.passed and action_check.passed
        score_pass = total_score >= max_score * 0.6

        return CheckResult(
            passed=must_pass and score_pass,
            total_score=total_score,
            max_score=max_score,
            items=items,
            warnings=warnings,
            suggestions=suggestions
        )

    def _check_brand_word(self, title: str) -> CheckItem:
        """检查品牌词"""
        title_lower = title.lower()
        matched = [b for b in self.BRAND_WORDS if b.lower() in title_lower]

        if matched:
            return CheckItem(
                name="品牌词",
                passed=True,
                score=25,
                max_score=25,
                details=f"检测到: {', '.join(matched)}"
            )
        else:
            return CheckItem(
                name="品牌词",
                passed=False,
                score=0,
                max_score=25,
                details="未检测到品牌词",
                suggestion=f"添加品牌词如: {', '.join(self.BRAND_WORDS[:5])}"
            )

    def _check_action_word(self, title: str) -> CheckItem:
        """检查动作词"""
        matched = [w for w in self.ACTION_WORDS if w in title]

        if matched:
            return CheckItem(
                name="动作词",
                passed=True,
                score=15,
                max_score=15,
                details=f"检测到: {', '.join(matched)}"
            )
        else:
            return CheckItem(
                name="动作词",
                passed=False,
                score=0,
                max_score=15,
                details="未检测到动作词",
                suggestion="添加'手把手/教你/一键'"
            )

    def _check_emotion_word(self, title: str) -> CheckItem:
        """检查情绪词"""
        matched = [w for w in self.EMOTION_WORDS if w in title]

        if matched:
            return CheckItem(
                name="情绪词",
                passed=True,
                score=10,
                max_score=10,
                details=f"检测到: {', '.join(matched)}"
            )
        else:
            return CheckItem(
                name="情绪词",
                passed=False,
                score=0,
                max_score=10,
                details="未检测到情绪词",
                suggestion="添加'神器/绝了/真香'"
            )

    def _check_pain_point(self, title: str, content: str) -> CheckItem:
        """检查痛点匹配"""
        text = title + " " + content[:500]  # 只检查标题和开头
        matched = [w for w in self.PAIN_POINTS if w in text]

        # 检查是否有问号（表示解决问题）
        has_question = "？" in title or "?" in title

        if matched or has_question:
            return CheckItem(
                name="痛点匹配",
                passed=True,
                score=15,
                max_score=15,
                details=f"检测到痛点信号: {', '.join(matched) if matched else '问句形式'}"
            )
        else:
            return CheckItem(
                name="痛点匹配",
                passed=False,
                score=5,
                max_score=15,
                details="未明确痛点",
                suggestion="在标题或开头说明解决什么问题"
            )

    def _check_timeliness(
        self,
        title: str,
        content: str,
        topic: Optional[str]
    ) -> CheckItem:
        """检查时效性"""
        text = title + " " + content[:500]
        matched = [w for w in self.TIMELY_WORDS if w in text]

        # 检查是否有版本号
        has_version = bool(re.search(r"[vV]?\d+\.?\d*\.?\d*", title))

        if matched or has_version:
            return CheckItem(
                name="时效性",
                passed=True,
                score=15,
                max_score=15,
                details=f"时效性信号: {', '.join(matched) if matched else '版本号'}"
            )
        else:
            return CheckItem(
                name="时效性",
                passed=False,
                score=5,
                max_score=15,
                details="时效性不明确",
                suggestion="说明是'最新/刚发布'或添加版本号"
            )

    def _check_practicality(self, content: str) -> CheckItem:
        """检查实用性"""
        # 检查是否有代码块
        has_code = "```" in content

        # 检查是否有步骤
        has_steps = bool(re.search(r"(步骤|第[一二三四五]步|1\.|2\.|3\.)", content))

        # 检查是否有配图
        has_images = "![" in content or "<img" in content

        score = 0
        details = []

        if has_code:
            score += 4
            details.append("有代码示例")
        if has_steps:
            score += 3
            details.append("有操作步骤")
        if has_images:
            score += 3
            details.append("有配图")

        return CheckItem(
            name="实用性",
            passed=score >= 5,
            score=score,
            max_score=10,
            details=", ".join(details) if details else "缺少实用元素",
            suggestion="添加代码示例/操作步骤/配图"
        )

    def _check_uniqueness(self, title: str, content: str) -> CheckItem:
        """检查独特性（与已有文章对比）"""
        # 尝试读取已有文章
        similar_articles = []

        if self.articles_dir.exists():
            for f in self.articles_dir.glob("*.md"):
                try:
                    article_content = f.read_text(encoding="utf-8")
                    # 简单的关键词匹配
                    title_words = set(re.findall(r"[\u4e00-\u9fa5a-zA-Z]+", title.lower()))
                    article_words = set(re.findall(r"[\u4e00-\u9fa5a-zA-Z]+", article_content[:200].lower()))

                    overlap = len(title_words & article_words) / max(len(title_words), 1)
                    if overlap > 0.5:
                        similar_articles.append(f.stem)
                except:
                    pass

        if not similar_articles:
            return CheckItem(
                name="独特性",
                passed=True,
                score=10,
                max_score=10,
                details="未发现相似文章"
            )
        else:
            return CheckItem(
                name="独特性",
                passed=False,
                score=3,
                max_score=10,
                details=f"相似文章: {', '.join(similar_articles[:3])}",
                suggestion="需要差异化角度"
            )

    def _check_viral_potential(self, title: str, content: str) -> CheckItem:
        """检查传播潜力"""
        score = 0
        details = []

        # 标题长度（15-25字最佳）
        title_len = len(title)
        if 15 <= title_len <= 25:
            score += 3
            details.append("标题长度适中")

        # 内容长度（1500-3000字最佳）
        content_len = len(content)
        if 1500 <= content_len <= 3000:
            score += 4
            details.append(f"内容{content_len}字适中")
        elif content_len < 1000:
            details.append("内容偏短")
        elif content_len > 4000:
            details.append("内容偏长")

        # 结尾有号召性用语
        ending = content[-200:] if len(content) > 200 else content
        cta_words = ["点赞", "在看", "转发", "关注", "收藏"]
        if any(w in ending for w in cta_words):
            score += 3
            details.append("有互动引导")

        return CheckItem(
            name="传播潜力",
            passed=score >= 5,
            score=score,
            max_score=10,
            details=", ".join(details) if details else "传播元素较少",
            suggestion="添加互动引导语"
        )

    def generate_report(self, result: CheckResult, title: str) -> str:
        """生成检查报告"""
        status = "✅ 通过" if result.passed else "❌ 未通过"

        lines = [
            "=" * 60,
            "📋 发文前检查报告",
            "=" * 60,
            "",
            f"标题：{title}",
            f"状态：{status}",
            f"总分：{result.total_score}/{result.max_score}分",
            "",
            "-" * 60,
            "检查项目：",
            "-" * 60,
        ]

        for item in result.items:
            icon = "✅" if item.passed else "❌"
            lines.append(f"{icon} {item.name}: {item.score}/{item.max_score}分")
            lines.append(f"   {item.details}")
            if item.suggestion:
                lines.append(f"   💡 {item.suggestion}")
            lines.append("")

        if result.warnings:
            lines.extend([
                "-" * 60,
                "⚠️ 警告：",
                "-" * 60,
            ])
            for warning in result.warnings:
                lines.append(warning)
            lines.append("")

        if result.suggestions:
            lines.extend([
                "-" * 60,
                "💡 建议：",
                "-" * 60,
            ])
            for sug in result.suggestions:
                lines.append(f"• {sug}")
            lines.append("")

        # 最终建议
        lines.extend([
            "=" * 60,
            "📌 最终建议：",
            "=" * 60,
        ])

        if result.passed:
            lines.append("可以发布！建议选择早8点或晚8点发布获得最佳流量。")
        else:
            lines.append("建议修改后再发布。重点关注以下问题：")
            for item in result.items:
                if not item.passed and item.suggestion:
                    lines.append(f"  • {item.suggestion}")

        lines.append("")

        return "\n".join(lines)


def main():
    """命令行入口"""
    import sys

    # 强制UTF-8输出，避免Windows下中文报错
    if sys.stdout.encoding != 'utf-8':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

    if len(sys.argv) < 2:
        print("用法: python pre_publish_checker.py <文章文件路径>")
        print("示例: python pre_publish_checker.py articles/2025-12-08-xxx.md")
        sys.exit(1)

    file_path = Path(sys.argv[1])

    if not file_path.exists():
        print(f"文件不存在: {file_path}")
        sys.exit(1)

    content = file_path.read_text(encoding="utf-8")

    # 提取标题（假设第一行是标题）
    lines = content.split("\n")
    title = lines[0].lstrip("#").strip() if lines else "无标题"

    checker = PrePublishChecker()
    result = checker.check(title, content)

    print(checker.generate_report(result, title))


if __name__ == "__main__":
    main()
