# Web GUI 启动指南

## 🚀 快速启动（3步）

### 方法1：命令行启动（推荐）

```bash
# 第1步：进入前端目录
cd "C:\Users\admin\Desktop\KimProject\公众号写作助手\web-app\frontend"

# 第2步：启动开发服务器
npm run dev

# 第3步：浏览器访问
# 打开浏览器，访问：http://localhost:3000
```

**预期输出**：
```
   ▲ Next.js 15.0.0
   - Local:        http://localhost:3000
   - Environments: .env

 ✓ Starting...
 ✓ Ready in 2.3s
```

---

### 方法2：一键启动脚本

**创建启动脚本**：
```bash
# 文件：web-app/start.bat
@echo off
cd frontend
npm run dev
```

**使用**：
```bash
# 双击 web-app/start.bat
# 或命令行运行：
cd web-app
start.bat
```

---

## ❌ 常见问题排查

### 问题1：端口被占用

**错误信息**：
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方案**：
```bash
# 方法A：使用其他端口
npm run dev -- -p 3001
# 访问 http://localhost:3001

# 方法B：杀死占用进程
netstat -ano | findstr :3000
taskkill /PID [进程ID] /F
```

---

### 问题2：依赖未安装

**错误信息**：
```
Error: Cannot find module 'next'
```

**解决方案**：
```bash
cd web-app/frontend
npm install
npm run dev
```

---

### 问题3：TypeScript错误

**错误信息**：
```
Type error: Cannot find module '@/components/ui/button'
```

**解决方案**：
```bash
# 检查tsconfig.json的paths配置
# 应该有：
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# 重启开发服务器
```

---

### 问题4：Node版本过低

**错误信息**：
```
Error: Next.js requires Node.js 18.x or higher
```

**解决方案**：
```bash
# 检查Node版本
node -v

# 如果 < 18，请升级Node.js
# 下载：https://nodejs.org/
```

---

## 🔍 诊断命令

```bash
# 检查Node版本
node -v
# 应该 >= 18.0.0

# 检查npm版本
npm -v
# 应该 >= 9.0.0

# 检查依赖是否安装
ls web-app/frontend/node_modules
# 应该看到很多包

# 检查端口占用
netstat -ano | findstr :3000
# 如果有输出，说明端口被占用
```

---

## ✅ 启动成功标志

**终端输出**：
```
   ▲ Next.js 15.0.0
   - Local:        http://localhost:3000

 ✓ Ready in 2.3s
```

**浏览器访问**：
- 打开 http://localhost:3000
- 应该看到：公众号写作助手V7.2.1 Web版
- 左侧边栏：首页、开始写作、标题生成、质量检测等

---

## 🎯 测试清单

启动成功后，测试这些功能：

### ✅ 功能1：写作流程（4步完整）
1. 点击"开始写作"
2. 输入主题："测试文章"
3. 选择标题
4. 编辑文章
5. 点击"下一步：质量检测"← 第4步（新增）
6. 查看9维度评分

### ✅ 功能2：批量质检
1. 点击"文章管理"
2. 勾选2-3篇文章
3. 点击"一键质检全部"
4. 查看汇总报告

---

## 💡 快速排查

**如果还是打不开**，告诉我：
1. 运行`npm run dev`后的完整输出（复制粘贴给我）
2. 浏览器访问http://localhost:3000的错误信息
3. 或者直接告诉我报错截图

老金我立马帮你修！
