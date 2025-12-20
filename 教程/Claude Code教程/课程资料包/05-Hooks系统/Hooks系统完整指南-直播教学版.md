# Hooks系统完整指南：自动化工作流的终极武器

> **课程信息**
>
> - **预计学时**：4-6小时
> - **难度等级**：⭐⭐ 入门级（有Claude Code基础即可）
> - **更新日期**：2025年12月
> - **适用版本**：Claude Code v2.0+
> - **前置要求**：已完成Claude Code安装和基础使用

---

## 本课学习目标

完成本课学习后，你将能够：

1. **理解Hooks的核心价值**：掌握Hooks与传统提示词的本质区别
2. **配置第一个Hook**：5分钟内完成最简单的Hook配置并看到效果
3. **掌握6种Hook类型**：PreToolUse、PostToolUse、UserPromptSubmit等全部类型
4. **实现自动化工作流**：Git提交检查、代码格式化、文件保护等实战场景
5. **排查Hook故障**：独立解决90%的常见配置和执行问题
6. **安全使用Hooks**：理解安全风险并正确配置权限

---

## 学习路径导航（先看这里！）

> **根据你的情况选择学习路径**：这是一篇3000+行的长教程，不用全看！根据你的目标选择路径。

### 路径A：快速上手（30分钟）

**适合人群**：急着体验Hooks，想快速配一个看效果

**只看这些章节**（其他跳过）：

```
✅ 术语表（5分钟） - 快速了解Hook核心概念
✅ 第一部分1.1-1.2：Hooks简介（5分钟） - 理解Hook是什么
✅ 第二部分：5分钟快速开始（15分钟） - 配置第一个Hook
✅ 第三部分3.1：PreToolUse基础（5分钟） - 最常用的Hook类型
```

**30分钟后你能达到**：成功配置第一个Hook，Claude Code能自动执行你的脚本

---

### 路径B：完整学习（4-6小时）

**适合人群**：想深入理解Hooks，掌握所有类型和高级用法

**学习顺序**：从头到尾所有章节

**建议分段学习**：
- 第1天（2小时）：第1-3部分（理解+6种类型）
- 第2天（2小时）：第4-5部分（实战场景+故障排查）
- 第3天（1小时）：第6-7部分（FAQ+附录）

---

### 路径C：问题排查（10分钟）

**适合人群**：Hook配置出问题，需要快速解决

**直接跳到这些章节**：

```
🔧 第五部分：故障排查 - 按错误类型查找解决方案
🔧 第六部分：FAQ - 20个常见问题解答
```

**使用方法**：
1. 按 `Ctrl + F` 搜索你的错误信息关键词
2. 找到对应的Q&A
3. 按步骤解决

---

### 路径D：专项学习（30-60分钟/主题）

**适合人群**：已经会配置Hook，想学习特定功能

| 想学什么 | 看哪几节 | 预计时间 |
|----------|---------|---------|
| **Git自动化** | 第四部分4.1节 | 45分钟 |
| **代码格式化** | 第四部分4.2节 | 30分钟 |
| **文件保护** | 第三部分3.1节 | 20分钟 |
| **提示词优化** | 第三部分3.3节 | 30分钟 |
| **安全最佳实践** | 第一部分1.4节 + 第五部分 | 40分钟 |

---

## 术语表（小白必读）

在开始之前，先了解这些关键术语。**用生活类比帮助理解**：

| 术语 | 英文全称 | 通俗解释 | 生活类比 |
|------|----------|----------|----------|
| **Hook** | - | 在特定事件发生时自动执行的脚本 | 汽车传感器（检测到碰撞自动弹安全气囊） |
| **PreToolUse** | Pre Tool Use | 工具调用**前**触发的Hook | 机场安检门（登机前检查） |
| **PostToolUse** | Post Tool Use | 工具调用**后**触发的Hook | 快递签收后的自动通知 |
| **UserPromptSubmit** | User Prompt Submit | 用户输入提交时触发的Hook | 邮件发送前的拼写检查 |
| **Notification** | - | 通知事件触发的Hook | 手机APP推送通知 |
| **SessionStart** | Session Start | 会话开始时触发的Hook | 开机自动启动程序 |
| **SessionEnd** | Session End | 会话结束时触发的Hook | 关机前自动保存 |
| **Stop** | - | AI停止响应时触发的Hook | 紧急刹车后的状态保存 |
| **Matcher** | - | 匹配规则，决定Hook对哪些工具生效 | 筛选器（只检查特定行李） |
| **Decision** | - | PreToolUse Hook的返回决策 | 安检结果（放行/拦截/询问） |
| **stdin** | Standard Input | 标准输入，Hook接收数据的方式 | 传送带送入检查口 |
| **stdout** | Standard Output | 标准输出，Hook返回结果的方式 | 检查结果显示屏 |
| **stderr** | Standard Error | 标准错误输出，用于日志 | 后台监控日志 |
| **timeout** | - | 超时时间，Hook最长运行时间 | 限时检查（超时自动放行） |

---

## 第一部分：Hooks简介（5分钟理解）

### 1.1 Hooks是什么

> **一句话理解**：Hooks是Claude Code的"自动化传感器"，在特定事件发生时自动执行你的脚本，实现100%可靠的自动化。

#### 为什么需要Hooks？

**没有Hooks之前（靠AI"记住"）**：

```
问题：AI有时会"忘记"你的要求

你：每次写代码后帮我运行格式化
Claude：好的！（这次记住了）

...10分钟后...

Claude：代码写好了！
你：等等，你忘了格式化！
Claude：抱歉，我忘了...
```

**有了Hooks之后（100%自动执行）**：

```
解决方案：不依赖AI记忆，配置Hook后自动执行

配置PostToolUse Hook → 监听Write工具 → 自动运行格式化脚本

Claude：代码写好了！
[Hook自动触发：运行 prettier --write xxx.js]
结果：代码已自动格式化，100%不会忘记
```

> **生活类比**：
> - **没有Hooks**：靠人记住每次开车前检查轮胎（经常忘）
> - **有Hooks后**：汽车传感器自动检测胎压，异常自动报警（100%可靠）

#### Hooks的核心价值

| 对比维度 | 提示词方式 | Hooks方式 |
|----------|-----------|-----------|
| **可靠性** | 不确定（AI可能忘记） | 100%执行（确定性） |
| **一致性** | 每次可能不同 | 每次完全相同 |
| **自动化** | 需要AI主动执行 | 事件触发自动执行 |
| **团队协作** | 每人都要提醒AI | 配置一次，全员生效 |
| **适用场景** | 灵活建议 | 强制规则 |

### 1.2 Hooks能做什么（6个实际案例）

**案例1：文件保护（PreToolUse）**
```
场景：禁止Claude修改production目录下的文件

Hook触发：Claude尝试Write(file_path="production/config.js")
Hook检查：路径包含"production/"
Hook决策：deny（拒绝）
结果：Claude收到错误提示，文件未被修改
```

