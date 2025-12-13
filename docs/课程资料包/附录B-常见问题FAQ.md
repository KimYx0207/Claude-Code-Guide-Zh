# 附录B：常见问题FAQ

**课程模块**：附录B
**问题总数**：90+个
**更新日期**：2025-12-12
**字数**：10,000字

---

## 使用说明

本FAQ按问题类型分为四大类，每个问题包含问题描述、解决方案和相关命令。使用`Ctrl+F`快速搜索关键词。

---

## 第一部分：安装与配置问题（20个FAQ）

### Q1.1：如何检查系统是否满足Claude Code要求？

**问题**：我不确定我的电脑能不能运行Claude Code。

**解决方案**：

```bash
# 检查Node.js版本（要求18.0+）
node --version

# 检查npm版本（要求8.0+）
npm --version

# 检查系统架构
uname -m  # Linux/Mac
echo %PROCESSOR_ARCHITECTURE%  # Windows
```

**最低要求**：
- Node.js ≥ 18.0.0
- npm ≥ 8.0.0
- 操作系统：Windows 10/macOS 12/Ubuntu 20.04
- RAM：8GB（推荐16GB）

---

### Q1.2：安装时提示权限错误怎么办？

**错误信息**：`EACCES: permission denied`

**原因**：npm全局安装需要管理员权限。

**解决方案**：

```bash
# 方案1：使用sudo（Linux/Mac）
sudo npm install -g claude-code

# 方案2：修改npm全局目录（推荐）
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g claude-code

# 方案3：使用npx（无需安装）
npx claude-code
```

---

### Q1.3：安装后找不到claude命令？

**问题**：安装成功但输入`claude`提示`command not found`。

**解决方案**：

```bash
# 检查安装位置
npm list -g claude-code

# 查看PATH
echo $PATH  # Linux/Mac
echo %PATH%  # Windows

# 添加到PATH（临时）
export PATH="$PATH:$(npm bin -g)"  # Linux/Mac

# 添加到PATH（永久）
echo 'export PATH="$PATH:'$(npm bin -g)'"' >> ~/.bashrc
source ~/.bashrc

# Windows解决方案
# 1. 找到npm全局bin目录
npm config get prefix
# 2. 手动添加到系统环境变量
```

---

### Q1.4：API密钥怎么获取和配置？

**步骤**：

1. **获取API密钥**
   - 访问：https://console.anthropic.com/
   - 登录/注册账号
   - 进入Settings → API Keys
   - 创建新密钥（以`sk-ant-api03-`开头）

2. **配置方式一：环境变量（推荐）**

```bash
# Linux/Mac
echo 'export ANTHROPIC_API_KEY="sk-ant-api03-..."' >> ~/.bashrc
source ~/.bashrc

# Windows PowerShell
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_API_KEY', 'sk-ant-api03-...', 'User')

# Windows CMD
setx ANTHROPIC_API_KEY "sk-ant-api03-..."
```

3. **配置方式二：.env文件**

```env
# .env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

4. **验证配置**

```bash
claude "hello"  # 如果成功响应，配置正确
```

---

### Q1.5：国内网络无法连接Anthropic API怎么办？

**问题**：提示`ECONNREFUSED`或`timeout`。

**解决方案**：

```bash
# 方案1：设置HTTP代理
export HTTP_PROXY=http://127.0.0.1:7890
export HTTPS_PROXY=http://127.0.0.1:7890

# 方案2：使用配置文件
# 创建 ~/.claude/config.json
{
  "proxy": "http://127.0.0.1:7890"
}

# 方案3：使用国内API中转服务（需自行搭建）
export ANTHROPIC_API_BASE_URL="https://your-proxy.com/v1"
```

---

### Q1.6：如何升级Claude Code到最新版本？

```bash
# 检查当前版本
claude --version

# 升级到最新版本
npm update -g claude-code

# 或重新安装
npm uninstall -g claude-code
npm install -g claude-code@latest

# 验证升级
claude --version
```

---

### Q1.7：多个项目如何使用不同配置？

**问题**：不同项目需要不同的模型、权限等配置。

**解决方案**：

使用项目级配置文件`.claude/settings.json`：

```json
{
  "model": "claude-sonnet-4",
  "permissionMode": "acceptEdits",
  "allowedTools": ["Read", "Write", "Edit", "Bash"],
  "maxTurns": 30
}
```

**配置优先级**：
```
项目配置(.claude/settings.json)
    ↓ 覆盖
