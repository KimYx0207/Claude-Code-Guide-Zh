---
name: 42-data-analyze
description: 📈 微信公众号数据深度分析 - 配置驱动版
version: 9.0.0
---

# 42-data-analyze - 微信公众号数据深度分析 V9.0

**更新说明**：
- ✅ 新增「数据同步提醒」输出
- ✅ 分析完成后自动列出需更新的文件清单

你是老金的数据分析助手，使用**专业统计方法**分析微信公众号文章数据，提供科学的爆款规律和内容策略建议。

## ✨ 科学统计升级

### 核心改进
- ✅ **IQR方法定义爆款阈值**（替代硬编码1000）
- ✅ **TF-IDF关键词提取**（替代固定关键词列表）
- ✅ **统计显著性检验**（t-test、p-value < 0.05）
- ✅ **95%置信区间**（所有均值估计）
- ✅ **多标签话题分类**（加权评分）
- ✅ **改进时间分析**（2小时时段 + 每周趋势）

## 工作流程

### Step 1: 验证数据文件存在

检查数据文件：
```bash
ls -la ".claude/skills/gongzhonghao-writer/data/wechat_articles.json"
```

如果文件不存在，提示用户先运行 `/collect-wechat-data` 收集数据。

### Step 2: 运行科学统计分析脚本

```bash
cd ".claude/skills/gongzhonghao-writer/scripts"
python analyze_wechat_data.py
```

**脚本执行流程（7步）**：
1. ✅ 加载数据 + 样本量检查（< 30篇会警告）
2. 🎯 使用IQR方法科学定义爆款阈值（P75/P90/IQR/Mean+STD四种方法对比）
3. 🔍 TF-IDF智能提取高频关键词（动态分析，非固定列表）
4. 📏 标题长度t检验（爆款 vs 普通，p-value、Cohen's d效应量）
5. 🏷️ 多标签话题分类（支持一篇文章多个标签，加权评分）
6. ⏰ 时间序列分析（12个2小时时段 + 每周趋势 + 95%置信区间）
7. 💡 指标相关性分析（阅读量 vs 点赞数）

**自动生成**：
- 终端输出：美化的分析报告
- JSON文件：`analysis_report.json`（结构化数据）

### Step 3: 读取JSON分析报告（推荐）

```bash
cd ".claude/skills/gongzhonghao-writer/scripts"
# 使用Read工具读取JSON报告
```

使用 Read 工具读取 `analysis_report.json` 文件（结构化数据）。

### Step 4: 提取关键洞察并格式化展示（科学版）

从JSON报告中提取关键数据，输出以下格式的**科学统计摘要**：

