#!/bin/bash
# MCP服务器依赖检查脚本（Linux/Mac）
# 版本：1.0.0
# 日期：2025-12-02

set -e

# ANSI颜色代码
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
RESET='\033[0m'

# Unicode符号
CHECK="✓"
CROSS="✗"
WARNING="⚠"
INFO="ℹ"

echo ""
echo -e "${BLUE}=======================================${RESET}"
echo -e "${BLUE}   MCP服务器依赖检查工具 v1.0.0${RESET}"
echo -e "${BLUE}=======================================${RESET}"
echo ""

# 检查结果统计
total=0
passed=0
failed=0
warnings=0

# 辅助函数：检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 辅助函数：检查环境变量
env_var_exists() {
    [ -n "${!1}" ]
}

# 辅助函数：检查文件是否存在
file_exists() {
    [ -f "$1" ]
}

# 辅助函数：测试JSON有效性
json_valid() {
    if command_exists jq; then
        jq empty "$1" >/dev/null 2>&1
    elif command_exists python3; then
        python3 -c "import json; json.load(open('$1'))" >/dev/null 2>&1
    else
        # 如果没有jq和python3，跳过验证
        return 0
    fi
}

# 辅助函数：显示API Key（隐藏敏感内容）
show_api_key() {
    local key="$1"
    if [ ${#key} -le 10 ]; then
        echo "***"
    else
        echo "${key:0:8}...（已隐藏）"
    fi
}

echo -e "${YELLOW}[1/6] 检查基础环境...${RESET}"
echo ""

# 检查Node.js
((total++))
if command_exists node; then
    node_version=$(node --version)
    major_version=$(echo "$node_version" | sed 's/v\([0-9]*\).*/\1/')
    if [ "$major_version" -ge 18 ]; then
        echo -e "  ${GREEN}${CHECK}${RESET} Node.js: $node_version"
        ((passed++))
    else
        echo -e "  ${RED}${CROSS}${RESET} Node.js版本过低: $node_version (需要 >= v18.0.0)"
        ((failed++))
    fi
else
    echo -e "  ${RED}${CROSS}${RESET} Node.js未安装"
    echo -e "    ${INFO} 请访问：https://nodejs.org/"
    ((failed++))
fi

# 检查npm
((total++))
if command_exists npm; then
    npm_version=$(npm --version)
    echo -e "  ${GREEN}${CHECK}${RESET} npm: $npm_version"
    ((passed++))
else
    echo -e "  ${RED}${CROSS}${RESET} npm未安装"
    ((failed++))
fi

# 检查npx
((total++))
if command_exists npx; then
    echo -e "  ${GREEN}${CHECK}${RESET} npx: 已安装"
    ((passed++))
else
    echo -e "  ${RED}${CROSS}${RESET} npx未安装"
    ((failed++))
fi

echo ""
echo -e "${YELLOW}[2/6] 检查MCP配置文件...${RESET}"
echo ""

# 检查.cursor/mcp.json
((total++))
cursor_mcp_path=".cursor/mcp.json"
if file_exists "$cursor_mcp_path"; then
    if json_valid "$cursor_mcp_path"; then
        echo -e "  ${GREEN}${CHECK}${RESET} .cursor/mcp.json: 有效"
        ((passed++))
    else
        echo -e "  ${RED}${CROSS}${RESET} .cursor/mcp.json: JSON格式错误"
        ((failed++))
    fi
else
    echo -e "  ${RED}${CROSS}${RESET} .cursor/mcp.json: 文件不存在"
    ((failed++))
fi

# 检查.vscode/mcp.json
((total++))
vscode_mcp_path=".vscode/mcp.json"
if file_exists "$vscode_mcp_path"; then
    if json_valid "$vscode_mcp_path"; then
        echo -e "  ${GREEN}${CHECK}${RESET} .vscode/mcp.json: 有效"
        ((passed++))
    else
        echo -e "  ${RED}${CROSS}${RESET} .vscode/mcp.json: JSON格式错误"
        ((failed++))
    fi
else
    echo -e "  ${YELLOW}${WARNING}${RESET} .vscode/mcp.json: 文件不存在（如果只用Cursor可忽略）"
    ((warnings++))
fi

echo ""
echo -e "${YELLOW}[3/6] 检查必需的MCP服务器配置...${RESET}"
echo ""

# 读取MCP配置
declare -A mcp_servers
if file_exists "$cursor_mcp_path"; then
    if command_exists jq; then
        while IFS= read -r server; do
            mcp_servers["$server"]=1
        done < <(jq -r '.mcpServers | keys[]' "$cursor_mcp_path" 2>/dev/null)
    elif command_exists python3; then
        while IFS= read -r server; do
            mcp_servers["$server"]=1
        done < <(python3 -c "import json; data=json.load(open('$cursor_mcp_path')); print('\n'.join(data.get('mcpServers', {}).keys()))" 2>/dev/null)
    fi
fi

# 必需的MCP服务器
declare -a required_servers=(
    "task-master-ai:Task Master AI（任务管理）:必需"
    "mcp-router:Brave搜索（网络搜索）:必需"
    "exa:Exa搜索（深度搜索）:推荐"
    "context7:Context7（技术文档）:推荐"
    "playwright:Playwright（浏览器自动化）:可选"
    "filesystem:文件系统（文件操作）:可选"
    "github:GitHub（代码仓库）:可选"
)

for server_info in "${required_servers[@]}"; do
    ((total++))
    IFS=':' read -r server_name description priority <<< "$server_info"

    if [ -n "${mcp_servers[$server_name]}" ]; then
        echo -e "  ${GREEN}${CHECK}${RESET} $description"
        ((passed++))
    else
        if [ "$priority" = "必需" ]; then
            echo -e "  ${RED}${CROSS}${RESET} $description - 未配置"
            ((failed++))
        elif [ "$priority" = "推荐" ]; then
            echo -e "  ${YELLOW}${WARNING}${RESET} $description - 未配置"
            ((warnings++))
        else
            echo -e "  ${YELLOW}${INFO}${RESET} $description - 未配置（可选）"
        fi
    fi
done

echo ""
echo -e "${YELLOW}[4/6] 检查API密钥...${RESET}"
echo ""

# 检查.env文件
env_path=".env"
if ! file_exists "$env_path"; then
    echo -e "  ${YELLOW}${WARNING}${RESET} .env文件不存在"
    echo -e "    ${INFO} 运行: cp .env.example .env"
    echo ""
fi

# API密钥检查列表
declare -a api_keys=(
    "ANTHROPIC_API_KEY:Anthropic Claude API:必需"
    "BRAVE_API_KEY:Brave搜索API:必需"
    "PERPLEXITY_API_KEY:Perplexity API:推荐"
    "EXA_API_KEY:Exa搜索API:推荐"
    "OPENAI_API_KEY:OpenAI API:可选"
    "GOOGLE_API_KEY:Google Gemini API:可选"
    "GITHUB_PERSONAL_ACCESS_TOKEN:GitHub Token:可选"
)

# 读取.env文件
declare -A env_vars
if file_exists "$env_path"; then
    while IFS='=' read -r key value; do
        # 跳过注释和空行
        [[ "$key" =~ ^[[:space:]]*# ]] && continue
        [[ -z "$key" ]] && continue

        # 去除引号
        value=$(echo "$value" | sed 's/^"\(.*\)"$/\1/' | sed "s/^'\(.*\)'$/\1/")

        # 跳过占位符
        [[ "$value" =~ ^YOUR_.*_HERE$ ]] && continue
        [[ -z "$value" ]] && continue

        env_vars["$key"]="$value"
    done < "$env_path"
fi

for key_info in "${api_keys[@]}"; do
    ((total++))
    IFS=':' read -r key_name description priority <<< "$key_info"

    # 检查环境变量或.env文件
    has_key=false
    key_value=""

    if [ -n "${env_vars[$key_name]}" ]; then
        has_key=true
        key_value="${env_vars[$key_name]}"
    elif [ -n "${!key_name}" ]; then
        has_key=true
        key_value="${!key_name}"
    fi

    if $has_key; then
        display_value=$(show_api_key "$key_value")
        echo -e "  ${GREEN}${CHECK}${RESET} $description: $display_value"
        ((passed++))
    else
        if [ "$priority" = "必需" ]; then
            echo -e "  ${RED}${CROSS}${RESET} $description - 未设置"
            ((failed++))
        elif [ "$priority" = "推荐" ]; then
            echo -e "  ${YELLOW}${WARNING}${RESET} $description - 未设置"
            ((warnings++))
        else
            echo -e "  ${YELLOW}${INFO}${RESET} $description - 未设置（可选）"
        fi
    fi
done

echo ""
echo -e "${YELLOW}[5/6] 检查Slash命令依赖...${RESET}"
echo ""

# Slash命令依赖矩阵
declare -A command_deps=(
    ["/gongzhonghao"]="mcp-router exa context7"
    ["/auto-baokuan"]="mcp-router"
    ["/hotspot"]="mcp-router"
    ["/daily-scan"]="mcp-router"
    ["/infographic"]="playwright"
    ["/collect-wechat-data"]="playwright"
)

for cmd in "${!command_deps[@]}"; do
    ((total++))
    required_servers=(${command_deps[$cmd]})

    all_configured=true
    missing_servers=()

    for server in "${required_servers[@]}"; do
        if [ -z "${mcp_servers[$server]}" ]; then
            all_configured=false
            missing_servers+=("$server")
        fi
    done

    if $all_configured; then
        echo -e "  ${GREEN}${CHECK}${RESET} $cmd - 依赖满足"
        ((passed++))
    else
        echo -e "  ${RED}${CROSS}${RESET} $cmd - 缺少: ${missing_servers[*]}"
        ((failed++))
    fi
done

echo ""
echo -e "${YELLOW}[6/6] 检查Python脚本依赖...${RESET}"
echo ""

# 检查Python
((total++))
if command_exists python3; then
    python_version=$(python3 --version)
    echo -e "  ${GREEN}${CHECK}${RESET} Python: $python_version"
    ((passed++))

    # 检查Python包
    python_packages=("numpy" "scipy" "sklearn" "jieba" "playwright")

    for pkg in "${python_packages[@]}"; do
        ((total++))
        if python3 -c "import $pkg" >/dev/null 2>&1; then
            echo -e "  ${GREEN}${CHECK}${RESET} Python包: $pkg"
            ((passed++))
        else
            echo -e "  ${YELLOW}${WARNING}${RESET} Python包: $pkg - 未安装"
            ((warnings++))
        fi
    done
elif command_exists python; then
    python_version=$(python --version)
    echo -e "  ${GREEN}${CHECK}${RESET} Python: $python_version"
    ((passed++))
else
    echo -e "  ${YELLOW}${WARNING}${RESET} Python未安装（如果不使用Python脚本可忽略）"
    ((warnings++))
fi

echo ""
echo -e "${BLUE}=======================================${RESET}"
echo -e "${BLUE}   检查完成${RESET}"
echo -e "${BLUE}=======================================${RESET}"
echo ""
echo "总计: $total 项"
echo -e "${GREEN}通过: $passed${RESET}"
echo -e "${RED}失败: $failed${RESET}"
echo -e "${YELLOW}警告: $warnings${RESET}"
echo ""

# 根据结果给出建议
if [ $failed -gt 0 ]; then
    echo -e "${RED}${CROSS} 发现严重问题,部分功能可能无法使用${RESET}"
    echo ""
    echo -e "${YELLOW}建议操作：${RESET}"
    echo "1. 阅读文档：docs/MCP服务器配置指南.md"
    echo "2. 配置缺失的MCP服务器"
    echo "3. 设置必需的API密钥"
    echo "4. 重启IDE（Cursor或VS Code）"
    echo ""
    exit 1
elif [ $warnings -gt 0 ]; then
    echo -e "${YELLOW}${WARNING} 发现一些警告,建议完善配置${RESET}"
    echo ""
    echo -e "${YELLOW}建议操作：${RESET}"
    echo "1. 配置推荐的MCP服务器以获得更好体验"
    echo "2. 设置可选的API密钥以启用更多功能"
    echo ""
    exit 0
else
    echo -e "${GREEN}${CHECK} 所有检查通过！MCP环境配置完善${RESET}"
    echo ""
    echo -e "${GREEN}你可以开始使用以下功能：${RESET}"
    echo "• /gongzhonghao [主题] - 公众号文章创作"
    echo "• /hotspot - 热点扫描"
    echo "• /auto-baokuan [关键词] - 一键爆款生成"
    echo "• /daily-scan - 每日内容生产"
    echo ""
    exit 0
fi
