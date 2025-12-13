import { NextRequest, NextResponse } from 'next/server';

/**
 * 配图生成API
 * 对应CLI命令：/image
 *
 * 功能：自动为文章添加高质量配图
 * 图片来源：Unsplash API
 *
 * 配图规则：
 * 1. 每个二级标题(##)后添加配图
 * 2. 首图：文章开头添加主题相关横幅图
 * 3. 图片尺寸：1200x600 (横幅)、800x600 (内容图)
 * 4. 关键词提取：基于标题和段落内容
 */
export async function POST(request: NextRequest) {
  try {
    const { article, topic } = await request.json();

    if (!article || typeof article !== 'string') {
      return NextResponse.json(
        { success: false, error: '缺少必填参数: article' },
        { status: 400 }
      );
    }

    // TODO: 真实实现
    // 1. 解析文章结构，提取标题
    // 2. 为每个章节生成关键词
    // 3. 调用Unsplash API搜索图片
    // 4. 将图片插入到Markdown中
    // 5. 返回带图片的文章

    // 临时模拟数据
    const headings = article.match(/^##\s+(.+)$/gm) || [];
    const imageCount = headings.length + 1; // 标题数量 + 首图

    const images = [
      {
        position: 'header',
        keyword: topic || 'AI technology',
        url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
        photographer: 'Jonathan Kemper',
        photographerUrl: 'https://unsplash.com/@jupp'
      },
      {
        position: 'section-1',
        keyword: 'productivity',
        url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
        photographer: 'Marvin Meyer',
        photographerUrl: 'https://unsplash.com/@marvelous'
      },
      {
        position: 'section-2',
        keyword: 'technology',
        url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop',
        photographer: 'Luca Bravo',
        photographerUrl: 'https://unsplash.com/@lucabravo'
      }
    ];

    // 在文章中插入图片
    let articleWithImages = article;

    // 添加首图
    articleWithImages = `# ${topic || '文章标题'}\n\n![${topic || 'AI technology'}](${images[0].url})\n*Photo by [${images[0].photographer}](${images[0].photographerUrl}) on Unsplash*\n\n` +
                        article.replace(/^#\s+.+$/m, '');

    // 在每个二级标题后添加配图
    let sectionIndex = 1;
    articleWithImages = articleWithImages.replace(/^##\s+(.+)$/gm, (match, title) => {
      if (sectionIndex < images.length) {
        const img = images[sectionIndex];
        sectionIndex++;
        return `${match}\n\n![${title}](${img.url})\n*Photo by [${img.photographer}](${img.photographerUrl}) on Unsplash*`;
      }
      return match;
    });

    const result = {
      originalArticle: article,
      articleWithImages,
      images,
      imageCount,
      statistics: {
        totalImages: imageCount,
        headerImage: 1,
        sectionImages: headings.length,
        totalSize: '约 2.5 MB'
      },
      message: `成功添加 ${imageCount} 张高质量配图`
    };

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('配图生成失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '服务器错误' },
      { status: 500 }
    );
  }
}
