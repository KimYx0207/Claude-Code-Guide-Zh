# Claude Code CLI命令完全指南

**课程模块**：模块2 - 基础使用篇
**课程编号**：第1课
**预计学时**：5小时
**难度等级**：⭐⭐ 入门到进阶

---

## 📚 本课学习目标

通过本课学习，你将能够：

1. ✅ 掌握所有Claude Code CLI命令的语法和用法
2. ✅ 熟练使用交互模式下的30+个Slash命令
3. ✅ 理解不同命令的应用场景和最佳实践
4. ✅ 掌握命令组合技巧实现复杂工作流
5. ✅ 学会使用诊断命令快速排查问题
6. ✅ 了解高级命令管理MCP、Skills、Hooks

---

## 命令速查表

### 基础命令
```bash
claude                    # 启动交互模式
claude "prompt"           # 单次执行
claude -p "prompt"        # 单次打印模式
claude --version          # 查看版本
claude --help             # 显示帮助
claude update             # 更新Claude Code
```

### 交互命令（在交互模式中使用）
```bash
/help                     # 显示命令帮助
/exit                     # 退出交互模式
/clear                    # 清空对话历史
/compact                  # 压缩对话历史
/think                    # 启用思考模式
/save                     # 保存对话
```

### 配置命令
```bash
claude config list        # 查看配置
claude config set         # 设置配置
claude config get         # 获取配置
claude config reset       # 重置配置
```

### 诊断命令
```bash
claude /doctor            # 系统诊断
claude /account           # 账户信息
claude /project-info      # 项目信息
```

---

## 第一部分：基础命令详解（2,500字）

基础命令是Claude Code的核心，掌握这些命令是高效使用的基础。

---

### 1.1 claude - 启动交互模式

**语法**：
```bash
claude [options]
```

**功能说明**：

启动Claude Code的交互模式，这是最常用的使用方式。在交互模式下，你可以：
- 与AI持续对话
- 让AI读取、编辑、创建文件
- 运行命令并查看结果
- 使用Slash命令切换模式

**基本使用**：

```bash
# 在当前目录启动
cd ~/my-project
claude

# 启动后的界面
Claude Code v1.0.58
Working directory: /Users/yourname/my-project
Type your message or /help for commands

You:
```

**高级选项**：

```bash
# 指定项目目录
claude --project /path/to/project

# 跳过权限确认（谨慎使用）
claude --dangerously-skip-permissions

# 启用详细日志
claude --verbose

# 使用特定模型
claude --model claude-opus-4

# 禁用自动更新
DISABLE_AUTOUPDATER=1 claude

# 组合多个选项
claude --verbose --model claude-sonnet-4 --project ~/work/app
```

**使用场景**：

| 场景 | 命令 | 说明 |
|------|------|------|
| 日常开发 | `claude` | 标准交互模式 |
| 个人项目 | `claude --dangerously-skip-permissions` | 减少权限确认 |
| 调试问题 | `claude --verbose` | 查看详细日志 |
| 多项目管理 | `claude --project ~/project-a` | 指定项目路径 |

**最佳实践**：

```bash
# 配置别名简化命令
# 在 ~/.bashrc 或 ~/.zshrc 中添加
alias cc="claude --dangerously-skip-permissions"
alias ccv="claude --verbose"
alias cco="claude --model claude-opus-4"

# 使用
cc          # 快速启动
ccv         # 调试模式
cco         # 使用Opus模型
```

---

### 1.2 claude "prompt" - 单次执行命令

**语法**：
```bash
claude "your prompt here"
```

**功能说明**：

单次执行模式，执行一个命令后立即退出，不进入交互模式。适合：
- 脚本自动化
- 快速查询
- CI/CD集成
- 批量处理

**基本示例**：

```bash
# 简单问答
claude "What's 2+2?"
# 输出: 4

# 代码分析
claude "Summarize what app.js does"

# 生成代码
claude "Create a Python hello world script"

# 文件操作
claude "Read config.json and explain the settings"

# 运行测试
claude "Run pytest and fix any failing tests"
```

**高级用法**：

```bash
# 组合管道
cat error.log | claude "Analyze these errors and suggest fixes"

# 处理输出
claude "List all TODO comments in this project" > todos.txt

# 条件执行
if claude "Check if tests pass"; then
  echo "Tests passed!"
else
  echo "Tests failed"
fi

# 循环处理
for file in *.py; do
  claude "Add docstrings to $file"
done
```

