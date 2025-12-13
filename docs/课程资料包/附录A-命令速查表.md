# 附录A：命令速查表

**课程模块**：附录A
**课程编号**：附录文档
**适用对象**：所有Claude Code用户
**更新日期**：2025-12-12
**字数**：8,000字

---

## 使用说明

本速查表是Claude Code命令的快速参考手册，按功能分类，方便开发者快速查阅。

### 符号说明

| 符号 | 含义 |
|------|------|
| `<必需>` | 必需参数 |
| `[可选]` | 可选参数 |
| `--flag` | 命令行标志 |
| `$ARGUMENTS` | Slash命令参数 |
| `⌘` | macOS Command键 |
| `Ctrl` | Windows/Linux Control键 |

---

## 第一部分：CLI基础命令（60+命令）

### 1. 启动与退出

| 命令 | 说明 | 示例 | 别名 |
|------|------|------|------|
| `claude` | 启动交互模式 | `claude` | - |
| `claude <prompt>` | 单次执行 | `claude "分析代码质量"` | - |
| `claude -p <prompt>` | 指定提示词启动 | `claude -p "重构main.py"` | - |
| `claude --help` | 显示帮助信息 | `claude --help` | `claude -h` |
| `claude --version` | 显示版本号 | `claude --version` | `claude -v` |
| `/exit` | 退出交互模式 | `/exit` | `/quit`, `Ctrl+D` |
| `/clear` | 清除当前会话 | `/clear` | - |

### 2. 文件操作命令

| 命令 | 说明 | 参数 | 示例 |
|------|------|------|------|
| `Read` | 读取文件内容 | `file_path`, `[offset]`, `[limit]` | 读取src/main.py |
| `Write` | 写入文件（覆盖） | `file_path`, `content` | 创建新文件 |
| `Edit` | 编辑文件（精确替换） | `file_path`, `old_string`, `new_string`, `[replace_all]` | 修改特定行 |
| `Glob` | 文件模式匹配 | `pattern`, `[path]` | 查找所有.ts文件 |
| `Grep` | 内容搜索 | `pattern`, `[path]`, `[output_mode]`, `[-i]`, `[-n]`, `[-A]`, `[-B]`, `[-C]` | 搜索函数定义 |

#### Read工具详解

```bash
# 基础用法
Read file_path="src/index.ts"

# 读取指定行范围（大文件）
Read file_path="large.log" offset=1000 limit=100

# 支持的文件类型
- 文本文件：.ts, .js, .py, .md, .json, .yaml, .toml
- 图片文件：.png, .jpg, .gif（返回图像内容）
- PDF文件：.pdf（逐页处理）
- Jupyter：.ipynb（包含代码和输出）
```

#### Edit工具详解

```bash
# 精确替换（old_string必须唯一）
Edit file_path="src/app.ts"
     old_string="const port = 3000;"
     new_string="const port = 8080;"

# 全局替换（重命名变量）
Edit file_path="src/utils.ts"
     old_string="oldVariableName"
     new_string="newVariableName"
     replace_all=true

# 多行替换
Edit file_path="config.yaml"
     old_string="production:
  host: old.com"
     new_string="production:
  host: new.com"
```

#### Glob工具详解

```bash
# 常用模式
**/*.ts          # 所有TypeScript文件
src/**/*.test.js # src目录下所有测试文件
*.{ts,js}        # 所有TS和JS文件
!node_modules/** # 排除node_modules

# 示例
Glob pattern="src/**/*.tsx"        # 查找所有React组件
Glob pattern="**/*.test.{ts,js}"   # 查找所有测试文件
Glob pattern="**/package.json"     # 查找所有package.json
```

#### Grep工具详解