**案例2：代码格式化（PostToolUse）**
```
场景：每次保存代码后自动格式化

Hook触发：Claude成功执行Write(file_path="src/app.js")
Hook执行：运行 prettier --write src/app.js
结果：代码自动格式化，无需手动操作
```

**案例3：提示词优化（UserPromptSubmit）**
```
场景：自动在写作任务后追加写作规范

用户输入："帮我写一篇关于AI的文章"
Hook检测：包含"写"和"文章"关键词
Hook追加："\n\n## 写作规范\n1. 风格：接地气\n2. 字数：1500字"
Claude收到：原始输入 + 写作规范
```

**案例4：Git提交检查（PreToolUse + Bash）**
```
场景：提交前自动检查代码质量

Hook触发：Claude执行Bash(command="git commit -m xxx")
Hook执行：运行lint检查、测试、敏感信息扫描
Hook决策：全部通过 → allow；有问题 → deny
结果：低质量代码无法提交
```

**案例5：会话初始化（SessionStart）**
```
场景：启动Claude Code时自动加载项目配置

Hook触发：Claude Code启动
Hook执行：检查Python依赖是否安装
结果：缺少依赖时自动提示安装命令
```

**案例6：桌面通知（Notification）**
```
场景：Claude需要用户确认时发送桌面通知

Hook触发：Claude发送通知请求用户确认
Hook执行：调用系统通知API
结果：用户收到桌面弹窗，不会错过重要确认
```

### 1.3 Hooks执行流程

**完整生命周期图**：

```
用户输入
    ↓
[UserPromptSubmit Hook] ← 可以修改/增强提示词
    ↓
Claude处理提示词
    ↓
决定调用工具（如Write）
    ↓
[PreToolUse Hook] ← 可以允许/拒绝/询问
    ↓
执行工具（如Write）
    ↓
[PostToolUse Hook] ← 可以执行后处理
    ↓
返回结果给用户
```

**6种Hook类型触发时机**：

| Hook类型 | 触发时机 | 典型用途 | 可否阻止后续操作 |
|----------|----------|----------|-----------------|
| **UserPromptSubmit** | 用户输入提交后 | 提示词优化、敏感词过滤 | ✅ 是 |
| **PreToolUse** | 工具调用前 | 权限校验、参数验证 | ✅ 是 |
| **PostToolUse** | 工具调用后 | 格式修复、自动测试 | ❌ 否 |
| **Notification** | 通知发送时 | 日志记录、桌面通知 | ❌ 否 |
| **SessionStart** | 会话开始时 | 环境初始化 | ❌ 否 |
| **SessionEnd** | 会话结束时 | 清理临时文件 | ❌ 否 |
| **Stop** | AI停止响应时 | 保存状态 | ❌ 否 |

### 1.4 安全警告（重要！）

> ⚠️ **严重警告**：Hooks可以执行**任意Shell命令**，这意味着配置不当可能导致：
> - 文件被删除或修改
> - 敏感信息泄露
> - 系统被恶意脚本攻击

**安全最佳实践**：

| 风险 | 防护措施 |
|------|---------|
| **恶意脚本** | 只运行你信任的脚本，不要从不明来源复制配置 |
| **权限过大** | 脚本只请求必要的权限，避免使用sudo |
| **敏感信息** | 不要在脚本中硬编码密码/Token |
| **无限循环** | 设置合理的timeout，避免脚本卡死 |
| **团队配置** | 代码审查.claude/settings.json变更 |

**配置检查清单**：

```
□ 脚本来源可信吗？（自己写的/官方示例/信任的开源）
□ 脚本权限最小化了吗？（不需要sudo就不用）
□ 敏感信息用环境变量了吗？（不硬编码）
□ 设置了合理的timeout吗？（防止卡死）
□ 团队成员都知道这个Hook吗？（透明度）
```

---

## 第二部分：5分钟快速开始（立即见效）

> **本节目的**：用最快速度配置第一个Hook，让你立即看到效果！
>
> ⏱️ **预计时间**：5-10分钟

### 2.1 配置第一个Hook（最简单版本）

**为什么选这个示例？**

- ✅ 最简单，只需要3个文件
- ✅ 效果直观，立即看到输出
- ✅ 无依赖，不需要安装任何东西

#### 步骤1：创建Hook脚本目录

**这一步要做什么**：在项目根目录创建 `.claude/hooks/` 目录

**Windows系统（PowerShell）：**
```powershell
# 进入你的项目目录
cd C:\你的项目路径

# 创建hooks目录
New-Item -ItemType Directory -Path ".claude\hooks" -Force
```

**macOS/Linux系统：**
```bash
# 进入你的项目目录
cd ~/你的项目路径

# 创建hooks目录
mkdir -p .claude/hooks
```

**验证是否成功：**
```bash
# 检查目录是否存在
ls .claude/hooks
# 应该显示空目录（暂时没有文件）
```

#### 步骤2：创建最简单的Hook脚本

**这一步要做什么**：创建一个Python脚本，在每次Write工具执行后打印提示

**创建文件 `.claude/hooks/post-write-hello.py`**：

**Windows（PowerShell）：**
```powershell
@'
#!/usr/bin/env python3
"""
最简单的PostToolUse Hook示例
每次Write工具执行后打印一条消息
"""
import sys
import json

# 从stdin读取工具执行信息
try:
    input_data = json.loads(sys.stdin.read())
except:
    sys.exit(0)

# 获取工具名称和文件路径
tool_name = input_data.get('tool_name', '')
tool_input = input_data.get('tool_input', {})
file_path = tool_input.get('file_path', '')

# 只处理Write工具
if tool_name == 'Write':
    # 打印到stderr（会显示在Claude Code界面）
    print(f"\n{'='*50}", file=sys.stderr)
    print(f"✅ Hook触发成功！", file=sys.stderr)
    print(f"📄 文件已保存: {file_path}", file=sys.stderr)
    print(f"{'='*50}\n", file=sys.stderr)

sys.exit(0)
'@ | Out-File -FilePath ".claude\hooks\post-write-hello.py" -Encoding utf8
```

**macOS/Linux：**
```bash
cat > .claude/hooks/post-write-hello.py << 'EOF'
#!/usr/bin/env python3
"""
最简单的PostToolUse Hook示例
每次Write工具执行后打印一条消息
"""
import sys
import json

# 从stdin读取工具执行信息
try:
    input_data = json.loads(sys.stdin.read())
except:
    sys.exit(0)

# 获取工具名称和文件路径
tool_name = input_data.get('tool_name', '')
tool_input = input_data.get('tool_input', {})
file_path = tool_input.get('file_path', '')

# 只处理Write工具
if tool_name == 'Write':
    # 打印到stderr（会显示在Claude Code界面）
    print(f"\n{'='*50}", file=sys.stderr)
    print(f"✅ Hook触发成功！", file=sys.stderr)
    print(f"📄 文件已保存: {file_path}", file=sys.stderr)
    print(f"{'='*50}\n", file=sys.stderr)

sys.exit(0)
EOF

# 添加执行权限（macOS/Linux必须）
chmod +x .claude/hooks/post-write-hello.py
```

