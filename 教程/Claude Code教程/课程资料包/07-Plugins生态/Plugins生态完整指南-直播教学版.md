# Claude Code Plugins生态完整指南：从安装到自定义开发

> **课程信息**
>
> - **预计学时**：4-6小时
> - **难度等级**：⭐⭐ 进阶实战
> - **更新日期**：2025年12月
> - **适用版本**：Claude Code v2.0+ (Plugins支持于2025年10月9日发布)

---

## 📚 本课学习目标

完成本课学习后,你将能够:

1. **理解Plugins生态价值**:掌握Plugins与Commands/Skills/MCP的本质区别
2. **浏览官方Marketplace**:在243个社区插件中找到你需要的
3. **安装管理Plugins**:掌握install/update/remove全流程
4. **开发自定义Plugin**:从零创建符合Anthropic 2025规范的Plugin
5. **分享Plugin到社区**:将你的Plugin发布到GitHub和Marketplace
6. **排查Plugin故障**:独立解决90%的常见问题

---

## 🗺️ 学习路径导航（先看这里！）

> 💡 **根据你的情况选择学习路径**:这是一篇完整教程,不用全看!根据你的目标选择路径。

### 路径A:快速上手（⏱️ 30分钟）

**适合人群**:急着安装第一个Plugin体验功能

**只看这些章节**（其他跳过）:

```
✅ 术语表（3分钟） - 快速了解关键概念
✅ 第2章:5分钟快速开始（15分钟）
✅ 第3.1-3.2节:浏览和安装（10分钟）
✅ 第5.1节:快速验证（2分钟）
```

**30分钟后你能达到**:成功安装并使用第一个Plugin

---

### 路径B:Plugin开发者（⏱️ 3小时）

**适合人群**:想开发自己的Plugin分享给社区

**学习顺序**:

```
✅ 第1章:Plugins简介（20分钟）
✅ 第2章:快速开始（15分钟）
✅ 第4章:创建自定义Plugin（90分钟）- 重点章节
✅ 第5.3节:发布到Marketplace（30分钟）
✅ 第6章:故障排查（25分钟）
```

---

### 路径C:问题排查（⏱️ 5分钟）

**适合人群**:Plugin安装或运行遇到问题

**直接跳到这些章节**:

```
🔧 第6章:故障排查 - 按错误类型查找
🔧 第7章:FAQ - 最常见的20个问题
```

**使用方法**:按 `Ctrl + F` 搜索错误关键词

---

## 术语表（小白必读）

在开始之前,先了解这些关键术语:

| 术语 | 英文全称 | 通俗解释 | 类比 |
|------|---------|---------|------|
| **Plugin** | - | Claude Code的扩展包,添加新功能 | 手机APP |
| **Marketplace** | Plugin Marketplace | Plugin商店,浏览/下载Plugin的地方 | App Store应用商店 |
| **Agent Skill** | - | Plugin的一种类型,提供专业能力（如PDF处理） | 手机里的工具类APP |
| **Hook** | - | Plugin的一种类型,在特定时机自动执行 | 手机的自动化快捷指令 |
| **MCP Server** | Model Context Protocol Server | Plugin集成的外部服务 | APP连接的云服务 |
| **Slash Command** | - | Plugin提供的新命令（如/analyze） | APP的功能入口 |
| **Schema** | - | Plugin的配置规范文件 | APP的安装配置文件 |

---

## 第1章:Plugins生态概览

### 1.1 什么是Claude Code Plugin?

**定义**:

Plugin是Claude Code的扩展包,可以添加新的命令、专业能力和自动化流程,且可以跨项目和团队共享。

**类比理解**:

```
手机              |  Claude Code
------------------|------------------
操作系统(iOS/Android) | Claude Code核心
App Store        | Plugin Marketplace
安装的APP        | 已安装的Plugins
APP更新          | Plugin自动更新
```

**核心价值**:

1. **可复用性**:一次开发,多个项目使用
2. **易分享性**:通过Marketplace一键安装
3. **模块化**:每个Plugin专注一个领域
4. **社区驱动**:243个社区Plugin贡献

### 1.2 Plugins vs Commands/Skills/MCP

很多学员问:"我已经有Commands和Skills了,为什么还要Plugin?"

**对比表**:

| 维度 | Commands | Skills | MCP | **Plugins** |
|------|----------|--------|-----|-------------|
| **定义** | Markdown提示词 | 专业Agent能力 | 外部服务集成 | **打包的扩展** |
| **位置** | `.claude/commands/` | `.claude/skills/` | `.mcp.json` | **`.claude/plugins/`** |
| **可分享性** | ❌ 手动复制 | ❌ 手动复制 | ⚠️ 需配置 | **✅ 一键安装** |
| **自动更新** | ❌ 手动更新 | ❌ 手动更新 | ⚠️ 部分支持 | **✅ 自动更新** |
| **包含内容** | 单个提示词 | 多个文件+配置 | 服务器配置 | **Commands+Skills+MCP** |
| **适用场景** | 简单重复任务 | 复杂专业任务 | 外部API调用 | **所有场景** |

**关键区别**:

Plugin是一个"超集"概念:

```
Plugin = Commands + Skills + Hooks + MCP配置 + 文档
```

**何时用什么?**

- **Commands**:项目内简单重复任务（如`/format-code`）
- **Skills**:项目内复杂专业任务（如`document-skills:pdf`）
- **MCP**:需要外部服务（如GitHub API）
- **Plugins**:✅ 想分享给团队/社区的任何功能

### 1.3 Plugins生态现状（2025年12月）

**官方数据**:

- **发布时间**:2025年10月9日
- **社区Plugin数量**:243个（来源:Jeremy Longshore维护的claude-code-plugins-plus）
- **官方Marketplace**:有（code.claude.com/plugins）
- **自动更新**:✅ 支持（启动时自动检查）

**主流Marketplace**:

1. **Anthropic官方Marketplace**:
   - URL:`https://code.claude.com/plugins`
   - 内容:官方示例+精选社区Plugin
   - 特点:审核严格,质量保证

2. **Jeremy Longshore社区Marketplace**:
   - URL:`https://github.com/jeremylongshore/claude-code-plugins-plus`
   - 内容:243个Plugin（截至2025年12月）
   - 特点:100%符合Anthropic 2025 Skills Schema

3. **Composio Integration Marketplace**:
   - URL:`https://composio.dev/blog/claude-code-plugin`
   - 内容:集成2000+外部工具
   - 特点:专注API集成

