# -*- coding: utf-8 -*-
"""
时间工具模块 - 处理微信公众号相对时间
"""
from datetime import datetime, timedelta
import re


def parse_wechat_time(time_str: str, reference_date: datetime = None) -> datetime:
    """
    解析微信公众号的相对时间格式为绝对日期

    支持格式:
    - "今天 17:29"
    - "昨天 18:35"
    - "星期五 19:00"
    - "11月29日 20:30"
    - "2024年11月15日 10:00"

    Args:
        time_str: 微信时间字符串
        reference_date: 参考日期（默认为当前日期）

    Returns:
        datetime对象
    """
    if reference_date is None:
        reference_date = datetime.now()

    time_str = time_str.strip()

    # 提取时间部分（HH:MM）
    time_match = re.search(r'(\d{1,2}):(\d{2})', time_str)
    hour = int(time_match.group(1)) if time_match else 0
    minute = int(time_match.group(2)) if time_match else 0

    # 1. "今天"
    if time_str.startswith('今天'):
        result_date = reference_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
        return result_date

    # 2. "昨天"
    if time_str.startswith('昨天'):
        result_date = (reference_date - timedelta(days=1)).replace(
            hour=hour, minute=minute, second=0, microsecond=0
        )
        return result_date

    # 3. "星期X"
    weekday_match = re.match(r'^星期([一二三四五六日])', time_str)
    if weekday_match:
        weekday_map = {'一': 0, '二': 1, '三': 2, '四': 3, '五': 4, '六': 5, '日': 6}
        target_weekday = weekday_map[weekday_match.group(1)]
        current_weekday = reference_date.weekday()

        # 计算距离今天多少天
        days_diff = (current_weekday - target_weekday) % 7
        if days_diff == 0:
            days_diff = 7  # 如果是同一天，认为是上周

        result_date = (reference_date - timedelta(days=days_diff)).replace(
            hour=hour, minute=minute, second=0, microsecond=0
        )
        return result_date

    # 4. "MM月DD日"（当年）
    month_day_match = re.match(r'^(\d{1,2})月(\d{1,2})日', time_str)
    if month_day_match:
        month = int(month_day_match.group(1))
        day = int(month_day_match.group(2))

        # 判断年份（如果月份大于当前月份，说明是去年）
        year = reference_date.year
        if month > reference_date.month or (
            month == reference_date.month and day > reference_date.day
        ):
            year -= 1

        result_date = datetime(year, month, day, hour, minute, 0)
        return result_date

    # 5. "YYYY年MM月DD日"
    full_date_match = re.match(r'^(\d{4})年(\d{1,2})月(\d{1,2})日', time_str)
    if full_date_match:
        year = int(full_date_match.group(1))
        month = int(full_date_match.group(2))
        day = int(full_date_match.group(3))
        result_date = datetime(year, month, day, hour, minute, 0)
        return result_date

    # 默认返回当前日期
    return reference_date


def is_within_days(publish_time: str, days: int, reference_date: datetime = None) -> bool:
    """
    判断文章发布时间是否在最近N天内

    Args:
        publish_time: 微信时间字符串
        days: 天数
        reference_date: 参考日期

    Returns:
        是否在范围内
    """
    if reference_date is None:
        reference_date = datetime.now()

    article_date = parse_wechat_time(publish_time, reference_date)
    cutoff_date = reference_date - timedelta(days=days)

    return article_date >= cutoff_date


def format_absolute_date(publish_time: str, reference_date: datetime = None) -> str:
    """
    将微信相对时间转换为绝对日期字符串

    Args:
        publish_time: 微信时间字符串
        reference_date: 参考日期

    Returns:
        "2025-11-29 18:35" 格式
    """
    dt = parse_wechat_time(publish_time, reference_date)
    return dt.strftime('%Y-%m-%d %H:%M')


# 测试代码
if __name__ == '__main__':
    # 假设今天是 2025-12-01
    ref_date = datetime(2025, 12, 1, 10, 0, 0)

    test_cases = [
        "今天 17:29",
        "昨天 18:35",
        "星期五 19:00",
        "星期四 23:46",
        "星期三 23:56",
        "11月29日 18:30",
        "2024年11月15日 10:00"
    ]

    print("微信时间解析测试")
    print("参考日期: 2025-12-01 10:00:00\n")
    print("=" * 60)

    for time_str in test_cases:
        parsed = parse_wechat_time(time_str, ref_date)
        formatted = format_absolute_date(time_str, ref_date)
        within_7 = is_within_days(time_str, 7, ref_date)

        print(f"原始: {time_str:20} -> {formatted:20} [最近7天: {'是' if within_7 else '否'}]")

    print("\n" + "=" * 60)
    print("测试完成！")
