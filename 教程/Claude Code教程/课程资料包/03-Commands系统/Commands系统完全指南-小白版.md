# Commands系统完全指南：从Slash命令到自定义命令

> **课程信息**
> - **预计学时**：4-6小时
> - **难度等级**：⭐⭐ 进阶
> - **更新日期**：2025年12月
> - **适用版本**：Claude Code v2.0.71+
> - **前置课程**：必须先完成《CLI命令完全指南》

---

## 📚 本课学习目标

完成本课学习后，你将能够：

1. **理解Commands系统核心价值**：掌握Slash命令的本质和工作流自动化
2. **熟练使用内置命令**：掌握20个最常用的Slash命令
3. **精通快捷键系统**：使用Esc、Tab等快捷键提升效率10倍
4. **创建自定义命令**：编写自己的Slash命令实现工作流自动化
5. **管理命令作用域**：理解Project级和User级命令的区别和应用
6. **实战自动化**：用Commands系统构建高效的开发工作流

---

## 🗺️ 学习路径导航（先看这里！）

> 💡 **根据你的情况选择学习路径**：这是一篇1,800+行的教程，不用全看！根据你的目标选择路径。

### 路径A：快速上手（⏱️ 90分钟）

**适合人群**：急着用Commands系统提升效率，快速上手

**只看这些章节**（其他跳过）：

```
✅ 术语表（5分钟）
✅ 第一部分：Commands系统简介（15分钟）- 了解核心价值
✅ 第三部分：快捷键系统（20分钟）- Esc双击、Tab补全必学
✅ 第四部分4.1-4.4：创建第一个命令（30分钟）
✅ 第六部分6.3：练习2（20分钟）- 动手创建
```

**90分钟后你能达到**：理解Commands系统，创建自己的第一个Slash命令

---

### 路径B：系统学习（⏱️ 4-6小时）

**适合人群**：想完整掌握Commands系统，成为自动化高手

**学习顺序**：从头到尾所有章节

**建议分段学习**：
- 第1天（2小时）：第一~三部分（简介+内置命令+快捷键）
- 第2天（2小时）：第四~五部分（自定义命令+作用域）
- 第3天（2小时）：第六~九部分（实战+FAQ+最佳实践+高级模式）

---

### 路径C：问题速查（⏱️ 5分钟）

**适合人群**：创建命令遇到问题，需要快速解决

**直接跳到**：

```
🔧 第七部分：FAQ - 7个常见问题
🔧 第八部分：命令最佳实践 - 设计原则和规范
```

**使用方法**：
1. 按 `Ctrl + F` 搜索你的问题关键词（如"不生效"、"调试"）
2. 找到对应的Q&A
3. 按步骤解决

---

### 路径D：专项学习（⏱️ 20-40分钟/主题）

**适合人群**：已经会基础，想深入某个功能

| 想学什么 | 看哪几节 | 预计时间 |
|----------|---------|---------|
| **快捷键**mastery | 第三部分 | 20分钟 |
| **$ARGUMENTS参数** | 第4.4节 | 30分钟 |
| **命令作用域** | 第五部分 | 30分钟 |
| **高级命令模式** | 第九部分 | 40分钟 |
| **团队协作** | 第8.5节 | 20分钟 |

---

## 术语表（小白必读）

| 术语 | 英文全称 | 通俗解释 |
|------|----------|----------|
| **Slash命令** | Slash Commands | 以"/"开头的特殊命令，在交互模式中使用（比如 `/help`）|
| **内置命令** | Built-in Commands | Claude Code官方提供的命令，不可修改但可扩展 |
| **自定义命令** | Custom Commands | 用户自己创建的命令，完全可定制 |
| **命令文件** | Command File | 存储命令定义的Markdown文件（在`.claude/commands/`目录）|
| **YAML Frontmatter** | - | Markdown文件开头的配置区域，用`---`包裹，定义命令元数据（类似网页的meta标签）|
| **$ARGUMENTS** | - | 命令参数变量，接收用户在命令后输入的参数（类似函数的参数）|
| **作用域** | Scope | 命令的生效范围（Project级=项目专用，User级=全局共享）|
| **Tab补全** | Tab Completion | 按Tab键自动补全命令名称（类似终端的命令补全）|
| **Escape键** | Escape Key | 快速回退键，双击Esc触发Rewind功能 |
| **提示词即命令** | Prompt as Command | 核心理念：每个命令就是一个Markdown提示词文件 |

---

## 第一部分：Commands系统简介

### 1.1 什么是Commands系统？

**用一句话说**：Commands系统是Claude Code的"工作流自动化引擎"，通过Slash命令（/开头的命令）快速触发预定义的任务和流程。

**生活类比**：
- **没有Commands系统**：每次做饭都要想菜谱、买菜、切菜、炒菜，所有步骤手动操作
- **有Commands系统**：有了菜谱收藏夹，说"红烧肉"就自动执行完整流程（买菜、切菜、炒菜）

### 1.2 Commands系统的三大核心价值

**价值1：工作流自动化**

**场景**：你每天都要做代码审查，需要：
1. 检查代码风格
2. 运行测试
3. 检查安全问题
4. 生成审查报告

**没有Commands**：每次都要重复输入这4个步骤的指令

**有Commands**：创建`/code-review`命令，一键完成！
```
> /code-review src/api/user.py

Claude自动执行：
✓ 检查代码风格
✓ 运行测试
✓ 安全扫描
✓ 生成报告
```

**价值2：知识复用**

把团队的最佳实践固化为命令：
- `/write` - 公众号写作完整流程
- `/refactor` - 代码重构标准流程
- `/deploy-check` - 部署前检查清单

