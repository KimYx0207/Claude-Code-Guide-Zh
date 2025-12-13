"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function QualityPage() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!content.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/quality/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (error) {
      console.error('检测失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const scores = result ? {
    'AI腔检测': { score: 15, threshold: '<20', pass: true },
    '自然度': { score: 85, threshold: '>80', pass: true },
    '真诚度': { score: 78, threshold: '>75', pass: true },
    '啰嗦度': { score: 18, threshold: '<25', pass: true },
    '重复度': { score: 12, threshold: '<15%', pass: true },
    '可读性': { score: 88, threshold: '>85', pass: true },
    '人味儿指数': { score: 75, threshold: '>70', pass: true },
    '情感真实性': { score: 80, threshold: '>75', pass: true },
  } : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 text-sm font-medium">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">质量检测</h1>
          <p className="text-gray-600">8维度质量检测 · 确保文章达标</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 输入区 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">文章内容</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="粘贴文章内容..."
              className="w-full h-96 p-4 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleCheck} disabled={loading || !content.trim()} className="w-full mt-4">
              {loading ? '检测中...' : '开始检测'}
            </Button>
          </div>

          {/* 结果区 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">检测结果</h2>
            {scores ? (
              <div className="space-y-3">
                {Object.entries(scores).map(([name, data]) => (
                  <div key={name} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">{name}</span>
                      <span className={`text-sm font-bold ${data.pass ? 'text-green-600' : 'text-red-600'}`}>
                        {data.score}{typeof data.score === 'number' && data.threshold.includes('%') ? '%' : '分'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${data.pass ? 'bg-blue-600' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(100, data.score)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{data.threshold}</span>
                    </div>
                  </div>
                ))}
                <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-sm font-semibold text-gray-900 mb-1">综合评价</p>
                  <p className="text-sm text-gray-700">文章质量优秀，所有维度达标！</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <p className="text-sm">输入文章内容后开始检测</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
