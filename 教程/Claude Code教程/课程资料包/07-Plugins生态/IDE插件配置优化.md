# Module 7.1: IDE插件配置优化

**版本**: 1.0
**作者**: Claude Project
**最后更新**: 2025-12-11
**字数**: 11,000+ 字
**难度**: ⭐⭐⭐☆☆ (中级)


## 📖 课程导航

**上一节**：[Module 6.3: 项目交付与文档规范](../../06-企业实战/项目交付与文档规范.md)
**当前节**：**Module 7.1: IDE插件配置优化**
**下一节**：Module 7.2: Claude Plugins生态深度使用


**本模块路径**: `07-Plugins生态/IDE插件配置优化.md`


## 🎯 学习目标
完成本节后，你将能够：

1、✅ 在 **VS Code** 中完整配置 Claude 插件（含 settings.json、keybindings.json、launch.json）
2、✅ 在 **Cursor** 中优化 Claude 集成（含快捷键、性能调优、代码补全）
3、✅ 在 **JetBrains IDEs**（PyCharm/IntelliJ IDEA/WebStorm）中配置 Claude 插件
4、✅ 使用 **EditorConfig** 和 **共享配置仓库** 实现跨 IDE 统一配置
5、✅ 掌握 **10 条插件配置黄金法则**，排查常见配置故障


## 📊 文档价值

**维度**：**实战性**
**说明**：提供 20+ 配置文件完整代码，可直接复制使用


**维度**：**全面性**
**说明**：覆盖主流 IDE（VS Code/Cursor/JetBrains）完整配置


**维度**：**可维护性**
**说明**：包含跨 IDE 统一配置方案（EditorConfig + 共享仓库）


**维度**：**故障排查**
**说明**：附带 10+ 常见问题解决方案


## Part 1: VS Code 完整配置（4,000字）
### 1.1 插件安装与激活
#### 1.1.1 官方插件安装
**步骤**：

1、打开 VS Code
2、按 `Ctrl+Shift+X`（Windows/Linux）或 `Cmd+Shift+X`（macOS）打开扩展面板
3、搜索 `Claude Code`
4、点击 **Install** 按钮
5、重启 VS Code（部分情况需要）

**安装后验证**：
```bash
# 检查插件是否加载
code --list-extensions | grep anthropic
```

预期输出：
```
anthropic.claude-code
```

**插件截图位置**：
![VS Code插件市场中的Claude Code](./images/vscode-claude-plugin-install.png)


#### 1.1.2 API Key 配置
**配置位置**：`settings.json`

打开设置文件：
```bash
# Windows/Linux
code ~/.config/Code/User/settings.json

# macOS
code ~/Library/Application\ Support/Code/User/settings.json
```

**配置代码**：
```json
{
  "claude.apiKey": "sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "claude.model": "claude-sonnet-4.5-20250929",
  "claude.maxTokens": 4096,
  "claude.temperature": 0.7,
  "claude.systemPrompt": "You are a professional developer assistant.",
  "claude.codeAnalysis.enabled": true,
  "claude.codeAnalysis.autoScan": true,
  "claude.contextWindow": 200000
}
```

**字段说明**：


**字段**：`apiKey`
**说明**：Anthropic API密钥
**推荐值**：从控制台获取


**字段**：`model`
**说明**：模型名称
**推荐值**：`claude-sonnet-4.5-20250929`


**字段**：`maxTokens`
**说明**：最大生成长度
**推荐值**：`4096`


**字段**：`temperature`
**说明**：创造性（0-1）
**推荐值**：`0.7`（代码生成）


**字段**：`systemPrompt`
**说明**：系统提示词
**推荐值**：根据场景自定义


**字段**：`codeAnalysis.enabled`
**说明**：启用代码分析
**推荐值**：`true`


**字段**：`contextWindow`
**说明**：上下文窗口
**推荐值**：`200000`


**安全注意**：

⚠️ **不要将 API Key 提交到 Git 仓库！**

推荐使用 **环境变量**：
```json
{
  "claude.apiKey": "${env:ANTHROPIC_API_KEY}"
}
```

然后在系统中设置：
```bash
# Linux/macOS
export ANTHROPIC_API_KEY="sk-ant-api03-XXXX"

# Windows (PowerShell)
$env:ANTHROPIC_API_KEY = "sk-ant-api03-XXXX"
```


### 1.2 settings.json 完整配置
#### 1.2.1 Claude专用配置
```json
{
  // ==================== Claude 核心配置 ====================
  "claude.apiKey": "${env:ANTHROPIC_API_KEY}",
  "claude.model": "claude-sonnet-4.5-20250929",
  "claude.maxTokens": 4096,
  "claude.temperature": 0.7,
  "claude.topP": 0.9,
  "claude.systemPrompt": "You are an expert developer assistant specializing in Python, JavaScript, and TypeScript.",

  // ==================== 代码分析配置 ====================
  "claude.codeAnalysis.enabled": true,
  "claude.codeAnalysis.autoScan": true,
  "claude.codeAnalysis.scanOnSave": true,
  "claude.codeAnalysis.excludePatterns": [
    "**/node_modules/**",
    "**/venv/**",
    "**/.git/**",
    "**/dist/**",
    "**/build/**"
  ],
  "claude.codeAnalysis.includeExtensions": [
    ".py",
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".md"
  ],

  // ==================== 对话配置 ====================
  "claude.conversation.historyLimit": 50,
  "claude.conversation.contextLines": 100,
  "claude.conversation.autoSaveChats": true,
  "claude.conversation.chatStoragePath": "${workspaceFolder}/.claude/chats",

  // ==================== 代码补全配置 ====================
  "claude.completion.enabled": true,
  "claude.completion.triggerCharacters": [".", ":", "(", "{", "["],
  "claude.completion.debounceMs": 300,
  "claude.completion.maxSuggestions": 5,

  // ==================== 性能优化 ====================
  "claude.performance.cacheEnabled": true,
  "claude.performance.cacheTTL": 3600,
  "claude.performance.rateLimitPerMinute": 50,
  "claude.performance.timeoutMs": 30000,

  // ==================== UI配置 ====================
  "claude.ui.chatPanelPosition": "right",
  "claude.ui.showInlineHints": true,
  "claude.ui.theme": "dark",

  // ==================== 安全配置 ====================
  "claude.security.allowNetworkAccess": true,
  "claude.security.sanitizeOutput": true,
  "claude.security.blockSensitivePatterns": true
}
```

