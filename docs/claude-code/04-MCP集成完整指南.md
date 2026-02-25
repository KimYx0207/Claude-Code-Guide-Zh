# MCP集成完整指南：从配置到开发的实战手册

> **课程信息**
>
> - **作者**：老金
> - **预计学时**：4-6小时
> - **难度等级**：⭐⭐ 入门级（有Claude Code基础即可）
> - **更新日期**：2026年2月
> - **适用版本**：MCP规范 2025-11-25 / Claude Code v2.1+（验证于2026-02-25）
> - **前置要求**：已完成Claude Code安装和基础使用

---

## 本课学习目标

完成本课学习后，你将能够：

1. **理解MCP的核心价值**：掌握MCP协议与传统AI工具集成方式的本质区别
2. **配置常用MCP服务器**：独立完成Filesystem、GitHub、数据库等10+核心服务器配置
3. **掌握三作用域配置体系**：理解Local/Project/User作用域的优先级和适用场景
4. **排查MCP连接问题**：独立解决90%的常见配置和连接故障
5. **理解MCP工作原理**：掌握STDIO/HTTP传输层和JSON-RPC通信机制
6. **开发自定义MCP服务器**：从零创建一个可用的MCP服务器（TypeScript）
7. **安全使用MCP**：正确管理API密钥和敏感配置

---

## 学习路径导航（先看这里！）

> **根据你的情况选择学习路径**：这是一篇3000+行的长教程，不用全看！根据你的目标选择路径。

### 路径A：快速上手（60分钟）

**适合人群**：急着用MCP，想快速配一个看效果

**只看这些章节**（其他跳过）：

```
✅ 术语表（5分钟） - 快速了解MCP核心概念
✅ 第一部分：MCP简介（10分钟） - 理解MCP是什么
✅ 第二部分：5分钟快速开始（15分钟） - 配置第一个MCP服务器
✅ 第三部分3.1-3.3：配置GitHub和数据库MCP（30分钟）
```

**60分钟后你能达到**：成功配置2-3个MCP服务器，Claude Code能调用外部工具

---

### 路径B：完整学习（4-6小时）

**适合人群**：想深入理解MCP，掌握配置和开发

**学习顺序**：从头到尾所有章节

**建议分段学习**：
- 第1天（2小时）：第1-3部分（理解+配置）
- 第2天（2小时）：第4-5部分（原理+开发）
- 第3天（1小时）：第6-7部分（故障排查+FAQ）

---

### 路径C：问题排查（10分钟）

**适合人群**：MCP配置出问题，需要快速解决

**直接跳到这些章节**：

```
🔧 第六部分：故障排查 - 按错误类型查找解决方案
🔧 第七部分：FAQ - 20个常见问题解答
```

**使用方法**：
1. 按 `Ctrl + F` 搜索你的错误信息关键词
2. 找到对应的Q&A
3. 按步骤解决

---

### 路径D：专项学习（30-60分钟/主题）

**适合人群**：已经会配置MCP，想学习特定功能

| 想学什么 | 看哪几节 | 预计时间 |
|----------|---------|---------|
| **自定义MCP开发** | 第五部分 | 1.5小时 |
| **三作用域配置** | 第三部分3.4节 | 30分钟 |
| **MCP工作原理** | 第四部分 | 45分钟 |
| **安全最佳实践** | 第三部分3.5节 | 20分钟 |

---

## 术语表（小白必读）

在开始之前，先了解这些关键术语。**用生活类比帮助理解**：

| 术语 | 英文全称 | 通俗解释 | 生活类比 |
|------|----------|----------|----------|
| **JSON** | JavaScript Object Notation | 一种通用的数据格式，用花括号`{}`组织数据，MCP配置文件就是JSON格式 | 标准化的表格模板 |
| **`~`（波浪号）** | Home Directory | 用户的"家目录"，macOS是`/Users/用户名`，Linux是`/home/用户名`，Windows对应`C:\Users\用户名` | 你电脑上"我的文档"的上级目录 |
| **MCP** | Model Context Protocol | AI工具的"USB接口标准"，让AI能连接各种外部工具 | USB接口标准 |
| **MCP Server** | - | 符合MCP标准的"工具包"，提供特定功能 | USB设备（U盘、键盘） |
| **MCP Client** | - | 连接和使用MCP Server的程序 | 电脑的USB接口 |
| **MCP Host** | - | 运行MCP Client的宿主程序（如Claude Code） | 电脑主机 |
| **Tools** | - | MCP Server提供的"工具函数"，AI可以调用 | 工具箱里的锤子、螺丝刀 |
| **Resources** | - | MCP Server提供的"数据资源"，AI可以读取 | 参考书、资料库 |
| **Prompts** | - | MCP Server提供的"预设模板"，标准化交互 | 填空表格、问卷模板 |
| **STDIO** | Standard Input/Output | "直连线"传输方式，本地进程通信 | USB直连线 |
| **HTTP** | Hypertext Transfer Protocol | "网线"传输方式，支持远程通信 | 网线/WiFi |
| **JSON-RPC** | JSON Remote Procedure Call | MCP的通信协议，用JSON格式传递消息 | 对讲机的通话格式 |
| **作用域** | Scope | 配置的生效范围（Local/Project/User） | 房间/楼层/整栋楼 |
| **npx** | Node Package eXecute | 临时运行npm包的工具 | 租借工具（用完还） |
| **环境变量** | Environment Variable | 系统级配置，存储敏感信息 | 保险柜里的密码本 |

---

## 第一部分：MCP简介（5分钟快速理解）

### 1.1 MCP是什么

> **一句话理解**：MCP（Model Context Protocol）是AI工具的"USB接口标准"，让任何AI应用都能即插即用地连接各种外部服务。

#### 为什么需要MCP？

**没有MCP之前（混乱的世界）**：

```
问题：每个AI工具都要单独对接，重复造轮子

Claude Desktop → [自定义代码] → GitHub
Claude Desktop → [自定义代码] → 数据库
Claude Desktop → [自定义代码] → 文件系统

VS Code + AI → [另一套代码] → GitHub
VS Code + AI → [另一套代码] → 数据库

...无限重复...
```

**有了MCP之后（标准化的世界）**：

```
解决方案：统一接口，一次开发到处使用

Claude Desktop ──┐
VS Code + AI ────┼── MCP协议 ── GitHub MCP Server
Cursor ──────────┤              数据库 MCP Server
任何AI工具 ──────┘              文件系统 MCP Server
```

> **生活类比**：
> - **没有USB标准**：每个品牌的键盘、鼠标都需要专用接口，换电脑就要换设备
> - **有USB标准后**：任何USB键盘都能插任何电脑，即插即用

#### MCP的核心价值

| 对比维度 | 传统集成方式 | MCP方式 |
|----------|-------------|---------|
| **开发成本** | 每个工具单独对接，重复开发 | 一次开发，多处复用 |
| **兼容性** | 各平台接口不兼容 | 开放标准，跨平台通用 |
| **安全性** | 安全边界模糊 | 明确的权限控制和隔离 |
| **维护成本** | 高（每个集成都要维护） | 低（社区共建，生态复用） |
| **学习成本** | 高（每个工具API不同） | 低（统一协议，学一次用到处） |

