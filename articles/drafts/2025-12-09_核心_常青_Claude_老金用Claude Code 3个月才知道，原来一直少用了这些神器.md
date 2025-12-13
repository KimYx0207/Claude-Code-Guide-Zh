# 老金用Claude Code 3个月才知道，原来一直少用了这些神器

## 备选标题

【推荐标题2】Claude Code的MCP和Hooks，用对了效率翻3倍
【推荐标题3】Claude Code高级玩法，看完直接起飞
【推荐标题4】这样配置Claude Code，写代码像开挂一样
【推荐标题5】Claude Code隐藏功能大揭秘，第5个绝了

**老金推荐使用：标题1**
推荐理由：经验故事型+FOMO型组合，"用了3个月"建立信任感，"99%的人不知道"制造稀缺感和好奇心。符合爆款公式预期阅读5000-7000，时间维度+价值点明确！

---

说实话，刚开始用Claude Code的时候，我觉得它就是个命令行版的Claude。

能聊天，能写代码，仅此而已。

直到上个月，我看到一个老哥的配置文件。

乖乖，原来Claude Code还能这么玩？

MCP、Hooks、Subagents、Skills...

这些功能藏得太深了，官方文档写得又晦涩。

今天老金把这3个月踩过的坑、摸索出的技巧，全部分享出来。

## Claude Code是什么？30秒讲清楚

Claude Code是Anthropic官方出的命令行工具。

**和网页版Claude的区别：**

网页版Claude：你复制代码给它，它改完你再复制回来。
Claude Code：它直接读你的代码，直接帮你改，一步到位。

**最核心的能力：**

1、能直接读写你电脑上的文件
2、能运行命令行命令
3、能连接各种外部工具（MCP）
4、能自动化执行任务（Hooks）

简单说就是：**AI直接进入你的开发环境，帮你干活。**

不用来回复制粘贴了。

## 安装：2分钟搞定

**前提：**
- 需要Node.js 18+
- 需要Anthropic API Key

**安装命令：**

```bash
npm install -g @anthropic-ai/claude-code
```

**启动：**

```bash
claude
```

第一次启动会让你登录Anthropic账号。

登录完就能用了。

**小技巧：**

在项目根目录启动Claude Code，它会自动读取项目结构。

比在随便一个目录启动，上下文理解能力强10倍。

## MCP：让Claude Code连接一切

这是Claude Code最强的功能，但90%的人不知道怎么用。

**MCP是什么？**

Model Context Protocol，模型上下文协议。

说人话就是：**让Claude Code能调用外部工具。**

比如：
- 连接数据库，直接查数据
- 操作浏览器，自动化测试
- 调用API，获取实时数据
- 读取最新文档，避免写过时代码

**怎么添加MCP服务器？**

```bash
# 添加一个MCP服务器
claude mcp add <名字> <命令> [参数...]

# 例如：添加context7（获取最新文档）
claude mcp add context7 npx -y @anthropic-ai/mcp-server-context7

# 例如：添加浏览器自动化
claude mcp add browser npx -y @anthropic-ai/mcp-server-puppeteer
```

**查看已安装的MCP：**

```bash
claude mcp list
```

**我最推荐的3个MCP服务器：**

### 1、Context7（必装）

这个太重要了。

Claude的知识有截止日期，写代码经常用过时的API。

装了Context7，它能实时获取官方文档。

```bash
claude mcp add context7 npx -y @upstash/context7-mcp
```

**使用场景：**

> 帮我用Next.js 15的App Router写一个登录页面

Claude Code会先通过Context7查询Next.js 15的最新文档，再写代码。

不会再给你写pages目录那套老东西了。

### 2、Playwright（浏览器自动化）

能让Claude Code操作浏览器。

```bash
claude mcp add playwright npx -y @anthropic-ai/mcp-server-playwright
```

**使用场景：**

> 帮我打开http://localhost:3000，截个图看看效果

Claude Code会自动启动浏览器，打开页面，截图给你看。

不用你手动切换窗口了。

### 3、GitHub（代码仓库）

能让Claude Code直接操作GitHub。

