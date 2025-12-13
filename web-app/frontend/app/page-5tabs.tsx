"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TabView = 'home' | 'hotspot' | 'write' | 'data' | 'docs';

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
              <p className="text-sm text-gray-500">V7.2.1 Web版 · 基于82篇数据验证 · 22个功能</p>
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
            </button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentTab === 'home' && <HomeTab />}
        {currentTab === 'hotspot' && <HotspotTab />}
        {currentTab === 'write' && <WriteTab />}
        {currentTab === 'data' && <DataTab />}
        {currentTab === 'docs' && <DocsTab />}
      </main>
    </div>
  );
}

// [保留原有HomeTab和WriteTab代码...]
// [此处省略，代码太长]
