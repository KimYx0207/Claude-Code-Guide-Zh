# 附录D：权限系统与Memory深度配置

**课程模块**：附录
**课程编号**：附录D
**预计学时**：5小时
**难度等级**：⭐⭐⭐⭐ 进阶

---

## 学习目标

通过本课学习，你将能够：

1. 全面理解Claude Code的三级权限系统（allow/ask/deny）
2. 熟练配置settings.json实现精细化权限控制
3. 掌握CLAUDE.md多层级配置与@import导入机制
4. 运用Memory系统实现跨会话知识持久化
5. 应用上下文工程技巧优化长对话效率
6. 设计企业级安全配置方案

---

## 第一部分：权限系统（4,000字）

### 1.1 权限系统概述

Claude Code的权限系统是其安全架构的核心。它决定了AI能够执行哪些操作，需要确认哪些操作，以及完全禁止哪些操作。

#### 三级权限模型

```
┌─────────────────────────────────────────────────────────┐
│                    Claude Code权限系统                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐             │
│  │  ALLOW  │    │   ASK   │    │  DENY   │             │
│  │         │    │         │    │         │             │
│  │ 自动执行 │    │ 询问确认 │    │ 完全禁止 │             │
│  │         │    │         │    │         │             │
│  │ 最高信任 │    │ 中等信任 │    │ 零信任   │             │
│  └─────────┘    └─────────┘    └─────────┘             │
│       │              │              │                   │
│       ▼              ▼              ▼                   │
│  无需确认直接   每次执行前      无论如何都               │
│  执行该工具     请求用户确认    不允许执行               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 权限级别详解

| 权限级别 | 行为 | 适用场景 | 风险等级 |
|---------|------|---------|---------|
| **allow** | 自动执行，无需确认 | 只读操作、安全的文件修改 | 低 |
| **ask** | 每次执行前询问用户 | 文件写入、命令执行 | 中 |
| **deny** | 完全禁止执行 | 危险操作、敏感文件访问 | 高 |

### 1.2 settings.json配置详解

`settings.json`是Claude Code权限配置的核心文件，支持多个位置和优先级。

#### 配置文件位置

```
优先级从高到低：

1. 企业托管策略（最高优先级）
   - macOS: /Library/Application Support/ClaudeCode/managed-settings.json
   - Linux/WSL: /etc/claude-code/managed-settings.json

2. 项目本地配置
   - .claude/settings.local.json（gitignore）

3. 项目共享配置
   - .claude/settings.json（提交到git）

4. 用户全局配置（最低优先级）
   - ~/.claude/settings.json
```

#### 完整配置结构

```json
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(npm run *)"
    ],
    "ask": [
      "Write",
      "Edit",
      "Bash(git commit *)",
      "Bash(git push *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Read(.env*)",
      "Write(.env*)",
      "Read(**/secrets/**)",
      "Write(**/credentials/**)"
    ]
  },
  "allowedTools": [
    "Read",
    "Write",
    "Edit",
    "Glob",
    "Grep",
    "Bash(git *)",
    "Bash(npm *)",
    "Bash(node *)"
  ],
  "env": {
    "NODE_ENV": "development",
    "DEBUG": "true"
  },
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "./data"],
      "trust": true
    }
  }
}
```

### 1.3 权限规则语法

#### 工具匹配模式

Claude Code支持灵活的工具匹配模式：

```json
{
  "permissions": {
    "allow": [
      "Read",                    // 匹配所有Read操作
      "Bash(git *)",             // 匹配所有git命令
      "Bash(npm run test)",      // 精确匹配特定命令
      "Write(src/**/*.ts)",      // 匹配特定路径模式
      "Edit(*.md)"               // 匹配特定文件类型
    ]
  }
}
```

#### 模式语法说明

| 模式 | 说明 | 示例 |
|------|------|------|
| `ToolName` | 匹配所有该工具的操作 | `Read` |
| `ToolName(pattern)` | 匹配带特定参数的操作 | `Bash(git *)` |
| `*` | 单级通配符 | `Bash(npm run *)` |
| `**` | 多级通配符 | `Write(src/**/*.ts)` |
| `?` | 单字符通配符 | `Read(config?.json)` |

#### 路径模式详解

```json
{
  "permissions": {
    "deny": [
      // 精确文件匹配
      "Read(.env)",
      "Read(.env.local)",

      // 通配符匹配
      "Read(.env*)",              // .env, .env.local, .env.production
      "Write(*.secret)",          // 任何.secret文件

      // 目录匹配
      "Read(secrets/*)",          // secrets目录下的直接子文件
      "Read(secrets/**)",         // secrets目录下的所有文件（递归）

      // 组合模式
      "Write(**/node_modules/**)", // 任何位置的node_modules
      "Edit(**/*.min.js)"          // 任何位置的压缩JS文件
    ]
  }
}
```

### 1.4 权限优先级规则

当多个规则可能匹配同一操作时，Claude Code按以下优先级处理：

#### 优先级顺序

```
deny > ask > allow > 默认行为

