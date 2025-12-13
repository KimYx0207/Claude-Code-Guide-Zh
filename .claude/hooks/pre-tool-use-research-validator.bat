@echo off
chcp 65001 >nul
REM PreToolUse Hook - Research步骤验证 (Windows版)
REM 功能：在Write/Edit articles目录前，提示完成research
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

# 只处理Write和Edit工具
if tool_name not in ['Write', 'Edit']:
    sys.exit(0)

# 规范化路径（处理Windows反斜杠）
file_path_normalized = file_path.replace('\\', '/').replace('//', '/')

# 只检查articles目录
if '/articles/' not in file_path_normalized:
    sys.exit(0)

print()
print('='*50)
print('Research步骤验证检查')
print('='*50)
print()

article_path = Path(file_path)
if not article_path.exists():
    print('检测到新文章创建操作')
    print()
    print('智能提示：建议完成Research步骤以提高文章质量')
    print()
    print('推荐使用以下工具（至少2个）：')
    print()
    print('1. 优先使用MCP工具：')
    print('   - mcp__mcp-router__search (免费无限)')
    print('   - mcp__mcp-router__brave_web_search')
    print('   - mcp__context7__get_library_docs')
    print()
    print('2. 备选内置工具：')
    print('   - WebSearch')
    print('   - WebFetch')
    print()
    print('='*50)
    print('提示：使用/gongzhonghao命令可自动完成Research')
    print('='*50)
    print()

sys.exit(0)
"

REM 清理临时文件
if exist "%TEMP_FILE%" del "%TEMP_FILE%"

exit /b 0
