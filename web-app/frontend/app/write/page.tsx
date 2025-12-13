"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function WritePage() {
  const [topic, setTopic] = useState('');
  const router = useRouter();

  const handleStart = () => {
    if (!topic.trim()) return;
    router.push(`/write/select-title?topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 text-sm font-medium">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">开始写作</h1>
          <p className="text-gray-600">第1步：输入主题</p>
        </div>

        <div className="card p-8">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            文章主题
          </label>
          <Input
            placeholder="例如：Claude Code教程、Cursor 2.2更新、AI写作技巧..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleStart()}
            className="mb-6"
          />
          <Button onClick={handleStart} disabled={!topic.trim()} className="w-full">
            下一步：生成标题
          </Button>
        </div>

        <div className="mt-6 card p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">写作流程</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white">1. 输入主题</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="px-3 py-1 rounded-full bg-gray-200">2. 选择标题</span>
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
