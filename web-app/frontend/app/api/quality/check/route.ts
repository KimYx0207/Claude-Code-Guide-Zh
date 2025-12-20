/**
 * 质量检测API - 调用真实Python脚本
 * 9维度质量检测：AI腔、自然度、真诚度、啰嗦度、重复度、可读性、人味儿、情感、脏话
 */

import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

export async function POST(request: NextRequest) {
  try {
    const { content, articlePath } = await request.json();

    if (!content && !articlePath) {
      return NextResponse.json({
        success: false,
        error: '请提供文章内容或文章路径'
      }, { status: 400 });
    }

    const projectRoot = path.join(process.cwd(), '..', '..');
    const scriptDir = path.join(projectRoot, '.claude', 'skills', 'gongzhonghao-writer', 'scripts', 'core');
    const scriptPath = path.join(scriptDir, 'quality_detector.py');

    // 如果提供的是内容，创建临时文件
    let tempFilePath: string | null = null;
    let targetPath: string;

    if (content) {
      tempFilePath = path.join(os.tmpdir(), `temp_article_${Date.now()}.md`);
      await fs.writeFile(tempFilePath, content, 'utf-8');
      targetPath = tempFilePath;
    } else {
      targetPath = path.join(projectRoot, articlePath);
    }

    // 执行Python质量检测脚本
    const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const pythonProcess = spawn('python', [scriptPath, targetPath], {
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

      pythonProcess.on('close', async (code) => {
        // 清理临时文件
        if (tempFilePath) {
          try {
            await fs.unlink(tempFilePath);
          } catch (e) {
            console.warn('清理临时文件失败:', e);
          }
        }

        if (code === 0) {
          resolve({ stdout, stderr });
        } else {
          reject(new Error(`质量检测失败，退出码: ${code}\n${stderr}`));
        }
      });

      pythonProcess.on('error', async (error) => {
        // 清理临时文件
        if (tempFilePath) {
          try {
            await fs.unlink(tempFilePath);
          } catch (e) {
            console.warn('清理临时文件失败:', e);
          }
        }
        reject(error);
      });
    });

    // 解析Python脚本输出
    const output = result.stdout;
    const scores: any = {};
    let totalScore = 0;
    let isPassed = false;
    const suggestions: string[] = [];

    // 解析各维度分数
    const scorePatterns = {
      ai_tone: /【AI腔检测】:\s*([\d.]+)分/,
      naturalness: /【自然度】:\s*([\d.]+)分/,
      sincerity: /【真诚度】:\s*([\d.]+)分/,
      verbosity: /【啰嗦度】:\s*([\d.]+)分/,
      repetition: /【重复度】:\s*([\d.]+)%/,
      readability: /【可读性】:\s*([\d.]+)分/,
      humanity: /【人味儿指数】:\s*([\d.]+)分/,
      emotion: /【情感真实性】:\s*([\d.]+)分/,
      profanity: /【脏话检测】:\s*(\d+)处/
    };

    for (const [key, pattern] of Object.entries(scorePatterns)) {
      const match = output.match(pattern);
      if (match) {
        const value = parseFloat(match[1]);
        scores[key] = value;
      }
    }

    // 解析总分（计算平均分）
    const scoreValues = Object.values(scores) as number[];
    if (scoreValues.length > 0) {
      totalScore = Math.round(scoreValues.reduce((a: number, b: number) => a + b, 0) / scoreValues.length);
    }

    // 判断是否通过
    isPassed = totalScore >= 70 && scores.profanity === 0;

    // 提取建议
    const suggestionStart = output.indexOf('改进建议：');
    if (suggestionStart !== -1) {
      const suggestionText = output.substring(suggestionStart);
      const lines = suggestionText.split('\n').slice(1);
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && trimmed.match(/^[•\-\d\.]/)) {
          suggestions.push(trimmed.replace(/^[•\-\d\.\s]+/, ''));
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        scores,
        totalScore,
        isPassed,
        suggestions: suggestions.length > 0 ? suggestions : ['文章质量良好，保持当前风格'],
        report: isPassed ? '✅ 质检通过' : '⚠️ 质检未通过，请根据建议优化',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('质检API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '质量检测失败',
      details: error.stack
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: '请使用POST方法并提供文章内容'
  }, { status: 405 });
}
