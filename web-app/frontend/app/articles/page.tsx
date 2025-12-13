"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function ArticlesPage() {
  const [articles] = useState([
    {
      id: 1,
      title: 'Claude Code教程完整指南',
      category: '核心',
      status: 'draft',
      date: '2025-12-12',
      words: 3200
    },
    {
      id: 2,
      title: 'Cursor 2.2更新Debug Mode来了',
      category: '核心',
      status: 'draft',
      date: '2025-12-12',
      words: 2800
    },
    // Mock数据
  ]);

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">文章管理</h1>
              <p className="text-gray-600">管理草稿和已发布文章</p>
            </div>
            <Link href="/write">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                新建文章
              </button>
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {articles.map((article) => (
            <div key={article.id} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {article.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{article.category}</span>
                    <span>·</span>
                    <span>{article.date}</span>
                    <span>·</span>
                    <span>{article.words.toLocaleString()}字</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors">
                    编辑
                  </button>
                  <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors">
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          共 {articles.length} 篇文章
        </div>
      </div>
    </div>
  );
}
