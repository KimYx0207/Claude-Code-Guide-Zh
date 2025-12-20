---
title: Claude Code 2.0 完整指南
version: 2.0.71
date: 2025-12-18
tags: [claude-code, cli, vscode, checkpoint, installation, configuration]
keywords: Claude Code, CLI, VS Code扩展, Checkpoint, Cursor集成, 安装指南, 命令参考, RAG
description: Claude Code 2.0.71 完整参考指南，包含安装、配置、功能详解、最佳实践和官方资源
---

# Claude Code 2.0 完整指南

> **版本**：2.0.71（npm发布于2025-12-18）
> **来源**：官方文档 + 社区实践
> **适用场景**：开发者参考、教程编写、团队培训

---

## 📑 目录

1. [版本信息与核心功能](#一版本信息与核心功能)
2. [安装配置](#二安装配置)
3. [VS Code扩展](#三vs-code扩展)
4. [Cursor集成方案](#四cursor集成方案)
5. [Checkpoint系统详解](#五checkpoint系统详解)
6. [CLI与Slash命令完整参考](#六cli与slash命令完整参考)
7. [危险参数与安全实践](#七危险参数与安全实践)
8. [官方资源索引](#八官方资源索引)

---

## 一、版本信息与核心功能

### 1.1 最新版本信息

- **当前版本**：2.0.71
- **发布时间**：2025年12月（持续更新）
- **主要版本**：2.0（2025年9月29日发布）
- **默认模型**：Sonnet 4.5

### 1.2 Claude Code 2.0 核心新功能

#### **1. Checkpoint系统**
- 自动保存代码状态（每次Claude修改前）
- 双击Esc或 `/rewind` 快速回退
- 三种恢复选项：对话/代码/同时恢复
- ⚠️ **重要限制**：只追踪Claude的Write/Edit工具修改，**不追踪bash命令修改的文件**

#### **2. VS Code扩展（Beta）**
- 原生VS Code扩展已正式发布
- 实时查看Claude的改动（侧边栏面板）
- 支持 `@` 文件引用
- 行内差异对比（inline diffs）

#### **3. Subagents（子代理）**
- 委托专门任务给子代理
- 使用 `--agents` 标志定义自定义子代理
- 适合复杂任务拆解

#### **4. Background Tasks（后台任务）**
- 长时间运行的进程（如开发服务器）在后台执行
- 不阻塞Claude Code处理其他任务

#### **5. 新增Slash命令**
- `/install-github-app` - 自动审查PR
- `/init` - 创建CLAUDE.md
- `/plugin` - 管理插件
- `/hooks` - 配置Hooks
- `/mcp` - 管理MCP服务器

#### **6. 改进的终端界面**
- 更好的状态可见性
- 可搜索的提示历史（Ctrl+R）

---

## 二、安装配置

### 2.1 推荐安装方法（官方2025）

| 方法 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| **原生二进制** | macOS/Linux | 最稳定，无依赖冲突 | Windows不支持 |
| **npm全局安装** | 所有平台 | 简单，跨平台 | 需要Node.js |
| **VS Code扩展** | VS Code用户 | IDE深度集成 | 只能在VS Code用 |

### 2.2 最新安装命令

#### **macOS/Linux（推荐）**
```bash
# 稳定版
curl -fsSL https://claude.ai/install.sh | bash

# 最新版
curl -fsSL https://claude.ai/install.sh | bash -s latest
```

#### **Windows PowerShell**
```powershell
irm https://claude.ai/install.ps1 | iex
```

#### **npm安装（跨平台）**
```bash
npm install -g @anthropic-ai/claude-code
```

### 2.3 认证方式

#### **方法1：OAuth认证（推荐）**
- 通过Claude Console完成OAuth流程
- 需要在Anthropic Console开通计费或订阅Claude Pro/Max

#### **方法2：API Key认证**
```bash
export ANTHROPIC_API_KEY=your_key_here
```

---

## 三、VS Code扩展

### 3.1 扩展信息

- **扩展名称**：Claude Code for VS Code
- **发布者**：Anthropic
- **市场地址**：https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code
- **当前版本**：2.0.x（Beta）
- **系统要求**：VS Code 1.98.0+
- **发布时间**：2025年9月

### 3.2 安装方式

#### **方法1：扩展市场安装（推荐）**
1. VS Code按 `Ctrl/Cmd + Shift + X`
2. 搜索："Claude Code"
3. 点击"Install"
4. 重启VS Code

#### **方法2：命令行安装**
```bash
code --install-extension anthropic.claude-code
```

### 3.3 核心功能

1. **侧边栏面板**：专用的Claude Code面板，实时显示AI的修改
2. **内联差异**：代码修改直接在编辑器中高亮显示
3. **Checkpoint系统**：自动保存代码状态，按Esc两次可回滚
4. **@提及功能**：用@符号引用文件、函数、文档
5. **计划审查**：AI给出修改计划，你审查后再执行

### 3.4 快捷键速查

| 快捷键 | 功能 |
|--------|------|
| `Cmd/Ctrl+Shift+P` | 打开命令面板，搜索"Claude Code" |
| `Cmd/Ctrl+Option/Alt+K` | 插入文件引用（@File#L1-99） |
| `Cmd/Ctrl+Shift+X` | 打开扩展视图 |
| `Esc+Esc` | 打开rewind菜单 |

---

## 四、Cursor集成方案

### 4.1 Cursor兼容性说明

**⚠️ 重要发现**：Cursor虽然基于VS Code，但Claude Code扩展**不能自动检测**Cursor为兼容IDE。

**参考资源**：
- Cursor IDE博客：https://www.cursor-ide.com/blog/claude-code-cursor-extension-guide
- GitHub社区方案：https://gist.github.com/sotayamashita/3da81de9d6f2c307d15bf83c9e6e1af6

### 4.2 Cursor安装方法（手动VSIX）

**成功率：100%（社区验证）**

#### **步骤：**

1. **找到Claude Code的VSIX文件**
   - 位置：本地Claude Code安装目录
   - 文件名：`claude-code-x.x.x.vsix`

2. **手动安装到Cursor**
   - 方法A：拖拽VSIX文件到Cursor扩展面板
   - 方法B：命令行安装
     ```bash
     cursor --install-extension /path/to/claude-code.vsix
     ```

**详细指南**：https://www.cursor-ide.com/blog/claude-code-cursor-extension-guide

---

## 五、Checkpoint系统详解

### 5.1 工作原理

- **自动追踪**：Claude的每次文件编辑前自动保存状态
- **持久化**：支持跨会话持久化
- **只追踪Claude工具**：仅追踪Write/Edit工具，不追踪bash命令

### 5.2 访问方式

- **方法1**：双击Esc键（推荐）
- **方法2**：`/rewind` 命令

### 5.3 三种恢复选项

1. **Conversation only** - 保留代码，恢复对话
2. **Code only** - 保留对话，恢复代码
3. **Both** - 同时恢复代码和对话

### 5.4 ⚠️ 重要限制

**Checkpoint不追踪bash命令修改的文件**

- ✅ 追踪：Claude的Write/Edit工具修改
- ❌ 不追踪：bash命令（如 `mv`, `rm`, `sed`）的修改

**建议**：重要操作用Claude的文件工具，不要用bash直接修改文件。

### 5.5 与Git的关系

- Checkpoint用于快速会话级恢复
- 补充但不替代Git版本控制
- **建议**：两者配合使用

---

## 六、CLI与Slash命令完整参考

### 6.1 CLI命令

```bash
# 基础命令
claude                    # 启动交互模式
claude "prompt"           # 单次执行
claude -p "prompt"        # 打印模式
claude --version          # 查看版本
claude --help             # 显示帮助
claude update             # 更新工具

# 会话管理
claude -c                 # 继续最近会话
claude -r <session>       # 恢复指定会话

# 高级选项
claude --project <path>   # 指定项目
claude --model <model>    # 指定模型
claude --verbose          # 详细日志
claude --dangerously-skip-permissions  # 跳过权限检查（危险！）
```

### 6.2 内置Slash命令完整列表

#### **基础命令**
```
/help               显示所有命令
/exit               退出Claude Code
/clear              清空对话历史
/compact            压缩历史记录
/save               保存当前对话
/load               加载已保存对话
/resume             恢复会话
/export             导出对话
/sessions           会话管理
```

#### **思考模式**
```
/think              启用思考模式
/think hard         深度思考模式
/think harder       更深度思考
/ultrathink         极限思考模式
/thoughts           查看思考历史
```

#### **Checkpoint相关**
```
/checkpoint         创建检查点
/rewind             回退到检查点
/checkpoints        查看检查点列表
```

#### **项目管理**
```
/project-info       显示项目信息
/diff               查看代码变更
/undo               撤销上次操作
/init               创建CLAUDE.md文件
```

#### **系统与扩展**
```
/doctor             系统诊断
/account            账户信息
/install-github-app 安装GitHub应用（PR自动审查）
/plugin             管理插件
/hooks              配置Hooks
/mcp                管理MCP服务器
```

---

## 七、危险参数与安全实践

### 7.1 `--dangerously-skip-permissions` 说明

#### **官方定义**

Anthropic官方称之为**"Safe YOLO mode"**（You Only Live Once模式），允许Claude Code跳过所有权限检查，不间断执行直到完成。

**来源**：https://www.anthropic.com/engineering/claude-code-best-practices

### 7.2 风险数据（eesel AI研究）

**震惊的统计数据**：
- **32%的开发者**遇到过**文件误修改**
- **9%遇到过数据损失或损坏**

**来源**：
- https://www.ksred.com/claude-code-dangerously-skip-permissions
- https://blog.promptlayer.com/claude-dangerously-skip-permissions

### 7.3 官方安全建议

1. **容器隔离**：在Docker容器中使用（无网络访问）
2. **白名单限制**：配置 `AllowedTools` 白名单
3. **信任项目**：仅在个人信任的项目中使用
4. **避免生产环境**：公司项目、开源项目禁用

### 7.4 安全配置示例

```json
// .claude/settings.json
{
  "allowedTools": [
    "Read",
    "Grep",
    "Glob",
    "Bash(npm test)",
    "Bash(git status)"
  ]
}
```

**来源**：https://claudelog.com/mechanics/dangerous-skip-permissions

---

## 八、官方资源索引

### 8.1 官方文档

- **Claude Code官网**：https://www.claude.com/product/claude-code
- **官方文档中心**：https://code.claude.com/docs/en/
- **CLI命令参考**：https://docs.anthropic.com/en/docs/claude-code/cli-reference
- **Slash命令文档**：https://code.claude.com/docs/en/slash-commands
- **Checkpoint功能文档**：https://docs.claude.com/en/docs/claude-code/checkpointing
- **VS Code扩展文档**：https://code.claude.com/docs/en/vs-code
- **MCP集成文档**：https://docs.anthropic.com/en/docs/claude-code/mcp

### 8.2 GitHub资源

- **官方GitHub仓库**：https://github.com/anthropics/claude-code
- **更新日志**：https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
- **Anthropic Skills仓库**：https://github.com/anthropics/skills

### 8.3 扩展与包

- **VS Code扩展**：https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code
- **NPM包**：https://www.npmjs.com/package/@anthropic-ai/claude-code

### 8.4 社区资源

- **Cursor集成指南**：https://www.cursor-ide.com/blog/claude-code-cursor-extension-guide
- **最佳实践**：https://www.anthropic.com/engineering/claude-code-best-practices
- **危险参数指南**：https://claudelog.com/mechanics/dangerous-skip-permissions
- **完整教程**：https://claudelog.com/install-claude-code/

### 8.5 官方博客文章

- **Claude Code自主工作能力**：https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously
- **Claude Code插件系统**：https://www.anthropic.com/news/claude-code-plugins

---

## 📌 信息验证说明

### 已验证信息

- ✅ 版本号：2.0.71（npm官方包）
- ✅ VS Code扩展存在（官方市场）
- ✅ Cursor需要手动VSIX安装（社区验证）
- ✅ 危险参数风险数据（eesel AI研究）
- ✅ Checkpoint限制（官方文档确认）

### 信息来源可信度

- 🟢 **官方文档**：Anthropic官网、官方文档站
- 🟢 **官方市场**：VS Code Marketplace、npm
- 🟡 **技术博客**：eesel AI、SmartScope（有数据支撑）
- 🟡 **社区方案**：GitHub Gist、论坛（实践验证）

---

## 📝 使用建议

1. **教程编写**：优先引用官方文档链接，确保信息时效性
2. **版本管理**：定期检查 `npm info @anthropic-ai/claude-code` 获取最新版本
3. **功能验证**：新功能应在官方CHANGELOG中确认
4. **安全实践**：生产项目中禁用 `--dangerously-skip-permissions`

---

**文档版本**：v1.0
**创建时间**：2025-12-18
**下次更新**：当Claude Code发布新版本时
**维护者**：项目开发团队
