# 微信公众号数据库设计

## 为什么需要数据库？

### 当前JSON方案的问题
```json
{
  "title": "文章A",
  "read_count": 1000,  // 只有当前值，无法追踪历史
  "like_count": 50
}
```

**问题**：
- ❌ 无法追踪数据变化历史
- ❌ 不知道每次收集时的数据快照
- ❌ 无法分析增长趋势
- ❌ 无法回溯到某个时间点的数据

### 数据库方案的优势
```
第1次收集: 文章A (阅读500, 点赞10) - 2025-11-25 10:00
第2次收集: 文章A (阅读800, 点赞15) - 2025-11-26 10:00
第3次收集: 文章A (阅读1200, 点赞20) - 2025-11-27 10:00
```

**优势**：
- ✅ 完整记录每次收集的数据快照
- ✅ 可以分析任意时间段的增长
- ✅ 支持趋势图和数据分析
- ✅ 可以回溯历史数据

## 数据库结构设计

### 表1：articles（文章表）

存储文章的基本信息（不变的数据）

```sql
CREATE TABLE articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE,              -- 文章标题（唯一）
    url TEXT,                                -- 文章URL
    publish_time TEXT NOT NULL,              -- 发布时间（微信格式："今天 17:29"）
    publish_date TEXT NOT NULL,              -- 发布日期（绝对时间："2025-12-01 17:29"）
    first_collected_at TEXT NOT NULL,        -- 首次收集时间
    created_at TEXT DEFAULT CURRENT_TIMESTAMP -- 记录创建时间
);

-- 索引
CREATE INDEX idx_title ON articles(title);
CREATE INDEX idx_publish_date ON articles(publish_date);
```

### 表2：article_snapshots（文章快照表）

存储每次收集时的数据快照（会变化的数据）

```sql
CREATE TABLE article_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    article_id INTEGER NOT NULL,             -- 关联articles表
    read_count INTEGER DEFAULT 0,            -- 阅读数
    like_count INTEGER DEFAULT 0,            -- 点赞数
    look_count INTEGER DEFAULT 0,            -- 在看数
    comment_count INTEGER DEFAULT 0,         -- 评论数
    share_count INTEGER DEFAULT 0,           -- 分享数
    underline_count INTEGER DEFAULT 0,       -- 划线数
    reward_amount TEXT DEFAULT '¥0.00',     -- 赞赏金额
    collected_at TEXT NOT NULL,              -- 收集时间
    created_at TEXT DEFAULT CURRENT_TIMESTAMP, -- 记录创建时间

    FOREIGN KEY (article_id) REFERENCES articles(id)
);

-- 索引
CREATE INDEX idx_article_id ON article_snapshots(article_id);
CREATE INDEX idx_collected_at ON article_snapshots(collected_at);
CREATE INDEX idx_article_collected ON article_snapshots(article_id, collected_at);
```

### 表3：collection_runs（收集记录表）

存储每次收集任务的元数据

```sql
CREATE TABLE collection_runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at TEXT NOT NULL,                -- 收集开始时间
    completed_at TEXT,                       -- 收集完成时间
    days_range INTEGER,                      -- 收集天数范围（如7天）
    pages_collected INTEGER,                 -- 收集页数
    new_articles INTEGER DEFAULT 0,          -- 新增文章数
    updated_articles INTEGER DEFAULT 0,      -- 更新文章数
    total_articles INTEGER DEFAULT 0,        -- 总文章数
    status TEXT DEFAULT 'running',           -- 状态：running/completed/failed
    error_message TEXT,                      -- 错误信息
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_started_at ON collection_runs(started_at);
```

## 数据关系

```
articles (文章表)
   |
   |  1:N
   |
   +-----> article_snapshots (快照表)
                |
                |  每次收集创建新快照
                |
                v
            collection_runs (收集记录表)
```

## 使用示例

### 1. 首次收集文章A

```sql
-- 插入文章基本信息
INSERT INTO articles (title, url, publish_time, publish_date, first_collected_at)
VALUES ('文章A', 'https://...', '今天 17:29', '2025-12-01 17:29', '2025-12-01 10:00');

-- 插入第1次快照
INSERT INTO article_snapshots (article_id, read_count, like_count, look_count, collected_at)
VALUES (1, 500, 10, 20, '2025-12-01 10:00');
```

### 2. 第二天收集（数据增长了）

```sql
-- 文章已存在，只插入新快照
INSERT INTO article_snapshots (article_id, read_count, like_count, look_count, collected_at)
VALUES (1, 800, 15, 30, '2025-12-02 10:00');
```

### 3. 查询数据增长

```sql
-- 查询文章A的增长趋势
SELECT
    collected_at,
    read_count,
    like_count,
    look_count,
    read_count - LAG(read_count) OVER (ORDER BY collected_at) AS read_delta
FROM article_snapshots
WHERE article_id = 1
ORDER BY collected_at;
```

结果：
```
collected_at        | read_count | like_count | look_count | read_delta
--------------------|------------|------------|------------|------------
2025-12-01 10:00    | 500        | 10         | 20         | NULL
2025-12-02 10:00    | 800        | 15         | 30         | +300
2025-12-03 10:00    | 1200       | 20         | 45         | +400
```

### 4. 查询最近7天的增长

```sql
SELECT
    a.title,
    s1.read_count AS start_reads,
    s2.read_count AS end_reads,
    s2.read_count - s1.read_count AS growth
FROM articles a
JOIN article_snapshots s1 ON a.id = s1.article_id
    AND s1.collected_at = (
        SELECT MIN(collected_at)
        FROM article_snapshots
        WHERE article_id = a.id
        AND collected_at >= date('now', '-7 days')
    )
JOIN article_snapshots s2 ON a.id = s2.article_id
    AND s2.collected_at = (
        SELECT MAX(collected_at)
        FROM article_snapshots
        WHERE article_id = a.id
    )
ORDER BY growth DESC
LIMIT 10;
```

