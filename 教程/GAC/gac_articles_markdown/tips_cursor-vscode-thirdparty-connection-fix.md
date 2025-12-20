# 解决 Cursor 和 VSCode 无法使用第三方连接点的问题

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 故障排除
**标签**: #Cursor #VSCode #第三方连接点 #配置问题

---

### 快速解决方案

创建 ~/.claude/config.json 文件（如果已经存在，直接编辑），添加下面内容：

```bash
{
    "primaryApiKey": "xxx"
}
```

注意：xxx 可以不变，也可以改成你服务的名字或者你的 key。

重启 VSCode 和 Cursor 即可。

### Claude Code CLI 配置方案（推荐）

如果上一步已经成功可跳过此部分。Claude Code CLI 是最灵活的方案，完全支持自定义 API 端点。

#### 第一步：安装 Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

#### 第二步：配置环境变量

macOS / Linux：

编辑 ~/.zshrc 或 ~/.bashrc：

```bash
# 添加以下配置
export ANTHROPIC_AUTH_TOKEN="你的认证令牌"
export ANTHROPIC_BASE_URL="第三方连接点URL"
```

```bash
source ~/.zshrc  # 或 source ~/.bashrc
```

Windows：

使用 PowerShell（管理员权限）：

```bash
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_AUTH_TOKEN', '你的认证令牌', 'User')
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_BASE_URL', '第三方连接点URL', 'User')
```

#### 环境变量说明

- ANTHROPIC_AUTH_TOKEN：你的 API 认证令牌（格式：cr_…）
- ANTHROPIC_BASE_URL：第三方连接点的完整 URL

#### 第三步：验证配置

```bash
cd ~/your-project
claude 你好
```

如果配置正确，Claude 应该能够正常响应。

### 日志和调试

启用详细日志以便排查问题：

```bash
# 启用 Claude Code CLI 详细日志
export DEBUG=claude:*
claude 你好

# 或使用 --verbose 标志
claude --verbose 你好
```

### 相关资源

- Claude Code 安装完整指南
- Claude Code 基础使用
- Claude Code 完整使用指南

### 总结

解决 VSCode 和 Cursor 无法使用第三方连接点的问题，关键在于：

✅ 优先使用 Claude Code CLI，它提供最完整的自定义端点支持
✅ 正确配置环境变量，包括 ANTHROPIC_AUTH_TOKEN 和 ANTHROPIC_BASE_URL
✅ 创建 ~/.claude/config.json 文件并设置 primaryApiKey

如果你在配置过程中遇到问题，欢迎查看我们的其他教程。

### 技术支持

配置过程中如遇问题：

- 联系客服微信：iweico
