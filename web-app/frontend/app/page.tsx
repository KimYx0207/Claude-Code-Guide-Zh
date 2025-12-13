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
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">文章管理</h2>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6">
            <h3 className="font-semibold mb-2">文章标题 {i}</h3>
            <p className="text-sm text-gray-600">草稿 · 2025-12-12 · 3200字</p>
          </div>
        ))}
      </div>
    </div>
  );
}
