import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function POST(request: Request) {
  try {
    const { filePath } = await request.json();

    if (!filePath) {
      return NextResponse.json(
        { success: false, error: '缺少文件路径' },
        { status: 400 }
      );
    }

    // 构建完整路径
    const fullPath = path.join(process.cwd(), '..', '..', filePath);

    // 安全检查：确保路径在docs目录内
    const normalizedPath = path.normalize(fullPath);
    const docsPath = path.join(process.cwd(), '..', '..', 'docs');

    if (!normalizedPath.startsWith(docsPath)) {
      return NextResponse.json(
        { success: false, error: '非法路径' },
        { status: 403 }
      );
    }

    // 读取文件内容
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json(
        { success: false, error: '文件不存在' },
        { status: 404 }
      );
    }

    const content = fs.readFileSync(fullPath, 'utf-8');

    return NextResponse.json({
      success: true,
      data: {
        content
      }
    });
  } catch (error) {
    console.error('读取文档失败:', error);
    return NextResponse.json(
      { success: false, error: '读取文档失败' },
      { status: 500 }
    );
  }
}
