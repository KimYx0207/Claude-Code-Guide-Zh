# Claude Code Skills 编写最佳实践指南

**发布时间**: 📅 2025年11月1日
**作者**: ✍️ GAC Code Team
**分类**: 高级教程
**标签**: #claude-code #skills #最佳实践 #提示工程 #开发工具

---

掌握编写优秀 Skills 的关键在于简洁、结构化和实战测试。本指南提供实用的编写建议，帮助你创建 Claude 能够有效发现和使用的 Skills。

### 核心原则

#### 简洁至关重要

上下文窗口是公共资源，你的 Skill 需要与其他内容共享这个空间，包括系统提示、对话历史、其他 Skills 的元数据以及用户的实际请求。

启动时，Claude 只会预加载所有 Skills 的元数据（名称和描述）。只有当 Skill 变得相关时，Claude 才会读取 SKILL.md 文件，并且只在需要时读取额外的文件。尽管如此，SKILL.md 的简洁性仍然重要，一旦加载后，每个 token 都会与对话历史和其他上下文竞争空间。

默认假设：Claude 已经非常智能

只添加 Claude 还不知道的上下文。对每条信息提出质疑：Claude 真的需要这个解释吗？我能假设 Claude 已经知道这个吗？这段内容值得消耗 token 吗？

良好示例（简洁版，约 50 tokens）：

```bash
## 提取 PDF 文本

使用 pdfplumber 提取文本：

```python
import pdfplumber

with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
```

不良示例（过于冗长，约 150 tokens）：

```bash
## 提取 PDF 文本

PDF（便携式文档格式）文件是一种常见的文件格式，包含文本、图像和其他内容。
要从 PDF 中提取文本，你需要使用一个库。有很多可用的 PDF 处理库，但我们
推荐 pdfplumber，因为它易于使用且能处理大多数情况。首先，你需要使用
pip 安装它。然后你可以使用下面的代码...
```

简洁版本假设 Claude 知道什么是 PDF 以及库的工作原理。

#### 设置适当的自由度

根据任务的脆弱性和可变性匹配具体程度。

高自由度（基于文本的指令）：

适用场景：多种方法都有效、决策依赖于上下文、启发式方法指导操作。

```bash
## 代码审查流程

1. 分析代码结构和组织
2. 检查潜在的 bug 或边缘情况
3. 建议提高可读性和可维护性的改进
4. 验证是否遵循项目约定
```

中等自由度（带参数的伪代码或脚本）：

适用场景：存在首选模式、允许一些变化、配置影响行为。

```bash
## 生成报告

使用此模板并根据需要自定义：

```python
def generate_report(data, format="markdown", include_charts=True):
    # 处理数据
    # 以指定格式生成输出
    # 可选地包含可视化
```
```

低自由度（特定脚本，很少或没有参数）：

适用场景：操作容易出错、一致性至关重要、必须遵循特定顺序。

```bash
## 数据库迁移

严格执行此脚本：

```bash
python scripts/migrate.py --verify --backup
```

