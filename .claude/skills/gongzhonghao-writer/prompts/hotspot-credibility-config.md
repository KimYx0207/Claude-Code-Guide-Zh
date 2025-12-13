# 热点来源可信度配置

> 用于/hotspot命令评估热点可信度和权重

---

## 可信度等级定义

| 等级 | 名称 | 基础分 | 说明 |
|------|------|--------|------|
| S | 官方源 | 5分 | 大厂官方博客、官方公告 |
| A | 顶流KOL | 4分 | 行业顶级意见领袖 |
| B | 一手平台 | 3分 | HackerNews/GitHub/Reddit热榜 |
| C | 知名媒体 | 2分 | 机器之心/36氪等专业媒体 |
| D | 普通来源 | 1分 | 其他来源 |

---

## S级：大厂官方（5分）

### 国际大厂

| 来源 | 识别特征 | URL模式 |
|------|----------|---------|
| OpenAI | 域名openai.com | `openai.com/blog`, `openai.com/news` |
| Anthropic | 域名anthropic.com | `anthropic.com/news`, `anthropic.com/research` |
| Google AI | 域名blog.google | `blog.google/technology/ai/` |
| DeepMind | 域名deepmind.google | `deepmind.google/discover/blog/` |
| Meta AI | 域名ai.meta.com | `ai.meta.com/blog/` |
| Microsoft AI | 域名blogs.microsoft.com | `blogs.microsoft.com/ai/` |
| NVIDIA | 域名blogs.nvidia.com | `blogs.nvidia.com/blog/` |

### 国内大厂

| 来源 | 识别特征 | URL模式 |
|------|----------|---------|
| 百度AI | 域名ai.baidu.com | `ai.baidu.com/` |
| 阿里达摩院 | 域名damo.alibaba.com | `damo.alibaba.com/` |
| 腾讯AI Lab | 域名ai.tencent.com | `ai.tencent.com/` |
| 字节跳动AI | 域名ailab.bytedance.com | `ailab.bytedance.com/` |

---

## A级：顶流KOL（4分）

### X/Twitter 国际顶流

| 账号 | 真实身份 | 识别方式 |
|------|----------|----------|
| @sama | Sam Altman, OpenAI CEO | 内容来源含`twitter.com/sama`或`x.com/sama` |
| @karpathy | Andrej Karpathy, 前特斯拉AI总监 | 内容来源含`twitter.com/karpathy` |
| @ylecun | Yann LeCun, Meta首席AI科学家 | 内容来源含`twitter.com/ylecun` |
| @DarioAmodei | Dario Amodei, Anthropic CEO | 内容来源含`twitter.com/DarioAmodei` |
| @JeffDean | Jeff Dean, Google高级研究员 | 内容来源含`twitter.com/JeffDean` |
| @AndrewYNg | Andrew Ng, AI教育家 | 内容来源含`twitter.com/AndrewYNg` |
| @alexalbert__ | Alex Albert, Anthropic提示词专家 | 内容来源含`twitter.com/alexalbert__` |
| @_akhaliq | AK, 论文速递 | 内容来源含`twitter.com/_akhaliq` |

### X/Twitter 中文顶流

| 账号 | 真实身份 | 识别方式 |
|------|----------|----------|
| @dotey | 宝玉, 独立开发者 | 内容来源含`twitter.com/dotey`或`x.com/dotey` |
| @op7418 | 歸藏, AI工具评测 | 内容来源含`twitter.com/op7418` |
| @oran_ge | 产品经理 | 内容来源含`twitter.com/oran_ge` |
| @vista8 | 独立开发者 | 内容来源含`twitter.com/vista8` |

### 公众号顶流

| 账号 | 特征 | 识别方式 |
|------|------|----------|
| 数字生命卡兹克 | 新榜AI榜TOP1 | 文章来源含`数字生命卡兹克`或`Rockhazix` |
| 歸藏的AI工具箱 | 新榜AI榜TOP2 | 文章来源含`歸藏`或`op7418` |

---

## B级：一手平台（3分）

### 技术社区热榜

| 平台 | 识别特征 | 权重条件 |
|------|----------|----------|
| HackerNews | 域名news.ycombinator.com | 评论>50 或 点数>100 |
| GitHub Trending | 域名github.com/trending | Stars>500 或 今日新增>100 |
| Reddit热帖 | 域名reddit.com | 来自r/LocalLLaMA等AI社区 且 评论>30 |
| ProductHunt | 域名producthunt.com | AI产品首发 |

