#!/usr/bin/env python3
"""
整合教程备份文件脚本
去除重复内容,重组章节,生成清晰的教程文档
"""

import re
from pathlib import Path
from collections import defaultdict

def read_file(filepath):
    """读取文件内容"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    """写入文件内容"""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def extract_sections(content):
    """提取章节结构"""
    lines = content.split('\n')
    sections = []
    current_section = {'level': 0, 'title': '', 'content': [], 'line_start': 0}

    for i, line in enumerate(lines):
        # 匹配标题
        match = re.match(r'^(#{1,6})\s+(.+)$', line)
        if match:
            if current_section['content']:
                sections.append(current_section)

            level = len(match.group(1))
            title = match.group(2).strip()
            current_section = {
                'level': level,
                'title': title,
                'content': [line],
                'line_start': i
            }
        else:
            current_section['content'].append(line)

    if current_section['content']:
        sections.append(current_section)

    return sections

def deduplicate_sections(sections):
    """去除重复章节"""
    seen_titles = {}
    unique_sections = []
    duplicates_removed = []

    for section in sections:
        key = f"{section['level']}:{section['title']}"

        if key not in seen_titles:
            seen_titles[key] = section
            unique_sections.append(section)
        else:
            # 保留内容更长的版本
            existing = seen_titles[key]
            if len('\n'.join(section['content'])) > len('\n'.join(existing['content'])):
                # 替换为更详细的版本
                idx = unique_sections.index(existing)
                unique_sections[idx] = section
                seen_titles[key] = section
                duplicates_removed.append(f"{key} (保留更详细版本)")
            else:
                duplicates_removed.append(key)

    return unique_sections, duplicates_removed

def organize_sections(sections, doc_type):
    """重组章节结构"""
    organized = []

    if doc_type == 'installation':
        # 环境搭建指南的组织结构
        order = [
            'Claude Code简介',
            'Node.js环境准备',
            '系统要求检查',
            'Anthropic API配置',
            'Claude Code安装',
            '验证与测试',
            '常见问题',
            '故障排查'
        ]
    else:  # basic_usage
        # 基础使用指南的组织结构
        order = [
            '命令速查表',
            '基础命令',
            '交互模式',
            '配置管理',
            '诊断工具',
            '高级功能',
            '最佳实践'
        ]

    # 按照预定顺序组织
    for category in order:
        matching = [s for s in sections if category.lower() in s['title'].lower()]
        organized.extend(matching)

    # 添加未匹配的章节
    organized_titles = {s['title'] for s in organized}
    remaining = [s for s in sections if s['title'] not in organized_titles]
    organized.extend(remaining)

    return organized

def clean_content(content):
    """清理内容,去除多余空行和格式问题"""
    lines = content.split('\n')
    cleaned = []
    prev_empty = False

    for line in lines:
        is_empty = not line.strip()

        # 最多连续两个空行
        if is_empty and prev_empty:
            continue

        cleaned.append(line)
        prev_empty = is_empty

    return '\n'.join(cleaned)

def generate_toc(sections):
    """生成目录"""
    toc = ["## 📋 目录\n"]

    for section in sections:
        if section['level'] == 1:
            continue  # 跳过文档标题

        indent = "  " * (section['level'] - 2)
        title = section['title']
        # 生成锚点链接
        anchor = re.sub(r'[^\w\u4e00-\u9fff-]', '', title.lower().replace(' ', '-'))
        toc.append(f"{indent}- [{title}](#{anchor})")

    toc.append("\n---\n")
    return '\n'.join(toc)

def process_backup1(input_path, output_path):
    """处理备份1 - 环境与安装"""
    print(f"\n处理 {input_path.name}...".encode('utf-8', errors='ignore').decode('utf-8'))

    content = read_file(input_path)
    original_lines = len(content.split('\n'))

    # 提取章节
    sections = extract_sections(content)
    print(f"  提取到 {len(sections)} 个章节".encode('utf-8', errors='ignore').decode('utf-8'))

    # 去重
    unique_sections, duplicates = deduplicate_sections(sections)
    print(f"  去除 {len(duplicates)} 个重复章节".encode('utf-8', errors='ignore').decode('utf-8'))

    # 重组
    organized = organize_sections(unique_sections, 'installation')

    # 生成新文档
    header = """# Claude Code环境搭建完全指南

**版本**: v2.0
**更新**: 2025年12月
**难度**: ⭐ 零基础入门
**预计学时**: 4小时

