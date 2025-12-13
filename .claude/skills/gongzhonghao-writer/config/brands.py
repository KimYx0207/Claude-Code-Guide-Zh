# -*- coding: utf-8 -*-
"""
品牌词库统一配置模块 V7.2
数据版本：基于82篇文章数据验证 (2025-12-10)

功能说明：
    统一管理所有品牌词库、核心工具池、动作词库等配置
    消除title_generator.py、title_scorer.py、topic_filter.py、pre_publish_checker.py中的重复定义

使用方法：
    from config.brands import CORE_BRANDS, ACTION_WORDS, ALL_BRAND_WORDS

版本历史：
    V7.2 (2025-12-12):
        - 初始版本，从4个脚本中提取并统一
        - 基于82篇文章数据验证
"""

from typing import Dict, List, Set

# ============================================================
# 核心工具池（基于82篇数据验证，按平均阅读量排序）
# ============================================================

CORE_BRANDS = {
    "Kimi": {
        "tier": "S",
        "avg_reads": 3448,
        "keywords": ["kimi", "月之暗面", "moonshot"],
        "company": "月之暗面"
    },
    "Gemini": {
        "tier": "S",
        "avg_reads": 3146,
        "keywords": ["gemini", "google gemini"],
        "company": "Google"
    },
    "ByteDance": {
        "tier": "S",
        "avg_reads": 2927,
        "keywords": ["即梦", "豆包", "doubao", "bytedance"],
        "company": "字节跳动"
    },
    "Claude": {
        "tier": "S",
        "avg_reads": 2118,
        "keywords": ["claude", "anthropic", "sonnet", "opus"],
        "company": "Anthropic"
    },
    "Cursor": {
        "tier": "A",
        "avg_reads": 1246,
        "keywords": ["cursor", "cursor ai"],
        "company": "Cursor"
    },
    "Codex": {
        "tier": "A",
        "avg_reads": 1199,
        "keywords": ["codex", "openai codex"],
        "company": "OpenAI"
    }
}

# ============================================================
# 全量品牌词库（S/A/B级分类）
# ============================================================

BRAND_WORDS = {
    "S级": [
        # AI大厂
        "Claude", "GPT", "ChatGPT", "Gemini", "Google", "OpenAI", "Anthropic",
        # 国内大厂
        "Kimi", "DeepSeek", "豆包", "通义", "千问", "智谱", "文心",
        # 热门工具
        "Cursor", "Copilot", "Midjourney", "Sora"
    ],
    "A级": [
        "v0", "Bolt", "Replit", "Codex", "Cline", "Aider",
        "Roo", "Trae", "Windsurf", "Claude Code"
    ],
    "B级": [
        "Perplexity", "Character.AI", "Poe", "HuggingFace",
        "Stable Diffusion", "DALL-E", "Runway"
    ]
}

# 扁平化所有品牌词（用于检测）
ALL_BRAND_WORDS: Set[str] = set()
for tier_words in BRAND_WORDS.values():
    ALL_BRAND_WORDS.update([w.lower() for w in tier_words])

# 添加核心工具池的关键词
for brand_data in CORE_BRANDS.values():
    ALL_BRAND_WORDS.update([kw.lower() for kw in brand_data["keywords"]])

# ============================================================
# 动作词库（用于标题生成）
# ============================================================

ACTION_WORDS = {
    "效率类": [
        "提升", "加速", "优化", "节省", "自动化", "简化", "快速",
        "一键", "秒", "10分钟", "5步", "3招"
    ],
    "解决类": [
        "解决", "搞定", "破解", "修复", "避免", "告别", "不再",
        "彻底", "完美", "终于"
    ],
    "对比类": [
        "VS", "对比", "选择", "哪个", "更好", "区别", "评测"
    ],
    "推荐类": [
        "推荐", "必备", "神器", "宝藏", "最强", "Top", "排行",
        "精选", "合集"
    ],
    "新品类": [
        "发布", "上线", "更新", "新功能", "版本", "来了", "开放",
        "重磅", "首发"
    ]
}

# ============================================================
# 热点关键词库
# ============================================================

HOTSPOT_KEYWORDS = {
    "时效性": ["最新", "刚刚", "今日", "本周", "突发", "独家"],
    "争议性": ["争议", "封杀", "禁用", "下架", "维权", "翻车"],
    "趋势性": ["趋势", "未来", "颠覆", "革命", "变革", "时代"]
}

# ============================================================
# 辅助函数
# ============================================================

def get_brand_tier(brand_name: str) -> str:
    """获取品牌等级"""
    brand_lower = brand_name.lower()

    for tier, words in BRAND_WORDS.items():
        if any(brand_lower in w.lower() for w in words):
            return tier

    # 检查核心工具池
    for brand, data in CORE_BRANDS.items():
        if brand_lower in brand.lower() or \
           any(brand_lower in kw for kw in data["keywords"]):
            return data["tier"]

    return "未知"

def is_core_brand(text: str) -> bool:
    """判断是否包含核心品牌词"""
    text_lower = text.lower()

    for brand_data in CORE_BRANDS.values():
        if any(kw in text_lower for kw in brand_data["keywords"]):
            return True

    return False

def get_avg_reads(brand_name: str) -> int:
    """获取品牌历史平均阅读量"""
    brand_lower = brand_name.lower()

    for brand, data in CORE_BRANDS.items():
        if brand_lower in brand.lower() or \
           any(brand_lower in kw for kw in data["keywords"]):
            return data["avg_reads"]

    return 0  # 未知品牌返回0

# ============================================================
# 数据版本信息
# ============================================================

DATA_VERSION = {
    "version": "V7.2",
    "date": "2025-12-10",
    "source": "rule_validation_report.json",
    "sample_size": 82,
    "description": "基于82篇真实文章数据验证的品牌词库"
}

__all__ = [
    'CORE_BRANDS',
    'BRAND_WORDS',
    'ALL_BRAND_WORDS',
    'ACTION_WORDS',
    'HOTSPOT_KEYWORDS',
    'DATA_VERSION',
    'get_brand_tier',
    'is_core_brand',
    'get_avg_reads'
]
