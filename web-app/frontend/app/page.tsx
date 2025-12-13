"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TabView = 'home' | 'write';

export default function Home() {
  const [currentTab, setCurrentTab] = useState<TabView>('home');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">公众号写作助手</h1>
              <p className="text-sm text-gray-500">V7.2.1 Web版 · 基于82篇数据验证</p>
            </div>
            <div className="text-sm text-gray-600">
              综合评分：<span className="font-bold text-blue-600">73.05/100</span>
            </div>
          </div>

          {/* 2个Tab切换 */}
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'home'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏠 首页
            </button>
            <button
              onClick={() => setCurrentTab('write')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'write'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ✍️ 开始写作
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentTab === 'home' && <HomeTab />}
        {currentTab === 'write' && <WriteTab />}
      </main>
    </div>
  );
}

// ============================================================
// Tab 1: 首页（数据看板+文章管理）
// ============================================================

function HomeTab() {
  const [articles, setArticles] = useState([
    { id: '2025-12-12_核心_热点_Cursor_Cursor2.2更新.md', title: 'Cursor2.2更新Debug Mode写前端的有福了', date: '2025-12-12', words: 3200, status: '草稿', qualityScore: null },
    { id: '2025-12-09_核心_常青_Claude_老金用Claude.md', title: '老金用Claude半年才知道原来一直少装了这个省钱神器', date: '2025-12-09', words: 2800, status: '已发布', qualityScore: 82 },
    { id: '2025-12-08_泛AI_常青_AI工具.md', title: 'AI工具对比评测', date: '2025-12-08', words: 1500, status: '草稿', qualityScore: 55 },
  ]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
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
    }
  };

  const checkSingleArticle = async (articleId: string) => {
    try {
      const res = await fetch('/api/quality/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: `articles/drafts/${articleId}` })
      });

      const data = await res.json();

      if (data.success) {
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
    <div className="space-y-6">
      {/* 数据看板 */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">📊 数据看板</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">总文章</p>
            <p className="text-3xl font-bold text-gray-900">82篇</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">爆款率</p>
            <p className="text-3xl font-bold text-blue-600">25.6%</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">平均阅读</p>
            <p className="text-3xl font-bold text-green-600">1323</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">质量分</p>
            <p className="text-3xl font-bold text-purple-600">78分</p>
          </div>
        </div>
      </div>

      {/* 文章管理 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">📚 文章管理</h2>
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

        <div className="space-y-3">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
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
      </div>

      {/* 批量质检汇总弹窗 */}
      {showSummary && summary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">批量质检汇总报告</h3>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">总文章</p>
                <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
              </div>
              <div className="bg-green-50 rounded-lg border border-green-200 p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">✅ 通过</p>
                <p className="text-3xl font-bold text-green-600">{summary.passed}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">⚠️ 警告</p>
                <p className="text-3xl font-bold text-yellow-600">{summary.warning}</p>
              </div>
              <div className="bg-red-50 rounded-lg border border-red-200 p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">❌ 不通过</p>
                <p className="text-3xl font-bold text-red-600">{summary.failed}</p>
              </div>
            </div>

            {summary.priorityFixes && summary.priorityFixes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">建议优先修改：</h4>
                <div className="space-y-2">
                  {summary.priorityFixes.map((article: any, idx: number) => (
                    <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="font-medium text-gray-900">{idx + 1}. {article.title}</p>
                      <p className="text-sm text-red-600 mt-1">
                        {article.criticalIssues?.join('、') || '需要修改'}
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
                alert('导出功能开发中');
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

// ============================================================
// Tab 2: 写作（垂直布局，4个功能区）
// ============================================================

function WriteTab() {
  const [topic, setTopic] = useState('');
  const [topicResult, setTopicResult] = useState<any>(null);
  const [article, setArticle] = useState('');
  const [titles, setTitles] = useState<any[]>([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [qualityResult, setQualityResult] = useState<any>(null);

  // 功能1：选题过滤
  const handleTopicFilter = async () => {
    if (!topic.trim()) return;

    // 模拟选题过滤结果
    setTopicResult({
      category: '核心工具类',
      timeliness: '热点期',
      worthWriting: true,
      avgReads: 1798,
      suggestion: '✅ A级选题，建议快速写作'
    });
  };

  // 功能2：开始写作
  const handleGenerateArticle = async () => {
    if (!topic.trim()) return;

    setArticle(`# ${selectedTitle || topic}\n\n这是AI生成的文章内容...\n\n（完整文章内容）`);
  };

  // 功能3：生成标题
  const handleGenerateTitles = async () => {
    if (!topic.trim()) return;

    setTitles([
      { title: `老金用${topic}半年才知道，原来一直少装了这个神器`, formula: '工具推荐型', score: 85 },
      { title: `${topic}开始限制了？手把手教你怎么过`, formula: '痛点解决型', score: 78 },
      { title: `${topic}这个功能真的绝了，一键搞定所有问题`, formula: '效率承诺型', score: 72 },
      { title: `试了下${topic}，没想到这么惊艳`, formula: '惊喜发现型', score: 68 },
      { title: `${topic}更新了，这3个新功能必须知道`, formula: '版本解读型', score: 65 },
    ]);
  };

  // 功能4：质量检测
  const handleQualityCheck = async () => {
    if (!article.trim()) return;

    try {
      const res = await fetch('/api/quality/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: article })
      });

      const data = await res.json();

      if (data.success) {
        setQualityResult(data.data);
      }
    } catch (error) {
      alert('质检失败');
    }
  };

  return (
    <div className="space-y-6">
      {/* 功能区1：选题过滤 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 步骤1：选题过滤</h3>
        <div className="flex gap-3 mb-4">
          <Input
            placeholder="输入选题，例如：Claude更新、Cursor教程、AI写作技巧..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleTopicFilter} disabled={!topic.trim()}>
            判断可行性
          </Button>
        </div>

        {topicResult && (
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">分类：</span>
                <span className="text-blue-700">{topicResult.category}</span>
              </div>
              <div>
                <span className="font-medium">时效性：</span>
                <span className="text-blue-700">{topicResult.timeliness}</span>
              </div>
              <div>
                <span className="font-medium">历史平均阅读：</span>
                <span className="text-blue-700">{topicResult.avgReads}</span>
              </div>
              <div>
                <span className="font-medium">建议：</span>
                <span className="text-blue-700">{topicResult.suggestion}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 功能区2：生成标题 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📝 步骤2：生成标题</h3>
        <Button onClick={handleGenerateTitles} disabled={!topic.trim()} className="mb-4">
          生成5个爆款标题
        </Button>

        {titles.length > 0 && (
          <div className="space-y-3">
            {titles.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedTitle(item.title)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTitle === item.title
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-1">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.formula} · SEO {item.score}分</p>
                  </div>
                  {idx === 0 && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">推荐</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 功能区3：开始写作 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">✍️ 步骤3：编辑文章</h3>
        <div className="mb-4">
          <Button onClick={handleGenerateArticle} disabled={!selectedTitle && !topic.trim()}>
            一键生成文章
          </Button>
        </div>

        <textarea
          value={article}
          onChange={(e) => setArticle(e.target.value)}
          className="w-full h-96 p-4 border border-gray-200 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="点击上方按钮生成文章，或手动编辑..."
        />
      </div>

      {/* 功能区4：质量检测 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">✅ 步骤4：质量检测</h3>
        <div className="mb-4">
          <Button onClick={handleQualityCheck} disabled={!article.trim()}>
            开始检测
          </Button>
        </div>

        {qualityResult && (
          <div className="space-y-4">
            {/* 总分 */}
            <div className={`rounded-lg p-6 text-center ${qualityResult.isPassed ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
              <p className="text-sm text-gray-600 mb-2">综合评分</p>
              <p className="text-5xl font-bold mb-2">
                {qualityResult.totalScore}
                <span className="text-xl text-gray-500">/100</span>
              </p>
              <p className={`text-lg font-semibold ${qualityResult.isPassed ? 'text-green-700' : 'text-yellow-700'}`}>
                {qualityResult.isPassed ? '✅ 质检通过，可以发布' : '⚠️ 建议修改后再发布'}
              </p>
            </div>

            {/* 9维度评分 */}
            <div className="grid grid-cols-3 gap-3">
              <ScoreCard label="AI腔" score={qualityResult.scores.ai_tone} threshold={20} reverse />
              <ScoreCard label="自然度" score={qualityResult.scores.naturalness} threshold={80} />
              <ScoreCard label="真诚度" score={qualityResult.scores.sincerity} threshold={75} />
              <ScoreCard label="啰嗦度" score={qualityResult.scores.verbosity} threshold={25} reverse />
              <ScoreCard label="重复度" score={qualityResult.scores.repetition} threshold={15} reverse />
              <ScoreCard label="可读性" score={qualityResult.scores.readability} threshold={85} />
              <ScoreCard label="人味儿" score={qualityResult.scores.humanity} threshold={70} />
              <ScoreCard label="情感" score={qualityResult.scores.emotion} threshold={75} />
              <ScoreCard label="脏话" score={qualityResult.scores.profanity} threshold={0} isCount />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              {qualityResult.isPassed ? (
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => alert('保存功能开发中')}>
                  ✅ 保存并发布
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="flex-1">
                    修改文章
                  </Button>
                  <Button className="flex-1 bg-yellow-600 hover:bg-yellow-700" onClick={() => alert('保存功能开发中')}>
                    ⚠️ 仍要发布
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 评分卡片组件
function ScoreCard({
  label,
  score,
  threshold,
  reverse = false,
  isCount = false
}: {
  label: string;
  score: number;
  threshold: number;
  reverse?: boolean;
  isCount?: boolean;
}) {
  const isPassed = reverse ? score <= threshold : score >= threshold;

  return (
    <div className={`p-3 rounded-lg border ${isPassed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
      <p className="text-xs text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold">
        {score}{isCount ? '处' : '分'}
      </p>
      <p className="text-xs text-gray-500">
        {reverse ? '≤' : '≥'}{threshold}{isCount ? '处' : '分'}
        {isPassed ? ' ✅' : ' ❌'}
      </p>
    </div>
  );
}
