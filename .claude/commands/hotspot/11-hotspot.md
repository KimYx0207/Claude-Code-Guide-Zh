---
name: hotspot
description: 🔥 AI热点自动扫描 - 自动抓取今日AI热点并评估爆款潜力
version: 7.0.0
---

# 🔥 热点自动扫描系统 V7.0

**从"泛搜索"升级到"精准跟踪信息源头"！**

你只需要输入 `/hotspot`，系统自动完成：
1. 扫描GitHub/HackerNews一手热榜
2. 追踪X/Twitter顶流KOL动态
3. 搜索Reddit AI社区讨论
4. 获取中文AI媒体新闻
5. 检测是否已写过该话题
6. 评估每个热点的爆款潜力
7. 输出可执行的热点报告

---

## 📚 信息源参考文档

**执行前务必阅读**：
- `.claude/skills/gongzhonghao-writer/prompts/hotspot-sources-international.md` - 国际信息源
- `.claude/skills/gongzhonghao-writer/prompts/hotspot-sources-china.md` - 国内信息源
- `.claude/skills/gongzhonghao-writer/prompts/hotspot-access-methods.md` - 访问方法映射

---

## ⚡ 执行流程（完全自动，并行执行）

### 第一轮：多源并行扫描（5个工具调用，同时执行）

**必须并行调用以下5个工具**：

```
# 1. GitHub热榜（AI/ML项目）
mcp__mcp-router__trending(search_service="github", max_results=20)

# 2. HackerNews热榜（技术讨论）
mcp__mcp-router__trending(search_service="hackernews", max_results=20)

# 3. X/Twitter AI话题（KOL动态）
mcp__mcp-router__search(
    query="AI release OR AI update OR GPT OR Claude OR Gemini OR Anthropic OR OpenAI",
    search_service="x",
    max_results=20,
    time_range="day"
)

# 4. Reddit AI社区（r/LocalLLaMA + r/MachineLearning）
mcp__mcp-router__search(
    query="AI LocalLLaMA MachineLearning model release",
    search_service="reddit",
    max_results=20
)

# 5. 中文AI新闻（科技媒体）
mcp__mcp-router__news(
    query="AI 大模型 Claude GPT Gemini 发布 更新 Anthropic OpenAI",
    search_service="google",
    max_results=20,
    time_range="day"
)
```

---

### 第二轮：信息源筛选（自动执行）

**筛选规则**：

| 来源 | 保留标准 | 过滤标准 |
|------|----------|----------|
| GitHub | Stars>100 或 今日新增>50 | Fork项目、非AI相关 |
| HackerNews | 评论>50 或 点数>100 | 招聘帖、广告 |
| X/Twitter | 来自KOL 或 互动>100 | 营销号、转发 |
| Reddit | 来自r/LocalLLaMA等 或 评论>20 | 水帖、求助帖 |
| 新闻 | 24小时内 且 来自36氪/机器之心等 | 超过48小时 |

**KOL白名单**（来自这些账号的内容优先级最高）：

国际：@sama, @karpathy, @ylecun, @DarioAmodei, @JeffDean, @alexalbert__

中文：@dotey(宝玉), @op7418(歸藏), @oran_ge, @vista8

---

### 第三轮：已写文章检测（自动执行）

**调用检测脚本**：

```python
cd "C:/Users/admin/Desktop/说明/.claude/skills/gongzhonghao-writer/scripts"
python -X utf8 -c "
from written_article_detector import WrittenArticleDetector
detector = WrittenArticleDetector()

# 将扫描到的热点列表传入检测
hotspots = [
    {'title': '热点1标题', 'keywords': ['关键词1', '关键词2']},
    {'title': '热点2标题', 'keywords': ['关键词1', '关键词2']},
    # ... 所有热点
]
results = detector.batch_check(hotspots)
print(detector.generate_report(results))
"
```

**检测结果处理**：
- ✅ 可写：直接进入评分
- ⚡ 换角度：标记"需要差异化角度"
- ⚠️ 已写过：从列表移除

---

### 第四轮：热点爆款潜力评估

**评估维度（每项1-5分，共25分）**：

| 维度 | 5分标准 | 3分标准 | 1分标准 |
|------|---------|---------|---------|
| **时效性** | 6小时内 | 12-24小时 | 超过48小时 |
| **来源可信度** | 官方/顶流KOL | 知名媒体/大V | 普通账号 |
| **受众面** | 所有AI用户 | 特定工具用户 | 极小众 |
| **实用性** | 立即可用 | 有参考价值 | 纯知识 |
| **情绪点** | 强共鸣/争议/降价 | 有兴趣 | 平淡 |

**来源可信度分级**：