不要修改命令或添加其他标志。
```

类比：将 Claude 想象成一个探索路径的机器人。当路径是两侧悬崖的狭窄桥梁时，只有一条安全的路径，需要提供具体的护栏和精确指令（低自由度）。当路径是没有障碍的开阔场地时，许多路径都能成功，给出总体方向并信任 Claude 找到最佳路线（高自由度）。

#### 在所有目标模型上测试

Skills 作为模型的补充，因此有效性取决于底层模型。在计划使用的所有模型上测试你的 Skill。

不同模型的测试考虑：

- Claude Haiku（快速、经济）：Skill 是否提供了足够的指导？
- Claude Sonnet（平衡）：Skill 是否清晰高效？
- Claude Opus（强大推理）：Skill 是否避免了过度解释？

对 Opus 完美有效的内容可能需要为 Haiku 提供更多细节。如果计划跨多个模型使用 Skill，请针对所有模型都能良好工作的指令进行优化。

### Skill 结构

#### 命名规范

使用一致的命名模式使 Skills 更容易引用和讨论。我们推荐使用动名词形式（动词 + -ing）来命名 Skill，因为这清楚地描述了 Skill 提供的活动或能力。

记住 name 字段必须只使用小写字母、数字和连字符。

良好的命名示例（动名词形式）：

- processing-pdfs
- analyzing-spreadsheets
- managing-databases
- testing-code
- writing-documentation

可接受的替代方案：

- 名词短语：pdf-processing、spreadsheet-analysis
- 面向动作：process-pdfs、analyze-spreadsheets

- 模糊名称：helper、utils、tools
- 过于通用：documents、data、files
- 保留词：anthropic-helper、claude-tools
- 技能集合内的不一致模式

#### 编写有效的描述

description 字段启用 Skill 发现，应该包括 Skill 的功能和使用时机。

**始终使用第三人称。**描述会被注入到系统提示中，不一致的视角会导致发现问题。

- 良好：处理 Excel 文件并生成报告
- 避免：我可以帮你处理 Excel 文件
- 避免：你可以用它来处理 Excel 文件

**具体并包含关键术语。**包括 Skill 的功能和使用的特定触发器/上下文。

每个 Skill 只有一个描述字段。描述对于技能选择至关重要：Claude 使用它从可能超过 100 个的 Skills 中选择正确的那个。你的描述必须提供足够的详细信息让 Claude 知道何时选择这个 Skill，而 SKILL.md 的其余部分提供实现细节。

PDF 处理 skill：

```bash
description: 从 PDF 文件中提取文本和表格，填充表单，合并文档。在处理 PDF 文件或用户提到 PDF、表单或文档提取时使用。
```

Excel 分析 skill：

```bash
description: 分析 Excel 电子表格，创建数据透视表，生成图表。在分析 Excel 文件、电子表格、表格数据或 .xlsx 文件时使用。
```

Git 提交助手 skill：

```bash
description: 通过分析 git diff 生成描述性的提交消息。在用户请求帮助编写提交消息或审查暂存更改时使用。
```

避免模糊的描述：

```bash
description: 帮助处理文档
description: 处理数据
description: 对文件进行操作
```

#### 渐进式信息披露模式

SKILL.md 作为概述，根据需要指向详细材料，就像入门指南中的目录。

- 保持 SKILL.md 主体在 500 行以下以获得最佳性能
- 接近此限制时将内容拆分为单独的文件
- 使用以下模式有效组织指令、代码和资源

##### 模式 1：带引用的高级指南

```bash
---
name: pdf-processing
description: 从 PDF 文件中提取文本和表格，填充表单和合并文档。在处理 PDF 文件或用户提到 PDF、表单或文档提取时使用。
---

# PDF 处理

## 快速开始

使用 pdfplumber 提取文本：
```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```

## 高级功能

**表单填充**：查看 [FORMS.md](FORMS.md) 获取完整指南
**API 参考**：查看 [REFERENCE.md](REFERENCE.md) 获取所有方法
**示例**：查看 [EXAMPLES.md](EXAMPLES.md) 获取常见模式
```

Claude 只在需要时加载 FORMS.md、REFERENCE.md 或 EXAMPLES.md。

##### 模式 2：按领域组织

对于具有多个领域的 Skills，按领域组织内容以避免加载无关上下文。当用户询问销售指标时，Claude 只需要读取与销售相关的架构，而不是财务或营销数据。

```bash
bigquery-skill/
├── SKILL.md （概述和导航）
└── reference/
    ├── finance.md （收入、计费指标）
    ├── sales.md （机会、管道）
    ├── product.md （API 使用、功能）
    └── marketing.md （活动、归因）
```

```bash
# BigQuery 数据分析

## 可用数据集

**财务**：收入、ARR、计费 → 查看 [reference/finance.md](reference/finance.md)
**销售**：机会、管道、账户 → 查看 [reference/sales.md](reference/sales.md)
**产品**：API 使用、功能、采用 → 查看 [reference/product.md](reference/product.md)
**营销**：活动、归因、邮件 → 查看 [reference/marketing.md](reference/marketing.md)

