# 公众号写作助手 Web版

**版本**：V1.0 MVP
**技术栈**：Next.js 15 + FastAPI + PostgreSQL
**创建日期**：2025-12-12

---

## 项目结构

```
web-app/
├── frontend/          # Next.js前端
│   ├── app/
│   │   ├── page.tsx           # 首页
│   │   ├── write/page.tsx     # 写作页面
│   │   ├── quality/page.tsx   # 质量检测
│   │   └── data/page.tsx      # 数据看板
│   ├── components/
│   │   ├── ui/                # shadcn/ui组件
│   │   ├── Editor.tsx         # Monaco编辑器
│   │   ├── TitleGenerator.tsx # 标题生成器
│   │   └── QualityDashboard.tsx # 质量仪表盘
│   ├── lib/
│   │   └── api.ts             # API客户端
│   └── package.json
│
├── backend/           # FastAPI后端
│   ├── app/
│   │   ├── main.py            # FastAPI入口
│   │   ├── api/
│   │   │   ├── write.py       # 写作API
│   │   │   ├── title.py       # 标题API
│   │   │   ├── quality.py     # 质量API
│   │   │   └── data.py        # 数据API
│   │   ├── models/
│   │   │   └── database.py    # 数据库模型
│   │   └── core/
│   │       └── scripts.py     # 封装现有脚本
│   ├── requirements.txt
│   └── Dockerfile
│
└── README.md          # 本文件
```

---

## 快速开始

### 前端开发

```bash
cd web-app/frontend
npm install
npm run dev
# 访问 http://localhost:3000
```

### 后端开发

```bash
cd web-app/backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# API: http://localhost:8000
```

---

## 核心功能

### 1. 写作界面（/write）

- Monaco编辑器（VS Code同款）
- 实时Markdown预览
- 标题生成面板
- 质量检测面板

### 2. 数据看板（/data）

- 文章统计图表
- 爆款规律可视化
- 历史趋势分析

### 3. 质量检测（/quality）

- 8维度雷达图
- 实时评分
- 修改建议

---

## 部署

### Vercel（前端）

```bash
cd frontend
vercel deploy
```

### Railway（后端）

```bash
cd backend
railway up
```

---

**README版本**：V1.0
**最后更新**：2025-12-12
