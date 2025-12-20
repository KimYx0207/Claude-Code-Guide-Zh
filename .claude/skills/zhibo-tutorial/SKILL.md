# 直播教程写作 Skill

**版本**：V2.1 | **更新**：2025-12-17
**类别**：技术教程 | **用途**：将原始内容转换为小白友好的教程文档
**触发关键词**：直播教程、教程写作、技术教程、教学文档

---

## 核心能力

将原始教程内容转换为**小白友好**的直播教程文档，独立于公众号写作，拥有完整的Claude Code功能支持。

### 三大原则

| 原则 | 要求 | 详细指南 |
|------|------|----------|
| **小白友好** | 每个操作解释"是什么"+"为什么"+"怎么做" | `instructions/01-xiaobai-friendly.md` |
| **资料验证** | WebSearch验证版本号、安装方式、常见问题 | `instructions/02-websearch-verification.md` |
| **正确性检查** | 每步有验证方法、预期输出、错误处理 | `instructions/03-verification-format.md` |

---

## 快速使用

**触发方式**：说"直播教程"即可自动应用规范

**输入**：原始教程内容（备份文件、笔记等）

**输出**：符合规范的直播教程Markdown文档

**质量检查**：
```bash
python .claude/skills/zhibo-tutorial/scripts/tutorial_quality_checker.py <文件路径>
```

---

## 执行流程

```
资料验证 → 内容分析 → 结构重组 → 小白友好化 → 质量检查
```

**详细流程**：见 `instructions/04-workflow.md`

---

## 文档结构模板

**标准章节结构**：
```
课程信息框 → 学习目标 → 术语表 → 为什么学 → 前置条件
→ 核心步骤（每步验证）→ 常见问题 → 总结与速查表
```

**完整模板与示例**：见 `instructions/05-template.md`

---

## 格式规范

**Markdown格式要求**：见 `instructions/06-markdown-format.md`

**核心要点**：
- ❌ 禁止`<details>`折叠标签（飞书不兼容）
- ✅ 使用标准Markdown表格和引用块
- ✅ 代码块必须标注语言（bash、powershell、python等）
- ✅ 跨平台命令分开写（Windows PowerShell 7 / macOS/Linux）
- ✅ 使用emoji增强可读性（✅❌💡⚠️🎯📌）

---

## 完整文件结构

```
.claude/skills/zhibo-tutorial/
├── SKILL.md                       ← 技能概述（本文件）
├── config/tutorial_config.json    ← 质量标准配置
├── instructions/                  ← 渐进式加载指令（6个文件）
│   ├── 01-xiaobai-friendly.md
│   ├── 02-websearch-verification.md
│   ├── 03-verification-format.md
│   ├── 04-workflow.md
│   ├── 05-template.md
│   └── 06-markdown-format.md
└── scripts/tutorial_quality_checker.py ← 质量检查脚本

.claude/commands/06-zhibo-tutorial.md   ← Slash命令
```

---

## Claude Code功能支持

- **Skills系统**：渐进式加载，SKILL.md简洁概述 + instructions详细指令
- **Slash Command**：`/zhibo-tutorial` 触发完整规范
- **配置驱动**：`tutorial_config.json` 定义质量标准，全部可配置
- **质量检查器**：`tutorial_quality_checker.py` 自动评分验证

**使用质量检查器**：
```bash
python .claude/skills/zhibo-tutorial/scripts/tutorial_quality_checker.py 教程.md
# 输出：完整性、小白友好度、验证覆盖率评分
```

---

## 与公众号写作的区别

| 维度 | 直播教程 | 公众号文章 |
|------|----------|-----------|
| **目标** | 教会操作 | 吸引阅读 |
| **受众** | 零基础小白 | AI爱好者 |
| **风格** | 技术规范 | 老金暴躁流 |
| **验证** | 每步都要验证 | 不需要 |

---

## 参考资源

**标杆文档**：`教程/Claude Code教程/课程资料包/01-环境与安装/Claude-Code完整安装指南.md`（2,500行，⭐⭐⭐⭐⭐）

---

**更新历史**：V2.1 - 完整Claude Code功能支持（Skills+Commands+Config+Scripts）