**验证脚本创建成功：**
```bash
# 查看文件内容
cat .claude/hooks/post-write-hello.py
# 应该显示你刚才写入的Python代码
```

#### 步骤3：配置settings.json

**这一步要做什么**：告诉Claude Code在PostToolUse时运行你的脚本

**创建或编辑 `.claude/settings.json`**：

**Windows（PowerShell）：**
```powershell
@'
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/post-write-hello.py",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
'@ | Out-File -FilePath ".claude\settings.json" -Encoding utf8
```

**macOS/Linux：**
```bash
cat > .claude/settings.json << 'EOF'
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/post-write-hello.py",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
EOF
```

> 💡 **配置说明**：
> - `"PostToolUse"`：Hook类型，工具执行后触发
> - `"matcher": "Write"`：只匹配Write工具
> - `"command"`：要执行的脚本命令
> - `"timeout": 10`：超时10秒

#### 步骤4：启动Claude Code并测试

**这一步要做什么**：重启Claude Code，让它读取新配置

```bash
# 在项目目录启动Claude Code
claude
```

**测试命令**：

```
你：帮我创建一个test.txt文件，内容是"Hello Hooks!"
```

**预期结果**：

```
Claude：我来帮你创建test.txt文件。

[Write工具执行]

==================================================
✅ Hook触发成功！
📄 文件已保存: /你的项目路径/test.txt
==================================================

文件已创建成功！
```

> ✅ **关键确认**：看到 `Hook触发成功！` 说明Hook配置正确并成功执行！

### 2.2 验证Hook工作正常

**完整验证清单**：

- [ ] `.claude/hooks/` 目录存在
- [ ] `.claude/hooks/post-write-hello.py` 文件存在且内容正确
- [ ] `.claude/settings.json` 文件存在且JSON格式正确
- [ ] macOS/Linux上脚本有执行权限（`chmod +x`）
- [ ] Claude Code启动时没有报错
- [ ] 让Claude创建文件后看到Hook输出

**如果没有看到Hook输出**：

1. **检查JSON格式**：
```bash
# 验证JSON格式是否正确
python -c "import json; json.load(open('.claude/settings.json'))"
# 如果没报错说明格式正确
```

2. **检查Python是否可用**：
```bash
python --version
# 应该显示Python 3.x
```

3. **手动测试脚本**：
```bash
echo '{"tool_name": "Write", "tool_input": {"file_path": "test.txt"}}' | python .claude/hooks/post-write-hello.py
# 应该显示Hook触发成功的消息
```

### 2.3 恭喜完成第一个Hook！

**你刚才完成了什么？**

1. ✅ 创建了Hook脚本目录
2. ✅ 编写了第一个Hook脚本
3. ✅ 配置了settings.json
4. ✅ 验证了Hook正常工作

**接下来可以**：

- 继续学习6种Hook类型（第三部分）
- 学习实战应用场景（第四部分）
- 遇到问题查看故障排查（第五部分）

---

## 第三部分：6种Hook类型详解

> **本节目的**：掌握所有Hook类型的用法
>
> ⏱️ **预计时间**：1.5-2小时

### 3.1 PreToolUse（工具调用前）

> **一句话理解**：PreToolUse就像"安检门"，在工具执行前检查是否允许通过。

#### 触发时机

在Claude准备调用工具（如Write、Edit、Bash）时，**但尚未执行**。

#### 输入参数（通过stdin的JSON）

```json
{
  "tool_name": "Write",
  "tool_input": {
    "file_path": "C:/project/src/app.js",
    "content": "console.log('Hello World');"
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `tool_name` | string | 工具名称（Write, Edit, Bash, Read等） |
| `tool_input` | object | 工具的输入参数 |

#### 决策输出（通过stdout的JSON）

PreToolUse Hook可以返回**决策指令**控制工具是否执行：

```json
{
  "decision": "deny",
  "message": "❌ 禁止修改production目录下的文件"
}
```

| decision值 | 说明 | 工具是否执行 |
|------------|------|-------------|
| `"allow"` | 允许执行 | ✅ 是 |
| `"deny"` | 拒绝执行 | ❌ 否 |
| `"ask"` | 询问用户 | 🤔 等待用户决定 |
| `"message"` | 仅显示消息 | ✅ 是（显示后继续） |
| 无输出 | 默认允许 | ✅ 是 |

#### 完整示例1：文件保护Hook

**场景**：禁止修改`production/`目录下的文件

**脚本 `.claude/hooks/pre-protect-production.py`**：

```python
#!/usr/bin/env python3
"""
PreToolUse Hook - 保护production目录
禁止Write/Edit工具修改production目录下的文件
"""
import sys
import json

# 读取stdin的JSON输入
try:
    input_data = json.loads(sys.stdin.read())
except json.JSONDecodeError:
    sys.exit(0)

tool_name = input_data.get('tool_name', '')
tool_input = input_data.get('tool_input', {})
file_path = tool_input.get('file_path', '')

# 只检查Write和Edit工具
if tool_name not in ['Write', 'Edit']:
    sys.exit(0)

# 规范化路径（处理Windows和Unix路径）
file_path_normalized = file_path.replace('\\', '/')

# 检查是否是保护目录
protected_dirs = ['production/', 'prod/', '.env']
for protected in protected_dirs:
    if protected in file_path_normalized:
        # 拒绝执行
        decision = {
            "decision": "deny",
            "message": f"❌ 禁止修改受保护的路径！\n路径: {file_path}\n原因: 包含受保护目录 '{protected}'\n\n请先切换到dev环境或手动操作。"
        }
        print(json.dumps(decision, ensure_ascii=False))
        sys.exit(0)

# 允许执行（无输出=默认allow）
sys.exit(0)
```

**配置 `.claude/settings.json`**：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/pre-protect-production.py",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**运行效果**：

当Claude尝试修改`production/config.json`时：

```
Claude：我来修改production/config.json...

❌ 禁止修改受保护的路径！
路径: C:/project/production/config.json
原因: 包含受保护目录 'production/'

请先切换到dev环境或手动操作。
```

#### 完整示例2：危险命令拦截Hook

**场景**：拦截危险的Bash命令（如rm -rf）

**脚本 `.claude/hooks/pre-block-dangerous-cmd.py`**：

```python
#!/usr/bin/env python3
"""
PreToolUse Hook - 拦截危险命令
阻止执行可能造成破坏的Shell命令
"""
import sys
import json
import re

# 危险命令模式
DANGEROUS_PATTERNS = [
    r'rm\s+-rf\s+/',           # rm -rf /
    r'rm\s+-rf\s+~',           # rm -rf ~
    r'rm\s+-rf\s+\*',          # rm -rf *
    r'rm\s+-rf\s+\.\.',        # rm -rf ..
    r':()\s*{\s*:\|:&\s*};:',  # Fork炸弹
    r'mkfs\.',                  # 格式化磁盘
    r'dd\s+if=.+of=/dev/',     # 覆盖磁盘
    r'>\s*/dev/sda',           # 覆盖磁盘
    r'chmod\s+-R\s+777\s+/',   # 危险权限
]

