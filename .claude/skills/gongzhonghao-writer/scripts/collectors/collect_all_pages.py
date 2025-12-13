# -*- coding: utf-8 -*-
"""
批量解析所有页面的snapshot数据
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

    # 读取所有17页的snapshot（修复：使用PROJECT_ROOT绝对路径）
    all_articles = []
    temp_dir = PROJECT_ROOT / "data" / "temp"

    for page_num in range(1, 18):
        snapshot_file = temp_dir / f"page{page_num}_snapshot.txt"

        if not snapshot_file.exists():
            print(f"[WARN] 第{page_num}页文件不存在，跳过")
            continue

        try:
            with open(snapshot_file, 'r', encoding='utf-8') as f:
                snapshot_text = f.read()

            articles = collector.parse_snapshot_text(snapshot_text)
            print(f"[OK] 第{page_num}页: 解析到 {len(articles)} 篇文章")
            all_articles.extend(articles)

        except Exception as e:
            print(f"[ERROR] 第{page_num}页解析失败: {str(e)}")
            continue

    print(f"\n[STAT] 总计解析: {len(all_articles)} 篇文章")

    # 增量合并并保存
    stats = collector.merge_incremental_data(all_articles)

    print(f"\n[SAVE] 数据已保存:")
    print(f"   - 文章总数: {stats['total']}")
    print(f"   - 新增文章: {stats['new']}")
    print(f"   - 更新文章: {stats['updated']}")
    print(f"   - 保存路径: {collector.data_file}")

    # 生成报告并写入文件
    print(f"\n" + "="*60)
    report = collector.generate_report()

    # 写入报告文件（修复：使用PROJECT_ROOT绝对路径）
    report_file = PROJECT_ROOT / "data" / "wechat_report.txt"
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write(report)
    print(f"[REPORT] 报告已保存到: {report_file}")

    # 尝试打印（如果失败就算了）
    try:
        print(report)
    except UnicodeEncodeError:
        print("[INFO] 报告包含特殊字符，已保存到文件，请查看文件内容")

if __name__ == "__main__":
    main()
