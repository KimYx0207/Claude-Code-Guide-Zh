# MCP服务器依赖检查脚本（Windows PowerShell）
# 版本：1.0.0
# 日期：2025-12-02

$ErrorActionPreference = "SilentlyContinue"

# ANSI颜色代码（PowerShell 5.1+）
$RED = "`e[31m"
$GREEN = "`e[32m"
$YELLOW = "`e[33m"
$BLUE = "`e[34m"
$RESET = "`e[0m"

# Unicode符号
$CHECK = "✓"
$CROSS = "✗"
$WARNING = "⚠"
$INFO = "ℹ"

Write-Host ""
Write-Host "${BLUE}=======================================${RESET}"
Write-Host "${BLUE}   MCP服务器依赖检查工具 v1.0.0${RESET}"
Write-Host "${BLUE}=======================================${RESET}"
Write-Host ""

# 检查结果统计
$total = 0
$passed = 0
$failed = 0
$warnings = 0

# 辅助函数：检查命令是否存在
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# 辅助函数：检查环境变量
function Test-EnvVar {
    param([string]$VarName)
    $value = [Environment]::GetEnvironmentVariable($VarName)
    return (-not [string]::IsNullOrWhiteSpace($value))
}

# 辅助函数：检查文件是否存在
function Test-FileExists {
    param([string]$Path)
    return Test-Path -Path $Path -PathType Leaf
}

# 辅助函数：测试JSON有效性
function Test-JsonValid {
    param([string]$Path)
    try {
        Get-Content $Path -Raw | ConvertFrom-Json | Out-Null
        return $true
    } catch {
        return $false
    }
}

# 辅助函数：测试API Key（隐藏敏感内容）
function Show-ApiKey {
    param([string]$Key)
    if ($Key.Length -le 10) {
        return "***"
    }
    $prefix = $Key.Substring(0, [Math]::Min(8, $Key.Length))
    return "$prefix...（已隐藏）"
}

Write-Host "${YELLOW}[1/6] 检查基础环境...${RESET}"
Write-Host ""

# 检查Node.js
$total++
if (Test-Command "node") {
    $nodeVersion = (node --version).Trim()
    $majorVersion = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
    if ($majorVersion -ge 18) {
        Write-Host "  ${GREEN}${CHECK}${RESET} Node.js: $nodeVersion"
        $passed++
    } else {
        Write-Host "  ${RED}${CROSS}${RESET} Node.js版本过低: $nodeVersion (需要 >= v18.0.0)"
        $failed++
    }
} else {
    Write-Host "  ${RED}${CROSS}${RESET} Node.js未安装"
    Write-Host "    ${INFO} 请访问：https://nodejs.org/"
    $failed++
}

# 检查npm
$total++
if (Test-Command "npm") {
    $npmVersion = (npm --version).Trim()
    Write-Host "  ${GREEN}${CHECK}${RESET} npm: $npmVersion"
    $passed++
} else {
    Write-Host "  ${RED}${CROSS}${RESET} npm未安装"
    $failed++
}

# 检查npx
$total++
if (Test-Command "npx") {
    Write-Host "  ${GREEN}${CHECK}${RESET} npx: 已安装"
    $passed++
} else {
    Write-Host "  ${RED}${CROSS}${RESET} npx未安装"
    $failed++
}

Write-Host ""
Write-Host "${YELLOW}[2/6] 检查MCP配置文件...${RESET}"
Write-Host ""

# 检查.cursor/mcp.json
$total++
$cursorMcpPath = ".cursor\mcp.json"
if (Test-FileExists $cursorMcpPath) {
    if (Test-JsonValid $cursorMcpPath) {
        Write-Host "  ${GREEN}${CHECK}${RESET} .cursor/mcp.json: 有效"
        $passed++
    } else {
        Write-Host "  ${RED}${CROSS}${RESET} .cursor/mcp.json: JSON格式错误"
        $failed++
    }
} else {
    Write-Host "  ${RED}${CROSS}${RESET} .cursor/mcp.json: 文件不存在"
    $failed++
}

# 检查.vscode/mcp.json
$total++
$vscodeMcpPath = ".vscode\mcp.json"
if (Test-FileExists $vscodeMcpPath) {
    if (Test-JsonValid $vscodeMcpPath) {
        Write-Host "  ${GREEN}${CHECK}${RESET} .vscode/mcp.json: 有效"
        $passed++
    } else {
        Write-Host "  ${RED}${CROSS}${RESET} .vscode/mcp.json: JSON格式错误"
        $failed++
    }
} else {
    Write-Host "  ${YELLOW}${WARNING}${RESET} .vscode/mcp.json: 文件不存在（如果只用Cursor可忽略）"
    $warnings++
}

Write-Host ""
Write-Host "${YELLOW}[3/6] 检查必需的MCP服务器配置...${RESET}"
Write-Host ""

