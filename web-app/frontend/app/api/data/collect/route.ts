/**
 * 数据收集API - 自动爬取方案
 * 调用Playwright脚本自动爬取微信公众号数据
 */

import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { cdpUrl = 'http://localhost:9222' } = await request.json().catch(() => ({}));

    const projectRoot = path.join(process.cwd(), '..', '..');
    const scriptPath = path.join(projectRoot, '.claude', 'skills', 'gongzhonghao-writer', 'scripts', 'auto_collect.js');

    console.log('开始自动爬取微信公众号数据...');
    console.log(`脚本路径: ${scriptPath}`);
    console.log(`CDP URL: ${cdpUrl}`);

    // 执行Playwright自动收集脚本
    const result = await new Promise<{ stdout: string; stderr: string; code: number }>((resolve, reject) => {
      const childProcess = spawn('node', [scriptPath], {
        cwd: projectRoot,
        timeout: 60000, // 60秒超时
        env: {
          ...process.env,
          CDP_URL: cdpUrl
        }
      });

      let stdout = '';
      let stderr = '';

      childProcess.stdout.on('data', (data: Buffer) => {
        const output = data.toString();
        stdout += output;
        console.log(output);
      });

      childProcess.stderr.on('data', (data: Buffer) => {
        const output = data.toString();
        stderr += output;
        console.error(output);
      });

      childProcess.on('close', (code: number | null) => {
        resolve({ stdout, stderr, code: code || 0 });
      });

      childProcess.on('error', (error: Error) => {
        reject(error);
      });
    });

    // 检查是否成功
    if (result.code !== 0) {
      // 检查是否是浏览器连接错误
      if (result.stderr.includes('无法连接到浏览器') || result.stdout.includes('无法连接到浏览器')) {
        return NextResponse.json({
          success: false,
          error: '无法连接到Chrome浏览器',
          hint: '请先启动Chrome调试模式',
          solution: {
            windows: '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222',
            mac: '"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --remote-debugging-port=9222',
            linux: 'google-chrome --remote-debugging-port=9222',
            steps: [
              '1. 关闭所有Chrome窗口',
              '2. 用上述命令启动Chrome',
              '3. 在Chrome中打开微信公众号后台',
              '4. 进入"发表记录"或"已发表"页面',
              '5. 返回Web GUI点击"收集数据"'
            ]
          }
        }, { status: 500 });
      }

      throw new Error(`脚本执行失败: ${result.stderr || result.stdout}`);
    }

    // 解析收集结果
    const articleCountMatch = result.stdout.match(/检测到约\s+(\d+)\s+篇文章/);
    const collectedCount = articleCountMatch ? parseInt(articleCountMatch[1]) : 0;

    return NextResponse.json({
      success: true,
      message: '数据收集完成',
      data: {
        collectedCount,
        output: result.stdout,
        dataPath: 'data/temp/page1_snapshot.txt',
        timestamp: new Date().toISOString(),
        hint: '下一步：点击"分析数据"按钮处理收集的数据'
      }
    });

  } catch (error: any) {
    console.error('数据收集API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '数据收集失败',
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
