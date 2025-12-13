/**
 * 文章列表API
 * 读取articles目录下的真实文章
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

interface Article {
  id: string;
  fileName: string;
  title: string;
  date: string;
  category: string;
  timeliness: string;
  brand: string;
  status: 'published' | 'draft';
  words: number;
  qualityScore: number | null;
}

export async function GET(request: NextRequest) {
  try {
    const projectRoot = path.join(process.cwd(), '..', '..');
    const draftDir = path.join(projectRoot, 'articles', 'drafts');
    const articlesRoot = path.join(projectRoot, 'articles');  // 根目录可能有已发布文章

    const articles: Article[] = [];

    // 读取草稿目录
    try {
      const draftFiles = await fs.readdir(draftDir);
      for (const fileName of draftFiles) {
        if (!fileName.endsWith('.md')) continue;

        const filePath = path.join(draftDir, fileName);
        const stat = await fs.stat(filePath);
        const content = await fs.readFile(filePath, 'utf-8');

        const parsed = parseFileName(fileName);
        articles.push({
          id: fileName,
          fileName,
          title: parsed.title,
          date: parsed.date,
          category: parsed.category,
          timeliness: parsed.timeliness,
          brand: parsed.brand,
          status: 'draft',
          words: content.length,
          qualityScore: null
        });
      }
    } catch (error) {
      console.warn('读取草稿目录失败:', error);
    }

    // 读取根目录（可能有已发布文章）
    try {
      const rootFiles = await fs.readdir(articlesRoot);
      for (const fileName of rootFiles) {
        if (!fileName.endsWith('.md') || fileName === 'README.md') continue;

        const filePath = path.join(articlesRoot, fileName);
        const stat = await fs.stat(filePath);

        // 确保是文件而不是目录
        if (!stat.isFile()) continue;

        const content = await fs.readFile(filePath, 'utf-8');

        const parsed = parseFileName(fileName);
        articles.push({
          id: fileName,
          fileName,
          title: parsed.title,
          date: parsed.date,
          category: parsed.category,
          timeliness: parsed.timeliness,
          brand: parsed.brand,
          status: 'published',  // 根目录视为已发布
          words: content.length,
          qualityScore: null
        });
      }
    } catch (error) {
      console.warn('读取根目录失败:', error);
    }

    // 按日期降序排序
    articles.sort((a, b) => b.date.localeCompare(a.date));

    return NextResponse.json({
      success: true,
      data: {
        total: articles.length,
        drafts: articles.filter(a => a.status === 'draft').length,
        published: articles.filter(a => a.status === 'published').length,
        articles
      }
    });

  } catch (error: any) {
    console.error('文章列表API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '获取文章列表失败'
    }, { status: 500 });
  }
}

/**
 * 解析文件名
 * 格式：YYYY-MM-DD_[分类]_[时效]_[品牌]_标题.md
 */
function parseFileName(fileName: string): {
  date: string;
  category: string;
  timeliness: string;
  brand: string;
  title: string;
} {
  const nameWithoutExt = fileName.replace('.md', '');
  const parts = nameWithoutExt.split('_');

  if (parts.length >= 5) {
    return {
      date: parts[0],
      category: parts[1],
      timeliness: parts[2],
      brand: parts[3],
      title: parts.slice(4).join('_')
    };
  }

  // 降级处理：无法解析的文件名
  return {
    date: '未知',
    category: '未知',
    timeliness: '未知',
    brand: '未知',
    title: fileName
  };
}