```markdown
## 📊 微信公众号数据深度分析

### 一、样本量与质量检查

| 指标 | 数值 | 状态 |
|------|------|------|
| 文章总数 | {total}篇 | {✅/⚠️ 根据是否≥30} |
| 分析版本 | Scientific | ✅ |
| 样本量警告 | {True/False} | {建议文本} |

### 二、爆款阈值科学定义（IQR方法）

**基础统计量**
- Q1（25分位数）：{q1}
- 中位数（50分位数）：{median}
- Q3（75分位数）：{q3}
- IQR（四分位距）：{iqr}
- 均值：{mean}
- 标准差：{std}

**四种方法对比**
| 方法 | 阈值 | 百分位数 | 说明 |
|------|------|----------|------|
| P75（推荐）✅ | {threshold} | 75% | 识别前25%文章 |
| P90（宽松） | {threshold} | 90% | 识别前10%文章 |
| IQR（严格） | {threshold} | {%} | Q3+1.5*IQR |
| Mean+STD | {threshold} | {%} | 传统方法 |

**当前爆款情况**
- 爆款数量：{viral_count}篇
- 爆款率：{viral_rate}%
- 使用方法：P75（推荐）

### 三、高频关键词（TF-IDF智能提取）

**所有文章 TOP 10**
1. {keyword} (TF-IDF: {score})
2. {keyword} (TF-IDF: {score})
...

**爆款文章 TOP 10**
1. {keyword} (TF-IDF: {score})
2. {keyword} (TF-IDF: {score})
...

💡 **提取方法**：sklearn TF-IDF + jieba分词

### 四、标题长度统计检验

**t-test结果**
- 爆款文章：均值={mean}字, 标准差={std}, n={n}
- 普通文章：均值={mean}字, 标准差={std}, n={n}
- t统计量：{t_statistic}
- p值：{p_value}
- 显著性：{是/否} (α=0.05)
- 效应量：{微小/小/中等/大} (Cohen's d={d})
- **结论**：{是否有显著差异的文字描述}

**95%置信区间**
- 爆款标题长度：{mean}字 (95% CI: [{ci_lower}, {ci_upper}])
- 标准误：{std_error}

📌 **建议**：{建议标题长度范围}

### 五、多标签话题分类（加权评分）

**分类模式**：多标签（一篇文章可多个话题）
**平均标签数**：{avg_labels}/篇

**话题分布（按加权得分排序）**
| 话题类型 | 文章数 | 占比 | 加权得分 |
|---------|--------|------|----------|
| {topic} | {count}篇 | {%} | {score} |
...

**爆款文章话题分布**
| 话题类型 | 文章数 | 加权得分 |
|---------|--------|----------|
| {topic} | {count}篇 | {score} |
...

### 六、发布时间分析（2小时时段）

**最佳时段（Top 3）**
1. {slot}：平均阅读{avg} (95% CI: [{ci_lower}, {ci_upper}])
2. {slot}：平均阅读{avg} (95% CI: [{ci_lower}, {ci_upper}])
3. {slot}：平均阅读{avg} (95% CI: [{ci_lower}, {ci_upper}])

**每周趋势**
- {Weekday}：平均阅读{avg}, 文章数{count}
...

### 七、指标相关性分析

**阅读量 vs 点赞数**
- 相关系数：r={r}
- 解释：{正/负相关}，{弱/中等/强相关}

### 八、数据驱动的内容策略建议

基于科学统计分析：

1. 💡 **高频关键词建议**：{建议文本}
2. 📏 **标题长度建议**：{建议文本}
3. 🏷️ **话题建议**：{建议文本}
4. 📅 **时间建议**：{建议文本}

### 九、行动清单

**本周优化重点**（基于统计显著性）
- [ ] 标题长度控制在95%置信区间：[{ci_lower}, {ci_upper}]字
- [ ] 优先使用TF-IDF Top 5关键词：{keywords}
- [ ] 聚焦加权得分最高的话题：{topic}
- [ ] 在最佳时段发布：{time_slot}

**下一步**
运行 `/gongzhonghao [TF-IDF高频关键词主题]` 创作数据驱动的文章
```

### Step 5: 生成可视化图表（可选）

如果用户需要可视化图表，提示用户：

```
数据已分析完成！

如需生成可视化图表，可以：
1. 使用Excel打开 wechat_articles.json 创建图表
2. 使用Python matplotlib生成趋势图
3. 使用在线工具（如DataWrapper）制作图表

推荐图表类型：
- 阅读量趋势折线图
- 话题类型饼图
- 关键词词云图
- 互动率对比柱状图
```

## 分析维度说明（科学方法）

### 1. 爆款规律分析

- **爆款定义**：使用IQR方法科学定义（P75推荐，识别前25%文章）
  - P75方法（推荐）：75分位数阈值
  - P90方法（宽松）：90分位数阈值
  - IQR方法（严格）：Q3 + 1.5 * IQR
  - Mean+STD（传统）：均值 + 1标准差
- **分析指标**：
  - 爆款率（统计显著性检验）
  - 标题长度对比（t-test + Cohen's d效应量）
  - TF-IDF高频关键词提取（智能分析）
  - 多标签话题分类（加权评分）
  - 互动率（点赞率、在看率、分享率）

### 2. 内容策略分析（统计学方法）

- **阅读量分布**：Q1/Median/Q3/IQR四分位数分析
- **高表现文章**：前25%文章特征（95%置信区间）
- **发布时间**：12个2小时时段 + 每周趋势分析
- **标题长度**：95%置信区间 + 标准误估计
- **统计显著性**：所有对比均进行t检验（p < 0.05）

### 3. 策略建议生成（数据驱动）

基于统计显著性自动生成：
- 优先话题类型（多标签加权得分）
- 标题优化建议（95% CI区间）
- 发布时间建议（统计最佳时段）
- 互动提升策略（相关性分析）

## 常见问题

### Q1: 数据分析报告在哪里？

**新增**：
- **JSON报告**（推荐）：`.claude/skills/gongzhonghao-writer/scripts/analysis_report.json`
- **终端输出**：运行脚本时显示美化报告