### 学术平台

| 平台 | 识别特征 | 权重条件 |
|------|----------|----------|
| arXiv | 域名arxiv.org | cs.AI/cs.LG/cs.CL分类 |
| HuggingFace Papers | 域名huggingface.co/papers | 有代码实现 |
| Papers With Code | 域名paperswithcode.com | SOTA结果 |

---

## C级：知名媒体（2分）

### 国际科技媒体

| 媒体 | 识别特征 |
|------|----------|
| TechCrunch | 域名techcrunch.com |
| The Verge | 域名theverge.com |
| Wired | 域名wired.com |
| Ars Technica | 域名arstechnica.com |
| VentureBeat | 域名venturebeat.com |

### 国内科技媒体

| 媒体 | 识别特征 |
|------|----------|
| 机器之心 | 域名jiqizhixin.com 或 文章来源含"机器之心" |
| 量子位 | 域名qbitai.com 或 文章来源含"量子位" |
| 36氪 | 域名36kr.com |
| 虎嗅 | 域名huxiu.com |
| 极客公园 | 域名geekpark.net |
| 新智元 | 文章来源含"新智元" |
| 甲子光年 | 域名jazzyear.com |
| 晚点LatePost | 域名latepost.com |

---

## D级：普通来源（1分）

所有不在以上列表中的来源，默认为D级。

---

## 可信度判断规则

### 优先级规则

```
1. 先检查URL是否匹配S级大厂官方
2. 再检查是否来自A级KOL账号
3. 然后检查是否来自B级一手平台热榜
4. 最后检查是否来自C级知名媒体
5. 以上都不匹配则为D级
```

### 特殊加分规则

| 条件 | 额外加分 |
|------|----------|
| 官方博客首发 | +1 |
| KOL转发官方消息 | +1 |
| HackerNews头条 | +1 |
| GitHub今日增星>500 | +1 |
| 多平台同时讨论 | +1 |

### 特殊减分规则

| 条件 | 减分 |
|------|------|
| 转载/二手消息 | -1 |
| 营销号风格 | -2 |
| 无法验证来源 | -1 |
| 超过48小时 | -1 |

---

## 使用示例

### Python判断逻辑

```python
def get_credibility_score(source_url: str, source_name: str) -> tuple[str, int]:
    """
    获取来源可信度等级和分数

    Returns:
        (等级, 分数)
    """
    # S级：大厂官方
    s_tier_domains = [
        'openai.com', 'anthropic.com', 'blog.google',
        'deepmind.google', 'ai.meta.com', 'blogs.microsoft.com'
    ]
    for domain in s_tier_domains:
        if domain in source_url:
            return ('S', 5)

    # A级：顶流KOL
    a_tier_accounts = [
        '@sama', '@karpathy', '@ylecun', '@DarioAmodei',
        '@dotey', '@op7418', '宝玉', '歸藏', '卡兹克'
    ]
    for account in a_tier_accounts:
        if account.lower() in source_name.lower():
            return ('A', 4)

    # B级：一手平台
    b_tier_domains = [
        'news.ycombinator.com', 'github.com/trending',
        'reddit.com/r/LocalLLaMA', 'reddit.com/r/MachineLearning'
    ]
    for domain in b_tier_domains:
        if domain in source_url:
            return ('B', 3)

    # C级：知名媒体
    c_tier_keywords = [
        '机器之心', '量子位', '36kr', 'huxiu', 'techcrunch',
        'theverge', '极客公园', '新智元'
    ]
    for keyword in c_tier_keywords:
        if keyword.lower() in source_url.lower() or keyword in source_name:
            return ('C', 2)

    # D级：普通来源
    return ('D', 1)
```

---

## 可信度标签显示格式

在热点报告中使用以下格式显示可信度：

```
【热点】Claude 3.5 Opus发布
├─ 来源：Anthropic官方博客 | 可信度：S级（官方）⭐⭐⭐⭐⭐
├─ 时效性：2小时前
└─ 评分：24/25分 🔥🔥🔥

【热点】宝玉解读：GPT-5即将发布
├─ 来源：@dotey (X/Twitter) | 可信度：A级（KOL）⭐⭐⭐⭐
├─ 时效性：4小时前
└─ 评分：20/25分 🔥🔥

【热点】新的AI编码工具爆火
├─ 来源：HackerNews热榜 | 可信度：B级（一手平台）⭐⭐⭐
├─ 时效性：6小时前
└─ 评分：17/25分 🔥
```