# 读取MCP配置
$mcpConfig = $null
if (Test-FileExists $cursorMcpPath) {
    try {
        $mcpConfig = Get-Content $cursorMcpPath -Raw | ConvertFrom-Json
    } catch {
        Write-Host "  ${RED}${CROSS}${RESET} 无法解析MCP配置文件"
    }
}

# 必需的MCP服务器
$requiredServers = @(
    @{ Name = "task-master-ai"; Description = "Task Master AI（任务管理）"; Priority = "必需" },
    @{ Name = "mcp-router"; Description = "Brave搜索（网络搜索）"; Priority = "必需" },
    @{ Name = "exa"; Description = "Exa搜索（深度搜索）"; Priority = "推荐" },
    @{ Name = "context7"; Description = "Context7（技术文档）"; Priority = "推荐" },
    @{ Name = "playwright"; Description = "Playwright（浏览器自动化）"; Priority = "可选" },
    @{ Name = "filesystem"; Description = "文件系统（文件操作）"; Priority = "可选" },
    @{ Name = "github"; Description = "GitHub（代码仓库）"; Priority = "可选" }
)

foreach ($server in $requiredServers) {
    $total++
    $serverName = $server.Name
    $description = $server.Description
    $priority = $server.Priority

    $found = $false
    if ($mcpConfig -and $mcpConfig.mcpServers.PSObject.Properties.Name -contains $serverName) {
        $found = $true
    }

    if ($found) {
        if ($priority -eq "必需") {
            Write-Host "  ${GREEN}${CHECK}${RESET} $description"
            $passed++
        } elseif ($priority -eq "推荐") {
            Write-Host "  ${GREEN}${CHECK}${RESET} $description"
            $passed++
        } else {
            Write-Host "  ${GREEN}${CHECK}${RESET} $description"
            $passed++
        }
    } else {
        if ($priority -eq "必需") {
            Write-Host "  ${RED}${CROSS}${RESET} $description - 未配置"
            $failed++
        } elseif ($priority -eq "推荐") {
            Write-Host "  ${YELLOW}${WARNING}${RESET} $description - 未配置"
            $warnings++
        } else {
            Write-Host "  ${YELLOW}${INFO}${RESET} $description - 未配置（可选）"
        }
    }
}

Write-Host ""
Write-Host "${YELLOW}[4/6] 检查API密钥...${RESET}"
Write-Host ""

# 检查.env文件
$envPath = ".env"
$envExists = Test-FileExists $envPath

if (-not $envExists) {
    Write-Host "  ${YELLOW}${WARNING}${RESET} .env文件不存在"
    Write-Host "    ${INFO} 运行: cp .env.example .env"
    Write-Host ""
}

# API密钥检查列表
$apiKeys = @(
    @{ Name = "ANTHROPIC_API_KEY"; Description = "Anthropic Claude API"; Priority = "必需" },
    @{ Name = "BRAVE_API_KEY"; Description = "Brave搜索API"; Priority = "必需" },
    @{ Name = "PERPLEXITY_API_KEY"; Description = "Perplexity API"; Priority = "推荐" },
    @{ Name = "EXA_API_KEY"; Description = "Exa搜索API"; Priority = "推荐" },
    @{ Name = "OPENAI_API_KEY"; Description = "OpenAI API"; Priority = "可选" },
    @{ Name = "GOOGLE_API_KEY"; Description = "Google Gemini API"; Priority = "可选" },
    @{ Name = "GITHUB_PERSONAL_ACCESS_TOKEN"; Description = "GitHub Token"; Priority = "可选" }
)

# 如果.env存在,读取内容
$envVars = @{}
if ($envExists) {
    Get-Content $envPath | ForEach-Object {
        if ($_ -match '^\s*([^#=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"')
            if (-not [string]::IsNullOrWhiteSpace($value) -and $value -notmatch '^YOUR_.*_HERE$') {
                $envVars[$key] = $value
            }
        }
    }
}

foreach ($key in $apiKeys) {
    $total++
    $keyName = $key.Name
    $description = $key.Description
    $priority = $key.Priority

    # 检查环境变量或.env文件
    $hasKey = Test-EnvVar $keyName
    if (-not $hasKey -and $envVars.ContainsKey($keyName)) {
        $hasKey = $true
    }

    if ($hasKey) {
        $keyValue = if ($envVars.ContainsKey($keyName)) { $envVars[$keyName] } else { [Environment]::GetEnvironmentVariable($keyName) }
        $displayValue = Show-ApiKey $keyValue
        Write-Host "  ${GREEN}${CHECK}${RESET} $description`: $displayValue"
        $passed++
    } else {
        if ($priority -eq "必需") {
            Write-Host "  ${RED}${CROSS}${RESET} $description - 未设置"
            $failed++
        } elseif ($priority -eq "推荐") {
            Write-Host "  ${YELLOW}${WARNING}${RESET} $description - 未设置"
            $warnings++
        } else {
            Write-Host "  ${YELLOW}${INFO}${RESET} $description - 未设置（可选）"
        }
    }
}