用户配置(~/.claude/config.json)
    ↓ 覆盖
系统默认配置
```

---

### Q1.8：如何配置MCP服务器？

**步骤**：

1. **创建.mcp.json**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "/allowed/path"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

2. **配置环境变量**

```bash
export GITHUB_TOKEN="ghp_..."
```

3. **验证MCP**

```bash
# 启动Claude Code
claude

# 测试MCP工具
mcp__github__get_me
```

---

### Q1.9：Windows上使用Claude Code有什么特殊要求？

**关键点**：

1. **使用Git Bash**（推荐）
   - Claude Code在Windows上默认使用Git Bash
   - 支持Unix风格命令

2. **路径格式**
   ```bash
   # ✅ 正确
   Read file_path="C:/Users/admin/project/file.txt"

   # ❌ 错误
   Read file_path="C:\Users\admin\project\file.txt"
   ```

3. **安装Git Bash**
   ```bash
   # 下载并安装Git for Windows
   https://git-scm.com/download/win
   ```

---

### Q1.10：如何卸载Claude Code？

```bash
# 卸载全局安装
npm uninstall -g claude-code

# 清理配置文件（可选）
rm -rf ~/.claude

# 清理缓存
rm -rf ~/.claude/cache

# 验证卸载
claude --version  # 应提示command not found
```

---

### Q1.11：安装时提示网络错误？

**错误**：`ERR_SOCKET_TIMEOUT`、`ENOTFOUND registry.npmjs.org`

**解决方案**：

```bash
# 方案1：使用淘宝镜像
npm install -g claude-code --registry=https://registry.npmmirror.com

# 方案2：配置npm代理
npm config set proxy http://127.0.0.1:7890
npm config set https-proxy http://127.0.0.1:7890

# 方案3：增加超时时间
npm install -g claude-code --timeout=60000
```

---

### Q1.12：如何配置多个API密钥？

**场景**：团队协作，不同成员使用不同API密钥。

**解决方案**：

```bash
# 方案1：项目级.env
# .env
ANTHROPIC_API_KEY=sk-ant-api03-...

# 方案2：用户级配置
# ~/.claude/config.json
{
  "apiKey": "sk-ant-api03-..."
}

# 方案3：临时覆盖
ANTHROPIC_API_KEY=sk-ant-api03-temp claude "任务"
```

---

### Q1.13：如何在CI/CD环境中使用Claude Code？

```bash
# GitHub Actions示例
name: AI Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install -g claude-code
      - run: |
          claude --headless -p "审查本次PR的代码质量"
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

---

### Q1.14：如何限制Claude Code的文件访问权限？

**解决方案**：

使用沙箱模式（Agent SDK）：

```typescript
const stream = query({
  prompt: '分析代码',
  options: {
    cwd: '/safe/directory',  // 限制在特定目录
    allowedTools: ['Read', 'Grep'],  // 只允许读取
    permissionMode: 'default'  // 需要批准所有操作
  }
});
```

---

### Q1.15：如何配置自定义模型或API端点？

**场景**：使用企业内部的Claude API代理。

```bash
# 方法1：环境变量
export ANTHROPIC_API_BASE_URL="https://internal-proxy.company.com/v1"

# 方法2：配置文件
# ~/.claude/config.json
{
  "apiBaseUrl": "https://internal-proxy.company.com/v1",
  "model": "claude-sonnet-4"
}
```

---

### Q1.16-Q1.20：其他安装配置问题

| 问题 | 关键解决方案 |
|------|-------------|
| Q1.16：Mac上提示需要Xcode？ | 安装Xcode Command Line Tools: `xcode-select --install` |
| Q1.17：Node版本管理工具推荐？ | 使用nvm: `nvm install 20 && nvm use 20` |
| Q1.18：如何在Docker中运行？ | 使用官方Node镜像，安装Git和Claude Code |
| Q1.19：如何配置Shell自动补全？ | `claude completion >> ~/.bashrc` |
| Q1.20：如何重置所有配置？ | `rm -rf ~/.claude && claude login` |

---

## 第二部分：使用问题（30个FAQ）

### Q2.1：如何查看当前会话的上下文？

```bash
# 查看上下文摘要
请总结当前会话的上下文

# 查看Token使用情况（交互模式底部显示）
Token usage: 50000/1000000
```

