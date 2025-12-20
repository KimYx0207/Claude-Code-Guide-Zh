#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
飞书格式规范修正脚本（完整版）
根据 format-rules.md 的规范批量修正文章格式
"""

import re
import sys
import io
from pathlib import Path
from typing import List

# 设置标准输出为UTF-8编码
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')


def remove_separator_lines(content: str) -> str:
    """
    删除所有 --- 分隔线
    飞书规范：不要使用---分隔线，直接用##标题分隔章节
    """
    lines = content.split('\n')
    result = []

    for i, line in enumerate(lines):
        # 跳过纯 --- 分隔线
        if line.strip() == '---':
            continue
        result.append(line)

    return '\n'.join(result)


def fix_heading_spacing(content: str) -> str:
    """
    修复标题后的空行
    飞书规范：标题后不空行，紧贴正文
    """
    # 移除## 标题后的空行
    content = re.sub(r'(^##[^\n]+)\n\n+', r'\1\n', content, flags=re.MULTILINE)
    return content


def fix_code_block_spacing(content: str) -> str:
    """
    修复代码块前的空行
    飞书规范：代码块前不留空行
    """
    # 移除代码块前的空行
    content = re.sub(r'\n\n+(```)', r'\n\1', content)
    return content


def fix_numbering_format(content: str) -> str:
    """
    修复序号格式
    飞书规范：使用 1、2、3、 而不是 1. 2. 3.
    """
    lines = content.split('\n')
    result = []

    for line in lines:
        # 匹配行首的数字序号格式 "1. " "2. " 等
        # 但要排除代码块和表格
        if re.match(r'^\d+\.\s', line) and not line.strip().startswith('|'):
            # 替换为中文顿号格式
            line = re.sub(r'^(\d+)\.\s', r'\1、', line)

        result.append(line)

    return '\n'.join(result)


def convert_tables_to_list(content: str) -> str:
    """
    将Markdown表格转换为列表格式
    飞书规范：禁止使用Markdown表格
    """
    lines = content.split('\n')
    result = []
    in_table = False
    table_headers = []

    i = 0
    while i < len(lines):
        line = lines[i]

        # 检测表格开始（包含 | 的行）
        if '|' in line and not in_table:
            # 可能是表格头
            if i + 1 < len(lines) and '|' in lines[i + 1] and '---' in lines[i + 1]:
                in_table = True
                # 解析表格头
                table_headers = [cell.strip() for cell in line.split('|') if cell.strip()]
                # 跳过分隔行
                i += 2
                continue

        # 处理表格行
        if in_table and '|' in line:
            cells = [cell.strip() for cell in line.split('|') if cell.strip()]
            if cells:
                # 转换为列表格式
                result.append('')  # 空行分隔
                for j, cell in enumerate(cells):
                    if j < len(table_headers):
                        result.append(f'**{table_headers[j]}**：{cell}')
                result.append('')  # 空行分隔
        elif in_table and '|' not in line:
            # 表格结束
            in_table = False
            result.append(line)
        else:
            result.append(line)

        i += 1

    return '\n'.join(result)


def fix_bold_format(content: str) -> str:
    """
    修复加粗格式
    飞书规范：加粗要独立成行或整句加粗
    注意：这个比较复杂，暂时保守处理
    """
    # 暂时保留原样，手动修复加粗
    return content


def clean_multiple_blank_lines(content: str) -> str:
    """
    清理连续多个空行（超过2个空行的压缩为2个）
    """
    content = re.sub(r'\n{4,}', '\n\n\n', content)
    return content


def fix_feishu_format(content: str) -> str:
    """
    完整的飞书格式修正
    """
    # 1. 删除 --- 分隔线
    content = remove_separator_lines(content)

    # 2. 修复标题后的空行
    content = fix_heading_spacing(content)

    # 3. 修复代码块前的空行
    content = fix_code_block_spacing(content)

    # 4. 修复序号格式
    content = fix_numbering_format(content)

    # 5. 转换表格为列表
    content = convert_tables_to_list(content)

    # 6. 清理多余空行
    content = clean_multiple_blank_lines(content)

    return content


def process_file(file_path: Path, output_dir: Path = None) -> None:
    """处理单个文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        fixed_content = fix_feishu_format(content)

        # 确定输出路径
        if output_dir:
            output_path = output_dir / file_path.name
            output_dir.mkdir(parents=True, exist_ok=True)
        else:
            output_path = file_path

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(fixed_content)

        print(f"✅ 已修正：{file_path.name}")

    except Exception as e:
        print(f"❌ 失败：{file_path.name} - {e}")


def main():
    """命令行入口"""
    if len(sys.argv) < 2:
        print("用法：")
        print("  单文件：python fix_feishu_format.py <文件路径>")
        print("  批量处理：python fix_feishu_format.py <目录路径> [输出目录]")
        print("\n示例：")
        print("  python fix_feishu_format.py docs/课程资料包/01-环境与安装/系统要求与准备.md")
        print("  python fix_feishu_format.py docs/课程资料包 docs/课程资料包-飞书版")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    output_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else None

    if input_path.is_file():
        # 处理单个文件
        process_file(input_path, output_dir)
    elif input_path.is_dir():
        # 批量处理目录
        md_files = list(input_path.rglob('*.md'))
        print(f"找到 {len(md_files)} 个Markdown文件")
        print(f"输出目录：{output_dir or '原地修改'}")
        print()

        for md_file in md_files:
            if output_dir:
                # 保持相对路径结构
                rel_path = md_file.relative_to(input_path)
                out_dir = output_dir / rel_path.parent
                process_file(md_file, out_dir)
            else:
                process_file(md_file)

        print(f"\n✅ 批量修正完成！共处理 {len(md_files)} 个文件")
    else:
        print(f"❌ 错误：路径不存在 {input_path}")
        sys.exit(1)


if __name__ == "__main__":
    main()