Write-Host ""
Write-Host "${YELLOW}[5/6] 检查Slash命令依赖...${RESET}"
Write-Host ""

# Slash命令依赖矩阵
$commandDependencies = @(
    @{ Command = "/gongzhonghao"; Servers = @("mcp-router", "exa", "context7") },
    @{ Command = "/auto-baokuan"; Servers = @("mcp-router") },
    @{ Command = "/hotspot"; Servers = @("mcp-router") },
    @{ Command = "/daily-scan"; Servers = @("mcp-router") },
    @{ Command = "/infographic"; Servers = @("playwright") },
    @{ Command = "/collect-wechat-data"; Servers = @("playwright") }
)

$configuredServers = @()
if ($mcpConfig) {
    $configuredServers = $mcpConfig.mcpServers.PSObject.Properties.Name
}

foreach ($cmd in $commandDependencies) {
    $total++
    $cmdName = $cmd.Command
    $requiredServers = $cmd.Servers

    $allConfigured = $true
    $missingServers = @()

    foreach ($server in $requiredServers) {
        if ($configuredServers -notcontains $server) {
            $allConfigured = $false
            $missingServers += $server
        }
    }

    if ($allConfigured) {
        Write-Host "  ${GREEN}${CHECK}${RESET} $cmdName - 依赖满足"
        $passed++
    } else {
        Write-Host "  ${RED}${CROSS}${RESET} $cmdName - 缺少: $($missingServers -join ', ')"
        $failed++
    }
}

Write-Host ""
Write-Host "${YELLOW}[6/6] 检查Python脚本依赖...${RESET}"
Write-Host ""

# 检查Python
$total++
if (Test-Command "python") {
    $pythonVersion = (python --version 2>&1).Trim()
    Write-Host "  ${GREEN}${CHECK}${RESET} Python: $pythonVersion"
    $passed++

    # 检查Python包
    $pythonPackages = @("numpy", "scipy", "sklearn", "jieba", "playwright")

    foreach ($pkg in $pythonPackages) {
        $total++
        try {
            python -c "import $pkg" 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  ${GREEN}${CHECK}${RESET} Python包: $pkg"
                $passed++
            } else {
                Write-Host "  ${YELLOW}${WARNING}${RESET} Python包: $pkg - 未安装"
                $warnings++
            }
        } catch {
            Write-Host "  ${YELLOW}${WARNING}${RESET} Python包: $pkg - 未安装"
            $warnings++
        }
    }
} else {
    Write-Host "  ${YELLOW}${WARNING}${RESET} Python未安装（如果不使用Python脚本可忽略）"
    $warnings++
}

Write-Host ""
Write-Host "${BLUE}=======================================${RESET}"
Write-Host "${BLUE}   检查完成${RESET}"
Write-Host "${BLUE}=======================================${RESET}"
Write-Host ""
Write-Host "总计: $total 项"
Write-Host "${GREEN}通过: $passed${RESET}"
Write-Host "${RED}失败: $failed${RESET}"
Write-Host "${YELLOW}警告: $warnings${RESET}"
Write-Host ""

# 根据结果给出建议
if ($failed -gt 0) {
    Write-Host "${RED}${CROSS} 发现严重问题，部分功能可能无法使用${RESET}"
    Write-Host ""
    Write-Host "${YELLOW}建议操作：${RESET}"
    Write-Host "1. 阅读文档：docs/MCP服务器配置指南.md"
    Write-Host "2. 配置缺失的MCP服务器"
    Write-Host "3. 设置必需的API密钥"
    Write-Host "4. 重启IDE（Cursor或VS Code）"
    Write-Host ""
    exit 1
} elseif ($warnings -gt 0) {
    Write-Host "${YELLOW}${WARNING} 发现一些警告，建议完善配置${RESET}"
    Write-Host ""
    Write-Host "${YELLOW}建议操作：${RESET}"
    Write-Host "1. 配置推荐的MCP服务器以获得更好体验"
    Write-Host "2. 设置可选的API密钥以启用更多功能"
    Write-Host ""
    exit 0
} else {
    Write-Host "${GREEN}${CHECK} 所有检查通过！MCP环境配置完善${RESET}"
    Write-Host ""
    Write-Host "${GREEN}你可以开始使用以下功能：${RESET}"
    Write-Host "• /gongzhonghao [主题] - 公众号文章创作"
    Write-Host "• /hotspot - 热点扫描"
    Write-Host "• /auto-baokuan [关键词] - 一键爆款生成"
    Write-Host "• /daily-scan - 每日内容生产"
    Write-Host ""
    exit 0
}