**配置截图位置**：
![VS Code settings.json配置界面](./images/vscode-settings-json.png)


#### 1.2.2 编辑器增强配置（与Claude配合）
```json
{
  // ==================== 编辑器通用配置 ====================
  "editor.fontSize": 14,
  "editor.fontFamily": "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.6,
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.wordWrap": "on",
  "editor.rulers": [80, 120],

  // ==================== 代码提示增强 ====================
  "editor.suggest.showKeywords": true,
  "editor.suggest.showSnippets": true,
  "editor.suggest.showWords": true,
  "editor.quickSuggestions": {
    "other": true,
    "comments": false,
    "strings": true
  },
  "editor.suggestSelection": "first",

  // ==================== 格式化配置 ====================
  "editor.formatOnSave": true,
  "editor.formatOnPaste": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.organizeImports": true
  },

  // ==================== Python配置（配合Claude代码分析）====================
  "python.languageServer": "Pylance",
  "python.analysis.autoImportCompletions": true,
  "python.analysis.typeCheckingMode": "basic",
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true
  },

  // ==================== JavaScript/TypeScript配置 ====================
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // ==================== Markdown配置（Claude文档生成）====================
  "[markdown]": {
    "editor.wordWrap": "on",
    "editor.quickSuggestions": false
  },

  // ==================== 终端配置 ====================
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.fontFamily": "'Fira Code', monospace",
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  "terminal.integrated.defaultProfile.linux": "bash"
}
```


### 1.3 keybindings.json 快捷键配置
**打开快捷键配置**：
```bash
# Windows/Linux
code ~/.config/Code/User/keybindings.json

# macOS
code ~/Library/Application\ Support/Code/User/keybindings.json
```

**完整快捷键配置**：
```json
[
  // ==================== Claude 核心快捷键 ====================
  {
    "key": "ctrl+shift+c",
    "command": "claude.openChat",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+a",
    "command": "claude.analyzeCode",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+e",
    "command": "claude.explainCode",
    "when": "editorHasSelection"
  },
  {
    "key": "ctrl+shift+r",
    "command": "claude.refactorCode",
    "when": "editorHasSelection"
  },
  {
    "key": "ctrl+shift+t",
    "command": "claude.generateTests",
    "when": "editorTextFocus"
  },
  {
    "key": "ctrl+shift+d",
    "command": "claude.generateDocstring",
    "when": "editorTextFocus"
  },

  // ==================== 对话管理 ====================
  {
    "key": "ctrl+alt+n",
    "command": "claude.newChat"
  },
  {
    "key": "ctrl+alt+h",
    "command": "claude.showChatHistory"
  },
  {
    "key": "ctrl+alt+c",
    "command": "claude.clearChat"
  },

  // ==================== 代码补全增强 ====================
  {
    "key": "ctrl+space",
    "command": "claude.triggerSuggest",
    "when": "editorTextFocus && !editorHasSelection"
  },

  // ==================== 工作区管理 ====================
  {
    "key": "ctrl+shift+p",
    "command": "workbench.action.showCommands"
  },
  {
    "key": "ctrl+b",
    "command": "workbench.action.toggleSidebarVisibility"
  },

  // ==================== 终端快捷键 ====================
  {
    "key": "ctrl+`",
    "command": "workbench.action.terminal.toggleTerminal"
  },
  {
    "key": "ctrl+shift+`",
    "command": "workbench.action.terminal.new"
  }
]
```

**快捷键说明表**：


**快捷键**：`Ctrl+Shift+C`
**命令**：打开对话
**说明**：打开Claude对话面板


**快捷键**：`Ctrl+Shift+A`
**命令**：分析代码
**说明**：分析当前文件


**快捷键**：`Ctrl+Shift+E`
**命令**：解释代码
**说明**：解释选中代码


**快捷键**：`Ctrl+Shift+R`
**命令**：重构代码
**说明**：重构选中代码


**快捷键**：`Ctrl+Shift+T`
**命令**：生成测试
**说明**：为当前函数生成测试


**快捷键**：`Ctrl+Shift+D`
**命令**：生成文档
**说明**：生成Docstring


**快捷键**：`Ctrl+Alt+N`
**命令**：新建对话
**说明**：开始新的对话


**快捷键**：`Ctrl+Alt+H`
**命令**：对话历史
**说明**：查看历史对话


**快捷键截图位置**：
![VS Code快捷键配置界面](./images/vscode-keybindings.png)


### 1.4 launch.json 调试配置
**创建调试配置**：

1、按 `F5` 或打开 **运行和调试** 面板
2、点击 **创建 launch.json 文件**
3、选择环境（Python/Node.js/等）

**Python调试配置（含Claude集成）**：
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: 当前文件 (Claude辅助)",
      "type": "python",
      "request": "launch",
      "program": "${file}",
      "console": "integratedTerminal",
      "justMyCode": true,
      "env": {
        "ANTHROPIC_API_KEY": "${env:ANTHROPIC_API_KEY}",
        "PYTHONPATH": "${workspaceFolder}"
      },
      "preLaunchTask": "claude.analyzeCode"
    },
    {
      "name": "Python: 远程调试",
      "type": "python",
      "request": "attach",
      "connect": {
        "host": "localhost",
        "port": 5678
      },
      "pathMappings": [
        {
          "localRoot": "${workspaceFolder}",
          "remoteRoot": "/app"
        }
      ]
    },
    {
      "name": "Python: 单元测试",
      "type": "python",
      "request": "launch",
      "module": "pytest",
      "args": [
        "-v",
        "${workspaceFolder}/tests"
      ],
      "console": "integratedTerminal"
    }
  ]
}
```

