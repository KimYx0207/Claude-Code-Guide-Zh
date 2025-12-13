# Claude Code 插件市场完整指南

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 高级教程
**标签**: #Claude Code #插件 #插件市场 #扩展功能 #市场清单

---

Claude Code 插件系统是 Anthropic 正式推出的扩展功能框架，允许用户通过插件扩展 Claude Code 的功能。目前该系统处于公测阶段，适用于所有 Claude Code 用户，并在终端和 VS Code 中无缝工作。

### 什么是 Claude Code 插件？

Claude Code 插件是一种轻量级的方式，用于打包和共享自定义扩展点组合，包括：

- 斜杠命令（Slash Commands）：创建自定义快捷方式，执行常见操作
- 子代理（Subagents）：专为特定开发任务设计的专用代理
- MCP 服务器（MCP Servers）：通过 Model Context Protocol 连接外部工具和数据源
- 钩子（Hooks）：在 Claude Code 工作流的关键点自定义行为

### 插件系统工作原理

#### 扩展点集成

插件通过集成 Claude Code 的现有扩展点来工作：

1. 斜杠命令：创建自定义快捷方式，如快速生成文档或格式化代码
2. 子代理：安装专为特定开发任务设计的代理，如测试自动化或 DevOps 工作流
3. MCP 服务器：连接外部工具和数据源，支持安全集成内部系统
4. 钩子：在关键工作流点自定义行为，如代码审查或测试阶段触发特定动作

#### 市场机制

用户在 Claude Code 中使用 /plugin 命令直接管理插件。插件可以从市场（marketplaces）中安装，这些市场是托管在 Git 仓库、GitHub 仓库或 URL 中的精选集合。

### 插件系统特性

#### 核心优势

自定义与共享：将多个扩展点打包成插件，便于标准化设置，并与团队或社区共享。

可切换功能：轻松启用/禁用插件，控制系统提示的上下文大小和复杂性，避免不必要的开销。

市场支持：插件可以托管在市场中，这些市场允许精选和大规模分发。用户可以添加多个市场，并浏览/安装插件。

安全与配置：插件继承 Claude Code 的安全协议，支持连接内部工具时进行认证和配置。

捆绑能力：针对特定用例捆绑多个自定义项，例如框架作者可以创建一个包含命令、代理和钩子的插件包。

跨平台兼容：在终端和 VS Code 中均可用，包括原生 VS Code 扩展（beta 版）。

### 插件安装与管理

#### 基本安装流程

1. 添加市场：

```bash
/plugin marketplace add 用户或组织/仓库名
```

例如：/plugin marketplace add anthropics/claude-code

1. 浏览与安装：

```bash
/plugin  # 打开菜单浏览可用插件
```

或直接安装：

```bash
/plugin install 插件名@市场名
```

1. 管理插件：

```bash
/plugin enable 插件名@市场名    # 启用
/plugin disable 插件名@市场名   # 禁用（不卸载）
/plugin uninstall 插件名@市场名  # 卸载
```

1. 团队级安装：
在仓库的 .claude/settings.json 中配置市场和插件，团队成员信任仓库后自动安装。

#### 验证安装

安装后可能需要重启 Claude Code。验证方式：

- 运行 /help 查看新命令
- 测试具体功能
- 检查 /plugin 列表中的插件状态

### 创建自己的插件

#### 快速入门示例

创建一个简单的问候插件：

##### 1. 创建市场结构

```bash
mkdir test-marketplace
cd test-marketplace
```

##### 2. 创建插件目录

```bash
mkdir my-first-plugin
cd my-first-plugin
```

##### 3. 添加插件清单

```bash
mkdir .claude-plugin
cat > .claude-plugin/plugin.json << 'EOF'
{
  "name": "my-first-plugin",
  "description": "A simple greeting plugin to learn the basics",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
EOF
```

##### 4. 添加自定义命令

```bash
mkdir commands
cat > commands/hello.md << 'EOF'
---
description: Greet the user with a personalized message
---

# Hello Command

Greet the user warmly and ask how you can help them today. Make the greeting personal and encouraging.
EOF
```

##### 5. 创建市场清单

```bash
cd ..
mkdir .claude-plugin
cat > .claude-plugin/marketplace.json << 'EOF'
{
  "name": "test-marketplace",
  "owner": {
    "name": "Test User"
  },
  "plugins": [
    {
      "name": "my-first-plugin",
      "source": "./my-first-plugin",
      "description": "My first test plugin"
    }
  ]
}
EOF
```

##### 6. 安装与测试

```bash
# 从父目录启动 Claude Code
/plugin marketplace add ./test-marketplace
/plugin install my-first-plugin@test-marketplace
# 重启后测试 /hello
```

#### 高级插件组件

对于复杂插件，可以添加：

- 代理：agents/ 目录下的 Markdown 文件
- 钩子：hooks/hooks.json
- MCP 服务器：.mcp.json

### 插件共享与分发

#### 共享步骤

1. 添加文档：在插件根目录添加 README.md，包含安装和使用说明
2. 版本化：在 plugin.json 中使用语义版本
3. 市场分发：更新 marketplace.json 包含你的插件，支持 Git、GitHub 或 URL 托管
4. 测试与贡献：让团队测试后发布，支持社区贡献

#### 最佳实践

- 使用清晰的描述和标签
- 提供完整的使用文档
- 包含示例和测试用例
- 定期更新和维护

- 遵循语义版本控制

### 插件市场详细清单

目前 Anthropic 并未提供官方插件市场，以下是收集的第三方插件市场信息：

#### 主要插件市场

##### 1. EveryInc/every-marketplace

