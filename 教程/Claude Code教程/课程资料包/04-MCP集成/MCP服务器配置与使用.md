# MCP服务器配置与使用

**模块**：04-MCP集成
**课时**：第7课
**预计学习时间**：4小时
**难度等级**：中级


## 学习目标
学完本课后，你将能够：

- [ ] 深入理解MCP协议的架构设计和通信机制
- [ ] 掌握三作用域配置体系及其优先级规则
- [ ] 熟练配置和使用30+核心MCP服务器
- [ ] 独立排查MCP连接和配置问题


## 一、MCP协议详解
### 1.1 什么是MCP
**MCP（Model Context Protocol，模型上下文协议）** 是Anthropic于2024年11月发布的开放标准协议，旨在标准化AI系统（如大语言模型）与外部工具、系统和数据源之间的集成方式。

简单来说，MCP就是AI世界的"USB接口"——它定义了一套通用规范，让任何符合标准的AI应用都能即插即用地连接各种外部服务。

#### MCP的核心价值

**传统集成方式**：每个工具都需要单独对接
**MCP方式**：统一协议，一次对接多处使用


**传统集成方式**：各家AI平台接口不兼容
**MCP方式**：开放标准，跨平台通用


**传统集成方式**：安全边界模糊
**MCP方式**：明确的权限控制和隔离机制


**传统集成方式**：维护成本高
**MCP方式**：生态复用，社区共建


#### MCP的发展历程
- **2024年11月**：Anthropic发布MCP 1.0规范
- **2025年3月**：发布2025-03-26版本，引入Streamable HTTP传输
- **2025年6月**：发布2025-06-18版本，进一步完善规范
- **2025年12月**：Anthropic将MCP捐赠给Linux基金会下的Agentic AI Foundation（AAIF）
- **2025年至今**：OpenAI、Google DeepMind等主流AI厂商相继支持MCP

### 1.2 JSON-RPC 2.0基础
MCP的所有通信都基于JSON-RPC 2.0规范。理解JSON-RPC是掌握MCP的基础。

#### JSON-RPC 2.0核心概念
JSON-RPC 2.0是一个轻量级的远程过程调用（RPC）协议，使用JSON作为数据格式。它定义了三种消息类型：

**1. 请求（Request）**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "read_file",
    "arguments": {
      "path": "/path/to/file.txt"
    }
  }
}
```

字段说明：
- `jsonrpc`：协议版本，必须是"2.0"
- `id`：请求标识符，用于匹配响应
- `method`：要调用的方法名
- `params`：方法参数（可选）

**2. 响应（Response）**

成功响应：
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "文件内容..."
      }
    ]
  }
}
```

错误响应：
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32600,
    "message": "Invalid Request",
    "data": "详细错误信息"
  }
}
```

**3. 通知（Notification）**

通知是不需要响应的单向消息：
```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "token-123",
    "progress": 50,
    "total": 100
  }
}
```

#### 标准错误码

**错误码**：-32700
**含义**：Parse error
**说明**：JSON解析失败


**错误码**：-32600
**含义**：Invalid Request
**说明**：请求格式无效


**错误码**：-32601
**含义**：Method not found
**说明**：方法不存在


**错误码**：-32602
**含义**：Invalid params
**说明**：参数无效


**错误码**：-32603
**含义**：Internal error
**说明**：服务器内部错误


### 1.3 传输层：STDIO与SSE/Streamable HTTP
MCP支持多种传输机制，每种都有其适用场景。

#### STDIO传输（标准输入输出）
STDIO是MCP最基础也是最常用的传输方式，特别适合本地集成场景。

**工作原理**：
1、MCP客户端启动MCP服务器作为子进程
2、服务器从stdin读取JSON-RPC消息
3、服务器向stdout写入响应
4、所有日志和调试信息输出到stderr

**优势**：
- 简单直接，无需网络配置
- 性能最优，无网络开销
- 安全性高，进程级隔离
- 最适合单客户端场景

**示例配置**：
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/me/data"],
      "env": {}
    }
  }
}
```

**消息流程图**：
```
┌──────────────────┐         ┌──────────────────┐
│   MCP Client     │         │   MCP Server     │
│  (Claude Code)   │         │  (subprocess)    │
├──────────────────┤         ├──────────────────┤
│                  │ stdin   │                  │
│  发送请求 ────────┼────────►│  接收并处理      │
│                  │         │                  │
│                  │ stdout  │                  │
│  接收响应 ◄───────┼─────────│  发送响应        │
│                  │         │                  │
│                  │ stderr  │                  │
│  查看日志 ◄───────┼─────────│  输出日志        │
└──────────────────┘         └──────────────────┘
```

#### SSE传输（已废弃）
Server-Sent Events（SSE）是MCP早期版本支持的HTTP传输方式。