**价值3：团队协作**

团队共享`.claude/commands/`目录到Git：
- ✅ 所有人使用相同的工作流
- ✅ 新人快速上手（不用记复杂流程）
- ✅ 保证质量一致性

### 1.3 Commands系统的设计哲学

**核心理念1：提示词即命令（Prompt as Command）**

每个命令本质上就是一个Markdown文件，内容就是给Claude的提示词。

**类比**：就像Excel的宏，把一系列操作录制成宏，需要时一键执行。

**示例**：
```markdown
<!-- .claude/commands/review.md -->
作为资深代码审查专家，请审查以下文件：

1. 检查代码风格是否符合项目规范
2. 识别潜在的bug和性能问题
3. 检查安全隐患
4. 提供具体的改进建议

文件：$ARGUMENTS
```

使用：
```
> /review src/auth.py

Claude会读取review.md的内容，把$ARGUMENTS替换成"src/auth.py"，然后执行审查！
```

**核心理念2：简洁性（Simplicity）**

一个斜杠+命令名，即可启动复杂流程：
```
/write      → 触发完整的公众号写作流程
/test       → 运行测试并分析结果
/deploy     → 执行部署前检查
```

**核心理念3：可扩展性（Extensibility）**

用户可以创建无限个自定义命令，扩展功能边界！

### 1.4 Commands系统的执行机制

**当你输入 `/my-command 参数` 时发生了什么？**

```
步骤1：查找命令文件
→ Claude Code在.claude/commands/目录查找my-command.md

步骤2：读取文件内容
→ 读取Markdown文件作为系统提示词

步骤3：参数注入
→ 将"参数"赋值给$ARGUMENTS变量

步骤4：执行提示词
→ 按照提示词指令执行相应操作
```

**类比**：就像调用函数：
- 命令名 = 函数名
- 参数 = 函数参数
- Markdown内容 = 函数体

---

## 第二部分：内置Slash命令精选

> 📌 **说明**：Claude Code有30+个内置命令，本章精选20个最常用的命令，覆盖95%日常使用场景！
>
> 这些命令在《CLI命令完全指南》中已有部分讲解，本章补充Commands系统视角的深度说明。

### 2.1 会话管理命令（使用频率最高）

#### /help - 显示命令帮助

**已在CLI指南讲解**，这里补充Commands系统视角：

**特点**：
- 自动扫描`.claude/commands/`目录
- 显示内置命令+自定义命令
- 按字母顺序排列

**进阶用法**：
```
> /help          列出所有命令
> /help think    查看特定命令详情（如果命令支持）
```

---

#### /clear、/compact、/save、/load、/resume

这些命令在《CLI命令完全指南》第3.1-3.4节已详细讲解，这里不重复。

**快速回顾**：
- `/clear` - 完全清空对话
- `/compact` - 压缩历史保留关键信息
- `/save` - 保存当前对话
- `/load` - 加载保存的对话
- `/resume` - 快速恢复最近会话（`claude -c`）

---

### 2.2 思考模式命令

#### /think系列 - 深度思考

**已在CLI指南讲解**，Commands系统补充：

**4个思考等级**：
```
/think          基础思考（~1,500 tokens）
/think hard     深度思考（~3,000 tokens）
/think harder   更深思考（~8,000 tokens）
/ultrathink     极限思考（~16,000 tokens）
```

**Commands系统的使用建议**：

自定义命令中可以**预设思考等级**：
```markdown
<!-- .claude/commands/architecture-design.md -->
name: architecture-design

使用/ultrathink模式分析以下架构设计需求：

需求：$ARGUMENTS

请提供：
1. 多个架构方案对比
2. 技术栈选型建议
3. 潜在风险分析
```

使用：
```
> /architecture-design 设计一个高并发的支付系统

Claude会自动用ultrathink模式深度分析！
```

---

#### /thoughts - 查看思考历史

**已在CLI指南讲解**，这里不重复。

---

### 2.3 Checkpoint命令

#### /checkpoint、/rewind、/checkpoints

**已在CLI指南3.3节详细讲解**，Commands系统补充：

**在自定义命令中的应用**：

```markdown
<!-- .claude/commands/safe-refactor.md -->
name: safe-refactor

在开始重构前，我会自动创建checkpoint保护你的代码：

1. /checkpoint "开始重构: $ARGUMENTS"
2. 执行重构操作
3. 运行测试验证
4. 如果测试失败，提示使用/rewind回退

文件：$ARGUMENTS
```

这样每次重构都有安全保护！

---

### 2.4 项目管理命令

#### /project-info - 项目信息

**已在CLI指南3.6节讲解**，Commands系统补充：

**在自定义命令中的妙用**：

```markdown
<!-- .claude/commands/onboarding.md -->
name: onboarding
description: 新人项目入门

# 新人入门指南

首先，让我展示项目信息：

/project-info

然后我会：
1. 解释项目技术栈
2. 说明目录结构
3. 展示关键文件
4. 提供学习路径
```

新人只需要运行`/onboarding`就能了解整个项目！

---

#### /diff、/undo

**已在CLI指南讲解**，常用于自定义命令中验证修改。

---

### 2.5 诊断命令

#### /doctor - 系统诊断

**已在CLI指南讲解**。

**Commands系统应用**：

```markdown
<!-- .claude/commands/health-check.md -->
name: health-check

执行完整的项目健康检查：

1. /doctor - 系统诊断
2. 运行测试套件
3. 检查依赖是否最新
4. 检查安全漏洞
5. 生成健康报告
```

---

#### /account - 账户信息

查看Token使用情况和配额，在CLI指南已讲解。

