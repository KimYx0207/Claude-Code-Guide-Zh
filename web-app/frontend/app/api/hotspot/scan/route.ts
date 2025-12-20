/**
 * 热点扫描API V9.0 - 三层架构版
 * 对应CLI命令：/scan
 *
 * V9.0 核心升级：
 * 1. 三层架构：Layer1核心工具官方 > Layer2核心工具生态 > Layer3泛AI话题
 * 2. 优先级公式：priority = layer_score × timeliness × type_weight × brand_tier ÷ risk
 * 3. 生态项目过滤：只推荐与核心工具相关的GitHub项目
 *
 * 数据来源：82篇历史文章分析，21篇爆款验证
 */

import { NextRequest, NextResponse } from 'next/server';

// ============== 配置常量（与core_tools_pool.json同步） ==============

// Layer1 核心工具（71%爆款来源）
const LAYER1_TOOLS: Record<string, {
  keywords: string[];
  tier: 'S' | 'A' | 'B';
  avg_reads: number;
  ecosystem_prefix: string[];
}> = {
  'Claude': {
    keywords: ['claude', 'anthropic', 'claude code', 'claude max', 'opus', 'sonnet'],
    tier: 'S',
    avg_reads: 2118,
    ecosystem_prefix: ['claude-', 'anthropic-', 'mcp-']
  },
  'Cursor': {
    keywords: ['cursor', 'cursor pro', 'cursor ai'],
    tier: 'S',
    avg_reads: 1246,
    ecosystem_prefix: ['cursor-', 'cursorless-']
  },
  'Gemini': {
    keywords: ['gemini', 'google ai', 'gemini pro', 'gemini cli'],
    tier: 'S',
    avg_reads: 3146,
    ecosystem_prefix: ['gemini-', 'google-ai-']
  },
  'Kimi': {
    keywords: ['kimi', 'moonshot', '月之暗面'],
    tier: 'S',
    avg_reads: 3448,
    ecosystem_prefix: ['kimi-', 'moonshot-']
  },
  'ChatGPT': {
    keywords: ['chatgpt', 'gpt-4', 'gpt-5', 'openai'],
    tier: 'A',
    avg_reads: 1500,
    ecosystem_prefix: ['openai-', 'gpt-']
  },
  'Codex': {
    keywords: ['codex', 'codex cli'],
    tier: 'A',
    avg_reads: 1199,
    ecosystem_prefix: ['codex-']
  },
  'DeepSeek': {
    keywords: ['deepseek', 'deep seek'],
    tier: 'A',
    avg_reads: 1100,
    ecosystem_prefix: ['deepseek-']
  }
};

// Layer2 生态关键词（24%爆款来源）
const ECOSYSTEM_KEYWORDS = [
  'claude', 'cursor', 'gemini', 'gpt', 'openai', 'anthropic',
  'mcp', 'mcp-server', 'copilot', 'ai-coding', 'llm'
];

// 选题类型权重
const TOPIC_TYPES: Record<string, {
  keywords: string[];
  weight: number;
}> = {
  '热点型': { keywords: ['发布', '更新', '官宣', '首发', 'release'], weight: 1.6 },
  '工具型': { keywords: ['神器', '工具', '插件', '扩展', 'mcp', 'tool'], weight: 1.5 },
  '教程型': { keywords: ['手把手', '教你', '教程', '入门', '指南', 'tutorial'], weight: 1.4 },
  '羊毛型': { keywords: ['免费', '白嫖', '薅羊毛', '省钱', 'free'], weight: 1.3 },
  '痛点型': { keywords: ['解决', '报错', '问题', '修复', '避坑', 'fix'], weight: 1.4 },
  '测评型': { keywords: ['测评', '对比', '实测', '体验', 'review'], weight: 1.2 }
};

// 优先级公式参数
const LAYER_SCORES = { layer1: 100, layer2: 75, layer3: 40 };
const BRAND_TIERS = { S: 1.5, A: 1.2, B: 1.0, none: 0.7 };
const RISK_FACTORS = { low: 1.0, medium: 1.3, high: 1.8 };

// ============== 类型定义 ==============

interface HotspotItem {
  title: string;
  description: string;
  url: string;
  source: string;
  // V9.0新增
  layer: 'layer1' | 'layer2' | 'layer3';
  tool?: string;
  toolTier?: 'S' | 'A' | 'B';
  topicTypes: string[];
  timeliness: '紧急热点' | '近期更新' | '常青内容';
  priorityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  avgReadsEstimate: number;
  // 原有字段
  readCount?: number;
  keywords?: string[];
  updatedHoursAgo?: number;
}