具体规则：
1. deny规则最高优先级 - 一旦匹配deny，操作被拒绝
2. 更具体的规则优先于通用规则
3. 项目配置优先于用户配置
4. 本地配置优先于共享配置
```

#### 优先级示例

```json
// 用户全局配置 (~/.claude/settings.json)
{
  "permissions": {
    "allow": ["Bash(npm *)"]  // 允许所有npm命令
  }
}

// 项目配置 (.claude/settings.json)
{
  "permissions": {
    "ask": ["Bash(npm publish *)"]  // npm publish需要确认
  }
}

// 项目本地配置 (.claude/settings.local.json)
{
  "permissions": {
    "deny": ["Bash(npm publish --tag latest)"]  // 禁止发布到latest
  }
}

// 最终效果：
// npm install     → allow（用户配置）
// npm run test    → allow（用户配置）
// npm publish     → ask（项目配置覆盖用户配置）
// npm publish --tag latest → deny（本地配置最高优先级）
```

### 1.5 allowedTools白名单

`allowedTools`是另一层安全控制，定义Claude可以使用的工具范围。

#### 白名单与权限的关系

```
┌─────────────────────────────────────────────────────────┐
│                     工具执行流程                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Claude请求使用工具                                       │
│          │                                              │
│          ▼                                              │
│  ┌───────────────┐                                      │
│  │ allowedTools  │  工具在白名单中？                      │
│  │   白名单检查   │────────────────────┐                 │
│  └───────────────┘                    │                 │
│          │                            │                 │
│          │ 是                          │ 否              │
│          ▼                            ▼                 │
│  ┌───────────────┐              ┌───────────┐          │
│  │  permissions  │              │   拒绝    │          │
│  │   权限检查     │              │   执行    │          │
│  └───────────────┘              └───────────┘          │
│          │                                              │
│    ┌─────┼─────┐                                       │
│    │     │     │                                       │
│    ▼     ▼     ▼                                       │
│  allow  ask  deny                                       │
│    │     │     │                                       │
│    ▼     ▼     ▼                                       │
│  执行  询问用户 拒绝                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 白名单配置示例

```json
{
  "allowedTools": [
    // 文件操作
    "Read",
    "Write",
    "Edit",
    "Glob",
    "Grep",

    // 版本控制
    "Bash(git *)",

    // 包管理
    "Bash(npm *)",
    "Bash(yarn *)",
    "Bash(pnpm *)",

    // 开发工具
    "Bash(node *)",
    "Bash(python *)",
    "Bash(tsc *)",

    // MCP工具
    "mcp__filesystem__*",
    "mcp__database__query"
  ]
}
```

### 1.6 MCP服务器信任配置

MCP服务器可以配置信任级别，影响其工具的权限处理：

```json
{
  "mcpServers": {
    // 受信任的MCP服务器
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "./data"],
      "trust": true,  // 信任此服务器的所有工具
      "allowedTools": ["read", "write", "list"]  // 可选：限制允许的工具
    },

    // 不受信任的MCP服务器
    "thirdparty": {
      "command": "npx",
      "args": ["-y", "some-third-party-mcp"],
      "trust": false,  // 每次调用都需要确认
      "env": {
        "API_KEY": "${THIRD_PARTY_API_KEY}"  // 环境变量引用
      }
    },

    // 部分信任的MCP服务器
    "database": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-sqlite", "./app.db"],
      "trust": true,
      "allowedTools": ["query"],  // 只信任查询操作
      "deniedTools": ["execute", "drop"]  // 明确禁止危险操作
    }
  }
}
```

### 1.7 动态权限管理

#### 使用/permissions命令

在交互模式中，可以使用`/permissions`命令动态管理权限：

