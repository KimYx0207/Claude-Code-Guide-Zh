---
name: image
description: 📸 自动为文章添加高质量配图
version: 9.0.0
---

# 📸 自动配图命令

**版本**：V9.0 | **更新日期**：2025-12-20

**自动为当前文章添加精选配图，提升视觉吸引力！**

---

## 使用方式

### 方式1：指定文章文件
```
/image articles/2025-11-11_某某文章_老金风格.md
```

### 方式2：自动查找最新文章
```
/auto-image
```
会自动找articles目录下最新的文章进行配图

---

## 配图策略

### 图片来源优先级

1、**Unsplash** - 高质量真实摄影图片（首选）
   - 无版权图库
   - 专业摄影作品
   - 适合通用场景

2、**MiniMax AI** - AI生成定制图片（备选）
   - 自定义场景描述
   - 统一风格控制
   - 适合特定需求

### 配图位置规则

- **短文章（≤5段）**：开头封面图
- **中等文章（6-10段）**：开头 + 中间核心段落
- **长文章（>10段）**：开头 + 中间2处 + 结尾前

### 配图数量

- 最少：1张（封面图）
- 最多：5张（避免过度）
- 原则：**宁缺毋滥**，配图必须与内容高度相关

---

## 执行流程（完全自动）

当你输入 `/auto-image {文章路径}` 后，系统会自动：

### 步骤1：分析文章内容
- 提取文章标题
- 提取前3个二级标题（##）
- 提取高频加粗词（**xxx**）
- 识别文章情感基调
- 最多保留5个关键词用于搜索

### 步骤2：确定配图位置
- 根据文章段落数量智能决定
- 确保配图分布均匀
- 避免配图过于密集

### 步骤3：搜索/生成图片

**Unsplash搜索（首选）**：
```python
# 自动调用MCP工具
mcp__unsplash__search_photos(
    query="AI programming workspace",  # 关键词英文化
    per_page=5
)
```

**MiniMax生成（备选）**：
```python
# 如果Unsplash找不到合适的
mcp__minimax__text_to_image(
    prompt="一个产品经理在电脑前写代码，现代办公室，柔和光线，插画风格",
    style="illustration"
)
```

### 步骤4：插入配图
- 在确定的位置插入Markdown图片语法
- 格式：`![描述](图片URL)`
- 保持原文章格式和内容不变

### 步骤5：生成新文件
- 原文件：`文章名.md`（保留）
- 新文件：`文章名_with_images.md`（配图版）
- 输出详细配图报告

---

## 输出报告示例

```
✅ 自动配图完成！

📊 配图统计：
- 文章段落数：15段
- 配图数量：3张
- 图片来源：Unsplash x2, MiniMax x1

📸 配图详情：
1. 位置：第1段（开头）
   关键词：AI programming
   来源：Unsplash
   URL：https://images.unsplash.com/...

2. 位置：第8段（核心观点）
   关键词：developer productivity
   来源：Unsplash
   URL：https://images.unsplash.com/...

3. 位置：第14段（结尾升华）
   关键词：future of coding
   来源：MiniMax
   URL：...

📝 新文件已生成：
articles/2025-11-11_某某文章_老金风格_with_images.md

💡 建议：
- 预览配图效果，确认图片与内容相关
- 如果有不合适的配图，可以手动替换
- 配图版文件已准备好发布！
```

---

## MCP依赖配置

### 必需的MCP服务

1、**Unsplash MCP**
   - 通过MCP Router配置
   - 需要API Key：https://unsplash.com/oauth/applications

2、**MiniMax MCP**（可选）
   - 通过MCP Router配置
   - 需要API Key：https://platform.minimax.chat

### 检查MCP状态

```bash
# 查看MCP服务状态
claude mcp list

# 应该看到：
# ✓ unsplash - Unsplash图片搜索
# ✓ minimax - MiniMax AI图片生成
```

---

## 常见问题

### Q1: Unsplash搜索不到合适的图片？

**方案**：
- 系统会自动切换到MiniMax AI生图
- 或者更换关键词后重新运行

### Q2: 配图太多/太少？

**方案**：
- 编辑新生成的`_with_images.md`文件
- 手动添加或删除图片
- 或者调整文章段落结构后重新运行

### Q3: 图片风格不统一？

**方案**：
- 优先使用Unsplash保证风格一致
- 如果使用MiniMax，在提示词中指定统一风格
- 例如："插画风格,蓝色科技色调"

### Q4: 图片无法显示？

**方案**：
- 检查图片URL是否有效
- Unsplash图片URL有时需要代理
- 可以下载图片到本地后使用相对路径

---

## 技术实现

本命令调用Python脚本：
```
.claude/skills/gongzhonghao-writer/scripts/auto_image_generator.py
```

详细实现说明见：
```
.claude/skills/gongzhonghao-writer/scripts/README_IMAGE_TOOLS.md
```

---

**记住：配图是锦上添花，不是画蛇添足。宁缺毋滥！**
