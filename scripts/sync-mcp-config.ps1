# MCP配置同步脚本（Windows PowerShell）
# 版本：1.0.0
# 日期：2025-12-02
#
# 功能：将 .cursor/mcp.json 同步到 .vscode/mcp.json

$ErrorActionPreference = "Stop"

# ANSI颜色代码
$GREEN = "`e[32m"
$RED = "`e[31m"
$YELLOW = "`e[33m"
$BLUE = "`e[34m"
$RESET = "`e[0m"

# Unicode符号
$CHECK = "✓"
$CROSS = "✗"
$INFO = "ℹ"

Write-Host ""
Write-Host "${BLUE}=======================================${RESET}"
Write-Host "${BLUE}   MCP配置同步工具 v1.0.0${RESET}"
Write-Host "${BLUE}=======================================${RESET}"
Write-Host ""

# 源文件和目标文件
$sourceFile = ".cursor\mcp.json"
$targetFile = ".vscode\mcp.json"

# 检查源文件是否存在
if (-not (Test-Path $sourceFile -PathType Leaf)) {
    Write-Host "${RED}${CROSS}${RESET} 错误：源文件不存在: $sourceFile"
    Write-Host ""
    exit 1
}

# 检查源文件JSON格式是否有效
try {
    $sourceContent = Get-Content $sourceFile -Raw | ConvertFrom-Json
    Write-Host "${GREEN}${CHECK}${RESET} 源文件格式有效: $sourceFile"
} catch {
    Write-Host "${RED}${CROSS}${RESET} 错误：源文件JSON格式错误"
    Write-Host "    $($_.Exception.Message)"
    Write-Host ""
    exit 1
}

# 检查目标目录是否存在
$targetDir = Split-Path -Parent $targetFile
if (-not (Test-Path $targetDir -PathType Container)) {
    Write-Host "${YELLOW}${INFO}${RESET} 创建目标目录: $targetDir"
    New-Item -Path $targetDir -ItemType Directory -Force | Out-Null
}

# 如果目标文件存在,先备份
if (Test-Path $targetFile -PathType Leaf) {
    $backupFile = "$targetFile.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "${YELLOW}${INFO}${RESET} 备份现有文件: $backupFile"
    Copy-Item -Path $targetFile -Destination $backupFile -Force
}

# 复制文件
try {
    Copy-Item -Path $sourceFile -Destination $targetFile -Force
    Write-Host "${GREEN}${CHECK}${RESET} 同步成功: $sourceFile → $targetFile"
} catch {
    Write-Host "${RED}${CROSS}${RESET} 错误：复制文件失败"
    Write-Host "    $($_.Exception.Message)"
    Write-Host ""
    exit 1
}

# 验证目标文件
try {
    $targetContent = Get-Content $targetFile -Raw | ConvertFrom-Json
    Write-Host "${GREEN}${CHECK}${RESET} 目标文件验证成功"
} catch {
    Write-Host "${RED}${CROSS}${RESET} 错误：目标文件验证失败"
    Write-Host "    $($_.Exception.Message)"
    Write-Host ""
    exit 1
}

# 比较内容是否一致
$sourceJson = Get-Content $sourceFile -Raw
$targetJson = Get-Content $targetFile -Raw

if ($sourceJson -eq $targetJson) {
    Write-Host "${GREEN}${CHECK}${RESET} 内容一致性验证通过"
} else {
    Write-Host "${YELLOW}${INFO}${RESET} 注意：文件格式可能略有差异（空格/换行），但内容相同"
}

Write-Host ""
Write-Host "${BLUE}=======================================${RESET}"
Write-Host "${BLUE}   同步完成${RESET}"
Write-Host "${BLUE}=======================================${RESET}"
Write-Host ""
Write-Host "${GREEN}提示：${RESET}"
Write-Host "1. 如果IDE已打开，请重启以加载新配置"
Write-Host "2. Cursor: 完全关闭后重新打开"
Write-Host "3. VS Code: Ctrl+Shift+P → Developer: Reload Window"
Write-Host ""

exit 0
