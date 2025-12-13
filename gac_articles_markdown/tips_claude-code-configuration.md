# Claude Code 配置系统

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 配置教程
**标签**: #Claude Code #配置系统 #全局配置 #项目配置

---

### 全局配置

#### 查看所有配置

```bash
# 查看所有配置
claude config list

# 设置全局配置
claude config set --global model claude-opus-3
claude config set --global max-tokens 4000
claude config set --global temperature 0.7

# 重置配置
claude config reset
```

### 项目配置

#### 在项目目录中设置

```bash
# 在项目目录中设置
claude config set --project model claude-sonnet-3.5
claude config set --project ignore-patterns "*.log,temp/*"

# 查看项目配置
claude config list --project

# 继承全局配置
claude config inherit --global
```

### 配置文件

Claude Code 的配置文件位置：

- 全局配置：~/.claude/config.json
- 项目配置：.claude/config.json

### 技术支持

配置过程中如遇问题：

- 联系客服微信：iweico

### 相关文档

- Claude Code 基础使用 - 基本操作指南
- Claude Code 高级功能 - 高级功能配置
- Claude Code 安全设置 - 安全相关配置
- Claude Code 设置指南 - 完整设置流程
