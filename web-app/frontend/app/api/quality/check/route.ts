/**
 * 质量检测API - Next.js App Router格式
 * 路由：/api/quality/check
 */

import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    // 开发阶段：直接返回模拟数据（暂不调用Python脚本）
    const mockResult = {
      scores: {
        ai_tone: 15,
        naturalness: 85,
        sincerity: 80,
        verbosity: 20,
        repetition: 10,
        readability: 88,
        humanity: 75,
        emotion: 78,
        profanity: 0
      },
      totalScore: 82,
      isPassed: true,
      suggestions: [
        '文章整体质量优秀',
        '自然度和可读性都达标',
        '保持当前写作风格'
      ],
      report: '质检通过'
    };

    return NextResponse.json({
      success: true,
      data: mockResult
    });

  } catch (error: any) {
    console.error('质检API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '质检失败'
    }, { status: 500 });
  }
}
