"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface QualityScores {
  ai_tone: number;
  naturalness: number;
  sincerity: number;
  verbosity: number;
  repetition: number;
  readability: number;
  humanity: number;
  emotion: number;
  profanity: number;
}

interface QualityResult {
  scores: QualityScores;
  totalScore: number;
  isPassed: boolean;
  suggestions: string[];
  report: string;
}

export default function QualityCheckPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const articleContent = searchParams.get('content') || '';

  const [result, setResult] = useState<QualityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (articleContent) {
      checkQuality();
    } else {
      setError('缺少文章内容');
      setLoading(false);
    }
  }, [articleContent]);

  const checkQuality = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/quality/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: articleContent })
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || '质检失败');
      }
    } catch (err: any) {
      setError(err.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndPublish = () => {
    // 用户可手动保存或通过/articles页面管理
    router.push('/articles');
  };

  const handleBackToEdit = () => {
    router.back();
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">第4步：质量检测</h1>
          <p className="text-gray-600">9维度自动检测，确保人味儿&gt;70分</p>
        </div>

        {/* 步骤流程指示器 */}
        <div className="mb-8 card p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">写作流程</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">✓ 1. 输入主题</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">✓ 2. 选择标题</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700">✓ 3. 编辑文章</span>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white">4. 质量检测</span>
          </div>
        </div>

        {/* 加载中 */}
        {loading && (
          <div className="card p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">正在进行9维度质量检测...</p>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="card p-6 bg-red-50 border-red-200">
            <p className="text-red-700">❌ {error}</p>
            <Button onClick={handleBackToEdit} className="mt-4">
              返回编辑
            </Button>
          </div>
        )}

        {/* 质检结果 */}
        {result && !loading && (
          <>
            {/* 总分卡片 */}
            <div className={`card p-8 mb-6 ${result.isPassed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">综合评分</p>
                <p className="text-6xl font-bold mb-2">
                  {result.totalScore}
                  <span className="text-2xl text-gray-500">/100</span>
                </p>
                <p className={`text-lg font-semibold ${result.isPassed ? 'text-green-700' : 'text-yellow-700'}`}>
                  {result.isPassed ? '✅ 质检通过，可以发布' : '⚠️ 建议修改后再发布'}
                </p>
              </div>
            </div>

            {/* 9维度评分表 */}
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">9维度详细评分</h3>
              <div className="space-y-3">
                <ScoreItem label="AI腔检测" score={result.scores.ai_tone} threshold={20} reverse />
                <ScoreItem label="自然度" score={result.scores.naturalness} threshold={80} />
                <ScoreItem label="真诚度" score={result.scores.sincerity} threshold={75} />
                <ScoreItem label="啰嗦度" score={result.scores.verbosity} threshold={25} reverse />
                <ScoreItem label="重复度" score={result.scores.repetition} threshold={15} reverse isPercentage />
                <ScoreItem label="可读性" score={result.scores.readability} threshold={85} />
                <ScoreItem label="人味儿指数" score={result.scores.humanity} threshold={70} />
                <ScoreItem label="情感真实性" score={result.scores.emotion} threshold={75} />
                <ScoreItem label="脏话检测" score={result.scores.profanity} threshold={0} isCount />
              </div>
            </div>

            {/* 改进建议 */}
            {result.suggestions && result.suggestions.length > 0 && (
              <div className="card p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 改进建议</h3>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-600 mt-0.5">•</span>
                      <span className="text-gray-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-4">
              {result.isPassed ? (
                <Button onClick={handleSaveAndPublish} className="flex-1 bg-green-600 hover:bg-green-700">
                  ✅ 保存并发布
                </Button>
              ) : (
                <>
                  <Button onClick={handleBackToEdit} variant="outline" className="flex-1">
                    返回编辑
                  </Button>
                  <Button onClick={handleSaveAndPublish} className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                    ⚠️ 仍要发布（不推荐）
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * 单个评分项组件
 */
function ScoreItem({
  label,
  score,
  threshold,
  reverse = false,
  isPercentage = false,
  isCount = false
}: {
  label: string;
  score: number;
  threshold: number;
  reverse?: boolean;
  isPercentage?: boolean;
  isCount?: boolean;
}) {
  const isPassed = reverse
    ? score <= threshold
    : score >= threshold;

  const displayScore = isPercentage
    ? `${score}%`
    : isCount
      ? `${score}处`
      : `${score}分`;

  const displayThreshold = isPercentage
    ? `${threshold}%`
    : isCount
      ? `${threshold}处`
      : `${threshold}分`;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className={`text-sm ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
            {displayScore}
          </span>
          <span className="text-xs text-gray-400">
            / {reverse ? '≤' : '≥'}{displayThreshold}
          </span>
        </div>
        <span className="text-lg">
          {isPassed ? '✅' : '❌'}
        </span>
      </div>
    </div>
  );
}
