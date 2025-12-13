# Web版MVP开发指南

**状态**：框架已创建
**下一步**：完善功能和部署

---

## 已创建文件

### 后端（FastAPI）
- ✅ `backend/app/main.py` - 完整API服务器
  - 标题生成API
  - 质量检测API
  - 选题过滤API
  - 品牌词库API
- ✅ `backend/requirements.txt` - Python依赖

### 前端（Next.js）
- ✅ `frontend/package.json` - 项目配置
- ✅ `frontend/app/layout.tsx` - 布局组件
- ✅ `frontend/app/page.tsx` - 首页（6个功能入口）
- ✅ `frontend/app/title/page.tsx` - 标题生成页面

---

## 下一步开发

### 待创建页面（5个）
1. `/write` - 写作编辑器（Monaco Editor）
2. `/quality` - 质量检测仪表盘
3. `/topic` - 选题过滤器
4. `/data` - 数据可视化看板
5. `/articles` - 文章管理列表

### 待创建组件（6个）
1. `components/ui/*` - shadcn/ui基础组件
2. `components/Editor.tsx` - Monaco编辑器封装
3. `components/TitleCard.tsx` - 标题卡片
4. `components/QualityRadar.tsx` - 质量雷达图
5. `components/ArticleList.tsx` - 文章列表
6. `lib/api.ts` - API客户端封装

---

## 启动开发

### 1. 安装依赖

```bash
# 后端
cd web-app/backend
pip install -r requirements.txt

# 前端
cd web-app/frontend
npm install
```

### 2. 启动服务

```bash
# 后端（终端1）
cd web-app/backend
uvicorn app.main:app --reload

# 前端（终端2）
cd web-app/frontend
npm run dev
```

### 3. 访问应用

- 前端：http://localhost:3000
- 后端API：http://localhost:8000
- API文档：http://localhost:8000/docs

---

## 核心优势

✅ **复用现有代码**：后端直接调用.claude/skills/下的Python脚本
✅ **CLI和Web并存**：双模式满足不同用户
✅ **低成本**：Vercel + Railway免费额度足够
✅ **快速开发**：MVP框架已搭建，2周可完成

---

**开发指南版本**：V1.0
**创建日期**：2025-12-12
