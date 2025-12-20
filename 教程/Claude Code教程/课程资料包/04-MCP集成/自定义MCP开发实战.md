# 模块4.2：自定义MCP开发实战

> **课程目标**：掌握MCP开发全流程，从0到1创建可发布的MCP服务器

**学习路径**：环境搭建 → Hello World → 三大实战案例 → 调试发布

**时间分配**：3-4小时（含代码实践）


## 第一部分：MCP开发环境搭建（2,500字）
### 1.1 技术栈选择
MCP官方支持两种开发方式：


**技术栈**：**Node.js + TypeScript**
**适用场景**：通用工具、API集成
**优势**：生态丰富，开发快速
**劣势**：性能略低


**技术栈**：**Python**
**适用场景**：数据处理、AI模型集成
**优势**：库丰富，语法简洁
**劣势**：打包复杂


**本课程选择**：Node.js + TypeScript（官方推荐，生态最成熟）

### 1.2 环境要求
**必需组件**：
```bash
# 1. Node.js（版本18+）
node --version  # 应显示 v18.x.x 或更高

# 2. npm（通常随Node.js安装）
npm --version   # 应显示 9.x.x 或更高

# 3. TypeScript（全局安装）
npm install -g typescript
tsc --version   # 应显示 5.x.x
```

**推荐工具**：
- **IDE**：VS Code（必装插件：TypeScript、Prettier、ESLint）
- **调试工具**：Claude Code内置MCP调试器
- **版本控制**：Git

### 1.3 创建MCP项目
**步骤1：初始化项目**
```bash
# 创建项目目录
mkdir my-first-mcp
cd my-first-mcp

# 初始化npm项目
npm init -y

# 安装MCP SDK
npm install @modelcontextprotocol/sdk

# 安装开发依赖
npm install -D typescript @types/node ts-node
```

**步骤2：配置TypeScript**

创建 `tsconfig.json`：
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**步骤3：配置package.json**

修改 `package.json`：
```json
{
  "name": "my-first-mcp",
  "version": "1.0.0",
  "type": "module",
  "description": "我的第一个MCP服务器",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "my-first-mcp": "dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "ts-node --esm src/index.ts",
    "start": "node dist/index.js",
    "watch": "tsc --watch"
  },
  "keywords": ["mcp", "claude", "ai-tools"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.0.0"
  }
}
```

**关键配置说明**：

- `"type": "module"`：启用ES模块支持
- `"bin"`：定义命令行入口（用于 `npx my-first-mcp`）
- `"build"`：编译TypeScript到 `dist/`
- `"dev"`：开发模式（热重载）

### 1.4 项目结构
```
my-first-mcp/
├── src/
│   ├── index.ts          # 入口文件
│   ├── tools/            # 工具定义
│   │   └── hello.ts
│   ├── resources/        # 资源定义
│   │   └── config.ts
│   └── types/            # 类型定义
│       └── index.ts
├── dist/                 # 编译输出（自动生成）
├── .gitignore
├── package.json
└── tsconfig.json
```

**创建 `.gitignore`**：
```
node_modules/
dist/
*.log
.DS_Store
.env
```

### 1.5 验证环境
创建测试文件 `src/index.ts`：
```typescript
#!/usr/bin/env node

console.log("✅ MCP开发环境配置成功！");
console.log(`Node版本: ${process.version}`);
console.log(`TypeScript配置正常`);
```

**运行测试**：
```bash
# 开发模式测试
npm run dev

# 输出应为：
# ✅ MCP开发环境配置成功！
# Node版本: v18.x.x
# TypeScript配置正常

# 编译测试
npm run build
npm start  # 运行编译后的JS
```

**环境搭建完成检查清单**：

- [ ] Node.js 18+ 已安装
- [ ] TypeScript 5+ 已安装
- [ ] MCP SDK 已安装
- [ ] `npm run dev` 能正常运行
- [ ] `npm run build` 能成功编译


## 第二部分：Hello World MCP（3,000字）
### 2.1 MCP核心概念
**MCP服务器的三大组件**：

1、**Tools（工具）**：AI可调用的函数
   - 示例：搜索数据库、调用API、处理文件
   - 类比：给Claude的"双手"

2、**Resources（资源）**：AI可读取的数据
   - 示例：配置文件、数据库记录、API响应
   - 类比：给Claude的"参考书"

3、**Prompts（提示）**：预定义的交互模板
   - 示例：常用对话模式、工作流模板
   - 类比：给Claude的"脚本"

**本节重点**：实现一个包含1个Tool和1个Resource的最小MCP。