**热门Plugin分类**:

| 分类 | 典型Plugin | 用途 | 使用量 |
|------|-----------|------|--------|
| **文档处理** | `document-skills:pdf` | PDF创建/编辑/分析 | ⭐⭐⭐⭐⭐ |
| **代码质量** | `code-review-expert` | 自动代码审查 | ⭐⭐⭐⭐ |
| **项目管理** | `task-master-ai` | 任务拆解和跟踪 | ⭐⭐⭐⭐ |
| **数据分析** | `data-viz-pro` | 数据可视化 | ⭐⭐⭐ |
| **API集成** | `github-copilot` | GitHub API集成 | ⭐⭐⭐⭐⭐ |

📸 **截图位置**:[显示官方Marketplace主页,展示Plugin分类和搜索功能]

---

## 第2章:5分钟快速开始

### 2.1 安装你的第一个Plugin

**目标**:安装`document-skills:pdf` Plugin处理PDF文件

**前置条件检查**:

```bash
# 1. 确认Claude Code已安装
claude --version
# 预期输出:claude-code/2.0.5 或更高版本

# 2. 确认在项目目录中
cd /path/to/your/project
ls .claude/  # 应该看到settings.json等文件
```

**步骤1:启用Plugin支持**

打开`.claude/settings.json`,添加:

```json
{
  "marketplaces": {
    "enabled": true,
    "autoUpdate": true,
    "sources": [
      "https://code.claude.com/plugins/index.json"
    ]
  }
}
```

**步骤2:浏览可用Plugins**

```bash
# 列出所有可用Plugins
claude plugins list --available

# 搜索PDF相关Plugins
claude plugins search pdf
```

**预期输出**:

```
🔍 搜索结果: 3个Plugins匹配 "pdf"

📦 document-skills:pdf (v1.2.0)
   📝 Comprehensive PDF manipulation toolkit
   ⭐ 4.8/5.0 (1,234 安装)
   🏷️  Tags: pdf, document, extract

📦 pdf-analyzer (v0.9.0)
   📝 Advanced PDF content analysis
   ⭐ 4.2/5.0 (456 安装)

📦 invoice-pdf-parser (v1.0.3)
   📝 Extract data from invoice PDFs
   ⭐ 3.9/5.0 (234 安装)
```

**步骤3:安装Plugin**

```bash
# 安装document-skills:pdf
claude plugins install document-skills:pdf

# 或使用完整URL安装
claude plugins install https://github.com/anthropics/document-skills
```

**安装过程输出**:

```
📥 正在下载 document-skills:pdf v1.2.0...
✅ 下载完成

🔍 验证Plugin schema...
✅ Schema有效（符合Anthropic 2025规范）

📦 安装依赖:
   - @anthropic/pdf-lib v2.1.0 ✅
   - pdfjs-dist v3.11.174 ✅

🔧 配置Plugin hooks...
   - pre-commit: pdf-validation ✅

✅ document-skills:pdf 安装成功!

💡 使用方法:
   claude "Extract text from example.pdf"
   或在对话中提到PDF文件
```

**步骤4:验证安装**

```bash
# 查看已安装Plugins
claude plugins list

# 输出:
# 📦 已安装Plugins (1):
#    ✅ document-skills:pdf v1.2.0
```

**步骤5:使用Plugin**

创建测试对话:

```bash
# 启动Claude Code
claude

# 在对话中输入:
> Extract the first page from my-document.pdf and save as page1.pdf
```

Claude会自动调用`document-skills:pdf` Plugin处理!

📸 **截图位置**:[显示完整的Plugin安装过程和成功验证的终端输出]

### 2.2 快速卸载Plugin

如果不需要了:

```bash
# 卸载Plugin
claude plugins uninstall document-skills:pdf

# 输出:
# 🗑️  正在卸载 document-skills:pdf...
# ✅ 已删除文件: .claude/plugins/document-skills/
# ✅ 已清理依赖: @anthropic/pdf-lib
# ✅ 卸载完成
```

---

## 第3章:使用Marketplace深度指南

### 3.1 浏览Marketplace

**方法1:命令行浏览**

```bash
# 列出所有分类
claude marketplace categories

# 输出:
# 📂 可用分类:
#    - document-processing (45个Plugins)
#    - code-quality (32个Plugins)
#    - data-analysis (28个Plugins)
#    - api-integration (67个Plugins)
#    - project-management (21个Plugins)
#    - visualization (18个Plugins)
#    - testing (15个Plugins)
#    - other (17个Plugins)

# 查看某个分类
claude marketplace category document-processing
```

**方法2:Web浏览器**

访问:`https://code.claude.com/plugins`

界面元素:

```
┌─────────────────────────────────────────┐
│ Claude Code Plugin Marketplace          │
│                                         │
│ 🔍 [搜索框: "搜索Plugins..."]          │
│                                         │
│ 📂 分类:                                │
│  ├─ 📄 文档处理 (45)                    │
│  ├─ 🔧 代码质量 (32)                    │
│  ├─ 📊 数据分析 (28)                    │
│  └─ 🔌 API集成 (67)                     │
│                                         │
│ 🌟 热门Plugins:                         │
│  ┌──────────────────────────┐          │
│  │ document-skills:pdf      │          │
│  │ ⭐⭐⭐⭐⭐ 4.8 (1,234)     │          │
│  │ [安装] [详情]            │          │
│  └──────────────────────────┘          │
└─────────────────────────────────────────┘
```

📸 **截图位置**:[显示Marketplace网页界面的完整截图]

### 3.2 安装Plugin的3种方式

**方式1:从Marketplace安装（推荐）**

```bash
# 按名称安装
claude plugins install document-skills:pdf

# 指定版本
claude plugins install document-skills:pdf@1.2.0

# 安装最新测试版
claude plugins install document-skills:pdf@beta
```

**方式2:从GitHub URL安装**

```bash
# 完整仓库URL
claude plugins install https://github.com/anthropics/document-skills

# 特定分支
claude plugins install https://github.com/user/my-plugin#dev-branch

# 特定commit
claude plugins install https://github.com/user/my-plugin#abc123f
```

**方式3:从本地目录安装（开发测试用）**

```bash
# 从本地路径安装
claude plugins install /path/to/my-plugin

# 使用相对路径
cd my-plugin/
claude plugins install .
```

**安装选项**:

