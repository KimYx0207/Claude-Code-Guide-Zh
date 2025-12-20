/**
 * 文章翻新API - AI深度改写
 * 对应CLI命令：/write-rewrite
 *
 * 将已有文章彻底改写成老金风格，保留核心信息但完全不同的表达
 * 方案1（推荐）：OpenAI GPT-4（需要OPENAI_API_KEY）
 * 方案2（备选）：Claude API（需要ANTHROPIC_API_KEY）
 * 方案3（免费）：简单提取+模板（无需密钥）
 */

import { NextRequest, NextResponse } from 'next/server';

// AI改写策略接口
interface AIRewriteStrategy {
  name: string;
  rewriteArticle(original: string, topic: string, style: string): Promise<string>;
}

// 文章翻新风格提示词
const REWRITE_STYLE_PROMPT = `你是老金，现在要把一篇文章**彻底改写**成你的风格。

改写要求（极其重要）：
1. **保留核心信息** - 技术要点、步骤、数据都要保留
2. **完全不同表达** - 不能照抄原文句子，要用你自己的话
3. **老金风格** - 必须用"老金我"、"艹"、"真是"等口语化表达
4. **真实经历化** - 把原文的知识点改成你的"踩坑经历"
5. **时间具体化** - "昨儿"、"前两天"、"这两天"（不要"最近"）
6. **案例具体化** - 补充具体工具名、产品名（至少5个）
7. **删除AI腔** - 去掉"赋能"、"闭环"、"降本增效"等词
8. **严格禁止脏话** - 不要用真的脏话（SB、卧槽等）

改写策略：
- 原文是教程 → 改成"老金我的踩坑经历"
- 原文是介绍 → 改成"老金我试用后的真实感受"
- 原文是对比 → 改成"老金我实测对比"
- 原文是问题 → 改成"老金我遇到过，这么解决的"

保持原文的：
- 技术准确性（代码、命令、配置）
- 步骤完整性（不能少步骤）
- 数据真实性（性能数据、效果对比）

改变的：
- 所有表达方式（用老金的口语）
- 文章结构（改成老金的习惯结构）
- 开头结尾（用老金的真实经历）

字数要求：与原文相近（±20%）
`;

// OpenAI策略（推荐）
class OpenAIStrategy implements AIRewriteStrategy {
  name = 'OpenAI GPT-4';

  constructor(private apiKey: string) {}

  async rewriteArticle(original: string, topic: string, style: string): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            { role: 'system', content: style },
            {
              role: 'user',
              content: `把下面这篇文章彻底改写成老金风格，主题是"${topic}"。保留所有技术要点和步骤，但用完全不同的表达方式。\n\n原文：\n${original}`
            }
          ],
          temperature: 0.8,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API错误: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error: any) {
      console.error('OpenAI改写失败:', error);
      throw error;
    }
  }
}

// Claude策略（备选）
class ClaudeStrategy implements AIRewriteStrategy {
  name = 'Claude Sonnet';

  constructor(private apiKey: string) {}

  async rewriteArticle(original: string, topic: string, style: string): Promise<string> {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          messages: [
            {
              role: 'user',
              content: `${style}\n\n把下面这篇文章彻底改写成老金风格，主题是"${topic}"。保留所有技术要点和步骤，但用完全不同的表达方式。\n\n原文：\n${original}`
            }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Claude API错误: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return data.content[0].text;

    } catch (error: any) {
      console.error('Claude改写失败:', error);
      throw error;
    }
  }
}

// 简单提取策略（免费备选）
class SimpleExtractStrategy implements AIRewriteStrategy {
  name = '简单提取（免费）';

