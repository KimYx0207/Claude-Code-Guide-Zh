# Claude Code 深度研究 - 完整功能指南

**版本**：V1.0
**更新日期**：2025-12-16
**基于**：Claude Code官方文档深度研究

⚠️ **重要**：本文档是Claude Code功能的权威参考，所有项目配置必须遵循！

---

## 📚 核心功能体系

### 1. Hooks系统 - 工作流自动化

**官方文档**：[Hooks Reference](https://code.claude.com/docs/en/hooks)

**核心概念**：
- Hook是自定义shell命令，在特定事件点自动执行
- 实现工作流自动化，无需手动干预

**Hook类型**（全部7种）：

| Hook | 触发时机 | 典型用途 |
|------|---------|---------|
| **UserPromptSubmit** | 用户提交prompt后，Claude处理前 | 自动注入上下文、验证prompt |
| **PreToolUse** | Claude创建工具参数后，执行前 | 参数验证、安全检查 |
| **PostToolUse** | 工具执行成功后 | 后处理、通知、清理 |
| **PermissionRequest** | 显示权限对话框时 | 自动批准/拒绝 |
| **Stop** | Claude主代理完成响应后 | 任务总结、状态保存 |
| **SubagentStop** | 子代理完成任务后 | 子任务后处理 |
| **SessionStart** | 会话启动/恢复时 | 环境初始化 |

**配置示例**（`.claude/settings.json`）：
```json
{
  "hooks": {
    "UserPromptSubmit": [{
      "hooks": [{
        "type": "command",
        "command": "node .claude/hooks/context-injector.js",
        "timeout": 10,
        "statusMessage": "💭 加载上下文..."
      }]
    }],
    "PreToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "python .claude/hooks/validator.py",
        "timeout": 10
      }]
    }]
  }
}
```

**关键特性**：
- ✅ 并行执行所有匹配的hooks
- ✅ 自动去重
- ✅ 审查机制（防止恶意修改）
- ✅ 超时控制（默认60秒）

---

### 2. Skills系统 - 知识封装

**官方资源**：
- [Agent Skills Overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- [GitHub Repository](https://github.com/anthropics/skills)
- [Engineering Blog](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)

**核心设计**：Progressive Disclosure（渐进式披露）

**架构原理**：
```
skill-name/
├── SKILL.md           # 目录级概述（Claude首先读取）
├── instructions/      # 详细指令（按需加载）
│   ├── step1.md
│   └── step2.md
├── scripts/           # 可执行脚本
├── prompts/           # 提示词模板
└── resources/         # 参考资源
```

**Skills vs RAG对比**：

| 特性 | Skills | RAG Pipeline |
|------|--------|--------------|
| **用途** | 重复性强、流程明确的任务 | 动态知识检索 |
| **优势** | 低运维、可重复性高 | 实时性强、知识新鲜 |
| **上下文** | 渐进式加载 | 向量检索 |
| **Token效率** | 极高（按需加载） | 中等 |
| **最佳场景** | 流程自动化、文档生成 | 知识问答、实时查询 |

**混合模式**（最佳实践）：
```python
# Skill编排流程 + RAG检索最新数据
def generate_article(topic):
    # 1. Skill定义流程
    workflow = load_skill('instructions/workflow.md')

    # 2. RAG获取最新资料
    latest_info = rag_retrieve(topic)

    # 3. 结合执行
    return execute_workflow(workflow, context=latest_info)
```

**关键优势**：
- ✅ Token消耗极低（渐进式加载）
- ✅ 理论无上限上下文容量
- ✅ 可重复性高

---

### 3. Subagents - 专业化代理

**官方文档**：[Subagents Reference](https://code.claude.com/docs/en/sub-agents)

**核心能力**：
- ✅ 最多10个子任务**并行执行**
- ✅ 每个子代理**独立上下文窗口**
- ✅ 自定义系统提示词和工具权限

**配置示例**（`.claude/agents/`）：

```json
// .claude/agents/frontend-expert/config.json
{
  "name": "frontend-expert",
  "description": "React/Next.js专家",
  "tools": ["Edit", "Read", "Bash"],
  "systemPrompt": "system.md"
}
```

```markdown
<!-- .claude/agents/frontend-expert/system.md -->
# Frontend Expert Agent

你是React 18 + Next.js 15专家，负责UI组件开发。

遵循项目规范：
- Tailwind CSS样式
- TypeScript严格模式
- ESLint规则
```

**并行执行示例**：
```
批次1：任务1-10（并行）
批次2：任务11-20（等待批次1完成后并行）
```

---

### 4. Plugins - 扩展生态

**官方文档**：[Plugins Reference](https://code.claude.com/docs/en/plugins)

**核心概念**：
- Plugin是包含命令、代理、hooks、Skills和MCP服务器的扩展包

**安装方式**：
```bash
# CLI安装
/plugin marketplace add user/repo-name

# 配置文件安装
{
  "enabledPlugins": {
    "document-skills@anthropic-agent-skills": true
  }
}
```

**Plugin结构**：
```
my-plugin/
├── .claude-plugin/
│   └── manifest.json      # 插件元数据
├── commands/              # 自定义命令
├── agents/                # 子代理
├── hooks/                 # Hooks
├── skills/                # Skills
└── mcp-servers/           # MCP配置
```

---

### 5. MCP服务器 - 外部工具连接

**官方文档**：[MCP Configuration](https://code.claude.com/docs/en/mcp)

**核心概念**：
- MCP (Model Context Protocol) 允许Claude连接外部工具和服务

**配置Scope**：
- **User级**：`~/.claude.json`（跨项目）
- **Project级**：`.claude/mcp.json`（团队共享）
- **Local级**：`.claude/local-mcp.json`（个人实验）

**配置示例**：
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "token"
      }
    }
  }
}
```

---

### 6. CLAUDE.md模块化 - 渐进式上下文

**官方最佳实践**：
- [Using CLAUDE.MD files](https://claude.com/blog/using-claude-md-files)
- [Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

**关键原则**：
1. **层级化**：支持多级CLAUDE.md，越嵌套优先级越高
2. **渐进式**：简洁概述+详细文档引用
3. **模块化**：使用`@file-path`引用外部文档

**最佳实践结构**：
```markdown
<!-- CLAUDE.md（<200行） -->
# 项目名称

## 核心信息
- 技术栈：X, Y, Z
- 项目目的：[一句话]

## 快速导航
- 完整架构：@docs/architecture/ARCHITECTURE.md
- 命令速查：@docs/guides/commands.md
- 编码规范：@docs/guides/coding-standards.md

## 重要提醒
⚠️ 关键规范1
⚠️ 关键规范2
```

---

## 📋 应用到本项目的准则

### 准则1：Hook系统规范

**必须配置的Hooks**：
1. **UserPromptSubmit** - 自动注入项目上下文
2. **PostToolUse** - Write工具后自动格式化
3. **PreToolUse** - Write/Edit前验证

**当前项目配置**（已实现）：
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [{
          "command": "python .claude/hooks/post_tool_use_fixer.py"
        }]
      },
      {
        "matcher": "Edit|Write",
        "hooks": [{
          "command": "python .claude/hooks/webui-auto-build.py"
        }]
      }
    ]
  }
}
```

**优化建议**：
- ✅ 添加UserPromptSubmit注入上下文
- ✅ 添加PreToolUse验证

---

### 准则2：Skills渐进式加载

**必须创建**：
- `.claude/skills/gongzhonghao-writer/SKILL.md`（简洁概述）
- `instructions/`目录（详细步骤）

**示例结构**：
```markdown
<!-- SKILL.md（<100行） -->
# 公众号写作助手 Skill

**功能**：AI辅助公众号创作

**核心能力**：
1. 标题生成（5大公式）
2. 质量检测（8维度）
3. 热点扫描
4. 数据分析

**使用方式**：
详见 `instructions/workflow-guide.md`
```

---

### 准则3：CLAUDE.md精简化

**当前问题**：389行，过长！

**目标**：<150行

**优化方案**：
1. 命令速查 → 移至 `docs/guides/commands-cheatsheet.md`
2. 规范文件列表 → 移至 `docs/guides/规范索引.md`
3. 详细说明 → 使用@引用

---

### 准则4：配置驱动架构

**必须遵循**：
- ✅ 所有硬编码改为配置（已完成75%）
- ✅ 配置统一管理（`.claude/skills/gongzhonghao-writer/config/`）
- ✅ 自动同步机制（sync_config.py）

---

### 准则5：MCP服务器集成

**当前项目已集成**：
- ✅ mcp-router
- ✅ task-master-ai

**建议新增**：
- Brave Search（Web搜索）
- Context7（技术文档查询）

---

## 📁 立即执行的优化

老金我现在立即：
1. ✅ 创建精简版CLAUDE.md
2. ✅ 创建docs/guides/claude-code-guide.md（完整指南）
3. ✅ 创建.claude/skills/gongzhonghao-writer/SKILL.md

**Sources**：
- [Hooks Reference - Claude Code Docs](https://code.claude.com/docs/en/hooks)
- [Agent Skills Overview](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- [Subagents Reference](https://code.claude.com/docs/en/sub-agents)
- [Plugins Reference](https://code.claude.com/docs/en/plugins)
- [MCP Configuration](https://code.claude.com/docs/en/mcp)
- [Using CLAUDE.MD files](https://claude.com/blog/using-claude-md-files)
- [Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Equipping agents with Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Guide to hooks in Claude Code](https://www.eesel.ai/blog/hooks-in-claude-code)
