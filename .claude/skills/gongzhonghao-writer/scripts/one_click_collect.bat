@echo off
chcp 65001 >nul
echo ============================================================
echo 微信公众号数据一键收集
echo ============================================================
echo.

REM 检查 Chrome 是否已在调试模式运行
tasklist /FI "IMAGENAME eq chrome.exe" 2>NUL | find /I /N "chrome.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [INFO] Chrome 已在运行，尝试连接...
    goto COLLECT
)

echo [Step 1] 启动 Chrome 调试模式...
echo.

REM 关闭现有 Chrome
taskkill /F /IM chrome.exe 2>nul
timeout /t 2 /nobreak >nul

REM 启动 Chrome（调试模式）
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-wechat-debug"

echo [OK] Chrome 已启动
echo.
echo 请在 Chrome 中：
echo   1. 登录微信公众号后台
echo   2. 打开 "发表记录" 页面
echo   3. 按任意键继续...
echo.
pause >nul

:COLLECT
echo.
echo [Step 2] 开始自动收集数据...
echo.

REM 运行自动收集脚本
node auto_collect.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] 数据收集失败！
    echo.
    echo 常见问题：
    echo   1. 确认已在 Chrome 中打开"发表记录"页面
    echo   2. 确认 Chrome 在调试模式下运行
    echo   3. 检查网络连接
    echo.
    pause
    exit /b 1
)

echo.
echo [Step 3] 解析并保存数据到数据库...
echo.

REM 运行 Python 解析脚本
python collect_time_range.py --days=7

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] 数据解析失败！
    pause
    exit /b 1
)

echo.
echo ============================================================
echo [SUCCESS] 数据收集完成！
echo ============================================================
echo.
echo 数据已保存到数据库：data/wechat.db
echo 查看报告：data/wechat_report.txt
echo.
pause