## 快速搜索

使用 grep 查找特定指标：

```bash
grep -i "revenue" reference/finance.md
grep -i "pipeline" reference/sales.md
grep -i "api usage" reference/product.md
```
```

##### 模式 3：条件详细信息

显示基本内容，链接到高级内容：

```bash
# DOCX 处理

## 创建文档

使用 docx-js 创建新文档。查看 [DOCX-JS.md](DOCX-JS.md)。

## 编辑文档

对于简单的编辑，直接修改 XML。

**关于跟踪更改**：查看 [REDLINING.md](REDLINING.md)
**关于 OOXML 详情**：查看 [OOXML.md](OOXML.md)
```

Claude 只在用户需要这些功能时才读取 REDLINING.md 或 OOXML.md。

#### 避免深层嵌套引用

Claude 在从其他引用文件引用文件时可能会部分读取文件。遇到嵌套引用时，Claude 可能使用 head -100 等命令预览内容而不是读取整个文件，导致信息不完整。

**保持引用距离 SKILL.md 一层深度。**所有引用文件应直接从 SKILL.md 链接，以确保 Claude 在需要时读取完整文件。

不良示例（太深）：

```bash
# SKILL.md
查看 [advanced.md](advanced.md)...

# advanced.md
查看 [details.md](details.md)...

# details.md
这里是实际信息...
```

良好示例（一层深度）：

```bash
# SKILL.md

**基本用法**：[SKILL.md 中的指令]
**高级功能**：查看 [advanced.md](advanced.md)
**API 参考**：查看 [reference.md](reference.md)
**示例**：查看 [examples.md](examples.md)
```

#### 为较长的引用文件添加目录

对于超过 100 行的引用文件，在顶部包含目录。这确保 Claude 即使在部分读取预览时也能看到可用信息的完整范围。

```bash
# API 参考

## 目录
- 身份验证和设置
- 核心方法（创建、读取、更新、删除）
- 高级功能（批量操作、webhooks）
- 错误处理模式
- 代码示例

## 身份验证和设置
...

## 核心方法
...
```

然后 Claude 可以读取完整文件或根据需要跳转到特定部分。

### 工作流程与反馈循环

#### 为复杂任务使用工作流程

将复杂操作分解为清晰的顺序步骤。对于特别复杂的工作流程，提供 Claude 可以复制到响应中并在进展时勾选的检查清单。

示例 1：研究综合工作流程（适用于不含代码的 Skills）：

```bash
## 研究综合工作流程

复制此检查清单并跟踪你的进度：

```
研究进度：
- [ ] 步骤 1：阅读所有源文档
- [ ] 步骤 2：识别关键主题
- [ ] 步骤 3：交叉引用声明
- [ ] 步骤 4：创建结构化摘要
- [ ] 步骤 5：验证引用
```

**步骤 1：阅读所有源文档**

审查 `sources/` 目录中的每个文档。记录主要论点和支持证据。

**步骤 2：识别关键主题**

寻找跨来源的模式。哪些主题重复出现？来源在哪里同意或不同意？

**步骤 3：交叉引用声明**

对于每个主要声明，验证它出现在源材料中。记录哪个来源支持每个观点。

**步骤 4：创建结构化摘要**

按主题组织发现。包括：
- 主要声明
- 来自来源的支持证据
- 冲突观点（如果有）

**步骤 5：验证引用**

检查每个声明是否引用了正确的源文档。如果引用不完整，返回步骤 3。
```

示例 2：PDF 表单填充工作流程（适用于包含代码的 Skills）：

```bash
## PDF 表单填充工作流程

复制此检查清单并在完成时勾选项目：

```
任务进度：
- [ ] 步骤 1：分析表单（运行 analyze_form.py）
- [ ] 步骤 2：创建字段映射（编辑 fields.json）
- [ ] 步骤 3：验证映射（运行 validate_fields.py）
- [ ] 步骤 4：填充表单（运行 fill_form.py）
- [ ] 步骤 5：验证输出（运行 verify_output.py）
```

