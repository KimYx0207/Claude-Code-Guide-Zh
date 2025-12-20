# 命令完整索引

**版本**：V9.0
**更新日期**：2025-12-20
**命令总数**：30个

---

## 按功能分类

### 📝 核心写作（5个）

| 命令 | 功能 | 参数 | 使用频率 |
|------|------|------|---------|
| `/help` | 查看所有命令和工作流 | 无 | ⭐⭐⭐⭐⭐ |
| `/write` | 完整写作流程（8步） | `[主题]` | ⭐⭐⭐⭐⭐ |
| `/write-auto` | 全自动爆款生成 | `[热点]` | ⭐⭐⭐⭐ |
| `/write-rewrite` | 文章翻新改写 | 无 | ⭐⭐⭐ |
| `/zhibo-tutorial` | 直播教程写作规范 | `[源文件]` | ⭐⭐⭐ |

**相关命令**：
- `/write` → `/topic-filter`（写作前）→ `/pre-check`（写作后）
- `/write-auto` → `/hotspot`（找选题）
- `/zhibo-tutorial` → 小白友好+资料验证+正确性检查

---

### 🔥 热点分析（2个）

| 命令 | 功能 | 参数 | 使用频率 |
|------|------|------|---------|
| `/hotspot` | AI热点扫描+爆款评估 | 无 | ⭐⭐⭐⭐ |
| `/daily` | 每日热点扫描+自动写作 | 无 | ⭐⭐⭐ |

**相关命令**：
- `/hotspot` → `/write-auto`（找到热点后）
- `/daily` → 完整自动化流程

---

### ✅ 质量检查（4个）

| 命令 | 功能 | 参数 | 使用频率 |
|------|------|------|---------|
| `/title-gen` | 生成5个爆款标题 | `[主题]` | ⭐⭐⭐⭐⭐ |
| `/title-score` | 7维度标题评分 | `[标题]` | ⭐⭐⭐⭐ |
| `/pre-check` | 发文前8维度检查 | 无 | ⭐⭐⭐⭐⭐ |
| `/topic-filter` | 三层架构选题过滤 | `[选题]` | ⭐⭐⭐⭐⭐ |

**相关命令**：
- `/topic-filter` → `/write`（过滤后写作）
- `/title-gen` → `/title-score`（生成后评分）
- `/pre-check` → 发布（最后一步）

---

### 🖼️ 视觉内容（2个）

| 命令 | 功能 | 参数 | 使用频率 |
|------|------|------|---------|
| `/image` | 自动添加配图 | 无 | ⭐⭐⭐ |
| `/infographic` | 生成信息图 | 无 | ⭐⭐ |

**相关命令**：
- `/write` → `/image`（文章美化）
- `/infographic`（数据可视化）

---

### 📊 数据分析（2个）

| 命令 | 功能 | 参数 | 使用频率 |
|------|------|------|---------|
| `/data-collect` | 收集微信公众号数据 | 无 | ⭐⭐ |
| `/data-analyze` | 深度分析文章数据 | 无 | ⭐⭐ |

**相关命令**：
- `/data-collect` → `/data-analyze`（收集后分析）

---

### 🔧 工具类（4个）

| 命令 | 功能 | 参数 | 使用频率 |
|------|------|------|---------|
| `/test-mcp` | 测试MCP工具可用性 | 无 | ⭐ |
| `/ai-orchestrator` | 多AI协作编排 | 无 | ⭐ |
| `/project-clean` | 项目清理（扫描冗余、整理结构） | 无 | ⭐⭐ |
| `/project-refactor` | 架构重构（解耦、模块化） | 无 | ⭐ |

---

### 🔗 外部集成（7个）

| 命令 | 功能 | 使用频率 |
|------|------|---------|
| `/session-start` | 会话开始 | ⭐⭐ |
| `/taskmaster-init` | 初始化Task Master | ⭐ |
| `/taskmaster-list` | 查看任务列表 | ⭐⭐ |
| `/taskmaster-parse` | 解析PRD文档 | ⭐ |
| `/taskmaster-next` | 获取下一个任务 | ⭐⭐ |

---

## 按使用频率排序

### 🔥 最常用（Top 5）

1. **`/write [主题]`** - 日常写作核心命令
2. **`/topic-filter [选题]`** - 写作前必用
3. **`/pre-check`** - 发布前必用
4. **`/title-gen [主题]`** - 标题生成
5. **`/help`** - 查看帮助

### ⭐ 常用（Top 10）

6. `/write-auto [热点]` - 快速产出
7. `/hotspot` - 找选题
8. `/title-score [标题]` - 标题优化
9. `/image` - 文章美化
10. `/taskmaster-查看所有任务` - 任务管理

---

## 推荐工作流组合

### 工作流1：完整写作流程
```bash
/topic-filter [选题]    # 1. 验证选题可行性
/write [主题]           # 2. 完整写作（含research）
/pre-check              # 3. 发文前检查
/image                  # 4. 可选：添加配图
```

### 工作流2：快速产出
```bash
/hotspot                # 1. 扫描今日热点
/write-auto [热点]      # 2. 全自动生成
```

### 工作流3：数据驱动
```bash
/data-collect           # 1. 收集历史数据
/data-analyze           # 2. 分析爆款规律
/title-gen [主题]       # 3. 基于规律生成标题
/write [主题]           # 4. 写作
```

---

## 命令依赖关系图

```mermaid
graph TD
    A[/topic-filter] --> B[/write]
    C[/hotspot] --> D[/write-auto]
    E[/daily] --> F[自动化流程]

    B --> G[/title-gen]
    G --> H[/title-score]

    B --> I[/pre-check]
    D --> I

    I --> J[/image]
    I --> K[/infographic]

    L[/data-collect] --> M[/data-analyze]
    M --> N[更新规则]
```

---

**索引版本**：V9.0
**最后更新**：2025-12-20
