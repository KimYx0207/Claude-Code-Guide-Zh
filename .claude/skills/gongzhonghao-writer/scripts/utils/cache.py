# -*- coding: utf-8 -*-
"""
缓存工具模块 V1.0
创建日期：2025-12-12

功能：提供LRU缓存装饰器，减少重复计算

使用示例：
    from utils.cache import cached_config

    @cached_config
    def load_quality_standards():
        # 只在首次调用时加载，后续使用缓存
        ...
"""

from functools import lru_cache
from typing import Any, Callable, TypeVar, Optional
import os
from pathlib import Path

# 类型变量
F = TypeVar('F', bound=Callable[..., Any])

# LRU缓存装饰器（配置文件专用，maxsize=1因为配置通常固定）
cached_config = lru_cache(maxsize=1)

# LRU缓存装饰器（通用，可缓存多个结果）
cached_result = lru_cache(maxsize=128)


def file_cache(func: F) -> F:
    """
    文件内容缓存装饰器

    基于文件修改时间判断是否需要重新读取

    Example:
        @file_cache
        def load_file(filepath: str) -> str:
            with open(filepath) as f:
                return f.read()
    """
    cache: dict = {}

    def wrapper(filepath: str, *args, **kwargs):
        path = Path(filepath)

        if not path.exists():
            return func(filepath, *args, **kwargs)

        mtime = path.stat().st_mtime
        cache_key = (filepath, mtime)

        if cache_key in cache:
            return cache[cache_key]

        result = func(filepath, *args, **kwargs)
        cache[cache_key] = result

        return result

    return wrapper  # type: ignore


def clear_all_caches() -> None:
    """清除所有缓存"""
    cached_config.cache_clear()
    cached_result.cache_clear()


def get_cache_info() -> dict:
    """获取缓存统计信息"""
    return {
        'config_cache': cached_config.cache_info()._asdict(),
        'result_cache': cached_result.cache_info()._asdict()
    }


__all__ = [
    'cached_config',
    'cached_result',
    'file_cache',
    'clear_all_caches',
    'get_cache_info'
]
