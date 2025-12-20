/**
 * 批量质检API - 真实实现
 * 调用真实的Python质检脚本：quality_detector.py
 */

import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

interface QualityResult {
  articleId: string;
  title: string;
  totalScore: number;
  isPassed: boolean;
  status: 'passed' | 'warning' | 'failed';
  criticalIssues: string[];
  scores?: {
    ai_tone: number;
    naturalness: number;
    sincerity: number;
    verbosity: number;
    repetition: number;
    readability: number;
    humanity: number;
    emotion: number;
    profanity: number;
  };
}

async function checkSingleArticle(articleId: string, projectRoot: string): Promise<QualityResult> {
  const scriptDir = path.join(projectRoot, '.claude', 'skills', 'gongzhonghao-writer', 'scripts', 'core');
  const scriptPath = path.join(scriptDir, 'quality_detector.py');

  // 根据articleId判断文章路径
  let filePath: string;
  const draftPath = path.join(projectRoot, 'articles', 'drafts', articleId);
  const publishedPath = path.join(projectRoot, 'articles', 'published', articleId);

  try {
    await fs.access(draftPath);
    filePath = draftPath;
  } catch {
    try {
      await fs.access(publishedPath);
      filePath = publishedPath;
    } catch {
      throw new Error(`文章不存在: ${articleId}`);
    }
  }

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [scriptPath, filePath], {
      cwd: scriptDir,
      timeout: 30000,
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
      if (code !== 0) {
        reject(new Error(`质检失败: ${stderr || '未知错误'}`));
        return;
      }

      try {
        // 解析Python输出
        const output = stdout;

        // 提取总分
        const totalScoreMatch = output.match(/总分:\s*(\d+)/);
        const totalScore = totalScoreMatch ? parseInt(totalScoreMatch[1]) : 0;

        // 提取是否通过
        const isPassed = totalScore >= 70;

        // 提取状态
        let status: 'passed' | 'warning' | 'failed';
        if (totalScore >= 70) status = 'passed';
        else if (totalScore >= 60) status = 'warning';
        else status = 'failed';

        // 提取关键问题
        const criticalIssues: string[] = [];
        if (output.includes('AI腔过高')) criticalIssues.push('AI腔过高');
        if (output.includes('啰嗦')) criticalIssues.push('内容啰嗦');
        if (output.includes('重复')) criticalIssues.push('重复内容过多');
        if (output.includes('脏话')) criticalIssues.push('包含脏话');

        // 提取详细评分（可选）
        const scores = {
          ai_tone: extractScore(output, 'AI腔') || 0,
          naturalness: extractScore(output, '自然度') || 0,
          sincerity: extractScore(output, '真诚度') || 0,
          verbosity: extractScore(output, '啰嗦度') || 0,
          repetition: extractScore(output, '重复度') || 0,
          readability: extractScore(output, '可读性') || 0,
          humanity: extractScore(output, '人味儿') || 0,
          emotion: extractScore(output, '情感') || 0,
          profanity: extractScore(output, '脏话') || 0,
        };

        resolve({
          articleId,
          title: articleId,
          totalScore,
          isPassed,
          status,
          criticalIssues,
          scores
        });

      } catch (parseError: any) {
        reject(new Error(`解析质检结果失败: ${parseError.message}`));
      }
    });

    pythonProcess.on('error', (error) => {
      reject(error);
    });
  });
}

function extractScore(output: string, label: string): number | null {
  const pattern = new RegExp(`${label}[:：]\\s*(\\d+)`);
  const match = output.match(pattern);
  return match ? parseInt(match[1]) : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleIds } = body;

    if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: '必须提供有效的articleIds数组'
      }, { status: 400 });
    }

    const projectRoot = path.join(process.cwd(), '..', '..');

    console.log(`开始批量质检 ${articleIds.length} 篇文章...`);

    // 并发执行质检（限制并发数为3）
    const results: QualityResult[] = [];
    const batchSize = 3;

    for (let i = 0; i < articleIds.length; i += batchSize) {
      const batch = articleIds.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(id => checkSingleArticle(id, projectRoot))
      );

      batchResults.forEach((result, idx) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          console.error(`文章 ${batch[idx]} 质检失败:`, result.reason);
          // 添加失败结果
          results.push({
            articleId: batch[idx],
            title: batch[idx],
            totalScore: 0,
            isPassed: false,
            status: 'failed',
            criticalIssues: ['质检失败: ' + result.reason.message]
          });
        }
      });
    }

    // 计算汇总统计
    const passed = results.filter(r => r.status === 'passed').length;
    const warning = results.filter(r => r.status === 'warning').length;
    const failed = results.filter(r => r.status === 'failed').length;

    // 优先修改建议（按分数排序）
    const priorityFixes = results
      .filter(r => !r.isPassed)
      .sort((a, b) => a.totalScore - b.totalScore)
      .slice(0, 5);  // 最多显示5个

    const summary = {
      total: articleIds.length,
      passed,
      warning,
      failed,
      results,
      priorityFixes,
      timestamp: new Date().toISOString()
    };

    console.log(`批量质检完成：通过${passed}篇，警告${warning}篇，不通过${failed}篇`);

    return NextResponse.json({
      success: true,
      message: '批量质检完成',
      data: summary
    });

  } catch (error: any) {
    console.error('批量质检API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '批量质检失败',
      details: error.stack
    }, { status: 500 });
  }
}