**Node.js调试配置**：
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Node.js: 当前文件",
      "type": "node",
      "request": "launch",
      "program": "${file}",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "env": {
        "ANTHROPIC_API_KEY": "${env:ANTHROPIC_API_KEY}"
      }
    },
    {
      "name": "Node.js: Attach",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "restart": true
    }
  ]
}
```


### 1.5 终端集成配置
#### 1.5.1 集成终端配置
**settings.json中的终端配置**：
```json
{
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.fontFamily": "'Fira Code', monospace",
  "terminal.integrated.cursorStyle": "line",
  "terminal.integrated.cursorBlinking": true,
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\bin\\bash.exe",
  "terminal.integrated.shellArgs.windows": [
    "--login"
  ],
  "terminal.integrated.env.windows": {
    "ANTHROPIC_API_KEY": "${env:ANTHROPIC_API_KEY}"
  }
}
```

#### 1.5.2 任务集成（tasks.json）
**创建 `.vscode/tasks.json`**：
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Claude: 分析代码",
      "type": "shell",
      "command": "echo '正在调用Claude分析代码...'",
      "group": {
        "kind": "test",
        "isDefault": true
      },
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "运行Python脚本",
      "type": "shell",
      "command": "python ${file}",
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "运行测试",
      "type": "shell",
      "command": "pytest -v tests/",
      "group": "test",
      "problemMatcher": []
    },
    {
      "label": "Lint检查",
      "type": "shell",
      "command": "ruff check .",
      "group": "test"
    }
  ]
}
```

**运行任务**：

1、按 `Ctrl+Shift+P`
2、输入 `Tasks: Run Task`
3、选择任务


### 1.6 推荐扩展组合
**核心扩展**（与Claude配合）：
```json
{
  "recommendations": [
    // ========== Claude相关 ==========
    "anthropic.claude-code",

    // ========== Python开发 ==========
    "ms-python.python",
    "ms-python.vscode-pylance",
    "ms-python.black-formatter",
    "charliermarsh.ruff",

    // ========== JavaScript/TypeScript ==========
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",

    // ========== Git ==========
    "eamodio.gitlens",
    "mhutchie.git-graph",

    // ========== 代码质量 ==========
    "streetsidesoftware.code-spell-checker",
    "editorconfig.editorconfig",

    // ========== UI增强 ==========
    "pkief.material-icon-theme",
    "zhuangtongfa.material-theme"
  ]
}
```

**一键安装扩展**：
```bash
# 安装所有推荐扩展
code --install-extension anthropic.claude-code
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension eamodio.gitlens
```


## Part 2: Cursor 完整配置（3,000字）
### 2.1 Cursor特性与VS Code对比
#### 2.1.1 核心差异

**特性**：**AI集成**
**VS Code**：需插件
**Cursor**：原生内置
**优势**：Cursor


**特性**：**代码补全**
**VS Code**：IntelliSense
**Cursor**：Cursor Tab
**优势**：Cursor


**特性**：**对话模式**
**VS Code**：侧边栏
**Cursor**：内嵌Chat
**优势**：Cursor


**特性**：**代码库理解**
**VS Code**：需配置
**Cursor**：自动索引
**优势**：Cursor


**特性**：**自定义性**
**VS Code**：极强
**Cursor**：中等
**优势**：VS Code


**特性**：**插件生态**
**VS Code**：丰富
**Cursor**：兼容VS Code
**优势**：VS Code


#### 2.1.2 Cursor独有功能
1、**Cursor Tab**：多行代码智能补全
2、**Cmd+K**：行内编辑模式
3、**Cmd+L**：对话模式（带代码库上下文）
4、**自动代码库索引**：无需手动配置

**Cursor界面截图位置**：
![Cursor主界面与AI对话面板](./images/cursor-main-interface.png)


### 2.2 Cursor配置文件位置
**配置文件路径**：
```bash
# Windows
%APPDATA%\Cursor\User\settings.json

# macOS
~/Library/Application Support/Cursor/User/settings.json

# Linux
~/.config/Cursor/User/settings.json
```

**打开配置**：
```bash
# 直接编辑
cursor ~/.config/Cursor/User/settings.json

# 或在Cursor中按 Cmd/Ctrl+,
```


### 2.3 Cursor settings.json 完整配置
```json
{
  // ==================== Cursor AI配置 ====================
  "cursor.ai.model": "claude-sonnet-4.5-20250929",
  "cursor.ai.apiKey": "${env:ANTHROPIC_API_KEY}",
  "cursor.ai.temperature": 0.7,
  "cursor.ai.maxTokens": 4096,

  // ==================== Cursor Tab配置 ====================
  "cursor.tab.enabled": true,
  "cursor.tab.triggerMode": "auto",
  "cursor.tab.debounceMs": 300,
  "cursor.tab.maxSuggestions": 3,
  "cursor.tab.showInlineHints": true,

  // ==================== 代码库索引配置 ====================
  "cursor.codebase.indexing.enabled": true,
  "cursor.codebase.indexing.autoUpdate": true,
  "cursor.codebase.indexing.excludePatterns": [
    "**/node_modules/**",
    "**/venv/**",
    "**/.git/**",
    "**/dist/**",
    "**/build/**",
    "**/__pycache__/**"
  ],
  "cursor.codebase.indexing.includeExtensions": [
    ".py",
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".md",
    ".json"
  ],

  // ==================== 对话模式配置 ====================
  "cursor.chat.position": "right",
  "cursor.chat.theme": "dark",
  "cursor.chat.contextLines": 100,
  "cursor.chat.autoIncludeOpenFiles": true,
  "cursor.chat.historyLimit": 50,

  // ==================== 行内编辑配置 (Cmd+K) ====================
  "cursor.inlineEdit.enabled": true,
  "cursor.inlineEdit.showDiff": true,
  "cursor.inlineEdit.autoAccept": false,

  // ==================== 性能优化 ====================
  "cursor.performance.cacheEnabled": true,
  "cursor.performance.rateLimitPerMinute": 60,
  "cursor.performance.timeoutMs": 30000,

  // ==================== 编辑器配置（继承VS Code）====================
  "editor.fontSize": 14,
  "editor.fontFamily": "'Fira Code', 'Cascadia Code', monospace",
  "editor.fontLigatures": true,
  "editor.lineHeight": 1.6,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.organizeImports": true
  },

  // ==================== Python配置 ====================
  "python.languageServer": "Pylance",
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true
  },

  // ==================== JavaScript/TypeScript配置 ====================
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },

  // ==================== 终端配置 ====================
  "terminal.integrated.fontSize": 13,
  "terminal.integrated.fontFamily": "'Fira Code', monospace",
  "terminal.integrated.defaultProfile.windows": "Git Bash"
}
```


### 2.4 Cursor快捷键配置
**keybindings.json位置**：
```bash
# 同settings.json目录
~/.config/Cursor/User/keybindings.json
```