### 1.2 MCP的发展历程

> 📌 **信息来源**：[MCP官方文档](https://modelcontextprotocol.io/) | [GitHub公告](https://github.com/modelcontextprotocol) | 验证日期：2026-02-25

| 时间 | 里程碑事件 | 意义 |
|------|-----------|------|
| **2024年11月** | Anthropic发布MCP 1.0规范 | 开创AI工具标准化先河 |
| **2025年3月** | 发布2025-03-26版本 | 引入Streamable HTTP传输，废弃SSE |
| **2025年6月** | 发布2025-06-18版本 | 进一步完善协议规范 |
| **2025年11月** | 发布2025-11-25版本 | 当前最新稳定版本 |
| **2025年12月9日** | MCP捐赠给Linux基金会AAIF | 成为行业标准，OpenAI/Google/Microsoft等巨头支持 |

> 💡 **重要事件**：2025年12月9日，Anthropic将MCP捐赠给Linux基金会下的Agentic AI Foundation（AAIF）。这意味着MCP从"Anthropic的协议"变成了"行业标准"，OpenAI、Google DeepMind、Microsoft等主流AI厂商都已表态支持。

### 1.3 MCP能做什么（5个实际案例）

**案例1：文件系统操作**
```
你：帮我在data目录下创建一个config.json文件

Claude Code（通过Filesystem MCP）：
1. [调用] list_directory("./data") - 检查目录存在
2. [调用] write_file("./data/config.json", "{}") - 创建文件
3. [返回] 文件创建成功！路径：./data/config.json
```

**案例2：GitHub仓库管理**
```
你：帮我创建一个Issue，标题是"修复登录bug"

Claude Code（通过GitHub MCP）：
1. [调用] create_issue(owner, repo, title, body) - 创建Issue
2. [返回] Issue创建成功！链接：https://github.com/xxx/xxx/issues/123
```

**案例3：数据库查询**
```
你：查一下用户表有多少条记录

Claude Code（通过SQLite MCP）：
1. [调用] read_query("SELECT COUNT(*) FROM users")
2. [返回] 用户表共有 1,234 条记录
```

**案例4：获取最新技术文档**
```
你：帮我查一下Next.js 15的App Router怎么用

Claude Code（通过Context7 MCP）：
1. [调用] resolve_library_id("next.js")
2. [调用] get_library_docs("/vercel/next.js", "app router")
3. [返回] 这是Next.js 15 App Router的最新文档...
```

**案例5：网页搜索**
```
你：搜一下2025年最新的AI编程工具

Claude Code（通过Brave Search MCP）：
1. [调用] brave_web_search("2025 AI编程工具", count=5)
2. [返回] 搜索结果：1. xxx 2. xxx 3. xxx ...
```

---

## 第二部分：5分钟快速开始（立即见效）

> **本节目的**：用最快速度配置第一个MCP服务器，让你立即看到效果！
>
> ⏱️ **预计时间**：5-10分钟

### 2.1 配置第一个MCP服务器（Filesystem）

**为什么选Filesystem？**

- ✅ 最简单，不需要任何API Key
- ✅ 最常用，文件操作是开发基础
- ✅ 效果直观，立即看到结果

#### 步骤1：创建配置文件

**这一步要做什么**：在项目根目录创建 `.mcp.json` 文件

> 💡 **你有两种选择**：
>
> **选择A：在Claude Code对话框里说人话（推荐新手）**
>
> ```
> 帮我创建项目MCP配置文件 .mcp.json，配置一个filesystem服务器，允许访问当前目录
> ```
>
> （换行用 `Shift + Enter`，最后按 `Enter` 发送）
>
> Claude Code会自动帮你创建正确格式的配置文件！
>
> **选择B：在终端里用命令行（熟悉命令行的用户）**
> 见下方PowerShell/Bash代码

**Windows系统（PowerShell终端）：**
```powershell
# 进入你的项目目录
cd C:\你的项目路径

# 创建.mcp.json文件（PowerShell 7推荐）
@'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."],
      "env": {}
    }
  }
}
'@ | Out-File -FilePath ".mcp.json" -Encoding utf8
```

**macOS/Linux系统（终端）：**
```bash
# 进入你的项目目录
cd ~/你的项目路径

# 创建.mcp.json文件
cat > .mcp.json << 'EOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."],
      "env": {}
    }
  }
}
EOF
```

**手动创建（适合所有平台）：**

1. 在项目根目录新建文件，命名为 `.mcp.json`（注意开头有个点）
2. 复制粘贴以下内容：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."],
      "env": {}
    }
  }
}
```

> 💡 **配置说明**：
> - `"filesystem"`：服务器名称，你可以自己起名
> - `"command": "npx"`：使用npx运行
> - `"-y"`：自动同意安装
> - `"@modelcontextprotocol/server-filesystem"`：官方Filesystem MCP包名
> - `"."`：允许访问的目录（当前目录）

#### 步骤2：验证配置文件

**验证方法：**

```bash
# 查看配置文件内容
cat .mcp.json
# 预期输出：你刚才写入的JSON内容

# 验证JSON格式是否正确（需要安装jq，可选）
cat .mcp.json | jq .
# 如果格式正确，会输出格式化的JSON
# 如果格式错误，会报错
```

**如果没有jq工具**，可以用在线JSON验证器：https://jsonlint.com/

#### 步骤3：启动Claude Code

**这一步要做什么**：重新启动Claude Code，让它读取新配置

```bash
# 在项目目录启动Claude Code
claude
```

**启动时会看到**：

```
Claude Code v2.1.52
Working directory: /你的项目路径

MCP servers connected:
  ✓ filesystem (3 tools available)

You: █
```

> ✅ **关键确认**：看到 `✓ filesystem` 说明MCP服务器连接成功！

**如果看不到MCP服务器列表**：

1. 确认 `.mcp.json` 文件在项目根目录
2. 确认文件名正确（开头有点，后缀是json）
3. 确认JSON格式正确
4. 退出Claude Code后重新启动

#### 步骤4：测试MCP功能

**测试命令**：

```
你：列出当前目录下的所有文件
```

**预期响应**：

```
Claude Code：
[调用 filesystem.list_directory]
路径: .

目录内容：
- .mcp.json (配置文件)
- package.json
- src/
- node_modules/
...
```

**更多测试**：

```
你：读取package.json文件内容

你：在src目录下创建一个test.txt文件，内容是"Hello MCP"

