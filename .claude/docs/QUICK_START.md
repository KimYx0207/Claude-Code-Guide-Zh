# Claude Code快速开始指南

**适用对象**：新用户
**预计时间**：5分钟
**更新日期**：2025-12-12

---

## 3步上手

### 第1步：查看帮助（30秒）

```bash
/help
```

你会看到所有可用命令的分类列表。

---

### 第2步：开始第一篇文章（2分钟）

```bash
/write Claude Code教程
```

系统会自动：
1. Research相关资料
2. 生成5个爆款标题
3. 撰写完整文章
4. 质量检测
5. 保存到articles/目录

---

### 第3步：发文前检查（1分钟）

```bash
/pre-check
```

8维度质量检查，确保文章达标。

---

## 5个最常用命令

| 命令 | 用途 | 何时使用 |
|------|------|---------|
| `/write [主题]` | 完整写作 | 日常写作 |
| `/topic-filter [选题]` | 选题过滤 | 写作前验证 |
| `/pre-check` | 质量检查 | 发布前 |
| `/title-gen [主题]` | 生成标题 | 需要标题灵感 |
| `/hotspot` | 热点扫描 | 找选题 |

---

## 2个示例工作流

### 示例1：日常写作

```bash
# 1. 先过滤选题
/topic-filter Cursor最新功能

# 2. 开始写作
/write Cursor Debug Mode深度体验

# 3. 发文前检查
/pre-check
```

---

### 示例2：快速产出

```bash
# 1. 扫描热点
/hotspot

# 2. 选择一个热点，全自动生成
/write-auto Claude 4.5发布
```

---

## 常见问题快速排查

| 问题 | 解决方案 |
|------|---------|
| 命令不识别 | 检查命令拼写，运行`/help`查看完整列表 |
| 脚本报错 | 确保Python环境正常，运行`python --version` |
| MCP工具失败 | 运行`/test-mcp`诊断 |
| 文章质量不达标 | 运行`/pre-check`查看具体问题 |

---

## 下一步

- **详细文档**：见`.claude/README.md`
- **完整命令列表**：见`.claude/commands/INDEX.md`
- **架构说明**：见`.claude/docs/ARCHITECTURE.md`
- **故障排查**：见`.claude/docs/TROUBLESHOOTING.md`

---

**快速开始版本**：V1.0
**最后更新**：2025-12-12