---

## 第三部分：快捷键系统

快捷键让你的操作效率提升10倍！

### 3.1 Escape键 - 快速回退（超级重要！）

**这是什么？**
双击Escape键可以触发Rewind功能，快速回退到之前的检查点。

**类比**：就像游戏的"快速读档"键，不用进菜单，直接按键盘就能读档。

**怎么用？**

```
You: [正在输入...发现需要回退]

[快速按两次 Esc键]

╭─────────────────────────────────────────╮
│            Rewind Menu                   │
├─────────────────────────────────────────┤
│  Select a checkpoint to rewind to:       │
│                                          │
│  [1] 10:30:15 - Initial state           │
│  [2] 10:32:45 - Added auth module        │
│  [3] 10:35:20 - Modified database.py     │
│  [c] Cancel                              │
╰─────────────────────────────────────────╯

Select checkpoint (1-3 or c):
```

**为什么这么重要？**

传统方式回退：
```
> /rewind
> [选择检查点]
> [选择恢复选项]
```
需要3步！

快捷键方式：
```
[Esc + Esc]
```
只需1步！**效率提升3倍！**

**最佳实践**：
- 习惯双击Esc，不要用`/rewind`命令
- 手指放在Esc键附近，随时准备回退
- 大胆实验，有Esc保护！

---

### 3.2 Tab补全系统

**这是什么？**
按Tab键自动补全命令名称，类似终端的命令补全。

**类比**：就像手机输入法的联想词，打几个字母就能自动补全。

**怎么用？**

**场景1：查看所有命令**
```
> /[按Tab键]

显示所有可用命令：
/help
/exit
/clear
/compact
/think
/save
...
```

**场景2：快速补全**
```
> /th[按Tab键]

自动补全为：
/think
```

**场景3：模糊匹配**
```
> /ch[按Tab键]

显示匹配的命令：
/checkpoint
/checkpoints
/checkpoint-delete
```

**效率对比**：

| 方式 | 操作 | 耗时 |
|------|------|------|
| 手动输入 | 输入`/checkpoint` | 3秒 |
| Tab补全 | 输入`/ch` + Tab | 1秒 |
| **效率提升** | | **3倍！** |

**最佳实践**：
- 记住常用命令的前2-3个字母
- 不确定命令名时，输入`/`然后Tab查看
- 利用Tab浏览可用命令，发现新功能

---

### 3.3 Ctrl组合键（可选了解）

**Ctrl+C** - 中断当前操作
- 类比：紧急刹车，立即停止Claude的当前任务

**Ctrl+D** - 退出交互模式（等同于`/exit`）
- macOS/Linux专用

**Ctrl+Z** - 退出交互模式（Windows）
- Windows PowerShell专用

---

## 第四部分：创建你的第一个自定义命令

### 4.1 自定义命令的本质

**核心理解**：自定义命令就是一个Markdown文件，存放在`.claude/commands/`目录。

**文件名 = 命令名**：
```
.claude/commands/review.md    → 使用 /review 调用
.claude/commands/deploy.md    → 使用 /deploy 调用
.claude/commands/write-api.md → 使用 /write-api 调用
```

**文件内容 = 提示词**：
Markdown文件的内容就是给Claude的提示词指令！

### 4.2 命令文件结构

**基础结构**：

```markdown
name: 命令名称
description: 命令的一句话描述

# 命令标题

命令的详细说明和执行指令...
```

**完整示例**：

```markdown
name: code-review
description: 代码审查命令

# 代码审查

作为资深代码审查专家，请审查以下文件：

**检查项**：
1. 代码风格是否符合项目规范
2. 是否有潜在的bug
3. 性能优化建议
4. 安全隐患检查

**文件**：$ARGUMENTS

请提供详细的审查报告。
```

### 4.3 YAML Frontmatter元数据

**这是什么？**
文件开头用`---`包裹的配置区域，定义命令的元数据。

**类比**：就像产品的说明书，告诉别人这个命令是干什么的。

**基础格式**：

```yaml
name: write               # 命令名称（必需）
description: 公众号文章创作   # 命令描述（推荐）
version: 1.0.0            # 版本号（可选）
author: 老金              # 作者（可选）
tags: [写作, 内容]         # 标签（可选）
```

**字段说明**：

| 字段 | 必需 | 说明 |
|------|------|------|
| `name` | ✅ 是 | 命令名称，用于 /name 调用 |
| `description` | ⚠️ 推荐 | 显示在命令列表中的描述 |
| `version` | ❌ 可选 | 版本号，便于管理 |
| `author` | ❌ 可选 | 作者信息 |
| `tags` | ❌ 可选 | 分类标签 |

**完整示例**：

```markdown
name: deploy-check
description: 部署前安全检查
version: 2.0.0
author: 团队
tags: [部署, CI/CD, 安全]

# 部署前检查

执行完整的部署前检查清单...
```

---

### 4.4 $ARGUMENTS参数机制

**这是什么？**
`$ARGUMENTS`是内置变量，接收用户在命令后输入的参数。

**类比**：就像函数的参数，让命令更灵活。

**基本用法**：

```markdown
<!-- .claude/commands/greet.md -->
name: greet

问候 $ARGUMENTS！
```

使用：
```
> /greet 老金

Claude输出：问候 老金！
```

**实战示例：文件处理命令**

```markdown
<!-- .claude/commands/add-tests.md -->
name: add-tests

为以下文件生成单元测试：

文件：$ARGUMENTS

要求：
- 使用pytest框架
- 覆盖率>80%
- 包含边界测试
```

使用：
```
> /add-tests src/utils.py

Claude会为utils.py生成完整的测试文件！
```