## Python 数据库操作类

```python
import sqlite3
from datetime import datetime
from pathlib import Path

class WeChatDatabase:
    def __init__(self, db_path="data/wechat.db"):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(exist_ok=True)
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row
        self.init_schema()

    def init_schema(self):
        """初始化数据库表结构"""
        cursor = self.conn.cursor()

        # 创建articles表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS articles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL UNIQUE,
                url TEXT,
                publish_time TEXT NOT NULL,
                publish_date TEXT NOT NULL,
                first_collected_at TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 创建article_snapshots表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS article_snapshots (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                article_id INTEGER NOT NULL,
                read_count INTEGER DEFAULT 0,
                like_count INTEGER DEFAULT 0,
                look_count INTEGER DEFAULT 0,
                comment_count INTEGER DEFAULT 0,
                share_count INTEGER DEFAULT 0,
                underline_count INTEGER DEFAULT 0,
                reward_amount TEXT DEFAULT '¥0.00',
                collected_at TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (article_id) REFERENCES articles(id)
            )
        """)

        # 创建collection_runs表
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS collection_runs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                started_at TEXT NOT NULL,
                completed_at TEXT,
                days_range INTEGER,
                pages_collected INTEGER,
                new_articles INTEGER DEFAULT 0,
                updated_articles INTEGER DEFAULT 0,
                total_articles INTEGER DEFAULT 0,
                status TEXT DEFAULT 'running',
                error_message TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # 创建索引
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_title ON articles(title)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_article_id ON article_snapshots(article_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_collected_at ON article_snapshots(collected_at)")

        self.conn.commit()

    def add_or_update_article(self, article_data, collected_at=None):
        """添加或更新文章"""
        if collected_at is None:
            collected_at = datetime.now().isoformat()

        cursor = self.conn.cursor()

        # 检查文章是否存在
        cursor.execute("SELECT id FROM articles WHERE title = ?", (article_data['title'],))
        row = cursor.fetchone()

        if row is None:
            # 新文章 - 插入基本信息
            cursor.execute("""
                INSERT INTO articles (title, url, publish_time, publish_date, first_collected_at)
                VALUES (?, ?, ?, ?, ?)
            """, (
                article_data['title'],
                article_data.get('url', ''),
                article_data['publish_time'],
                article_data['publish_date'],
                collected_at
            ))
            article_id = cursor.lastrowid
        else:
            article_id = row[0]

        # 插入快照数据
        cursor.execute("""
            INSERT INTO article_snapshots (
                article_id, read_count, like_count, look_count,
                comment_count, share_count, underline_count,
                reward_amount, collected_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            article_id,
            article_data.get('read_count', 0),
            article_data.get('like_count', 0),
            article_data.get('look_count', 0),
            article_data.get('comment_count', 0),
            article_data.get('share_count', 0),
            article_data.get('underline_count', 0),
            article_data.get('reward_amount', '¥0.00'),
            collected_at
        ))

        self.conn.commit()
        return article_id

    def get_article_growth(self, title, days=7):
        """获取文章的增长数据"""
        cursor = self.conn.cursor()

        cursor.execute("""
            SELECT
                s.collected_at,
                s.read_count,
                s.like_count,
                s.look_count
            FROM articles a
            JOIN article_snapshots s ON a.id = s.article_id
            WHERE a.title = ?
            AND s.collected_at >= date('now', ? || ' days')
            ORDER BY s.collected_at
        """, (title, -days))

        return cursor.fetchall()
```

## 数据迁移

### 从JSON迁移到数据库

```python
import json

def migrate_from_json(json_file, db):
    """从JSON迁移到数据库"""
    with open(json_file, 'r', encoding='utf-8') as f:
        articles = json.load(f)

    # 假设这是首次迁移，collected_at设为文件修改时间
    collected_at = datetime.fromtimestamp(
        Path(json_file).stat().st_mtime
    ).isoformat()

    for article in articles:
        db.add_or_update_article(article, collected_at)

    print(f"迁移完成: {len(articles)}篇文章")
```

## 报告查询示例

### 最近7天增长最快的文章

```sql
WITH latest AS (
    SELECT article_id, MAX(collected_at) AS max_time
    FROM article_snapshots
    WHERE collected_at >= date('now', '-7 days')
    GROUP BY article_id
),
earliest AS (
    SELECT article_id, MIN(collected_at) AS min_time
    FROM article_snapshots
    WHERE collected_at >= date('now', '-7 days')
    GROUP BY article_id
)
SELECT
    a.title,
    s1.read_count AS start_reads,
    s2.read_count AS end_reads,
    s2.read_count - s1.read_count AS growth
FROM articles a
JOIN earliest e ON a.id = e.article_id
JOIN latest l ON a.id = l.article_id
JOIN article_snapshots s1 ON a.id = s1.article_id AND s1.collected_at = e.min_time
JOIN article_snapshots s2 ON a.id = s2.article_id AND s2.collected_at = l.max_time
ORDER BY growth DESC
LIMIT 10;
```

## 总结

**数据库方案优势**：
1. ✅ 完整历史记录 - 追踪每次收集的数据
2. ✅ 趋势分析 - 查询任意时间段的增长
3. ✅ 灵活查询 - SQL支持复杂数据分析
4. ✅ 数据完整性 - 外键约束保证数据一致性
5. ✅ 性能优化 - 索引加速查询

**下一步实施**：
1. 创建 `database.py` 模块
2. 实现数据迁移脚本
3. 更新收集脚本使用数据库
4. 添加数据分析和报告功能