```bash
# 跳过依赖安装（快速测试）
claude plugins install my-plugin --no-deps

# 强制重新安装
claude plugins install my-plugin --force

# 全局安装（所有项目可用）
claude plugins install my-plugin --global

# 静默安装（无进度输出）
claude plugins install my-plugin --silent
```

### 3.3 管理已安装Plugins

**查看已安装列表**:

```bash
# 简洁列表
claude plugins list

# 详细信息
claude plugins list --verbose

# 输出示例:
📦 已安装Plugins (3):

1. document-skills:pdf v1.2.0
   📁 路径: .claude/plugins/document-skills/
   📅 安装时间: 2025-12-15 10:23:45
   🔄 更新状态: 最新版本
   📊 使用次数: 47次

2. task-master-ai v2.1.0
   📁 路径: .claude/plugins/task-master-ai/
   📅 安装时间: 2025-12-10 14:12:30
   ⚠️  更新状态: v2.2.0可用
   📊 使用次数: 123次

3. code-review-expert v1.0.5
   📁 路径: .claude/plugins/code-review/
   📅 安装时间: 2025-12-08 09:45:12
   🔄 更新状态: 最新版本
   📊 使用次数: 89次
```

**更新Plugins**:

```bash
# 更新单个Plugin
claude plugins update task-master-ai

# 更新所有Plugins
claude plugins update --all

# 检查可用更新（不实际更新）
claude plugins outdated

# 输出:
# 📦 可更新Plugins (1):
#    task-master-ai: v2.1.0 -> v2.2.0
#    Changelog: https://github.com/task-master/releases/v2.2.0
```

**禁用/启用Plugin**:

```bash
# 临时禁用（不卸载）
claude plugins disable document-skills:pdf

# 重新启用
claude plugins enable document-skills:pdf

# 查看禁用状态
claude plugins list --show-disabled
```

**查看Plugin详情**:

```bash
# 显示Plugin元数据
claude plugins info document-skills:pdf

# 输出:
📦 document-skills:pdf v1.2.0

📝 描述:
   Comprehensive PDF manipulation toolkit for extracting text,
   tables, creating new PDFs, merging/splitting documents.

👤 作者: Anthropic Agent Skills Team
🔗 仓库: https://github.com/anthropics/document-skills
📜 License: MIT
⭐ 评分: 4.8/5.0 (1,234 安装)

🏷️  Tags: pdf, document, extract, merge, split

🔧 提供的工具:
   - extract_pdf_text: 提取文本
   - extract_pdf_tables: 提取表格
   - create_pdf: 创建新PDF
   - merge_pdfs: 合并PDF
   - split_pdf: 拆分PDF

📋 依赖:
   - @anthropic/pdf-lib ^2.1.0
   - pdfjs-dist ^3.11.174

🔗 相关Plugins:
   - pdf-analyzer: 高级PDF分析
   - ocr-plugin: PDF OCR识别
```

### 3.4 Plugin配置

**全局配置**（`.claude/settings.json`）:

```json
{
  "plugins": {
    "enabled": true,
    "autoUpdate": true,
    "updateCheckInterval": 86400,  // 24小时检查一次
    "allowList": [],  // 空数组=允许所有
    "denyList": ["untrusted-plugin"],
    "marketplace": {
      "sources": [
        "https://code.claude.com/plugins/index.json",
        "https://raw.githubusercontent.com/jeremylongshore/claude-code-plugins-plus/main/index.json"
      ]
    }
  }
}
```

**单个Plugin配置**（`.claude/plugins/<plugin-name>/config.json`）:

```json
{
  "document-skills:pdf": {
    "enabled": true,
    "config": {
      "maxFileSize": "50MB",
      "cacheEnabled": true,
      "defaultDPI": 300,
      "ocrLanguage": "eng+chi_sim"
    }
  }
}
```

---

## 第4章:创建自定义Plugin

### 4.1 Plugin结构规范

**最小Plugin结构**:

```
my-plugin/
├── plugin.json          # 必需: Plugin元数据
├── README.md            # 推荐: 使用文档
├── skills/              # 可选: Agent Skills
│   └── my-skill/
│       ├── SKILL.md
│       └── prompts/
├── commands/            # 可选: Slash Commands
│   └── my-command.md
├── hooks/               # 可选: Hooks
│   └── pre-commit.py
└── mcp/                 # 可选: MCP配置
    └── mcp-config.json
```

**plugin.json规范**（Anthropic 2025 Schema）:

```json
{
  "schema": "https://schemas.anthropic.com/claude-code/plugin/v1",
  "name": "my-awesome-plugin",
  "displayName": "My Awesome Plugin",
  "version": "1.0.0",
  "description": "A plugin that does awesome things",
  "author": {
    "name": "Your Name",
    "email": "you@example.com",
    "url": "https://github.com/yourname"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/my-plugin"
  },
  "keywords": ["utility", "automation"],
  "engines": {
    "claudeCode": ">=2.0.0"
  },
  "capabilities": {
    "skills": true,
    "commands": true,
    "hooks": true,
    "mcp": false
  },
  "dependencies": {
    "@anthropic/skill-utils": "^1.0.0"
  },
  "config": {
    "schema": {
      "type": "object",
      "properties": {
        "apiKey": {
          "type": "string",
          "description": "Your API key"
        }
      }
    },
    "default": {
      "apiKey": ""
    }
  }
}
```

### 4.2 创建第一个Plugin: Hello World

**步骤1:创建Plugin目录**

```bash
# 创建Plugin目录
mkdir -p my-first-plugin/commands
cd my-first-plugin
```

**步骤2:创建plugin.json**

```json
{
  "schema": "https://schemas.anthropic.com/claude-code/plugin/v1",
  "name": "hello-world-plugin",
  "displayName": "Hello World Plugin",
  "version": "1.0.0",
  "description": "A simple hello world plugin",
  "author": {
    "name": "Claude Student"
  },
  "license": "MIT",
  "capabilities": {
    "commands": true
  }
}
```

**步骤3:创建Commands**

`commands/hello.md`:

```markdown
Say hello to the user in a friendly way.

Steps:
1. Get the current user's name from the system
2. Get the current time
3. Respond with a personalized greeting

Example output:
"Hello, Alice! 👋 It's 10:23 AM. How can I help you today?"
```

**步骤4:创建README.md**

