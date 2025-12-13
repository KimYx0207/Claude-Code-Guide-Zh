@echo off
chcp 65001 >nul
REM PostToolUse Hook - 自动格式修复 (Windows版)
REM 功能：在Write工具保存articles目录下的文章后，自动运行格式修复
REM V6.1.0 - 统一版本

setlocal EnableDelayedExpansion

REM 读取stdin的JSON输入到临时文件
set "TEMP_FILE=%TEMP%\hook_input_%RANDOM%.json"
more > "%TEMP_FILE%"

REM 使用Python处理
python -c "
import sys
import json
import os
from pathlib import Path

# 设置编码
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# 从临时文件读取JSON
temp_file = r'%TEMP_FILE%'
try:
    with open(temp_file, 'r', encoding='utf-8') as f:
        json_str = f.read()
except:
    sys.exit(0)

if not json_str.strip():
    sys.exit(0)

# 解析JSON
try:
    hook_input = json.loads(json_str)
except json.JSONDecodeError:
    sys.exit(0)

# 获取工具名称和文件路径
tool_name = hook_input.get('tool_name', '')
tool_input_data = hook_input.get('tool_input', {})
file_path = tool_input_data.get('file_path', '')

# 规范化路径（处理Windows反斜杠）
file_path_normalized = file_path.replace('\\', '/').replace('//', '/')

# 检查是否是Write工具 + articles目录 + .md文件
if tool_name == 'Write' and '/articles/' in file_path_normalized and file_path.endswith('.md'):
    print(f'检测到保存文章：{file_path}')
    print('正在执行格式智能修复...')

    # 获取项目根目录
    project_root = Path(os.getenv('CLAUDE_PROJECT_DIR', os.getcwd()))
    scripts_dir = project_root / '.claude/skills/gongzhonghao-writer/scripts'

    sys.path.insert(0, str(scripts_dir))

    try:
        from fix_article_format import smart_fix_article

        article_path = Path(file_path)
        if article_path.exists():
            with open(article_path, 'r', encoding='utf-8') as f:
                content = f.read()

            fixed_content = smart_fix_article(content)

            with open(article_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)

            print('格式修复完成')
        else:
            print(f'[WARN] 文件不存在：{file_path}', file=sys.stderr)

    except ImportError:
        # fix_article_format模块不存在，跳过格式修复
        print('[INFO] 格式修复模块未安装，跳过')
    except Exception as e:
        print(f'[ERROR] 格式修复失败：{e}', file=sys.stderr)

sys.exit(0)
"

REM 清理临时文件
if exist "%TEMP_FILE%" del "%TEMP_FILE%"

exit /b 0
