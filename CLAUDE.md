# 公众号写作助手 - Claude Code AI 上下文文件

**项目版本**：V7.2.1 | **更新日期**：2025-12-12
**架构优化**：2025-12-12完成（16个优化任务，性能提升40%+）

## 1. 项目概览

这是一个用于管理公众号文章创作的项目，配合Claude Code进行AI辅助写作。

**核心理念**：Claude Code的AI本身就是编排器，Slash命令是Markdown提示词，Python脚本是工具。

**V7.2.1更新**：新增文件命名验证器，强制执行命名规范。

## 🔴 文件命名规范（强制）

**格式**：`YYYY-MM-DD_[分类]_[时效]_[品牌]_标题.md`

| 字段 | 可选值 | 说明 |
|------|--------|------|
| 日期 | `2025-12-12` | 当天日期 |
| 分类 | `核心` / `泛AI` | 核心工具类 or 泛AI话题类 |
| 时效 | `热点` / `常青` | 一个月内发布=热点，教程指南=常青 |
| 品牌 | `Cursor`/`Claude`/`Kimi`等 | 核心工具池品牌词 |
| 标题 | 去掉标点的完整标题 | 保持可读性 |

**示例**：
- `2025-12-12_核心_热点_Cursor_Cursor2.2更新Debug Mode来了终于能看AI到底在想啥了.md`

**⚠️ 保存前必须验证**：
```bash
cd ".claude/skills/gongzhonghao-writer/scripts" && python filename_validator.py "文件名.md"
```

## 2. 目录结构

```
公众号写作助手/
├── articles/              # 公众号文章存储目录
├── gac_articles_markdown/ # GAC文章Markdown版本
├── infographics/          # 生成的信息图
├── images/                # 图片资源
├── data/                  # 数据文件
├── .claude/               # Claude Code配置目录
│   ├── commands/          # Slash命令（按功能分组编号）
│   │   ├── 00-help.md         # /help - 帮助中心
│   │   ├── 01-write.md        # /write - 公众号写作
│   │   ├── 02-write-auto.md   # /write-auto - 全自动爆款
│   │   ├── 03-write-rewrite.md # /write-rewrite - 文章翻新
│   │   ├── 11-hotspot.md      # /hotspot - 热点扫描
│   │   ├── 12-daily.md        # /daily - 每日扫描+写作
│   │   ├── 21-title-gen.md    # /title-gen - 标题生成
│   │   ├── 22-title-score.md  # /title-score - 标题评分
│   │   ├── 23-pre-check.md    # /pre-check - 发文前检查
│   │   ├── 24-topic-filter.md # /topic-filter - 选题过滤
│   │   ├── 31-image.md        # /image - 自动配图
│   │   ├── 32-infographic.md  # /infographic - 信息图
│   │   ├── 41-data-collect.md # /data-collect - 数据收集
│   │   ├── 42-data-analyze.md # /data-analyze - 数据分析
│   │   ├── 91-test-mcp.md     # /test-mcp - MCP测试
│   │   └── 92-ai-orchestrator.md # /ai-orchestrator - AI编排
│   ├── skills/            # 技能包
│   │   └── gongzhonghao-writer/
│   │       ├── skill.yaml     # 技能配置
│   │       ├── prompts/       # 提示词
│   │       │   ├── laojin-style-v6-natural.md   # 老金风格
│   │       │   ├── baokuan-rules.md             # 爆款规律V7.2
│   │       │   ├── 选题策略指南.md              # 选题策略V3.0
│   │       │   ├── auto-image-generator.md      # 配图规则
│   │       │   └── infographic-generator.md     # 信息图规则
│   │       └── scripts/       # 工具脚本
│   │           ├── quality_detector.py      # 质量检测
│   │           ├── title_generator.py       # 标题生成器
│   │           ├── title_scorer.py          # 标题评分器
│   │           ├── pre_publish_checker.py   # 发文前检查
│   │           ├── topic_filter.py          # 选题过滤器
│   │           └── infographic_generator.py # 信息图生成
│   ├── hooks/             # Hook脚本
│   ├── settings.json      # Claude Code配置
│   └── README.md          # .claude目录说明
├── scripts/               # 通用脚本
├── docs/                  # 文档目录
└── CLAUDE.md              # 本文件
```

## 3. 命令速查表

### 🆘 帮助
| 命令 | 功能 | 使用场景 |
|------|------|----------|
| `/help` | 查看所有命令和工作流 | 不知道该用什么命令时 |

### ✍️ 写作类 (01-03)
| 命令 | 功能 | 使用场景 |
|------|------|----------|
| `/write [主题]` | 完整写作流程（8步） | 日常写作 |
| `/write-auto [热点]` | 全自动爆款生成 | 快速产出 |
| `/write-rewrite` | 文章翻新改写 | 洗稿/翻新 |