**步骤 1：分析表单**

运行：`python scripts/analyze_form.py input.pdf`

这会提取表单字段及其位置，保存到 `fields.json`。

**步骤 2：创建字段映射**

编辑 `fields.json` 为每个字段添加值。

**步骤 3：验证映射**

运行：`python scripts/validate_fields.py fields.json`

继续之前修复任何验证错误。

**步骤 4：填充表单**

运行：`python scripts/fill_form.py input.pdf fields.json output.pdf`

**步骤 5：验证输出**

运行：`python scripts/verify_output.py output.pdf`

如果验证失败，返回步骤 2。
```

清晰的步骤防止 Claude 跳过关键验证。检查清单帮助 Claude 和你跟踪多步骤工作流程的进度。

#### 实施反馈循环

常见模式：运行验证器 → 修复错误 → 重复

这种模式大大提高输出质量。

示例 1：样式指南合规性（适用于不含代码的 Skills）：

```bash
## 内容审查流程

1. 按照 STYLE_GUIDE.md 中的指南起草你的内容
2. 根据检查清单审查：
   - 检查术语一致性
   - 验证示例遵循标准格式
   - 确认所有必需部分都存在
3. 如果发现问题：
   - 记录每个问题并提供具体部分引用
   - 修订内容
   - 再次审查检查清单
4. 只有在满足所有要求时才继续
5. 完成并保存文档
```

示例 2：文档编辑流程（适用于包含代码的 Skills）：

```bash
## 文档编辑流程

1. 对 `word/document.xml` 进行编辑
2. **立即验证**：`python ooxml/scripts/validate.py unpacked_dir/`
3. 如果验证失败：
   - 仔细审查错误消息
   - 修复 XML 中的问题
   - 再次运行验证
4. **只有在验证通过时才继续**
5. 重建：`python ooxml/scripts/pack.py unpacked_dir/ output.docx`
6. 测试输出文档
```

验证循环能够及早发现错误。

### 内容指南

#### 避免时间敏感信息

不要包含会过时的信息。

不良示例（时间敏感，会变错）：

```bash
如果你在 2025 年 8 月之前这样做，使用旧 API。
2025 年 8 月之后，使用新 API。
```

良好示例（使用”旧模式”部分）：

```bash
## 当前方法

使用 v2 API 端点：`api.example.com/v2/messages`

## 旧模式

<details>
<summary>旧版 v1 API（2025-08 弃用）</summary>

v1 API 使用：`api.example.com/v1/messages`

此端点不再支持。
</details>
```

旧模式部分提供历史背景，而不会使主要内容混乱。

#### 使用一致的术语

选择一个术语并在整个 Skill 中使用。

良好 - 一致：

- 始终使用”API 端点”
- 始终使用”字段”
- 始终使用”提取”

不良 - 不一致：

- 混用”API 端点”、“URL”、“API 路由”、“路径”
- 混用”字段”、“框”、“元素”、“控件”
- 混用”提取”、“拉取”、“获取”、“检索”

一致性帮助 Claude 理解和遵循指令。

### 常见模式

#### 模板模式

为输出格式提供模板。根据需要匹配严格程度。

对于严格要求（如 API 响应或数据格式）：

```bash
## 报告结构

始终使用此确切的模板结构：

```markdown
# [分析标题]

## 执行摘要
[关键发现的一段概述]

## 关键发现
- 发现 1 及支持数据
- 发现 2 及支持数据
- 发现 3 及支持数据

## 建议
1. 具体可行的建议
2. 具体可行的建议
```
```

对于灵活指导（当适应有用时）：

```bash
## 报告结构

这是一个合理的默认格式，但根据分析使用你的最佳判断：

```markdown
# [分析标题]

## 执行摘要
[概述]

## 关键发现
[根据你发现的内容调整部分]

## 建议
[根据具体上下文定制]
```

根据特定分析类型的需要调整部分。
```

#### 示例模式

对于输出质量依赖于查看示例的 Skills，提供输入/输出对，就像在常规提示中一样：

```bash
## 提交消息格式

