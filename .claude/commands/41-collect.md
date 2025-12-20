---
name: 41-data-collect
description: 📥 微信公众号数据自动收集与分析（默认30天）
---

# 41-data-collect - 微信公众号数据自动收集

**版本**：V3.0 | **更新日期**：2025-12-16

**⚠️ AI必读**：用户执行此命令后，你必须**立即主动**使用MCP浏览器工具完成所有步骤，**默认收集30天数据**，不要等待用户指示！

---

## 🚀 用户使用方法

```bash
/data-collect
```

**一键完成**：自动打开 → 自动登录 → 自动收集30天数据 → 自动分析 → 输出报告

**默认参数**：收集最近**30天**的文章数据

---

## 🤖 AI自动执行流程（立即执行）

### 步骤1：自动打开微信公众号页面

```typescript
// 使用MCP工具打开微信公众号
mcp__mcp-router__navigate_page({
  type: "url",
  url: "https://mp.weixin.qq.com/cgi-bin/appmsgpublish?sub=list&begin=0&count=10",
  timeout: 15000
})

// 等待加载
sleep 3秒

// 获取快照
snapshot = mcp__mcp-router__take_snapshot()
```

**处理登录**：
- 如果显示"登录超时"或"请重新登录"：
  - 点击登录链接：`mcp__mcp-router__click({uid: 登录链接uid})`
  - 提示用户："请在MCP浏览器窗口中扫码登录（只需一次，session永久有效）"
  - 等待30秒让用户扫码
  - 获取新快照确认登录成功

### 步骤2：自动翻页收集30天数据

```python
collected_articles = []
current_page = 0
target_pages = 3  # 默认收集3页（30篇文章，约30天）

while current_page < target_pages:
    # 获取当前页数据
    snapshot = mcp__mcp-router__take_snapshot()

    # 从snapshot提取文章信息
    # 格式示例：
    # uid=X_46 link "文章标题 原创"
    # uid=X_50 StaticText "1,149"  (阅读数)
    # uid=X_52 StaticText "23"     (点赞数)
    # uid=X_54 StaticText "83"     (在看数)
    # uid=X_44 StaticText "12月15日" (日期)

    articles = 从snapshot解析文章数据

    # 保存文章
    for article in articles:
        collected_articles.append({
            "title": article.title,
            "date": article.date,  // 转换为 YYYY-MM-DD 格式
            "read_count": article.reads,
            "like_count": article.likes,
            "share_count": article.shares
        })

    # 翻到下一页
    if current_page < target_pages - 1:
        current_page += 1
        begin = current_page * 10
        token = 从当前URL提取token
        next_url = f"https://mp.weixin.qq.com/cgi-bin/appmsgpublish?sub=list&begin={begin}&count=10&token={token}&lang=zh_CN"

        mcp__mcp-router__navigate_page({type: "url", url: next_url})
        sleep 2秒  // 避免请求过快
```

### 步骤3：保存数据

```typescript
// 保存收集的数据
Write("data/wechat_articles_latest.json", JSON.stringify(collected_articles, null, 2))

console.log(`✅ 数据已保存：${collected_articles.length}篇文章`)
```

### 步骤4：分析数据（调用Python脚本）

```bash
Bash("cd .claude/skills/gongzhonghao-writer/scripts && python analyze_wechat_data.py ../../data/wechat_articles_latest.json")
```

### 步骤5：输出完成摘要

```markdown
============================================================
✅ 30天数据收集完成！
============================================================

📊 收集统计：
- 时间范围：{最早日期} 至 {最新日期}
- 收集文章：{总数}篇
- 爆款文章（≥2000阅读）：{爆款数}篇
- 平均阅读：{平均值}

🔥 爆款文章TOP 3：
1. {标题}（{阅读数}阅读，{点赞}赞，{在看}在看）
2. {标题}（{阅读数}阅读，{点赞}赞，{在看}在看）
3. {标题}（{阅读数}阅读，{点赞}赞，{在看}在看）

💡 关键发现（基于分析报告）：
- 高频关键词：{TOP 3}
- 最佳话题类型：{类型}（爆款率{百分比}%）
- 推荐标题长度：{范围}字
- 最佳发布时段：{时段}

📁 数据文件：data/wechat_articles_latest.json
📊 分析报告：.claude/skills/gongzhonghao-writer/scripts/analysis_report.json
============================================================
```

---

## 📋 技术说明

### MCP工具使用

- **mcp__mcp-router__navigate_page** - 自动打开/导航到指定URL
- **mcp__mcp-router__take_snapshot** - 获取页面无障碍树快照
- **mcp__mcp-router__click** - 自动点击页面元素

### 数据提取方法

从snapshot提取文章信息：
1. 查找包含"link"和文章标题的行
2. 查找紧随其后的StaticText（阅读数、点赞、在看）
3. 查找日期信息（格式："12月15日"或"昨天"）
4. 组装成结构化JSON

### 默认参数

- **目标页数**：3页（约30篇文章）
- **时间范围**：30天
- **收集间隔**：每页间隔2秒
- **超时设置**：每次导航15秒超时

---

## ⚡ 性能

- **执行时间**：约1-2分钟（3页 × 2秒 + 分析30秒）
- **网络流量**：极低（只读取已加载页面）
- **用户操作**：零操作（首次需扫码登录）

---

## 🎯 首次使用

**第一次运行**：
1. 运行 `/data-collect`
2. AI自动打开MCP浏览器窗口
3. 你扫码登录微信公众号（2分钟）
4. AI自动收集30天数据
5. 完成！

**以后每次**：
1. 运行 `/data-collect`
2. AI自动使用保存的session
3. 自动收集最新30天数据
4. 完成！

**完全自动，零手动操作！**

---

## 📊 输出示例

```
✅ 30天数据收集完成！

📊 收集统计：
- 时间范围：2025-11-18 至 2025-12-15
- 收集文章：16篇
- 爆款文章：4篇
- 平均阅读：2,245

🔥 爆款TOP 3：
1. 谷歌这波赛博菩萨（10,973阅读）
2. 谷歌Antigravity白嫖（6,921阅读）
3. Claude Code Hooks神器（2,831阅读）

💡 关键发现：
- 高频关键词：谷歌、Claude、Gemini
- 最佳话题：教程类（爆款率43.8%）
- 推荐标题：31-40字
```