**在脚本中使用**：

```bash
#!/bin/bash
# auto-review.sh - 自动代码审查脚本

echo "Starting code review..."

# 检查代码风格
echo "Checking code style..."
claude "Review Python files for PEP8 compliance"

# 检查安全问题
echo "Checking security..."
claude "Scan for security vulnerabilities"

# 生成报告
echo "Generating report..."
claude "Create a summary report of code quality issues" > review-report.md

echo "Review complete! See review-report.md"
```

---

### 1.3 claude -p - 单次打印模式

**语法**：
```bash
claude -p "your prompt here"
```

**功能说明**：

打印模式（Print mode），与单次执行类似，但：
- 只输出AI的响应文本
- 不显示额外的格式和标记
- 适合管道处理和脚本解析

**对比示例**：

```bash
# 标准模式
$ claude "Say hello"
Claude: Hello! How can I help you today?

# 打印模式
$ claude -p "Say hello"
Hello! How can I help you today?
```

**管道处理**：

```bash
# 处理大文件
cat large-log.txt | claude -p "Extract error messages" > errors.txt

# 数据转换
cat data.csv | claude -p "Convert to JSON format" > data.json

# 文本分析
echo "This is a test" | claude -p "Translate to Chinese"

# 批量处理
for file in *.md; do
  cat "$file" | claude -p "Summarize in one sentence" >> summaries.txt
done
```

**实战案例：自动化文档生成**

```bash
#!/bin/bash
# generate-docs.sh

echo "# API Documentation" > api-docs.md
echo "" >> api-docs.md

# 遍历所有API文件
for api in api/*.py; do
  echo "Processing $api..."

  # 生成文档章节
  echo "## $(basename $api .py)" >> api-docs.md
  cat "$api" | claude -p "Generate API documentation" >> api-docs.md
  echo "" >> api-docs.md
done

echo "Documentation generated: api-docs.md"
```

---

### 1.4 claude --version - 版本信息

**语法**：
```bash
claude --version
# 或简写
claude -v
```

**输出示例**：

```bash
$ claude --version
Claude Code v1.0.58 (native)

# 或
Claude Code v1.0.58 (npm)
```

**版本信息说明**：

```
Claude Code v1.0.58 (native)
       ^       ^       ^
       |       |       └─ 安装方式
       |       └───────── 版本号
       └───────────────── 产品名称
```

**使用场景**：

```bash
# 检查版本
claude --version

# 版本比较脚本
VERSION=$(claude --version | grep -oP '\d+\.\d+\.\d+')
if [[ "$VERSION" < "1.0.50" ]]; then
  echo "Please update Claude Code"
  claude update
fi

# CI/CD环境验证
- name: Verify Claude Code version
  run: |
    claude --version
    claude --version | grep "v1.0"
```

---

### 1.5 claude --help - 帮助文档

**语法**：
```bash
claude --help
# 或简写
claude -h
```

**输出内容**：

```bash
$ claude --help

Usage: claude [options] [prompt]

Claude Code - AI-powered coding assistant

Options:
  -v, --version                Display version information
  -h, --help                   Display this help message
  -p, --print                  Print mode (output only)
  -m, --model <name>           Specify AI model
      --verbose                Enable verbose output
      --project <path>         Specify project directory
      --dangerously-skip-permissions  Skip permission prompts
      --no-color               Disable colored output

Commands:
  update                       Update Claude Code
  config                       Manage configuration
  mcp                          MCP server wizard
  /doctor                      System diagnostics

Examples:
  claude                       Start interactive mode
  claude "explain app.js"      Execute single command
  claude -p "hello"            Print mode

Documentation: https://docs.anthropic.com/claude-code
```

**实用技巧**：

```bash
# 快速查看特定命令帮助
claude --help | grep -A 5 "config"

# 保存帮助文档
claude --help > claude-help.txt

# 搜索特定选项
claude --help | grep "model"
```

---

### 1.6 claude update - 更新Claude Code

**语法**：
```bash
claude update [options]
```

**功能说明**：

更新Claude Code到最新版本。Claude Code默认启用自动更新，但你也可以手动触发更新。

**基本使用**：

```bash
# 检查并更新到最新版本
claude update

# 更新过程示例
$ claude update

Checking for updates...
Current version: v1.0.55
Latest version: v1.0.58

Downloading update... ████████████████ 100%
Installing update...
✓ Update complete!

Please restart Claude Code to use the new version.
```

