# Hooks完全参考手册

**版本**：Claude Code 1.0+
**目标读者**：Claude Code用户（从零基础到进阶）
**文档长度**：约12,000字
**更新日期**：2025-12-11


## 📖 目录
1、[Hooks系统架构](#1-hooks系统架构)
2、[6种Hook类型详解](#2-6种hook类型详解)
3、[Hook配置规范](#3-hook配置规范)
4、[实战练习](#4-实战练习)


## 1. Hooks系统架构
### 1.1 什么是Hooks
**Hooks**是Claude Code的拦截机制，允许你在特定事件发生时**自动执行自定义脚本**，实现：

- **权限控制**：阻止危险操作
- **自动化任务**：工具调用后自动执行后处理
- **质量保障**：写作前验证、保存后格式修复
- **日志审计**：记录所有工具调用

**核心优势**：
- 🔄 **自动触发**：无需手动干预
- 🎯 **精确匹配**：只拦截特定工具
- 🔌 **语言无关**：支持任何可执行程序（Python、Bash、Node.js、.bat）
- 📦 **项目隔离**：每个项目独立配置


### 1.2 执行时机与顺序
Claude Code提供**6种Hook触发点**：
```
用户输入
    ↓
[UserPromptSubmit Hook] ← 优化提示词
    ↓
Claude处理提示词
    ↓
决定调用工具（如Write）
    ↓
[PreToolUse Hook] ← 工具调用前验证
    ↓
执行工具（如Write）
    ↓
[PostToolUse Hook] ← 工具调用后处理
    ↓
返回结果给用户
```

**完整生命周期**：


**Hook类型**：**UserPromptSubmit**
**触发时机**：用户输入提交后
**典型用途**：提示词优化、敏感词过滤


**Hook类型**：**PreToolUse**
**触发时机**：工具调用前
**典型用途**：权限校验、参数验证


**Hook类型**：**PostToolUse**
**触发时机**：工具调用后
**典型用途**：格式修复、自动测试


**Hook类型**：**SessionStart**
**触发时机**：会话开始时
**典型用途**：环境初始化


**Hook类型**：**SessionEnd**
**触发时机**：会话结束时
**典型用途**：清理临时文件


**Hook类型**：**Stop**
**触发时机**：AI停止响应时
**典型用途**：保存状态


**Hook类型**：**Notification**
**触发时机**：工具发送通知时
**典型用途**：日志记录


### 1.3 settings.json配置
Hook配置文件位于**项目根目录**的`.claude/settings.json`。

#### 基础结构
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/pre-tool-use-validator.bat",
            "timeout": 5
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/post-tool-use-fixer.bat",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

#### 配置字段说明

**字段**：`matcher`
**必需**：是
**说明**：匹配的工具名（支持正则）
**示例**：`"Write"`, `"Write


**字段**：`type`
**必需**：是
**说明**：Hook类型，固定为`"command"`
**示例**：`"command"`


**字段**：`command`
**必需**：是
**说明**：脚本路径（相对/绝对）
**示例**：`".claude/hooks/my-hook.py"`


**字段**：`timeout`
**必需**：否
**说明**：超时时间（秒），默认10秒
**示例**：`5`, `30`


**⚠️ 注意事项**：
- **路径分隔符**：Windows上可用`\\`或`/`（推荐`/`跨平台）
- **可执行权限**：Linux/Mac需要`chmod +x`
- **超时设置**：超时后Hook会被强制终止


## 2. 6种Hook类型详解
### 2.1 PreToolUse（工具调用前）
#### 触发时机
在Claude准备调用工具（如Write、Edit、Bash）时，**但尚未执行**。

#### 输入参数（通过stdin的JSON）
```json
{
  "tool_name": "Write",
  "tool_input": {
    "file_path": "C:/Users/admin/Desktop/project/articles/test.md",
    "content": "# Hello World\n\nThis is a test."
  }
}
```


**字段**：`tool_name`
**类型**：string
**说明**：工具名称（Write, Edit, Bash, Read等）


**字段**：`tool_input`
**类型**：object
**说明**：工具的输入参数（键值对）


#### 决策输出（通过stdout的JSON）
PreToolUse Hook可以返回**决策指令**：
```json
{
  "decision": "deny",
  "message": "❌ 禁止修改production目录下的文件"
}
```


**decision值**：`"allow"`
**说明**：允许执行
**工具是否执行**：✅ 是


**decision值**：`"deny"`
**说明**：拒绝执行
**工具是否执行**：❌ 否


**decision值**：`"ask"`
**说明**：询问用户
**工具是否执行**：🤔 等待用户决定


**decision值**：`"message"`
**说明**：仅显示消息
**工具是否执行**：✅ 是（显示后继续）


**decision值**：无输出
**说明**：默认允许
**工具是否执行**：✅ 是


#### 完整代码示例1：Research步骤验证（Windows .bat版）
**场景**：在Write/Edit工具保存articles目录下的新文章前，提示用户应该先完成Research。

**.claude/settings.json配置**：
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/pre-tool-use-research-validator.bat"
          }
        ]
      }
    ]
  }
}
```

**脚本：`.claude/hooks/pre-tool-use-research-validator.bat`**：
```batch
@echo off
chcp 65001 >nul
REM PreToolUse Hook - Research步骤验证 (Windows版)

setlocal EnableDelayedExpansion

REM 读取stdin的JSON输入到临时文件
set "TEMP_FILE=%TEMP%\hook_input_%RANDOM%.json"
more > "%TEMP_FILE%"

REM 使用Python处理
python -c "
import sys
import json
import os
from pathlib import Path

# 设置编码
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 从临时文件读取JSON
temp_file = r'%TEMP_FILE%'
try:
    with open(temp_file, 'r', encoding='utf-8') as f:
        hook_input = json.loads(f.read())
except:
    sys.exit(0)

# 获取工具名称和文件路径
tool_name = hook_input.get('tool_name', '')
tool_input_data = hook_input.get('tool_input', {})
file_path = tool_input_data.get('file_path', '')

# 只处理Write和Edit工具
if tool_name not in ['Write', 'Edit']:
    sys.exit(0)

# 规范化路径
file_path_normalized = file_path.replace('\\', '/').replace('//', '/')

# 只检查articles目录
if '/articles/' not in file_path_normalized:
    sys.exit(0)

article_path = Path(file_path)
if not article_path.exists():
    print()
    print('='*50)
    print('⚠️ Research步骤验证检查')
    print('='*50)
    print()
    print('检测到新文章创建操作')
    print()
    print('💡 智能提示：建议完成Research步骤以提高文章质量')
    print()
    print('推荐使用以下工具（至少2个）：')
    print('1. MCP工具：')
    print('   - mcp__mcp-router__search (免费无限)')
    print('   - mcp__mcp-router__brave_web_search')
    print()
    print('2. 内置工具：')
    print('   - WebSearch')
    print('   - WebFetch')
    print()
    print('='*50)
    print()

sys.exit(0)
"

REM 清理临时文件
if exist "%TEMP_FILE%" del "%TEMP_FILE%"
exit /b 0
```

**工作原理**：
1、**读取输入**：从stdin读取JSON到临时文件
2、**条件判断**：
   - 只处理Write/Edit工具
   - 只检查`/articles/`目录
   - 只在文件不存在时（新建）提示
3、**输出提示**：打印Research建议（不阻止操作）
4、**清理**：删除临时文件

**输出效果**：
```
==================================================
⚠️ Research步骤验证检查
==================================================

检测到新文章创建操作

💡 智能提示：建议完成Research步骤以提高文章质量

推荐使用以下工具（至少2个）：
1、MCP工具：
   - mcp__mcp-router__search (免费无限)
   - mcp__mcp-router__brave_web_search

2、内置工具：
   - WebSearch
   - WebFetch

==================================================
```

#### 完整代码示例2：文件保护Hook（Python版）
**场景**：禁止修改`production/`目录下的文件。

**脚本：`.claude/hooks/pre-tool-use-protect.py`**：
```python
#!/usr/bin/env python3
import sys
import json

# 读取stdin的JSON输入
input_data = json.load(sys.stdin)

tool_name = input_data.get('tool_name', '')
tool_input = input_data.get('tool_input', {})
file_path = tool_input.get('file_path', '')

# 检查是否是保护目录
if '/production/' in file_path.replace('\\', '/'):
    # 拒绝执行
    decision = {
        "decision": "deny",
        "message": "❌ 禁止修改production目录下的文件！\n请先切换到dev环境。"
    }
    print(json.dumps(decision, ensure_ascii=False))
    sys.exit(0)

# 允许执行（无输出=默认allow）
sys.exit(0)
```

**配置**：
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/pre-tool-use-protect.py"
          }
        ]
      }
    ]
  }
}
```

**运行效果**：
当Claude尝试`Write(file_path="C:/project/production/config.json")`时，会被拦截并显示：
```
❌ 禁止修改production目录下的文件！
请先切换到dev环境。
```


### 2.2 PostToolUse（工具调用后）
#### 触发时机
在工具**成功执行后**立即触发，可以处理工具的输出结果。

#### 输入参数（通过stdin的JSON）
```json
{
  "tool_name": "Write",
  "tool_input": {
    "file_path": "C:/project/articles/test.md",
    "content": "# Hello\n\nWorld"
  },
  "tool_output": {
    "success": true,
    "message": "File written successfully"
  }
}
```


**字段**：`tool_name`
**类型**：string
**说明**：工具名称


**字段**：`tool_input`
**类型**：object
**说明**：工具的输入参数


**字段**：`tool_output`
**类型**：object
**说明**：工具的输出结果


#### 输出格式
PostToolUse Hook**不返回决策**，只能：
- 执行后处理任务（修复、备份、测试）
- 打印日志到stderr（不影响Claude）

#### 完整代码示例1：自动格式修复（Windows .bat版）
**场景**：在Write工具保存articles目录下的.md文件后，自动运行格式修复脚本。

**.claude/settings.json配置**：
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/post-tool-use-format-fixer.bat",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**脚本：`.claude/hooks/post-tool-use-format-fixer.bat`**：
```batch
@echo off
chcp 65001 >nul
REM PostToolUse Hook - 自动格式修复