# 读取输入
try:
    input_data = json.loads(sys.stdin.read())
except json.JSONDecodeError:
    sys.exit(0)

tool_name = input_data.get('tool_name', '')
tool_input = input_data.get('tool_input', {})
command = tool_input.get('command', '')

# 只检查Bash工具
if tool_name != 'Bash':
    sys.exit(0)

# 检查危险模式
for pattern in DANGEROUS_PATTERNS:
    if re.search(pattern, command, re.IGNORECASE):
        decision = {
            "decision": "deny",
            "message": f"🚨 危险命令已拦截！\n\n命令: {command}\n\n匹配的危险模式: {pattern}\n\n如果确实需要执行，请在终端手动运行。"
        }
        print(json.dumps(decision, ensure_ascii=False))
        sys.exit(0)

sys.exit(0)
```

**配置**：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/pre-block-dangerous-cmd.py",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

### 3.2 PostToolUse（工具调用后）

> **一句话理解**：PostToolUse就像"快递签收通知"，在工具成功执行后自动触发后续操作。

#### 触发时机

在工具**成功执行后**立即触发，可以处理工具的输出结果。

#### 输入参数（通过stdin的JSON）

```json
{
  "tool_name": "Write",
  "tool_input": {
    "file_path": "C:/project/src/app.js",
    "content": "console.log('Hello');"
  },
  "tool_output": {
    "success": true,
    "message": "File written successfully"
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `tool_name` | string | 工具名称 |
| `tool_input` | object | 工具的输入参数 |
| `tool_output` | object | 工具的输出结果 |

#### 输出格式

PostToolUse Hook**不返回决策**（工具已经执行完了），只能：
- 执行后处理任务（格式化、备份、测试）
- 打印日志到stderr（显示在Claude Code界面）

#### 完整示例1：自动代码格式化

**场景**：在Write工具保存.js/.ts文件后，自动运行Prettier格式化

**脚本 `.claude/hooks/post-auto-format.py`**：

```python
#!/usr/bin/env python3
"""
PostToolUse Hook - 自动代码格式化
保存代码文件后自动运行对应的格式化工具
"""
import sys
import json
import subprocess
from pathlib import Path

# 格式化工具配置
FORMATTERS = {
    '.js': 'npx prettier --write "{file}"',
    '.ts': 'npx prettier --write "{file}"',
    '.jsx': 'npx prettier --write "{file}"',
    '.tsx': 'npx prettier --write "{file}"',
    '.json': 'npx prettier --write "{file}"',
    '.css': 'npx prettier --write "{file}"',
    '.py': 'black "{file}"',
    '.go': 'gofmt -w "{file}"',
}

# 排除的目录
EXCLUDED_DIRS = {'node_modules', 'venv', '.venv', '__pycache__', 'dist', 'build', '.git'}

def should_format(file_path: str) -> bool:
    """检查是否应该格式化该文件"""
    path = Path(file_path)

    # 检查是否在排除目录中
    for part in path.parts:
        if part in EXCLUDED_DIRS:
            return False

    # 检查文件扩展名
    return path.suffix in FORMATTERS

def run_formatter(file_path: str) -> str:
    """运行格式化工具"""
    path = Path(file_path)
    suffix = path.suffix

    if suffix not in FORMATTERS:
        return None

    cmd = FORMATTERS[suffix].format(file=file_path)

    try:
        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30
        )
        if result.returncode == 0:
            return f"✅ 格式化成功"
        else:
            return f"⚠️ 格式化失败: {result.stderr[:100]}"
    except subprocess.TimeoutExpired:
        return "⚠️ 格式化超时"
    except FileNotFoundError:
        return "⚠️ 格式化工具未安装"
    except Exception as e:
        return f"⚠️ 格式化错误: {str(e)}"

def main():
    # 读取输入
    try:
        input_data = json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        return

    tool_name = input_data.get('tool_name', '')
    tool_input = input_data.get('tool_input', {})
    file_path = tool_input.get('file_path', '')

    # 只处理Write工具
    if tool_name != 'Write':
        return

    # 检查是否需要格式化
    if not file_path or not should_format(file_path):
        return

    # 运行格式化
    result = run_formatter(file_path)
    if result:
        print(f"\n[AutoFormat] {Path(file_path).name}: {result}", file=sys.stderr)

if __name__ == '__main__':
    main()
```

**配置**：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/post-auto-format.py",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**运行效果**：

```
Claude：我来创建app.js文件...

[Write工具执行成功]

[AutoFormat] app.js: ✅ 格式化成功
```

#### 完整示例2：自动备份Hook

**场景**：在Edit工具修改重要文件后，自动创建备份

**脚本 `.claude/hooks/post-auto-backup.py`**：

```python
#!/usr/bin/env python3
"""
PostToolUse Hook - 自动备份
编辑重要文件后自动创建.bak备份
"""
import sys
import json
import shutil
from pathlib import Path
from datetime import datetime

# 需要备份的目录
BACKUP_DIRS = ['config', 'src', 'docs', '.claude']

def main():
    try:
        input_data = json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        return

    tool_name = input_data.get('tool_name', '')
    tool_input = input_data.get('tool_input', {})
    file_path = tool_input.get('file_path', '')

    # 只处理Edit工具
    if tool_name != 'Edit':
        return

    # 检查是否在需要备份的目录中
    should_backup = any(dir_name in file_path for dir_name in BACKUP_DIRS)

    if should_backup and Path(file_path).exists():
        # 创建备份
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = f"{file_path}.{timestamp}.bak"

        try:
            shutil.copy2(file_path, backup_path)
            print(f"[Backup] ✅ 已创建备份: {Path(backup_path).name}", file=sys.stderr)
        except Exception as e:
            print(f"[Backup] ⚠️ 备份失败: {e}", file=sys.stderr)

if __name__ == '__main__':
    main()
```

### 3.3 UserPromptSubmit（用户提示词提交）

> **一句话理解**：UserPromptSubmit就像"邮件发送前的自动补充"，可以在用户输入发送给Claude之前自动增强或过滤。

#### 触发时机

在用户提交提示词后，**Claude处理之前**。

#### 输入参数

直接从stdin读取用户输入的**原始文本**（不是JSON）：

```
请帮我写一篇关于AI的文章
```

#### 输出格式

直接输出修改后的提示词文本（不是JSON）：

```
请帮我写一篇关于AI的文章

## 写作要求
- 字数：1500字
- 风格：老金式接地气风格
- 包含实战案例
```

#### 完整示例：写作规范自动追加

**场景**：检测到写作任务时，自动追加写作规范

**脚本 `.claude/hooks/user-prompt-enhance.py`**：

```python
#!/usr/bin/env python3
"""
UserPromptSubmit Hook - 提示词自动增强
检测到特定任务时自动追加相关规范
"""
import sys

# 从stdin读取用户输入
user_input = sys.stdin.read().strip()

# 过滤简单回复（不需要增强）
simple_responses = ['好的', '是的', '继续', 'ok', 'yes', 'no', '确认', '取消']
if user_input.lower() in simple_responses or len(user_input) < 5:
    print(user_input)
    sys.exit(0)

# 过滤斜杠命令
if user_input.startswith('/'):
    print(user_input)
    sys.exit(0)

# 检查是否是写作任务
writing_keywords = ['写', '文章', '生成', '创作', 'write', 'article', '内容']
is_writing_task = any(kw in user_input.lower() for kw in writing_keywords)

if is_writing_task:
    # 追加写作规范
    enhanced = f"""{user_input}

---
## 写作规范提醒（自动追加）
1. **风格**：接地气、说人话，避免AI腔
2. **结构**：开头金句 -> 核心要点 -> 实战案例 -> 总结升华
3. **字数**：1500-2000字
4. **检查**：完成后运行 /pre-check 进行质量检查
---"""
    print(enhanced)
else:
    print(user_input)

sys.exit(0)
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
            "command": "python .claude/hooks/user-prompt-enhance.py",
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
帮我写一篇关于Claude Code的介绍文章
```

Claude实际收到：
```
帮我写一篇关于Claude Code的介绍文章

---
## 写作规范提醒（自动追加）
1. **风格**：接地气、说人话，避免AI腔
2. **结构**：开头金句 -> 核心要点 -> 实战案例 -> 总结升华
3. **字数**：1500-2000字
4. **检查**：完成后运行 /pre-check 进行质量检查
---
```

### 3.4 Notification（通知）

> **一句话理解**：Notification Hook就像"消息推送处理器"，在Claude发送通知时触发。

#### 触发时机

当工具（如Bash）通过特殊格式发送通知时。

#### 输入参数

```json
{
  "notification_type": "info",
  "message": "测试通过"
}
```

#### 完整示例：桌面通知Hook

**场景**：将Claude的通知转发到系统桌面通知

**脚本 `.claude/hooks/notification-desktop.py`**：

```python
#!/usr/bin/env python3
"""
Notification Hook - 桌面通知
将Claude的通知转发到系统桌面通知
"""
import sys
import json
import subprocess
import platform

def send_notification(title: str, message: str):
    """发送系统桌面通知"""
    system = platform.system()

    try:
        if system == 'Darwin':  # macOS
            subprocess.run([
                'osascript', '-e',
                f'display notification "{message}" with title "{title}"'
            ])
        elif system == 'Linux':
            subprocess.run(['notify-send', title, message])
        elif system == 'Windows':
            # Windows PowerShell通知
            ps_cmd = f'''
            Add-Type -AssemblyName System.Windows.Forms
            $balloon = New-Object System.Windows.Forms.NotifyIcon
            $balloon.Icon = [System.Drawing.SystemIcons]::Information
            $balloon.BalloonTipTitle = "{title}"
            $balloon.BalloonTipText = "{message}"
            $balloon.Visible = $true
            $balloon.ShowBalloonTip(5000)
            '''
            subprocess.run(['powershell', '-Command', ps_cmd], capture_output=True)
    except Exception as e:
        print(f"通知发送失败: {e}", file=sys.stderr)

def main():
    try:
        input_data = json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        return

    notification_type = input_data.get('notification_type', 'info')
    message = input_data.get('message', '')

    # 构建通知标题
    type_icons = {
        'info': 'i',
        'warning': '!',
        'error': 'X',
        'success': 'V'
    }
    icon = type_icons.get(notification_type, 'i')
    title = f"[{icon}] Claude Code"

    # 发送桌面通知
    send_notification(title, message)
    print(f"[Notification] 已发送桌面通知: {message[:50]}...", file=sys.stderr)

if __name__ == '__main__':
    main()
```

### 3.5 SessionStart（会话开始）

> **一句话理解**：SessionStart就像"开机自启动程序"，在Claude Code启动时自动执行初始化任务。

#### 触发时机

Claude Code**启动时**触发。

#### 用途

- 初始化环境
- 检查依赖
- 加载配置

#### 完整示例：环境检查Hook

**脚本 `.claude/hooks/session-start-check.py`**：

```python
#!/usr/bin/env python3
"""
SessionStart Hook - 环境检查
启动时检查必需的工具和依赖是否已安装
"""
import sys
import shutil

# 检查必需的工具
required_tools = {
    'node': 'Node.js (npm install)',
    'python': 'Python 3.x',
    'git': 'Git版本控制',
}

# 可选但推荐的工具
optional_tools = {
    'prettier': 'Prettier代码格式化 (npm install -g prettier)',
    'black': 'Black Python格式化 (pip install black)',
}

missing_required = []
missing_optional = []

# 检查必需工具
for tool, desc in required_tools.items():
    if not shutil.which(tool):
        missing_required.append(f"  X {tool}: {desc}")

# 检查可选工具
for tool, desc in optional_tools.items():
    if not shutil.which(tool):
        missing_optional.append(f"  ! {tool}: {desc}")

# 输出检查结果
if missing_required or missing_optional:
    print("\n" + "="*50, file=sys.stderr)
    print("环境检查结果", file=sys.stderr)
    print("="*50, file=sys.stderr)

    if missing_required:
        print("\nX 缺少必需工具（请安装）：", file=sys.stderr)
        for item in missing_required:
            print(item, file=sys.stderr)

    if missing_optional:
        print("\n! 缺少可选工具（建议安装）：", file=sys.stderr)
        for item in missing_optional:
            print(item, file=sys.stderr)

    print("\n" + "="*50 + "\n", file=sys.stderr)
else:
    print("V 环境检查通过，所有工具已就绪", file=sys.stderr)

sys.exit(0)
```

**配置**：

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/session-start-check.py",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

### 3.6 SessionEnd 和 Stop

#### SessionEnd（会话结束）

**触发时机**：Claude Code正常退出时

**用途**：
- 清理临时文件
- 保存会话状态
- 备份日志

**示例脚本 `.claude/hooks/session-end-cleanup.sh`**：

```bash
#!/bin/bash
# SessionEnd Hook - 清理临时文件

temp_dir="$HOME/.claude/temp"
if [ -d "$temp_dir" ]; then
    rm -rf "$temp_dir"/*
    echo "V 临时文件已清理" >&2
fi

exit 0
```

#### Stop（AI停止响应）

**触发时机**：用户点击"Stop"按钮或Claude停止响应时

**用途**：
- 保存当前状态
- 记录停止原因

**示例脚本 `.claude/hooks/stop-save-state.py`**：

```python
#!/usr/bin/env python3
"""
Stop Hook - 保存状态
AI停止时保存当前会话状态
"""
import sys
import json
from datetime import datetime
from pathlib import Path

try:
    input_data = json.loads(sys.stdin.read())
except json.JSONDecodeError:
    input_data = {}

reason = input_data.get('reason', 'unknown')

# 保存状态
state_dir = Path.home() / '.claude' / 'state'
state_dir.mkdir(parents=True, exist_ok=True)
state_file = state_dir / 'last-session-state.json'

state = {
    "stopped_at": datetime.now().isoformat(),
    "reason": reason,
    "project_dir": str(Path.cwd())
}

with open(state_file, 'w', encoding='utf-8') as f:
    json.dump(state, f, indent=2, ensure_ascii=False)

print(f"V 会话状态已保存到: {state_file}", file=sys.stderr)
sys.exit(0)
```

---

## 第四部分：实战应用场景

> **本节目的**：学习真实项目中的Hook应用
>
> ⏱️ **预计时间**：1-1.5小时

### 4.1 Git自动化工作流

#### 场景1：提交前自动检查

**需求**：在`git commit`前自动运行代码检查，包括：
- 代码风格检查（lint）
- 敏感信息检查（API Key等）
- 分支保护（禁止直接提交main）

**完整脚本 `.claude/hooks/git-pre-commit-checker.py`**：

```python
#!/usr/bin/env python3
"""
Git提交前检查系统
在执行git commit前自动运行多项检查
"""
import sys
import json
import subprocess
import re
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

# 配置
CONFIG = {
    'protected_branches': ['main', 'master', 'production'],
    'secret_patterns': [
        r'(?i)(api[_-]?key|apikey)\s*[=:]\s*["\']?[\w-]{20,}',
        r'(?i)(secret|password|passwd|pwd)\s*[=:]\s*["\']?[\w-]{8,}',
        r'(?i)(access[_-]?token|auth[_-]?token)\s*[=:]\s*["\']?[\w-]{20,}',
        r'sk-[a-zA-Z0-9]{20,}',  # OpenAI API Key
        r'ghp_[a-zA-Z0-9]{36,}',  # GitHub Token
    ],
}

def run_command(cmd, timeout=60):
    """运行命令并返回结果"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return -1, '', 'Command timed out'
    except Exception as e:
        return -1, '', str(e)

def check_branch():
    """检查分支规则"""
    code, stdout, _ = run_command('git rev-parse --abbrev-ref HEAD')
    if code != 0:
        return True, "无法获取当前分支"

    branch = stdout.strip()
    if branch in CONFIG['protected_branches']:
        return False, f"X 禁止直接提交到受保护分支: {branch}\n请使用Pull Request"

    return True, f"当前分支: {branch}"

def check_secrets():
    """检查敏感信息"""
    code, stdout, _ = run_command('git diff --cached')
    if code != 0:
        return True, "无法获取diff"

    findings = []
    for pattern in CONFIG['secret_patterns']:
        if re.search(pattern, stdout):
            findings.append(f"发现可疑模式: {pattern[:40]}...")

    if findings:
        return False, "X 发现可能的敏感信息:\n" + '\n'.join(findings)
    return True, "敏感信息检查通过"

def check_lint():
    """代码风格检查"""
    code, stdout, _ = run_command('git diff --cached --name-only --diff-filter=ACMR')
    if code != 0:
        return True, "无法获取变更文件列表"

    files = [f for f in stdout.strip().split('\n') if f]
    py_files = [f for f in files if f.endswith('.py')]
    js_files = [f for f in files if f.endswith(('.js', '.ts', '.jsx', '.tsx'))]

    errors = []

    # Python文件检查
    if py_files:
        code, stdout, stderr = run_command(f'ruff check {" ".join(py_files)}')
        if code != 0:
            errors.append(f"Python代码问题:\n{stdout or stderr}")

    # JavaScript/TypeScript文件检查
    if js_files:
        code, stdout, stderr = run_command(f'npx eslint {" ".join(js_files)} --quiet')
        if code != 0:
            errors.append(f"JS/TS代码问题:\n{stdout or stderr}")

    if errors:
        return False, '\n'.join(errors)
    return True, "代码风格检查通过"

def main():
    # 读取输入
    try:
        input_data = json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        return

    tool_name = input_data.get('tool_name', '')
    command = input_data.get('tool_input', {}).get('command', '')

    # 只处理git commit命令
    if tool_name != 'Bash' or 'git commit' not in command:
        return

    # 运行检查
    checks = [
        ('分支检查', check_branch),
        ('敏感信息', check_secrets),
        ('代码风格', check_lint),
    ]

    results = []
    all_passed = True

    # 并行执行检查
    with ThreadPoolExecutor(max_workers=3) as executor:
        future_to_check = {executor.submit(check[1]): check[0] for check in checks}
        for future in as_completed(future_to_check):
            check_name = future_to_check[future]
            try:
                passed, message = future.result()
                results.append((check_name, passed, message))
                if not passed:
                    all_passed = False
            except Exception as e:
                results.append((check_name, False, f"检查异常: {str(e)}"))
                all_passed = False

    # 输出报告
    print("\n" + "="*60, file=sys.stderr)
    print("Git提交前检查报告", file=sys.stderr)
    print("="*60, file=sys.stderr)

    for name, passed, message in results:
        status = "V PASS" if passed else "X FAIL"
        print(f"\n{status} {name}", file=sys.stderr)
        print(f"   {message}", file=sys.stderr)

    print("\n" + "="*60, file=sys.stderr)

    # 输出决策
    if not all_passed:
        decision = {
            "decision": "ask",
            "message": "检查未通过，是否仍要继续提交？"
        }
        print(json.dumps(decision, ensure_ascii=False))
    else:
        print("所有检查通过，允许提交", file=sys.stderr)

if __name__ == '__main__':
    main()
```

**配置**：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/git-pre-commit-checker.py",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

### 4.2 代码质量保障

#### 场景：Markdown文章质量检查

**需求**：保存Markdown文章后自动检查：
- 字数统计
- 标题检查
- 段落数量

**脚本 `.claude/hooks/post-article-quality.py`**：

```python
#!/usr/bin/env python3
"""
PostToolUse Hook - 文章质量检查
保存Markdown文件后自动进行质量检查
"""
import sys
import json
from pathlib import Path

def check_article_quality(file_path):
    """检查文章质量"""
    try:
        content = Path(file_path).read_text(encoding='utf-8')
    except Exception as e:
        return f"无法读取文件: {e}"

    # 统计指标
    char_count = len(content)
    word_count = len(content.split())
    has_title = content.strip().startswith('#')
    paragraphs = [p for p in content.split('\n\n') if p.strip()]
    paragraph_count = len(paragraphs)

    # 生成报告
    report = []
    report.append("\n" + "="*50)
    report.append("文章质量检查报告")
    report.append("="*50)
    report.append(f"\n字符数: {char_count} {'V' if char_count > 500 else '! 偏短'}")
    report.append(f"词数: {word_count}")
    report.append(f"标题: {'V 有' if has_title else 'X 缺少一级标题'}")
    report.append(f"段落数: {paragraph_count} {'V' if paragraph_count > 3 else '! 偏少'}")

    # 建议
    suggestions = []
    if char_count < 500:
        suggestions.append("- 建议增加内容，至少500字")
    if not has_title:
        suggestions.append("- 建议添加一级标题（# 标题）")
    if paragraph_count < 3:
        suggestions.append("- 建议增加段落，改善可读性")

    if suggestions:
        report.append("\n改进建议:")
        report.extend(suggestions)
    else:
        report.append("\nV 文章质量良好！")

    report.append("="*50 + "\n")

    return '\n'.join(report)

def main():
    try:
        input_data = json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        return

    tool_name = input_data.get('tool_name', '')
    tool_input = input_data.get('tool_input', {})
    file_path = tool_input.get('file_path', '')

    # 只处理Write工具和.md文件
    if tool_name != 'Write' or not file_path.endswith('.md'):
        return

    # 检查质量
    report = check_article_quality(file_path)
    print(report, file=sys.stderr)

if __name__ == '__main__':
    main()
```

### 4.3 完整配置示例

**综合配置 `.claude/settings.json`**：

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/user-prompt-enhance.py",
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
            "command": "python .claude/hooks/pre-protect-production.py",
            "timeout": 5
          }
        ]
      },
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/pre-block-dangerous-cmd.py",
            "timeout": 5
          },
          {
            "type": "command",
            "command": "python .claude/hooks/git-pre-commit-checker.py",
            "timeout": 120
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
            "command": "python .claude/hooks/post-auto-format.py",
            "timeout": 30
          },
          {
            "type": "command",
            "command": "python .claude/hooks/post-article-quality.py",
            "timeout": 10
          }
        ]
      },
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/post-auto-backup.py",
            "timeout": 10
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/session-start-check.py",
            "timeout": 10
          }
        ]
      }
    ],
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/notification-desktop.py",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