你：搜索所有.js文件
```

### 2.2 验证MCP工作正常

**完整验证清单**：

- [ ] `.mcp.json` 文件存在且格式正确
- [ ] Claude Code启动时显示MCP服务器已连接
- [ ] 能成功执行 `list_directory` 工具
- [ ] 能成功执行 `read_file` 工具
- [ ] 能成功执行 `write_file` 工具（会请求确认）

### 2.3 第一个MCP工具调用

**恭喜你！** 如果上面的测试都成功了，你已经完成了MCP的基础配置。

**你刚才完成了什么？**

1. ✅ 创建了MCP配置文件
2. ✅ 连接了Filesystem MCP服务器
3. ✅ 通过Claude Code调用了MCP工具
4. ✅ 验证了MCP正常工作

**接下来可以**：

- 继续学习更多MCP服务器（第三部分）
- 了解MCP工作原理（第四部分）
- 开发自己的MCP服务器（第五部分）

---

## 第三部分：常用MCP服务器配置（实战为主）

> **本节目的**：学会配置10+最常用的MCP服务器
>
> ⏱️ **预计时间**：1-2小时

### 3.1 配置方式详解

#### 方式1：JSON配置文件（推荐）

**创建 `.mcp.json` 文件**：

```json
{
  "mcpServers": {
    "服务器名称1": {
      "command": "启动命令",
      "args": ["参数1", "参数2"],
      "env": {
        "环境变量名": "值"
      }
    },
    "服务器名称2": {
      ...
    }
  }
}
```

**配置字段说明**：

| 字段 | 必需 | 说明 | 示例 |
|------|------|------|------|
| `command` | ✅ | 启动命令 | `"npx"`, `"node"`, `"python"` |
| `args` | ✅ | 命令参数数组 | `["-y", "@modelcontextprotocol/server-xxx"]` |
| `env` | ❌ | 环境变量对象 | `{"API_KEY": "xxx"}` |
| `timeout` | ❌ | 超时时间(毫秒) | `60000` |

#### 方式2：CLI命令（快速添加）

```bash
# 添加MCP服务器
claude mcp add <服务器名> <命令> [参数...]

# 示例：添加filesystem服务器
claude mcp add filesystem npx -y @modelcontextprotocol/server-filesystem ./data

# 列出所有MCP服务器
claude mcp list

# 查看特定服务器详情
claude mcp get filesystem

# 删除服务器
claude mcp remove filesystem
```

**CLI添加的作用域**：

```bash
# 默认添加到local作用域
claude mcp add my-server npx -y xxx

# 指定添加到project作用域
claude mcp add --scope project my-server npx -y xxx

# 指定添加到user作用域（全局）
claude mcp add --scope user my-server npx -y xxx
```

#### 方式对比

| 对比维度 | JSON配置文件 | CLI命令 |
|----------|-------------|---------|
| **适合场景** | 团队项目、版本控制 | 快速测试、个人配置 |
| **可读性** | 高（结构清晰） | 中 |
| **批量配置** | 方便（一个文件） | 不便（逐个添加） |
| **版本控制** | 支持 | 不支持 |
| **推荐度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 3.2 GitHub MCP服务器

> **功能**：完整的GitHub仓库管理能力，包括创建仓库、管理Issue、PR等

#### 配置步骤

**步骤1：获取GitHub Token**

1. 登录 GitHub.com
2. 点击右上角头像 → Settings
3. 左侧菜单最下方 → Developer settings
4. Personal access tokens → Tokens (classic)
5. Generate new token (classic)
6. 勾选权限：
   - ✅ `repo`（完整仓库访问）
   - ✅ `workflow`（如需管理Actions）
7. 点击 Generate token
8. **立即复制保存Token**（只显示一次！）

> ⚠️ **安全提醒**：Token只显示一次，关闭页面就看不到了！

**步骤2：配置环境变量**

**Windows（PowerShell 7）：**
```powershell
# 永久设置环境变量
[System.Environment]::SetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN', 'ghp_你的Token', 'User')

# 验证
$env:GITHUB_PERSONAL_ACCESS_TOKEN
# 应显示你的Token
```

**macOS/Linux：**
```bash
# 添加到shell配置文件
echo 'export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_你的Token"' >> ~/.zshrc
source ~/.zshrc

# 验证
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

**步骤3：添加MCP配置**

在 `.mcp.json` 中添加：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

> 💡 **说明**：`${GITHUB_PERSONAL_ACCESS_TOKEN}` 会自动读取环境变量，不用把Token直接写在配置文件里

**步骤4：验证配置**

```bash
# 重启Claude Code
claude

# 测试
你：查看我的GitHub仓库列表
你：创建一个Issue到xxx仓库，标题是"测试MCP"
```

#### 提供的工具

| 工具名 | 功能 | 参数 |
|--------|------|------|
| `create_repository` | 创建仓库 | name, description, private |
| `get_file_contents` | 获取文件内容 | owner, repo, path |
| `push_files` | 推送文件 | owner, repo, branch, files |
| `create_issue` | 创建Issue | owner, repo, title, body |
| `create_pull_request` | 创建PR | owner, repo, title, head, base |
| `fork_repository` | Fork仓库 | owner, repo |
| `create_branch` | 创建分支 | owner, repo, branch |
| `search_repositories` | 搜索仓库 | query |
| `search_code` | 搜索代码 | query |
| `search_issues` | 搜索Issues | query |

### 3.3 数据库MCP服务器

#### SQLite（本地数据库）

> **功能**：本地SQLite数据库的完整访问，无需安装数据库软件

**配置方法**：

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "./data/app.db"],
      "env": {}
    }
  }
}
```

> 💡 **说明**：最后的参数是数据库文件路径，不存在会自动创建。SQLite MCP是Python包，需要用 `uvx` 而非 `npx`

**提供的工具**：

| 工具名 | 功能 | 参数 |
|--------|------|------|
| `read_query` | 执行SELECT查询 | query |
| `write_query` | 执行INSERT/UPDATE/DELETE | query |
| `create_table` | 创建表 | query |
| `list_tables` | 列出所有表 | - |
| `describe_table` | 获取表结构 | table_name |
| `append_insight` | 添加分析洞察 | insight |

**使用示例**：

```
你：创建一个users表，包含id、name、email字段
你：插入一条记录：张三，zhangsan@example.com
你：查询所有用户
```

#### PostgreSQL（生产数据库）

> **功能**：连接PostgreSQL数据库，支持查询和结构检查

**配置方法**：

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:password@localhost:5432/database"]
    }
  }
}
```

> ⚠️ **安全建议**：
> - 使用只读数据库用户
> - 不要在配置文件中硬编码密码
> - 连接字符串通过 `args` 传递，可使用环境变量替代硬编码：`"postgresql://${PGUSER}:${PGPASSWORD}@localhost:5432/database"`

**提供的工具**：

| 工具名 | 功能 | 参数 |
|--------|------|------|
| `query` | 执行SQL查询 | sql |

> 💡 **说明**：`query` 是唯一的Tool。表结构信息（schemas、tables、columns）通过MCP的Resources机制自动暴露，无需手动调用工具即可获取

### 3.4 三作用域配置体系

> 🎯 **关键点**：理解配置的作用域和优先级，是正确使用MCP的关键！

#### 三大作用域

| 作用域 | 存储位置 | 优先级 | 适用场景 |
|--------|----------|--------|----------|
| **Local** | `~/.claude.json` 项目条目 | 最高 | 个人私有配置、含API Key |
| **Project** | 项目根目录 `.mcp.json` | 中等 | 团队共享、版本控制 |
| **User** | `~/.claude.json` 全局部分 | 最低 | 个人常用工具 |

