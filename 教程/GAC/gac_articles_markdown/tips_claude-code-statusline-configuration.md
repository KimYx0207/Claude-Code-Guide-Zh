# Claude Code 状态栏配置指南

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 高级教程
**标签**: #Claude Code #状态栏 #自定义配置 #界面优化

---

为 Claude Code 创建自定义状态栏以显示上下文信息，打造个性化界面。

通过自定义状态栏让 Claude Code 成为您专属的工具，状态栏显示在 Claude Code 界面底部，类似于终端提示符在 Oh-my-zsh 等 shell 中的工作方式。

### 什么是状态栏

状态栏是显示在 Claude Code 界面底部的一行信息，可以实时显示：

- 当前使用的 AI 模型
- 当前工作目录
- Git 分支信息
- 会话统计信息
- 任何您想显示的自定义内容

### 创建自定义状态栏

您可以选择以下两种方式之一：

#### 方法一：使用自动配置命令

运行 /statusline 让 Claude Code 帮助您设置自定义状态栏。

#### 方法二：手动配置文件

直接在您的 .claude/settings.json 中添加 statusLine 配置：

```bash
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh",
    "padding": 0
  }
}
```

- command：状态栏脚本的路径
- padding：可选，设置为 0 让状态栏延伸到边缘

### 状态栏工作原理

了解状态栏的工作机制有助于更好地自定义：

- 自动更新：对话消息更新时状态栏会自动更新
- 更新频率：最多每 300ms 运行一次，避免频繁刷新
- 输出格式：脚本输出的第一行成为状态栏文本
- 样式支持：支持 ANSI 颜色代码来美化状态栏
- 数据传递：通过 JSON 格式接收会话上下文信息

### 理解 JSON 输入数据

状态栏脚本会接收包含会话信息的 JSON 数据，主要包括：

```bash
{
  "hook_event_name": "Status",
  "session_id": "abc123...",
  "cwd": "/current/working/directory",
  "model": {
    "id": "claude-opus-4-1",
    "display_name": "Opus"
  },
  "workspace": {
    "current_dir": "/current/working/directory",
    "project_dir": "/original/project/directory"
  },
  "cost": {
    "total_cost_usd": 0.01234,
    "total_lines_added": 156,
    "total_lines_removed": 23
  }
}
```

关键字段解释：

- model.display_name：当前使用的 AI 模型名称
- workspace.current_dir：当前工作目录
- workspace.project_dir：项目根目录
- cost.total_cost_usd：本次会话总费用
- cost.total_lines_added：新增代码行数

### 实用示例脚本

#### 简单基础版本

适合初学者的最简单状态栏：

```bash
#!/bin/bash
# 从 stdin 读取 JSON 输入
input=$(cat)

# 使用 jq 提取值
MODEL_DISPLAY=$(echo "$input" | jq -r '.model.display_name')
CURRENT_DIR=$(echo "$input" | jq -r '.workspace.current_dir')

echo "[$MODEL_DISPLAY] 📁 ${CURRENT_DIR##*/}"
```

#### Git 集成版本

显示当前 Git 分支信息：

```bash
#!/bin/bash
# 从 stdin 读取 JSON 输入
input=$(cat)

# 使用 jq 提取值
MODEL_DISPLAY=$(echo "$input" | jq -r '.model.display_name')
CURRENT_DIR=$(echo "$input" | jq -r '.workspace.current_dir')

# 如果在 git 仓库中则显示 git 分支
GIT_BRANCH=""
if git rev-parse --git-dir > /dev/null 2>&1; then
    BRANCH=$(git branch --show-current 2>/dev/null)
    if [ -n "$BRANCH" ]; then
        GIT_BRANCH=" | 🌿 $BRANCH"
    fi
fi

echo "[$MODEL_DISPLAY] 📁 ${CURRENT_DIR##*/}$GIT_BRANCH"
```

#### Python 版本

如果您更喜欢使用 Python：

```bash
#!/usr/bin/env python3
import json
import sys
import os

# 从 stdin 读取 JSON
data = json.load(sys.stdin)

# 提取值
model = data['model']['display_name']
current_dir = os.path.basename(data['workspace']['current_dir'])

# 检查 git 分支
git_branch = ""
if os.path.exists('.git'):
    try:
        with open('.git/HEAD', 'r') as f:
            ref = f.read().strip()
            if ref.startswith('ref: refs/heads/'):
                git_branch = f" | 🌿 {ref.replace('ref: refs/heads/', '')}"
    except:
        pass

print(f"[{model}] 📁 {current_dir}{git_branch}")
```

#### 高级 Bash 版本

使用辅助函数让代码更清晰：

```bash
#!/bin/bash
# 一次性读取 JSON 输入
input=$(cat)

# 定义辅助函数
get_model_name() { echo "$input" | jq -r '.model.display_name'; }
get_current_dir() { echo "$input" | jq -r '.workspace.current_dir'; }
get_cost() { echo "$input" | jq -r '.cost.total_cost_usd'; }

# 使用辅助函数
MODEL=$(get_model_name)
DIR=$(get_current_dir)
COST=$(get_cost)

echo "[$MODEL] 📁 ${DIR##*/} 💰 $COST"
```

### 使用技巧

#### 保持简洁

- 状态栏应该适合在一行显示完整
- 避免显示过多信息造成界面混乱
- 选择最重要的信息优先显示

#### 美化显示

- 使用表情符号让信息更直观（如果终端支持）
- 使用颜色代码突出重要信息
- 合理使用分隔符提高可读性

#### 性能优化

- 避免在状态栏脚本中执行耗时操作
- 如需复杂操作，考虑缓存结果
- 测试脚本的执行速度

#### 测试方法

手动测试您的状态栏脚本：

```bash
echo '{"model":{"display_name":"Test"},"workspace":{"current_dir":"/test"}}' | ./statusline.sh
```

### 进阶配置

#### 颜色配置

使用 ANSI 颜色代码：

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir')

# 使用颜色
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${ORANGE}[$MODEL]${NC} ${BLUE}📁 ${DIR##*/}${NC}"
```

#### 条件显示

根据不同条件显示不同内容：

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
COST=$(echo "$input" | jq -r '.cost.total_cost_usd')

# 根据费用显示不同颜色
if (( $(echo "$COST > 0.1" | bc -l) )); then
    COLOR='\033[0;31m' # 红色
else
    COLOR='\033[0;32m' # 绿色
fi

echo -e "${COLOR}[$MODEL] 💰 $COST${NC}"
```

### 相关文档

- Claude Code 配置 - 基本配置选项
- Claude Code 高级功能 - 更多自定义功能
- Claude Code Hooks 参考 - 事件处理机制
- Claude Code 基础使用 - 基本操作指南
