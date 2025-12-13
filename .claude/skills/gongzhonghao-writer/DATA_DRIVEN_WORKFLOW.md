# 数据驱动工作流规范 V1.0

**创建日期**：2025-12-09
**适用范围**：公众号写作助手全项目

---

## 🎯 核心原则

**数据分析结果必须同步到所有依赖代码！**

> "做了数据分析但代码没跟上" = 自己打自己脸

---

## 📊 数据依赖关系图

```
┌─────────────────────────────────────────────────────────────┐
│                    数据源层                                  │
├─────────────────────────────────────────────────────────────┤
│  data/rule_validation_report.json                           │
│  ├── 规则有效性验证结果                                      │
│  ├── effectiveness 指标                                     │
│  └── 爆款规律统计                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    规范文档层                                │
├─────────────────────────────────────────────────────────────┤
│  prompts/baokuan-rules.md                                   │
│  ├── 爆款公式定义                                           │
│  ├── 评分权重说明                                           │
│  └── 数据版本标注 ←── 必须与数据源版本一致                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    脚本实现层                                │
├─────────────────────────────────────────────────────────────┤
│  scripts/title_scorer.py      ← 标题评分逻辑                │
│  scripts/title_generator.py   ← 标题生成逻辑                │
│  scripts/quality_detector.py  ← 质量检测逻辑                │
│  scripts/topic_filter.py      ← 选题过滤逻辑                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    命令调用层                                │
├─────────────────────────────────────────────────────────────┤
│  commands/01-write.md         ← 写作命令                    │
│  commands/02-write-auto.md    ← 自动写作命令                │
│  commands/21-title-gen.md     ← 标题生成命令                │
│  commands/22-title-score.md   ← 标题评分命令                │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ 数据分析后必做清单

执行 `/data-analyze` 或更新 `rule_validation_report.json` 后，**必须**按以下顺序更新：

### 第一步：更新规范文档

| 序号 | 文件 | 更新内容 | 优先级 |
|------|------|----------|--------|
| 1 | `prompts/baokuan-rules.md` | 更新爆款公式、评分权重、数据版本 | 🔴 P0 |

### 第二步：同步脚本实现

| 序号 | 文件 | 更新内容 | 优先级 |
|------|------|----------|--------|
| 2 | `scripts/title_scorer.py` | 同步评分逻辑、权重配置 | 🔴 P0 |
| 3 | `scripts/title_generator.py` | 同步公式列表、生成权重 | 🔴 P0 |
| 4 | `scripts/quality_detector.py` | 同步质量检测规则（如有变化） | 🟠 P1 |
| 5 | `scripts/topic_filter.py` | 同步选题过滤规则（如有变化） | 🟠 P1 |

### 第三步：更新命令文档

| 序号 | 文件 | 更新内容 | 优先级 |
|------|------|----------|--------|
| 6 | `commands/01-write.md` | 同步公式推荐、写作规范 | 🔴 P0 |
| 7 | `commands/02-write-auto.md` | 同步自动写作流程 | 🔴 P0 |
| 8 | `commands/21-title-gen.md` | 同步标题生成说明 | 🟠 P1 |
| 9 | `commands/22-title-score.md` | 同步评分维度说明 | 🟠 P1 |

---

## 🔖 版本标注规范

### 数据源版本标注

在 `rule_validation_report.json` 中必须包含：

```json
{
  "metadata": {
    "version": "V7.1",
    "generated_at": "2025-12-09",
    "article_count": 82,
    "data_range": "2024-01-01 至 2025-12-08"
  }
}
```

### 依赖文件版本标注

所有依赖文件必须在文件头部标注数据版本：

```python
# title_scorer.py
"""
标题评分器 V7.1 - 基于82篇文章数据验证
数据版本：rule_validation_report.json V7.1 (2025-12-09)
"""
```

```markdown
<!-- 01-write.md -->
---
name: write
version: 7.1.0
data_version: rule_validation_report.json V7.1 (2025-12-09)
---
```

---

## 🚨 版本不一致检测

### 手动检查方法

运行以下命令检查版本一致性：

```bash
cd ".claude/skills/gongzhonghao-writer/scripts"
python check_data_sync.py
```

### 自动检查触发

以下操作应触发版本检查：
1. 执行 `/data-analyze` 命令后
2. 修改 `rule_validation_report.json` 后
3. 每周定期检查（建议周一）

---

## 📝 更新示例

### 示例：情绪词规则从正向变为负向

**数据发现**：
```
emotion_word:
  effectiveness: 0.32  ← 负相关！
  recommendation: "❌ 无效规则，考虑删除"
```

**必须更新的文件**：

1. **baokuan-rules.md**：删除情绪词作为正向指标
2. **title_scorer.py**：将情绪词评分从+15改为0
3. **title_generator.py**：不再推荐情绪词
4. **01-write.md**：删除情绪词要求
5. **02-write-auto.md**：删除情绪词要求

---

## ⚠️ 违规后果

如果数据分析后不同步更新代码，将导致：

1. **用户被误导**：系统推荐无效甚至负效果的写法
2. **爆款率下降**：使用过时规则无法产出高质量内容
3. **信任危机**：用户发现系统建议与实际效果不符
4. **维护噩梦**：多处不一致，难以追踪问题根源

---

## 🔄 工作流集成

### 在 /data-analyze 命令中集成

执行数据分析后，命令应自动输出：

```
📊 数据分析完成！

⚠️ 检测到以下规则有变化，请更新对应文件：

【需要更新的文件】
1. prompts/baokuan-rules.md - 更新情绪词规则
2. scripts/title_scorer.py - 修改评分逻辑
3. scripts/title_generator.py - 调整公式权重
4. commands/01-write.md - 同步写作规范
5. commands/02-write-auto.md - 同步自动写作规范

💡 运行 `python check_data_sync.py` 验证同步状态
```

---

## 📋 检查清单模板

每次数据更新后，复制此清单确认完成：

```markdown
## 数据同步检查清单

**数据版本**：V_.__
**更新日期**：____-__-__
**更新人员**：______

### 文件更新确认

- [ ] prompts/baokuan-rules.md
- [ ] scripts/title_scorer.py
- [ ] scripts/title_generator.py
- [ ] scripts/quality_detector.py（如需要）
- [ ] scripts/topic_filter.py（如需要）
- [ ] commands/01-write.md
- [ ] commands/02-write-auto.md
- [ ] commands/21-title-gen.md（如需要）
- [ ] commands/22-title-score.md（如需要）

### 验证确认

- [ ] 运行 check_data_sync.py 通过
- [ ] 标题评分测试通过
- [ ] 标题生成测试通过

### 签字确认

更新完成：______ 日期：______
```

---

**老金总结**：艹，以后谁TM敢只做数据分析不更新代码，就让他把这个文档抄100遍！数据和代码必须对齐，这是铁律！
