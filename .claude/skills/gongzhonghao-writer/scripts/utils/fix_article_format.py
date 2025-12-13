#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
文章格式智能修复脚本
- 修复分隔线(---)前面没有空行的问题（防止大字bug）
- 同话题内容连在一起，换话题才空行
"""

import re
from typing import List


def fix_separator_lines(content: str) -> str:
    """
    修复分隔线前面没有空行的问题

    问题原因：在某些Markdown渲染器中（如飞书/微信公众号编辑器），
    如果`---`前面没有空行，会把前一行解释为Setext风格的标题，
    导致前一行变成大字标题。

    修复规则：
    - 如果`---`前面不是空行，在前面添加一个空行
    - 保持`---`后面的格式不变
    """
    lines = content.split('\n')
    fixed_lines = []

    for i, line in enumerate(lines):
        # 检查当前行是否是分隔线
        if line.strip() == '---':
            # 检查前一行是否是空行
            if i > 0 and fixed_lines and fixed_lines[-1].strip() != '':
                # 前一行不是空行，添加一个空行
                fixed_lines.append('')

        fixed_lines.append(line)

    return '\n'.join(fixed_lines)


def fix_heading_spacing(content: str) -> str:
    """
    修复标题后面的空行问题

    规则：
    - 标题(##)后面紧跟正文，不要空行
    - 分隔线后的标题也不空行
    """
    # 移除标题后的多余空行（保留1个空行变成0个）
    # 匹配：## 标题\n\n正文 -> ## 标题\n正文
    content = re.sub(r'(^##[^\n]+)\n\n([^#\n])', r'\1\n\2', content, flags=re.MULTILINE)

    return content


def smart_fix_article(content: str) -> str:
    """
    智能修复文章格式

    修复内容：
    1. 分隔线(---)前面必须有空行（防止大字bug）
    2. 标题后面不要多余空行
    """
    # 1. 修复分隔线前的空行
    content = fix_separator_lines(content)

    # 2. 修复标题后的空行（可选，当前注释掉，因为可能影响阅读体验）
    # content = fix_heading_spacing(content)

    return content


def main():
    """命令行入口"""
    import sys

    if len(sys.argv) < 2:
        print("用法: python fix_article_format.py <文章路径>")
        print("示例: python fix_article_format.py articles/2025-12-05_xxx.md")
        sys.exit(1)

    file_path = sys.argv[1]

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        fixed_content = smart_fix_article(content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)

        print(f"✓ 格式修复完成：{file_path}")

    except FileNotFoundError:
        print(f"错误：文件不存在 {file_path}")
        sys.exit(1)
    except Exception as e:
        print(f"错误：{e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