```bash
# 查看当前权限配置
> /permissions

Current Permissions:
===================
Allow:
  - Read
  - Glob
  - Grep

Ask:
  - Write
  - Edit

Deny:
  - Bash(rm -rf *)

# 添加新的允许规则
> /permissions allow Bash(npm test)
Added to allow: Bash(npm test)

# 添加新的拒绝规则
> /permissions deny Write(.env*)
Added to deny: Write(.env*)
```

#### 使用/allowed-tools命令

```bash
# 查看允许的工具列表
> /allowed-tools

Allowed Tools:
=============
- Read
- Write
- Edit
- Glob
- Grep
- Bash(git *)
- Bash(npm *)

# 添加新工具到白名单
> /allowed-tools add Bash(docker *)
Added: Bash(docker *)

# 移除工具
> /allowed-tools remove Bash(docker *)
Removed: Bash(docker *)
```

### 1.8 安全配置最佳实践

#### 开发环境配置

```json
// .claude/settings.json - 开发环境
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(npm run dev)",
      "Bash(npm run test)"
    ],
    "ask": [
      "Write",
      "Edit",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(npm install *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Read(.env.production)",
      "Write(.env.production)",
      "Bash(git push * main)",
      "Bash(npm publish *)"
    ]
  }
}
```

#### 生产环境配置

```json
// .claude/settings.json - 生产环境（更严格）
{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep"
    ],
    "ask": [
      "Bash(git status)",
      "Bash(git log *)"
    ],
    "deny": [
      "Write",
      "Edit",
      "Bash(rm *)",
      "Bash(mv *)",
      "Bash(cp *)",
      "Bash(git *)",
      "Bash(npm *)",
      "Bash(yarn *)",
      "Read(.env*)",
      "Read(**/secrets/**)",
      "Read(**/credentials/**)"
    ]
  }
}
```

---

## 第二部分：CLAUDE.md层级系统（3,000字）

### 2.1 CLAUDE.md概述

CLAUDE.md是Claude Code的"记忆文件"，包含项目指令、编码规范和上下文信息。Claude在启动时自动加载这些文件。

#### 核心特点

| 特点 | 说明 |
|------|------|
| **自动加载** | 启动时自动读取到上下文 |
| **多层级** | 支持用户级、项目级、模块级 |
| **可导入** | 支持@import语法引入其他文件 |
| **条件化** | 支持基于文件路径的条件规则 |

### 2.2 层级结构

```
┌─────────────────────────────────────────────────────────┐
│                  CLAUDE.md层级结构                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  用户级（最低优先级，所有项目通用）                        │
│  ~/.claude/CLAUDE.md                                    │
│      │                                                  │
│      │ 被项目级覆盖                                      │
│      ▼                                                  │
│  项目级（项目共享配置）                                   │
│  ./CLAUDE.md 或 ./.claude/CLAUDE.md                     │
│      │                                                  │
│      │ 可以导入模块级                                    │
│      ▼                                                  │
│  模块级（特定目录的规则）                                 │
│  ./.claude/rules/*.md                                   │
│  ./src/api/CLAUDE.md                                    │
│      │                                                  │
│      │ 被本地配置覆盖                                    │
│      ▼                                                  │
│  本地级（最高优先级，不提交git）                          │
│  ./CLAUDE.local.md                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.3 用户级CLAUDE.md

用户级配置影响该用户的所有Claude Code会话。

#### 文件位置

```
~/.claude/CLAUDE.md
```

#### 典型内容

```markdown
# 全局开发规范

## 个人偏好

- 优先使用TypeScript而非JavaScript
- 代码注释使用中文
- 提交信息使用英文

## 通用编码规范

### 命名规范
- 变量和函数：camelCase
- 类和接口：PascalCase
- 常量：UPPER_SNAKE_CASE

### 代码风格
- 使用2空格缩进
- 字符串优先使用单引号
- 语句末尾加分号

## 安全提醒

- 绝不在代码中硬编码密钥
- 敏感信息使用环境变量
- 提交前检查是否包含敏感信息
```

### 2.4 项目级CLAUDE.md

项目级配置是团队共享的项目规范，通常提交到Git。

#### 文件位置

```
./CLAUDE.md           # 项目根目录
./.claude/CLAUDE.md   # .claude目录内
```

#### 典型结构

```markdown
# 项目名称 - Claude Code配置

## 项目概述

