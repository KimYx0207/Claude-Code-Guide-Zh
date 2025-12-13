# Claude Agent SDK入门

**课程模块**：模块9 - Agent SDK篇
**课程编号**：第1课
**预计学时**：6小时
**难度等级**：⭐⭐⭐⭐ 进阶

---

## 学习目标

通过本课学习，你将能够：

1. 理解Claude Agent SDK与Claude Code CLI的关系和定位
2. 掌握TypeScript和Python两种语言的SDK安装与基础使用
3. 熟练运用Subagents子代理实现任务并行化
4. 理解并实践Orchestrator-Worker编排模式
5. 将MCP服务器集成到Agent SDK应用中

---

## 第一部分：SDK概述（2,500字）

### 1.1 什么是Claude Agent SDK

Claude Agent SDK（原名Claude Code SDK）是Anthropic官方提供的开发工具包，它将驱动Claude Code的核心代理能力开放给开发者。如果说Claude Code是一辆装配完整的汽车，那么Agent SDK就是发动机、变速箱和底盘的组合包，让你能够打造属于自己的定制车型。

#### 核心定位

Agent SDK的定位非常清晰：**将Claude Code的代理能力封装为可编程接口**。

```
┌─────────────────────────────────────────────────┐
│                 你的应用程序                      │
│  ┌──────────────────────────────────────────┐   │
│  │           Claude Agent SDK               │   │
│  │  ┌────────────────────────────────────┐  │   │
│  │  │       Claude Code核心引擎           │  │   │
│  │  │  • 文件操作能力                      │  │   │
│  │  │  • Bash命令执行                      │  │   │
│  │  │  • 代码分析与生成                    │  │   │
│  │  │  • 网络搜索                          │  │   │
│  │  │  • MCP工具调用                       │  │   │
│  │  └────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

使用Agent SDK，你可以构建：

| 应用类型 | 描述 | 典型场景 |
|---------|------|---------|
| **自动化脚本** | 批量处理代码任务 | CI/CD流程、代码审查自动化 |
| **智能工具** | 特定领域的AI助手 | 文档生成器、测试编写器 |
| **代理系统** | 多Agent协作平台 | 复杂项目重构、大规模迁移 |
| **集成服务** | 嵌入现有系统 | IDE插件、工作流引擎 |

### 1.2 与Claude Code CLI的关系

Claude Agent SDK和Claude Code CLI是同一套核心能力的两种使用方式：

```
                    Claude代理核心能力
                          │
          ┌───────────────┴───────────────┐
          │                               │
    Claude Code CLI                 Claude Agent SDK
    （交互式终端）                    （编程接口）
          │                               │
    ┌─────┴─────┐                 ┌───────┴───────┐
    │           │                 │               │
  人工交互   命令行脚本         TypeScript       Python
                                   SDK            SDK
```

**关键区别**：

| 特性 | Claude Code CLI | Claude Agent SDK |
|------|----------------|------------------|
| **使用方式** | 交互式终端或单命令 | 程序化调用 |
| **适合场景** | 日常开发、快速任务 | 自动化、集成、批处理 |
| **上下文管理** | 自动管理 | 开发者控制 |
| **并发能力** | 单会话 | 多代理并行 |
| **定制程度** | 配置文件 | 完全可编程 |

**重要概念**：Agent SDK内部实际上调用的是Claude Code CLI的能力。当你用pip安装Python SDK时，它会自动捆绑Claude Code CLI；TypeScript SDK则可以使用已安装的全局CLI或自动下载。

### 1.3 支持的编程语言

Claude Agent SDK目前官方支持两种语言：

#### TypeScript/JavaScript SDK

```bash
# 安装包名
@anthropic-ai/claude-agent-sdk

# 特点
- 原生异步生成器支持
- 完整类型定义
- 与Node.js生态无缝集成
- 推荐用于Web应用和服务端开发
```

#### Python SDK

```bash
# 安装包名
claude-agent-sdk

# 特点
- 异步迭代器支持
- 类型提示完善
- 与数据科学工具链集成
- 推荐用于AI/ML工作流和自动化脚本
```

### 1.4 适用场景

#### 场景一：CI/CD集成

在持续集成流程中，Agent SDK可以自动化代码审查和修复：

```
GitHub Action触发
       │
       ▼
┌──────────────┐
│ Agent SDK    │
│ 代码审查代理  │
└──────────────┘
       │
       ├──▶ 检查代码风格
       ├──▶ 发现潜在Bug
       ├──▶ 生成修复建议
       └──▶ 自动创建PR
