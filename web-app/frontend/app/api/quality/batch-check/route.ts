/**
 * 批量质检API - Next.js App Router格式
 * 路由：/api/quality/batch-check
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleIds } = body;

    if (!articleIds || articleIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: '必须提供articleIds参数'
      }, { status: 400 });
    }

    // 模拟批量质检结果（开发阶段）
    const mockResults = articleIds.map((id: string, index: number) => ({
      articleId: id,
      title: `文章${index + 1}`,
      totalScore: 70 + Math.random() * 20,
      isPassed: Math.random() > 0.3,
      status: Math.random() > 0.5 ? 'passed' : Math.random() > 0.3 ? 'warning' : 'failed',
      criticalIssues: Math.random() > 0.7 ? ['AI腔过高'] : []
    }));

    const passed = mockResults.filter((r: any) => r.isPassed).length;
    const warning = mockResults.filter((r: any) => !r.isPassed && r.totalScore >= 60).length;
    const failed = mockResults.filter((r: any) => r.totalScore < 60).length;

    const summary = {
      total: articleIds.length,
      passed,
      warning,
      failed,
      results: mockResults,
      priorityFixes: mockResults.filter((r: any) => !r.isPassed).sort((a: any, b: any) => a.totalScore - b.totalScore)
    };

    return NextResponse.json({
      success: true,
      data: summary
    });

  } catch (error: any) {
    console.error('批量质检API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '批量质检失败'
    }, { status: 500 });
  }
}
