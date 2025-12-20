# Skills定制完整指南：打造专属AI能力包的实战手册

> **课程信息**
>
> - **预计学时**：6-8小时
> - **难度等级**：⭐⭐ 入门级（有Claude Code基础即可）
> - **更新日期**：2025年12月
> - **适用版本**：Claude Code v2.0+
> - **前置要求**：已完成Claude Code安装和Commands基础使用

---

## 本课学习目标

完成本课学习后，你将能够：

1. **理解Skills的核心价值**：掌握Skills与Commands的本质区别和协作方式
2. **创建第一个Skill**：5分钟内完成最简单的Skill配置并看到效果
3. **掌握Skill目录结构**：理解skill.yaml、prompts、scripts等核心组件
4. **编写提示词文件**：设计专业的提示词组织和版本管理
5. **集成Python脚本**：实现自动化工具扩展Claude Code能力
6. **排查Skill故障**：独立解决90%的常见配置和执行问题
7. **实战案例分析**：深度理解公众号写作助手等企业级Skill架构

---

## 学习路径导航（先看这里！）

> **根据你的情况选择学习路径**：这是一篇4000+行的长教程，不用全看！根据你的目标选择路径。

### 路径A：快速上手（30分钟）

**适合人群**：急着体验Skills，想快速创建一个看效果

**只看这些章节**（其他跳过）：

```
✅ 术语表（5分钟） - 快速了解Skill核心概念
✅ 第一部分1.1-1.2：Skills简介（5分钟） - 理解Skill是什么
✅ 第二部分：5分钟快速开始（15分钟） - 创建第一个Skill
✅ 第三部分3.1：skill.yaml基础（5分钟） - 最核心的配置
```

**30分钟后你能达到**：成功创建第一个Skill，Claude Code能识别并使用你的专属能力

---

### 路径B：完整学习（6-8小时）

**适合人群**：想深入理解Skills，掌握完整的开发能力

**学习顺序**：从头到尾所有章节

**建议分段学习**：
- 第1天（2小时）：第1-3部分（理解+目录结构）
- 第2天（2小时）：第4-5部分（提示词+脚本集成）
- 第3天（2小时）：第6-7部分（实战案例+故障排查）
- 第4天（1小时）：第8-9部分（FAQ+附录）

---

### 路径C：问题排查（10分钟）

**适合人群**：Skill配置出问题，需要快速解决

**直接跳到这些章节**：

```
🔧 第七部分：故障排查 - 按错误类型查找解决方案
🔧 第八部分：FAQ - 20个常见问题解答
```

**使用方法**：
1. 按 `Ctrl + F` 搜索你的错误信息关键词
2. 找到对应的Q&A
3. 按步骤解决

---

### 路径D：专项学习（30-60分钟/主题）

**适合人群**：已经会创建Skill，想学习特定功能

| 想学什么 | 看哪几节 | 预计时间 |
|----------|---------|---------|
| **提示词工程** | 第四部分 | 1小时 |
| **Python脚本集成** | 第五部分 | 1.5小时 |
| **多步骤工作流** | 第六部分6.1节 | 45分钟 |
| **数据驱动架构** | 第六部分6.2节 | 1小时 |
| **企业级Skill设计** | 第六部分6.3节 | 1小时 |

---

## 术语表（小白必读）

在开始之前，先了解这些关键术语。**用生活类比帮助理解**：

