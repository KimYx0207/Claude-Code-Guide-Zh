# 热点源访问方法映射表

> 定义每个信息源的最佳访问方式，确保/hotspot命令能正确获取数据

---

## 一、MCP工具可用性

### 当前可用的MCP工具

| 工具 | 用途 | 调用方式 | 限制 |
|------|------|----------|------|
| mcp__mcp-router__trending | GitHub/HackerNews热榜 | `search_service="github"/"hackernews"` | 无限制 |
| mcp__mcp-router__search | 通用搜索 | `search_service="google"/"reddit"/"x"/"github"` | 无限制 |
| mcp__mcp-router__news | 新闻搜索 | `search_service="google"/"bing"/"hackernews"` | 无限制 |
| mcp__mcp-router__brave_web_search | Brave搜索 | 直接调用 | 2000次/月 |
| mcp__mcp-router__crawl | 网页爬取 | 需要URL | 无限制 |
| mcp__mcp-router__fetch | URL抓取 | 需要URL | 无限制 |

---

## 二、国际信息源访问方法

### 大厂官方博客

| 来源 | URL | 访问方法 | 优先级 |
|------|-----|----------|--------|
| OpenAI Blog | https://openai.com/blog | `crawl` 或 `search(query="site:openai.com/blog")` | ⭐⭐⭐⭐⭐ |
| Anthropic News | https://www.anthropic.com/news | `crawl` 或 `search(query="site:anthropic.com/news")` | ⭐⭐⭐⭐⭐ |
| Google AI Blog | https://blog.google/technology/ai/ | `search(query="site:blog.google AI")` | ⭐⭐⭐⭐⭐ |
| DeepMind Blog | https://deepmind.google/discover/blog/ | `search(query="site:deepmind.google")` | ⭐⭐⭐⭐ |
| Meta AI Blog | https://ai.meta.com/blog/ | `search(query="site:ai.meta.com")` | ⭐⭐⭐⭐ |

**推荐策略**：
```
# 方式1：直接爬取官方博客（最准确）
mcp__mcp-router__crawl(url="https://openai.com/blog")

# 方式2：搜索引擎查询（有延迟但更全）
mcp__mcp-router__search(query="OpenAI 发布 更新", search_service="google", time_range="day")
```

### X/Twitter KOL

| 账号 | 访问方法 | 查询示例 |
|------|----------|----------|
| @sama (Sam Altman) | `search(search_service="x")` | `query="from:sama AI"` |
| @karpathy | `search(search_service="x")` | `query="from:karpathy"` |
| @dotey (宝玉) | `search(search_service="x")` | `query="from:dotey AI"` |
| @op7418 (歸藏) | `search(search_service="x")` | `query="from:op7418"` |
| @ylecun | `search(search_service="x")` | `query="from:ylecun"` |
| @DarioAmodei | `search(search_service="x")` | `query="from:DarioAmodei"` |

**推荐策略**：
```
# 方式1：搜索特定KOL
mcp__mcp-router__search(
    query="AI OR GPT OR Claude",
    search_service="x",
    max_results=10,
    time_range="day"
)

# 方式2：搜索AI话题
mcp__mcp-router__search(
    query="AI 发布 OR AI 更新 OR GPT OR Claude",
    search_service="x",
    max_results=20
)
```

### Reddit社区

| 社区 | 访问方法 | 查询示例 |
|------|----------|----------|
| r/LocalLLaMA | `search(search_service="reddit")` | `query="LocalLLaMA"` |
| r/MachineLearning | `search(search_service="reddit")` | `query="MachineLearning AI"` |
| r/ChatGPT | `search(search_service="reddit")` | `query="ChatGPT"` |
| r/ClaudeAI | `search(search_service="reddit")` | `query="ClaudeAI"` |

**推荐策略**：
```
# Reddit专项搜索
mcp__mcp-router__search(
    query="AI model release OR update",
    search_service="reddit",
    max_results=15
)
```

### GitHub/HackerNews

| 来源 | 访问方法 | 调用示例 |
|------|----------|----------|
| GitHub Trending | `trending(search_service="github")` | 获取热门项目 |
| HackerNews | `trending(search_service="hackernews")` | 获取热门讨论 |

**推荐策略**：
```
# GitHub热榜
mcp__mcp-router__trending(search_service="github", max_results=20)

# HackerNews热榜
mcp__mcp-router__trending(search_service="hackernews", max_results=20)
```

---

## 三、国内信息源访问方法

### 无法直接访问的平台

