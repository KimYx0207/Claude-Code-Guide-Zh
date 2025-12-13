import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const docsBasePath = path.join(process.cwd(), '..', '..', 'docs', '课程资料包');

    // 读取目录结构
    const folders = fs.readdirSync(docsBasePath, { withFileTypes: true })
      .filter(item => item.isDirectory())
      .sort((a, b) => a.name.localeCompare(b.name));

    const tree = folders.map(folder => {
      const folderPath = path.join(docsBasePath, folder.name);
      const files = fs.readdirSync(folderPath)
        .filter(file => file.endsWith('.md'))
        .sort();

      return {
        name: folder.name,
        path: `docs/课程资料包/${folder.name}`,
        files: files
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        tree
      }
    });
  } catch (error) {
    console.error('读取文档树失败:', error);
    return NextResponse.json(
      { success: false, error: '读取文档树失败' },
      { status: 500 }
    );
  }
}