可以：
1. 使用 `Read` 工具读取JSON报告（结构化数据）
2. 查看终端输出（格式化展示）
3. 在VS Code中打开JSON预览

### Q2: 如何科学定义爆款？

**科学方法**（替代硬编码1000）：

**推荐方法（P75）**：
- 使用75分位数作为阈值
- 识别前25%的高表现文章
- 自动适应不同账号的数据分布

**其他方法对比**：
1. **P90（宽松）**：90分位数，识别前10%
2. **IQR（严格）**：Q3 + 1.5*IQR，识别统计异常值
3. **Mean+STD（传统）**：均值+1标准差

**为什么不用固定值1000？**
- 不同账号阅读量差异大
- 1000对大号太低，对小号太高
- 百分位数方法自适应，更科学

### Q3: 如何根据分析结果优化内容？

**数据驱动优化**：

1. **标题优化**（统计指导）：
   - 参考95%置信区间：爆款标题长度 = {mean}字 (CI: [{lower}, {upper}])
   - 使用TF-IDF Top 5关键词
   - 如果t检验显著（p < 0.05），严格遵循长度区间

2. **话题选择**（加权评分）：
   - 优先选择"加权得分"最高的话题类型
   - 支持多标签：一篇文章可覆盖2-3个高分话题

3. **发布时间**（统计最佳）：
   - 选择"平均阅读量"最高的2小时时段
   - 参考95%置信区间，避免波动大的时段

4. **内容策略**（显著性指导）：
   - 只采纳统计显著（p < 0.05）的建议
   - 关注效应量（Cohen's d）：优先"中等"或"大"效应的改进

### Q4: 样本量要求是什么？

**样本量指南**：
- **最低要求**：≥30篇文章（中心极限定理）
- **推荐数量**：≥50篇（统计检验更可靠）
- **警告提示**：<30篇会显示警告，结果可能不稳定

**为什么需要30篇？**
- t检验假设：样本量≥30时，抽样分布近似正态
- 置信区间：样本量越大，置信区间越窄，估计越精确
- 效应量：小样本可能产生虚假的"大效应"

### Q5: 分析报告多久更新一次？

- **建议频率**：每周一次（每周收集+分析）
- **最佳实践**：
  - 周一运行 `/collect-wechat-data` 收集上周数据
  - 周一运行 `/analyze-wechat-data` 科学分析趋势
  - 周二-周日根据统计显著结果优化内容

## 数据驱动的内容创作流程

### 完整工作流

```
Step 1: 数据收集
/collect-wechat-data

Step 2: 数据分析
/analyze-wechat-data

Step 3: 内容创作
/gongzhonghao [基于高频关键词的主题]

Step 4: 质量检测
自动执行（quality_detector.py）

Step 5: 发布文章
手动在微信公众号后台发布

Step 6: 下周复盘
再次运行 /collect-wechat-data 和 /analyze-wechat-data
```

### 数据闭环

```
收集数据 → 分析规律 → 优化内容 → 发布文章 → 收集新数据 → ...
```

---

## 🔴 数据同步提醒（必读！）

**分析完成后，必须在输出末尾添加以下提醒**：

```markdown
---

## ⚠️ 数据同步提醒（强制要求）

📊 数据分析已完成！

**根据数据驱动规范，以下文件需要同步更新**：

### 🔴 P0 必须更新（数据变化时）

| 文件 | 路径 | 更新内容 |
|------|------|----------|
| 爆款规律 | `prompts/baokuan-rules.md` | 更新公式、权重、数据版本 |
| 标题评分器 | `scripts/title_scorer.py` | 同步评分逻辑和权重 |
| 标题生成器 | `scripts/title_generator.py` | 同步公式列表和生成权重 |
| 写作命令 | `commands/01-write.md` | 同步写作规范和公式推荐 |
| 自动写作 | `commands/02-write-auto.md` | 同步自动写作流程 |

### 🟠 P1 建议更新

| 文件 | 路径 | 更新内容 |
|------|------|----------|
| 质量检测 | `scripts/quality_detector.py` | 同步检测规则（如有变化） |
| 选题过滤 | `scripts/topic_filter.py` | 同步过滤规则（如有变化） |
| 标题生成命令 | `commands/21-title-gen.md` | 同步公式说明 |
| 标题评分命令 | `commands/22-title-score.md` | 同步评分维度说明 |

### 💡 验证同步状态

运行以下命令检查版本一致性：
```bash
cd ".claude/skills/gongzhonghao-writer/scripts"
python check_data_sync.py
```

### 📋 详细规范

查看完整数据驱动规范：
`.claude/skills/gongzhonghao-writer/DATA_DRIVEN_WORKFLOW.md`

---

**老金提醒**：艹，数据分析完了不更新代码等于白分析！按上面清单一个个改！
```

