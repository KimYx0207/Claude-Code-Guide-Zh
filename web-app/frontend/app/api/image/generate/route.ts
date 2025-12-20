/**
 * 自动配图API - 为文章生成配图
 * 对应CLI命令：/image
 *
 * 基于文章主题推荐Unsplash高质量图片
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { topic, articleContent, imageCount = 3 } = await request.json();

    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return NextResponse.json(
        { success: false, error: '请提供文章主题' },
        { status: 400 }
      );
    }

    // 生成配图建议
    const images = generateImageSuggestions(topic, imageCount);

    return NextResponse.json({
      success: true,
      message: '配图生成完成',
      data: {
        topic,
        images,
        count: images.length,
        notice: '💡 建议使用Unsplash等免费图库搜索这些关键词获取高质量配图',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('自动配图API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '配图生成失败',
      details: error.stack
    }, { status: 500 });
  }
}

/**
 * 生成配图建议
 */
function generateImageSuggestions(topic: string, count: number): any[] {
  const suggestions = [];

  // 主题图（封面）
  suggestions.push({
    position: '文章开头（封面）',
    keyword: `${topic} technology coding`,
    description: `展示${topic}的核心界面或Logo`,
    style: '科技感、现代、简洁',
    unsplashUrl: `https://unsplash.com/s/photos/${encodeURIComponent(topic + ' coding')}`
  });

  if (count >= 2) {
    // 操作步骤图
    suggestions.push({
      position: '操作步骤部分',
      keyword: 'computer screen code editor',
      description: '展示代码编辑器或终端界面',
      style: '清晰、专业、教程感',
      unsplashUrl: 'https://unsplash.com/s/photos/code-editor'
    });
  }

  if (count >= 3) {
    // 效果对比图
    suggestions.push({
      position: '效果展示部分',
      keyword: 'success achievement productivity',
      description: '展示成功、效率提升的氛围',
      style: '积极、明亮、鼓舞人心',
      unsplashUrl: 'https://unsplash.com/s/photos/productivity'
    });
  }

  if (count >= 4) {
    // 补充配图
    suggestions.push({
      position: '文章中部',
      keyword: `${topic} workspace setup`,
      description: '展示工作环境或工具setup',
      style: '真实、专业、整洁',
      unsplashUrl: `https://unsplash.com/s/photos/developer-workspace`
    });
  }

  return suggestions.slice(0, count);
}