**历史演变**：
- 2024年11月：MCP 1.0使用HTTP+SSE作为远程传输方案
- 2025年3月：MCP 2025-03-26版本废弃SSE，推荐使用Streamable HTTP
- 现状：SSE仍可用于兼容旧版MCP服务器

**SSE工作原理**：
- 客户端通过HTTP POST发送请求
- 服务器通过SSE流返回响应
- 支持服务器主动推送消息

#### Streamable HTTP传输（推荐）
Streamable HTTP是MCP 2025-03-26版本引入的新标准，取代了SSE。

**核心改进**：
1、**单一端点架构**：所有通信通过一个HTTP端点完成
2、**双向流式**：同时支持请求-响应和流式模式
3、**更好的兼容性**：兼容更多HTTP基础设施
4、**简化部署**：无需特殊的SSE支持

**工作原理**：
- 使用HTTP POST和GET请求
- 服务器可选择使用SSE流式传输多条消息
- 支持基本请求-响应模式和高级流式通信

**消息流程图**：
```
┌──────────────────┐         ┌──────────────────┐
│   MCP Client     │  HTTP   │   MCP Server     │
│                  │         │   (Remote)       │
├──────────────────┤         ├──────────────────┤
│                  │  POST   │                  │
│  发送请求 ────────┼────────►│  处理请求        │
│                  │         │                  │
│                  │  SSE    │                  │
│  接收流式响应 ◄───┼─────────│  流式返回        │
│                  │         │                  │
│                  │  GET    │                  │
│  轮询状态 ────────┼────────►│  返回状态        │
└──────────────────┘         └──────────────────┘
```

#### 传输方式对比

**特性**：部署位置
**STDIO**：本地
**Streamable HTTP**：本地或远程


**特性**：网络需求
**STDIO**：无
**Streamable HTTP**：需要HTTP


**特性**：性能
**STDIO**：最优
**Streamable HTTP**：略有开销


**特性**：安全性
**STDIO**：进程隔离
**Streamable HTTP**：需要认证


**特性**：适用场景
**STDIO**：单客户端本地工具
**Streamable HTTP**：分布式/远程服务


**特性**：复杂度
**STDIO**：简单
**Streamable HTTP**：中等


### 1.4 架构：Host-Client-Server模型
MCP采用三层架构设计，明确定义了各组件的职责和边界。

#### 三大角色
**1. Host（宿主）**

Host是运行MCP的应用程序环境，负责：
- 创建和管理多个Client实例
- 提供用户界面和交互入口
- 执行安全策略和权限控制
- 协调多个服务器的工作

示例：Claude Desktop、VS Code、IDE插件等

**2. Client（客户端）**

Client是Host内部的MCP连接组件，负责：
- 与特定Server建立和维护连接
- 发送请求并接收响应
- 处理协议级别的消息
- 维护会话状态

一个Host可以创建多个Client，每个Client连接一个Server。

**3. Server（服务器）**

Server提供具体的能力，负责：
- 暴露工具（Tools）供LLM调用
- 提供资源（Resources）供读取
- 定义提示词（Prompts）模板
- 处理来自Client的请求

示例：filesystem server、github server、database server等

#### 架构图
```
┌─────────────────────────────────────────────────────────────┐
│                         Host                                 │
│                    (Claude Code)                             │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   LLM (Claude)                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Client 1   │  │  Client 2   │  │  Client 3   │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
          ▼                ▼                ▼
   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
   │   Server 1   │ │   Server 2   │ │   Server 3   │
   │  filesystem  │ │    github    │ │   database   │
   └──────────────┘ └──────────────┘ └──────────────┘
```

#### 三大能力类型
MCP服务器可以提供三种类型的能力：

**1. Tools（工具）**

工具是LLM可以调用的函数，用于执行操作或获取信息。
```json
{
  "name": "read_file",
  "description": "读取指定路径的文件内容",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "文件的绝对路径"
      }
    },
    "required": ["path"]
  }
}
```

**2. Resources（资源）**

资源是只读的数据源，类似于文件系统中的文件。
```json
{
  "uri": "file:///project/README.md",
  "name": "项目说明文档",
  "mimeType": "text/markdown"
}
```

**3. Prompts（提示词）**

提示词是预定义的模板，可以被LLM使用。
```json
{
  "name": "code_review",
  "description": "代码审查提示词模板",
  "arguments": [
    {
      "name": "code",
      "description": "要审查的代码",
      "required": true
    }
  ]
}
```

#### 连接生命周期
MCP连接遵循以下生命周期：
```
1、初始化阶段
   Client → Server: initialize请求（发送客户端能力）
   Server → Client: initialize响应（发送服务器能力）
   Client → Server: initialized通知

2、操作阶段
   Client → Server: 发送各种请求（tools/call, resources/read等）
   Server → Client: 返回响应或错误
   Server → Client: 可选发送通知（进度更新等）

3、关闭阶段
   Client/Server: 关闭连接
   Server: 清理资源
```