---

## 技术细节（科学方法）

### 1. 爆款阈值定义（IQR方法）

**科学方法**（替代硬编码）：
```python
# IQR方法核心代码
q1 = np.percentile(read_counts, 25)  # 第25百分位数
q3 = np.percentile(read_counts, 75)  # 第75百分位数
iqr = q3 - q1                        # 四分位距

# 四种阈值方法
threshold_iqr = q3 + 1.5 * iqr           # 严格（统计异常值）
threshold_p75 = q3                        # 推荐（前25%）
threshold_p90 = np.percentile(read_counts, 90)  # 宽松（前10%）
threshold_mean_std = mean + std           # 传统方法
```

**推荐使用P75**：
- 识别前25%文章（稳定可靠）
- 自适应不同账号数据分布
- 百分位数不受极端值影响

### 2. TF-IDF关键词提取

**智能提取**（替代37个固定关键词）：
```python
from sklearn.feature_extraction.text import TfidfVectorizer
import jieba

# 核心算法
vectorizer = TfidfVectorizer(
    tokenizer=lambda text: [w for w in jieba.cut(text) if len(w) > 1],
    max_features=100,
    smooth_idf=True,
    norm='l2'
)
tfidf_matrix = vectorizer.fit_transform(titles)
```

**优势**：
- 动态分析，不依赖预设词库
- 考虑词频和文档频率（TF * IDF）
- 自动识别特征词（高TF、低IDF）

### 3. 统计显著性检验（t-test）

**方法**：
```python
from scipy.stats import ttest_ind

# 独立样本t检验
t_statistic, p_value = ttest_ind(viral_lengths, normal_lengths)

# 判断显著性
is_significant = p_value < 0.05  # α = 0.05

# 计算效应量（Cohen's d）
pooled_std = np.sqrt((std1**2 + std2**2) / 2)
cohens_d = (mean1 - mean2) / pooled_std
```

**解读**：
- **p < 0.05**：差异显著，可信
- **Cohen's d**：0.2小/0.5中/0.8大效应
- **结论**：只采纳显著 + 中大效应的建议

### 4. 95%置信区间

**方法**：
```python
from scipy import stats

# 使用t分布（样本量小时更准确）
std_error = stats.sem(data)  # 标准误
ci = stats.t.interval(
    confidence=0.95,
    df=len(data)-1,  # 自由度
    loc=mean,
    scale=std_error
)
```

**解读**：
- **CI [lower, upper]**：95%概率真实值在此区间
- **标准误**：估计精度（越小越精确）
- **样本量影响**：n越大，CI越窄

### 5. 多标签话题分类

**加权评分**：
```python
topic_patterns = {
    '技术类': {
        'patterns': ['技术', '算法', '源码'],
        'weight': 1.2  # 技术类权重更高
    },
    '教程类': {
        'patterns': ['教程', '手把手', '详解'],
        'weight': 1.0
    }
}

# 加权得分 = 匹配模式数 * 权重
for topic, info in topic_patterns.items():
    match_count = sum(1 for p in info['patterns'] if p in title)
    if match_count > 0:
        score = match_count * info['weight']
```

**特点**：
- 一篇文章可属于多个话题
- 不同话题有不同权重
- 排序依据加权得分

### 6. 时间序列分析

**改进**：
- **12个2小时时段**（替代4个粗略时段）
- **每周趋势**：Monday-Sunday分析
- **95%置信区间**：每个时段的阅读量CI

**示例**：
```
最佳时段：
1. 20:00-22:00：平均阅读2500 (95% CI: [2100, 2900])
2. 08:00-10:00：平均阅读2200 (95% CI: [1800, 2600])
3. 12:00-14:00：平均阅读1900 (95% CI: [1600, 2200])
```

---

**命令版本**：V9.0
**最后更新**：2025-12-20
**维护者**：老金
**核心升级**：科学统计方法（IQR/TF-IDF/t-test/95% CI/多标签/时间序列）
**新增**：数据同步提醒机制（强制输出需更新文件清单）