**更新选项**：

```bash
# 强制更新（即使已是最新）
claude update --force

# 更新到特定版本
claude update --version 1.0.55

# 检查更新但不安装
claude update --check-only

# 显示详细更新过程
claude update --verbose
```

**更新管理**：

```bash
# 禁用自动更新
export DISABLE_AUTOUPDATER=1

# 写入shell配置
echo 'export DISABLE_AUTOUPDATER=1' >> ~/.bashrc

# 定期手动更新（crontab）
0 9 * * 1 /usr/local/bin/claude update --check-only
```

**更新失败处理**：

```bash
# 清理并重新安装
npm uninstall -g @anthropic-ai/claude-code
npm cache clean --force
npm install -g @anthropic-ai/claude-code

# 或使用原生安装
curl -fsSL https://claude.ai/install.sh | bash
```

---

### 1.7 管道和重定向

Claude Code完美支持Unix管道和重定向，实现强大的组合功能。

**输入重定向**：

```bash
# 从文件读取
claude < input.txt

# 使用heredoc
claude << EOF
Please analyze this code:
function hello() {
  console.log("Hello");
}
EOF
```

**输出重定向**：

```bash
# 保存输出
claude "Generate README" > README.md

# 追加输出
claude "Add license section" >> README.md

# 错误重定向
claude "risky command" 2> errors.log

# 同时重定向输出和错误
claude "complex task" > output.txt 2>&1
```

**管道组合**：

```bash
# 文件处理管道
cat app.js | claude -p "Add comments" | tee app-commented.js

# 数据处理管道
curl https://api.example.com/data | \
  claude -p "Convert to CSV" | \
  tee data.csv | \
  wc -l

# 多步处理
grep "ERROR" app.log | \
  claude -p "Categorize errors" | \
  sort | uniq -c | \
  claude -p "Suggest fixes"
```

**实战案例：日志分析流水线**

```bash
#!/bin/bash
# log-analyzer.sh

# 步骤1：提取错误
grep "ERROR" production.log > errors.log

# 步骤2：分类错误
cat errors.log | \
  claude -p "Categorize these errors by type" > error-types.txt

# 步骤3：生成统计
cat error-types.txt | \
  claude -p "Generate statistics and charts" > stats.md

# 步骤4：提出解决方案
cat error-types.txt | \
  claude -p "Suggest fixes for top 5 errors" > fixes.md

echo "Analysis complete!"
echo "- Error types: error-types.txt"
echo "- Statistics: stats.md"
echo "- Fixes: fixes.md"
```

---

## 第二部分：交互模式命令（3,000字）

交互模式是Claude Code的核心使用方式，提供30+个Slash命令。

---

### 2.1 基础Slash命令

#### /help - 显示命令帮助

```bash
# 显示所有可用命令
> /help

Available Commands:
  /help           Show this help
  /exit           Exit interactive mode
  /clear          Clear conversation history
  /compact        Compact conversation
  /save           Save conversation
  /load           Load conversation
  /think          Enable thinking mode
  /project-info   Show project information
  ...

# 查看特定命令帮助
> /help think
```

#### /exit - 退出交互模式

```bash
# 退出Claude Code
> /exit

# 或使用快捷键
Ctrl + D    # Unix/Linux/macOS
Ctrl + Z    # Windows
```

#### /clear - 清空对话历史

```bash
> /clear

Conversation cleared.
CLAUDE.md configuration retained.
```

**使用场景**：

- ✅ 开始新任务时清空上下文
- ✅ 对话过长影响性能
- ✅ 切换到完全不同的主题
- ❌ 不要在解决问题中途清空

**最佳实践**：

```bash
# 任务1：修复Bug
> Fix the login bug in auth.js
> ...（完成）

# 清空后开始任务2
> /clear
> Add a new feature for password reset
```

#### /compact - 压缩对话历史

```bash
> /compact

Conversation compacted.
Key information retained.
Token usage reduced by 45%
```

**与/clear的区别**：

| 命令 | 效果 | 保留内容 | 使用场景 |
|------|------|---------|---------|
| /clear | 完全清空 | 仅CLAUDE.md | 换任务 |
| /compact | 压缩历史 | 关键信息 | 继续任务 |

**使用建议**：

```bash
# 场景1：对话很长但需要保留上下文
> /compact

# 场景2：上下文快满（180K+ tokens）
> /compact

# 场景3：性能下降但需要继续
> /compact
```