## 二、三作用域配置体系
Claude Code支持三个层级的MCP配置，每个层级有不同的用途和优先级。

### 2.1 Local作用域（最高优先级）
Local作用域是针对当前用户在特定项目中的私有配置。

**存储位置**：`~/.claude.json` 中的项目路径条目

**特点**：
- 仅对当前用户可见
- 仅在特定项目目录中生效
- 不会被版本控制
- 优先级最高

**适用场景**：
- 包含敏感信息的配置（API密钥）
- 个人开发环境特定的工具
- 临时测试用的服务器

**配置方法**：
```bash
# 使用Claude Code命令添加（默认是local作用域）
claude mcp add sqlite /path/to/database.db

# 明确指定local作用域
claude mcp add --scope local my-server npx -y my-mcp-server
```

**手动编辑 ~/.claude.json**：
```json
{
  "mcpServers": {
    "/Users/me/project1": {
      "sqlite": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-sqlite", "/path/to/db.sqlite"]
      }
    },
    "/Users/me/project2": {
      "custom-api": {
        "command": "node",
        "args": ["/path/to/custom-server.js"],
        "env": {
          "API_KEY": "secret-key"
        }
      }
    }
  }
}
```

### 2.2 Project作用域（团队共享）
Project作用域用于团队共享的MCP配置，存储在项目根目录。

**存储位置**：项目根目录下的 `.mcp.json`

**特点**：
- 团队成员共享
- 可以提交到版本控制
- 项目级别的标准化工具
- 优先级中等

**适用场景**：
- 项目依赖的必要工具
- 团队标准化的开发环境
- CI/CD需要使用的服务器

**配置方法**：
```bash
# 使用Claude Code命令添加
claude mcp add --scope project github-server npx -y @modelcontextprotocol/server-github

# 或手动创建.mcp.json文件
```

**项目根目录 .mcp.json 示例**：
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./data"],
      "env": {}
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {}
    }
  }
}
```

**注意事项**：
- 不要在 .mcp.json 中硬编码敏感信息
- 使用 `${ENV_VAR}` 语法引用环境变量
- 建议在 README 中说明需要设置的环境变量

### 2.3 User作用域（全局配置）
User作用域是用户级别的全局配置，在所有项目中生效。

**存储位置**：`~/.claude.json` 全局部分

**特点**：
- 所有项目都可使用
- 个人常用工具
- 优先级最低

**适用场景**：
- 通用开发工具
- 个人习惯的工具链
- 跨项目使用的服务

**配置方法**：
```bash
# 使用Claude Code命令添加
claude mcp add --scope user brave-search npx -y @anthropic/mcp-server-brave-search

# 添加全局工具
claude mcp add --scope user memory npx -y @modelcontextprotocol/server-memory
```

**~/.claude.json 全局配置示例**：
```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-brave-api-key"
      }
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {}
    },
    "time": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-time"],
      "env": {}
    }
  }
}
```

### 2.4 合并规则与优先级
当同名服务器在多个作用域中定义时，Claude Code按以下优先级合并：
```
Local > Project > User
```

#### 合并逻辑示例
假设有以下配置：

**User作用域 (~/.claude.json)**：
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "user-token"
      }
    }
  }
}
```

**Project作用域 (.mcp.json)**：
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Local作用域 (~/.claude.json项目条目)**：
```json
{
  "mcpServers": {
    "/path/to/project": {
      "github": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {
          "GITHUB_TOKEN": "local-override-token"
        }
      }
    }
  }
}
```

**最终生效配置**：使用Local作用域的配置，因为它优先级最高。

#### 查看当前生效的MCP配置
```bash
# 列出所有已配置的MCP服务器
claude mcp list

# 查看特定服务器的配置详情
claude mcp get github
```

#### 作用域选择建议

**场景**：包含API密钥的配置
**推荐作用域**：Local
**原因**：安全，不会泄露


**场景**：团队必需的工具
**推荐作用域**：Project
**原因**：团队共享，版本控制


**场景**：个人常用工具
**推荐作用域**：User
**原因**：全局可用，方便


**场景**：临时测试
**推荐作用域**：Local
**原因**：不影响其他配置


**场景**：CI/CD使用
**推荐作用域**：Project
**原因**：可自动化部署


## 三、30+核心MCP服务器详解
### 3.1 数据类服务器
#### Filesystem（文件系统）
**官方仓库**：@modelcontextprotocol/server-filesystem

**功能**：提供安全的文件系统访问能力，支持读写文件、目录操作、文件搜索等。

