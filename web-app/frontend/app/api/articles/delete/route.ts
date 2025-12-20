/**
 * 删除文章API
 * 从articles目录删除指定文章
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { articleId, confirm } = await request.json();

    if (!articleId) {
      return NextResponse.json({
        success: false,
        error: '请提供articleId'
      }, { status: 400 });
    }

    if (!confirm) {
      return NextResponse.json({
        success: false,
        error: '请确认删除操作'
      }, { status: 400 });
    }

    const projectRoot = path.join(process.cwd(), '..', '..');

    // 尝试在drafts和published目录查找
    const draftPath = path.join(projectRoot, 'articles', 'drafts', articleId);
    const publishedPath = path.join(projectRoot, 'articles', 'published', articleId);

    let deletedPath = '';

    try {
      await fs.access(draftPath);
      await fs.unlink(draftPath);
      deletedPath = draftPath;
    } catch {
      try {
        await fs.access(publishedPath);
        await fs.unlink(publishedPath);
        deletedPath = publishedPath;
      } catch {
        return NextResponse.json({
          success: false,
          error: `文章不存在：${articleId}`
        }, { status: 404 });
      }
    }

    console.log(`文章已删除：${articleId}`);

    return NextResponse.json({
      success: true,
      message: '文章删除成功',
      data: {
        articleId,
        deletedPath: path.relative(projectRoot, deletedPath),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('删除文章API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '删除文章失败'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: '请使用POST方法删除文章'
  }, { status: 405 });
}