```bash
# 基础搜索（返回文件列表）
Grep pattern="function.*calculate" output_mode="files_with_matches"

# 显示匹配内容（带行号）
Grep pattern="export class" output_mode="content" -n=true

# 上下文搜索
Grep pattern="TODO" output_mode="content" -C=3  # 前后各3行

# 不区分大小写
Grep pattern="error" -i=true

# 指定文件类型
Grep pattern="interface" type="ts" output_mode="content"

# Glob过滤
Grep pattern="useState" glob="**/*.tsx" output_mode="files_with_matches"

# 多行模式（跨行搜索）
Grep pattern="class.*\{[\\s\\S]*?constructor" multiline=true
```

### 3. Bash命令执行

| 命令 | 说明 | 参数 | 示例 |
|------|------|------|------|
| `Bash` | 执行Shell命令 | `command`, `[timeout]`, `[run_in_background]` | 运行测试 |

#### Bash工具使用规范

```bash
# ✅ 推荐用法
Bash command="npm test" description="运行单元测试"
Bash command="git status" description="查看Git状态"
Bash command="docker ps" description="查看运行中的容器"

# ⚠️ 路径包含空格必须用双引号
Bash command='cd "My Documents" && ls'  # 正确
Bash command='cd My Documents && ls'    # 错误

# 🔗 命令链接
Bash command="npm install && npm test"  # 顺序执行（失败则停止）
Bash command="git add . && git commit -m 'fix' && git push"

# 🚫 避免使用Bash的场景
- 文件搜索 → 使用Glob工具
- 内容搜索 → 使用Grep工具
- 读取文件 → 使用Read工具
- 编辑文件 → 使用Edit工具
```

#### 后台执行

```bash
# 启动长时间运行的任务
Bash command="npm run dev" run_in_background=true

# 获取后台任务输出
TaskOutput task_id="<task_id>" block=true timeout=30000
```

### 4. Git操作命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `git status` | 查看仓库状态 | `git status` |
| `git add <file>` | 添加文件到暂存区 | `git add src/main.py` |
| `git commit -m "<msg>"` | 提交变更 | `git commit -m "feat: add login"` |
| `git push` | 推送到远程 | `git push origin main` |
| `git pull` | 拉取远程更新 | `git pull` |
| `git branch` | 查看分支 | `git branch` |
| `git checkout -b <branch>` | 创建并切换分支 | `git checkout -b feature/auth` |
| `git log` | 查看提交历史 | `git log --oneline -10` |
| `git diff` | 查看差异 | `git diff HEAD~1` |

### 5. Agent与任务管理

| 命令 | 说明 | 参数 | 示例 |
|------|------|------|------|
| `Task` | 创建子Agent | `description`, `prompt`, `[subagent_type]`, `[run_in_background]` | 并行处理任务 |
| `TaskOutput` | 获取子Agent结果 | `task_id`, `[block]`, `[timeout]` | 收集并行结果 |
| `/tasks` | 查看所有任务 | - | 查看运行中的Agent |

#### Task工具详解

```bash
# 创建子Agent（同步）
Task description="分析代码质量"
     prompt="检查src/目录下所有.ts文件的代码质量"
     subagent_type="code_specialist"

# 创建子Agent（后台）
Task description="重构API模块"
     prompt="将src/api/重构为微服务架构"
     run_in_background=true
     subagent_type="code_specialist"

# 子Agent类型
- default: 通用任务
- code_specialist: 代码修改
- researcher: 信息收集
- reviewer: 代码审查（只读）
- debugger: 错误排查
```

#### TaskOutput工具详解

```bash
# 阻塞等待（默认）
TaskOutput task_id="task_abc123" block=true timeout=60000

# 非阻塞检查
TaskOutput task_id="task_abc123" block=false
```

### 6. MCP工具调用

| 格式 | 说明 | 示例 |
|------|------|------|
| `mcp__<server>__<tool>` | 调用MCP工具 | `mcp__github__get_pr` |

#### 常用MCP工具

