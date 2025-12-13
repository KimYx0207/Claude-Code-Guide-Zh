# -*- coding: utf-8 -*-
"""
数据同步检查器 V1.0
检查 rule_validation_report.json 与所有依赖文件的版本一致性

使用方法：
    python check_data_sync.py

返回：
    - 版本一致：显示绿色 ✅
    - 版本不一致：显示红色 ❌ 并列出需要更新的文件
"""

import os
import re
import json
from pathlib import Path
from typing import Dict, List, Tuple
from dataclasses import dataclass


@dataclass
class FileCheckResult:
    """文件检查结果"""
    file_path: str
    expected_version: str
    found_version: str
    is_synced: bool
    priority: str  # P0/P1


class DataSyncChecker:
    """数据同步检查器"""

    # 依赖文件清单（相对于skills目录）
    # V7.2.1架构重组后的路径
    DEPENDENT_FILES = {
        "P0": [
            ("prompts/rules/baokuan-formulas.md", "规范文档"),
            ("scripts/core/title_scorer.py", "标题评分器"),
            ("scripts/core/title_generator.py", "标题生成器"),
            ("../../commands/core/01-write.md", "写作命令"),
            ("../../commands/core/02-write-auto.md", "自动写作命令"),
        ],
        "P1": [
            ("scripts/core/quality_detector.py", "质量检测器"),
            ("scripts/core/topic_filter.py", "选题过滤器"),
            ("../../commands/quality/21-title-gen.md", "标题生成命令"),
            ("../../commands/quality/22-title-score.md", "标题评分命令"),
        ],
    }

    # 版本号匹配模式
    VERSION_PATTERNS = [
        r"V7\.1",                           # V7.1
        r"version.*7\.1",                   # version: 7.1
        r"data_version.*V7\.1",             # data_version: V7.1
        r"2025-12-09",                      # 日期
        r"rule_validation_report.*V7\.1",   # 完整引用
    ]

    def __init__(self, base_path: str = None):
        """
        初始化检查器

        Args:
            base_path: 基础路径（默认为脚本所在目录的父目录）
        """
        if base_path is None:
            # 脚本在 scripts/ 目录下，base_path 应该是 gongzhonghao-writer/
            script_dir = Path(__file__).parent
            self.base_path = script_dir.parent
        else:
            self.base_path = Path(base_path)

        self.expected_version = "V7.1"
        self.results: List[FileCheckResult] = []

    def check_file(self, relative_path: str, description: str, priority: str) -> FileCheckResult:
        """
        检查单个文件的版本

        Args:
            relative_path: 相对路径
            description: 文件描述
            priority: 优先级（P0/P1）

        Returns:
            FileCheckResult
        """
        full_path = self.base_path / relative_path
        found_version = "未找到"
        is_synced = False

        if not full_path.exists():
            found_version = "文件不存在"
        else:
            try:
                content = full_path.read_text(encoding="utf-8")

                # 检查是否包含V7.1版本标识
                for pattern in self.VERSION_PATTERNS:
                    if re.search(pattern, content, re.IGNORECASE):
                        found_version = "V7.1"
                        is_synced = True
                        break

                if not is_synced:
                    # 尝试提取版本号
                    version_match = re.search(r"V(\d+\.\d+)", content)
                    if version_match:
                        found_version = f"V{version_match.group(1)}"
                    else:
                        found_version = "版本不明确"

            except Exception as e:
                found_version = f"读取错误: {e}"

        return FileCheckResult(
            file_path=relative_path,
            expected_version=self.expected_version,
            found_version=found_version,
            is_synced=is_synced,
            priority=priority
        )

    def check_all(self) -> Tuple[List[FileCheckResult], List[FileCheckResult]]:
        """
        检查所有依赖文件

        Returns:
            (synced_files, unsynced_files)
        """
        synced = []
        unsynced = []

        for priority, files in self.DEPENDENT_FILES.items():
            for relative_path, description in files:
                result = self.check_file(relative_path, description, priority)
                if result.is_synced:
                    synced.append(result)
                else:
                    unsynced.append(result)

        return synced, unsynced

    def generate_report(self) -> str:
        """
        生成检查报告

        Returns:
            格式化的报告字符串
        """
        synced, unsynced = self.check_all()

        lines = [
            "=" * 60,
            "📊 数据同步检查报告",
            "=" * 60,
            "",
            f"期望版本: {self.expected_version}",
            f"检查时间: {self._get_timestamp()}",
            "",
        ]

        # 统计
        total = len(synced) + len(unsynced)
        sync_rate = len(synced) / total * 100 if total > 0 else 0

        if sync_rate == 100:
            lines.append("✅ 所有文件版本一致！")
        else:
            lines.append(f"⚠️ 同步率: {sync_rate:.1f}% ({len(synced)}/{total})")

        lines.append("")

        # 未同步文件（需要更新的）
        if unsynced:
            lines.extend([
                "-" * 60,
                "❌ 需要更新的文件:",
                "-" * 60,
            ])

            # 按优先级分组
            p0_files = [r for r in unsynced if r.priority == "P0"]
            p1_files = [r for r in unsynced if r.priority == "P1"]

            if p0_files:
                lines.append("\n🔴 P0 紧急（必须立即更新）:")
                for r in p0_files:
                    lines.append(f"  ❌ {r.file_path}")
                    lines.append(f"     当前: {r.found_version} → 期望: {r.expected_version}")

            if p1_files:
                lines.append("\n🟠 P1 重要（本周更新）:")
                for r in p1_files:
                    lines.append(f"  ⚠️ {r.file_path}")
                    lines.append(f"     当前: {r.found_version} → 期望: {r.expected_version}")

        # 已同步文件
        if synced:
            lines.extend([
                "",
                "-" * 60,
                "✅ 已同步的文件:",
                "-" * 60,
            ])
            for r in synced:
                lines.append(f"  ✅ {r.file_path} ({r.found_version})")

        # 建议
        if unsynced:
            lines.extend([
                "",
                "-" * 60,
                "💡 修复建议:",
                "-" * 60,
                "1. 查看 DATA_DRIVEN_WORKFLOW.md 了解更新流程",
                "2. 按 P0 → P1 优先级顺序更新文件",
                "3. 更新后重新运行此脚本验证",
                "",
                "详细规范: .claude/skills/gongzhonghao-writer/DATA_DRIVEN_WORKFLOW.md",
            ])

        lines.extend([
            "",
            "=" * 60,
        ])

        return "\n".join(lines)

    def _get_timestamp(self) -> str:
        """获取当前时间戳"""
        from datetime import datetime
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def main():
    """命令行入口"""
    import sys

    # 设置stdout编码为utf-8（解决Windows GBK问题）
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding='utf-8')

    checker = DataSyncChecker()
    report = checker.generate_report()
    print(report)

    # 返回退出码（用于CI/CD）
    synced, unsynced = checker.check_all()
    exit_code = 0 if not unsynced else 1
    return exit_code


if __name__ == "__main__":
    exit(main())
