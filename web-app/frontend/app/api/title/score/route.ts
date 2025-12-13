import { NextRequest, NextResponse } from 'next/server';

/**
 * 标题评分API
 * 对应CLI命令：/title-score
 *
 * 调用 scripts/core/title_scorer.py
 * 7维度评分：
 * 1. 品牌词（Kimi/Claude/Cursor等）
 * 2. 动作词（试了/用了/装了等）
 * 3. 效率词（一键/半年/3秒等）
 * 4. 问题解决词（怎么/为什么/原来等）
 * 5. 数字（数字和量词）
 * 6. 版本号（v1.0/2.0等）
 * 7. 标题长度（建议18-30字）
 */
export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { success: false, error: '缺少必填参数: title' },
        { status: 400 }
      );
    }

    // TODO: 真实实现调用Python脚本
    // const { exec } = require('child_process');
    // const result = await exec(`python scripts/core/title_scorer.py "${title}"`);

    // 临时模拟数据
    const hasBrand = /Kimi|Claude|Cursor|Gemini|ChatGPT|Copilot/.test(title);
    const hasAction = /试了|用了|装了|测了|发现/.test(title);
    const hasEfficiency = /一键|半年|3秒|瞬间|快速/.test(title);
    const hasProblem = /怎么|为什么|原来|竟然|没想到/.test(title);
    const hasNumber = /\d+|一个|两个|三个|多个/.test(title);
    const hasVersion = /v\d+\.\d+|\d+\.\d+/.test(title);
    const titleLength = title.length;

    const scores = {
      brand: hasBrand ? 20 : 0,
      action: hasAction ? 15 : 0,
      efficiency: hasEfficiency ? 15 : 0,
      problem: hasProblem ? 15 : 0,
      number: hasNumber ? 10 : 0,
      version: hasVersion ? 10 : 0,
      length: titleLength >= 18 && titleLength <= 30 ? 15 : titleLength >= 15 && titleLength <= 35 ? 10 : 5
    };

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const maxScore = 100;

    const level = totalScore >= 80 ? '🏆 爆款潜力' :
                  totalScore >= 60 ? '⭐ 优秀' :
                  totalScore >= 40 ? '✅ 合格' :
                  '⚠️ 需优化';

    const suggestions = [];
    if (!hasBrand) suggestions.push('建议加入核心工具品牌词（如Claude/Cursor/Kimi）');
    if (!hasAction) suggestions.push('建议加入动作词（如"试了"/"用了"）增加真实感');
    if (!hasEfficiency) suggestions.push('建议加入效率词（如"一键"/"3秒"）强化卖点');
    if (!hasProblem) suggestions.push('建议加入问题解决词（如"怎么"/"原来"）激发好奇');
    if (!hasNumber) suggestions.push('建议加入数字（如"3个技巧"）提升具体性');
    if (titleLength < 18) suggestions.push('标题太短，建议扩展到18-30字');
    if (titleLength > 30) suggestions.push('标题太长，建议精简到18-30字');

    const result = {
      title,
      totalScore,
      maxScore,
      level,
      scores: {
        brand: { score: scores.brand, max: 20, passed: hasBrand },
        action: { score: scores.action, max: 15, passed: hasAction },
        efficiency: { score: scores.efficiency, max: 15, passed: hasEfficiency },
        problem: { score: scores.problem, max: 15, passed: hasProblem },
        number: { score: scores.number, max: 10, passed: hasNumber },
        version: { score: scores.version, max: 10, passed: hasVersion },
        length: { score: scores.length, max: 15, current: titleLength, optimal: '18-30字' }
      },
      suggestions,
      formula: hasBrand && hasAction ? '工具推荐型 (5.25x)' :
               hasProblem ? '痛点解决型 (1.65x)' :
               hasEfficiency ? '效率承诺型 (1.68x)' :
               hasBrand ? '品牌词型 (1.59x)' :
               '通用型'
    };

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('标题评分失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '服务器错误' },
      { status: 500 }
    );
  }
}