---

### 2.2 思考模式命令

#### /think - 基础思考模式

```bash
# 启用思考模式
> /think How can I optimize this algorithm?

# Claude会先显示思考过程，然后给出答案
Thinking...
- Analyzing current time complexity: O(n²)
- Considering optimization strategies:
  1. Use hash map for O(1) lookup
  2. Implement binary search for O(log n)
  3. Use two-pointer technique
- Evaluating trade-offs...

Answer:
I recommend using a hash map approach...
```

**思考深度等级**：

```bash
/think          # 基础思考（默认）
/think hard     # 深入思考
/think harder   # 更深入思考
/ultrathink     # 最深入思考
```

**使用场景对比**：

| 模式 | Token消耗 | 响应时间 | 适用场景 |
|------|----------|---------|---------|
| 普通 | 低 | 快 | 简单问题 |
| /think | 中 | 中 | 需要分析的问题 |
| /think hard | 高 | 慢 | 复杂问题 |
| /ultrathink | 很高 | 很慢 | 关键决策 |

**实战案例**：

```bash
# 案例1：算法优化（使用think hard）
> /think hard
> Optimize this sorting function for 1M+ records

# 案例2：架构决策（使用ultrathink）
> /ultrathink
> Should we use microservices or monolith for this project?

# 案例3：Bug分析（使用think）
> /think
> Why is the memory leak happening in this code?
```

#### /thoughts - 查看思考历史

```bash
# 显示本次对话的所有思考过程
> /thoughts

Thought History:
[12:30] Algorithm optimization
- Analyzed O(n²) complexity
- Proposed hash map solution

[12:45] Database design
- Evaluated normalization levels
- Recommended 3NF structure

[13:00] Security review
- Identified XSS vulnerability
- Suggested input sanitization
```

---

### 2.3 项目管理命令

#### /project-info - 项目信息

```bash
> /project-info

Project Information:
===================
Name: my-awesome-app
Path: /Users/yourname/projects/my-awesome-app
Git: main branch (3 commits ahead)

Configuration:
- CLAUDE.md: ✓ Found
- .gitignore: ✓ Found
- package.json: ✓ Found

Tech Stack (detected):
- React 18.2.0
- TypeScript 5.0.2
- Vite 4.3.9

File Count:
- JavaScript/TypeScript: 45 files
- CSS/SCSS: 12 files
- Other: 8 files

Last Modified: 2025-12-11 14:30:00
```

#### /reset-project - 重置项目设置

```bash
> /reset-project

Warning: This will reset all project-specific settings.
Are you sure? (y/n): y

Project settings reset.
- Cleared .claude/ directory
- Reset to global configuration
- CLAUDE.md preserved
```

---

### 2.4 会话管理命令

#### /save - 保存对话

```bash
# 自动命名保存
> /save
Conversation saved: conversation-2025-12-11-14-30.json

# 指定名称保存
> /save bug-fix-session
Conversation saved: bug-fix-session.json

# 保存到特定位置
> /save ~/backups/important-session
Conversation saved: /Users/yourname/backups/important-session.json
```

#### /load - 加载对话

```bash
# 列出可用的保存对话
> /load
Available conversations:
1. bug-fix-session.json (2025-12-11)
2. feature-development.json (2025-12-10)
3. code-review.json (2025-12-09)

# 加载特定对话
> /load bug-fix-session
Conversation loaded: bug-fix-session.json
```

**实战工作流**：

```bash
# 步骤1：开始复杂任务
> Start refactoring authentication system

# 步骤2：工作中保存进度
> /save auth-refactor-progress

# 步骤3：第二天恢复
> /load auth-refactor-progress
> Continue refactoring...
```

---

### 2.5 高级交互命令

#### /checkpoint - 创建检查点

```bash
# 创建检查点
> /checkpoint
Checkpoint created: checkpoint-001

# 继续工作
> Modify config.js
> Add new feature to app.js

# 如果出错，回滚到检查点
> /rollback checkpoint-001
Rolled back to checkpoint-001
2 file changes reverted
```

#### /diff - 查看变更

```bash
# 查看所有变更
> /diff

Modified files:
  M src/app.js
  M src/config.js
  A src/new-feature.js
  D src/old-file.js

# 查看特定文件的变更
> /diff src/app.js

--- src/app.js (original)
+++ src/app.js (modified)
@@ -10,7 +10,8 @@
 function initialize() {
-  console.log("Starting...");
+  console.log("Starting application...");
+  loadConfig();
 }
```