```bash
# GitHub MCP
mcp__github__get_pr owner="anthropic" repo="claude-code" pullNumber=123
mcp__github__create_issue owner="user" repo="project" title="Bug report"
mcp__github__list_commits owner="user" repo="project" sha="main"

# Filesystem MCP
mcp__filesystem__read_file path="/data/config.json"
mcp__filesystem__write_file path="/data/output.txt" content="data"

# Search MCP
mcp__search__web_search query="Claude Code documentation"
mcp__exa__search query="best practices for Agent SDK"

# Context7 MCP
mcp__context7__resolve_library_id libraryName="react"
mcp__context7__get_library_docs context7CompatibleLibraryID="/facebook/react"
```

### 7. 配置与设置

| 命令 | 说明 | 示例 |
|------|------|------|
| `claude config list` | 查看配置 | `claude config list` |
| `claude config set <key> <value>` | 设置配置 | `claude config set model claude-sonnet-4` |
| `claude config get <key>` | 获取配置 | `claude config get model` |
| `claude login` | 登录账号 | `claude login` |
| `claude logout` | 登出账号 | `claude logout` |

#### 常用配置项

```bash
# 模型选择
claude config set model claude-sonnet-4
claude config set model claude-opus-4
claude config set model claude-haiku-3

# 权限模式
claude config set permissionMode bypassPermissions  # 自动批准
claude config set permissionMode acceptEdits        # 仅批准编辑

# 工作目录
claude config set cwd /path/to/project

# 最大轮次
claude config set maxTurns 50
```

---

## 第二部分：Slash命令速查（20+命令）

### 内置Slash命令

| 命令 | 说明 | 用法 | 参数 |
|------|------|------|------|
| `/help` | 显示帮助 | `/help` | - |
| `/clear` | 清空会话 | `/clear` | - |
| `/exit` | 退出 | `/exit` | - |
| `/tasks` | 查看任务列表 | `/tasks` | - |

### 自定义Slash命令（基于当前项目）

#### 公众号写作命令

| 命令 | 说明 | 用法 | 参数 |
|------|------|------|------|
| `/write` | 完整写作流程 | `/write <主题>` | 主题描述 |
| `/write-auto` | 全自动爆款生成 | `/write-auto <热点>` | 热点关键词 |
| `/write-rewrite` | 文章翻新 | `/write-rewrite` | 无 |
| `/hotspot` | 热点扫描 | `/hotspot` | 无 |
| `/daily` | 每日写作 | `/daily` | 无 |
| `/title-gen` | 生成标题 | `/title-gen <主题>` | 主题 |
| `/title-score` | 标题评分 | `/title-score <标题>` | 标题文本 |
| `/pre-check` | 发文前检查 | `/pre-check` | 无 |
| `/topic-filter` | 选题过滤 | `/topic-filter <选题>` | 选题描述 |
| `/image` | 自动配图 | `/image` | 无 |
| `/infographic` | 生成信息图 | `/infographic` | 无 |

#### 数据分析命令

| 命令 | 说明 | 用法 |
|------|------|------|
| `/data-collect` | 数据收集 | `/data-collect` |
| `/data-analyze` | 数据分析 | `/data-analyze` |

#### 工具命令

| 命令 | 说明 | 用法 |
|------|------|------|
| `/test-mcp` | 测试MCP工具 | `/test-mcp` |
| `/ai-orchestrator` | AI多引擎编排 | `/ai-orchestrator` |

### Slash命令开发规范

```markdown
<!-- .claude/commands/custom-command.md -->

# 命令描述

清晰描述命令的功能和用途。

## 参数

- $ARGUMENTS: 命令行参数

## 执行步骤

1. 使用Read工具读取相关文件
2. 使用Bash执行必要的命令
3. 使用Write工具保存结果

## 示例

/custom-command arg1 arg2
```

---

## 第三部分：快捷键速查

### 交互模式快捷键

| 快捷键 | 功能 | 平台 |
|--------|------|------|
| `Ctrl+D` | 退出交互模式 | 所有 |
| `Ctrl+C` | 中断当前操作 | 所有 |
| `Ctrl+L` | 清屏 | 所有 |
| `Ctrl+R` | 搜索历史命令 | 所有 |
| `↑` / `↓` | 浏览命令历史 | 所有 |
| `Tab` | 自动补全 | 所有 |
| `Ctrl+T` | 隐藏/显示Todo列表 | 所有 |
| `Esc` | 中断当前生成 | 所有 |