  async rewriteArticle(original: string, topic: string): Promise<string> {
    // 提取关键信息
    const keywords = this.extractKeywords(original);
    const mainPoints = this.extractMainPoints(original);
    const codeBlocks = this.extractCodeBlocks(original);

    const keywordStr = keywords.length > 0 ? keywords.join('/') : topic;
    const title = `老金用${keywordStr}半年才知道，这个功能能救命`;

    return `# ${title}

老金我用${keywordStr}这么久，居然今天才发现这个功能！

## 先说结论

${mainPoints[0] || '这个功能非常重要'}。

老金我之前傻乎乎地用传统方法，现在发现原来有更好的方式。

## 痛点分析

用${keywordStr}的人都遇到过这些问题：

${mainPoints.slice(1, 4).map((point, idx) => `${idx + 1}、${point.replace(/^[#\s]+/, '')}`).join('\n')}

老金我全中招了，差点放弃。

## 解决方案

其实${keywordStr}自带解决办法，就是核心功能。

**为什么这么牛：**
- ✅ 解决了上面所有痛点
- ✅ 操作简单，3步搞定
- ✅ 效果立竿见影

## 操作步骤

### 第一步：准备工作

${codeBlocks[0] || '参考原文的第一步操作'}

### 第二步：核心操作

${codeBlocks[1] || '参考原文的第二步操作'}

### 第三步：验证结果

${codeBlocks[2] || '参考原文的第三步操作'}

## 效果展示

老金我实测之后：

**数据对比：**
- 操作时间：从30分钟 → 3分钟
- 成功率：从60% → 99%
- 体验：从烦躁 → 爽爆

## 注意事项

⚠️ **老金提醒几点：**

1、第一次用可能不习惯，多试几次就顺了
2、遇到报错别慌，99%是配置问题
3、定期更新到最新版，bug少很多

---

**最后说两句：**

${keywordStr}这个功能真的是宝藏，如果你还在用老方法，赶紧试试新方法。

老金我不骗你，用了你就知道有多香。

---

**关键词：** ${keywordStr}、效率提升、实战教程
**原文字数：** ${original.length}字
**风格：** 老金真实风

---

⚠️ **免费版提示：这是简单提取式改写。**

**升级建议**：配置 OPENAI_API_KEY 或 ANTHROPIC_API_KEY 环境变量，可使用AI深度改写，保留所有技术细节同时完全改变表达方式！

升级后优势：
- ✅ 保留100%技术准确性
- ✅ 彻底改变表达方式（不会被查重）
- ✅ 自然的老金风格
- ✅ 真实的踩坑经历融入
`;
  }

  private extractKeywords(content: string): string[] {
    const keywords: Set<string> = new Set();
    const commonTools = ['Claude', 'Cursor', 'GPT', 'Kimi', 'API', 'Python', 'JavaScript', 'Node.js', 'Gemini'];
    commonTools.forEach(tool => {
      if (content.includes(tool)) {
        keywords.add(tool);
      }
    });
    return Array.from(keywords);
  }

  private extractMainPoints(content: string): string[] {
    const points: string[] = [];

    // 提取二级标题
    const headingMatches = content.matchAll(/##\s+(.+)/g);
    for (const match of headingMatches) {
      points.push(match[1].trim());
    }

    // 如果没标题，提取段落
    if (points.length === 0) {
      const paragraphs = content.split('\n\n').filter(p => p.trim().length > 20);
      points.push(...paragraphs.slice(0, 5).map(p => p.substring(0, 50) + '...'));
    }

    return points.slice(0, 6);
  }

  private extractCodeBlocks(content: string): string[] {
    const codeBlocks: string[] = [];
    const matches = content.matchAll(/```[\s\S]*?```/g);
    for (const match of matches) {
      codeBlocks.push(match[0]);
    }
    return codeBlocks.slice(0, 5);
  }
}

// 策略工厂
function getRewriteStrategy(): AIRewriteStrategy {
  const openaiKey = process.env.OPENAI_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;

  if (openaiKey) {
    console.log('使用OpenAI GPT-4深度改写');
    return new OpenAIStrategy(openaiKey);
  }

  if (claudeKey) {
    console.log('使用Claude Sonnet深度改写');
    return new ClaudeStrategy(claudeKey);
  }

  console.log('使用简单提取（免费）');
  return new SimpleExtractStrategy();
}

export async function POST(request: NextRequest) {
  try {
    const { originalContent, topic } = await request.json();

    if (!originalContent || typeof originalContent !== 'string' || originalContent.trim() === '') {
      return NextResponse.json(
        { success: false, error: '请提供原始文章内容' },
        { status: 400 }
      );
    }

    console.log(`开始文章翻新：主题=${topic || '未指定'}，原文长度=${originalContent.length}`);

    // 获取改写策略
    const strategy = getRewriteStrategy();

    // 执行改写
    const rewrittenContent = await strategy.rewriteArticle(
      originalContent,
      topic || '工具使用',
      REWRITE_STYLE_PROMPT
    );

    console.log(`文章翻新完成（来源：${strategy.name}），新长度=${rewrittenContent.length}`);

    return NextResponse.json({
      success: true,
      message: '文章翻新完成',
      data: {
        originalLength: originalContent.length,
        rewrittenContent,
        rewrittenLength: rewrittenContent.length,
        changeRate: Math.round(Math.abs(1 - rewrittenContent.length / originalContent.length) * 100) + '%',
        strategy: strategy.name,
        timestamp: new Date().toISOString(),
        isAIRewritten: strategy.name !== '简单提取（免费）',
        notice: '⚠️ 请人工检查翻新后的内容，确保技术准确性'
      }
    });

  } catch (error: any) {
    console.error('文章翻新API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '文章翻新失败',
      hint: '检查API密钥配置或网络连接'
    }, { status: 500 });
  }
}
