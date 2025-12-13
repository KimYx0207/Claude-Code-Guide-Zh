# Claude Code 缓存和配置清理指南

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 维护教程
**标签**: #Claude Code #缓存清理 #配置管理

---

Claude Code 在使用过程中会在本地生成大量缓存、日志和临时文件。定期清理这些文件可以释放磁盘空间并解决一些常见问题。

### Windows 系统

#### 使用文件资源管理器

在 c:/用户/你的用户名/ 目录下面找到 .claude 目录和 .claude.json 文件。

对它们进行重命名操作：

```bash
.claude 目录改为 .claude-20251014
.claude.json 文件改为 .claude.json-20251014
```

### macOS 系统

#### 移动本地记录（保留配置）

创建 ccclear.sh 脚本：

```bash
#!/bin/bash

# 移动本地记录（所有项目会话记录会被移动）：
mv  ~/.claude/projects   ~/.claude/projects-`date "+%Y%m%d%H%M%S"`
mv  ~/.claude/shell-snapshots  ~/.claude/shell-snapshots-`date "+%Y%m%d%H%M%S"`
mv  ~/.claude/statsig  ~/.claude/statsig-`date "+%Y%m%d%H%M%S"`
mv  ~/.claude/todos   ~/.claude/todos-`date "+%Y%m%d%H%M%S"`

ls  ~/.claude
```

#### 彻底清理（移动所有配置和记录）

创建 ccmoveconfig.sh 脚本：

```bash
#!/bin/bash

# 彻底版本，移动所有配置和记录：
mv  ~/.claude   ~/.claude-`date "+%Y%m%d%H%M%S"`
mv  ~/.claude.json   ~/.claude.json-`date "+%Y%m%d%H%M%S"`

ls  ~/.claude
```

### 使用方法

#### 赋予脚本执行权限

```bash
chmod +x ccclear.sh
chmod +x ccmoveconfig.sh
```

#### 运行脚本

```bash
# 轻量清理（仅清理缓存和会话记录）
./ccclear.sh

# 完全清理（移动所有配置）
./ccmoveconfig.sh
```

### 清理内容说明

#### .claude 目录结构

- projects/ - 项目会话记录
- shell-snapshots/ - Shell 快照文件
- statsig/ - 统计数据
- todos/ - 待办事项数据
- cache/ - 本地缓存文件
- logs/ - 日志文件

#### .claude.json 文件

包含用户配置信息，如 API 密钥、主题设置等。

### 注意事项

清理操作会移动而非删除文件，确保数据安全。如需恢复，只需将文件夹改回原名即可。

### 最佳实践

#### 定期清理

建议每月清理一次缓存和日志，保持系统性能。

#### 备份配置

清理前务必备份重要配置文件，特别是 .claude.json。

#### 完全退出

清理前确保 Claude Code 完全退出，避免文件锁定。

#### 使用脚本

创建自动化脚本简化清理流程，提高效率。

#### 问题排查

遇到问题时先尝试清理缓存，多数配置问题可通过清理解决。

### 相关文章

- Claude Code 完全卸载指南
- Claude Code 安装指南
- Windows 环境变量设置

### 技术支持

清理过程中如遇问题：

- 联系客服微信：iweico

### 相关文档

- Claude Code 卸载指南 - 完全卸载Claude Code
- Claude Code 安装指南 - 安装和设置
- Claude Code 配置 - 系统配置选项
- Claude Code 高级功能 - 性能优化技巧