#### /undo - 撤销上一步

```bash
# 撤销最后一次文件修改
> /undo

Undoing last operation...
✓ Reverted changes to src/app.js
```

---

## 第三部分：配置命令（2,500字）

配置命令用于管理Claude Code的全局和项目级配置。

---

### 3.1 claude config list - 查看配置

**语法**：
```bash
claude config list [options]
```

**基本使用**：

```bash
# 查看所有配置
$ claude config list

Global Configuration (~/.claude/config.json):
============================================
model: claude-sonnet-4
max-tokens: 4096
temperature: 0.7
verbose: false
outputFormat: text
ignorePatterns: .git,node_modules,*.log

Project Configuration (.claude/config.json):
===========================================
(No project configuration)

# 仅查看全局配置
$ claude config list --global

# 仅查看项目配置
$ claude config list --project

# 显示配置源
$ claude config list --source
```

**输出格式**：

```bash
# 默认格式
$ claude config list
model: claude-sonnet-4 (global)
max-tokens: 8192 (project)

# JSON格式
$ claude config list --format json
{
  "global": {
    "model": "claude-sonnet-4",
    "max-tokens": 4096
  },
  "project": {
    "max-tokens": 8192
  }
}

# 表格格式
$ claude config list --format table
┌──────────────┬─────────────────┬────────────┐
│ Key          │ Value           │ Source     │
├──────────────┼─────────────────┼────────────┤
│ model        │ claude-sonnet-4 │ global     │
│ max-tokens   │ 8192            │ project    │
│ temperature  │ 0.7             │ global     │
└──────────────┴─────────────────┴────────────┘
```

---

### 3.2 claude config set - 设置配置

**语法**：
```bash
claude config set [--global|--project] <key> <value>
```

**基本配置项**：

```bash
# 设置默认模型
claude config set --global model claude-sonnet-4

# 设置最大Token数
claude config set --global max-tokens 8192

# 设置温度（创造性）
claude config set --global temperature 0.7

# 启用详细输出
claude config set --global verbose true

# 设置输出格式
claude config set --global outputFormat text

# 设置忽略模式
claude config set --global ignorePatterns ".git,node_modules,*.log,dist"
```

**项目级配置**：

```bash
# 在项目目录中设置
cd ~/my-project

# 设置项目专用配置
claude config set --project model claude-opus-4
claude config set --project max-tokens 16384
claude config set --project verbose true

# 项目配置优先级高于全局配置
```

**配置优先级**：

```
项目配置 > 全局配置 > 默认值
(.claude/config.json > ~/.claude/config.json > built-in)
```

**完整配置项列表**：

| 配置项 | 类型 | 默认值 | 说明 |
|-------|------|--------|------|
| model | string | claude-sonnet-4 | AI模型 |
| max-tokens | number | 4096 | 最大Token数 |
| temperature | number | 0.7 | 创造性（0-1） |
| verbose | boolean | false | 详细日志 |
| outputFormat | string | text | 输出格式 |
| ignorePatterns | string | .git,node_modules | 忽略模式 |
| autoSave | boolean | true | 自动保存 |
| checkpoints | boolean | true | 启用检查点 |
| telemetry | boolean | true | 遥测数据 |

**高级配置**：

```bash
# 设置数组值
claude config set --global ignorePatterns "*.log" "temp/*" "dist"

# 设置JSON对象
claude config set --global custom '{"key": "value"}'

# 设置布尔值
claude config set --global verbose true
claude config set --global verbose false

# 设置数字
claude config set --global max-tokens 8192
```

---

### 3.3 claude config get - 获取配置

**语法**：
```bash
claude config get <key>
```

**基本使用**：

```bash
# 获取单个配置
$ claude config get model
claude-sonnet-4

# 获取配置并显示来源
$ claude config get model --source
claude-sonnet-4 (global)

# 获取项目配置
$ claude config get max-tokens --project
8192

# 获取全局配置
$ claude config get max-tokens --global
4096
```

**在脚本中使用**：

```bash
#!/bin/bash
# check-config.sh

MODEL=$(claude config get model)
echo "Current model: $MODEL"

if [ "$MODEL" = "claude-opus-4" ]; then
  echo "Using premium model"
else
  echo "Using standard model"
fi

# 检查Token限制
TOKENS=$(claude config get max-tokens)
if [ $TOKENS -lt 8192 ]; then
  echo "Warning: Low token limit"
  echo "Consider increasing: claude config set --global max-tokens 8192"
fi
```

