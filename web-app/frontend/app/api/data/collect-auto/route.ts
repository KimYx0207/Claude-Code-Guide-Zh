/**
 * 数据收集API - 真·全自动方案
 * 直接调用MCP浏览器工具，完全自动化
 */

import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 开始全自动数据收集...');

    const projectRoot = path.join(process.cwd(), '..', '..');

    // 方案1：直接在Next.js中调用MCP工具（如果可用）
    // 方案2：调用Claude Code执行CLI命令（更可靠）

    // 使用claude headless模式执行命令
    const command = `cd "${projectRoot}" && claude -p "/data-collect"`;

    console.log('执行命令:', command);

    const { stdout, stderr } = await execAsync(command, {
      timeout: 120000, // 2分钟超时
      encoding: 'utf8',
      env: {
        ...process.env,
        PYTHONIOENCODING: 'utf-8'
      }
    });

    console.log('命令输出:', stdout);

    if (stderr && !stderr.includes('UserWarning')) {
      console.error('错误输出:', stderr);
    }

    // 解析输出结果
    const collectedMatch = stdout.match(/收集到.*?(\d+).*?篇/);
    const collectedCount = collectedMatch ? parseInt(collectedMatch[1]) : 0;

    return NextResponse.json({
      success: true,
      message: '数据收集完成',
      data: {
        collectedCount,
        output: stdout,
        timestamp: new Date().toISOString(),
        hint: '下一步：点击"分析数据"按钮'
      }
    });

  } catch (error: any) {
    console.error('数据收集API错误:', error);

    // 解析错误信息
    let errorMessage = error.message || '数据收集失败';
    let hint = '';

    if (errorMessage.includes('command not found') || errorMessage.includes('不是内部或外部命令')) {
      errorMessage = 'Claude Code CLI未安装';
      hint = '请先安装Claude Code：npm install -g @anthropic-ai/claude-code';
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      hint: hint || '尝试使用CLI命令：/data-collect',
      details: error.stack
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: '请使用POST方法调用此API'
  }, { status: 405 });
}