这是一个Node.js后端项目，使用Express框架，TypeScript语言。

## 技术栈

- Node.js 20.x
- TypeScript 5.x
- Express 4.x
- PostgreSQL 15
- Redis 7

## 目录结构

```
src/
├── api/          # API路由
├── models/       # 数据模型
├── services/     # 业务逻辑
├── utils/        # 工具函数
└── types/        # 类型定义
```

## 编码规范

### API开发

- 使用RESTful风格
- 响应格式统一为：`{ data, error, meta }`
- 错误码定义在`src/constants/errors.ts`

### 数据库操作

- 使用事务处理关键操作
- 查询必须有超时限制
- 禁止在循环中执行数据库查询

## 测试要求

- 新功能必须有单元测试
- API需要有集成测试
- 测试覆盖率不低于80%

## 部署说明

- 开发环境：`npm run dev`
- 构建：`npm run build`
- 测试：`npm run test`
```

### 2.5 @import语法

`@import`允许CLAUDE.md引入其他Markdown文件，实现模块化配置。

#### 基本语法

```markdown
# 项目配置

@api-guidelines.md
@database-rules.md
@testing-standards.md
```

#### 路径规则

```markdown
# 相对路径导入
@./docs/coding-standards.md
@../shared/common-rules.md

# 绝对路径导入（从项目根目录）
@/docs/api-guidelines.md

# 用户目录导入
@~/my-templates/react-rules.md
```

#### 导入深度限制

```
最大导入深度：5层

CLAUDE.md
└── @level1.md
    └── @level2.md
        └── @level3.md
            └── @level4.md
                └── @level5.md
                    └── @level6.md  ← 不会被加载
```

### 2.6 条件导入

通过YAML前置元数据，可以实现条件化的规则应用。

#### 基于路径的条件规则

```markdown
---
paths: src/api/**/*.ts
---

# API开发规则

这些规则只在处理`src/api/`目录下的TypeScript文件时生效。

## 必须遵循

- 所有API端点必须有输入验证
- 必须返回标准响应格式
- 必须记录操作日志
```

#### 多路径条件

```markdown
---
paths:
  - src/api/**/*.ts
  - src/routes/**/*.ts
  - src/controllers/**/*.ts
---

# 路由和控制器规范

这些规则适用于所有路由相关代码。
```

#### 条件导入示例

```markdown
# 主CLAUDE.md

## 通用规则

所有代码都必须遵循以下规则...

## 模块特定规则

@.claude/rules/api-rules.md
@.claude/rules/model-rules.md
@.claude/rules/test-rules.md
```

对应的条件规则文件：

```markdown
<!-- .claude/rules/api-rules.md -->
---
paths: src/api/**/*
---

# API特定规则

...
```

```markdown
<!-- .claude/rules/model-rules.md -->
---
paths: src/models/**/*
---

# 数据模型规则

...
```

### 2.7 合并规则

当多个CLAUDE.md文件存在时，它们按以下规则合并：

#### 合并优先级

```
本地配置 > 项目配置 > @import内容 > 用户配置

具体规则：
1. 后加载的内容可以覆盖先加载的内容
2. 更具体的规则（条件规则）优先于通用规则
3. 明确的声明优先于默认行为
```

#### 合并示例

```markdown
<!-- ~/.claude/CLAUDE.md（用户级）-->
# 全局规范
使用2空格缩进。
提交信息使用英文。
```

```markdown
<!-- ./CLAUDE.md（项目级）-->
# 项目规范
使用4空格缩进。（覆盖用户配置）
代码注释使用中文。

@.claude/rules/special.md
```

```markdown
<!-- .claude/rules/special.md -->
---
paths: src/legacy/**/*
---
# 遗留代码规范
保持原有缩进风格。（条件性覆盖项目配置）
```

最终效果：
- 通常情况：4空格缩进（项目配置）
- src/legacy/目录：保持原有缩进（条件规则）
- 提交信息：英文（用户配置，项目未覆盖）
- 代码注释：中文（项目配置添加）

### 2.8 CLAUDE.md最佳实践

#### 保持简洁

```markdown
# 好的实践：简洁明了

## 编码规范
- TypeScript优先
- 2空格缩进
- 单引号字符串

## 命名约定
- 文件名：kebab-case
- 组件名：PascalCase
- 函数名：camelCase
```

#### 使用模块化

```markdown
# 主CLAUDE.md - 只包含核心规则