setlocal EnableDelayedExpansion

REM 读取stdin的JSON输入到临时文件
set "TEMP_FILE=%TEMP%\hook_input_%RANDOM%.json"
more > "%TEMP_FILE%"

REM 使用Python处理
python -c "
import sys
import json
import os
from pathlib import Path

# 设置编码
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 从临时文件读取JSON
temp_file = r'%TEMP_FILE%'
try:
    with open(temp_file, 'r', encoding='utf-8') as f:
        hook_input = json.loads(f.read())
except:
    sys.exit(0)

# 获取工具信息
tool_name = hook_input.get('tool_name', '')
tool_input_data = hook_input.get('tool_input', {})
file_path = tool_input_data.get('file_path', '')

# 规范化路径
file_path_normalized = file_path.replace('\\', '/').replace('//', '/')

# 检查是否是Write工具 + articles目录 + .md文件
if tool_name == 'Write' and '/articles/' in file_path_normalized and file_path.endswith('.md'):
    print(f'✅ 检测到保存文章：{file_path}', file=sys.stderr)
    print('🔧 正在执行格式智能修复...', file=sys.stderr)

    # 获取项目根目录
    project_root = Path(os.getenv('CLAUDE_PROJECT_DIR', os.getcwd()))
    scripts_dir = project_root / '.claude/skills/gongzhonghao-writer/scripts'

    sys.path.insert(0, str(scripts_dir))

    try:
        from fix_article_format import smart_fix_article

        article_path = Path(file_path)
        if article_path.exists():
            with open(article_path, 'r', encoding='utf-8') as f:
                content = f.read()

            fixed_content = smart_fix_article(content)

            with open(article_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)

            print('✅ 格式修复完成', file=sys.stderr)
        else:
            print(f'⚠️ 文件不存在：{file_path}', file=sys.stderr)

    except ImportError:
        print('[INFO] 格式修复模块未安装，跳过', file=sys.stderr)
    except Exception as e:
        print(f'❌ 格式修复失败：{e}', file=sys.stderr)