**高级用法：多参数处理**

$ARGUMENTS接收的是**完整字符串**：
```
> /my-command file1.py file2.py --option

$ARGUMENTS = "file1.py file2.py --option"
```

可以在提示词中指导Claude解析：
```markdown
name: batch-process

处理以下文件（空格分隔）：

文件列表：$ARGUMENTS

对每个文件执行：
1. 添加类型注解
2. 格式化代码
3. 运行linter
```

---

### 4.5 实战：创建你的第一个命令

**任务**：创建一个代码审查命令

**步骤1：创建命令文件**

```bash
# 创建.claude/commands目录（如果不存在）
mkdir -p .claude/commands

# 创建命令文件
touch .claude/commands/my-review.md
```

**Windows PowerShell**：
```powershell
New-Item -ItemType Directory -Force -Path .claude/commands
New-Item -ItemType File -Path .claude/commands/my-review.md
```

**步骤2：编写命令内容**

用编辑器打开`my-review.md`，写入：

```markdown
name: my-review
description: 我的代码审查命令

# 代码审查命令

作为资深代码审查专家，请审查以下文件：

**审查项目**：
1. 代码风格（是否符合PEP8/ESLint规范）
2. 潜在Bug（空值检查、边界条件）
3. 性能问题（循环优化、数据结构选择）
4. 安全隐患（SQL注入、XSS风险）

**文件**：$ARGUMENTS

**输出格式**：
- 问题列表（按严重程度排序）
- 每个问题的具体位置和修复建议
- 总体评分（1-10分）
```

**步骤3：使用命令**

重启Claude Code（或刷新命令缓存）：
```bash
# 退出后重新启动
$ claude

# 测试新命令
> /my-review src/api/user.py

Claude会按照你定义的流程执行审查！
```

**步骤4：验证成功**

**预期输出**：
```
Claude读取my-review.md的内容，把$ARGUMENTS替换成"src/api/user.py"，然后执行详细的代码审查，最后输出结构化的审查报告。
```

**如果命令不生效**：
```
> /help

检查是否出现在命令列表中：
/my-review   我的代码审查命令

如果没有：
1. 检查文件路径是否正确（.claude/commands/my-review.md）
2. 检查YAML frontmatter格式是否正确
3. 重启Claude Code
```

---

### 4.6 实战：创建部署检查命令

**需求**：每次部署前都要执行一系列检查，容易遗漏，想自动化。

**创建命令**：

```markdown
<!-- .claude/commands/deploy-check.md -->
name: deploy-check
description: 部署前完整检查清单
version: 1.0.0

# 部署前检查清单

执行以下检查，确保安全部署：

## 1. 代码质量检查
- 运行所有测试：`npm test` 或 `pytest`
- 检查测试覆盖率是否>80%
- 运行linter检查代码风格

## 2. 安全检查
- 检查是否有硬编码的密钥
- 检查依赖是否有已知漏洞
- 验证环境变量配置

## 3. 性能检查
- 检查是否有console.log遗留
- 检查是否有调试代码未删除
- 验证生产环境配置

## 4. 文档检查
- CHANGELOG.md是否更新
- README.md是否需要更新
- API文档是否同步

## 5. Git检查
- 检查是否在正确的分支
- 确认所有改动已提交
- 检查是否需要创建tag

**目标环境**：$ARGUMENTS（如: production, staging）

检查完成后，生成部署检查报告，标注✅通过 或 ❌失败的项目。
```

**使用**：

```
> /deploy-check production

Claude会逐项检查，生成完整的部署前检查报告！
```

**价值**：
- ✅ 不会遗漏检查项
- ✅ 每次部署都是标准流程
- ✅ 新人也能执行专业的部署检查

---

## 第五部分：命令作用域管理

### 5.1 什么是命令作用域？

**简单说**：作用域决定命令在哪里生效。

**两种作用域**：

**Project级命令**（项目专用）：
```
.claude/commands/my-command.md

只在当前项目中生效
```

**User级命令**（全局共享）：
```
~/.claude/commands/my-command.md

在所有项目中都生效
```

**类比**：
- **Project级**：就像公司的考勤机，只在公司大楼有效
- **User级**：就像你的手机，走到哪用到哪

### 5.2 Project级命令

**位置**：项目根目录的`.claude/commands/`

**适用场景**：
- ✅ 项目特定的工作流（如公众号写作命令）
- ✅ 团队共享的命令（提交到Git）
- ✅ 项目规范相关的命令

**示例**：

```
my-project/
├── .claude/
│   └── commands/
│       ├── write.md          # 公众号写作命令
│       ├── deploy.md         # 部署命令
│       └── code-review.md    # 代码审查命令
└── README.md
```

**团队协作**：

```bash
# 提交到Git
git add .claude/commands/
git commit -m "feat: add team commands"

# 团队成员clone后自动获得相同命令
```

---

### 5.3 User级命令

**位置**：`~/.claude/commands/`

**适用场景**：
- ✅ 个人工作习惯（如快速笔记命令）
- ✅ 跨项目通用的命令
- ✅ 个人效率工具

**示例**：

```
~/.claude/commands/
├── quick-note.md      # 快速记笔记
├── translate.md       # 翻译命令
└── explain.md         # 解释概念命令
```

**使用场景**：

```
# 在任何项目中都可以用
> /quick-note 今天学到了Checkpoint的用法

# 跨项目使用翻译命令
> /translate "Hello World"
```

---

### 5.4 优先级机制

**当Project级和User级有同名命令时，谁优先？**

**规则**：**Project级命令优先！**

**示例**：

