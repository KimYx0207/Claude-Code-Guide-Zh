# -*- coding: utf-8 -*-
"""
数据迁移脚本 - 从JSON迁移到SQLite数据库
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import WeChatDatabase, PROJECT_ROOT
import json
from pathlib import Path
from datetime import datetime


def main():
    print("\n" + "="*60)
    print("微信公众号数据迁移：JSON -> SQLite")
    print("="*60)

    # 初始化数据库（修复：使用PROJECT_ROOT绝对路径）
    db_path = PROJECT_ROOT / "data" / "wechat.db"
    json_path = PROJECT_ROOT / "data" / "wechat_articles.json"

    print(f"\n[配置]")
    print(f"  - JSON文件: {json_path}")
    print(f"  - 数据库文件: {db_path}")

    # 检查JSON文件是否存在
    json_file = Path(json_path)
    if not json_file.exists():
        print(f"\n[ERROR] JSON文件不存在: {json_path}")
        return

    # 读取JSON数据
    print(f"\n[Step 1] 读取JSON数据...")
    with open(json_file, 'r', encoding='utf-8') as f:
        articles = json.load(f)

    print(f"[OK] 读取到 {len(articles)} 篇文章")

    # 获取文件修改时间作为收集时间
    file_mtime = json_file.stat().st_mtime
    collected_at = datetime.fromtimestamp(file_mtime).isoformat()
    print(f"[OK] 设置收集时间为文件修改时间: {collected_at}")

    # 创建数据库
    print(f"\n[Step 2] 初始化数据库...")
    db = WeChatDatabase(db_path)
    print(f"[OK] 数据库已初始化")

    # 开始迁移
    print(f"\n[Step 3] 开始迁移数据...")

    new_count = 0
    updated_count = 0
    error_count = 0

    for i, article in enumerate(articles, 1):
        try:
            # 添加到数据库
            article_id, is_new = db.add_or_update_article(article, collected_at)

            if is_new:
                new_count += 1
            else:
                updated_count += 1

            # 进度显示
            if i % 10 == 0 or i == len(articles):
                print(f"  进度: {i}/{len(articles)} ({i*100//len(articles)}%)")

        except Exception as e:
            error_count += 1
            print(f"  [ERROR] 第{i}篇文章迁移失败: {str(e)}")
            print(f"    标题: {article.get('title', '未知')}")

    # 迁移统计
    print(f"\n" + "="*60)
    print("迁移完成！")
    print("="*60)
    print(f"\n[统计]:")
    print(f"  - 总文章数: {len(articles)}")
    print(f"  - 新增: {new_count}")
    print(f"  - 更新: {updated_count}")
    print(f"  - 失败: {error_count}")

    # 验证数据
    print(f"\n[Step 4] 验证数据...")
    all_articles = db.get_all_articles_latest()
    print(f"[OK] 数据库中共有 {len(all_articles)} 篇文章")

    # 显示Top 5文章
    print(f"\n[Top 5 爆款文章]:")
    top_articles = db.get_top_articles(limit=5)
    for i, article in enumerate(top_articles, 1):
        try:
            print(f"{i}、{article['title']}")
            print(f"   阅读{article['read_count']:,} | 点赞{article['like_count']} | 在看{article['look_count']}")
        except UnicodeEncodeError:
            print(f"{i}、(标题包含特殊字符)")
            print(f"   阅读{article['read_count']:,} | 点赞{article['like_count']} | 在看{article['look_count']}")

    db.close()

    print(f"\n" + "="*60)
    print("[SUCCESS] 数据迁移完成！")
    print(f"数据库文件: {Path(db_path).absolute()}")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()