---

## 第五部分：故障排查

> **本节目的**：快速解决Hook配置和执行问题
>
> ⏱️ **预计时间**：按需查阅

### 5.1 Hook不执行

**症状**：配置了Hook但完全没有触发

**排查步骤**：

1. **检查配置文件路径**
```bash
# 确认settings.json在正确位置
ls -la .claude/settings.json
# 应该存在且有内容
```

2. **检查JSON格式**
```bash
# 验证JSON格式
python -c "import json; json.load(open('.claude/settings.json'))"
# 没有报错说明格式正确
```

3. **检查Matcher是否匹配**
```json
// 错误：matcher拼写错误
"matcher": "write"  // X 应该是大写W

// 正确
"matcher": "Write"  // V
```

4. **检查脚本路径**
```bash
# 确认脚本存在
ls -la .claude/hooks/your-hook.py

# macOS/Linux检查执行权限
chmod +x .claude/hooks/your-hook.py
```

5. **重启Claude Code**
```bash
# 退出当前会话
exit

# 重新启动
claude
```

### 5.2 Hook执行报错

**症状**：Hook触发了但报错退出

**排查步骤**：

1. **手动测试脚本**
```bash
# 模拟输入测试
echo '{"tool_name": "Write", "tool_input": {"file_path": "test.txt"}}' | python .claude/hooks/your-hook.py

# 查看输出和错误
```

