#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
WebUI自动构建Hook
触发时机：Edit/Write工具调用后
功能：检测web-app目录文件变更，自动触发Next.js构建

使用：
    python webui-auto-build.py < hook_input.json
"""

import sys
import json
import os
import subprocess
from pathlib import Path

def should_trigger_build(file_path: str, tool_name: str) -> bool:
    """
    判断是否需要触发构建

    Args:
        file_path: 修改的文件路径
        tool_name: 工具名称

    Returns:
        True: 需要构建
        False: 不需要构建
    """
    # 只处理Edit和Write工具
    if tool_name not in ['Edit', 'Write']:
        return False

    # 规范化路径
    file_path_normalized = file_path.replace('\\', '/').replace('//', '/')

    # 只处理web-app目录下的文件
    if 'web-app/' not in file_path_normalized:
        return False

    # 排除不需要构建的文件类型
    excluded_extensions = ['.md', '.txt', '.json', '.log', '.lock']
    if any(file_path.endswith(ext) for ext in excluded_extensions):
        return False

    # 必须是webUI核心文件
    core_paths = [
        'web-app/frontend/app/',
        'web-app/frontend/components/',
        'web-app/frontend/public/',
        'web-app/frontend/styles/'
    ]

    return any(path in file_path_normalized for path in core_paths)

def trigger_build():
    """触发Next.js构建"""
    try:
        # 获取项目根目录
        root = subprocess.check_output(
            ['git', 'rev-parse', '--show-toplevel'],
            text=True,
            stderr=subprocess.DEVNULL
        ).strip()

        frontend_dir = os.path.join(root, 'web-app', 'frontend')

        if not os.path.exists(frontend_dir):
            print('❌ web-app/frontend目录不存在')
            return 1

        # 检查dev server是否在运行（Windows使用netstat）
        try:
            if os.name == 'nt':  # Windows
                result = subprocess.run(
                    ['netstat', '-ano'],
                    capture_output=True,
                    text=True,
                    timeout=2
                )
                dev_running = ':3000' in result.stdout and 'LISTENING' in result.stdout
            else:  # Unix/Linux/Mac
                result = subprocess.run(
                    ['lsof', '-ti:3000'],
                    capture_output=True,
                    timeout=2
                )
                dev_running = result.returncode == 0
        except:
            dev_running = False

        if dev_running:
            print('ℹ️  Dev服务器正在运行（端口3000），跳过构建')
            print('💡 开发模式会自动热重载，无需手动构建')
            print('💡 如需生产构建，请手动运行：cd web-app/frontend && npm run build')
            return 0

        # Dev server未运行，执行构建
        print('🚀 开始Next.js生产构建...')
        print(f'📁 构建目录：{frontend_dir}')

        # 执行npm run build
        result = subprocess.run(
            ['npm', 'run', 'build'],
            cwd=frontend_dir,
            capture_output=True,
            text=True,
            timeout=120
        )

        if result.returncode == 0:
            print('✅ 构建成功！')
            print('💡 启动生产服务器：cd web-app/frontend && npm start')
            # 只显示最后20行输出
            output_lines = result.stdout.split('\n')
            for line in output_lines[-20:]:
                if line.strip():
                    print(line)
        else:
            print('❌ 构建失败！')
            print(result.stderr)
            return 1

        return 0

    except subprocess.TimeoutExpired:
        print('❌ 构建超时（120秒）')
        return 1
    except Exception as e:
        print(f'❌ 构建错误：{e}')
        return 1

def main():
    """主函数"""
    try:
        # 读取hook输入（JSON格式）
        hook_input = json.load(sys.stdin)

        # 提取工具信息
        tool_name = hook_input.get('tool_name', '')
        tool_input_data = hook_input.get('tool_input', {})
        file_path = tool_input_data.get('file_path', '')

        # 判断是否需要构建
        if not should_trigger_build(file_path, tool_name):
            return 0

        print(f'🔨 检测到WebUI文件变更：{file_path}')
        print('📦 自动触发构建检查...')

        # 触发构建
        return trigger_build()

    except json.JSONDecodeError:
        # 如果没有JSON输入，静默退出
        return 0
    except Exception as e:
        print(f'Hook错误：{e}', file=sys.stderr)
        return 0  # 不阻塞主流程

if __name__ == '__main__':
    sys.exit(main())