按照以下示例生成提交消息：

**示例 1:**
输入：添加了使用 JWT 令牌的用户认证
输出：
```
feat(auth): 实现基于 JWT 的认证

添加登录端点和令牌验证中间件
```

**示例 2:**
输入：修复了报告中日期显示不正确的 bug
输出：
```
fix(reports): 修正时区转换中的日期格式

在报告生成中一致使用 UTC 时间戳
```

**示例 3:**
输入：更新了依赖项并重构了错误处理
输出：
```
chore: 更新依赖项并重构错误处理

- 将 lodash 升级到 4.17.21
- 标准化跨端点的错误响应格式
```

遵循此样式：类型(范围): 简要描述，然后详细解释。
```

示例比单纯的描述更能帮助 Claude 理解所需的样式和详细程度。

#### 条件工作流程模式

指导 Claude 通过决策点：

```bash
## 文档修改工作流程

1. 确定修改类型：

   **创建新内容？** → 遵循下面的"创建工作流程"
   **编辑现有内容？** → 遵循下面的"编辑工作流程"

2. 创建工作流程：
   - 使用 docx-js 库
   - 从头构建文档
   - 导出为 .docx 格式

3. 编辑工作流程：
   - 解包现有文档
   - 直接修改 XML
   - 每次更改后验证
   - 完成时重新打包