```markdown
# Hello World Plugin

A simple plugin that demonstrates Plugin creation.

## Features

- `/hello` command for friendly greetings

## Installation

\`\`\`bash
claude plugins install /path/to/hello-world-plugin
\`\`\`

## Usage

\`\`\`bash
claude
> /hello
\`\`\`
```

**步骤5:本地测试**

```bash
# 从当前目录安装
claude plugins install .

# 测试命令
claude
> /hello

# 预期输出:
Hello, Alice! 👋 It's 10:23 AM. How can I help you today?
```

**步骤6:发布到GitHub**

```bash
# 初始化Git仓库
git init
git add .
git commit -m "Initial commit: Hello World Plugin"

# 推送到GitHub
git remote add origin https://github.com/yourname/hello-world-plugin.git
git push -u origin main
```

现在其他人可以安装:

```bash
claude plugins install https://github.com/yourname/hello-world-plugin
```

📸 **截图位置**:[显示Hello World Plugin的完整目录结构和运行效果]

### 4.3 进阶Plugin: PDF Watermark工具

**需求**:创建一个为PDF添加水印的Plugin

**完整项目结构**:

```
pdf-watermark-plugin/
├── plugin.json
├── README.md
├── LICENSE
├── skills/
│   └── pdf-watermark/
│       ├── SKILL.md
│       ├── prompts/
│       │   ├── watermark-instructions.md
│       │   └── batch-watermark.md
│       └── tools/
│           └── watermark.py
├── commands/
│   └── add-watermark.md
└── examples/
    └── sample-usage.md
```

**plugin.json**:

```json
{
  "schema": "https://schemas.anthropic.com/claude-code/plugin/v1",
  "name": "pdf-watermark",
  "displayName": "PDF Watermark Plugin",
  "version": "1.0.0",
  "description": "Add text/image watermarks to PDF files",
  "author": {
    "name": "PDF Tools Team",
    "email": "team@pdftools.com"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/pdftools/watermark-plugin"
  },
  "keywords": ["pdf", "watermark", "document", "branding"],
  "engines": {
    "claudeCode": ">=2.0.0"
  },
  "capabilities": {
    "skills": true,
    "commands": true
  },
  "dependencies": {
    "@anthropic/skill-utils": "^1.0.0",
    "pypdf": "^3.17.0",
    "pillow": "^10.1.0"
  },
  "config": {
    "schema": {
      "type": "object",
      "properties": {
        "defaultText": {
          "type": "string",
          "description": "Default watermark text",
          "default": "CONFIDENTIAL"
        },
        "defaultOpacity": {
          "type": "number",
          "description": "Watermark opacity (0-1)",
          "default": 0.3,
          "minimum": 0,
          "maximum": 1
        },
        "defaultPosition": {
          "type": "string",
          "description": "Watermark position",
          "enum": ["center", "top-right", "bottom-right", "diagonal"],
          "default": "diagonal"
        }
      }
    }
  }
}
```

**skills/pdf-watermark/SKILL.md**:

```markdown
# PDF Watermark Skill

Add text or image watermarks to PDF files with customizable positioning, opacity, and styling.

## Capabilities

1. **Text Watermarks**: Add customizable text overlays
2. **Image Watermarks**: Add logo/image watermarks
3. **Batch Processing**: Watermark multiple PDFs at once
4. **Position Control**: Center, corners, diagonal placement
5. **Opacity Control**: Transparent to opaque watermarks

## Usage Examples

### Add text watermark
\`\`\`
Add "DRAFT" watermark to contract.pdf, diagonal placement, 30% opacity
\`\`\`

### Add image watermark
\`\`\`
Add company-logo.png to all PDFs in /documents, top-right corner
\`\`\`

### Batch watermark
\`\`\`
Add "CONFIDENTIAL" to all PDFs in current folder, save to /watermarked
\`\`\`

## Configuration

See plugin config in `.claude/plugins/pdf-watermark/config.json`
```

**skills/pdf-watermark/tools/watermark.py**:

```python
#!/usr/bin/env python3
"""
PDF Watermark Tool
Add text/image watermarks to PDF files
"""
import sys
import json
from pathlib import Path
from typing import Literal

try:
    from pypdf import PdfReader, PdfWriter
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Error: Required packages not installed")
    print("Run: pip install pypdf pillow")
    sys.exit(1)

def add_text_watermark(
    input_pdf: str,
    output_pdf: str,
    text: str = "WATERMARK",
    position: Literal["center", "top-right", "bottom-right", "diagonal"] = "diagonal",
    opacity: float = 0.3,
    font_size: int = 50
) -> bool:
    """
    Add text watermark to PDF

    Args:
        input_pdf: Input PDF file path
        output_pdf: Output PDF file path
        text: Watermark text
        position: Placement position
        opacity: Transparency (0-1)
        font_size: Font size in points

    Returns:
        True if successful
    """
    try:
        reader = PdfReader(input_pdf)
        writer = PdfWriter()

        for page in reader.pages:
            # Get page dimensions
            page_width = float(page.mediabox.width)
            page_height = float(page.mediabox.height)

            # Create watermark image
            img = Image.new('RGBA', (int(page_width), int(page_height)), (255, 255, 255, 0))
            draw = ImageDraw.Draw(img)

            # Calculate position
            font = ImageFont.load_default()
            text_bbox = draw.textbbox((0, 0), text, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]

            if position == "center":
                x = (page_width - text_width) / 2
                y = (page_height - text_height) / 2
            elif position == "top-right":
                x = page_width - text_width - 20
                y = 20
            elif position == "bottom-right":
                x = page_width - text_width - 20
                y = page_height - text_height - 20
            elif position == "diagonal":
                x = page_width / 4
                y = page_height / 2
                img = img.rotate(45, expand=True)

            # Draw text with opacity
            color = (128, 128, 128, int(255 * opacity))
            draw.text((x, y), text, fill=color, font=font)

            # Convert to PDF and overlay
            # ... (完整实现省略,实际需要更多代码)

            writer.add_page(page)

        with open(output_pdf, 'wb') as f:
            writer.write(f)

        return True

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    # CLI入口
    if len(sys.argv) < 3:
        print("Usage: watermark.py <input.pdf> <output.pdf> [text] [position] [opacity]")
        sys.exit(1)

    input_pdf = sys.argv[1]
    output_pdf = sys.argv[2]
    text = sys.argv[3] if len(sys.argv) > 3 else "WATERMARK"
    position = sys.argv[4] if len(sys.argv) > 4 else "diagonal"
    opacity = float(sys.argv[5]) if len(sys.argv) > 5 else 0.3

    success = add_text_watermark(input_pdf, output_pdf, text, position, opacity)

    if success:
        print(f"✅ Watermark added: {output_pdf}")
    else:
        print("❌ Failed to add watermark")
        sys.exit(1)
```