> 💡 **Windows用户路径说明**：
> - `~/.claude.json` 在Windows上对应：`C:\Users\你的用户名\.claude.json`
> - 可以在资源管理器地址栏输入 `%USERPROFILE%` 快速跳转到用户目录
>
> **作用域名称说明**：
> - **Local**（本地）：虽然叫"本地"，但实际是"项目级个人私有配置"——只对当前项目生效，且不提交到Git
> - **Project**（项目）：项目级共享配置，整个团队都能看到
> - **User**（用户）：全局个人配置，所有项目都能用

#### 优先级合并规则

```
Local > Project > User
```

**示例场景**：

假设三个作用域都配置了 `github` 服务器：

```
User作用域：GITHUB_PERSONAL_ACCESS_TOKEN = "user-token"
Project作用域：GITHUB_PERSONAL_ACCESS_TOKEN = "${GITHUB_PERSONAL_ACCESS_TOKEN}"
Local作用域：GITHUB_PERSONAL_ACCESS_TOKEN = "local-override-token"

最终生效：Local作用域的配置（local-override-token）
```

#### 作用域选择建议

| 场景 | 推荐作用域 | 原因 |
|------|-----------|------|
| 包含API密钥的配置 | Local | 安全，不会提交到Git |
| 团队必需的工具 | Project | 团队共享，可版本控制 |
| 个人常用工具 | User | 全局可用 |
| 临时测试配置 | Local | 不影响其他配置 |
| CI/CD使用 | Project | 可自动化部署 |

#### 配置方法

**Local作用域**（修改 `~/.claude.json`）：

```json
{
  "mcpServers": {
    "/Users/me/project1": {
      "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxx_local_override"
        }
      }
    }
  }
}
```

**Project作用域**（项目根目录 `.mcp.json`）：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

**User作用域**（使用CLI）：

```bash
claude mcp add --scope user github npx -y @modelcontextprotocol/server-github
```

### 3.5 更多常用服务器配置

#### Brave Search（网页搜索）

> **功能**：隐私优先的Web搜索，免费层每月2000次查询

**获取API Key**：
1. 访问 https://brave.com/search/api/
2. 注册账号
3. 创建API Key
4. 免费层：2000次/月

**配置方法**：

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${BRAVE_API_KEY}"
      }
    }
  }
}
```

#### Context7（技术文档）

> **功能**：获取1000+流行框架的最新文档，解决AI训练数据过时问题

**配置方法**（无需API Key）：

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {}
    }
  }
}
```

**使用示例**：

```
你：查一下React 19的新特性

Claude Code：
1. [调用] resolve_library_id("react")
2. [调用] get_library_docs("/facebook/react", "react 19", 5000)
3. [返回] React 19新特性包括：...
```

> **注意**：Context7 免费额度为每月 1,000 次请求（2026年1月从 6,000 次下调），每小时限 60 次。超出需配置 API Key。

#### MCP Apps（交互式界面）

> **功能**：MCP 服务器可提供交互式用户界面，直接在聊天中渲染图表、表单、仪表盘

这是 2026 年初新增的能力——MCP 服务器不再只是返回文本数据，还可以返回可交互的 UI 组件。这意味着你可以在 Claude Code 的对话中直接操作第三方工具的界面，无需切换到外部应用。

#### MCP 工具懒加载（v2.1.52+）

> **功能**：延迟加载 MCP 工具定义，减少上下文占用高达 95%

当你配置了大量 MCP 服务器时，旧版本会把所有工具描述一次性加载到上下文窗口，浪费大量 token。v2.1.52+ 引入了 **ToolSearch 懒加载机制**——只有在需要时才加载对应工具。

**使用方式**（自动生效，无需配置）：

```
你：帮我查一下Slack里的消息

Claude Code：
1. [ToolSearch] 搜索 "slack" → 找到 mcp__slack__read_channel
2. [加载] 按需加载 slack 工具定义
3. [调用] mcp__slack__read_channel(...)
```

#### 远程 MCP 服务器

> **功能**：支持连接远程运行的 MCP 服务器（HTTP 传输），不限于本地进程

配置远程 MCP 服务器：

```bash
claude mcp add --transport http my-remote-server https://your-server.com/mcp
```

适用于团队共享的 MCP 服务（如共享数据库、内部 API 网关等）。

#### Memory（持久化记忆）

> **功能**：跨会话保存信息，记住用户偏好和项目上下文

**配置方法**：

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {}
    }
  }
}
```

#### Fetch（网页获取）

> **功能**：获取网页内容，转换为Markdown格式

**配置方法**：

```json
{
  "mcpServers": {
    "fetch": {
      "command": "uvx",
      "args": ["mcp-server-fetch"],
      "env": {}
    }
  }
}
```

#### Sequential Thinking（顺序思考）

> **功能**：结构化的顺序思考过程，用于分解复杂问题

**配置方法**：

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "env": {}
    }
  }
}
```

#### Puppeteer（浏览器自动化）

> **功能**：无头浏览器自动化，网页截图、表单填写、数据采集

**配置方法**：

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "env": {}
    }
  }
}
```

### 3.6 完整配置示例

**一个功能完整的项目配置**（`.mcp.json`）：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./src", "./docs", "./data"],
      "env": {}
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    },
    "sqlite": {
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "./data/app.db"],
      "env": {}
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {}
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${BRAVE_API_KEY}"
      }
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {}
    },
    "fetch": {
      "command": "uvx",
      "args": ["mcp-server-fetch"],
      "env": {}
    }
  }
}
```

### 3.7 服务器分类速查表

| 分类 | 服务器 | 用途 | 需要API Key | 重要 |
|------|--------|------|-------------|:----:|
| **数据** | filesystem | 文件读写 | ❌ | ⭐ |
| **数据** | sqlite | SQLite数据库 | ❌ | ⭐ |
| **数据** | postgres | PostgreSQL数据库 | ❌（需连接串） | |
| **数据** | memory | 持久化记忆 | ❌ | |
| **搜索** | brave-search | 网页搜索 | ✅ | ⭐ |
| **搜索** | fetch | 网页获取 | ❌ | |
| **开发** | github | GitHub仓库管理 | ✅ | ⭐ |
| **开发** | gitlab | GitLab仓库管理 | ✅ | |
| **开发** | git | 本地Git操作 | ❌ | |
| **知识** | context7 | 技术文档 | ❌ | ⭐ |
| **思考** | sequential-thinking | 顺序推理 | ❌ | |
| **自动化** | puppeteer | 浏览器自动化 | ❌ | |

---

## 第四部分：MCP工作原理（可选深入）

> **本节目的**：理解MCP底层工作机制，帮助排查问题和开发自定义服务器
>
> ⏱️ **预计时间**：30-45分钟
>
> 💡 **可跳过**：如果你只是想使用MCP，不打算开发自定义服务器，可以跳过本节

### 4.1 传输层详解

#### STDIO传输（标准输入输出）

> **这是什么？** STDIO是最基础的传输方式，MCP客户端和服务器通过进程间的标准输入输出流通信。

**工作原理**：