### IDE集成快捷键

#### VS Code插件

| 快捷键 | 功能 |
|--------|------|
| `⌘+Shift+P` (Mac) / `Ctrl+Shift+P` (Win) | 打开命令面板 |
| `⌘+K ⌘+C` (Mac) / `Ctrl+K Ctrl+C` (Win) | 用Claude分析选中代码 |
| `⌘+K ⌘+E` (Mac) / `Ctrl+K Ctrl+E` (Win) | 用Claude编辑选中代码 |

#### Cursor集成

| 快捷键 | 功能 |
|--------|------|
| `⌘+K` (Mac) / `Ctrl+K` (Win) | 打开Claude对话 |
| `⌘+L` (Mac) / `Ctrl+L` (Win) | 添加当前文件到上下文 |

---

## 第四部分：参数完全指南

### QueryOptions参数（Agent SDK）

```typescript
interface QueryOptions {
  // 模型选择
  model?: 'claude-sonnet-4' | 'claude-opus-4' | 'claude-haiku-3';

  // 系统提示词
  systemPrompt?: string;

  // 工作目录
  cwd?: string;

  // 最大对话轮次
  maxTurns?: number;

  // 权限模式
  permissionMode?: 'default' | 'acceptEdits' | 'bypassPermissions';

  // 允许的工具
  allowedTools?: string[];

  // MCP服务器配置
  mcpServers?: Record<string, MCPServerConfig>;

  // 设置来源
  settingSources?: ('user' | 'project' | 'local')[];
}
```

### CLI参数详解

```bash
# --model: 指定模型
claude --model claude-opus-4 "复杂任务"

# --cwd: 指定工作目录
claude --cwd /path/to/project "分析项目"

# --permission-mode: 权限模式
claude --permission-mode bypassPermissions  # 自动批准所有操作
claude --permission-mode acceptEdits        # 只自动批准编辑
claude --permission-mode default            # 每次询问

# --max-turns: 最大轮次
claude --max-turns 100 "大规模重构"

# --allowed-tools: 限制工具
claude --allowed-tools Read,Write,Bash "受限环境"

# --verbose: 调试模式
claude --verbose "详细输出"

# --headless: 无交互模式（CI/CD）
claude --headless -p "自动化任务"
```

### Grep参数详解

| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `pattern` | string | 搜索模式（正则） | `"function.*calculate"` |
| `path` | string | 搜索路径 | `"src/"` |
| `output_mode` | enum | 输出模式 | `"content"` / `"files_with_matches"` / `"count"` |
| `-i` | boolean | 不区分大小写 | `true` |
| `-n` | boolean | 显示行号 | `true` |
| `-A` | number | 匹配后N行 | `3` |
| `-B` | number | 匹配前N行 | `3` |
| `-C` | number | 匹配前后N行 | `3` |
| `glob` | string | 文件过滤 | `"*.ts"` |
| `type` | string | 文件类型 | `"ts"` |
| `head_limit` | number | 限制输出行数 | `100` |
| `offset` | number | 跳过前N行 | `50` |
| `multiline` | boolean | 多行模式 | `true` |

---

## 第五部分：错误码与排查

### 常见错误码

| 错误码 | 含义 | 解决方案 |
|--------|------|---------|
| `ENOENT` | 文件不存在 | 检查文件路径是否正确 |
| `EACCES` | 权限不足 | 检查文件权限或使用sudo |
| `ETIMEDOUT` | 操作超时 | 增加timeout参数 |
| `ECONNREFUSED` | 连接被拒绝 | 检查网络或服务状态 |
| `INVALID_API_KEY` | API密钥无效 | 重新配置ANTHROPIC_API_KEY |
| `RATE_LIMIT` | 速率限制 | 稍后重试或升级套餐 |
| `CONTEXT_TOO_LONG` | 上下文过长 | 使用/clear或减少上下文 |