**commands/add-watermark.md**:

```markdown
Add a watermark to a PDF file.

Parameters:
- $1: Input PDF file path
- $2: Watermark text (optional, default: "WATERMARK")
- $3: Position (optional: center|top-right|bottom-right|diagonal, default: diagonal)
- $4: Opacity (optional: 0.0-1.0, default: 0.3)

Steps:
1. Validate input PDF exists
2. Load plugin configuration for default settings
3. Call skills/pdf-watermark/tools/watermark.py with parameters
4. Verify output PDF was created
5. Show success message with output path

Example:
/add-watermark contract.pdf "DRAFT" diagonal 0.5
```

**测试Plugin**:

```bash
# 安装Plugin
cd pdf-watermark-plugin
claude plugins install .

# 测试命令
claude
> /add-watermark test.pdf "CONFIDENTIAL" center 0.4

# 预期输出:
✅ Watermark added: test_watermarked.pdf
```

📸 **截图位置**:[显示带水印的PDF对比图:原始vs添加水印后]

### 4.4 Plugin最佳实践

**规范1:语义化版本号**

```json
{
  "version": "1.2.3"
  //        │ │ │
  //        │ │ └─ Patch: Bug修复
  //        │ └─── Minor: 向后兼容的新功能
  //        └───── Major: 破坏性变更
}
```

**规范2:完善的README**

必须包含:

```markdown
# Plugin Name

一句话描述

## Features
- 功能1
- 功能2

## Installation
\`\`\`bash
安装命令
\`\`\`

## Usage
\`\`\`bash
使用示例
\`\`\`

## Configuration
配置说明

## Troubleshooting
常见问题

## License
```

**规范3:错误处理**

```python
# ❌ 错误示例:直接抛出异常
def process_pdf(file):
    reader = PdfReader(file)  # 可能失败
    return reader

# ✅ 正确示例:友好错误提示
def process_pdf(file):
    try:
        if not Path(file).exists():
            print(f"❌ 文件不存在: {file}")
            return None

        reader = PdfReader(file)
        return reader

    except Exception as e:
        print(f"❌ 处理PDF失败: {e}")
        print("💡 提示: 确认文件未损坏")
        return None
```

**规范4:配置验证**

```python
# 在Plugin初始化时验证配置
def validate_config(config):
    required_fields = ["apiKey", "maxFileSize"]
    for field in required_fields:
        if field not in config:
            raise ValueError(f"Missing required config: {field}")

    if config["maxFileSize"] > 100 * 1024 * 1024:  # 100MB
        print("⚠️  Warning: maxFileSize > 100MB may cause performance issues")
```

**规范5:依赖管理**

```json
{
  "dependencies": {
    "@anthropic/skill-utils": "^1.0.0",  // 使用^允许小版本更新
    "pypdf": "~3.17.0"  // 使用~只允许patch更新
  },
  "peerDependencies": {
    "claudeCode": ">=2.0.0"  // 明确最低版本要求
  }
}
```

---

## 第5章:发布与分享Plugin

### 5.1 发布前检查清单

**必须完成**:

```
✅ plugin.json符合Anthropic 2025 Schema
✅ README.md包含安装和使用说明
✅ LICENSE文件（推荐MIT/Apache 2.0）
✅ 所有依赖在package.json/requirements.txt中声明
✅ 版本号遵循语义化版本规范
✅ 测试通过（至少在本地测试）
```

**推荐完成**:

```
⭐ CHANGELOG.md记录版本变更
⭐ examples/目录包含使用示例
⭐ 截图/GIF展示Plugin效果
⭐ GitHub Topics标签（如claude-code-plugin, pdf, automation）
```

**Schema验证**:

```bash
# 使用官方工具验证
npx @anthropic/plugin-validator validate plugin.json

# 输出示例:
✅ Schema valid (v1)
✅ Required fields present
⚠️  Warning: No examples/ directory found (recommended)
✅ Dependencies declared correctly
```

### 5.2 发布到GitHub

**步骤1:创建GitHub仓库**

```bash
# 本地初始化
cd my-plugin
git init
git add .
git commit -m "Initial release v1.0.0"

# 创建远程仓库（在GitHub网站上创建）
# 然后:
git remote add origin https://github.com/yourname/my-plugin.git
git branch -M main
git push -u origin main
```

**步骤2:创建Release**

在GitHub网站上:

1. 点击 **Releases** -> **Draft a new release**
2. 填写信息:
   - **Tag version**: `v1.0.0`（必须以v开头）
   - **Release title**: `v1.0.0 - Initial Release`
   - **Description**:

   ```markdown
   ## Features
   - Feature 1
   - Feature 2

   ## Installation
   \`\`\`bash
   claude plugins install https://github.com/yourname/my-plugin
   \`\`\`
   ```

3. 点击 **Publish release**

**步骤3:添加Topics**

在仓库主页点击 ⚙️ Settings -> Topics,添加:

```
claude-code-plugin
claude-code
automation
(其他相关标签)
```

### 5.3 提交到官方Marketplace

**前提条件**:

- GitHub仓库公开
- 至少有一个Release
- plugin.json通过Schema验证

**提交流程**:

1. Fork官方Marketplace仓库:
   ```bash
   # Fork https://github.com/anthropics/claude-code-marketplace
   ```

2. 克隆到本地:
   ```bash
   git clone https://github.com/yourname/claude-code-marketplace.git
   cd claude-code-marketplace
   ```

3. 添加你的Plugin:

   编辑`plugins/index.json`:

   ```json
   {
     "plugins": [
       // ... 现有Plugins
       {
         "name": "my-awesome-plugin",
         "displayName": "My Awesome Plugin",
         "description": "Does awesome things",
         "author": "Your Name",
         "repository": "https://github.com/yourname/my-plugin",
         "version": "1.0.0",
         "tags": ["utility", "automation"],
         "verified": false
       }
     ]
   }
   ```

4. 提交Pull Request:

   ```bash
   git checkout -b add-my-plugin
   git add plugins/index.json
   git commit -m "Add: My Awesome Plugin"
   git push origin add-my-plugin
   ```

5. 在GitHub上创建Pull Request

6. 等待审核（通常1-3个工作日）