```
┌──────────────────┐         ┌──────────────────┐
│   MCP Client     │         │   MCP Server     │
│  (Claude Code)   │         │  (subprocess)    │
├──────────────────┤         ├──────────────────┤
│                  │ stdin   │                  │
│  发送请求 ────────┼────────►│  接收并处理      │
│                  │         │                  │
│                  │ stdout  │                  │
│  接收响应 ◄───────┼─────────│  发送响应        │
│                  │         │                  │
│                  │ stderr  │                  │
│  查看日志 ◄───────┼─────────│  输出日志        │
└──────────────────┘         └──────────────────┘
```

**生活类比**：
- STDIO就像两个人面对面对话
- stdin = 听（接收信息）
- stdout = 说（发送回复）
- stderr = 旁白（日志信息）

**优势**：
- ✅ 简单直接，无需网络配置
- ✅ 性能最优，无网络开销
- ✅ 安全性高，进程级隔离
- ✅ 最适合单客户端场景

**适用场景**：
- 本地工具（filesystem、sqlite）
- 单用户使用
- 不需要远程访问

#### Streamable HTTP传输（远程通信）

> **这是什么？** HTTP传输让MCP服务器可以运行在远程机器上，通过网络通信。

**工作原理**：

```
┌──────────────────┐   HTTP   ┌──────────────────┐
│   MCP Client     │  POST    │   MCP Server     │
│                  │────────►│   (Remote)       │
│                  │         │                  │
│                  │  SSE    │                  │
│  接收流式响应 ◄───┼─────────│  流式返回        │
└──────────────────┘         └──────────────────┘
```

**生活类比**：
- HTTP传输就像打电话
- 可以在不同地点通话
- 但需要电话线（网络）连接

**优势**：
- ✅ 支持远程访问
- ✅ 可多客户端共享
- ✅ 适合分布式部署

**适用场景**：
- 远程服务器
- 多用户共享
- 分布式系统

#### 传输方式对比

| 特性 | STDIO | HTTP |
|------|-------|------|
| **部署位置** | 本地 | 本地或远程 |
| **网络需求** | 无 | 需要HTTP |
| **性能** | 最优 | 略有开销 |
| **安全性** | 进程隔离 | 需要认证 |
| **适用场景** | 单客户端本地工具 | 分布式/远程服务 |
| **复杂度** | 简单 | 中等 |
| **推荐度** | ⭐⭐⭐⭐⭐（本地） | ⭐⭐⭐⭐（远程） |

### 4.2 JSON-RPC通信机制

> **这是什么？** JSON-RPC是MCP使用的通信协议，所有消息都是JSON格式。

#### 三种消息类型

**1. 请求（Request）**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "read_file",
    "arguments": {
      "path": "/path/to/file.txt"
    }
  }
}
```

**字段说明**：
- `jsonrpc`：协议版本，必须是"2.0"
- `id`：请求标识符，用于匹配响应
- `method`：要调用的方法名
- `params`：方法参数（可选）

**2. 响应（Response）**

成功响应：
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "文件内容..."
      }
    ]
  }
}
```

错误响应：
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32600,
    "message": "Invalid Request",
    "data": "详细错误信息"
  }
}
```

**3. 通知（Notification）**

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "token-123",
    "progress": 50,
    "total": 100
  }
}
```

> 💡 **通知 vs 请求**：通知没有 `id` 字段，不需要响应

#### 标准错误码

| 错误码 | 含义 | 说明 |
|--------|------|------|
| -32700 | Parse error | JSON解析失败 |
| -32600 | Invalid Request | 请求格式无效 |
| -32601 | Method not found | 方法不存在 |
| -32602 | Invalid params | 参数无效 |
| -32603 | Internal error | 服务器内部错误 |

### 4.3 三大组件详解

#### 1. Tools（工具）

> **这是什么？** Tools是MCP服务器提供的"函数"，AI可以调用它们执行操作。

**工具定义示例**：

```json
{
  "name": "read_file",
  "description": "读取指定路径的文件内容",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "文件的绝对路径"
      }
    },
    "required": ["path"]
  }
}
```

**生活类比**：
- Tools = 工具箱里的工具
- 每个工具有特定用途
- AI选择合适的工具完成任务

#### 2. Resources（资源）

> **这是什么？** Resources是MCP服务器提供的"数据"，AI可以读取它们。

**资源定义示例**：

```json
{
  "uri": "file:///project/README.md",
  "name": "项目说明文档",
  "mimeType": "text/markdown"
}
```

**生活类比**：
- Resources = 参考书架
- 提供只读数据
- AI可以查阅但不能修改

#### 3. Prompts（提示词）

> **这是什么？** Prompts是MCP服务器提供的"模板"，预定义的交互方式。

**提示词定义示例**：

```json
{
  "name": "code_review",
  "description": "代码审查提示词模板",
  "arguments": [
    {
      "name": "code",
      "description": "要审查的代码",
      "required": true
    }
  ]
}
```

**生活类比**：
- Prompts = 填空表格
- 预定义好结构
- AI按模板填写

### 4.4 连接生命周期

```
1. 初始化阶段
   Client → Server: initialize请求（发送客户端能力）
   Server → Client: initialize响应（发送服务器能力）
   Client → Server: initialized通知（确认初始化完成）

2. 操作阶段
   Client → Server: 发送各种请求（tools/call, resources/read等）
   Server → Client: 返回响应或错误
   Server → Client: 可选发送通知（进度更新等）

3. 关闭阶段
   Client/Server: 关闭连接
   Server: 清理资源
```

---

## 第五部分：自定义MCP开发（进阶可选）

> **本节目的**：学会开发自己的MCP服务器
>
> ⏱️ **预计时间**：1.5-2小时
>
> 💡 **前置要求**：熟悉TypeScript/JavaScript基础

### 5.1 开发环境搭建

#### 技术栈选择

| 技术栈 | 适用场景 | 优势 | 劣势 |
|--------|----------|------|------|
| **Node.js + TypeScript** | 通用工具、API集成 | 生态丰富，开发快速 | 性能略低 |
| **Python** | 数据处理、AI模型集成 | 库丰富，语法简洁 | 打包复杂 |

**本教程选择**：Node.js + TypeScript（官方推荐，生态最成熟）

#### 环境要求

**Windows（PowerShell）：**
```powershell
# 检查Node.js版本（需要18+）
node --version
# 预期输出：v18.x.x 或更高

# 检查npm版本
npm --version
# 预期输出：9.x.x 或更高

# 安装TypeScript（如果没有）
npm install -g typescript
tsc --version
# 预期输出：Version 5.x.x
```

**macOS/Linux：**
```bash
# 检查Node.js版本
node --version
# 预期输出：v18.x.x 或更高

# 检查npm版本
npm --version

# 安装TypeScript
npm install -g typescript
tsc --version
```

#### 创建MCP项目

**步骤1：初始化项目**

```bash
# 创建项目目录
mkdir my-first-mcp
cd my-first-mcp

# 初始化npm项目
npm init -y

# 安装MCP SDK
npm install @modelcontextprotocol/sdk

# 安装开发依赖
npm install -D typescript @types/node ts-node
```