---

### 3.4 claude config unset - 删除配置

**语法**：
```bash
claude config unset [--global|--project] <key>
```

**基本使用**：

```bash
# 删除全局配置
claude config unset --global verbose

# 删除项目配置
claude config unset --project model

# 删除后恢复默认值
$ claude config unset --global temperature
$ claude config get temperature
0.7 (default)
```

---

### 3.5 claude config reset - 重置配置

**语法**：
```bash
claude config reset [--global|--project|--all]
```

**基本使用**：

```bash
# 重置全局配置
$ claude config reset --global
Warning: This will reset all global configuration.
Continue? (y/n): y
Global configuration reset to defaults.

# 重置项目配置
$ claude config reset --project
Project configuration deleted.

# 重置所有配置
$ claude config reset --all
Warning: This will reset ALL configuration.
Continue? (y/n): y
All configuration reset.
```

**安全重置**：

```bash
# 先备份配置
cp ~/.claude/config.json ~/.claude/config.backup.json

# 重置
claude config reset --global

# 如需恢复
mv ~/.claude/config.backup.json ~/.claude/config.json
```

---

### 3.6 配置文件直接编辑

**全局配置文件位置**：

```bash
# macOS/Linux
~/.claude/config.json

# Windows
C:\Users\YourName\.claude\config.json
```

**项目配置文件位置**：

```bash
# 项目根目录
.claude/config.json
```

**配置文件格式**：

```json
{
  "model": "claude-sonnet-4",
  "maxTokens": 4096,
  "temperature": 0.7,
  "verbose": false,
  "outputFormat": "text",
  "ignorePatterns": [
    ".git",
    "node_modules",
    "*.log",
    "dist",
    "build"
  ],
  "autoSave": true,
  "checkpoints": true,
  "customSettings": {
    "theme": "dark",
    "shortcuts": {
      "save": "Ctrl+S",
      "exit": "Ctrl+D"
    }
  }
}
```

**直接编辑配置**：

```bash
# 使用编辑器打开
vim ~/.claude/config.json

# 或使用Claude Code编辑
claude "Edit my global config.json"

# 验证配置
claude config list
```

---

## 第四部分：诊断命令（2,000字）

诊断命令帮助你快速定位和解决问题。

---

### 4.1 claude /doctor - 系统诊断

**在交互模式中使用**：

```bash
> /doctor

Claude Code System Diagnostics
==============================

✓ System Information
  OS: Linux x86_64 (Ubuntu 22.04)
  Shell: bash 5.1.16
  Terminal: xterm-256color

✓ Dependencies
  Node.js: v20.10.0 (OK)
  npm: v10.2.3 (OK)
  Git: v2.42.0 (OK)
  ripgrep: v14.0.3 (OK)

✓ Installation
  Type: native
  Version: v1.0.58
  Location: /usr/local/bin/claude
  Config: ~/.claude/config.json (OK)

✓ Network Connectivity
  Claude API: Connected (45ms)
  Status: Operational
  Region: US-West

✓ Authentication
  Type: API Key
  Status: Valid
  Workspace: Default

✓ Model Access
  claude-sonnet-4: Available
  claude-opus-4: Available
  claude-haiku-2: Available

✓ Project Context
  Directory: /home/user/my-project
  CLAUDE.md: Found (OK)
  Git: Clean (main branch)

All systems operational!
```

**诊断输出说明**：

| 检查项 | 说明 | 问题处理 |
|-------|------|---------|
| System Info | 系统基本信息 | 检查OS兼容性 |
| Dependencies | 依赖软件版本 | 更新过期依赖 |
| Installation | 安装状态 | 重新安装如有问题 |
| Network | 网络连接 | 检查代理/防火墙 |
| Authentication | 认证状态 | 更新API Key |
| Model Access | 模型可用性 | 检查订阅状态 |
| Project Context | 项目状态 | 检查CLAUDE.md |

**问题诊断流程**：

```bash
# 步骤1：运行诊断
> /doctor

# 步骤2：分析输出
# 查找 ✗ 标记的失败项

# 步骤3：根据建议修复
✗ Node.js: v16.0.0 (Requires v18.0.0+)
→ Suggestion: Update Node.js to v18.0.0 or higher
→ Run: nvm install --lts

# 步骤4：再次验证
> /doctor
✓ All systems operational!
```

---

