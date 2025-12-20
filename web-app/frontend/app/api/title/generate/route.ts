/**
 * 标题生成API - 调用真实Python脚本
 * 基于5大爆款公式生成标题
 */

import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json();

    if (!topic || topic.trim() === '') {
      return NextResponse.json({
        success: false,
        error: '请提供主题'
      }, { status: 400 });
    }

    const projectRoot = path.join(process.cwd(), '..', '..');
    const scriptDir = path.join(projectRoot, '.claude', 'skills', 'gongzhonghao-writer', 'scripts', 'core');
    const scriptPath = path.join(scriptDir, 'title_generator.py');

    // 执行Python标题生成脚本
    const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const pythonProcess = spawn('python', [scriptPath, topic, '--full'], {
        cwd: scriptDir,
        timeout: 30000, // 30秒超时
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
      });

      let stdout = '';
      let stderr = '';

      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`标题生成失败，退出码: ${code}\n${stderr}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(error);
      });
    });

    // 解析Python脚本输出
    const output = result.stdout;
    const titles: any[] = [];
    let recommendation = null;

    // 解析标题（每个标题占多行）
    const titleMatches = output.matchAll(/【推荐标题(\d+)】(.+?)(?=\n(?:【推荐标题|-------|$))/gs);
    for (const match of titleMatches) {
      const titleNum = match[1];
      const titleBlock = match[2];

      // 提取标题文本
      const titleLine = titleBlock.split('\n')[0].trim();
      const title = titleLine.replace(/\s*←\s*推荐$/, '').trim();

      // 提取公式
      const formulaMatch = titleBlock.match(/公式：(.+)/);
      const formula = formulaMatch ? formulaMatch[1].trim() : '';

      // 提取SEO评分
      const scoreMatch = titleBlock.match(/SEO评分：(\d+)分/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

      // 提取爆款指数
      const indexMatch = titleBlock.match(/爆款指数：(⭐+)/);
      const boomIndex = indexMatch ? indexMatch[1].length : 0;

      titles.push({
        title,
        formula,
        score,
        boomIndex,
        isRecommended: titleLine.includes('←') || titleNum === '1'
      });
    }

    // 提取推荐理由
    const reasonMatch = output.match(/推荐理由：(.+?)(?=\n-------|$)/s);
    if (reasonMatch) {
      recommendation = reasonMatch[1].trim();
    }

    return NextResponse.json({
      success: true,
      message: '标题生成完成',
      data: {
        topic,
        titles,
        recommendation,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('标题生成API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '标题生成失败',
      details: error.stack
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: '请使用POST方法并提供主题'
  }, { status: 405 });
}
