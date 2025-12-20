/**
 * 自动写作API - 真实AI生成
 * 对应CLI命令：/write-auto
 *
 * 方案1（推荐）：OpenAI GPT-4（需要OPENAI_API_KEY）
 * 方案2（备选）：Claude API（需要ANTHROPIC_API_KEY）
 * 方案3（免费）：固定模板生成（无需密钥）
 */

import { NextRequest, NextResponse } from 'next/server';

// AI写作策略接口
interface AIWritingStrategy {
  name: string;
  generateArticle(topic: string, style: string): Promise<string>;
}

// 老金写作风格核心提示词
const LAOJIN_STYLE_PROMPT = `你是老金，一个接地气的科技博主。

核心人设：
- 不会写代码，全靠AI助手
- 英语没过四级
- 自学成才，特别想帮小白避坑
- 用大白话讲技术

写作要求：
1. 自然口语化，像微信群聊天
2. 用"老金我"、"咱们"、"家人们"
3. 必须包含真实踩坑经历（1-2个坑）
4. 必须使用俚语："玩"代替"测试"、"扔进去"代替"输入"、"牛逼"代替"很强"
5. 必须具体案例（至少3个产品名、工具名）
6. 时间用"这两天"、"昨儿"、"前两天"（不要"最近"、"测试了两天"）
7. **严格禁止脏话**：艹、SB、卧槽等

文章结构：
1. 开篇：真实经历引入（"这两天玩了个新东西..."）
2. 痛点：读者可能遇到的问题
3. 方案：解决方案核心要点（包含踩坑）
4. 步骤：手把手操作（3-5步）
5. 效果：使用后对比
6. 总结：老金的建议

字数：1500-2000字
`;

// OpenAI策略（推荐）
class OpenAIStrategy implements AIWritingStrategy {
  name = 'OpenAI GPT-4';

  constructor(private apiKey: string) {}

  async generateArticle(topic: string, style: string): Promise<string> {
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
            { role: 'user', content: `写一篇关于"${topic}"的公众号文章` }
          ],
          temperature: 0.8,
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API错误: ${response.status} - ${error}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error: any) {
      console.error('OpenAI生成失败:', error);
      throw error;
    }
  }
}

// Claude策略（备选）
class ClaudeStrategy implements AIWritingStrategy {
  name = 'Claude Sonnet';

  constructor(private apiKey: string) {}

  async generateArticle(topic: string, style: string): Promise<string> {
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
              content: `${style}\n\n写一篇关于"${topic}"的公众号文章`
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
      console.error('Claude生成失败:', error);
      throw error;
    }
  }
}

// 固定模板策略（免费备选）
class TemplateStrategy implements AIWritingStrategy {
  name = '固定模板（免费）';

  async generateArticle(topic: string): Promise<string> {
    const title = `老金用${topic}才知道，原来一直少了这个神器`;

    return `# ${title}

老金我这两天玩了个新东西，说实话，有点上头。

前两天朋友跟我说，${topic}有个神器功能，我当时还不信。昨儿试了一下，真是，之前白用了这么久。

## 痛点来了

很多人用${topic}都遇到这几个问题：

1. **效率低下** - 手动操作太多，一个简单操作要折腾半天
2. **功能不熟** - 很多牛的功能根本不知道有
3. **配置复杂** - 文档看着头疼，不知道从哪儿开始

老金我之前也是这样，直到发现了这个方法。

## 神器揭秘

其实${topic}有个很牛的功能，叫做**[核心功能名称]**。

这个功能的核心优势：

- ✅ **效率提升10倍** - 之前要30分钟，现在3分钟搞定
- ✅ **操作简单** - 一键搞定，小白也能用
- ✅ **完全免费** - 不用额外花钱

但也有个坑，第一次用可能会遇到[常见问题]，这个坑老金我踩过了。

## 手把手教你用

### 步骤1：准备工作

首先得安装${topic}，如果已经装了就跳过。

\`\`\`bash
# 安装命令示例
npm install ${topic}
\`\`\`

### 步骤2：配置核心功能

这是关键步骤，不要跳过。

\`\`\`bash
# 配置命令
${topic} config --enable-feature
\`\`\`

⚠️ **注意**：这里有个坑，如果遇到权限错误，前面加sudo。

### 步骤3：开始使用

配置好之后，就可以一键启动了。

\`\`\`bash
# 启动命令
${topic} start
\`\`\`

### 步骤4：验证效果

运行完看看效果。

**对比数据：**
- 之前手动操作：30分钟
- 用了这个功能：3分钟
- **效率提升：10倍！**

## 实际效果

老金我试了之后，真的节省了大量时间。

昨儿用它处理了一个项目，之前要大半天，现在半小时就搞定了。

**真实案例**：
- 项目A：原来2小时 → 现在15分钟
- 项目B：原来1小时 → 现在10分钟
- 项目C：原来3小时 → 现在30分钟

## 老金提醒

⚠️ **注意事项**：

1. **第一次使用建议仔细看文档** - 别嫌麻烦，磨刀不误砍柴工
2. **遇到问题不要慌** - 检查[常见问题解答]
3. **记得定期更新** - 新版本一般都有优化

还有个坑要说一下，如果你用Windows，可能会遇到路径问题。解决办法是用绝对路径，别用相对路径。

---

**总结一下：**

${topic}这个功能真的是神器，如果你还没用过，强烈建议试试。

老金我保证，用了之后你会感谢我的。

对了，如果遇到问题，评论区告诉我，老金我给你解答。

---

**关键词：** ${topic}、效率工具、开发神器、老金推荐
**字数：** 约1500字
**预计阅读：** 4分钟

---

⚠️ **免费版提示：这是固定模板生成的文章框架。**

**升级建议**：配置 OPENAI_API_KEY 或 ANTHROPIC_API_KEY 环境变量，可使用AI智能生成，内容更丰富真实！

升级后优势：
- ✅ 真实案例和数据
- ✅ 自然的老金风格
- ✅ 更准确的踩坑经历
- ✅ 更专业的技术细节
`;
  }
}

// 策略工厂
function getWritingStrategy(): AIWritingStrategy {
  const openaiKey = process.env.OPENAI_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;

  if (openaiKey) {
    console.log('使用OpenAI GPT-4生成');
    return new OpenAIStrategy(openaiKey);
  }

  if (claudeKey) {
    console.log('使用Claude Sonnet生成');
    return new ClaudeStrategy(claudeKey);
  }

  console.log('使用固定模板（免费）');
  return new TemplateStrategy();
}

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return NextResponse.json(
        { success: false, error: '请提供写作主题' },
        { status: 400 }
      );
    }

    console.log(`开始自动写作：${topic}`);

    // 获取写作策略
    const strategy = getWritingStrategy();

    // 生成文章
    const content = await strategy.generateArticle(topic, LAOJIN_STYLE_PROMPT);

    console.log(`文章生成完成（来源：${strategy.name}）`);

    return NextResponse.json({
      success: true,
      message: '文章生成完成',
      data: {
        topic,
        content,
        strategy: strategy.name,
        wordCount: content.length,
        estimatedReadTime: Math.ceil(content.length / 400) + '分钟',
        timestamp: new Date().toISOString(),
        isAIGenerated: strategy.name !== '固定模板（免费）'
      }
    });

  } catch (error: any) {
    console.error('自动写作API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '文章生成失败',
      hint: '检查API密钥配置或网络连接'
    }, { status: 500 });
  }
}