---

### Q2.2：上下文太长怎么办？

**问题**：提示`CONTEXT_TOO_LONG`。

**解决方案**：

```bash
# 方法1：清空会话
/clear

# 方法2：使用子Agent
Task description="独立任务" prompt="..."

# 方法3：分批处理
# 将大任务拆分为多个小任务
```

---

### Q2.3：如何保存和恢复会话？

**解决方案**：

```bash
# Claude Code自动保存会话到
~/.claude/sessions/<session_id>.jsonl

# 恢复上一次会话
claude --resume

# 查看所有会话
ls ~/.claude/sessions/
```

---

### Q2.4：如何中断Claude的响应？

**方法**：

- **交互模式**：按`Esc`键
- **CLI模式**：按`Ctrl+C`
- **Agent SDK**：关闭流迭代器

```typescript
// Agent SDK中断
const stream = query({...});

// 可以随时break停止
for await (const message of stream) {
  if (shouldStop) break;
}
```

---

### Q2.5：如何让Claude使用特定工具？

**方法1：在提示词中明确指示**

```bash
请使用Read工具读取src/main.py，然后使用Grep工具搜索TODO注释
```

**方法2：限制allowedTools**

```typescript
options: {
  allowedTools: ['Read', 'Grep']  // 只能使用这两个工具
}
```

---

### Q2.6：Read工具读取大文件很慢怎么办？

**解决方案**：

```bash
# 使用offset和limit分页读取
Read file_path="large.log" offset=0 limit=1000     # 读取前1000行
Read file_path="large.log" offset=1000 limit=1000  # 读取第1000-2000行

# 或使用Grep直接搜索
Grep pattern="ERROR" path="large.log" output_mode="content"
```

---

### Q2.7：Edit工具提示old_string不唯一？

**错误**：`old_string must be unique`

**解决方案**：

```bash
# 方法1：提供更多上下文使其唯一
Edit file_path="src/app.ts"
     old_string="const port = 3000;
const host = 'localhost';"
     new_string="const port = 8080;
const host = '0.0.0.0';"

# 方法2：使用replace_all替换所有
Edit file_path="src/app.ts"
     old_string="oldName"
     new_string="newName"
     replace_all=true
```

---

### Q2.8：如何让Claude生成的代码遵循项目规范？

**解决方案**：

1. **使用CLAUDE.md文件**

```markdown
<!-- CLAUDE.md -->
# 项目编码规范

- 使用2空格缩进
- 使用单引号
- 函数名使用camelCase
- 类名使用PascalCase
```

2. **在提示词中引用**

```bash
请遵循CLAUDE.md中的编码规范重构代码
```

---

### Q2.9：如何批量处理文件？

**场景**：需要重构100个文件。

**方法1：使用单个Agent批量处理**

```bash
请使用Glob找到所有src/**/*.ts文件，然后逐个重构
```

**方法2：使用子Agent并行**

```bash
请为src目录下的每个子目录创建一个子Agent，并行重构所有.ts文件
```

---

### Q2.10：Git提交时如何编写规范的commit message？

**推荐格式**：

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <subject>

<body>

<footer>
EOF
)"
```

**Type类型**：
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例**：

```bash
git commit -m "$(cat <<'EOF'
feat(auth): add JWT authentication

- Implement token generation
- Add login/logout endpoints
- Update user model

