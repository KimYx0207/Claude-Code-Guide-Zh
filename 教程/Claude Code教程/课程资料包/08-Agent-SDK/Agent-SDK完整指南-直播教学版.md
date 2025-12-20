# Claude Agent SDK 完整指南：把AI编程能力装进你的程序里

> **课程信息**
>
> - **预计学时**：6-8小时
> - **难度等级**：⭐⭐⭐ 中级进阶
> - **更新日期**：2025年12月
> - **适用版本**：Claude Agent SDK v0.1.0+
> - **信息来源**：[官方文档](https://docs.anthropic.com/en/docs/claude-code/sdk)、[GitHub Python SDK](https://github.com/anthropics/claude-agent-sdk-python)、[GitHub TypeScript SDK](https://github.com/anthropics/claude-agent-sdk-typescript)

> **版本说明**：Claude Agent SDK（原名Claude Code SDK）是2025年Anthropic官方发布的开发工具包。本教程基于最新官方文档编写，如有更新请以官方为准。

---

## 本课学习目标

完成本课学习后，你将能够：

1. **理解SDK的核心价值**：掌握Agent SDK与Claude Code CLI的关系和定位
2. **5分钟快速上手**：完成Hello World Agent的创建和运行
3. **掌握核心概念**：深入理解Tools、Agent Loop、Context Management
4. **独立完成3个实战项目**：从one-shot到multi-tool再到streaming模式
5. **自定义工具开发**：创建SDK内置MCP服务器，扩展Agent能力
6. **故障排查技能**：独立解决90%的常见问题

---

## 学习路径导航（先看这里！）

> 这是一篇长教程，不用全看！根据你的目标选择路径。

### 路径A：快速体验（60分钟）

**适合人群**：急着体验Agent SDK，想快速跑个Demo

**只看这些章节**：

```
术语表（5分钟）
第一部分：SDK简介（10分钟）
第二部分：5分钟快速开始（20分钟）
实战项目1：Hello World Agent（25分钟）
```

**60分钟后你能达到**：成功运行第一个Agent，理解基本工作流程

---

### 路径B：系统学习（6-8小时）

**适合人群**：想深入掌握Agent SDK，准备在项目中使用

**学习顺序**：从头到尾所有章节

**建议分段学习**：
- 第1天（2小时）：第一~三部分（概念+安装+核心原理）
- 第2天（2小时）：第四部分（3个实战项目）
- 第3天（2小时）：第五~六部分（高级功能+故障排查）
- 第4天（1小时）：第七部分FAQ + 总复习

---

### 路径C：问题速查（5分钟）

**适合人群**：使用中遇到问题，需要快速解决

**直接跳到**：

```
第六部分：故障排查 - 按错误类型查找解决方案
第七部分：FAQ - 20个精选问题
```

---

### 路径D：专项学习（30-60分钟/主题）

**适合人群**：已经会基础，想深入某个功能

| 想学什么 | 看哪几节 | 预计时间 |
|----------|---------|---------|
| **自定义工具** | 第三部分3.3节 + 第四部分项目3 | 60分钟 |
| **Hooks钩子** | 第五部分5.2节 | 45分钟 |
| **子代理并行** | 第三部分3.4节 + 第四部分项目3 | 60分钟 |
| **MCP集成** | 第五部分5.1节 | 45分钟 |

---

## 术语表（小白必读）

在开始之前，先了解这些关键术语。**不理解术语会影响后续学习**！

| 术语 | 英文全称 | 通俗解释 |
|------|----------|----------|
| **SDK** | Software Development Kit | 软件开发工具包，就像一个"工具箱"，里面有各种你需要的零件和工具，让你能更方便地造东西 |
| **Agent** | - | 智能代理/自动机器人，能够自主完成任务的AI程序。就像一个会思考的机器人助手，你给它任务，它自己想办法完成 |
| **Agent Loop** | - | 代理循环，Agent工作的核心流程：接收任务→思考→使用工具→检查结果→继续或结束。就像一个"工作循环" |
| **Tool** | - | 工具，Agent可以调用的能力，比如读文件、写文件、执行命令等。就像机器人的"手"和"眼睛" |
| **Hook** | - | 钩子，在特定时机自动触发的回调函数。就像设置的"自动报警器"，特定事件发生时自动执行 |
| **MCP** | Model Context Protocol | 模型上下文协议，让Agent连接外部工具的标准协议。就像USB接口标准，让各种设备能统一接入 |
| **Stream/Streaming** | - | 流式传输，数据像流水一样一点点传过来，而不是等全部完成才一次性传输。就像看视频边加载边播放 |
| **Async/Await** | - | 异步编程语法，让程序不用傻等，可以同时处理多件事。就像你等外卖时还能看手机，不用傻站着 |
| **Iterator** | - | 迭代器，一种可以逐个获取数据的对象。就像自动发牌机，每次给你一张牌 |
| **Context** | - | 上下文，AI理解对话的背景信息。就像聊天记录，AI通过它知道你之前说了什么 |
| **Token** | - | 计费单位，AI处理文字的最小单元。约等于0.75个英文单词或1-2个汉字 |
| **Subagent** | - | 子代理，由主Agent创建的子任务执行者。就像主管派出去干活的员工 |

---

## 第一部分：Claude Agent SDK 简介

### 1.1 什么是 Claude Agent SDK

**用一句话说**：Claude Agent SDK是Anthropic官方提供的开发工具包，让你能够在自己的Python或TypeScript程序中使用Claude Code的全部能力。

**生活类比**：

想象Claude Code是一辆装配完整的汽车，你可以开着它到处跑。而Agent SDK就是这辆车的发动机、变速箱和底盘的组合包，让你能够打造属于自己的定制车型。

```
┌─────────────────────────────────────────────────┐
│                 你的应用程序                      │
│  ┌──────────────────────────────────────────┐   │
│  │           Claude Agent SDK               │   │
│  │  ┌────────────────────────────────────┐  │   │
│  │  │       Claude Code核心引擎           │  │   │
│  │  │  - 文件读写能力                      │  │   │
│  │  │  - Bash命令执行                      │  │   │
│  │  │  - 代码分析与生成                    │  │   │
│  │  │  - 网络搜索                          │  │   │
│  │  │  - MCP工具调用                       │  │   │
│  │  └────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### 1.2 SDK vs CLI：什么时候用哪个？

Claude Code有两种使用方式，选择取决于你的场景：

```
                    Claude代理核心能力
                          │
          ┌───────────────┴───────────────┐
          │                               │
    Claude Code CLI                 Claude Agent SDK
    （命令行工具）                    （编程接口）
          │                               │
    ┌─────┴─────┐                 ┌───────┴───────┐
    │           │                 │               │
  人工交互   Shell脚本          Python程序     TypeScript程序
```

**对比表**：

| 特性 | Claude Code CLI | Claude Agent SDK |
|------|-----------------|------------------|
| **使用方式** | 在终端里输入命令 | 在代码里调用函数 |
| **适合场景** | 日常开发、快速任务 | 自动化、批处理、集成到系统 |
| **交互方式** | 人工对话 | 程序控制 |
| **并发能力** | 单会话 | 多代理并行 |
| **定制程度** | 配置文件 | 完全可编程 |
| **学习曲线** | 低（会打字就行） | 中（需要编程基础） |

**什么时候用SDK？**

1. **自动化脚本**：每天自动审查代码、生成报告
2. **批量处理**：一次处理100个文件的重构
3. **系统集成**：把Claude嵌入你的CI/CD流程
4. **多Agent协作**：让多个Agent并行工作
5. **定制化工具**：构建特定领域的AI助手

**什么时候用CLI？**

1. **日常开发**：写代码、改bug、问问题
2. **快速任务**：临时需要AI帮忙的小事
3. **学习探索**：熟悉Claude的能力
4. **不想写代码**：就想简单聊聊

### 1.3 支持的编程语言

Agent SDK目前官方支持两种语言，选择你熟悉的即可：

**Python SDK**

```bash
# 安装命令
pip install claude-agent-sdk

# 特点
- Python 3.10+ 支持
- 异步迭代器（async for）
- 类型提示完善
- 适合：数据科学、AI/ML工作流、自动化脚本
```

**TypeScript/JavaScript SDK**

```bash
# 安装命令
npm install @anthropic-ai/claude-agent-sdk

# 特点
- Node.js 18+ 支持
- 原生异步生成器
- 完整类型定义
- 适合：Web应用、Node.js服务端、全栈开发
```

> **老金建议**：两种SDK功能完全相同，选你最熟悉的语言就好。本教程会同时展示两种语言的代码示例。

### 1.4 版本演进说明

Claude Agent SDK经历了从"Claude Code SDK"到"Agent SDK"的品牌升级：

| 版本阶段 | 包名 | 状态 |
|---------|------|------|
| 早期 | `@anthropic-ai/claude-code` / `claude-code-sdk` | 已弃用 |
| 当前 | `@anthropic-ai/claude-agent-sdk` / `claude-agent-sdk` | 推荐使用 |

**如果你之前用旧版SDK**，需要更新导入语句：

```python
# Python旧版（已弃用）
from claude_code_sdk import query, ClaudeCodeOptions

# Python新版（推荐）
from claude_agent_sdk import query, ClaudeAgentOptions
```

```typescript
// TypeScript旧版（已弃用）
import { query } from '@anthropic-ai/claude-code';

// TypeScript新版（推荐）
import { query } from '@anthropic-ai/claude-agent-sdk';
```

---

## 第二部分：5分钟快速开始

### 2.1 环境准备

**系统要求**：

| 要求项 | 最低版本 | 推荐版本 |
|--------|---------|---------|
| **Node.js**（TypeScript用） | 18.0.0 | 20.x LTS |
| **Python**（Python用） | 3.10 | 3.11+ |
| **操作系统** | Windows 10/macOS 12/Ubuntu 20.04 | 最新稳定版 |

**快速检查命令**：

```bash
# 检查Node.js版本
node --version
# 应显示 v18.0.0 或更高

# 检查Python版本
python --version
# 应显示 Python 3.10 或更高

# 检查npm版本
npm --version
# 应显示 8.0.0 或更高
```

### 2.2 安装SDK

**Python安装（推荐方式）**：

```bash
# 步骤1：创建虚拟环境（推荐）
python -m venv venv

# 步骤2：激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 步骤3：安装Agent SDK
pip install claude-agent-sdk
```

> **重要提示**：Python SDK会自动捆绑Claude Code CLI，无需单独安装！

**TypeScript安装**：

```bash
# 步骤1：创建项目目录
mkdir my-agent-project
cd my-agent-project

# 步骤2：初始化项目
npm init -y

# 步骤3：安装Agent SDK
npm install @anthropic-ai/claude-agent-sdk

# 步骤4：安装TypeScript开发依赖
npm install -D typescript @types/node ts-node
```

### 2.3 配置API密钥

Agent SDK需要Anthropic API密钥才能运行。

**方式一：环境变量（推荐）**

```bash
# Linux/macOS
export ANTHROPIC_API_KEY="sk-ant-api03-..."

# Windows PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-api03-..."

# Windows CMD
set ANTHROPIC_API_KEY=sk-ant-api03-...
```

**方式二：.env文件**

创建`.env`文件：

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

在代码中加载：

```python
# Python
from dotenv import load_dotenv
load_dotenv()
```

```typescript
// TypeScript
import 'dotenv/config';
```

### 2.4 Hello World Agent

现在让我们创建第一个Agent！

**Python版本** - 创建`hello_agent.py`：

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    print('启动Agent...')

    # 配置选项
    options = ClaudeAgentOptions(
        model='claude-sonnet-4'  # 使用Sonnet模型（性价比高）
    )

    # 执行查询，返回流式响应
    async for message in query(
        prompt='你好！请用一句话介绍你能做什么？',
        options=options
    ):
        # 处理助手回复
        if message.type == 'assistant':
            for block in message.content:
                if block.type == 'text':
                    print(block.text, end='', flush=True)

    print('\n\nAgent任务完成！')

if __name__ == '__main__':
    asyncio.run(main())
```

**运行**：

```bash
python hello_agent.py
```

**预期输出**：

```
启动Agent...
我是Claude，一个AI助手，能帮你编写代码、分析文件、执行命令和解答各种技术问题。

Agent任务完成！
```

---

**TypeScript版本** - 创建`src/hello-agent.ts`：

```typescript
import { query, type Query } from '@anthropic-ai/claude-agent-sdk';

async function main() {
  console.log('启动Agent...');

  // 创建查询
  const stream: Query = query({
    prompt: '你好！请用一句话介绍你能做什么？',
    options: {
      model: 'claude-sonnet-4'  // 使用Sonnet模型
    }
  });

  // 处理流式响应
  for await (const message of stream) {
    if (message.type === 'assistant') {
      for (const block of message.message.content) {
        if (block.type === 'text') {
          process.stdout.write(block.text);
        }
      }
    }
  }

  console.log('\n\nAgent任务完成！');
}

main().catch(console.error);
```

**运行**：

```bash
npx ts-node src/hello-agent.ts
```

### 2.5 验证安装成功

如果你看到了Agent的回复，恭喜！安装成功！

**常见问题快速排查**：

| 错误信息 | 原因 | 解决方案 |
|---------|------|---------|
| `ModuleNotFoundError: No module named 'claude_agent_sdk'` | SDK没装好 | 重新运行 `pip install claude-agent-sdk` |
| `Cannot find module '@anthropic-ai/claude-agent-sdk'` | npm包没装好 | 重新运行 `npm install` |
| `Authentication failed` | API Key没配置 | 检查环境变量是否设置正确 |
| `Connection timeout` | 网络问题 | 检查网络连接，国内可能需要代理 |

---

## 第三部分：核心概念深度解析

### 3.1 query函数：SDK的核心入口

`query`函数是Agent SDK的心脏，理解它就理解了SDK的一半。

**函数签名**：

```python
# Python
async def query(
    prompt: str,
    options: Optional[ClaudeAgentOptions] = None
) -> AsyncIterator[SDKMessage]:
```

```typescript
// TypeScript
function query(params: {
  prompt: string | AsyncIterable<SDKUserMessage>;
  options?: QueryOptions;
}): Query;
```

**核心参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `prompt` | string | 是 | 发送给Agent的提示词/任务描述 |
| `options` | Options对象 | 否 | Agent的配置选项 |

**Options配置项详解**：

```python
# Python完整配置示例
from claude_agent_sdk import ClaudeAgentOptions

options = ClaudeAgentOptions(
    # 模型选择
    model='claude-sonnet-4',  # 可选：claude-sonnet-4, claude-opus-4, claude-haiku-3

    # 系统提示词（定义Agent的角色和行为）
    system_prompt='你是一个Python专家，专注于代码质量和最佳实践。',

    # 工作目录（Agent操作文件的根目录）
    cwd='/path/to/your/project',

    # 最大对话轮次（防止无限循环）
    max_turns=10,

    # 权限模式
    permission_mode='default',  # 可选：default, acceptEdits, bypassPermissions

    # 允许使用的工具
    allowed_tools=['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep'],

    # MCP服务器配置（扩展工具）
    mcp_servers={
        'my_server': {
            'command': 'python',
            'args': ['-m', 'my_mcp_server']
        }
    }
)
```

**返回值：流式消息**

`query`返回一个异步迭代器，产生多种类型的消息：

```python
# 消息类型
SDKMessage = Union[
    AssistantMessage,   # AI的回复
    UserMessage,        # 用户的输入
    ToolUseBlock,       # 工具调用请求
    ToolResultBlock,    # 工具执行结果
    ResultMessage,      # 最终结果
]
```

**处理消息的标准模式**：

```python
async for message in query(prompt="你的任务", options=options):
    if isinstance(message, AssistantMessage):
        # 处理AI回复
        for block in message.content:
            if isinstance(block, TextBlock):
                print(block.text)
            elif isinstance(block, ToolUseBlock):
                print(f"调用工具: {block.name}")

    elif isinstance(message, ResultMessage):
        # 任务完成
        print(f"最终结果: {message.result}")
```

### 3.2 Agent Loop：代理的工作循环

Agent不是简单地"问一句答一句"，而是有一个完整的工作循环。

**Agent Loop工作流程**：

```
┌──────────────────────────────────────────────────────┐
│                    Agent Loop                         │
│                                                       │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐         │
│   │ 接收任务 │ → │  思考   │ → │ 决定行动 │         │
│   └─────────┘    └─────────┘    └─────────┘         │
│                                      │               │
│                                      ▼               │
│                              ┌───────────────┐       │
│                              │ 需要使用工具？ │       │
│                              └───────────────┘       │
│                                 │       │            │
│                              是 │       │ 否         │
│                                 ▼       ▼            │
│   ┌─────────┐    ┌─────────┐   │   ┌─────────┐     │
│   │ 检查结果 │ ← │ 执行工具 │←──┘   │ 直接回复 │     │
│   └─────────┘    └─────────┘       └─────────┘     │
│        │                                │            │
│        ▼                                │            │
│  ┌───────────┐                          │            │
│  │ 任务完成？ │                          │            │
│  └───────────┘                          │            │
│     │      │                            │            │
│  否 │      │ 是                         │            │
│     │      ▼                            ▼            │
│     │  ┌─────────┐              ┌─────────┐         │
│     │  │ 返回结果 │              │ 返回结果 │         │
│     │  └─────────┘              └─────────┘         │
│     │                                               │
│     └──────────────→ 继续循环 ──────────────────────→│
│                                                       │
└──────────────────────────────────────────────────────┘
```

**实际例子**：让Agent"创建一个Python计算器"

```
轮次1：
  - Agent思考：需要创建文件
  - 使用工具：Write写入calculator.py
  - 结果：文件创建成功
  - 判断：任务未完成，需要测试

轮次2：
  - Agent思考：需要验证代码是否正确
  - 使用工具：Bash执行python calculator.py
  - 结果：运行成功
  - 判断：任务完成

轮次3：
  - Agent回复：已成功创建计算器，代码如下...
```

**控制Agent Loop的参数**：

```python
options = ClaudeAgentOptions(
    max_turns=10,  # 最多10轮，防止无限循环
    # 如果任务简单，可以设小一点节省token
)
```

### 3.3 Tools：Agent的能力来源

Tools（工具）是Agent能够"做事"的关键。没有工具，Agent只能"说话"不能"干活"。

**内置工具清单**：

| 工具名 | 功能 | 使用场景 |
|--------|------|---------|
| **Read** | 读取文件内容 | 分析代码、读取配置 |
| **Write** | 写入文件内容 | 创建新文件 |
| **Edit** | 编辑文件 | 修改现有代码 |
| **Bash** | 执行命令 | 运行脚本、安装依赖 |
| **Glob** | 文件模式匹配 | 查找特定类型的文件 |
| **Grep** | 搜索文件内容 | 在代码中查找关键词 |
| **Task** | 创建子代理 | 并行处理复杂任务 |
| **WebSearch** | 网络搜索 | 查找最新信息 |

**限制工具权限**：

```python
# 只允许读取和搜索，禁止修改
options = ClaudeAgentOptions(
    allowed_tools=['Read', 'Glob', 'Grep'],  # 只读权限
)

# 允许所有工具（默认）
options = ClaudeAgentOptions(
    allowed_tools=None,  # 或者不设置这个参数
)
```

**自定义工具（SDK MCP Server）**：

这是Agent SDK的强大功能之一！你可以创建自己的工具：

```python
from claude_agent_sdk import tool, create_sdk_mcp_server, ClaudeAgentOptions, ClaudeSDKClient

# 使用@tool装饰器定义工具
@tool("greet", "向用户问好", {"name": str})
async def greet_user(args):
    name = args.get('name', '朋友')
    return {
        "content": [
            {"type": "text", "text": f"你好，{name}！很高兴认识你！"}
        ]
    }

@tool("calculate", "执行数学计算", {"expression": str})
async def calculate(args):
    expression = args.get('expression', '0')
    try:
        result = eval(expression)  # 注意：生产环境要做安全检查！
        return {"content": [{"type": "text", "text": f"计算结果：{result}"}]}
    except Exception as e:
        return {"content": [{"type": "text", "text": f"计算错误：{str(e)}"}]}

# 创建SDK MCP服务器
my_tools = create_sdk_mcp_server(
    name="my-tools",
    version="1.0.0",
    tools=[greet_user, calculate]
)

# 在Agent中使用
options = ClaudeAgentOptions(
    mcp_servers={"tools": my_tools},
    allowed_tools=["mcp__tools__greet", "mcp__tools__calculate"]
)
```

### 3.4 Subagents：子代理并行处理

当任务太复杂或太大时，单个Agent可能会遇到上下文窗口限制。Subagents（子代理）解决了这个问题。

**类比理解**：

```
传统方式（一个人干所有活）：
┌────────────────────────────────────────────┐
│ 单个Agent顺序处理                           │
│                                            │
│  处理api/* → 处理models/* → 处理views/*    │
│      2小时       2小时         2小时        │
│                                            │
│  总耗时：6小时                              │
└────────────────────────────────────────────┘

Subagents方式（主管+多员工）：
┌────────────────────────────────────────────┐
│ 主Agent分配任务，子Agent并行执行             │
│                                            │
│  子Agent1: api/*     ──┐                   │
│  子Agent2: models/*  ──┼──→ 汇总结果        │
│  子Agent3: views/*   ──┘                   │
│      各2小时（同时进行）                     │
│                                            │
│  总耗时：约2.5小时                          │
└────────────────────────────────────────────┘
```

**核心优势**：

| 优势 | 说明 |
|------|------|
| **独立上下文** | 每个子代理有独立的200K上下文窗口 |
| **并行执行** | 最多10个子代理同时运行 |
| **专业化分工** | 每个子代理可以有独立的系统提示词 |
| **失败隔离** | 单个子代理失败不影响其他子代理 |

**使用Subagents的方式**：

```python
# 允许Task工具，Agent会自动创建子代理
options = ClaudeAgentOptions(
    allowed_tools=['Task', 'TaskOutput', 'Read', 'Write', 'Edit'],
    max_turns=50,
    system_prompt="""你是一个项目重构专家。
    当遇到大型任务时，请使用Task工具创建子代理来并行处理。
    每个子代理应该专注于一个独立的模块或目录。"""
)

prompt = """请重构以下目录的代码：
1. src/api/ - 将CommonJS改为ES Module
2. src/models/ - 添加TypeScript类型
3. src/views/ - 优化组件结构

请使用子代理并行处理这三个目录。"""

async for message in query(prompt=prompt, options=options):
    # 处理消息...
```

---

## 第四部分：实战项目

### 项目1：代码分析Agent（One-shot模式）

**目标**：创建一个能分析代码文件并给出改进建议的Agent

**难度**：⭐ 入门

**Python实现** - `code_analyzer.py`：

```python
"""
代码分析Agent - 分析指定文件的代码质量
"""
import asyncio
import sys
from pathlib import Path
from claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, TextBlock

async def analyze_code(file_path: str) -> None:
    """分析指定文件的代码质量"""

    # 检查文件是否存在
    path = Path(file_path)
    if not path.exists():
        print(f"错误：文件 {file_path} 不存在")
        return

    print(f"分析文件: {path.absolute()}")
    print("=" * 50)

    # 配置Agent
    options = ClaudeAgentOptions(
        model='claude-sonnet-4',
        cwd=str(Path.cwd()),
        allowed_tools=['Read', 'Glob', 'Grep'],  # 只给读取权限
        max_turns=5,
        system_prompt="""你是一位资深代码审查专家。
        请分析代码并提供：
        1. 代码概述（功能和结构）
        2. 潜在问题（bug风险、安全隐患）
        3. 改进建议（可读性、性能、最佳实践）

        请使用中文回复，格式清晰。"""
    )

    prompt = f"""请分析以下文件的代码质量：{path.absolute()}

    使用Read工具读取文件内容，然后给出详细分析。"""

    # 执行分析
    async for message in query(prompt=prompt, options=options):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text, end='', flush=True)

    print("\n" + "=" * 50)
    print("分析完成！")

def main():
    # 从命令行参数获取文件路径
    if len(sys.argv) < 2:
        print("用法: python code_analyzer.py <文件路径>")
        print("示例: python code_analyzer.py ./my_code.py")
        return

    file_path = sys.argv[1]
    asyncio.run(analyze_code(file_path))

if __name__ == '__main__':
    main()
```

**使用方法**：

```bash
# 分析Python文件
python code_analyzer.py ./my_script.py

# 分析JavaScript文件
python code_analyzer.py ./app.js
```

---

### 项目2：多工具Agent（Multi-tool模式）

**目标**：创建一个能读写文件、执行命令的全能Agent

**难度**：⭐⭐ 进阶

**Python实现** - `multi_tool_agent.py`：

```python
"""
多工具Agent - 可以读写文件、执行命令的全能助手
"""
import asyncio
from pathlib import Path
from claude_agent_sdk import (
    query,
    ClaudeAgentOptions,
    AssistantMessage,
    TextBlock,
    ToolUseBlock,
    ToolResultBlock
)

async def run_multi_tool_agent(task: str) -> None:
    """运行多工具Agent执行任务"""

    print(f"任务: {task}")
    print("=" * 60)

    options = ClaudeAgentOptions(
        model='claude-sonnet-4',
        cwd=str(Path.cwd()),
        allowed_tools=['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep'],
        max_turns=15,
        permission_mode='acceptEdits',  # 自动接受文件编辑
        system_prompt="""你是一个全能开发助手，可以：
        - 读取和分析文件
        - 创建和修改文件
        - 执行命令行命令
        - 搜索文件内容

        执行任务时：
        1. 先分析需要做什么
        2. 分步骤执行
        3. 每步都验证结果
        4. 最后总结完成情况

        使用中文回复。"""
    )

    # 执行任务
    async for message in query(prompt=task, options=options):
        if isinstance(message, AssistantMessage):
            for block in message.content:
                if isinstance(block, TextBlock):
                    print(block.text, end='', flush=True)
                elif isinstance(block, ToolUseBlock):
                    print(f"\n[使用工具: {block.name}]")

        elif isinstance(message, ToolResultBlock):
            print(f"[工具执行完成]\n")

    print("\n" + "=" * 60)
    print("任务执行完成！")

async def main():
    # 示例任务列表
    tasks = [
        "创建一个名为hello.py的文件，内容是打印'Hello, Agent SDK!'，然后运行它",
        "查找当前目录下所有的.py文件，列出它们的名称",
        "创建一个简单的README.md文件，描述这是一个Agent SDK演示项目",
    ]

    print("可用任务:")
    for i, task in enumerate(tasks, 1):
        print(f"  {i}. {task}")
    print()

    # 选择任务
    choice = input("输入任务编号（1-3）或自定义任务: ").strip()

    if choice in ['1', '2', '3']:
        task = tasks[int(choice) - 1]
    else:
        task = choice

    await run_multi_tool_agent(task)

if __name__ == '__main__':
    asyncio.run(main())
```

**运行示例**：

```bash
python multi_tool_agent.py

# 输出：
# 可用任务:
#   1. 创建一个名为hello.py的文件...
#   2. 查找当前目录下所有的.py文件...
#   3. 创建一个简单的README.md文件...
#
# 输入任务编号（1-3）或自定义任务: 1
```

---

### 项目3：流式交互Agent（Streaming + 自定义工具）

**目标**：创建一个带有自定义工具的交互式Agent

**难度**：⭐⭐⭐ 高级

**Python实现** - `interactive_agent.py`：

```python
"""
交互式Agent - 带有自定义工具的流式对话Agent
"""
import asyncio
from datetime import datetime
from claude_agent_sdk import (
    tool,
    create_sdk_mcp_server,
    ClaudeAgentOptions,
    ClaudeSDKClient,
    AssistantMessage,
    TextBlock,
    ToolUseBlock
)

# ============ 自定义工具定义 ============

@tool("get_time", "获取当前时间", {})
async def get_current_time(args):
    """返回当前时间"""
    now = datetime.now()
    return {
        "content": [{
            "type": "text",
            "text": f"当前时间：{now.strftime('%Y-%m-%d %H:%M:%S')}"
        }]
    }

@tool("calculate", "执行数学计算", {
    "expression": {"type": "string", "description": "数学表达式，如 2+2, 10*5"}
})
async def calculate(args):
    """执行数学计算"""
    expression = args.get('expression', '0')
    try:
        # 安全的数学计算（只允许基本运算）
        allowed_chars = set('0123456789+-*/().% ')
        if not all(c in allowed_chars for c in expression):
            return {"content": [{"type": "text", "text": "错误：表达式包含不允许的字符"}]}

        result = eval(expression)
        return {"content": [{"type": "text", "text": f"{expression} = {result}"}]}
    except Exception as e:
        return {"content": [{"type": "text", "text": f"计算错误：{str(e)}"}]}

@tool("todo_add", "添加待办事项", {
    "item": {"type": "string", "description": "待办事项内容"}
})
async def add_todo(args):
    """添加待办事项"""
    item = args.get('item', '')
    if not item:
        return {"content": [{"type": "text", "text": "错误：待办事项不能为空"}]}

    # 这里可以连接数据库，简化起见用文件存储
    with open('todos.txt', 'a', encoding='utf-8') as f:
        f.write(f"[ ] {item}\n")

    return {"content": [{"type": "text", "text": f"已添加待办事项：{item}"}]}

@tool("todo_list", "列出所有待办事项", {})
async def list_todos(args):
    """列出待办事项"""
    try:
        with open('todos.txt', 'r', encoding='utf-8') as f:
            todos = f.read().strip()

        if not todos:
            return {"content": [{"type": "text", "text": "待办事项列表为空"}]}

        return {"content": [{"type": "text", "text": f"待办事项列表：\n{todos}"}]}
    except FileNotFoundError:
        return {"content": [{"type": "text", "text": "待办事项列表为空"}]}

# ============ Agent配置 ============

# 创建自定义工具服务器
custom_tools = create_sdk_mcp_server(
    name="custom-tools",
    version="1.0.0",
    tools=[get_current_time, calculate, add_todo, list_todos]
)

# Agent配置
def get_options():
    return ClaudeAgentOptions(
        model='claude-sonnet-4',
        mcp_servers={"custom": custom_tools},
        allowed_tools=[
            "Read", "Write", "Bash",
            "mcp__custom__get_time",
            "mcp__custom__calculate",
            "mcp__custom__todo_add",
            "mcp__custom__todo_list"
        ],
        permission_mode='acceptEdits',
        system_prompt="""你是一个智能助手，可以使用以下工具：

1. **get_time**: 获取当前时间
2. **calculate**: 执行数学计算
3. **todo_add**: 添加待办事项
4. **todo_list**: 列出所有待办事项
5. **Read/Write/Bash**: 文件操作和命令执行

请根据用户需求选择合适的工具。使用中文回复。
当用户说"退出"或"再见"时，友好地告别。"""
    )

# ============ 交互循环 ============

async def interactive_chat():
    """交互式对话循环"""
    print("=" * 60)
    print("欢迎使用交互式Agent！")
    print("你可以：")
    print("  - 问我现在几点了")
    print("  - 让我计算数学题（如：计算 123 * 456）")
    print("  - 添加待办事项（如：添加待办 写周报）")
    print("  - 查看待办事项列表")
    print("  - 让我读写文件或执行命令")
    print("输入 '退出' 或 '再见' 结束对话")
    print("=" * 60)
    print()

    async with ClaudeSDKClient(options=get_options()) as client:
        while True:
            # 获取用户输入
            try:
                user_input = input("你: ").strip()
            except EOFError:
                break

            if not user_input:
                continue

            # 检查退出
            if user_input.lower() in ['退出', '再见', 'exit', 'quit', 'bye']:
                print("\nAgent: 再见！祝你有愉快的一天！")
                break

            # 发送消息
            await client.query(user_input)

            # 处理响应
            print("Agent: ", end='', flush=True)
            async for message in client.receive_response():
                if isinstance(message, AssistantMessage):
                    for block in message.content:
                        if isinstance(block, TextBlock):
                            print(block.text, end='', flush=True)
                        elif isinstance(block, ToolUseBlock):
                            print(f"\n[调用工具: {block.name}]", end='', flush=True)

            print()  # 换行

async def main():
    await interactive_chat()

if __name__ == '__main__':
    asyncio.run(main())
```

**运行示例**：

```bash
python interactive_agent.py

# 交互示例：
# ============================================================
# 欢迎使用交互式Agent！
# ...
# ============================================================
#
# 你: 现在几点了？
# Agent: [调用工具: get_time]
# 当前时间是 2025-12-19 15:30:45
#
# 你: 计算 123 * 456
# Agent: [调用工具: calculate]
# 123 * 456 = 56088
#
# 你: 添加待办 写Agent SDK教程
# Agent: [调用工具: todo_add]
# 已添加待办事项：写Agent SDK教程
#
# 你: 退出
# Agent: 再见！祝你有愉快的一天！
```

---

## 第五部分：高级功能

### 5.1 MCP服务器集成

MCP（Model Context Protocol）让你可以连接外部工具和服务。

**外部MCP服务器配置**：

```python
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    mcp_servers={
        # 文件系统服务器
        "filesystem": {
            "command": "npx",
            "args": ["-y", "@anthropic/mcp-server-filesystem", "/allowed/path"]
        },

        # SQLite数据库服务器
        "database": {
            "command": "npx",
            "args": ["-y", "@anthropic/mcp-server-sqlite", "./data/app.db"]
        },

        # 自定义Python服务器
        "custom": {
            "command": "python",
            "args": ["-m", "my_mcp_server"],
            "env": {
                "API_KEY": "your-api-key"
            }
        }
    },
    allowed_tools=[
        "mcp__filesystem__read",
        "mcp__database__query",
        "mcp__custom__my_tool"
    ]
)
```

**SDK内置MCP服务器 vs 外部服务器**：

| 特性 | SDK内置服务器 | 外部服务器 |
|------|--------------|-----------|
| **运行方式** | 在你的Python进程内 | 独立子进程 |
| **性能** | 更快（无IPC开销） | 略慢（需要进程通信） |
| **部署** | 简单（单进程） | 需要管理多进程 |
| **调试** | 更容易 | 需要分别调试 |
| **适用场景** | 简单工具 | 复杂工具、现有MCP服务器 |

### 5.2 Hooks：在关键时刻自动执行

Hooks（钩子）让你可以在Agent执行的特定时机插入自定义逻辑。

**可用的Hook类型**：

| Hook类型 | 触发时机 | 用途 |
|----------|---------|------|
| **PreToolUse** | 工具执行前 | 验证、过滤危险命令 |
| **PostToolUse** | 工具执行后 | 记录日志、自动测试 |
| **Stop** | Agent停止时 | 清理、汇总报告 |

**Python Hooks示例**：

```python
from claude_agent_sdk import ClaudeAgentOptions, ClaudeSDKClient, HookMatcher

# 定义Hook函数
async def block_dangerous_commands(input_data, tool_use_id, context):
    """阻止危险的Bash命令"""
    tool_name = input_data.get("tool_name")
    tool_input = input_data.get("tool_input", {})

    # 只检查Bash命令
    if tool_name != "Bash":
        return {}

    command = tool_input.get("command", "")

    # 危险命令黑名单
    dangerous_patterns = ["rm -rf", "sudo rm", ":(){ :|:& };:", "dd if="]

    for pattern in dangerous_patterns:
        if pattern in command:
            return {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": f"危险命令被阻止：包含 '{pattern}'"
                }
            }

    return {}  # 允许执行

async def log_tool_results(input_data, tool_use_id, context):
    """记录工具执行结果"""
    tool_name = input_data.get("tool_name")
    print(f"[日志] 工具 {tool_name} 执行完成")
    return {}

# 配置Hooks
options = ClaudeAgentOptions(
    allowed_tools=["Bash", "Read", "Write"],
    hooks={
        "PreToolUse": [
            HookMatcher(matcher="Bash", hooks=[block_dangerous_commands]),
        ],
        "PostToolUse": [
            HookMatcher(matcher=".*", hooks=[log_tool_results]),
        ],
    }
)
```

### 5.3 权限控制

Agent SDK提供多种权限控制方式，确保安全。

**权限模式**：

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| `default` | 每次文件操作都需要确认 | 生产环境、敏感项目 |
| `acceptEdits` | 自动接受文件编辑 | 个人项目、自动化脚本 |
| `bypassPermissions` | 跳过所有权限检查 | 完全受控环境（谨慎使用） |

**工具白名单**：

```python
# 只读Agent - 只能读取和搜索
readonly_options = ClaudeAgentOptions(
    allowed_tools=['Read', 'Glob', 'Grep']
)

# 代码审查Agent - 只能读取和执行测试
review_options = ClaudeAgentOptions(
    allowed_tools=['Read', 'Glob', 'Grep', 'Bash'],
    system_prompt="你是代码审查专家。只能运行测试命令，不能修改任何文件。"
)

# 完全权限Agent - 可以做任何事
full_options = ClaudeAgentOptions(
    allowed_tools=['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep', 'Task'],
    permission_mode='acceptEdits'
)
```

### 5.4 沙箱模式

保护你的系统免受意外损害：

```python
from claude_agent_sdk import query, ClaudeAgentOptions

# 自定义沙箱控制
async def can_use_tool(tool: str, input: dict) -> bool:
    """自定义工具权限检查"""
    # 检查是否请求禁用沙箱
    if tool == "Bash" and input.get("dangerouslyDisableSandbox"):
        print(f"警告：请求在沙箱外执行命令：{input.get('command')}")
        # 返回False拒绝，True允许
        return False
    return True

options = ClaudeAgentOptions(
    sandbox={
        "enabled": True,  # 启用沙箱
        "allowUnsandboxedCommands": False  # 禁止请求沙箱外执行
    },
    permission_mode="default",
    can_use_tool=can_use_tool  # 自定义权限检查
)
```

---

## 第六部分：故障排查

### 6.1 常见错误及解决方案

#### 错误1：模块导入失败

```python
# 错误信息
ModuleNotFoundError: No module named 'claude_agent_sdk'
```

**原因**：SDK未安装或虚拟环境未激活

**解决方案**：

```bash
# 确认虚拟环境已激活
source venv/bin/activate  # Linux/macOS
# 或
venv\Scripts\activate  # Windows

# 重新安装
pip install claude-agent-sdk

# 验证安装
pip show claude-agent-sdk
```

---

#### 错误2：认证失败

```python
# 错误信息
AuthenticationError: Invalid API key
```

**原因**：API Key未配置或无效

**解决方案**：

```bash
# 检查环境变量
echo $ANTHROPIC_API_KEY  # Linux/macOS
echo %ANTHROPIC_API_KEY%  # Windows

# 重新设置
export ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"

# 或在代码中设置（不推荐）
import os
os.environ["ANTHROPIC_API_KEY"] = "your-key"
```

---

#### 错误3：连接超时

```python
# 错误信息
ConnectionTimeout: Request timed out
```

**原因**：网络问题或API服务繁忙

**解决方案**：

```bash
# 检查网络连接
ping api.anthropic.com

# 国内用户可能需要代理
export HTTP_PROXY="http://127.0.0.1:7890"
export HTTPS_PROXY="http://127.0.0.1:7890"
```

---

#### 错误4：工具权限被拒绝

```python
# 错误信息
PermissionDenied: Tool 'Write' is not in allowed_tools
```

**原因**：工具不在白名单中

**解决方案**：

```python
# 添加需要的工具到白名单
options = ClaudeAgentOptions(
    allowed_tools=['Read', 'Write', 'Edit']  # 添加Write
)
```

---

#### 错误5：CLI未找到

```python
# 错误信息
CLINotFoundError: Claude Code CLI not found
```

**原因**：捆绑的CLI未正确安装

**解决方案**：

```bash
# 方法1：重新安装SDK
pip uninstall claude-agent-sdk
pip install claude-agent-sdk

# 方法2：手动安装CLI
curl -fsSL https://claude.ai/install.sh | bash

# 方法3：指定CLI路径
options = ClaudeAgentOptions(
    cli_path="/path/to/claude"
)
```

### 6.2 调试技巧

**启用详细日志**：

```python
import logging

# 设置日志级别
logging.basicConfig(level=logging.DEBUG)

# 或者使用环境变量
# export CLAUDE_SDK_LOG_LEVEL=DEBUG
```

**打印消息详情**：

```python
async for message in query(prompt="...", options=options):
    print(f"消息类型: {type(message).__name__}")
    print(f"消息内容: {message}")
    print("-" * 40)
```

---

## 第七部分：FAQ 常见问题

### Q1: Agent SDK和直接调用Claude API有什么区别？

**答**：主要区别有三点：

1. **Agent SDK有Agent Loop**：可以自动多轮对话，使用工具完成复杂任务
2. **Agent SDK有内置工具**：文件操作、命令执行等能力开箱即用
3. **Agent SDK支持子代理**：可以并行处理大规模任务

如果你只需要简单问答，用Claude API即可。如果需要AI"干活"（操作文件、执行命令），用Agent SDK。

---

### Q2: 哪个模型性价比最高？

**答**：推荐模型选择：

| 场景 | 推荐模型 | 理由 |
|------|---------|------|
| 日常开发 | claude-sonnet-4 | 能力强、速度快、价格适中 |
| 复杂推理 | claude-opus-4 | 最强能力，但价格高 |
| 简单任务 | claude-haiku-3 | 最便宜，适合简单查询 |

```python
# 性价比之选
options = ClaudeAgentOptions(model='claude-sonnet-4')
```

---

### Q3: 如何控制Token消耗？

**答**：几个技巧：

1. **设置max_turns**：限制对话轮数
2. **精简system_prompt**：不要写太长的系统提示
3. **任务明确**：给出清晰具体的任务描述
4. **使用更小的模型**：简单任务用Haiku

```python
options = ClaudeAgentOptions(
    model='claude-haiku-3',  # 便宜模型
    max_turns=5,  # 限制轮数
    system_prompt="简洁回复。"  # 简短提示
)
```

---

### Q4: 子代理和主代理怎么通信？

**答**：通过Task和TaskOutput工具：

1. 主Agent用Task工具创建子代理，指定任务
2. 子代理执行任务并返回结果
3. 主Agent用TaskOutput工具获取结果

子代理完成后，结果会自动返回给主Agent。

---

### Q5: 可以同时运行多少个子代理？

**答**：最多10个并行。如果需要处理更多任务，会自动排队。

---

### Q6: 如何在生产环境使用？

**答**：几个建议：

1. **使用权限控制**：设置allowed_tools白名单
2. **启用沙箱**：防止危险命令
3. **添加Hooks**：记录日志、过滤危险操作
4. **设置超时**：防止任务卡住
5. **监控Token消耗**：控制成本

```python
# 生产环境配置示例
production_options = ClaudeAgentOptions(
    model='claude-sonnet-4',
    allowed_tools=['Read', 'Glob', 'Grep'],  # 最小权限
    permission_mode='default',  # 需要确认
    max_turns=10,
    sandbox={"enabled": True},
    hooks={
        "PreToolUse": [safety_hooks],
        "PostToolUse": [logging_hooks]
    }
)
```

---

### Q7: SDK支持流式输出吗？

**答**：是的！`query`函数返回的是AsyncIterator，天然支持流式：

```python
async for message in query(prompt="...", options=options):
    if isinstance(message, AssistantMessage):
        for block in message.content:
            if isinstance(block, TextBlock):
                print(block.text, end='', flush=True)  # 流式打印
```

---

### Q8: 如何处理长时间运行的任务？

**答**：

1. **使用后台运行的子代理**：Task工具支持`run_in_background`
2. **设置合理的超时**
3. **使用异步并行**

```python
prompt = """请使用子代理并行处理：
- 子代理1：分析src目录（run_in_background: true）
- 子代理2：分析tests目录（run_in_background: true）

启动后等待所有子代理完成再汇总。"""
```

---

### Q9: 自定义工具可以访问外部API吗？

**答**：可以！自定义工具就是普通的Python/TypeScript函数：

```python
import httpx

@tool("weather", "获取天气信息", {"city": str})
async def get_weather(args):
    city = args.get('city')
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.weather.com/{city}")
        data = response.json()

    return {"content": [{"type": "text", "text": f"{city}天气：{data}"}]}
```

---

### Q10: 如何调试Agent的决策过程？

**答**：打印所有消息类型：

```python
async for message in query(prompt="...", options=options):
    print(f"[{type(message).__name__}] ", end='')

    if isinstance(message, AssistantMessage):
        print("AI思考中...")
        for block in message.content:
            if isinstance(block, TextBlock):
                print(f"  文本: {block.text[:100]}...")
            elif isinstance(block, ToolUseBlock):
                print(f"  调用工具: {block.name}({block.input})")

    elif isinstance(message, ToolResultBlock):
        print(f"工具结果: {str(message.content)[:100]}...")
```

---

### Q11: SDK会自动重试失败的请求吗？

**答**：SDK有基本的重试机制，但你可以自己加强：

```python
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
async def query_with_retry(prompt, options):
    results = []
    async for message in query(prompt=prompt, options=options):
        results.append(message)
    return results
```

---

### Q12: 如何在Jupyter Notebook中使用？

**答**：需要处理事件循环：

```python
import nest_asyncio
nest_asyncio.apply()

# 然后正常使用
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def run():
    async for message in query(prompt="Hello", options=ClaudeAgentOptions()):
        print(message)

asyncio.run(run())
```

---

### Q13: 可以保存和恢复会话吗？

**答**：SDK本身不提供会话持久化，但你可以自己实现：

```python
import json

# 保存对话历史
conversation_history = []

async for message in query(prompt="...", options=options):
    conversation_history.append({
        "type": type(message).__name__,
        "content": str(message)
    })

# 保存到文件
with open("session.json", "w") as f:
    json.dump(conversation_history, f)
```

---

### Q14: TypeScript和Python SDK功能一样吗？

**答**：是的，功能完全相同。选择你熟悉的语言即可。

---

### Q15: 如何处理大文件？

**答**：Agent会自动分块处理。如果文件太大，考虑：

1. 只读取需要的部分
2. 使用Grep搜索而不是Read全文
3. 拆分任务给多个子代理

---

### Q16: SDK支持哪些AI模型？

**答**：支持Claude系列模型：

- claude-opus-4（最强）
- claude-sonnet-4（推荐）
- claude-haiku-3（最快最便宜）

通过`model`参数指定：

```python
options = ClaudeAgentOptions(model='claude-sonnet-4')
```

---

### Q17: 如何测试自定义工具？

**答**：单独测试工具函数：

```python
# 直接调用测试
result = await calculate({"expression": "2+2"})
print(result)  # 应该输出 {"content": [{"type": "text", "text": "2+2 = 4"}]}

# 然后在Agent中测试
async for message in query(
    prompt="请计算 2+2",
    options=ClaudeAgentOptions(
        mcp_servers={"tools": my_tools},
        allowed_tools=["mcp__tools__calculate"]
    )
):
    print(message)
```

---

### Q18: 如何处理API速率限制？

**答**：

1. 添加请求间隔
2. 使用指数退避重试
3. 监控速率限制错误

```python
import asyncio

async def rate_limited_query(prompts, delay=1.0):
    for prompt in prompts:
        async for message in query(prompt=prompt, options=options):
            yield message
        await asyncio.sleep(delay)  # 请求间隔
```

---

### Q19: 安全最佳实践有哪些？

**答**：

1. **最小权限原则**：只给需要的工具权限
2. **输入验证**：自定义工具要验证输入
3. **不信任用户输入**：Agent的prompt可能被注入
4. **启用沙箱**：Bash命令在沙箱中执行
5. **使用Hooks过滤**：阻止危险操作
6. **监控日志**：记录所有工具调用

---

### Q20: 有官方示例代码吗？

**答**：有！

- **Python示例**：https://github.com/anthropics/claude-agent-sdk-python/tree/main/examples
- **TypeScript示例**：https://github.com/anthropics/claude-agent-sdk-typescript/tree/main/examples

推荐从`quick_start.py`或`quick_start.ts`开始。

---

## 本课总结

### 核心知识点回顾

1. **Agent SDK定位**：把Claude Code的能力封装为可编程接口
2. **query函数**：核心API，返回流式消息
3. **Agent Loop**：接收→思考→使用工具→检查→继续/结束
4. **Tools**：Agent的能力来源，可以自定义扩展
5. **Subagents**：并行处理复杂任务
6. **Hooks**：在关键时刻自动执行自定义逻辑

### 最佳实践总结

| 场景 | 建议 |
|------|------|
| 模型选择 | 日常用Sonnet，复杂推理用Opus，简单任务用Haiku |
| 权限控制 | 生产环境用最小权限，开发可以放宽 |
| 子代理 | 大任务拆分并行，注意最多10个同时运行 |
| 自定义工具 | 优先用SDK内置MCP服务器，简单高效 |
| 错误处理 | 使用try/catch，添加重试机制 |

### 下一步学习

完成本课后，建议继续学习：

1. **MCP开发**：深入学习MCP协议，创建更复杂的工具
2. **Hooks高级应用**：实现自动测试、自动格式化等工作流
3. **企业集成**：将Agent SDK集成到CI/CD流程

---

**课程版本**：V1.0
**最后更新**：2025-12-19
**作者**：Claude Code教程团队

**参考资料**：
- [官方Python SDK文档](https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-python)
- [官方TypeScript SDK文档](https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-typescript)
- [GitHub Python SDK](https://github.com/anthropics/claude-agent-sdk-python)
- [GitHub TypeScript SDK](https://github.com/anthropics/claude-agent-sdk-typescript)
- [DataCamp教程](https://www.datacamp.com/tutorial/how-to-use-claude-agent-sdk)
- [KDnuggets入门指南](https://www.kdnuggets.com/getting-started-with-the-claude-agent-sdk)
