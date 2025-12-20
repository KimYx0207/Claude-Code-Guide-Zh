/**
 * 获取文章内容API
 * 用于编辑文章时加载内容
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json();

    if (!articleId) {
      return NextResponse.json({
        success: false,
        error: '请提供articleId'
      }, { status: 400 });
    }

    const projectRoot = path.join(process.cwd(), '..', '..');

    // 尝试在drafts和published目录查找
    const draftPath = path.join(projectRoot, 'articles', 'drafts', articleId);
    const publishedPath = path.join(projectRoot, 'articles', 'published', articleId);

    let filePath = '';
    let status = '';

    try {
      await fs.access(draftPath);
      filePath = draftPath;
      status = 'draft';
    } catch {
      try {
        await fs.access(publishedPath);
        filePath = publishedPath;
        status = 'published';
      } catch {
        return NextResponse.json({
          success: false,
          error: `文章不存在：${articleId}`
        }, { status: 404 });
      }
    }

    // 读取文章内容
    const content = await fs.readFile(filePath, 'utf-8');

    // 解析标题（第一行）
    const lines = content.split('\n');
    const title = lines[0].replace(/^#\s*/, '').trim();

    return NextResponse.json({
      success: true,
      data: {
        articleId,
        title,
        content,
        status,
        words: content.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('获取文章内容API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '获取文章内容失败'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: '请使用POST方法获取文章内容'
  }, { status: 405 });
}
