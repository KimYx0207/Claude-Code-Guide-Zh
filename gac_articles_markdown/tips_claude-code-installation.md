# Claude Code 安装方法

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 安装教程
**标签**: #Claude Code #安装 #配置 #环境变量

---

### 注意事项

Claude 官方不支持中国大陆用户，推荐使用国内镜像站，使用体验完全相同。

### 官方安装

#### 使用 NPM 安装

Windows 用户仍须在 WSL 中使用：

```bash
# 全局安装
npm install -g @anthropic-ai/claude-code

# 验证安装
claude --version
```

#### 系统要求

- Node.js 18.0 或更高版本
- npm 8.0 或更高版本
- 支持的操作系统：Windows (WSL)、macOS、Linux

### 镜像站安装

#### 选择镜像源

推荐使用国内镜像源以提高下载速度：

```bash
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 安装 Claude Code
npm install -g @anthropic-ai/claude-code

# 恢复官方源（可选）
npm config set registry https://registry.npmjs.org
```

#### 验证安装

```bash
# 检查版本
claude --version

# 查看帮助
claude --help

# 运行诊断
claude /doctor
```

### 首次配置

#### API 配置

镜像站用户通常跳过此步骤，直接使用镜像站提供的配置。

如需使用官方 API：

```bash
# 从 https://console.anthropic.com 获取 API Key
export ANTHROPIC_API_KEY="sk-your-key-here"
```

#### 环境变量配置

根据您的 shell 选择配置方式：

##### Bash

```bash
echo 'export ANTHROPIC_API_KEY="sk-your-key-here"' >> ~/.bashrc
source ~/.bashrc
```

##### Zsh

```bash
echo 'export ANTHROPIC_API_KEY="sk-your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

##### Fish

```bash
echo 'set -gx ANTHROPIC_API_KEY "sk-your-key-here"' >> ~/.config/fish/config.fish
```

##### Windows PowerShell

```bash
$env:ANTHROPIC_API_KEY="sk-your-key-here"
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_API_KEY', $env:ANTHROPIC_API_KEY, 'User')
```

#### 基本配置

```bash
# 修改默认设置
claude config set -g model claude-sonnet-4
claude config set -g verbose true
claude config set -g outputFormat text

# 测试安装是否成功
claude "Hello, Claude!"
claude /doctor
```

### 安全设置（可选）

这些设置有一定风险，请根据需要谨慎配置：

```bash
# 禁用遥测数据收集
export DISABLE_TELEMETRY=1

# 禁用错误报告
export DISABLE_ERROR_REPORTING=1

# 禁用非必要的模型调用，节约 token
export DISABLE_NON_ESSENTIAL_MODEL_CALLS=1

# 限制工具权限
claude config set allowedTools "Edit,View"

# 跳过对话框
claude config set hasTrustDialogAccepted true
claude config set hasCompletedProjectOnboarding true

# 设置忽略文件模式
claude config set ignorePatterns ".env,.git,node_modules"
```

### 常见安装问题

#### 权限问题

```bash
# macOS/Linux 使用 sudo
sudo npm install -g @anthropic-ai/claude-code

# 或修改 npm 全局目录权限
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

#### 网络问题

```bash
# 使用国内镜像
npm config set registry https://registry.npmmirror.com

# 或使用代理
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# 安装完成后恢复
npm config delete proxy
npm config delete https-proxy
```

#### 版本冲突

```bash
# 卸载旧版本
npm uninstall -g @anthropic-ai/claude-code

# 清理缓存
npm cache clean --force

# 安装最新版本
npm install -g @anthropic-ai/claude-code@latest
```

#### Node.js 版本问题

```bash
# 检查 Node.js 版本
node --version

# 升级 Node.js（使用 nvm）
nvm install --lts
nvm use --lts

# 或下载最新版本
# https://nodejs.org/
```

### 更新和维护

#### 更新 Claude Code

```bash
# 更新到最新版本
claude update

# 或使用 npm 更新
npm update -g @anthropic-ai/claude-code
```

#### 卸载

如需卸载 Claude Code，请参考 Claude Code 完全卸载指南。

### 安装验证清单

- Node.js 版本 ≥ 18.0
- npm 版本 ≥ 8.0
- Claude Code 安装成功
- 版本命令正常工作
- API 密钥配置完成（如需要）
- 基本配置设置完成
- 测试命令运行正常

### 下一步

安装完成后，您可以：

1. 阅读 Claude Code 基础使用指南
2. 了解 MCP 集成配置
3. 学习 配置系统

### 技术支持

安装过程中如遇问题：

- 联系客服微信：iweico
- 查看故障排除指南：/tips/claude-code-troubleshooting

### 相关文档

- Claude Code 基础使用 - 安装后的基本操作
- Claude Code 配置 - 安装后配置
- Claude Code 设置指南 - 完整设置流程
- Claude Code 卸载指南 - 卸载方法