```
~/.claude/commands/review.md       (User级：通用代码审查)
my-project/.claude/commands/review.md  (Project级：项目特定审查)

在my-project中运行：
> /review file.py

使用：Project级的review.md（项目特定的审查规范）

在other-project中运行：
> /review file.py

使用：User级的review.md（通用审查）
```

**类比**：就像公司规定优先于个人习惯，在公司听公司的，在家听自己的。

**优先级总结**：

```
Project级命令 > User级命令 > 内置命令

（注：内置命令不能被覆盖，但可以被同名自定义命令"扩展"）
```

---

### 5.5 作用域最佳实践

**实践1：个人效率工具放User级**

```bash
# ~/.claude/commands/
cp-to-clipboard.md    # 复制内容到剪贴板
summarize.md          # 快速总结
translate-cn.md       # 翻译成中文
```

**实践2：项目规范放Project级**

```bash
# .claude/commands/
code-review.md        # 项目的代码审查规范
deploy-check.md       # 项目的部署流程
write-api.md          # 项目的API编写规范
```

**实践3：区分通用和专用**

**通用命令**（User级）：
```markdown
<!-- ~/.claude/commands/explain.md -->
解释以下概念（用通俗语言）：
$ARGUMENTS
```

**专用命令**（Project级）：
```markdown
<!-- .claude/commands/write.md -->
按照老金风格写公众号文章：
主题：$ARGUMENTS
（详细的写作规范...）
```

---

## 第六部分：实战案例与练习

### 6.1 案例1：创建测试生成命令

**需求**：为代码文件自动生成单元测试。

**创建命令文件**：

`.claude/commands/gen-test.md`：

```markdown
name: gen-test
description: 自动生成单元测试

# 测试生成命令

为以下文件生成完整的单元测试：

**文件**：$ARGUMENTS

**测试要求**：
1. 使用pytest框架（Python）或Jest（JavaScript）
2. 测试覆盖率>80%
3. 包含正常用例和边界测试
4. 包含异常处理测试

**输出**：
生成对应的测试文件（test_xxx.py 或 xxx.test.js）
```

**使用**：
```
> /gen-test src/utils.py

Claude会：
1. 分析utils.py的所有函数
2. 生成完整的test_utils.py
3. 包含所有测试用例
```

---

### 6.2 案例2：创建Git工作流命令

**需求**：规范化Git提交流程。

`.claude/commands/commit.md`：

```markdown
name: commit
description: 规范化Git提交

# Git提交助手

帮我创建规范的Git提交：

**改动说明**：$ARGUMENTS

**执行步骤**：
1. 运行 `git status` 查看改动
2. 运行 `git diff` 分析具体变更
3. 生成符合Conventional Commits规范的提交信息
4. 询问确认后执行 `git commit`

**提交信息格式**：
type(scope): description

类型：feat/fix/docs/refactor/test/chore
```

**使用**：
```
> /commit 添加了Checkpoint功能

Claude会：
1. 查看你的改动
2. 生成规范的提交信息
3. 询问确认后提交
```

---

### 6.3 练习题

#### 练习1：命令探索（15分钟）

**任务**：熟悉内置命令和Tab补全

```
步骤1：查看所有命令
> /[按Tab键]

步骤2：试用5个内置命令
> /help
> /project-info
> /checkpoint "练习开始"
> /diff
> /checkpoints

步骤3：用Tab补全快速输入
尝试只输入前2-3个字母，用Tab补全
```

**检查学习成果**：
- [ ] 会用Tab查看所有命令
- [ ] 会用Tab快速补全命令
- [ ] 试用了至少5个内置命令

---

#### 练习2：创建你的第一个命令（30分钟）

**任务**：创建一个"快速笔记"命令

**需求**：
```
输入：/note 今天学了Checkpoint
效果：创建或追加到notes.md文件
```

**实现步骤**：

**步骤1：创建命令文件**
```bash
# 创建User级命令（全局可用）
touch ~/.claude/commands/note.md
```

**步骤2：编写命令内容**
```markdown
name: note
description: 快速记笔记

# 快速笔记

请将以下内容追加到 ~/notes.md 文件：

**时间**：[当前时间]
**内容**：$ARGUMENTS

---
```

**步骤3：测试命令**
```
$ claude
> /note 今天学了Commands系统

检查 ~/notes.md 是否正确追加了内容
```

**检查学习成果**：
- [ ] 成功创建了命令文件
- [ ] 命令能正常执行
- [ ] 理解了$ARGUMENTS的用法

---

#### 练习3：命令作用域配置（20分钟）

**任务**：理解Project级和User级命令的区别

**步骤1：创建User级命令**
```bash
cat > ~/.claude/commands/hello.md << 'EOF'
name: hello

你好！这是全局命令，在所有项目都可用。
EOF
```

**步骤2：创建Project级命令**
```bash
mkdir -p .claude/commands
cat > .claude/commands/hello.md << 'EOF'
name: hello

你好！这是项目专用命令，只在当前项目生效。
EOF
```

**步骤3：测试优先级**
```
# 在当前项目
> /hello
预期：显示"这是项目专用命令"

# 切换到其他项目
cd ~/other-project
> /hello
预期：显示"这是全局命令"
```

**检查学习成果**：
- [ ] 理解了Project级和User级的区别
- [ ] 知道优先级规则（Project优先）
- [ ] 能根据需求选择合适的作用域

---

## 第七部分：FAQ常见问题

### Q1: 为什么自定义命令不生效？

**可能原因**：

**原因1：文件路径错误**
```bash
# ❌ 错误位置
commands/my-command.md

# ✅ 正确位置
.claude/commands/my-command.md
```