---

## 📚 学习目标

完成本指南学习后,你将能够:

1. ✅ 理解Claude Code的核心价值与应用场景
2. ✅ 在任意操作系统上正确安装Node.js运行环境
3. ✅ 获取并配置Anthropic API密钥
4. ✅ 成功安装Claude Code并通过验证测试
5. ✅ 独立解决90%的常见安装问题
6. ✅ 掌握环境诊断与故障排查技能

---

"""

    # 生成目录
    toc = generate_toc(organized)

    # 组装内容
    body = '\n'.join('\n'.join(s['content']) for s in organized)
    body = clean_content(body)

    final_content = header + toc + body
    final_lines = len(final_content.split('\n'))

    # 写入文件
    write_file(output_path, final_content)

    print(f"  ✓ 生成完成: {output_path.name}")
    print(f"  原始行数: {original_lines}")
    print(f"  最终行数: {final_lines}")
    print(f"  压缩率: {(1 - final_lines/original_lines)*100:.1f}%")

    return duplicates

def process_backup2(input_path, output_path):
    """处理备份2 - 基础使用"""
    print(f"\n处理 {input_path.name}...")

    content = read_file(input_path)
    original_lines = len(content.split('\n'))

    # 提取章节
    sections = extract_sections(content)
    print(f"  提取到 {len(sections)} 个章节")

    # 去重
    unique_sections, duplicates = deduplicate_sections(sections)
    print(f"  去除 {len(duplicates)} 个重复章节")

    # 重组
    organized = organize_sections(unique_sections, 'basic_usage')

    # 生成新文档
    header = """# Claude Code基础使用完全指南

**版本**: v2.0
**更新**: 2025年12月
**难度**: ⭐⭐ 基础进阶
**预计学时**: 6小时

---

## 📚 学习目标

完成本指南学习后,你将能够:

1. ✅ 掌握Claude Code所有核心命令的使用方法
2. ✅ 熟练使用交互模式进行开发协作
3. ✅ 理解并配置项目级与全局级配置
4. ✅ 使用诊断工具解决常见问题
5. ✅ 运用高级功能提升开发效率
6. ✅ 建立Claude Code开发最佳实践

---

"""

    # 生成目录
    toc = generate_toc(organized)

    # 组装内容
    body = '\n'.join('\n'.join(s['content']) for s in organized)
    body = clean_content(body)

    final_content = header + toc + body
    final_lines = len(final_content.split('\n'))

    # 写入文件
    write_file(output_path, final_content)

    print(f"  ✓ 生成完成: {output_path.name}")
    print(f"  原始行数: {original_lines}")
    print(f"  最终行数: {final_lines}")
    print(f"  压缩率: {(1 - final_lines/original_lines)*100:.1f}%")

    return duplicates

def main():
    """主函数"""
    base_path = Path(__file__).parent

    # 输入文件
    backup1 = base_path / "01-环境与安装" / "备份1.md"
    backup2 = base_path / "02-基础使用" / "备份2.md"

    # 输出文件
    output1 = base_path / "01-环境与安装" / "Claude Code环境搭建完全指南.md"
    output2 = base_path / "02-基础使用" / "Claude Code基础使用完全指南.md"

    print("=" * 60)
    print("Claude Code教程整合工具 v1.0")
    print("=" * 60)

    # 处理备份1
    duplicates1 = process_backup1(backup1, output1)

    # 处理备份2
    duplicates2 = process_backup2(backup2, output2)

    # 总结报告
    print("\n" + "=" * 60)
    print("整合完成报告")
    print("=" * 60)

    print(f"\n📄 文件1: 环境搭建指南")
    print(f"  去除重复: {len(duplicates1)} 个章节")
    if duplicates1[:5]:
        print(f"  示例: {duplicates1[0]}")

    print(f"\n📄 文件2: 基础使用指南")
    print(f"  去除重复: {len(duplicates2)} 个章节")
    if duplicates2[:5]:
        print(f"  示例: {duplicates2[0]}")

    print("\n✅ 所有文件已生成!")
    print(f"\n输出位置:")
    print(f"  - {output1}")
    print(f"  - {output2}")

    print("\n📋 下一步:")
    print("  1. 检查生成的文档内容")
    print("  2. 确认无误后删除备份文件")
    print("  3. 运行: del 备份1.md 备份2.md")

if __name__ == "__main__":
    main()
