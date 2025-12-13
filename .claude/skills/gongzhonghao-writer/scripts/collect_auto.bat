@echo off
chcp 65001 >nul
echo ============================================================
echo 微信公众号数据全自动收集
echo ============================================================
echo.

echo [检查] Chrome调试模式是否运行...
curl -s http://localhost:9222/json/version >nul 2>&1
if errorlevel 1 (
    echo [启动] Chrome调试模式...
    call start_chrome_cdp.bat
    timeout /t 8 /nobreak >nul
) else (
    echo [OK] Chrome调试模式已运行
)

echo.
echo [Step 1] 收集数据...
node collect_with_cdp.js
if errorlevel 1 (
    echo.
    echo [ERROR] 数据收集失败！
    echo 请确保在Chrome中打开了发表记录页面
    pause
    exit /b 1
)

echo.
echo [Step 2] 解析并存储...
if "%1"=="" (
    python collect_time_range.py --days=30
) else (
    echo %1 | findstr /R "^[0-9][0-9]*$" >nul
    if errorlevel 1 (
        python collect_time_range.py --until=%1
    ) else (
        python collect_time_range.py --days=%1
    )
)

echo.
echo [Step 3] 显示报告...
type ..\data\wechat_report.txt

echo.
echo ============================================================
echo ✅ 全自动收集完成！
echo ============================================================
echo.
pause