```

#### 场景二：大规模代码重构

当需要重构数百个文件时，单个代理会遇到上下文限制。Agent SDK支持：

```
主代理（Orchestrator）
       │
       ├──▶ 子代理1：处理 src/api/*
       ├──▶ 子代理2：处理 src/models/*
       ├──▶ 子代理3：处理 src/views/*
       └──▶ 子代理4：处理 tests/*

每个子代理拥有独立200K上下文窗口
```

#### 场景三：定制化AI工具

构建特定领域的智能工具：

```python
# 示例：文档生成Agent
options = ClaudeAgentOptions(
    system_prompt="""你是一个技术文档专家。
    分析代码结构，生成API文档。
    使用JSDoc/docstring标准格式。""",
    allowed_tools=["Read", "Glob", "Grep"]
)
```

#### 场景四：多Agent协作系统

复杂任务分解为多个专业Agent协作：

```
┌─────────────┐
│ 规划Agent   │──────┐
└─────────────┘      │
                     ▼
            ┌─────────────────┐
            │   任务队列       │
            └─────────────────┘
              │     │     │
              ▼     ▼     ▼
         ┌───┐ ┌───┐ ┌───┐
         │A1 │ │A2 │ │A3 │  执行Agent
         └───┘ └───┘ └───┘
              │     │     │
              ▼     ▼     ▼
            ┌─────────────────┐
            │   结果聚合       │
            └─────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ 审查Agent        │
            └─────────────────┘
```

### 1.5 SDK版本演进

Claude Agent SDK经历了从Claude Code SDK到Agent SDK的品牌升级：

| 版本阶段 | 包名 | 状态 |
|---------|------|------|
| 早期 | `@anthropic-ai/claude-code` | 已弃用 |
| 当前 | `@anthropic-ai/claude-agent-sdk` | 推荐使用 |

**迁移说明**：

如果你之前使用旧版SDK，需要更新导入语句：

```typescript
// 旧版（已弃用）
import { query } from '@anthropic-ai/claude-code';

// 新版（推荐）
import { query } from '@anthropic-ai/claude-agent-sdk';
```

```python
# 旧版（已弃用）
from claude_code import query, ClaudeCodeOptions

# 新版（推荐）
from claude_agent_sdk import query, ClaudeAgentOptions
```

---

## 第二部分：快速开始（3,000字）

### 2.1 环境准备

#### 系统要求

| 要求项 | 最低版本 | 推荐版本 |
|-------|---------|---------|
| **Node.js** | 18.0.0 | 20.x LTS |
| **Python** | 3.10 | 3.11+ |
| **操作系统** | Windows 10/macOS 12/Ubuntu 20.04 | 最新稳定版 |

#### 前置检查

```bash
# 检查Node.js版本
node --version
# 输出应为 v18.0.0 或更高

# 检查Python版本
python --version
# 输出应为 Python 3.10 或更高

# 检查npm版本
npm --version
# 输出应为 8.0.0 或更高
```

### 2.2 TypeScript SDK安装

#### 方式一：npm安装（推荐）

```bash
# 创建新项目
mkdir my-agent-project
cd my-agent-project
npm init -y

# 安装Agent SDK
npm install @anthropic-ai/claude-agent-sdk

# 安装TypeScript开发依赖
npm install -D typescript @types/node ts-node
```

#### 方式二：yarn安装

```bash
yarn add @anthropic-ai/claude-agent-sdk
yarn add -D typescript @types/node ts-node
```

#### TypeScript配置

创建`tsconfig.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "dist",
    "declaration": true
  },
  "include": ["src/**/*"]
}
```

### 2.3 Python SDK安装

#### 方式一：pip安装（推荐）

```bash
# 创建虚拟环境
python -m venv venv
source venv/bin/activate  # Linux/macOS
# 或 venv\Scripts\activate  # Windows

# 安装Agent SDK
pip install claude-agent-sdk
```

**重要**：Python SDK会自动捆绑Claude Code CLI，无需单独安装。

#### 方式二：使用requirements.txt

```txt
claude-agent-sdk>=0.1.0
```

```bash
pip install -r requirements.txt
```

### 2.4 API密钥配置

Agent SDK需要Anthropic API密钥才能运行。

#### 方式一：环境变量（推荐）

```bash
# Linux/macOS
export ANTHROPIC_API_KEY="sk-ant-api03-..."

# Windows PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-api03-..."

# Windows CMD
set ANTHROPIC_API_KEY=sk-ant-api03-...
```

#### 方式二：.env文件

创建`.env`文件：

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

在代码中加载：

```typescript
// TypeScript
import 'dotenv/config';
```

```python
# Python
from dotenv import load_dotenv
load_dotenv()
```

### 2.5 第一个TypeScript示例

创建`src/hello-agent.ts`：

```typescript
import { query, type Query } from '@anthropic-ai/claude-agent-sdk';

