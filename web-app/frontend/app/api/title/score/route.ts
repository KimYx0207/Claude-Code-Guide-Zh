import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

/**
 * 标题评分API
 * 对应CLI命令：/title-score
 *
 * 调用 scripts/core/title_scorer.py
 * 7维度评分：
 * 1. 品牌词（Kimi/Claude/Cursor等）
 * 2. 动作词（试了/用了/装了等）
 * 3. 效率词（一键/半年/3秒等）
 * 4. 问题解决词（怎么/为什么/原来等）
 * 5. 数字（数字和量词）
 * 6. 版本号（v1.0/2.0等）
 * 7. 标题长度（建议18-30字）
 */
export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { success: false, error: '缺少必填参数: title' },
        { status: 400 }
      );
    }

    const projectRoot = path.join(process.cwd(), '..', '..');
    const scriptDir = path.join(projectRoot, '.claude', 'skills', 'gongzhonghao-writer', 'scripts', 'core');
    const scriptPath = path.join(scriptDir, 'title_scorer.py');

    // 执行Python标题评分脚本
    const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const pythonProcess = spawn('python', [scriptPath, title], {
        cwd: scriptDir,
        timeout: 15000,
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
          reject(new Error(`标题评分失败，退出码: ${code}\n${stderr}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(error);
      });
    });

    // 解析Python脚本输出
    const output = result.stdout;
    const scores: any = {};

    // 解析各维度分数
    const dimensionPatterns = {
      brand: /【品牌词】:\s*([\d.]+)分/,
      action: /【动作词】:\s*([\d.]+)分/,
      efficiency: /【效率词】:\s*([\d.]+)分/,
      problem: /【问题解决】:\s*([\d.]+)分/,
      number: /【数字】:\s*([\d.]+)分/,
      version: /【版本号】:\s*([\d.]+)分/,
      length: /【标题长度】:\s*([\d.]+)分/
    };

    for (const [key, pattern] of Object.entries(dimensionPatterns)) {
      const match = output.match(pattern);
      if (match) {
        scores[key] = parseFloat(match[1]);
      }
    }

    // 解析总分
    const totalMatch = output.match(/【总分】:\s*([\d.]+)分/);
    const totalScore = totalMatch ? parseFloat(totalMatch[1]) : 0;

    // 解析爆款潜力
    const potentialMatch = output.match(/【爆款潜力】:\s*(.+)/);
    const boomPotential = potentialMatch ? potentialMatch[1].trim() : '未知';

    // 解析建议
    const suggestions: string[] = [];
    const suggestionMatches = output.matchAll(/💡\s*(.+)/g);
    for (const match of suggestionMatches) {
      suggestions.push(match[1].trim());
    }

    return NextResponse.json({
      success: true,
      message: '标题评分完成',
      data: {
        title,
        scores,
        totalScore,
        boomPotential,
        suggestions,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('标题评分API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '标题评分失败',
      details: error.stack
    }, { status: 500 });
  }
}
