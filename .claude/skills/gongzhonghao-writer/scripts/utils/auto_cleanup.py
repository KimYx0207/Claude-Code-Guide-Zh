#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动清理脚本 V1.0
功能：清理项目中的冗余文件、废弃代码、过期备份

使用：
    python auto_cleanup.py [--dry-run]
"""

import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
from typing import List, Tuple

def find_redundant_files(project_root: Path) -> List[Tuple[Path, str]]:
    """
    查找冗余文件

    Returns:
        List of (file_path, reason)
    """
    redundant = []

    # 1. 查找备份文件
    for pattern in ['*_backup.*', '*_old.*', '*.bak', '*_v1.*', '*~']:
        for file in project_root.rglob(pattern):
            redundant.append((file, '备份文件'))

    # 2. 查找临时文件
    for pattern in ['*.tmp', '*.temp', '.DS_Store', 'Thumbs.db']:
        for file in project_root.rglob(pattern):
            redundant.append((file, '临时文件'))

    # 3. 查找过期日志
    log_dir = project_root / 'logs'
    if log_dir.exists():
        cutoff_date = datetime.now() - timedelta(days=30)
        for log_file in log_dir.glob('*.log'):
            if datetime.fromtimestamp(log_file.stat().st_mtime) < cutoff_date:
                redundant.append((log_file, '30天前日志'))

    # 4. 查找空目录
    for item in project_root.rglob('*'):
        if item.is_dir() and not any(item.iterdir()):
            redundant.append((item, '空目录'))

    return redundant


def find_redundant_code(scripts_dir: Path) -> List[Tuple[Path, str]]:
    """
    查找冗余代码

    Returns:
        List of (file_path, reason)
    """
    redundant = []

    # 1. 检查deprecated目录
    deprecated_dir = scripts_dir / 'deprecated'
    if deprecated_dir.exists():
        for py_file in deprecated_dir.glob('*.py'):
            # 检查是否超过60天未修改
            mtime = datetime.fromtimestamp(py_file.stat().st_mtime)
            if datetime.now() - mtime > timedelta(days=60):
                redundant.append((py_file, '60天未修改的废弃代码'))

    return redundant


def cleanup_files(files: List[Tuple[Path, str]], dry_run: bool = True) -> None:
    """
    清理文件

    Args:
        files: 待清理文件列表
        dry_run: True=仅显示，False=实际删除
    """
    if not files:
        print('✓ 没有发现冗余文件')
        return

    print(f'\n发现 {len(files)} 个冗余文件：\n')

    for file_path, reason in files:
        if dry_run:
            print(f'[DRY-RUN] 将删除: {file_path} ({reason})')
        else:
            try:
                if file_path.is_dir():
                    file_path.rmdir()
                else:
                    file_path.unlink()
                print(f'✓ 已删除: {file_path} ({reason})')
            except Exception as e:
                print(f'✗ 删除失败: {file_path} - {e}')

    if dry_run:
        print(f'\n提示：使用 --execute 参数实际执行删除')


def main():
    """主函数"""
    dry_run = '--execute' not in sys.argv

    # 项目根目录
    project_root = Path(__file__).parent.parent.parent.parent

    print('='*60)
    print('自动清理脚本 V1.0')
    print('='*60)
    print(f'项目根目录: {project_root}')
    print(f'模式: {"DRY-RUN（仅显示）" if dry_run else "EXECUTE（实际删除）"}')
    print('='*60)

    # 查找冗余文件
    print('\n1. 扫描冗余文件...')
    redundant_files = find_redundant_files(project_root)

    # 查找冗余代码
    print('\n2. 扫描冗余代码...')
    scripts_dir = project_root / '.claude/skills/gongzhonghao-writer/scripts'
    redundant_code = find_redundant_code(scripts_dir)

    # 合并清理列表
    all_redundant = redundant_files + redundant_code

    # 执行清理
    cleanup_files(all_redundant, dry_run)

    print('\n' + '='*60)
    print(f'清理完成！共处理 {len(all_redundant)} 个项目')
    print('='*60)


if __name__ == '__main__':
    main()
