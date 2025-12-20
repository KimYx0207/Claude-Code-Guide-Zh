# config包初始化文件
"""
公众号写作助手 - 共享配置模块
提供统一的配置加载、品牌词库、动作词库等配置

用法：
    from config import load_config, get_brands, get_quality
    brands = load_config('brands_config')
"""

# 统一配置加载器（优先导出）
from .loader import (
    load_config,
    get_all_configs,
    clear_cache,
    reload_config,
    get_brands,
    get_quality,
    get_formulas,
    get_wechat
)

# 品牌词库（向后兼容）
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
    # 配置加载器
    'load_config',
    'get_all_configs',
    'clear_cache',
    'reload_config',
    'get_brands',
    'get_quality',
    'get_formulas',
    'get_wechat',
    # 品牌词库
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
