"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type TitleItem = {
  title: string;
  formula: string;
  seo_score: number;
  baokuan_index: string;
  reason: string;
};

export default function SelectTitlePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get('topic') || '';

  const [titles, setTitles] = useState<TitleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topic) {
      loadTitles();
    }
  }, [topic]);

  const loadTitles = async () => {
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

  const handleSelectTitle = (title: string) => {
    router.push(`/write/editor?topic=${encodeURIComponent(topic)}&title=${encodeURIComponent(title)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/write" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 text-sm font-medium">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            上一步
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">选择标题</h1>
          <p className="text-gray-600">第2步：选择最合适的标题</p>
        </div>

        <div className="mb-6 card p-4 bg-blue-50 border-blue-100">
          <p className="text-sm text-gray-700">
            主题：<span className="font-semibold">{topic}</span>
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">AI生成中...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {titles.map((item, index) => (
              <button
                key={index}
                onClick={() => handleSelectTitle(item.title)}
                className="w-full card p-6 text-left hover:shadow-md transition-shadow"
              >
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span>{item.formula}</span>
                  <span>·</span>
                  <span>SEO {item.seo_score}分</span>
                  <span>·</span>
                  <span>{item.baokuan_index}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 card p-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="px-3 py-1 rounded-full bg-gray-200">1. 输入主题</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white">2. 选择标题</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="px-3 py-1 rounded-full bg-gray-200">3. 编辑文章</span>
          </div>
        </div>
      </div>
    </div>
  );
}
