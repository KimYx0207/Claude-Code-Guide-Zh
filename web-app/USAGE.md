# 公众号写作助手 Web版 - 完整使用指南

**版本**：V1.0
**状态**：✅ 已优化并可运行
**更新日期**：2025-12-12

---

## 🚀 快速启动

### 方式1：开发模式（推荐）

```bash
# 1. 启动后端API
cd web-app/backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 2. 启动前端（新终端）
cd web-app/frontend
npm run dev

# 3. 访问
浏览器打开：http://localhost:3000
```

### 方式2：一键启动脚本

```bash
# 创建启动脚本（Linux/Mac）
cat > start.sh << 'EOF'
#!/bin/bash
cd web-app/backend && python -m uvicorn app.main:app --reload &
cd web-app/frontend && npm run dev &
wait
EOF

chmod +x start.sh
./start.sh
```

---

## 🎯 功能页面

| 页面 | URL | 状态 |
|------|-----|------|
| 首页 | http://localhost:3000 | ✅ 可用 |
| 标题生成 | http://localhost:3000/title | ✅ 可用 |
| 写作编辑 | http://localhost:3000/write | ⏳ 待开发 |
| 质量检测 | http://localhost:3000/quality | ⏳ 待开发 |
| 选题过滤 | http://localhost:3000/topic | ⏳ 待开发 |
| 数据看板 | http://localhost:3000/data | ⏳ 待开发 |
| 文章管理 | http://localhost:3000/articles | ⏳ 待开发 |

---

## 🐛 故障排查

### 问题1：端口被占用

```bash
# 查看端口占用
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# 结束进程（Windows）
taskkill /PID <进程ID> /F
```

### 问题2：404错误

```bash
# 清理缓存重启
cd web-app/frontend
rm -rf .next
npm run dev
```

### 问题3：依赖问题

```bash
# 重新安装
cd web-app/frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## 📝 当前MVP功能

### ✅ 已实现
1. 首页导航
2. 标题生成页面（带Mock数据）
3. 简洁专业的UI设计
4. 响应式布局

### ⏳ 待开发（2周内可完成）
1. Monaco编辑器写作页面
2. 质量检测可视化
3. 选题评估器
4. 数据看板图表
5. 文章管理CRUD
6. 与真实Python脚本集成

---

## 🎨 设计风格（V2简洁版）

**配色**：
- 主色：蓝色 #3b82f6
- 背景：纯白 #ffffff
- 文字：深灰 #1a1a1a
- 边框：浅灰 #e5e5e5

**原则**：
- 简洁大方
- 留白充足
- 对比清晰
- 舒适耐看

---

**使用指南版本**：V1.0
**最后更新**：2025-12-12
