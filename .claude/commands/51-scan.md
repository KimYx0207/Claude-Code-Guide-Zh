---
name: hotspot
description: 🔥 AI热点自动扫描 V9.0 - 三层架构精准发现爆款选题
version: 9.0.0
---

# 🔥 热点扫描系统 V9.0（三层架构版）

**核心升级**：从"广撒网发现热点"升级为"精准监控核心工具生态"

## V9.0 核心变化

| 旧版问题 | V9.0解决方案 |
|---------|-------------|
| GitHub全量扫描 → 大量无效推荐 | 只扫描核心工具生态项目 |
| 单一分类（核心/泛AI） | 三层分类 + 多类型标签 |
| 输出顺序混乱 | 按优先级公式排序 |

---

## 🕐 第零步：确认当前日期（必须执行）

```javascript
// 获取当前日期
Task(subagent_type="get-current-datetime", prompt="获取当前日期时间")

// 存储日期变量
TODAY = "YYYY-MM-DD"      // 从上述命令获取
YESTERDAY = "YYYY-MM-DD"
```

---

## ⚡ 第一轮：三层并行扫描

### Layer1：核心工具官方源（71%爆款来源）

```javascript
// 1.1 Claude官方动态
WebSearch(query="Anthropic Claude Code release changelog {TODAY} site:anthropic.com OR site:github.com/anthropics")

// 1.2 Cursor官方动态
WebSearch(query="Cursor AI editor release changelog {TODAY} site:cursor.com OR site:forum.cursor.com")

// 1.3 Gemini官方动态
WebSearch(query="Google Gemini AI release {TODAY} site:blog.google OR site:ai.google.dev")

// 1.4 Kimi/即梦等国内工具
WebSearch(query="Kimi 月之暗面 即梦 更新 发布 {TODAY}")

// 1.5 OpenAI动态
WebSearch(query="OpenAI GPT Codex release {TODAY} site:openai.com")
```

### Layer2：核心工具生态项目（24%爆款来源）

```javascript
// 2.1 GitHub - 仅扫描核心工具生态（关键词过滤！）
mcp__mcp-router__fetch(url="https://github.com/trending?since=daily", max_length=15000)

// ⚠️ 过滤规则：只保留包含以下关键词的项目
ECOSYSTEM_KEYWORDS = [
  "claude", "cursor", "gemini", "gpt", "openai", "anthropic",
  "mcp", "mcp-server", "copilot", "ai-coding", "llm-tool"
]

// 2.2 MCP服务器生态
WebSearch(query="MCP server Claude {TODAY} site:github.com")

// 2.3 Cursor/VSCode插件
WebSearch(query="Cursor extension plugin AI coding {TODAY} site:github.com")
```

### Layer3：泛AI话题（仅监控，不主推）

```javascript
// 3.1 HackerNews AI话题
mcp__mcp-router__fetch(url="https://news.ycombinator.com/", max_length=10000)

// 3.2 机器之心
mcp__mcp-router__fetch(url="https://www.jiqizhixin.com/", max_length=10000)

// 3.3 AI行业动态
WebSearch(query="AI 大模型 融资 发布 {TODAY}")
```

---

## 📊 第二轮：多维度分类评估

### 分类1：Layer层级（决定基础分）

| Layer | 名称 | 基础分 | 特征 |
|-------|------|--------|------|
| Layer1 | 核心工具官方 | 100分 | Claude/Cursor/Gemini等官方更新 |
| Layer2 | 核心工具生态 | 75分 | GitHub上围绕核心工具的MCP/插件/CLI |
| Layer3 | 泛AI话题 | 40分 | AI行业新闻、趋势讨论 |

### 分类2：选题类型（可多选，影响权重）

| 类型 | 关键词识别 | 权重 | 说明 |
|------|-----------|------|------|
| 🔥 热点型 | 发布/更新/官宣/首发 | 1.6x | 时效性强，需快速产出 |
| 🛠️ 工具型 | 神器/工具/插件/扩展 | 1.5x | 推荐具体工具 |
| 📚 教程型 | 手把手/教你/教程/入门 | 1.4x | 实操性内容 |
| 💸 羊毛型 | 免费/白嫖/薅羊毛 | 1.3x | 省钱攻略 |
| 🔧 痛点型 | 解决/报错/问题/修复 | 1.4x | 解决用户痛点 |
| 📊 测评型 | 测评/对比/实测/体验 | 1.2x | 产品评测 |

### 分类3：时效性（影响优先级）

| 时效性 | 识别信号 | 优先级加成 | 建议 |
|--------|---------|-----------|------|
| 🔴 紧急热点 | 刚刚/今天/breaking | 2.0x | 24小时内产出 |
| 🟡 近期更新 | 最新/更新/v版本号 | 1.5x | 72小时内产出 |
| 🟢 常青内容 | 教程/入门/详解 | 1.0x | 可深度打磨 |

---

## 🎯 第三轮：优先级计算公式

```
优先级分 = Layer基础分 × 时效性加成 × 类型权重 × 品牌加成 ÷ 风险系数

示例：
"Claude Code 2.1发布，手把手教你用新功能"
= 100(Layer1) × 2.0(紧急热点) × 1.4(教程型) × 1.5(S级品牌) ÷ 1.0(低风险)
= 420分 → 强烈推荐

"GitHub某AI项目获1000星"（与核心工具无关）
= 40(Layer3) × 1.0(常青) × 1.0(无类型) × 0.7(无品牌) ÷ 1.8(高风险)
= 15.6分 → 不推荐
```

