# -*- coding: utf-8 -*-
"""
基于时间范围的增量收集脚本
支持 --days 参数，只收集最近N天的文章并更新数据
"""
import sys
import os
import argparse
sys.path.insert(0, os.path.dirname(__file__))

from wechat_data_collector import WeChatDataCollector, PROJECT_ROOT
from time_utils import is_within_days, format_absolute_date
import json
from pathlib import Path
from datetime import datetime


def main():
    # 解析命令行参数
    parser = argparse.ArgumentParser(description='基于时间范围的微信公众号数据收集')
    parser.add_argument('--days', type=int, help='收集最近N天的文章')
    parser.add_argument('--until', type=str, help='收集从今天到指定日期的文章（格式：2024-11-01）')
    parser.add_argument('--verbose', action='store_true', help='显示详细日志')
    args = parser.parse_args()

    # 修复：不再使用相对路径"../../../../data"，而是使用默认的PROJECT_ROOT/data
    collector = WeChatDataCollector(data_dir=None)
    reference_date = datetime.now()

    # 计算天数
    if args.until:
        until_date = datetime.strptime(args.until, '%Y-%m-%d')
        days = (reference_date - until_date).days
        if days < 0:
            print(f"[ERROR] 指定日期 {args.until} 在未来，无法收集")
            sys.exit(1)
    elif args.days:
        days = args.days
    else:
        days = 30  # 默认30天

    # Step 1: 读取已有数据
    print("\n" + "="*60)
    print(f"Step 1: 读取已有数据")
    print("="*60)

    existing_articles = []
    existing_dict = {}  # {title: article_data}

    if collector.data_file.exists():
        with open(collector.data_file, 'r', encoding='utf-8') as f:
            existing_articles = json.load(f)
            existing_dict = {article['title']: article for article in existing_articles}
        print(f"[OK] 已有文章数: {len(existing_articles)}")
    else:
        print("[INFO] 没有已有数据，这是首次收集")

    # Step 2: 解析所有snapshot文件
    print("\n" + "="*60)
    if args.until:
        print(f"Step 2: 按时间范围收集（从今天到 {args.until}，共{days}天）")
    else:
        print(f"Step 2: 按时间范围收集（最近{days}天）")
    print("="*60)

    # 修复：使用PROJECT_ROOT绝对路径
    temp_dir = PROJECT_ROOT / "data" / "temp"
    new_articles = []
    updated_articles = []
    skipped_count = 0
    out_of_range_count = 0

    page_num = 1
    max_pages = 20
    should_continue = True

    while page_num <= max_pages and should_continue:
        snapshot_file = temp_dir / f"page{page_num}_snapshot.txt"

        if not snapshot_file.exists():
            print(f"\n[STOP] 第{page_num}页文件不存在，停止收集")
            break

        try:
            with open(snapshot_file, 'r', encoding='utf-8') as f:
                snapshot_text = f.read()

            # 尝试简化文本解析器
            articles = collector.parse_simple_text(snapshot_text)

            # 如果失败，尝试Playwright格式
            if len(articles) == 0:
                articles = collector.parse_snapshot_text(snapshot_text)

            print(f"\n[第{page_num}页] 解析到 {len(articles)} 篇文章")

            if args.verbose:
                print(f"  参考时间: {reference_date.strftime('%Y-%m-%d %H:%M:%S')}")
                print(f"  收集范围: 最近{args.days}天")

            page_new_count = 0
            page_updated_count = 0
            page_skipped_count = 0

            for article in articles:
                title = article['title']
                publish_time = article['publish_time']

                # 检查是否在时间范围内
                in_range = is_within_days(publish_time, args.days, reference_date)

                if not in_range:
                    # 超出时间范围，停止收集
                    out_of_range_count += 1
                    if args.verbose:
                        try:
                            print(f"  [超出范围] {title} ({publish_time})")
                        except UnicodeEncodeError:
                            print(f"  [超出范围] (标题包含特殊字符)")

                    # 遇到第一篇超出范围的文章，停止
                    should_continue = False
                    break

                # 添加绝对时间字段
                article['publish_date'] = format_absolute_date(publish_time, reference_date)
                article['last_updated'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

                if title in existing_dict:
                    # 已存在的文章 - 更新数据
                    old_article = existing_dict[title]
                    old_read = old_article.get('read_count', 0)
                    old_like = old_article.get('like_count', 0)
                    old_look = old_article.get('look_count', 0)

                    new_read = article.get('read_count', 0)
                    new_like = article.get('like_count', 0)
                    new_look = article.get('look_count', 0)

                    # 计算增量
                    read_delta = new_read - old_read
                    like_delta = new_like - old_like
                    look_delta = new_look - old_look

                    # 更新文章数据
                    existing_dict[title] = article
                    updated_articles.append({
                        'title': title,
                        'old': {'read': old_read, 'like': old_like, 'look': old_look},
                        'new': {'read': new_read, 'like': new_like, 'look': new_look},
                        'delta': {'read': read_delta, 'like': like_delta, 'look': look_delta}
                    })

                    page_updated_count += 1

                    if args.verbose:
                        try:
                            print(f"  [更新] {title}")
                            if read_delta != 0 or like_delta != 0 or look_delta != 0:
                                print(f"         阅读:{old_read}->{new_read} (+{read_delta}), "
                                      f"点赞:{old_like}->{new_like} (+{like_delta}), "
                                      f"在看:{old_look}->{new_look} (+{look_delta})")
                        except UnicodeEncodeError:
                            print(f"  [更新] (标题包含特殊字符)")
                else:
                    # 新文章
                    new_articles.append(article)
                    page_new_count += 1

                    try:
                        print(f"  [新增] {title} ({publish_time})")
                    except UnicodeEncodeError:
                        print(f"  [新增] (标题包含特殊字符)")

            print(f"  [统计] 新增{page_new_count}篇, 更新{page_updated_count}篇")

            if not should_continue:
                print(f"  [STOP] 超出时间范围（{args.days}天），停止收集")
                break

            page_num += 1

        except Exception as e:
            print(f"[ERROR] 第{page_num}页解析失败: {str(e)}")
            break

    # Step 3: 合并数据
    print("\n" + "="*60)
    print("Step 3: 合并数据")
    print("="*60)

    # 更新后的已有文章
    updated_existing = list(existing_dict.values())

    # 合并：新文章 + 更新后的已有文章
    all_articles = new_articles + updated_existing

    # 保存数据
    collector.save_data(all_articles)

    print(f"\n[数据统计]:")
    print(f"  - 收集范围: 最近{args.days}天")
    print(f"  - 收集页数: {page_num - 1}页")
    print(f"  - 新增文章: {len(new_articles)}篇")
    print(f"  - 更新文章: {len(updated_articles)}篇")
    print(f"  - 超出范围: {out_of_range_count}篇")
    print(f"  - 文章总数: {len(all_articles)}篇")

    # 计算数据增长
    total_read_delta = sum(a['delta']['read'] for a in updated_articles)
    total_like_delta = sum(a['delta']['like'] for a in updated_articles)
    total_look_delta = sum(a['delta']['look'] for a in updated_articles)

    if len(updated_articles) > 0:
        print(f"\n[数据增长]:")
        print(f"  - 阅读增长: +{total_read_delta:,}")
        print(f"  - 点赞增长: +{total_like_delta}")
        print(f"  - 在看增长: +{total_look_delta}")

    # Step 4: 生成报告
    print("\n" + "="*60)
    print("Step 4: 生成时间范围收集报告")
    print("="*60)

    report = generate_time_range_report(
        new_articles=new_articles,
        updated_articles=updated_articles,
        all_articles=all_articles,
        days=args.days,
        pages_collected=page_num - 1
    )

    # 写入报告文件（修复：使用PROJECT_ROOT绝对路径）
    report_file = PROJECT_ROOT / "data" / "wechat_report.txt"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"[REPORT] 报告已保存到: {report_file}")

    # Step 5: 输出详情
    if len(new_articles) > 0:
        print("\n" + "="*60)
        print(f"Step 5: 新增文章列表 ({len(new_articles)}篇)")
        print("="*60 + "\n")

        for i, article in enumerate(new_articles, 1):
            print(f"{i}、{article['title']}（{article['publish_time']}）")
            print(f"   阅读{article['read_count']} | 点赞{article['like_count']} | 在看{article['look_count']}")

    if len(updated_articles) > 0 and args.verbose:
        print("\n" + "="*60)
        print(f"数据更新详情 ({len(updated_articles)}篇)")
        print("="*60 + "\n")

        for i, update in enumerate(updated_articles[:10], 1):  # 只显示前10个
            title = update['title']
            delta = update['delta']
            if delta['read'] > 0 or delta['like'] > 0 or delta['look'] > 0:
                print(f"{i}、{title}")
                print(f"   阅读 +{delta['read']}, 点赞 +{delta['like']}, 在看 +{delta['look']}")

    print("\n" + "="*60)
    print("[SUCCESS] 时间范围收集完成！")
    print("="*60 + "\n")

    # Step 6: 自动调用数据分析
    print("\n" + "="*60)
    print("Step 5: 自动生成数据分析报告")
    print("="*60)

    try:
        import subprocess
        result = subprocess.run(
            [sys.executable, "analyze_wechat_data.py"],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore'
        )

        if result.returncode == 0:
            print("[OK] 数据分析完成")
            if result.stdout:
                print(result.stdout)
        else:
            print(f"[ERROR] 数据分析失败")
            if result.stderr:
                print(result.stderr)
    except Exception as e:
        print(f"[ERROR] 调用分析脚本失败: {str(e)}")


