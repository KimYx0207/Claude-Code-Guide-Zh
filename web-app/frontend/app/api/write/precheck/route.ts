/**
 * 发文前检查API - 8维度最终检查
 * 确保文章符合所有爆款标准和质量要求
 *
 * 调用真实的Python脚本：pre_publish_checker.py
 */

import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({
        success: false,
        error: '请提供标题和文章内容'
      }, { status: 400 });
    }

    const projectRoot = path.join(process.cwd(), '..', '..');
    const scriptDir = path.join(projectRoot, '.claude', 'skills', 'gongzhonghao-writer', 'scripts', 'core');
    const scriptPath = path.join(scriptDir, 'pre_publish_checker.py');

    // 创建临时文件
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `precheck_${Date.now()}.md`);
    const articleContent = `# ${title}\n\n${content}`;
    await fs.writeFile(tempFilePath, articleContent, 'utf-8');

    try {
      // 执行Python发文前检查脚本
      const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath, tempFilePath], {
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

        pythonProcess.on('close', async (code) => {
          // 清理临时文件
          try {
            await fs.unlink(tempFilePath);
          } catch (e) {
            console.warn('清理临时文件失败:', e);
          }

          if (code === 0) {
            resolve({ stdout, stderr });
          } else {
            reject(new Error(`发文前检查失败，退出码: ${code}\n${stderr}`));
          }
        });

        pythonProcess.on('error', async (error) => {
          try {
            await fs.unlink(tempFilePath);
          } catch (e) {}
          reject(error);
        });
      });

      // 解析Python脚本输出（8维度检查）
      const output = result.stdout;
      const checks: any[] = [];

      // 解析各维度检查结果
      const checkPatterns = [
        { dimension: '品牌词', pattern: /【品牌词】:\s*(\d+)\/\d+分\s*(.+)/ },
        { dimension: '动作词', pattern: /【动作词】:\s*(\d+)\/\d+分\s*(.+)/ },
        { dimension: '效率词', pattern: /【效率词】:\s*(\d+)\/\d+分\s*(.+)/ },
        { dimension: '问题解决', pattern: /【问题解决】:\s*(\d+)\/\d+分\s*(.+)/ },
        { dimension: '标题长度', pattern: /【标题长度】:\s*(\d+)\/\d+分\s*(.+)/ },
        { dimension: '字数要求', pattern: /【字数】:\s*(\d+)\/\d+分\s*(.+)/ },
        { dimension: '可读性', pattern: /【可读性】:\s*(\d+)\/\d+分\s*(.+)/ },
        { dimension: '格式规范', pattern: /【格式】:\s*(\d+)\/\d+分\s*(.+)/ }
      ];

      checkPatterns.forEach(({ dimension, pattern }) => {
        const match = output.match(pattern);
        if (match) {
          const score = parseInt(match[1]);
          const message = match[2].trim();
          checks.push({
            dimension,
            score,
            status: message.includes('✅'),
            message
          });
        }
      });

      // 解析总分
      const totalMatch = output.match(/总分:\s*(\d+)\/100分/);
      const totalScore = totalMatch ? parseInt(totalMatch[1]) : 0;

      // 解析通过状态
      const passedMatch = output.match(/状态:\s*(.+)/);
      const isPassed = passedMatch ? passedMatch[1].includes('✅') : false;

      // 解析建议
      const suggestions: string[] = [];
      const suggestionMatches = output.matchAll(/💡\s*(.+)/g);
      for (const match of suggestionMatches) {
        suggestions.push(match[1].trim());
      }

      return NextResponse.json({
        success: true,
        message: '发文前检查完成',
        data: {
          summary: {
            totalChecks: checks.length,
            passedChecks: checks.filter(c => c.status).length,
            totalScore,
            avgScore: checks.length > 0 ? Math.round(totalScore / checks.length) : 0,
            isPassed,
            result: isPassed ? '✅ 可以发布' : '⚠️ 建议修改后发布'
          },
          checks,
          suggestions,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error: any) {
      // 清理临时文件
      try {
        await fs.unlink(tempFilePath);
      } catch (e) {}
      throw error;
    }

  } catch (error: any) {
    console.error('发文前检查API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '发文前检查失败',
      details: error.stack
    }, { status: 500 });
  }
}