sys.exit(0)
"

REM 清理临时文件
if exist "%TEMP_FILE%" del "%TEMP_FILE%"
exit /b 0
```

**工作原理**：
1、**读取工具输出**：从stdin获取tool_name和file_path
2、**条件判断**：只处理Write + /articles/ + .md文件
3、**格式修复**：调用Python脚本`fix_article_format.smart_fix_article()`
4、**重新写入**：将修复后的内容覆盖原文件

**输出效果**（显示在Claude Code的stderr）：
```
✅ 检测到保存文章：C:/project/articles/test.md
🔧 正在执行格式智能修复...
✅ 格式修复完成
```

#### 完整代码示例2：自动备份Hook（Bash版）
**场景**：在Edit工具修改文件后，自动创建备份。

**脚本：`.claude/hooks/post-tool-use-backup.sh`**：
```bash
#!/bin/bash
# PostToolUse Hook - 自动备份

# 读取stdin的JSON
input_json=$(cat)

# 使用jq解析JSON（如果没有jq，用Python）
tool_name=$(echo "$input_json" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name',''))")
file_path=$(echo "$input_json" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))")

# 只处理Edit工具
if [ "$tool_name" != "Edit" ]; then
    exit 0
fi

# 创建备份
if [ -f "$file_path" ]; then
    backup_dir="$(dirname "$file_path")/.backups"
    mkdir -p "$backup_dir"

    timestamp=$(date +%Y%m%d_%H%M%S)
    filename=$(basename "$file_path")
    backup_path="${backup_dir}/${filename}.${timestamp}.bak"

    cp "$file_path" "$backup_path"
    echo "✅ 备份已创建：$backup_path" >&2
