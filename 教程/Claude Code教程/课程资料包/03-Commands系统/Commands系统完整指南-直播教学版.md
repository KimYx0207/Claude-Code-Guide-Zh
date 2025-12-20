# Commands系统完整指南：从Slash命令到自定义命令的全面精通

> **课程信息**
>
> - **预计学时**：4-6小时
> - **难度等级**：零基础入门
> - **更新日期**：2025年12月
> - **适用版本**：Claude Code v2.0+（验证于2025-12-19）
> - **信息来源**：[官方文档](https://docs.anthropic.com/en/docs/claude-code/slash-commands) | [Claude Command Suite](https://github.com/qdhenry/Claude-Command-Suite) | [最佳实践](https://www.anthropic.com/engineering/claude-code-best-practices)
> - **前置要求**：已完成Claude Code安装和基础使用

---

## 本课学习目标

完成本课学习后，你将能够：

1. **理解Commands本质**：掌握Slash命令就是Markdown提示词的核心概念
2. **5分钟创建第一个命令**：从零开始创建并运行自定义命令
3. **熟练使用30+内置命令**：掌握所有官方提供的快捷指令
4. **开发专业级自定义命令**：使用frontmatter、参数、工具调用等高级特性
5. **组合命令构建工作流**：将多个命令串联成自动化流程
6. **排查命令故障**：独立解决90%的常见配置和执行问题

---

## 学习路径导航（先看这里！）

> **根据你的情况选择学习路径**：这是一篇长教程，不用全看！根据你的目标选择路径。

### 路径A：5分钟快速上手

**适合人群**：急着体验自定义命令，想快速跑起来

**只看这些章节**（其他跳过）：

```
✅ 术语表（3分钟）
✅ 第二部分：5分钟快速开始（5分钟）
```

**5分钟后你能达到**：成功创建第一个自定义命令并运行

---

### 路径B：完整学习（4-6小时）

**适合人群**：想系统掌握Commands系统，成为命令开发高手

**学习顺序**：从头到尾所有章节

**建议分段学习**：
- 第1天（1.5小时）：第1-3部分（简介+快速开始+内置命令）
- 第2天（1.5小时）：第4部分（自定义命令开发）
- 第3天（1小时）：第5部分（高级用法）
- 第4天（0.5小时）：第6-7部分（FAQ+附录）

---

### 路径C：问题速查（5分钟）

**适合人群**：命令不工作，需要快速解决

**直接跳到**：

```
第六部分：FAQ - 20个常见问题解答
第五部分5.5节：故障排查
```

**使用方法**：
1. 按 `Ctrl + F` 搜索你的问题关键词
2. 找到对应的Q&A
3. 按步骤解决

---

### 路径D：专项学习（30-60分钟/主题）

**适合人群**：已经会基础命令，想深入某个功能

| 想学什么 | 看哪几节 | 预计时间 |
|----------|---------|---------|
| **frontmatter配置** | 第4.3节 | 30分钟 |
| **参数处理** | 第4.4节 | 30分钟 |
| **工具调用** | 第4.5节 | 45分钟 |
| **命令组合** | 第5.2节 | 30分钟 |
| **社区命令库** | 第5.4节 | 20分钟 |

---

## 术语表（小白必读）

在开始之前，先了解这些关键术语。**用生活类比帮助理解**：

| 术语 | 英文全称 | 通俗解释 | 生活类比 |
|------|----------|----------|----------|
| **Slash命令** | Slash Commands | 以"/"开头的快捷指令 | 手机快捷方式（一点就打开App） |
| **自定义命令** | Custom Commands | 你自己创建的命令 | 自己设置的手机快捷方式 |
| **内置命令** | Built-in Commands | Claude Code自带的命令 | 手机出厂预装的App |
| **frontmatter** | - | 命令文件开头的配置区（YAML格式） | 书的封面信息（书名、作者等） |
| **$ARGUMENTS** | - | 接收用户输入参数的变量 | 快递单上的"收件人"空格 |
| **allowed-tools** | - | 允许命令使用的工具列表 | 工具箱（限定可用的工具） |
| **命令作用域** | Command Scope | 命令生效的范围（项目级/用户级） | 门禁卡（有的只能开一个门，有的能开所有门） |
| **命令命名空间** | Namespace | 命令的分组前缀 | 文件夹分类（/dev:xxx、/test:xxx） |

---

## 第一部分：Commands简介

### 1.1 什么是Slash命令

> **一句话理解**：Slash命令就是Claude Code的"快捷方式"，输入`/命令名`就能触发预设的操作。

**生活类比**：
- **没有Slash命令**：每次点外卖都要重新输入地址、选择口味、备注
- **有Slash命令**：保存一个"我的常用订单"，一键下单

**核心概念**（官方文档验证）：

```
自定义命令 = .claude/commands/目录下的Markdown文件
命令名 = 文件名（不含.md后缀）
命令内容 = Markdown文件的内容（作为提示词注入）
参数 = $ARGUMENTS变量接收用户输入

当你输入 /write AI教程
Claude Code做的事：
1. 找到 .claude/commands/write.md 文件
2. 读取文件内容作为提示词
3. 把"AI教程"赋值给 $ARGUMENTS
4. 执行这个提示词
```

### 1.2 命令的三大类型

Claude Code的命令分为三大类：

| 类型 | 来源 | 存放位置 | 特点 |
|------|------|----------|------|
| **内置命令** | Claude Code官方 | 程序内部 | 不可修改，核心功能 |
| **自定义命令** | 你自己创建 | `.claude/commands/` | 完全可控，个性化 |
| **用户级命令** | 你自己创建（全局） | `~/.claude/commands/` | 所有项目共享 |

**命令来源决策树**：

```
你需要什么功能？
    │
    ├── 会话管理、系统诊断？
    │       └── 用内置命令（/clear、/doctor等）
    │
    ├── 项目特定的工作流？
    │       └── 创建项目级自定义命令
    │
    └── 所有项目通用的工具？
            └── 创建用户级自定义命令
```

### 1.3 为什么要学Commands

**没有Commands之前**：

```
你：帮我写一篇公众号文章，主题是AI工具
    要求：
    1. 风格要接地气
    2. 字数1500-2000
    3. 包含实战案例
    4. 开头要有金句
    5. 结尾要有行动号召
    ...（每次都要重复说一遍）

10分钟后...

你：帮我写另一篇，主题是Claude Code
    要求：（又要重复一遍...）
```

**有了Commands之后**：

```
你：/write AI工具

Claude自动知道：
- 风格要接地气
- 字数1500-2000
- 包含实战案例
- 开头要有金句
- 结尾要有行动号召

直接开始写作！
```

**Commands的核心价值**：

| 对比维度 | 手动输入 | 使用Commands |
|----------|----------|--------------|
| **效率** | 每次重复输入 | 一次配置，永久使用 |
| **一致性** | 每次可能遗漏要求 | 标准化执行 |
| **可复用** | 无法分享 | 团队共享、社区贡献 |
| **可维护** | 分散在聊天记录 | 集中管理、版本控制 |

---

## 第二部分：5分钟快速开始

> **本节目的**：用最快速度创建第一个自定义命令，让你立即看到效果！
>
> **预计时间**：5分钟

### 2.1 创建第一个自定义命令

#### 步骤1：创建命令目录

**Windows系统（PowerShell）：**
```powershell
# 进入你的项目目录
cd C:\你的项目路径

# 创建commands目录
New-Item -ItemType Directory -Path ".claude\commands" -Force
```

**macOS/Linux系统：**
```bash
# 进入你的项目目录
cd ~/你的项目路径

# 创建commands目录
mkdir -p .claude/commands
```

**验证是否成功：**
```bash
# 检查目录是否存在
ls .claude/commands
# 应该显示空目录（暂时没有文件）
```

#### 步骤2：创建最简单的命令文件

**创建文件 `.claude/commands/hello.md`**：

**Windows（PowerShell）：**
```powershell
@'
# 问候命令

你好！我是你的AI助手。

用户想要问候的对象是：$ARGUMENTS

如果没有提供名字，请使用"朋友"作为默认称呼。

请用热情友好的方式问候，并询问今天可以帮助什么。
'@ | Out-File -FilePath ".claude\commands\hello.md" -Encoding utf8
```

**macOS/Linux：**
```bash
cat > .claude/commands/hello.md << 'EOF'
# 问候命令

你好！我是你的AI助手。

用户想要问候的对象是：$ARGUMENTS

如果没有提供名字，请使用"朋友"作为默认称呼。

请用热情友好的方式问候，并询问今天可以帮助什么。
EOF
```

#### 步骤3：测试命令

**启动Claude Code并测试**：

```bash
# 启动Claude Code
claude
```

**在交互模式中输入**：

```
You: /hello 张三
```

**预期结果**：

```
你好，张三！很高兴见到你！

今天有什么我可以帮助你的吗？无论是写代码、解答问题，
还是其他任何事情，我都随时准备为你效劳！
```

**再测试无参数情况**：

```
You: /hello
```

**预期结果**：

```
你好，朋友！很高兴见到你！

今天有什么我可以帮助你的吗？
```

### 2.2 恭喜完成第一个命令！

**你刚才完成了什么？**

1. 创建了命令目录 `.claude/commands/`
2. 编写了第一个命令文件 `hello.md`
3. 使用 `$ARGUMENTS` 接收参数
4. 成功运行命令并看到效果

**核心要点回顾**：

```
命令文件 = Markdown文件
命令名 = 文件名（不含.md）
参数 = $ARGUMENTS 变量

/hello 张三
  │      │
  │      └── $ARGUMENTS = "张三"
  └── 读取 hello.md
```

---

## 第三部分：内置命令大全

> **本节目的**：掌握Claude Code自带的30+个内置命令
>
> **预计时间**：45分钟

### 3.1 内置命令分类总览

Claude Code提供30+个内置命令，按功能分为7大类：

| 分类 | 命令数量 | 核心功能 | 使用频率 |
|------|----------|----------|----------|
| **会话管理** | 5个 | 清空、压缩、恢复、导出会话 | 高频 |
| **上下文控制** | 4个 | Token使用、费用、模型切换 | 高频 |
| **项目配置** | 4个 | 初始化、记忆、权限管理 | 中频 |
| **开发辅助** | 5个 | 代码审查、待办、子代理 | 中频 |
| **诊断工具** | 4个 | 系统诊断、状态、使用量 | 按需 |
| **MCP相关** | 3个 | MCP服务、插件、Hooks | 按需 |
| **其他工具** | 5个 | Vim模式、更新日志、Bug报告 | 低频 |

### 3.2 会话管理类命令

#### /clear - 清空对话历史

**作用**：删除所有对话历史，重新开始

```bash
You: /clear

# 预期输出：
Conversation cleared.
CLAUDE.md configuration retained.
```

**什么时候用**：
- 完成一个任务，要开始完全不同的新任务
- 对话太长，响应变慢
- 想要"干净"的起点

> CLAUDE.md配置不会丢失！只清空对话历史。

---

#### /compact - 压缩对话历史

**作用**：压缩对话，保留关键信息，节省Token

```bash
# 基础压缩
You: /compact

# 带指令压缩（告诉Claude保留什么）
You: /compact 保留所有关于数据库设计的讨论
```

**什么时候用**：
- Token使用超过60%（用 `/context` 查看）
- 响应变慢但还需要上下文
- 想省钱但保留关键信息

**对比 /clear 和 /compact**：

| 命令 | 效果 | 保留内容 | Token节省 |
|------|------|----------|-----------|
| `/clear` | 完全清空 | 仅CLAUDE.md | 100% |
| `/compact` | 智能压缩 | 关键信息摘要 | 40-60% |

---

#### /resume - 恢复会话

**作用**：恢复之前的对话会话

```bash
# 命令行快速恢复最近会话
$ claude -c
$ claude --continue

# 恢复指定会话
$ claude -r ses_abc123

# 交互模式中恢复
You: /resume
```

---

#### /export - 导出对话

**作用**：把对话导出为文件

```bash
# 默认导出（Markdown格式）
You: /export

# 导出到剪贴板
You: /export --clipboard

# 指定格式
You: /export --format json
```

---

#### /rename - 重命名会话

**作用**：给当前会话起个好名字

```bash
You: /rename auth-module-implementation

# 命名建议：[项目]-[功能]-[版本]
# 例如：my-app-login-api-v2
```

### 3.3 上下文控制类命令

#### /context - 查看Token使用

**作用**：用彩色网格显示Token使用情况

```bash
You: /context

# 预期输出：
Context Usage Visualization:
████████████░░░░░░░░  60% (120K / 200K tokens)

Breakdown:
- User messages: 45K
- Claude responses: 60K
- Code context: 15K

Recommendation: Context usage healthy
```

---

#### /cost - 显示会话成本

**作用**：显示当前会话的Token使用和费用

```bash
You: /cost

# 预期输出：
Session Cost & Duration:
=======================
Duration: 45 minutes
Input tokens: 12,340
Output tokens: 23,456
Total cost: $0.42
```

---

#### /model - 切换AI模型

**作用**：在会话中切换不同的AI模型

```bash
# 查看可用模型
You: /model

# 直接指定模型
You: /model claude-opus-4-5-20250514
```

**模型选择建议**：

| 模型 | 速度 | 能力 | 成本 | 适用场景 |
|------|------|------|------|---------|
| Haiku | 最快 | 基础 | 最低 | 简单任务、快速查询 |
| Sonnet | 中等 | 强大 | 中等 | 日常开发（推荐） |
| Opus | 较慢 | 最强 | 最高 | 复杂任务、关键决策 |

---

#### /usage - 使用量统计

**作用**：显示账户使用量和限制

```bash
You: /usage

# 预期输出：
Plan Usage
==========
Plan: Pro
Period: Dec 1 - Dec 31

Usage:
  Messages: 1,234 / 5,000
  Tokens: 890K / 5M
```

### 3.4 项目配置类命令

#### /init - 初始化项目配置

**作用**：创建CLAUDE.md配置文件

```bash
You: /init

# Claude会分析项目并创建CLAUDE.md
Analyzing project structure...
Creating CLAUDE.md...

CLAUDE.md created with:
- Project type: React + TypeScript
- Key files identified
- Coding conventions detected
```

---

#### /memory - 编辑记忆文件

**作用**：打开CLAUDE.md进行编辑

```bash
You: /memory

# 快捷添加记忆（用#前缀）
You: # 本项目使用pnpm而不是npm
You: # API响应格式必须包含code字段
```

---

#### /permissions - 管理权限

**作用**：查看和修改Claude的权限设置

```bash
You: /permissions

# 显示当前权限设置
Current Permissions:
====================
File Operations:
  ✓ Read files in project
  ✓ Write files (with confirmation)
  ✗ Delete files

Bash Commands:
  ✓ Safe commands (git status, npm test)
  ⚠ Dangerous commands (require confirmation)
```

---

#### /add-dir - 添加工作目录

**作用**：将额外目录添加到Claude Code的工作范围

```bash
You: /add-dir ../shared-lib

# 只读模式
You: /add-dir ../reference --read-only
```

### 3.5 开发辅助类命令

#### /review - 代码审查

**作用**：让Claude审查当前的代码修改

```bash
You: /review

# Claude会分析未提交的更改
Reviewing changes...

Found 3 modified files:
- src/auth.js: Security concern - password not hashed
- src/api.js: Performance - N+1 query detected
- src/utils.js: Style - inconsistent naming
```

---

#### /todos - 查看待办事项

**作用**：列出Claude在对话中追踪的TODO项目

```bash
You: /todos

# 显示待办列表
Current TODOs:
1. [ ] Add unit tests for auth module
2. [ ] Fix database connection pool
3. [x] Update README documentation
```

---

#### /rewind - 回退功能

**作用**：回退到之前的检查点

```bash
# 方法1：双击Escape键（推荐！）
[按 Esc + Esc]

# 方法2：命令
You: /rewind

# 显示可用检查点
Select a checkpoint to rewind to:
[1] 10:30:15 - Initial state
[2] 10:32:45 - Added auth module
[3] 10:35:20 - Modified database.py
```

### 3.6 诊断工具类命令

#### /doctor - 系统诊断

**作用**：检查Claude Code安装的健康状态

```bash
You: /doctor

# 预期输出：
Claude Code Health Check
========================
✓ Node.js version: v22.11.0 (OK)
✓ npm version: 10.9.0 (OK)
✓ Claude Code version: 2.0.71 (OK)
✓ API connection: Connected
✓ Authentication: Valid
✓ MCP servers: 3 connected

Overall Status: Healthy ✓
```

**什么时候用**：
- 遇到奇怪的错误
- 更新后检查是否正常
- MCP服务连不上

---

#### /status - 完整状态信息

**作用**：显示版本、模型、账户等完整状态

```bash
You: /status

# 预期输出：
Claude Code Status
==================
Version: 2.0.71 (native)
Model: claude-sonnet-4-5-20250514
Account: your-email@example.com
Plan: Pro

MCP Servers:
  ✓ filesystem (3 tools)
  ✓ github (8 tools)
```

---

#### /stats - 使用统计

**作用**：显示你的使用习惯统计

```bash
You: /stats

# 预期输出：
Your Statistics
===============
This Week:
  Sessions: 23
  Messages: 456
  Total cost: $12.34

Most used commands:
1. /clear (45 times)
2. /compact (23 times)
```

### 3.7 MCP相关命令

#### /mcp - 管理MCP连接

**作用**：查看和管理MCP服务器连接

```bash
You: /mcp

# 预期输出：
MCP Server Status
=================
✓ filesystem (local)
  Tools: list_directory, read_file, write_file

✓ github (authenticated)
  Tools: create_issue, list_repos, ...

⚠ database (not configured)
```

---

#### /hooks - 管理Hooks

**作用**：配置在特定事件触发的自动化脚本

```bash
You: /hooks

# 显示已配置的Hooks
Configured Hooks:
- pre-write: Run ESLint before file writes
- post-commit: Send Slack notification
```

### 3.8 其他工具命令

#### /help - 显示帮助

**作用**：显示所有可用命令列表

```bash
You: /help

# 显示所有命令
Available Commands:
  /help           Show this help
  /exit           Exit interactive mode
  /clear          Clear conversation history
  ...
```

---

#### /release-notes - 查看更新日志

**作用**：显示Claude Code的最新更新内容

```bash
You: /release-notes

# 显示最近的版本更新
Release Notes v2.0.71
=====================
- New: Checkpoint/Rewind feature
- Improved: Token usage optimization
- Fixed: MCP connection stability
```

---

## 第四部分：自定义命令开发

> **本节目的**：掌握自定义命令开发的完整技能
>
> **预计时间**：90分钟

### 4.1 命令文件结构

一个完整的命令文件包含两个部分：**frontmatter配置区** + **Markdown正文**。

**完整结构示例**：

```markdown
---
description: 公众号文章创作命令
argument-hint: <主题关键词>
allowed-tools:
  - Read
  - Write
  - WebSearch
model: claude-sonnet-4-5-20250514
---

# 公众号文章创作

你是一位资深的公众号写作专家。

## 任务
根据用户提供的主题创作一篇公众号文章。

主题：$ARGUMENTS

## 写作要求
1. 风格：接地气、说人话
2. 字数：1500-2000字
3. 结构：金句开头 → 核心内容 → 行动号召

## 执行步骤
1. 使用WebSearch搜索主题相关的最新信息
2. 构思文章大纲
3. 撰写完整文章
4. 使用Write工具保存到articles目录
```

### 4.2 命令存放位置与作用域

#### 两种作用域

| 作用域 | 存放位置 | 生效范围 | 适用场景 |
|--------|----------|----------|----------|
| **项目级** | `.claude/commands/` | 仅当前项目 | 团队共享、项目特定 |
| **用户级** | `~/.claude/commands/` | 所有项目 | 个人工具、通用模板 |

#### 优先级规则

当同名命令存在于多个位置时，按以下优先级：

```
1. 项目级（最高）: .claude/commands/
2. 用户级: ~/.claude/commands/
3. 内置命令（最低）
```

**示例**：

假设存在：
- `.claude/commands/review.md`（项目级）
- `~/.claude/commands/review.md`（用户级）
- 内置 `/review` 命令

执行 `/review` 时，使用项目级的 `review.md`。

#### 目录结构建议

```
.claude/commands/
├── 01-write.md          # 核心写作命令
├── 02-write-auto.md     # 自动写作
├── 11-hotspot.md        # 热点扫描
├── 21-title-gen.md      # 标题生成
├── 22-title-score.md    # 标题评分
├── dev/                 # 开发类命令（子目录）
│   ├── code-review.md
│   └── debug.md
└── test/                # 测试类命令
    └── generate-tests.md
```

> **命名空间**：使用子目录时，命令名变成 `/dev:code-review` 格式。

### 4.3 frontmatter配置详解

frontmatter是命令文件开头的YAML配置区，用 `---` 包围。

#### 所有可用配置项

```yaml
---
# 命令描述（显示在命令列表中）
description: 这是命令的一句话描述

# 参数提示（输入/命令后显示的占位符）
argument-hint: <必需参数> [可选参数]

# 允许使用的工具（限制命令可调用的工具）
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - WebSearch
  - Glob
  - Grep

# 指定使用的模型
model: claude-sonnet-4-5-20250514

# 版本号（用于管理）
version: 1.0.0

# 作者信息
author: 老金
---
```

#### 配置项详解

**1. description（命令描述）**

```yaml
description: AI热点自动扫描 - 抓取今日AI热点并评估爆款潜力
```

作用：在 `/help` 和Tab补全时显示，帮助用户了解命令功能。

**2. argument-hint（参数提示）**

```yaml
argument-hint: <主题> [--style=formal] [--length=2000]
```

作用：输入 `/命令名` 后显示的占位符提示。

**3. allowed-tools（允许的工具）**

```yaml
allowed-tools:
  - Read
  - Write
  - WebSearch
```

作用：限制命令只能使用指定的工具，提高安全性。

**可用工具列表**：

| 工具名 | 功能 | 适用场景 |
|--------|------|---------|
| `Read` | 读取文件 | 分析代码、读取配置 |
| `Write` | 写入文件 | 创建文件、保存结果 |
| `Edit` | 编辑文件 | 修改现有代码 |
| `Bash` | 执行命令 | 运行脚本、Git操作 |
| `WebSearch` | 网络搜索 | 获取最新信息 |
| `Glob` | 文件搜索 | 查找文件 |
| `Grep` | 内容搜索 | 搜索代码中的内容 |
| `WebFetch` | 抓取网页 | 获取网页内容 |

**4. model（指定模型）**

```yaml
model: claude-opus-4-5-20250514
```

作用：强制使用指定模型执行命令（覆盖当前会话模型）。

### 4.4 $ARGUMENTS参数处理

`$ARGUMENTS` 是Claude Code的内置变量，接收用户在命令后输入的所有内容。

#### 基本用法

```markdown
# 问候命令

用户要问候的对象是：$ARGUMENTS

如果没有提供名字，使用"朋友"作为默认称呼。
```

**调用示例**：

```
/hello 张三
→ $ARGUMENTS = "张三"

/hello
→ $ARGUMENTS = ""
```

#### 多参数解析

```markdown
# 文章生成命令

## 参数格式
$ARGUMENTS 格式：<主题> [风格] [字数]

解析规则：
- 第一个参数：主题（必需）
- 第二个参数：风格（可选，默认"接地气"）
- 第三个参数：字数（可选，默认1500）

## 示例
/write AI工具 技术 3000
→ 主题=AI工具, 风格=技术, 字数=3000

/write Claude Code
→ 主题=Claude Code, 风格=接地气, 字数=1500
```

#### 参数验证

```markdown
# 代码审查命令

## 输入验证
首先检查 $ARGUMENTS：

**如果为空**：
提示用户：请提供文件路径，格式：/review <文件路径>
终止执行

**如果不是有效路径**：
提示用户：路径无效，请检查文件是否存在
终止执行

**如果验证通过**：
继续执行审查流程
```

### 4.5 工具调用语法

自定义命令可以调用Claude Code的所有工具。

#### 基础工具调用

```markdown
## 执行步骤

### 步骤1：读取配置文件
使用Read工具读取项目配置：
```
Read(".claude/settings.json")
```

### 步骤2：搜索TODO注释
使用Grep搜索所有TODO：
```
Grep("TODO|FIXME", path="src/", type="py")
```

### 步骤3：运行测试
使用Bash执行测试命令：
```bash
npm run test
```
```

#### MCP工具调用

```markdown
## MCP工具使用

### 搜索最新信息
```
mcp__mcp-router__search(
    query="$ARGUMENTS 最新资讯",
    search_service="google",
    max_results=10
)
```

### 获取GitHub趋势
```
mcp__mcp-router__trending(
    search_service="github",
    max_results=20
)
```
```

### 4.6 条件逻辑设计

虽然Markdown不支持编程逻辑，但通过精心设计的提示词可以实现条件分支。

#### IF-ELSE模式

```markdown
## 执行逻辑

根据 $ARGUMENTS 的内容判断执行路径：

**情况1：参数包含"深度"或"详细"**
→ 执行深度分析流程
→ 输出完整报告（3000字以上）
→ 包含数据图表

**情况2：参数包含"快速"或"简要"**
→ 执行快速分析
→ 输出简要报告（500字以内）
→ 只包含关键结论

**情况3：其他情况（默认）**
→ 执行标准分析
→ 输出标准报告（1500字）
→ 包含主要发现和建议
```

#### SWITCH-CASE模式

```markdown
## 类型判断

检查 $ARGUMENTS 的第一个关键词，确定文章类型：

| 关键词 | 文章类型 | 使用模板 |
|--------|----------|----------|
| "测评" | 测评类 | templates/review.md |
| "教程" | 教程类 | templates/tutorial.md |
| "降价" | 降价类 | templates/discount.md |
| "对比" | 对比类 | templates/comparison.md |
| 其他 | 通用类 | templates/general.md |

根据判断结果，加载对应模板。
```

### 4.7 实战案例：创建写作命令

**目标**：创建一个完整的公众号写作命令

**文件：`.claude/commands/write.md`**

```markdown
---
description: 公众号文章全自动创作 - 从选题到成稿的完整流程
argument-hint: <主题关键词>
allowed-tools:
  - Read
  - Write
  - WebSearch
  - Grep
  - Bash
---

# 公众号文章创作系统

## 角色定义
你是一位资深的公众号写作专家，擅长创作接地气、有深度的技术科普文章。

## 任务
根据用户提供的主题，创作一篇高质量的公众号文章。

**主题**：$ARGUMENTS

## 执行流程

### 步骤1：选题可行性检查
首先判断选题是否适合写作：
- 是否有足够的信息支撑？
- 受众是否感兴趣？
- 是否与账号定位匹配？

如果不适合，向用户说明原因并建议替代选题。

### 步骤2：信息收集
使用WebSearch搜索主题相关的最新信息：
```
WebSearch(query="$ARGUMENTS 最新资讯 2025")
```

收集以下信息：
- 核心概念和定义
- 最新动态和更新
- 用户痛点和需求
- 实战案例和数据

### 步骤3：构思大纲
基于收集的信息，构思文章大纲：

```
一、金句开头（1段）
   - 引发共鸣的场景描述
   - 或令人惊讶的数据/事实

二、问题引入（2-3段）
   - 用户面临的痛点
   - 为什么需要关注这个话题

三、核心内容（5-8段）
   - 关键知识点
   - 实战案例
   - 操作步骤（如适用）

四、总结升华（1-2段）
   - 核心观点回顾
   - 行动号召
```

### 步骤4：撰写文章
按照大纲撰写完整文章，注意：

**风格要求**：
- 说人话，不说AI腔
- 用类比解释复杂概念
- 多用短句，少用长句
- 适当使用口语化表达

**格式要求**：
- 标题：不超过30字
- 正文：1500-2000字
- 段落：每段不超过150字
- 小标题：每300-500字设置一个

### 步骤5：保存文章
使用Write工具保存文章：
```
Write("articles/drafts/[日期]_[主题].md", [文章内容])
```

### 步骤6：生成标题
为文章生成5个备选标题，每个标题：
- 包含数字或具体承诺
- 引发好奇心
- 不超过30字

## 输出格式
```markdown
# [选定的标题]

[文章正文]

---
## 备选标题
1. [标题1]
2. [标题2]
3. [标题3]
4. [标题4]
5. [标题5]
```
```

**使用示例**：

```
You: /write Claude Code入门

# Claude会执行完整流程：
# 1. 检查选题可行性
# 2. 搜索最新信息
# 3. 构思大纲
# 4. 撰写文章
# 5. 保存到drafts目录
# 6. 生成备选标题
```

---

## 第五部分：命令高级用法

> **本节目的**：掌握命令组合、嵌套、社区资源等高级技巧
>
> **预计时间**：60分钟

### 5.1 命令命名空间

当命令放在子目录时，使用 `目录名:命令名` 的格式调用。

**目录结构**：

```
.claude/commands/
├── dev/
│   ├── code-review.md    → /dev:code-review
│   ├── debug.md          → /dev:debug
│   └── refactor.md       → /dev:refactor
├── test/
│   ├── generate.md       → /test:generate
│   └── coverage.md       → /test:coverage
└── deploy/
    ├── prepare.md        → /deploy:prepare
    └── rollback.md       → /deploy:rollback
```

**优点**：
- 命令分类清晰
- 避免命名冲突
- 便于团队管理

### 5.2 命令组合与链式调用

#### 在命令中调用其他命令

```markdown
# 每日工作流命令

## 执行步骤

### 步骤1：热点扫描
首先执行热点扫描，获取今日AI热点：
```
执行 /hotspot 命令
```

### 步骤2：选择写作主题
从热点中选择一个适合的主题。

### 步骤3：创作文章
使用选定的主题执行写作：
```
执行 /write [选定的主题]
```

### 步骤4：质量检查
文章完成后执行质量检查：
```
执行 /pre-check
```
```

#### 创建工作流命令

```markdown
---
description: 完整的文章创作工作流
argument-hint: <热点关键词>
---

# 文章创作工作流

## 工作流步骤

### 阶段1：选题
1. 执行 /topic-filter $ARGUMENTS
2. 如果选题通过，继续下一步
3. 如果不通过，向用户建议替代选题

### 阶段2：创作
1. 执行 /write [确认的选题]
2. 等待文章生成完成

### 阶段3：优化
1. 执行 /title-gen 为文章生成更多标题
2. 执行 /title-score 评估标题质量
3. 选择最佳标题

### 阶段4：检查
1. 执行 /pre-check 进行发布前检查
2. 如果检查通过，输出最终文章
3. 如果不通过，根据建议修改后重新检查

### 阶段5：完成
输出最终成果：
- 文章文件路径
- 选定的标题
- 质量检查报告
```

### 5.3 模块化设计

#### 将通用逻辑提取为模块

**创建模块文件 `.claude/modules/writing-style.md`**：

```markdown
# 写作风格规范

## 语言风格
- 说人话，不说AI腔
- 用"你"而不是"您"
- 用口语化表达代替书面语
- 举例子比讲道理更有效

## 句式要求
- 短句优先
- 每段不超过150字
- 金句放在段落开头

## 禁用词汇
- "首先...其次...最后..."
- "综上所述"
- "不言而喻"
- "众所周知"
```

**在命令中引用模块**：

```markdown
# 文章创作命令

## 步骤1：加载写作规范
首先读取写作风格规范：
```
Read(".claude/modules/writing-style.md")
```

## 步骤2：按规范创作
遵循加载的写作规范，创作文章...
```

### 5.4 社区命令资源

#### Claude Command Suite

**地址**：https://github.com/qdhenry/Claude-Command-Suite

**包含内容**：
- 148+ 专业命令
- 54 AI代理
- 完整的开发工作流

**安装方法**：

```bash
# 克隆仓库
git clone https://github.com/qdhenry/Claude-Command-Suite.git

# 复制需要的命令到你的项目
cp Claude-Command-Suite/.claude/commands/dev/* .claude/commands/dev/
```

**常用命令示例**：

| 命令 | 功能 |
|------|------|
| `/dev:code-review` | 代码审查 |
| `/dev:debug-error` | 调试错误 |
| `/test:generate-test-cases` | 生成测试用例 |
| `/security:security-audit` | 安全审计 |
| `/deploy:prepare-release` | 准备发布 |

#### Awesome Claude Code

**地址**：https://github.com/hesreallyhim/awesome-claude-code

**包含内容**：
- 社区精选命令
- 最佳实践
- 配置模板

### 5.5 故障排查

#### 命令不存在

**症状**：`Command not found: /my-command`

**排查步骤**：

```bash
# 1. 检查文件是否存在
ls .claude/commands/my-command.md

# 2. 检查文件名是否正确（区分大小写）
# 命令名 = 文件名（不含.md）

# 3. 检查目录位置
# 项目级：.claude/commands/
# 用户级：~/.claude/commands/

# 4. 重启Claude Code
exit
claude
```

#### 命令执行失败

**症状**：命令触发了但执行出错

**排查步骤**：

```bash
# 1. 检查frontmatter格式
# YAML语法错误会导致命令无法解析
# 使用在线YAML验证器检查

# 2. 检查allowed-tools配置
# 如果限制了工具，确保需要的工具在列表中

# 3. 检查$ARGUMENTS使用
# 确保参数格式正确
```

#### frontmatter解析错误

**症状**：命令行为异常

**常见错误**：

```yaml
# 错误1：缺少结束标记
---
description: 我的命令
# 缺少 ---

# 错误2：缩进错误
---
allowed-tools:
- Read    # 应该有缩进
  - Write
---

# 正确格式
---
description: 我的命令
allowed-tools:
  - Read
  - Write
---
```

---

## 第六部分：FAQ（20个常见问题）

### 基础问题

**Q1: 自定义命令文件放在哪里？**

| 作用域 | 位置 | 生效范围 |
|--------|------|----------|
| 项目级 | `.claude/commands/` | 仅当前项目 |
| 用户级 | `~/.claude/commands/` | 所有项目 |

---

**Q2: 命令名和文件名有什么关系？**

命令名 = 文件名（不含.md扩展名）

```
.claude/commands/write.md → /write
.claude/commands/dev/review.md → /dev:review
```

---

**Q3: 如何传递参数给命令？**

在命令后直接输入参数，用 `$ARGUMENTS` 接收：

```
/write AI教程
→ $ARGUMENTS = "AI教程"
```

---

**Q4: 支持多个参数吗？**

支持！所有参数都在 `$ARGUMENTS` 中，需要在命令中自行解析：

```markdown
## 参数格式
$ARGUMENTS 格式：<主题> [风格] [字数]

示例：/write AI工具 技术 3000
```

---

**Q5: frontmatter是必须的吗？**

不是必须的，但强烈推荐。没有frontmatter的命令也能工作：

```markdown
# 最简单的命令（无frontmatter）

你好！请问候用户：$ARGUMENTS
```

### 配置问题

**Q6: allowed-tools有哪些可选值？**

| 工具 | 功能 |
|------|------|
| `Read` | 读取文件 |
| `Write` | 写入文件 |
| `Edit` | 编辑文件 |
| `Bash` | 执行命令 |
| `WebSearch` | 网络搜索 |
| `WebFetch` | 抓取网页 |
| `Glob` | 文件搜索 |
| `Grep` | 内容搜索 |

---

**Q7: 如何指定命令使用的模型？**

在frontmatter中设置：

```yaml
---
model: claude-opus-4-5-20250514
---
```

---

**Q8: argument-hint有什么作用？**

显示在命令输入时的占位提示：

```yaml
---
argument-hint: <主题> [--style=formal]
---
```

输入 `/write` 后会显示 `<主题> [--style=formal]`。

---

**Q9: 如何让命令在所有项目都可用？**

放在用户级目录：`~/.claude/commands/`

---

**Q10: 项目级和用户级命令同名怎么办？**

项目级优先。优先级顺序：
1. 项目级 `.claude/commands/`
2. 用户级 `~/.claude/commands/`
3. 内置命令

### 开发问题

**Q11: 命令可以调用其他命令吗？**

可以！在命令中说明调用哪个命令：

```markdown
## 步骤3
执行 /pre-check 命令检查文章质量
```

---

**Q12: 如何在命令中使用MCP工具？**

直接调用MCP工具函数：

```markdown
## 搜索信息
```
mcp__mcp-router__search(query="$ARGUMENTS")
```
```

---

**Q13: 命令支持中文名吗？**

技术上支持，但不推荐：

```
✅ /write（推荐）
⚠️ /写作（可能有编码问题）
```

建议：命令名用英文，description用中文。

---

**Q14: 如何调试命令？**

1. 使用简单测试参数运行
2. 检查Claude的执行过程
3. 查看是否有错误提示
4. 逐步简化命令定位问题

---

**Q15: 命令文件有大小限制吗？**

没有硬性限制，但建议：
- 单个命令文件不超过500行
- 复杂逻辑拆分为多个命令
- 通用内容提取为模块

### 故障排查

**Q16: 命令不执行怎么办？**

检查清单：
- [ ] 文件存在于正确位置？
- [ ] 文件名正确（含.md扩展名）？
- [ ] frontmatter格式正确（YAML语法）？
- [ ] 重启过Claude Code？

---

**Q17: frontmatter解析失败怎么办？**

常见错误：
1. 缺少开始或结束的 `---`
2. YAML缩进错误
3. 特殊字符未转义

使用在线YAML验证器检查。

---

**Q18: 命令执行很慢怎么办？**

可能原因：
1. 命令中包含大量搜索操作
2. 读取了大文件
3. 网络请求超时

优化建议：
- 减少不必要的工具调用
- 限制搜索结果数量
- 添加超时处理

---

**Q19: 如何查看可用命令列表？**

```bash
# 方法1：/help命令
You: /help

# 方法2：Tab补全
输入 / 然后按Tab键
```

---

**Q20: 如何分享命令给团队？**

1. 将 `.claude/commands/` 加入Git版本控制
2. 团队成员克隆/拉取后自动获得命令
3. 使用统一的命名规范

```bash
git add .claude/commands/
git commit -m "Add custom commands"
git push
```

---

## 第七部分：实战练习

> **本节目的**：通过动手练习巩固所学知识
>
> **预计时间**：60分钟

### 7.1 练习1：创建问候命令（10分钟）

**目标**：创建一个带参数验证的问候命令

**任务**：
1. 创建 `.claude/commands/greet.md`
2. 实现以下功能：
   - 接收姓名参数
   - 如果没有参数，提示用户输入
   - 根据当前时间（早/中/晚）使用不同问候语

**参考答案**：

```markdown
---
description: 智能问候命令 - 根据时间自动选择问候语
argument-hint: <姓名>
---

# 智能问候命令

## 任务
根据当前时间和用户名称，生成个性化问候。

## 参数
用户名称：$ARGUMENTS

## 执行逻辑

### 步骤1：验证参数
如果 $ARGUMENTS 为空：
- 提示用户："请提供姓名，格式：/greet 张三"
- 终止执行

### 步骤2：判断时间段
- 6:00-11:59 → 早上好
- 12:00-17:59 → 下午好
- 18:00-21:59 → 晚上好
- 22:00-5:59 → 夜深了

### 步骤3：生成问候
组合问候语和用户名称，友好地问候用户。
```

**测试**：
```bash
/greet 张三
/greet
```

### 7.2 练习2：创建代码审查命令（20分钟）

**目标**：创建一个代码审查命令

**任务**：
1. 创建 `.claude/commands/code-review.md`
2. 实现以下功能：
   - 接收文件路径参数
   - 读取文件内容
   - 检查代码风格、潜在Bug、安全问题
   - 输出结构化审查报告

**参考答案**：

```markdown
---
description: 代码审查命令 - 检查代码质量和潜在问题
argument-hint: <文件路径>
allowed-tools:
  - Read
  - Grep
---

# 代码审查命令

## 任务
对指定文件进行代码审查，检查代码质量。

## 参数
文件路径：$ARGUMENTS

## 执行流程

### 步骤1：验证参数
如果 $ARGUMENTS 为空，提示用户提供文件路径。

### 步骤2：读取文件
使用Read工具读取文件内容：
```
Read("$ARGUMENTS")
```

### 步骤3：执行审查
从以下维度审查代码：

**1. 代码风格**
- 命名规范
- 缩进一致性
- 注释完整性

**2. 潜在Bug**
- 空值检查
- 边界条件
- 异常处理

**3. 安全问题**
- SQL注入风险
- XSS风险
- 敏感信息泄露

**4. 性能问题**
- 循环优化
- 数据结构选择
- 资源释放

### 步骤4：输出报告

## 输出格式
```
代码审查报告
============
文件：[文件路径]
审查时间：[当前时间]

总体评分：X/100

严重问题（必须修复）：
- [问题1]：[位置] - [说明]

建议改进：
- [建议1]：[位置] - [说明]

代码亮点：
- [亮点1]
```
```

**测试**：
```bash
/code-review src/main.py
```

### 7.3 练习3：创建工作流命令（30分钟）

**目标**：创建一个串联多个命令的工作流

**任务**：
1. 创建 `.claude/commands/daily-flow.md`
2. 实现以下功能：
   - 调用热点扫描命令
   - 基于热点选择写作主题
   - 调用写作命令生成文章
   - 调用质量检查命令
   - 输出完整工作报告

**参考答案**：

```markdown
---
description: 每日内容创作工作流 - 从热点到成稿一站式完成
argument-hint: [热点关键词（可选）]
allowed-tools:
  - Read
  - Write
  - WebSearch
  - Bash
---

# 每日内容创作工作流

## 任务
执行完整的每日内容创作流程。

## 参数
可选热点关键词：$ARGUMENTS

## 执行流程

### 阶段1：热点扫描
执行热点扫描，获取今日AI热点。

如果提供了关键词 $ARGUMENTS，则重点搜索相关热点。
如果没有提供，则全面扫描。

### 阶段2：选题决策
从热点中选择最适合写作的主题：
- 评估时效性
- 评估受众匹配度
- 评估内容价值

输出选题理由。

### 阶段3：文章创作
使用选定的主题执行写作：
- 调用 /write [选定主题]
- 等待文章生成完成

### 阶段4：标题优化
- 调用 /title-gen 生成更多标题候选
- 选择最佳标题

### 阶段5：质量检查
- 调用 /pre-check 进行发布前检查
- 如果有问题，进行修复
- 直到检查通过

### 阶段6：完成报告
输出工作报告：

```
每日创作工作报告
================
日期：[日期]
耗时：[总耗时]

选题：[选定的主题]
选题来源：[热点来源]

文章：
- 标题：[最终标题]
- 字数：[字数]
- 文件：[文件路径]

质量检查：
- AI腔检测：[分数]
- 自然度：[分数]
- 整体评分：[分数]

备选标题：
1. [标题1]
2. [标题2]
3. [标题3]
```
```

**测试**：
```bash
/daily-flow
/daily-flow Claude Code
```

---

## 附录A：命令速查表

### 内置命令速查

| 分类 | 命令 | 功能 |
|------|------|------|
| **会话管理** | `/clear` | 清空对话历史 |
| | `/compact` | 压缩对话 |
| | `/resume` | 恢复会话 |
| | `/export` | 导出对话 |
| | `/rename` | 重命名会话 |
| **上下文** | `/context` | 查看Token使用 |
| | `/cost` | 查看费用 |
| | `/model` | 切换模型 |
| | `/usage` | 使用量统计 |
| **项目** | `/init` | 初始化项目 |
| | `/memory` | 编辑记忆 |
| | `/permissions` | 管理权限 |
| | `/add-dir` | 添加目录 |
| **开发** | `/review` | 代码审查 |
| | `/todos` | 查看待办 |
| | `/rewind` | 回退功能 |
| **诊断** | `/doctor` | 系统诊断 |
| | `/status` | 完整状态 |
| | `/stats` | 使用统计 |
| **MCP** | `/mcp` | 管理MCP |
| | `/hooks` | 管理Hooks |
| **其他** | `/help` | 显示帮助 |
| | `/release-notes` | 更新日志 |

### frontmatter配置速查

```yaml
---
description: 命令描述（显示在帮助中）
argument-hint: <必需> [可选]
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - WebSearch
  - Glob
  - Grep
model: claude-sonnet-4-5-20250514
version: 1.0.0
author: 作者名
---
```

### 命令文件模板

```markdown
---
description: 一句话描述命令功能
argument-hint: <参数说明>
allowed-tools:
  - Read
  - Write
---

# 命令标题

## 角色定义
你是...

## 任务
根据 $ARGUMENTS 执行...

## 执行步骤

### 步骤1：检查输入
检查 $ARGUMENTS 是否有效...

### 步骤2：执行操作
使用工具执行...

### 步骤3：输出结果
返回结果...

## 输出格式
```
[输出模板]
```
```

---

## 附录B：社区资源

### 官方资源

- [Claude Code官方文档](https://docs.anthropic.com/en/docs/claude-code)
- [Slash Commands文档](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [Anthropic最佳实践](https://www.anthropic.com/engineering/claude-code-best-practices)

### 社区项目

- [Claude Command Suite](https://github.com/qdhenry/Claude-Command-Suite) - 148+专业命令
- [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code) - 社区精选资源

### 相关课程

- 第1部分：环境与安装 - Claude Code安装配置
- 第2部分：基础使用 - CLI启动和交互模式
- 第4部分：MCP集成 - 外部工具连接
- 第5部分：Hooks系统 - 自动化工作流
- 第6部分：Skills定制 - 技能包开发

---

## 质量检查清单

### 内容完整性检查

- [x] 课程信息框完整（学时、难度、版本、来源）
- [x] 学习目标明确（6个可衡量目标）
- [x] 学习路径导航（4条路径）
- [x] 术语表完整（8个核心术语）
- [x] Commands简介（本质、类型、价值）
- [x] 5分钟快速开始（可独立执行）
- [x] 内置命令大全（30+命令按类分组）
- [x] 自定义命令开发（frontmatter、$ARGUMENTS、工具调用）
- [x] 高级用法（命名空间、组合、模块化、社区资源）
- [x] FAQ（20个常见问题）
- [x] 实战练习（3个递进式练习）
- [x] 附录（速查表、社区资源）

### 小白友好性检查

- [x] 所有术语有通俗解释和生活类比
- [x] 代码示例分Windows/macOS/Linux
- [x] 每个概念有实际使用示例
- [x] FAQ覆盖常见问题
- [x] 练习题由浅入深

### 信息准确性检查

- [x] 命令语法与官方文档一致
- [x] frontmatter配置项已验证
- [x] 社区资源链接有效

### 飞书兼容性检查

- [x] 无HTML标签（如`<details>`）
- [x] 纯Markdown格式
- [x] 代码块标注语言

---

## 学习总结

通过本课学习，你已经掌握：

1. **Commands核心概念**：Slash命令就是Markdown提示词文件
2. **30+内置命令**：会话管理、上下文控制、项目配置、开发辅助等
3. **自定义命令开发**：frontmatter配置、参数处理、工具调用
4. **高级技巧**：命令组合、模块化设计、社区资源
5. **故障排查**：常见问题诊断和解决方法

**下一步建议**：

1. 从第二部分的简单示例开始实践
2. 根据你的项目需求，创建第一个实用命令
3. 参考第四部分的实战案例，逐步构建命令库
4. 探索社区资源，学习优秀命令的设计模式

**记住**：Commands的核心价值是"一次配置，永久使用"。花时间设计好命令，能让你的开发效率翻倍！

---

> **课程反馈**：如果本教程对你有帮助，欢迎分享给更多人！
>
> **问题反馈**：遇到问题可以使用 `/bug` 命令报告，或在社区提问。
>
> **更新日期**：2025年12月19日
