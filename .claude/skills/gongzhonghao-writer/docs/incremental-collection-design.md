# 微信公众号数据增量收集设计

## 问题分析

**当前规则的问题**：
- 每次都收集全部17页数据（170篇文章）
- 浪费时间（30-40秒）
- 浪费资源（重复收集已有数据）
- 容易触发微信反爬虫机制

## 正确的增量收集逻辑

### 核心原则
**只收集新数据，检测到重复立即停止**

### 实现步骤

#### Step 1: 读取已有数据
```python
# 读取 wechat_articles.json
existing_articles = load_existing_data()
existing_titles = {article['title'] for article in existing_articles}
```

#### Step 2: 从第1页开始收集
```javascript
// 收集当前页（第1页）
page1_data = collect_page(1)

// 检查是否有新文章
new_articles = []
for article in page1_data:
    if article.title not in existing_titles:
        new_articles.append(article)
    else:
        // 遇到重复，说明后面都是旧数据
        break
```

#### Step 3: 智能判断是否继续
```python
if len(new_articles) == 10:
    # 第1页全是新文章，继续收集第2页
    continue_collecting = True
elif len(new_articles) > 0:
    # 部分新文章，说明已经到旧数据边界
    continue_collecting = False
else:
    # 没有新文章，完全重复
    continue_collecting = False
```

#### Step 4: 逐页收集直到遇到重复
```python
page_num = 2
max_pages = 17

while page_num <= max_pages and continue_collecting:
    page_data = collect_page(page_num)

    # 检测重复
    has_new = False
    for article in page_data:
        if article.title not in existing_titles:
            new_articles.append(article)
            has_new = True
        else:
            # 遇到重复，停止收集
            continue_collecting = False
            break

    if not has_new:
        # 整页都是旧数据，停止
        break

    page_num += 1
```

## 数据去重策略

### 主键选择
使用 `title + publish_time` 作为唯一标识：
```python
def get_article_key(article):
    return f"{article['title']}_{article['publish_time']}"
```

### 更新策略
- **新文章**：直接添加
- **重复文章（标题+时间相同）**：更新阅读/点赞/在看等动态数据
- **时间不同但标题相同**：视为新文章（修改后重新发布）

## 性能优化

### 1. 早停机制
```python
# 连续3页都是重复数据，立即停止
duplicate_page_count = 0

for page in pages:
    if all_duplicates(page):
        duplicate_page_count += 1
        if duplicate_page_count >= 3:
            break
    else:
        duplicate_page_count = 0
```

### 2. 快照复用
```python
# 如果上次收集时间<24小时，跳过第2页之后的收集
last_collection_time = get_last_collection_time()
if (now - last_collection_time) < 24h:
    max_pages = 2  # 只收集最新2页
```

### 3. 智能等待
```python
# 根据页面加载状态动态调整等待时间
if page_loaded_fast:
    wait_time = 2s
else:
    wait_time = 5s
```

## 收集报告格式

```
========== 微信公众号增量数据收集报告 ==========

[收集概况]
- 收集时间：2025-11-30 19:30
- 收集页数：3页（第1-3页）
- 停止原因：第3页检测到重复数据

[数据统计]
- 新增文章：5篇
- 更新文章：12篇（阅读/点赞数据更新）
- 跳过文章：23篇（完全重复）

[新增文章列表]
1、OpenAI o3突破AGI（今天 18:35）
2、Claude Opus 4.5降价（昨天 19:00）
...

[总数据量]
- 文章总数：84篇（79+5）
- 总阅读数：125,340（+8,140）
- 总点赞数：2,215（+115）
```

## 实现优先级

### Phase 1: 基础增量收集（必须）
- ✅ 读取已有数据
- ✅ 逐页检测重复
- ✅ 遇到重复立即停止
- ✅ 更新动态数据

### Phase 2: 智能优化（推荐）
- ⏳ 早停机制（连续3页重复）
- ⏳ 时间窗口优化（<24h只收集2页）
- ⏳ 动态等待时间

### Phase 3: 高级功能（可选）
- ⏳ 自动检测发布频率，预测需要收集的页数
- ⏳ 异常检测（数据突然下降可能是删文）
- ⏳ 自动生成收集建议

---

**设计日期**：2025-11-30
**设计者**：老金
