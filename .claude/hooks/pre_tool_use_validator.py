#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PreToolUse Hook - Research步骤验证（重构版）
V7.2.1 - 从BAT架构重构为独立Python脚本

功能：在Write/Edit articles目录前，提示完成research
优化：消除cmd.exe启动开销，提升跨平台兼容性

使用：
    python pre_tool_use_validator.py < hook_input.json
"""

import sys
import json
from pathlib import Path

def validate_research(hook_input: dict) -> int:
    """
    验证Research步骤是否完成

    Args:
        hook_input: Hook输入JSON数据

    Returns:
        0: 允许操作
        1: 阻止操作（当前不阻止，只提示）
    """
    # 获取工具名称和文件路径
    tool_name = hook_input.get('tool_name', '')
    tool_input_data = hook_input.get('tool_input', {})
    file_path = tool_input_data.get('file_path', '')

    # 只处理Write和Edit工具
    if tool_name not in ['Write', 'Edit']:
        return 0

    # 规范化路径
    file_path_normalized = file_path.replace('\\', '/').replace('//', '/')

    # 只检查articles目录
    if '/articles/' not in file_path_normalized:
        return 0

    # 检查文件是否已存在
    article_path = Path(file_path)
    if article_path.exists():
        return 0  # 已存在的文件，允许编辑

    # 新文章创建，提示Research
    print()
    print('=' * 50)
    print('Research步骤验证检查')
    print('=' * 50)
    print()
    print('检测到新文章创建操作')
    print()
    print('智能提示：建议完成Research步骤以提高文章质量')
    print()
    print('推荐使用以下工具（至少2个）：')
    print()
    print('1. 优先使用MCP工具：')
    print('   - mcp__mcp-router__search (免费无限)')
    print('   - mcp__mcp-router__brave_web_search')
    print('   - mcp__context7__get_library_docs')
    print()
    print('2. 备选内置工具：')
    print('   - WebSearch')
    print('   - WebFetch')
    print()
    print('=' * 50)
    print('提示：使用/write命令可自动完成Research')
    print('=' * 50)
    print()

    return 0  # 仅提示，不阻止


def main():
    """主函数：从stdin读取JSON，执行验证"""
    try:
        # 从stdin读取JSON
        json_str = sys.stdin.read()

        if not json_str.strip():
            sys.exit(0)

        # 解析JSON
        hook_input = json.loads(json_str)

        # 执行验证
        exit_code = validate_research(hook_input)
        sys.exit(exit_code)

    except json.JSONDecodeError:
        # JSON解析失败，允许操作
        sys.exit(0)
    except Exception:
        # 任何其他错误，允许操作（不阻止用户）
        sys.exit(0)


if __name__ == '__main__':
    main()
