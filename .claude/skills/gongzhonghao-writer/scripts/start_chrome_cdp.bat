@echo off
chcp 65001 >nul
echo ============================================================
echo 启动Chrome调试模式 (CDP)
echo ============================================================
echo.

echo [Step 1] 关闭现有Chrome...
taskkill /F /IM chrome.exe 2>nul
timeout /t 2 /nobreak >nul

echo [Step 2] 启动Chrome (调试模式 + 保留登录)...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%USERPROFILE%\.chrome-debug-data" "https://mp.weixin.qq.com/cgi-bin/appmsgpublish?sub=list&begin=0&count=10&token=870900889&lang=zh_CN"

echo.
echo 等待Chrome启动...
timeout /t 5 /nobreak >nul

echo.
echo [OK] Chrome已启动！
echo.
echo 调试端口: http://localhost:9222
echo 页面URL: 微信公众号后台
echo.
echo ============================================================
echo 接下来:
echo 1. 在Chrome中登录微信公众号（如果需要）
echo 2. 确认在"发表记录"页面
echo 3. 运行: /collect-wechat-data
echo ============================================================
echo.
pause
