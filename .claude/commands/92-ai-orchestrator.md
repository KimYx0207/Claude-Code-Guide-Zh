---
name: 92-ai-orchestrator
description: 🤖 AI多引擎编排器 - 多AI协作完成开发任务
---

# 92-ai-orchestrator - AI多引擎编排器

**功能**：自动编排本地多个AI CLI工具协作完成开发任务

**使用方法**：
```
/ai-orchestrator [任务描述] [引擎1] [引擎2] [引擎3]
```

**示例**：
```bash
# 使用默认引擎（claude + codex + gemini）
/ai-orchestrator "开发一个用户认证模块"

# 自定义引擎组合
/ai-orchestrator "优化数据库查询性能" claude gpt-4 gemini
```

---

## 🎯 工作流程

这个命令会自动执行以下流程：

1. **阶段1 - 需求分析**（第一个引擎）
   - 分析任务需求
   - 生成技术方案
   - 设计文件结构
   - 输出JSON格式需求文档

2. **阶段2 - 代码生成**（第二个引擎）
   - 读取需求分析结果
   - 生成完整代码
   - 包含注释和错误处理
   - 输出markdown格式代码

3. **阶段3 - 代码审查**（第三个引擎）
   - 审查代码质量
   - 评估功能完整性
   - 发现潜在问题
   - 提出优化建议

4. **生成最终报告**
   - 合并三个阶段的输出
   - 生成完整的markdown报告
   - 自动保存到 `.ai-orchestrator/result.md`

---

## 📦 前置要求

在使用这个命令前，需要确保：

1. **安装AI CLI工具**（至少安装你要用的引擎）：
   ```bash
   npm install -g @anthropic-ai/claude-code
   npm install -g @openai/codex
   npm install -g @google/gemini-cli
   ```

2. **配置API密钥**（在 `.env` 或环境变量中）：
   ```bash
   ANTHROPIC_API_KEY=your_claude_key
   OPENAI_API_KEY=your_openai_key
   GOOGLE_API_KEY=your_gemini_key
   ```

3. **确保bash脚本可执行**：
   ```bash
   chmod +x .claude/skills/ai-orchestrator/scripts/orchestrate.sh
   ```

---

## 🚀 执行步骤

当你运行这个命令时，Claude会执行：

**步骤1**: 读取用户参数（任务描述、引擎选择）

**步骤2**: 调用编排脚本
```bash
bash .claude/skills/ai-orchestrator/scripts/orchestrate.sh \
    "." \
    "$TASK_DESC" \
    "$ENGINE1" \
    "$ENGINE2" \
    "$ENGINE3"
```

**步骤3**: 等待编排完成

**步骤4**: 读取并展示结果
```bash
# 读取最终报告
cat .ai-orchestrator/result.md

# 读取执行日志（如有错误）
cat .ai-orchestrator/orchestration.log
```

---

## 📊 输出结构

执行完成后，会在当前目录生成：

```
.ai-orchestrator/
├── orchestration.log           # 执行日志
├── phase1_requirements.json    # 需求分析（JSON）
├── phase2_code.md              # 生成代码（Markdown）
├── phase3_review.md            # 审查报告（Markdown）
└── result.md                   # 最终合并报告
```

---

## ⚠️ 注意事项

1. **引擎必须本地安装**：这个方案调用的是本地CLI工具，不是API
2. **按顺序执行**：三个阶段是串行的，不是并行
3. **输出格式要求**：确保引擎输出符合预期格式（JSON/Markdown）
4. **API配额**：注意各AI服务的API调用限制

---

## 🎨 自定义配置

如果你想修改编排逻辑，可以编辑：

```bash
.claude/skills/ai-orchestrator/scripts/orchestrate.sh
```

可以自定义：
- 每个阶段的提示词
- 引擎调用参数
- 输出格式
- 错误处理逻辑
