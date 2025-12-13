"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type View = 'home' | 'write' | 'title' | 'quality' | 'topic' | 'data' | 'articles';

const navItems = [
  { id: 'home' as View, label: '首页', icon: '🏠' },
  { id: 'write' as View, label: '开始写作', icon: '✍️' },
  { id: 'title' as View, label: '标题生成', icon: '📝' },
  { id: 'quality' as View, label: '质量检测', icon: '✅' },
  { id: 'topic' as View, label: '选题过滤', icon: '🎯' },
  { id: 'data' as View, label: '数据看板', icon: '📊' },
  { id: 'articles' as View, label: '文章管理', icon: '📚' },
];

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [topic, setTopic] = useState('');

  return (
    <div className="min-h-screen bg-white flex">
      {/* 左侧边栏 */}
      <aside className="w-64 border-r border-gray-200 p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">公众号写作助手</h1>
          <p className="text-xs text-gray-500 mt-1">V7.2.1 Web版</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <p>基于82篇数据验证</p>
            <p>12大爆款公式 · V3系统</p>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {currentView === 'home' && <HomeView />}
          {currentView === 'write' && <WriteView topic={topic} setTopic={setTopic} />}
          {currentView === 'title' && <TitleView topic={topic} setTopic={setTopic} />}
          {currentView === 'quality' && <QualityView />}
          {currentView === 'topic' && <TopicView />}
          {currentView === 'data' && <DataView />}
          {currentView === 'articles' && <ArticlesView />}
        </div>
      </main>
    </div>
  );
}

// ============================================================
// 各功能组件
// ============================================================

function HomeView() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">欢迎使用</h2>
      <p className="text-lg text-gray-600 mb-8">选择左侧功能开始使用</p>

      <div className="grid grid-cols-2 gap-4">
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-2">✅ 已发布</h3>
          <p className="text-3xl font-bold text-blue-600">40</p>
        </div>
        <div className="card p-6">
          <h3 className="text-xl font-semibold mb-2">📝 草稿</h3>
          <p className="text-3xl font-bold text-yellow-600">35</p>
        </div>
      </div>
    </div>
  );
}

function WriteView({ topic, setTopic }: { topic: string; setTopic: (t: string) => void }) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">开始写作</h2>
      <div className="card p-6">
        <Input
          placeholder="输入主题..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mb-4"
        />
        <Button className="w-full">生成文章</Button>
      </div>
    </div>
  );
}

function TitleView({ topic, setTopic }: { topic: string; setTopic: (t: string) => void }) {
  const [titles, setTitles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/title/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count: 5 })
      });
      const data = await res.json();
      if (data.success) {
        setTitles(data.data.titles || []);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">标题生成</h2>
      <div className="card p-6 mb-6">
        <Input
          placeholder="输入主题..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mb-4"
        />
        <Button onClick={handleGenerate} disabled={loading} className="w-full">
          {loading ? '生成中...' : '生成5个爆款标题'}
        </Button>
      </div>

      {titles.length > 0 && (
        <div className="space-y-3">
          {titles.map((item, idx) => (
            <div key={idx} className="card p-6">
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.formula} · SEO {item.seo_score}分</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QualityView() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">质量检测</h2>
      <div className="card p-6">
        <textarea
          placeholder="粘贴文章内容..."
          className="w-full h-64 p-4 border rounded-lg"
        />
        <Button className="w-full mt-4">开始检测</Button>
      </div>
    </div>
  );
}

function TopicView() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">选题过滤</h2>
      <div className="card p-6">
        <Input placeholder="输入选题..." className="mb-4" />
        <Button className="w-full">评估选题</Button>
      </div>
    </div>
  );
}

function DataView() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">数据看板</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-6">
          <p className="text-sm text-gray-600 mb-1">总文章</p>
          <p className="text-3xl font-bold">82</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600 mb-1">平均阅读</p>
          <p className="text-3xl font-bold">1798</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600 mb-1">爆款率</p>
          <p className="text-3xl font-bold">46.8%</p>
        </div>
      </div>
    </div>
  );
}

