/**
 * 选题过滤API V9.0 - 三层架构版
 * 调用Python脚本：topic_filter.py
 * 三层架构 + 优先级公式 + 配置驱动
 */

import { NextRequest, NextResponse } from 'next/server';
import { executePythonScript, handleApiError } from '@/lib/api-response';

// 类型定义
interface TopicFilterResult {
  success: boolean;
  data?: {
    topic: string;
    // 三层架构
    layer: 'layer1' | 'layer2' | 'layer3' | 'rejected';
    layerName: string;
    priorityScore: number;
    worthWriting: boolean;
    // 工具/品牌信息
    matchedTool: string | null;
    toolTier: 'S' | 'A' | 'B' | null;
    avgReadsEstimate: number;
    // 分类信息
    topicTypes: string[];
    timeliness: string;
    riskLevel: 'low' | 'medium' | 'high';
    // 策略建议
    strategy: string;
    deadlineHint: string;
    // 分析
    insights: string[];
    scoreBreakdown: {
      layerBase: number;
      timelinessBoost: number;
      typeWeight: number;
      brandBoost: number;
      riskFactor: number;
    };
    // 推荐
    recommendation: string;
    boomPotential: '强烈推荐' | '推荐' | '可写' | '不推荐';
    timestamp: string;
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<TopicFilterResult>> {
  try {
    const { topic, context } = await request.json();

    if (!topic || topic.trim() === '') {
      return NextResponse.json({
        success: false,
        error: '请提供选题'
      }, { status: 400 });
    }

    // 构建命令行参数
    const args = [topic];
    if (context) {
      args.push(context);
    }

    // 执行Python脚本
    const result = await executePythonScript({
      scriptName: 'topic_filter.py',
      args,
      timeout: 15000
    });

    const output = result.stdout;

    // ============== 解析输出格式 ==============

    // 解析判断结果
    const worthWritingMatch = output.match(/[✅❌] 判断：(?:值得写|不建议)（([\d.]+)分）/);
    const priorityScore = worthWritingMatch ? parseFloat(worthWritingMatch[1]) : 0;
    const worthWriting = output.includes('✅ 判断：值得写');

    // 解析Layer层级
    const layerMatch = output.match(/🏷️ Layer: (LAYER\d|REJECTED) \(([^)]+)\)/);
    const layer = layerMatch ? layerMatch[1].toLowerCase().replace('layer', 'layer') as 'layer1' | 'layer2' | 'layer3' | 'rejected' : 'layer3';
    const layerName = layerMatch ? layerMatch[2] : '泛AI话题';

    // 解析关联工具
    const toolMatch = output.match(/🔧 关联工具: ([^(]+)\(([SBA])级\)/);
    const matchedTool = toolMatch ? toolMatch[1].trim() : null;
    const toolTier = toolMatch ? toolMatch[2] as 'S' | 'A' | 'B' : null;

    // 解析历史平均阅读
    const readsMatch = output.match(/📊 历史平均阅读: (\d+)/);
    const avgReadsEstimate = readsMatch ? parseInt(readsMatch[1]) : 908;

    // 解析选题类型（可多选）
    const typesMatch = output.match(/📂 类型: (.+)/);
    const topicTypes = typesMatch
      ? typesMatch[1].split(' + ').map(t => t.replace(/[🔥🛠️📚💸🔧📊📌]/g, '').trim())
      : ['通用型'];

    // 解析时效性
    const timelinessMatch = output.match(/⏰ 时效: [🔴🟡🟢⚪](.+)/);
    const timeliness = timelinessMatch ? timelinessMatch[1].trim() : '常青内容';

    // 解析风险等级
    const riskMatch = output.match(/⚡ 风险: ([✅⚠️🚨])([^，\n]+)/);
    const riskText = riskMatch ? riskMatch[2].trim() : '高风险';
    const riskLevel: 'low' | 'medium' | 'high' =
      riskText.includes('低') ? 'low' :
      riskText.includes('中') ? 'medium' : 'high';

    // 解析策略
    const strategyMatch = output.match(/📋 策略：(.+)/);
    const strategy = strategyMatch ? strategyMatch[1].trim() : '';

    // 解析时间建议
    const deadlineMatch = output.match(/⏰ 时间：(.+)/);
    const deadlineHint = deadlineMatch ? deadlineMatch[1].trim() : '可打磨';

    // 解析预估阅读
    const estimateMatch = output.match(/📈 预估阅读：(\d+)/);
    const estimatedReads = estimateMatch ? parseInt(estimateMatch[1]) : avgReadsEstimate;

    // 解析分数拆解
    const scoreBreakdown = {
      layerBase: 0,
      timelinessBoost: 1.0,
      typeWeight: 1.0,
      brandBoost: 1.0,
      riskFactor: 1.0
    };

    const layerBaseMatch = output.match(/Layer基础分: (\d+)/);
    if (layerBaseMatch) scoreBreakdown.layerBase = parseInt(layerBaseMatch[1]);

    const timelinessBoostMatch = output.match(/× 时效性加成: ([\d.]+)/);
    if (timelinessBoostMatch) scoreBreakdown.timelinessBoost = parseFloat(timelinessBoostMatch[1]);

    const typeWeightMatch = output.match(/× 类型权重: ([\d.]+)/);
    if (typeWeightMatch) scoreBreakdown.typeWeight = parseFloat(typeWeightMatch[1]);

    const brandBoostMatch = output.match(/× 品牌加成: ([\d.]+)/);
    if (brandBoostMatch) scoreBreakdown.brandBoost = parseFloat(brandBoostMatch[1]);

    const riskFactorMatch = output.match(/÷ 风险系数: ([\d.]+)/);
    if (riskFactorMatch) scoreBreakdown.riskFactor = parseFloat(riskFactorMatch[1]);

    // 提取分析洞察
    const insights: string[] = [];
    const insightPattern = /  (🏷️|🔧|📊|📂|⏰|⚡|🎯).+/g;
    const insightMatches = output.matchAll(insightPattern);
    for (const match of insightMatches) {
      insights.push(match[0].trim());
    }

    // 生成推荐
    let recommendation: string;
    let boomPotential: '强烈推荐' | '推荐' | '可写' | '不推荐';

    if (priorityScore >= 200) {
      recommendation = '强烈推荐写作，爆款潜力极高！';
      boomPotential = '强烈推荐';
    } else if (priorityScore >= 100) {
      recommendation = '推荐写作，有爆款潜力';
      boomPotential = '推荐';
    } else if (priorityScore >= 40) {
      recommendation = '可以写作，需要找好角度';
      boomPotential = '可写';
    } else {
      recommendation = '不建议写作，风险过高';
      boomPotential = '不推荐';
    }

    return NextResponse.json({
      success: true,
      data: {
        topic,
        // 三层架构
        layer,
        layerName,
        priorityScore,
        worthWriting,
        // 工具/品牌信息
        matchedTool,
        toolTier,
        avgReadsEstimate: estimatedReads,
        // 分类信息
        topicTypes,
        timeliness,
        riskLevel,
        // 策略建议
        strategy,
        deadlineHint,
        // 分析
        insights,
        scoreBreakdown,
        // 推荐
        recommendation,
        boomPotential,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    return handleApiError(error, '选题过滤');
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: false,
    error: '请使用POST方法并提供选题',
    hint: 'POST body: { "topic": "选题描述", "context": "额外上下文(可选)" }',
    version: 'V9.0 三层架构版'
  }, { status: 405 });
}
