# Claude Code Config 命令详解

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 配置教程
**标签**: #Claude Code #Config命令 #配置管理 #命令行

---

### 配置命令语法

```bash
claude config <action> [options] [key] [value]
```

### 常用配置命令

#### 设置配置

```bash
# 设置字符串值
claude config set model "claude-3-sonnet"

# 设置数值
claude config set maxTokens 4000

# 设置布尔值
claude config set verbose true

# 设置数组
claude config set ignorePatterns "*.log" "temp/*" "node_modules"
```

#### 查看配置

```bash
# 查看所有配置
claude config list

# 查看特定配置
claude config get model

# 查看配置源
claude config source model
```

#### 管理配置

```bash
# 删除配置
claude config unset verbose

# 重置所有配置
claude config reset

# 导出配置
claude config export > config-backup.json

# 导入配置
claude config import < config-backup.json
```

### 技术支持

配置命令使用过程中如遇问题：

- 联系客服微信：iweico