fi

exit 0
```

**配置**：
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/post-tool-use-backup.sh"
          }
        ]
      }
    ]
  }
}
```


### 2.3 UserPromptSubmit（用户提示词提交）
#### 触发时机
在用户提交提示词后，**Claude处理之前**。

#### 输入参数
直接从stdin读取用户输入的原始文本：
```
请帮我写一篇关于AI的文章
```

#### 输出格式
可以修改用户的提示词：
```
请帮我写一篇关于AI的文章


## 写作要求
- 字数：1500字
- 风格：老金式接地气风格
- 包含实战案例
```

#### 完整代码示例：提示词优化Hook（Node.js版）
**场景**：自动在用户提示词后追加写作规范。

**脚本：`.claude/hooks/user-prompt-submit.js`**：
```javascript
#!/usr/bin/env node
/**
 * UserPromptSubmit Hook - 提示词自动优化
 */

const fs = require('fs');

// 从stdin读取用户输入
let userInput = '';
process.stdin.on('data', chunk => userInput += chunk);
process.stdin.on('end', () => {
  userInput = userInput.trim();

  // 过滤简单回复（不需要优化）
  const simpleResponses = ['好的', '是的', '继续', 'ok', 'yes', 'no'];
  if (simpleResponses.includes(userInput.toLowerCase()) || userInput.length < 10) {
    process.stdout.write(userInput);
    return;
  }

  // 过滤斜杠命令
  if (userInput.startsWith('/')) {
    process.stdout.write(userInput);
    return;
  }

  // 检查是否包含写作关键词
  const writingKeywords = ['写', '文章', '生成', 'write', 'article'];
  const isWritingTask = writingKeywords.some(kw => userInput.includes(kw));

  if (isWritingTask) {
    // 追加写作规范
    const enhanced = `${userInput}


## 📋 写作规范提醒
1、**风格**：老金式接地气风格，避免AI腔
2、**结构**：开头金句 → 核心要点 → 实战案例 → 总结升华
3、**字数**：1500-2000字
4、**质量检查**：自然度>80分，AI腔<20分

**开始写作前请先Research！**
`;
    process.stdout.write(enhanced);
  } else {
    process.stdout.write(userInput);
  }
});
```

**配置**：
```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/user-prompt-submit.js",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**运行效果**：
用户输入：
```
请帮我写一篇关于Claude的文章
```

Hook自动追加后：
```
请帮我写一篇关于Claude的文章


## 📋 写作规范提醒
1、**风格**：老金式接地气风格，避免AI腔
2、**结构**：开头金句 → 核心要点 → 实战案例 → 总结升华
3、**字数**：1500-2000字
4、**质量检查**：自然度>80分，AI腔<20分

**开始写作前请先Research！**
```


### 2.4 Notification（通知）
#### 触发时机
当工具（如Bash）通过特殊格式发送通知时。

#### 输入参数
```json
{
  "notification_type": "info",
  "message": "测试通过"
}
```

#### 输出格式
无需返回，只处理通知即可。

#### 完整代码示例：通知日志Hook（Python版）
**脚本：`.claude/hooks/notification-logger.py`**：
```python
#!/usr/bin/env python3
import sys
import json
from datetime import datetime
from pathlib import Path