```

如果工作流程变得庞大或复杂有很多步骤，考虑将它们推送到单独的文件中，并告诉 Claude 根据手头的任务读取适当的文件。

### 评估与迭代

#### 先构建评估

**在编写大量文档之前创建评估。**这确保你的 Skill 解决真实问题，而不是记录想象中的问题。

评估驱动的开发：

1. 识别差距：在没有 Skill 的情况下在代表性任务上运行 Claude。记录具体的失败或缺失的上下文
2. 创建评估：构建测试这些差距的三个场景
3. 建立基线：在没有 Skill 的情况下测量 Claude 的性能
4. 编写最小指令：创建刚好足够的内容来解决差距并通过评估
5. 迭代：执行评估，与基线比较，并完善

这种方法确保你解决实际问题，而不是预测可能永远不会实现的需求。

#### 与 Claude 一起迭代开发 Skills

最有效的 Skill 开发过程涉及 Claude 本身。与一个 Claude 实例（“Claude A”）合作创建一个将被其他实例使用的 Skill（“Claude B”）。Claude A 帮助你设计和完善指令，而 Claude B 在实际任务中测试它们。

创建新 Skill：

1. 在没有 Skill 的情况下完成任务：与 Claude A 一起使用正常提示解决问题。在工作时，你会自然地提供上下文、解释偏好和分享程序知识。注意你重复提供的信息。
2. 识别可重用模式：完成任务后，识别你提供的哪些上下文对类似的未来任务有用。
例如：如果你完成了一个 BigQuery 分析，你可能提供了表名、字段定义、过滤规则（如”始终排除测试账户”）和常见查询模式。
3. 要求 Claude A 创建 Skill：“创建一个捕获我们刚刚使用的这个 BigQuery 分析模式的 Skill。包括表架构、命名约定和关于过滤测试账户的规则。”
Claude 模型原生理解 Skill 格式和结构。你不需要特殊的系统提示或”编写技能”的技能来让 Claude 帮助创建 Skills。只需要求 Claude 创建一个 Skill，它将生成具有适当前置内容和正文内容的正确结构的 SKILL.md 内容。
4. 审查简洁性：检查 Claude A 是否添加了不必要的解释。询问：“删除关于胜率含义的解释 - Claude 已经知道了。”
5. 改进信息架构：要求 Claude A 更有效地组织内容。例如：“组织这个，使表架构在单独的引用文件中。我们以后可能会添加更多表。”
6. 在类似任务上测试：在加载了 Skill 的 Claude B（一个新实例）上对相关用例使用 Skill。观察 Claude B 是否找到正确的信息，正确应用规则，并成功处理任务。
7. 根据观察迭代：如果 Claude B 遇到困难或遗漏了什么，返回 Claude A 并提供具体信息：“当 Claude 使用这个 Skill 时，它忘记了按日期过滤 Q4。我们应该添加一个关于日期过滤模式的部分吗？”

在没有 Skill 的情况下完成任务：与 Claude A 一起使用正常提示解决问题。在工作时，你会自然地提供上下文、解释偏好和分享程序知识。注意你重复提供的信息。

识别可重用模式：完成任务后，识别你提供的哪些上下文对类似的未来任务有用。

例如：如果你完成了一个 BigQuery 分析，你可能提供了表名、字段定义、过滤规则（如”始终排除测试账户”）和常见查询模式。

要求 Claude A 创建 Skill：“创建一个捕获我们刚刚使用的这个 BigQuery 分析模式的 Skill。包括表架构、命名约定和关于过滤测试账户的规则。”

Claude 模型原生理解 Skill 格式和结构。你不需要特殊的系统提示或”编写技能”的技能来让 Claude 帮助创建 Skills。只需要求 Claude 创建一个 Skill，它将生成具有适当前置内容和正文内容的正确结构的 SKILL.md 内容。

审查简洁性：检查 Claude A 是否添加了不必要的解释。询问：“删除关于胜率含义的解释 - Claude 已经知道了。”

改进信息架构：要求 Claude A 更有效地组织内容。例如：“组织这个，使表架构在单独的引用文件中。我们以后可能会添加更多表。”

在类似任务上测试：在加载了 Skill 的 Claude B（一个新实例）上对相关用例使用 Skill。观察 Claude B 是否找到正确的信息，正确应用规则，并成功处理任务。

根据观察迭代：如果 Claude B 遇到困难或遗漏了什么，返回 Claude A 并提供具体信息：“当 Claude 使用这个 Skill 时，它忘记了按日期过滤 Q4。我们应该添加一个关于日期过滤模式的部分吗？”

迭代现有 Skills：

当改进 Skills 时，相同的分层模式继续。你在以下之间交替：

- 与 Claude A 合作（帮助完善 Skill 的专家）
- 使用 Claude B 测试（使用 Skill 执行实际工作的代理）
- 观察 Claude B 的行为并将洞察带回 Claude A

#### 观察 Claude 如何导航 Skills

在迭代 Skills 时，注意 Claude 在实践中如何实际使用它们。注意：

- 意外的探索路径：Claude 是否以你没有预料到的顺序读取文件？这可能表明你的结构不如你想象的直观
- 遗漏的连接：Claude 是否未能跟随到重要文件的引用？你的链接可能需要更明确或突出
- 过度依赖某些部分：如果 Claude 反复读取同一个文件，考虑该内容是否应该在主 SKILL.md 中
- 忽略的内容：如果 Claude 从不访问一个捆绑文件，它可能是不必要的或在主指令中信号不佳

根据这些观察而不是假设进行迭代。Skill 元数据中的”name”和”description”特别关键。Claude 在决定是否触发 Skill 以响应当前任务时使用这些。确保它们清楚地描述 Skill 的功能和何时应使用。

### 需要避免的反模式

#### 避免 Windows 风格的路径

在文件路径中始终使用正斜杠，即使在 Windows 上也是如此：

- ✓ 良好：scripts/helper.py、reference/guide.md
- ✗ 避免：scripts\helper.py、reference\guide.md

Unix 风格的路径在所有平台上都有效，而 Windows 风格的路径在 Unix 系统上会导致错误。

#### 避免提供太多选项

除非必要，不要呈现多种方法：

```bash
**不良示例：太多选择**（令人困惑）：
"你可以使用 pypdf，或 pdfplumber，或 PyMuPDF，或 pdf2image，或..."

**良好示例：提供默认值**（带逃生舱）：
"使用 pdfplumber 提取文本：
```python
import pdfplumber
```

