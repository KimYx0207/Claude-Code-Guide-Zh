# Claude Code Hooks 参考

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 高级教程
**标签**: #Claude Code #Hooks #自动化 #配置参考

---

本页面提供在 Claude Code 中实现 hooks 的参考文档。

### 配置

Claude Code hooks 在您的设置文件中配置：

- ~/.claude/settings.json - 用户设置
- .claude/settings.json - 项目设置
- .claude/settings.local.json - 本地项目设置（未提交）
- 企业管理的策略设置

#### 结构

Hooks 按匹配器组织，其中每个匹配器可以有多个 hooks：

```bash
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolPattern",
        "hooks": [
          {
            "type": "command",
            "command": "your-command-here"
          }
        ]
      }
    ]
  }
}
```

- matcher：匹配工具名称的模式，区分大小写（仅适用于 PreToolUse 和 PostToolUse）

简单字符串精确匹配：Write 仅匹配 Write 工具
支持正则表达式：Edit|Write 或 Notebook.*
使用 * 匹配所有工具。您也可以使用空字符串 ("") 或留空 matcher。
- hooks：当模式匹配时执行的命令数组

type：目前仅支持 "command"
command：要执行的 bash 命令（可以使用 $CLAUDE_PROJECT_DIR 环境变量）
timeout：（可选）命令运行多长时间（以秒为单位）后取消该特定命令。

matcher：匹配工具名称的模式，区分大小写（仅适用于 PreToolUse 和 PostToolUse）

- 简单字符串精确匹配：Write 仅匹配 Write 工具
- 支持正则表达式：Edit|Write 或 Notebook.*
- 使用 * 匹配所有工具。您也可以使用空字符串 ("") 或留空 matcher。

hooks：当模式匹配时执行的命令数组

- type：目前仅支持 "command"
- command：要执行的 bash 命令（可以使用 $CLAUDE_PROJECT_DIR 环境变量）
- timeout：（可选）命令运行多长时间（以秒为单位）后取消该特定命令。

对于不使用匹配器的事件（如 UserPromptSubmit、Notification、Stop 和 SubagentStop），您可以省略 matcher 字段：

```bash
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/path/to/prompt-validator.py"
          }
        ]
      }
    ]
  }
}
```

#### 项目特定的 Hook 脚本

您可以使用环境变量 CLAUDE_PROJECT_DIR（仅在 Claude Code 生成 hook 命令时可用）来引用存储在项目中的脚本，确保它们无论 Claude 的当前目录如何都能工作：

```bash
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-style.sh"
          }
        ]
      }
    ]
  }
}
```

#### 插件 hooks

插件可以提供与您的用户和项目 hooks 无缝集成的 hooks。启用插件时，插件 hooks 会自动与您的配置合并。

插件 hooks 的工作原理：

- 插件 hooks 在插件的 hooks/hooks.json 文件或 hooks 字段给定的自定义路径中的文件中定义。
- 启用插件时，其 hooks 会与用户和项目 hooks 合并
- 来自不同来源的多个 hooks 可以响应同一事件
- 插件 hooks 使用 ${CLAUDE_PLUGIN_ROOT} 环境变量来引用插件文件

示例插件 hook 配置：

```bash
{
  "description": "Automatic code formatting",
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/scripts/format.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

插件的环境变量：

- ${CLAUDE_PLUGIN_ROOT}：插件目录的绝对路径
- ${CLAUDE_PROJECT_DIR}：项目根目录（与项目 hooks 相同）
- 所有标准环境变量都可用

### Hook 事件

#### PreToolUse

在 Claude 创建工具参数之后、处理工具调用之前运行。

常见匹配器：

- Task - 子代理任务
- Bash - Shell 命令
- Glob - 文件模式匹配
- Grep - 内容搜索
- Read - 文件读取
- Edit - 文件编辑
- Write - 文件写入
- WebFetch、WebSearch - Web 操作

#### PostToolUse

在工具成功完成后立即运行。

识别与 PreToolUse 相同的匹配器值。

#### Notification

当 Claude Code 发送通知时运行。通知在以下情况下发送：

1. Claude 需要您的许可才能使用工具。示例：“Claude 需要您的许可才能使用 Bash”
2. 提示输入已空闲至少 60 秒。“Claude 正在等待您的输入”

#### UserPromptSubmit

当用户提交提示时运行，在 Claude 处理之前。这允许您根据提示/对话添加额外的上下文、验证提示或阻止某些类型的提示。

#### Stop

当主 Claude Code 代理完成响应时运行。如果停止是由于用户中断而发生的，则不运行。

#### SubagentStop

当 Claude Code 子代理（Task 工具调用）完成响应时运行。

#### PreCompact

在 Claude Code 即将运行压缩操作之前运行。

- manual - 从 /compact 调用
- auto - 从自动压缩调用（由于上下文窗口已满）

#### SessionStart

当 Claude Code 启动新会话或恢复现有会话时运行。用于加载开发上下文、安装依赖项或设置环境变量。

- startup - 从启动调用
- resume - 从 --resume、--continue 或 /resume 调用
- clear - 从 /clear 调用
- compact - 从自动或手动压缩调用。

##### 持久化环境变量

SessionStart hooks 可以访问 CLAUDE_ENV_FILE 环境变量，该变量提供一个文件路径，您可以在其中为后续 bash 命令持久化环境变量。

示例：设置单个环境变量

```bash
#!/bin/bash