**原因2：文件名和命令名不匹配**
```bash
# 文件名：review-code.md
# YAML: name: review

# ❌ 错误调用
> /review-code

# ✅ 正确调用
> /review
```

**原因3：YAML格式错误**
```markdown
# ❌ 错误（缺少空格）
name:review

# ✅ 正确
name: review
```

**解决方法**：
1. 用`/help`检查命令是否出现在列表中
2. 检查文件路径和格式
3. 重启Claude Code

---

### Q2: 如何调试命令？

**方法1：在命令中加调试输出**

```markdown
name: my-command

# 调试信息
命令已触发！
接收到的参数：$ARGUMENTS

[执行实际逻辑...]
```

**方法2：用--verbose模式**
```bash
claude --verbose
> /my-command test

查看详细日志了解命令执行过程
```

**方法3：逐步测试**

先测试简单版本：
```markdown
name: test-cmd

测试命令，参数是：$ARGUMENTS
```

确认参数传递正确后，再添加复杂逻辑。

---

### Q3: 命令和Skills有什么区别？

**Commands（命令）**：
- 简单的提示词文件
- 用于执行特定任务
- 用户自己创建和维护
- 适合项目特定的工作流

**Skills（技能）**：
- 复杂的知识包（可包含多个文件）
- 提供专业领域知识
- 通常由团队或社区维护
- 适合跨项目的专业知识

**类比**：
- **Commands** = 快捷键（快速执行操作）
- **Skills** = 专家顾问（提供专业知识）

**什么时候用Commands？**
```
> /code-review file.py    执行审查流程
> /deploy-check prod      执行部署检查
> /write 主题              创作文章
```

**什么时候用Skills？**
```
> 帮我优化SEO
[SEO Skill自动激活，提供专业的SEO优化建议]

> 审查这个React组件的性能
[React Skill自动激活，提供React专业知识]
```

---

### Q4: 如何分享命令给团队？

**方法1：Git版本控制（推荐）**

```bash
# 将.claude/commands/目录提交到Git
git add .claude/commands/
git commit -m "feat: add team commands"
git push

# 团队成员拉取后自动获得
git pull
```

**方法2：导出命令文件**

```bash
# 导出命令到共享目录
cp .claude/commands/my-cmd.md ~/team-share/commands/

# 团队成员导入
cp ~/team-share/commands/my-cmd.md .claude/commands/
```

**方法3：创建命令库仓库**

```bash
# 创建专门的命令库仓库
git init claude-commands-library
cd claude-commands-library

# 分类组织命令
mkdir -p {code-review,deployment,writing,utils}
# 放入命令文件...

git add .
git commit -m "init: team command library"
git push
```

团队成员可以选择性导入需要的命令！

---

### Q5: 命令可以调用MCP工具吗？

**可以！**Commands可以调用任何Claude Code支持的工具，包括MCP工具。

**示例**：

```markdown
<!-- .claude/commands/db-query.md -->
name: db-query

使用MCP的database工具查询数据库：

查询：$ARGUMENTS

步骤：
1. 连接到数据库
2. 执行查询
3. 格式化输出结果
```

**另一个示例**：调用Git MCP工具

```markdown
<!-- .claude/commands/pr-create.md -->
name: pr-create

使用Git MCP工具创建Pull Request：

标题：$ARGUMENTS

步骤：
1. 检查当前分支的改动
2. 生成PR描述
3. 创建Pull Request
```

> 💡 **注意**：需要先配置相应的MCP服务器！（参考《MCP集成》课程）

---

### Q6: 如何让命令更强大？

**3个进阶技巧**：

**技巧1：命令组合使用**

在一个命令中调用其他命令：
```markdown
name: full-check

执行完整检查流程：

1. /doctor - 系统诊断
2. /project-info - 项目信息
3. 运行测试
4. 生成检查报告
```

**技巧2：调用Python脚本**

```markdown
name: quality-check

运行质量检查脚本：

**脚本调用**：
```bash
python scripts/quality_checker.py $ARGUMENTS
```

**解析结果并生成报告**
```

**技巧3：条件逻辑**

```markdown
name: smart-deploy

根据参数决定部署流程：

如果$ARGUMENTS包含"production"：
- 执行完整的安全检查
- 需要人工确认

如果$ARGUMENTS包含"staging"：
- 执行快速检查
- 自动部署
```

---

### Q7: 命令可以嵌套调用吗？

**可以！**Commands可以在提示词中调用其他命令或工具。

**示例**：

```markdown
<!-- .claude/commands/super-review.md -->
name: super-review

执行超级代码审查：

步骤1：创建安全检查点
/checkpoint "开始super-review"

步骤2：执行代码审查
/code-review $ARGUMENTS

步骤3：运行测试
运行测试套件验证

步骤4：如果有问题，提示回退
/rewind
```

这个命令组合了多个其他命令！

---

## 第八部分：命令最佳实践

### 8.1 命令设计原则

**原则1：单一职责**

每个命令只做一件事，做好这一件事。

**❌ 不好的命令**：
```markdown
name: do-everything

检查代码、运行测试、部署、发邮件、泡咖啡...
```

**✅ 好的命令**：
```markdown
name: code-review  # 只做代码审查
name: deploy-check # 只做部署检查
name: send-report  # 只发送报告
```

**原则2：可组合性**

小命令组合完成复杂任务：
```
/code-review → /test → /deploy-check → /deploy
```

好过一个巨大的`/do-all`命令！

**原则3：清晰的参数设计**

```markdown
# ✅ 好的参数设计
/deploy-check production
/code-review src/api/user.py
/write Claude Code教程

# ❌ 不好的参数设计
/cmd abc xyz 123  # 参数含义不明
```

