import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 模拟热点数据（开发阶段）
    const mockHotspots = [
      {
        title: 'Claude发布Sonnet 4.5新模型',
        source: 'Anthropic官方博客',
        timeliness: '今日',
        score: 5,
        tool: 'Claude',
        reason: '核心工具池TOP品牌 + 版本更新热点 + 今日发布，预计阅读量>2000'
      },
      {
        title: 'Cursor 2.2更新Debug Mode功能',
        source: 'Cursor官方推特',
        timeliness: '今日',
        score: 4,
        tool: 'Cursor',
        reason: '核心工具池品牌 + 新功能发布 + 开发者关注度高'
      },
      {
        title: 'Google Gemini Pro API价格下调50%',
        source: 'Google AI官网',
        timeliness: '本周',
        score: 4,
        tool: 'Gemini',
        reason: '核心工具池品牌 + 价格优势 + 影响开发者成本'
      },
      {
        title: 'OpenAI推出GPT-5 Alpha测试',
        source: 'TechCrunch',
        timeliness: '今日',
        score: 3,
        tool: 'ChatGPT',
        reason: '泛AI话题 + 技术突破 + 行业关注度高'
      },
      {
        title: 'Kimi发布长文本处理新算法',
        source: '月之暗面官方',
        timeliness: '昨日',
        score: 5,
        tool: 'Kimi',
        reason: '核心工具池TOP1品牌（历史平均3448阅读）+ 技术创新'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        hotspots: mockHotspots,
        scanDate: new Date().toLocaleString('zh-CN')
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '扫描失败' },
      { status: 500 }
    );
  }
}
