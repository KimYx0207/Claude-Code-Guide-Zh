"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

type TitleItem = {
  title: string;
  formula: string;
  seo_score: number;
  baokuan_index: string;
  reason: string;
};

export default function TitlePage() {
  const [topic, setTopic] = useState('');
  const [titles, setTitles] = useState<TitleItem[]>([]);
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
    } catch (error) {
      console.error('生成失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 text-sm font-medium">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">标题生成器</h1>
          <p className="text-gray-600">基于12大公式 · 数据驱动创作</p>
        </div>

        {/* Input Section */}
        <div className="card p-6 md:p-8 mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            输入主题
          </label>
          <Input
            placeholder="例如：Claude Code教程、Cursor 2.2更新、AI写作技巧..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            className="mb-4"
            disabled={loading}
          />
          <Button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="w-full"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI思考中<span className="loading-dots"></span>
              </span>
            ) : (
              '生成5个爆款标题'
            )}
          </Button>
        </div>

        {/* Results */}
        {titles.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                生成结果
              </h2>
              <span className="badge">按爆款指数排序</span>
            </div>

            {titles.map((item, index) => (
              <div key={index} className="card p-6 md:p-8 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                        index === 0 ? 'bg-blue-600' : 'bg-gray-400'
                      }`}>
                        {index + 1}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">
                          推荐
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => copyToClipboard(item.title)}
                    className="flex-shrink-0 p-2 hover:bg-gray-50 rounded transition-colors"
                    title="复制标题"
                  >
                    <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-3 px-4 py-3 rounded bg-gray-50 border border-gray-100">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">公式类型</p>
                      <p className="text-sm font-semibold text-gray-900">{item.formula}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3 rounded bg-gray-50 border border-gray-100">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">SEO评分</p>
                      <p className="text-sm font-semibold text-gray-900">{item.seo_score} 分</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-4 py-3 rounded bg-gray-50 border border-gray-100 md:col-span-2">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium mb-1.5">爆款指数</p>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-gray-900">{item.baokuan_index}</p>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${Math.min(100, (item.baokuan_index?.replace('⭐', '').length || 0) * 20)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded bg-blue-50 border border-blue-100">
                  <p className="text-xs font-semibold text-gray-600 mb-1.5">推荐理由</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 card p-6">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">数据驱动生成</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            标题基于 <span className="font-semibold text-gray-900">82篇真实文章数据</span> 验证的
            <span className="font-semibold text-gray-900"> 12大爆款公式</span> 生成，
            涵盖工具推荐型(5.25x)、效率承诺型(1.68x)、痛点解决型(1.65x) 等高效公式。
          </p>
        </div>
      </div>
    </div>
  );
}
