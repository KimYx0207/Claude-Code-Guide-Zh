"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get('topic') || '';
  const titleParam = searchParams.get('title') || '';

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (titleParam) {
      setContent(`# ${titleParam}\n\n正在生成文章内容...\n\n（这里是AI生成的内容）`);
    }
  }, [titleParam]);

  const handleSave = () => {
    alert('草稿已保存！');
  };

  const handleQualityCheck = () => {
    // 跳转到写作流程的质检页面（第4步）
    router.push(`/write/quality-check?content=${encodeURIComponent(content)}&topic=${encodeURIComponent(topic)}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href={`/write/select-title?topic=${encodeURIComponent(topic)}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 text-sm font-medium">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            上一步
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">编辑文章</h1>
              <p className="text-gray-600">第3步：编辑和完善内容</p>
            </div>
            <Button variant="outline" onClick={handleSave}>
              保存草稿
            </Button>
          </div>
        </div>

        <div className="card p-6 mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 p-4 border border-gray-200 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="开始编辑文章..."
          />
        </div>

        <div className="flex gap-3">
          <Button onClick={handleQualityCheck} className="flex-1" disabled={!content.trim()}>
            下一步：质量检测
          </Button>
          <Button variant="outline" onClick={handleSave} className="flex-1">
            保存草稿
          </Button>
        </div>

        <div className="mt-6 card p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">写作流程</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">✓ 1. 输入主题</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">✓ 2. 选择标题</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white">3. 编辑文章</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="px-3 py-1 rounded-full bg-gray-200">4. 质量检测</span>
          </div>
        </div>
      </div>
    </div>
  );
}
