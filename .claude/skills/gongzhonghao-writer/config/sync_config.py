#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
自动同步脚本 - 数据分析后自动更新配置
运行：python sync_config.py
功能：从analysis_report.json提取数据，更新formulas_config.json
"""

import json
import sys
from pathlib import Path
from datetime import datetime

# 修复Windows控制台编码问题
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass  # 如果失败就跳过，不影响核心功能

def sync_config():
    """同步配置：analysis_report.json → formulas_config.json"""

    # 读取分析报告
    report_path = Path(__file__).parent.parent / 'scripts' / 'analysis_report.json'

    if not report_path.exists():
        print(f"❌ 分析报告不存在：{report_path}")
        print("请先运行：python analyze_wechat_data.py")
        return 1

    with open(report_path, 'r', encoding='utf-8') as f:
        report = json.load(f)

    # 提取核心数据
    config = {
        "version": "V8.0",
        "last_updated": datetime.now().strftime("%Y-%m-%d"),
        "data_source": "analysis_report.json",
        "auto_generated": True,

        "viral_threshold": {
            "method": report['viral_threshold']['recommended'],
            "value": report['viral_threshold']['recommended_threshold'],
            "viral_count": report['viral_stats']['viral_count'],
            "viral_rate": report['viral_stats']['viral_rate']
        },

        "keywords": {
            "viral_top10": report['keywords']['viral_articles'][:10],
            "all_top10": report['keywords']['all_articles'][:10]
        },

        "title_length": {
            "viral_mean": report['title_length']['viral_length_ci']['mean'],
            "ci_lower": report['title_length']['viral_length_ci']['ci_lower'],
            "ci_upper": report['title_length']['viral_length_ci']['ci_upper'],
            "recommendation": report['title_length']['recommendation']
        },

        "topics": {
            "all_distribution": report['topics']['all_articles']['distribution'],
            "viral_distribution": report['topics']['viral_articles']['distribution']
        },

        "publish_time": report.get('time_analysis', {}).get('best_time_slot', {})
    }

    # 保存配置
    config_path = Path(__file__).parent / 'formulas_config.json'

    with open(config_path, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)

    print(f"✅ 配置已同步！")
    print(f"数据来源：{report_path}")
    print(f"配置文件：{config_path}")
    print(f"更新时间：{config['last_updated']}")
    print(f"爆款阈值：{config['viral_threshold']['value']}阅读")
    print(f"爆款率：{config['viral_threshold']['viral_rate']}%")

    return 0

if __name__ == '__main__':
    sys.exit(sync_config())