**步骤2：配置TypeScript**

创建 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**步骤3：配置package.json**

修改 `package.json`：

```json
{
  "name": "my-first-mcp",
  "version": "1.0.0",
  "type": "module",
  "description": "我的第一个MCP服务器",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "my-first-mcp": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "ts-node --esm src/index.ts",
    "start": "node dist/index.js",
    "watch": "tsc --watch"
  },
  "keywords": ["mcp", "claude", "ai-tools"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.0.0"
  }
}
```

**关键配置说明**：

| 配置项 | 说明 |
|--------|------|
| `"type": "module"` | 启用ES模块支持 |
| `"bin"` | 定义命令行入口（用于 `npx my-first-mcp`） |
| `"build"` | 编译TypeScript到 `dist/` |
| `"dev"` | 开发模式运行 |

**步骤4：创建项目结构**

```bash
# 创建源代码目录
mkdir -p src/tools src/resources src/types
```

项目结构：

```
my-first-mcp/
├── src/
│   ├── index.ts          # 入口文件
│   ├── tools/            # 工具定义
│   │   └── hello.ts
│   ├── resources/        # 资源定义
│   │   └── config.ts
│   └── types/            # 类型定义
│       └── index.ts
├── dist/                 # 编译输出（自动生成）
├── .gitignore
├── package.json
└── tsconfig.json
```

创建 `.gitignore`：

```
node_modules/
dist/
*.log
.DS_Store
.env
```

### 5.2 Hello World MCP

#### 最小可用的MCP服务器

创建 `src/index.ts`：

```typescript
#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// 创建MCP服务器实例
const server = new Server(
  {
    name: "my-first-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 定义工具列表
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "hello_world",
        description: "一个简单的Hello World工具，返回问候语",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "要问候的名字",
            },
          },
          required: ["name"],
        },
      },
    ],
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "hello_world") {
    const userName = args?.name as string || "World";
    return {
      content: [
        {
          type: "text",
          text: `Hello, ${userName}! 这是来自my-first-mcp的问候！`,
        },
      ],
    };
  }

  throw new Error(`未知工具: ${name}`);
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("my-first-mcp 服务器已启动"); // 日志输出到stderr
}

main().catch(console.error);
```

#### 验证开发环境

**测试编译**：

```bash
# 编译TypeScript
npm run build

# 检查dist目录
ls dist/
# 应该看到：index.js  index.d.ts
```

**测试运行**：

```bash
# 直接运行
npm start

# 或使用开发模式
npm run dev

# 预期输出（到stderr）：
# my-first-mcp 服务器已启动
```

> 💡 **说明**：服务器启动后会等待stdin输入，这是正常的。按 `Ctrl+C` 退出。

### 5.3 配置和测试自定义MCP

#### 在Claude Code中使用

**步骤1：在项目中配置**

在你的项目 `.mcp.json` 中添加：

```json
{
  "mcpServers": {
    "my-first-mcp": {
      "command": "node",
      "args": ["/path/to/my-first-mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

> ⚠️ **注意**：替换 `/path/to/my-first-mcp` 为你的实际路径

**步骤2：测试**

```bash
# 启动Claude Code
claude

# 测试
你：用hello_world工具问候"老金"
```

**预期响应**：

```
Claude Code：
[调用 my-first-mcp.hello_world]
参数: {"name": "老金"}

Hello, 老金! 这是来自my-first-mcp的问候！
```

### 5.4 使用MCP Inspector调试

> **这是什么？** MCP Inspector是官方提供的调试工具，可以交互式测试MCP服务器。

**使用方法**：

```bash
# 调试自己的MCP服务器
npx @modelcontextprotocol/inspector node /path/to/my-first-mcp/dist/index.js

# 调试官方服务器
npx @modelcontextprotocol/inspector npx -y @modelcontextprotocol/server-filesystem ./
```

**访问调试界面**：

启动后访问 http://127.0.0.1:6274

**Inspector功能**：
- ✅ 交互式工具测试
- ✅ 请求/响应查看
- ✅ 资源浏览
- ✅ 协议一致性检查

### 5.5 添加更多功能

#### 添加第二个工具

在 `src/index.ts` 的工具列表中添加：

```typescript
// 在 ListToolsRequestSchema 处理器中添加
{
  name: "get_current_time",
  description: "获取当前时间",
  inputSchema: {
    type: "object",
    properties: {
      timezone: {
        type: "string",
        description: "时区（如 'Asia/Shanghai'）",
      },
    },
  },
},
```

在 `CallToolRequestSchema` 处理器中添加：

```typescript
if (name === "get_current_time") {
  const timezone = args?.timezone as string || "Asia/Shanghai";
  const now = new Date().toLocaleString("zh-CN", { timeZone: timezone });
  return {
    content: [
      {
        type: "text",
        text: `当前时间（${timezone}）：${now}`,
      },
    ],
  };
}
```

#### 添加Resources

```typescript
import {
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// 在Server配置中启用resources
const server = new Server(
  { name: "my-first-mcp", version: "1.0.0" },
  {
    capabilities: {
      tools: {},
      resources: {},  // 添加这行
    },
  }
);

// 定义资源列表
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "config://app-settings",
        name: "应用配置",
        mimeType: "application/json",
      },
    ],
  };
});

// 处理资源读取
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === "config://app-settings") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify({ version: "1.0.0", debug: false }, null, 2),
        },
      ],
    };
  }

  throw new Error(`未知资源: ${uri}`);
});
```

### 5.6 发布MCP服务器

#### 发布到npm

**步骤1：确保package.json配置正确**

```json
{
  "name": "@your-username/my-first-mcp",
  "version": "1.0.0",
  "description": "我的第一个MCP服务器",
  "main": "dist/index.js",
  "bin": {
    "my-first-mcp": "dist/index.js"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/my-first-mcp"
  },
  "keywords": ["mcp", "claude", "ai-tools"],
  "license": "MIT"
}
```

**步骤2：登录npm**

```bash
npm login
```

**步骤3：发布**

```bash
# 构建
npm run build

# 发布
npm publish --access public
```

**步骤4：使用已发布的服务器**

```json
{
  "mcpServers": {
    "my-first-mcp": {
      "command": "npx",
      "args": ["-y", "@your-username/my-first-mcp"],
      "env": {}
    }
  }
}
```

---

## 第六部分：故障排查

> **本节目的**：帮助你快速定位和解决MCP配置问题
>
> ⏱️ **预计时间**：按需查阅

### 6.1 常见问题排查流程

```
问题出现
    │
    ▼
1. 检查配置文件 ─── JSON格式错误？→ 修复JSON
    │
    ▼
2. 检查服务器状态 ─── 服务器启动失败？→ 查看日志
    │
    ▼
3. 检查环境变量 ─── API Key缺失？→ 配置环境变量
    │
    ▼
4. 检查网络 ─── 无法下载包？→ 配置镜像/代理
    │
    ▼
