"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 动态导入Monaco Editor（仅客户端）
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
      <p className="text-gray-500">编辑器加载中...</p>
    </div>
  )
});


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TabView = 'home' | 'hotspot' | 'write' | 'data' | 'docs' | 'help';

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

          {/* 5个Tab切换 */}
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
              onClick={() => setCurrentTab('hotspot')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'hotspot'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔥 热点扫描
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
            <button
              onClick={() => setCurrentTab('data')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'data'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 数据分析
            </button>
            <button
              onClick={() => setCurrentTab('docs')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'docs'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📚 教程资料
            </button>            <button
              onClick={() => setCurrentTab('help')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'help'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🆘 帮助中心
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentTab === 'home' && <HomeTab />}
        {currentTab === 'hotspot' && <HotspotTab />}
        {currentTab === 'write' && <WriteTab setCurrentTab={setCurrentTab} />}
        {currentTab === 'data' && <DataTab />}
        {currentTab === 'docs' && <DocsTab />}
        {currentTab === 'help' && <HelpTab />}
      </main>
    </div>
  );
}

// ============================================================
// Tab 1: 首页（数据看板+文章管理）
// ============================================================

function HomeTab() {
  const [articles, setArticles] = useState<any[]>([]);
  const [articleSubTab, setArticleSubTab] = useState<'draft' | 'published'>('draft');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 加载真实文章列表
  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/articles/list');
      const data = await res.json();

      if (data.success) {
        setArticles(data.data.articles);
      }
    } catch (error) {
      console.error('加载文章列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 过滤文章（根据子Tab）
  const filteredArticles = articles.filter(a => a.status === articleSubTab);

  const handleSelectAll = () => {
    if (selected.size === filteredArticles.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredArticles.map(a => a.id)));
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
                checked={selected.size === filteredArticles.length && filteredArticles.length > 0}
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

        {/* 2个子Tab：已发布/草稿 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setArticleSubTab('draft')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              articleSubTab === 'draft'
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            📝 草稿 ({articles.filter(a => a.status === 'draft').length})
          </button>
          <button
            onClick={() => setArticleSubTab('published')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              articleSubTab === 'published'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ✅ 已发布 ({articles.filter(a => a.status === 'published').length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredArticles.map((article) => (
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
                    <span className={article.status === 'published' ? 'text-green-600' : 'text-yellow-600'}>
                      {article.status === 'published' ? '✅ 已发布' : '📝 草稿'}
                    </span>
                    <span>·</span>
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.words}字</span>
                    {article.category && (
                      <>
                        <span>·</span>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs">
                          {article.category}
                        </span>
                      </>
                    )}
                    {article.brand && (
                      <>
                        <span>·</span>
                        <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-xs">
                          {article.brand}
                        </span>
                      </>
                    )}
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
        )}

        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500">
              {articleSubTab === 'draft' ? '暂无草稿文章' : '暂无已发布文章'}
            </p>
          </div>
        )}
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

function WriteTab({ setCurrentTab }: { setCurrentTab: (tab: TabView) => void }) {
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

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <MonacoEditor
            height="400px"
            defaultLanguage="markdown"
            value={article}
            onChange={(value) => setArticle(value || '')}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
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

// ============================================================
// Tab 3: 热点扫描
// ============================================================

function HotspotTab() {
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanDate, setScanDate] = useState('');

  const handleScan = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/hotspot/scan');
      const data = await res.json();

      if (data.success) {
        setHotspots(data.data.hotspots);
        setScanDate(data.data.scanDate);
      }
    } catch (error) {
      alert('扫描失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">🔥 AI热点扫描</h2>
          <p className="text-sm text-gray-500 mt-1">
            自动抓取今日AI热点，评估爆款潜力
          </p>
        </div>
        <Button onClick={handleScan} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
          {loading ? '扫描中...' : '🔍 扫描今日AI热点'}
        </Button>
      </div>

      {scanDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            📅 扫描时间：{scanDate} | 共找到 <strong>{hotspots.length}</strong> 条热点
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-2"></div>
          <p className="text-gray-500">正在扫描热点...</p>
        </div>
      )}

      {!loading && hotspots.length > 0 && (
        <div className="space-y-4">
          {hotspots.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-3xl">
                  {item.score >= 4 ? '🔥🔥🔥' : item.score >= 3 ? '🔥🔥' : '🔥'}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-gray-600">来源：</span>
                      <span className="text-gray-900 font-medium">{item.source}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">时效性：</span>
                      <span className={`font-medium ${item.timeliness === '今日' ? 'text-red-600' : 'text-orange-600'}`}>
                        {item.timeliness}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">核心工具池：</span>
                      <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-xs font-medium">
                        {item.tool}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">爆款指数：</span>
                      <span className="font-bold text-orange-600">
                        {'⭐'.repeat(item.score)}
                      </span>
                    </div>
                  </div>

                  {item.reason && (
                    <div className="bg-yellow-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700">
                        <strong>推荐理由：</strong>{item.reason}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        // TODO: 跳转到写作Tab并预填主题
                        alert('一键写作功能开发中');
                      }}
                    >
                      ✍️ 一键写作
                    </Button>
                    <Button variant="outline">查看原文</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && hotspots.length === 0 && scanDate && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">今日暂无热点</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Tab 4: 数据分析
// ============================================================

function DataTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/data/stats');
      const data = await res.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-gray-500">加载数据中...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">数据加载失败</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">📊 数据分析报告</h2>

      {/* 总体统计 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">总体统计</h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">总文章</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}篇</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">爆款率</p>
            <p className="text-3xl font-bold text-blue-600">{stats.explosionRate}%</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">平均阅读</p>
            <p className="text-3xl font-bold text-green-600">{stats.avgReads}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">核心工具类</p>
            <p className="text-3xl font-bold text-purple-600">{stats.coreToolAvg}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-sm text-gray-600 mb-1">泛AI话题类</p>
            <p className="text-3xl font-bold text-orange-600">{stats.generalAiAvg}</p>
          </div>
        </div>
      </div>

      {/* 爆款公式效果 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">爆款公式效果（82篇数据验证）</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="space-y-3">
            {stats.formulas.map((formula: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700">{formula.name}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                      <div
                        className={`h-full rounded-full flex items-center justify-end px-3 text-white text-sm font-bold ${
                          formula.effectiveness >= 2 ? 'bg-red-600' :
                          formula.effectiveness >= 1.5 ? 'bg-orange-500' :
                          formula.effectiveness >= 1 ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}
                        style={{ width: `${Math.min(formula.effectiveness * 20, 100)}%` }}
                      >
                        {formula.effectiveness.toFixed(2)}x
                      </div>
                    </div>
                    <div className="w-24 text-sm text-gray-600">
                      {formula.hitRate.toFixed(1)}% 命中
                    </div>
                  </div>
                </div>
                {formula.status && (
                  <div className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                    {formula.status}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              * 效果值 = (命中时平均阅读) / (未命中时平均阅读)
            </p>
          </div>
        </div>
      </div>

      {/* 品牌词统计 */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">核心工具池品牌词统计</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-4">
            {stats.brands.slice(0, 6).map((brand: any, idx: number) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{brand.name}</span>
                  <span className="text-2xl font-bold text-blue-600">{brand.count}</span>
                </div>
                <div className="text-xs text-gray-600">
                  平均阅读：<span className="font-semibold">{brand.avgReads}</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full"
                    style={{ width: `${(brand.count / stats.brands[0].count) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Tab 5: 教程资料
// ============================================================

function DocsTab() {
  const [docTree, setDocTree] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    loadDocTree();
  }, []);

  const loadDocTree = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/docs/list');
      const data = await res.json();

      if (data.success) {
        setDocTree(data.data.tree);
      }
    } catch (error) {
      console.error('加载文档树失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFileContent = async (filePath: string) => {
    setContentLoading(true);
    try {
      const res = await fetch('/api/docs/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath })
      });
      const data = await res.json();

      if (data.success) {
        setFileContent(data.data.content);
        setSelectedFile(filePath);
      }
    } catch (error) {
      alert('加载文档失败');
    } finally {
      setContentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-gray-500">加载文档树中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">📚 Claude Code 教程资料包</h2>

      <div className="grid grid-cols-12 gap-6">
        {/* 左侧：文档树 */}
        <div className="col-span-4 bg-white rounded-lg border border-gray-200 p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-4">文档目录</h3>
          <div className="space-y-2">
            {docTree.map((folder, idx) => (
              <div key={idx}>
                <div className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">📁</span>
                  {folder.name}
                </div>
                <div className="ml-6 space-y-1">
                  {folder.files.map((file: string, fileIdx: number) => (
                    <button
                      key={fileIdx}
                      onClick={() => loadFileContent(`${folder.path}/${file}`)}
                      className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-blue-50 transition-colors ${
                        selectedFile === `${folder.path}/${file}` ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600'
                      }`}
                    >
                      📄 {file}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：文档内容 */}
        <div className="col-span-8 bg-white rounded-lg border border-gray-200 p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
          {contentLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-500">加载中...</p>
            </div>
          ) : selectedFile ? (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">{selectedFile.split('/').pop()}</h3>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {fileContent}
                </pre>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">请从左侧选择文档查看</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