**配置示例**：
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path1", "/allowed/path2"],
    "env": {}
  }
}
```

**提供的工具**：

**工具名**：read_file
**功能**：读取文件内容
**参数**：path


**工具名**：write_file
**功能**：写入文件内容
**参数**：path, content


**工具名**：list_directory
**功能**：列出目录内容
**参数**：path


**工具名**：create_directory
**功能**：创建目录
**参数**：path


**工具名**：move_file
**功能**：移动/重命名文件
**参数**：source, destination


**工具名**：search_files
**功能**：搜索文件
**参数**：path, pattern


**工具名**：get_file_info
**功能**：获取文件信息
**参数**：path


**安全特性**：
- 只允许访问配置中指定的目录
- 自动阻止访问敏感系统目录
- 支持配置只读模式

#### SQLite（SQLite数据库）
**官方仓库**：@modelcontextprotocol/server-sqlite

**功能**：提供SQLite数据库的完整访问能力，无需外部数据库安装。

**配置示例**：
```json
{
  "sqlite": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sqlite", "/path/to/database.db"],
    "env": {}
  }
}
```

**提供的工具**：

**工具名**：read_query
**功能**：执行SELECT查询
**参数**：query


**工具名**：write_query
**功能**：执行INSERT/UPDATE/DELETE
**参数**：query


**工具名**：create_table
**功能**：创建表
**参数**：query


**工具名**：list_tables
**功能**：列出所有表
**参数**：-


**工具名**：describe_table
**功能**：获取表结构
**参数**：table_name


**工具名**：append_insight
**功能**：添加分析洞察
**参数**：insight


**使用场景**：
- 本地数据分析
- 应用数据管理
- 快速原型开发

#### PostgreSQL（PostgreSQL数据库）
**官方仓库**：@modelcontextprotocol/server-postgres

**功能**：提供PostgreSQL数据库的完整访问能力，支持查询执行和模式检查。

**配置示例**：
```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres"],
    "env": {
      "POSTGRES_CONNECTION_STRING": "postgresql://user:password@localhost:5432/database"
    }
  }
}
```

**提供的工具**：

**工具名**：query
**功能**：执行SQL查询
**参数**：sql


**工具名**：list_schemas
**功能**：列出模式
**参数**：-


**工具名**：list_tables
**功能**：列出表
**参数**：schema


**工具名**：describe_table
**功能**：获取表结构
**参数**：schema, table


**安全建议**：
- 使用只读数据库用户
- 配置适当的连接限制
- 不要在配置文件中硬编码密码

#### Memory（内存存储）
**官方仓库**：@modelcontextprotocol/server-memory

**功能**：提供持久化的键值存储，用于跨会话保存信息。

**配置示例**：
```json
{
  "memory": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-memory"],
    "env": {}
  }
}
```

**提供的工具**：

**工具名**：create_entities
**功能**：创建实体
**参数**：entities


**工具名**：create_relations
**功能**：创建关系
**参数**：relations


**工具名**：add_observations
**功能**：添加观察
**参数**：observations


**工具名**：delete_entities
**功能**：删除实体
**参数**：entity_names


**工具名**：delete_observations
**功能**：删除观察
**参数**：observation_ids


**工具名**：delete_relations
**功能**：删除关系
**参数**：relations


**工具名**：read_graph
**功能**：读取图
**参数**：-


**工具名**：search_nodes
**功能**：搜索节点
**参数**：query


**工具名**：open_nodes
**功能**：打开节点
**参数**：names


**使用场景**：
- 记住用户偏好
- 保存项目上下文
- 跨会话信息传递

### 3.2 搜索类服务器
#### Brave Search（Brave搜索）
**官方仓库**：@anthropic/mcp-server-brave-search

**功能**：提供隐私优先的Web搜索能力，免费层每月2000次查询。

**配置示例**：
```json
{
  "brave-search": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-brave-search"],
    "env": {
      "BRAVE_API_KEY": "your-brave-api-key"
    }
  }
}
```

**获取API Key**：
1、访问 https://brave.com/search/api/
2、注册账号
3、创建API Key
4、免费层：2000次/月

**提供的工具**：

**工具名**：brave_web_search
**功能**：执行Web搜索
**参数**：query, count


**工具名**：brave_local_search
**功能**：本地搜索
**参数**：query, location


#### Exa（深度搜索）
**功能**：提供研究级别的深度Web搜索，特别适合技术文档和学术资料。

**配置示例**：
```json
{
  "exa": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-exa"],
    "env": {
      "EXA_API_KEY": "your-exa-api-key"
    }
  }
}
```

**提供的工具**：

**工具名**：search
**功能**：语义搜索
**参数**：query, numResults


**工具名**：find_similar
**功能**：查找相似内容
**参数**：url


**工具名**：get_contents
**功能**：获取网页内容
**参数**：ids


**适用场景**：
- 技术研究
- 文档查找
- 竞品分析

#### Fetch（网页获取）
**官方仓库**：@modelcontextprotocol/server-fetch

**功能**：获取并转换网页内容，支持HTML到Markdown转换。

**配置示例**：
```json
{
  "fetch": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-fetch"],
    "env": {}
  }
}
```

**提供的工具**：

**工具名**：fetch
**功能**：获取URL内容
**参数**：url, raw


#### Google Maps（地图服务）
**官方仓库**：@modelcontextprotocol/server-google-maps

**功能**：提供地理位置搜索、路线规划等地图服务。

**配置示例**：
```json
{
  "google-maps": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-google-maps"],
    "env": {
      "GOOGLE_MAPS_API_KEY": "your-google-maps-api-key"
    }
  }
}
```

**提供的工具**：

**工具名**：maps_geocode
**功能**：地址编码
**参数**：address


**工具名**：maps_reverse_geocode
**功能**：反向编码
**参数**：lat, lng


**工具名**：maps_search_places
**功能**：搜索地点
**参数**：query, location


**工具名**：maps_directions
**功能**：路线规划
**参数**：origin, destination


### 3.3 开发类服务器
#### GitHub
**官方仓库**：@modelcontextprotocol/server-github

**功能**：提供完整的GitHub仓库管理能力。

**配置示例**：
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_TOKEN": "your-github-token"
    }
  }
}
```