# 读取通知
input_data = json.load(sys.stdin)
notification_type = input_data.get('notification_type', 'unknown')
message = input_data.get('message', '')

# 记录到日志
log_dir = Path.home() / '.claude' / 'logs'
log_dir.mkdir(parents=True, exist_ok=True)
log_file = log_dir / f"notifications-{datetime.now().strftime('%Y%m%d')}.log"

with open(log_file, 'a', encoding='utf-8') as f:
    timestamp = datetime.now().isoformat()
    f.write(f"[{timestamp}] [{notification_type.upper()}] {message}\n")

print(f"✅ 通知已记录到：{log_file}", file=sys.stderr)
sys.exit(0)
```

**配置**：
```json
{
  "hooks": {
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/notification-logger.py"
          }
        ]
      }
    ]
  }
}
```


### 2.5 Stop（会话停止）
#### 触发时机
当用户点击"Stop"按钮或Claude停止响应时。

#### 输入参数
```json
{
  "reason": "user_stop",
  "timestamp": "2025-12-11T10:30:00Z"
}
```

#### 完整代码示例：状态保存Hook
**脚本：`.claude/hooks/stop-save-state.py`**：
```python
#!/usr/bin/env python3
import sys
import json
from datetime import datetime
from pathlib import Path

# 读取停止信息
input_data = json.load(sys.stdin)
reason = input_data.get('reason', 'unknown')

# 保存当前会话状态
state_dir = Path.home() / '.claude' / 'state'
state_dir.mkdir(parents=True, exist_ok=True)
state_file = state_dir / 'last-session-state.json'

state = {
    "stopped_at": datetime.now().isoformat(),
    "reason": reason,
    "project_dir": Path.cwd().as_posix()
}

with open(state_file, 'w', encoding='utf-8') as f:
    json.dump(state, f, indent=2, ensure_ascii=False)

print(f"✅ 会话状态已保存", file=sys.stderr)
sys.exit(0)
```

**配置**：
```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/stop-save-state.py"
          }
        ]
      }
    ]
  }
}
```


### 2.6 Session系列（会话生命周期）
#### SessionStart（会话开始）
**触发时机**：Claude Code启动时。

**用途**：
- 初始化环境
- 加载配置
- 检查依赖

**示例：检查Python依赖**：
```python
#!/usr/bin/env python3
import sys
import subprocess

required_packages = ['rich', 'jinja2', 'requests']

missing = []
for pkg in required_packages:
    try:
        __import__(pkg)
    except ImportError:
        missing.append(pkg)

if missing:
    print(f"⚠️ 缺少依赖：{', '.join(missing)}", file=sys.stderr)
    print(f"运行：pip install {' '.join(missing)}", file=sys.stderr)

sys.exit(0)
```

#### SessionEnd（会话结束）
**触发时机**：Claude Code正常退出时。

**用途**：
- 清理临时文件
- 备份日志
- 统计使用情况

**示例：清理临时文件**：
```bash
#!/bin/bash
# SessionEnd Hook - 清理临时文件

