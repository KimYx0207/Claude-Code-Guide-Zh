/**
 * 完整写作流程API - 深度教程生成
 * 对应CLI命令：/write
 *
 * 方案1（推荐）：OpenAI GPT-4（需要OPENAI_API_KEY）
 * 方案2（备选）：Claude API（需要ANTHROPIC_API_KEY）
 * 方案3（免费）：固定模板生成（无需密钥）
 */

import { NextRequest, NextResponse } from 'next/server';

// AI写作策略接口（复用自write/auto）
interface AIWritingStrategy {
  name: string;
  generateArticle(topic: string, style: string): Promise<string>;
}

// 深度教程风格提示词
const TUTORIAL_STYLE_PROMPT = `你是老金，一个接地气的科技博主。现在要写一篇**深度教程**。

核心人设：
- 不会写代码，全靠AI助手
- 英语没过四级
- 自学成才，特别想帮小白避坑
- 用大白话讲技术

深度教程特点：
1. **系统性** - 从零基础到精通，步步为营
2. **实战性** - 每个步骤都可操作，有代码/命令
3. **真实性** - 包含踩坑经历和错误排查
4. **完整性** - 包含安装、配置、使用、进阶、案例
5. **可读性** - 逻辑清晰，分块明确

写作要求：
1. 自然口语化，像微信群聊天
2. 用"老金我"、"咱们"、"家人们"
3. 必须包含真实踩坑经历（2-3个坑）
4. 必须使用俚语："玩"代替"测试"、"扔进去"代替"输入"
5. 必须具体案例（至少5个产品名、工具名、技术名）
6. 时间用"这两天"、"昨儿"、"前两天"
7. **严格禁止脏话**：艹、SB、卧槽等
8. 每个步骤都要有代码示例或命令

文章结构（必须包含以下部分）：

## 第一部分：为什么要学（5分钟阅读）
- 你可能遇到的问题（3个具体场景）
- 核心优势（3个要点，每个要点有数据支撑）
- 适合人群和前置要求

## 第二部分：环境准备（5-10分钟操作）
- 系统要求检查
- 工具安装（多种方法）
- 验证安装成功
- 常见安装错误及解决方案

## 第三部分：快速上手（10-15分钟操作）
- 创建第一个项目（有完整命令）
- 基础配置（有配置文件示例）
- 运行第一个示例（有输出结果）
- 理解工作原理（简单解释）

## 第四部分：核心功能详解（15-20分钟阅读+实战）
- 功能1：详细说明+代码示例+踩坑经历
- 功能2：详细说明+代码示例+踩坑经历
- 功能3：详细说明+代码示例+踩坑经历

## 第五部分：进阶技巧（10-15分钟）
- 性能优化（具体方法+效果对比）
- 自定义配置（配置文件详解）
- 与其他工具集成（具体工具名+集成方法）

## 第六部分：实战案例（20-30分钟）
- 案例1：具体项目场景（完整代码+步骤+结果）
- 案例2：另一个场景（完整代码+步骤+结果）
- 效果对比（用了工具 vs 不用工具，要有数据）

## 第七部分：常见错误排查
- 错误1：症状+原因+解决方案（有代码）
- 错误2：症状+原因+解决方案（有代码）
- 错误3：症状+原因+解决方案（有代码）

## 第八部分：最佳实践
- 项目结构规范（有目录树）
- 配置管理技巧
- 版本控制建议
- 团队协作要点

## 第九部分：总结与下一步
- 你学到了什么（清单）
- 推荐学习资源（具体链接）
- 下一步建议（3个方向）

字数：2500-3500字
代码示例：至少5个
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
            { role: 'user', content: `写一篇关于"${topic}"的深度教程` }
          ],
          temperature: 0.7,
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
              content: `${style}\n\n写一篇关于"${topic}"的深度教程`
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
    const title = `手把手教你用${topic}，从零基础到精通只需10分钟`;

    return `# ${title}

**适合人群：** 零基础小白到进阶用户
**预计学习时间：** 10-15分钟
**实战难度：** ⭐⭐ 简单

---

老金我用${topic}大半年了，最近把所有功能摸透了，今天手把手教你。

## 第一部分：为什么要学${topic}

### 你可能遇到的问题

很多人问老金：
- "${topic}和XX工具有什么区别？"
- "学${topic}能解决什么实际问题？"
- "我现在的方法也能用，为啥要换？"

老金我之前也这么想，直到遇到这几个场景。

### ${topic}的核心优势

简单说，${topic}能帮你：

**1、效率暴涨**
原来需要2小时的工作，现在10分钟搞定。

**2、质量提升**
内置最佳实践，避免90%的常见错误。

**3、成本降低**
开源免费，或者付费版也很便宜。

## 第二部分：环境准备（5分钟）

### 步骤1：检查系统要求

你需要确认：
- 操作系统：Windows 10+/macOS 10.15+/Linux
- 内存：至少4GB（推荐8GB）
- 磁盘：至少5GB可用空间

### 步骤2：安装基础工具