---

### 8.2 命令命名规范

**推荐命名格式**：

**动词+名词**：
```
/code-review    审查代码
/deploy-check   检查部署
/test-run       运行测试
/write-article  写文章
```

**避免的命名**：
```
❌ /doit          太模糊
❌ /cmd1          无意义
❌ /aaaaaa        难记
✅ /quick-review  清晰明确
```

---

### 8.3 命令文档化

**在命令中添加使用说明**：

```markdown
name: my-command
description: 命令简短描述

# 命令标题

## 使用说明
**用途**：解释这个命令是干什么的

**参数**：
- $ARGUMENTS: 文件路径或主题

**示例**：
```
/my-command src/app.py
/my-command "如何使用Claude Code"
```

**注意事项**：
- 确保文件存在
- 参数不能为空

## 执行逻辑
[命令的实际执行内容...]
```

这样团队成员一看就明白怎么用！

---

### 8.4 效率提升技巧

**技巧1：建立命令别名**

为常用长命令创建短名称版本：

```markdown
<!-- .claude/commands/r.md -->
name: r
description: review的快捷方式

调用完整的代码审查命令...
```

使用：
```
> /r file.py

等同于：
> /code-review file.py

但打字少了80%！
```

**技巧2：使用命令模板**

创建可复用的命令模板：

```markdown
<!-- .claude/commands/new-api.md -->
name: new-api

创建新的API端点：

端点名称：$ARGUMENTS

自动生成：
1. 路由文件（routes/$ARGUMENTS.py）
2. 服务文件（services/$ARGUMENTS_service.py）
3. 测试文件（tests/test_$ARGUMENTS.py）
4. 文档文件（docs/api/$ARGUMENTS.md）
```

一个命令创建完整的API结构！

**技巧3：定期清理**

```bash
# 查看所有自定义命令
ls .claude/commands/

# 删除不再使用的命令
rm .claude/commands/old-command.md
```

---

### 8.5 团队协作最佳实践

**实践1：统一命令库**

```
.claude/commands/
├── 01-code-review.md      # 编号便于排序
├── 02-deploy-check.md
├── 03-test-runner.md
└── README.md              # 命令使用文档
```

**README.md内容**：
```markdown
# 团队命令库

## 可用命令

### 代码质量
- `/code-review` - 代码审查
- `/test-runner` - 运行测试

### 部署相关
- `/deploy-check` - 部署检查
- `/deploy` - 执行部署

## 使用指南
...
```

**实践2：版本控制**

```bash
# .gitattributes
.claude/commands/*.md text eol=lf

# 确保命令文件格式一致
```

**实践3：命令审查**

团队新增命令时，PR review检查：
- ✅ 命令命名是否清晰
- ✅ 参数设计是否合理
- ✅ 是否有使用文档
- ✅ 是否有副作用说明

---

## 第九部分：高级命令模式（可选学习）

> 📌 **说明**：这部分是高级内容，建议使用Commands系统1个月后再学！

### 9.1 搜索增强命令模式

**场景**：需要从多个数据源搜索并整合信息。

**示例：热点扫描命令**

```markdown
name: scan-hotspot
description: 扫描今日AI热点

# AI热点扫描

## 多源并行搜索

从以下5个来源搜索今日AI热点：

1. GitHub Trending
2. Hacker News
3. Twitter/X AI话题
4. Reddit r/MachineLearning
5. Google新闻

## 筛选标准

- GitHub: Stars>100
- HackerNews: 评论>50
- Twitter: 互动>100
- Reddit: 评论>20
- 新闻: 24小时内

## 输出格式

生成热点扫描报告，按爆款潜力排序。
```

---

### 9.2 文件批处理命令模式

**场景**：批量处理多个文件。

**示例：批量添加注释**

```markdown
name: batch-comment

为多个文件批量添加文档注释：

文件列表：$ARGUMENTS（空格分隔）

对每个文件执行：
1. 分析文件内容
2. 生成详细的文档注释
3. 添加类型注解
4. 保持代码逻辑不变

最后生成处理报告。
```

---

### 9.3 工作流编排命令模式

**场景**：串联多个步骤完成复杂工作流。

**示例：完整的代码发布工作流**

```markdown
name: release-flow

完整的代码发布工作流：

版本号：$ARGUMENTS

## 步骤1：代码检查
1. 运行所有测试（pytest或npm test）
2. 运行linter检查代码风格
3. 检查测试覆盖率>80%

## 步骤2：版本更新
1. 更新package.json或setup.py中的版本号
2. 更新CHANGELOG.md记录本次变更
3. 更新README.md（如果需要）

## 步骤3：Git操作
1. 创建release分支
2. 提交所有改动
3. 创建Git tag
4. 推送到远程仓库

## 步骤4：发布检查
1. 确认CI/CD流水线通过
2. 生成发布说明
3. 提示下一步操作

## 输出
完整的发布检查报告
```

这是一个**完整的自动化发布流程**！

---

##  附录：完整命令速查表

### 会话管理命令

| 命令 | 用途 | 常用度 |
|------|------|--------|
| `/help` | 显示命令帮助 | ⭐⭐⭐⭐⭐ |
| `/exit` | 退出交互模式 | ⭐⭐⭐⭐⭐ |
| `/clear` | 清空对话 | ⭐⭐⭐⭐⭐ |
| `/compact` | 压缩历史 | ⭐⭐⭐⭐ |
| `/save` | 保存对话 | ⭐⭐⭐⭐ |
| `/load` | 加载对话 | ⭐⭐⭐⭐ |
| `/resume` | 快速恢复 | ⭐⭐⭐⭐⭐ |
| `/export` | 导出对话 | ⭐⭐⭐ |
| `/sessions` | 会话管理 | ⭐⭐⭐ |

