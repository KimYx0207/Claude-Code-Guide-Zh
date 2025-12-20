/**
 * API统一响应格式工具
 * 包含错误处理、Python脚本执行封装
 */

import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  error: string | null;
  hint?: string;
  details?: string;
}

export function successResponse<T>(data: T, message: string = "成功"): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    error: null
  };
}

export function errorResponse(
  error: string,
  hint?: string,
  details?: string
): ApiResponse<null> {
  return {
    success: false,
    message: "失败",
    data: null,
    error,
    hint,
    details
  };
}

/**
 * 统一错误处理包装器
 */
export function handleApiError(error: any, context: string = 'API') {
  console.error(`${context}错误:`, error);

  const errorMessage = error.message || '未知错误';
  const statusCode = error.statusCode || 500;

  return NextResponse.json({
    success: false,
    error: errorMessage,
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined
  }, { status: statusCode });
}

/**
 * Python脚本执行配置
 */
export interface PythonScriptConfig {
  scriptName: string;
  args: string[];
  timeout?: number;
  cwd?: string;
}

/**
 * 统一执行Python脚本
 */
export async function executePythonScript(config: PythonScriptConfig): Promise<{ stdout: string; stderr: string }> {
  const { scriptName, args, timeout = 30000 } = config;

  const projectRoot = path.join(process.cwd(), '..', '..');
  const scriptDir = path.join(projectRoot, '.claude', 'skills', 'gongzhonghao-writer', 'scripts', 'core');
  const scriptPath = path.join(scriptDir, scriptName);

  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [scriptPath, ...args], {
      cwd: config.cwd || scriptDir,
      timeout,
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
        const error = new Error(`脚本执行失败，退出码: ${code}\n${stderr}`);
        (error as any).exitCode = code;
        reject(error);
      }
    });

    pythonProcess.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * API处理包装器 - 统一错误处理
 */
export function withErrorHandler(handler: Function, context: string) {
  return async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (error: any) {
      return handleApiError(error, context);
    }
  };
}