**完整快捷键配置**：
```json
[
  // ==================== Cursor核心快捷键（默认）====================
  {
    "key": "cmd+k",
    "command": "cursor.inlineEdit",
    "when": "editorTextFocus"
  },
  {
    "key": "cmd+l",
    "command": "cursor.openChat",
    "when": "editorTextFocus"
  },
  {
    "key": "tab",
    "command": "cursor.acceptSuggestion",
    "when": "cursorSuggestionVisible && editorTextFocus"
  },
  {
    "key": "cmd+shift+l",
    "command": "cursor.openChatWithSelection",
    "when": "editorHasSelection"
  },

  // ==================== 自定义快捷键 ====================
  {
    "key": "cmd+shift+e",
    "command": "cursor.explainCode",
    "when": "editorHasSelection"
  },
  {
    "key": "cmd+shift+r",
    "command": "cursor.refactorCode",
    "when": "editorHasSelection"
  },
  {
    "key": "cmd+shift+t",
    "command": "cursor.generateTests",
    "when": "editorTextFocus"
  },

  // ==================== 代码库操作 ====================
  {
    "key": "cmd+shift+i",
    "command": "cursor.reindexCodebase"
  },
  {
    "key": "cmd+alt+f",
    "command": "cursor.searchCodebase"
  },

  // ==================== 工作区管理 ====================
  {
    "key": "cmd+b",
    "command": "workbench.action.toggleSidebarVisibility"
  },
  {
    "key": "cmd+j",
    "command": "workbench.action.togglePanel"
  }
]
```

**快捷键说明表**：


**快捷键**：`Cmd+K`
**命令**：行内编辑
**说明**：在当前行位置编辑代码


**快捷键**：`Cmd+L`
**命令**：打开对话
**说明**：打开AI对话面板


**快捷键**：`Cmd+Shift+L`
**命令**：选中对话
**说明**：对选中代码发起对话


**快捷键**：`Tab`
**命令**：接受建议
**说明**：接受Cursor Tab建议


**快捷键**：`Cmd+Shift+E`
**命令**：解释代码
**说明**：解释选中代码


**快捷键**：`Cmd+Shift+R`
**命令**：重构代码
**说明**：重构选中代码


**快捷键**：`Cmd+Shift+I`
**命令**：重新索引
**说明**：重建代码库索引


**快捷键截图位置**：
![Cursor快捷键配置](./images/cursor-keybindings.png)


### 2.5 Cursor性能优化
#### 2.5.1 代码库索引优化
**优化前问题**：
- 索引速度慢
- 内存占用高
- 补全延迟

**优化配置**：
```json
{
  "cursor.codebase.indexing.maxFileSize": 1000000,
  "cursor.codebase.indexing.maxFiles": 10000,
  "cursor.codebase.indexing.batchSize": 100,
  "cursor.codebase.indexing.parallelWorkers": 4,
  "cursor.codebase.indexing.excludePatterns": [
    "**/node_modules/**",
    "**/venv/**",
    "**/.git/**",
    "**/dist/**",
    "**/build/**",
    "**/__pycache__/**",
    "**/.pytest_cache/**",
    "**/.mypy_cache/**",
    "**/coverage/**",
    "**/*.log"
  ]
}
```

**手动重建索引**：
```bash
# 在Cursor中
Cmd+Shift+P -> "Cursor: Rebuild Codebase Index"
```


#### 2.5.2 内存与网络优化
```json
{
  // ==================== 内存优化 ====================
  "cursor.performance.maxMemoryMB": 2048,
  "cursor.performance.gcIntervalMs": 60000,

  // ==================== 网络优化 ====================
  "cursor.network.timeout": 30000,
  "cursor.network.retryAttempts": 3,
  "cursor.network.retryDelayMs": 1000,

  // ==================== 缓存优化 ====================
  "cursor.cache.enabled": true,
  "cursor.cache.maxSizeMB": 500,
  "cursor.cache.ttlSeconds": 3600
}
```


### 2.6 Cursor最佳实践
#### 2.6.1 代码补全优化
**技巧**：

1、**多行补全**：
   - 输入注释或函数签名
   - 等待Cursor Tab建议（灰色文本）
   - 按 `Tab` 接受

**示例**：
```python
# 输入注释
# Calculate fibonacci sequence up to n

# Cursor Tab会建议完整实现
def fibonacci(n: int) -> list[int]:
    if n <= 0:
        return []
    elif n == 1:
        return [0]

    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[i-1] + fib[i-2])
    return fib
```

**补全截图位置**：
![Cursor Tab多行补全示例](./images/cursor-tab-completion.png)


#### 2.6.2 对话模式最佳实践
**高效对话技巧**：

1、**带上下文对话**：选中代码 + `Cmd+Shift+L`
2、**引用文件**：在对话中输入 `@filename.py`
3、**引用文档**：在对话中输入 `@docs`

**示例对话**：
```
用户: @app.py 重构这个路由函数，添加错误处理
Cursor: [分析app.py] 我会为路由添加try-except和日志记录...
```


## Part 3: JetBrains IDEs 配置（2,500字）
### 3.1 支持的JetBrains IDEs
**Claude插件支持列表**：


**IDE**：**PyCharm Professional**
**版本要求**：2023.1+
**插件名称**：Claude AI Assistant


**IDE**：**IntelliJ IDEA Ultimate**
**版本要求**：2023.1+
**插件名称**：Claude AI Assistant


**IDE**：**WebStorm**
**版本要求**：2023.1+
**插件名称**：Claude AI Assistant


**IDE**：**GoLand**
**版本要求**：2023.1+
**插件名称**：Claude AI Assistant


**IDE**：**Rider**
**版本要求**：2023.1+
**插件名称**：Claude AI Assistant


**注意**：Community版本不支持Claude插件。


### 3.2 插件安装（PyCharm示例）
#### 3.2.1 从Marketplace安装
**步骤**：

1、打开 PyCharm
2、`File` -> `Settings`（Windows/Linux）或 `PyCharm` -> `Preferences`（macOS）
3、左侧选择 `Plugins`
4、搜索 `Claude AI Assistant`
5、点击 `Install`
6、重启IDE

**安装截图位置**：
![PyCharm插件市场安装Claude](./images/pycharm-plugin-install.png)


#### 3.2.2 手动安装（离线）
**下载插件**：
```bash
# 从JetBrains Marketplace下载
https://plugins.jetbrains.com/plugin/XXXXX-claude-ai-assistant
```

**手动安装**：

1、`Settings` -> `Plugins`
2、点击齿轮图标 -> `Install Plugin from Disk...`
3、选择下载的 `.zip` 文件
4、重启IDE