interface ScanResult {
  success: boolean;
  data?: {
    hotspots: HotspotItem[];
    scanDate: string;
    count: number;
    source: string;
    layerStats: {
      layer1: number;
      layer2: number;
      layer3: number;
    };
  };
  error?: string;
}

// ============== 核心函数 ==============

/**
 * 判断Layer层级
 */
function determineLayer(text: string): {
  layer: 'layer1' | 'layer2' | 'layer3';
  tool?: string;
  toolInfo?: typeof LAYER1_TOOLS[string];
} {
  const lowerText = text.toLowerCase();

  // 检查Layer1：核心工具
  for (const [toolName, info] of Object.entries(LAYER1_TOOLS)) {
    for (const kw of info.keywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        return { layer: 'layer1', tool: toolName, toolInfo: info };
      }
    }
  }

  // 检查Layer2：生态项目
  for (const kw of ECOSYSTEM_KEYWORDS) {
    if (lowerText.includes(kw.toLowerCase())) {
      // 尝试找到关联的核心工具
      for (const [toolName, info] of Object.entries(LAYER1_TOOLS)) {
        for (const prefix of info.ecosystem_prefix) {
          if (lowerText.includes(prefix.toLowerCase())) {
            return { layer: 'layer2', tool: toolName, toolInfo: info };
          }
        }
      }
      return { layer: 'layer2' };
    }
  }

  // Layer3：泛AI话题
  const aiKeywords = ['ai', 'llm', 'agent', 'machine learning', '人工智能', '大模型'];
  for (const kw of aiKeywords) {
    if (lowerText.includes(kw.toLowerCase())) {
      return { layer: 'layer3' };
    }
  }

  return { layer: 'layer3' };
}

/**
 * 匹配选题类型（可多选）
 */
function matchTopicTypes(text: string): string[] {
  const lowerText = text.toLowerCase();
  const matched: string[] = [];

  for (const [typeName, info] of Object.entries(TOPIC_TYPES)) {
    for (const kw of info.keywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        matched.push(typeName);
        break;
      }
    }
  }

  return matched.length > 0 ? matched : ['通用型'];
}

/**
 * 判断时效性
 */
function checkTimeliness(text: string, updatedHoursAgo?: number): {
  timeliness: '紧急热点' | '近期更新' | '常青内容';
  boost: number;
} {
  const lowerText = text.toLowerCase();

  // 基于更新时间判断
  if (updatedHoursAgo !== undefined) {
    if (updatedHoursAgo < 24) {
      return { timeliness: '紧急热点', boost: 2.0 };
    } else if (updatedHoursAgo < 72) {
      return { timeliness: '近期更新', boost: 1.5 };
    }
  }

  // 基于关键词判断
  const immediateKw = ['刚刚', '今天', '发布', '上线', '官宣', 'breaking', 'release', 'launch'];
  for (const kw of immediateKw) {
    if (lowerText.includes(kw.toLowerCase())) {
      return { timeliness: '紧急热点', boost: 2.0 };
    }
  }

  const recentKw = ['最新', '更新', '新版', '升级', 'update', 'new'];
  for (const kw of recentKw) {
    if (lowerText.includes(kw.toLowerCase())) {
      return { timeliness: '近期更新', boost: 1.5 };
    }
  }

  // 版本号检测
  if (/[vV]\d+(\.\d+)?|\b\d+\.\d+\b/.test(text)) {
    return { timeliness: '近期更新', boost: 1.5 };
  }

  return { timeliness: '常青内容', boost: 1.0 };
}

/**
 * 评估风险等级
 */
function assessRisk(layer: string, tool?: string): 'low' | 'medium' | 'high' {
  if (layer === 'layer1' && tool) return 'low';
  if (layer === 'layer2') return tool ? 'medium' : 'high';
  return 'high';
}

/**
 * 计算优先级分数
 */
function calculatePriority(
  layer: 'layer1' | 'layer2' | 'layer3',
  toolTier: 'S' | 'A' | 'B' | 'none',
  topicTypes: string[],
  timelinessBoost: number,
  riskLevel: 'low' | 'medium' | 'high'
): number {
  // Layer基础分
  const layerScore = LAYER_SCORES[layer];

  // 品牌加成
  const brandBoost = BRAND_TIERS[toolTier];

  // 类型权重（多类型相乘，限制最大值）
  let typeWeight = 1.0;
  for (const t of topicTypes) {
    if (TOPIC_TYPES[t]) {
      typeWeight *= TOPIC_TYPES[t].weight;
    }
  }
  typeWeight = Math.min(typeWeight, 3.0);

  // 风险系数
  const riskFactor = RISK_FACTORS[riskLevel];

  // 计算最终分数
  const score = (layerScore * timelinessBoost * typeWeight * brandBoost) / riskFactor;
  return Math.round(score * 10) / 10;
}

