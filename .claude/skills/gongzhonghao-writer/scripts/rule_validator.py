#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
爆款规则验证器 V1.0 - 数据驱动规则迭代

核心思路：
- 不做统计推断（样本不够）
- 做规则有效性追踪（每条规则关联的文章表现）
- 输出：哪些规则有效，哪些规则需要调整

作者：老金
日期：2025-12-09
"""

import json
import re
import sys
import io
from pathlib import Path
from typing import Dict, List, Any, Tuple
from collections import defaultdict
from datetime import datetime

# Windows UTF-8兼容
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')


class RuleValidator:
    """规则验证器 - 检验现有规则的实际有效性"""

    def __init__(self, data_file: str):
        self.data_file = Path(data_file)
        self.articles: List[Dict] = []
        self.rules: Dict[str, Dict] = {}
        self.rule_hits: Dict[str, List[Dict]] = defaultdict(list)

        # 定义规则检测器（基于baokuan-rules.md中的规则）
        self._init_rules()

    def _init_rules(self):
        """初始化规则定义"""
        self.rules = {
            # === 标题规则 ===
            "brand_word": {
                "name": "品牌词",
                "description": "标题含Claude/Cursor/Gemini/ChatGPT等品牌词",
                "weight": 30,  # baokuan-rules中定义的权重
                "detector": self._detect_brand_word
            },
            "number_shock": {
                "name": "数字冲击",
                "description": "标题含具体数字（倍数、百分比、金额等）",
                "weight": 10,
                "detector": self._detect_number_shock
            },
            "efficiency_promise": {
                "name": "效率承诺",
                "description": "标题含一键/秒/分钟等效率词",
                "weight": 10,
                "detector": self._detect_efficiency_promise
            },
            "tutorial_word": {
                "name": "教程词",
                "description": "标题含手把手/教程/教你等词",
                "weight": 15,
                "detector": self._detect_tutorial_word
            },
            "tool_word": {
                "name": "工具词",
                "description": "标题含神器/工具/利器等词",
                "weight": 10,
                "detector": self._detect_tool_word
            },
            "emotion_word": {
                "name": "情绪词",
                "description": "标题含惊了/麻了/吓到/慌了等情绪词",
                "weight": 10,
                "detector": self._detect_emotion_word
            },
            "question_mark": {
                "name": "问号",
                "description": "标题含问号（制造悬念）",
                "weight": 5,
                "detector": self._detect_question_mark
            },
            "fomo_word": {
                "name": "FOMO词",
                "description": "标题含99%/不知道/错过等FOMO词",
                "weight": 15,
                "detector": self._detect_fomo_word
            },
            "time_word": {
                "name": "时效词",
                "description": "标题含昨晚/今天/刚刚等时效词",
                "weight": 20,
                "detector": self._detect_time_word
            },
            "personal_word": {
                "name": "个人视角",
                "description": "标题含老金/我/才知道等个人视角词",
                "weight": 10,
                "detector": self._detect_personal_word
            },

            # === 标题长度规则 ===
            "title_length_optimal": {
                "name": "标题长度最佳",
                "description": "标题长度15-25字",
                "weight": 5,
                "detector": self._detect_title_length_optimal
            },

            # === 标题公式规则（检测是否符合12大公式之一）===
            "formula_pain_solve": {
                "name": "痛点解决公式",
                "description": "品牌词+问题+手把手教你",
                "weight": 25,
                "detector": self._detect_formula_pain_solve
            },
            "formula_tool_recommend": {
                "name": "工具推荐公式",
                "description": "用了X时间才知道+神器",
                "weight": 20,
                "detector": self._detect_formula_tool_recommend
            },
            "formula_version_update": {
                "name": "版本更新公式",
                "description": "品牌词+版本号+解读/实测",
                "weight": 15,
                "detector": self._detect_formula_version_update
            },
        }

    # === 规则检测函数 ===

    def _detect_brand_word(self, title: str, content: str = "") -> bool:
        """检测品牌词"""
        brands = [
            'claude', 'cursor', 'gemini', 'chatgpt', 'gpt', 'openai',
            'anthropic', 'copilot', 'midjourney', 'suno', 'kimi',
            'jetbrains', 'vscode', 'notion', 'figma', 'lovart',
            'mcp', 'skills', 'hooks'
        ]
        title_lower = title.lower()
        return any(brand in title_lower for brand in brands)

    def _detect_number_shock(self, title: str, content: str = "") -> bool:
        """检测数字冲击"""
        # 匹配：数字+倍、数字+%、数字+万、数字+块/元、时间对比
        patterns = [
            r'\d+倍',
            r'\d+%',
            r'\d+万',
            r'\d+块',
            r'\d+元',
            r'\d+\$',
            r'\d+小时',
            r'\d+分钟',
            r'\d+天',
            r'\d+个',
            r'\d+款',
            r'\d+篇',
            r'\d+星',  # GitHub星数
            r'从\d+到\d+',  # 对比
        ]
        return any(re.search(p, title) for p in patterns)

    def _detect_efficiency_promise(self, title: str, content: str = "") -> bool:
        """检测效率承诺词"""
        words = ['一键', '秒', '分钟搞定', '快速', '自动', '立即', '马上']
        return any(w in title for w in words)

    def _detect_tutorial_word(self, title: str, content: str = "") -> bool:
        """检测教程词"""
        words = ['手把手', '教程', '教你', '指南', '攻略', '详解', '怎么']
        return any(w in title for w in words)

    def _detect_tool_word(self, title: str, content: str = "") -> bool:
        """检测工具词"""
        words = ['神器', '工具', '利器', '插件', '扩展', '技能', 'Skill']
        return any(w in title for w in words)

    def _detect_emotion_word(self, title: str, content: str = "") -> bool:
        """检测情绪词"""
        words = ['惊了', '麻了', '吓到', '慌了', '绝了', '牛逼', '太秀',
                 '真香', '震惊', '疯了', '傻了', '懵了', '服了']
        return any(w in title for w in words)

    def _detect_question_mark(self, title: str, content: str = "") -> bool:
        """检测问号"""
        return '？' in title or '?' in title

    def _detect_fomo_word(self, title: str, content: str = "") -> bool:
        """检测FOMO词（错过焦虑）"""
        words = ['99%', '不知道', '错过', '必看', '必须', '千万别', '居然']
        return any(w in title for w in words)

    def _detect_time_word(self, title: str, content: str = "") -> bool:
        """检测时效词"""
        words = ['昨晚', '今天', '刚刚', '最新', '今早', '凌晨', '上线', '发布']
        return any(w in title for w in words)

    def _detect_personal_word(self, title: str, content: str = "") -> bool:
        """检测个人视角词"""
        words = ['老金', '我', '才知道', '才发现', '终于']
        return any(w in title for w in words)

    def _detect_title_length_optimal(self, title: str, content: str = "") -> bool:
        """检测标题长度是否在15-25字"""
        length = len(title)
        return 15 <= length <= 25

    def _detect_formula_pain_solve(self, title: str, content: str = "") -> bool:
        """检测痛点解决公式：品牌词+问题+手把手"""
        has_brand = self._detect_brand_word(title)
        has_question = '?' in title or '？' in title
        has_tutorial = any(w in title for w in ['手把手', '教你', '怎么'])
        return has_brand and (has_question or has_tutorial)

    def _detect_formula_tool_recommend(self, title: str, content: str = "") -> bool:
        """检测工具推荐公式：时间+才知道+神器"""
        has_time = any(w in title for w in ['用了', '半年', '一年', '个月'])
        has_discover = any(w in title for w in ['才知道', '才发现', '原来'])
        has_tool = any(w in title for w in ['神器', '工具', '这个'])
        return has_time and has_discover

    def _detect_formula_version_update(self, title: str, content: str = "") -> bool:
        """检测版本更新公式：品牌词+版本号"""
        has_brand = self._detect_brand_word(title)
        has_version = bool(re.search(r'[vV]?\d+\.?\d*', title))
        return has_brand and has_version

    # === 核心分析方法 ===

    def load_data(self) -> bool:
        """加载文章数据"""
        if not self.data_file.exists():
            print(f"❌ 找不到数据文件：{self.data_file}")
            return False

        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                self.articles = json.load(f)
            print(f"✅ 加载 {len(self.articles)} 篇文章")
            return True
        except Exception as e:
            print(f"❌ 加载失败：{e}")
            return False

    def analyze_rules(self) -> Dict[str, Any]:
        """分析每条规则的有效性"""
        results = {}

        # 计算全局平均阅读量
        all_reads = [a.get('read_count', 0) for a in self.articles]
        global_avg = sum(all_reads) / len(all_reads) if all_reads else 0

        print(f"\n📊 全局平均阅读：{global_avg:.0f}")
        print("=" * 60)

        for rule_id, rule in self.rules.items():
            # 检测每篇文章是否命中该规则
            hit_articles = []
            miss_articles = []

            for article in self.articles:
                title = article.get('title', '')
                content = article.get('content', '')
                read_count = article.get('read_count', 0)

                if rule['detector'](title, content):
                    hit_articles.append({
                        'title': title,
                        'read': read_count,
                        'like': article.get('like_count', 0)
                    })
                else:
                    miss_articles.append({
                        'title': title,
                        'read': read_count
                    })

            # 计算有效性
            hit_count = len(hit_articles)
            miss_count = len(miss_articles)
            hit_rate = hit_count / len(self.articles) * 100 if self.articles else 0

            avg_read_hit = sum(a['read'] for a in hit_articles) / hit_count if hit_count else 0
            avg_read_miss = sum(a['read'] for a in miss_articles) / miss_count if miss_count else 0

            # 有效性 = 命中时平均阅读 / 未命中时平均阅读
            effectiveness = avg_read_hit / avg_read_miss if avg_read_miss > 0 else 0

            # 相对全局的提升
            lift_vs_global = (avg_read_hit - global_avg) / global_avg * 100 if global_avg > 0 else 0

            results[rule_id] = {
                'name': rule['name'],
                'description': rule['description'],
                'original_weight': rule['weight'],
                'hit_count': hit_count,
                'miss_count': miss_count,
                'hit_rate': round(hit_rate, 1),
                'avg_read_when_hit': round(avg_read_hit, 0),
                'avg_read_when_miss': round(avg_read_miss, 0),
                'effectiveness': round(effectiveness, 2),
                'lift_vs_global': round(lift_vs_global, 1),
                'top_3_hits': sorted(hit_articles, key=lambda x: -x['read'])[:3],
                'recommendation': self._get_recommendation(effectiveness, hit_rate)
            }

        return results

    def _get_recommendation(self, effectiveness: float, hit_rate: float) -> str:
        """根据有效性给出建议"""
        if effectiveness >= 1.5 and hit_rate >= 20:
            return "🔥 强效规则，继续强化"
        elif effectiveness >= 1.2:
            return "✅ 有效规则，保持使用"
        elif effectiveness >= 0.8:
            return "⚠️ 效果一般，需要优化"
        else:
            return "❌ 无效规则，考虑删除"

    def print_report(self, results: Dict[str, Any]):
        """打印分析报告"""
        print("\n" + "=" * 60)
        print("📊 爆款规则有效性分析报告")
        print("=" * 60)

        # 按有效性排序
        sorted_rules = sorted(results.items(), key=lambda x: -x[1]['effectiveness'])

        print("\n### 规则有效性排行榜\n")
        print("| 排名 | 规则 | 命中率 | 命中均读 | 未命中均读 | 有效性 | 建议 |")
        print("|------|------|--------|----------|------------|--------|------|")

        for i, (rule_id, data) in enumerate(sorted_rules, 1):
            print(f"| {i} | {data['name']} | {data['hit_rate']}% | {data['avg_read_when_hit']:.0f} | {data['avg_read_when_miss']:.0f} | {data['effectiveness']:.2f}x | {data['recommendation']} |")

        # 详细分析
        print("\n\n### 详细分析\n")

        for rule_id, data in sorted_rules:
            print(f"\n#### {data['name']}（{rule_id}）")
            print(f"- **描述**：{data['description']}")
            print(f"- **原始权重**：{data['original_weight']}分")
            print(f"- **命中/未命中**：{data['hit_count']}篇 / {data['miss_count']}篇")
            print(f"- **命中时均读**：{data['avg_read_when_hit']:.0f}")
            print(f"- **未命中均读**：{data['avg_read_when_miss']:.0f}")
            print(f"- **有效性**：{data['effectiveness']:.2f}x")
            print(f"- **相对全局提升**：{data['lift_vs_global']:+.1f}%")
            print(f"- **建议**：{data['recommendation']}")

            if data['top_3_hits']:
                print(f"- **命中TOP 3**：")
                for j, hit in enumerate(data['top_3_hits'], 1):
                    print(f"  {j}. {hit['title'][:30]}... ({hit['read']}阅读)")

        # 总结建议
        print("\n\n### 规则优化建议\n")

        strong_rules = [r for r in sorted_rules if r[1]['effectiveness'] >= 1.5]
        weak_rules = [r for r in sorted_rules if r[1]['effectiveness'] < 0.8]

        if strong_rules:
            print("**强效规则（优先使用）**：")
            for rule_id, data in strong_rules:
                print(f"- {data['name']}：有效性{data['effectiveness']:.2f}x")

        if weak_rules:
            print("\n**低效规则（考虑调整）**：")
            for rule_id, data in weak_rules:
                print(f"- {data['name']}：有效性{data['effectiveness']:.2f}x")

    def save_report(self, results: Dict[str, Any], output_file: str = None):
        """保存分析报告为JSON"""
        if output_file is None:
            output_file = self.data_file.parent / "rule_validation_report.json"

        report = {
            "metadata": {
                "analysis_date": datetime.now().isoformat(),
                "total_articles": len(self.articles),
                "rules_analyzed": len(results)
            },
            "rules": results,
            "summary": {
                "strong_rules": [r for r, d in results.items() if d['effectiveness'] >= 1.5],
                "effective_rules": [r for r, d in results.items() if 1.2 <= d['effectiveness'] < 1.5],
                "weak_rules": [r for r, d in results.items() if d['effectiveness'] < 0.8]
            }
        }

        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
            print(f"\n✅ 报告已保存：{output_file}")
        except Exception as e:
            print(f"\n❌ 保存失败：{e}")


def main():
    """主函数"""
    # 默认数据文件路径
    if len(sys.argv) > 1:
        data_file = sys.argv[1]
    else:
        # 尝试找到data目录
        script_dir = Path(__file__).parent
        data_file = script_dir.parent.parent.parent.parent / "data" / "wechat_articles.json"

    print("=" * 60)
    print("📊 爆款规则验证器 V1.0")
    print("=" * 60)
    print(f"数据文件：{data_file}")

    validator = RuleValidator(data_file)

    if not validator.load_data():
        return

    results = validator.analyze_rules()
    validator.print_report(results)
    validator.save_report(results)

    print("\n" + "=" * 60)
    print("💡 使用建议：")
    print("   1. 强效规则（>1.5x）：写作时优先使用")
    print("   2. 有效规则（1.2-1.5x）：正常使用")
    print("   3. 低效规则（<0.8x）：考虑调整或删除")
    print("   4. 定期运行此脚本，追踪规则有效性变化")
    print("=" * 60)


if __name__ == "__main__":
    main()