## 项目概述
简短的项目介绍...

## 核心规范
@.claude/rules/coding-standards.md

## API规范
@.claude/rules/api-guidelines.md

## 测试规范
@.claude/rules/testing-rules.md
```

#### 区分共享和本地

```markdown
<!-- CLAUDE.md - 团队共享，提交到git -->
# 团队规范
...

<!-- CLAUDE.local.md - 个人配置，gitignore -->
# 我的个人偏好
- 使用Vim键位
- 调试时显示详细日志
```

---

## 第三部分：Memory管理（2,500字）

### 3.1 Memory系统概述

Claude Code的Memory系统允许在会话之间持久化信息，避免每次都重新解释上下文。

#### Memory vs CLAUDE.md

| 特性 | Memory | CLAUDE.md |
|------|--------|-----------|
| **存储位置** | ~/.claude/memory/ | 项目目录 |
| **持久性** | 跨项目持久 | 项目级持久 |
| **内容类型** | 动态学习 | 静态规则 |
| **修改方式** | /memory命令 | 直接编辑文件 |
| **适用场景** | 偏好、经验 | 项目规范、约束 |

### 3.2 /memory命令

#### 查看当前Memory

```bash
> /memory

Current Memory:
==============

[User Preferences]
- 喜欢详细的代码注释
- 偏好函数式编程风格
- 测试框架首选Jest

[Learned Patterns]
- 项目使用pnpm而非npm
- 数据库连接使用连接池
- API响应需要压缩

[Session Notes]
- 正在重构认证模块
- 下一步：优化数据库查询
```

#### 添加Memory

```bash
> /memory add "TypeScript中优先使用interface而非type"
Memory added.

> /memory add "团队使用GitFlow分支策略"
Memory added.
```

#### 编辑Memory

```bash
> /memory edit

# 这会打开系统编辑器，让你编辑完整的memory文件
```

#### 清除Memory

```bash
> /memory clear

Warning: This will clear all memories.
Continue? (y/n): y

All memories cleared.
```

### 3.3 Memory存储结构

Memory文件存储在用户目录下：

```
~/.claude/
├── memory/
│   ├── user-preferences.md     # 用户偏好
│   ├── learned-patterns.md     # 学习到的模式
│   └── session-notes.md        # 会话笔记
└── memory-index.json           # Memory索引
```

#### Memory文件示例

```markdown
<!-- ~/.claude/memory/user-preferences.md -->
# 用户偏好

## 编码风格
- 使用TypeScript
- 函数式编程优先
- 避免类继承，使用组合

## 工具偏好
- 测试框架：Jest
- 包管理：pnpm
- 构建工具：Vite

## 沟通偏好
- 回答简洁直接
- 代码示例要完整
- 解释原理而非只给答案
```

### 3.4 跨会话记忆

Claude Code支持会话恢复，保持上下文连续性：

#### 继续最近会话

```bash
# 继续最近的会话
claude -c
# 或
claude --continue

# 输出
Continuing session: abc123
Last activity: 2 hours ago
Context: Working on authentication module refactoring
```

#### 恢复特定会话

```bash
# 列出可用会话
claude --list-sessions

Available Sessions:
==================
1. abc123 - Authentication refactoring (2 hours ago)
2. def456 - API optimization (1 day ago)
3. ghi789 - Bug fix sprint (3 days ago)

# 恢复特定会话
claude -r abc123
# 或
claude --resume abc123
```

### 3.5 会话管理命令

```bash
# 在交互模式中

# 保存当前会话
> /save my-feature-work
Session saved: my-feature-work

# 查看会话列表
> /sessions

Sessions:
=========
1. my-feature-work (Just now)
2. bug-fix-session (Yesterday)
3. code-review (3 days ago)

# 切换会话（会保存当前会话）
> /switch bug-fix-session
Switching to: bug-fix-session
Current session saved.
```

### 3.6 Memory清理策略

#### 自动清理

Claude Code会自动管理Memory大小：

```
Memory大小限制：
- 单个Memory文件：50KB
- 总Memory目录：500KB

自动清理规则：
- 超过30天未访问的Memory条目
- 重复或冗余的信息
- 已过时的项目相关信息
```

#### 手动清理

```bash
# 清理特定类型的Memory
> /memory clear preferences
User preferences cleared.

# 清理会话相关Memory
> /memory clear sessions
Session notes cleared.

