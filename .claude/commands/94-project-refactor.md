---
name: project-refactor
description: 🏗️ 项目架构重构 - 解耦、模块化、分层化
---

# project-refactor - 项目架构重构工具

**功能**：自动分析项目架构，执行解耦、模块化、分层化重构

---

## 🤖 AI执行步骤

### 步骤1：架构分析

**分析维度**：
1. **耦合度分析**
   ```bash
   # 检测硬编码和重复定义
   grep -r "BRAND_WORDS\|CORE_TOOLS\|FORMULAS" --include="*.py" --include="*.md"
   ```

2. **模块职责分析**
   - 检查每个模块是否单一职责
   - 识别混合职责的文件

3. **依赖关系分析**
   - 绘制模块依赖图
   - 识别循环依赖

---

### 步骤2：配置化改造

**执行任务**：

1. **创建配置中心**（如果不存在）
   ```bash
   mkdir -p .claude/skills/gongzhonghao-writer/config
   ```

2. **提取硬编码数据到配置**
   - 扫描所有硬编码常量
   - 创建对应的JSON配置文件
   - 示例：
     - brands_config.json - 品牌词库
     - formulas_config.json - 爆款公式
     - quality_config.json - 质检标准
     - api_config.json - API配置

3. **重构脚本读取配置**
   - 添加配置加载函数
   - 替换硬编码常量为配置读取
   - 提供默认配置（兜底）

---

### 步骤3：模块化拆分

**执行任务**：

1. **前端组件拆分**（如果是Web项目）
   - 识别大文件（>500行）
   - 拆分为独立组件
   - 示例：page.tsx → HomeTab.tsx + WriteTab.tsx + ...

2. **后端服务层拆分**
   - API route只负责路由
   - 业务逻辑抽离到service层
   - 创建：`lib/services/` 目录

3. **共享代码抽离**
   - 工具函数 → `lib/utils/`
   - 类型定义 → `lib/types/`
   - 常量定义 → `lib/constants/`

---

### 步骤4：分层架构

**实施分层**：

```
Layer 1: 用户层（UI/CLI）
    ↓
Layer 2: 应用层（Controllers/Commands）
    ↓
Layer 3: API层（Routes）
    ↓
Layer 4: 业务逻辑层（Services/Scripts）
    ↓
Layer 5: 配置层（Config JSON）
    ↓
Layer 6: 数据层（Storage）
```

**创建标准目录**：
```bash
# 前端分层
web-app/frontend/
├── app/          # 应用层
│   └── api/      # API层
├── lib/          # 业务层
│   ├── services/ # 服务
│   ├── utils/    # 工具
│   └── types/    # 类型
└── components/   # UI层

# 后端分层
.claude/skills/gongzhonghao-writer/
├── config/       # 配置层
├── scripts/      # 业务层
│   ├── core/     # 核心功能
│   └── utils/    # 工具函数
└── prompts/      # 提示词层
```

---

### 步骤5：遵循SOLID原则

**检查并应用**：

1. **S - 单一职责**
   - 每个模块只做一件事
   - 拆分过大的类/函数

2. **O - 开闭原则**
   - 新增功能通过配置扩展，不修改代码
   - 示例：新增爆款公式→修改配置，不修改代码

3. **D - 依赖倒置**
   - 依赖抽象（配置），不依赖具体实现
   - 示例：脚本读取JSON配置，不硬编码

---

### 步骤6：生成重构报告

```markdown
## 🏗️ 架构重构报告

**执行时间**：{当前时间}

### 配置化改造
- ✅ 配置文件创建：X个
- ✅ 脚本重构：X个
- ✅ 硬编码消除：X处

### 模块化拆分
- ✅ 组件拆分：X个大文件→X个小组件
- ✅ 服务层创建：X个service
- ✅ 代码复用：X处

### 分层架构
- ✅ 6层架构实施
- ✅ 职责清晰
- ✅ 依赖方向正确

### 解耦度
- 之前：X处重复定义
- 之后：1个配置源
- 降低耦合：X%

### SOLID原则检查
- ✅ 单一职责
- ✅ 开闭原则
- ✅ 依赖倒置

### 验证
- ✅ TypeScript零错误
- ✅ 所有功能正常
- ✅ 测试通过
```

---

## 🎯 执行顺序

**推荐先后**：
1. 先运行 `/project-clean`（清理冗余）
2. 再运行 `/project-refactor`（架构重构）

**原因**：清理后再重构，避免重构无用代码

---

## ⚠️ 注意事项

1. **备份**：重构前自动创建备份
2. **增量**：不是一次性全改，分阶段进行
3. **验证**：每个阶段后验证功能
4. **可回滚**：保留git历史，可随时回滚