**提供的工具**：

**工具名**：create_repository
**功能**：创建仓库
**参数**：name, description, private


**工具名**：get_file_contents
**功能**：获取文件内容
**参数**：owner, repo, path


**工具名**：push_files
**功能**：推送文件
**参数**：owner, repo, branch, files


**工具名**：create_issue
**功能**：创建Issue
**参数**：owner, repo, title, body


**工具名**：create_pull_request
**功能**：创建PR
**参数**：owner, repo, title, head, base


**工具名**：fork_repository
**功能**：Fork仓库
**参数**：owner, repo


**工具名**：create_branch
**功能**：创建分支
**参数**：owner, repo, branch


**工具名**：search_repositories
**功能**：搜索仓库
**参数**：query


**工具名**：search_code
**功能**：搜索代码
**参数**：query


**工具名**：search_issues
**功能**：搜索Issues
**参数**：query


**权限要求**：
- repo（完整仓库访问）
- workflow（如需管理Actions）

#### GitLab
**官方仓库**：@modelcontextprotocol/server-gitlab

**功能**：提供GitLab仓库管理能力，类似GitHub服务器。

**配置示例**：
```json
{
  "gitlab": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-gitlab"],
    "env": {
      "GITLAB_TOKEN": "your-gitlab-token",
      "GITLAB_URL": "https://gitlab.com"
    }
  }
}
```

#### Git（本地Git）
**官方仓库**：@modelcontextprotocol/server-git

**功能**：提供本地Git仓库操作能力。

**配置示例**：
```json
{
  "git": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "/path/to/repo"],
    "env": {}
  }
}
```

**提供的工具**：

**工具名**：git_status
**功能**：获取状态
**参数**：-


**工具名**：git_log
**功能**：获取日志
**参数**：max_count


**工具名**：git_diff
**功能**：获取差异
**参数**：target


**工具名**：git_commit
**功能**：创建提交
**参数**：message


**工具名**：git_add
**功能**：暂存文件
**参数**：files


**工具名**：git_reset
**功能**：重置更改
**参数**：-


**工具名**：git_checkout
**功能**：切换分支
**参数**：branch


#### Sentry（错误追踪）
**官方仓库**：@modelcontextprotocol/server-sentry

**功能**：提供Sentry错误和Issue分析能力。

**配置示例**：
```json
{
  "sentry": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sentry"],
    "env": {
      "SENTRY_AUTH_TOKEN": "your-sentry-token",
      "SENTRY_ORG": "your-org"
    }
  }
}
```

**提供的工具**：

**工具名**：list_projects
**功能**：列出项目
**参数**：-


**工具名**：get_issue
**功能**：获取Issue详情
**参数**：issue_id


**工具名**：list_issues
**功能**：列出Issues
**参数**：project


**工具名**：resolve_issue
**功能**：解决Issue
**参数**：issue_id


### 3.4 云服务类服务器
#### AWS（亚马逊云）
**功能**：提供AWS服务的访问能力，包括S3、Lambda、DynamoDB等。

**配置示例**：
```json
{
  "aws": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-aws"],
    "env": {
      "AWS_ACCESS_KEY_ID": "your-access-key",
      "AWS_SECRET_ACCESS_KEY": "your-secret-key",
      "AWS_REGION": "us-east-1"
    }
  }
}
```

**提供的工具**（示例）：

**工具名**：s3_list_buckets
**功能**：列出S3桶


**工具名**：s3_get_object
**功能**：获取S3对象


**工具名**：lambda_invoke
**功能**：调用Lambda函数


**工具名**：dynamodb_query
**功能**：查询DynamoDB


#### Cloudflare
**功能**：提供Cloudflare边缘服务的访问能力。

**配置示例**：
```json
{
  "cloudflare": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-cloudflare"],
    "env": {
      "CLOUDFLARE_API_TOKEN": "your-cf-token"
    }
  }
}
```

**提供的工具**（示例）：

**工具名**：list_zones
**功能**：列出域名


