#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
微信公众号数据分析脚本 V7.0 - 科学统计版
使用专业统计方法分析公众号文章表现

主要改进：
- IQR方法定义爆款阈值（替代硬编码1000）
- TF-IDF关键词提取（替代固定关键词列表）
- 统计显著性检验（t-test、p-value）
- 95%置信区间和标准误
- 多标签话题分类
- 改进的时间序列分析

作者：老金
日期：2025-12-02
"""

import json
import sys
import io
from pathlib import Path

# 强制UTF-8输出（Windows兼容性修复）
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
from collections import Counter, defaultdict
from datetime import datetime
from typing import List, Dict, Tuple, Optional, Any
import re

# 统计分析库
import numpy as np
from scipy import stats
from scipy.stats import ttest_ind

# TF-IDF库
from sklearn.feature_extraction.text import TfidfVectorizer
import jieba
import jieba.analyse


class WeChatDataAnalyzer:
    """微信公众号数据分析器 - 科学统计版"""

    def __init__(self, data_file: str):
        """
        初始化分析器

        Args:
            data_file: wechat_articles.json文件路径
        """
        self.data_file = Path(data_file)
        self.articles: List[Dict[str, Any]] = []
        self.analysis_results: Dict[str, Any] = {}

        # 最小样本量检查
        self.MIN_SAMPLE_SIZE = 30  # 统计学建议最小样本量

    def load_data(self) -> bool:
        """
        加载数据文件

        Returns:
            加载成功返回True，否则返回False
        """
        if not self.data_file.exists():
            print(f"❌ 错误：找不到数据文件 {self.data_file}")
            return False

        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                self.articles = json.load(f)

            print(f"✅ 成功加载 {len(self.articles)} 篇文章数据")

            # 样本量检查
            if len(self.articles) < self.MIN_SAMPLE_SIZE:
                print(f"⚠️  警告：样本量({len(self.articles)})小于建议最小值({self.MIN_SAMPLE_SIZE})，")
                print("   统计结果可能不够可靠，建议收集更多数据")

            return True

        except Exception as e:
            print(f"❌ 加载数据失败：{e}")
            return False

    def define_viral_threshold(self, read_counts: List[int]) -> Dict[str, float]:
        """
        使用IQR方法科学定义爆款阈值

        方法对比：
        - IQR方法：Q3 + 1.5 * IQR（最严格，识别真正的异常值）
        - P75方法：75分位数（适中，识别前25%的文章）
        - P90方法：90分位数（宽松，识别前10%的文章）

        Args:
            read_counts: 所有文章的阅读量列表

        Returns:
            包含不同方法阈值的字典
        """
        if len(read_counts) < 4:
            # 样本太小，无法计算IQR
            return {
                'method': 'fallback',
                'threshold': np.median(read_counts),
                'description': '样本量过小，使用中位数作为阈值'
            }

        q1 = np.percentile(read_counts, 25)
        q3 = np.percentile(read_counts, 75)
        iqr = q3 - q1

        # 方法1：IQR异常值检测（最严格）
        threshold_iqr = q3 + 1.5 * iqr

        # 方法2：75分位数（推荐）
        threshold_p75 = q3

        # 方法3：90分位数（宽松）
        threshold_p90 = np.percentile(read_counts, 90)

        # 方法4：均值+1标准差（传统方法）
        mean = np.mean(read_counts)
        std = np.std(read_counts)
        threshold_mean_std = mean + std

        return {
            'method': 'IQR_and_Percentile',
            'iqr_method': {
                'threshold': round(threshold_iqr, 2),
                'description': 'Q3 + 1.5*IQR (最严格)',
                'percentile': self._calculate_percentile(read_counts, threshold_iqr)
            },
            'p75_method': {
                'threshold': round(threshold_p75, 2),
                'description': '75分位数 (推荐)',
                'percentile': 75
            },
            'p90_method': {
                'threshold': round(threshold_p90, 2),
                'description': '90分位数 (宽松)',
                'percentile': 90
            },
            'mean_std_method': {
                'threshold': round(threshold_mean_std, 2),
                'description': '均值+1标准差 (传统)',
                'percentile': self._calculate_percentile(read_counts, threshold_mean_std)
            },
            'recommended': 'p75_method',
            'recommended_threshold': round(threshold_p75, 2),
            'statistics': {
                'q1': round(q1, 2),
                'median': round(np.median(read_counts), 2),
                'q3': round(q3, 2),
                'iqr': round(iqr, 2),
                'mean': round(mean, 2),
                'std': round(std, 2)
            }
        }

    def _calculate_percentile(self, values: List[float], threshold: float) -> float:
        """计算某个阈值对应的百分位数"""
        values_sorted = sorted(values)
        count_below = sum(1 for v in values_sorted if v <= threshold)
        percentile = (count_below / len(values_sorted)) * 100
        return round(percentile, 1)

    def extract_keywords_tfidf(self, titles: List[str], top_n: int = 20) -> List[Tuple[str, float]]:
        """
        使用TF-IDF方法提取关键词（替代固定关键词列表）

        Args:
            titles: 文章标题列表
            top_n: 返回前N个关键词

        Returns:
            [(关键词, TF-IDF分数), ...]
        """
        if not titles:
            return []

        # 使用jieba分词
        def jieba_tokenizer(text):
            # 分词并过滤停用词
            words = jieba.cut(text)
            # 过滤长度<=1的词
            return [w for w in words if len(w) > 1]

        try:
            # 配置TF-IDF向量化器
            vectorizer = TfidfVectorizer(
                tokenizer=jieba_tokenizer,
                lowercase=False,
                max_features=100,
                smooth_idf=True,  # 平滑IDF，避免除零
                norm='l2'         # L2归一化
            )

            # 计算TF-IDF矩阵
            tfidf_matrix = vectorizer.fit_transform(titles)
            feature_names = vectorizer.get_feature_names_out()

            # 计算每个词的总TF-IDF得分
            tfidf_scores = np.asarray(tfidf_matrix.sum(axis=0)).ravel()

            # 排序并返回Top N
            top_indices = tfidf_scores.argsort()[-top_n:][::-1]
            keywords = [(feature_names[i], round(tfidf_scores[i], 4))
                       for i in top_indices]

            return keywords

        except Exception as e:
            print(f"⚠️  TF-IDF提取失败：{e}")
            # 降级到jieba.analyse
            return self._extract_keywords_jieba(titles, top_n)

    def _extract_keywords_jieba(self, titles: List[str], top_n: int = 20) -> List[Tuple[str, float]]:
        """使用jieba.analyse作为TF-IDF的备选方案"""
        all_text = ' '.join(titles)
        keywords = jieba.analyse.extract_tags(all_text, topK=top_n, withWeight=True)
        return keywords

    def classify_topics_multi_label(self, titles: List[str]) -> Dict[str, Any]:
        """
        多标签话题分类（一篇文章可以属于多个话题）

        Args:
            titles: 文章标题列表

        Returns:
            话题统计字典，包含权重评分
        """
        # 定义话题模式及其权重
        topic_patterns = {
            '测评类': {
                'patterns': ['测评', '实测', '体验', '对比', '评测', '深度', '全面'],
                'weight': 1.0
            },
            '教程类': {
                'patterns': ['教程', '手把手', '详解', '配置', '如何', '怎么', '步骤', '指南'],
                'weight': 1.0
            },
            '工具类': {
                'patterns': ['工具', '插件', '扩展', 'MCP', 'API', '集成'],
                'weight': 1.0
            },
            '资讯类': {
                'patterns': ['更新', '发布', '新功能', '最新', '官方', '消息'],
                'weight': 0.8
            },
            '案例类': {
                'patterns': ['案例', '实战', '项目', '应用', '场景', '用法'],
                'weight': 1.0
            },
            '技术类': {
                'patterns': ['技术', '原理', '架构', '算法', '源码', '深入'],
                'weight': 1.2
            }
        }

        # 统计每个话题的匹配次数和加权得分
        topic_counts = defaultdict(int)
        topic_scores = defaultdict(float)
        article_topics = []  # 记录每篇文章的话题标签

        for title in titles:
            matched_topics = []
            for topic_name, topic_info in topic_patterns.items():
                match_count = sum(1 for pattern in topic_info['patterns'] if pattern in title)
                if match_count > 0:
                    topic_counts[topic_name] += 1
                    # 加权得分 = 匹配模式数 * 权重
                    topic_scores[topic_name] += match_count * topic_info['weight']
                    matched_topics.append(topic_name)

            article_topics.append({
                'title': title,
                'topics': matched_topics if matched_topics else ['其他类']
            })

        # 计算话题分布
        total_articles = len(titles)
        topic_distribution = {
            topic: {
                'count': count,
                'percentage': round((count / total_articles) * 100, 1),
                'weighted_score': round(topic_scores[topic], 2)
            }
            for topic, count in topic_counts.items()
        }

        # 按加权得分排序
        sorted_topics = sorted(
            topic_distribution.items(),
            key=lambda x: x[1]['weighted_score'],
            reverse=True
        )

        return {
            'distribution': dict(sorted_topics),
            'multi_label_enabled': True,
            'avg_topics_per_article': round(sum(len(a['topics']) for a in article_topics) / len(article_topics), 2),
            'article_topics': article_topics
        }

    def calculate_confidence_interval(self, data: List[float], confidence: float = 0.95) -> Dict[str, float]:
        """
        计算95%置信区间和标准误

        Args:
            data: 数据列表
            confidence: 置信水平（默认0.95）

        Returns:
            包含均值、标准误、置信区间的字典
        """
        if len(data) < 2:
            return {
                'mean': np.mean(data),
                'std_error': 0,
                'ci_lower': np.mean(data),
                'ci_upper': np.mean(data),
                'confidence_level': confidence
            }

        n = len(data)
        mean = np.mean(data)
        std_error = stats.sem(data)  # 标准误 = std / sqrt(n)

        # 使用t分布计算置信区间（样本量较小时更准确）
        ci = stats.t.interval(
            confidence=confidence,
            df=n-1,  # 自由度
            loc=mean,
            scale=std_error
        )

        return {
            'mean': round(mean, 2),
            'std_error': round(std_error, 2),
            'ci_lower': round(ci[0], 2),
            'ci_upper': round(ci[1], 2),
            'confidence_level': confidence,
            'sample_size': n
        }

    def perform_ttest(self, group1: List[float], group2: List[float],
                      group1_name: str = "组1", group2_name: str = "组2") -> Dict[str, Any]:
        """
        执行独立样本t检验

        Args:
            group1: 第一组数据
            group2: 第二组数据
            group1_name: 第一组名称
            group2_name: 第二组名称

        Returns:
            包含t统计量、p值、显著性结论的字典
        """
        if len(group1) < 2 or len(group2) < 2:
            return {
                'test': 't-test',
                'result': 'insufficient_data',
                'message': '样本量过小，无法进行t检验'
            }

        # 独立样本t检验
        t_statistic, p_value = ttest_ind(group1, group2)

        # 判断显著性（alpha = 0.05）
        is_significant = bool(p_value < 0.05)  # 转成Python原生bool，避免JSON序列化问题

        # 计算效应量（Cohen's d）
        mean1, mean2 = np.mean(group1), np.mean(group2)
        pooled_std = np.sqrt((np.std(group1)**2 + np.std(group2)**2) / 2)
        cohens_d = (mean1 - mean2) / pooled_std if pooled_std > 0 else 0

        return {
            'test': 't-test',
            'group1': {
                'name': group1_name,
                'mean': round(mean1, 2),
                'std': round(np.std(group1), 2),
                'n': len(group1)
            },
            'group2': {
                'name': group2_name,
                'mean': round(mean2, 2),
                'std': round(np.std(group2), 2),
                'n': len(group2)
            },
            't_statistic': round(t_statistic, 4),
            'p_value': round(p_value, 4),
            'is_significant': is_significant,
            'significance_level': 0.05,
            'cohens_d': round(cohens_d, 4),
            'effect_size': self._interpret_cohens_d(cohens_d),
            'conclusion': self._interpret_ttest(is_significant, mean1, mean2, group1_name, group2_name)
        }

    def _interpret_cohens_d(self, d: float) -> str:
        """解释Cohen's d效应量"""
        abs_d = abs(d)
        if abs_d < 0.2:
            return "微小效应"
        elif abs_d < 0.5:
            return "小效应"
        elif abs_d < 0.8:
            return "中等效应"
        else:
            return "大效应"

    def _interpret_ttest(self, is_significant: bool, mean1: float, mean2: float,
                        name1: str, name2: str) -> str:
        """解释t检验结果"""
        if not is_significant:
            return f"❌ 无显著差异：{name1}和{name2}的均值差异不显著 (p ≥ 0.05)"

        if mean1 > mean2:
            return f"✅ 显著差异：{name1}显著高于{name2} (p < 0.05)"
        else:
            return f"✅ 显著差异：{name2}显著高于{name1} (p < 0.05)"

    def analyze_time_series(self, articles: List[Dict]) -> Dict[str, Any]:
        """
        改进的时间序列分析

        - 具体时间段（每2小时一个时段）
        - 每日趋势分析
        - 最佳发布时间推荐
        """
        time_slot_data = defaultdict(lambda: {
            'count': 0,
            'read_counts': [],
            'like_counts': []
        })

        weekday_data = defaultdict(lambda: {
            'count': 0,
            'read_counts': []
        })

        for article in articles:
            pub_time_str = article.get('publish_time', '')
            if not pub_time_str:
                continue

            try:
                # 解析时间 - 尝试多种格式
                pub_time = None
                # 尝试ISO格式
                try:
                    pub_time = datetime.fromisoformat(pub_time_str.replace('Z', '+00:00'))
                except:
                    # 尝试从中文格式提取 "今天 18:35" 或 "昨天 20:00"
                    time_match = re.search(r'(\d{1,2}):(\d{2})', pub_time_str)
                    if time_match:
                        hour = int(time_match.group(1))
                        minute = int(time_match.group(2))
                        # 使用当前日期
                        pub_time = datetime.now().replace(hour=hour, minute=minute, second=0, microsecond=0)

                if not pub_time:
                    continue

                hour = pub_time.hour
                weekday = pub_time.strftime('%A')  # Monday, Tuesday, ...

                # 2小时时段分类
                time_slot = self._get_time_slot(hour)

                # 记录数据
                read_count = article.get('read_count', 0)
                like_count = article.get('like_count', 0)

                time_slot_data[time_slot]['count'] += 1
                time_slot_data[time_slot]['read_counts'].append(read_count)
                time_slot_data[time_slot]['like_counts'].append(like_count)

                weekday_data[weekday]['count'] += 1
                weekday_data[weekday]['read_counts'].append(read_count)

            except Exception as e:
                continue

        # 计算每个时段的统计量
        time_analysis = {}
        for slot, data in time_slot_data.items():
            if data['count'] > 0:
                avg_read = np.mean(data['read_counts'])
                avg_like = np.mean(data['like_counts'])
                time_analysis[slot] = {
                    'count': data['count'],
                    'avg_read': round(avg_read, 2),
                    'avg_like': round(avg_like, 2),
                    'total_read': sum(data['read_counts']),
                    'ci_read': self.calculate_confidence_interval(data['read_counts'])
                }

        # 找出最佳时段
        best_slot = max(time_analysis.items(),
                       key=lambda x: x[1]['avg_read']) if time_analysis else (None, None)

        # 每周趋势
        weekday_analysis = {}
        for day, data in weekday_data.items():
            if data['count'] > 0:
                weekday_analysis[day] = {
                    'count': data['count'],
                    'avg_read': round(np.mean(data['read_counts']), 2),
                    'ci_read': self.calculate_confidence_interval(data['read_counts'])
                }

        return {
            'time_slot_analysis': dict(sorted(time_analysis.items())),
            'weekday_analysis': weekday_analysis,
            'best_time_slot': {
                'slot': best_slot[0],
                'stats': best_slot[1]
            } if best_slot[0] else None,
            'recommendation': self._generate_time_recommendation(time_analysis)
        }

    def _get_time_slot(self, hour: int) -> str:
        """将小时转换为2小时时段"""
        slots = {
            (0, 2): "00:00-02:00 (深夜)",
            (2, 4): "02:00-04:00 (深夜)",
            (4, 6): "04:00-06:00 (凌晨)",
            (6, 8): "06:00-08:00 (早晨)",
            (8, 10): "08:00-10:00 (上午)",
            (10, 12): "10:00-12:00 (上午)",
            (12, 14): "12:00-14:00 (中午)",
            (14, 16): "14:00-16:00 (下午)",
            (16, 18): "16:00-18:00 (下午)",
            (18, 20): "18:00-20:00 (傍晚)",
            (20, 22): "20:00-22:00 (晚上)",
            (22, 24): "22:00-24:00 (深夜)"
        }

        for (start, end), slot_name in slots.items():
            if start <= hour < end:
                return slot_name
        return "未知时段"

    def _generate_time_recommendation(self, time_analysis: Dict) -> str:
        """生成发布时间建议"""
        if not time_analysis:
            return "数据不足，无法给出建议"

        # 找出表现最好的3个时段
        top_slots = sorted(time_analysis.items(),
                          key=lambda x: x[1]['avg_read'],
                          reverse=True)[:3]

        recommendations = []
        for i, (slot, stats) in enumerate(top_slots, 1):
            recommendations.append(
                f"{i}. {slot}：平均阅读{stats['avg_read']:.0f} (95% CI: {stats['ci_read']['ci_lower']:.0f}-{stats['ci_read']['ci_upper']:.0f})"
            )

        return "\n".join(["📅 最佳发布时段："] + recommendations)

    def run_analysis(self) -> Dict[str, Any]:
        """
        执行完整的数据分析流程

        Returns:
            完整的分析结果字典
        """
        if not self.articles:
            print("❌ 没有数据可分析")
            return {}

        print("\n" + "="*60)
        print("📊 开始数据分析 (科学统计版 V7.0)")
        print("="*60 + "\n")

        # 1. 基础统计
        print("📈 步骤1/7：计算基础统计量...")
        read_counts = [a.get('read_count', 0) for a in self.articles]
        like_counts = [a.get('like_count', 0) for a in self.articles]

        # 2. 科学定义爆款阈值
        print("🎯 步骤2/7：使用IQR方法定义爆款阈值...")
        viral_threshold_info = self.define_viral_threshold(read_counts)
        recommended_threshold = viral_threshold_info['recommended_threshold']

        # 划分爆款和普通文章
        viral_articles = [a for a in self.articles if a.get('read_count', 0) >= recommended_threshold]
        normal_articles = [a for a in self.articles if a.get('read_count', 0) < recommended_threshold]

        print(f"   推荐阈值：{recommended_threshold:.0f} (P75方法)")
        print(f"   爆款文章：{len(viral_articles)} 篇 ({len(viral_articles)/len(self.articles)*100:.1f}%)")
        print(f"   普通文章：{len(normal_articles)} 篇")

        # 3. TF-IDF关键词提取
        print("🔍 步骤3/7：使用TF-IDF提取关键词...")
        all_titles = [a.get('title', '') for a in self.articles]
        viral_titles = [a.get('title', '') for a in viral_articles]

        keywords_all = self.extract_keywords_tfidf(all_titles, top_n=20)
        keywords_viral = self.extract_keywords_tfidf(viral_titles, top_n=15) if viral_titles else []

        print(f"   提取到 {len(keywords_all)} 个高频关键词")

        # 4. 标题长度分析 + t检验
        print("📏 步骤4/7：分析标题长度并执行统计检验...")
        viral_title_lengths = [len(a.get('title', '')) for a in viral_articles]
        normal_title_lengths = [len(a.get('title', '')) for a in normal_articles]

        title_length_ttest = self.perform_ttest(
            viral_title_lengths,
            normal_title_lengths,
            "爆款文章标题长度",
            "普通文章标题长度"
        )

        title_length_ci = self.calculate_confidence_interval(viral_title_lengths) if viral_title_lengths else {}

        # 5. 多标签话题分类
        print("🏷️  步骤5/7：执行多标签话题分类...")
        topic_analysis = self.classify_topics_multi_label(all_titles)
        viral_topic_analysis = self.classify_topics_multi_label(viral_titles) if viral_titles else {}

        # 6. 时间序列分析
        print("⏰ 步骤6/7：分析发布时间趋势...")
        time_analysis = self.analyze_time_series(self.articles)

        # 7. 阅读量与点赞数相关性
        print("💡 步骤7/7：计算指标相关性...")
        read_like_correlation = np.corrcoef(read_counts, like_counts)[0, 1] if len(read_counts) > 1 else 0

        # 汇总结果
        self.analysis_results = {
            'metadata': {
                'analysis_date': datetime.now().isoformat(),
                'total_articles': len(self.articles),
                'analysis_version': 'V7.0_Scientific',
                'sample_size_warning': len(self.articles) < self.MIN_SAMPLE_SIZE
            },
            'viral_threshold': viral_threshold_info,
            'viral_stats': {
                'viral_count': len(viral_articles),
                'viral_rate': round(len(viral_articles) / len(self.articles) * 100, 1),
                'threshold_used': recommended_threshold,
                'method': 'P75 (recommended)'
            },
            'keywords': {
                'all_articles': keywords_all[:10],
                'viral_articles': keywords_viral[:10],
                'extraction_method': 'TF-IDF with jieba'
            },
            'title_length': {
                'ttest_results': title_length_ttest,
                'viral_length_ci': title_length_ci,
                'recommendation': self._generate_title_length_recommendation(title_length_ci)
            },
            'topics': {
                'all_articles': topic_analysis,
                'viral_articles': viral_topic_analysis,
                'classification_method': 'multi_label_weighted'
            },
            'time_analysis': time_analysis,
            'correlations': {
                'read_like_correlation': round(read_like_correlation, 4),
                'interpretation': self._interpret_correlation(read_like_correlation)
            },
            'recommendations': self._generate_recommendations()
        }

        print("\n✅ 分析完成！")
        return self.analysis_results

    def _generate_title_length_recommendation(self, ci_info: Dict) -> str:
        """生成标题长度建议"""
        if not ci_info:
            return "数据不足"

        mean = ci_info['mean']
        ci_lower = ci_info['ci_lower']
        ci_upper = ci_info['ci_upper']

        return f"建议标题长度：{mean:.0f}字 (95% CI: {ci_lower:.0f}-{ci_upper:.0f}字)"

    def _interpret_correlation(self, r: float) -> str:
        """解释相关系数"""
        abs_r = abs(r)
        if abs_r < 0.3:
            strength = "弱相关"
        elif abs_r < 0.7:
            strength = "中等相关"
        else:
            strength = "强相关"

        direction = "正相关" if r > 0 else "负相关"
        return f"{direction}，{strength} (r={r:.3f})"

    def _generate_recommendations(self) -> List[str]:
        """生成数据驱动的建议"""
        recommendations = []

        # 基于关键词
        if self.analysis_results.get('keywords', {}).get('viral_articles'):
            top_keywords = self.analysis_results['keywords']['viral_articles'][:5]
            kw_list = ', '.join([kw[0] for kw in top_keywords])
            recommendations.append(f"💡 高频关键词建议：优先使用「{kw_list}」等词汇")

        # 基于标题长度
        if self.analysis_results.get('title_length', {}).get('viral_length_ci'):
            rec = self.analysis_results['title_length']['recommendation']
            recommendations.append(f"📏 标题长度建议：{rec}")

        # 基于话题
        viral_topics = self.analysis_results.get('topics', {}).get('viral_articles', {}).get('distribution', {})
        if viral_topics:
            best_topic = max(viral_topics.items(), key=lambda x: x[1]['weighted_score'])
            recommendations.append(f"🏷️  话题建议：「{best_topic[0]}」表现最佳 (加权得分: {best_topic[1]['weighted_score']})")

        # 基于时间
        if self.analysis_results.get('time_analysis', {}).get('recommendation'):
            recommendations.append(self.analysis_results['time_analysis']['recommendation'])

        return recommendations

    def print_report(self):
        """打印美化的分析报告"""
        if not self.analysis_results:
            print("❌ 没有分析结果")
            return

        print("\n" + "="*60)
        print("📊 微信公众号数据分析报告 (科学统计版 V7.0)")
        print("="*60 + "\n")

        # 元数据
        meta = self.analysis_results['metadata']
        print(f"📅 分析日期：{meta['analysis_date'][:19]}")
        print(f"📚 样本量：{meta['total_articles']} 篇文章")
        if meta['sample_size_warning']:
            print(f"⚠️  样本量警告：样本量小于{self.MIN_SAMPLE_SIZE}，结果可能不够可靠")
        print()

        # 爆款阈值
        print("🎯 爆款阈值定义（IQR方法）")
        print("-" * 60)
        threshold_info = self.analysis_results['viral_threshold']
        stats = threshold_info['statistics']
        print(f"   基础统计：Q1={stats['q1']}, 中位数={stats['median']}, Q3={stats['q3']}")
        print(f"   IQR = {stats['iqr']}, 均值={stats['mean']}, 标准差={stats['std']}")
        print()
        print("   各方法阈值对比：")
        for method_key, method_name in [('p75_method', 'P75'), ('p90_method', 'P90'),
                                         ('iqr_method', 'IQR'), ('mean_std_method', 'Mean+STD')]:
            method_data = threshold_info[method_key]
            print(f"   - {method_name}：{method_data['threshold']:.0f} ({method_data['description']})")

        print(f"\n   ✅ 推荐方法：P75 (阈值={threshold_info['recommended_threshold']:.0f})")
        viral_stats = self.analysis_results['viral_stats']
        print(f"   爆款文章：{viral_stats['viral_count']} 篇 ({viral_stats['viral_rate']}%)")
        print()

        # 关键词（TF-IDF）
        print("🔍 高频关键词（TF-IDF提取）")
        print("-" * 60)
        keywords_all = self.analysis_results['keywords']['all_articles']
        print("   所有文章TOP 10：")
        for i, (kw, score) in enumerate(keywords_all[:10], 1):
            print(f"   {i}. {kw} (TF-IDF: {score:.4f})")

        keywords_viral = self.analysis_results['keywords']['viral_articles']
        if keywords_viral:
            print("\n   爆款文章TOP 10：")
            for i, (kw, score) in enumerate(keywords_viral[:10], 1):
                print(f"   {i}. {kw} (TF-IDF: {score:.4f})")
        print()

        # 标题长度（含t检验）
        print("📏 标题长度分析（含统计检验）")
        print("-" * 60)
        title_analysis = self.analysis_results['title_length']
        ttest = title_analysis['ttest_results']

        if ttest['test'] == 't-test':
            print(f"   爆款文章：均值={ttest['group1']['mean']}字, 标准差={ttest['group1']['std']}, n={ttest['group1']['n']}")
            print(f"   普通文章：均值={ttest['group2']['mean']}字, 标准差={ttest['group2']['std']}, n={ttest['group2']['n']}")
            print(f"\n   t检验结果：")
            print(f"   - t统计量：{ttest['t_statistic']}")
            print(f"   - p值：{ttest['p_value']}")
            print(f"   - 显著性：{'是' if ttest['is_significant'] else '否'} (α=0.05)")
            print(f"   - 效应量：{ttest['effect_size']} (Cohen's d={ttest['cohens_d']})")
            print(f"   - 结论：{ttest['conclusion']}")

        if title_analysis.get('viral_length_ci'):
            ci = title_analysis['viral_length_ci']
            print(f"\n   爆款标题长度95%置信区间：[{ci['ci_lower']}, {ci['ci_upper']}]字")
            print(f"   标准误：{ci['std_error']}")

        print(f"\n   📌 {title_analysis['recommendation']}")
        print()

        # 话题分类（多标签）
        print("🏷️  话题分类（多标签权重评分）")
        print("-" * 60)
        topic_info = self.analysis_results['topics']['all_articles']
        print(f"   多标签模式：启用")
        print(f"   平均标签数/文章：{topic_info['avg_topics_per_article']}")
        print("\n   话题分布（按加权得分排序）：")
        for topic, stats in topic_info['distribution'].items():
            print(f"   - {topic}：{stats['count']}篇 ({stats['percentage']}%), 加权得分={stats['weighted_score']}")

        viral_topics = self.analysis_results['topics'].get('viral_articles', {}).get('distribution', {})
        if viral_topics:
            print("\n   爆款文章话题分布：")
            for topic, stats in list(viral_topics.items())[:5]:
                print(f"   - {topic}：{stats['count']}篇, 加权得分={stats['weighted_score']}")
        print()

        # 时间分析
        print("⏰ 发布时间分析（2小时时段）")
        print("-" * 60)
        time_info = self.analysis_results['time_analysis']
        best_slot = time_info.get('best_time_slot')
        if best_slot and best_slot['slot']:
            stats = best_slot['stats']
            print(f"   🏆 最佳时段：{best_slot['slot']}")
            print(f"      - 平均阅读：{stats['avg_read']:.0f}")
            print(f"      - 95% CI：[{stats['ci_read']['ci_lower']:.0f}, {stats['ci_read']['ci_upper']:.0f}]")
            print(f"      - 文章数：{stats['count']}")

        print(f"\n{time_info['recommendation']}")
        print()

        # 相关性分析
        print("💡 指标相关性分析")
        print("-" * 60)
        corr_info = self.analysis_results['correlations']
        print(f"   阅读量 vs 点赞数：{corr_info['interpretation']}")
        print()

        # 综合建议
        print("🎯 数据驱动的内容策略建议")
        print("-" * 60)
        for rec in self.analysis_results['recommendations']:
            print(f"   {rec}")

        print("\n" + "="*60)
        print("✅ 报告生成完成")
        print("="*60 + "\n")

    def save_report(self, output_file: str = None):
        """
        保存分析报告为JSON文件

        Args:
            output_file: 输出文件路径，默认为当前目录的analysis_report.json
        """
        if not self.analysis_results:
            print("❌ 没有分析结果可保存")
            return

        if output_file is None:
            output_file = Path.cwd() / "analysis_report.json"
        else:
            output_file = Path(output_file)

        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(self.analysis_results, f, ensure_ascii=False, indent=2)

            print(f"✅ 分析报告已保存到：{output_file}")

        except Exception as e:
            print(f"❌ 保存报告失败：{e}")