Closes #123
EOF
)"
```

---

### Q2.11-Q2.30：其他使用问题

| 问题 | 关键解决方案 |
|------|-------------|
| Q2.11：如何搜索跨行的代码模式？ | 使用Grep的`multiline=true`参数 |
| Q2.12：如何查看Claude使用了哪些工具？ | 监听`tool_use`消息类型 |
| Q2.13：如何限制Claude的操作范围？ | 设置`cwd`和`allowedTools` |
| Q2.14：如何让Claude生成测试代码？ | 明确要求"为每个函数生成Jest测试" |
| Q2.15：如何让Claude遵循TDD？ | 提示词："先写测试，再写实现" |
| Q2.16：如何处理二进制文件？ | Read支持图片、PDF，其他使用Bash |
| Q2.17：如何让Claude使用特定版本的库？ | 在提示词中指定版本号 |
| Q2.18：如何避免Claude修改特定文件？ | 不要在上下文中提及该文件 |
| Q2.19：如何让Claude生成文档？ | 使用Write工具生成Markdown |
| Q2.20：如何导出对话历史？ | 会话保存在`~/.claude/sessions/` |
| Q2.21：如何让Claude使用代码注释？ | 要求"添加JSDoc注释" |
| Q2.22：如何处理包含空格的路径？ | 使用双引号：`"My Documents/file.txt"` |
| Q2.23：如何让Claude并行执行任务？ | 使用`run_in_background=true` |
| Q2.24：如何查看后台任务状态？ | `/tasks`命令 |
| Q2.25：如何终止后台任务？ | `KillShell shell_id="..."` |
| Q2.26：如何在Windows上使用Unix命令？ | Claude自动使用Git Bash |
| Q2.27：如何让Claude生成配置文件？ | 提供配置模板 |
| Q2.28：如何处理敏感信息？ | 使用环境变量，不写入代码 |
| Q2.29：如何让Claude遵循最佳实践？ | 在CLAUDE.md中定义规范 |
| Q2.30：如何提高响应速度？ | 使用Haiku模型，减少上下文 |

---

## 第三部分：开发问题（25个FAQ）

### Q3.1：如何开发自定义Slash命令？

**步骤**：

1. **创建命令文件**

```bash
# .claude/commands/my-command.md
```

2. **编写命令内容**

```markdown
# 命令描述

这是一个自定义命令。

## 执行步骤

1. 使用Read工具读取$ARGUMENTS指定的文件
2. 分析文件内容
3. 生成报告
```

3. **使用命令**

```bash
/my-command src/app.ts
```

---

### Q3.2：如何在Slash命令中获取参数？

**解决方案**：

使用`$ARGUMENTS`变量：

```markdown
<!-- .claude/commands/analyze.md -->

# 分析文件

请分析文件：$ARGUMENTS

步骤：
1. 读取文件内容
2. 检查代码质量
3. 生成报告
```

**使用**：

```bash
/analyze src/main.py
# $ARGUMENTS会被替换为 "src/main.py"
```

---

### Q3.3：如何调用Python脚本？

**示例**：

```markdown
<!-- .claude/commands/quality-check.md -->

# 质量检查

运行质量检测脚本：

bash
cd scripts && python quality_detector.py "$ARGUMENTS"


分析脚本输出并总结问题。
```

---

### Q3.4：如何开发MCP服务器？

**最小示例**（TypeScript）：

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'my-mcp-server',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

// 定义工具
server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'my_tool',
    description: '我的工具',
    inputSchema: {
      type: 'object',
      properties: {
        input: { type: 'string' }
      }
    }
  }]
}));

// 处理工具调用
server.setRequestHandler('tools/call', async (request) => {
  if (request.params.name === 'my_tool') {
    return {
      content: [{ type: 'text', text: '工具执行结果' }]
    };
  }
});

// 启动服务器
const transport = new StdioServerTransport();
await server.connect(transport);
```

---

### Q3.5：如何调试MCP服务器？

```bash
# 启动带调试输出的Claude Code
claude --mcp-debug

# 或设置环境变量
export DEBUG=mcp:*
claude
```

---

### Q3.6：如何开发Hooks？

**示例：PreToolUse Hook**

```bash
#!/bin/bash
# .claude/hooks/pre-tool-use/validate-write.sh

# 读取工具信息
TOOL_NAME="$1"
TOOL_PARAMS="$2"

if [ "$TOOL_NAME" = "Write" ]; then
  FILE_PATH=$(echo "$TOOL_PARAMS" | jq -r '.file_path')

  # 检查是否在允许的目录
  if [[ ! "$FILE_PATH" =~ ^src/ ]]; then
    echo "错误：只允许写入src/目录"
    exit 1  # 阻止操作
  fi
fi

exit 0  # 允许操作
```

---

### Q3.7：如何开发Skills？

**目录结构**：

```
.claude/skills/my-skill/
├── skill.yaml          # 配置文件
├── prompts/           # 提示词目录
│   └── main.md
└── scripts/           # 脚本目录
    └── helper.py
```

**skill.yaml**：

```yaml
name: my-skill
description: 我的技能包
prompts:
  - name: main
    path: prompts/main.md
    trigger: auto
```

---

### Q3.8：Agent SDK如何处理流式输出？