**工具名**：create_dns_record
**功能**：创建DNS记录


**工具名**：purge_cache
**功能**：清除缓存


**工具名**：get_analytics
**功能**：获取分析数据


#### Puppeteer（浏览器自动化）
**官方仓库**：@modelcontextprotocol/server-puppeteer

**功能**：提供无头浏览器自动化能力，用于网页抓取和测试。

**配置示例**：
```json
{
  "puppeteer": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
    "env": {}
  }
}
```

**提供的工具**：

**工具名**：puppeteer_navigate
**功能**：导航到URL
**参数**：url


**工具名**：puppeteer_screenshot
**功能**：截图
**参数**：name


**工具名**：puppeteer_click
**功能**：点击元素
**参数**：selector


**工具名**：puppeteer_fill
**功能**：填充表单
**参数**：selector, value


**工具名**：puppeteer_evaluate
**功能**：执行JavaScript
**参数**：script


**使用场景**：
- 网页抓取
- 自动化测试
- 数据采集
- 监控检查

### 3.5 知识类服务器
#### Context7（技术文档）
**仓库**：@upstash/context7-mcp

**功能**：提供1000+流行框架的最新文档访问，解决AI训练数据过时问题。

**配置示例**：
```json
{
  "context7": {
    "command": "npx",
    "args": ["-y", "@upstash/context7-mcp"],
    "env": {}
  }
}
```

**提供的工具**：

**工具名**：resolve_library_id
**功能**：解析库名到Context7 ID
**参数**：libraryName


**工具名**：get_library_docs
**功能**：获取库文档
**参数**：context7CompatibleLibraryID, topic, tokens


**支持的库（部分）**：
- React、Vue、Angular
- Next.js、Nuxt
- FastAPI、Django、Flask
- Tailwind CSS、Shadcn
- Prisma、Drizzle
- 更多...

**使用示例**：
```
1、首先解析库名
   resolve_library_id("next.js")
   返回: "/vercel/next.js"

2、然后获取文档
   get_library_docs("/vercel/next.js", "app router", 5000)
   返回: Next.js App Router相关文档
```

#### Sequential Thinking（顺序思考）
**官方仓库**：@modelcontextprotocol/server-sequentialthinking

**功能**：提供结构化的顺序思考过程，用于分解复杂问题。

**配置示例**：
```json
{
  "sequential-thinking": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-sequentialthinking"],
    "env": {}
  }
}
```

**提供的工具**：

**工具名**：sequentialthinking
**功能**：执行顺序思考
**参数**：thought, nextThoughtNeeded, thoughtNumber, totalThoughts


**使用场景**：
- 复杂问题分解
- 多步骤推理
- 决策分析
- 规划任务

### 3.6 协作类服务器
#### Slack（Slack消息）
**官方仓库**：@modelcontextprotocol/server-slack

**功能**：提供Slack消息读取和发送能力。

**配置示例**：
```json
{
  "slack": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-slack"],
    "env": {
      "SLACK_BOT_TOKEN": "xoxb-your-token",
      "SLACK_TEAM_ID": "your-team-id"
    }
  }
}
```

**提供的工具**：

**工具名**：list_channels
**功能**：列出频道
**参数**：-


**工具名**：post_message
**功能**：发送消息
**参数**：channel, text


**工具名**：reply_to_thread
**功能**：回复消息
**参数**：channel, thread_ts, text


**工具名**：get_channel_history
**功能**：获取频道历史
**参数**：channel


**工具名**：add_reaction
**功能**：添加表情反应
**参数**：channel, timestamp, name


#### Linear（项目管理）
**功能**：提供Linear项目和Issue管理能力。

**配置示例**：
```json
{
  "linear": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-linear"],
    "env": {
      "LINEAR_API_KEY": "your-linear-api-key"
    }
  }
}
```

**提供的工具**（示例）：

**工具名**：list_issues
**功能**：列出Issues


**工具名**：create_issue
**功能**：创建Issue


**工具名**：update_issue
**功能**：更新Issue


**工具名**：list_projects
**功能**：列出项目


### 3.7 自动化类服务器
#### n8n（工作流自动化）
**功能**：将n8n工作流暴露为MCP工具，实现低代码自动化。

**配置示例**：
```json
{
  "n8n": {
    "command": "npx",
    "args": ["-y", "@n8n/mcp-server"],
    "env": {
      "N8N_API_KEY": "your-n8n-api-key",
      "N8N_URL": "http://localhost:5678"
    }
  }
}
```

**特点**：
- 400+内置集成
- 低代码节点编辑器
- 可视化工作流设计
- 自托管或云服务

**使用场景**：
- 自动化重复任务
- 集成多个服务
- 数据同步
- 通知和告警

#### Make（原Integromat）
**功能**：类似n8n，提供可视化自动化工作流。

**配置示例**：
```json
{
  "make": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-make"],
    "env": {
      "MAKE_API_KEY": "your-make-api-key"
    }
  }
}
```

