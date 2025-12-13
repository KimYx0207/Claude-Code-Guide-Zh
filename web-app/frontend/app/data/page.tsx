"use client";

import Link from 'next/link';

export default function DataPage() {
  const stats = {
    totalArticles: 82,
    published: 40,
    drafts: 35,
    avgReads: 1798,
    topBrands: [
      { name: 'Kimi', reads: 3448 },
      { name: 'Gemini', reads: 3146 },
      { name: 'ByteDance', reads: 2927 },
      { name: 'Claude', reads: 2118 },
      { name: 'Cursor', reads: 1246 },
    ],
    topFormulas: [
      { name: '工具推荐型', effectiveness: '5.25x' },
      { name: '效率承诺型', effectiveness: '1.68x' },
      { name: '痛点解决型', effectiveness: '1.65x' },
      { name: '品牌词型', effectiveness: '1.59x' },
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 text-sm font-medium">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">数据看板</h1>
          <p className="text-gray-600">基于82篇真实文章数据</p>
        </div>

        {/* 概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">总文章数</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalArticles}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">已发布</p>
            <p className="text-3xl font-bold text-gray-900">{stats.published}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">草稿</p>
            <p className="text-3xl font-bold text-gray-900">{stats.drafts}</p>
          </div>
          <div className="card p-6">
            <p className="text-sm text-gray-600 mb-1">平均阅读</p>
            <p className="text-3xl font-bold text-gray-900">{stats.avgReads}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 核心品牌TOP5 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">核心品牌 TOP5</h2>
            <div className="space-y-3">
              {stats.topBrands.map((brand, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{brand.name}</span>
                    <span className="text-sm font-bold text-gray-900">{brand.reads.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${(brand.reads / 3448) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 爆款公式效果 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">爆款公式效果</h2>
            <div className="space-y-3">
              {stats.topFormulas.map((formula, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{formula.name}</span>
                    <span className="text-lg font-bold text-blue-600">{formula.effectiveness}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 card p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">数据说明</h3>
          <p className="text-sm text-gray-600">
            数据基于82篇真实文章分析，包含核心工具类（Kimi、Gemini、Claude等）和泛AI话题类。
            核心工具类平均阅读量是泛AI话题的2倍。
          </p>
        </div>
      </div>
    </div>
  );
}
