#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
统一配置加载器 - 单一真相来源
所有Python脚本从这里导入配置加载函数

用法：
    from config.loader import load_config, get_all_configs

    # 加载单个配置
    brands = load_config('brands_config')

    # 加载全部配置
    all_configs = get_all_configs()
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional

# 配置文件目录
CONFIG_DIR = Path(__file__).parent

# 缓存已加载的配置（避免重复读取文件）
_config_cache: Dict[str, Any] = {}


def load_config(name: str, use_cache: bool = True) -> Dict[str, Any]:
    """加载指定配置文件

    Args:
        name: 配置文件名（不含.json后缀）
              支持：formulas_config, brands_config, quality_config, wechat_config
        use_cache: 是否使用缓存（默认True）

    Returns:
        配置字典

    Raises:
        FileNotFoundError: 配置文件不存在
        json.JSONDecodeError: 配置文件格式错误

    Example:
        >>> brands = load_config('brands_config')
        >>> brands['core_brands']['s_tier']
        ['Claude', 'Cursor', 'Gemini', ...]
    """
    # 使用缓存
    if use_cache and name in _config_cache:
        return _config_cache[name]

    # 构建配置文件路径
    config_path = CONFIG_DIR / f'{name}.json'

    if not config_path.exists():
        raise FileNotFoundError(f"配置文件不存在: {config_path}")

    # 读取配置
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)

    # 存入缓存
    if use_cache:
        _config_cache[name] = config

    return config


def get_all_configs(use_cache: bool = True) -> Dict[str, Dict[str, Any]]:
    """加载全部配置文件

    Returns:
        包含所有配置的字典：
        {
            'formulas': {...},
            'brands': {...},
            'quality': {...},
            'wechat': {...}
        }
    """
    return {
        'formulas': load_config('formulas_config', use_cache),
        'brands': load_config('brands_config', use_cache),
        'quality': load_config('quality_config', use_cache),
        'wechat': load_config('wechat_config', use_cache)
    }


def clear_cache() -> None:
    """清除配置缓存（配置更新后使用）"""
    global _config_cache
    _config_cache = {}


def reload_config(name: str) -> Dict[str, Any]:
    """重新加载指定配置（绕过缓存）"""
    return load_config(name, use_cache=False)


# 快捷函数
def get_brands() -> Dict[str, Any]:
    """获取品牌配置"""
    return load_config('brands_config')


def get_quality() -> Dict[str, Any]:
    """获取质量检测配置"""
    return load_config('quality_config')


def get_formulas() -> Dict[str, Any]:
    """获取爆款公式配置"""
    return load_config('formulas_config')


def get_wechat() -> Dict[str, Any]:
    """获取微信配置"""
    return load_config('wechat_config')