### 3.8 其他工具服务器
#### Time（时间服务）
**官方仓库**：@modelcontextprotocol/server-time

**功能**：提供时间相关的工具。

**配置示例**：
```json
{
  "time": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-time"],
    "env": {}
  }
}
```

**提供的工具**：

**工具名**：get_current_time
**功能**：获取当前时间
**参数**：timezone


#### Everything（全能搜索）
**功能**：提供Windows系统文件快速搜索（需要Everything软件）。

**配置示例**：
```json
{
  "everything": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-everything"],
    "env": {}
  }
}
```

**提供的工具**：

**工具名**：search
**功能**：搜索文件
**参数**：query, max_results


#### Windows CLI（Windows命令行）
**功能**：在Windows上安全执行命令行操作。

**配置示例**：
```json
{
  "windows-cli": {
    "command": "npx",
    "args": ["-y", "@anthropic/mcp-server-windows-cli"],
    "env": {}
  }
}
```

### 3.9 完整服务器分类总结

**分类**：**数据**
**服务器名称**：filesystem, sqlite, postgres, memory
**主要用途**：文件和数据库操作


**分类**：**搜索**
**服务器名称**：brave-search, exa, fetch, google-maps
**主要用途**：网络搜索和获取


**分类**：**开发**
**服务器名称**：github, gitlab, git, sentry
**主要用途**：代码管理和错误追踪


**分类**：**云服务**
**服务器名称**：aws, cloudflare, puppeteer
**主要用途**：云平台和自动化


**分类**：**知识**
**服务器名称**：context7, sequential-thinking
**主要用途**：文档查询和推理


**分类**：**协作**
**服务器名称**：slack, linear
**主要用途**：团队沟通和项目管理


**分类**：**自动化**
**服务器名称**：n8n, make
**主要用途**：工作流自动化


**分类**：**工具**
**服务器名称**：time, everything, windows-cli
**主要用途**：系统工具


## 四、配置详解与最佳实践
### 4.1 完整.mcp.json配置示例
以下是一个功能完整的项目级MCP配置示例：
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "./src",
        "./docs",
        "./data"
      ],
      "env": {}
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "./data/app.db"
      ],
      "env": {}
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {}
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "${BRAVE_API_KEY}"
      }
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {}
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequentialthinking"],
      "env": {}
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "env": {}
    }
  }
}
```

### 4.2 环境变量管理
#### 方法1：使用.env文件
创建 `.env` 文件（添加到 .gitignore）：
```
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
BRAVE_API_KEY=BSAxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxx
```

在shell配置文件中加载（如 ~/.bashrc 或 ~/.zshrc）：
```bash
export $(cat .env | xargs)
```

#### 方法2：使用系统环境变量
Windows PowerShell：
```powershell
$env:GITHUB_TOKEN = "ghp_xxxxxxxxxxxx"
$env:BRAVE_API_KEY = "BSAxxxxxxxxxx"
```

Windows 永久设置：
```powershell
[System.Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "ghp_xxxx", "User")
```

macOS/Linux：
```bash
export GITHUB_TOKEN="ghp_xxxxxxxxxxxx"
export BRAVE_API_KEY="BSAxxxxxxxxxx"
```

#### 方法3：在配置中引用环境变量
在 .mcp.json 中使用 `${VAR_NAME}` 语法：
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### 4.3 调试模式
#### 使用MCP Inspector
MCP Inspector是官方提供的调试工具，可以交互式测试MCP服务器。

**安装和使用**：
```bash
# 调试任意MCP服务器
npx @modelcontextprotocol/inspector npx -y @modelcontextprotocol/server-filesystem /path/to/dir

# 调试Python MCP服务器
npx @modelcontextprotocol/inspector python server.py

# 调试本地开发的服务器
npx @modelcontextprotocol/inspector node ./dist/server.js
```

**Inspector功能**：
- 交互式工具测试
- 请求/响应查看
- 资源浏览
- 协议一致性检查

**访问地址**：
启动后访问 http://127.0.0.1:6274

#### 查看Claude Code日志
```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp*.log

# Windows
Get-Content "$env:LOCALAPPDATA\Claude\logs\mcp*.log" -Wait

# 查看特定服务器日志
tail -f ~/Library/Logs/Claude/mcp-server-github.log
```

#### Claude Code调试命令
```bash
# 列出所有MCP服务器状态
claude mcp list

# 测试特定服务器连接
claude mcp test github

# 查看服务器详情
claude mcp get github

# 重启服务器
claude mcp restart github