async function main() {
  console.log('启动Agent...');

  // 创建查询
  const stream: Query = query({
    prompt: '你好，请介绍一下你能做什么？',
    options: {
      model: 'claude-sonnet-4'  // 指定模型
    }
  });

  // 处理流式响应
  for await (const message of stream) {
    if (message.type === 'assistant') {
      // 处理助手消息
      for (const chunk of message.message.content) {
        if (chunk.type === 'text') {
          process.stdout.write(chunk.text);
        }
      }
    }
  }

  console.log('\n\nAgent任务完成');
}

main().catch(console.error);
```

运行：

```bash
npx ts-node src/hello-agent.ts
```

### 2.6 第一个Python示例

创建`hello_agent.py`：

```python
import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions

async def main():
    print('启动Agent...')

    # 配置选项
    options = ClaudeAgentOptions(
        model='claude-sonnet-4'
    )

    # 执行查询
    async for message in query(
        prompt='你好，请介绍一下你能做什么？',
        options=options
    ):
        if message.type == 'assistant':
            for chunk in message.message.content:
                if chunk.type == 'text':
                    print(chunk.text, end='', flush=True)

    print('\n\nAgent任务完成')

if __name__ == '__main__':
    asyncio.run(main())
```

运行：

```bash
python hello_agent.py
```

### 2.7 query函数详解

`query`是Agent SDK的核心函数，理解其参数和返回值至关重要。

#### 函数签名

**TypeScript**：

```typescript
function query(params: {
  prompt: string | AsyncIterable<SDKUserMessage>;
  options?: QueryOptions;
}): Query;
```

**Python**：

```python
async def query(
    prompt: str,
    options: Optional[ClaudeAgentOptions] = None
) -> AsyncIterator[SDKMessage]:
```

#### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `prompt` | string | 是 | 发送给Agent的提示词 |
| `options` | Options | 否 | Agent配置选项 |

#### Options配置项

```typescript
interface QueryOptions {
  // 模型选择
  model?: 'claude-sonnet-4' | 'claude-opus-4' | 'claude-haiku-3';

  // 系统提示词
  systemPrompt?: string;

  // 工作目录
  cwd?: string;

  // 最大对话轮次
  maxTurns?: number;

  // 权限模式
  permissionMode?: 'default' | 'acceptEdits' | 'bypassPermissions';

  // 允许的工具
  allowedTools?: string[];

  // MCP服务器配置
  mcpServers?: Record<string, MCPServerConfig>;

  // 设置来源
  settingSources?: ('user' | 'project' | 'local')[];
}
```

#### 返回值：流式消息

`query`返回一个异步迭代器，产生多种类型的消息：

```typescript
type SDKMessage =
  | { type: 'user'; message: UserMessage }
  | { type: 'assistant'; message: AssistantMessage }
  | { type: 'tool_use'; tool: ToolUse }
  | { type: 'tool_result'; result: ToolResult }
  | { type: 'error'; error: Error };
```

### 2.8 完整示例：代码分析Agent

以下是一个更实用的示例，创建一个代码分析Agent：

**TypeScript版本**（`src/code-analyzer.ts`）：

```typescript
import { query, type Query } from '@anthropic-ai/claude-agent-sdk';
import * as path from 'path';

interface AnalysisResult {
  summary: string;
  issues: string[];
  suggestions: string[];
}

