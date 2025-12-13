# -*- coding: utf-8 -*-
"""
增量收集脚本 - 只收集新数据，检测到重复立即停止
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from wechat_data_collector import WeChatDataCollector, PROJECT_ROOT
import json
from pathlib import Path

def main():
    # 修复：使用默认的PROJECT_ROOT/data路径
    collector = WeChatDataCollector(data_dir=None)

    # Step 1: 读取已有数据
    print("\n" + "="*60)
    print("Step 1: 读取已有数据")
    print("="*60)

    existing_articles = []
    existing_titles = set()

    if collector.data_file.exists():
        with open(collector.data_file, 'r', encoding='utf-8') as f:
            existing_articles = json.load(f)
            existing_titles = {article['title'] for article in existing_articles}
        print(f"[OK] 已有文章数: {len(existing_articles)}")
        print(f"[OK] 已知标题数: {len(existing_titles)}")
    else:
        print("[INFO] 没有已有数据，这是首次收集")

    # Step 2: 解析所有snapshot文件（按顺序）
    print("\n" + "="*60)
    print("Step 2: 增量解析snapshot文件")
    print("="*60)

    # 修复：使用PROJECT_ROOT绝对路径
    temp_dir = PROJECT_ROOT / "data" / "temp"
    new_articles = []
    updated_count = 0
    skipped_count = 0

    page_num = 1
    max_pages = 20  # 安全阈值
    should_continue = True

    while page_num <= max_pages and should_continue:
        snapshot_file = temp_dir / f"page{page_num}_snapshot.txt"

        if not snapshot_file.exists():
            print(f"\n[STOP] 第{page_num}页文件不存在，停止收集")
            break

        try:
            with open(snapshot_file, 'r', encoding='utf-8') as f:
                snapshot_text = f.read()

            # 尝试简化文本解析器（用于手动复制的数据）
            articles = collector.parse_simple_text(snapshot_text)

            # 如果简化解析器失败，尝试Playwright格式解析器
            if len(articles) == 0:
                articles = collector.parse_snapshot_text(snapshot_text)

            print(f"\n[第{page_num}页] 解析到 {len(articles)} 篇文章")

            # 逐个检测文章是否重复
            page_new_count = 0
            page_duplicate_count = 0

            for article in articles:
                title = article['title']

                if title in existing_titles:
                    # 重复文章 - 停止当前页
                    page_duplicate_count += 1
                    skipped_count += 1
                    try:
                        print(f"  [重复] {title}")
                    except UnicodeEncodeError:
                        print(f"  [重复] (标题包含特殊字符)")

                    # 遇到第一篇重复，立即停止
                    should_continue = False
                    break
                else:
                    # 新文章
                    page_new_count += 1
                    new_articles.append(article)
                    existing_titles.add(title)  # 添加到已知标题
                    try:
                        print(f"  [新增] {title}")
                    except UnicodeEncodeError:
                        print(f"  [新增] (标题包含特殊字符)")

            print(f"  [统计] 新增{page_new_count}篇, 重复{page_duplicate_count}篇")

            # 如果整页都是重复，停止
            if page_duplicate_count == len(articles):
                print(f"  [STOP] 第{page_num}页全是重复数据，停止收集")
                should_continue = False

            # 如果遇到重复，停止
            if not should_continue:
                print(f"  [STOP] 检测到重复文章，停止收集")
                break

            page_num += 1

        except Exception as e:
            print(f"[ERROR] 第{page_num}页解析失败: {str(e)}")
            break

    # Step 3: 合并数据
    print("\n" + "="*60)
    print("Step 3: 合并增量数据")
    print("="*60)

    print(f"\n[增量统计]:")
    print(f"  - 收集页数: {page_num - 1}页")
    print(f"  - 新增文章: {len(new_articles)}篇")
    print(f"  - 跳过文章: {skipped_count}篇（重复）")

    if len(new_articles) == 0:
        print("\n[INFO] 没有新文章，无需更新数据文件")
        print("\n" + "="*60)
        return

    # 合并新文章到已有数据（新文章放最前面）
    all_articles = new_articles + existing_articles

    # 保存数据
    collector.save_data(all_articles)
    stats = {'total': len(all_articles)}

    print(f"\n[SAVE] 数据已保存:")
    print(f"   - 文章总数: {stats['total']}")
    print(f"   - 新增文章: {len(new_articles)}")
    print(f"   - 保存路径: {collector.data_file}")

    # Step 4: 生成增量报告
    print("\n" + "="*60)
    print("Step 4: 生成增量数据报告")
    print("="*60)

    # 使用新的增量报告方法
    report = collector.generate_incremental_report(
        new_articles=new_articles,
        skipped_count=skipped_count,
        pages_collected=page_num - 1
    )

    # 写入报告文件（修复：使用PROJECT_ROOT绝对路径）
    report_file = PROJECT_ROOT / "data" / "wechat_report.txt"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"[REPORT] 增量报告已保存到: {report_file}")

    # Step 5: 输出新增文章列表
    print("\n" + "="*60)
    print("Step 5: 新增文章列表")
    print("="*60 + "\n")

    for i, article in enumerate(new_articles, 1):
        print(f"{i}、{article['title']}（{article['publish_time']}）")
        print(f"   阅读{article['read_count']} | 点赞{article['like_count']} | 在看{article['look_count']}")

    print("\n" + "="*60)
    print("[SUCCESS] 增量收集完成！")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()