### 3.3 PyCharm配置文件
#### 3.3.1 配置API Key
**配置位置**：
```
Settings -> Tools -> Claude AI Assistant -> API Key
```

**XML配置（可选）**：
```xml
<!-- 位置: ~/.config/JetBrains/PyCharm2023.1/options/claude.xml -->
<application>
  <component name="ClaudeSettings">
    <option name="apiKey" value="${env:ANTHROPIC_API_KEY}" />
    <option name="model" value="claude-sonnet-4.5-20250929" />
    <option name="maxTokens" value="4096" />
    <option name="temperature" value="0.7" />
  </component>
</application>
```


#### 3.3.2 编辑器配置（editor.xml）
```xml
<!-- 位置: ~/.config/JetBrains/PyCharm2023.1/options/editor.xml -->
<application>
  <component name="EditorSettings">
    <option name="SHOW_INTENTION_BULB" value="true" />
    <option name="SHOW_INTENTION_PREVIEW" value="true" />
    <option name="IS_WHITESPACES_SHOWN" value="true" />
    <option name="IS_INDENT_GUIDES_SHOWN" value="true" />
    <option name="IS_CARET_ROW_SHOWN" value="true" />
  </component>

  <component name="ClaudeEditorSettings">
    <option name="enableInlineCompletion" value="true" />
    <option name="enableCodeAnalysis" value="true" />
    <option name="autoTriggerCompletion" value="true" />
  </component>
</application>
```


### 3.4 快捷键配置（keymap.xml）
**配置位置**：
```
Settings -> Keymap -> 搜索 "Claude"
```

**推荐快捷键映射**：


**功能**：打开对话
**Windows/Linux**：`Alt+C`
**macOS**：`Cmd+Option+C`


**功能**：分析代码
**Windows/Linux**：`Alt+A`
**macOS**：`Cmd+Option+A`


**功能**：解释代码
**Windows/Linux**：`Alt+E`
**macOS**：`Cmd+Option+E`


**功能**：重构代码
**Windows/Linux**：`Alt+R`
**macOS**：`Cmd+Option+R`


**功能**：生成测试
**Windows/Linux**：`Alt+T`
**macOS**：`Cmd+Option+T`


**功能**：生成文档
**Windows/Linux**：`Alt+D`
**macOS**：`Cmd+Option+D`


**XML配置（高级）**：
```xml
<!-- 位置: ~/.config/JetBrains/PyCharm2023.1/keymaps/Custom.xml -->
<keymap version="1" name="Custom" parent="$default">
  <action id="claude.openChat">
    <keyboard-shortcut first-keystroke="alt c" />
  </action>
  <action id="claude.analyzeCode">
    <keyboard-shortcut first-keystroke="alt a" />
  </action>
  <action id="claude.explainCode">
    <keyboard-shortcut first-keystroke="alt e" />
  </action>
  <action id="claude.refactorCode">
    <keyboard-shortcut first-keystroke="alt r" />
  </action>
  <action id="claude.generateTests">
    <keyboard-shortcut first-keystroke="alt t" />
  </action>
</keymap>
```

**快捷键截图位置**：
![PyCharm快捷键配置](./images/pycharm-keymap.png)


### 3.5 工具集成配置
#### 3.5.1 终端集成（terminal.xml）
```xml
<!-- 位置: ~/.config/JetBrains/PyCharm2023.1/options/terminal.xml -->
<application>
  <component name="TerminalProjectOptionsProvider">
    <option name="shellPath" value="/bin/bash" />
    <option name="myShellIntegration" value="true" />
    <option name="envDataOptions">
      <map>
        <entry key="ANTHROPIC_API_KEY" value="${env:ANTHROPIC_API_KEY}" />
      </map>
    </option>
  </component>
</application>
```


#### 3.5.2 外部工具集成（tools.xml）
**配置外部工具（如Ruff、Black）**：
```xml
<!-- 位置: ~/.config/JetBrains/PyCharm2023.1/tools/External Tools.xml -->
<toolSet name="External Tools">
  <tool name="Ruff Check" showInMainMenu="false" showInEditor="true" showInProject="true" showInSearchPopup="true" disabled="false" useConsole="true" showConsoleOnStdOut="false" showConsoleOnStdErr="false" synchronizeAfterRun="true">
    <exec>
      <option name="COMMAND" value="ruff" />
      <option name="PARAMETERS" value="check $FilePath$" />
      <option name="WORKING_DIRECTORY" value="$ProjectFileDir$" />
    </exec>
  </tool>

  <tool name="Black Format" showInMainMenu="false" showInEditor="true" showInProject="true" showInSearchPopup="true" disabled="false" useConsole="true" showConsoleOnStdOut="false" showConsoleOnStdErr="false" synchronizeAfterRun="true">
    <exec>
      <option name="COMMAND" value="black" />
      <option name="PARAMETERS" value="$FilePath$" />
      <option name="WORKING_DIRECTORY" value="$ProjectFileDir$" />
    </exec>
  </tool>
</toolSet>
```


#### 3.5.3 代码模板集成（templates.xml）
**创建Claude辅助代码模板**：
```xml
<!-- 位置: ~/.config/JetBrains/PyCharm2023.1/templates/Python.xml -->
<templateSet group="Python">
  <template name="claude-docstring" value="&quot;&quot;&quot;&#10;$DESCRIPTION$&#10;&#10;Args:&#10;    $ARGS$&#10;&#10;Returns:&#10;    $RETURNS$&#10;&#10;Raises:&#10;    $RAISES$&#10;&quot;&quot;&quot;" description="Claude风格Docstring" toReformat="true" toShortenFQNames="true">
    <variable name="DESCRIPTION" expression="" defaultValue="&quot;&quot;" alwaysStopAt="true" />
    <variable name="ARGS" expression="" defaultValue="&quot;&quot;" alwaysStopAt="true" />
    <variable name="RETURNS" expression="" defaultValue="&quot;&quot;" alwaysStopAt="true" />
    <variable name="RAISES" expression="" defaultValue="&quot;&quot;" alwaysStopAt="true" />
    <context>
      <option name="PYTHON" value="true" />
    </context>
  </template>

  <template name="claude-test" value="def test_$FUNCTION_NAME$():&#10;    &quot;&quot;&quot;Test $FUNCTION_NAME$ function.&quot;&quot;&quot;&#10;    # Arrange&#10;    $ARRANGE$&#10;    &#10;    # Act&#10;    result = $FUNCTION_NAME$($PARAMS$)&#10;    &#10;    # Assert&#10;    assert result == $EXPECTED$" description="Claude风格单元测试" toReformat="true" toShortenFQNames="true">
    <variable name="FUNCTION_NAME" expression="" defaultValue="&quot;&quot;" alwaysStopAt="true" />
    <variable name="ARRANGE" expression="" defaultValue="&quot;&quot;" alwaysStopAt="true" />
    <variable name="PARAMS" expression="" defaultValue="&quot;&quot;" alwaysStopAt="true" />
    <variable name="EXPECTED" expression="" defaultValue="&quot;&quot;" alwaysStopAt="true" />
    <context>
      <option name="PYTHON" value="true" />
    </context>
  </template>
</templateSet>
```

