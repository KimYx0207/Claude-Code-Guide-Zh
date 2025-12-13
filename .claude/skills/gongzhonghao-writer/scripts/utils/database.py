# -*- coding: utf-8 -*-
"""
微信公众号数据库模块
使用SQLite存储文章数据和历史快照
"""
import os
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional


# 获取项目根目录（与wechat_data_collector.py保持一致）
PROJECT_ROOT = Path(os.getenv('CLAUDE_PROJECT_DIR', Path(__file__).parent.parent.parent.parent.parent))
DEFAULT_DB_PATH = PROJECT_ROOT / "data" / "wechat.db"


class WeChatDatabase:
    """微信公众号数据库管理类"""

    def __init__(self, db_path: Path = None):
        """
        初始化数据库连接

        Args:
            db_path: 数据库文件路径（Path对象或None使用默认）
                    修复：使用绝对路径，避免相对路径"../../../../data/wechat.db"导致的路径错误
        """
        # 使用传入的db_path，如果为None则使用默认路径
        if db_path is None:
            db_path = DEFAULT_DB_PATH
        elif isinstance(db_path, str):
            # 向后兼容：如果传入字符串，转为Path并解析为绝对路径
            db_path = Path(db_path)
            if not db_path.is_absolute():
                db_path = PROJECT_ROOT / db_path

        self.db_path = db_path
        self.db_path.parent.mkdir(exist_ok=True, parents=True)
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row  # 返回字典格式
        self.init_schema()

    def init_schema(self):
        """初始化数据库表结构"""
        cursor = self.conn.cursor()

        # 创建articles表（文章基本信息）
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

        # 创建article_snapshots表（数据快照）
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

        # 创建collection_runs表（收集记录）
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
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_publish_date ON articles(publish_date)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_article_id ON article_snapshots(article_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_collected_at ON article_snapshots(collected_at)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_started_at ON collection_runs(started_at)")

        self.conn.commit()

    def start_collection_run(self, days_range: Optional[int] = None) -> int:
        """
        开始新的收集任务

        Args:
            days_range: 收集天数范围

        Returns:
            run_id: 收集任务ID
        """
        cursor = self.conn.cursor()
        started_at = datetime.now().isoformat()

        cursor.execute("""
            INSERT INTO collection_runs (started_at, days_range, status)
            VALUES (?, ?, 'running')
        """, (started_at, days_range))

        self.conn.commit()
        return cursor.lastrowid

    def complete_collection_run(self, run_id: int, pages_collected: int,
                                new_articles: int, updated_articles: int,
                                total_articles: int):
        """
        完成收集任务

        Args:
            run_id: 收集任务ID
            pages_collected: 收集页数
            new_articles: 新增文章数
            updated_articles: 更新文章数
            total_articles: 总文章数
        """
        cursor = self.conn.cursor()
        completed_at = datetime.now().isoformat()

        cursor.execute("""
            UPDATE collection_runs
            SET completed_at = ?,
                pages_collected = ?,
                new_articles = ?,
                updated_articles = ?,
                total_articles = ?,
                status = 'completed'
            WHERE id = ?
        """, (completed_at, pages_collected, new_articles, updated_articles,
              total_articles, run_id))

        self.conn.commit()

    def fail_collection_run(self, run_id: int, error_message: str):
        """
        标记收集任务失败

        Args:
            run_id: 收集任务ID
            error_message: 错误信息
        """
        cursor = self.conn.cursor()
        completed_at = datetime.now().isoformat()

        cursor.execute("""
            UPDATE collection_runs
            SET completed_at = ?,
                status = 'failed',
                error_message = ?
            WHERE id = ?
        """, (completed_at, error_message, run_id))

        self.conn.commit()

    def add_or_update_article(self, article_data: Dict, collected_at: Optional[str] = None) -> tuple:
        """
        添加或更新文章

        Args:
            article_data: 文章数据字典
            collected_at: 收集时间（ISO格式）

        Returns:
            (article_id, is_new): 文章ID和是否为新文章
        """
        if collected_at is None:
            collected_at = datetime.now().isoformat()

        cursor = self.conn.cursor()

        # 检查文章是否存在
        cursor.execute("SELECT id FROM articles WHERE title = ?", (article_data['title'],))
        row = cursor.fetchone()

        is_new = (row is None)

        if is_new:
            # 新文章 - 插入基本信息
            cursor.execute("""
                INSERT INTO articles (title, url, publish_time, publish_date, first_collected_at)
                VALUES (?, ?, ?, ?, ?)
            """, (
                article_data['title'],
                article_data.get('url', ''),
                article_data['publish_time'],
                article_data.get('publish_date', ''),
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
        return (article_id, is_new)

    def get_article_latest_snapshot(self, title: str) -> Optional[Dict]:
        """
        获取文章的最新快照

        Args:
            title: 文章标题

        Returns:
            最新快照数据（字典）或None
        """
        cursor = self.conn.cursor()

        cursor.execute("""
            SELECT
                a.id AS article_id,
                a.title,
                a.url,
                a.publish_time,
                a.publish_date,
                s.read_count,
                s.like_count,
                s.look_count,
                s.comment_count,
                s.share_count,
                s.underline_count,
                s.reward_amount,
                s.collected_at
            FROM articles a
            JOIN article_snapshots s ON a.id = s.article_id
            WHERE a.title = ?
            ORDER BY s.collected_at DESC
            LIMIT 1
        """, (title,))

        row = cursor.fetchone()
        return dict(row) if row else None

    def get_article_growth(self, title: str, days: int = 7) -> List[Dict]:
        """
        获取文章的增长数据

        Args:
            title: 文章标题
            days: 天数

        Returns:
            快照列表
        """
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
            AND s.collected_at >= datetime('now', ? || ' days')
            ORDER BY s.collected_at
        """, (title, -days))

        return [dict(row) for row in cursor.fetchall()]

    def get_all_articles_latest(self) -> List[Dict]:
        """
        获取所有文章的最新快照

        Returns:
            文章列表
        """
        cursor = self.conn.cursor()

        cursor.execute("""
            SELECT
                a.id AS article_id,
                a.title,
                a.url,
                a.publish_time,
                a.publish_date,
                s.read_count,
                s.like_count,
                s.look_count,
                s.comment_count,
                s.share_count,
                s.underline_count,
                s.reward_amount,
                s.collected_at AS last_updated
            FROM articles a
            JOIN article_snapshots s ON a.id = s.article_id
            WHERE s.id = (
                SELECT id FROM article_snapshots
                WHERE article_id = a.id
                ORDER BY collected_at DESC
                LIMIT 1
            )
            ORDER BY a.publish_date DESC
        """)

        return [dict(row) for row in cursor.fetchall()]

    def get_top_articles(self, limit: int = 10, days: Optional[int] = None) -> List[Dict]:
        """
        获取爆款文章（按阅读数排序）

        Args:
            limit: 返回数量
            days: 限制天数（可选）

        Returns:
            文章列表
        """
        cursor = self.conn.cursor()

        if days:
            cursor.execute("""
                SELECT
                    a.title,
                    a.publish_date,
                    s.read_count,
                    s.like_count,
                    s.look_count
                FROM articles a
                JOIN article_snapshots s ON a.id = s.article_id
                WHERE s.id = (
                    SELECT id FROM article_snapshots
                    WHERE article_id = a.id
                    ORDER BY collected_at DESC
                    LIMIT 1
                )
                AND a.publish_date >= datetime('now', ? || ' days')
                ORDER BY s.read_count DESC
                LIMIT ?
            """, (-days, limit))
        else:
            cursor.execute("""
                SELECT
                    a.title,
                    a.publish_date,
                    s.read_count,
                    s.like_count,
                    s.look_count
                FROM articles a
                JOIN article_snapshots s ON a.id = s.article_id
                WHERE s.id = (
                    SELECT id FROM article_snapshots
                    WHERE article_id = a.id
                    ORDER BY collected_at DESC
                    LIMIT 1
                )
                ORDER BY s.read_count DESC
                LIMIT ?
            """, (limit,))

        return [dict(row) for row in cursor.fetchall()]

    def get_fastest_growing(self, days: int = 7, limit: int = 10) -> List[Dict]:
        """
        获取最近N天增长最快的文章

        Args:
            days: 天数
            limit: 返回数量

        Returns:
            文章列表
        """
        cursor = self.conn.cursor()

        cursor.execute("""
            WITH earliest AS (
                SELECT article_id, MIN(collected_at) AS min_time
                FROM article_snapshots
                WHERE collected_at >= datetime('now', ? || ' days')
                GROUP BY article_id
            ),
            latest AS (
                SELECT article_id, MAX(collected_at) AS max_time
                FROM article_snapshots
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
            WHERE s2.read_count - s1.read_count > 0
            ORDER BY growth DESC
            LIMIT ?
        """, (-days, limit))

        return [dict(row) for row in cursor.fetchall()]

    def close(self):
        """关闭数据库连接"""
        self.conn.close()


# 测试代码
if __name__ == '__main__':
    # 创建数据库（修复：使用绝对路径）
    test_db_path = PROJECT_ROOT / "data" / "wechat_test.db"
    db = WeChatDatabase(test_db_path)

    # 测试添加文章
    article1 = {
        'title': '测试文章A',
        'url': 'https://example.com/a',
        'publish_time': '今天 17:29',
        'publish_date': '2025-12-01 17:29',
        'read_count': 500,
        'like_count': 10,
        'look_count': 20
    }

    print("测试添加文章...")
    article_id, is_new = db.add_or_update_article(article1)
    print(f"文章ID: {article_id}, 是否新文章: {is_new}")

    # 模拟数据增长
    print("\n模拟数据增长...")
    article1['read_count'] = 800
    article1['like_count'] = 15
    article_id, is_new = db.add_or_update_article(article1)
    print(f"文章ID: {article_id}, 是否新文章: {is_new}")

    # 查询增长数据
    print("\n查询增长数据...")
    growth = db.get_article_growth('测试文章A', days=7)
    for snapshot in growth:
        print(f"  {snapshot['collected_at']}: 阅读{snapshot['read_count']}")

    db.close()
    print("\n测试完成！")