| 术语 | 英文全称 | 通俗解释 | 生活类比 |
|------|----------|----------|----------|
| **Skill** | - | Claude Code的"能力包"，封装领域知识和工具 | 手机上的APP（如微信、淘宝） |
| **skill.yaml** | - | Skill的"身份证"，定义名称、触发条件等 | APP的安装说明书 |
| **prompts/** | - | 提示词文件夹，存放AI的"知识手册" | APP的使用说明书集合 |
| **scripts/** | - | 脚本文件夹，存放可执行的工具程序 | APP的功能模块代码 |
| **triggers** | - | 触发条件，决定什么时候激活Skill | APP的启动方式（点图标/语音唤醒） |
| **keywords** | - | 关键词触发，用户说特定词时激活 | "Hey Siri"语音唤醒词 |
| **capabilities** | - | 能力声明，描述Skill能做什么 | APP商店里的功能介绍 |
| **Progressive Disclosure** | 渐进式披露 | 简单操作简单用，复杂操作可扩展 | 微信：聊天简单，支付功能深藏 |
| **Commands** | 斜杠命令 | 显式触发的操作入口 | APP里的功能按钮 |
| **YAML** | YAML Ain't Markup Language | 配置文件格式，易读易写 | 填写表格（有固定格式） |
| **stdin/stdout** | Standard Input/Output | 脚本的数据输入输出通道 | 快递的收发窗口 |
| **SemVer** | Semantic Versioning | 语义化版本号（主.次.补丁） | 软件版本号（如微信8.0.1） |

---

## 第一部分：Skills简介（10分钟理解）

### 1.1 Skills是什么

> **一句话理解**：Skills是Claude Code的"能力APP"，把特定领域的知识、规则、工具打包成可复用的模块，让AI瞬间变成该领域的专家。

#### 为什么需要Skills？

**没有Skills之前（每次都从零开始）**：

```
问题：AI没有记忆，每次对话都要重新说明

你：帮我写一篇公众号文章
Claude：好的，请问什么风格？字数多少？有什么特殊要求？

...下次对话...

你：再帮我写一篇
Claude：好的，请问什么风格？字数多少？（又从零开始问）
```

**有了Skills之后（专业知识即装即用）**：

```
解决方案：预置领域知识，AI直接变成专家

你：帮我写一篇公众号文章
Claude：[自动加载公众号写作Skill]
       [读取老金风格规范、爆款公式、质量标准]
       好的！基于V8.0爆款规律，我来帮你...
       [自动调用标题生成器、质量检测器]
```

> **生活类比**：
> - **没有Skills**：每次打车都要从零教司机认路
> - **有Skills后**：安装了高德地图APP，司机直接导航到达（知识预装）

#### Skills的核心价值

| 对比维度 | 没有Skills | 有Skills后 |
|----------|-----------|------------|
| **知识积累** | 每次对话从零开始 | 领域知识预置，即用即专业 |
| **团队协作** | 每人都要教AI一遍 | 配置一次，全员共享 |
| **质量一致** | 输出质量随机 | 标准化流程，质量稳定 |
| **效率** | 大量时间在沟通需求 | 直接进入核心任务 |
| **可维护性** | 知识散落在聊天记录 | 集中管理，版本可控 |

### 1.2 Skills vs Commands：深度对比

> **这是最常被问到的问题**：Skill和Command有什么区别？什么时候用哪个？

#### 一句话区分

- **Commands**：**触发器**，是用户交互的入口点（"按钮"）
- **Skills**：**能力包**，是知识和工具的集合（"APP"）

#### 详细对比表

| 对比维度 | Commands（斜杠命令） | Skills（能力包） |
|----------|---------------------|-----------------|
| **定位** | 触发器/入口点 | 能力包/知识库 |
| **复杂度** | 单个Markdown文件 | 多文件目录结构 |
| **触发方式** | 显式调用 `/command` | 自动识别 + 显式调用 |
| **状态管理** | 无状态 | 可以维护状态和配置 |
| **工具集成** | 有限（直接写在md里） | 强大（可集成Python/JS脚本） |
| **知识容量** | 几百到几千字 | 可达数万字 |
| **可维护性** | 简单直接 | 模块化分层 |
| **适用场景** | 单一任务 | 复杂工作流 |

#### 协作关系图

```
                    用户输入
                       │
                       ▼
           ┌────────────────────────┐
           │      CLAUDE.md         │ ← 全局上下文
           └────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌────────────────┐           ┌──────────────────┐
│   Commands     │ ←───────→ │     Skills       │
│  （触发层）     │   调用     │   （能力层）      │
│  /write        │           │ gongzhonghao-    │
│  /title-gen    │           │ writer/          │
└────────────────┘           └──────────────────┘
        │                             │
        ▼                             ▼
┌────────────────┐           ┌──────────────────┐
│ 简单任务直接   │           │ prompts/         │
│ 在Command里    │           │ scripts/         │
│ 完成          │           │ config/          │
└────────────────┘           │ templates/       │
                            └──────────────────┘
```

**协作模式示例**：`/write` 命令与公众号写作Skill

```markdown
# 01-write.md (Command层)
当用户输入 /write 时:
1. 读取 `.claude/skills/gongzhonghao-writer/prompts/baokuan-rules.md`
2. 调用 `scripts/title_generator.py` 生成标题
3. 应用 `prompts/laojin-style-v8.md` 风格规范
4. 执行 `scripts/quality_detector.py` 质量检测
```

> **最佳实践**：
> - **简单任务**：直接用Command（如`/help`显示帮助）
> - **复杂任务**：Command + Skill（Command是入口，Skill提供能力）

### 1.3 渐进式披露原理（Progressive Disclosure）

> 这是Skills系统的核心设计哲学，理解它能帮你更好地设计自己的Skill。

**核心思想**：只在用户需要时才展示复杂功能，避免信息过载。

#### 四层披露结构

**第一层：自动激活（用户无感）**
```
用户："帮我写一篇关于Claude Code的公众号文章"
Claude Code：[检测到"公众号"关键词，自动加载gongzhonghao-writer Skill]
           "好的，我来帮你写..."
```
用户完全不需要知道Skill的存在。

**第二层：显式调用（简单控制）**
```
用户：/write Claude Code新功能解析
Claude Code：[执行完整的写作工作流]
```
用户通过Slash命令明确触发，获得更可控的流程。

**第三层：深度定制（修改配置）**
```yaml
# skill.yaml
triggers:
  keywords:
    - "公众号"
    - "写文章"
    - "老金风格"
```
用户可以修改触发条件和参数。

**第四层：完全控制（修改代码）**
```
用户可以:
- 修改prompts/*.md调整生成风格
- 编辑scripts/*.py改变处理逻辑
- 创建新的templates/定制输出格式
```

> **设计优势**：
> - 新手可以直接用，无需学习复杂配置
> - 高级用户可以深度定制每个细节
> - 团队可以将最佳实践沉淀到Skills中

### 1.4 什么时候该用Skills

**适合使用Skills的场景**：

| 场景类型 | 示例 | 为什么适合 |
|----------|------|-----------|
| **领域专业化** | 公众号写作、技术博客、学术论文 | 需要预置大量领域知识 |
| **知识积累** | 数据驱动的规则优化 | 需要持续迭代和版本管理 |
| **复杂工作流** | Research→写作→质检→发布 | 需要多步骤自动化 |
| **团队标准化** | 代码审查规范、文档模板 | 需要统一团队标准 |
| **可复用能力** | 跨项目共享的工具包 | 需要在多个项目使用 |

**不适合使用Skills的场景**：

| 场景类型 | 为什么不适合 | 替代方案 |
|----------|-------------|---------|
| **一次性任务** | 没有复用价值 | 直接在对话中描述 |
| **高度变化** | 每次都不同 | 灵活的Command |
| **无法标准化** | 完全依赖创意 | 保持AI自由发挥 |

---

## 第二部分：5分钟快速开始（立即见效）

> **本节目的**：用最快速度创建第一个Skill，让你立即看到效果！
>
> ⏱️ **预计时间**：5-10分钟

### 2.1 创建你的第一个Skill

**为什么选这个示例？**

- ✅ 最简单，只需要2个文件
- ✅ 效果直观，立即看到输出
- ✅ 无依赖，不需要安装任何东西

**目标**：创建一个"代码注释生成器"Skill，自动为代码添加中文注释。

#### 步骤1：创建Skill目录

**这一步要做什么**：在项目中创建Skill的目录结构

**Windows系统（PowerShell）：**
```powershell
# 进入你的项目目录
cd C:\你的项目路径

# 创建Skill目录结构
New-Item -ItemType Directory -Path ".claude\skills\code-commenter\prompts" -Force
```

**macOS/Linux系统：**
```bash
# 进入你的项目目录
cd ~/你的项目路径

# 创建Skill目录结构
mkdir -p .claude/skills/code-commenter/prompts
```

**验证是否成功：**
```bash
# 检查目录是否存在
ls -la .claude/skills/code-commenter/
# 应该显示prompts目录
```

#### 步骤2：创建skill.yaml配置文件

**这一步要做什么**：创建Skill的"身份证"，定义基本信息

**创建文件 `.claude/skills/code-commenter/skill.yaml`**：

**Windows（PowerShell）：**
```powershell
@'
# 代码注释生成器 Skill
name: "代码注释生成器"
description: "自动为代码添加清晰的中文注释"
version: "1.0.0"
author: "你的名字"

# 触发配置
triggers:
  keywords:
    - "添加注释"
    - "代码注释"
    - "注释代码"
    - "comment"

# 提示词文件
prompt_files:
  main: "prompts/main-prompt.md"

# 能力声明
capabilities:
  - name: "智能注释"
    description: "分析代码逻辑，生成准确的中文注释"
'@ | Out-File -FilePath ".claude\skills\code-commenter\skill.yaml" -Encoding utf8
```

**macOS/Linux：**
```bash
cat > .claude/skills/code-commenter/skill.yaml << 'EOF'
# 代码注释生成器 Skill
name: "代码注释生成器"
description: "自动为代码添加清晰的中文注释"
version: "1.0.0"
author: "你的名字"

# 触发配置
triggers:
  keywords:
    - "添加注释"
    - "代码注释"
    - "注释代码"
    - "comment"

# 提示词文件
prompt_files:
  main: "prompts/main-prompt.md"

# 能力声明
capabilities:
  - name: "智能注释"
    description: "分析代码逻辑，生成准确的中文注释"
EOF
```

> 💡 **配置说明**：
> - `name`：Skill的显示名称
> - `triggers.keywords`：用户说这些词时自动激活
> - `prompt_files.main`：主要提示词文件路径

#### 步骤3：创建提示词文件

**这一步要做什么**：创建AI的"知识手册"，定义注释规范

**创建文件 `.claude/skills/code-commenter/prompts/main-prompt.md`**：

**Windows（PowerShell）：**
```powershell
@'
# 代码注释生成规范

## 角色定义
你是一位经验丰富的代码审查专家，擅长编写清晰、准确、有价值的代码注释。

## 注释原则

### 1. 解释"为什么"而不是"是什么"
```python
# ❌ 差的注释：循环遍历列表
for item in items:

# ✅ 好的注释：过滤掉已过期的订单，避免重复发货
for item in items:
```

### 2. 注释格式规范
- **函数/方法**：说明功能、参数、返回值
- **复杂逻辑**：解释业务背景和设计决策
- **魔法数字**：说明数值含义

### 3. 语言要求
- 使用简洁的中文
- 避免废话和重复
- 专业术语保持英文（如API、JSON）

## 输出格式
直接输出添加注释后的完整代码，不要额外解释。
'@ | Out-File -FilePath ".claude\skills\code-commenter\prompts\main-prompt.md" -Encoding utf8
```

**macOS/Linux：**
```bash
cat > .claude/skills/code-commenter/prompts/main-prompt.md << 'EOF'
# 代码注释生成规范

## 角色定义
你是一位经验丰富的代码审查专家，擅长编写清晰、准确、有价值的代码注释。

## 注释原则

### 1. 解释"为什么"而不是"是什么"
```python
# ❌ 差的注释：循环遍历列表
for item in items:

# ✅ 好的注释：过滤掉已过期的订单，避免重复发货
for item in items:
```

### 2. 注释格式规范
- **函数/方法**：说明功能、参数、返回值
- **复杂逻辑**：解释业务背景和设计决策
- **魔法数字**：说明数值含义

### 3. 语言要求
- 使用简洁的中文
- 避免废话和重复
- 专业术语保持英文（如API、JSON）

## 输出格式
直接输出添加注释后的完整代码，不要额外解释。
EOF
```

#### 步骤4：验证Skill配置

**验证文件结构：**
```bash
# 查看Skill目录结构
tree .claude/skills/code-commenter/
# 或者用ls
ls -la .claude/skills/code-commenter/

# 预期输出：
# .claude/skills/code-commenter/
# ├── skill.yaml
# └── prompts/
#     └── main-prompt.md
```

**验证YAML格式：**
```bash
# 查看skill.yaml内容
cat .claude/skills/code-commenter/skill.yaml
```

#### 步骤5：测试Skill

**启动Claude Code：**
```bash
claude
```

**测试触发：**
```
你：帮我给这段代码添加注释

def calculate_discount(price, user_level):
    if user_level == "vip":
        return price * 0.8
    elif user_level == "svip":
        return price * 0.7
    else:
        return price
```

**预期响应：**
```python
def calculate_discount(price, user_level):
    """
    根据用户等级计算折扣后的价格

    Args:
        price: 原始价格
        user_level: 用户等级（vip/svip/普通）

    Returns:
        折扣后的价格
    """
    # VIP用户享受8折优惠
    if user_level == "vip":
        return price * 0.8
    # SVIP用户享受7折优惠
    elif user_level == "svip":
        return price * 0.7
    # 普通用户无折扣
    else:
        return price
```

### 2.2 验证Skill工作正常

**完整验证清单**：

- [ ] `.claude/skills/code-commenter/` 目录存在
- [ ] `skill.yaml` 文件格式正确
- [ ] `prompts/main-prompt.md` 文件存在
- [ ] 说"添加注释"等关键词时Claude能识别
- [ ] 生成的注释符合规范

### 2.3 恭喜完成！

如果上面的测试都成功了，你已经创建了第一个可用的Skill！

**下一步建议**：
- 继续学习第三部分，了解完整的目录结构
- 尝试为你的工作领域创建专属Skill

---

## 第三部分：目录结构详解

> **本节目的**：深入理解Skill的标准目录结构，为创建复杂Skill打基础。

### 3.1 标准目录结构

Skills采用**约定优于配置**的目录结构，每个Skill都是 `.claude/skills/` 下的一个独立目录：

```
.claude/skills/[skill-name]/
├── skill.yaml              # [必需] Skill配置文件（身份证）
├── prompts/                # [推荐] 提示词文件目录（知识手册）
│   ├── main-prompt.md      # 主要提示词
│   ├── style-guide.md      # 风格指南
│   └── rules.md            # 规则定义
├── scripts/                # [可选] 工具脚本目录（功能模块）
│   ├── processor.py        # Python处理脚本
│   ├── validator.js        # JavaScript验证脚本
│   └── utils/              # 工具函数
├── templates/              # [可选] 模板文件目录
│   ├── output-template.md  # 输出模板
│   └── report-template.md  # 报告模板
├── config/                 # [可选] 配置文件目录
│   └── settings.json       # 运行时配置
├── docs/                   # [可选] 内部文档
│   └── design.md           # 设计文档
└── data/                   # [可选] 数据文件
    └── knowledge-base.json # 知识库数据
```

#### 各目录用途说明

| 目录/文件 | 是否必需 | 用途 | 生活类比 |
|-----------|---------|------|----------|
| `skill.yaml` | ✅ 必需 | 定义Skill元信息、触发条件 | APP的安装包信息 |
| `prompts/` | 推荐 | 存放AI的知识和规范 | APP的功能说明书 |
| `scripts/` | 可选 | 可执行的工具脚本 | APP的功能代码 |
| `templates/` | 可选 | 输出内容的模板 | 文档模板 |
| `config/` | 可选 | 运行时配置参数 | APP的设置选项 |
| `docs/` | 可选 | 开发者内部文档 | 开发手册 |
| `data/` | 可选 | 静态数据文件 | 离线数据包 |

### 3.2 skill.yaml配置详解

`skill.yaml` 是Skill的核心配置文件，定义了Skill的"身份"和"能力"。

#### 完整配置字段表

| 字段名 | 类型 | 是否必填 | 默认值 | 说明 |
|--------|------|---------|--------|------|
| `name` | string | ✅ | - | Skill显示名称，支持中英文 |
| `description` | string | ✅ | - | 简短描述（建议<100字） |
| `version` | string | ✅ | "1.0.0" | 语义化版本号 |
| `author` | string | ❌ | - | 作者信息 |
| `triggers.keywords` | array | ❌ | [] | 关键词触发列表 |
| `triggers.patterns` | array | ❌ | [] | 正则模式触发列表 |
| `prompt_files` | object | ❌ | {} | 提示词文件映射 |
| `scripts` | array | ❌ | [] | 脚本清单 |
| `capabilities` | array | ❌ | [] | 能力声明列表 |
| `dependencies` | object | ❌ | {} | 外部依赖声明 |

#### 最小配置示例

```yaml
# 最简单的skill.yaml（只有3个必填字段）
name: "我的第一个Skill"
description: "这是一个示例Skill"
version: "1.0.0"
```

#### 完整配置示例

```yaml
# ==================================================
# Skill基本信息
# ==================================================
name: "公众号写作助手"                    # Skill名称
description: "基于数据驱动的AI公众号写作系统"  # 简短描述
version: "8.1.0"                        # 语义化版本号
author: "老金"                          # 作者信息

# ==================================================
# 触发配置
# ==================================================
triggers:
  keywords:                             # 关键词触发
    - "公众号"
    - "写文章"
    - "老金风格"
    - "/write"

  patterns:                             # 正则模式触发（可选）
    - "写一篇.*文章"
    - "帮我.*公众号"

# ==================================================
# 提示词文件映射
# ==================================================
prompt_files:
  style: "prompts/laojin-style-v8.md"
  rules: "prompts/baokuan-formulas-v8.md"
  format: "prompts/format-rules.md"

# ==================================================
# 脚本清单
# ==================================================
scripts:
  - name: "quality_detector.py"
    description: "9维度质量检测"
    entry_point: "python quality_detector.py"

  - name: "title_generator.py"
    description: "5公式标题生成器"
    entry_point: "python title_generator.py"
    args: ["topic", "--full"]

# ==================================================
# 能力声明
# ==================================================
capabilities:
  - name: "爆款公式生成"
    description: "基于5大公式生成高转化标题"

  - name: "9维度质量检测"
    description: "AI腔、自然度、真诚度等全面检测"

# ==================================================
# 依赖声明
# ==================================================
dependencies:
  python_packages:
    - "pyyaml>=6.0"
    - "jieba>=0.42"

  mcp_servers:
    - name: "WebSearch"
      required: true
```

#### 版本号规范（SemVer 2.0.0）

```
MAJOR.MINOR.PATCH（主版本.次版本.修订版本）

规则：
1. MAJOR：不兼容的API变更
   示例：1.x.x → 2.0.0（改变了核心提示词结构）

2. MINOR：向后兼容的功能新增
   示例：1.5.x → 1.6.0（新增标题评分功能）

3. PATCH：向后兼容的bug修复
   示例：1.5.2 → 1.5.3（修复质量检测误报）
```

### 3.3 三种复杂度级别对比

根据你的需求，Skill可以从简单到复杂：

| 维度 | 简单Skill | 中等Skill | 复杂Skill |
|------|----------|----------|----------|
| **文件数** | 2-3个 | 5-10个 | 20+个 |
| **总大小** | <10KB | 10-100KB | >100KB |
| **prompts** | 1个文件 | 3-5个文件 | 10+个文件 |
| **scripts** | 0个 | 1-2个 | 5+个 |
| **config** | 无 | 1个JSON | 多个配置文件 |
| **适用场景** | 单一任务 | 多步骤流程 | 企业级系统 |
| **示例** | 代码注释器 | API文档生成器 | 公众号写作助手 |
| **维护难度** | 低 | 中 | 高 |

**建议**：
- 新手从简单Skill开始
- 随着需求增长逐步扩展
- 不要过度设计

---

## 第四部分：提示词工程

> **本节目的**：掌握prompts目录的组织方式和提示词编写技巧。

### 4.1 提示词文件组织

**按功能分类组织**（推荐）：

```
prompts/
├── core/                   # 核心提示词
│   ├── main-style.md       # 主风格定义
│   └── base-rules.md       # 基础规则
├── features/               # 功能提示词
│   ├── title-gen.md        # 标题生成
│   └── quality-check.md    # 质量检查
└── reference/              # 参考资料
    ├── examples.md         # 示例集
    └── anti-patterns.md    # 反模式
```

**按阶段分类组织**：

```
prompts/
├── pre-process/            # 预处理阶段
├── generation/             # 生成阶段
├── post-process/           # 后处理阶段
└── validation/             # 验证阶段
```

### 4.2 提示词命名规范

| 命名类型 | 命名模式 | 示例 | 适用场景 |
|---------|---------|------|---------|
| 功能型 | `{功能}-{动作}.md` | `title-gen.md` | 明确功能的提示词 |
| 风格型 | `{风格名}-style.md` | `laojin-style.md` | 写作风格定义 |
| 规则型 | `{规则名}-rules.md` | `baokuan-rules.md` | 规则和约束 |
| 版本型 | `{名称}-v{版本}.md` | `style-v8.md` | 版本化管理 |
| 配置型 | `{功能}-config.md` | `hotspot-config.md` | 配置参数 |

**最佳实践**：
1. 使用小写字母和连字符（kebab-case）
2. 避免中文命名（除非面向中文用户的文档）
3. 文件名保持简短（建议<30个字符）

### 4.3 提示词模板结构

一个好的提示词文件应该包含以下结构：

```markdown
# [功能名称]

## 一、角色定义
[定义AI扮演的角色和背景]

## 二、任务说明
[描述要完成的具体任务]

## 三、规则约束
[定义必须遵守的规则]

## 四、示例展示
[提供具体的好/坏示例]

## 五、输出格式
[定义输出的结构和格式]
```

**实际示例**：

```markdown
# 标题生成规范

## 一、角色定义
你是一位爆款标题专家，擅长创作高点击率的公众号标题。

## 二、任务说明
根据文章主题，生成5个备选标题，并推荐最佳选择。

## 三、规则约束
1. 标题字数：15-30字
2. 必须包含品牌词（如Claude、Cursor）
3. 使用数字增加可信度
4. 避免标题党和虚假承诺

## 四、示例展示
**✅ 好的标题**：
- "Claude Code 3个隐藏技巧，让你的开发效率翻倍"
- "手把手教你用Cursor，从入门到精通只需2小时"

**❌ 差的标题**：
- "这个工具太厉害了！"（没有具体信息）
- "99%的人不知道的秘密"（标题党）

## 五、输出格式
【推荐标题1】标题内容
公式：使用的标题公式
评分：XX分
推荐理由：为什么这个标题好

【备选标题2-5】...
```

### 4.4 提示词版本管理

**版本演进示例**：

```markdown
# V1.0.0 (2025-09-15) - 初始版本
## 变更内容
- 基础人设定义
- 简单的语言风格规范
- 3个示例

# V2.0.0 (2025-10-01) - 重大重构
## 破坏性变更
- 重新定义人设（从"技术专家"改为"普通人视角"）
- 删除专业术语库（与新人设矛盾）

## 新增
- 真实性验证清单
- 10个踩坑经历示例

# V3.0.0 (2025-11-20) - 自然表达革命
## 核心变更
- 从"表演角色"转向"自然表达"
- "自然比完美更重要"的理念
```

> 💡 **建议**：在提示词文件开头用注释记录版本历史，便于追踪变更。

---

## 第五部分：Python脚本集成

> **本节目的**：学习如何将Python脚本集成到Skill中，扩展Claude Code的能力。

### 5.1 为什么需要脚本

**脚本能做什么Claude Code做不到的事？**

| 任务类型 | Claude Code原生 | 脚本增强 |
|----------|----------------|---------|
| 文本分析 | ❌ 只能模糊判断 | ✅ 精确的NLP分析 |
| 数据计算 | ⚠️ 可能出错 | ✅ 100%准确计算 |
| 文件批处理 | ⚠️ 效率低 | ✅ 高效批量处理 |
| API调用 | ⚠️ 格式不确定 | ✅ 标准化输出 |
| 复杂校验 | ❌ 难以保证一致 | ✅ 确定性校验 |

### 5.2 脚本模板

**标准Python脚本模板**：

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
脚本名称 V版本号 - 简短描述

详细功能说明...

用法:
    python script.py <input> [options]

参数:
    input    必需，输入数据
    --json   可选，输出JSON格式

版本历史:
- V1.0.0 (2025-01-01): 初始版本
"""

import sys
import io
import json
from typing import Dict, Any, Optional
from dataclasses import dataclass, asdict


# ==================================================
# 数据类定义
# ==================================================

@dataclass
class ProcessResult:
    """处理结果数据类"""
    success: bool
    data: Dict[str, Any]
    message: str
    errors: list


# ==================================================
# 核心处理类
# ==================================================

class Processor:
    """处理器类"""

    def __init__(self, config: Optional[Dict] = None):
        """初始化处理器"""
        self.config = config or {}

    def process(self, input_data: str) -> ProcessResult:
        """
        处理输入数据

        Args:
            input_data: 输入数据

        Returns:
            ProcessResult: 处理结果
        """
        try:
            # 1. 验证输入
            if not input_data or not input_data.strip():
                return ProcessResult(
                    success=False,
                    data={},
                    message="输入数据为空",
                    errors=["输入不能为空"]
                )

            # 2. 核心处理逻辑
            result_data = self._core_process(input_data)

            # 3. 返回成功结果
            return ProcessResult(
                success=True,
                data=result_data,
                message="处理成功",
                errors=[]
            )

        except Exception as e:
            return ProcessResult(
                success=False,
                data={},
                message=f"处理失败: {str(e)}",
                errors=[str(e)]
            )

    def _core_process(self, data: str) -> Dict:
        """核心处理逻辑（子类可覆盖）"""
        # 在这里实现具体逻辑
        return {"processed": data}

    def generate_report(self, result: ProcessResult) -> str:
        """生成可读报告"""
        lines = [
            "=" * 60,
            "处理报告",
            "=" * 60,
            "",
            f"状态: {'成功' if result.success else '失败'}",
            f"消息: {result.message}",
            "",
        ]

        if result.data:
            lines.append("-" * 60)
            lines.append("处理结果:")
            for key, value in result.data.items():
                lines.append(f"  {key}: {value}")

        if result.errors:
            lines.append("")
            lines.append("错误信息:")
            for error in result.errors:
                lines.append(f"  - {error}")

        lines.extend(["", "=" * 60])
        return "\n".join(lines)


# ==================================================
# 命令行入口
# ==================================================

def main():
    """命令行入口函数"""
    # 设置UTF-8输出（Windows兼容）
    sys.stdout = io.TextIOWrapper(
        sys.stdout.buffer,
        encoding='utf-8'
    )

    # 参数验证
    if len(sys.argv) < 2:
        print("用法: python script.py <input> [--json]")
        print("")
        print("示例:")
        print("  python script.py '测试输入'")
        print("  python script.py '测试' --json")
        sys.exit(1)

    # 解析参数
    input_data = sys.argv[1]
    output_json = "--json" in sys.argv

    # 执行处理
    processor = Processor()
    result = processor.process(input_data)

    # 输出结果
    if output_json:
        print(json.dumps(asdict(result), ensure_ascii=False, indent=2))
    else:
        print(processor.generate_report(result))

    # 返回状态码
    sys.exit(0 if result.success else 1)


if __name__ == "__main__":
    main()
```

### 5.3 在Command中调用脚本

**调用方式**：

```markdown
# 在Command中调用脚本示例

### 步骤X：执行质量检测

**调用脚本**：
```bash
cd ".claude/skills/gongzhonghao-writer/scripts" && python quality_detector.py "文章内容" --json
```

**脚本参数说明**：
- 第一个参数：要检测的内容
- `--json`：输出JSON格式（便于解析）

**预期输出**：
```json
{
  "success": true,
  "data": {
    "ai_score": 15,
    "natural_score": 85,
    "passed": true
  },
  "message": "检测通过"
}
```
```

### 5.4 参数传递方式

| 方式 | 适用场景 | 示例 |
|------|---------|------|
| 命令行参数 | 简单参数 | `python script.py "topic"` |
| 标准输入 | 大量文本 | `echo "content" \| python script.py` |
| 文件传递 | 复杂数据 | `python script.py --input file.json` |
| 环境变量 | 配置信息 | `API_KEY=xxx python script.py` |

### 5.5 结果解析规范

**标准输出格式（JSON）**：

```json
{
  "success": true,
  "data": {
    "result_key": "result_value"
  },
  "message": "处理成功",
  "errors": []
}
```

**Claude Code解析模式**：

```markdown
当脚本执行完成后，解析输出：

1. **检查执行状态**
   - 返回码为0：执行成功
   - 返回码非0：执行失败，查看错误信息

2. **解析JSON输出**
   - 检查 `success` 字段
   - 提取 `data` 中的结果
   - 如有 `errors`，记录错误信息

3. **应用到后续步骤**
   - 使用解析结果继续工作流
```

---

## 第六部分：实战案例分析

> **本节目的**：通过分析真实的企业级Skill，学习高级设计模式。

### 6.1 多步骤工作流设计

**案例：公众号写作流程（8步自动化）**

```
步骤0：选题过滤
    │
    │ worth_writing?
    │
    ├──→ No ──→ 结束，给出建议
    │
    ▼ Yes
步骤1：读取规范
    │
    ▼
步骤2：智能判断（是否需要Research）
    │
    │ need_research?
    │
    ├──────────┬──────────┤
    │          │          │
    ▼          ▼
步骤3      跳过
(Research)
    │          │
    └────┬─────┘
         │
         ▼
步骤4：创作文章
         │
    ┌────┴────┐
    │         │
    ▼         ▼
步骤5     步骤7
(标题)    (质量检测)
    │         │
    └────┬────┘
         │
         ▼
步骤6：保存 ←── 条件：质量检测通过
         │
         ▼
步骤8：发文前检查
```

**工作流定义原则**：

1. **单一职责**：每个步骤只做一件事
2. **明确输入输出**：步骤间数据传递清晰
3. **可断点恢复**：失败后可以从断点继续
4. **可观测**：每个步骤都有状态反馈

### 6.2 数据驱动架构

**公众号写作助手的数据驱动流程**：

```
数据收集 → 数据分析 → 自动同步 → 配置更新 → 脚本生效
    │          │          │          │          │
    │          │          │          │          ▼
    │          │          │          │      质检/标题
    │          │          │          │      脚本使用
    │          │          │          │      新配置
    │          │          │          │
    │          │          │          ▼
    │          │          │   formulas_config.json
    │          │          │   brands_config.json
    │          │          │   quality_config.json
    │          │          │
    │          │          ▼
    │          │   sync_config.py
    │          │   （自动同步脚本）
    │          │
    │          ▼
    │   rule_validation_report.json
    │   （分析报告）
    │
    ▼
wechat_articles.json
（原始数据）
```

**配置文件示例（formulas_config.json）**：

```json
{
  "version": "8.0",
  "last_updated": "2025-12-17",
  "formulas": {
    "tool_recommendation": {
      "name": "工具推荐型",
      "pattern": "[品牌词] + [数字] + [推荐词]",
      "effectiveness": 5.25,
      "example": "Claude Code 5个必装插件，让你的开发效率翻倍"
    },
    "tutorial": {
      "name": "教程词型",
      "pattern": "[动作词] + [品牌词] + [场景]",
      "effectiveness": 1.95,
      "example": "手把手教你用Cursor，从入门到精通"
    }
  }
}
```

### 6.3 企业级Skill目录结构

**公众号写作助手完整结构**：

```
.claude/skills/gongzhonghao-writer/
├── SKILL.md                              (入口文档)
├── skill.yaml                            (配置文件)
├── prompts/
│   ├── rules/
│   │   └── baokuan-formulas-v8.md        (爆款公式)
│   ├── styles/
│   │   └── laojin-style-v8.md            (写作风格)
│   ├── format-rules.md                   (格式规范)
│   └── writing-checklist.md              (检查清单)
├── scripts/
│   ├── core/
│   │   ├── quality_detector.py           (质量检测)
│   │   ├── title_generator.py            (标题生成)
│   │   ├── title_scorer.py               (标题评分)
│   │   ├── topic_filter.py               (选题过滤)
│   │   └── pre_publish_checker.py        (发布检查)
│   ├── collectors/
│   │   └── collect_time_range.py         (数据收集)
│   └── utils/
│       └── fix_feishu_format.py          (格式修复)
├── config/
│   ├── formulas_config.json              (公式配置)
│   ├── brands_config.json                (品牌配置)
│   ├── quality_config.json               (质检配置)
│   └── sync_config.py                    (同步脚本)
├── instructions/
│   └── workflow.md                       (详细指令)
└── DATA_DRIVEN_WORKFLOW.md               (数据驱动文档)
```

**关键设计点**：

1. **分层结构**：prompts/rules、prompts/styles 分离规则和风格
2. **脚本分类**：core（核心）、collectors（收集）、utils（工具）
3. **配置驱动**：所有可变参数放在config/目录
4. **渐进式加载**：SKILL.md作为入口，按需加载子文档

---

## 第七部分：故障排查

> **本节目的**：快速解决Skill配置和运行中的常见问题。

### 7.1 常见错误及解决方案

#### 错误1：Skill未激活

**症状**：输入触发词没有反应

**可能原因**：
1. `skill.yaml` 文件格式错误
2. `triggers.keywords` 配置错误
3. 文件路径不正确

**解决方案**：

```bash
# 1. 检查skill.yaml格式
cat .claude/skills/你的skill/skill.yaml

# 2. 验证YAML格式（在线工具）
# 访问 https://www.yamllint.com/ 粘贴内容检查

# 3. 检查关键词配置
# 确保triggers.keywords是数组格式：
triggers:
  keywords:
    - "关键词1"
    - "关键词2"

# 4. 重启Claude Code
# 退出后重新启动
```

#### 错误2：提示词未加载

**症状**：AI回复不符合Skill风格

**可能原因**：
1. `prompt_files` 路径错误
2. 提示词文件不存在

**解决方案**：

```bash
# 1. 检查prompt_files配置
grep "prompt_files" .claude/skills/你的skill/skill.yaml

# 2. 验证文件存在
ls -la .claude/skills/你的skill/prompts/

# 3. 路径使用相对路径（相对于skill目录）
prompt_files:
  main: "prompts/main-prompt.md"  # ✅ 正确
  # main: ".claude/skills/xxx/prompts/main-prompt.md"  # ❌ 错误
```

#### 错误3：脚本执行失败

**症状**：调用脚本时报错

**可能原因**：
1. Python路径问题
2. 脚本权限问题
3. 依赖包未安装

**解决方案**：

```bash
# 1. 检查Python是否可用
python --version
# 或
python3 --version

# 2. 检查脚本权限（macOS/Linux）
chmod +x .claude/skills/你的skill/scripts/*.py

# 3. 安装依赖
pip install -r .claude/skills/你的skill/requirements.txt

# 4. 手动测试脚本
cd .claude/skills/你的skill/scripts
python 脚本名.py "测试输入"
```

#### 错误4：YAML解析错误

**症状**：加载时报语法错误

**可能原因**：
1. 缩进错误（YAML对缩进敏感）
2. 特殊字符未转义
3. 冒号后缺少空格

**解决方案**：

```yaml
# ❌ 错误：冒号后没有空格
name:"我的Skill"

# ✅ 正确：冒号后有空格
name: "我的Skill"

# ❌ 错误：缩进不一致（混用Tab和空格）
triggers:
	keywords:  # Tab缩进
    - "关键词"  # 空格缩进

# ✅ 正确：统一使用2空格缩进
triggers:
  keywords:
    - "关键词"
```

### 7.2 调试技巧

**技巧1：启用调试模式**

在 `skill.yaml` 中添加：

```yaml
debug:
  enabled: true
  info: "调试模式已启用"
```

**技巧2：手动测试脚本**

```bash
# 直接运行脚本看输出
cd .claude/skills/你的skill/scripts
python 脚本名.py "测试输入" --json

# 检查返回码
echo $?  # 0表示成功，非0表示失败
```

**技巧3：检查文件编码**

```bash
# 确保文件是UTF-8编码
file .claude/skills/你的skill/skill.yaml
# 应显示：UTF-8 Unicode text
```

---

## 第八部分：FAQ（20个常见问题）

### Q1：Skill和Command有什么区别？
**A**：Command是"按钮"（触发器），Skill是"APP"（能力包）。Command用于显式触发，Skill用于封装知识和工具。两者通常配合使用：Command作为入口，Skill提供能力。

### Q2：必须要skill.yaml吗？
**A**：是的，`skill.yaml` 是Skill的"身份证"，必须存在。没有它Claude Code无法识别这是一个Skill。

### Q3：prompts目录必须要吗？
**A**：不是必须的，但强烈推荐。如果你的Skill只是简单包装脚本，可以不要。但如果涉及AI知识和规范，一定要用prompts。

### Q4：scripts支持哪些语言？
**A**：主要支持Python和Bash。推荐Python，因为生态好、跨平台、易维护。JavaScript也可以，但不如Python常用。

### Q5：如何让Skill自动激活？
**A**：在 `skill.yaml` 的 `triggers.keywords` 中配置关键词。用户说这些词时会自动激活Skill。

### Q6：可以有多个Skill吗？
**A**：可以。每个Skill是 `.claude/skills/` 下的独立目录，可以有任意多个。

### Q7：Skill之间会冲突吗？
**A**：如果关键词重复可能会冲突。建议每个Skill使用唯一的触发词。

### Q8：如何更新Skill版本？
**A**：修改 `skill.yaml` 中的 `version` 字段，遵循语义化版本号规范（MAJOR.MINOR.PATCH）。

### Q9：提示词文件多大合适？
**A**：建议单个文件不超过2000行。太长会影响加载速度和AI理解。大的Skill应该拆分成多个文件。

### Q10：如何调试Skill？
**A**：
1. 在skill.yaml中启用debug模式
2. 手动运行脚本测试
3. 检查文件路径和格式
4. 查看Claude Code的输出日志

### Q11：脚本执行超时怎么办？
**A**：检查脚本是否有死循环或长时间等待。建议脚本执行时间控制在10秒内。

### Q12：如何处理中文路径问题？
**A**：Windows上尽量避免中文路径。如果必须使用，确保文件编码为UTF-8，脚本中正确处理编码。

### Q13：Skill可以调用MCP吗？
**A**：可以在 `dependencies.mcp_servers` 中声明依赖的MCP服务器。Skill的提示词可以引用MCP工具。

### Q14：如何共享Skill给团队？
**A**：将整个 `.claude/skills/你的skill/` 目录提交到Git仓库。团队成员克隆后即可使用。

### Q15：Skill可以跨项目使用吗？
**A**：可以。将Skill放在全局配置目录（~/.claude/skills/）即可在所有项目中使用。

### Q16：如何回退到旧版本Skill？
**A**：使用Git回退到旧版本的提交，或者保留多个版本目录（如skill-v1、skill-v2）。

### Q17：提示词中可以使用变量吗？
**A**：Claude Code的提示词不支持模板变量。如果需要动态内容，使用脚本生成。

### Q18：如何测试Skill是否正常工作？
**A**：
1. 检查文件结构是否完整
2. 验证YAML格式
3. 手动测试脚本
4. 在Claude Code中测试触发词

### Q19：Skill加载很慢怎么办？
**A**：
1. 减少提示词文件大小
2. 优化脚本性能
3. 使用渐进式加载（只加载需要的部分）

### Q20：如何学习更高级的Skill开发？
**A**：
1. 阅读公众号写作助手的源码
2. 参考官方Skill示例
3. 实践中不断迭代优化

---

## 第九部分：附录

### 附录A：Skill目录快速创建脚本

**macOS/Linux一键创建脚本**：

```bash
#!/bin/bash
# create-skill.sh - Skill目录结构一键创建
# 用法: ./create-skill.sh <skill-name>

SKILL_NAME=$1

if [ -z "$SKILL_NAME" ]; then
    echo "用法: $0 <skill-name>"
    exit 1
fi

SKILL_DIR=".claude/skills/${SKILL_NAME}"

echo "创建Skill目录: ${SKILL_NAME}"

# 创建目录结构
mkdir -p "${SKILL_DIR}/prompts"
mkdir -p "${SKILL_DIR}/scripts"
mkdir -p "${SKILL_DIR}/config"

# 创建skill.yaml
cat > "${SKILL_DIR}/skill.yaml" << EOF
name: "${SKILL_NAME}"
description: "请填写Skill描述"
version: "1.0.0"
author: "你的名字"

triggers:
  keywords:
    - "关键词1"
    - "关键词2"

prompt_files:
  main: "prompts/main-prompt.md"

capabilities:
  - name: "核心能力"
    description: "能力描述"
EOF

# 创建主提示词
cat > "${SKILL_DIR}/prompts/main-prompt.md" << 'EOF'
# Skill主提示词

## 一、角色定义
[定义AI扮演的角色]

## 二、任务说明
[描述要完成的任务]

## 三、规则约束
[定义必须遵守的规则]

## 四、示例展示
[提供具体示例]

## 五、输出格式
[定义输出结构]
EOF

# 创建README
cat > "${SKILL_DIR}/README.md" << EOF
# ${SKILL_NAME}

**版本**: 1.0.0
**创建时间**: $(date +%Y-%m-%d)

## 功能说明
请填写功能说明

## 使用方法
请填写使用方法
EOF

echo "✅ Skill创建完成: ${SKILL_DIR}"
echo ""
echo "下一步:"
echo "1. 编辑 ${SKILL_DIR}/skill.yaml"
echo "2. 编写 ${SKILL_DIR}/prompts/main-prompt.md"
```

### 附录B：skill.yaml完整字段参考

```yaml
# ==================================================
# 基本信息（必填）
# ==================================================
name: "Skill名称"                        # 显示名称
description: "Skill描述"                  # 简短描述
version: "1.0.0"                         # 语义化版本号

# ==================================================
# 可选信息
# ==================================================
author: "作者名"                          # 作者
license: "MIT"                           # 许可证
repository: "https://github.com/..."     # 仓库地址

# ==================================================
# 调试配置
# ==================================================
debug:
  enabled: false                         # 是否启用调试
  load_priority: "project"               # 加载优先级
  override_global: false                 # 是否覆盖全局

# ==================================================
# 触发配置
# ==================================================
triggers:
  keywords:                              # 关键词列表
    - "关键词1"
    - "关键词2"
  patterns:                              # 正则模式
    - "模式1.*"
  contexts:                              # 上下文条件
    - file_pattern: "*.md"

# ==================================================
# 文件映射
# ==================================================
prompt_files:
  main: "prompts/main-prompt.md"
  style: "prompts/style.md"
  rules: "prompts/rules.md"

# ==================================================
# 脚本配置
# ==================================================
scripts:
  - name: "script.py"
    description: "脚本描述"
    entry_point: "python script.py"
    args: ["arg1", "--flag"]

# ==================================================
# 能力声明
# ==================================================
capabilities:
  - name: "能力名称"
    description: "能力描述"
    source: "prompts/xxx.md"

# ==================================================
# 依赖声明
# ==================================================
dependencies:
  python_packages:
    - "package>=1.0"
  node_packages:
    - "package"
  mcp_servers:
    - name: "ServerName"
      required: true

# ==================================================
# 质量标准
# ==================================================
quality_standards:
  metric_name:
    - "标准1"
    - "标准2"

# ==================================================
# 版本历史
# ==================================================
changelog:
  - version: "1.0.0"
    date: "2025-01-01"
    changes:
      - "初始版本"
```

### 附录C：常用脚本示例

**示例1：简单文本处理**

```python
#!/usr/bin/env python3
"""简单文本处理脚本"""
import sys

def process(text):
    # 处理逻辑
    return text.upper()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python script.py <text>")
        sys.exit(1)

    result = process(sys.argv[1])
    print(result)
```

**示例2：JSON输出**

```python
#!/usr/bin/env python3
"""带JSON输出的脚本"""
import sys
import json

def analyze(text):
    return {
        "length": len(text),
        "words": len(text.split()),
        "success": True
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "缺少参数"}))
        sys.exit(1)

    result = analyze(sys.argv[1])
    print(json.dumps(result, ensure_ascii=False, indent=2))
```

---

## 质量检查清单

完成本教程后，请核对以下检查项：

- [ ] **理解Skills概念**：能解释Skills和Commands的区别
- [ ] **创建基础Skill**：能独立创建包含skill.yaml和prompts的Skill
- [ ] **配置触发条件**：能正确配置keywords触发
- [ ] **编写提示词**：能按规范组织prompts目录
- [ ] **集成脚本**：能将Python脚本集成到Skill中
- [ ] **故障排查**：能解决常见的配置和执行问题
- [ ] **版本管理**：理解语义化版本号规范

---

> **恭喜完成Skills定制教程！**
>
> 现在你已经掌握了创建和管理Claude Code Skills的核心技能。
>
> **下一步建议**：
> 1. 为你的工作领域创建一个实用的Skill
> 2. 参考公众号写作助手的架构设计更复杂的Skill
> 3. 与团队分享你的Skill，收集反馈持续优化

---

**文档信息**
- 版本：1.0.0
- 更新日期：2025年12月
- 字数：约15,000字
- 作者：基于原始文档整合优化