if [ -n "$CLAUDE_ENV_FILE" ]; then
  echo 'export NODE_ENV=production' >> "$CLAUDE_ENV_FILE"
  echo 'export API_KEY=your-api-key' >> "$CLAUDE_ENV_FILE"
  echo 'export PATH="$PATH:./node_modules/.bin"' >> "$CLAUDE_ENV_FILE"
fi

exit 0
```

示例：持久化 hook 中的所有环境更改

当您的设置修改环境时（例如 nvm use），通过对环境进行 diff 来捕获并持久化所有更改：

```bash
#!/bin/bash

ENV_BEFORE=$(export -p | sort)

# Run your setup commands that modify the environment
source ~/.nvm/nvm.sh
nvm use 20

if [ -n "$CLAUDE_ENV_FILE" ]; then
  ENV_AFTER=$(export -p | sort)
  comm -13 <(echo "$ENV_BEFORE") <(echo "$ENV_AFTER") >> "$CLAUDE_ENV_FILE"
fi

exit 0
```

写入此文件的任何变量都将在 Claude Code 在会话期间执行的所有后续 bash 命令中可用。

#### SessionEnd

当 Claude Code 会话结束时运行。用于清理任务、记录会话统计信息或保存会话状态。

hook 输入中的 reason 字段将是以下之一：

- clear - 使用 /clear 命令清除会话
- logout - 用户已登出
- prompt_input_exit - 用户在提示输入可见时退出
- other - 其他退出原因

### Hook 输入

Hooks 通过 stdin 接收 JSON 数据，包含会话信息和事件特定数据：

```bash
{
  // 常见字段
  session_id: string
  transcript_path: string  // 对话 JSON 的路径
  cwd: string              // 调用 hook 时的当前工作目录
  permission_mode: string  // 当前权限模式："default"、"plan"、"acceptEdits" 或 "bypassPermissions"

  // 事件特定字段
  hook_event_name: string
  ...
}
```

#### PreToolUse 输入

tool_input 的确切架构取决于工具。

```bash
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  }
}
```

#### PostToolUse 输入

tool_input 和 tool_response 的确切架构取决于工具。

```bash
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": {
    "file_path": "/path/to/file.txt",
    "content": "file content"
  },
  "tool_response": {
    "filePath": "/path/to/file.txt",
    "success": true
  }
}
```

#### Notification 输入

```bash
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "Notification",
  "message": "Task completed successfully"
}
```

#### UserPromptSubmit 输入

```bash
{
  "session_id": "abc123",
  "transcript_path": "/Users/.../.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "UserPromptSubmit",
  "prompt": "Write a function to calculate the factorial of a number"
}
```

#### Stop 和 SubagentStop 输入

当 Claude Code 已经作为 stop hook 的结果继续时，stop_hook_active 为 true。检查此值或处理记录以防止 Claude Code 无限运行。

```bash
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "permission_mode": "default",
  "hook_event_name": "Stop",
  "stop_hook_active": true
}
```

#### PreCompact 输入

对于 manual，custom_instructions 来自用户传入 /compact 的内容。对于 auto，custom_instructions 为空。

```bash
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "permission_mode": "default",
  "hook_event_name": "PreCompact",
  "trigger": "manual",
  "custom_instructions": ""
}
```

#### SessionStart 输入

```bash
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "permission_mode": "default",
  "hook_event_name": "SessionStart",
  "source": "startup"
}
```

#### SessionEnd 输入

```bash
{
  "session_id": "abc123",
  "transcript_path": "~/.claude/projects/.../00893aaf-19fa-41d2-8238-13269b9b3ca0.jsonl",
  "cwd": "/Users/...",
  "permission_mode": "default",
  "hook_event_name": "SessionEnd",
  "reason": "exit"
}
```

### Hook 输出

Hooks 有两种方式将输出返回给 Claude Code。输出传达是否阻止以及应显示给 Claude 和用户的任何反馈。

#### 简单：退出代码

Hooks 通过退出代码、stdout 和 stderr 传达状态：

- 退出代码 0：成功。stdout 在记录模式中显示给用户，除了 UserPromptSubmit 和 SessionStart，其中 stdout 被添加到上下文中。
- 退出代码 2：阻止错误。stderr 被反馈给 Claude 以自动处理。
- 其他退出代码：非阻止错误。stderr 显示给用户，执行继续。

##### 退出代码 2 行为

#### 高级：JSON 输出

Hooks 可以在 stdout 中返回结构化 JSON 以获得更复杂的控制：

##### 常见 JSON 字段

所有 hook 类型都可以包含这些可选字段：

```bash
{
  "continue": true, // Claude 在 hook 执行后是否应继续（默认值：true）
  "stopReason": "string", // 当 continue 为 false 时显示的消息

  "suppressOutput": true, // 在记录模式中隐藏 stdout（默认值：false）
  "systemMessage": "string" // 可选的警告消息，显示给用户
}
```

如果 continue 为 false，Claude 在 hooks 运行后停止处理。

##### PreToolUse 决策控制

PreToolUse hooks 可以控制工具调用是否进行。

- "allow" 绕过权限系统。permissionDecisionReason 显示给用户但不显示给 Claude。
- "deny" 防止工具调用执行。permissionDecisionReason 显示给 Claude。
- "ask" 要求用户在 UI 中确认工具调用。permissionDecisionReason 显示给用户但不显示给 Claude。

此外，hooks 可以在执行前使用 updatedInput 修改工具输入：

```bash
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "permissionDecisionReason": "My reason here",
    "updatedInput": {
      "field_to_modify": "new value"
    }
  }
}
```

##### PostToolUse 决策控制

PostToolUse hooks 可以在工具执行后向 Claude 提供反馈。

- "block" 自动提示 Claude 使用 reason。
- undefined 不执行任何操作。reason 被忽略。
- "hookSpecificOutput.additionalContext" 为 Claude 添加要考虑的上下文。

```bash
{
  "decision": "block" | undefined,
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "Additional information for Claude"
  }
}
```

##### UserPromptSubmit 决策控制

UserPromptSubmit hooks 可以控制用户提示是否被处理。

- "block" 防止提示被处理。提交的提示从上下文中清除。"reason" 显示给用户但不添加到上下文中。
- undefined 允许提示正常进行。"reason" 被忽略。
- "hookSpecificOutput.additionalContext" 如果未被阻止，将字符串添加到上下文中。

```bash
{
  "decision": "block" | undefined,
  "reason": "Explanation for decision",
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "My additional context here"
  }
}
```

##### Stop/SubagentStop 决策控制

Stop 和 SubagentStop hooks 可以控制 Claude 是否必须继续。

- "block" 防止 Claude 停止。您必须填充 reason 以便 Claude 知道如何继续。
- undefined 允许 Claude 停止。reason 被忽略。

```bash
{
  "decision": "block" | undefined,
  "reason": "Must be provided when Claude is blocked from stopping"
}
```

##### SessionStart 决策控制

SessionStart hooks 允许您在会话开始时加载上下文。

- "hookSpecificOutput.additionalContext" 将字符串添加到上下文中。
- 多个 hooks 的 additionalContext 值被连接。

```bash
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "My additional context here"
  }
}
```

##### SessionEnd 决策控制

SessionEnd hooks 在会话结束时运行。它们无法阻止会话终止，但可以执行清理任务。

### 使用 MCP 工具

Claude Code hooks 与 Model Context Protocol (MCP) 工具无缝协作。当 MCP 服务器提供工具时，它们会以特殊命名模式出现，您可以在 hooks 中匹配。

#### MCP 工具命名

MCP 工具遵循模式 mcp__<server>__<tool>，例如：

- mcp__memory__create_entities - Memory 服务器的创建实体工具
- mcp__filesystem__read_file - Filesystem 服务器的读取文件工具
- mcp__github__search_repositories - GitHub 服务器的搜索工具

#### 为 MCP 工具配置 Hooks

您可以针对特定 MCP 工具或整个 MCP 服务器：

```bash
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__memory__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Memory operation initiated' >> ~/mcp-operations.log"
          }
        ]
      },
      {
        "matcher": "mcp__.*__write.*",
        "hooks": [
          {
            "type": "command",
            "command": "/home/user/scripts/validate-mcp-write.py"
          }
        ]
      }
    ]
  }
}
```

### 安全考虑

#### 免责声明

使用风险自负：Claude Code hooks 在您的系统上自动执行任意 shell 命令。通过使用 hooks，您承认：

- 您对配置的命令负全部责任
- Hooks 可以修改、删除或访问您的用户帐户可以访问的任何文件
- 恶意或编写不当的 hooks 可能导致数据丢失或系统损坏
- Anthropic 不提供任何保证，对因 hook 使用而导致的任何损害不承担任何责任
- 您应该在生产使用前在安全环境中彻底测试 hooks

在将任何 hook 命令添加到您的配置之前，请始终查看并理解它们。

#### 安全最佳实践

以下是编写更安全 hooks 的一些关键实践：

1. 验证和清理输入 - 永远不要盲目信任输入数据
2. 始终引用 shell 变量 - 使用 "$VAR" 而不是 $VAR
3. 阻止路径遍历 - 检查文件路径中的 ..
4. 使用绝对路径 - 为脚本指定完整路径（使用 "$CLAUDE_PROJECT_DIR" 表示项目路径）
5. 跳过敏感文件 - 避免 .env、.git/、密钥等

#### 配置安全

直接编辑设置文件中的 hooks 不会立即生效。Claude Code：

1. 在启动时捕获 hooks 的快照
2. 在整个会话中使用此快照
3. 如果 hooks 被外部修改，则发出警告
4. 需要在 /hooks 菜单中查看更改才能应用

这可防止恶意 hook 修改影响您的当前会话。

### Hook 执行详情

- 超时：默认 60 秒执行限制，可按命令配置。
- 并行化：所有匹配的 hooks 并行运行
- 去重：多个相同的 hook 命令会自动去重
- 环境：在当前目录中运行，使用 Claude Code 的环境

CLAUDE_PROJECT_DIR 环境变量可用，包含项目根目录的绝对路径（Claude Code 启动的位置）
CLAUDE_CODE_REMOTE 环境变量指示 hook 是在远程（web）环境中运行（"true"）还是本地 CLI 环境中运行（未设置或为空）。
- 输入：通过 stdin 的 JSON
- 输出：

PreToolUse/PostToolUse/Stop/SubagentStop：进度显示在记录中
Notification/SessionEnd：仅记录到调试
UserPromptSubmit/SessionStart：stdout 添加为 Claude 的上下文

- CLAUDE_PROJECT_DIR 环境变量可用，包含项目根目录的绝对路径（Claude Code 启动的位置）
- CLAUDE_CODE_REMOTE 环境变量指示 hook 是在远程（web）环境中运行（"true"）还是本地 CLI 环境中运行（未设置或为空）。

- PreToolUse/PostToolUse/Stop/SubagentStop：进度显示在记录中
- Notification/SessionEnd：仅记录到调试
- UserPromptSubmit/SessionStart：stdout 添加为 Claude 的上下文

### 调试

#### 高级调试

对于复杂的 hook 问题：

1. 检查 hook 执行 - 使用 claude --debug 查看详细的 hook 执行
2. 验证 JSON 架构 - 使用外部工具测试 hook 输入/输出
3. 检查环境变量 - 验证 Claude Code 的环境是否正确
4. 测试边界情况 - 尝试使用不寻常的文件路径或输入的 hooks
5. 监控系统资源 - 在 hook 执行期间检查资源耗尽
6. 使用结构化日志 - 在 hook 脚本中实现日志记录

#### 调试输出示例

使用 claude --debug 查看 hook 执行详情：

```bash
[DEBUG] Executing hooks for PostToolUse:Write
[DEBUG] Getting matching hook commands for PostToolUse with query: Write
[DEBUG] Found 1 hook matchers in settings
[DEBUG] Matched 1 hooks for query "Write"
[DEBUG] Found 1 hook commands to execute
[DEBUG] Executing hook command: <Your command> with timeout 60000ms
[DEBUG] Hook command completed with status 0: <Your stdout>
```

进度消息出现在记录模式中，显示：

- 哪个 hook 正在运行
- 正在执行的命令
- 成功/失败状态
- 输出或错误消息

### 技术支持

Hooks 配置过程中如遇问题：

- 联系客服微信：iweico
