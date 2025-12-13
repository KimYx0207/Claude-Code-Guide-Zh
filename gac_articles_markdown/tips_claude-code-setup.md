# 设置 Claude Code

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 安装教程
**标签**: #Claude Code #安装 #认证 #系统要求

---

在您的开发机器上安装、认证和开始使用 Claude Code。

### 系统要求

- 操作系统：macOS 10.15+、Ubuntu 20.04+/Debian 10+ 或 Windows 10+（带 WSL 1、WSL 2 或 Git for Windows）
- 硬件：4GB+ RAM
- 软件：Node.js 18+（仅 NPM 安装需要）
- 网络：认证和 AI 处理需要互联网连接
- Shell：在 Bash、Zsh 或 Fish 中效果最佳
- 位置：Anthropic 支持的国家/地区

#### 其他依赖项

- ripgrep：通常包含在 Claude Code 中。如果搜索功能失败，请安装 ripgrep。

### 标准安装

#### 原生安装（推荐）

Homebrew (macOS, Linux):

```bash
brew install --cask claude-code
```

macOS, Linux, WSL:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows PowerShell:

```bash
irm https://claude.ai/install.ps1 | iex
```

Windows CMD:

```bash
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

#### NPM 安装

如果您有 Node.js 18 或更新版本：

```bash
npm install -g @anthropic-ai/claude-code
```

安装过程完成后，导航到您的项目并启动 Claude Code：

```bash
cd your-awesome-project
claude
```

### 认证选项

Claude Code 提供以下认证选项：

1. Claude Console：默认选项。通过 Claude Console 连接并完成 OAuth 过程。需要在 console.anthropic.com 处有活跃的账单。将自动为使用跟踪和成本管理创建”Claude Code”工作区。
2. Claude App（Pro 或 Max 计划）：订阅 Claude 的 Pro 或 Max 计划，获得包括 Claude Code 和网络界面的统一订阅。使用您的 Claude.ai 账户登录。
3. 企业平台：配置 Claude Code 以使用 Amazon Bedrock 或 Google Vertex AI 进行企业部署，使用您现有的云基础设施。

Claude Console：默认选项。通过 Claude Console 连接并完成 OAuth 过程。需要在 console.anthropic.com 处有活跃的账单。将自动为使用跟踪和成本管理创建”Claude Code”工作区。

Claude App（Pro 或 Max 计划）：订阅 Claude 的 Pro 或 Max 计划，获得包括 Claude Code 和网络界面的统一订阅。使用您的 Claude.ai 账户登录。

企业平台：配置 Claude Code 以使用 Amazon Bedrock 或 Google Vertex AI 进行企业部署，使用您现有的云基础设施。

### Windows 设置

选项 1：WSL 中的 Claude Code

- 支持 WSL 1 和 WSL 2

选项 2：使用 Git Bash 在原生 Windows 上的 Claude Code

- 需要 Git for Windows
- 对于便携式 Git 安装，指定您的 bash.exe 的路径：
$env:CLAUDE_CODE_GIT_BASH_PATH="C:\Program Files\Git\bin\bash.exe"

```bash
$env:CLAUDE_CODE_GIT_BASH_PATH="C:\Program Files\Git\bin\bash.exe"
```

### 替代安装方法

如果您在安装过程中遇到任何问题，请查阅故障排除指南。

#### 原生安装选项

原生安装是推荐的方法，并提供多个优势：

- 一个自包含的可执行文件
- 无 Node.js 依赖
- 改进的自动更新程序稳定性

如果您已有 Claude Code 的现有安装，请使用 claude install 迁移到原生二进制安装。

macOS、Linux、WSL：

```bash
# 安装稳定版本（默认）
curl -fsSL https://claude.ai/install.sh | bash

# 安装最新版本
curl -fsSL https://claude.ai/install.sh | bash -s latest

# 安装特定版本号
curl -fsSL https://claude.ai/install.sh | bash -s 1.0.58
```

Windows PowerShell：

```bash
# 安装稳定版本（默认）
irm https://claude.ai/install.ps1 | iex

# 安装最新版本
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) latest

# 安装特定版本号
& ([scriptblock]::Create((irm https://claude.ai/install.ps1))) 1.0.58
```

Windows CMD：

```bash
REM 安装稳定版本（默认）
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd

REM 安装最新版本
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd latest && del install.cmd

REM 安装特定版本号
curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd 1.0.58 && del install.cmd
```

#### NPM 安装

对于首选或需要 NPM 的环境：

#### 本地安装

- 通过 npm 全局安装后，使用 claude migrate-installer 移动到本地
- 避免自动更新程序 npm 权限问题
- 某些用户可能会自动迁移到此方法

### 在 AWS 或 GCP 上运行

默认情况下，Claude Code 使用 Claude API。

有关在 AWS 或 GCP 上运行 Claude Code 的详细信息，请参阅第三方集成文档。

### 更新 Claude Code

#### 自动更新

Claude Code 自动保持自身最新状态，以确保您拥有最新的功能和安全修复。

- 更新检查：在启动时和运行时定期执行
- 更新过程：在后台自动下载和安装
- 通知：安装更新时您会看到通知
- 应用更新：更新在您下次启动 Claude Code 时生效

禁用自动更新：

在您的 shell 中设置 DISABLE_AUTOUPDATER 环境变量：

```bash
export DISABLE_AUTOUPDATER=1
```

#### 手动更新

```bash
claude update
```

### 技术支持

安装过程中如遇问题：

- 联系客服微信：iweico

### 相关文档

- Claude Code 安装指南 - 详细安装步骤
- Claude Code 配置 - 系统配置
- Claude Code 基础使用 - 开始使用
- Claude Code 高级功能 - 高级配置