def generate_time_range_report(new_articles, updated_articles, all_articles, days, pages_collected):
    """生成时间范围收集报告"""

    # 计算统计
    total_read = sum(a.get('read_count', 0) for a in all_articles)
    total_like = sum(a.get('like_count', 0) for a in all_articles)
    total_look = sum(a.get('look_count', 0) for a in all_articles)

    new_read = sum(a.get('read_count', 0) for a in new_articles)
    new_like = sum(a.get('like_count', 0) for a in new_articles)
    new_look = sum(a.get('look_count', 0) for a in new_articles)

    updated_read = sum(u['delta']['read'] for u in updated_articles)
    updated_like = sum(u['delta']['like'] for u in updated_articles)
    updated_look = sum(u['delta']['look'] for u in updated_articles)

    avg_read = total_read // len(all_articles) if len(all_articles) > 0 else 0

    report = f"""
========== 微信公众号时间范围收集报告 ==========
==================================================

[收集概况]
- 收集时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
- 收集范围：最近{days}天
- 收集页数：{pages_collected}页

[增量统计]
- 新增文章：{len(new_articles)}篇
- 更新文章：{len(updated_articles)}篇
- 新增阅读：+{new_read:,}
- 新增点赞：+{new_like}
- 新增在看：+{new_look}

[数据增长]（已有文章）
- 阅读增长：+{updated_read:,}
- 点赞增长：+{updated_like}
- 在看增长：+{updated_look}

[总体统计]
- 文章总数：{len(all_articles)}篇
- 总阅读数：{total_read:,}
- 总点赞数：{total_like:,}
- 总在看数：{total_look:,}
- 平均阅读：{avg_read:,}/篇

"""

    # 新增文章列表
    if len(new_articles) > 0:
        report += "[新增文章列表]\n\n"
        for i, article in enumerate(new_articles, 1):
            report += f"{i}、{article['title']}（{article['publish_time']}）\n"
            report += f"   阅读{article['read_count']} | 点赞{article['like_count']} | 在看{article['look_count']}\n\n"
    else:
        report += "[新增文章列表]\n\n（无新增文章）\n\n"

    # 数据更新详情
    if len(updated_articles) > 0:
        report += "[数据更新详情]（前10篇）\n\n"
        for i, update in enumerate(updated_articles[:10], 1):
            delta = update['delta']
            if delta['read'] > 0 or delta['like'] > 0 or delta['look'] > 0:
                report += f"{i}、{update['title']}\n"
                report += f"   阅读 +{delta['read']}, 点赞 +{delta['like']}, 在看 +{delta['look']}\n\n"

    # 爆款排行
    report += "[爆款文章 TOP 10]\n\n"
    sorted_articles = sorted(all_articles, key=lambda x: x.get('read_count', 0), reverse=True)
    for i, article in enumerate(sorted_articles[:10], 1):
        report += f"{i}、{article['title']}\n"
        report += f"   阅读：{article.get('read_count', 0):,} | "
        report += f"点赞：{article.get('like_count', 0)} | "
        report += f"在看：{article.get('look_count', 0)}\n\n"

    return report


if __name__ == "__main__":
    main()