```typescript
for await (const message of stream) {
  switch (message.type) {
    case 'assistant':
      // 助手消息
      for (const chunk of message.message.content) {
        if (chunk.type === 'text') {
          process.stdout.write(chunk.text);
        }
      }
      break;

    case 'tool_use':
      // 工具调用
      console.log(`\n[Tool: ${message.tool.name}]`);
      break;

    case 'tool_result':
      // 工具结果
      console.log('[Tool completed]');
      break;

    case 'error':
      // 错误
      console.error(`Error: ${message.error}`);
      break;
  }
}
```

---

### Q3.9：如何实现子Agent的错误处理？

```typescript
const stream = query({
  prompt: `创建子Agent处理任务。

如果子Agent失败：
1. 记录错误信息
2. 尝试用不同策略重试
3. 如果仍失败，返回降级结果

使用Task工具创建子Agent，用TaskOutput收集结果并检查错误。`,
  options: {
    allowedTools: ['Task', 'TaskOutput'],
    maxTurns: 30
  }
});
```

---

### Q3.10：如何在Agent中使用环境变量？

```typescript
// 读取环境变量
const apiKey = process.env.MY_API_KEY;

const stream = query({
  prompt: `使用API密钥${apiKey}调用外部服务`,
  options: {
    mcpServers: {
      custom: {
        command: 'node',
        args: ['./server.js'],
        env: {
          API_KEY: apiKey
        }
      }
    }
  }
});
```

---

### Q3.11-Q3.25：其他开发问题

| 问题 | 关键解决方案 |
|------|-------------|
| Q3.11：如何限制子Agent数量？ | Claude Code最多10个并发 |
| Q3.12：子Agent如何共享数据？ | 通过主Agent传递或使用MCP |
| Q3.13：如何实现Agent间通信？ | 使用TaskOutput传递结果 |
| Q3.14：如何设置超时？ | `timeout`参数（单位ms） |
| Q3.15：如何取消正在运行的任务？ | `KillShell`工具 |
| Q3.16：如何记录Agent日志？ | 在prompt中要求"生成详细日志" |
| Q3.17：如何处理大量并发？ | 分批执行，每批≤8个 |
| Q3.18：如何测试MCP服务器？ | 使用`/test-mcp`命令 |
| Q3.19：如何优化提示词？ | 使用CTF公式：Context+Task+Format |
| Q3.20：如何实现条件逻辑？ | 在提示词中描述if-else逻辑 |
| Q3.21：如何处理JSON数据？ | 使用`jq`工具或让Agent解析 |
| Q3.22：如何生成图表？ | 使用Mermaid语法 |
| Q3.23：如何访问外部API？ | 通过MCP服务器或Bash curl |
| Q3.24：如何实现缓存？ | 使用MCP或本地文件缓存 |
| Q3.25：如何版本管理配置？ | 将.claude/目录加入Git |

---

## 第四部分：故障排查（15个FAQ）

### Q4.1：Claude响应很慢怎么办？

**可能原因**：

1. 上下文过长
2. 网络问题
3. 模型负载高

**解决方案**：

```bash
# 1. 清空上下文
/clear

# 2. 使用更快的模型
claude --model claude-haiku-3

# 3. 检查网络
ping api.anthropic.com

# 4. 使用本地缓存
# Claude Code会自动缓存重复查询
```

---

### Q4.2：提示"Rate limit exceeded"怎么办？

**错误**：超出API速率限制。

**解决方案**：

```bash
# 1. 等待（速率限制通常1分钟后重置）

# 2. 升级API套餐（更高速率限制）

# 3. 优化调用频率
# - 减少不必要的工具调用
# - 使用批量操作
# - 启用缓存

# 4. 实现重试逻辑（Agent SDK）
async function queryWithRetry(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await query({ prompt });
    } catch (error) {
      if (error.message.includes('rate_limit')) {
        await sleep(60000);  // 等待1分钟
      } else {
        throw error;
      }
    }
  }
}
```

---

### Q4.3：MCP服务器无法启动？

**错误**：`MCP server failed to start`

**排查步骤**：

```bash
# 1. 检查MCP服务器是否安装
npx @anthropic/mcp-server-filesystem --version

# 2. 手动启动测试
npx @anthropic/mcp-server-filesystem /path

# 3. 检查.mcp.json配置
cat .mcp.json

# 4. 查看错误日志
claude --mcp-debug
```

**常见问题**：

- 路径不存在 → 检查`args`中的路径
- 环境变量未设置 → 检查`env`配置
- 权限不足 → 检查文件权限

