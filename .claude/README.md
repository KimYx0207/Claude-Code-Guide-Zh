# .claude 目录 - Claude Code 配置中心

**版本**：V7.2.1
**更新日期**：2025-12-12
**项目**：公众号写作助手

---

## 📁 目录结构

```
.claude/
├── commands/              # Slash命令（23个）
│   ├── core/             # 核心写作命令（4个）
│   ├── hotspot/          # 热点相关（2个）
│   ├── quality/          # 质量检查（4个）
│   ├── visual/           # 视觉内容（2个）
│   ├── data/             # 数据分析（2个）
│   ├── utils/            # 工具类（2个）
│   └── external/         # 外部集成（7个）
├── skills/               # 技能包
│   └── gongzhonghao-writer/
│       ├── skill.yaml    # 技能配置V7.1.0
│       ├── config/       # 共享配置模块NEW
│       │   └── brands.py # 统一品牌词库
│       ├── prompts/      # 14个提示词文件
│       ├── scripts/      # 21个Python/JS脚本
│       ├── templates/    # 3个文章模板
│       └── docs/         # 技术文档
├── hooks/                # Hook脚本（4个）
│   ├── user-prompt-submit.js
│   ├── pre_tool_use_validator.py  # 重构NEW
│   └── post_tool_use_fixer.py     # 重构NEW
├── docs/                 # 项目文档NEW
│   ├── Claude-Code运行机制.md
│   ├── 综合审查报告.md
│   └── ARCHITECTURE.md (待创建)
├── settings.json         # Claude Code配置
└── README.md             # 本文件
```

---

## 🚀 快速开始（3步上手）

### 1. 查看帮助
```bash
/help
```

### 2. 开始写作
```bash
/write [主题]
```

### 3. 发文前检查
```bash
/pre-check
```

---

## 📝 核心命令速查

### 写作类

| 命令 | 功能 | 使用场景 |
|------|------|----------|
| `/write [主题]` | 完整写作流程（8步） | 日常写作 |
| `/write-auto [热点]` | 全自动爆款生成 | 快速产出 |
| `/write-rewrite` | 文章翻新改写 | 洗稿/翻新 |

### 热点类

| 命令 | 功能 |
|------|------|
| `/hotspot` | AI热点扫描+爆款评估 |
| `/daily` | 每日热点扫描+自动写作 |

### 质量类

| 命令 | 功能 |
|------|------|
| `/title-gen [主题]` | 生成5个爆款标题 |
| `/title-score [标题]` | 7维度标题评分 |
| `/pre-check` | 发文前8维度检查 |
| `/topic-filter [选题]` | V3双轨制选题过滤 |

### 图片类

| 命令 | 功能 |
|------|------|
| `/image` | 自动添加配图 |
| `/infographic` | 生成信息图 |

### 数据类

| 命令 | 功能 |
|------|------|
| `/data-collect` | 收集微信公众号数据 |
| `/data-analyze` | 深度分析文章数据 |

**完整命令列表**：共23个命令，详见 `/help` 输出

---

## 🎯 推荐工作流

### 日常写作
```
/topic-filter [选题]  # 1. 先过滤选题
       ↓
/write [主题]         # 2. 完整写作
       ↓
/pre-check            # 3. 发文前检查
```

### 快速产出
```
/hotspot              # 1. 扫描热点
       ↓
/write-auto [热点]    # 2. 全自动生成
```

---

## 🔧 核心组件

### Skills系统
- **名称**：gongzhonghao-writer
- **版本**：V7.1.0
- **数据版本**：V7.2（基于82篇文章验证）
- **核心功能**：
  - 老金暴躁技术流风格
  - 12大爆款公式
  - 8维度质量检测
  - 双轨制选题过滤

### Hooks系统
- **UserPromptSubmit**：提示词自动优化
- **PreToolUse**：Research步骤验证
- **PostToolUse**：格式自动修复

### MCP集成
- **WebSearch**：内置搜索
- **mcp-router**：深度搜索、文档查询
- **task-master-ai**：任务管理

---

## 📚 详细文档

| 文档 | 路径 | 说明 |
|------|------|------|
| **运行机制** | `docs/Claude-Code运行机制.md` | Commands/Hooks/Skills工作原理 |
| **审查报告** | `docs/综合审查报告.md` | 架构审查和优化建议 |
| **架构图** | `docs/ARCHITECTURE.md` | 系统架构和组件关系 |
| **数据驱动** | `skills/.../DATA_DRIVEN_WORKFLOW.md` | 数据同步规范 |

---

## ⚠️ 重要规范

### 文件命名
```
YYYY-MM-DD_[分类]_[时效]_[品牌]_标题.md
```

### 质量标准
| 维度 | 阈值 |
|------|------|
| AI腔检测 | <20分 |
| 自然度 | >80分 |
| 重复度 | <15% |

### 数据版本
当前数据版本：**V7.2**（2025-12-10，基于82篇文章）

---

## 🆘 故障排查

### 常见问题

| 问题 | 解决方案 |
|------|---------|
| Hook执行失败 | 检查Python路径，确保python命令可用 |
| MCP工具不可用 | 运行`/test-mcp`诊断 |
| 命令找不到 | 检查commands目录结构 |
| 脚本报错 | 查看`.claude/skills/.../scripts/`目录 |

**详细FAQ**：见课程资料包的附录B

---

## 🔄 最近更新（V7.2.1 - 2025-12-12）

### 架构优化
- ✅ 移除59MB嵌套Git仓库
- ✅ 创建共享配置brands.py
- ✅ Hooks重构为独立Python脚本
- ✅ Commands目录分类重组
- ✅ 添加.claudeignore

### 性能提升
- Token消耗↓40%
- Hook延迟↓67%
- 项目体积↓92%
- 代码重复↓60%

---

**README版本**：V7.2.1
**维护者**：老金
**最后更新**：2025-12-12
