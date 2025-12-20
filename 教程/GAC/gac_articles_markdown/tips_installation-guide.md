# Claude Code 安装与配置完整指南

**发布时间**: 📅 2025年1月1日
**作者**: ✍️ GAC Code Team
**分类**: 入门指南
**标签**: #安装 #配置 #新手

---

### 📦 前置要求

在安装 Claude Code 之前，请确保您的系统满足以下要求：

- Node.js: 建议 v18 或更高版本
- npm: 随 Node.js 一起安装
- 操作系统: Windows 10+, macOS 10.15+, 或 Linux

#### 检查 Node.js 版本

```bash
node -v
npm -v
```

如果版本过低，请前往 Node.js 官网 下载最新版本。

### 🚀 安装步骤

#### 方法一：使用 npm 全局安装（推荐）

```bash
npm install -g https://gaccode.com/claudecode/install --registry=https://registry.npmmirror.com
```

#### 方法二：使用国内镜像加速

```bash
npm config set registry https://registry.npmmirror.com
npm install -g https://gaccode.com/claudecode/install
```

#### 验证安装

安装完成后，运行以下命令验证：

```bash
claude -v
```

应该显示版本号 2.0.1，这表明您已成功安装 GAC Code 修改版。

### ⚙️ 配置 API 密钥

#### 1. 获取 API 密钥

前往 GAC Code 官网 注册并获取您的 API 密钥。

#### 2. 设置环境变量

##### macOS / Linux

编辑 ~/.bashrc 或 ~/.zshrc 文件，添加以下内容：

```bash
# GAC Code 配置
export ANTHROPIC_BASE_URL=https://gaccode.com/claudecode
export ANTHROPIC_API_KEY=sk-ant-oat01-xxxxxxxxxxxxxxxx
```

使配置生效：

```bash
source ~/.bashrc  # 或 source ~/.zshrc
```

##### Windows

在 PowerShell 中运行：

```bash
# 临时设置（仅当前会话有效）
$env:ANTHROPIC_BASE_URL = "https://gaccode.com/claudecode"
$env:ANTHROPIC_API_KEY = "sk-ant-oat01-xxxxxxxxxxxxxxxx"

# 永久设置（推荐）
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_BASE_URL', 'https://gaccode.com/claudecode', 'User')
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_API_KEY', 'sk-ant-oat01-xxxxxxxxxxxxxxxx', 'User')
```

#### 3. 程序化批准 API 密钥

为了避免每次使用时都需要手动批准，运行以下命令：

```bash
# macOS / Linux
(cat ~/.claude.json 2>/dev/null || echo 'null') | jq --arg key "${ANTHROPIC_API_KEY: -20}" '(. // {}) | .customApiKeyResponses.approved |= ([.[]?, $key] | unique)' > ~/.claude.json.tmp && mv ~/.claude.json.tmp ~/.claude.json
```

### 🔍 验证配置

运行以下命令测试配置是否正确：

```bash
claude --help
```

如果看到帮助信息，说明配置成功！

### ⚠️ 常见问题

#### 问题 1：权限不足

如果遇到权限错误，尝试使用 sudo：

```bash
sudo npm install -g https://gaccode.com/claudecode/install --registry=https://registry.npmmirror.com
```

#### 问题 2：网络超时

如果下载过程中网络超时，可以：

1. 使用国内镜像源
2. 配置 npm 代理
3. 重试安装命令

#### 问题 3：找不到命令

如果提示 command not found: claude，检查：

1. npm 全局 bin 目录是否在 PATH 中
2. 运行 npm config get prefix 查看全局安装路径
3. 将该路径添加到系统 PATH 环境变量

### 📚 下一步

安装完成后，您可以：

- 查看使用技巧了解基本用法
- 阅读路线选择指南优化连接速度
- 探索高级功能发掘更多可能

### 💬 获取帮助

如遇到问题，请：

- 查看常见问题
- 联系客服（微信：iweico）
- 访问 GAC Code 社群
