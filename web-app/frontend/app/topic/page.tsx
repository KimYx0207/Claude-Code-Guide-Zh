"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function TopicPage() {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFilter = async () => {
    if (!topic.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/topic/filter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (data.success) {
        // Mock结果
        setResult({
          category: '核心工具类',
          score: 85,
          avgReads: 2118,
          recommendation: '推荐写作',
          reasons: [
            '包含核心品牌词：Claude',
            '历史平均阅读量高（2118）',
            '属于核心工具类，流量稳定'
          ]
        });
      }
    } catch (error) {
      console.error('过滤失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 text-sm font-medium">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">选题过滤</h1>
          <p className="text-gray-600">V3双轨制选题评估 · 基于82篇数据</p>
        </div>

        <div className="card p-8 mb-6">
          <Input
            placeholder="输入选题（如：Claude Code使用技巧）"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
            className="mb-4"
          />
          <Button onClick={handleFilter} disabled={loading || !topic.trim()} className="w-full">
            {loading ? '评估中...' : '评估选题'}
          </Button>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">评估结果</h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  result.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {result.recommendation}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 mb-1">分类</p>
                  <p className="text-xl font-bold text-gray-900">{result.category}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 mb-1">综合评分</p>
                  <p className="text-xl font-bold text-gray-900">{result.score}分</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 col-span-2">
                  <p className="text-sm text-gray-600 mb-1">预估阅读量</p>
                  <p className="text-xl font-bold text-gray-900">{result.avgReads.toLocaleString()}</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">推荐理由</h3>
                <ul className="space-y-2">
                  {result.reasons.map((reason: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {result.score >= 70 && (
              <div className="text-center">
                <Button onClick={() => window.location.href = `/write?topic=${encodeURIComponent(topic)}`}>
                  开始写作
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