### 🔥 热点类 (11-12)
| 命令 | 功能 | 使用场景 |
|------|------|----------|
| `/hotspot` | AI热点扫描+爆款评估 | 找选题 |
| `/daily` | 每日热点扫描+自动写作 | 日更模式 |

### 📝 标题类 (21-24)
| 命令 | 功能 | 使用场景 |
|------|------|----------|
| `/title-gen [主题]` | 生成5个爆款标题 | 标题灵感 |
| `/title-score [标题]` | 7维度标题评分 | 标题优化 |
| `/pre-check` | 发文前8维度检查 | 发布前 |
| `/topic-filter [选题]` | **V3双轨制选题过滤** | **写作前必用** |

### 🖼️ 图片类 (31-32)
| 命令 | 功能 | 使用场景 |
|------|------|----------|
| `/image` | 自动添加配图 | 文章美化 |
| `/infographic` | 生成信息图 | 数据可视化 |

### 📊 数据类 (41-42)
| 命令 | 功能 | 使用场景 |
|------|------|----------|
| `/data-collect` | 收集微信公众号数据 | 数据采集 |
| `/data-analyze` | 深度分析文章数据 | 爆款规律挖掘 |

### 🔧 工具类 (91-92)
| 命令 | 功能 | 使用场景 |
|------|------|----------|
| `/test-mcp` | 测试MCP工具可用性 | 排障 |
| `/ai-orchestrator` | 多AI协作编排 | 复杂任务 |

## 4. 推荐工作流

### 🚀 日常写作流程
```
/topic-filter [选题]     # 1. 先过滤选题可行性
       ↓
/write [主题]            # 2. 完整写作（自动含标题生成+质量检测）
       ↓
/pre-check               # 3. 发文前最终检查
       ↓
/image 或 /infographic   # 4. 可选：添加配图/信息图
```

### ⚡ 快速产出流程
```
/hotspot                 # 1. 扫描今日热点
       ↓
/write-auto [热点]       # 2. 全自动爆款生成
```

### 📈 数据驱动流程
```
/data-collect            # 1. 收集历史数据
       ↓
/data-analyze            # 2. 分析爆款规律
       ↓
/title-gen [主题]        # 3. 根据规律生成标题
```

## 5. 核心规范文件

| 文件 | 位置 | 用途 |
|------|------|------|
| 老金风格 | `.claude/skills/gongzhonghao-writer/prompts/laojin-style-v6-natural.md` | 写作风格规范 |
| 爆款规律V7.2 | `.claude/skills/gongzhonghao-writer/prompts/baokuan-rules.md` | 数据验证公式+选题过滤V3 |
| 选题策略V3.0 | `.claude/skills/gongzhonghao-writer/prompts/选题策略指南.md` | 双轨制选题分类 |
| 数据驱动规范 | `.claude/skills/gongzhonghao-writer/DATA_DRIVEN_WORKFLOW.md` | 数据分析后必更新清单 |
| 配图规则 | `.claude/skills/gongzhonghao-writer/prompts/auto-image-generator.md` | 配图生成规则 |
| 信息图规则 | `.claude/skills/gongzhonghao-writer/prompts/infographic-generator.md` | 信息图生成规则 |

## 6. 🔧 模块化脚本规范（V7.2）

**核心原则**：所有重复功能必须模块化，命令只调用共享脚本！

### 统一脚本调用规范

| 脚本 | 调用方式 | 使用命令 |
|------|----------|----------|
| 标题生成器 | `python title_generator.py "[主题]" --full` | `/write`, `/write-auto`, `/write-rewrite` |
| 标题评分器 | `python title_scorer.py "[标题]"` | `/title-score` |
| 质量检测 | `python quality_detector.py "[文章路径]"` | `/write`, `/write-auto`, `/write-rewrite` |
| 选题过滤 | `python topic_filter.py "[选题]"` | `/topic-filter`, `/write-auto` |
| 发文前检查 | `python pre_publish_checker.py "[文章路径]"` | `/pre-check` |

### 标题生成器 V7.2 统一输出

**所有写作命令必须调用**：
```bash
cd ".claude/skills/gongzhonghao-writer/scripts" && python title_generator.py "[主题]" --full
```

**输出格式**：
```
============================================================
📌 爆款标题生成报告：[主题]
============================================================

【推荐标题1】[标题内容] ← 推荐
公式：[公式名称]
SEO评分：[分数]分
爆款指数：⭐⭐⭐⭐⭐

【推荐标题2】[标题内容]
...

------------------------------------------------------------
**老金推荐使用：标题1**
推荐理由：[详细推荐理由]
------------------------------------------------------------
```

