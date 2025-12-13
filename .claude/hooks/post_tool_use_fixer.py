#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PostToolUse Hook - 自动格式修复（重构版）
V7.2.1 - 从BAT架构重构为独立Python脚本

功能：在Write工具保存articles目录下的文章后，自动运行格式修复
优化：消除cmd.exe启动开销，提升跨平台兼容性

使用：
    python post_tool_use_fixer.py < hook_input.json
"""

import sys
import json
import os
from pathlib import Path

def fix_article_format(hook_input: dict) -> int:
    """
    自动修复文章格式

    Args:
        hook_input: Hook输入JSON数据

    Returns:
        0: 成功
    """
    # 获取工具名称和文件路径
    tool_name = hook_input.get('tool_name', '')
    tool_input_data = hook_input.get('tool_input', {})
    file_path = tool_input_data.get('file_path', '')

    # 规范化路径
    file_path_normalized = file_path.replace('\\', '/').replace('//', '/')

    # 检查是否是Write工具 + articles目录 + .md文件
    if tool_name != 'Write':
        return 0

    if '/articles/' not in file_path_normalized:
        return 0

    if not file_path.endswith('.md'):
        return 0

    # 执行格式修复
    print(f'检测到保存文章：{file_path}')
    print('正在执行格式智能修复...')

    # 获取项目根目录
    project_root = Path(os.getenv('CLAUDE_PROJECT_DIR', os.getcwd()))
    scripts_dir = project_root / '.claude/skills/gongzhonghao-writer/scripts'

    # 添加脚本目录到Python路径
    sys.path.insert(0, str(scripts_dir))

    try:
        from fix_article_format import smart_fix_article

        article_path = Path(file_path)
        if not article_path.exists():
            print(f'[WARN] 文件不存在：{file_path}', file=sys.stderr)
            return 0

        # 读取文章内容
        with open(article_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # 执行格式修复
        fixed_content = smart_fix_article(content)

        # 写回文件
        with open(article_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)

        print('✓ 格式修复完成')

    except ImportError:
        print('[INFO] 格式修复模块未安装，跳过')
    except Exception as e:
        print(f'[ERROR] 格式修复失败：{e}', file=sys.stderr)

    return 0


def main():
    """主函数：从stdin读取JSON，执行格式修复"""
    try:
        # 从stdin读取JSON
        json_str = sys.stdin.read()

        if not json_str.strip():
            sys.exit(0)

        # 解析JSON
        hook_input = json.loads(json_str)

        # 执行格式修复
        exit_code = fix_article_format(hook_input)
        sys.exit(exit_code)

    except json.JSONDecodeError:
        sys.exit(0)
    except Exception:
        sys.exit(0)


if __name__ == '__main__':
    main()
