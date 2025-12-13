#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
文章文件名验证器
确保文件名严格符合规范：YYYY-MM-DD_[分类]_[时效]_[品牌]_标题.md

用法：
    python filename_validator.py "文件名.md"
    python filename_validator.py --check-dir "articles/"
"""

import re
import sys
import io
from pathlib import Path
from datetime import datetime

# Windows编码修复
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 规范定义
VALID_CATEGORIES = ["核心", "泛AI"]
VALID_TIMELINESS = ["热点", "常青"]
VALID_BRANDS = [
    # 核心工具池TOP品牌（来自baokuan-rules.md）
    "Kimi", "月之暗面",
    "Google", "Gemini",
    "ByteDance", "字节", "即梦", "豆包",
    "Anthropic", "Claude",
    "Cursor",
    "Codex", "OpenAI", "ChatGPT", "GPT",
    "Microsoft", "微软", "Copilot",
    "Midjourney", "MJ",
    "Suno",
    "Lovart",
    "NotebookLM",
    "Perplexity",
    "Windsurf",
    "Bolt",
    "v0",
    # 其他常见品牌
    "JetBrains",
    "Apple",
    "Meta",
    "DeepSeek",
    "智谱", "GLM",
    "百度", "文心",
    "阿里", "通义",
]

# 文件名正则
FILENAME_PATTERN = r"^(\d{4}-\d{2}-\d{2})_(核心|泛AI)_(热点|常青)_([^_]+)_(.+)\.md$"


def validate_filename(filename: str) -> dict:
    """
    验证文件名是否符合规范

    Args:
        filename: 文件名（不含路径）

    Returns:
        {
            "valid": bool,
            "errors": list[str],
            "parsed": dict or None
        }
    """
    errors = []
    parsed = None

    # 匹配正则
    match = re.match(FILENAME_PATTERN, filename)

    if not match:
        errors.append(f"文件名格式错误！")
        errors.append(f"当前：{filename}")
        errors.append(f"规范：YYYY-MM-DD_[分类]_[时效]_[品牌]_标题.md")
        errors.append(f"示例：2025-12-12_核心_热点_Cursor_Cursor2.2更新Debug Mode来了.md")
        return {"valid": False, "errors": errors, "parsed": None}

    date_str, category, timeliness, brand, title = match.groups()

    # 验证日期格式
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d")
        if date > datetime.now():
            errors.append(f"日期不能是未来：{date_str}")
    except ValueError:
        errors.append(f"日期格式错误：{date_str}，应为YYYY-MM-DD")

    # 验证分类
    if category not in VALID_CATEGORIES:
        errors.append(f"分类错误：{category}，应为：{VALID_CATEGORIES}")

    # 验证时效性
    if timeliness not in VALID_TIMELINESS:
        errors.append(f"时效性错误：{timeliness}，应为：{VALID_TIMELINESS}")

    # 验证品牌（宽松匹配，只警告不报错）
    brand_matched = any(b.lower() in brand.lower() for b in VALID_BRANDS)
    if not brand_matched:
        # 只是警告，不算错误
        pass

    # 验证标题
    if len(title) < 5:
        errors.append(f"标题太短：{title}，至少5个字符")
    if len(title) > 100:
        errors.append(f"标题太长：{len(title)}字符，建议100字符以内")

    parsed = {
        "date": date_str,
        "category": category,
        "timeliness": timeliness,
        "brand": brand,
        "title": title
    }

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "parsed": parsed
    }


def suggest_filename(title: str, brand: str, category: str = "核心", timeliness: str = "热点") -> str:
    """
    根据标题生成规范文件名

    Args:
        title: 文章标题
        brand: 品牌词
        category: 分类（核心/泛AI）
        timeliness: 时效性（热点/常青）

    Returns:
        规范的文件名
    """
    today = datetime.now().strftime("%Y-%m-%d")

    # 清理标题中的特殊字符
    clean_title = re.sub(r'[\\/:*?"<>|，。！？、；：""''（）【】]', '', title)
    clean_title = clean_title.strip()

    return f"{today}_{category}_{timeliness}_{brand}_{clean_title}.md"


def check_directory(dir_path: str) -> list:
    """
    检查目录下所有md文件的命名规范

    Args:
        dir_path: 目录路径

    Returns:
        不符合规范的文件列表
    """
    path = Path(dir_path)
    invalid_files = []

    for md_file in path.glob("*.md"):
        result = validate_filename(md_file.name)
        if not result["valid"]:
            invalid_files.append({
                "file": md_file.name,
                "errors": result["errors"]
            })

    return invalid_files


def main():
    if len(sys.argv) < 2:
        print("用法：")
        print("  python filename_validator.py '文件名.md'")
        print("  python filename_validator.py --check-dir 'articles/'")
        print("  python filename_validator.py --suggest '标题' '品牌'")
        sys.exit(1)

    if sys.argv[1] == "--check-dir":
        if len(sys.argv) < 3:
            print("请指定目录路径")
            sys.exit(1)

        invalid_files = check_directory(sys.argv[2])

        if not invalid_files:
            print("✅ 所有文件命名规范！")
        else:
            print(f"❌ 发现 {len(invalid_files)} 个文件命名不规范：\n")
            for item in invalid_files:
                print(f"📄 {item['file']}")
                for err in item['errors']:
                    print(f"   ⚠️ {err}")
                print()
            sys.exit(1)

    elif sys.argv[1] == "--suggest":
        if len(sys.argv) < 4:
            print("用法：python filename_validator.py --suggest '标题' '品牌' [分类] [时效]")
            sys.exit(1)

        title = sys.argv[2]
        brand = sys.argv[3]
        category = sys.argv[4] if len(sys.argv) > 4 else "核心"
        timeliness = sys.argv[5] if len(sys.argv) > 5 else "热点"

        suggested = suggest_filename(title, brand, category, timeliness)
        print(f"✅ 建议文件名：{suggested}")

    else:
        filename = sys.argv[1]
        result = validate_filename(filename)

        if result["valid"]:
            print(f"✅ 文件名规范！")
            print(f"   日期：{result['parsed']['date']}")
            print(f"   分类：{result['parsed']['category']}")
            print(f"   时效：{result['parsed']['timeliness']}")
            print(f"   品牌：{result['parsed']['brand']}")
            print(f"   标题：{result['parsed']['title']}")
        else:
            print("❌ 文件名不规范！\n")
            for err in result["errors"]:
                print(f"   ⚠️ {err}")
            sys.exit(1)


if __name__ == "__main__":
    main()
