# Claude Code 安全和权限管理

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 安全教程
**标签**: #Claude Code #安全 #权限管理 #数据保护

---

### 工具权限控制

#### 查看可用工具

```bash
# 查看可用工具
claude /tools

# 限制工具权限
claude config set allowedTools "Edit,View,Terminal"

# 禁用危险工具
claude config set deniedTools "Delete,Execute"

# 设置工具白名单
claude config set toolWhitelist "git,npm,pip,cargo"
```

### 文件访问控制

#### 设置忽略模式

```bash
# 设置忽略模式
claude config set ignorePatterns ".env,.secrets,*.key,id_rsa*"

# 设置只读目录
claude config set readOnlyPaths "/etc,/var,/usr"

# 设置禁止访问的目录
claude config set forbiddenPaths "/root,/home/*/private"
```

### 网络安全

#### 禁用网络访问

```bash
# 禁用网络访问
claude config set networkAccess false

# 允许特定域名
claude config set allowedDomains "github.com,stackoverflow.com"

# 设置代理
claude config set proxy "http://proxy.example.com:8080"
```

### 技术支持

安全配置过程中如遇问题：

- 联系客服微信：iweico

### 相关文档

- Claude Code 配置 - 基本配置选项
- Claude Code 基础使用 - 安全使用建议
- Claude Code 团队协作 - 团队安全策略
- Claude Code 高级功能 - 高级安全功能