\`\`\`bash
# 方法1：包管理器安装（推荐）
npm install -g ${topic}

# 方法2：手动下载
# 访问官网：https://example.com/download
\`\`\`

### 步骤3：验证安装

\`\`\`bash
# 检查版本
${topic} --version

# 预期输出
v2.1.0
\`\`\`

**⚠️ 常见错误：**
- 如果提示"command not found"，检查PATH环境变量
- 如果版本太低，运行 \`npm update -g ${topic}\`

## 第三部分：快速上手（10分钟）

### 步骤1：创建第一个项目

\`\`\`bash
# 初始化项目
${topic} init my-project
cd my-project
\`\`\`

### 步骤2：基础配置

编辑配置文件：
\`\`\`yaml
# config.yaml
settings:
  mode: development
  verbose: true
\`\`\`

### 步骤3：运行第一个示例

\`\`\`bash
# 运行示例
${topic} run example

# 预期输出
✅ 示例运行成功
📊 处理时间：2.3秒
\`\`\`

## 第四部分：核心功能详解

### 功能1：[核心功能名称]

这是${topic}最牛的功能。

**使用方法：**
\`\`\`bash
${topic} feature1 --option value
\`\`\`

**踩坑经历：**
老金我第一次用遇到个坑，参数写错了位置，报错看了半天才发现。

### 功能2：[另一个功能]

[详细说明...]

## 第五部分：进阶技巧

### 技巧1：性能优化

**问题：** 处理速度慢

**解决方案：**
\`\`\`javascript
// 启用缓存
config.cache = true;
config.workers = 4;  // 多线程处理
\`\`\`

**效果：** 速度提升3-5倍

### 技巧2：自定义配置

${topic}支持高度自定义：
\`\`\`javascript
// 高级配置示例
module.exports = {
  option1: {
    enabled: true,
    value: 'custom'
  },
  option2: ['item1', 'item2']
};
\`\`\`

## 第六部分：实战案例

### 案例1：[具体项目场景]

**需求：** [项目需求描述]

**使用${topic}的解决方案：**

\`\`\`bash
# 第1步
${topic} init project-name

# 第2步
${topic} config --mode production

# 第3步
${topic} build
\`\`\`

**结果：**
- ✅ 开发时间：从3天 → 半天
- ✅ 代码质量：提升40%
- ✅ Bug数量：减少60%

## 第七部分：常见错误排查

### 错误1：初始化失败

**症状：**
\`\`\`
Error: Cannot initialize project
\`\`\`

**解决：**
\`\`\`bash
# 使用管理员权限
sudo ${topic} init project-name
\`\`\`

### 错误2：运行时报错

**症状：**
\`\`\`
Error: Module not found
\`\`\`

**解决：** 安装缺失的依赖
\`\`\`bash
npm install
\`\`\`

## 第八部分：最佳实践

老金我总结的经验：

**实践1：项目结构规范**
\`\`\`
project/
  config/      # 配置文件
  src/         # 源代码
  tests/       # 测试
  docs/        # 文档
\`\`\`

**实践2：配置管理**
- 开发环境用 \`config.dev.js\`
- 生产环境用 \`config.prod.js\`
- 敏感信息放 \`.env\`

## 第九部分：总结与下一步

### 你学到了什么

通过本教程，你应该能够：
- ✅ 独立安装和配置${topic}
- ✅ 完成基础项目创建
- ✅ 掌握核心功能和进阶技巧
- ✅ 排查常见错误

### 继续学习

**推荐资源：**
- 官方文档：[链接]
- 视频教程：[链接]
- 社区论坛：[链接]

**下一步建议：**
1、尝试完成一个真实项目
2、加入社区交流经验
3、关注官方更新

---

**最后说两句：**

${topic}真的是个宝藏工具，老金我强烈推荐。

从零到会用也就10分钟的事，但能提升你几年的效率。

值！

---

**作者：** 老金
**关键词：** ${topic}、手把手教程、零基础入门
**字数：** 约3000字
**难度：** ⭐⭐ 简单

---

⚠️ **免费版提示：这是固定模板生成的深度教程框架。**

**升级建议**：配置 OPENAI_API_KEY 或 ANTHROPIC_API_KEY 环境变量，可使用AI智能生成，内容更丰富真实！

升级后优势：
- ✅ 更详细的技术细节
- ✅ 更真实的案例和数据
- ✅ 更准确的踩坑经历
- ✅ 更完整的代码示例
`;
  }
}

// 策略工厂
function getWritingStrategy(): AIWritingStrategy {
  const openaiKey = process.env.OPENAI_API_KEY;
  const claudeKey = process.env.ANTHROPIC_API_KEY;

  if (openaiKey) {
    console.log('使用OpenAI GPT-4生成深度教程');
    return new OpenAIStrategy(openaiKey);
  }

  if (claudeKey) {
    console.log('使用Claude Sonnet生成深度教程');
    return new ClaudeStrategy(claudeKey);
  }

  console.log('使用固定模板（免费）');
  return new TemplateStrategy();
}

export async function POST(request: NextRequest) {
  try {
    const { topic, targetWords = 3000 } = await request.json();

    if (!topic || typeof topic !== 'string' || topic.trim() === '') {
      return NextResponse.json(
        { success: false, error: '请提供写作主题' },
        { status: 400 }
      );
    }

    console.log(`开始完整写作：${topic}（目标字数：${targetWords}）`);

    // 获取写作策略
    const strategy = getWritingStrategy();

    // 生成深度教程
    const content = await strategy.generateArticle(topic, TUTORIAL_STYLE_PROMPT);

    console.log(`深度教程生成完成（来源：${strategy.name}）`);

    return NextResponse.json({
      success: true,
      message: '深度教程生成完成',
      data: {
        topic,
        content,
        strategy: strategy.name,
        wordCount: content.length,
        estimatedReadTime: Math.ceil(content.length / 400) + '分钟',
        articleType: '深度教程',
        style: '老金风格',
        timestamp: new Date().toISOString(),
        isAIGenerated: strategy.name !== '固定模板（免费）'
      }
    });

  } catch (error: any) {
    console.error('完整写作API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '写作失败',
      hint: '检查API密钥配置或网络连接'
    }, { status: 500 });
  }
}