对于需要 OCR 的扫描 PDF，改用 pdf2image 和 pytesseract。"
```

### 高级：包含可执行代码的 Skills

#### 解决问题，不要推卸

在为 Skills 编写脚本时，明确处理错误条件，而不是推给 Claude。

良好示例：明确处理错误：

```bash
def process_file(path):
    """处理文件，如果不存在则创建它。"""
    try:
        with open(path) as f:
            return f.read()
    except FileNotFoundError:
        # 创建具有默认内容的文件而不是失败
        print(f"文件 {path} 未找到，创建默认文件")
        with open(path, 'w') as f:
            f.write('')
        return ''
    except PermissionError:
        # 提供替代方案而不是失败
        print(f"无法访问 {path}，使用默认值")
        return ''
```

不良示例：推给 Claude：

```bash
def process_file(path):
    # 直接失败让 Claude 自己解决
    return open(path).read()
```

#### 提供实用脚本

即使 Claude 可以编写脚本，预制脚本也提供优势：

实用脚本的好处：

- 比生成的代码更可靠
- 节省 token（无需在上下文中包含代码）
- 节省时间（无需代码生成）
- 确保跨使用的一致性

重要区别：在指令中明确说明 Claude 应该：

- 执行脚本（最常见）：“运行 analyze_form.py 提取字段”
- 作为参考阅读（对于复杂逻辑）：“查看 analyze_form.py 了解字段提取算法”

对于大多数实用脚本，执行是首选，因为它更可靠和高效。

#### 打包依赖项

Skills 在具有平台特定限制的代码执行环境中运行：

- claude.ai：可以从 npm 和 PyPI 安装包并从 GitHub 存储库拉取
- Anthropic API：没有网络访问权限，没有运行时包安装

在 SKILL.md 中列出所需的包，并验证它们在代码执行工具文档中可用。

#### MCP 工具引用

如果你的 Skill 使用 MCP（模型上下文协议）工具，始终使用完全限定的工具名称以避免”找不到工具”错误。

格式：ServerName:tool_name

```bash
使用 BigQuery:bigquery_schema 工具检索表架构。
使用 GitHub:create_issue 工具创建问题。
```

- BigQuery 和 GitHub 是 MCP 服务器名称
- bigquery_schema 和 create_issue 是这些服务器内的工具名称

没有服务器前缀，Claude 可能无法定位工具，特别是当有多个 MCP 服务器可用时。

#### 避免假设工具已安装

不要假设包可用：

```bash
**不良示例：假设安装**：
"使用 pdf 库处理文件。"

**良好示例：明确依赖项**：
"安装所需的包：`pip install pypdf`

然后使用它：
```python
from pypdf import PdfReader
reader = PdfReader("file.pdf")
```"
```

### 有效 Skills 检查清单

在分享 Skill 之前，验证：

#### 核心质量

- 描述具体并包含关键术语
- 描述包括 Skill 的功能和使用时机
- SKILL.md 主体在 500 行以下
- 额外的详细信息在单独的文件中（如果需要）
- 没有时间敏感信息（或在”旧模式”部分）
- 整个文档术语一致
- 示例具体，不抽象
- 文件引用是一层深度
- 适当使用渐进式信息披露
- 工作流程有清晰的步骤

#### 代码和脚本

- 脚本解决问题而不是推给 Claude
- 错误处理明确且有帮助
- 没有”魔法常量”（所有值都有理由）
- 指令中列出所需的包并验证可用
- 脚本有清晰的文档
- 没有 Windows 风格的路径（全部使用正斜杠）
- 关键操作有验证/验证步骤
- 质量关键任务包含反馈循环

#### 测试

- 至少创建了三个评估
- 在 Haiku、Sonnet 和 Opus 上测试
- 在真实使用场景中测试
- 纳入团队反馈（如适用）

### 下一步

现在你已经掌握了编写有效 Skills 的最佳实践，可以开始在 Claude Code 中创建和使用自己的 Skills。通过遵循这些原则，你的 Skills 将更加简洁、易于发现和有效使用。

记住：好的 Skills 是简洁的、结构良好的，并通过实际使用进行测试。持续迭代，观察 Claude 如何使用你的 Skills，并根据真实反馈进行改进。
