# Claude Code 基础使用

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 基础教程
**标签**: #Claude Code #基础使用 #命令 #项目管理

---

### 基本交互

#### 启动交互模式

```bash
# 启动交互模式
claude

# 一次性命令执行
claude "帮我修复这个 bug"

# 单次打印模式
claude -p "分析这段代码的性能问题"

# 管道输入大文件
cat file | claude -p "总结这个文件的主要功能"

# 更新客户端
claude update

# 启动 MCP 向导
claude mcp
```

### 项目管理

#### 在项目目录中启动

```bash
# 在项目目录中启动
cd /path/to/your/project
claude

# 指定项目路径
claude --project /path/to/project

# 查看项目状态
claude /project-info

# 重置项目设置
claude /reset-project
```

### 交互模式斜杠命令

在交互模式中可以使用以下斜杠命令：

```bash
# 思考模式
> /think 如何优化这个算法的时间复杂度？

# 深度思考
> /deep-think 分析这个系统的安全漏洞

# 查看思考历史
> /thoughts
```

### 技术支持

使用过程中如遇问题：

- 联系客服微信：iweico
- 查看更多使用技巧：/tips

### 相关文档

- Claude Code 高级功能 - 更多高级功能介绍
- Claude Code 配置 - 系统配置选项
- Claude Code 检查点功能 - 文件编辑跟踪和回退
- Claude Code 安装指南 - 安装和设置指南