temp_dir="$HOME/.claude/temp"
if [ -d "$temp_dir" ]; then
    rm -rf "$temp_dir"/*
    echo "✅ 临时文件已清理" >&2
fi

exit 0
```


## 3. Hook配置规范
### 3.1 Matcher匹配语法
Matcher用于匹配工具名称，支持：

#### 精确匹配
```json
{
  "matcher": "Write"
}
```
只匹配`Write`工具。

#### 正则表达式匹配（或运算）
```json
{
  "matcher": "Write|Edit"
}
```
匹配`Write`或`Edit`工具。
```json
{
  "matcher": "Write|Edit|Read"
}
```
匹配`Write`、`Edit`或`Read`工具。

#### 通配符匹配
```json
{
  "matcher": ".*"
}
```
匹配所有工具（慎用！会影响性能）。

#### 常见工具名

**工具名**：`Write`
**说明**：写入文件


**工具名**：`Edit`
**说明**：编辑文件


**工具名**：`Read`
**说明**：读取文件


**工具名**：`Bash`
**说明**：执行命令


**工具名**：`Glob`
**说明**：文件搜索


**工具名**：`Grep`
**说明**：内容搜索


**工具名**：`WebSearch`
**说明**：网络搜索


### 3.2 JSON输出格式
#### PreToolUse决策格式
```json
{
  "decision": "deny",
  "message": "❌ 操作被拒绝的原因"
}
```


**字段**：`decision`
**必需**：是
**类型**：string
**说明**：`allow`, `deny`, `ask`, `message`


**字段**：`message`
**必需**：否
**类型**：string
**说明**：显示给用户的消息


#### PostToolUse无返回值
PostToolUse Hook不需要返回JSON，所有输出会被忽略（除了stderr日志）。

#### UserPromptSubmit文本输出
直接输出修改后的提示词文本，不需要JSON。


### 3.3 环境变量传递
Claude Code会自动传递以下环境变量到Hook脚本：


**环境变量**：`CLAUDE_PROJECT_DIR`
**说明**：项目根目录
**示例值**：`C:/Users/admin/Desktop/project`


**环境变量**：`CLAUDE_SESSION_ID`
**说明**：会话ID
**示例值**：`session-12345`


**环境变量**：`CLAUDE_USER_HOME`
**说明**：用户主目录
**示例值**：`C:/Users/admin`


**在脚本中使用**：

**Python**：
```python
import os
project_dir = os.getenv('CLAUDE_PROJECT_DIR', os.getcwd())
```

**Bash**：
```bash
project_dir="${CLAUDE_PROJECT_DIR:-$(pwd)}"
```

**Windows Batch**：
```batch
set PROJECT_DIR=%CLAUDE_PROJECT_DIR%
```


### 3.4 错误处理
#### 超时处理
如果Hook脚本运行时间超过`timeout`设置，会被强制终止。

**建议**：
- 快速Hook：5秒
- 复杂Hook：30秒
- 避免无限循环

#### 错误日志
Hook脚本的**stderr输出**会显示在Claude Code的调试日志中。

**推荐写法**：
```python
# Python
print("调试信息", file=sys.stderr)

# Bash
echo "调试信息" >&2

# Node.js
console.error("调试信息");
```

#### 退出码

**退出码**：`0`
**说明**：成功


**退出码**：`非0`
**说明**：失败（但不会阻止工具执行）


## 4. 实战练习
### 4.1 练习1：文件保护Hook
**目标**：禁止删除`important/`目录下的文件。

**提示**：
1、创建PreToolUse Hook
2、Matcher匹配`Bash`工具
3、检查命令中是否包含`rm`和`important/`
4、返回`deny`决策

**参考实现**：

**.claude/settings.json**：
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/pre-tool-use-protect-rm.py"
          }
        ]
      }
    ]
  }
}
```

**脚本：`.claude/hooks/pre-tool-use-protect-rm.py`**：
```python
#!/usr/bin/env python3
import sys
import json

input_data = json.load(sys.stdin)
tool_input = input_data.get('tool_input', {})
command = tool_input.get('command', '')

# 检查是否是危险删除命令
if 'rm' in command and 'important/' in command:
    decision = {
        "decision": "deny",
        "message": "❌ 禁止删除important目录下的文件！\n请确认操作后手动执行。"
    }
    print(json.dumps(decision, ensure_ascii=False))
    sys.exit(0)

sys.exit(0)
```

**测试**：
在Claude中输入：
```
请删除important/test.txt
```

应该看到拒绝消息。


### 4.2 练习2：自动备份Hook
**目标**：在Edit工具修改重要文件后，自动创建.bak备份。

**提示**：
1、创建PostToolUse Hook
2、Matcher匹配`Edit`工具
3、检查file_path是否在重要目录
4、使用Python的shutil.copy创建备份

**参考实现**：

**.claude/settings.json**：
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/post-tool-use-auto-backup.py"
          }
        ]
      }
    ]
  }
}
```

**脚本：`.claude/hooks/post-tool-use-auto-backup.py`**：
```python
#!/usr/bin/env python3
import sys
import json
import shutil
from pathlib import Path
from datetime import datetime

input_data = json.load(sys.stdin)
tool_input = input_data.get('tool_input', {})
file_path = tool_input.get('file_path', '')

# 只备份重要目录
important_dirs = ['config', 'src', 'docs']
should_backup = any(dir in file_path for dir in important_dirs)

if should_backup and Path(file_path).exists():
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = f"{file_path}.{timestamp}.bak"

    shutil.copy2(file_path, backup_path)
    print(f"✅ 备份已创建：{backup_path}", file=sys.stderr)

sys.exit(0)
```


### 4.3 练习3：质量检查Hook
**目标**：在Write工具保存Markdown文件后，检查文章质量（字数、标题、段落）。

**提示**：
1、创建PostToolUse Hook
2、读取文件内容
3、检查：
   - 字数 > 500
   - 有一级标题
   - 段落数 > 3
4、打印质量报告到stderr

**参考实现**：

**脚本：`.claude/hooks/post-tool-use-quality-check.py`**：
```python
#!/usr/bin/env python3
import sys
import json
from pathlib import Path

input_data = json.load(sys.stdin)
tool_input = input_data.get('tool_input', {})
file_path = tool_input.get('file_path', '')

if not file_path.endswith('.md'):
    sys.exit(0)

article_path = Path(file_path)
if not article_path.exists():
    sys.exit(0)

content = article_path.read_text(encoding='utf-8')

# 质量检查
word_count = len(content)
has_title = content.startswith('#')
paragraphs = [p for p in content.split('\n\n') if p.strip()]
paragraph_count = len(paragraphs)

print("\n" + "="*50, file=sys.stderr)
print("📊 文章质量检查报告", file=sys.stderr)
print("="*50, file=sys.stderr)
print(f"字数：{word_count} {'✅' if word_count > 500 else '⚠️ 偏短'}", file=sys.stderr)
print(f"标题：{'✅ 有' if has_title else '❌ 缺少'}", file=sys.stderr)
print(f"段落数：{paragraph_count} {'✅' if paragraph_count > 3 else '⚠️ 偏少'}", file=sys.stderr)
print("="*50 + "\n", file=sys.stderr)

sys.exit(0)
```

**输出效果**：
```
==================================================
📊 文章质量检查报告
==================================================
字数：1523 ✅
标题：✅ 有
段落数：8 ✅
==================================================
```


## 📚 附录
### A. 常见问题
#### Q1: Hook脚本没有执行？
**检查清单**：
1、✅ settings.json配置正确？
2、✅ 脚本路径存在？
3、✅ 脚本有执行权限（Linux/Mac）？
4、✅ Matcher匹配正确的工具名？
5、✅ 查看stderr日志排查错误

#### Q2: Windows上Batch脚本乱码？
**解决方案**：
```batch
@echo off
chcp 65001 >nul  # 设置UTF-8编码
```

#### Q3: Hook超时怎么办？
**优化方法**：
1、减少文件I/O操作
2、避免复杂计算
3、使用异步处理（后台任务）
4、增加timeout配置

#### Q4: 如何调试Hook脚本？
**方法1：日志文件**：
```python
with open('/tmp/hook-debug.log', 'a') as f:
    f.write(f"Debug: {data}\n")
```

**方法2：stderr输出**：
```python
print("调试信息", file=sys.stderr)
```


### B. 完整配置示例
**完整的`.claude/settings.json`**：
```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node .claude/hooks/user-prompt-submit.js",
            "timeout": 5
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/pre-tool-use-research-validator.bat"
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/pre-tool-use-protect-rm.py"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": ".claude/hooks/post-tool-use-format-fixer.bat",
            "timeout": 30
          }
        ]
      },
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/post-tool-use-auto-backup.py"
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/session-start-init.py"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/session-end-cleanup.sh"
          }
        ]
      }
    ]
  }
}
```


### C. 参考资源
- **Claude Code官方文档**：https://docs.anthropic.com/claude-code
- **Hooks API参考**：https://docs.anthropic.com/claude-code/hooks
- **社区示例**：https://github.com/anthropics/claude-code-examples


## 🎯 总结
通过本手册，你已经掌握：

1、✅ **Hooks系统架构**：6种Hook类型及触发时机
2、✅ **PreToolUse**：工具调用前验证、权限控制
3、✅ **PostToolUse**：工具调用后处理、自动化任务
4、✅ **UserPromptSubmit**：提示词优化
5、✅ **配置规范**：Matcher语法、JSON格式、环境变量
6、✅ **实战案例**：基于真实项目的完整示例

**下一步**：
- 参考当前项目的`.claude/hooks/`目录
- 修改示例脚本适配你的需求
- 逐步添加自动化Hook提高效率

**记住**：Hooks是自动化的核心，合理使用可以大幅提升开发体验！


**文档版本**：v1.0
**最后更新**：2025-12-11
**作者**：Claude Code教程团队
