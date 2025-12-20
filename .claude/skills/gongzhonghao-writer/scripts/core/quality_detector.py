# -*- coding: utf-8 -*-
"""
质量检测引擎 V9.0 - 配置驱动版
9维度质量检测：AI腔、自然度、真诚度、啰嗦度、重复度、可读性、人味儿、情感、脏话
"""

import sys
from pathlib import Path

# 添加config目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent.parent))
from config.loader import load_config

import re
import os
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass

try:
    import yaml
    YAML_AVAILABLE = True
except ImportError:
    YAML_AVAILABLE = False
    print("⚠️  警告：yaml模块未安装，使用硬编码默认值")
    print("   建议安装：pip install pyyaml")


@dataclass
class QualityScore:
    """
    V5统一质量评分数据类

    9维度质量标准（V5版本统一）：
    1. AI腔检测（越低越好，<20分合格）
    2. 自然度（越高越好，>80分合格）
    3. 真诚度（越高越好，>75分合格）
    4. 啰嗦度（越低越好，<25分合格，V5统一）
    5. 重复度（越低越好，<15%合格，V5统一）
    6. 可读性（越高越好，>85分合格）
    7. 人味儿指数（越高越好，>70分合格）
    8. 情感真实性（越高越好，>75分合格）
    9. 脏话检测（必须为0，V5新增严格要求）
    """
    ai_tone: float  # AI腔检测（越低越好，<20分合格）
    naturalness: float  # 自然度（越高越好，>80分合格）
    sincerity: float  # 真诚度（越高越好，>75分合格）
    wordiness: float  # 啰嗦度（越低越好，<25分合格，V5统一）
    repetition: float  # 重复度（越低越好，<15%合格，V5统一）
    readability: float  # 可读性（越高越好，>85分合格）
    humanity: float  # 人味儿指数（越高越好，>70分合格）
    emotion_authenticity: float  # 情感真实性（越高越好，>75分合格）
    profanity: float  # 脏话检测（必须为0，V5新增严格要求）

    def is_passed(self, thresholds: Optional[Dict[str, float]] = None) -> bool:
        """
        判断是否通过所有质量标准

        Args:
            thresholds: 自定义阈值字典，默认使用V6配置

        V6标准要求（从配置文件读取，默认值）：
        - AI腔检测 < 20分
        - 自然度 > 80分
        - 真诚度 > 75分
        - 啰嗦度 < 25分（V5统一）
        - 重复度 < 15%（V5统一）
        - 可读性 > 85分
        - 人味儿指数 > 70分
        - 情感真实性 > 75分
        - 脏话检测 = 0处（V5严格要求）
        """
        if thresholds is None:
            # 使用默认阈值
            thresholds = {
                'ai_tone': 20,
                'naturalness': 80,
                'sincerity': 75,
                'wordiness': 25,
                'repetition': 15,
                'readability': 85,
                'humanity': 70,
                'emotion_authenticity': 75,
                'profanity': 0
            }

        return (
            self.ai_tone < thresholds['ai_tone'] and
            self.naturalness > thresholds['naturalness'] and
            self.sincerity > thresholds['sincerity'] and
            self.wordiness < thresholds['wordiness'] and
            self.repetition < thresholds['repetition'] and
            self.readability > thresholds['readability'] and
            self.humanity > thresholds['humanity'] and
            self.emotion_authenticity > thresholds['emotion_authenticity'] and
            self.profanity == thresholds['profanity']  # V5严格零容忍脏话
        )