### 排查命令

```bash
# 查看详细日志
claude --verbose

# 测试API连接
claude "hello"

# 查看配置
claude config list

# 重置配置
claude config reset

# 查看版本
claude --version

# 清理缓存
rm -rf ~/.claude/cache
```

---

## 第六部分：最佳实践速查

### 文件操作最佳实践

```bash
# ✅ 先读后写
1. Read file_path="config.json"
2. 分析内容
3. Edit/Write更新文件

# ✅ 使用Glob查找文件
Glob pattern="**/*.ts"  # 比ls更强大

# ✅ 使用Grep搜索内容
Grep pattern="TODO" output_mode="content"  # 比grep更方便

# ❌ 不要用Bash读取文件
Bash command="cat file.txt"  # 错误
Read file_path="file.txt"    # 正确
```

### Git操作最佳实践

```bash
# ✅ 提交前检查
1. git status           # 查看变更
2. git diff            # 查看详细差异
3. git add <files>     # 添加文件
4. git commit -m "msg" # 提交

# ✅ 使用Heredoc格式化提交信息
git commit -m "$(cat <<'EOF'
feat: add user authentication

- Implement JWT token generation
- Add login/logout endpoints
- Update tests
EOF
)"

# ❌ 不要使用危险命令（除非用户明确要求）
git push --force       # 危险
git reset --hard      # 危险
git clean -fd         # 危险
```

### Agent最佳实践

```bash
# ✅ Orchestrator-Worker模式
1. 主Agent（Opus）规划任务
2. 创建子Agent（Sonnet）并行执行
3. 收集结果并汇总

# ✅ 合理使用后台模式
Task run_in_background=true  # 并行任务
Task run_in_background=false # 顺序任务

# ✅ 限制Agent权限
allowedTools=["Read", "Grep"]  # 只读Agent
allowedTools=["Read", "Write", "Edit"]  # 编辑Agent
```

### MCP最佳实践

```bash
# ✅ 复用MCP连接
- 应用启动时预热MCP服务器
- 使用连接池管理

# ✅ 错误处理
- MCP调用失败时有降级方案
- 超时设置合理（30s-60s）

# ✅ 权限最小化
- 只授予必要的MCP服务器访问权限
- 使用环境变量管理敏感信息
```

---

## 第七部分：性能优化速查

### 并行执行

```bash
# ✅ 并行调用工具（单个响应多个工具）
# Claude Code会自动并行执行独立的工具调用

# ✅ 并行创建子Agent
Task description="任务1" run_in_background=true
Task description="任务2" run_in_background=true
Task description="任务3" run_in_background=true

# 收集结果
TaskOutput task_id="task_1"
TaskOutput task_id="task_2"
TaskOutput task_id="task_3"
```

### 上下文管理

```bash
# ✅ 定期清理上下文
/clear  # 每隔20-30轮对话清理一次

# ✅ 使用offset和limit读取大文件
Read file_path="huge.log" offset=1000 limit=100

# ✅ 使用head_limit限制Grep输出
Grep pattern="error" head_limit=50
```

### 成本优化

```bash
# ✅ 选择合适的模型
- Orchestrator: Opus（复杂推理）
- Worker: Sonnet（代码生成）
- 简单任务: Haiku（成本最低）

# ✅ 缓存重复查询
- 使用MCP缓存机制
- Agent结果缓存

# ✅ 限制最大轮次
maxTurns=20  # 避免无限循环
```

---

## 第八部分：常用代码模板

### 1. 基础Agent模板（TypeScript）

```typescript
import { query } from '@anthropic-ai/claude-agent-sdk';

async function basicAgent(task: string): Promise<void> {
  const stream = query({
    prompt: task,
    options: {
      model: 'claude-sonnet-4',
      allowedTools: ['Read', 'Write', 'Bash'],
      cwd: process.cwd(),
      maxTurns: 10
    }
  });

  for await (const message of stream) {
    if (message.type === 'assistant') {
      for (const chunk of message.message.content) {
        if (chunk.type === 'text') {
          process.stdout.write(chunk.text);
        }
      }
    }
  }
}
```

