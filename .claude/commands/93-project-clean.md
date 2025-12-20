---
name: project-clean
description: 🧹 项目文件清理 - 扫描冗余、整理结构
---

# project-clean - 项目文件清理工具

**功能**：自动扫描项目，检测并清理冗余文件，整理目录结构

---

## 🤖 AI执行步骤

### 步骤1：扫描项目结构

```bash
# 扫描所有文件和目录
find . -type f -name "*.md" -o -name "*.py" -o -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .next | grep -v __pycache__
```

**分析**：
- 检测重复的README文件
- 检测重复的配置文件
- 检测功能重复的脚本

---

### 步骤2：检测冗余文件

**检测规则**：
1. **重复README**：
   - 检查：`find . -name "README.md" | grep -v node_modules`
   - 保留：根目录、web-app/、重要子模块
   - 删除：功能重复的README

2. **重复报告**：
   - 检查：`*.md` 文件中的报告类文件
   - 整合：移动到 `docs/reports/YYYY-MM-DD/`
   - 删除：根目录和子目录的散落报告

3. **备份文件**：
   - 检查：`*.backup`, `*.old`, `*-old.*` 等
   - 删除：超过7天的备份

4. **临时文件**：
   - 检查：`temp/`, `tmp/`, `.cache/`
   - 清理：保留最近的，删除旧的

---

### 步骤3：检测重复定义

**检测内容**：
1. **重复函数/类**：
   ```bash
   # 使用grep检测重复定义
   grep -r "^def " --include="*.py" | sort | uniq -d
   grep -r "^class " --include="*.py" | sort | uniq -d
   ```

2. **重复配置**：
   - 检查：brands词库、quality阈值等是否多处定义
   - 确保：单一数据源（SSOT）

---

### 步骤4：整理目录结构

**执行整理**：

```bash
# 1. 创建标准目录结构
mkdir -p docs/{reports,guides,architecture}
mkdir -p .claude/skills/gongzhonghao-writer/config

# 2. 移动报告文件
find . -maxdepth 1 -name "*REPORT*.md" -o -name "*DELIVERY*.md" -o -name "*SUMMARY*.md" | while read f; do
    mv "$f" docs/reports/$(date +%Y-%m-%d)/
done

# 3. 移动指南文档
find . -name "*GUIDE*.md" -o -name "*USAGE*.md" | while read f; do
    mv "$f" docs/guides/
done

# 4. 清理备份文件
find . -name "*.backup" -o -name "*-backup.*" -mtime +7 -delete
```

---

### 步骤5：生成清理报告

```markdown
## 🧹 项目清理报告

**执行时间**：{当前时间}

### 删除的文件
- [ ] 重复README：X个
- [ ] 报告文件：X个（已移至docs/reports/）
- [ ] 备份文件：X个
- [ ] 临时文件：X个

### 整理的目录
- [ ] docs/reports/ - 所有报告
- [ ] docs/guides/ - 使用指南
- [ ] docs/architecture/ - 架构文档

### 检测到的问题
- [ ] 重复定义：X处
- [ ] 冗余代码：X行

### 优化建议
- [ ] 建议1...
- [ ] 建议2...
```

---

## ⚠️ 安全检查

**删除前确认**：
1. 不删除`.git/`、`node_modules/`、`.next/`
2. 不删除data目录的数据文件
3. 备份重要文件到 `docs/archive/`
4. 询问用户确认后再删除

---

## 🎯 预期结果

- ✅ 根目录简洁（只保留核心文件）
- ✅ 文档统一管理（docs/目录）
- ✅ 无重复定义
- ✅ 目录结构清晰
