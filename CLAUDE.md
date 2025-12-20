# 公众号写作助手 - Claude Code AI上下文

**版本**：V9.0 三层架构版 | **更新**：2025-12-20

---

## 核心架构

**三层架构**：Layer1核心工具官方(71%爆款) > Layer2核心工具生态(24%爆款) > Layer3泛AI话题(5%爆款)

**优先级公式**：`priority = layer_score × timeliness × type_weight × brand_tier ÷ risk`

---

## 快速导航

📚 [完整命令速查](docs/guides/commands-cheatsheet.md)
💡 [爆款规律](.claude/skills/gongzhonghao-writer/prompts/rules/baokuan-formulas-v8.md)
✨ [老金风格](.claude/skills/gongzhonghao-writer/prompts/styles/laojin-style-v8.md)

---

## 技术栈

- **Python**：3.11+
- **Claude Code**：Slash Commands
- **Skills**：gongzhonghao-writer
- **配置驱动**：4个JSON配置文件

---

## 关键规范

### 写作流程
1. **写作前必做**：`/topic-filter [选题]` 三层架构过滤
2. 完整写作：`/write [主题]`
3. 发布前检查：`/pre-check`

### 文件命名
```
YYYY-MM-DD_[分类]_[时效]_[品牌]_标题.md
```

### 质量标准
- AI腔 <20分
- 自然度 >80分
- 真诚度 >75分
- 零脏话

---

## 配置中心

**路径**：`.claude/skills/gongzhonghao-writer/config/`
- `core_tools_pool.json` - 三层架构工具池
- `brands_config.json` - 品牌词库
- `formulas_config.json` - 爆款公式
- `quality_config.json` - 质检标准

---

## 详细文档

- Skills系统：`.claude/skills/gongzhonghao-writer/SKILL.md`
- 数据驱动：`.claude/skills/gongzhonghao-writer/DATA_DRIVEN_WORKFLOW.md`

---

## Task Master集成

@./.taskmaster/CLAUDE.md

---

**快速开始**：运行 `/help` 查看所有命令
