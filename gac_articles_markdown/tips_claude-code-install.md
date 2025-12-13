# Claude Code 官方版本安装指南

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 安装教程
**标签**: #Claude Code #官方版本 #安装配置

---

本指南将帮助您安装和配置 Claude Code 官方版本，并正确设置中转服务的环境变量。

### 1️⃣ 安装 Node.js（已安装可跳过）

确保 Node.js 版本 ≥ 18.0

#### Ubuntu / Debian 用户

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo bash -
sudo apt-get install -y nodejs
node --version
```

#### macOS 用户

```bash
sudo xcode-select --install
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
node --version
```

#### Windows 用户

访问 Node.js 官网 下载并安装 LTS 版本。

### 卸载旧版本（可选）

如果需要卸载现有的 Claude Code，请参考 Claude Code 完全卸载指南。

### 2️⃣ 安装 Claude Code

安装官方版本的 Claude Code：

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

### 3️⃣ 开始使用

#### 获取认证信息

1. Auth Token：ANTHROPIC_AUTH_TOKEN - 您的认证令牌，格式类似："cr_..."
2. API地址：ANTHROPIC_BASE_URL - 中转服务的 API 地址

#### 基本使用

在您的项目目录下运行：

```bash
cd your-project-folder
export ANTHROPIC_AUTH_TOKEN=cr_...
export ANTHROPIC_BASE_URL=给你的连接点url
claude 你是什么大模型
```

运行后的步骤：

1. 选择您喜欢的主题 + Enter
2. 确认安全须知 + Enter
3. 使用默认 Terminal 配置 + Enter
4. 信任工作目录 + Enter

开始在终端里和您的 AI 编程搭档一起写代码吧！🚀

### 4️⃣ 配置环境变量（推荐）

#### Mac 和 Linux 环境变量

```bash
export ANTHROPIC_BASE_URL="连接点url"
export ANTHROPIC_AUTH_TOKEN="你的key"
cd your-project-folder
claude
```

#### Windows cmd 命令行环境变量

```bash
set ANTHROPIC_BASE_URL=连接点url
set ANTHROPIC_AUTH_TOKEN=你的key
cd your-project-folder
claude
```

#### Windows PowerShell 环境变量

```bash
$env:ANTHROPIC_BASE_URL="连接点url"
$env:ANTHROPIC_AUTH_TOKEN="你的key"
cd your-project-folder
claude
```

### 📝 永久配置环境变量

为避免每次重复输入，可将环境变量写入配置文件：

#### Mac 或者 Linux 写到配置文件里面：

```bash
echo -e '\n export ANTHROPIC_AUTH_TOKEN=你的key' >> ~/.bash_profile
echo -e '\n export ANTHROPIC_BASE_URL=连接点url' >> ~/.bash_profile
echo -e '\n export ANTHROPIC_AUTH_TOKEN=你的key' >> ~/.bashrc
echo -e '\n export ANTHROPIC_BASE_URL=连接点url' >> ~/.bashrc
echo -e '\n export ANTHROPIC_AUTH_TOKEN=你的key' >> ~/.zshrc
echo -e '\n export ANTHROPIC_BASE_URL=连接点url' >> ~/.zshrc
```

#### Windows 环境变量配置

1. 右键”此电脑” → “属性” → “高级系统设置” → “环境变量”
2. 在”用户变量”中添加：

变量名：ANTHROPIC_AUTH_TOKEN
变量值：您的认证令牌
变量名：ANTHROPIC_BASE_URL
变量值：您的API地址

- 变量名：ANTHROPIC_AUTH_TOKEN
- 变量值：您的认证令牌
- 变量名：ANTHROPIC_BASE_URL
- 变量值：您的API地址

#### 重启后使用

重启终端后，直接使用：

```bash
cd your-project-folder
claude
```

即可使用 Claude Code

### 🔍 验证安装

确认安装和配置是否成功：

```bash
# 检查 Claude Code 版本
claude --version

# 检查环境变量
echo $ANTHROPIC_AUTH_TOKEN
echo $ANTHROPIC_BASE_URL

# 测试连接
claude "你好，请简单介绍一下自己"
```

### ⚠️ 常见问题

#### 问题 1：命令不存在

如果提示 command not found: claude：

1. 检查 Node.js 是否正确安装：node --version
2. 检查 npm 全局路径：npm config get prefix
3. 将全局路径添加到系统 PATH 中

#### 问题 2：认证失败

如果认证失败：

1. 检查 ANTHROPIC_AUTH_TOKEN 是否正确
2. 确认 ANTHROPIC_BASE_URL 是否可以访问
3. 检查网络连接和防火墙设置

#### 问题 3：权限错误

如果遇到权限问题：

```bash
# macOS/Linux 使用 sudo
sudo npm install -g @anthropic-ai/claude-code

# Windows 使用管理员权限运行 PowerShell
```

### 🎯 快速开始

配置完成后，您可以：

1. 在项目目录中运行 claude 启动交互模式
2. 使用 claude <你的问题> 直接提问
3. 体验 AI 辅助编程的各种功能

### 📚 相关资源

- Claude Code 官方文档
- Claude API 使用指南
- 更多使用技巧

### 💬 获取支持

如果您在安装过程中遇到问题：

- 📞 联系客服微信：iweico
- 💬 加入用户交流群

现在您已经成功安装并配置了 Claude Code！开始您的 AI 编程之旅吧！🚀
