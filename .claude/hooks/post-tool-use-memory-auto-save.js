#!/usr/bin/env node

/**
 * MCP Memory Service - 自动记忆 Hook
 *
 * 功能：在每次 AI 响应后自动保存重要对话内容到 Memory Service
 * 触发时机：PostToolUse（工具调用后）
 *
 * 配置：
 * - AUTO_MEMORY_ENABLED: 是否启用自动记忆（默认 true）
 * - AUTO_MEMORY_MIN_LENGTH: 最小保存长度（默认 100 字符）
 * - AUTO_MEMORY_KEYWORDS: 触发保存的关键词
 */

const fs = require('fs');
const path = require('path');

// ========== 配置区 ==========
const CONFIG = {
  enabled: process.env.AUTO_MEMORY_ENABLED !== 'false', // 默认启用
  minLength: parseInt(process.env.AUTO_MEMORY_MIN_LENGTH || '100'), // 最小长度
  keywords: [
    '重要', '记住', '配置', '设置', '方法', '步骤',
    '学习', '笔记', '总结', '关键', '核心',
    'important', 'remember', 'config', 'setup', 'method'
  ],
  excludePatterns: [
    /^艹/, // 老金的粗口
    /测试/, // 测试内容
    /^好的/, /^明白/, /^了解/ // 简单确认
  ]
};

// ========== 主函数 ==========
async function main() {
  try {
    if (!CONFIG.enabled) {
      console.error('[Auto Memory] Disabled by config');
      process.exit(0);
    }

    // 读取 Hook 输入
    const input = await readStdin();
    const hookData = JSON.parse(input);

    // 提取对话内容
    const { messages, toolResults } = hookData;

    if (!messages || messages.length === 0) {
      console.error('[Auto Memory] No messages to process');
      process.exit(0);
    }

    // 获取最后一条 AI 响应
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== 'assistant') {
      console.error('[Auto Memory] Last message is not from assistant');
      process.exit(0);
    }

    // 提取文本内容
    const content = extractTextContent(lastMessage);

    if (!content || content.length < CONFIG.minLength) {
      console.error(`[Auto Memory] Content too short (${content?.length || 0} < ${CONFIG.minLength})`);
      process.exit(0);
    }

    // 检查是否应该保存
    if (!shouldSave(content)) {
      console.error('[Auto Memory] Content does not meet save criteria');
      process.exit(0);
    }

    // 提取关键信息并保存
    const summary = generateSummary(content);
    const tags = extractTags(content);

    await saveToMemory(summary, tags);

    console.error('[Auto Memory] Successfully saved to memory');
    process.exit(0);

  } catch (error) {
    console.error('[Auto Memory] Error:', error.message);
    process.exit(0); // 不阻塞正常流程
  }
}

// ========== 辅助函数 ==========

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.on('data', chunk => data += chunk);
    process.stdin.on('end', () => resolve(data));
  });
}

function extractTextContent(message) {
  if (!message.content) return '';

  if (typeof message.content === 'string') {
    return message.content;
  }

  if (Array.isArray(message.content)) {
    return message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');
  }

  return '';
}

function shouldSave(content) {
  // 排除模式检查
  for (const pattern of CONFIG.excludePatterns) {
    if (pattern.test(content)) {
      return false;
    }
  }

  // 关键词检查
  const hasKeyword = CONFIG.keywords.some(keyword =>
    content.toLowerCase().includes(keyword.toLowerCase())
  );

  return hasKeyword;
}

function generateSummary(content) {
  // 简单截取前 500 字符作为摘要
  // 未来可以接入 AI 生成更智能的摘要
  const summary = content.substring(0, 500);
  return summary + (content.length > 500 ? '...' : '');
}

function extractTags(content) {
  const tags = ['自动记忆'];

  // 根据关键词提取标签
  const tagMap = {
    'MCP': ['MCP'],
    'Memory': ['Memory'],
    '配置': ['配置'],
    '学习': ['学习'],
    'Windows': ['Windows'],
    '项目': ['项目'],
    'Hook': ['Hook']
  };

  for (const [keyword, tag] of Object.entries(tagMap)) {
    if (content.includes(keyword)) {
      tags.push(...tag);
    }
  }

  return [...new Set(tags)]; // 去重
}

async function saveToMemory(content, tags) {
  // 构造 MCP Memory Service 调用
  // 注意：这里需要通过 Claude Code 的 MCP 机制调用
  // 由于 Hook 环境限制，我们输出 JSON 让 Claude Code 处理

  const memoryRequest = {
    action: 'store_memory',
    params: {
      content: content,
      tags: tags,
      memory_type: 'note',
      metadata: {
        auto_saved: true,
        timestamp: new Date().toISOString()
      }
    }
  };

  // 输出到标准输出，让 Claude Code 处理
  console.log(JSON.stringify(memoryRequest));
}

// ========== 执行 ==========
main();