```bash
claude mcp add github npx -y @anthropic-ai/mcp-server-github
```

**使用场景：**

> 帮我看看这个仓库最近的issue有哪些

Claude Code直接调用GitHub API，给你列出来。

不用你打开浏览器去看了。

## Hooks：自动化的灵魂

这是Claude Code的另一个杀手锏。

**Hooks是什么？**

在特定事件发生时，自动执行的脚本。

比如：
- 每次Claude Code写完代码，自动格式化
- 每次Claude Code要提交代码，先跑测试
- Claude Code需要你输入时，发桌面通知

**三种Hook类型：**

### 1、PreToolUse（工具使用前）

在Claude Code执行某个工具**之前**运行。

**最常用的场景：阻止危险操作**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": {
          "tool_name": "edit_file",
          "file_paths": ["*.env", "credentials.*"]
        },
        "command": "echo '禁止修改敏感文件！' && exit 2"
      }
    ]
  }
}
```

这样配置后，Claude Code想改.env文件，直接被拦截。

**另一个场景：强制先写测试**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": {
          "tool_name": "write_file",
          "file_paths": ["src/**/*.ts"]
        },
        "command": "test -f tests/$(basename $CLAUDE_FILE_PATH .ts).test.ts || (echo '请先写测试文件！' && exit 2)"
      }
    ]
  }
}
```

想写src下的ts文件？先确保有对应的测试文件。

没有就不让写。

**TDD党狂喜。**

### 2、PostToolUse（工具使用后）

在Claude Code执行完某个工具**之后**运行。

**最常用的场景：自动格式化代码**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": {
          "tool_name": "edit_file",
          "file_paths": ["*.py"]
        },
        "command": "black $CLAUDE_FILE_PATHS && ruff check --fix $CLAUDE_FILE_PATHS"
      }
    ]
  }
}
```

Claude Code每次改完Python文件，自动跑black格式化+ruff检查。

你不用手动跑了。

**另一个场景：自动运行测试**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": {
          "tool_name": "edit_file",
          "file_paths": ["src/**/*.ts"]
        },
        "command": "npm test -- --findRelatedTests $CLAUDE_FILE_PATHS"
      }
    ]
  }
}
```

改完代码，自动跑相关测试。

出问题立马知道。

### 3、Notification（通知）

Claude Code需要你输入时，发桌面通知。

**场景：跑长任务时不用盯着屏幕**

```json
{
  "hooks": {
    "Notification": [
      {
        "command": "osascript -e 'display notification \"Claude Code需要你的输入\" with title \"Claude Code\"'"
      }
    ]
  }
}
```

让Claude Code跑一个大任务，你去喝杯咖啡。

它需要你确认时，桌面弹通知。

不用一直盯着了。

### 4、SessionStart（新增！）

2025年新增的Hook，在新会话开始时运行。

**场景：自动加载项目上下文**

```json
{
  "hooks": {
    "SessionStart": [
      {
        "command": "cat CLAUDE.md && echo '---项目上下文已加载---'"
      }
    ]
  }
}
```

每次启动新会话，自动读取CLAUDE.md项目说明。

Claude Code一开始就知道项目是干嘛的。

## 配置文件在哪？

**全局配置：**

Mac: `~/.claude.json`
Windows: `%USERPROFILE%\.claude.json`

**项目配置：**

项目根目录下的 `.claude/settings.json`

**优先级：**

项目配置 > 全局配置

建议把通用的MCP放全局，项目特定的Hooks放项目目录。

## 5个实战技巧（踩坑总结）

### 技巧1：用CLAUDE.md喂上下文

在项目根目录创建 `CLAUDE.md` 文件。

写清楚：
- 项目是干什么的
- 技术栈是什么
- 代码规范是什么
- 有什么特殊约定

Claude Code启动时会自动读这个文件。

**我的模板：**

```markdown
# 项目名称

## 技术栈
- 前端：Next.js 15 + TypeScript
- 后端：FastAPI + Python 3.12
- 数据库：PostgreSQL

## 代码规范
- 使用中文注释
- 函数名用snake_case
- 组件名用PascalCase

## 重要约定
- API路径统一用/api/v1/前缀
- 错误处理用自定义的AppError类
- 所有数据库操作用async
```