**审核标准**:

- ✅ plugin.json格式正确
- ✅ README完整
- ✅ 无恶意代码
- ✅ 依赖合理（无过多冗余）
- ✅ 测试通过

审核通过后,你的Plugin将出现在官方Marketplace!

### 5.4 Plugin营销

**提升可见度**:

1. **在README中添加徽章**:

   ```markdown
   ![Claude Code Plugin](https://img.shields.io/badge/Claude%20Code-Plugin-blue)
   ![Version](https://img.shields.io/github/v/release/yourname/my-plugin)
   ![Downloads](https://img.shields.io/github/downloads/yourname/my-plugin/total)
   ```

2. **创建演示视频**:

   - 录制30秒使用演示
   - 上传到YouTube/B站
   - 在README中嵌入

3. **分享到社区**:

   - Anthropic Discord: `#claude-code-plugins`
   - Reddit: r/ClaudeCode
   - Twitter/X: 使用 `#ClaudeCode` tag

4. **撰写博客文章**:

   标题示例:
   - "How I Built a PDF Watermark Plugin for Claude Code"
   - "5 Time-Saving Claude Code Plugins You Should Try"

---

## 第6章:故障排查指南

### 6.1 安装问题

**问题1:Plugin未找到**

```
❌ Error: Plugin 'my-plugin' not found in marketplace
```

**解决方案**:

```bash
# 1. 检查名称拼写
claude plugins search my-plugin

# 2. 刷新Marketplace索引
claude plugins refresh

# 3. 使用完整URL安装
claude plugins install https://github.com/author/my-plugin
```

**问题2:版本冲突**

```
❌ Error: Dependency conflict
   my-plugin@1.0.0 requires skill-utils@^2.0.0
   other-plugin@1.5.0 requires skill-utils@^1.0.0
```

**解决方案**:

```bash
# 方法1:更新冲突的Plugin
claude plugins update other-plugin

# 方法2:安装兼容版本
claude plugins install my-plugin@0.9.0

# 方法3:使用--force强制安装（可能导致问题）
claude plugins install my-plugin --force
```

**问题3:依赖安装失败**

```
❌ Error: Failed to install dependency '@anthropic/pdf-lib'
   npm ERR! 404 Not Found
```

**解决方案**:

```bash
# 1. 检查npm配置
npm config get registry
# 应该是: https://registry.npmjs.org/

# 2. 清理npm缓存
npm cache clean --force

# 3. 手动安装依赖
cd .claude/plugins/my-plugin/
npm install

# 4. 检查Node.js版本
node --version  # 应该>=18.0.0
```

### 6.2 运行时问题

**问题1:Plugin未加载**

```
> /my-command
❌ Unknown command: /my-command
```

**解决方案**:

```bash
# 1. 确认Plugin已安装
claude plugins list

# 2. 检查Plugin是否启用
claude plugins info my-plugin

# 3. 重启Claude Code
claude --restart

# 4. 查看日志
tail -f ~/.claude/logs/plugins.log
```

**问题2:权限错误**

```
❌ Error: Permission denied when executing hook 'pre-commit'
```

**解决方案**:

```bash
# 给脚本添加执行权限
chmod +x .claude/plugins/my-plugin/hooks/pre-commit.sh

# 检查文件所有者
ls -la .claude/plugins/my-plugin/hooks/
```

**问题3:Python依赖问题**

```
❌ ModuleNotFoundError: No module named 'pypdf'
```

**解决方案**:

```bash
# 1. 检查Python版本
python --version  # 应该>=3.8

# 2. 安装依赖
pip install -r .claude/plugins/my-plugin/requirements.txt

# 3. 检查虚拟环境
which python  # 确认使用正确的Python

# 4. 使用插件内置的虚拟环境
cd .claude/plugins/my-plugin
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 6.3 配置问题

**问题1:配置未生效**

```json
// .claude/plugins/my-plugin/config.json
{
  "maxFileSize": "100MB"
}
```

但Plugin仍使用默认值

**解决方案**:

```bash
# 1. 检查配置文件路径
ls -la .claude/plugins/my-plugin/config.json

# 2. 验证JSON格式
jq . .claude/plugins/my-plugin/config.json

# 3. 重启Claude Code使配置生效
claude --restart

# 4. 查看Plugin读取的配置
claude plugins config my-plugin
```

**问题2:环境变量未加载**

Plugin需要`MY_PLUGIN_API_KEY`环境变量

**解决方案**:

```bash
# 方法1:在启动前设置
export MY_PLUGIN_API_KEY="your-key"
claude

# 方法2:在.claude/settings.json中配置
{
  "env": {
    "MY_PLUGIN_API_KEY": "${env:MY_PLUGIN_API_KEY}"
  }
}

# 方法3:Plugin配置文件中设置
{
  "my-plugin": {
    "apiKey": "your-key"  // 不推荐:明文存储
  }
}
```

### 6.4 调试技巧

**启用详细日志**:

```bash
# 设置日志级别
export CLAUDE_LOG_LEVEL=debug

# 启动Claude Code
claude
```

**查看Plugin日志**:

```bash
# 实时查看
tail -f ~/.claude/logs/plugins.log

# 查看特定Plugin日志
grep "my-plugin" ~/.claude/logs/plugins.log

# 查看错误日志
grep "ERROR" ~/.claude/logs/plugins.log
```

**手动测试Plugin脚本**:

```bash
# 直接运行Python脚本
cd .claude/plugins/my-plugin
python tools/my-tool.py --help

# 调试模式运行
python -m pdb tools/my-tool.py
```

---

## 第7章:FAQ（最常见20个问题）

### Q1:Plugin和Skill有什么区别?

**回答**:

| 维度 | Skill | Plugin |
|------|-------|--------|
| 定义 | 单个专业能力 | 打包的扩展(可包含多个Skill) |
| 位置 | `.claude/skills/` | `.claude/plugins/` |
| 分享 | 手动复制 | 一键安装 |
| 更新 | 手动更新 | 自动更新 |

简单理解:**Plugin是Skill的"便携版"**

### Q2:如何查看Plugin使用了多少Token?

**回答**:

```bash
# 查看Plugin统计
claude plugins stats my-plugin

# 输出:
📊 Plugin Statistics: my-plugin
   - Total invocations: 47
   - Total tokens used: 12,345
   - Average tokens per call: 262
   - Last used: 2025-12-15 10:23