### 2. Orchestrator-Worker模板

```typescript
async function orchestratorWorker(tasks: string[]): Promise<void> {
  const prompt = `你是任务编排器。

任务列表：
${tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}

执行策略：
1. 为每个任务创建一个Worker子Agent（使用Task工具）
2. 使用run_in_background=true实现并行
3. 收集所有结果（使用TaskOutput工具）
4. 生成汇总报告`;

  const stream = query({
    prompt,
    options: {
      model: 'claude-opus-4',
      allowedTools: ['Task', 'TaskOutput', 'Read', 'Write'],
      maxTurns: 100
    }
  });

  for await (const message of stream) {
    // 处理流式输出
  }
}
```

### 3. MCP集成模板

```typescript
const stream = query({
  prompt: '查询GitHub仓库信息',
  options: {
    mcpServers: {
      github: {
        command: 'npx',
        args: ['-y', '@anthropic/mcp-server-github'],
        env: {
          GITHUB_TOKEN: process.env.GITHUB_TOKEN
        }
      }
    },
    allowedTools: ['mcp__github__get_repo', 'mcp__github__list_commits']
  }
});
```

---

## 第九部分：调试技巧速查

### 启用详细输出

```bash
# CLI模式
claude --verbose "任务"

# Agent SDK
process.env.DEBUG = 'claude:*';
```

### 查看工具调用

```typescript
for await (const message of stream) {
  if (message.type === 'tool_use') {
    console.log(`[Tool] ${message.tool.name}`);
    console.log(`[Params] ${JSON.stringify(message.tool.parameters, null, 2)}`);
  }

  if (message.type === 'tool_result') {
    console.log(`[Result] Success: ${!message.result.isError}`);
  }
}
```

### 错误捕获

```typescript
try {
  for await (const message of stream) {
    if (message.type === 'error') {
      console.error(`Error: ${message.error.message}`);
      // 处理错误
    }
  }
} catch (error) {
  console.error(`Stream Error: ${error}`);
}
```

---

## 第十部分：版本兼容性

### CLI版本差异

| 版本 | 主要变化 | 兼容性 |
|------|---------|--------|
| 0.x | 早期版本 | 已弃用 |
| 1.0 | 正式版本，稳定API | 推荐 |
| 1.1+ | 新增MCP支持 | 向后兼容 |
| 2.0 | Agent SDK独立 | 大版本升级 |

### Agent SDK版本

```bash
# 检查版本
npm list @anthropic-ai/claude-agent-sdk

# 升级到最新版本
npm install @anthropic-ai/claude-agent-sdk@latest
```

---

## 附录：快速参考卡

### 最常用10个命令

```bash
1. claude                    # 启动交互模式
2. Read file_path="..."      # 读取文件
3. Edit file_path="..."      # 编辑文件
4. Bash command="..."        # 执行命令
5. Grep pattern="..."        # 搜索内容
6. /clear                    # 清空会话
7. git status               # 查看Git状态
8. git commit -m "..."      # 提交代码
9. Task prompt="..."        # 创建子Agent
10. /exit                    # 退出
```

### 应急救援命令

```bash
# 中断失控的操作
Ctrl+C

# 清理所有会话
/clear

# 退出并重启
/exit
claude

# 重置配置
claude config reset

# 查看帮助
claude --help
```

---

## 更新日志

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0 | 2025-12-12 | 初始版本，覆盖60+命令 |

---

**速查表版本**：V1.0
**最后更新**：2025-12-12
**总字数**：8,000字
**适用版本**：Claude Code 1.x+

---

## 获取帮助

- **官方文档**：https://docs.anthropic.com/claude-code
- **GitHub仓库**：https://github.com/anthropics/claude-code
- **社区论坛**：https://community.anthropic.com
- **问题反馈**：https://github.com/anthropics/claude-code/issues
