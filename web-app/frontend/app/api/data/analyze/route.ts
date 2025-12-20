/**
 * 数据分析API - 调用真实Python脚本
 * 深度分析微信公众号文章数据，生成爆款规律报告
 */

import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const projectRoot = path.join(process.cwd(), '..', '..');
    const scriptDir = path.join(projectRoot, '.claude', 'skills', 'gongzhonghao-writer', 'scripts');
    const scriptPath = path.join(scriptDir, 'analyze_wechat_data.py');

    // 检查脚本是否存在
    try {
      await fs.access(scriptPath);
    } catch {
      return NextResponse.json({
        success: false,
        error: '数据分析脚本不存在',
        path: scriptPath
      }, { status: 500 });
    }

    // 检查数据文件是否存在
    const dataPath = path.join(projectRoot, 'data', 'wechat_articles.json');
    try {
      await fs.access(dataPath);
    } catch {
      return NextResponse.json({
        success: false,
        error: '数据文件不存在，请先执行数据收集',
        hint: '点击"收集数据"按钮后再分析'
      }, { status: 400 });
    }

    // 执行Python分析脚本
    const result = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      const pythonProcess = spawn('python', [scriptPath], {
        cwd: scriptDir,
        timeout: 120000, // 120秒超时
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
          reject(new Error(`Python脚本执行失败，退出码: ${code}\n${stderr}`));
        }
      });

      pythonProcess.on('error', (error) => {
        reject(error);
      });
    });

    // 读取生成的分析报告
    const reportPath = path.join(projectRoot, 'data', 'rule_validation_report.json');
    let analysisReport = null;

    try {
      const reportContent = await fs.readFile(reportPath, 'utf-8');
      analysisReport = JSON.parse(reportContent);
    } catch (error) {
      console.warn('无法读取分析报告:', error);
    }

    return NextResponse.json({
      success: true,
      message: '数据分析完成',
      data: {
        report: analysisReport,
        timestamp: new Date().toISOString(),
        output: result.stdout.split('\n').slice(-20).join('\n'), // 只返回最后20行输出
        reportPath: reportPath
      }
    });

  } catch (error: any) {
    console.error('数据分析API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '数据分析失败',
      details: error.stack
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // GET方法：读取最新的分析报告
  try {
    const projectRoot = path.join(process.cwd(), '..', '..');
    const reportPath = path.join(projectRoot, 'data', 'rule_validation_report.json');

    const reportContent = await fs.readFile(reportPath, 'utf-8');
    const report = JSON.parse(reportContent);

    return NextResponse.json({
      success: true,
      data: report
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: '未找到分析报告，请先执行数据分析'
    }, { status: 404 });
  }
}