```

### Q3:Plugin会访问我的代码吗?

**回答**:

Plugin只能访问Claude Code有权限访问的文件。

**安全措施**:

1. 检查Plugin权限:
   ```bash
   claude plugins permissions my-plugin
   ```

2. 使用沙箱模式:
   ```json
   {
     "plugins": {
       "sandboxMode": true  // 限制文件访问
     }
   }
   ```

3. 审查Plugin代码:
   ```bash
   cat .claude/plugins/my-plugin/plugin.json
   ```

### Q4:Plugin可以离线使用吗?

**回答**:

- ✅ 本地Plugin:可以
- ❌ 需要API的Plugin:不可以（如调用OpenAI API）

检查Plugin是否需要网络:

```bash
claude plugins info my-plugin | grep "requiresNetwork"
```

### Q5:如何卸载所有Plugins?

**回答**:

```bash
# 列出所有Plugin
claude plugins list

# 批量卸载
claude plugins list --format=names | xargs -n1 claude plugins uninstall

# 或手动删除
rm -rf .claude/plugins/*
```

### Q6:Plugin更新会覆盖我的配置吗?

**回答**:

不会。Plugin更新时:

- ✅ 保留:`config.json`（你的配置）
- 🔄 更新:`plugin.json`, `skills/`, `commands/`（Plugin代码）

### Q7:可以同时安装多个版本的Plugin吗?

**回答**:

不可以。解决方案:

```bash
# 方法1:使用全局+项目级隔离
claude plugins install my-plugin@1.0.0 --global
cd project-a
claude plugins install my-plugin@2.0.0  # 项目级

# 方法2:使用别名
claude plugins install my-plugin@1.0.0 --alias my-plugin-v1
claude plugins install my-plugin@2.0.0 --alias my-plugin-v2
```

### Q8:Plugin开发需要懂编程吗?

**回答**:

分情况:

- **只用Commands**:❌ 不需要（写Markdown即可）
- **用Skills+简单脚本**:⚠️ 需要基础Python/JavaScript
- **复杂Plugin**:✅ 需要编程经验

**推荐学习路径**:

1. 先学会安装和使用Plugin（1小时）
2. 修改现有Plugin的配置（30分钟）
3. 创建简单Command Plugin（1小时）
4. 学Python基础（如果需要脚本）
5. 创建完整Plugin（3-5小时）

### Q9:Plugin报错如何获取帮助?

**回答**:

1. **查看Plugin文档**:
   ```bash
   claude plugins info my-plugin
   # 点击README链接
   ```

2. **搜索GitHub Issues**:
   ```
   https://github.com/author/my-plugin/issues
   ```

3. **社区求助**:
   - Discord:`#claude-code-plugins`
   - GitHub Discussions

4. **提交Issue**:

   包含以下信息:
   ```markdown
   ## 环境
   - OS: macOS 14.1
   - Claude Code: v2.0.5
   - Plugin版本: v1.2.0

   ## 重现步骤
   1. 安装Plugin
   2. 运行 /my-command
   3. 报错

   ## 错误日志
   \`\`\`
   粘贴错误信息
   \`\`\`
   ```

### Q10:Plugin可以访问网络吗?

**回答**:

可以,但需要在`plugin.json`中声明:

```json
{
  "permissions": {
    "network": {
      "enabled": true,
      "allowedDomains": [
        "api.example.com",
        "*.github.com"
      ]
    }
  }
}
```

用户安装时会收到提示:

```
⚠️  my-plugin requests network access to:
   - api.example.com
   - *.github.com

Allow? [y/N]
```

### Q11:如何创建收费Plugin?

**回答**:

Claude Code本身不支持付费Plugin,但可以:

1. **License检查**:
   ```python
   def check_license(api_key):
       response = requests.post("https://your-api.com/verify",
                               json={"key": api_key})
       return response.json()["valid"]
   ```

2. **限制功能**:
   - 免费版:基础功能
   - 付费版:高级功能

3. **外部付费**:
   - 在README中提供购买链接
   - 用户购买后获得激活码

### Q12:Plugin支持哪些编程语言?

**回答**:

| 语言 | 支持程度 | 适用场景 |
|------|---------|---------|
| **JavaScript/TypeScript** | ⭐⭐⭐⭐⭐ | MCP集成、CLI工具 |
| **Python** | ⭐⭐⭐⭐⭐ | 数据处理、AI集成 |
| **Shell Script** | ⭐⭐⭐⭐ | 系统操作、自动化 |
| **Go** | ⭐⭐⭐ | 高性能工具 |
| **Rust** | ⭐⭐ | 系统级工具 |
| **其他** | ⭐ | 需要编译为可执行文件 |

### Q13:Plugin可以修改Claude Code设置吗?

**回答**:

可以,但有限制:

```python
# ✅ 允许:读取设置
settings = read_claude_settings()

# ❌ 禁止:直接修改核心设置
# 需要用户确认
```

**推荐做法**:

```python
# 建议用户修改,而不是自动修改
def suggest_config_change():
    print("💡 建议在.claude/settings.json中添加:")
    print(json.dumps({"myPlugin": {"enabled": true}}, indent=2))
```

### Q14:如何为Plugin编写测试?

**回答**:

创建`tests/`目录:

```
my-plugin/
├── plugin.json
├── skills/
├── tests/
│   ├── test_basic.py
│   └── test_integration.py
└── README.md
```

**test_basic.py**:

```python
import pytest
from skills.my_skill.tools import my_function

def test_my_function():
    result = my_function("input")
    assert result == "expected output"

def test_error_handling():
    with pytest.raises(ValueError):
        my_function(None)
```

运行测试:

```bash
cd .claude/plugins/my-plugin
pytest tests/
```

### Q15:Plugin可以依赖其他Plugin吗?

**回答**:

可以,在`plugin.json`中声明:

```json
{
  "pluginDependencies": {
    "document-skills:pdf": "^1.0.0",
    "data-viz-pro": ">=2.0.0"
  }
}
```

安装时会自动安装依赖Plugin。

### Q16:如何调试Plugin在Claude对话中的行为?

**回答**:

```bash
# 启用Plugin调试模式
export CLAUDE_PLUGIN_DEBUG=true

# 启动Claude Code
claude

# 在对话中使用Plugin时,会输出详细日志:
> /my-command test

🔍 [Plugin Debug] my-plugin
   - Command: /my-command
   - Args: ["test"]
   - Context: {...}
   - Execution time: 234ms
```

### Q17:Plugin可以添加新的工具吗（类似Bash/Read）?

**回答**:

可以!通过MCP集成:

```json
{
  "mcp": {
    "servers": {
      "my-tool-server": {
        "command": "node",
        "args": ["./mcp-server.js"]
      }
    }
  }
}
```

**mcp-server.js**:

```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";

const server = new Server({
  name: "my-tool-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "my_custom_tool",
    description: "Does something useful",
    inputSchema: {
      type: "object",
      properties: {
        input: { type: "string" }
      }
    }
  }]
}));
```

### Q18:Plugin如何处理大文件?

**回答**:

**最佳实践**:

1. **分块处理**:
   ```python
   def process_large_file(file_path, chunk_size=1024*1024):
       with open(file_path, 'rb') as f:
           while chunk := f.read(chunk_size):
               process_chunk(chunk)
   ```

2. **流式处理**:
   ```python
   import gzip
   with gzip.open('large.gz', 'rt') as f:
       for line in f:
           process_line(line)
   ```

3. **配置限制**:
   ```json
   {
     "config": {
       "maxFileSize": "50MB",
       "warnFileSize": "10MB"
     }
   }
   ```

### Q19:如何监控Plugin性能?

**回答**:

使用内置性能分析:

```bash
# 启用性能分析
claude plugins profile my-plugin

# 运行Plugin
> /my-command

# 查看报告
claude plugins profile report my-plugin

# 输出:
📊 Performance Report: my-plugin
   Function           Calls    Total Time    Avg Time
   ─────────────────────────────────────────────────
   process_pdf()      12       2.34s         195ms
   extract_text()     48       1.12s         23ms
   save_output()      12       0.45s         38ms
```

### Q20:Plugin可以自定义UI界面吗?

**回答**:

目前不支持GUI,但可以:

1. **Rich CLI输出**:
   ```python
   from rich.console import Console
   from rich.table import Table

   console = Console()
   table = Table(title="Results")
   table.add_column("File")
   table.add_column("Status")
   console.print(table)
   ```

2. **生成HTML报告**:
   ```python
   html = f"""
   <html>
   <body>
       <h1>Plugin Results</h1>
       {content}
   </body>
   </html>
   """
   with open("report.html", "w") as f:
       f.write(html)
   print("📄 报告已生成: report.html")
   ```

3. **使用Web界面**（高级）:
   - 启动本地HTTP服务器
   - 在浏览器中打开

---

## 第8章:资源索引

### 8.1 官方资源

| 资源 | 链接 | 说明 |
|------|------|------|
| **官方文档** | [code.claude.com/docs/en/plugin-marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) | Plugins完整文档 |
| **官方Marketplace** | [code.claude.com/plugins](https://code.claude.com/plugins) | 官方Plugin商店 |
| **Schema规范** | [schemas.anthropic.com/claude-code/plugin/v1](https://schemas.anthropic.com/claude-code/plugin/v1) | Plugin配置规范 |
| **示例仓库** | [github.com/anthropics/claude-code/tree/main/plugins](https://github.com/anthropics/claude-code/tree/main/plugins) | 官方示例Plugin |

### 8.2 社区资源

| 资源 | 链接 | 说明 |
|------|------|------|
| **Jeremy's Marketplace** | [github.com/jeremylongshore/claude-code-plugins-plus](https://github.com/jeremylongshore/claude-code-plugins-plus) | 243个社区Plugin |
| **Composio集成** | [composio.dev/blog/claude-code-plugin](https://composio.dev/blog/claude-code-plugin) | 2000+工具集成 |
| **Discord社区** | `#claude-code-plugins` | 实时讨论 |
| **Reddit** | [r/ClaudeCode](https://reddit.com/r/ClaudeCode) | 社区分享 |

### 8.3 开发工具

| 工具 | 用途 | 安装 |
|------|------|------|
| **Plugin Validator** | 验证plugin.json | `npx @anthropic/plugin-validator` |
| **Plugin Generator** | 生成Plugin模板 | `npx create-claude-plugin` |
| **Schema Linter** | 检查Schema合规性 | `npm install -g claude-schema-lint` |

### 8.4 推荐学习路径

1. **入门**（2小时）:
   - 本教程第1-2章
   - 安装3个官方Plugin体验

2. **进阶**（5小时）:
   - 本教程第4章
   - 创建第一个Plugin
   - 阅读5个热门Plugin源码

3. **精通**（20小时）:
   - 开发复杂Plugin
   - 集成MCP
   - 发布到Marketplace
   - 参与社区贡献

---

## 📚 课程回顾

**本节核心内容**:

1. ✅ Plugins生态概览:理解Plugin vs Commands/Skills/MCP
2. ✅ 5分钟快速开始:安装第一个Plugin
3. ✅ Marketplace深度指南:浏览、安装、管理
4. ✅ 创建自定义Plugin:从Hello World到PDF Watermark
5. ✅ 发布与分享:提交到官方Marketplace
6. ✅ 故障排查:解决常见问题
7. ✅ FAQ:20个最常见问题

**关键要点**:

- Plugin = 可分享的Commands + Skills + Hooks + MCP
- 官方Marketplace + 243个社区Plugin
- 符合Anthropic 2025 Schema规范
- 一键安装,自动更新

**下一步**:

- 实战练习:创建你的第一个Plugin
- 探索Marketplace:找到适合你工作流的Plugin
- 参与社区:分享你的Plugin

---

## 🔗 相关链接

| 资源 | 链接 | 说明 |
|------|------|------|
| **上一节** | [IDE插件配置优化](./IDE插件配置优化.md) | VS Code/Cursor集成 |
| **下一节** | [交互模式高级工作流](./交互模式高级工作流.md) | Plan Mode深入 |
| **GitHub示例** | [github.com/yourname/claude-plugins-examples](https://github.com) | 完整示例代码 |

---

**文档结束** | 更新日期:2025-12-19 | 版本:1.0

---

## Sources

- [Claude Code Plugin Marketplace | AI Tools & Extensions](https://claudemarketplaces.com/)
- [Plugin marketplaces - Claude Code Docs](https://code.claude.com/docs/en/plugin-marketplaces)
- [Improving your coding workflow with Claude Code Plugins - Composio](https://composio.dev/blog/claude-code-plugin)
- [GitHub - jeremylongshore/claude-code-plugins-plus: Claude Code Plugins Hub](https://github.com/jeremylongshore/claude-code-plugins-plus)