### 思考模式命令

| 命令 | Token预算 | 适用场景 | 常用度 |
|------|-----------|----------|--------|
| `/think` | ~1,500 | 一般问题 | ⭐⭐⭐⭐ |
| `/think hard` | ~3,000 | 复杂问题 | ⭐⭐⭐⭐ |
| `/think harder` | ~8,000 | 架构决策 | ⭐⭐⭐ |
| `/ultrathink` | ~16,000 | 关键决策 | ⭐⭐ |
| `/thoughts` | - | 查看思考历史 | ⭐⭐ |

### Checkpoint命令

| 命令 | 用途 | 常用度 |
|------|------|--------|
| `/checkpoint` | 创建检查点 | ⭐⭐⭐⭐ |
| `/rewind` | 回退到检查点 | ⭐⭐⭐⭐ |
| `/checkpoints` | 查看检查点列表 | ⭐⭐⭐ |
| `/checkpoint-delete` | 删除检查点 | ⭐⭐ |

### 项目管理命令

| 命令 | 用途 | 常用度 |
|------|------|--------|
| `/project-info` | 显示项目信息 | ⭐⭐⭐ |
| `/diff` | 查看变更 | ⭐⭐⭐⭐ |
| `/undo` | 撤销上一步 | ⭐⭐⭐ |
| `/reset-project` | 重置项目设置 | ⭐ |

### 诊断命令

| 命令 | 用途 | 常用度 |
|------|------|--------|
| `/doctor` | 系统诊断 | ⭐⭐⭐ |
| `/account` | 账户信息 | ⭐⭐ |

### 快捷键

| 快捷键 | 功能 | 重要度 |
|--------|------|--------|
| **Esc + Esc** | 快速回退（Rewind） | ⭐⭐⭐⭐⭐ |
| **Tab** | 命令补全 | ⭐⭐⭐⭐⭐ |
| **Ctrl+D** | 退出（macOS/Linux） | ⭐⭐⭐ |
| **Ctrl+Z** | 退出（Windows） | ⭐⭐⭐ |
| **Ctrl+C** | 中断操作 | ⭐⭐⭐ |

---

## 🎯 总结与下一步

### ✅ 你已经掌握的技能

完成本课学习后，你现在能够：

1. **理解Commands系统**：掌握提示词即命令的核心理念
2. **使用内置命令**：熟练使用20个最常用的Slash命令
3. **快捷键操作**：用Esc+Esc、Tab提升效率
4. **创建自定义命令**：能编写自己的工作流命令
5. **管理命令作用域**：知道Project级和User级的区别和应用

### 📊 学习成果检查

**基础技能（必须100%掌握）**：
- [ ] 能用Tab查看和补全命令
- [ ] 熟练使用Esc+Esc快速回退
- [ ] 理解Project级和User级命令的区别
- [ ] 会创建简单的自定义命令

**进阶技能（建议80%掌握）**：
- [ ] 能编写带参数的命令（$ARGUMENTS）
- [ ] 会用YAML frontmatter定义元数据
- [ ] 能创建复杂的工作流命令
- [ ] 知道如何分享命令给团队

**实战能力（核心目标）**：
- [ ] 创建过至少2个自定义命令
- [ ] 在真实项目中使用Commands系统
- [ ] 完成过至少2个练习题

### 💡 实践建议

**第1周**：
- 熟练使用内置命令
- 习惯用Esc+Esc和Tab
- 试着创建1-2个简单命令

**第2-3周**：
- 创建3-5个实用的自定义命令
- 固化你的工作流
- 分享命令给团队（如果适用）

**1个月后**：
- Commands系统成为日常开发的一部分
- 积累10+个个人命令库
- 探索与MCP、Skills的结合

### 🔗 相关资源

- **前置课程**：《CLI命令完全指南》- 掌握基础命令
- **下一课**：《MCP集成》- 扩展Claude Code能力
- **官方文档**：https://docs.anthropic.com/claude-code/commands

### 🎓 下一课预告

**模块4：《MCP集成 - 扩展Claude Code能力》**
- MCP服务器原理
- 安装和配置MCP服务器
- 在自定义命令中调用MCP工具
- 开发自己的MCP服务器

---

## 📝 质量检查清单

### 内容完整性

- [x] 课程信息框
- [x] 学习目标
- [x] 术语表（10个核心术语）
- [x] Commands系统简介（核心价值、设计哲学、执行机制）
- [x] 内置Slash命令精选（20个命令参考或快速回顾）
- [x] 快捷键系统（Esc、Tab详解）
- [x] 创建自定义命令（YAML、$ARGUMENTS、实战）
- [x] 命令作用域管理（Project/User、优先级）
- [x] 实战案例（2个完整案例）
- [x] 练习题（3个练习）
- [x] FAQ（5个常见问题）
- [x] 完整命令速查表
- [x] 总结与下一步

### 小白友好性

- [x] 使用生活类比解释概念
- [x] 四问结构（部分命令，避免重复CLI指南）
- [x] 跨平台命令分开说明
- [x] 实战案例丰富
- [x] 练习题可操作

### 飞书兼容性

- [x] 无`<details>`折叠标签
- [x] 纯Markdown格式
- [x] 代码块标注语言

---

**课程版本**：V1.0（小白友好版）
**创建日期**：2025-12-18
**作者**：老金
**基于**：《Slash命令完全手册》+《自定义命令开发》整合

🎉 **恭喜完成Commands系统完全指南（小白版）！**