2. **检查Python版本**
```bash
python --version
# 应该是Python 3.x
```

3. **检查依赖是否安装**
```bash
# 如果脚本import了第三方库
pip install 缺少的库
```

4. **查看stderr输出**
```python
# 在脚本中添加调试输出
import sys
print("DEBUG: 脚本开始执行", file=sys.stderr)
print(f"DEBUG: 收到输入: {input_data}", file=sys.stderr)
```

### 5.3 Hook超时

**症状**：Hook执行时间过长被强制终止

**解决方案**：

1. **增加timeout配置**
```json
{
  "type": "command",
  "command": "python .claude/hooks/slow-hook.py",
  "timeout": 120  // 增加到120秒
}
```

2. **优化脚本性能**
```python
# 避免不必要的文件扫描
# 使用增量检查而不是全量检查
# 并行执行多个检查任务
```

3. **异步处理**
```python
# 对于不需要阻塞的任务，可以后台执行
import subprocess
subprocess.Popen(['python', 'background-task.py'],
                 stdout=subprocess.DEVNULL,
                 stderr=subprocess.DEVNULL)
```

### 5.4 Windows特有问题

**问题1：中文乱码**

**症状**：Hook输出中文显示为乱码

**解决方案**：
```python
# 在脚本开头设置编码
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
```

