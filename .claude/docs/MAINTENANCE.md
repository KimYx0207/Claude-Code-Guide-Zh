# 项目维护自动化总结

**创建日期**：2025-12-12
**版本**：V1.0

---

## 自动化维护机制

### 1. Git Pre-commit Hook（数据同步检查）

**文件**：`.git/hooks/pre-commit`

**功能**：
- 检测`data/rule_validation_report.json`变更
- 自动运行`check_data_sync.py --strict`
- 数据不同步时阻止提交

**使用**：
```bash
git add data/rule_validation_report.json
git commit -m "update data"
# 自动触发检查
```

---

### 2. Git Post-commit Hook（文档更新提醒）

**文件**：`.git/hooks/post-commit`

**功能**：
- 检测.claude/目录变更
- 提醒更新README和架构图
- 建议运行自动更新脚本

**触发条件**：
- 新增/修改命令
- 修改脚本
- articles/目录结构变化

---

### 3. 自动清理脚本

**文件**：`.claude/skills/.../scripts/utils/auto_cleanup.py`

**功能**：
- 清理备份文件（*_backup.*, *.bak等）
- 清理临时文件（*.tmp, .DS_Store等）
- 清理过期日志（>30天）
- 清理空目录
- 清理60天未修改的废弃代码

**使用**：
```bash
# 预览模式（推荐先运行）
python auto_cleanup.py

# 实际执行
python auto_cleanup.py --execute
```

---

## 已清理的冗余

### 今日清理（2025-12-12）

| 项目 | 类型 | 大小 |
|------|------|------|
| mcp-playwright-cdp/ | 嵌套Git仓库 | 59MB |
| topic_filter_v1_backup.py | 备份文件 | <1KB |
| assets/ | 空目录 | 0 |
| deprecated/ | 空目录 | 0 |

**总计节省**：59MB+

---

## 建议的定期维护

### 每周
```bash
# 运行清理脚本
python .claude/skills/.../scripts/utils/auto_cleanup.py
```

### 每月
```bash
# 归档旧文章（可选）
mv articles/published/2024-* articles/archived/2024/

# 清理Git历史（如果仓库过大）
git gc --aggressive --prune=now
```

### 每季度
```bash
# 审查废弃脚本
ls .claude/skills/.../scripts/deprecated/

# 数据分析更新规则
/data-analyze
```

---

## 根目录文件说明

### 必需文件（保留）

| 文件 | 用途 | 大小 |
|------|------|------|
| README.md | 项目说明 | 8.5KB |
| CLAUDE.md | Claude Code上下文 | 13KB |
| WORKFLOW.md | 工作流程图 | 8.9KB |
| .gitignore | Git忽略规则 | <1KB |
| .mcp.json | MCP配置 | <1KB |
| .env.example | 环境变量模板 | <1KB |

### 可清理文件（无）

当前根目录已经很整洁！

---

**维护文档版本**：V1.0
**最后更新**：2025-12-12