**使用模板**：

1、在编辑器中输入 `claude-docstring` + `Tab`
2、依次填写占位符
3、`Enter` 完成


### 3.6 其他JetBrains IDEs配置
**IntelliJ IDEA（Java/Kotlin）**：
```xml
<!-- 位置: ~/.config/JetBrains/IntelliJIdea2023.1/options/claude.xml -->
<application>
  <component name="ClaudeSettings">
    <option name="apiKey" value="${env:ANTHROPIC_API_KEY}" />
    <option name="model" value="claude-sonnet-4.5-20250929" />
    <option name="enableJavaSupport" value="true" />
    <option name="enableKotlinSupport" value="true" />
  </component>
</application>
```

**WebStorm（JavaScript/TypeScript）**：
```xml
<!-- 位置: ~/.config/JetBrains/WebStorm2023.1/options/claude.xml -->
<application>
  <component name="ClaudeSettings">
    <option name="apiKey" value="${env:ANTHROPIC_API_KEY}" />
    <option name="model" value="claude-sonnet-4.5-20250929" />
    <option name="enableJavaScriptSupport" value="true" />
    <option name="enableTypeScriptSupport" value="true" />
  </component>
</application>
```


## Part 4: 跨IDE统一配置（1,500字）
### 4.1 EditorConfig统一配置
#### 4.1.1 什么是EditorConfig
**EditorConfig** 是一个跨IDE的配置标准，用于统一编码风格。

**支持的IDE**：
- VS Code（需安装插件）
- Cursor（原生支持）
- JetBrains IDEs（原生支持）
- Sublime Text
- Vim/Neovim


#### 4.1.2 创建 .editorconfig
**项目根目录创建文件**：
```ini
# .editorconfig
root = true

# ==================== 全局配置 ====================
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

# ==================== Python配置 ====================
[*.py]
indent_size = 4
max_line_length = 88

# ==================== JavaScript/TypeScript ====================
[*.{js,ts,jsx,tsx}]
indent_size = 2
quote_type = single

# ==================== JSON配置 ====================
[*.json]
indent_size = 2
insert_final_newline = false

# ==================== YAML配置 ====================
[*.{yml,yaml}]
indent_size = 2

# ==================== Markdown配置 ====================
[*.md]
trim_trailing_whitespace = false
max_line_length = 80

# ==================== Makefile ====================
[Makefile]
indent_style = tab

# ==================== Shell脚本 ====================
[*.{sh,bash}]
indent_size = 2
end_of_line = lf
```

**配置说明**：


**配置项**：`charset`
**说明**：字符编码
**推荐值**：`utf-8`


**配置项**：`end_of_line`
**说明**：换行符
**推荐值**：`lf`（Unix）


**配置项**：`insert_final_newline`
**说明**：文件末尾换行
**推荐值**：`true`


**配置项**：`trim_trailing_whitespace`
**说明**：删除行尾空格
**推荐值**：`true`


**配置项**：`indent_style`
**说明**：缩进方式
**推荐值**：`space`


**配置项**：`indent_size`
**说明**：缩进大小
**推荐值**：`2`（通用）/`4`（Python）


#### 4.1.3 VS Code中启用EditorConfig
**安装插件**：
```bash
code --install-extension editorconfig.editorconfig
```

**验证配置**：
```bash
# 打开Python文件，自动应用4空格缩进
# 打开JSON文件，自动应用2空格缩进
```


### 4.2 共享配置仓库
#### 4.2.1 创建配置仓库
**仓库结构**：
```
dotfiles/
├── vscode/
│   ├── settings.json
│   ├── keybindings.json
│   └── extensions.json
├── cursor/
│   ├── settings.json
│   └── keybindings.json
├── pycharm/
│   ├── options/
│   │   ├── editor.xml
│   │   ├── keymap.xml
│   │   └── claude.xml
│   └── templates/
│       └── Python.xml
├── .editorconfig
├── .gitignore
└── README.md
```

**初始化仓库**：
```bash
# 创建仓库
mkdir -p ~/dotfiles/{vscode,cursor,pycharm/options,pycharm/templates}
cd ~/dotfiles
git init

# 复制配置文件
cp ~/.config/Code/User/settings.json vscode/
cp ~/.config/Cursor/User/settings.json cursor/
cp ~/.config/JetBrains/PyCharm2023.1/options/*.xml pycharm/options/

# 提交到Git
git add .
git commit -m "Initial commit: IDE configurations"
git remote add origin https://github.com/yourusername/dotfiles.git
git push -u origin main
```


