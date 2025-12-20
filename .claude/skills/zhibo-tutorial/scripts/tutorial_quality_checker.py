#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
直播教程质量检查器

功能：检查教程文档是否符合写作规范
使用方法：python tutorial_quality_checker.py <markdown文件路径>
"""

import re
import sys
import json
from pathlib import Path
from typing import Dict, List, Tuple

# 加载配置
SCRIPT_DIR = Path(__file__).parent
CONFIG_PATH = SCRIPT_DIR.parent / "config" / "tutorial_config.json"

def load_config() -> Dict:
    """加载配置文件"""
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def check_course_info(content: str) -> Tuple[bool, List[str]]:
    """检查课程信息框是否完整"""
    issues = []
    required_fields = ["预计学时", "难度等级", "更新日期", "适用版本", "信息验证"]

    # 查找课程信息块
    info_match = re.search(r'>\s*\*\*课程信息\*\*.*?(?=\n\n|\n##)', content, re.DOTALL)

    if not info_match:
        issues.append("❌ 缺少课程信息框")
        return False, issues

    info_block = info_match.group()

    for field in required_fields:
        if field not in info_block:
            issues.append(f"❌ 课程信息框缺少：{field}")

    passed = len(issues) == 0
    if passed:
        issues.append("✅ 课程信息框完整")

    return passed, issues

def check_terminology(content: str, config: Dict) -> Tuple[bool, List[str]]:
    """检查术语表"""
    issues = []
    min_count = config.get("quality_standards", {}).get("terminology", {}).get("min_count", 10)

    # 查找术语表
    term_section = re.search(r'##\s*术语表.*?(?=\n##|\Z)', content, re.DOTALL)

    if not term_section:
        issues.append("❌ 缺少术语表章节")
        return False, issues

    term_content = term_section.group()

    # 计算术语数量（查找**术语**模式）
    terms = re.findall(r'\*\*([^*]+)\*\*\s*\n\*\*英文全称\*\*', term_content)
    term_count = len(terms)

    if term_count < min_count:
        issues.append(f"❌ 术语数量不足：当前{term_count}个，需要至少{min_count}个")
    else:
        issues.append(f"✅ 术语数量达标：{term_count}个")

    # 检查术语格式
    required_fields = ["英文全称", "通俗解释", "生活类比"]
    for field in required_fields:
        if field not in term_content:
            issues.append(f"⚠️ 术语表可能缺少字段：{field}")

    return term_count >= min_count, issues

def check_verification_methods(content: str) -> Tuple[bool, List[str]]:
    """检查验证方法"""
    issues = []

    # 查找安装/配置步骤
    steps = re.findall(r'###\s*(步骤\d+|[0-9]+\.[0-9]+).*?(?=\n###|\n##|\Z)', content, re.DOTALL)

    if not steps:
        issues.append("⚠️ 未找到步骤章节")
        return True, issues

    # 检查每个步骤是否有验证方法
    verification_patterns = [
        r'验证.*成功',
        r'预期输出',
        r'如果.*成功'
    ]

    verified_count = 0
    for step in steps:
        has_verification = any(re.search(p, step, re.IGNORECASE) for p in verification_patterns)
        if has_verification:
            verified_count += 1

    if verified_count < len(steps):
        issues.append(f"⚠️ 部分步骤缺少验证方法：{verified_count}/{len(steps)}")
    else:
        issues.append(f"✅ 所有步骤都有验证方法：{verified_count}个")

    return verified_count == len(steps), issues

def check_format_rules(content: str) -> Tuple[bool, List[str]]:
    """检查格式规范（标准Markdown）"""
    issues = []
    all_passed = True

    # 检查代码块语言标注（这是必须的）
    code_blocks = re.findall(r'```(\w*)\n', content)
    unlabeled = [b for b in code_blocks if not b]
    if unlabeled:
        issues.append(f"⚠️ 发现{len(unlabeled)}个代码块未标注语言")
        all_passed = False
    else:
        issues.append("✅ 所有代码块都标注了语言")

    # 检查是否有表格（信息提示，不是错误）
    table_match = re.search(r'\|.*\|.*\|\n\|[-:| ]+\|', content)
    if table_match:
        issues.append("✅ 使用了Markdown表格展示对比信息")

    # 检查是否有分隔线（信息提示，不是错误）
    hr_match = re.search(r'\n---\n', content)
    if hr_match:
        issues.append("✅ 使用了分隔线分隔章节")

    return all_passed, issues

def check_error_handling(content: str) -> Tuple[bool, List[str]]:
    """检查错误处理"""
    issues = []

    # 检查是否有错误处理章节
    error_patterns = [
        r'如果失败',
        r'如果出错',
        r'常见问题',
        r'故障排查',
        r'解决方案',
        r'错误\d*[：:]'
    ]

    error_count = sum(1 for p in error_patterns if re.search(p, content))

    if error_count >= 3:
        issues.append(f"✅ 错误处理内容充分：匹配{error_count}个模式")
    elif error_count > 0:
        issues.append(f"⚠️ 错误处理内容较少：匹配{error_count}个模式")
    else:
        issues.append("❌ 缺少错误处理内容")

    return error_count >= 3, issues

def check_xiaobai_friendly(content: str) -> Tuple[bool, List[str]]:
    """检查小白友好程度"""
    issues = []

    # 检查说明标记使用
    markers = {
        "💡": "提示/说明",
        "⚠️": "警告/注意",
        "❌": "错误做法",
        "✅": "正确做法"
    }

    marker_counts = {}
    for marker, name in markers.items():
        count = content.count(marker)
        marker_counts[name] = count

    tip_count = marker_counts.get("提示/说明", 0)
    if tip_count >= 5:
        issues.append(f"✅ 使用了足够的💡说明标记：{tip_count}个")
    elif tip_count > 0:
        issues.append(f"⚠️ 💡说明标记较少：{tip_count}个（建议至少5个）")
    else:
        issues.append("❌ 缺少💡说明标记")

    # 检查"这是什么"解释
    what_is_count = len(re.findall(r'(这是什么|什么是)', content, re.IGNORECASE))
    if what_is_count >= 3:
        issues.append(f"✅ 包含\"这是什么\"解释：{what_is_count}处")
    else:
        issues.append(f"⚠️ \"这是什么\"解释较少：{what_is_count}处")

    return tip_count >= 5, issues

def generate_report(results: Dict[str, Tuple[bool, List[str]]]) -> str:
    """生成检查报告"""
    report = []
    report.append("=" * 50)
    report.append("📋 直播教程质量检查报告")
    report.append("=" * 50)
    report.append("")

    total_checks = len(results)
    passed_checks = sum(1 for passed, _ in results.values() if passed)

    for check_name, (passed, issues) in results.items():
        status = "✅ 通过" if passed else "❌ 需改进"
        report.append(f"## {check_name} [{status}]")
        for issue in issues:
            report.append(f"  {issue}")
        report.append("")

    report.append("=" * 50)
    score = int(passed_checks / total_checks * 100) if total_checks > 0 else 0
    report.append(f"📊 总体评分：{score}分 ({passed_checks}/{total_checks}项通过)")

    if score >= 80:
        report.append("🎉 质量达标！可以发布。")
    elif score >= 60:
        report.append("⚠️ 基本达标，建议优化后发布。")
    else:
        report.append("❌ 需要大幅改进后才能发布。")

    report.append("=" * 50)

    return "\n".join(report)

def check_tutorial(file_path: str) -> str:
    """主检查函数"""
    config = load_config()

    # 读取文件
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 执行各项检查
    results = {}
    results["1. 课程信息框"] = check_course_info(content)
    results["2. 术语表"] = check_terminology(content, config)
    results["3. 验证方法"] = check_verification_methods(content)
    results["4. 格式规范"] = check_format_rules(content)
    results["5. 错误处理"] = check_error_handling(content)
    results["6. 小白友好"] = check_xiaobai_friendly(content)

    return generate_report(results)

def main():
    # 设置Windows控制台UTF-8编码
    if sys.platform == 'win32':
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

    if len(sys.argv) < 2:
        print("使用方法: python tutorial_quality_checker.py <markdown文件路径>")
        print("\n示例:")
        print("  python tutorial_quality_checker.py 教程/Claude-Code安装指南.md")
        sys.exit(1)

    file_path = sys.argv[1]

    if not Path(file_path).exists():
        print(f"错误：文件不存在 - {file_path}")
        sys.exit(1)

    report = check_tutorial(file_path)
    print(report)

if __name__ == "__main__":
    main()
