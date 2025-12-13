# Claude Code 插件系统完整参考

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 高级教程
**标签**: #Claude Code #插件开发 #插件系统 #技术参考

---

Claude Code 插件系统的完整技术参考，包括架构、CLI 命令和组件规范。

本参考提供了 Claude Code 插件系统的完整技术规范，包括组件架构、CLI 命令和开发工具。

### 插件组件参考

本节记录了插件可以提供的五种类型的组件。

#### 命令

插件添加自定义斜杠命令，与 Claude Code 的命令系统无缝集成。

位置：插件根目录中的 commands/ 目录

文件格式：带有前言的 Markdown 文件

有关插件命令的详细使用方法，请参考斜杠命令相关的配置文档。

#### 代理

插件可以为特定任务提供专门的子代理，Claude 可以在适当时自动调用。

位置：插件根目录中的 agents/ 目录

文件格式：描述代理功能的 Markdown 文件

```bash
---
description: 此代理专门处理的内容
capabilities: ["task1", "task2", "task3"]
---

# 代理名称

代理角色、专业知识以及 Claude 何时应调用它的详细描述。

## 功能
- 代理擅长的特定任务
- 另一个专门功能
- 何时使用此代理而非其他代理

## 上下文和示例
提供何时应使用此代理以及它解决什么类型问题的示例。
```

- 代理出现在 /agents 界面中
- Claude 可以根据任务上下文自动调用代理
- 用户可以手动调用代理
- 插件代理与内置 Claude 代理协同工作

#### 技能

插件可以提供扩展 Claude 功能的代理技能。技能是模型调用的——Claude 根据任务上下文自主决定何时使用它们。

位置：插件根目录中的 skills/ 目录

文件格式：包含带有前言的 SKILL.md 文件的目录

```bash
skills/
├── pdf-processor/
│   ├── SKILL.md
│   ├── reference.md (可选)
│   └── scripts/ (可选)
└── code-reviewer/
    └── SKILL.md
```

- 安装插件时会自动发现插件技能
- Claude 根据匹配的任务上下文自主调用技能
- 技能可以包含 SKILL.md 旁边的支持文件

有关技能编写的详细格式和指导，请参考项目中关于技能使用的相关文档。

#### 钩子

插件可以提供自动响应 Claude Code 事件的事件处理程序。

位置：插件根目录中的 hooks/hooks.json，或在 plugin.json 中内联

格式：带有事件匹配器和操作的 JSON 配置

```bash
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format-code.sh"
          }
        ]
      }
    ]
  }
}
```

- PreToolUse：在 Claude 使用任何工具之前
- PostToolUse：在 Claude 使用任何工具之后
- UserPromptSubmit：当用户提交提示时
- Notification：当 Claude Code 发送通知时
- Stop：当 Claude 尝试停止时
- SubagentStop：当子代理尝试停止时
- SessionStart：在会话开始时
- SessionEnd：在会话结束时
- PreCompact：在对话历史被压缩之前

- command：执行 shell 命令或脚本
- validation：验证文件内容或项目状态
- notification：发送警报或状态更新

#### MCP 服务器

插件可以捆绑模型上下文协议 (MCP) 服务器，将 Claude Code 与外部工具和服务连接。

位置：插件根目录中的 .mcp.json，或在 plugin.json 中内联

格式：标准 MCP 服务器配置

MCP 服务器配置：

```bash
{
  "mcpServers": {
    "plugin-database": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
      "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
      "env": {
        "DB_PATH": "${CLAUDE_PLUGIN_ROOT}/data"
      }
    },
    "plugin-api-client": {
      "command": "npx",
      "args": ["@company/mcp-server", "--plugin-mode"],
      "cwd": "${CLAUDE_PLUGIN_ROOT}"
    }
  }
}
```

- 启用插件时，插件 MCP 服务器会自动启动
- 服务器在 Claude 的工具包中显示为标准 MCP 工具
- 服务器功能与 Claude 现有工具无缝集成
- 插件服务器可以独立于用户 MCP 服务器进行配置

### 插件清单架构

plugin.json 文件定义了您插件的元数据和配置。本节记录了所有支持的字段和选项。

#### 完整架构

```bash
{
  "name": "plugin-name",
  "version": "1.2.0",
  "description": "简短的插件描述",
  "author": {
    "name": "作者姓名",
    "email": "author@example.com",
    "url": "https://github.com/author"
  },
  "homepage": "https://docs.example.com/plugin",
  "repository": "https://github.com/author/plugin",
  "license": "MIT",
  "keywords": ["keyword1", "keyword2"],
  "commands": ["./custom/commands/special.md"],
  "agents": "./custom/agents/",
  "hooks": "./config/hooks.json",
  "mcpServers": "./mcp-config.json"
}
```

#### 必需字段

#### 元数据字段

#### 组件路径字段

#### 路径行为规则

重要：自定义路径补充默认目录——它们不会替换它们。

- 如果 commands/ 存在，它会与自定义命令路径一起加载
- 所有路径必须相对于插件根目录并以 ./ 开头
- 来自自定义路径的命令使用相同的命名和命名空间规则
- 可以将多个路径指定为数组以提供灵活性

```bash
{
  "commands": [
    "./specialized/deploy.md",
    "./utilities/batch-process.md"
  ],
  "agents": [
    "./custom-agents/reviewer.md",
    "./custom-agents/tester.md"
  ]
}
```

#### 环境变量

${CLAUDE_PLUGIN_ROOT}：包含插件目录的绝对路径。在钩子、MCP 服务器和脚本中使用此变量，以确保无论安装位置如何都能获得正确的路径。

```bash
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/process.sh"
          }
        ]
      }
    ]
  }
}
```

### 插件目录结构

#### 标准插件布局

完整的插件遵循此结构：

```bash
enterprise-plugin/
├── .claude-plugin/           # 元数据目录
│   └── plugin.json          # 必需：插件清单
├── commands/                 # 默认命令位置
│   ├── status.md
│   └──  logs.md
├── agents/                   # 默认代理位置
│   ├── security-reviewer.md
│   ├── performance-tester.md
│   └── compliance-checker.md
├── skills/                   # 代理技能
│   ├── code-reviewer/
│   │   └── SKILL.md
│   └── pdf-processor/
│       ├── SKILL.md
│       └── scripts/
├── hooks/                    # 钩子配置
│   ├── hooks.json           # 主钩子配置
│   └── security-hooks.json  # 附加钩子
├── .mcp.json                # MCP 服务器定义
├── scripts/                 # 钩子和实用脚本
│   ├── security-scan.sh
│   ├── format-code.py
│   └── deploy.js
├── LICENSE                  # 许可证文件
└── CHANGELOG.md             # 版本历史
```

#### 文件位置参考

### 调试和开发工具

#### 调试命令

使用 claude --debug 查看插件加载详细信息：

```bash
claude --debug
```

- 正在加载哪些插件
- 插件清单中的任何错误
- 命令、代理和钩子注册
- MCP 服务器初始化

### 分发和版本控制参考

#### 版本管理

为插件发布遵循语义版本控制：

```bash
{
  "version": "1.0.0"
}
```

### 相关文档

- Claude Code Hooks 参考 - 事件处理和自动化配置
- Claude Code MCP 集成 - 外部工具集成指南
- Claude Code 配置 - 基本配置选项
- Claude Code 高级功能 - 高级使用技巧