| 等级 | 来源类型 | 加分 |
|------|----------|------|
| S级 | 大厂官方博客(OpenAI/Anthropic/Google) | +5 |
| A级 | 顶流KOL(@sama/@karpathy/@dotey) | +4 |
| B级 | 一手平台(HackerNews头条/GitHub Trending) | +3 |
| C级 | 知名媒体(机器之心/36氪) | +2 |
| D级 | 普通来源 | +1 |

**总分标准**：
- 23-25分：🔥🔥🔥 必写！立即开工！（官方发布+时效性强）
- 18-22分：🔥🔥 强烈推荐（KOL热议+实用性高）
- 13-17分：🔥 可以写（有一定热度）
- <13分：❌ 不建议写

---

### 第五轮：自动推荐文章类型

| 热点类型 | 判断依据 | 推荐文章类型 |
|----------|----------|--------------|
| 新产品/新版本 | 包含"发布"、"更新"、"v2"、"新功能" | 测评类 |
| 降价/优惠 | 包含"降价"、"免费"、"优惠"、"促销" | 降价类 |
| 开源项目 | GitHub来源 且 Stars高 | 工具推荐类 |
| 技术突破 | 来自arXiv/论文 | 深度解读类 |
| 行业事件 | 融资/收购/人事变动 | 经验故事类 |

---

### 第六轮：输出热点报告

**输出格式**：

```
╔══════════════════════════════════════════════════════════════════════════╗
║                       🔥 今日AI热点扫描报告 V2.0                          ║
║                       扫描时间：{当前时间}                                ║
║                       信息源：GitHub/HN/X/Reddit/新闻                     ║
╚══════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥🔥🔥 必写热点（23-25分）
────────────────────────────────────────

【热点1】{热点标题}
├─ 来源：{来源平台} | 可信度：S级（官方）
├─ 时效性：⭐⭐⭐⭐⭐（3小时前）
├─ 爆款评分：24/25分
├─ 已写检测：✅ 未写过
├─ 推荐类型：测评类
├─ 推荐标题：{根据12大公式生成}
└─ 一句话理由：{为什么值得写}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥🔥 强烈推荐热点（18-22分）
────────────────────────────────────────

【热点2】{热点标题}
├─ 来源：{来源平台} | 可信度：A级（KOL）
├─ 时效性：⭐⭐⭐⭐（8小时前）
├─ 爆款评分：20/25分
├─ 已写检测：⚡ 有相似，需换角度
├─ 推荐类型：...
├─ 推荐标题：...
└─ 差异化建议：{和已有文章的差异点}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 可写热点（13-17分）
────────────────────────────────────────

【热点3】...
【热点4】...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 今日扫描统计：
├─ 扫描信息源：5个平台
├─ 原始热点：{X}个
├─ 去重后：{Y}个
├─ 已写过滤掉：{Z}个
├─ 最终可写：{N}个
└─ 必写热点：{M}个

🎯 老金建议：
今天最应该写的是【{热点名称}】
理由：{具体原因，包含来源可信度和时效性}
预期阅读：{根据类型预估}

💡 快速开始：
/auto-baokuan {热点关键词}

⚠️ 近7天已写主题（避免重复）：
{列出近7天的文章主题}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔄 第二轮深挖（可选，发现重大热点时执行）

如果第一轮发现某个热点来自官方或顶流KOL，执行深挖：

```
# 爬取官方博客全文
mcp__mcp-router__crawl(url="https://openai.com/blog")
mcp__mcp-router__crawl(url="https://www.anthropic.com/news")

# 搜索更多相关讨论
mcp__mcp-router__search(
    query="[热点关键词]",
    search_service="google",
    crawl_results=3
)
```

---

## ⚠️ 重要注意事项

1. **信息源优先级**：大厂官方 > 顶流KOL > 一手平台 > 科技媒体
2. **时效性是命**：发现好热点必须6小时内出稿
3. **去重必须做**：已写过的话题绝对不能重复
4. **角度要独特**：同一热点，你的角度要不一样
5. **不硬写**：今天没≥18分热点，宁可不写

---

## 📝 执行checklist

执行/hotspot时，确保完成以下步骤：

- [ ] 并行调用5个信息源扫描工具
- [ ] 按筛选规则过滤无效内容
- [ ] 运行已写文章检测脚本
- [ ] 对每个热点进行5维度评分
- [ ] 标注来源可信度等级
- [ ] 生成完整热点报告
- [ ] 给出明确的写作建议

---

**老金提示**：V2.0从"大海捞针"升级到"精准追踪"！跟着大V走，热点不会丢！有好热点就 `/auto-baokuan` 一键生成！

