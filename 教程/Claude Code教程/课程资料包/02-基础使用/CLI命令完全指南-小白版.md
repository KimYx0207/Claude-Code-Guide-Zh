# Claude Code CLI命令完全指南：从零开始掌握AI编程助手

> **课程信息**
> - **预计学时**：5-7小时
> - **难度等级**：⭐ 零基础入门
> - **更新日期**：2025年12月
> - **适用版本**：Claude Code v2.0.71+（最新版本验证于2025-12-18）
> - **信息来源**：[官方文档](https://code.claude.com/docs)、[GitHub](https://github.com/anthropics/claude-code)、[NPM](https://www.npmjs.com/package/@anthropic-ai/claude-code)

> ⚠️ **版本说明**：Claude Code持续更新，本教程基于v2.0.71版本编写。如果你使用的版本不同，部分命令或功能可能有差异。建议运行`claude --version`检查你的版本，并运行`claude update`更新到最新版。

---

## 📚 本课学习目标

完成本课学习后，你将能够：

1. **理解Claude Code的核心价值**：掌握AI编程助手与传统工具的本质区别
2. **掌握CLI基础命令**：熟练使用所有命令行界面操作
3. **精通交互模式**：掌握30+个Slash命令的使用场景
4. **配置个性化环境**：根据项目需求定制Claude Code
5. **快速排查问题**：使用诊断命令独立解决90%的常见问题
6. **运用高级功能**：管理MCP服务器、Skills和Hooks扩展功能

---

## 🗺️ 学习路径导航（先看这里！）

> 💡 **根据你的情况选择学习路径**：这是一篇4,400+行的长教程，不用全看！根据你的目标选择路径。

### 路径A：快速上手（⏱️ 2小时）

**适合人群**：急着体验Claude Code基础功能，快速上手

**只看这些章节**（其他跳过）：

```
✅ 术语表（10分钟）
✅ 第二部分：基础CLI命令（60分钟）- 6个核心命令
✅ 第三部分3.1：基础Slash命令（30分钟）- /help, /clear, /exit等
✅ 第七部分：实战练习1（20分钟）
```

**2小时后你能达到**：能启动Claude Code，使用基础命令完成简单任务

---

### 路径B：系统学习（⏱️ 5-7小时）

**适合人群**：想完整掌握所有功能，成为Claude Code高手

**学习顺序**：从头到尾所有章节

**建议分段学习**：
- 第1天（2小时）：第一~三部分（简介+CLI+Slash命令前半）
- 第2天（2小时）：第三部分后半（Rewind+会话管理+Thinking Mode）
- 第3天（2小时）：第四~六部分（配置+高级功能+诊断）
- 第4天（1小时）：第七~八部分（实战练习+FAQ）

---

### 路径C：问题速查（⏱️ 5分钟）

**适合人群**：使用中遇到问题，需要快速解决

**直接跳到**：

```
🔧 第八部分：常见问题FAQ - 10个精选问题
🔧 第六部分：诊断命令 - /doctor系统诊断
```

**使用方法**：
1. 按 `Ctrl + F` 搜索你的问题关键词
2. 找到对应的Q&A
3. 按步骤解决

---

### 路径D：专项学习（⏱️ 30-60分钟/主题）

**适合人群**：已经会基础命令，想深入某个功能

| 想学什么 | 看哪几节 | 预计时间 |
|----------|---------|---------|
| **Checkpoint回退** | 第3.3节 | 30分钟 |
| **Extended Thinking** | 第3.2+3.5节 | 40分钟 |
| **CLAUDE.md配置** | 第5.4节 | 45分钟 |
| **省钱技巧** | FAQ Q4 | 20分钟 |
| **自动化脚本** | 第2.7节管道+第七部分练习3 | 60分钟 |

---

## 术语表（小白必读）

在开始之前，先了解这些关键术语，不理解这些术语会影响后面的学习：

| 术语 | 英文全称 | 通俗解释 |
|------|----------|----------|
| **CLI** | Command Line Interface | 命令行界面，通过打字指令操作电脑的方式（类似黑客电影里的黑屏幕打字）|
| **Slash命令** | Slash Commands | 以"/"开头的特殊命令，在交互模式中使用（比如 `/help`、`/clear`）|
| **Token** | - | AI处理文字的计费单位，约等于0.75个英文单词。就像打的士按公里计费，AI按Token计费 |
| **交互模式** | Interactive Mode | 可以连续对话的模式，AI会记住你之前说的话（类似微信聊天，可以连续对话）|
| **REPL** | Read-Eval-Print-Loop | 读取-执行-打印-循环，交互模式的技术称呼。就像你说一句AI回一句，不停循环 |
| **MCP** | Model Context Protocol | 模型上下文协议，让Claude Code可以连接外部工具的插件系统（类似浏览器的扩展插件）|
| **Skills** | - | 技能包，给Claude Code添加专业知识的模块（比如SEO技能包、Python最佳实践技能包）|
| **Hooks** | - | 钩子，在特定时机自动执行的脚本（比如写文件前自动检查代码风格）|
| **API Key** | Application Programming Interface Key | 应用编程接口密钥，你的"身份证"，证明你有权使用Claude服务 |
| **Checkpoint** | - | 检查点，类似游戏的"存档点"，可以随时回到这个状态 |
| **Compact** | - | 压缩，把对话历史压缩简化，节省Token但保留重要信息 |
| **Verbose** | - | 详细模式，显示所有调试信息，帮助排查问题（类似开车导航的"详细播报"）|
| **Workspace** | - | 工作空间，你的Claude账户下的项目组织单位 |
| **管道** | Pipeline | 把一个命令的输出传给另一个命令的输入（类似工厂流水线，上一道工序的产品是下一道的原料）|
| **重定向** | Redirection | 把命令的输出保存到文件（类似把屏幕上的内容截图保存）|

---

## 第一部分：Claude Code简介（为什么要学这个）

### 1.1 什么是Claude Code？

**用一句话说**：Claude Code是Anthropic公司开发的AI编程助手命令行工具，让你在终端里直接和AI对话写代码。

**生活类比**：
- **传统编程**：就像你一个人在厨房做菜，从买菜到切菜到炒菜全得自己来
- **用Claude Code**：就像请了一个厨师助手，你说"我想做宫保鸡丁"，他立马帮你查菜谱、准备食材、甚至直接帮你炒菜

### 1.2 为什么要学CLI命令？

很多小白会问："不是有VS Code插件吗？为什么还要学命令行？"

**答案很简单**：CLI版本是最强大、最灵活的版本，掌握它你可以：

1. ✅ **脚本自动化**：写个脚本让Claude Code自动处理100个文件
2. ✅ **远程服务器使用**：在没有图形界面的服务器上也能用
3. ✅ **CI/CD集成**：把Claude Code集成到自动部署流程
4. ✅ **管道组合**：和其他命令工具组合，发挥最大威力
5. ✅ **完全免费**：不依赖IDE，任何终端都能用

**类比**：就像学开车，手动挡虽然比自动挡难学，但学会后你可以开任何车、跑任何路况。

### 1.3 学习路径

老金建议的学习顺序：

```
第一步：掌握基础CLI命令（本课第二部分）
   ↓
第二步：熟悉交互模式和Slash命令（第三部分）
   ↓
第三步：配置个性化环境（第四部分）
   ↓
第四步：学会诊断和排错（第五部分）
   ↓
第五步：探索高级功能MCP/Skills/Hooks（第六部分）
```

---

## 第二部分：基础CLI命令详解

基础命令是Claude Code的地基，必须打牢！

### 2.1 claude - 启动交互模式

#### 这是什么？

`claude`命令是启动Claude Code交互模式的入口，就像打开微信就能开始聊天一样，运行这个命令就能开始和AI对话写代码。

#### 为什么要用交互模式？

**交互模式的优势**：
1. ✅ **保持上下文**：AI会记住你之前的对话，不用重复解释
2. ✅ **实时反馈**：立即看到结果，快速迭代
3. ✅ **丰富命令**：可以使用30+个Slash命令
4. ✅ **提高效率**：不用每次都重新启动

**类比**：就像打电话和发短信的区别，打电话（交互模式）可以连续聊很多轮，发短信（单次命令）每次都要重新开始。

#### 怎么操作？

**基本用法**：

**Windows系统（PowerShell）：**
```powershell
# 进入你的项目目录
cd C:\Users\yourname\my-project

# 启动Claude Code
claude

# 你会看到这样的界面：
# Claude Code v2.0.71
# Working directory: C:\Users\yourname\my-project
# Type your message or /help for commands
#
# You:
```

**macOS/Linux系统：**
```bash
# 进入你的项目目录
cd ~/my-project

# 启动Claude Code
claude

# 你会看到相同的界面
```

**高级选项**：

```bash
# 指定项目目录（不需要先cd进去）
claude --project /path/to/your/project

# 跳过权限确认（个人项目推荐，节省时间）
claude --dangerously-skip-permissions

# 启用详细日志（调试时用，看到所有细节）
claude --verbose

# 使用特定AI模型
claude --model claude-opus-4.5.5

# 组合多个选项
claude --verbose --model claude-sonnet-4.5.5 --project ~/work/app
```

#### 验证是否成功

**正常启动后你应该看到**：
```
Claude Code v2.0.71
Working directory: /your/current/directory
Type your message or /help for commands

You:
```

> 💡 **提示**：光标在`You:`后面闪烁，等待你输入，这就说明启动成功了！

#### 如果出错怎么办

**错误1**：`claude: command not found`
**原因**：Claude Code没有正确安装或没有添加到系统PATH
**解决方案**：
```bash
# 检查是否安装
which claude  # macOS/Linux
where claude  # Windows

# 如果没有输出，需要重新安装
# 参考《Claude Code完整安装指南》
```

**错误2**：`Authentication failed`
**原因**：API Key没有配置或已过期
**解决方案**：
```bash
# 重新登录
claude login

# 或检查环境变量
echo $ANTHROPIC_API_KEY  # macOS/Linux
echo %ANTHROPIC_API_KEY%  # Windows
```

**错误3**：`Permission denied`
**原因**：没有读写权限
**解决方案**：
```bash
# macOS/Linux
chmod +x $(which claude)

# 或使用sudo
sudo claude
```

#### 最佳实践

**1. 配置命令别名（节省打字时间）**

**macOS/Linux系统（添加到 ~/.bashrc 或 ~/.zshrc）：**
```bash
# 快速启动
alias cc="claude --dangerously-skip-permissions"

# 调试模式
alias ccv="claude --verbose"

# 使用Opus模型
alias cco="claude --model claude-opus-4.5.5"
```

**Windows系统（添加到 PowerShell配置文件）：**
```powershell
# 编辑配置文件
notepad $PROFILE

# 添加以下内容：
function cc { claude --dangerously-skip-permissions }
function ccv { claude --verbose }
function cco { claude --model claude-opus-4.5.5 }
```

**2. 项目专用启动脚本**

创建`start-claude.sh`（macOS/Linux）或`start-claude.ps1`（Windows）：

```bash
#!/bin/bash
# 自动进入项目目录并启动
cd ~/projects/my-app
claude --project . --model claude-sonnet-4.5
```

**3. 使用tmux/screen保持会话（高级）**

```bash
# 创建持久会话
tmux new-session -s claude-dev

# 在会话中启动Claude
claude

# 断开会话（Ctrl+B 然后按 D）
# 稍后重新连接
tmux attach -s claude-dev
```

---

### 2.2 claude "prompt" - 单次执行命令

#### 这是什么？

单次执行模式，让Claude执行一个任务后立即退出，不进入交互模式。

**类比**：就像发短信问朋友"今天天气怎么样？"，他回答完就结束了，不会继续对话。

#### 为什么要用单次执行？

**适用场景**：
1. ✅ **脚本自动化**：在Bash/PowerShell脚本中调用
2. ✅ **快速查询**：问个简单问题就走
3. ✅ **CI/CD集成**：自动部署流程中的质量检查
4. ✅ **批量处理**：用循环处理多个文件

#### 怎么操作？

**基本示例**：

```bash
# 简单问答
claude "What's 2+2?"
# 预期输出：4

# 代码分析
claude "Summarize what app.js does"
# 预期输出：This file contains the main application logic...

# 生成代码
claude "Create a Python hello world script"
# 预期输出：完整的Python脚本代码

# 文件操作
claude "Read config.json and explain the settings"
# 预期输出：配置文件的详细解释
```

**高级用法（管道和重定向）**：

```bash
# 管道输入：把文件内容传给Claude分析
cat error.log | claude "Analyze these errors and suggest fixes"

# 输出重定向：把Claude的回答保存到文件
claude "Generate a README for this project" > README.md

# 条件执行：根据Claude的回答决定下一步
if claude "Check if tests pass"; then
  echo "Tests passed, ready to deploy!"
else
  echo "Tests failed, fix them first"
fi
```

#### 验证是否成功

**正常执行后**：
```bash
$ claude "Say hello"
# 预期输出：
Hello! How can I help you today?
```

> 💡 **提示**：如果看到AI的回答并且命令结束（回到命令提示符），就说明成功了！

#### 如果出错怎么办

**错误1**：命令一直没反应
**原因**：网络连接问题或API服务繁忙
**解决方案**：
```bash
# 检查网络
ping api.anthropic.com

# 添加超时设置
timeout 30 claude "your prompt"
```

**错误2**：输出是乱码
**原因**：终端编码设置问题
**解决方案**：
```bash
# Windows PowerShell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# macOS/Linux
export LANG=en_US.UTF-8
```

#### 实战案例：自动化代码审查脚本

创建`auto-review.sh`：

```bash
#!/bin/bash
# 自动代码审查脚本

echo "🚀 Starting code review..."

# 步骤1：检查代码风格
echo "📝 Checking code style..."
claude "Review Python files for PEP8 compliance"

# 步骤2：检查安全问题
echo "🔒 Checking security..."
claude "Scan for security vulnerabilities"

# 步骤3：生成报告
echo "📊 Generating report..."
claude "Create a summary report of code quality issues" > review-report.md

echo "✅ Review complete! See review-report.md"
```

**使用方法**：
```bash
chmod +x auto-review.sh
./auto-review.sh
```

---

### 2.3 claude -p - 单次打印模式

#### 这是什么？

打印模式（Print mode），和单次执行类似，但只输出AI的纯文本回答，没有任何额外格式。

**类比**：就像复制粘贴，只要纯文本内容，不要格式。

#### 为什么要用打印模式？

**与标准模式的区别**：

**标准模式输出**：
```bash
$ claude "Say hello"
Claude: Hello! How can I help you today?
```

**打印模式输出**：
```bash
$ claude -p "Say hello"
Hello! How can I help you today?
```

**适用场景**：
1. ✅ **管道处理**：把输出传给其他命令
2. ✅ **脚本解析**：需要纯文本内容做进一步处理
3. ✅ **数据转换**：格式转换任务

#### 怎么操作？

**基本用法**：

```bash
# 纯文本输出
claude -p "Translate 'Hello' to Chinese"
# 预期输出：你好

# 与标准模式对比
claude "Translate 'Hello' to Chinese"
# 预期输出：Claude: 你好
```

**管道处理示例**：

```bash
# 文件内容处理
cat large-log.txt | claude -p "Extract error messages" > errors.txt

# 数据格式转换
cat data.csv | claude -p "Convert to JSON format" > data.json

# 批量文本分析
echo "This is a test" | claude -p "Translate to Chinese"

# 批量文件处理
for file in *.md; do
  cat "$file" | claude -p "Summarize in one sentence" >> summaries.txt
done
```

#### 验证是否成功

**预期行为**：
```bash
$ claude -p "What's 2+2?"
4
```

> 💡 **提示**：没有"Claude:"前缀，只有纯回答内容，说明打印模式工作正常！

#### 实战案例：自动化文档生成

创建`generate-docs.sh`：

```bash
#!/bin/bash
# 自动生成API文档

echo "# API Documentation" > api-docs.md
echo "" >> api-docs.md

# 遍历所有API文件
for api_file in api/*.py; do
  echo "📝 Processing $api_file..."

  # 提取文件名作为章节标题
  filename=$(basename "$api_file" .py)
  echo "## $filename" >> api-docs.md

  # 用Claude生成文档（纯文本模式）
  cat "$api_file" | claude -p "Generate API documentation for this Python file" >> api-docs.md
  echo "" >> api-docs.md
done

echo "✅ Documentation generated: api-docs.md"
```

---

### 2.4 claude --version - 查看版本

#### 这是什么？

显示当前安装的Claude Code版本号和安装方式。

**类比**：就像查看微信版本号，确认你用的是不是最新版。

#### 为什么要查看版本？

**使用场景**：
1. ✅ **确认安装**：检查是否正确安装
2. ✅ **报告Bug**：提交问题时需要版本信息
3. ✅ **比较版本**：确认是否需要更新

#### 怎么操作？

**基本用法**：

```bash
# 完整命令
claude --version

# 简写
claude -v
```

#### 验证输出

**预期输出**：
```bash
$ claude --version
Claude Code v2.0.71 (native)
```

**版本信息解读**：
```
Claude Code v2.0.71 (native)
       ^       ^       ^
       |       |       └─ 安装方式：native(二进制) 或 npm(Node包)
       |       └───────── 版本号：主版本.次版本.补丁版本
       └───────────────── 产品名称
```

#### 在脚本中使用

```bash
#!/bin/bash
# 版本检查脚本

# 获取版本号
VERSION=$(claude --version | grep -oP '\d+\.\d+\.\d+')
echo "Current version: $VERSION"

# 检查最低版本要求
MIN_VERSION="2.0.50"
if [[ "$VERSION" < "$MIN_VERSION" ]]; then
  echo "⚠️  Please update Claude Code"
  echo "Current: $VERSION"
  echo "Required: $MIN_VERSION+"
  echo ""
  echo "Run: claude update"
else
  echo "✅ Version OK"
fi
```

---

### 2.5 claude --help - 显示帮助

#### 这是什么？

显示所有可用命令和选项的帮助信息。

**类比**：就像产品说明书，告诉你所有功能怎么用。

#### 为什么要用？

**使用场景**：
1. ✅ **忘记命令**：快速查找命令语法
2. ✅ **发现功能**：了解有哪些可用选项
3. ✅ **学习工具**：新手学习的第一站

#### 怎么操作？

**基本用法**：

```bash
# 完整命令
claude --help

# 简写
claude -h
```

#### 验证输出

**预期输出（示例）**：
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

#### 实用技巧

**快速搜索特定命令**：

```bash
# 查找config相关命令（macOS/Linux）
claude --help | grep -A 5 "config"

# 查找config相关命令（Windows PowerShell）
claude --help | Select-String "config" -Context 0,5

# 保存帮助文档到文件
claude --help > claude-help.txt

# 搜索特定选项
claude --help | grep "model"
```

---

### 2.6 claude update - 更新Claude Code

#### 这是什么？

检查并安装Claude Code的最新版本。

**类比**：就像手机系统更新，获取最新功能和Bug修复。

#### 为什么要更新？

**更新的好处**：
1. ✅ **新功能**：获取最新AI模型和功能
2. ✅ **Bug修复**：解决已知问题
3. ✅ **性能提升**：运行更快更稳定
4. ✅ **安全补丁**：修复安全漏洞

#### 怎么操作？

**基本用法**：

```bash
# 检查并更新到最新版
claude update
```

#### 验证是否成功

**正常更新过程**：
```bash
$ claude update

Checking for updates...
Current version: v2.0.69
Latest version: v2.0.71

Downloading update... ████████████████ 100%
Installing update...
✓ Update complete!

Please restart Claude Code to use the new version.
```

**高级选项**：

```bash
# 强制更新（即使已是最新）
claude update --force

# 更新到特定版本
claude update --version 2.0.69

# 只检查更新不安装
claude update --check-only

# 显示详细更新过程
claude update --verbose
```

#### 如果出错怎么办

**错误1**：`Update failed: Network error`
**原因**：网络连接问题
**解决方案**：
```bash
# 检查网络连接
ping github.com

# 使用代理（如果需要）
export HTTP_PROXY=http://your-proxy:port
export HTTPS_PROXY=http://your-proxy:port
claude update
```

**错误2**：`Permission denied`
**原因**：没有写入权限
**解决方案**：
```bash
# macOS/Linux使用sudo
sudo claude update

# Windows以管理员身份运行PowerShell
```

**错误3**：更新后无法启动
**原因**：更新不完整
**解决方案**：
```bash
# 完全重新安装（npm版本）
npm uninstall -g @anthropic-ai/claude-code
npm cache clean --force
npm install -g @anthropic-ai/claude-code

# 或使用原生安装脚本（macOS/Linux）
curl -fsSL https://claude.ai/install.sh | bash

# Windows原生安装
# 重新下载并运行安装程序
```

#### 更新管理最佳实践

**1. 禁用自动更新（可选）**

Claude Code默认会自动检查更新。如果你想手动控制更新时机：

**临时禁用**：
```bash
DISABLE_AUTOUPDATER=1 claude
```

**永久禁用（macOS/Linux）**：

> 💡 **小白解释**：`~/.bashrc`是你的shell配置文件，每次打开终端都会自动执行里面的命令。`export`设置环境变量，`source`让配置立即生效。

**什么是环境变量？**
- 简单说：系统级别的设置，所有程序都能读取
- 类比：就像手机的"系统设置"，一次设置，所有App都遵守
- 常见环境变量：PATH（程序搜索路径）、HOME（用户目录）、LANG（语言设置）

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
echo 'export DISABLE_AUTOUPDATER=1' >> ~/.bashrc
source ~/.bashrc
```

**命令解释**：
- `echo '...'` = 输出这段文本
- `>>` = 追加到文件末尾
- `~/.bashrc` = 你的shell配置文件
- `source` = 重新加载配置文件，让设置立即生效（不需要重启终端）

**永久禁用（Windows PowerShell）**：

> 💡 **小白解释**：`$PROFILE`是PowerShell的配置文件路径，类似macOS/Linux的~/.bashrc。每次打开PowerShell都会自动执行里面的脚本。

**什么是PowerShell配置文件？**
- 位置：通常在`C:\Users\你的用户名\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`
- 作用：存放自动执行的脚本和设置
- 如果文件不存在：第一次运行会自动创建

```powershell
# 添加到PowerShell配置文件
Add-Content $PROFILE "`nSet-Variable -Name 'DISABLE_AUTOUPDATER' -Value '1' -Scope Global"
```

**命令解释**：
- `Add-Content` = 追加内容到文件
- `$PROFILE` = PowerShell配置文件路径（系统自动识别）
- `` `n`` = 换行符（PowerShell中的换行）
- `Set-Variable` = 设置变量
- `-Scope Global` = 全局生效

**2. 定期手动更新计划**

创建定时任务定期检查更新：

**macOS/Linux（使用crontab）**：

> 💡 **小白解释**：crontab是Linux/macOS的定时任务工具，就像手机的"定时提醒"，可以让电脑在指定时间自动执行命令。

**什么是crontab？**
- 简单说：系统自带的定时任务工具
- 类比：就像设置闹钟，每周一上午9点自动响
- 格式：`分 时 日 月 周 命令`

**时间格式解释**：
```
0 9 * * 1 命令
│ │ │ │ │
│ │ │ │ └─ 周几（0-7，0和7都是周日，1是周一）
│ │ │ └─── 月份（1-12）
│ │ └───── 日期（1-31）
│ └─────── 小时（0-23）
└───────── 分钟（0-59）

* = 任意值（每个都满足）
```

**示例**：
```bash
# 每周一上午9点检查更新
0 9 * * 1 /usr/local/bin/claude update --check-only

# 解读：分钟0，小时9，日期*（任意），月份*（任意），周1（周一）
```

**如何添加定时任务？**
```bash
# 编辑crontab
crontab -e

# 添加上面的那行，保存退出即可
```

**Windows（使用任务计划程序）**：

> 💡 **小白解释**：任务计划程序是Windows自带的定时任务工具，类似手机的"定时提醒"。下面的PowerShell命令会自动创建一个定时任务。

**什么是任务计划程序？**
- 简单说：Windows的定时任务工具
- 位置：搜索"任务计划程序"或Task Scheduler可以打开图形界面查看
- 作用：在指定时间自动运行程序

```powershell
# 创建计划任务
$action = New-ScheduledTaskAction -Execute "claude" -Argument "update --check-only"
$trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 9am
Register-ScheduledTask -TaskName "Claude Code Update Check" -Action $action -Trigger $trigger
```

**命令解释**：
- 第1行：定义要执行的动作（运行claude update --check-only）
- 第2行：定义触发时间（每周一上午9点）
- 第3行：注册任务到系统（名称："Claude Code Update Check"）

**如何查看创建的任务？**
- 打开"任务计划程序"（在开始菜单搜索）
- 找到"Claude Code Update Check"任务
- 可以手动运行、编辑或删除

---

### 2.7 管道和重定向（高级技巧）

#### 这是什么？

Unix/Linux的强大特性，让Claude Code可以和其他命令组合使用。

**类比**：
- **管道**：就像工厂流水线，上一道工序的产品是下一道的原料
- **重定向**：就像把屏幕内容截图保存到文件

#### 为什么要学这个？

**威力展示**：
1. ✅ **处理大文件**：用其他工具预处理后再给Claude分析
2. ✅ **自动化流程**：多个工具组合完成复杂任务
3. ✅ **数据转换**：Claude输出后继续处理
4. ✅ **批量操作**：循环处理多个文件

#### 输入重定向

**从文件读取**：

```bash
# 把文件内容作为输入
claude < input.txt

# 等价于
cat input.txt | claude "Analyze this content"
```

**使用Heredoc（多行输入）**：

> 💡 **小白解释**：Heredoc是"Here Document"的缩写，意思是"这里有一段文档"。`<<`符号告诉shell"从这里开始读取多行文本"，`EOF`是结束标记（可以是任何词，常用EOF表示End Of File）。

**什么是Heredoc？**
- 简单说：一种输入多行文本的方法
- 类比：就像在聊天框里按Shift+Enter换行，可以输入多行内容一起发送

**怎么用？**

```bash
claude << EOF
Please analyze this code:
function hello() {
  console.log("Hello");
}
EOF
```

**格式解释**：
- `<<` = "开始读取多行文本"
- `EOF` = 结束标记（第一个EOF是开始，第二个EOF是结束）
- 中间的内容 = 要输入给Claude的文本

**为什么用Heredoc？**
- ✅ 可以输入多行代码或文本
- ✅ 不用一行行打引号
- ✅ 格式清晰，方便阅读

#### 输出重定向

**保存输出到文件**：

```bash
# 覆盖写入（如果文件存在会被替换）
claude "Generate README" > README.md

# 追加写入（不会覆盖原文件）
claude "Add license section" >> README.md
```

**错误重定向**：

> 💡 **小白解释**：在命令行中，有两种输出：1=正常输出（stdout），2=错误输出（stderr）。重定向符号可以把它们保存到不同文件。

**符号详解**：

| 符号 | 含义 | 通俗解释 |
|------|------|----------|
| `>` | 重定向正常输出 | 把屏幕显示的内容保存到文件 |
| `>>` | 追加输出 | 在文件末尾添加内容，不覆盖原文件 |
| `2>` | 重定向错误输出 | 把错误信息保存到文件 |
| `2>&1` | 错误合并到正常输出 | 把错误和正常信息混在一起保存 |
| `&>` | 同时重定向两者（简写） | 等同于`> file 2>&1` |

**实战示例**：

```bash
# 只保存错误信息
claude "risky command" 2> errors.log

# 同时保存正常输出和错误（方法1）
claude "complex task" > output.txt 2>&1

# 同时保存正常输出和错误（方法2，更简洁）
claude "complex task" &> all-output.txt

# 分别保存输出和错误
claude "task" > output.txt 2> errors.txt
```

**为什么要分开？**
- ✅ 正常输出：给人看的结果
- ✅ 错误输出：调试信息
- ✅ 分开保存：方便排查问题

#### 管道组合

**基本管道**：

```bash
# 文件内容 → Claude分析 → 保存结果
cat app.js | claude -p "Add detailed comments" > app-commented.js

# 查找错误 → Claude分析 → 排序 → 统计
grep "ERROR" app.log | \
  claude -p "Categorize errors" | \
  sort | uniq -c

# API数据 → Claude转换 → 保存 → 统计行数
curl https://api.example.com/data | \
  claude -p "Convert to CSV" | \
  tee data.csv | \
  wc -l
```

#### 实战案例：日志分析流水线

创建`log-analyzer.sh`：

```bash
#!/bin/bash
# 智能日志分析流水线

echo "🔍 Starting log analysis..."

# 步骤1：提取错误行
echo "📝 Extracting errors..."
grep "ERROR" production.log > errors.log
ERROR_COUNT=$(wc -l < errors.log)
echo "Found $ERROR_COUNT errors"

# 步骤2：让Claude分类错误
echo "🏷️  Categorizing errors..."
cat errors.log | \
  claude -p "Categorize these errors by type and severity" \
  > error-categories.txt

# 步骤3：生成统计图表
echo "📊 Generating statistics..."
cat error-categories.txt | \
  claude -p "Generate markdown table with statistics" \
  > error-stats.md

# 步骤4：AI提供解决方案
echo "💡 Getting solutions..."
cat error-categories.txt | \
  claude -p "Suggest fixes for the top 5 most common errors" \
  > solutions.md

# 步骤5：汇总报告
echo "📄 Creating final report..."
{
  echo "# Log Analysis Report"
  echo ""
  echo "## Summary"
  echo "- Total errors found: $ERROR_COUNT"
  echo "- Analysis date: $(date)"
  echo ""
  echo "## Error Categories"
  cat error-categories.txt
  echo ""
  echo "## Statistics"
  cat error-stats.md
  echo ""
  echo "## Recommended Solutions"
  cat solutions.md
} > final-report.md

echo "✅ Analysis complete!"
echo "📁 Reports generated:"
echo "   - errors.log (raw errors)"
echo "   - error-categories.txt (categories)"
echo "   - error-stats.md (statistics)"
echo "   - solutions.md (AI solutions)"
echo "   - final-report.md (complete report)"
```

**使用方法**：
```bash
chmod +x log-analyzer.sh
./log-analyzer.sh
```

#### 验证流水线

**测试每个步骤**：

```bash
# 测试步骤1：提取错误
grep "ERROR" test.log | head -5

# 测试步骤2：Claude分类
echo "Error 1" | claude -p "Categorize this error"

# 测试步骤3：管道组合
echo "test" | claude -p "Upper case" | tee output.txt
```

> 💡 **提示**：流水线脚本写好后，用小数据集测试每个步骤，确保都正常工作！

---

## 🎯 第二部分小结

到这里，你已经掌握了Claude Code的6个核心基础命令：

1. ✅ `claude` - 启动交互模式（日常最常用）
2. ✅ `claude "prompt"` - 单次执行（脚本自动化）
3. ✅ `claude -p` - 打印模式（管道处理）
4. ✅ `claude --version` - 查看版本
5. ✅ `claude --help` - 显示帮助
6. ✅ `claude update` - 更新工具
7. ✅ 管道和重定向（高级组合）

**实践检查清单**：

- [ ] 成功启动过交互模式
- [ ] 试过单次执行命令
- [ ] 了解打印模式的用途
- [ ] 查看过版本号
- [ ] 读过help帮助
- [ ] 更新到最新版本
- [ ] 尝试过管道组合（至少一次）

**下一步**：掌握交互模式和30+个Slash命令（第三部分）

---

## 第三部分：交互模式Slash命令

交互模式是Claude Code的核心，提供30+个Slash命令（以`/`开头的特殊命令）。掌握这些命令，你就能发挥Claude Code 90%的威力！

> 📌 **重要提示**：以下所有Slash命令都必须在交互模式（运行`claude`后）中使用，不能在命令行直接使用！

### 3.1 基础控制命令

这些命令控制交互模式的基本行为，是最常用、最重要的命令。

#### /help - 显示命令帮助

**这是什么？**
显示所有可用Slash命令的列表和简要说明。

**类比**：就像手机设置里的"帮助中心"，告诉你所有功能在哪。

**怎么用？**

```bash
# 在交互模式中输入
> /help

# 预期输出：
Available Commands:
  /help           Show this help
  /exit           Exit interactive mode
  /clear          Clear conversation history
  /compact        Compact conversation
  /think          Enable thinking mode
  /save           Save conversation
  /load           Load conversation
  ...
```

**什么时候用？**
- ✅ 忘记命令名称时
- ✅ 想知道有哪些可用命令
- ✅ 学习新功能

---

#### /exit - 退出交互模式

**这是什么？**
退出Claude Code交互模式，回到命令行提示符。

**类比**：就像关闭微信聊天窗口，结束对话。

**怎么用？**

```bash
> /exit

# 或使用快捷键：
# macOS/Linux: Ctrl + D
# Windows: Ctrl + Z 然后回车
```

**验证是否成功**：
- 看到命令行提示符（`$`、`>`或`PS>`），说明已退出
- Claude Code的"You:"提示消失

> ⚠️ **注意**：退出前记得保存重要对话（使用`/save`命令）！

---

#### /clear - 清空对话历史

**这是什么？**
删除当前对话的所有历史记录，重新开始一个"干净"的对话。

**类比**：就像清空微信聊天记录，从头开始新的对话。

**为什么要清空？**

**✅ 适用场景**：
1. 开始新任务（上一个任务完成，要做完全不同的事）
2. 对话太长（历史记录过多影响性能）
3. 切换主题（完全换一个话题）

**❌ 不要清空的场景**：
1. 正在解决问题中途（会丢失上下文）
2. 需要参考之前的内容
3. 还没确定任务完成

**怎么用？**

```bash
> /clear

# 预期输出：
Conversation cleared.
CLAUDE.md configuration retained.
```

> 💡 **重要**：清空后CLAUDE.md配置文件的内容还在，不会丢失项目配置！

**实战案例**：

```bash
# 任务1：修复登录Bug
> Fix the login bug in auth.js
> ...(完成修复)
> Test the fix
> ...(测试通过)

# 清空后开始任务2
> /clear
> Add a new password reset feature
```

---

#### /compact - 压缩对话历史

**这是什么？**
把对话历史压缩简化，保留关键信息，删除冗余内容，节省Token但不丢失重要上下文。

**类比**：就像整理房间，扔掉不重要的东西，保留必需品。房间还是你的房间，只是更整洁了。

**为什么要压缩？**

**问题场景**：
- 对话太长，响应变慢
- Token使用接近上限（180K）
- 想节省成本但需要保留上下文

**怎么用？**

```bash
> /compact

# 预期输出：
Conversation compacted.
Key information retained.
Token usage reduced by 45%
```

**/clear vs /compact 对比**：

| 命令 | 效果 | 保留内容 | Token节省 | 使用场景 |
|------|------|----------|-----------|----------|
| `/clear` | 完全清空 | 仅CLAUDE.md | 100% | 换任务 |
| `/compact` | 压缩历史 | 关键信息 | 40-60% | 继续任务 |

**什么时候用？**

> 💡 **小白解释**：100K tokens大约等于7.5万个英文单词，或者5万个中文字。一次普通对话约用1-2K tokens，所以100K大概是50-100轮对话的量。

**Token使用直观对比**：

| 对话轮数 | 约消耗Token | 占比（总200K） |
|---------|------------|--------------|
| 10轮简单对话 | ~10-20K | 5-10% ✅ 很健康 |
| 50轮正常对话 | ~50-100K | 25-50% ⚠️ 建议压缩 |
| 100轮长对话 | ~100-180K | 50-90% 🔴 必须压缩！ |

```bash
# 场景1：对话很长但需要保留上下文
> /compact

# 场景2：上下文快满（看到Warning）
Token usage: 175K / 200K (88%) ⚠️
> /compact

# 场景3：性能下降但需要继续
Response time: 15s (slow)
> /compact
```

---

### 3.2 Extended Thinking（扩展思考模式）

Extended Thinking让Claude在回答前进行深度思考，显著提升复杂问题的解答质量。

> ⚠️ **重要说明**：Extended Thinking**不是Slash命令**！它是通过Tab键或关键词触发的功能。

#### 这是什么？

Extended Thinking（扩展思考）是Claude的一个特性，让AI在给出答案前先进行结构化的深度思考。

**类比**：就像数学考试，有人直接写答案，有人写完整解题过程。Extended Thinking就是让Claude展示"解题过程"。

#### 如何启用？

**方法1：Tab键切换（推荐，最简单）**

在Claude Code交互模式中：
```
按 Tab 键 → 打开/关闭Extended Thinking
```

**效果**：
- Claude Code界面会显示当前状态（ON/OFF）
- 开启后，Claude所有回答都会先思考
- 关闭后，恢复正常回答

**类比**：就像开关灯，按一下开，再按一下关。

**方法2：在提示词中使用关键词（精确控制）**

不用Tab键，直接在问题中加关键词：

```bash
> think about how to optimize this sorting algorithm

> think hard about the system architecture design

> think harder about potential security issues

> ultrathink this critical technology decision
```

**关键词等级**（Token消耗和思考深度递增）：

| 关键词 | Token预算 | 响应时间 | 思考深度 | 适用场景 |
|--------|-----------|----------|----------|----------|
| `think` | ~1,500 | 中（5-10秒） | 基础分析 | 一般问题 |
| `think hard` | ~3,000 | 慢（10-20秒） | 深度分析 | 复杂问题 |
| `think harder` | ~8,000 | 较慢（20-30秒） | 全面分析 | 架构决策 |
| `ultrathink` | ~16,000 | 很慢（30-60秒） | 穷尽分析 | 关键决策 |

#### 为什么要用Extended Thinking？

**✅ 适用场景**：
1. **复杂算法问题**：需要比较多个优化方案
2. **系统架构设计**：需要权衡多种技术选型
3. **性能优化分析**：需要深入分析瓶颈
4. **安全漏洞排查**：需要全面检查风险

**❌ 不适用场景**：
1. **简单语法查询**：浪费时间和Token
2. **快速问答**：直接回答就够了
3. **已知操作**：不需要深入思考

#### 实战示例

**案例1：算法优化（使用think hard关键词）**

```bash
> think hard about optimizing this function for 1 million records

💭 Deep Thinking...
[Claude会展示详细的分析过程]
- 当前实现分析：O(n²)复杂度
- 性能瓶颈识别：嵌套循环
- 优化方案对比：
  1. HashMap查找（时间O(n)，空间O(n)）
  2. 排序+二分查找（时间O(n log n)，空间O(1)）
  3. Set去重（时间O(n)，空间O(n)）
- 权衡分析：考虑内存限制...

✅ Recommendation:
基于你的场景（大数据量，内存充足），推荐使用HashMap方案...
[详细实现代码]
```

**案例2：架构决策（使用ultrathink关键词）**

```bash
> ultrathink whether we should use microservices or monolith

💭 Ultra-deep Analysis...
[Claude进行穷尽分析]
- 团队规模评估：5人 → 建议单体起步
- 复杂度分析：中等 → 暂不需要微服务
- 技术债务考虑：...
- 运维成本对比：...
- 迁移路径规划：...

✅ Decision Framework:
考虑你的实际情况（团队5人，中等复杂度），
建议采用"模块化单体"架构起步...
[详细架构方案]
```

#### 省钱技巧

> 💡 **重要**：Extended Thinking会消耗更多Token！只在真正需要深度分析时使用！

**省钱对比**：

| 使用方式 | Token消耗 | 适合场景 |
|---------|----------|----------|
| 普通提问 | ~500 | 简单问题，够用 |
| think | ~1,500 | 需要分析的问题 |
| think hard | ~3,000 | 复杂设计问题 |
| ultrathink | ~16,000 | 关键决策（慎用！）|

**建议**：
- ✅ 简单问题直接问（省70% Token）
- ✅ 一般问题用`think`（够用）
- ✅ 只在关键决策时用`ultrathink`

---

### 3.3 Rewind/Checkpoint功能（重要！）

Claude Code 2.0引入的革命性功能，让你可以大胆实验而无需担心破坏代码！

#### 什么是Rewind/Checkpoint？

**简单说**：Checkpoint（检查点）就像游戏的"存档点"，Rewind（回退）就是"读档"功能。

**类比**：
- **没有Checkpoint**：就像玩游戏不存档，打BOSS失败就要从头开始
- **有Checkpoint**：就像玩游戏随时存档，打不过BOSS就读档重来，轻松多了！

**核心价值**：
1. ✅ **安全实验**：大胆尝试重构，随时可以回退
2. ✅ **上下文清理**：不仅回退代码，还能清理"被污染"的AI对话状态
3. ✅ **比Git更强**：Git只管代码，Checkpoint同时管理代码和AI对话状态
4. ✅ **零配置**：自动工作，无需手动设置

#### 工作原理图解

```
时间轴：
T1 ────── T2 ────── T3 ────── T4 ────── T5 (当前)
 │        │         │         │         │
[原始]   [改A]     [改B]     [改C]     [改D]
[对话0]  [对话1]   [对话2]   [对话3]   [对话4]
 │        │         │         │         │
 └────────┴─────────┴─────────┴─────────┘
            可回退到任意检查点
```

#### 怎么使用Rewind？

**方法一：双击Escape键（推荐）**

```bash
# 在交互模式中，快速按两次Escape键
You: [正在输入...发现需要回退]

[按 Esc + Esc]

╭─────────────────────────────────────────╮
│            Rewind Menu                   │
├─────────────────────────────────────────┤
│  Select a checkpoint to rewind to:       │
│                                          │
│  [1] 10:30:15 - Initial state           │
│  [2] 10:32:45 - Added auth module        │
│  [3] 10:35:20 - Modified database.py     │
│  [4] 10:38:10 - Created new tests        │
│  [5] 10:40:30 - Refactored API (current) │
│                                          │
│  [c] Cancel                              │
╰─────────────────────────────────────────╯

Select checkpoint (1-5 or c):
```

**方法二：使用/rewind命令**

```bash
> /rewind

Available checkpoints:
1. [10:30:15] Initial state
   Files: (none modified)

2. [10:32:45] Added auth module
   Files: +src/auth.py, +src/auth_test.py

3. [10:35:20] Modified database.py
   Files: ~src/database.py

Enter checkpoint number to rewind (or 'cancel'):
```

#### 三种恢复选项

Rewind提供三种恢复策略：

> 💡 **小白决策指南**：不知道选哪个？看下面的场景对照表！

**选项1：仅恢复对话（Conversation Only）**

```bash
Rewind Options:
[1] Conversation only - Keep code changes, reset AI context
[2] Code only - Keep conversation, revert file changes
[3] Both - Restore both code and conversation

Select option: 1

✓ Conversation rewound to checkpoint 3
✓ Code changes preserved
✓ AI context refreshed
```

**什么时候选这个？**
- 场景：AI理解出现偏差，但代码修改是正确的
- 举例：你让AI"优化性能"，他理解成"删除代码"，执行了错误的操作，但碰巧代码改动是对的
- 效果：清除AI的错误理解，保留正确的代码改动

**选项2：仅恢复代码（Code Only）**

```bash
Select option: 2

Reverting files:
  ↩ src/api.py (restored)
  ↩ src/routes.py (restored)
  + src/old_api.py (restored deleted file)

✓ Code reverted to checkpoint 3
✓ Conversation history preserved
```

**什么时候选这个？**
- 场景：代码改坏了，但对话中有有价值的分析
- 举例：AI给了很好的优化建议，但代码实现出错了，你想保留建议，重新实现
- 效果：恢复代码到之前的状态，保留AI的分析和建议

**选项3：同时恢复（Both）**

```bash
Select option: 3

Restoring checkpoint 3...
  ↩ Reverting 3 file changes
  ↩ Clearing 2 conversation turns

✓ Full state restored to checkpoint 3
```

**什么时候选这个？**
- 场景：完全走错方向，想从头来
- 举例：整个讨论方向都错了，代码也改坏了，想回到之前的"干净"状态
- 效果：代码和对话全部恢复，完全重来

**快速决策表**：

| 情况 | 代码对吗？ | 对话有用吗？ | 选哪个？ |
|------|-----------|------------|---------|
| AI理解错了，但代码碰巧对 | ✅ | ❌ | 选项1（只恢复对话） |
| 代码改错了，但分析有用 | ❌ | ✅ | 选项2（只恢复代码） |
| 全错了，从头来 | ❌ | ❌ | 选项3（全部恢复） |
| 都对，不需要回退 | ✅ | ✅ | 按Cancel |

#### 自动检查点机制

Claude Code会在以下情况**自动**创建检查点：

| 触发条件 | 说明 |
|---------|------|
| 文件修改前 | 每次Write/Edit工具调用前 |
| 批量操作前 | 涉及多文件的操作前 |
| 危险命令前 | 执行rm、git reset等命令前 |
| 会话开始时 | 新会话自动创建初始检查点 |
| 用户手动请求 | 使用/checkpoint命令 |

**⚠️ Checkpoint重要限制（必读！）**：

> **Critical提示**：Checkpoint**只追踪Claude的文件编辑工具**（Write、Edit）修改的文件，**不追踪bash命令修改**！

**什么意思？**

**✅ 会被Checkpoint追踪**：
```bash
> 修改src/app.py文件，添加日志功能
（Claude用Edit工具修改）→ ✅ 会创建checkpoint
```

**❌ 不会被Checkpoint追踪**：
```bash
> 运行bash命令：mv src/old.py src/new.py
（bash命令修改）→ ❌ 不会创建checkpoint，无法回退！
```

**为什么这样设计？**
- Checkpoint只追踪Claude直接修改的文件
- bash命令是用户或外部工具执行的，Claude无法完全控制
- 这是安全设计，避免误追踪系统命令的副作用

**最佳实践**：
- ✅ **重要操作用Claude的文件工具**（让他用Edit/Write修改）
- ✅ **配合Git使用**（bash命令用Git保护）
- ❌ 不要依赖Checkpoint保护bash命令的修改

**检查点存储位置**：

```bash
~/.claude/checkpoints/
├── project_abc123/
│   ├── checkpoint_001.json    # 检查点元数据
│   ├── checkpoint_001/        # 文件快照
│   └── ...
└── project_def456/
    └── ...
```

> 💡 **重要**：Checkpoint是**完全自动**的！每次Claude修改文件前自动创建。你只需要在需要回退时用`/rewind`或双击Esc即可！没有手动创建或管理检查点的命令。

#### Rewind使用最佳实践

**实践1：大胆实验，随时回退**

```bash
> 我想尝试激进的重构方案

# Claude会自动在每次修改前创建checkpoint
# 你只管大胆实验，不满意就双击Esc回退！

[尝试方案1]
[不满意，按 Esc + Esc → 回退]

[尝试方案2]
[还是不满意，按 Esc + Esc → 回退]

[尝试方案3]
满意！保留这个！
```

**实践2：多方案对比**

```bash
> 我想对比三种缓存实现方案

# 方案1：Redis缓存
> 实现Redis缓存方案
[Claude实现并自动创建checkpoint]

# 回退尝试方案2
[按 Esc + Esc → 选择回到开始]

# 方案2：Memcached
> 实现Memcached方案
[Claude实现并自动创建checkpoint]

# 回退尝试方案3
[按 Esc + Esc → 选择回到开始]

# 方案3：本地LRU缓存
> 实现本地LRU缓存
[Claude实现]

# 最后通过/rewind菜单选择最佳方案
```

**实践3：清理被污染的上下文**

```bash
# 场景：AI对问题的理解出现偏差
> [一系列基于错误理解的对话]

# 发现问题后
> [按 Esc + Esc]

# 选择"仅恢复对话"
Select option: 1 (Conversation only)

✓ AI context refreshed

# 重新清晰地描述需求
> 让我重新说明需求。我需要的是...
```

**实践4：与Git配合使用**

```bash
> 我已经完成了功能开发，准备提交

Claude建议的流程：
1. 当前已有checkpoint保护工作状态
2. 运行测试确认一切正常
3. 创建Git提交
4. 如果后续发现问题，可以用Rewind回到提交前状态

Running tests...
✓ All tests passed

Creating git commit...
git add -A
git commit -m "feat: add user authentication module"
✓ Committed: abc123

# 即使已经commit，checkpoint仍然可用于回退工作目录
```

> 💡 **重要提示**：Checkpoint是本地功能，不会影响Git历史！它比Git更灵活，可以回退AI的对话状态！

---

### 3.4 会话管理命令（进阶）

会话管理命令帮助你恢复和导出对话历史，实现工作延续。

> ⚠️ **重要**：Claude Code会话是**自动保存**的！不需要手动/save命令。

#### /resume - 恢复会话

**这是什么？**
快速恢复最近的会话或指定会话ID，继续之前的工作。

**类比**：就像浏览器的"恢复上次会话"，一键继续上次的工作。

**怎么用？**

**方法1：命令行快速恢复（最常用）**

```bash
# 恢复最近的会话
$ claude --continue
# 或简写
$ claude -c

# 恢复指定会话ID
$ claude --resume ses_abc123
# 或简写
$ claude -r ses_abc123
```

**方法2：交互模式中恢复**

```bash
> /resume

Recent Sessions:
─────────────────────────────────────────────────────
ID          Date        Project           Summary
─────────────────────────────────────────────────────
ses_abc123  Today 10:30 my-app           Auth module
ses_def456  Today 09:15 my-app           Bug fixes
ses_ghi789  Yesterday   other-project    API design
─────────────────────────────────────────────────────

Enter session ID (or number 1-4):
```

**什么时候用？**
- ✅ 每天早上开始工作（`claude -c`恢复昨天的会话）
- ✅ 电脑重启后继续工作
- ✅ 在多个项目间快速切换

**最佳实践**：

```bash
# 技巧：别名配置
alias cr="claude -c"  # cr = claude resume

# 使用
$ cr  # 一键恢复最近会话
```

---

#### /export - 导出对话

**这是什么？**
把对话导出为Markdown、JSON或HTML格式，方便阅读、分享或存档。

**类比**：就像微信的"导出聊天记录"。

**怎么用？**

```bash
# 默认导出（Markdown格式）
> /export

Exported to: conversation-export-2025-12-17.md

# 导出到剪贴板
> /export --clipboard

✓ Copied to clipboard

# 指定格式
> /export --format json
> /export --format html
```

**导出格式对比**：

| 格式 | 适合场景 | 优点 |
|------|----------|------|
| Markdown | 阅读、文档 | 格式清晰，可编辑 |
| JSON | 程序处理 | 结构化，易解析 |
| HTML | 分享、网页展示 | 美观，可直接浏览 |

**什么时候用？**
- ✅ 重要的解决方案想保留
- ✅ 需要分享给团队成员
- ✅ 创建项目文档

---

#### /rename - 重命名会话

**这是什么？**
重命名当前对话，方便以后查找。

**怎么用？**

```bash
> /rename

Current name: conversation-2025-12-17-14-30
New name: auth-module-implementation

✓ Conversation renamed
```

**命名建议**：
- 使用描述性名称（不要用日期）
- 格式：`[项目]-[功能]-[版本]`
- 示例：`my-app-login-api`、`bug-fix-payment`

---

#### 会话管理工作流

**完整工作流示例**：

```bash
# 第一天：开始新任务
$ claude
> Start refactoring authentication system
> [工作中...]

# 第一天结束：会话自动保存，直接退出
> /exit

# 第二天：恢复继续
$ claude -c  # 一键恢复昨天的会话
> Continue refactoring...

# 完成后：导出为文档
> /rename auth-refactor-complete
> /export ~/docs/sessions/auth-refactoring.md
```

**省心提示**：
- ✅ 会话自动保存，不用担心丢失
- ✅ 用`claude -c`快速恢复
- ✅ 重要会话用/export导出备份
- ✅ 用/rename给会话起个好名字

---

### 3.5 Extended Thinking深度补充

补充扩展思考模式的详细说明和高级用法。

#### Token预算详细对比

| 模式 | Token预算 | 响应时间 | 思考深度 | 适用场景 |
|------|-----------|----------|----------|----------|
| 普通模式 | ~100-500 | 快（2-5秒） | 直接回答 | 简单问题 |
| `think` | ~500-1500 | 中（5-10秒） | 基础分析 | 一般问题 |
| `think hard` | ~1500-3000 | 慢（10-20秒） | 深度分析 | 复杂问题 |
| `think harder` | ~3000-8000 | 较慢（20-30秒） | 全面分析 | 架构决策 |
| `ultrathink` | ~8000-16000 | 很慢（30-60秒） | 穷尽分析 | 关键决策 |

> 💡 **省钱技巧**：简单问题直接问，只在需要深度分析时用关键词触发，能省60%以上Token！

#### 思考过程详细展示示例

**示例：分析递归代码复杂度**

```bash
> think about analyzing the time complexity of this recursive code

Claude:
─────── Thinking ───────
让我分析这段递归代码：

1. 首先识别递归模式：
   - 函数 fib(n) 调用 fib(n-1) 和 fib(n-2)
   - 基准情况是 n <= 1

2. 构建递归树：
   - 每次调用产生2个子调用
   - 树的深度是 n
   - 所以总调用次数约为 2^n

3. 精确分析：
   - T(n) = T(n-1) + T(n-2) + O(1)
   - 这正好是斐波那契递推
   - 所以 T(n) ≈ O(φ^n)，其中φ是黄金比例

4. 空间复杂度：
   - 递归栈深度为 n
   - 所以空间复杂度是 O(n)
────────────────────────

**分析结果**：

这段递归斐波那契代码的复杂度是：
- **时间复杂度**：O(2^n)
- **空间复杂度**：O(n)

建议优化方案：
1. 使用动态规划（时间O(n)，空间O(n)）
2. 使用记忆化（时间O(n)，空间O(n)）
3. 使用迭代（时间O(n)，空间O(1)）

[详细代码实现...]
```

#### 何时使用哪种等级？

**快速决策表**：

| 问题类型 | 推荐等级 | 举例 |
|---------|---------|------|
| 语法查询 | 普通模式 | "Python list语法是什么？" |
| 代码分析 | think | "think about why this code is slow" |
| 架构设计 | think hard | "think hard about API design" |
| 技术选型 | ultrathink | "ultrathink database choice" |

---

### 3.6 重要的实用命令

补充几个非常实用但容易被忽略的命令！

#### /context - 可视化上下文使用

**这是什么？**
用彩色网格可视化显示当前对话的上下文使用情况。

**类比**：就像手机的存储空间显示，告诉你用了多少，还剩多少。

**怎么用？**

```bash
> /context

Context Usage Visualization:
████████████░░░░░░░░  60% (120K / 200K tokens)

Breakdown:
- User messages: 45K
- Claude responses: 60K
- Code context: 15K

Recommendation: Context usage healthy
```

**什么时候用？**
- ✅ 想知道还能聊多少轮
- ✅ 对话很长时检查是否需要/compact
- ✅ 了解Token主要用在哪里

---

#### /cost - 显示会话成本

**这是什么？**
显示当前会话的总成本和持续时间。

**类比**：就像打车时看计价器，知道花了多少钱。

**怎么用？**

```bash
> /cost

Session Cost & Duration:
=======================
Duration: 45 minutes
Input tokens: 12,340
Output tokens: 23,456
Total cost: $0.42

Model: claude-sonnet-4.5
Started: 10:30 AM
```

**什么时候用？**
- ✅ 想知道这次对话花了多少钱
- ✅ 对比不同模型的成本
- ✅ 控制预算

**省钱提示**：看到成本高时，考虑用/compact压缩或切换到更便宜的模型！

---

#### /stats - 使用统计

**这是什么？**
显示你的Claude Code使用统计和活动情况。

**怎么用？**

```bash
> /stats

Your Claude Code Statistics:
============================
This Week:
- Sessions: 23
- Messages: 456
- Tokens used: 234K
- Total cost: $12.34

This Month:
- Sessions: 89
- Messages: 1,234
- Tokens used: 890K
- Total cost: $45.67

Most used commands:
1. /clear (45 times)
2. /compact (23 times)
3. /export (12 times)
```

**什么时候用？**
- ✅ 了解自己的使用习惯
- ✅ 每月查看花费
- ✅ 优化使用方式

---

#### /status - 完整状态信息

**这是什么？**
显示Claude Code的完整状态，包括版本、模型、账户、连接状态等。

**类比**：就像手机的"关于本机"，显示所有系统信息。

**怎么用？**

```bash
> /status

Claude Code Status:
===================
Version: 2.0.71
Model: claude-sonnet-4.5
Account: Pro Plan
API Status: ✓ Connected (45ms)

Current Session:
- Messages: 23
- Tokens: 12K / 200K (6%)
- Duration: 15 minutes

Working Directory: /Users/you/my-project
CLAUDE.md: ✓ Found
```

**什么时候用？**
- ✅ 检查当前使用的模型
- ✅ 确认API连接状态
- ✅ 查看Token使用情况
- ✅ 排查问题时的第一步

---

#### /model - 切换AI模型

**这是什么？**
快速切换Claude Code使用的AI模型。

**类比**：就像切换手机的性能模式（省电模式、平衡模式、性能模式）。

**怎么用？**

```bash
> /model

Available Models:
1. claude-sonnet-4.5 (Current) - 平衡性能和成本
2. claude-opus-4.5 - 最强性能，成本最高
3. claude-haiku-4 - 最快速度，成本最低

Select model (1-3): 2

✓ Switched to claude-opus-4.5
```

**什么时候切换？**
- ✅ 简单任务用Haiku（省钱）
- ✅ 日常开发用Sonnet（平衡）
- ✅ 关键决策用Opus（最强）

**省钱技巧**：
```bash
# 简单的代码格式化
> /model haiku
> 格式化这个文件
> /model sonnet  # 完成后切回

省了70%成本！
```

---

##  第四部分：配置命令（简化版）

由于篇幅限制，第四部分我们快速过一遍核心配置命令。

### 4.1 claude config list - 查看配置

**一句话说明**：显示所有配置项和当前值。

```bash
$ claude config list

Global Configuration:
  model: claude-sonnet-4.5
  max-tokens: 4096
  temperature: 0.7

Project Configuration:
  (No project-specific config)
```

---

### 4.2 claude config set - 设置配置

**一句话说明**：修改配置项的值。

```bash
# 设置全局配置
claude config set --global model claude-opus-4.5
claude config set --global max-tokens 8192

# 设置项目配置
claude config set --project model claude-sonnet-4.5
```

**配置优先级**：项目配置 > 全局配置 > 默认值

---

### 4.3 claude config get - 获取配置

**一句话说明**：获取特定配置项的值。

```bash
$ claude config get model
claude-sonnet-4.5
```

---

### 4.4 claude config unset - 删除配置（补充！）

**这是什么？**
删除指定的配置项，恢复为默认值。

**类比**：就像删除浏览器的自定义设置，恢复出厂默认值。

**为什么需要unset？**

**问题场景**：
- 你设置了`model=claude-opus-4.5`，现在想用回默认的Sonnet
- 用`reset`会删除所有配置，太暴力
- 用`unset`只删除这一项，精准控制！

**怎么用？**

```bash
# 删除全局配置
$ claude config unset --global verbose
✓ Deleted: verbose (global)
Now using default: verbose=false

# 删除项目配置
$ claude config unset --project model
✓ Deleted: model (project)
Now using global: model=claude-sonnet-4.5

# 删除后验证
$ claude config get verbose
false (default)
```

**对比reset和unset**：

| 命令 | 效果 | 使用场景 |
|------|------|----------|
| `unset <key>` | 删除单个配置项 | 精确控制，只改一项 |
| `reset` | 删除所有配置 | 彻底重置，全部恢复默认 |

**实战示例**：

```bash
# 场景：临时测试用了Opus模型，现在想恢复Sonnet
$ claude config set --global model claude-opus-4.5
# [测试了一段时间]

# 删除Opus设置，恢复默认Sonnet
$ claude config unset --global model
✓ Deleted: model (global)
Now using default: claude-sonnet-4.5

# 而不是用reset（会删除所有配置）
```

---

### 4.5 claude config reset - 重置配置

**一句话说明**：恢复配置到默认值。

```bash
# 重置全局配置
claude config reset --global

# 重置项目配置
claude config reset --project
```

> ⚠️ **警告**：重置会删除所有自定义配置，请先备份！

---

### 4.6 配置文件直接编辑（进阶）

> ⚠️ **警告**：这是进阶操作，新手建议使用`claude config`命令而不是直接编辑JSON文件！

**什么时候需要直接编辑？**
- ✅ 批量修改多个配置项
- ✅ 导入别人的配置文件
- ✅ 备份和恢复配置

**配置文件位置**：

**全局配置**：
```
macOS/Linux: ~/.claude/config.json
Windows: C:\Users\YourName\.claude\config.json
```

**项目配置**：
```
项目根目录/.claude/config.json
```

**配置文件格式示例**：

```json
{
  "model": "claude-sonnet-4.5",
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
  "checkpointEnabled": true
}
```

**如何安全编辑**：

**步骤1：先备份**
```
cp ~/.claude/config.json ~/.claude/config.backup.json
```

**步骤2：使用编辑器打开**
```
nano ~/.claude/config.json
```
或
```
code ~/.claude/config.json
```

**步骤3：修改后验证JSON格式**
```
cat ~/.claude/config.json | jq .
```

如果jq报错，说明JSON格式有问题，立即恢复备份：
```
mv ~/.claude/config.backup.json ~/.claude/config.json
```

**步骤4：验证配置生效**
```
claude config list
```

**常见JSON格式错误**：

```json
# ❌ 错误：最后一项多了逗号
{
  "model": "claude-sonnet-4.5",
  "verbose": true,  ← 这里不应该有逗号
}

# ✅ 正确
{
  "model": "claude-sonnet-4.5",
  "verbose": true
}
```

> 💡 **老金建议**：除非你很熟悉JSON格式，否则还是用`claude config set`命令更安全！直接编辑容易出错！

---

## 第五部分：高级功能简介（快速了解）

> 📌 **说明**：这部分是高级功能的快速介绍，让你知道有这些功能。详细用法会在后续进阶课程中讲解。

### 5.1 MCP服务器 - 扩展Claude的能力

**这是什么？**
MCP（Model Context Protocol）是插件系统，让Claude Code可以连接外部工具和服务。

**类比**：就像Chrome浏览器的扩展插件，安装后浏览器就有了新功能。

**能做什么？**
- 🔧 文件系统操作（@anthropic/filesystem）
- 🔧 Git版本控制（@anthropic/git）
- 🔧 数据库查询（@anthropic/database）
- 🔧 网络爬虫（@anthropic/web-scraper）
- 🔧 还有几百个社区插件...

**快速上手**：

```bash
# 运行MCP向导
$ claude mcp

# 选择操作
1. Add new MCP server     # 添加新服务器
2. List installed servers # 查看已安装
3. Remove server          # 删除服务器

# 在交互模式中使用
> /mcp-list
Installed MCP Servers:
1. filesystem (Active)
2. git (Active)
```

> 💡 **学习建议**：初学者先掌握基础命令，1个月后再学MCP！

---

### 5.2 Skills - 给Claude加载专业知识

**这是什么？**
Skills是技能包，给Claude注入特定领域的专业知识。

**类比**：就像请专家顾问，需要SEO专家时加载SEO Skill，需要安全专家时加载Security Skill。

**能做什么？**
- 📚 SEO优化（google-seo）
- 📚 Python最佳实践（python-expert）
- 📚 React开发模式（react-patterns）
- 📚 安全审计（security-audit）
- 📚 你也可以创建自己的技能包...

**快速上手**：

```bash
# 查看可用Skills
> /skills

Available Skills:
1. google-seo - SEO优化
2. python-expert - Python专家

# Skills会自动激活（当检测到相关任务）
> Review this webpage for SEO
[Skill: google-seo activated] ✨
Analyzing...
```

> 💡 **学习建议**：学完MCP后再学Skills，它们是配合使用的！

---

### 5.3 Hooks - 自动化工作流

**这是什么？**
Hooks是自动触发的脚本，在特定时机自动执行（比如写文件前自动格式化代码）。

**类比**：就像汽车的自动大灯，天黑了自动开灯，不用你手动操作。

**能做什么？**
- ⚡ 代码写入前自动格式化
- ⚡ 文件修改前自动备份
- ⚡ Git提交前自动检查代码质量
- ⚡ 任务完成后自动发送通知

**快速了解**：

```bash
# 查看配置的Hooks
> /hooks

Configured Hooks:
PreToolUse Hooks (2):
1. code-formatter     # 写代码前自动格式化
2. security-scanner   # 写文件前安全扫描

PostToolUse Hooks (1):
1. auto-backup        # 修改后自动备份
```

> 💡 **学习建议**：这是最高级的功能，建议至少使用Claude Code 3个月后再学！

---

### 5.4 CLAUDE.md配置层级（重要！）

CLAUDE.md是Claude Code的灵魂配置文件，理解其层级系统对于团队协作至关重要。

#### 什么是CLAUDE.md配置层级？

**简单说**：Claude Code支持多层级的CLAUDE.md配置文件，就像CSS的优先级一样，更具体的配置会覆盖更通用的配置。

**类比**：
- **个人偏好**（用户级）：就像你的手机主题设置，所有App都遵循
- **项目规范**（项目级）：就像公司的着装要求，在公司时必须遵守
- **模块规则**（模块级）：就像某个部门的特殊要求，只在该部门适用

#### 配置层级结构

```
优先级（从高到低）：
══════════════════════════════════════════════════
1. [企业级] Enterprise Policy（最高优先级）
   位置：由管理员配置，不可覆盖的安全策略

2. [模块级] Module Rules
   位置：.claude/rules/*.md 或子目录CLAUDE.md
   作用：特定模块的规则

3. [项目级] Project CLAUDE.md
   位置：./CLAUDE.md（项目根目录）
   作用：团队共享的项目规范

4. [用户级] User CLAUDE.md
   位置：~/.claude/CLAUDE.md
   作用：个人偏好设置（最低优先级）
══════════════════════════════════════════════════
```

**合并示例**：

```
~/.claude/CLAUDE.md（用户级）
├── 偏好：使用中文回复
├── 风格：简洁直接
└── 工具：允许所有

./CLAUDE.md（项目级）
├── 语言：TypeScript
├── 风格：详细注释
└── 规范：Google风格

./src/api/CLAUDE.md（模块级）
├── 特殊：REST API规范
└── 测试：每个端点必须有测试

合并结果（在./src/api/目录工作时）：
├── 偏好：使用中文回复（用户级）
├── 风格：详细注释（项目级覆盖用户级）
├── 语言：TypeScript（项目级）
├── 规范：Google风格（项目级）
├── 特殊：REST API规范（模块级追加）
└── 测试：每个端点必须有测试（模块级追加）
```

#### 用户级配置：~/.claude/CLAUDE.md

**位置**：`~/.claude/CLAUDE.md`（所有项目共享）

**适合放置的内容**：

```markdown
# 个人Claude Code配置

## 语言偏好
- 始终使用中文回复
- 代码注释使用英文

## 通用编码风格
- 优先使用函数式编程风格
- 变量命名使用camelCase
- 提交信息使用Conventional Commits格式

## 个人工具偏好
- 优先使用vim键位
- 生成代码时自动添加类型注解
- 错误处理使用try-catch而非.catch()

## 通用安全规则
- 永不在代码中硬编码密钥
- 始终验证用户输入
- 敏感操作需要确认
```

**不适合放置的内容**：

```markdown
# ❌ 以下内容不应放在用户级配置

# 项目特定的依赖
- 使用React 18
- 使用Prisma ORM

# 团队规范
- PR必须有两人review

# 项目架构
- 使用微服务架构
```

#### 项目级配置：./CLAUDE.md

**位置**：项目根目录的 `CLAUDE.md`

**推荐结构**：

```markdown
# ProjectName - Claude Code配置

## 项目概述
- **名称**：MyAwesomeApp
- **类型**：Web应用
- **状态**：开发中

## 技术栈
- 前端：React 18 + TypeScript
- 后端：FastAPI + Python 3.11
- 数据库：PostgreSQL 15
- 缓存：Redis 7

## 目录结构
src/
├── frontend/     # React前端
├── backend/      # FastAPI后端
├── shared/       # 共享类型
└── scripts/      # 工具脚本

## 编码规范
### 通用规则
- 所有代码必须有类型注解
- 每个公开函数必须有文档字符串
- 测试覆盖率不低于80%

### 前端规范
- 使用函数组件和Hooks
- 状态管理使用Zustand
- 样式使用Tailwind CSS

### 后端规范
- API遵循REST规范
- 使用Pydantic进行数据验证
- 错误响应遵循RFC 7807

## Git规范
- 分支命名：feature/xxx, bugfix/xxx, hotfix/xxx
- 提交格式：type(scope): description
- PR必须通过CI检查

## 重要文件
- API文档：docs/api.md
- 部署指南：docs/deployment.md
- 变更日志：CHANGELOG.md
```

**检入Git的建议**：

```bash
# CLAUDE.md应该检入版本控制
git add CLAUDE.md
git commit -m "docs: add Claude Code configuration"

# 团队成员将自动获得相同的AI助手配置
```

#### 模块级配置：.claude/rules/

**位置**：`.claude/rules/*.md` 或子目录的 `CLAUDE.md`

**场景1：按功能分类的规则**

```
.claude/
└── rules/
    ├── api-rules.md      # API相关规则
    ├── database-rules.md # 数据库相关规则
    ├── security-rules.md # 安全相关规则
    └── testing-rules.md  # 测试相关规则
```

**示例：.claude/rules/api-rules.md**

```markdown
# API开发规则

## 端点命名
- 使用复数名词：/users, /posts, /comments
- 使用连字符：/user-profiles, /order-items

## 响应格式
- 成功：{ "data": ..., "meta": ... }
- 错误：{ "error": { "code": "...", "message": "..." } }

## HTTP状态码
- 200：成功
- 201：创建成功
- 400：请求错误
- 401：未认证
- 403：未授权
- 404：未找到
- 500：服务器错误

## 必需的中间件
- 认证：authMiddleware
- 限流：rateLimitMiddleware
- 日志：loggingMiddleware
```

**场景2：子目录专用配置**

```
src/
├── api/
│   ├── CLAUDE.md      # API模块专用配置
│   └── routes.py
├── models/
│   ├── CLAUDE.md      # 数据模型专用配置
│   └── user.py
└── services/
    ├── CLAUDE.md      # 服务层专用配置
    └── auth.py
```

#### @import语法

使用 `@`语法可以导入其他Markdown文件，保持主配置文件简洁。

**基本用法**：

```markdown
# CLAUDE.md

## 项目概述
这是一个电商平台项目。

## 详细规范
@docs/coding-standards.md
@docs/api-guidelines.md
@docs/database-schema.md

## 团队信息
@docs/team-contacts.md
```

**导入解析**：

```
CLAUDE.md
├── 直接内容：项目概述
├── @docs/coding-standards.md → 导入编码规范
├── @docs/api-guidelines.md → 导入API指南
├── @docs/database-schema.md → 导入数据库架构
└── @docs/team-contacts.md → 导入团队信息

Claude读取时，所有导入的文件内容会被合并
```

**推荐的导入组织方式**：

```markdown
# 1. 规范类导入
@docs/standards/code-style.md
@docs/standards/naming-convention.md

# 2. 架构类导入
@docs/architecture/overview.md
@docs/architecture/data-flow.md

# 3. 上下文类导入
@docs/context/business-rules.md
@docs/context/domain-terms.md

# 4. 工作流类导入
@docs/workflow/development.md
@docs/workflow/deployment.md
```

#### 优先级与合并规则

**冲突解决规则**：

```
规则：更具体的配置覆盖更通用的配置

示例：
~/.claude/CLAUDE.md:      "使用2空格缩进"
./CLAUDE.md:              "使用4空格缩进"
./src/legacy/CLAUDE.md:   "使用Tab缩进"

结果：
- 在./src/legacy/目录：使用Tab缩进
- 在./src/其他目录：使用4空格缩进
- 在其他项目：使用2空格缩进
```

**追加vs覆盖**：

```markdown
# 追加行为（列表类配置）
~/.claude/CLAUDE.md:
  忽略文件：node_modules, .git

./CLAUDE.md:
  忽略文件：dist, build

合并结果：
  忽略文件：node_modules, .git, dist, build  # 追加

# 覆盖行为（单值配置）
~/.claude/CLAUDE.md:
  首选语言：中文

./CLAUDE.md:
  首选语言：英文

合并结果：
  首选语言：英文  # 覆盖
```

#### CLAUDE.md最佳实践

**DO（推荐做法）**：

```markdown
# ✅ 好的CLAUDE.md

## 项目信息
- 技术栈：Python 3.11, FastAPI
- 数据库：PostgreSQL
- 缓存：Redis

## 核心规范
1. 类型注解是必须的
2. 使用async/await
3. 错误处理用自定义异常

## 常见任务
### 添加新API
1. 在 src/api/ 创建路由
2. 在 src/services/ 实现逻辑
3. 在 tests/ 添加测试

### 数据库迁移
1. 使用Alembic
2. 命令：alembic revision --autogenerate
```

**DON'T（避免做法）**：

```markdown
# ❌ 不好的CLAUDE.md

## 项目信息
这是一个很复杂的电商系统，使用了很多技术...
（太冗长，缺少结构）

## 规范
- 代码要写得好
- 测试要充分
（太模糊，无法执行）

## 注意事项
不要用print，不要忘记类型注解，不要...
（太多"不要"，应该告诉AI"要做什么"）
```

---

### 5.5 Headless无头模式与SDK编程（进阶预告）

这部分是高级功能预告，让你知道Claude Code还能这样用！

#### Headless无头模式简介

**这是什么？**
Headless模式是单次执行模式的进阶版本，专为CI/CD和程序化集成设计，支持JSON输出。

**类比**：就像浏览器的无头模式（Headless Chrome），可以在服务器上自动运行，不需要人工干预。

**能做什么？**
- 🔧 CI/CD集成：在GitHub Actions中自动代码审查
- 🔧 JSON输出：程序可以解析和处理结果
- 🔧 流式输出：实时获取处理进度
- 🔧 批量自动化：无需手动操作

**快速示例**：

```bash
# 普通文本输出
$ claude -p "List files in src/"
There are 5 files in the src directory: app.js, utils.js...

# JSON结构化输出
$ claude -p "List files in src/" --output-format json
{
  "result": {
    "type": "text",
    "content": "There are 5 files...",
    "files": ["app.js", "utils.js", "config.js"]
  },
  "usage": {
    "input_tokens": 45,
    "output_tokens": 128
  }
}
```

**CI/CD集成示例**（GitHub Actions）：

```yaml
# .github/workflows/claude-review.yml
name: AI Code Review

on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Run AI Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          # AI审查并输出JSON
          REVIEW=$(claude -p "Review changed files" --output-format json)

          # 解析结果
          echo "$REVIEW" | jq '.result.content' > review.md

      - name: Post Review Comment
        # 发布审查评论到PR
        ...
```

> 💡 **学习建议**：Headless模式适合有CI/CD经验的开发者，初学者可以先跳过！

#### SDK编程模式简介

**这是什么？**
SDK（Software Development Kit）让你可以在Python或TypeScript代码中直接调用Claude Code，构建自定义AI工具。

**类比**：就像你可以在Python代码中import requests库发HTTP请求，用SDK可以import Claude Code发AI请求。

**能做什么？**
- 🔧 自定义Agent：构建专门的代码审查Agent、测试生成Agent等
- 🔧 工具集成：把Claude Code集成到你的工具链
- 🔧 自动化系统：构建完全自动化的开发流程
- 🔧 企业应用：定制符合企业规范的AI助手

**Python SDK快速示例**：

```python
# 安装SDK
pip install claude-agent-sdk

# 使用示例
from claude_agent_sdk import Agent, Session

# 创建Agent
agent = Agent(
    system_prompt="你是一个专业的代码审查专家。",
    model="claude-sonnet-4.5",
    max_tokens=4096
)

# 创建会话
session = Session(agent)

# 运行任务
result = session.run(
    prompt="审查 src/auth.py 文件的安全性",
    tools=["Read", "Grep", "Glob"],
    working_directory="./my-project"
)

print(result.content)
```

**TypeScript SDK快速示例**：

```typescript
// 安装SDK
npm install @anthropic-ai/claude-agent-sdk

// 使用示例
import { Agent, Session } from '@anthropic-ai/claude-agent-sdk';

const agent = new Agent({
  systemPrompt: "你是一个全栈开发专家。",
  model: 'claude-sonnet-4.5',
  maxTokens: 8192
});

const session = new Session(agent);

const result = await session.run({
  prompt: '创建一个React组件',
  streaming: true
});

console.log(result.content);
```

> 💡 **学习建议**：SDK编程适合有Python/TypeScript经验且需要深度定制的开发者。建议至少使用Claude Code 6个月后再学！

---

### 5.6 Claude Code 2.0新功能预告（重要！）

> 📌 **说明**：这部分介绍Claude Code 2.0（2025年9月发布）的革命性新功能！虽然是高级内容，但了解这些功能能让你对Claude Code的未来发展有清晰认识。

Claude Code 2.0带来了5大革命性新功能，让AI编程助手更强大、更智能、更好用！

#### 新功能1：VS Code扩展（beta）

**这是什么？**
Claude Code现在有了原生的VS Code扩展，可以在编辑器里直接使用，不用切换到终端！

**类比**：就像以前只能在银行柜台办业务，现在手机App也能办了，更方便！

**核心功能**：
- ✨ 实时查看Claude的改动（侧边栏面板）
- ✨ inline diffs（行内差异对比，像Git一样）
- ✨ @文件引用（@src/app.js快速引用文件）
- ✨ 多会话支持（可以同时开多个Claude对话）

**快捷键**：
- `Cmd/Ctrl+Shift+P` → 打开Claude Code
- `Cmd/Ctrl+Option/Alt+K` → 插入文件引用

**在哪下载？**
- VS Code扩展市场搜索"Claude Code"
- 或访问：https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code

> 💡 **学习建议**：CLI版本学会后，可以试试VS Code扩展，两者配合使用效率更高！

---

#### 新功能2：Subagents（子代理）

**这是什么？**
Subagents（子代理）让你可以把复杂任务委托给专门的AI代理处理。

**类比**：就像公司老板把任务分配给不同部门，前端部门做UI，后端部门做API，测试部门做测试，各司其职！

**能做什么？**
- 🤖 创建专门的代码审查Agent
- 🤖 创建专门的测试生成Agent
- 🤖 创建专门的文档编写Agent
- 🤖 多个Agent并行工作，效率倍增

**如何使用？**
```bash
# 通过--agents标志定义子代理
claude --agents '{"reviewer": {...}, "tester": {...}}'
```

> 💡 **学习建议**：这是高级功能，建议学完本课和Commands系统后，再深入学习！

---

#### 新功能3：/init命令

**这是什么？**
自动创建项目的CLAUDE.md配置文件，快速设置项目规范。

**类比**：就像装修房子时，一键生成装修方案模板，然后你再根据需求调整。

**怎么用？**
```
> /init

Claude会：
1. 分析项目技术栈
2. 检测项目结构
3. 自动生成CLAUDE.md配置文件
4. 包含项目信息、编码规范、常见任务等

生成的CLAUDE.md可以直接使用或自定义调整！
```

**价值**：
- ✅ 快速初始化项目配置
- ✅ 不用从头编写CLAUDE.md
- ✅ AI自动识别项目特点

---

#### 新功能4：/install-github-app命令

**这是什么？**
一键安装GitHub应用，让Claude自动审查你的Pull Requests！

**类比**：就像给你的GitHub仓库装了个智能保安，每次有人提交PR，保安自动检查代码质量。

**怎么用？**
```
> /install-github-app

Claude会：
1. 引导你安装GitHub App
2. 配置仓库权限
3. 设置自动审查规则

安装后效果：
每次创建PR，Claude自动审查并发布review评论！
```

**价值**：
- ✅ PR自动审查，不用手动review
- ✅ 提高代码质量
- ✅ 节省团队时间

---

#### 新功能5：/plugin命令

**这是什么？**
管理Claude Code插件的命令，可以安装、列出、删除插件。

**类比**：就像手机的"应用商店"，可以安装各种App扩展功能。

**能做什么？**
- 🔌 安装社区插件
- 🔌 管理已安装的插件
- 🔌 自定义Commands、Agents、Hooks、Skills
- 🔌 一键分享和安装插件包

**基本用法**：
```
> /plugin

显示插件管理界面：
1. Install plugin   # 安装插件
2. List plugins     # 查看已安装
3. Remove plugin    # 删除插件
4. Update plugins   # 更新插件
```

> 💡 **学习建议**：Plugins是扩展Claude Code的高级方式，建议在掌握MCP、Skills、Hooks后再学！

---

#### 2.0新功能总结

**5大新功能对比**：

| 新功能 | 难度 | 实用性 | 建议学习时机 |
|--------|------|--------|------------|
| VS Code扩展 | ⭐⭐ | ⭐⭐⭐⭐⭐ | 学完CLI后立即试用 |
| /init命令 | ⭐ | ⭐⭐⭐⭐ | 学完CLAUDE.md配置后使用 |
| /install-github-app | ⭐⭐ | ⭐⭐⭐⭐ | 团队协作时使用 |
| /plugin命令 | ⭐⭐⭐ | ⭐⭐⭐⭐ | 1个月后探索 |
| Subagents | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 3个月后深入学习 |

**学习路径建议**：
```
现在：完成本课（CLI命令）
↓
1周后：试用VS Code扩展 + /init命令
↓
2周后：学习Commands系统
↓
1个月后：探索Plugins
↓
3个月后：学习Subagents和高级自动化
```

**官方文档链接**：
- [VS Code扩展文档](https://code.claude.com/docs/en/vs-code)
- [Plugins文档](https://code.claude.com/docs/en/plugins)
- [官方博客：Autonomous Coding](https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously)

---

## 第六部分：诊断命令（简化版）

### 5.1 /doctor - 系统诊断

**这是什么？**
检查Claude Code的运行环境，发现并报告问题。

**类比**：就像体检，全面检查身体各项指标。

**怎么用？**

```bash
> /doctor

# 预期输出：
Claude Code System Diagnostics
===============================

✓ System: macOS 14.0 (OK)
✓ Node.js: v20.10.0 (OK)
✓ Git: v2.42.0 (OK)
✓ Network: Connected (45ms)
✓ Authentication: Valid
✓ Models: claude-sonnet-4.5 (Available)

All systems operational!
```

**如果出错怎么办？**

```bash
✗ Node.js: v16.0.0 (Requires v18.0.0+)
  → Suggestion: Update Node.js
  → Run: nvm install --lts
```

按照建议操作，然后再次运行`/doctor`验证。

---

### 5.2 /account - 账户信息

**这是什么？**
显示账户使用情况、剩余配额等信息。

```bash
> /account

Account Information:
====================
Plan: Claude Max 5X
Usage: 145 / 225 messages (64%)
Reset: 4h 23m

Credits: $12.34
```

---

### 5.3 调试模式（进阶）

**这是什么？**
启用详细日志输出，帮助排查Claude Code运行问题。

**类比**：就像汽车的诊断模式，能看到引擎的详细运行数据。

**什么时候用？**
- ✅ Claude运行出错，需要查看详细信息
- ✅ 性能很慢，想知道卡在哪里
- ✅ 向技术支持报告问题时需要日志

**如何启用？**

**方法1：命令行参数（推荐）**
```
claude --verbose
```

**方法2：环境变量**
```
export CLAUDE_DEBUG=1
claude
```

**详细日志示例**：

```
[DEBUG] Loading config from ~/.claude/config.json
[DEBUG] Connecting to Claude API...
[DEBUG] Model: claude-sonnet-4.5
[DEBUG] Max tokens: 4096
[DEBUG] Sending request...
[DEBUG] Response received (2.3s)
[DEBUG] Token usage: 234 / 4096
```

**日志级别控制**：

```
export CLAUDE_LOG_LEVEL=debug   最详细
export CLAUDE_LOG_LEVEL=info    一般信息
export CLAUDE_LOG_LEVEL=warn    仅警告
export CLAUDE_LOG_LEVEL=error   仅错误
```

**日志输出到文件**：

重定向日志：
```
claude --verbose 2> debug.log
```

同时显示和保存：
```
claude --verbose 2>&1 | tee debug.log
```

分离输出和日志：
```
claude --verbose > output.txt 2> debug.log
```

**性能分析**：

使用time命令测量响应时间：
```
$ time claude "What's 2+2?"
4

real    0m2.341s
user    0m0.123s
sys     0m0.045s
```

> 💡 **老金建议**：平时不用开调试模式，只在遇到问题时才用！日志太多看着烦！

---

### 5.4 多项目工作流（进阶）

**这是什么？**
在多个项目间切换使用Claude Code的技巧。

**类比**：就像同时开多个浏览器标签页，每个标签页是一个项目。

**场景1：多终端并行工作**

终端1 - 项目A（前端）：
```
cd ~/projects/project-a
claude
> 开发React组件
```

终端2 - 项目B（后端）：
```
cd ~/projects/project-b
claude
> 开发API接口
```

终端3 - 项目C（文档）：
```
cd ~/projects/project-c
claude
> 更新文档
```

各终端独立，互不干扰！

**场景2：会话导出/恢复切换**

项目A工作：
```
cd project-a
claude
> /export project-a-session.json
> /exit
```

切换到项目B：
```
cd project-b
claude
> /export project-b-session.json
```

恢复项目A会话：
```
cd project-a
claude --resume project-a-session.json
```

**场景3：跨项目知识复用**

在项目A学到的最佳实践应用到项目B：

项目A - 学习最佳实践：
```
cd project-a
claude
> 分析这个项目的错误处理模式
Claude: [分析] 使用了Result类型模式...
> /export error-handling-pattern.json
```

项目B - 应用最佳实践：
```
cd project-b
claude
> 参考这个错误处理模式：error-handling-pattern.json
> 重构我们的错误处理
```

**最佳实践**：

为每个项目创建专用启动脚本：
```
echo "cd ~/projects/project-a && claude" > ~/bin/claude-a
echo "cd ~/projects/project-b && claude" > ~/bin/claude-b
chmod +x ~/bin/claude-*
```

使用：
```
$ claude-a  快速启动项目A
$ claude-b  快速启动项目B
```

> 💡 **老金建议**：用tmux或screen保持多个会话，比反复切换目录方便多了！

---

## 📚 完整命令速查表

### CLI命令

| 命令 | 用途 | 常用度 |
|------|------|--------|
| `claude` | 启动交互模式 | ⭐⭐⭐⭐⭐ |
| `claude "prompt"` | 单次执行 | ⭐⭐⭐⭐ |
| `claude -p` | 打印模式 | ⭐⭐⭐ |
| `claude --version` | 查看版本 | ⭐⭐ |
| `claude --help` | 显示帮助 | ⭐⭐⭐ |
| `claude update` | 更新工具 | ⭐⭐ |

### Slash命令（交互模式）

| 命令 | 用途 | 常用度 |
|------|------|--------|
| `/help` | 显示帮助 | ⭐⭐⭐⭐ |
| `/exit` | 退出 | ⭐⭐⭐⭐⭐ |
| `/clear` | 清空对话 | ⭐⭐⭐⭐⭐ |
| `/compact` | 压缩历史 | ⭐⭐⭐⭐ |
| `/think` | 思考模式 | ⭐⭐⭐⭐ |
| `/save` | 保存对话 | ⭐⭐⭐⭐ |
| `/load` | 加载对话 | ⭐⭐⭐⭐ |
| `/project-info` | 项目信息 | ⭐⭐⭐ |
| `/checkpoint` | 创建检查点 | ⭐⭐⭐ |
| `/diff` | 查看变更 | ⭐⭐⭐ |
| `/undo` | 撤销操作 | ⭐⭐⭐ |
| `/doctor` | 系统诊断 | ⭐⭐ |
| `/account` | 账户信息 | ⭐⭐ |

### 配置命令

| 命令 | 用途 | 常用度 |
|------|------|--------|
| `claude config list` | 查看配置 | ⭐⭐⭐ |
| `claude config set` | 设置配置 | ⭐⭐⭐ |
| `claude config get` | 获取配置 | ⭐⭐ |
| `claude config reset` | 重置配置 | ⭐ |

---

## 第七部分：实战案例与练习

通过实战案例和练习题，巩固本课所学知识！

### 7.1 完整工作流实战案例

**场景**：开发一个新的用户认证模块

```bash
# 步骤1：启动Claude Code
$ claude --project ~/my-app

# 步骤2：创建检查点（安全保障）
> /checkpoint "开始认证模块开发"
✓ Checkpoint created

# 步骤3：使用思考模式进行设计
> /think hard 设计一个安全的JWT认证系统，考虑：
- Token刷新机制
- 多设备登录处理
- 安全存储方案

Claude: [深度思考并给出详细方案]

# 步骤4：开始实现（Claude自动创建检查点）
> 开始实现登录API

Claude: [创建auth.py、实现登录逻辑]

# 步骤5：遇到复杂问题时升级思考模式
> /ultrathink 如何处理Token被盗用的场景？

Claude: [穷尽分析安全方案]

# 步骤6：保存重要进度
> /save auth-module-progress

# 步骤7：如果走错方向，使用Rewind
> [Esc + Esc] → 选择恢复到之前的检查点

# 步骤8：完成后压缩会话继续其他工作
> /compact

# 步骤9：导出会话作为文档
> /export ~/docs/auth-development.md
```

**学到什么？**
- ✅ Checkpoint保护重要工作
- ✅ 思考模式选择技巧
- ✅ 会话管理完整流程
- ✅ Rewind容错机制

---

### 7.2 团队协作配置示例

**项目CLAUDE.md示例**：

```markdown
# E-commerce Platform - Claude Code配置

## 项目信息
- 仓库：github.com/company/ecommerce
- 团队：Platform Team

## 核心规范
@.claude/rules/code-style.md
@.claude/rules/api-design.md
@.claude/rules/database.md

## 工作约定
- PR需要关联Issue
- 提交信息遵循Conventional Commits
- 新功能需要添加测试

## 目录说明
- src/api/ - REST API端点
- src/services/ - 业务逻辑层
- src/models/ - 数据模型
- src/utils/ - 工具函数
```

**如何使用？**
1. 把这个CLAUDE.md放在项目根目录
2. 提交到Git：`git add CLAUDE.md && git commit -m "docs: add Claude config"`
3. 团队成员clone项目后，Claude自动读取这个配置
4. 所有人获得一致的AI助手体验

---

### 7.3 实战练习题

完成以下练习，真正掌握Claude Code！

#### 练习1：掌握Rewind功能（20分钟）

**任务**：通过Rewind优化迭代流程

```bash
# 步骤1：启动交互模式
claude

# 步骤2：第一次尝试
> 重构 user.py 的所有函数

# 步骤3：假设结果不满意，按Escape回退
> [按 Esc + Esc]

# 步骤4：给出更精确的指令
> 只重构 user.py 中的 get_user 函数
  目标：添加缓存支持

# 步骤5：再次回退并优化
> [按 Esc + Esc]
> /think 重构 get_user 函数：
  1. 添加Redis缓存
  2. 缓存过期时间5分钟
  3. 缓存key格式：user:{id}
```

**检查学习成果**：
- [ ] 能熟练使用Escape键回退
- [ ] 学会逐步细化需求
- [ ] 理解三种恢复选项的使用场景

---

#### 练习2：配置多层级CLAUDE.md（30分钟）

**任务**：建立完整的配置层级

```bash
# 步骤1：创建用户级配置
mkdir -p ~/.claude
cat > ~/.claude/CLAUDE.md << 'EOF'
# 我的全局配置
- 使用4空格缩进
- 优先使用函数式编程
- Git提交使用conventional commits
EOF

# 步骤2：创建项目级配置
cat > CLAUDE.md << 'EOF'
# 项目：练习项目
- Python 3.11
- 使用pytest测试
- 使用Black格式化
EOF

# 步骤3：创建模块级配置
mkdir -p src/api
cat > src/api/CLAUDE.md << 'EOF'
# API模块
- 使用FastAPI
- RESTful风格
- 参数验证用Pydantic
EOF

# 步骤4：测试配置生效
cd src/api
claude
> 创建一个用户API
# 观察Claude是否遵循了3层配置
```

**检查学习成果**：
- [ ] 理解配置层级和优先级
- [ ] 学会组织项目配置
- [ ] 掌握上下文自动注入

---

#### 练习3：构建自动化管道（40分钟）

**任务**：创建一个代码质量检查管道

```bash
#!/bin/bash
# quality_check.sh

PROJECT_DIR=$1

# 阶段1：代码风格检查
echo "=== 阶段1：代码风格检查 ==="
claude -p "
  使用pylint检查 $PROJECT_DIR
  生成报告：style_report.txt
"

# 阶段2：类型检查
echo "=== 阶段2：类型检查 ==="
claude -p "
  使用mypy检查 $PROJECT_DIR
  生成报告：type_report.txt
"

# 阶段3：安全扫描
echo "=== 阶段3：安全扫描 ==="
claude -p "
  使用bandit扫描安全问题
  生成报告：security_report.txt
"

# 阶段4：生成综合报告
echo "=== 阶段4：综合报告 ==="
claude -p "
  综合以上3个报告，生成改进建议
  输出：improvement_plan.md
"

echo "✅ 质量检查完成"
```

**检查学习成果**：
- [ ] 掌握Headless模式
- [ ] 学会构建多阶段管道
- [ ] 理解自动化工作流的价值

---

#### 练习4：对比思考模式效果（30分钟）

**任务**：对比不同思考模式的输出差异

```bash
# 准备测试代码
cat > slow_function.py << 'EOF'
def calculate_sum(numbers):
    total = 0
    for i in range(len(numbers)):
        for j in range(len(numbers)):
            if i == j:
                total += numbers[i]
    return total
EOF

# 测试1：普通模式
> 优化 slow_function.py

# 测试2：基础思考
> /think 优化 slow_function.py

# 测试3：深度思考
> /think hard 优化 slow_function.py

# 测试4：极限思考
> /ultrathink 优化 slow_function.py

# 对比结果：
- 普通模式：可能直接给出sum()方案
- 基础思考：会分析O(n²)问题
- 深度思考：会对比多种方案的权衡
- 极限思考：会考虑大数据场景、内存优化等
```

**检查学习成果**：
- [ ] 理解不同思考模式的输出差异
- [ ] 学会根据任务复杂度选择合适模式
- [ ] 体会深度思考的价值

---

#### 练习5：综合应用（60分钟）

**任务**：完成一个完整的功能开发流程

**需求**：为现有项目添加日志功能

```bash
# 步骤1：了解项目
> /project-info
# 观察技术栈和项目结构

# 步骤2：创建检查点
> /checkpoint "添加日志功能前"

# 步骤3：使用思考模式规划
> /think hard 为这个FastAPI项目添加结构化日志：
- 使用structlog
- 记录请求时间、路径、参数、响应时间
- 创建中间件统一处理

# 步骤4：分步实现
> 第一步：安装structlog依赖
> 第二步：创建日志配置
> 第三步：创建中间件
> 第四步：应用到所有路由

# 步骤5：测试验证
> 运行测试，验证日志功能

# 步骤6：查看变更
> /diff
# 确认修改是否符合预期

# 步骤7：保存会话
> /save logging-feature-implementation

# 步骤8：导出文档
> /export ~/docs/sessions/logging-implementation.md
```

**检查学习成果**：
- [ ] 完整走过一遍开发流程
- [ ] 综合应用所学命令
- [ ] 形成自己的工作习惯

---

### 7.4 学习成果自测

**完成以下检查清单，确认你真正掌握了Claude Code**：

**基础命令（必须100%掌握）**：
- [ ] 能启动交互模式（`claude`）
- [ ] 会用单次执行（`claude "prompt"`）
- [ ] 了解打印模式（`claude -p`）
- [ ] 会查看版本（`claude --version`）
- [ ] 会使用帮助（`claude --help`）
- [ ] 能更新Claude Code（`claude update`）

**交互命令（必须80%掌握）**：
- [ ] 会用`/help`查看命令
- [ ] 会用`/clear`清空对话
- [ ] 会用`/compact`压缩历史
- [ ] 理解`/think`模式的4个等级
- [ ] 会用`/save`和`/load`管理对话
- [ ] 能熟练使用Rewind功能（Esc+Esc）
- [ ] 会创建`/checkpoint`检查点
- [ ] 会用`/diff`查看变更
- [ ] 会用`/undo`撤销操作

**高级功能（建议50%掌握）**：
- [ ] 理解CLAUDE.md配置层级
- [ ] 会配置项目级CLAUDE.md
- [ ] 了解MCP服务器的作用
- [ ] 知道Headless模式的用途
- [ ] 听说过SDK编程模式

**实战能力（核心目标）**：
- [ ] 用过管道组合命令
- [ ] 写过简单的自动化脚本
- [ ] 配置过命令别名
- [ ] 在真实项目中使用过Claude Code
- [ ] 完成过至少3个练习题

**如果以上清单80%以上打勾，恭喜你已经掌握了Claude Code的核心用法！** 🎉

---

## 🎯 总结与下一步

### ✅ 你已经掌握的技能

完成本课学习后，你现在能够：

1. **CLI命令**：熟练使用6个核心命令行命令
2. **Slash命令**：掌握13个最常用的交互命令
3. **配置管理**：会查看和修改Claude Code配置
4. **问题诊断**：能使用诊断命令排查常见问题
5. **实战技巧**：管道、重定向、脚本自动化

### 📊 学习成果检查

**基础命令（必须掌握）**：
- [ ] 能启动交互模式（`claude`）
- [ ] 会用单次执行（`claude "prompt"`）
- [ ] 了解打印模式（`claude -p`）
- [ ] 会查看版本和帮助
- [ ] 能更新Claude Code

**交互命令（必须掌握）**：
- [ ] 会用`/help`查看命令
- [ ] 会用`/clear`清空对话
- [ ] 会用`/compact`压缩历史
- [ ] 试过`/think`思考模式
- [ ] 会用`/save`和`/load`管理对话
- [ ] 创建过`/checkpoint`检查点

**高级技巧（推荐掌握）**：
- [ ] 用过管道组合命令
- [ ] 写过简单的自动化脚本
- [ ] 会用`/diff`查看变更
- [ ] 会用`/doctor`诊断问题

### 💡 实践建议

**初学者（第1周）**：
1. 每天用`claude`启动交互模式练习
2. 试用每个Slash命令至少一次
3. 跟着教程里的案例操作一遍
4. 记录自己常用的命令

**进阶者（第2-4周）**：
1. 写3-5个自动化脚本
2. 配置个性化的命令别名
3. 在真实项目中使用Claude Code
4. 尝试用管道组合解决实际问题

**高级玩家（1个月后）**：
1. 探索MCP服务器扩展
2. 创建自定义Skills
3. 编写Hook自动化工作流
4. 分享你的使用技巧

---

## 第八部分：常见问题FAQ

> 💡 这部分收集了小白学习过程中最常遇到的问题，遇到问题先来这里找答案！

### Q1: 为什么响应很慢？

**可能原因和解决方案**：

**原因1：对话历史太长**
- Token使用超过100K
- **解决**：使用`/compact`压缩历史，或`/clear`清空重新开始

**原因2：网络连接慢**
- API服务器距离远或网络延迟高
- **解决**：使用VPN或代理加速，或等网络好的时候用

**原因3：使用了思考模式**
- `/think hard`或`/ultrathink`本身就慢
- **解决**：简单问题不用思考模式

**原因4：项目文件太多**
- Claude需要扫描大量文件
- **解决**：在`.gitignore`中排除不需要的文件夹（`node_modules`、`dist`等）

**验证方法**：
```bash
# 检查Token使用情况
> How many tokens have we used?

# 如果超过100K，立即压缩
> /compact
```

---

### Q2: 为什么Claude改错文件了？

**可能原因**：

**原因1：路径理解错误**
- 你说"修改config.js"，但项目里有多个config.js
- **解决**：使用完整相对路径，比如`src/utils/config.js`

**原因2：上下文混淆**
- 对话太长，AI混淆了不同文件
- **解决**：用`/clear`清空重新开始，或用`/checkpoint`创建检查点

**原因3：指令不清晰**
- 你说"优化代码"，没说具体哪个文件
- **解决**：明确指定文件路径和要修改的部分

**预防方法**：
```bash
# ❌ 不清晰的指令
> Fix the bug

# ✅ 清晰的指令
> Fix the login bug in src/auth/login.js, specifically the validatePassword function on line 45
```

**补救方法**：
```bash
# 立即撤销
> /undo

# 或回滚到检查点
> /rollback checkpoint-001
```

---

### Q3: 如何避免误删文件？

**保护策略**：

**策略1：使用检查点**
```bash
# 重要操作前先创建检查点
> /checkpoint
Checkpoint created: checkpoint-001

# 操作后验证
> /diff
# 检查修改是否正确

# 如果有误，立即回滚
> /rollback checkpoint-001
```

**策略2：启用权限确认**
```bash
# 不要用 --dangerously-skip-permissions
# 让Claude每次都询问确认
claude  # 不加任何危险选项
```

**策略3：配置Git自动提交**
```bash
# 每次修改后自动提交
# 如果出错可以用Git恢复
git config --global alias.auto-commit '!git add -A && git commit -m "auto backup"'

# Claude修改文件后
$ git auto-commit
```

**策略4：定期备份**
```bash
# 创建备份脚本
#!/bin/bash
BACKUP_DIR=~/claude-backups/$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
cp -r . $BACKUP_DIR
echo "Backup created: $BACKUP_DIR"
```

---

### Q4: 如何节省Token和省钱？（重要！）

小白最关心的问题：怎么少花钱多办事？老金我教你6个实战技巧！

#### 技巧1：精简提问（省50% Token）

```bash
# ❌ 浪费Token（约200 tokens）
> Please help me understand this code, I'm not sure what it does, can you explain it in detail step by step?

# ✅ 节省Token（约50 tokens）
> Explain what app.js does
```

**原则**：直奔主题，AI会自动给出详细解释！

#### 技巧2：使用文件引用而非粘贴（省80% Token）

```bash
# ❌ 浪费Token：粘贴500行代码
> [粘贴整个文件内容]
> 优化这段代码

消耗Token：~2000 tokens（代码） + 500 tokens（回复）= 2500 tokens

# ✅ 节省Token：引用文件
> 优化 src/large_file.py 中的 process_data 函数

消耗Token：~50 tokens（提问） + 500 tokens（回复）= 550 tokens
```

**省了**：2500 - 550 = **1950 tokens**（省78%！）

#### 技巧3：只在需要时用思考模式（省60% Token）

```bash
# ❌ 所有问题都用思考模式
> /think What's the syntax for Python list?
消耗：~1500 tokens

# ✅ 简单问题直接问
> What's the syntax for Python list?
消耗：~300 tokens

# ✅ 只在复杂问题时用
> /think hard 设计一个可扩展的微服务架构
消耗：~3000 tokens（但值得！）
```

**省钱表**：

| 问题复杂度 | 推荐模式 | Token消耗 | 适用场景 |
|-----------|---------|-----------|----------|
| 简单问题 | 直接问 | ~300 | 语法查询、简单解释 |
| 中等问题 | `/think` | ~1500 | 代码分析、设计建议 |
| 复杂问题 | `/think hard` | ~3000 | 架构设计、重大决策 |
| 关键决策 | `/ultrathink` | ~8000+ | 系统设计、技术选型 |

#### 技巧4：定期压缩对话（省40-60% Token）

```bash
# 对话超过50轮后
> How many tokens have we used?
Claude: Current usage: 120K tokens (60% of limit)

# 立即压缩
> /compact

Conversation compacted.
Token usage reduced: 120K → 48K (省了60%！)
```

**最佳实践**：
- 每30-50轮对话后运行一次`/compact`
- Token使用超过50%时立即压缩
- 切换任务时用`/clear`（省100%）

#### 技巧5：分阶段处理大任务（避免浪费）

```bash
# ❌ 一次性处理100个文件（如果出错，所有Token浪费）
> 重构所有100个Python文件的错误处理
消耗：~50K tokens
[如果中途出错，50K tokens全浪费]

# ✅ 分批处理（出错只损失一小部分）
> 重构 src/api/ 目录的错误处理（20个文件）
[完成后]
> /clear
> 重构 src/services/ 目录的错误处理（30个文件）
[完成后]
> /clear
> 重构 src/models/ 目录的错误处理（50个文件）

消耗：同样~50K tokens，但风险分散！
```

#### 技巧6：利用CLAUDE.md避免重复说明（省30% Token）

```bash
# ❌ 每次对话都要说明项目信息
> 我的项目用Python 3.11 + FastAPI，请帮我...
> 记住用async/await，请帮我...
> 我们的API用RESTful规范，请帮我...

每次都要重复说明，浪费~100 tokens/次

# ✅ 在CLAUDE.md中预定义
# 创建 CLAUDE.md
## 项目信息
- Python 3.11 + FastAPI
- 使用async/await
- API遵循RESTful规范

# 以后直接说
> 帮我创建一个用户API

Claude自动知道项目规范，省了100 tokens！
```

#### 💰 省钱效果总结

**一个月的使用对比**：

| 使用方式 | Token消耗 | 费用预估 | 省钱比例 |
|---------|----------|---------|----------|
| ❌ 不优化 | ~500K tokens | ~$15 | 0% |
| ✅ 用技巧1-3 | ~250K tokens | ~$7.5 | **50%** |
| ✅ 用技巧1-6 | ~150K tokens | ~$4.5 | **70%** |

**老金的建议**：
1. **必须做**：技巧1（精简提问）+ 技巧3（思考模式选择）→ 省50%
2. **强烈推荐**：技巧4（定期压缩）+ 技巧5（分阶段处理）→ 再省20%
3. **锦上添花**：技巧2（文件引用）+ 技巧6（CLAUDE.md）→ 再省10%

> 💡 **记住**：节省Token不是目的，高效完成任务才是！关键决策时该用`/ultrathink`就用，不要因小失大！

---

### Q5: Token用完了怎么办？

**免费用户限制**：
- Claude Free：每天有消息限制
- Claude Max：每5小时225条消息

**省Token技巧**：

**技巧1：精简提问**
```bash
# ❌ 浪费Token
> Please help me understand this code, I'm not sure what it does, can you explain it in detail?

# ✅ 节省Token
> Explain what app.js does
```

**技巧2：只在需要时用思考模式**
```bash
# 简单问题
> What's the syntax for Python list?  # 不用/think

# 复杂问题
> /think hard
> Design a scalable microservices architecture
```

**技巧3：定期压缩对话**
```bash
# 对话超过50轮后
> /compact

# Token节省40-60%
```

**技巧4：分阶段处理大任务**
```bash
# 不要一次性让Claude处理100个文件
# 分批处理：
> Process files 1-20
> /clear
> Process files 21-40
> /clear
> Process files 41-60
```

**Token用完后**：
- **等待重置**：免费用户等24小时，Max用户等5小时
- **升级套餐**：升级到Claude Max获得更多配额
- **使用API**：购买API credits，按使用量付费

---

### Q6: 可以在团队中使用吗？

**可以！但注意以下几点**：

**方式1：共享账号（不推荐）**
- ❌ 容易达到使用限制
- ❌ 无法追踪谁做了什么
- ✅ 适合2-3人小团队

**方式2：每人独立账号（推荐）**
- ✅ 独立配额，不互相影响
- ✅ 可以追踪个人使用情况
- ✅ 适合5人以上团队

**方式3：使用API（企业级）**
- ✅ 无限制使用
- ✅ 完全控制
- ✅ 可以集成到CI/CD
- ⚠️ 需要付费

**团队协作最佳实践**：

```bash
# 1. 共享CLAUDE.md配置
# 把项目的CLAUDE.md提交到Git
git add CLAUDE.md
git commit -m "Add Claude Code project config"

# 2. 共享自定义命令
# .claude/commands/ 目录提交到Git
git add .claude/commands/
git commit -m "Add custom slash commands"

# 3. 统一忽略规则
# .claude/.gitignore 确保一致
echo "conversations/" >> .claude/.gitignore
```

---

### Q7: 如何处理网络问题？

**问题1：连接超时**
```bash
# 检查网络
ping api.anthropic.com

# 如果ping不通，可能需要：
# 1. 检查防火墙设置
# 2. 使用代理
export HTTP_PROXY=http://your-proxy:port
export HTTPS_PROXY=http://your-proxy:port
claude
```

**问题2：在中国大陆使用**
```bash
# 使用代理（推荐）
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890
claude

# 或配置到shell配置文件
echo 'export HTTP_PROXY=http://127.0.0.1:7890' >> ~/.bashrc
echo 'export HTTPS_PROXY=http://127.0.0.1:7890' >> ~/.bashrc
source ~/.bashrc
```

**问题3：公司网络限制**
```bash
# 联系IT部门，开放以下域名：
# - *.anthropic.com
# - *.claude.ai
```

---

### Q8: Windows用户特殊注意事项

**路径问题**：
```powershell
# ❌ 错误：用反斜杠
> Read C:\Users\name\project\file.js

# ✅ 正确：用正斜杠或双反斜杠
> Read C:/Users/name/project/file.js
> Read C:\\Users\\name\\project\\file.js
```

**PowerShell vs CMD**：
```powershell
# 推荐使用PowerShell（功能更强）
# 不推荐CMD（功能受限）

# 检查当前shell
echo $PSVersionTable  # PowerShell
echo %COMSPEC%        # CMD
```

**编码问题**：
```powershell
# 如果看到乱码，设置UTF-8编码
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
chcp 65001
```

---

### Q9: 如何学习更快？

**老金的学习路线图**（4周计划）：

**第1周：基础命令**
- 每天启动`claude`练习30分钟
- 试用每个基础命令至少3次
- 完成本教程所有案例
- 目标：熟练使用6个CLI命令+10个Slash命令

**第2周：实战练习**
- 用Claude Code完成一个小项目
- 写2-3个自动化脚本
- 配置个性化别名和设置
- 目标：形成自己的工作流

**第3周：进阶功能**
- 学习CLAUDE.md配置
- 尝试创建自定义命令
- 探索MCP服务器
- 目标：定制专属开发环境

**第4周：高级应用**
- 学习Skills系统
- 配置Hooks自动化
- 集成到团队工作流
- 目标：成为团队的Claude Code专家

**学习资源**：
- 📚 官方文档：https://docs.anthropic.com/claude-code
- 🎥 视频教程：（搜索YouTube"Claude Code tutorial"）
- 💬 社区论坛：https://community.anthropic.com
- 💻 GitHub示例：https://github.com/topics/claude-code

---

### Q10: 总是忘记命令怎么办？

**解决方案**：

**方法1：打印速查表**
```bash
# 把本教程的速查表打印出来贴在显示器旁边
# 或保存为桌面壁纸
```

**方法2：创建cheatsheet命令**

创建`.claude/commands/cheatsheet.md`：
```markdown
# 常用命令速查

基础命令：
- claude         启动交互
- claude "cmd"   单次执行
- claude -p      打印模式

Slash命令：
- /help          帮助
- /clear         清空
- /compact       压缩
- /think         思考
- /save          保存
- /doctor        诊断
```

使用：
```bash
> /cheatsheet
```

**方法3：使用/help**
```bash
# 忘记命令时
> /help

# 查找特定命令
> /help think
```

**方法4：配置命令别名**
```bash
# 短命令更容易记
alias c="claude"
alias cq="claude -p"  # q = quick

# 使用
c           # 启动交互
cq "问题"   # 快速查询
```

---

## 🎓 学习成果测试

### 知识测试（选择题）

**1. 下面哪个命令用于启动交互模式？**
- A. `claude start`
- B. `claude`
- C. `claude --interactive`
- D. `claude -i`

**答案：B**

> **解释**：直接运行`claude`就是启动交互模式，这是最常用的方式。

---

**2. `/clear`和`/compact`的区别是什么？**
- A. 没有区别，都是清空对话
- B. `/clear`完全清空，`/compact`压缩保留关键信息
- C. `/compact`完全清空，`/clear`压缩保留关键信息
- D. 都不会清空，只是重命名

**答案：B**

> **解释**：`/clear`会完全清空对话历史，`/compact`会压缩历史但保留关键信息。

---

**3. 什么时候应该使用`/think`模式？**
- A. 所有问题都用，回答更准确
- B. 只在复杂问题时用，简单问题浪费Token
- C. 从不使用，浪费时间
- D. 只在付费后使用

**答案：B**

> **解释**：思考模式消耗更多Token和时间，只在需要深入分析的复杂问题时使用。

---

**4. 如何查看Claude Code版本？**
- A. `claude version`
- B. `claude -version`
- C. `claude --version`
- D. `claude /version`

**答案：C**

> **解释**：使用`claude --version`或简写`claude -v`查看版本。

---

**5. 打印模式（`-p`）的主要用途是什么？**
- A. 打印文档
- B. 只输出纯文本，适合管道和脚本
- C. 格式化输出
- D. 打印配置

**答案：B**

> **解释**：打印模式只输出AI的纯文本回答，适合管道处理和脚本解析。

### 实践测试（动手操作）

**完成以下10个实践任务，巩固所学知识**：

- [ ] **任务1**：启动Claude Code交互模式并输入一个问题
- [ ] **任务2**：使用`/help`查看所有可用命令
- [ ] **任务3**：用`/clear`清空对话，再开始一个新任务
- [ ] **任务4**：创建一个检查点，修改一个文件，然后用`/diff`查看变更
- [ ] **任务5**：用`/save`保存对话，退出后用`/load`恢复
- [ ] **任务6**：用`/doctor`检查系统状态
- [ ] **任务7**：用单次执行模式生成一个文件：`claude "Create a Python hello world script" > hello.py`
- [ ] **任务8**：配置一个命令别名（`alias cc="claude"`）
- [ ] **任务9**：用`/think`模式解决一个复杂问题
- [ ] **任务10**：写一个简单的自动化脚本（比如批量重命名文件）

**全部完成后，你就真正掌握了Claude Code的核心用法！** 🎉

---

### 🔗 相关资源

- **官方文档**：https://docs.anthropic.com/claude-code
- **GitHub仓库**：https://github.com/anthropics/claude-code
- **社区论坛**：https://community.anthropic.com
- **学习路径**：先学本课（CLI命令），再学《自定义命令开发》，最后学《MCP集成》

### 🎓 下一课预告

**模块3：《Commands系统 - 自定义命令开发》**
- 创建自己的Slash命令
- 命令参数和选项
- 命令自动化最佳实践

**模块4：《MCP集成 - 扩展Claude能力》**
- MCP服务器原理
- 安装和配置MCP服务器
- 开发自己的MCP工具

---

## 📝 质量检查清单

### 内容完整性

- [x] 文档头部（课程信息）
- [x] 学习目标
- [x] 术语表（15个核心术语）
- [x] 第一部分：简介
- [x] 第二部分：基础CLI命令（7个命令）
- [x] 第三部分：交互Slash命令（13个命令）
- [x] 第四部分：配置命令（简化版）
- [x] 第五部分：诊断命令（简化版）
- [x] 完整命令速查表
- [x] 总结与下一步

### 小白友好性

- [x] 每个命令都有"这是什么"
- [x] 每个命令都有"为什么要用"
- [x] 每个命令都有"怎么操作"
- [x] 每个命令都有"验证方法"
- [x] 关键命令有"错误处理"
- [x] 使用生活类比解释概念
- [x] 跨平台命令分开说明（Windows/macOS/Linux）

### 实战价值

- [x] 提供实战案例（日志分析、自动化脚本等）
- [x] 给出最佳实践建议
- [x] 实践检查清单
- [x] 下一步学习指引

---

**课程版本**：V3.0（小白友好版）
**创建日期**：2025-12-17
**作者**：老金
**基于**：《Claude Code CLI命令完全指南》原版教程

🎉 **恭喜完成Claude Code CLI命令完全指南（小白版）！**

