/**
 * 批量质检API接口
 * 批量检测多篇文章，返回汇总报告
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

interface BatchCheckRequest {
  articleIds: string[];  // 文章ID列表（文件名）
}

interface ArticleCheckResult {
  articleId: string;
  title: string;
  totalScore: number;
  isPassed: boolean;
  status: 'passed' | 'warning' | 'failed';
  criticalIssues: string[];  // 关键问题
}

interface BatchCheckSummary {
  total: number;
  passed: number;
  warning: number;
  failed: number;
  results: ArticleCheckResult[];
  priorityFixes: ArticleCheckResult[];  // 优先修复列表
}

export async function POST(request: Request) {
  try {
    const body: BatchCheckRequest = await request.json();
    const { articleIds } = body;

    if (!articleIds || articleIds.length === 0) {
      return Response.json({
        success: false,
        error: '必须提供articleIds参数'
      }, { status: 400 });
    }

    const projectRoot = path.join(process.cwd(), '..', '..');
    const articlesDir = path.join(projectRoot, 'articles', 'drafts');
    const scriptPath = path.join(
      projectRoot,
      '.claude',
      'skills',
      'gongzhonghao-writer',
      'scripts',
      'core',
      'quality_detector.py'
    );

    const results: ArticleCheckResult[] = [];
    let passed = 0;
    let warning = 0;
    let failed = 0;

    // 逐篇检测
    for (const articleId of articleIds) {
      try {
        const filePath = path.join(articlesDir, articleId);

        // 检查文件是否存在
        await fs.access(filePath);

        // 调用质检脚本
        const command = `python "${scriptPath}" "${filePath}"`;
        const { stdout } = await execAsync(command, {
          encoding: 'utf-8',
          maxBuffer: 10 * 1024 * 1024
        });

        // 解析结果
        const parsed = parseQualityOutput(stdout);
        const criticalIssues = extractCriticalIssues(parsed);

        // 判断状态
        let status: 'passed' | 'warning' | 'failed';
        if (parsed.isPassed) {
          status = 'passed';
          passed++;
        } else if (parsed.totalScore >= 60) {
          status = 'warning';
          warning++;
        } else {
          status = 'failed';
          failed++;
        }

        results.push({
          articleId,
          title: extractTitle(articleId),
          totalScore: parsed.totalScore,
          isPassed: parsed.isPassed,
          status,
          criticalIssues
        });

      } catch (error: any) {
        // 单篇文章检测失败，记录但继续
        results.push({
          articleId,
          title: extractTitle(articleId),
          totalScore: 0,
          isPassed: false,
          status: 'failed',
          criticalIssues: [`检测失败: ${error.message}`]
        });
        failed++;
      }
    }

    // 生成优先修复列表（按问题严重性排序）
    const priorityFixes = results
      .filter(r => !r.isPassed)
      .sort((a, b) => a.totalScore - b.totalScore);  // 分数越低越优先

    const summary: BatchCheckSummary = {
      total: articleIds.length,
      passed,
      warning,
      failed,
      results,
      priorityFixes
    };

    return Response.json({
      success: true,
      data: summary
    });

  } catch (error: any) {
    console.error('批量质检API错误:', error);
    return Response.json({
      success: false,
      error: error.message || '批量质检失败'
    }, { status: 500 });
  }
}

/**
 * 解析Python脚本输出
 */
function parseQualityOutput(output: string): any {
  const lines = output.split('\n');
  const scores: any = {};
  let totalScore = 0;
  let isPassed = false;

  for (const line of lines) {
    // 提取各维度分数
    if (line.includes('AI腔检测')) {
      const match = line.match(/(\d+)分/);
      if (match) scores.ai_tone = parseInt(match[1]);
    }
    if (line.includes('自然度')) {
      const match = line.match(/(\d+)分/);
      if (match) scores.naturalness = parseInt(match[1]);
    }
    if (line.includes('综合评分') || line.includes('总分')) {
      const match = line.match(/(\d+)分/);
      if (match) totalScore = parseInt(match[1]);
    }
    if (line.includes('✅') && line.includes('通过')) {
      isPassed = true;
    }
  }

  return { scores, totalScore, isPassed };
}

/**
 * 提取关键问题
 */
function extractCriticalIssues(parsed: any): string[] {
  const issues: string[] = [];

  if (parsed.scores.ai_tone > 20) {
    issues.push(`AI腔过高（${parsed.scores.ai_tone}分>20分）`);
  }
  if (parsed.scores.naturalness < 80) {
    issues.push(`自然度不足（${parsed.scores.naturalness}分<80分）`);
  }
  if (parsed.scores.profanity > 0) {
    issues.push(`检测到脏话（${parsed.scores.profanity}处）`);
  }

  return issues;
}

/**
 * 从文件名提取标题
 */
function extractTitle(fileName: string): string {
  // 文件名格式: YYYY-MM-DD_[分类]_[时效]_[品牌]_标题.md
  const parts = fileName.replace('.md', '').split('_');
  if (parts.length >= 5) {
    return parts.slice(4).join('_');  // 提取标题部分
  }
  return fileName;
}