### 4.2 claude /account - 账户信息

**在交互模式中使用**：

```bash
> /account

Account Information:
===================

User: yourname@example.com
Plan: Claude Max 5X

Usage (Current Period):
- Messages: 145 / 225 (64%)
- Reset: 4h 23m
- Period: 2025-12-11 00:00 - 2025-12-11 23:59

Credits (API Users):
- Balance: $12.34
- Usage Today: $0.87
- Last Charged: 2025-12-10

Workspace:
- Name: Default
- Created: 2025-01-15
- Members: 1

Subscription:
- Status: Active
- Renews: 2025-01-15
- Auto-renew: Enabled
```

**使用场景**：

```bash
# 检查使用量
> /account
# 如果接近限额，考虑 /compact 压缩对话

# 检查余额（API用户）
> /account
# 余额不足时及时充值

# 查看订阅状态
> /account
# 确认自动续费状态
```

---

### 4.3 调试模式

**启用详细日志**：

```bash
# 启动时启用
claude --verbose

# 或设置环境变量
export CLAUDE_DEBUG=1
claude

# 详细日志示例
[DEBUG] Loading config from ~/.claude/config.json
[DEBUG] Connecting to Claude API...
[DEBUG] Model: claude-sonnet-4
[DEBUG] Max tokens: 4096
[DEBUG] Sending request...
[DEBUG] Response received (2.3s)
[DEBUG] Token usage: 234 / 4096
```

**日志级别**：

```bash
# 环境变量控制日志级别
export CLAUDE_LOG_LEVEL=debug   # 最详细
export CLAUDE_LOG_LEVEL=info    # 一般信息
export CLAUDE_LOG_LEVEL=warn    # 仅警告
export CLAUDE_LOG_LEVEL=error   # 仅错误
```

**日志输出到文件**：

```bash
# 重定向日志
claude --verbose 2> debug.log

# 同时显示和保存
claude --verbose 2>&1 | tee debug.log

# 分离输出和日志
claude --verbose > output.txt 2> debug.log
```

---

### 4.4 性能分析

**测量响应时间**：

```bash
# 使用time命令
$ time claude "What's 2+2?"
4

real    0m2.341s
user    0m0.123s
sys     0m0.045s

# 分析各阶段耗时
[DEBUG] Request preparation: 45ms
[DEBUG] Network request: 1823ms
[DEBUG] Response parsing: 178ms
[DEBUG] Token processing: 295ms
Total: 2341ms
```

**Token使用分析**：

```bash
> /token-stats

Token Usage Statistics:
======================
Current Conversation:
- Input tokens: 1,234
- Output tokens: 2,456
- Total: 3,690 / 4,096 (90%)

Recommendations:
⚠ Context usage high (90%)
→ Consider using /compact to free up space
→ Or use /clear to start fresh
```

---

## 第五部分：高级命令（2,000字）

高级命令用于管理MCP服务器、Skills和Hooks。

---

### 5.1 MCP管理命令

**claude mcp - MCP向导**：

```bash
$ claude mcp

MCP Server Configuration Wizard
================================

Welcome! This wizard will help you set up MCP servers.

Step 1: Choose an action
  1. Add new MCP server
  2. List installed servers
  3. Remove server
  4. Test server
  5. Exit

Your choice: 1

Step 2: Select server type
  1. Install from marketplace
  2. Install from npm
  3. Install from local path
  4. Install from GitHub

Your choice: 1

Step 3: Browse marketplace
Available servers:
  1. @anthropic/filesystem
  2. @anthropic/git
  3. @anthropic/database
  ...

Select server: 1

Installing @anthropic/filesystem...
✓ Downloaded
✓ Configured
✓ Ready to use

MCP server installed successfully!
Restart Claude Code to activate.
```

**MCP相关命令**：

```bash
# 列出MCP服务器
> /mcp-list

Installed MCP Servers:
1. filesystem (v1.0.0) - Active
2. git (v1.2.0) - Active
3. database (v2.0.1) - Inactive

# 启用/禁用MCP服务器
> /mcp-enable filesystem
> /mcp-disable git

# 测试MCP服务器
> /mcp-test filesystem
Testing filesystem server...
✓ Connection successful
✓ All tools available
```

---

### 5.2 Skills管理命令

**查看可用Skills**：