/**
 * 预估阅读量
 */
function estimateReads(
  layer: string,
  toolInfo?: typeof LAYER1_TOOLS[string],
  priorityScore?: number
): number {
  const baseReads: Record<string, number> = {
    layer1: 2200,
    layer2: 1450,
    layer3: 908
  };

  let base = baseReads[layer] || 908;

  if (toolInfo?.avg_reads) {
    base = toolInfo.avg_reads;
  }

  // 根据优先级调整
  if (priorityScore && priorityScore > 200) {
    return Math.round(base * 1.3);
  } else if (priorityScore && priorityScore > 100) {
    return Math.round(base * 1.1);
  }

  return base;
}

// ============== GitHub搜索 ==============

async function searchGitHub(): Promise<HotspotItem[]> {
  try {
    const today = new Date();
    const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
    const dateFilter = threeDaysAgo.toISOString().split('T')[0];

    // 搜索核心工具生态项目
    const query = encodeURIComponent(
      `(claude OR cursor OR gemini OR gpt OR mcp OR anthropic OR openai) pushed:>=${dateFilter}`
    );
    const url = `https://api.github.com/search/repositories?q=${query}&sort=updated&order=desc&per_page=20`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API错误: ${response.status}`);
    }

    const data = await response.json();

    return (data.items || []).map((repo: any) => {
      const fullText = `${repo.name} ${repo.description || ''}`;
      const updatedAt = new Date(repo.pushed_at || repo.updated_at);
      const hoursAgo = Math.floor((Date.now() - updatedAt.getTime()) / (1000 * 60 * 60));

      // V9.0：三层架构分析
      const { layer, tool, toolInfo } = determineLayer(fullText);
      const topicTypes = matchTopicTypes(fullText);
      const { timeliness, boost } = checkTimeliness(fullText, hoursAgo);
      const riskLevel = assessRisk(layer, tool);
      const toolTier = toolInfo?.tier || 'none';

      const priorityScore = calculatePriority(
        layer,
        toolTier as 'S' | 'A' | 'B' | 'none',
        topicTypes,
        boost,
        riskLevel
      );

      const avgReadsEstimate = estimateReads(layer, toolInfo, priorityScore);

      return {
        title: repo.name,
        description: repo.description || '暂无描述',
        url: repo.html_url,
        source: 'GitHub',
        // V9.0新增字段
        layer,
        tool,
        toolTier: toolInfo?.tier,
        topicTypes,
        timeliness,
        priorityScore,
        riskLevel,
        avgReadsEstimate,
        // 原有字段
        readCount: repo.stargazers_count,
        keywords: repo.topics?.slice(0, 5) || [],
        updatedHoursAgo: hoursAgo
      };
    });
  } catch (error: any) {
    console.error('GitHub搜索失败:', error);
    throw error;
  }
}

// ============== API Handler ==============

export async function GET(): Promise<NextResponse<ScanResult>> {
  try {
    console.log('热点扫描API V9.0 - 三层架构版');

    // 执行搜索
    const rawHotspots = await searchGitHub();

    if (!rawHotspots || rawHotspots.length === 0) {
      return NextResponse.json({
        success: false,
        error: '未找到热点'
      }, { status: 404 });
    }

    // 过滤：只保留Layer1和Layer2（生态相关）
    const filteredHotspots = rawHotspots.filter(h =>
      h.layer === 'layer1' || h.layer === 'layer2'
    );

    // 按优先级排序
    filteredHotspots.sort((a, b) => b.priorityScore - a.priorityScore);

    // 取前10个
    const hotspots = filteredHotspots.slice(0, 10);

    // 统计Layer分布
    const layerStats = {
      layer1: hotspots.filter(h => h.layer === 'layer1').length,
      layer2: hotspots.filter(h => h.layer === 'layer2').length,
      layer3: hotspots.filter(h => h.layer === 'layer3').length
    };

    console.log(`扫描完成：${hotspots.length}个热点（Layer1:${layerStats.layer1}, Layer2:${layerStats.layer2}）`);

    return NextResponse.json({
      success: true,
      data: {
        hotspots,
        scanDate: new Date().toLocaleString('zh-CN'),
        count: hotspots.length,
        source: 'GitHub Ecosystem',
        layerStats
      }
    });

  } catch (error: any) {
    console.error('热点扫描API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '热点扫描失败'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ScanResult>> {
  try {
    const body = await request.json();
    const customQuery = body.query || body.topic;

    if (customQuery) {
      console.log('自定义查询:', customQuery);
    }

    return GET();
  } catch (error: any) {
    console.error('热点扫描POST错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '请求处理失败'
    }, { status: 500 });
  }
}
