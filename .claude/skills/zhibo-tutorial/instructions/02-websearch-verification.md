# 资料搜索验证流程

**核心原则**：所有技术信息必须通过WebSearch验证，确保准确性。

---

## 一、必须验证的信息类型

### 1. 版本信息（最重要！）

**验证内容**：
1、软件最新稳定版本号
2、LTS版本号（如果有）
3、最低系统要求
4、兼容性矩阵（哪些版本可以搭配使用）

**搜索模板**：
```
[软件名] latest stable version 2025
[软件名] LTS version 2025
[软件名] system requirements
```

**示例**：
```
Node.js latest LTS version 2025
→ 结果：Node.js 22.x.x 是当前LTS版本

Claude Code latest version 2025
→ 结果：Claude Code v2.0.71
```

### 2. 安装方式

**验证内容**：
1、官方推荐的安装方式
2、不同操作系统的差异
3、是否需要管理员权限
4、安装后的验证命令

**搜索模板**：
```
[软件名] official installation guide
[软件名] install on [Windows/macOS/Linux]
[软件名] npm install vs yarn
```

### 3. 常见问题和解决方案

**验证内容**：
1、安装过程常见错误
2、错误信息对应的解决方案
3、权限问题处理
4、网络问题处理

**搜索模板**：
```
[软件名] common installation errors
[软件名] [错误信息关键词] solution
[软件名] permission denied fix
[软件名] network timeout solution
```

---

## 二、验证流程（5步法）

### 步骤1：确定验证清单

在开始写教程前，列出需要验证的信息：

```markdown
## 待验证信息清单

□ 软件版本：当前最新稳定版是？
□ 前置依赖：需要哪些软件？版本要求？
□ 安装命令：官方推荐的安装命令？
□ 环境变量：需要配置什么？
□ 验证方法：如何确认安装成功？
□ 常见错误：有哪些已知问题？
```

### 步骤2：执行WebSearch

**搜索顺序**：
1、先搜官方文档
2、再搜社区讨论（Stack Overflow、GitHub Issues）
3、最后搜中文资料（作为补充）

**搜索示例**：
```
WebSearch: "Node.js 22 official installation guide site:nodejs.org"
WebSearch: "Claude Code installation 2025 site:anthropic.com"
WebSearch: "npm install permission denied solution site:stackoverflow.com"
```

### 步骤3：交叉验证

**规则**：重要信息至少找到2个来源确认

**格式**：
```markdown
**信息**：Node.js 22是当前LTS版本
**来源1**：https://nodejs.org/en（官网）
**来源2**：https://github.com/nodejs/release#release-schedule（官方发布日程）
**验证状态**：✅ 已确认
```

### 步骤4：记录信息来源

**必须记录**：
1、信息来源URL
2、验证日期
3、信息类型（官方/社区/第三方）

**格式**：
```markdown
| 信息项 | 内容 | 来源 | 验证日期 |
|--------|------|------|----------|
| Node.js版本 | v22.11.0 LTS | nodejs.org | 2025-12-17 |
| 安装命令 | npm install -g | anthropic.com | 2025-12-17 |
```

### 步骤5：标注在文档中

**标注格式**：
```markdown
> 📌 **信息来源**：[Node.js官网](https://nodejs.org/) | 验证日期：2025-12-17

> 📌 **信息来源**：[Anthropic文档](https://docs.anthropic.com/) | 验证日期：2025-12-17
```

---

## 三、信息新鲜度检查

### 过期信息识别规则

**需要重新验证的情况**：
1、文档写于30天前 → 需要重新验证版本号
2、软件有重大更新 → 需要重新验证安装方式
3、引用的链接失效 → 需要找新来源

### 版本号更新检查

```markdown
## 版本号更新检查清单

□ Node.js：每月检查LTS版本
□ npm：跟随Node.js更新
□ Claude Code：每周检查更新
□ 其他工具：按需检查
```

---

## 四、验证标记规范

### 文档顶部标记

```markdown
> **课程信息**
> ...
> **信息验证**：✅ 已通过WebSearch验证（YYYY-MM-DD）
```

### 章节内标记

```markdown
> 📌 **信息来源**：[来源名称](URL) | 验证日期：YYYY-MM-DD
```

### 未验证信息标记

```markdown
> ⚠️ **待验证**：此信息需要进一步确认
```

---

## 五、验证检查清单

写完教程后，用以下清单自查：

```markdown
## 资料验证检查清单

□ 所有版本号都通过WebSearch验证了
□ 安装命令是官方推荐的
□ 常见错误都找到了解决方案
□ 每个信息都标注了来源
□ 来源URL都可以正常访问
□ 验证日期都标注了
```
