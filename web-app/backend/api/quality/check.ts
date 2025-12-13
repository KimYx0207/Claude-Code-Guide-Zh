/**
 * 质量检测API接口
 * 调用Python脚本quality_detector.py，返回9维度评分
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

interface QualityCheckRequest {
  content?: string;   // 文章内容（直接检测）
  filePath?: string;  // 或文件路径（读取后检测）
}

interface QualityScores {
  ai_tone: number;        // AI腔检测 (<20分)
  naturalness: number;    // 自然度 (>80分)
  sincerity: number;      // 真诚度 (>75分)
  verbosity: number;      // 啰嗦度 (<25分)
  repetition: number;     // 重复度 (<15%)
  readability: number;    // 可读性 (>85分)
  humanity: number;       // 人味儿指数 (>70分)
  emotion: number;        // 情感真实性 (>75分)
  profanity: number;      // 脏话数量 (=0)
}

interface QualityCheckResult {
  scores: QualityScores;
  totalScore: number;
  isPassed: boolean;
  suggestions: string[];
  report: string;
}

export async function POST(request: Request) {
  try {
    const body: QualityCheckRequest = await request.json();
    const { content, filePath } = body;

    if (!content && !filePath) {
      return Response.json({
        success: false,
        error: '必须提供content或filePath参数'
      }, { status: 400 });
    }

    // 构建Python脚本路径
    const projectRoot = path.join(process.cwd(), '..', '..');
    const scriptPath = path.join(
      projectRoot,
      '.claude',
      'skills',
      'gongzhonghao-writer',
      'scripts',
      'core',
      'quality_detector.py'
    );

    // 检查脚本是否存在
    try {
      await fs.access(scriptPath);
    } catch {
      return Response.json({
        success: false,
        error: `质检脚本不存在: ${scriptPath}`
      }, { status: 500 });
    }

    let result: QualityCheckResult;

    if (filePath) {
      // 通过文件路径检测
      const fullPath = path.join(projectRoot, filePath);
      const command = `python "${scriptPath}" "${fullPath}"`;

      const { stdout, stderr } = await execAsync(command, {
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024 // 10MB
      });

      if (stderr && !stderr.includes('warning')) {
        throw new Error(`Python脚本错误: ${stderr}`);
      }

      result = parseQualityOutput(stdout);
    } else {
      // 通过内容检测
      // 创建临时文件
      const tempDir = path.join(projectRoot, 'data', 'temp');
      await fs.mkdir(tempDir, { recursive: true });

      const tempFile = path.join(tempDir, `temp_${Date.now()}.md`);
      await fs.writeFile(tempFile, content, 'utf-8');

      try {
        const command = `python "${scriptPath}" "${tempFile}"`;
        const { stdout, stderr } = await execAsync(command, {
          encoding: 'utf-8',
          maxBuffer: 10 * 1024 * 1024
        });

        if (stderr && !stderr.includes('warning')) {
          throw new Error(`Python脚本错误: ${stderr}`);
        }

        result = parseQualityOutput(stdout);
      } finally {
        // 清理临时文件
        await fs.unlink(tempFile).catch(() => {});
      }
    }

    return Response.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('质检API错误:', error);
    return Response.json({
      success: false,
      error: error.message || '质检失败'
    }, { status: 500 });
  }
}

/**
 * 解析Python脚本输出
 */
function parseQualityOutput(output: string): QualityCheckResult {
  // quality_detector.py输出格式解析
  // TODO: 根据实际Python脚本输出格式调整

  const lines = output.split('\n');
  const scores: QualityScores = {
    ai_tone: 0,
    naturalness: 0,
    sincerity: 0,
    verbosity: 0,
    repetition: 0,
    readability: 0,
    humanity: 0,
    emotion: 0,
    profanity: 0
  };

  let totalScore = 0;
  let isPassed = false;
  const suggestions: string[] = [];

  // 解析输出
  for (const line of lines) {
    // AI腔检测
    if (line.includes('AI腔检测')) {
      const match = line.match(/(\d+)分/);
      if (match) scores.ai_tone = parseInt(match[1]);
    }
    // 自然度
    if (line.includes('自然度')) {
      const match = line.match(/(\d+)分/);
      if (match) scores.naturalness = parseInt(match[1]);
    }
    // 真诚度
    if (line.includes('真诚度')) {
      const match = line.match(/(\d+)分/);
      if (match) scores.sincerity = parseInt(match[1]);
    }
    // 啰嗦度
    if (line.includes('啰嗦度')) {
      const match = line.match(/(\d+)分/);
      if (match) scores.verbosity = parseInt(match[1]);
    }
    // 重复度
    if (line.includes('重复度')) {
      const match = line.match(/(\d+\.?\d*)%/);
      if (match) scores.repetition = parseFloat(match[1]);
    }
    // 可读性
    if (line.includes('可读性')) {
      const match = line.match(/(\d+)分/);
      if (match) scores.readability = parseInt(match[1]);
    }
    // 人味儿指数
    if (line.includes('人味儿指数')) {
      const match = line.match(/(\d+)分/);
      if (match) scores.humanity = parseInt(match[1]);
    }
    // 情感真实性
    if (line.includes('情感真实性')) {
      const match = line.match(/(\d+)分/);
      if (match) scores.emotion = parseInt(match[1]);
    }
    // 脏话检测
    if (line.includes('脏话检测')) {
      const match = line.match(/(\d+)处/);
      if (match) scores.profanity = parseInt(match[1]);
    }
    // 总分
    if (line.includes('综合评分') || line.includes('总分')) {
      const match = line.match(/(\d+)分/);
      if (match) totalScore = parseInt(match[1]);
    }
    // 是否通过
    if (line.includes('✅') && line.includes('通过')) {
      isPassed = true;
    }
    if (line.includes('❌') && line.includes('不通过')) {
      isPassed = false;
    }
    // 建议
    if (line.includes('建议') || line.includes('💡')) {
      const suggestion = line.replace(/^[•\-\*]\s*/, '').trim();
      if (suggestion && !suggestion.includes('建议：')) {
        suggestions.push(suggestion);
      }
    }
  }

  return {
    scores,
    totalScore,
    isPassed,
    suggestions,
    report: output
  };
}