**公式优先级（82篇数据验证）**：
1. 🏆 工具推荐型 [5.25x] - 最强
2. ⭐ 效率承诺型 [1.68x]
3. ⭐ 痛点解决型 [1.65x]
4. ⭐ 品牌词型 [1.59x]

**⚠️ 已删除无效公式**：FOMO型(0.00x)、情绪词型(0.32x负相关)

### 模块化原则

1. **单一来源**：每个功能只有一个实现（脚本）
2. **命令调用**：Slash命令只负责调用脚本，不内嵌逻辑
3. **数据同步**：数据分析后更新脚本，命令自动获得更新

## 7. 质量检测标准

| 维度 | 阈值 | 说明 |
|------|------|------|
| AI腔检测 | <20分 | 越低越好 |
| 自然度 | >80分 | 越高越好 |
| 真诚度 | >75分 | 越高越好 |
| 啰嗦度 | <25分 | 越低越好 |
| 重复度 | <15% | 越低越好 |
| 可读性 | >85分 | 越高越好 |
| 人味儿指数 | >70分 | 接地气 |
| 情感真实性 | >75分 | 真实情感 |
| 脏话检测 | =0处 | 零容忍 |

## 8. 搜索工具优先级

1. **WebSearch** - 内置搜索（优先使用）
2. **mcp__exa__** - Exa深度搜索
3. **mcp__context7__** - 技术文档查询

## 9. 跨平台命令规范

Claude Code在Windows上运行**Git Bash**，必须使用Unix风格命令：

```bash
# ✅ 正确
find . -name "*.py" -type f
ls -la data/
mkdir -p "data/新目录"

# ❌ 错误（Windows CMD）
dir /s /b *.py
```

## 10. 重要提醒

1. **新用户**：先运行 `/help` 查看所有可用命令
2. **写作前**：**必须先用 `/topic-filter` 过滤选题**（V7.2强化）
3. **发布前**：必须运行 `/pre-check` 做最终检查
4. **质量检测**：写作命令会自动运行质量检测

---

## 11. 🎯 选题过滤器V3双轨制（V7.2新增）

**写作前必须先过滤选题！** 使用 `/topic-filter [选题]` 命令

### 双轨分类

| 分类 | 说明 | 历史平均阅读 | 策略 |
|------|------|-------------|------|
| **核心工具类** | 大厂+AI垂直厂商的工具 | **1798** | 稳定流量，常写 |
| **泛AI话题类** | AI现象/趋势/热点 | 908 | 破圈潜力，精选写 |

### 核心工具池TOP6

| 工具/品牌 | 历史平均阅读 |
|-----------|-------------|
| Kimi/月之暗面 | **3448** |
| Google/Gemini | **3146** |
| ByteDance/即梦 | **2927** |
| Anthropic/Claude | **2118** |
| Cursor | 1246 |
| Codex | 1199 |

### 时效性判断

- **热点期**：发布/上线/更新/版本号/估值/融资/**新产品（一个月内）** → 🔥 快写！
- **常青期**：教程/指南/对比/盘点 → 📚 慢写，打磨质量

**⚠️ 近期新产品判断**：如果选题涉及具体产品名，命令会自动WebSearch确认发布时间

**数据支撑**：核心工具类平均阅读是泛AI话题类的**2倍**！

---

## 12. 🔴 数据驱动规范

**核心原则**：数据分析结果必须同步到所有依赖代码！

### 数据依赖链（V7.2.1优化版）

```
data/rule_validation_report.json  ← 数据源
         ↓
prompts/rules/baokuan-formulas.md ← 规范文档（已重组）
         ↓
config/brands.py                  ← 共享配置NEW
         ↓
scripts/core/*.py                 ← 脚本实现（已分层）
         ↓
commands/core/*.md                ← 命令调用（已分类）
```

**自动化保障**：
- ✅ Git Pre-commit Hook自动检查数据同步（`.git/hooks/pre-commit`）
- ✅ 共享配置消除重复（`config/brands.py`）

### `/data-analyze` 执行后必做

| 优先级 | 文件 | 更新内容 |
|--------|------|----------|
| 🔴 P0 | `prompts/baokuan-rules.md` | 更新公式、权重、版本 |
| 🔴 P0 | `scripts/title_scorer.py` | 同步评分逻辑 |
| 🔴 P0 | `scripts/title_generator.py` | 同步公式权重 |
| 🔴 P0 | `commands/01-write.md` | 同步写作规范 |
| 🔴 P0 | `commands/02-write-auto.md` | 同步自动写作 |
| 🟠 P1 | 其他脚本和命令 | 按需更新 |

**详细规范**：见 `.claude/skills/gongzhonghao-writer/DATA_DRIVEN_WORKFLOW.md`

**版本检查**：`python scripts/check_data_sync.py`

---

## Task Master AI Instructions
**Import Task Master's development workflow commands and guidelines.**
@./.taskmaster/CLAUDE.md