class QualityDetector:
    """
    V6配置外部化质量检测器 - 老金出品
    9维度全面评估文章质量，确保高质量输出！

    V6版本改进：
    - 从quality-standards.yaml读取配置
    - 支持自定义质量标准
    - 向后兼容硬编码默认值

    V5版本改进：
    - 统一所有配置文件的质量标准
    - 啰嗦度阈值从<20调整为<25（与实际检测逻辑一致）
    - 重复度阈值从<10%调整为<15%（与实际检测逻辑一致）
    - 新增脏话检测维度，严格零容忍
    """

    # V6默认值（硬编码备份，配置文件不存在时使用）
    DEFAULT_THRESHOLDS = {
        'ai_tone': 20,
        'naturalness': 80,
        'sincerity': 75,
        'wordiness': 25,
        'repetition': 15,
        'readability': 85,
        'humanity': 70,
        'emotion_authenticity': 75,
        'profanity': 0
    }

    # AI腔关键词（出现这些词就扣分）
    AI_TONE_KEYWORDS = [
        '赋能', '降本增效', '颠覆式', '划时代', '闭环', '打法',
        '生态', '矩阵', '链路', '抓手', '沉淀', '输出', '复盘',
        '强烈推荐', '可能不适合', '值得一提的是',
        '总之', '总而言之'
        # 删除了'首先'、'其次'、'再次'、'最后' - 这些是常用顺序词
        # 删除了'建议您' - 老金风格和读者是朋友，不用敬语，但引用他人的话可能会出现
    ]

    # 机械化表达模式
    MECHANICAL_PATTERNS = [
        r'^\d+[.、]\s*\w+',  # 列表式开头：1. xxx
        r'[✅❌]\s*\w+',  # 符号标记
        r'适合.*?人群',  # 用户分类
        r'Q\d*[:：]',  # FAQ格式
    ]

    # 重复词检测（老金风格口头禅）
    REPETITION_WORDS = [
        '老金我', '家人们', '咱们'
    ]

    # 脏话词汇检测（注意：'艹'和'乖乖'是老金风格口头禅，不算脏话）
    # 只检测真正不雅的词汇
    PROFANITY_WORDS = [
        'SB', '煞笔', '憨批', '傻逼', '草泥马', '操你妈',
        '妈的', '他妈的', '日你', '干你'
    ]

    # '艹'和'乖乖'是老金风格特色，不计入脏话
    # '老金'是另一个人物角色，不是脏话

    def __init__(self, config_path: Optional[str] = None):
        """
        初始化检测器 V8.0 - 配置驱动

        Args:
            config_path: 配置文件路径，默认None自动查找
        """
        self.config = self._load_config(config_path)
        self.thresholds = self._extract_thresholds(self.config)

        # V8.0：从配置中心加载规则
        quality_config = load_config('quality_config')

        # 质检阈值（从配置）
        if not self.thresholds:
            self.thresholds = quality_config.get('quality_thresholds', self.DEFAULT_THRESHOLDS)

        # 关键词列表（从配置或默认值）
        self.AI_TONE_KEYWORDS = quality_config.get('ai_tone_keywords', self.AI_TONE_KEYWORDS)
        self.PROFANITY_WORDS = quality_config.get('profanity_words', self.PROFANITY_WORDS)

        # 从配置更新关键词列表（如果配置文件提供）
        if self.config and 'quality_standards' in self.config:
            self._update_keywords_from_config(self.config['quality_standards'])

    def _load_config(self, config_path: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        加载配置文件

        Args:
            config_path: 配置文件路径

        Returns:
            配置字典，失败返回None
        """
        if not YAML_AVAILABLE:
            return None

        # 自动查找配置文件
        if config_path is None:
            # 从当前文件路径向上查找.claude/config/quality-standards.yaml
            current_file = Path(__file__).resolve()
            claude_dir = current_file.parent.parent.parent.parent  # 到.claude目录
            config_path = claude_dir / 'config' / 'quality-standards.yaml'

        if not Path(config_path).exists():
            return None

        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = yaml.safe_load(f)
            return config
        except Exception as e:
            print(f"⚠️  警告：加载配置文件失败: {e}")
            return None

    def _extract_thresholds(self, config: Optional[Dict[str, Any]]) -> Dict[str, float]:
        """
        从配置提取阈值

        Args:
            config: 配置字典

        Returns:
            阈值字典
        """
        if not config or 'quality_standards' not in config:
            return self.DEFAULT_THRESHOLDS.copy()

        thresholds = {}
        standards = config['quality_standards']

        for key in self.DEFAULT_THRESHOLDS.keys():
            if key in standards and 'threshold' in standards[key]:
                thresholds[key] = standards[key]['threshold']
            else:
                thresholds[key] = self.DEFAULT_THRESHOLDS[key]

        return thresholds

    def _update_keywords_from_config(self, standards: Dict[str, Any]) -> None:
        """
        从配置更新关键词列表

        Args:
            standards: quality_standards配置
        """
        # 更新AI腔关键词
        if 'ai_tone' in standards and 'keywords' in standards['ai_tone']:
            self.AI_TONE_KEYWORDS = standards['ai_tone']['keywords']

        # 更新机械化模式
        if 'ai_tone' in standards and 'mechanical_patterns' in standards['ai_tone']:
            self.MECHANICAL_PATTERNS = standards['ai_tone']['mechanical_patterns']

        # 更新重复词
        if 'repetition' in standards and 'repetition_words' in standards['repetition']:
            self.REPETITION_WORDS = standards['repetition']['repetition_words']

        # 更新脏话词汇
        if 'profanity' in standards and 'profanity_words' in standards['profanity']:
            self.PROFANITY_WORDS = standards['profanity']['profanity_words']

    def detect(self, content: str) -> QualityScore:
        """
        执行全面质量检测

        Args:
            content: 文章内容

        Returns:
            QualityScore: 9维度评分结果
        """
        # 预处理：提取代码块外的正文内容用于AI腔和机械化检测
        # 代码块内的列表格式是正常的，不应该被检测为AI腔
        clean_content = self._remove_code_blocks(content)

        return QualityScore(
            ai_tone=self._detect_ai_tone(clean_content),  # 只检测正文
            naturalness=self._detect_naturalness(clean_content),  # 检测正文（段落结构）
            sincerity=self._detect_sincerity(content),  # 检测全文
            wordiness=self._detect_wordiness(clean_content),  # 检测正文
            repetition=self._detect_repetition(content),  # 检测全文
            readability=self._detect_readability(clean_content),  # 检测正文（代码块不算句子）
            humanity=self._detect_humanity(content),  # 检测全文
            emotion_authenticity=self._detect_emotion_authenticity(content),  # 检测全文
            profanity=self._detect_profanity(content)  # 检测全文（脏话在哪都不行）
        )

    def _remove_code_blocks(self, content: str) -> str:
        """
        移除Markdown代码块，只保留正文内容

        代码块内的列表格式是正常的技术内容，不应该被检测为AI腔
        """
        return re.sub(r'```[\s\S]*?```', '', content)

    def _detect_ai_tone(self, content: str) -> float:
        """
        检测AI腔程度（0-100分，越低越好）
        AI腔就是那种一看就知道是机器写的生硬语气！
        """
        score = 0.0
        total_chars = len(content)

        # 检测AI腔关键词
        for keyword in self.AI_TONE_KEYWORDS:
            count = content.count(keyword)
            score += count * 10  # 每出现一次扣10分

        # 检测机械化表达模式
        for pattern in self.MECHANICAL_PATTERNS:
            matches = re.findall(pattern, content, re.MULTILINE)
            score += len(matches) * 5  # 每个模式扣5分

        # 检测过度结构化（连续的列表项）
        list_items = re.findall(r'^\s*[-*•]\s+', content, re.MULTILINE)
        if len(list_items) > 5:
            score += (len(list_items) - 5) * 3

        # 标准化到0-100
        return min(100, score)

    def _detect_naturalness(self, content: str) -> float:
        """
        检测自然度（0-100分，越高越好）
        就像和朋友聊天一样自然，不生硬！
        """
        score = 100.0

        # 检测句子长度变化（自然的文章长短句结合）
        sentences = re.split(r'[。！？]', content)
        sentences = [s.strip() for s in sentences if s.strip()]

        if len(sentences) > 0:
            lengths = [len(s) for s in sentences]
            avg_length = sum(lengths) / len(lengths)

            # 句子长度方差（变化越大越自然）
            variance = sum((l - avg_length) ** 2 for l in lengths) / len(lengths)

            # 如果句子长度太统一，扣分
            if variance < 50:
                score -= 20

        # 检测段落呼吸感（段落间是否有空行）
        paragraphs = content.split('\n\n')
        if len(paragraphs) < 3:
            score -= 15  # 没有段落分隔，太压抑

        # 检测口语化表达
        colloquial_words = ['老金我', '咱们', '家人们']
        colloquial_count = sum(content.count(w) for w in colloquial_words)
        if colloquial_count > 0:
            score += min(10, colloquial_count * 2)

        return max(0, min(100, score))

    def _detect_sincerity(self, content: str) -> float:
        """
        检测真诚度（0-100分，越高越好）
        真诚不做作，不刻意煽情！
        """
        score = 80.0  # 基础分

        # 检测过度煽情词汇
        over_emotional = ['感动', '震撼', '颠覆', '革命性', '史无前例', '前所未有']
        for word in over_emotional:
            if word in content:
                score -= 10

        # 检测真实体验词汇（加分）
        authentic_words = ['踩坑', '翻车', '后来', '发现', '原来', '没想到']
        for word in authentic_words:
            if word in content:
                score += 5

        # 检测具体数字和案例（真实体验的标志）
        numbers = re.findall(r'\d+[%倍秒分钟小时天]', content)
        if len(numbers) > 0:
            score += min(15, len(numbers) * 3)

        return max(0, min(100, score))

    def _detect_wordiness(self, content: str) -> float:
        """
        检测啰嗦度（0-100分，越低越好）
        啰嗦就是废话太多，说半天说不到点子上！
        """
        score = 0.0
        total_chars = len(content)

        # 检测重复短语
        sentences = re.split(r'[。！？]', content)
        sentences = [s.strip() for s in sentences if s.strip()]

        # 统计3字以上的重复短语
        phrases = []
        for s in sentences:
            words = list(s)
            for i in range(len(words) - 2):
                phrase = ''.join(words[i:i+3])
                phrases.append(phrase)

        unique_phrases = set(phrases)
        if len(phrases) > 0:
            repetition_rate = 1 - (len(unique_phrases) / len(phrases))
            score += repetition_rate * 50

        # 检测冗余词汇
        redundant_words = ['的话', '来说', '而言', '方面', '进行', '实现']
        for word in redundant_words:
            count = content.count(word)
            score += count * 2

        return min(100, score)

    def _detect_repetition(self, content: str) -> float:
        """
        检测重复度（0-100%，越低越好）
        同样的词、同样的句式别重复太多次！
        """
        # 检测口头禅重复
        repetition_count = 0
        for word in self.REPETITION_WORDS:
            count = content.count(word)
            if count > 3:  # 超过3次就算重复
                repetition_count += (count - 3)

        # 计算重复率
        total_sentences = len(re.split(r'[。！？]', content))
        repetition_rate = (repetition_count / max(1, total_sentences)) * 100

        return min(100, repetition_rate)

    def _detect_readability(self, content: str) -> float:
        """
        检测可读性（0-100分，越高越好）
        读起来流畅不费劲！
        """
        score = 90.0  # 基础分

        # 检测句子长度
        sentences = re.split(r'[。！？]', content)
        sentences = [s.strip() for s in sentences if s.strip()]

        sentence_penalty = 0
        for s in sentences:
            length = len(s)
            if length > 100:  # 超长句子（>100字），扣2分
                sentence_penalty += 2
            elif length > 80:  # 较长句子（>80字），扣1分
                sentence_penalty += 1
            # 删除了"句子太短也扣分"的规则 - 短句很自然，不算问题

        # 句子扣分上限：20分
        score -= min(20, sentence_penalty)

        # 检测段落长度
        paragraphs = [p.strip() for p in content.split('\n\n') if p.strip()]

        paragraph_penalty = 0
        for p in paragraphs:
            sentence_count = len(re.split(r'[。！？]', p))
            # 提高了阈值，适应"句号换行"的写作习惯
            if sentence_count > 12:  # 段落超过12句，扣3分
                paragraph_penalty += 3
            elif sentence_count > 8:  # 段落超过8句，扣2分
                paragraph_penalty += 2

        # 段落扣分上限：15分
        score -= min(15, paragraph_penalty)

        return max(0, min(100, score))

    def _detect_humanity(self, content: str) -> float:
        """
        检测人味儿指数（0-100分，越高越好）
        检测文章是否像真人写的，有个性！
        """
        score = 70.0  # 基础分

        # 检测个人化表达
        personal_words = ['老金我', '我', '咱', '咱们']
        for word in personal_words:
            if word in content:
                score += 5

        # 检测真实情感词汇
        emotion_words = ['没想到', '原来', '后来', '发现', '真是']
        emotion_count = sum(content.count(w) for w in emotion_words)
        if emotion_count > 0:
            score += min(15, emotion_count * 2)

        # 检测对话感（问号的使用）
        question_count = content.count('?') + content.count('?')
        if question_count > 0:
            score += min(10, question_count * 2)

        return max(0, min(100, score))

    def _detect_emotion_authenticity(self, content: str) -> float:
        """
        检测情感真实性（0-100分，越高越好）
        情感要真实，不要刻意煽情！
        """
        score = 80.0  # 基础分

        # 检测过度表达（太多感叹号就是用力过猛）
        exclamation_count = content.count('!')+ content.count('!')
        total_sentences = len(re.split(r'[。！？]', content))
        if total_sentences > 0:
            exclamation_rate = exclamation_count / total_sentences
            if exclamation_rate > 0.3:  # 超过30%就是过度了
                score -= 20

        # 检测真实困惑/担忧表达（加分）
        authentic_emotions = ['没想到', '差点', '险些', '还好', '幸亏']
        for word in authentic_emotions:
            if word in content:
                score += 5

        return max(0, min(100, score))

    def _detect_profanity(self, content: str) -> float:
        """
        检测脏话和不当用词（计数，必须为0）
        公众人物形象要求，零容忍脏话！
        """
        profanity_count = 0

        # 1. 检测普通脏话词汇（直接计数）
        for word in self.PROFANITY_WORDS:
            count = content.count(word)
            profanity_count += count

        # 2. 特殊处理tm（区分技术术语和脏话）
        # 查找独立的tm（前后不是字母数字、不是点号）
        pattern = r'(?<![a-zA-Z0-9_.\*])tm(?![a-zA-Z0-9_])'
        tm_matches = re.findall(pattern, content, re.IGNORECASE)

        # 进一步过滤技术术语上下文
        for match in tm_matches:
            # 找到匹配位置
            pos = content.lower().find(match.lower())
            if pos == -1:
                continue

            # 获取上下文（前后15个字符）
            context_start = max(0, pos - 15)
            context_end = min(len(content), pos + 15)
            context = content[context_start:context_end].lower()

            # 技术术语关键词
            tech_keywords = [
                'autopilot', 'tesla', '.tmp', 'html', 'trademark',
                'temp', 'temporary', 'template', 'file', 'extension'
            ]

            # 如果上下文不包含技术关键词，才算脏话
            if not any(tech in context for tech in tech_keywords):
                profanity_count += 1

        return float(profanity_count)

    def generate_report(self, score: QualityScore) -> str:
        """
        生成质量检测报告
        老金给你详细说说这文章哪里好哪里不好！
        """
        # 使用实例的阈值配置
        t = self.thresholds

        report = "=" * 50 + "\n"
        report += "老金质量检测报告（9维度）\n"
        if self.config:
            report += f"V{self.config.get('version', '6.0.0')} - 配置驱动\n"
        report += "=" * 50 + "\n\n"

        report += f"【AI腔检测】: {score.ai_tone:.1f}分 "
        report += "✅ 通过\n" if score.ai_tone < t['ai_tone'] else f"❌ 不合格（需<{t['ai_tone']}分）\n"

        report += f"【自然度】: {score.naturalness:.1f}分 "
        report += "✅ 通过\n" if score.naturalness > t['naturalness'] else f"❌ 不合格（需>{t['naturalness']}分）\n"

        report += f"【真诚度】: {score.sincerity:.1f}分 "
        report += "✅ 通过\n" if score.sincerity > t['sincerity'] else f"❌ 不合格（需>{t['sincerity']}分）\n"

        report += f"【啰嗦度】: {score.wordiness:.1f}分 "
        report += "✅ 通过\n" if score.wordiness < t['wordiness'] else f"❌ 不合格（需<{t['wordiness']}分）\n"

        report += f"【重复度】: {score.repetition:.1f}% "
        report += "✅ 通过\n" if score.repetition < t['repetition'] else f"❌ 不合格（需<{t['repetition']}%）\n"

        report += f"【可读性】: {score.readability:.1f}分 "
        report += "✅ 通过\n" if score.readability > t['readability'] else f"❌ 不合格（需>{t['readability']}分）\n"

        report += f"【人味儿指数】: {score.humanity:.1f}分 "
        report += "✅ 通过\n" if score.humanity > t['humanity'] else f"❌ 不合格（需>{t['humanity']}分）\n"

        report += f"【情感真实性】: {score.emotion_authenticity:.1f}分 "
        report += "✅ 通过\n" if score.emotion_authenticity > t['emotion_authenticity'] else f"❌ 不合格（需>{t['emotion_authenticity']}分）\n"

        report += f"【脏话检测】: {int(score.profanity)}处 "
        report += "✅ 通过\n" if score.profanity == t['profanity'] else f"❌ 不合格（公众人物形象要求，必须{t['profanity']}处）\n"

        report += "\n" + "=" * 50 + "\n"
        report += "【最终结果】: "
        if score.is_passed(self.thresholds):
            report += "✅ 全部通过！文章质量杠杠的！\n"
        else:
            report += "❌ 有问题需要修正！别急着发布！\n"
        report += "=" * 50 + "\n"

        return report


if __name__ == "__main__":
    # 测试代码
    detector = QualityDetector()

    test_content = """
老金我今天给家人们扒一扒这个AI工具。

真是，这玩意儿真的厉害！

昨天老金我用了一下午，发现效率提升了3倍。从原来2小时的工作，现在40分钟就搞定了。

后来发现，关键在于它的自动化功能特别强大。

关注老金，AI 工具不迷路，咱们下回再接着扒！
"""

    import sys
    import io
    # 强制使用UTF-8输出，解决Windows GBK编码问题
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    score = detector.detect(test_content)
    print(detector.generate_report(score))