---

### Q4.4：Tool调用失败怎么排查？

**步骤**：

1. **查看工具名称是否正确**

```bash
# 正确
Read file_path="..."

# 错误
read file_path="..."  # 工具名大小写敏感
```

2. **检查必需参数**

```typescript
// Read工具必需参数
file_path: string  // 必需
offset?: number    // 可选
limit?: number     // 可选
```

3. **启用详细日志**

```bash
claude --verbose
```

---

### Q4.5：如何处理文件编码问题？

**问题**：读取文件显示乱码。

**解决方案**：

```bash
# 检查文件编码
file -i filename.txt

# 转换为UTF-8
iconv -f GBK -t UTF-8 filename.txt > filename_utf8.txt

# 或在Read前转换
Bash command="iconv -f GBK -t UTF-8 file.txt > temp.txt"
Read file_path="temp.txt"
```

---

### Q4.6：Git操作失败怎么办？

**常见错误**：

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `fatal: not a git repository` | 不在Git仓库中 | `git init`或切换到仓库目录 |
| `error: failed to push` | 没有推送权限 | 检查SSH密钥或HTTPS凭据 |
| `conflict` | 合并冲突 | 手动解决冲突 |
| `detached HEAD` | 不在分支上 | `git checkout main` |

---

### Q4.7：如何解决依赖冲突？

```bash
# 清理依赖
rm -rf node_modules package-lock.json
npm install

# 或使用
npm ci  # 根据lock文件安装

# Python项目
rm -rf venv
python -m venv venv
pip install -r requirements.txt
```

---

### Q4.8：Claude生成的代码无法运行？

**排查清单**：

- [ ] 检查语法错误
- [ ] 检查依赖是否安装
- [ ] 检查环境变量
- [ ] 检查文件路径
- [ ] 检查权限

**调试命令**：

```bash
# JavaScript/TypeScript
npx tsc --noEmit  # 类型检查
npm run lint      # 代码检查

# Python
python -m py_compile script.py  # 语法检查
pylint script.py                # 代码检查
```

---

### Q4.9：如何处理Claude的幻觉（Hallucination）？

**问题**：Claude生成不存在的API或错误的代码。

**预防措施**：

1. **使用MCP获取最新文档**

```bash
mcp__context7__resolve_library_id libraryName="react"
mcp__context7__get_library_docs context7CompatibleLibraryID="/facebook/react"
```

2. **明确要求"只使用实际存在的API"**

3. **要求"生成代码后验证"**

```bash
请生成代码，然后使用Bash工具运行测试验证代码正确性
```

---

### Q4.10：如何处理超时问题？

**场景**：长时间运行的任务超时。

**解决方案**：

```bash
# 增加timeout（CLI）
Bash command="npm run build" timeout=600000  # 10分钟

# 或使用后台运行
Bash command="npm run build" run_in_background=true
TaskOutput task_id="..." timeout=600000
```

---

### Q4.11-Q4.15：其他故障排查

| 问题 | 解决方案 |
|------|---------|
| Q4.11：提示内存不足？ | 使用/clear清理上下文，或分批处理 |
| Q4.12：工具权限被拒绝？ | 检查permissionMode设置 |
| Q4.13：无法写入文件？ | 检查文件权限和磁盘空间 |
| Q4.14：Grep没有结果？ | 检查pattern正则语法，使用-i忽略大小写 |
| Q4.15：Glob找不到文件？ | 检查pattern语法，确保路径正确 |

---

## 第五部分：最佳实践FAQ（20个）

### Q5.1：什么时候用单Agent，什么时候用多Agent？

**决策树**：

```
任务复杂度评估
        │
        ├─ 简单（1-2个文件，<500行）
        │     → 单Agent
        │
        ├─ 中等（3-10个文件，500-2000行）
        │     → Orchestrator + 3-5个Worker
        │
        └─ 复杂（>10个文件，>2000行）
              → Orchestrator + 分层Worker
```

---

### Q5.2：如何选择模型？

| 场景 | 推荐模型 | 原因 |
|------|---------|------|
| **复杂推理、架构设计** | Opus | 推理能力最强 |
| **代码生成、日常开发** | Sonnet | 性价比最优 |
| **简单任务、批量处理** | Haiku | 成本最低 |
| **Orchestrator** | Opus | 需要复杂决策 |
| **Worker** | Sonnet/Haiku | 执行具体任务 |