# 启动时开启详细日志
claude --mcp-debug
```

#### 常见问题排查
**问题1：服务器无法启动**

检查项：
1、Node.js版本是否满足要求（>=18）
2、npx是否可用：`npx --version`
3、网络是否可以访问npm

**问题2：服务器连接失败**

检查项：
1、环境变量是否正确设置
2、API Key是否有效
3、端口是否被占用

**问题3：工具调用失败**

检查项：
1、参数格式是否正确
2、权限是否足够
3、查看服务器日志获取详细错误

### 4.4 性能优化建议
#### 按需加载服务器
不要一次性配置所有服务器，根据项目需要选择：
```json
{
  "mcpServers": {
    "filesystem": { ... },
    "github": { ... }
  }
}
```

#### 使用本地服务器优先
本地STDIO服务器性能最优：
- filesystem：本地文件操作
- sqlite：本地数据库
- git：本地仓库操作

#### 合理配置超时
对于可能耗时的操作，确保超时设置合理：
```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"],
      "env": {},
      "timeout": 60000
    }
  }
}
```


## 五、实战练习
### 练习1：配置基础开发环境
**目标**：配置一套适合日常开发的MCP服务器组合

**步骤**：

1、创建项目级配置文件 `.mcp.json`
2、配置以下服务器：
   - filesystem（限制到项目目录）
   - github（需要配置Token）
   - context7（获取最新文档）
3、测试各服务器连接

**验收标准**：
- [ ] 能够读取项目文件
- [ ] 能够查询GitHub仓库信息
- [ ] 能够获取技术文档

### 练习2：配置数据分析环境
**目标**：配置适合数据分析的MCP服务器组合

**步骤**：

1、配置SQLite服务器连接本地数据库
2、配置Memory服务器保存分析结果
3、配置Brave Search获取外部数据
4、创建一个简单的数据分析工作流

**验收标准**：
- [ ] 能够查询SQLite数据库
- [ ] 能够保存分析洞察到Memory
- [ ] 能够搜索补充信息

### 练习3：调试MCP服务器
**目标**：学会使用MCP Inspector调试服务器

**步骤**：

1、使用Inspector启动filesystem服务器
2、测试各个工具的功能
3、查看请求和响应的JSON格式
4、模拟一个错误请求并查看错误响应

**验收标准**：
- [ ] 成功启动Inspector
- [ ] 理解JSON-RPC消息格式
- [ ] 能够排查常见问题

### 练习4：多作用域配置实践
**目标**：理解三作用域配置的合并规则

**步骤**：

1、在User作用域配置一个服务器
2、在Project作用域配置同名服务器（不同参数）
3、在Local作用域再次覆盖
4、验证最终生效的配置

**验收标准**：
- [ ] 理解优先级规则
- [ ] 能够正确使用各作用域
- [ ] 知道何时使用哪个作用域

### 练习5：构建项目专属配置
**目标**：为特定项目创建完整的MCP配置

**步骤**：

1、分析项目需求，确定需要的服务器
2、创建 `.mcp.json` 配置文件
3、设置必要的环境变量
4、编写README说明配置方法
5、测试所有服务器功能

**验收标准**：
- [ ] 配置文件完整无误
- [ ] 敏感信息不硬编码
- [ ] 文档说明清晰
- [ ] 团队成员可以复现


## 常见问题FAQ
### Q1: MCP服务器启动失败怎么办？
**A**: 按以下步骤排查：
1、检查Node.js版本：`node --version`（需要>=18）
2、检查npx可用性：`npx --version`
3、手动运行服务器命令查看错误
4、检查Claude Code日志

### Q2: 如何知道服务器提供了哪些工具？
**A**: 三种方法：
1、使用MCP Inspector查看
2、查看服务器GitHub仓库文档
3、在Claude Code中询问服务器能力

### Q3: 环境变量无法读取怎么办？
**A**: 检查以下几点：
1、变量名是否正确（区分大小写）
2、变量是否已导出到当前shell
3、使用 `echo $VAR_NAME` 验证
4、Windows需要重启终端

### Q4: 可以同时使用多个同类型服务器吗？
**A**: 可以，使用不同的服务器名称：
```json
{
  "mcpServers": {
    "sqlite-app": { ... },
    "sqlite-analytics": { ... }
  }
}
```

### Q5: 如何更新MCP服务器？
**A**: 使用npx时会自动获取最新版本。如需强制更新：
```bash
npx clear-npx-cache
# 或删除 ~/.npm/_npx 目录
```


## 扩展阅读
### 官方资源
- [MCP官方规范](https://modelcontextprotocol.io/specification/2025-06-18)
- [MCP官方服务器仓库](https://github.com/modelcontextprotocol/servers)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Code MCP文档](https://code.claude.com/docs/en/mcp)

### 社区资源
- [Awesome MCP Servers](https://github.com/punkpeye/awesome-mcp-servers)
- [MCP Server Finder](https://www.mcpserverfinder.com/)
- [MCP中文站](https://mcpcn.com/)

### 进阶主题
- 下一课：自定义MCP开发实战
- 相关课程：Hooks系统、Skills定制


**更新日期**：2025-12-11
**版本**：V1.0
**字数统计**：约14,000字