```bash
> /skills

Available Skills:
================
Local Skills (3):
1. google-seo - SEO优化指南
2. python-best-practices - Python最佳实践
3. react-patterns - React设计模式

Marketplace Skills (12):
1. aws-expert - AWS架构专家
2. security-audit - 安全审计
3. performance-optimization - 性能优化
...

# 查看Skill详情
> /skill-info google-seo

Skill: google-seo
Version: 1.0.0
Author: Your Name
Description: Google SEO优化完整指南

Triggers: SEO, 搜索优化, meta标签
Context Size: 4.2K tokens

Usage:
When working on web pages, this skill provides
SEO best practices and optimization suggestions.
```

**使用Skills**：

```bash
# Skills会自动激活
> Please review this webpage for SEO issues
[Skill: google-seo activated]
Analyzing SEO...
- Title tag: OK
- Meta description: Missing
- H1 tag: OK
...

# 手动调用特定Skill
> /use-skill python-best-practices
> Review this Python code

# 禁用特定Skill
> /disable-skill google-seo
```

---

### 5.3 Hooks命令

**查看Hooks**：

```bash
> /hooks

Configured Hooks:
================

PreToolUse Hooks (2):
1. code-style-checker
   - Runs before code modifications
   - Checks coding standards

2. security-scanner
   - Runs before file writes
   - Scans for security issues

PostToolUse Hooks (1):
1. auto-formatter
   - Runs after code modifications
   - Formats code automatically

Notification Hooks (1):
1. slack-notifier
   - Sends notifications to Slack
   - Triggers on important events
```

**管理Hooks**：

```bash
# 启用/禁用Hook
> /enable-hook code-style-checker
> /disable-hook security-scanner

# 测试Hook
> /test-hook auto-formatter
Testing auto-formatter hook...
✓ Hook executed successfully

# Hook日志
> /hook-logs
[12:30] PreToolUse: code-style-checker
  ✓ Passed (0.23s)
[12:30] PostToolUse: auto-formatter
  ✓ Formatted 3 files (0.45s)
```

---

### 5.4 自定义命令

**创建自定义Slash命令**：

```bash
# 在 .claude/commands/ 目录创建文件
$ cat .claude/commands/deploy.md
---
name: deploy
description: Deploy to production
---

# Deployment Steps
1. Run tests
2. Build production
3. Upload to server
4. Verify deployment

# 使用自定义命令
> /deploy

Executing deploy command...
Step 1: Running tests...
✓ All tests passed

Step 2: Building production...
✓ Build complete

Step 3: Uploading to server...
✓ Upload successful

Step 4: Verifying deployment...
✓ Deployment verified

Deployment complete!
```

**命令参数**：

```bash
# 带参数的命令
$ cat .claude/commands/create-component.md
---
name: create-component
description: Create React component
arguments:
  - name: Component name
    required: true
---

Create a React component named $ARGUMENTS

# 使用
> /create-component Button
Creating Button component...
✓ Button.tsx created
✓ Button.test.tsx created
✓ Button.module.css created
```

---

## 📝 本课总结

### ✅ 掌握的技能

通过本课学习，你现在能够：

1. **基础命令**：熟练使用所有CLI命令
2. **交互命令**：掌握30+ Slash命令
3. **配置管理**：管理全局和项目配置
4. **问题诊断**：使用诊断命令排查问题
5. **高级功能**：管理MCP、Skills、Hooks

### 📊 命令速查

**最常用命令TOP 10**：

1. `claude` - 启动交互模式
2. `/help` - 查看帮助
3. `/clear` - 清空对话
4. `/think` - 思考模式
5. `claude config list` - 查看配置
6. `/doctor` - 系统诊断
7. `/save` - 保存对话
8. `/project-info` - 项目信息
9. `claude --verbose` - 调试模式
10. `claude update` - 更新

### 🎯 下一步学习

完成本课后，建议继续学习：

1. **模块2.2《交互模式与工作流》**
   - 建立高效工作流
   - 最佳实践案例

2. **模块3《Commands系统》**
   - 创建自定义命令
   - 命令自动化

3. **模块4《MCP集成》**
   - MCP服务器开发
   - 工具扩展

### 💡 实践建议

1. **每日练习**：每天使用10+个不同命令
2. **创建别名**：为常用命令创建快捷方式
3. **记录笔记**：记录有用的命令组合
4. **参与社区**：分享命令使用技巧

---

**课程版本**：V1.0
**最后更新**：2025-12-11
**下一课**：模块2.2《交互模式与工作流》

🎉 **恭喜完成CLI命令完全指南！**