import { NextRequest, NextResponse } from 'next/server';

/**
 * 文章翻新API
 * 对应CLI命令：/write-rewrite
 *
 * 功能：将文章彻底改写成看不出原文的老金风格文章
 * 核心策略：
 * 1. 保留核心观点和信息
 * 2. 完全重写表达方式
 * 3. 注入老金风格（口语化、真实感、接地气）
 * 4. 调整结构和案例
 */
export async function POST(request: NextRequest) {
  try {
    const { originalArticle, topic } = await request.json();

    if (!originalArticle || typeof originalArticle !== 'string') {
      return NextResponse.json(
        { success: false, error: '缺少必填参数: originalArticle' },
        { status: 400 }
      );
    }

    // TODO: 真实实现
    // 1. 读取老金风格规范
    // 2. 调用AI进行文章翻新
    // 3. 质量检测
    // 4. 生成新标题

    // 临时模拟数据
    const rewrittenArticle = `# ${topic || '翻新后的文章'}：老金的真实体验

## 写在前面

最近很多朋友问我关于${topic || '这个话题'}的看法，老金自己也深度用了一段时间，今天就来聊聊真实感受。

## 核心发现

### 第一个发现：确实有点东西

刚开始接触的时候，老金也是抱着试试看的心态。但用了几天之后，发现确实有几个点做得挺好的...

（这里是基于原文核心观点，但完全重写的内容）

### 第二个发现：有些小坑要注意

当然，也不是完美的。老金在使用过程中也踩了几个坑...

（这里是原文问题点的重新表述）

### 第三个发现：适合这类人群

用下来，老金觉得如果你是以下几类人群，可以重点关注...

（这里是原文适用场景的重新组织）

## 实战建议

基于老金的使用经验，这里给几个实战建议：

1. **建议1**：具体操作方法...
2. **建议2**：注意事项...
3. **建议3**：进阶技巧...

## 老金点评

总的来说，${topic || '这个东西'}还是值得一试的。但记住，工具只是工具，关键还是要结合自己的实际需求。

如果你也在用，欢迎留言交流使用心得！

---
**关注老金，持续分享真实的AI工具体验！**`;

    const newTitles = [
      {
        title: `${topic}用了一周，老金发现了这3个隐藏功能`,
        formula: '工具推荐型',
        score: 85
      },
      {
        title: `关于${topic}，老金有话要说`,
        formula: '个人观点型',
        score: 72
      },
      {
        title: `${topic}踩坑指南：这些错误不要犯`,
        formula: '痛点解决型',
        score: 78
      }
    ];

    const qualityScore = {
      totalScore: 80,
      isPassed: true,
      scores: {
        ai_tone: 16,
        naturalness: 84,
        sincerity: 78,
        verbosity: 19,
        repetition: 11,
        readability: 87,
        humanity: 76,
        emotion: 77,
        profanity: 0
      }
    };

    const changeReport = {
      structureChanges: [
        '✅ 重新组织了段落结构',
        '✅ 添加了"老金"个人化表述',
        '✅ 增加了实战建议章节'
      ],
      styleChanges: [
        '✅ 转换为口语化表达',
        '✅ 增加真实感细节',
        '✅ 注入老金风格话术'
      ],
      contentChanges: [
        '✅ 保留核心观点',
        '✅ 重写所有表述',
        '✅ 调整案例和场景'
      ],
      similarity: '原文相似度：<15%（达到翻新标准）'
    };

    const result = {
      rewrittenArticle,
      newTitles,
      qualityScore,
      changeReport,
      originalWordCount: originalArticle.split('').length,
      rewrittenWordCount: rewrittenArticle.split('').length,
      message: '文章翻新完成，已注入老金风格'
    };

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('文章翻新失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '服务器错误' },
      { status: 500 }
    );
  }
}