以下平台需要通过**搜索引擎间接获取**：

| 平台 | 原因 | 替代方案 |
|------|------|----------|
| 微信公众号 | 封闭生态，无API | 搜索引擎 + 新榜榜单 |
| 小红书 | 反爬严格 | 搜索引擎 + 新榜榜单 |
| B站 | API需登录 | 搜索引擎 + 新榜榜单 |
| 即刻 | APP为主 | 搜索引擎 |
| 知乎 | 反爬严格 | 搜索引擎 |
| 微博 | API需授权 | 搜索引擎 |

### 通用搜索策略

```
# 公众号文章搜索
mcp__mcp-router__search(
    query="AI 公众号 OR 卡兹克 OR 机器之心",
    search_service="google",
    time_range="day"
)

# 小红书热门
mcp__mcp-router__search(
    query="AI教程 site:xiaohongshu.com",
    search_service="google"
)

# B站热门
mcp__mcp-router__search(
    query="AI教程 site:bilibili.com",
    search_service="google"
)

# 即刻热门
mcp__mcp-router__search(
    query="AIGC site:okjike.com",
    search_service="google"
)

# 知乎热门
mcp__mcp-router__search(
    query="AI大模型 site:zhihu.com",
    search_service="google"
)
```

### 新闻聚合策略

```
# 科技新闻
mcp__mcp-router__news(
    query="AI 大模型 发布 OR 更新",
    search_service="google",
    max_results=15,
    time_range="day"
)

# 36氪/虎嗅等
mcp__mcp-router__search(
    query="AI site:36kr.com OR site:huxiu.com",
    search_service="google",
    time_range="day"
)
```

---

## 四、/hotspot命令执行流程（推荐）

### 第一轮：即时热点（5个工具调用，并行执行）

```python
# 1. GitHub热榜
mcp__mcp-router__trending(search_service="github", max_results=15)

# 2. HackerNews热榜
mcp__mcp-router__trending(search_service="hackernews", max_results=15)

# 3. X/Twitter AI话题
mcp__mcp-router__search(
    query="AI release OR AI update OR GPT OR Claude OR Gemini",
    search_service="x",
    max_results=15,
    time_range="day"
)

# 4. Reddit AI社区
mcp__mcp-router__search(
    query="AI LocalLLaMA MachineLearning",
    search_service="reddit",
    max_results=15
)

# 5. 中文AI新闻
mcp__mcp-router__news(
    query="AI 大模型 Claude GPT Gemini 发布 更新",
    search_service="google",
    max_results=15,
    time_range="day"
)
```

### 第二轮：补充深度（可选，根据第一轮结果）

```python
# 6. 大厂官博（如果第一轮发现相关热点）
mcp__mcp-router__crawl(url="https://openai.com/blog")
mcp__mcp-router__crawl(url="https://www.anthropic.com/news")

# 7. 特定话题深挖
mcp__mcp-router__search(
    query="[具体热点关键词]",
    search_service="google",
    crawl_results=3  # 抓取前3个结果的全文
)
```

---

## 五、热点去重与质量筛选

### 筛选标准

| 维度 | 保留标准 | 过滤标准 |
|------|----------|----------|
| 时效性 | 24小时内 | 超过48小时 |
| 来源可信度 | 官方/KOL/一手平台 | 营销号/转载 |
| AI相关度 | 直接相关 | 间接提及 |
| 重复度 | 首次出现 | 多平台重复 |

### 去重逻辑

```
1. 标题相似度 > 80% -> 合并
2. 同一事件不同平台 -> 保留最权威来源
3. 时间相近的同主题 -> 保留最早发布
```

---

## 六、访问频率建议

| 信息源类型 | 建议频率 | 原因 |
|------------|----------|------|
| GitHub/HN热榜 | 每次扫描 | 更新快，数据新 |
| X/Twitter | 每次扫描 | 即时性强 |
| Reddit | 每次扫描 | 讨论活跃 |
| 大厂官博 | 发现线索后 | 避免空请求 |
| 中文新闻 | 每次扫描 | 综合覆盖 |

---

## 七、错误处理

### 常见错误及处理

| 错误 | 原因 | 处理方式 |
|------|------|----------|
| 搜索无结果 | 关键词太窄 | 扩大关键词范围 |
| 爬取失败 | 反爬/超时 | 换用搜索引擎 |
| 结果太旧 | time_range设置 | 强制24小时限制 |
| 重复内容多 | 热点覆盖广 | 启用去重逻辑 |