function ArticlesView() {
  const [articles, setArticles] = useState([
    { id: '2025-12-12_核心_热点_Cursor_Cursor2.2更新.md', title: 'Cursor2.2更新', date: '2025-12-12', words: 3200, status: '草稿', qualityScore: null },
    { id: '2025-12-09_核心_常青_Claude_老金用Claude.md', title: '老金用Claude半年才知道', date: '2025-12-09', words: 2800, status: '已发布', qualityScore: 82 },
    { id: '2025-12-08_泛AI_常青_AI工具.md', title: 'AI工具对比', date: '2025-12-08', words: 1500, status: '草稿', qualityScore: 55 },
  ]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchCheckProgress, setBatchCheckProgress] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const handleSelectAll = () => {
    if (selected.size === articles.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(articles.map(a => a.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleBatchCheck = async () => {
    const selectedArticles = Array.from(selected);
    if (selectedArticles.length === 0) return;

    setBatchCheckProgress(0);

    try {
      const res = await fetch('/api/quality/batch-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleIds: selectedArticles })
      });

      const data = await res.json();

      if (data.success) {
        setSummary(data.data);
        setShowSummary(true);

        // 更新文章列表的质检状态
        const updatedArticles = articles.map(article => {
          const result = data.data.results.find((r: any) => r.articleId === article.id);
          if (result) {
            return { ...article, qualityScore: result.totalScore };
          }
          return article;
        });
        setArticles(updatedArticles);
      }
    } catch (error) {
      alert('批量质检失败');
    } finally {
      setBatchCheckProgress(0);
    }
  };

  const checkSingleArticle = async (articleId: string) => {
    // 单篇质检
    try {
      const res = await fetch('/api/quality/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: `articles/drafts/${articleId}` })
      });

      const data = await res.json();

      if (data.success) {
        // 更新该文章的质检分数
        const updatedArticles = articles.map(article =>
          article.id === articleId
            ? { ...article, qualityScore: data.data.totalScore }
            : article
        );
        setArticles(updatedArticles);
      }
    } catch (error) {
      alert('质检失败');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">文章管理</h2>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={selected.size === articles.length && articles.length > 0}
              onChange={handleSelectAll}
              className="rounded"
            />
            全选
          </label>
          <Button
            onClick={handleBatchCheck}
            disabled={selected.size === 0}
            className="bg-blue-600"
          >
            一键质检全部（{selected.size}篇）
          </Button>
        </div>
      </div>

      {/* 批量质检进度 */}
      {batchCheckProgress > 0 && (
        <div className="card p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{ width: `${batchCheckProgress}%` }}
                />
              </div>
            </div>
            <span className="text-sm text-gray-600">{Math.round(batchCheckProgress)}%</span>
          </div>
        </div>
      )}

      {/* 文章列表 */}
      <div className="space-y-3">
        {articles.map((article) => (
          <div key={article.id} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={selected.has(article.id)}
                onChange={() => toggleSelect(article.id)}
                className="mt-1 rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{article.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>{article.status}</span>
                  <span>·</span>
                  <span>{article.date}</span>
                  <span>·</span>
                  <span>{article.words}字</span>
                </div>

                {/* 质检状态 */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700">📊 质检:</span>
                  {article.qualityScore === null ? (
                    <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs">⚠️ 未检测</span>
                  ) : article.qualityScore >= 70 ? (
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">✅ 通过（{article.qualityScore}分）</span>
                  ) : article.qualityScore >= 60 ? (
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs">⚠️ 警告（{article.qualityScore}分）</span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-xs">❌ 不通过（{article.qualityScore}分）</span>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">编辑</Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => checkSingleArticle(article.id)}
                  >
                    质检
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">删除</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 批量质检汇总弹窗 */}
      {showSummary && summary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">批量质检汇总报告</h3>

            {/* 汇总统计 */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="card p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">总文章</p>
                <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
              </div>
              <div className="card p-4 text-center bg-green-50">
                <p className="text-sm text-gray-600 mb-1">✅ 通过</p>
                <p className="text-3xl font-bold text-green-600">{summary.passed}</p>
              </div>
              <div className="card p-4 text-center bg-yellow-50">
                <p className="text-sm text-gray-600 mb-1">⚠️ 警告</p>
                <p className="text-3xl font-bold text-yellow-600">{summary.warning}</p>
              </div>
              <div className="card p-4 text-center bg-red-50">
                <p className="text-sm text-gray-600 mb-1">❌ 不通过</p>
                <p className="text-3xl font-bold text-red-600">{summary.failed}</p>
              </div>
            </div>

            {/* 优先修复列表 */}
            {summary.priorityFixes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">建议优先修改：</h4>
                <div className="space-y-2">
                  {summary.priorityFixes.map((article: any, idx: number) => (
                    <div key={idx} className="p-3 bg-red-50 rounded-lg">
                      <p className="font-medium text-gray-900">{idx + 1}. {article.title}</p>
                      <p className="text-sm text-red-600 mt-1">
                        {article.criticalIssues.join('、')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowSummary(false)}>
                关闭
              </Button>
              <Button onClick={() => {
                setShowSummary(false);
                // TODO: 导出Excel
              }}>
                导出报告
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
