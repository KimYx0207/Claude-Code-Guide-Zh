# config包初始化文件
"""
公众号写作助手 - 共享配置模块
提供统一的品牌词库、动作词库等配置
"""

from .brands import (
    CORE_BRANDS,
    BRAND_WORDS,
    ALL_BRAND_WORDS,
    ACTION_WORDS,
    HOTSPOT_KEYWORDS,
    DATA_VERSION,
    get_brand_tier,
    is_core_brand,
    get_avg_reads
)

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