**问题2：路径分隔符**

**症状**：Windows路径包含反斜杠导致问题

**解决方案**：
```python
# 统一处理路径
file_path = file_path.replace('\\', '/')
```

**问题3：Batch脚本编码**

**症状**：.bat文件中文乱码

**解决方案**：
```batch
@echo off
chcp 65001 >nul
REM 脚本内容...
```

### 5.5 调试技巧

**技巧1：日志文件**
```python
# 写入调试日志
from pathlib import Path
from datetime import datetime

log_file = Path.home() / '.claude' / 'hooks-debug.log'
log_file.parent.mkdir(parents=True, exist_ok=True)

with open(log_file, 'a', encoding='utf-8') as f:
    f.write(f"[{datetime.now()}] {message}\n")
```

**技巧2：条件调试**
```python
import os

# 通过环境变量控制调试模式
DEBUG = os.getenv('CLAUDE_HOOK_DEBUG', '').lower() == 'true'

if DEBUG:
    print(f"DEBUG: {data}", file=sys.stderr)
```

**技巧3：逐步排除法**
```json
// 先只保留一个Hook测试
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Hook triggered!' >&2"
          }
        ]
      }
    ]
  }
}
```

---

## 第六部分：FAQ（20个常见问题）

### 基础问题

**Q1: Hook和CLAUDE.md有什么区别？**

| 对比 | Hook | CLAUDE.md |
|------|------|-----------|
| **执行方式** | 自动执行Shell命令 | Claude解读后决定是否遵循 |
| **可靠性** | 100%执行 | 不确定（AI可能忘记） |
| **用途** | 强制规则、自动化 | 提供上下文、建议 |

**Q2: Hook可以用什么语言写？**

任何可执行程序都可以：
- Python（推荐，跨平台）
- Bash/Shell（macOS/Linux）
- Batch（Windows）
- Node.js
- Go、Rust等（需要编译）

**Q3: Hook的timeout默认是多少？**

默认60秒。建议根据任务复杂度设置：
- 简单检查：5-10秒
- 代码格式化：30秒
- 完整测试：120秒

**Q4: 一个事件可以配置多个Hook吗？**

可以！多个Hook会按顺序执行：

```json
{
  "matcher": "Write",
  "hooks": [
    {"type": "command", "command": "python hook1.py"},
    {"type": "command", "command": "python hook2.py"}
  ]
}
```

**Q5: PreToolUse的decision有哪些值？**

| 值 | 效果 |
|---|------|
| `"allow"` | 允许执行 |
| `"deny"` | 拒绝执行 |
| `"ask"` | 询问用户 |
| `"message"` | 显示消息后继续 |
| 无输出 | 默认允许 |