# 查看Memory使用情况
> /memory stats

Memory Statistics:
=================
User Preferences: 12KB
Learned Patterns: 8KB
Session Notes: 3KB
Total: 23KB / 500KB (4.6%)
```

---

## 第四部分：上下文工程（2,000字）

### 4.1 Context Rot问题

Context Rot（上下文腐烂）是指随着对话进行，上下文窗口逐渐被不相关信息填满，导致性能下降和回答质量降低。

#### Context Rot的症状

| 症状 | 表现 | 原因 |
|------|------|------|
| 响应变慢 | 回复时间明显增加 | 上下文过大，处理时间长 |
| 遗忘早期内容 | 忘记对话开始的约定 | 早期信息被挤出有效窗口 |
| 重复相同错误 | 反复犯同样的问题 | 纠正信息优先级不够 |
| 回答不一致 | 前后回答矛盾 | 上下文信息混乱 |

#### 上下文使用监控

```bash
# 查看上下文使用情况
> /context

Context Usage:
=============
Total tokens: 145,000 / 200,000 (72.5%)

Breakdown:
- System prompt: 5,000 (2.5%)
- CLAUDE.md: 8,000 (4%)
- Conversation: 132,000 (66%)

Warning: Context usage above 70%
Consider using /compact or /clear
```

### 4.2 /compact压缩命令

`/compact`命令智能压缩对话历史，保留关键信息。

#### 基本使用

```bash
> /compact

Compacting conversation...

Before: 145,000 tokens
After: 52,000 tokens
Saved: 93,000 tokens (64%)

Key information retained:
- Project context
- Current task status
- Important decisions made
- Pending action items
```

#### 压缩策略

```
/compact 保留的内容：
✓ CLAUDE.md配置（完整保留）
✓ 当前任务描述
✓ 关键决策和结论
✓ 未完成的行动项
✓ 重要的代码片段
✓ 错误和解决方案

/compact 移除的内容：
✗ 中间的探索性对话
✗ 重复的内容
✗ 已解决问题的详细讨论
✗ 冗长的代码输出
✗ 工具调用的详细日志
```

### 4.3 /clear清理时机

#### 何时使用/clear

| 场景 | 建议操作 |
|------|---------|
| 任务完成，开始新任务 | `/clear` |
| 上下文超过80% | 先`/compact`，无效再`/clear` |
| 对话方向完全改变 | `/clear` |
| 响应质量明显下降 | 先`/compact`，无效再`/clear` |

#### /clear vs /compact

```bash
# /clear - 完全清空
> /clear
Conversation cleared.
CLAUDE.md retained.
Memory retained.

# /compact - 智能压缩
> /compact
Conversation compacted.
Key context retained.
```

### 4.4 大型代码库策略

处理大型代码库时，需要特殊的上下文管理策略。

#### 渐进式加载

```markdown
# CLAUDE.md中的渐进式加载指令

## 代码库导航策略

1. 首先只加载目录结构
2. 根据任务需要加载相关模块
3. 避免一次性加载整个代码库

## 关键文件索引

核心入口：
- src/index.ts
- src/app.ts

配置文件：
- package.json
- tsconfig.json
- .env.example

架构文档：
- docs/architecture.md
- docs/api-design.md
```

#### 模块化上下文

```bash
# 按模块工作，减少上下文负担

# 模块A的工作
> Please focus only on src/api/ directory
> ...完成API相关工作...

# 清理后切换到模块B
> /clear
> Now focus on src/models/ directory
> ...完成Model相关工作...
```

#### 使用子代理分担

```bash
> Please use subagents to analyze different parts:
> - Subagent 1: analyze src/api/
> - Subagent 2: analyze src/models/
> - Subagent 3: analyze src/services/
>
> Each subagent has its own 200K context window.
> Summarize findings in main context.
```

### 4.5 上下文优化技巧

#### 精确提问

```markdown
# 不好的提问（上下文浪费）
"这个项目怎么样？有什么问题吗？"

# 好的提问（上下文高效）
"请检查src/api/auth.ts中的login函数，
是否存在SQL注入风险？"
```

#### 及时清理

```markdown
# 任务完成后立即清理
> Task completed. Let me clear the context for the next task.
> /clear

