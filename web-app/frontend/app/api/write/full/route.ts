import { NextRequest, NextResponse } from 'next/server';

/**
 * 完整写作流程API
 * 对应CLI命令：/write
 *
 * 8步流程：
 * 1. 读取爆款规律文档
 * 2. Research（WebSearch/MCP）
 * 3. 自动创作文章
 * 4. 自动生成标题（调用title_generator.py）
 * 5. 质量检测（调用quality_detector.py）
 * 6. 保存文章
 */
export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { success: false, error: '缺少必填参数: topic' },
        { status: 400 }
      );
    }

    // TODO: 真实实现调用Python脚本
    // 临时模拟数据
    const result = {
      step1: { message: '✅ 读取爆款规律文档完成' },
      step2: {
        message: '✅ Research完成',
        sources: [
          { title: '官方文档', url: 'https://example.com/docs' },
          { title: 'Reddit讨论', url: 'https://reddit.com/r/ai' }
        ]
      },
      step3: {
        message: '✅ 文章创作完成',
        article: `# ${topic}深度测评：真的好用吗？

## 前言

最近${topic}火遍了整个AI圈，老金也忍不住深度体验了一番。今天就来跟大家分享一下真实感受。

## 核心功能解析

经过一周的深度使用，我发现${topic}主要有以下3个亮点：

### 1. 功能A：超级实用

具体来说...

### 2. 功能B：效率提升明显

实测下来...

### 3. 功能C：惊喜发现

这个功能真的绝了...

## 实战案例

举个例子，上周老金用${topic}做了一个项目...

## 总结

总的来说，${topic}确实值得一试。如果你也在用，欢迎留言交流！

---
**关注老金，持续分享AI工具实战经验！**`
      },
      step4: {
        message: '✅ 标题生成完成',
        titles: [
          {
            title: `老金用${topic}半年才知道，原来一直少装了这个神器`,
            formula: '工具推荐型',
            seoScore: 85,
            baokanIndex: 5,
            recommended: true
          },
          {
            title: `${topic}开始限制了？手把手教你怎么过`,
            formula: '痛点解决型',
            seoScore: 78,
            baokanIndex: 4
          },
          {
            title: `${topic}这个功能真的绝了，一键搞定所有问题`,
            formula: '效率承诺型',
            seoScore: 72,
            baokanIndex: 4
          },
          {
            title: `试了下${topic}，没想到这么惊艳`,
            formula: '惊喜发现型',
            seoScore: 68,
            baokanIndex: 3
          },
          {
            title: `${topic}更新了，这3个新功能必须知道`,
            formula: '版本解读型',
            seoScore: 65,
            baokanIndex: 3
          }
        ],
        recommendation: {
          title: `老金用${topic}半年才知道，原来一直少装了这个神器`,
          reason: '工具推荐型公式爆款倍数最高(5.25x)，且包含"老金"品牌词和"神器"强力词'
        }
      },
      step5: {
        message: '✅ 质量检测完成',
        qualityScore: {
          totalScore: 82,
          isPassed: true,
          scores: {
            ai_tone: 15,          // AI腔 ≤20分 ✅
            naturalness: 85,      // 自然度 ≥80分 ✅
            sincerity: 80,        // 真诚度 ≥75分 ✅
            verbosity: 18,        // 啰嗦度 ≤25分 ✅
            repetition: 12,       // 重复度 ≤15% ✅
            readability: 88,      // 可读性 ≥85分 ✅
            humanity: 75,         // 人味儿 ≥70分 ✅
            emotion: 78,          // 情感 ≥75分 ✅
            profanity: 0          // 脏话 =0处 ✅
          },
          passedDimensions: 9,
          totalDimensions: 9
        }
      },
      step6: {
        message: '✅ 文章已保存',
        filename: `2025-12-14_核心_热点_${topic}_${topic}深度测评真的好用吗.md`,
        path: 'articles/drafts/'
      }
    };

    return NextResponse.json({
      success: true,
      data: result,
      message: '完整写作流程执行成功'
    });
  } catch (error: any) {
    console.error('完整写作流程失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '服务器错误' },
      { status: 500 }
    );
  }
}