async function analyzeCode(filePath: string): Promise<void> {
  const absolutePath = path.resolve(filePath);

  console.log(`分析文件: ${absolutePath}\n`);
  console.log('='.repeat(50));

  const stream: Query = query({
    prompt: `请分析以下文件的代码质量：${absolutePath}

    请提供：
    1. 代码概述（功能、结构）
    2. 发现的问题（如果有）
    3. 改进建议

    使用Read工具读取文件内容。`,
    options: {
      model: 'claude-sonnet-4',
      cwd: process.cwd(),
      allowedTools: ['Read', 'Glob', 'Grep'],
      maxTurns: 5
    }
  });

  let fullResponse = '';

  for await (const message of stream) {
    switch (message.type) {
      case 'assistant':
        for (const chunk of message.message.content) {
          if (chunk.type === 'text') {
            process.stdout.write(chunk.text);
            fullResponse += chunk.text;
          }
        }
        break;

      case 'tool_use':
        console.log(`\n[使用工具: ${message.tool.name}]`);
        break;

      case 'tool_result':
        console.log(`[工具执行完成]\n`);
        break;

      case 'error':
        console.error(`\n错误: ${message.error.message}`);
        break;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('分析完成');
}

// 使用示例
const targetFile = process.argv[2] || './src/hello-agent.ts';
analyzeCode(targetFile).catch(console.error);
```

**Python版本**（`code_analyzer.py`）：

```python
import asyncio
import sys
from pathlib import Path
from claude_agent_sdk import query, ClaudeAgentOptions

async def analyze_code(file_path: str) -> None:
    """分析指定文件的代码质量"""
    absolute_path = Path(file_path).resolve()

    print(f'分析文件: {absolute_path}\n')
    print('=' * 50)

    options = ClaudeAgentOptions(
        model='claude-sonnet-4',
        cwd=str(Path.cwd()),
        allowed_tools=['Read', 'Glob', 'Grep'],
        max_turns=5
    )

    prompt = f"""请分析以下文件的代码质量：{absolute_path}

    请提供：
    1. 代码概述（功能、结构）
    2. 发现的问题（如果有）
    3. 改进建议

    使用Read工具读取文件内容。"""

    async for message in query(prompt=prompt, options=options):
        if message.type == 'assistant':
            for chunk in message.message.content:
                if chunk.type == 'text':
                    print(chunk.text, end='', flush=True)

        elif message.type == 'tool_use':
            print(f'\n[使用工具: {message.tool.name}]')

        elif message.type == 'tool_result':
            print('[工具执行完成]\n')

        elif message.type == 'error':
            print(f'\n错误: {message.error}')

    print('\n' + '=' * 50)
    print('分析完成')

if __name__ == '__main__':
    target_file = sys.argv[1] if len(sys.argv) > 1 else './hello_agent.py'
    asyncio.run(analyze_code(target_file))
```

运行：

```bash
# TypeScript
npx ts-node src/code-analyzer.ts ./src/hello-agent.ts

# Python
python code_analyzer.py ./hello_agent.py
```

---

## 第三部分：Subagents子代理（3,500字）

### 3.1 什么是Subagents

Subagents（子代理）是Agent SDK的核心能力之一。当单个Agent面对复杂任务时，它可以生成多个专业化的子代理来并行处理不同部分的工作。

#### 类比理解

想象一个大型软件项目的重构任务：

```
传统单Agent方式（效率低）：
┌────────────────────────────────────────────┐
│ 单个Agent顺序处理                           │
│                                            │
│  处理api/* ──▶ 处理models/* ──▶ 处理views/* │
│      2小时         2小时          2小时      │
│                                            │
│  总耗时：6小时                              │
└────────────────────────────────────────────┘

Subagents方式（高效）：
┌────────────────────────────────────────────┐
│ 主Agent分配任务，子Agent并行执行             │
│                                            │
│  子Agent1: api/*     ──┐                   │
│  子Agent2: models/*  ──┼──▶ 结果汇总        │
│  子Agent3: views/*   ──┘                   │
│      各2小时（并行）                         │
│                                            │
│  总耗时：约2.5小时                          │
└────────────────────────────────────────────┘
```

#### 核心优势

| 优势 | 说明 |
|------|------|
| **独立上下文** | 每个子代理拥有独立的200K上下文窗口 |
| **并行执行** | 最多10个子代理同时运行 |
| **专业化分工** | 每个子代理可以有独立的系统提示词 |
| **失败隔离** | 单个子代理失败不影响其他子代理 |

### 3.2 Task工具使用

在Claude Code中，Task工具是创建子代理的主要方式。当你在Agent SDK中允许Task工具时，Claude会根据需要自动创建子代理。

#### 启用Task工具

```typescript
// TypeScript
const stream = query({
  prompt: '重构整个src目录的代码',
  options: {
    allowedTools: ['Task', 'Read', 'Write', 'Edit'],
    maxTurns: 20
  }
});
```

```python
# Python
options = ClaudeAgentOptions(
    allowed_tools=['Task', 'Read', 'Write', 'Edit'],
    max_turns=20
)
```

#### Task工具参数

当Claude使用Task工具时，它会发送以下参数：

```json
{
  "tool": "Task",
  "parameters": {
    "description": "重构api目录下的所有控制器",
    "prompt": "请检查src/api/目录下的所有.ts文件，将CommonJS模块转换为ES Module...",
    "subagent_type": "code_specialist",
    "run_in_background": false
  }
}
```

### 3.3 subagent_type选择

Claude可以指定不同类型的子代理来优化特定任务：

| 类型 | 适用场景 | 特点 |
|------|---------|------|
| `default` | 通用任务 | 完整工具集 |
| `code_specialist` | 代码修改 | 优化代码理解 |
| `researcher` | 信息收集 | 搜索和分析能力强 |
| `reviewer` | 代码审查 | 只读工具，专注分析 |

#### 示例：指定子代理类型

```typescript
// 主Agent的提示词中明确要求
const stream = query({
  prompt: `请使用以下子代理完成任务：

  1. 使用 researcher 类型子代理收集项目依赖信息
  2. 使用 code_specialist 类型子代理执行代码修改
  3. 使用 reviewer 类型子代理审查修改结果

  目标：升级所有依赖到最新版本`,
  options: {
    allowedTools: ['Task', 'Read', 'Write', 'Bash'],
    systemPrompt: '你是一个项目升级专家，善于协调多个专业子代理完成复杂任务。'
  }
});
```

### 3.4 run_in_background后台运行

子代理可以在后台运行，主Agent无需等待其完成即可继续执行其他任务。

#### 后台运行流程

```
主Agent
   │
   ├──▶ 启动子Agent1 (run_in_background: true)
   │        │
   │        └──▶ 后台执行中...
   │
   ├──▶ 启动子Agent2 (run_in_background: true)
   │        │
   │        └──▶ 后台执行中...
   │
   ├──▶ 主Agent继续执行其他任务
   │
   └──▶ 使用TaskOutput收集结果
            │
            ├──▶ 子Agent1结果
            └──▶ 子Agent2结果
```

#### 代码示例

```typescript
// 在提示词中指示使用后台运行
const stream = query({
  prompt: `请执行以下并行任务，使用后台模式：

  任务1：分析src/api/目录（后台运行）
  任务2：分析src/models/目录（后台运行）
  任务3：分析src/views/目录（后台运行）

  启动所有任务后，等待它们全部完成，然后汇总分析结果。`,
  options: {
    allowedTools: ['Task', 'TaskOutput', 'Read', 'Glob'],
    maxTurns: 30
  }
});
```

### 3.5 TaskOutput结果收集

当子代理完成任务后，主Agent使用TaskOutput工具收集结果。

#### TaskOutput工具

```json
{
  "tool": "TaskOutput",
  "parameters": {
    "task_id": "task_abc123"
  }
}
```

返回值包含：

- 子代理的完整输出
- 执行状态（成功/失败）
- 执行时间
- 任何错误信息

#### 完整示例：并行代码分析

```typescript
import { query, type Query } from '@anthropic-ai/claude-agent-sdk';

async function parallelCodeAnalysis(directories: string[]): Promise<void> {
  console.log('启动并行代码分析...\n');

  // 构建提示词，指导Agent使用并行子代理
  const directoryList = directories.map((d, i) =>
    `${i + 1}. 分析 ${d} 目录`
  ).join('\n');

  const prompt = `请并行分析以下目录的代码质量：

${directoryList}

执行策略：
1. 为每个目录创建一个独立的子代理（使用Task工具，run_in_background: true）
2. 每个子代理应该：
   - 统计文件数量
   - 检查代码风格问题
   - 识别潜在的性能问题
   - 提供改进建议
3. 等待所有子代理完成（使用TaskOutput收集结果）
4. 汇总所有分析结果，生成综合报告`;

  const stream: Query = query({
    prompt,
    options: {
      allowedTools: ['Task', 'TaskOutput', 'Read', 'Glob', 'Grep'],
      maxTurns: 50,
      systemPrompt: `你是一个代码分析专家，善于协调多个子代理进行并行分析。

重要规则：
- 使用 run_in_background: true 实现真正的并行
- 启动所有任务后再使用 TaskOutput 收集结果
- 汇总时要整合所有子代理的发现`
    }
  });

  // 处理流式输出
  for await (const message of stream) {
    if (message.type === 'assistant') {
      for (const chunk of message.message.content) {
        if (chunk.type === 'text') {
          process.stdout.write(chunk.text);
        }
      }
    } else if (message.type === 'tool_use') {
      const toolName = message.tool.name;
      if (toolName === 'Task') {
        console.log(`\n[创建子代理任务]`);
      } else if (toolName === 'TaskOutput') {
        console.log(`\n[收集子代理结果]`);
      }
    }
  }

  console.log('\n\n分析完成！');
}

// 使用
const targetDirs = ['./src/api', './src/models', './src/views'];
parallelCodeAnalysis(targetDirs).catch(console.error);
```

### 3.6 并行执行策略

#### 并发限制

Claude Code对并行执行有以下限制：

| 限制项 | 数值 | 说明 |
|-------|------|------|
| 最大并发 | 10 | 同时运行的子代理上限 |
| 批次等待 | 是 | 当前批次完成后才启动下一批 |
| 队列深度 | 无限制 | 可以排队更多任务 |

#### 批次执行行为

```
假设需要执行15个任务，最大并发为10：

第一批（任务1-10）：
├── Task 1  ──┐
├── Task 2  ──│
├── ...     ──┼──▶ 并行执行
├── Task 9  ──│
└── Task 10 ──┘
             │
             ▼
        等待全部完成
             │
第二批（任务11-15）：
├── Task 11 ──┐
├── Task 12 ──│
├── Task 13 ──┼──▶ 并行执行
├── Task 14 ──│
└── Task 15 ──┘
```

#### 优化建议

1. **任务粒度控制**：将大任务拆分为均匀的小任务
2. **合理分批**：预估任务执行时间，避免长尾效应
3. **失败处理**：设计重试机制处理单个任务失败

```typescript
// 任务拆分示例
function chunkTasks<T>(tasks: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < tasks.length; i += chunkSize) {
    chunks.push(tasks.slice(i, i + chunkSize));
  }
  return chunks;
}

// 使用：每批最多处理8个任务，留2个余量
const taskBatches = chunkTasks(allTasks, 8);
```

### 3.7 子代理上下文管理

每个子代理拥有独立的上下文窗口，这是并行执行的关键优势。

#### 上下文隔离

```
主Agent上下文（200K）
├── 任务规划
├── 进度跟踪
└── 结果汇总

子Agent1上下文（200K）     子Agent2上下文（200K）
├── api/目录内容           ├── models/目录内容
├── 分析结果               ├── 分析结果
└── 详细日志               └── 详细日志
```

#### 上下文传递

主Agent可以通过Task工具的prompt参数向子代理传递必要上下文：

```typescript
// 在提示词中明确传递必要上下文
const taskPrompt = `
你的任务是分析api目录的代码。

项目背景：
- 这是一个Node.js项目
- 使用Express框架
- 正在从CommonJS迁移到ES Module

你需要：
1. 读取所有.js和.ts文件
2. 检查模块导入方式
3. 生成迁移建议

注意：不要读取node_modules目录
`;
```

---

## 第四部分：架构模式（2,500字）

### 4.1 Orchestrator-Worker模式

这是Agent SDK最核心的架构模式，也是构建复杂AI系统的基础。

#### 模式概述

```
┌─────────────────────────────────────────────────────┐
│                 Orchestrator（编排器）                │
│                                                     │
│  职责：                                              │
│  • 分析任务，制定执行计划                             │
│  • 创建并分配子任务给Workers                         │
│  • 监控执行进度                                      │
│  • 汇总结果，处理异常                                │
│                                                     │
│  推荐模型：Claude Opus 4（复杂推理能力强）            │
└─────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ Worker 1 │    │ Worker 2 │    │ Worker 3 │
    │          │    │          │    │          │
    │ 专注执行  │    │ 专注执行  │    │ 专注执行  │
    │ 具体任务  │    │ 具体任务  │    │ 具体任务  │
    │          │    │          │    │          │
    │ 模型：    │    │ 模型：    │    │ 模型：    │
    │ Sonnet 4 │    │ Sonnet 4 │    │ Sonnet 4 │
    └──────────┘    └──────────┘    └──────────┘
```

#### 实现示例

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';

async function orchestratorWorkerPattern(task: string): Promise<void> {
  // 使用Opus作为Orchestrator
  const orchestratorPrompt = `你是一个任务编排专家，负责协调多个子代理完成复杂任务。

收到的任务：
${task}

执行步骤：
1. 分析任务，拆解为可并行执行的子任务
2. 为每个子任务创建一个Worker子代理（使用Task工具）
3. 等待所有Worker完成
4. 汇总结果，生成最终报告

注意事项：
- 每个Worker应该是独立的，不依赖其他Worker的结果
- 合理划分任务粒度，避免单个Worker负担过重
- 在汇总阶段处理可能的冲突或不一致`;

  const stream = query({
    prompt: orchestratorPrompt,
    options: {
      model: 'claude-opus-4',  // Orchestrator使用Opus
      allowedTools: ['Task', 'TaskOutput', 'Read', 'Write', 'Edit', 'Glob'],
      maxTurns: 100,
      systemPrompt: '你是一个高级任务编排AI，善于将复杂任务分解并协调多个专业Agent完成。'
    }
  });

  for await (const message of stream) {
    // 处理消息...
  }
}
```

### 4.2 主代理编排策略

#### 任务分解原则

Orchestrator需要遵循以下原则进行任务分解：

| 原则 | 说明 | 示例 |
|------|------|------|
| **独立性** | 子任务应尽量独立，减少依赖 | 按文件/目录划分，而非按流程步骤 |
| **均衡性** | 子任务工作量应大致均衡 | 避免出现一个超大任务和多个小任务 |
| **完整性** | 每个子任务应有明确的输入和输出 | 定义清晰的验收标准 |
| **容错性** | 设计重试和降级策略 | 单个失败不影响整体 |

#### 进度跟踪

```typescript
// Orchestrator的进度跟踪提示词
const trackingPrompt = `
在执行过程中，请维护一个进度表：

| 子任务ID | 描述 | 状态 | 开始时间 | 完成时间 |
|---------|------|------|---------|---------|
| task_1  | ...  | 进行中 | ...   | -       |
| task_2  | ...  | 已完成 | ...   | ...     |

状态定义：
- 待开始：尚未分配
- 进行中：Worker正在执行
- 已完成：成功完成
- 失败：执行出错，需要处理
`;
```

### 4.3 子代理专业化

#### 专业化配置

不同类型的Worker可以有不同的配置：

```typescript
// 代码修改Worker
const codeWorkerPrompt = `你是一个代码修改专家。
只关注代码质量和功能正确性。
不要添加不必要的注释或文档。`;

// 测试编写Worker
const testWorkerPrompt = `你是一个测试专家。
为每个函数编写单元测试。
使用Jest框架，追求100%覆盖率。`;

// 文档编写Worker
const docWorkerPrompt = `你是一个文档专家。
生成清晰的API文档。
使用JSDoc/docstring标准格式。`;
```

#### 工具权限分离

不同专业的Worker应有不同的工具权限：

```typescript
// 代码Worker - 完整权限
const codeWorkerTools = ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep'];

// 审查Worker - 只读权限
const reviewWorkerTools = ['Read', 'Glob', 'Grep'];

// 文档Worker - 有限写权限
const docWorkerTools = ['Read', 'Write', 'Glob', 'Grep'];
```

### 4.4 上下文压缩与传递

#### 上下文压缩策略

当任务复杂度高时，需要在Agent之间高效传递上下文：

```
原始上下文（10K tokens）
        │
        ▼
  ┌─────────────┐
  │ 压缩/摘要    │
  └─────────────┘
        │
        ▼
压缩后上下文（2K tokens）
        │
        ▼
  传递给子代理
```

#### 实现方法

```typescript
// 上下文压缩提示词
const compressionPrompt = `
请将以下信息压缩为关键要点，保留：
1. 核心功能描述
2. 关键数据结构
3. 重要约束条件
4. 接口定义

删除：
- 详细实现代码
- 注释和文档
- 历史讨论记录

原始信息：
{originalContext}

压缩后的要点（不超过500字）：
`;
```

#### 分层上下文

对于超大规模任务，使用分层上下文管理：

```
全局上下文（Orchestrator持有）
├── 项目整体架构
├── 跨模块依赖关系
└── 全局约束和规范

模块上下文（模块级Worker持有）
├── 模块内部结构
├── 模块接口定义
└── 模块特定规范

文件上下文（文件级Worker持有）
├── 文件具体内容
├── 局部依赖
└── 修改历史
```

### 4.5 完整架构示例

以下是一个完整的大规模代码重构系统架构：

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';

interface RefactorConfig {
  projectPath: string;
  targetDirectories: string[];
  refactorRules: string[];
}

async function largeScaleRefactor(config: RefactorConfig): Promise<void> {
  // 阶段1：分析阶段（Orchestrator）
  console.log('阶段1：项目分析');
  const analysisResult = await runAnalysisPhase(config);

  // 阶段2：规划阶段（Orchestrator）
  console.log('阶段2：制定计划');
  const executionPlan = await runPlanningPhase(analysisResult);

  // 阶段3：执行阶段（Workers并行）
  console.log('阶段3：并行执行');
  const executionResults = await runExecutionPhase(executionPlan);

  // 阶段4：验证阶段（Review Workers）
  console.log('阶段4：结果验证');
  const validationResult = await runValidationPhase(executionResults);

  // 阶段5：报告生成
  console.log('阶段5：生成报告');
  await generateFinalReport(validationResult);
}

async function runExecutionPhase(plan: ExecutionPlan): Promise<ExecutionResult[]> {
  const orchestratorPrompt = `
你是重构执行的总协调者。

执行计划：
${JSON.stringify(plan, null, 2)}

执行策略：
1. 按优先级排序任务
2. 创建Worker子代理（每个目录一个）
3. 使用 run_in_background: true 实现并行
4. 监控执行进度
5. 收集所有结果

Worker子代理配置：
- 类型：code_specialist
- 工具：Read, Write, Edit, Glob, Grep
- 系统提示：遵循项目编码规范，保持向后兼容

请开始执行。`;

  const results: ExecutionResult[] = [];

  const stream = query({
    prompt: orchestratorPrompt,
    options: {
      model: 'claude-opus-4',
      allowedTools: ['Task', 'TaskOutput', 'Read', 'Glob'],
      maxTurns: 200
    }
  });

  for await (const message of stream) {
    // 处理执行过程...
  }

  return results;
}
```

---

## 第五部分：MCP集成（1,000字）

### 5.1 MCP服务器配置

Agent SDK支持集成MCP（Model Context Protocol）服务器，扩展Agent的能力。

#### 配置MCP服务器

```typescript
import { query, type MCPServerConfig } from '@anthropic-ai/claude-agent-sdk';

const mcpServers: Record<string, MCPServerConfig> = {
  // 文件系统服务器
  filesystem: {
    command: 'npx',
    args: ['-y', '@anthropic/mcp-server-filesystem', '/path/to/allowed/dir']
  },

  // 数据库服务器
  database: {
    command: 'npx',
    args: ['-y', '@anthropic/mcp-server-sqlite', './data/app.db']
  },

  // 自定义服务器
  customTool: {
    command: 'node',
    args: ['./mcp-servers/custom-tool.js'],
    env: {
      API_KEY: process.env.CUSTOM_API_KEY
    }
  }
};

const stream = query({
  prompt: '请查询数据库中的用户信息',
  options: {
    mcpServers,
    allowedTools: ['mcp__database__query', 'mcp__filesystem__read']
  }
});
```

#### Python中的MCP配置

```python
from claude_agent_sdk import query, ClaudeAgentOptions

options = ClaudeAgentOptions(
    mcp_servers={
        'filesystem': {
            'command': 'npx',
            'args': ['-y', '@anthropic/mcp-server-filesystem', '/data']
        }
    }
)

async for message in query(
    prompt='读取/data目录下的配置文件',
    options=options
):
    print(message)
```

### 5.2 SDK内置MCP服务器

Agent SDK支持创建内置MCP服务器，无需外部进程：

```typescript
import { query, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';

// 定义自定义工具
function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

// 创建SDK内置MCP服务器
const calculator = createSdkMcpServer({
  name: 'calculator',
  tools: [
    {
      name: 'add',
      description: '将两个数字相加',
      parameters: {
        type: 'object',
        properties: {
          a: { type: 'number' },
          b: { type: 'number' }
        },
        required: ['a', 'b']
      },
      handler: ({ a, b }) => add(a, b)
    },
    {
      name: 'multiply',
      description: '将两个数字相乘',
      parameters: {
        type: 'object',
        properties: {
          a: { type: 'number' },
          b: { type: 'number' }
        },
        required: ['a', 'b']
      },
      handler: ({ a, b }) => multiply(a, b)
    }
  ]
});

// 使用
const stream = query({
  prompt: '计算 (5 + 3) * 2',
  options: {
    mcpServers: { calculator }
  }
});
```

### 5.3 MCP与子代理

MCP服务器可以在子代理中使用，但需要注意作用域：

```typescript
// MCP服务器在主Agent和子代理之间的共享
const stream = query({
  prompt: `创建多个子代理，每个都需要访问数据库。

  注意：所有子代理都可以使用database MCP服务器。`,
  options: {
    mcpServers: {
      database: { ... }  // 所有子代理都可访问
    },
    allowedTools: ['Task', 'mcp__database__query']
  }
});
```

---

## 第六部分：练习（500字）

### 练习1：基础Agent

**目标**：创建一个简单的代码问答Agent

**要求**：
1. 使用TypeScript或Python创建Agent
2. Agent能够读取指定文件并回答关于代码的问题
3. 实现流式输出

**验收标准**：
- [ ] Agent能正确读取文件内容
- [ ] 回答准确且有帮助
- [ ] 流式输出正常工作

### 练习2：并行处理Agent

**目标**：创建一个并行代码分析系统

**要求**：
1. 接收多个目录作为输入
2. 为每个目录创建独立的分析子代理
3. 使用后台运行实现真正的并行
4. 汇总所有分析结果

**验收标准**：
- [ ] 正确创建多个子代理
- [ ] 子代理并行执行
- [ ] 结果正确汇总

### 练习3：MCP集成Agent

**目标**：创建一个带有自定义MCP工具的Agent

**要求**：
1. 创建一个简单的MCP服务器（如计算器或天气查询）
2. 将MCP服务器集成到Agent中
3. Agent能够根据需要调用MCP工具

**验收标准**：
- [ ] MCP服务器正确启动
- [ ] Agent能识别并调用MCP工具
- [ ] 工具执行结果正确返回

---

## 本课总结

### 核心知识点

1. **Agent SDK定位**：Claude Code能力的编程接口
2. **双语言支持**：TypeScript和Python SDK
3. **query函数**：核心API，支持流式响应
4. **Subagents**：通过Task工具创建子代理
5. **Orchestrator-Worker**：复杂任务的标准架构模式
6. **MCP集成**：扩展Agent能力的标准方式

### 最佳实践

- 使用Opus作为Orchestrator，Sonnet作为Worker
- 合理划分任务粒度，避免上下文溢出
- 利用后台运行实现真正的并行
- 为不同专业的Worker配置不同的工具权限

### 下一步学习

完成本课后，建议继续学习：

1. **附录D《权限系统与Memory深度配置》** - 深入理解Agent的安全控制
2. **模块4《MCP集成》** - 掌握更多MCP开发技巧
3. **模块5《Hooks系统》** - 学习Agent的事件钩子机制

---

**课程版本**：V1.0
**最后更新**：2025-12-11
**下一课**：附录D《权限系统与Memory深度配置》