# 而不是带着旧上下文继续
> Now let's do something completely different...
（❌ 旧上下文会干扰新任务）
```

#### 使用检查点

```bash
# 在关键节点创建检查点
> /checkpoint before-refactor
Checkpoint created: before-refactor

# 如果出问题，可以回滚
> /rollback before-refactor
Rolled back to: before-refactor
```

---

## 第五部分：企业配置示例（500字）

### 5.1 企业托管策略配置

企业可以部署托管策略，强制所有用户遵守：

```json
// /Library/Application Support/ClaudeCode/managed-settings.json (macOS)
// /etc/claude-code/managed-settings.json (Linux)

{
  "permissions": {
    "deny": [
      // 禁止访问敏感文件
      "Read(.env*)",
      "Read(**/secrets/**)",
      "Read(**/credentials/**)",
      "Read(**/*.pem)",
      "Read(**/*.key)",

      // 禁止危险操作
      "Bash(rm -rf *)",
      "Bash(sudo *)",
      "Bash(chmod 777 *)",

      // 禁止直接生产操作
      "Bash(git push * main)",
      "Bash(git push * master)",
      "Bash(npm publish *)",
      "Bash(docker push *)"
    ],
    "ask": [
      // 所有写操作需要确认
      "Write",
      "Edit",

      // Git操作需要确认
      "Bash(git commit *)",
      "Bash(git merge *)"
    ]
  },

  // 强制审计日志
  "auditLog": {
    "enabled": true,
    "path": "/var/log/claude-code/audit.log",
    "includeContent": false
  },

  // 网络限制
  "network": {
    "allowedDomains": [
      "github.com",
      "npmjs.org",
      "pypi.org"
    ],
    "blockedDomains": [
      "*.xxx.com"
    ]
  }
}
```

### 5.2 团队项目配置模板

```json
// .claude/settings.json - 团队共享配置

{
  "permissions": {
    "allow": [
      "Read",
      "Glob",
      "Grep",
      "Bash(npm run lint)",
      "Bash(npm run test)",
      "Bash(git status)",
      "Bash(git diff *)"
    ],
    "ask": [
      "Write",
      "Edit",
      "Bash(npm install *)",
      "Bash(git add *)",
      "Bash(git commit *)"
    ],
    "deny": [
      "Bash(npm publish *)",
      "Bash(git push * main)",
      "Read(.env.production)"
    ]
  },

  "mcpServers": {
    "documentation": {
      "command": "npx",
      "args": ["-y", "@company/mcp-docs"],
      "trust": true
    }
  }
}
```

### 5.3 安全检查清单

```markdown
# Claude Code企业部署检查清单

## 权限配置
- [ ] 托管策略已部署到所有机器
- [ ] 敏感文件访问已禁止
- [ ] 危险命令已禁止
- [ ] 生产环境操作需要确认

## 审计日志
- [ ] 审计日志已启用
- [ ] 日志不包含敏感内容
- [ ] 日志定期备份和审查

## 网络安全
- [ ] 允许域名白名单已配置
- [ ] 内部资源访问已限制
- [ ] MCP服务器已审核

## 团队规范
- [ ] CLAUDE.md模板已创建
- [ ] 团队settings.json已配置
- [ ] 员工培训已完成
```

---

## 本课总结

### 核心知识点

1. **三级权限**：allow（自动执行）、ask（确认执行）、deny（禁止执行）
2. **配置优先级**：企业托管 > 本地 > 项目 > 用户
3. **CLAUDE.md层级**：用户级 → 项目级 → 模块级 → 本地级
4. **@import语法**：模块化配置管理
5. **Memory系统**：跨会话知识持久化
6. **上下文工程**：/compact、/clear、检查点

### 配置决策指南

```
需要团队共享？
├── 是 → .claude/settings.json + CLAUDE.md
└── 否 → .claude/settings.local.json + CLAUDE.local.md

需要强制执行？
├── 是 → 企业托管策略
└── 否 → 项目配置

频繁修改？
├── 是 → 分离到独立文件，使用@import
└── 否 → 直接写在主CLAUDE.md
```

### 下一步学习

完成本课后，建议继续学习：

1. **模块9《Agent SDK入门》** - 将配置应用到程序化代理
2. **模块5《Hooks系统》** - 自动化权限检查和审计
3. **模块8《企业级最佳实践》** - 更多企业部署案例

---

**课程版本**：V1.0
**最后更新**：2025-12-11
**上一课**：模块9《Agent SDK入门》
