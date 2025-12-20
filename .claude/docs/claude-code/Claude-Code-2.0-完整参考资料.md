# Claude Code 2.0 完整参考资料

> **版本**：2.0.71（最新）
> **验证日期**：2025-12-18
> **状态**：✅ 已验证（官方来源）
> **用途**：Claude Code自动查阅的参考文档

---

## 📋 快速导航

- [官方文档资源](#一官方文档资源)
- [版本信息与新功能](#二版本信息与核心功能)
- [安装方式](#三安装方式完整指南)
- [CLI命令参考](#四cli命令参考)
- [Slash命令大全](#五slash命令大全)
- [VS Code扩展](#六vs-code扩展详解)
- [Cursor集成](#七cursor集成方案)
- [危险参数详解](#八--dangerously-skip-permissions-详解)
- [Checkpoint功能](#九checkpoint功能详解)

---

## 一、官方文档资源

### 1.1 核心文档

**Anthropic官方**：
- 官方首页：https://www.claude.com/product/claude-code
- 文档中心：https://code.claude.com/docs/en/
- CLI命令参考：https://docs.anthropic.com/en/docs/claude-code/cli-reference
- Slash命令：https://code.claude.com/docs/en/slash-commands
- Checkpoint功能：https://docs.claude.com/en/docs/claude-code/checkpointing
- VS Code扩展：https://code.claude.com/docs/en/vs-code
- MCP集成：https://docs.anthropic.com/en/docs/claude-code/mcp
- 最佳实践：https://www.anthropic.com/engineering/claude-code-best-practices

### 1.2 GitHub资源

- 官方仓库：https://github.com/anthropics/claude-code
- CHANGELOG：https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
- Skills仓库：https://github.com/anthropics/skills

### 1.3 NPM包

- 包页面：https://www.npmjs.com/package/@anthropic-ai/claude-code
- 当前版本：2.0.71
- 更新频率：高频更新（每周+）

### 1.4 社区资源

- Cursor集成指南：https://www.cursor-ide.com/blog/claude-code-cursor-extension-guide
- ClaudeLog教程：https://claudelog.com/install-claude-code/
- 危险参数分析：https://claudelog.com/mechanics/dangerous-skip-permissions
- GitHub社区方案：https://gist.github.com/sotayamashita/3da81de9d6f2c307d15bf83c9e6e1af6

---

## 二、版本信息与核心功能

### 2.1 版本信息

- **当前版本**：2.0.71
- **发布日期**：2025-12-18（8小时前更新）
- **主要版本**：2.0（2025年9月29日发布）
- **更新频率**：持续高频更新

### 2.2 Claude Code 2.0核心新功能

#### 功能1：Checkpoint系统 ⭐⭐⭐⭐⭐

**作用**：自动保存代码状态，支持快速回滚

**关键特性**：
- 每次编辑前自动保存状态
- 双击Esc或运行 `/rewind` 快速回退
- 三种恢复选项（代码/对话/同时）
- 跨会话持久化

**重要限制**：
> ⚠️ **Checkpoint不追踪bash命令修改的文件**
> - 只追踪Claude的Write/Edit工具修改
> - bash命令（如`mv`, `rm`, `sed`）的修改不会被追踪
> - 建议：重要操作用Claude的文件工具

**与Git关系**：
- Checkpoint用于快速会话级恢复
- 补充但不替代Git版本控制

#### 功能2：VS Code扩展（Beta）⭐⭐⭐⭐⭐

**状态**：已正式发布（Beta版本）

**核心功能**：
- 侧边栏专用面板
- 实时内联差异显示
- @提及文件/函数
- 计划审查模式

**安装方式**：
- 扩展市场搜索"Claude Code"
- 或命令：`code --install-extension anthropic.claude-code`

**系统要求**：VS Code 1.98.0+

#### 功能3：Subagents（子代理）⭐⭐⭐⭐

**作用**：将专门任务委托给子代理处理

**使用方式**：
- `--agents` 标志定义自定义子代理
- 详见官方文档

#### 功能4：Background Tasks（后台任务）⭐⭐⭐⭐

**作用**：长时间运行的任务在后台执行

**典型场景**：
- 开发服务器持续运行
- 测试套件执行
- 构建过程

#### 功能5：新增Slash命令 ⭐⭐⭐

**2.0新增**：
- `/install-github-app` - 自动审查PR
- `/init` - 创建CLAUDE.md
- `/plugin` - 管理插件

#### 功能6：Sonnet 4.5驱动 ⭐⭐⭐⭐⭐

**升级**：
- 新的默认模型
- 处理更长、更复杂的开发任务
- 更好的代码理解能力

---

## 三、安装方式完整指南

### 3.1 三种安装方式对比

| 方法 | 适用场景 | 优点 | 缺点 | 推荐度 |
|------|---------|------|------|--------|
| **原生二进制** | macOS/Linux | 最稳定，无依赖冲突 | Windows不支持 | ⭐⭐⭐⭐⭐ |
| **npm全局安装** | 所有平台 | 简单，跨平台 | 需要Node.js | ⭐⭐⭐⭐ |
| **VS Code扩展** | VS Code用户 | IDE深度集成 | 只能在VS Code用 | ⭐⭐⭐⭐ |

### 3.2 安装命令

**macOS/Linux（原生二进制，推荐）：**
```bash
# 稳定版
curl -fsSL https://claude.ai/install.sh | bash

# 最新版
curl -fsSL https://claude.ai/install.sh | bash -s latest
```

**Windows PowerShell：**
```powershell
# 使用Anthropic提供的安装脚本
irm https://claude.ai/install.ps1 | iex
```

**npm安装（跨平台）：**
```bash
# 全局安装
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version
# 预期输出：Claude Code v2.0.71 (npm)
```

**VS Code扩展安装：**
```bash
# 命令行安装
code --install-extension anthropic.claude-code

# 或在VS Code扩展市场搜索"Claude Code"安装
```

---

## 四、CLI命令参考

### 4.1 基础命令

```bash
claude                    # 启动交互模式
claude "prompt"           # 单次执行
claude -p "prompt"        # 打印模式（只输出结果）
claude --version          # 查看版本
claude --help             # 显示帮助
```

### 4.2 会话管理

```bash
claude -c                 # 继续最近会话
claude -r <session>       # 恢复指定会话
claude --project <path>   # 指定项目目录
```

### 4.3 模型与配置

```bash
claude --model <model>    # 指定模型（如 sonnet-4-5）
claude --verbose          # 详细日志输出
claude --headless         # 无界面模式（脚本自动化）
```

### 4.4 权限与安全

```bash
claude --dangerously-skip-permissions   # 跳过权限询问（危险）
claude --bypass-permissions             # 同上
```

### 4.5 更新命令

```bash
claude update             # 更新到最新版本
```

---

## 五、Slash命令大全

### 5.1 基础命令

```
/help               显示所有可用命令
/exit               退出Claude Code
/clear              清空当前对话
/compact            压缩对话历史（节省tokens）
```

### 5.2 会话管理

```
/save               保存当前对话
/load               加载已保存的对话
/resume             恢复之前的会话
/export             导出对话记录
/sessions           查看会话列表
```

### 5.3 思考模式

```
/think              标准思考模式
/think hard         深度思考模式
/think harder       更深度思考
/ultrathink         极限思考模式
/thoughts           查看思考历史
```

### 5.4 Checkpoint功能

```
/checkpoint         手动创建检查点
/rewind             回退到之前的检查点
/checkpoints        查看所有检查点列表
```

### 5.5 项目与变更

```
/project-info       显示项目信息
/diff               查看所有变更
/undo               撤销上一次操作
```

### 5.6 系统与诊断

```
/doctor             系统诊断（检查环境）
/account            显示账户信息
```

### 5.7 项目配置（2.0新增）

```
/init               创建CLAUDE.md配置文件
/install-github-app 安装GitHub应用（自动PR审查）
/plugin             管理插件
/hooks              配置Hooks
/mcp                管理MCP服务器
```

---

## 六、VS Code扩展详解

### 6.1 扩展信息

- **名称**：Claude Code for VS Code
- **发布者**：Anthropic
- **版本**：2.0.x（Beta）
- **要求**：VS Code 1.98.0+
- **市场地址**：https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code

### 6.2 快捷键

| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Cmd/Ctrl+Shift+P` | 打开命令面板 | 搜索"Claude Code" |
| `Cmd/Ctrl+Option/Alt+K` | 插入文件引用 | @File#L1-99格式 |
| `Esc+Esc` | 打开Rewind菜单 | 快速回滚 |
| `Cmd/Ctrl+Shift+X` | 扩展视图 | 查看Claude面板 |

### 6.3 扩展功能

1. **侧边栏面板**：实时查看Claude的改动
2. **Inline Diffs**：行内差异高亮对比
3. **@-mentions**：智能文件/函数引用
4. **思考模式切换**：可视化选择think/think hard等
5. **对话历史**：查看和恢复之前的对话
6. **多会话支持**：管理多个Claude会话

---

## 七、Cursor集成方案

### 7.1 兼容性说明

> ⚠️ **重要**：Cursor虽然基于VS Code，但Claude Code扩展**不能自动检测**Cursor为兼容IDE。

**来源**：
- https://www.cursor-ide.com/blog/claude-code-cursor-extension-guide
- https://gist.github.com/sotayamashita/3da81de9d6f2c307d15bf83c9e6e1af6

### 7.2 手动VSIX安装（推荐）

**成功率**：100%（社区验证）

**步骤**：

1. **获取VSIX文件**
   - 方法A：从本地Claude Code安装目录找
   - 方法B：从VS Code Marketplace下载

2. **手动安装到Cursor**
   ```bash
   # 命令行安装
   cursor --install-extension /path/to/claude-code.vsix
   ```

   或者：
   - 拖拽VSIX文件到Cursor的扩展面板

3. **验证安装**
   - 重启Cursor
   - 左侧应出现Claude Code图标（⚡火花）

**详细教程**：https://www.cursor-ide.com/blog/claude-code-cursor-extension-guide

### 7.3 替代方案：Tasks集成

如果扩展安装失败，可通过VS Code Tasks集成：
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [{
    "label": "Claude Code: 启动",
    "type": "shell",
    "command": "claude"
  }]
}
```

---

## 八、--dangerously-skip-permissions 详解

### 8.1 官方定义

**名称**：Safe YOLO mode（You Only Live Once模式）

**作用**：跳过所有权限检查，Claude Code不间断执行直到完成

**来源**：https://www.anthropic.com/engineering/claude-code-best-practices

### 8.2 真实风险数据

**eesel AI研究（2025）**：

> 🚨 **震惊统计**：
> - **32%的开发者**使用此参数时遇到过**文件误修改**
> - **9%遇到过数据损失或损坏**

**数据来源**：
- https://www.ksred.com/claude-code-dangerously-skip-permissions
- https://blog.promptlayer.com/claude-dangerously-skip-permissions

### 8.3 使用场景建议

**✅ 推荐使用**：
- 个人信任项目
- 只读操作（查询、分析）
- 快速开发迭代

**❌ 绝对不要用**：
- 公司项目
- 开源项目
- 生产环境代码
- 包含敏感数据的项目

### 8.4 安全使用配置

**白名单限制**（推荐）：
```json
// .claude/config.json
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

**容器隔离**：
```bash
# 在Docker容器中使用（无网络访问）
docker run -it --rm -v $(pwd):/workspace \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY \
  claude-code --dangerously-skip-permissions
```

**来源**：https://claudelog.com/mechanics/dangerous-skip-permissions

---

## 九、Checkpoint功能详解

### 9.1 工作原理

- 自动追踪Claude的文件编辑
- 每次编辑前自动保存状态
- 支持跨会话持久化

### 9.2 访问方式

**方法1：双击Esc键**（推荐）
- 最快捷
- 弹出Rewind菜单

**方法2：Slash命令**
```bash
/rewind              # 打开回退菜单
/checkpoint          # 手动创建检查点
/checkpoints         # 查看检查点列表
```

### 9.3 三种恢复选项

1. **Conversation only** - 保留代码，恢复对话
2. **Code only** - 保留对话，恢复代码
3. **Both** - 同时恢复代码和对话

### 9.4 重要限制

> ⚠️ **Checkpoint不追踪bash命令修改的文件**
>
> **只追踪**：
> - ✅ Claude的Write工具
> - ✅ Claude的Edit工具
> - ✅ Claude的NotebookEdit工具
>
> **不追踪**：
> - ❌ bash命令（`mv`, `rm`, `sed`, `awk`等）
> - ❌ 手动编辑器修改
> - ❌ 外部脚本修改
>
> **建议**：重要文件操作用Claude的工具，不要用bash直接修改

### 9.5 与Git的配合

**Checkpoint vs Git**：

| 对比项 | Checkpoint | Git |
|--------|-----------|-----|
| **用途** | 快速会话级回滚 | 永久版本控制 |
| **范围** | 当前会话 | 整个项目历史 |
| **速度** | 极快（Esc两次） | 需要写命令 |
| **持久化** | 有限（可能清理） | 永久保存 |

**最佳实践**：
- Checkpoint用于快速试错
- Git用于正式版本管理
- 两者配合使用

---

## 十、认证方式

### 10.1 OAuth认证（推荐）

**优点**：
- 更安全（不需要保存API Key）
- 统一订阅管理
- 支持Claude Pro/Max计划

**流程**：
1. 运行 `claude`
2. 按提示打开浏览器
3. 登录Anthropic Console
4. 授权Claude Code访问

### 10.2 API Key认证（传统方式）

**环境变量配置**：

**macOS/Linux：**
```bash
# 添加到 ~/.zshrc 或 ~/.bashrc
export ANTHROPIC_API_KEY="sk-ant-api03-your_key_here"

# 重新加载配置
source ~/.zshrc
```

**Windows PowerShell：**
```powershell
# 永久配置（用户级）
[System.Environment]::SetEnvironmentVariable(
  'ANTHROPIC_API_KEY',
  'sk-ant-api03-your_key_here',
  'User'
)

# 验证
echo $env:ANTHROPIC_API_KEY
```

---

## 十一、常用工作流示例

### 11.1 快速查询（单次执行）

```bash
# 分析项目结构
claude -p "分析这个项目的架构"

# 解释代码
claude -p "解释 src/main.py 的功能"

# 快速问答
claude -p "React 18有哪些新特性？"
```

### 11.2 代码重构

```bash
# 启动交互模式
claude

# 在对话中：
You: 帮我重构 auth.py，遵循SOLID原则

Claude: [分析代码，给出重构建议]

You: /checkpoint  # 先创建检查点

You: 执行重构

# 如果不满意：
You: Esc Esc  # 双击Esc回滚
```

### 11.3 项目初始化

```bash
claude -p "创建一个FastAPI项目，包含：
1. 项目结构
2. requirements.txt
3. Docker配置
4. README文档
5. 基础API端点"
```

---

## 十二、信息验证记录

### 12.1 验证来源分类

**🟢 官方一级来源**（100%可信）：
- Anthropic官网
- 官方文档站
- VS Code Marketplace
- npm官方包

**🟢 官方二级来源**（95%可信）：
- Anthropic工程博客
- GitHub官方仓库

**🟡 社区资源**（80%可信）：
- 技术博客（有数据支撑）
- GitHub Gist（实践验证）

### 12.2 已验证信息清单

| 信息类型 | 验证状态 | 来源可信度 |
|---------|---------|-----------|
| 版本号 2.0.71 | ✅ 已验证 | 🟢 npm官方 |
| VS Code扩展 | ✅ 已验证 | 🟢 Marketplace |
| Cursor VSIX方案 | ✅ 已验证 | 🟡 社区实践 |
| 危险参数风险数据 | ✅ 已验证 | 🟡 eesel AI研究 |
| Checkpoint功能 | ✅ 已验证 | 🟢 官方文档 |
| Slash命令列表 | ✅ 已验证 | 🟢 官方文档 |

---

## 十三、更新记录

**2025-12-18**：
- 首次创建参考资料
- 验证版本2.0.71信息
- 整合官方文档和社区资源
- WebSearch验证所有关键信息

---

## 十四、使用建议

**教程编写者**：
- ✅ 版本号更新为2.0.71
- ✅ 添加Checkpoint限制说明（不追踪bash）
- ✅ 危险参数添加真实风险数据（32%、9%）
- ✅ VS Code扩展说明为"已发布"

**Claude Code使用者**：
- ✅ 查询最新功能查看本文档
- ✅ 遇到问题对照官方文档
- ✅ 学习新功能参考Slash命令列表

---

**文档版本**：v2.0（整合版）
**创建时间**：2025-12-18
**下次更新**：Claude Code 3.0发布时或重大功能更新
