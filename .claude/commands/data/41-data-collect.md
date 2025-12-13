---
name: 41-data-collect
description: 📥 微信公众号数据自动收集与分析
---

# 41-data-collect - 微信公众号数据自动收集与分析

**版本**：V2.0 | **更新日期**：2025-12-02

**一键完成**：数据收集 → 解析入库 → 深度分析 → 生成报告

---

## 🚀 使用方法

```bash
/collect-wechat-data
```

**默认收集**：最近30天的文章数据

---

## ⚠️ 唯一要求

在Chrome中打开微信公众号"发表记录"页面：
```
https://mp.weixin.qq.com/cgi-bin/appmsgpublish?sub=list&begin=0&count=10
```

Chrome会保存登录状态，只需第一次登录。

---

## 🤖 AI执行步骤（必须按顺序执行）

当用户执行 `/collect-wechat-data` 后，你必须按顺序执行以下步骤：

### 步骤1：检查Chrome调试端口

首先检查Chrome是否在9222端口运行：

```bash
Bash("curl -s http://localhost:9222/json/version 2>/dev/null && echo 'Chrome已连接' || echo 'Chrome未运行'")
```

**如果Chrome未运行**，提示用户启动Chrome调试模式：

```
请先启动Chrome（调试模式）：

Windows:
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222

Mac:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

然后在浏览器中打开微信公众号"发表记录"页面并登录。
```

### 步骤2：检查data/temp目录是否有snapshot文件

```bash
Bash("cd \"C:/Users/admin/Desktop/说明/data/temp\" && dir page*_snapshot.txt 2>nul || echo '无snapshot文件'")
```

**如果无snapshot文件**，提示用户：
- 需要先手动导出页面数据到 `data/temp/page1_snapshot.txt` 等文件
- 或使用Playwright MCP获取页面快照

### 步骤3：运行数据收集脚本

执行时间范围收集脚本（默认30天）：

```bash
Bash("cd \"C:/Users/admin/Desktop/说明/.claude/skills/gongzhonghao-writer/scripts\" && python -X utf8 collect_time_range.py --days 30")
```

**脚本功能**：
- 解析temp目录下的所有snapshot文件
- 提取文章标题、阅读数、点赞数、在看数
- 增量更新数据库（新增/更新已有文章）
- 自动生成收集报告

### 步骤4：运行深度数据分析脚本

```bash
Bash("cd \"C:/Users/admin/Desktop/说明/.claude/skills/gongzhonghao-writer/scripts\" && python -X utf8 analyze_wechat_data.py \"C:/Users/admin/Desktop/说明/data/wechat_articles.json\"")
```

**分析内容**：
- IQR方法定义爆款阈值
- TF-IDF关键词提取
- 标题长度统计检验（t-test）
- 多标签话题分类
- 发布时间趋势分析

### 步骤5：创建日期文件夹并保存报告

```bash
Bash("cd \"C:/Users/admin/Desktop/说明/data\" && mkdir \"%date:~0,4%-%date:~5,2%-%date:~8,2%_数据分析\" 2>nul && copy wechat_report.txt \"%date:~0,4%-%date:~5,2%-%date:~8,2%_数据分析\\收集报告.txt\" && copy analysis_report.json \"%date:~0,4%-%date:~5,2%-%date:~8,2%_数据分析\\分析报告.json\"")
```

### 步骤6：输出完成摘要

向用户展示：
- 收集到的文章数量
- 新增/更新的文章数
- 爆款文章TOP 3
- 关键分析发现
- 报告文件路径

---

## 📊 自动执行流程（概述）

1. ✅ 检查Chrome浏览器状态（CDP协议）
2. ✅ 提取页面文章数据（从snapshot文件）
3. ✅ 解析并存入JSON数据文件
4. ✅ 自动生成深度分析报告（科学统计版V7.0）
5. ✅ 按日期创建报告文件夹

---

## 📁 生成的文件结构

```
data/
├── 2025-12-01_数据分析/       # 按日期命名的文件夹
│   ├── 分析报告.md            # 深度分析（爆款规律、关键词、内容策略）
│   └── 收集报告.txt           # 收集统计（新增/更新、TOP10文章）
├── wechat.db                  # SQLite数据库
├── wechat_articles.json       # 文章JSON数据
├── wechat_report.txt          # 最新收集报告
└── temp/                      # 临时数据文件
```

---

## 📈 分析报告内容

### 1. 总体数据统计
- 文章总数、总阅读、总点赞、总在看
- 平均阅读、平均点赞率、平均在看率

### 2. 爆款文章规律
- 爆款文章数量和爆款率
- 标题长度规律
- 高频关键词TOP 10
- 话题类型分布

### 3. 内容策略分析
- 阅读量分布（25%/50%/75%分位）
- 高表现文章特征
- 发布时间分析

### 4. 行动建议
- 短期优化（1-2周）
- 中期策略（1-3月）
- 长期目标（3-6月）

---

## 🎯 执行示例

运行命令后，系统会：

```
[Step 1] 连接Chrome...
[Step 2] 提取页面数据...
[Step 3] 解析并存入数据库...
[Step 4] 生成收集报告...
[Step 5] 自动生成分析报告...

✅ 完成！报告已保存到：
data/2025-12-01_数据分析/
```

---

## 🔧 技术实现

- **CDP连接**：通过Chrome DevTools Protocol连接现有浏览器
- **数据库**：SQLite存储文章数据和历史快照
- **自动分析**：Python脚本自动调用，生成深度分析
- **日期归档**：每次分析创建独立的日期文件夹

---

## ⚡ 性能

- **执行时间**：10-20秒
- **网络流量**：几乎为0（读取已加载的页面）
- **CPU占用**：极低

---

**完全自动，零手动操作！**