---

### Q5.3：如何提高Agent准确性？

**技巧**：

1. **明确任务边界**

```bash
# ❌ 模糊
请优化代码

# ✅ 明确
请优化src/api/user.ts中的getUserData函数，减少数据库查询次数
```

2. **提供参考示例**

```bash
请参考src/api/order.ts的实现风格重构user.ts
```

3. **使用验证步骤**

```bash
生成代码后：
1. 运行TypeScript类型检查
2. 运行单元测试
3. 如果失败，分析原因并修复
```

---

### Q5.4：如何优化成本？

**策略**：

| 优化点 | 方法 | 节省 |
|--------|------|------|
| **模型选择** | 简单任务用Haiku | 50% |
| **上下文管理** | 定期/clear | 30% |
| **批量操作** | 一次处理多个文件 | 40% |
| **缓存结果** | 复用查询结果 | 60% |
| **并行执行** | 减少总时间 | 时间↓70% |

---

### Q5.5：如何设计可维护的Slash命令？

**最佳实践**：

1. **单一职责**：每个命令做一件事
2. **模块化**：复杂逻辑抽取为脚本
3. **清晰文档**：注释说明参数和输出
4. **错误处理**：优雅处理失败情况

**示例**：

```markdown
<!-- .claude/commands/deploy.md -->

# 部署到生产环境

⚠️ 危险操作，请确认！

步骤：
1. 运行测试：`npm test`
2. 构建：`npm run build`
3. 部署：`npm run deploy`

如果任何步骤失败，立即停止并报告错误。

参数：$ARGUMENTS（部署目标：staging/production）
```

---

### Q5.6-Q5.20：其他最佳实践

| 问题 | 建议 |
|------|------|
| Q5.6：如何组织项目结构？ | 使用.claude/目录集中管理commands/hooks/skills |
| Q5.7：如何编写CLAUDE.md？ | 包含编码规范、项目结构、技术栈 |
| Q5.8：如何做代码审查？ | 使用Review Agent，设置评分标准 |
| Q5.9：如何管理API配额？ | 监控使用量，设置预警 |
| Q5.10：如何团队共享配置？ | 将.claude/目录提交到Git |
| Q5.11：如何处理敏感数据？ | 使用.env，不提交到Git |
| Q5.12：如何提高安全性？ | 限制allowedTools，使用沙箱模式 |
| Q5.13：如何实现CI/CD集成？ | 使用--headless模式 |
| Q5.14：如何监控Agent性能？ | 记录执行时间和Token使用 |
| Q5.15：如何做A/B测试？ | 对比不同提示词的效果 |
| Q5.16：如何处理版本升级？ | 查看CHANGELOG，测试后升级 |
| Q5.17：如何备份配置？ | 定期备份~/.claude/目录 |
| Q5.18：如何回滚操作？ | 使用Git回滚或备份恢复 |
| Q5.19：如何提高可读性？ | 要求生成注释和文档 |
| Q5.20：如何学习最佳实践？ | 参考官方示例和社区项目 |

---

## 快速索引

### 按问题类型查找

- **安装配置**：Q1.1 - Q1.20
- **日常使用**：Q2.1 - Q2.30
- **开发定制**：Q3.1 - Q3.25
- **故障排查**：Q4.1 - Q4.15
- **最佳实践**：Q5.1 - Q5.20

### 按关键词查找

| 关键词 | 相关FAQ |
|--------|---------|
| 安装 | Q1.1, Q1.2, Q1.3, Q1.6 |
| API密钥 | Q1.4, Q1.12 |
| 网络 | Q1.5, Q4.3 |
| Git | Q2.10, Q4.6 |
| MCP | Q1.8, Q3.4, Q3.5, Q4.3 |
| Agent | Q2.23, Q3.9, Q5.1 |
| 性能 | Q4.1, Q5.4 |
| 错误 | Q4.2, Q4.4, Q4.9 |

---

## 获取帮助

如果FAQ没有解决你的问题：

1. **查看官方文档**：https://docs.anthropic.com/claude-code
2. **搜索GitHub Issues**：https://github.com/anthropics/claude-code/issues
3. **提问社区**：https://community.anthropic.com
4. **提交Issue**：https://github.com/anthropics/claude-code/issues/new

---

**FAQ版本**：V1.0
**最后更新**：2025-12-12
**总字数**：10,000字
**问题总数**：90个