### 配置问题

**Q6: settings.json应该放在哪里？**

项目根目录的 `.claude/settings.json`

**Q7: Matcher支持正则表达式吗？**

支持！例如：
- `"Write"` - 精确匹配
- `"Write|Edit"` - 匹配Write或Edit
- `".*"` - 匹配所有工具（慎用）

**Q8: 如何让Hook只对特定目录的文件生效？**

在脚本中检查文件路径：

```python
if '/articles/' not in file_path:
    sys.exit(0)  # 不在目标目录，跳过
```

**Q9: 环境变量怎么传递给Hook脚本？**

Claude Code自动传递：
- `CLAUDE_PROJECT_DIR` - 项目根目录
- `CLAUDE_SESSION_ID` - 会话ID

使用方法：
```python
import os
project_dir = os.getenv('CLAUDE_PROJECT_DIR', os.getcwd())
```

**Q10: 如何临时禁用Hook？**

方法1：重命名配置文件
```bash
mv .claude/settings.json .claude/settings.json.bak
```

方法2：注释掉Hook配置（JSON不支持注释，需要删除）

### 脚本问题

**Q11: 如何读取Hook的输入？**

```python
import sys
import json

# stdin读取JSON
input_data = json.loads(sys.stdin.read())
tool_name = input_data.get('tool_name')
```

**Q12: 如何输出日志到Claude Code界面？**

使用stderr：
```python
print("日志信息", file=sys.stderr)
```

**Q13: 如何返回决策（PreToolUse）？**

使用stdout输出JSON：
```python
print(json.dumps({"decision": "deny", "message": "原因"}))
```

**Q14: 脚本报错会影响Claude Code吗？**

不会！Hook脚本出错不会阻止Claude Code运行，只是该Hook功能失效。

**Q15: 如何处理Windows/macOS/Linux兼容性？**

```python
import platform
system = platform.system()

if system == 'Windows':
    # Windows特定代码
elif system == 'Darwin':  # macOS
    # macOS特定代码
else:  # Linux
    # Linux特定代码
```

### 高级问题

**Q16: Hook可以修改Claude的输出吗？**

不能直接修改。但可以：
- PostToolUse后修改文件内容
- UserPromptSubmit修改用户输入

**Q17: 多个Hook的执行顺序是什么？**

按配置文件中的顺序依次执行。

**Q18: Hook可以调用Claude API吗？**

可以，但要注意：
- 会消耗额外Token
- 可能导致无限循环
- 建议设置调用限制

**Q19: 如何在团队中共享Hook配置？**

将 `.claude/` 目录加入Git版本控制：
```bash
git add .claude/settings.json
git add .claude/hooks/
git commit -m "Add Claude Code hooks"
```

**Q20: Hook有性能影响吗？**

有一定影响：
- 每次工具调用都会触发Hook
- 复杂脚本会增加延迟
- 建议优化脚本性能，设置合理timeout

---

## 附录A：配置速查表

### Hook类型速查

| Hook类型 | 触发时机 | 输入格式 | 输出格式 | 可阻止 |
|----------|----------|----------|----------|--------|
| UserPromptSubmit | 用户输入后 | 纯文本 | 纯文本 | V |
| PreToolUse | 工具调用前 | JSON | JSON决策 | V |
| PostToolUse | 工具调用后 | JSON | 无 | X |
| Notification | 通知发送时 | JSON | 无 | X |
| SessionStart | 会话开始 | 无 | 无 | X |
| SessionEnd | 会话结束 | 无 | 无 | X |
| Stop | AI停止 | JSON | 无 | X |

### 常用工具名速查

| 工具名 | 功能 | 常用Hook |
|--------|------|---------|
| Write | 写入文件 | PostToolUse格式化 |
| Edit | 编辑文件 | PostToolUse备份 |
| Read | 读取文件 | PreToolUse权限控制 |
| Bash | 执行命令 | PreToolUse危险命令拦截 |
| Glob | 文件搜索 | - |
| Grep | 内容搜索 | - |
| WebSearch | 网络搜索 | - |

### Decision值速查

| 值 | 含义 | 工具执行 |
|----|------|---------|
| `"allow"` | 允许 | V |
| `"deny"` | 拒绝 | X |
| `"ask"` | 询问用户 | ? |
| `"message"` | 仅显示消息 | V |
| 无输出 | 默认允许 | V |

---

## 附录B：完整脚本模板

### Python脚本模板

```python
#!/usr/bin/env python3
"""
Hook名称 - 功能描述
"""
import sys
import json

def main():
    # 读取输入
    try:
        input_data = json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        sys.exit(0)

    tool_name = input_data.get('tool_name', '')
    tool_input = input_data.get('tool_input', {})

    # 你的逻辑
    # ...

    # 输出到Claude Code界面
    print("信息", file=sys.stderr)

    # 如果是PreToolUse，输出决策
    # print(json.dumps({"decision": "allow"}))

if __name__ == '__main__':
    main()
```

### Bash脚本模板

```bash
#!/bin/bash
# Hook名称 - 功能描述

# 读取stdin
input_json=$(cat)

# 使用Python解析JSON
tool_name=$(echo "$input_json" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name',''))")

# 你的逻辑
# ...

# 输出日志
echo "信息" >&2

exit 0
```

---

## 附录C：参考资源

### 官方文档

- [Claude Code Hooks官方文档](https://docs.anthropic.com/en/docs/claude-code/hooks)
- [Claude Code官方指南](https://docs.anthropic.com/en/docs/claude-code)

### 社区资源

- [ClaudeLog Hooks教程](https://claudelog.com/mechanics/hooks/)
- [GitButler Claude Code Hooks集成](https://docs.gitbutler.com/features/ai-integration/claude-code-hooks)
- [Awesome Claude Code](https://github.com/hesreallyhim/awesome-claude-code)

### 相关课程

- 第3部分：Commands系统 - Slash命令开发
- 第4部分：MCP集成 - 外部工具连接
- 第6部分：Skills定制 - 技能包开发

---

## 学习总结

通过本课学习，你已经掌握：

1. **Hooks核心概念**：理解Hook是什么、为什么需要、能做什么
2. **6种Hook类型**：PreToolUse、PostToolUse、UserPromptSubmit等全部类型
3. **配置方法**：settings.json配置格式、Matcher语法、timeout设置
4. **实战场景**：Git自动化、代码格式化、文件保护、质量检查
5. **故障排查**：常见问题诊断和解决方法
6. **安全意识**：Hook安全风险和最佳实践

**下一步建议**：

1. 从第二部分的简单示例开始实践
2. 根据你的项目需求，选择合适的Hook类型
3. 参考第四部分的实战案例，逐步构建自己的自动化工作流
4. 遇到问题查阅第五部分和第六部分

**记住**：Hooks是自动化的终极武器，合理使用可以让你的开发效率翻倍！

---

**文档版本**：v1.0
**最后更新**：2025年12月
**作者**：Claude Code教程团队