- 描述：Official Every-Env plugin marketplace for Claude Code extensions
- Stars：137
- 地址：https://github.com/EveryInc/every-marketplace
- 推荐指数：⭐⭐⭐⭐⭐

##### 2. ananddtyagi/claude-code-marketplace

- 描述：Marketplace repo for Claude Code Plugins
- Stars：68
- 地址：https://github.com/ananddtyagi/claude-code-marketplace
- 推荐指数：⭐⭐⭐⭐

##### 3. obra/superpowers-marketplace

- 描述：Curated Claude Code plugin marketplace
- Stars：7
- 地址：https://github.com/obra/superpowers-marketplace
- 推荐指数：⭐⭐⭐

##### 4. jeremylongshore/claude-code-plugins

- 描述：The comprehensive marketplace and learning hub for Claude Code plugins - multiple production-ready plugins with MCP servers, slash commands, and AI agents
- Stars：3
- 地址：https://github.com/jeremylongshore/claude-code-plugins
- 推荐指数：⭐⭐⭐

#### 其他插件市场

##### 5. huangdijia/cluade-code-plugins

- 描述：Claude Plugin Marketplace
- Stars：1
- 地址：https://github.com/huangdijia/cluade-code-plugins

##### 6. lsmith090/cc-plugins

- 描述：Claude Code plugin marketplace for brainworm
- Stars：1
- 地址：https://github.com/lsmith090/cc-plugins

##### 7. Parslee-ai/claude-code-plugins

- 描述：A marketplace of useful claude code plugins
- Stars：0
- 地址：https://github.com/Parslee-ai/claude-code-plugins

##### 8. leoweb57/cc-plugins

- 描述：Claude code plugins marketplace
- Stars：0
- 地址：https://github.com/leoweb57/cc-plugins

##### 9. russellslater/claude-code-plugins

- 描述：Custom Claude Code plugins marketplace for the discerning developer
- Stars：0
- 地址：https://github.com/russellslater/claude-code-plugins

##### 10. WarrenZhu050413/Warren-Claude-Code-Plugin-Marketplace

- 描述：A personal plugin marketplace for Claude Code
- Stars：0
- 地址：https://github.com/WarrenZhu050413/Warren-Claude-Code-Plugin-Marketplace

##### 11. shaurgon/claude-meow-marketplace

- 描述：Marketplace for Claude Code plugins
- Stars：0
- 地址：https://github.com/shaurgon/claude-meow-marketplace

##### 12. kivilaid/plugin-marketplace

- 描述：Claude Code plugin marketplace showcasing all component types
- Stars：0
- 地址：https://github.com/kivilaid/plugin-marketplace

##### 13. dotclaude/marketplace

- 描述：DotClaude Plugin Marketplace - Revolutionary AI interaction platform for Claude Code
- Stars：0
- 地址：https://github.com/dotclaude/marketplace

##### 14. 1broseidon/marketplace

- 描述：Curated collection of Claude Code plugins for fullstack development teams
- Stars：0
- 地址：https://github.com/1broseidon/marketplace

##### 15. daviguides/claude-marketplace

- 描述：Personal Claude Code marketplace featuring Python development plugins for best practices, documentation standards, and Zen of Python enforcement
- Stars：0
- 地址：https://github.com/daviguides/claude-marketplace

### 插件生态现状

#### 生态分布

根据搜索结果，目前 Claude Code 的插件生态主要分布在 GitHub 上，尚未发现集中式的官方插件市场。

主要的插件来源包括：

1. 社区驱动的插件仓库：由开发者个人或团队维护的插件集合
2. GitHub 搜索：可以通过搜索关键词 “claude code plugin” 或 “claude code marketplace” 找到相关项目
3. MCP 服务器：Model Context Protocol 服务器提供了扩展 Claude Code 功能的方式

#### 如何查找更多插件

在 GitHub 搜索：

- claude code plugin
- claude mcp server
- claude code marketplace

查看官方文档：

- https://docs.claude.com/en/docs/claude-code

- Reddit r/ClaudeAI
- Twitter #ClaudeCode

### 使用建议与最佳实践

#### 选择插件的建议

1. 优先选择高 Star 数的项目：通常意味着更好的质量和维护
2. 查看最近更新时间：确保插件与当前版本兼容
3. 阅读文档和示例：了解插件的功能和使用方法
4. 测试插件功能：在项目中测试后再正式使用

#### 插件管理技巧

1. 定期清理不需要的插件：避免系统臃肿
2. 备份重要配置：防止插件更新导致的问题
3. 关注插件更新：及时获取新功能和安全修复
4. 团队标准化：在团队中统一插件版本和配置

#### 安全考虑

1. 只安装可信来源的插件：避免安全风险
2. 检查插件权限：确保插件不会访问不必要的系统资源
3. 定期审查插件：移除不再需要或有安全问题的插件
4. 使用项目级插件：限制插件的影响范围

### 未来发展

#### 插件系统趋势

- 更多扩展点：随着 Claude Code 发展，将支持更多类型的扩展
- 官方市场：可能推出官方插件市场，提供更好的用户体验
- 企业支持：更强的企业级插件管理和安全控制
- 社区生态：更活跃的社区贡献和插件分享

#### 建议关注

- 官方文档更新
- 社区最佳实践
- 安全性改进
- 性能优化

### 相关文档

- Claude Code 插件参考 - 详细的技术参考文档
- Claude Code MCP 集成 - MCP 服务器配置指南
- Claude Code 子代理 - 子代理系统详解
- Claude Code Hooks 参考 - 钩子系统使用指南
- Claude Code 配置 - 基本配置选项