有了这个，Claude Code写出来的代码风格统一多了。

### 技巧2：善用/开头的命令

Claude Code有很多内置命令，用/开头。

**常用的：**

```
/help          查看帮助
/clear         清空对话历史
/compact       压缩对话（省token）
/cost          查看花了多少钱
/doctor        诊断问题
/init          初始化项目配置
```

**/compact特别有用：**

聊久了上下文太长，token费用蹭蹭涨。

输入 `/compact`，Claude Code会压缩之前的对话，保留关键信息。

省钱神器。

### 技巧3：多用Task拆分大任务

别一次性让Claude Code做太多事。

**错误示范：**

> 帮我写一个完整的用户管理系统，包括注册、登录、权限管理、用户列表、用户详情...

Claude Code会晕，你也会晕。

**正确做法：**

> 先帮我设计用户管理系统的数据库表结构

> 好的，现在帮我写用户注册的API

> 接下来写登录API

一步一步来，每步确认没问题再继续。

### 技巧4：让Claude Code解释它在干什么

加一句话，效果翻倍：

> 帮我优化这段代码的性能，**并解释你做了什么改动、为什么这样改**

Claude Code不只是帮你改代码，还教你为什么这样改。

学到就是赚到。

### 技巧5：用--debug排查问题

MCP连不上？Hooks不生效？

加 `--debug` 参数启动：

```bash
claude --debug
```

所有内部日志都会打出来。

哪里出问题一目了然。

## 避坑指南：3个常见问题

### 问题1：MCP服务器连不上

**症状：** 添加了MCP但调用时报错

**解决：**

1、确认Node.js版本 >= 18
2、用 `claude mcp list` 检查是否添加成功
3、用 `claude --mcp-debug` 启动，看详细错误信息
4、检查网络，有些MCP需要科学上网

### 问题2：Hooks不生效

**症状：** 配置了Hook但没有执行

**解决：**

1、检查 `.claude/settings.json` 语法是否正确（用JSON validator）
2、matcher的file_paths是glob模式，注意通配符写法
3、command的exit code：0=继续，2=阻止
4、用 `claude --debug` 看Hook是否被触发

### 问题3：Token费用太高

**症状：** 用几天就花了好多钱

**解决：**

1、用 `/compact` 定期压缩对话
2、用 `/clear` 清空不需要的历史
3、别一次性丢太多文件给Claude Code
4、复杂任务拆分成小任务

## 和网页版Claude怎么配合？

**我的工作流：**

**网页版Claude：**
- 头脑风暴、讨论方案
- 写文档、写邮件
- 学习新概念

**Claude Code：**
- 实际写代码、改代码
- 跑命令、调试
- 自动化任务

两个配合着用，效率最高。

别想着一个工具解决所有问题。

## 说点大实话

Claude Code确实强。

但它不是银弹。

**适合的场景：**
- 重复性的代码修改
- 按照规范写新功能
- 代码审查和优化
- 自动化脚本任务

**不适合的场景：**
- 从0到1的架构设计（还是得人来想）
- 涉及复杂业务逻辑（它理解不了你公司的业务）
- 安全敏感的代码（别让AI碰你的密钥）

用对了场景，效率翻3倍不是吹的。

用错了场景，可能帮倒忙。

---

最后说一句。

Claude Code的更新速度很快，隔几周就有新功能。

建议关注官方文档：https://docs.anthropic.com/claude-code

有新东西第一时间知道。

别像我一样，用了3个月才发现MCP这么香。

---

## 参考来源

1、Claude Code官方文档：https://docs.anthropic.com/claude-code
2、MCP协议规范：https://modelcontextprotocol.io/
3、Claude Code Cheatsheet：https://awesomeclaude.ai/code-cheatsheet
4、Understanding Claude Code's Full Stack（alexop.dev）
5、Claude Code: Intermediate & Advanced Techniques（TianPan.co）
6、Claude Code开发者社区讨论
7、Anthropic官方博客更新日志

---

**最后更新：2025-11-23**
**基于3个月实际使用经验总结**