#### 4.2.2 安装配置脚本（install.sh）
**创建自动化安装脚本**：
```bash
#!/bin/bash
# install.sh - 一键安装IDE配置

set -e

# ==================== 颜色定义 ====================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ==================== 辅助函数 ====================
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ==================== 检测操作系统 ====================
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        OS="windows"
    else
        log_error "不支持的操作系统: $OSTYPE"
        exit 1
    fi
    log_info "检测到操作系统: $OS"
}

# ==================== 安装VS Code配置 ====================
install_vscode() {
    log_info "安装VS Code配置..."

    if [[ "$OS" == "linux" ]]; then
        VSCODE_DIR="$HOME/.config/Code/User"
    elif [[ "$OS" == "macos" ]]; then
        VSCODE_DIR="$HOME/Library/Application Support/Code/User"
    elif [[ "$OS" == "windows" ]]; then
        VSCODE_DIR="$APPDATA/Code/User"
    fi

    mkdir -p "$VSCODE_DIR"
    cp vscode/settings.json "$VSCODE_DIR/"
    cp vscode/keybindings.json "$VSCODE_DIR/"

    log_info "VS Code配置已安装到: $VSCODE_DIR"
}

# ==================== 安装Cursor配置 ====================
install_cursor() {
    log_info "安装Cursor配置..."

    if [[ "$OS" == "linux" ]]; then
        CURSOR_DIR="$HOME/.config/Cursor/User"
    elif [[ "$OS" == "macos" ]]; then
        CURSOR_DIR="$HOME/Library/Application Support/Cursor/User"
    elif [[ "$OS" == "windows" ]]; then
        CURSOR_DIR="$APPDATA/Cursor/User"
    fi

    mkdir -p "$CURSOR_DIR"
    cp cursor/settings.json "$CURSOR_DIR/"
    cp cursor/keybindings.json "$CURSOR_DIR/"

    log_info "Cursor配置已安装到: $CURSOR_DIR"
}

# ==================== 安装PyCharm配置 ====================
install_pycharm() {
    log_info "安装PyCharm配置..."

    if [[ "$OS" == "linux" ]]; then
        PYCHARM_DIR="$HOME/.config/JetBrains/PyCharm2023.1"
    elif [[ "$OS" == "macos" ]]; then
        PYCHARM_DIR="$HOME/Library/Application Support/JetBrains/PyCharm2023.1"
    elif [[ "$OS" == "windows" ]]; then
        PYCHARM_DIR="$APPDATA/JetBrains/PyCharm2023.1"
    fi

    mkdir -p "$PYCHARM_DIR/options"
    cp pycharm/options/*.xml "$PYCHARM_DIR/options/"

    log_info "PyCharm配置已安装到: $PYCHARM_DIR"
}

# ==================== 安装EditorConfig ====================
install_editorconfig() {
    log_info "安装EditorConfig..."
    cp .editorconfig ~/
    log_info "EditorConfig已安装到: $HOME/.editorconfig"
}

# ==================== 主函数 ====================
main() {
    log_info "开始安装IDE配置..."

    detect_os

    # 询问用户要安装哪些配置
    read -p "安装VS Code配置? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_vscode
    fi

    read -p "安装Cursor配置? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_cursor
    fi

    read -p "安装PyCharm配置? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_pycharm
    fi

    read -p "安装EditorConfig? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_editorconfig
    fi

    log_info "安装完成！请重启IDE使配置生效。"
}

main
```

**运行安装脚本**：
```bash
chmod +x install.sh
./install.sh
```


### 4.3 环境变量统一管理
#### 4.3.1 创建 .env.example
**项目根目录创建**：
```bash
# .env.example
# ==================== API Keys ====================
ANTHROPIC_API_KEY=sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ==================== 配置项 ====================
CLAUDE_MODEL=claude-sonnet-4.5-20250929
CLAUDE_MAX_TOKENS=4096
CLAUDE_TEMPERATURE=0.7

# ==================== 项目路径 ====================
PROJECT_ROOT=/path/to/project
VENV_PATH=/path/to/venv
```

**使用方法**：
```bash
# 复制为实际配置
cp .env.example .env

# 编辑.env填写真实值
nano .env

# 加载环境变量（在IDE终端中）
source .env
```


#### 4.3.2 跨IDE加载环境变量
**VS Code（settings.json）**：
```json
{
  "terminal.integrated.env.linux": {
    "ANTHROPIC_API_KEY": "${env:ANTHROPIC_API_KEY}"
  },
  "terminal.integrated.env.osx": {
    "ANTHROPIC_API_KEY": "${env:ANTHROPIC_API_KEY}"
  },
  "terminal.integrated.env.windows": {
    "ANTHROPIC_API_KEY": "${env:ANTHROPIC_API_KEY}"
  }
}
```

**PyCharm（terminal.xml）**：
```xml
<component name="TerminalProjectOptionsProvider">
  <option name="envDataOptions">
    <map>
      <entry key="ANTHROPIC_API_KEY" value="${env:ANTHROPIC_API_KEY}" />
    </map>
  </option>
</component>
```


## Part 5: 最佳实践与故障排查（1,000字）
### 5.1 插件配置10条黄金法则
#### 规则1：API Key安全管理
**❌ 错误做法**：
```json
{
  "claude.apiKey": "sk-ant-api03-XXXXXXXX"
}
```

**✅ 正确做法**：
```json
{
  "claude.apiKey": "${env:ANTHROPIC_API_KEY}"
}
```


#### 规则2：合理设置上下文窗口
**推荐配置**：
```json
{
  "claude.contextWindow": 200000,
  "claude.maxTokens": 4096
}
```

**说明**：
- `contextWindow`：Claude能理解的代码量（Sonnet 4.5支持200K）
- `maxTokens`：单次生成的最大长度


#### 规则3：优化代码分析排除规则
**完整排除配置**：
```json
{
  "claude.codeAnalysis.excludePatterns": [
    "**/node_modules/**",
    "**/venv/**",
    "**/.git/**",
    "**/dist/**",
    "**/build/**",
    "**/__pycache__/**",
    "**/.pytest_cache/**",
    "**/.mypy_cache/**",
    "**/coverage/**",
    "**/*.min.js",
    "**/*.log"
  ]
}
```


#### 规则4：启用自动保存对话
**推荐配置**：
```json
{
  "claude.conversation.autoSaveChats": true,
  "claude.conversation.chatStoragePath": "${workspaceFolder}/.claude/chats",
  "claude.conversation.historyLimit": 50
}
```


#### 规则5：配置合理的超时与重试
**推荐配置**：
```json
{
  "claude.performance.timeoutMs": 30000,
  "claude.network.retryAttempts": 3,
  "claude.network.retryDelayMs": 1000
}
```


#### 规则6：启用缓存减少API调用
**推荐配置**：
```json
{
  "claude.performance.cacheEnabled": true,
  "claude.performance.cacheTTL": 3600,
  "claude.cache.maxSizeMB": 500
}
```


#### 规则7：合理配置补全触发
**推荐配置**：
```json
{
  "claude.completion.triggerCharacters": [".", ":", "(", "{", "["],
  "claude.completion.debounceMs": 300,
  "claude.completion.maxSuggestions": 5
}
```


#### 规则8：使用EditorConfig统一风格
**必须配置**：
```ini
# .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```


#### 规则9：定期清理缓存
**清理命令**：
```bash
# VS Code
rm -rf ~/.config/Code/User/globalStorage/anthropic.claude-code/cache

# Cursor
rm -rf ~/.config/Cursor/User/globalStorage/cursor.cache

# PyCharm
rm -rf ~/.cache/JetBrains/PyCharm2023.1/claude
```


