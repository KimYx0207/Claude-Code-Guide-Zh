/**
 * 保存文章API - 真实实现
 * 按照文件命名规范保存到articles/drafts目录
 *
 * 命名规范：YYYY-MM-DD_[分类]_[时效]_[品牌]_标题.md
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// 提取标题中的品牌词
function extractBrand(title: string, topic: string): string {
  const brands = [
    'Kimi', '月之暗面',
    'Claude', 'Anthropic',
    'Cursor',
    'Gemini', 'Google',
    'ChatGPT', 'GPT', 'OpenAI',
    'Codex',
    'ByteDance', '即梦',
    'DeepSeek', '深度求索',
    '字节', '腾讯', '百度', '阿里'
  ];

  const combinedText = title + ' ' + topic;

  for (const brand of brands) {
    if (combinedText.includes(brand)) {
      return brand;
    }
  }

  return '通用';
}

// 判断时效性
function detectTimeliness(title: string, topic: string): string {
  const hotKeywords = [
    '发布', '上线', '更新', '版本', '估值', '融资',
    '新产品', '新功能', '最新', '刚刚', '今天', '本周',
    '突然', '紧急', '速报', '快讯'
  ];

  const combinedText = title + ' ' + topic;

  for (const keyword of hotKeywords) {
    if (combinedText.includes(keyword)) {
      return '热点';
    }
  }

  return '常青';
}

// 判断分类
function detectCategory(title: string, topic: string, brand: string): string {
  const coreTools = [
    'Kimi', '月之暗面',
    'Claude', 'Anthropic',
    'Cursor',
    'Gemini', 'Google',
    'ChatGPT', 'GPT', 'OpenAI',
    'Codex',
    'ByteDance', '即梦'
  ];

  if (coreTools.includes(brand)) {
    return '核心';
  }

  return '泛AI';
}

// 生成符合规范的文件名
function generateFileName(title: string, topic: string): string {
  // 当前日期
  const date = new Date().toISOString().split('T')[0];  // YYYY-MM-DD

  // 提取品牌词
  const brand = extractBrand(title, topic);

  // 判断时效性
  const timeliness = detectTimeliness(title, topic);

  // 判断分类
  const category = detectCategory(title, topic, brand);

  // 清理标题（去掉特殊字符）
  const cleanTitle = title
    .replace(/[\/\\:*?"<>|]/g, '')  // 去掉文件系统不支持的字符
    .replace(/\s+/g, '')  // 去掉所有空格
    .trim();

  // 组装文件名
  const fileName = `${date}_${category}_${timeliness}_${brand}_${cleanTitle}.md`;

  return fileName;
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, topic, status = 'draft' } = await request.json();

    if (!title || !content) {
      return NextResponse.json({
        success: false,
        error: '请提供标题和内容'
      }, { status: 400 });
    }

    const projectRoot = path.join(process.cwd(), '..', '..');

    // 生成符合规范的文件名
    const fileName = generateFileName(title, topic || title);

    // 确定保存目录
    const saveDir = status === 'published'
      ? path.join(projectRoot, 'articles', 'published')
      : path.join(projectRoot, 'articles', 'drafts');

    // 确保目录存在
    await fs.mkdir(saveDir, { recursive: true });

    // 完整文件路径
    const filePath = path.join(saveDir, fileName);

    // 检查文件是否已存在
    try {
      await fs.access(filePath);
      return NextResponse.json({
        success: false,
        error: `文件已存在：${fileName}`,
        hint: '请修改标题或删除已存在的文件'
      }, { status: 409 });
    } catch {
      // 文件不存在，可以保存
    }

    // 组装文章内容（不包含标题，因为标题已在文件名中）
    const articleContent = content.startsWith('#') ? content : `# ${title}\n\n${content}`;

    // 保存文件
    await fs.writeFile(filePath, articleContent, 'utf-8');

    console.log(`文章已保存：${fileName}`);

    return NextResponse.json({
      success: true,
      message: '文章保存成功',
      data: {
        fileName,
        filePath: path.relative(projectRoot, filePath),
        status,
        size: Buffer.byteLength(articleContent, 'utf-8'),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('保存文章API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '保存文章失败',
      details: error.stack
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: '请使用POST方法保存文章'
  }, { status: 405 });
}