def main():
    """主函数"""
    # 导入PROJECT_ROOT（修复：使用绝对路径）
    import os
    from pathlib import Path

    PROJECT_ROOT = Path(os.getenv('CLAUDE_PROJECT_DIR', Path(__file__).parent.parent.parent.parent.parent))
    default_data_file = PROJECT_ROOT / "data" / "wechat_articles.json"

    # 如果命令行提供了参数，使用参数
    data_file = sys.argv[1] if len(sys.argv) > 1 else str(default_data_file)

    print("="*60)
    print("📊 微信公众号数据分析工具 V7.0 - 科学统计版")
    print("="*60)
    print("\n改进内容：")
    print("✅ IQR方法定义爆款阈值（替代硬编码1000）")
    print("✅ TF-IDF关键词提取（替代固定关键词列表）")
    print("✅ 统计显著性检验（t-test、p-value、Cohen's d）")
    print("✅ 95%置信区间和标准误")
    print("✅ 多标签话题分类（加权评分）")
    print("✅ 改进的时间序列分析（2小时时段）")
    print()

    # 创建分析器
    analyzer = WeChatDataAnalyzer(data_file)

    # 加载数据
    if not analyzer.load_data():
        sys.exit(1)

    # 执行分析
    analyzer.run_analysis()

    # 打印报告
    analyzer.print_report()

    # 保存报告
    output_file = Path.cwd() / "analysis_report.json"
    analyzer.save_report(str(output_file))

    print("\n💡 使用建议：")
    print("   1. 根据TF-IDF高频关键词选题")
    print("   2. 标题长度控制在推荐的95%置信区间内")
    print("   3. 优先创作高加权得分的话题类型")
    print("   4. 在最佳时段发布文章")
    print("   5. 定期收集数据更新分析结果\n")


if __name__ == "__main__":
    main()