5. 检查版本 ─── 版本不兼容？→ 更新Node.js/SDK
```

### 6.2 按错误类型排查

#### 错误1：服务器无法启动

**错误信息示例**：
```
Error: MCP server 'xxx' failed to start
```

**排查步骤**：

```bash
# 1. 检查Node.js版本
node --version
# 需要 v18.x.x 或更高

# 2. 检查npx是否可用
npx --version

# 3. 手动运行服务器命令
npx -y @modelcontextprotocol/server-filesystem ./

# 4. 如果报错，查看具体错误信息
```

**常见原因和解决方案**：

| 原因 | 解决方案 |
|------|----------|
| Node.js版本过低 | 升级到v18+ |
| npx不可用 | 重装npm或使用npm安装 |
| 网络无法访问npm | 配置国内镜像 |
| 包名写错 | 检查包名拼写 |

#### 错误2：配置文件格式错误

**错误信息示例**：
```
SyntaxError: Unexpected token in JSON
```

**排查步骤**：

```bash
# 1. 验证JSON格式
cat .mcp.json | jq .

# 2. 使用在线工具验证
# 访问 https://jsonlint.com/
```

**常见JSON错误**：

| 错误 | 示例 | 修复 |
|------|------|------|
| 缺少逗号 | `"a": 1 "b": 2` | `"a": 1, "b": 2` |
| 多余逗号 | `"a": 1,}` | `"a": 1}` |
| 使用单引号 | `'key': 'value'` | `"key": "value"` |
| 未闭合的引号 | `"key: "value"` | `"key": "value"` |

#### 错误3：环境变量未设置

**错误信息示例**：
```
Error: GITHUB_PERSONAL_ACCESS_TOKEN is required
Error: Missing required environment variable
```

**排查步骤**：

**Windows（PowerShell）：**
```powershell
# 检查环境变量
$env:GITHUB_PERSONAL_ACCESS_TOKEN
# 如果为空，说明未设置

# 设置环境变量
[System.Environment]::SetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN', 'your-token', 'User')

# 重启终端后验证
$env:GITHUB_PERSONAL_ACCESS_TOKEN
```

**macOS/Linux：**
```bash
# 检查环境变量
echo $GITHUB_PERSONAL_ACCESS_TOKEN

# 如果为空，添加到shell配置
echo 'export GITHUB_PERSONAL_ACCESS_TOKEN="your-token"' >> ~/.zshrc
source ~/.zshrc
```

#### 错误4：网络超时

**错误信息示例**：
```
npm ERR! code ETIMEDOUT
npm ERR! network request to https://registry.npmjs.org failed
```

**解决方案**：

```bash
# 方案1：使用国内镜像
npm config set registry https://registry.npmmirror.com

# 方案2：配置代理（如果有代理工具）
npm config set proxy http://127.0.0.1:7890
npm config set https-proxy http://127.0.0.1:7890

# 方案3：增加超时时间
npm config set timeout 60000
```

### 6.3 查看日志

#### Claude Code日志

**macOS：**
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```

**Windows：**
```powershell
Get-Content "$env:LOCALAPPDATA\Claude\logs\mcp*.log" -Wait
```

**Linux：**
```bash
tail -f ~/.local/share/claude/logs/mcp*.log
```

#### 调试模式启动

```bash
# 开启MCP调试日志
claude --mcp-debug
```

### 6.4 重置MCP配置

如果配置混乱，可以重置：

```bash
# 删除项目级配置
rm .mcp.json

# 删除用户级配置（谨慎！）
# macOS/Linux
rm ~/.claude.json

# Windows
del %USERPROFILE%\.claude.json
```

---

## 第七部分：FAQ（20个常见问题）

### 基础问题

#### Q1：MCP和普通API有什么区别？

**A**：MCP是协议标准，API是具体实现。

| 对比 | MCP | 普通API |
|------|-----|---------|
| **定位** | 通用协议标准 | 具体服务接口 |
| **兼容性** | 跨平台、跨AI | 仅特定服务 |
| **学习成本** | 学一次用到处 | 每个API都不同 |
| **类比** | USB标准 | 某品牌的USB设备 |

#### Q2：MCP服务器需要一直运行吗？

**A**：不需要。Claude Code会在需要时自动启动MCP服务器，使用完毕后自动关闭。

#### Q3：配置多个MCP服务器会影响性能吗？

**A**：不会。MCP服务器是按需启动的，只有被调用时才会运行。配置10个服务器但只用1个，不会有额外开销。

#### Q4：MCP服务器的数据安全吗？

**A**：取决于配置。
- ✅ Filesystem MCP只能访问你指定的目录
- ✅ 所有操作都需要你确认
- ⚠️ 但API Key等敏感信息要妥善保管
- ⚠️ 不要把敏感Token写在配置文件里

### 配置问题

#### Q5：.mcp.json放在哪里？

**A**：项目根目录。和`package.json`、`.git`目录同级。

#### Q6：Local、Project、User作用域怎么选？

**A**：
| 情况 | 选择 |
|------|------|
| 包含API Key | Local（不会提交Git） |
| 团队共享 | Project |
| 个人常用 | User |
| 临时测试 | Local |

#### Q7：环境变量 `${VAR}` 语法不生效？

**A**：检查以下几点：
1. 环境变量名正确（区分大小写）
2. 环境变量已导出
3. 终端已重启
4. 使用 `echo $VAR` 验证

#### Q8：可以同时用多个数据库MCP吗？

**A**：可以，用不同名称：

```json
{
  "mcpServers": {
    "sqlite-app": {
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "./app.db"]
    },
    "sqlite-analytics": {
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "./analytics.db"]
    }
  }
}
```

### 故障问题

#### Q9：MCP服务器启动失败怎么办？

**A**：按以下步骤排查：
1. 检查Node.js版本（需要18+）
2. 手动运行npx命令看报错
3. 检查网络是否能访问npm
4. 查看Claude Code日志

#### Q10：为什么Claude Code看不到MCP服务器？

**A**：
1. 确认`.mcp.json`在项目根目录
2. 确认JSON格式正确
3. 确认在项目目录启动Claude Code
4. 退出后重新启动Claude Code

#### Q11：工具调用返回错误怎么办？

**A**：
1. 检查参数是否正确
2. 检查API Key是否有效
3. 查看MCP服务器日志
4. 使用MCP Inspector调试

#### Q12：如何更新MCP服务器？

**A**：npx会自动获取最新版本。如需强制更新：

```bash
# 清除npx缓存
npx clear-npx-cache

# 或删除缓存目录
# macOS/Linux
rm -rf ~/.npm/_npx