#### 规则10：版本控制配置文件
**推荐仓库结构**：
```
dotfiles/
├── .editorconfig
├── vscode/
│   ├── settings.json
│   └── keybindings.json
├── cursor/
│   └── settings.json
└── README.md
```

**提交到Git**：
```bash
git add .
git commit -m "Update IDE configurations"
git push
```


### 5.2 常见故障排查表

**故障现象**：**插件无法加载**
**可能原因**：API Key错误
**解决方案**：检查`settings.json`中的API Key


**故障现象**：**代码补全延迟**
**可能原因**：网络超时
**解决方案**：增加`timeoutMs`值


**故障现象**：**内存占用过高**
**可能原因**：缓存过大
**解决方案**：减小`cache.maxSizeMB`


**故障现象**：**代码分析卡顿**
**可能原因**：扫描文件过多
**解决方案**：优化`excludePatterns`


**故障现象**：**快捷键冲突**
**可能原因**：与其他插件冲突
**解决方案**：在`keybindings.json`中重新映射


**故障现象**：**对话历史丢失**
**可能原因**：未启用自动保存
**解决方案**：设置`autoSaveChats: true`


**故障现象**：**无法连接API**
**可能原因**：代理/防火墙
**解决方案**：检查网络设置


**故障现象**：**插件崩溃**
**可能原因**：版本不兼容
**解决方案**：升级IDE到最新版本


**故障现象**：**配置不生效**
**可能原因**：未重启IDE
**解决方案**：重启IDE使配置生效


**故障现象**：**环境变量未加载**
**可能原因**：Shell配置问题
**解决方案**：检查`.bashrc`或`.zshrc`


### 5.3 故障排查步骤
#### 步骤1：检查日志
**VS Code日志**：
```bash
# 打开输出面板
Ctrl+Shift+U -> 选择 "Claude Code"
```

**Cursor日志**：
```bash
# 打开开发者工具
Cmd/Ctrl+Shift+I -> Console
```

**PyCharm日志**：
```bash
# 查看日志文件
Help -> Show Log in Explorer/Finder
```


#### 步骤2：验证API连接
**测试API连接**：
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4.5-20250929",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello, Claude"}]
  }'
```


#### 步骤3：重置配置
**重置到默认配置**：
```bash
# 备份现有配置
cp ~/.config/Code/User/settings.json ~/settings.json.backup

# 删除配置文件
rm ~/.config/Code/User/settings.json

# 重启VS Code（自动生成默认配置）
code
```


## Part 6: 总结与资源（500字）
### 6.1 配置对比总结

**IDE**：**VS Code**
**配置复杂度**：⭐⭐⭐
**AI集成度**：⭐⭐⭐⭐
**扩展性**：⭐⭐⭐⭐⭐
**推荐场景**：通用开发、轻量级项目


**IDE**：**Cursor**
**配置复杂度**：⭐⭐
**AI集成度**：⭐⭐⭐⭐⭐
**扩展性**：⭐⭐⭐
**推荐场景**：AI优先开发、快速原型


**IDE**：**PyCharm**
**配置复杂度**：⭐⭐⭐⭐
**AI集成度**：⭐⭐⭐
**扩展性**：⭐⭐⭐⭐
**推荐场景**：Python重度开发


**IDE**：**IntelliJ IDEA**
**配置复杂度**：⭐⭐⭐⭐
**AI集成度**：⭐⭐⭐
**扩展性**：⭐⭐⭐⭐
**推荐场景**：Java/Kotlin企业开发


**IDE**：**WebStorm**
**配置复杂度**：⭐⭐⭐⭐
**AI集成度**：⭐⭐⭐
**扩展性**：⭐⭐⭐⭐
**推荐场景**：前端专业开发


### 6.2 推荐配置组合
#### 组合1：通用开发者
- **主力IDE**：VS Code
- **AI辅助**：Claude Code插件
- **配置重点**：settings.json + keybindings.json
- **扩展工具**：GitLens、Prettier、ESLint


#### 组合2：AI优先开发者
- **主力IDE**：Cursor
- **AI辅助**：内置Claude
- **配置重点**：优化代码库索引
- **扩展工具**：Cursor Tab、对话模式


#### 组合3：Python重度开发者
- **主力IDE**：PyCharm Professional
- **AI辅助**：Claude AI Assistant插件
- **配置重点**：XML配置文件 + 代码模板
- **扩展工具**：Database Tools、Docker集成


### 6.3 扩展阅读资源
**官方文档**：

1、[VS Code官方文档](https://code.visualstudio.com/docs)
2、[Cursor官方文档](https://cursor.sh/docs)
3、[JetBrains IDEs文档](https://www.jetbrains.com/help/)
4、[Claude API文档](https://docs.anthropic.com/)
5、[EditorConfig规范](https://editorconfig.org/)

**社区资源**：

1、[Awesome VS Code](https://github.com/viatsko/awesome-vscode)
2、[Cursor Community](https://forum.cursor.sh/)
3、[JetBrains Plugin Repository](https://plugins.jetbrains.com/)

**配置模板仓库**：

1、[dotfiles](https://github.com/mathiasbynens/dotfiles)
2、[vscode-settings](https://github.com/microsoft/vscode-docs)


## 📚 课程回顾
**本节核心内容**：

1、✅ VS Code完整配置（settings.json/keybindings.json/launch.json）
2、✅ Cursor优化配置（性能调优/快捷键/代码库索引）
3、✅ JetBrains IDEs配置（PyCharm/IntelliJ IDEA/WebStorm）
4、✅ 跨IDE统一配置（EditorConfig/共享仓库/环境变量）
5、✅ 10条黄金法则 + 故障排查表

**下一步**：

进入 **Module 7.2: Claude Plugins生态深度使用**，学习如何高效使用插件功能。


## 🔗 相关链接

**资源**：**Module 7.2**
**链接**：[Claude Plugins生态深度使用](./Claude_Plugins生态深度使用.md)


**资源**：**Module 6.3**
**链接**：[项目交付与文档规范](../../06-企业实战/项目交付与文档规范.md)


**资源**：**GitHub仓库**
**链接**：[dotfiles配置模板](https://github.com/yourusername/dotfiles)


**文档结束** | 更新日期：2025-12-11 | 版本：1.0