### 品牌加成

| 品牌级别 | 加成 | 品牌列表 |
|---------|------|---------|
| S级 | 1.5x | Claude, Cursor, Gemini, Kimi, GPT |
| A级 | 1.2x | Copilot, 即梦, Codex, DeepSeek |
| B级 | 1.0x | Ollama, Mistral |
| 无品牌 | 0.7x | 泛AI话题 |

### 风险系数

| 风险等级 | 系数 | 场景 |
|---------|------|------|
| 低风险 | 1.0 | 核心工具教程、官方更新 |
| 中风险 | 1.3 | 生态项目、新工具推荐 |
| 高风险 | 1.8 | 泛AI话题、与核心工具无关 |

---

## 📋 第四轮：GitHub生态项目过滤

**⚠️ 关键规则**：不是所有GitHub项目都值得写！

### 通过条件（必须全部满足）

```python
def is_ecosystem_project(project):
    # 条件1：名称或描述包含核心工具关键词
    ecosystem_keywords = ["claude", "cursor", "gemini", "gpt", "mcp", "copilot"]
    has_keyword = any(kw in project.lower() for kw in ecosystem_keywords)

    # 条件2：解决核心工具的痛点
    pain_keywords = ["extension", "plugin", "cli", "server", "tool", "helper"]
    solves_pain = any(kw in project.lower() for kw in pain_keywords)

    # 条件3：有一定热度
    has_traction = project.stars >= 50

    return has_keyword and solves_pain and has_traction
```

### 历史爆款案例

| 项目 | 关联工具 | 阅读量 | 为什么能火 |
|------|---------|--------|-----------|
| BrowserTools MCP | Claude | 1580 | 解决Claude操作浏览器的痛点 |
| Cursor-Pro | Cursor | 1450 | 突破Claude限制的工具 |
| Gemini CLI | Gemini | 1400 | 命令行使用Gemini |

---

## 📝 第五轮：已写检测

```bash
# 检查已发布文章
ls -lt "articles/published/" | head -20

# 搜索关键词
Grep(pattern="热点关键词", path="articles/published/")
```

---

## 📋 第六轮：输出报告（按优先级排序）

```
╔══════════════════════════════════════════════════════════════════════════╗
║                   🔥 AI热点扫描报告 V9.0（三层架构版）                     ║
║                   扫描时间：{当前时间}                                    ║
║                   评估方法：三层架构 + 多类型标签 + 优先级公式              ║
╚══════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥🔥🔥 强烈推荐（优先级 > 200分）
────────────────────────────────────────

【热点1】{热点标题}
├─ 📊 优先级：{XXX分}
├─ 🏷️ 分类：
│   ├─ Layer: {Layer1 核心工具官方}
│   ├─ 类型: {🔥热点型 + 📚教程型}（可多选）
│   └─ 时效: {🔴紧急热点 - 24h内产出}
├─ 🔧 关联工具：{Claude}（S级，1.5x加成）
├─ 📈 预估阅读：{2000+}（基于历史数据）
├─ ✅ 推荐理由：
│   ├─ Layer1核心工具官方更新（基础分100）
│   ├─ 紧急热点（2.0x加成）
│   ├─ 可教程化（教程型1.4x）
│   └─ S级品牌（1.5x加成）
└─ 💡 建议标题：{基于公式生成}

────────────────────────────────────────

【热点2】{GitHub生态项目}
├─ 📊 优先级：{XXX分}
├─ 🏷️ 分类：
│   ├─ Layer: {Layer2 核心工具生态}
│   ├─ 类型: {🛠️工具型 + 🔧痛点型}
│   └─ 时效: {🟡近期更新 - 72h内产出}
├─ 🔧 关联工具：{Cursor}（解决XX痛点）
├─ 📈 预估阅读：{1500}
└─ ✅ 通过生态过滤：项目名含"cursor"，解决插件痛点

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ 观望（优先级 40-200分）
────────────────────────────────────────
{Layer3泛AI话题，需要独特角度}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ 不推荐（优先级 < 40分）
────────────────────────────────────────
{与核心工具无关的GitHub项目，风险过高}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 老金建议：

今天最应该写的是【{热点名称}】

优先级分析：
├─ Layer1核心工具官方：基础分100
├─ 紧急热点：×2.0
├─ 教程型+工具型：×1.4×1.5 = ×2.1
├─ S级品牌Claude：×1.5
└─ 总分：{XXX}分

💡 快速开始：
/write {热点关键词}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📝 V9.0 执行Checklist

- [ ] **第零步**：确认当前日期
- [ ] **第一轮**：
  - [ ] Layer1：扫描5个核心工具官方源
  - [ ] Layer2：扫描GitHub（使用生态过滤！）
  - [ ] Layer3：扫描泛AI话题（仅监控）
- [ ] **第二轮**：为每个热点标记
  - [ ] Layer层级（1/2/3）
  - [ ] 选题类型（可多选）
  - [ ] 时效性（紧急/近期/常青）
- [ ] **第三轮**：计算优先级分数
- [ ] **第四轮**：GitHub项目生态过滤
- [ ] **第五轮**：已写检测
- [ ] **第六轮**：按优先级输出报告

---

**数据来源**：82篇文章分析，21篇爆款验证 | 爆款阈值：阅读量>1375 | V9.0更新：2025-12-20