# Windows
rd /s /q %LOCALAPPDATA%\npm-cache\_npx
```

### 开发问题

#### Q13：用TypeScript还是Python开发MCP？

**A**：
| 选择 | 适合场景 |
|------|----------|
| TypeScript | 通用工具、API集成、Web相关 |
| Python | 数据处理、AI模型、科学计算 |

官方推荐TypeScript，生态更成熟。

#### Q14：如何调试自己开发的MCP？

**A**：使用MCP Inspector：

```bash
npx @modelcontextprotocol/inspector node ./dist/index.js
```

然后访问 http://127.0.0.1:6274

#### Q15：如何发布MCP到npm？

**A**：
```bash
npm login
npm run build
npm publish --access public
```

### 安全问题

#### Q16：API Key泄露了怎么办？

**A**：
1. 立即删除泄露的Key
2. 创建新Key
3. 更新环境变量
4. 检查使用记录是否异常

#### Q17：如何安全管理API Key？

**A**：
- ✅ 使用环境变量，不硬编码
- ✅ 使用 `${VAR}` 语法引用
- ✅ `.mcp.json` 只放引用，不放值
- ✅ 敏感配置放Local作用域
- ❌ 不要提交包含Key的文件到Git

#### Q18：MCP服务器能访问我的所有文件吗？

**A**：不能。Filesystem MCP只能访问你在配置中指定的目录。

### 其他问题

#### Q19：MCP支持哪些AI工具？

**A**：已支持：
- Claude Desktop
- Claude Code
- VS Code + Continue
- Cursor
- Zed
- 以及更多支持MCP协议的工具

#### Q20：哪里找更多MCP服务器？

**A**：
- 官方仓库：https://github.com/modelcontextprotocol/servers
- Awesome列表：https://github.com/punkpeye/awesome-mcp-servers
- MCP Server Finder：https://www.mcpserverfinder.com/

---

## 总结与检查清单

### 学习成果检查

完成本课后，你应该能够：

- [ ] **理解MCP价值**：能向他人解释MCP是什么、为什么重要
- [ ] **配置基础MCP**：成功配置Filesystem MCP并调用工具
- [ ] **配置GitHub MCP**：正确设置Token并管理仓库
- [ ] **配置数据库MCP**：连接SQLite或PostgreSQL
- [ ] **理解三作用域**：知道Local/Project/User的区别和使用场景
- [ ] **排查常见问题**：能独立解决配置和连接错误
- [ ] **开发简单MCP**：能创建包含Tool的MCP服务器（可选）

### 配置检查清单

在项目中使用MCP前，确认：

- [ ] `.mcp.json` 文件存在且格式正确
- [ ] 所需环境变量已配置
- [ ] API Key安全存储（不在配置文件中硬编码）
- [ ] Claude Code启动时显示MCP服务器已连接
- [ ] 至少测试过一个MCP工具调用

### 推荐下一步

1. **配置更多服务器**：根据你的开发需求，配置Context7、Brave Search等
2. **深入学习**：阅读MCP官方文档了解更多高级特性
3. **开发自定义MCP**：将你的常用工具封装成MCP服务器
4. **参与社区**：在GitHub上分享你开发的MCP服务器

---

## 附录

### 附录A：完整.mcp.json模板

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./src", "./docs"],
      "env": {}
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    },
    "sqlite": {
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "./data/app.db"],
      "env": {}
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {}
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${BRAVE_API_KEY}"
      }
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {}
    },
    "fetch": {
      "command": "uvx",
      "args": ["mcp-server-fetch"],
      "env": {}
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "env": {}
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "env": {}
    }
  }
}
```

### 附录B：MCP命令速查表

| 命令 | 功能 | 示例 | 重要 |
|------|------|------|:----:|
| `claude mcp list` | 列出所有MCP服务器 | `claude mcp list` | ⭐ |
| `claude mcp add` | 添加MCP服务器 | `claude mcp add fs npx -y @.../server-filesystem ./` | ⭐ |
| `claude mcp get` | 查看服务器详情 | `claude mcp get github` |  |
| `claude mcp remove` | 删除服务器 | `claude mcp remove github` |  |
| `claude --mcp-debug` | 调试模式启动 | `claude --mcp-debug` | ⭐ |

> ⚠️ **重要澄清**：`claude mcp test` 和 `claude mcp restart` 命令**不存在**。如需测试服务器，使用 `claude mcp get <name>` 查看状态；如需重启，退出并重新启动Claude Code。

### 附录C：官方MCP服务器列表

| 服务器 | 包名 | 功能 | 重要 |
|--------|------|------|:----:|
| Filesystem | `@modelcontextprotocol/server-filesystem` | 文件系统操作 | ⭐ |
| GitHub | `@modelcontextprotocol/server-github` | GitHub仓库管理 | ⭐ |
| GitLab | `@modelcontextprotocol/server-gitlab` | GitLab仓库管理 |  |
| Git | `mcp-server-git`（Python/uvx） | 本地Git操作 |  |
| SQLite | `mcp-server-sqlite`（Python/uvx） | SQLite数据库 | ⭐ |
| PostgreSQL | `@modelcontextprotocol/server-postgres` | PostgreSQL数据库 |  |
| Memory | `@modelcontextprotocol/server-memory` | 持久化记忆 |  |
| Fetch | `mcp-server-fetch`（Python/uvx） | 网页获取 |  |
| Time | `mcp-server-time`（Python/uvx） | 时间服务 |  |
| Sequential Thinking | `@modelcontextprotocol/server-sequential-thinking` | 顺序思考 |  |
| Puppeteer | `@modelcontextprotocol/server-puppeteer` | 浏览器自动化 |  |
| Brave Search | `@modelcontextprotocol/server-brave-search` | 网页搜索 | ⭐ |
| Context7 | `@upstash/context7-mcp` | 技术文档 | ⭐ |

### 附录D：资源链接

**官方资源**：
- MCP官方文档：https://modelcontextprotocol.io/
- MCP规范：https://modelcontextprotocol.io/specification/2025-11-25
- Claude Code MCP文档：https://code.claude.com/docs/en/mcp
- 官方服务器仓库：https://github.com/modelcontextprotocol/servers
- TypeScript SDK：https://github.com/modelcontextprotocol/typescript-sdk
- Python SDK：https://github.com/modelcontextprotocol/python-sdk

**社区资源**：
- Awesome MCP Servers：https://github.com/punkpeye/awesome-mcp-servers
- MCP Server Finder：https://www.mcpserverfinder.com/
- MCP中文站：https://mcpcn.com/

---

> 📌 **信息来源**：
> - [MCP官方文档](https://modelcontextprotocol.io/) | 验证日期：2026-02-25
> - [GitHub MCP Server仓库](https://github.com/modelcontextprotocol/servers) | 验证日期：2026-02-25
> - [Claude Code文档](https://code.claude.com/docs/en/mcp) | 验证日期：2026-02-25

**作者**：老金
**更新日期**：2026年2月25日
**版本**：V1.1（Critical Thinking审查修正版）
**字数统计**：约3,500行 / 28,000字
**适用版本**：MCP规范 2025-11-25 / Claude Code v2.1+

---

### 版本更新日志

#### V1.1 修正内容（2025-12-23）

| 修正项 | 问题 | 修正后 |
|--------|------|--------|
| CLI命令表 | `claude mcp test` 命令不存在 | 移除并添加澄清说明 |
| CLI命令表 | `claude mcp restart` 命令不存在 | 移除并添加澄清说明 |
| 包名拼写 | `server-sequentialthinking` 缺少连字符 | 修正为 `server-sequential-thinking` |

> 💡 **审查方法**：基于官方Claude Code文档验证技术准确性，确保代码示例可直接运行。
