#!/bin/bash
# AI多引擎编排脚本 - 自动协调本地AI CLI工具
# 作者：老金 | 版本：1.0.0

set -e  # 遇到错误立即退出

# ==================== 配置区 ====================
WORKSPACE="${1:-.}"  # 工作目录，默认当前目录
TASK_DESC="${2:-开发任务}"  # 任务描述
ENGINE1="${3:-claude}"  # 第一个引擎，默认Claude
ENGINE2="${4:-codex}"   # 第二个引擎，默认Codex
ENGINE3="${5:-gemini}"  # 第三个引擎，默认Gemini

# 输出目录
OUTPUT_DIR="$WORKSPACE/.ai-orchestrator"
mkdir -p "$OUTPUT_DIR"

# 日志文件
LOG_FILE="$OUTPUT_DIR/orchestration.log"
RESULT_FILE="$OUTPUT_DIR/result.md"

# ==================== 工具函数 ====================
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

error() {
    echo "[ERROR] $1" | tee -a "$LOG_FILE"
    exit 1
}

check_cli() {
    local cli_name="$1"
    if ! command -v "$cli_name" &> /dev/null; then
        error "$cli_name CLI未安装，请先安装: npm install -g $cli_name"
    fi
}

# ==================== 主流程 ====================
main() {
    log "========================================="
    log "AI多引擎编排开始"
    log "任务: $TASK_DESC"
    log "引擎: $ENGINE1 -> $ENGINE2 -> $ENGINE3"
    log "========================================="

    # 检查CLI工具是否安装
    check_cli "$ENGINE1"
    check_cli "$ENGINE2"
    check_cli "$ENGINE3"

    # ==================== 阶段1: 需求分析（Claude） ====================
    log "阶段1: 使用 $ENGINE1 进行需求分析..."
    PHASE1_PROMPT="请分析以下任务的技术需求和实现方案：

任务描述：$TASK_DESC

请输出：
1. 核心功能清单
2. 技术栈选型
3. 文件结构设计
4. 关键实现要点

请以JSON格式输出，便于下游处理。"

    PHASE1_OUTPUT="$OUTPUT_DIR/phase1_requirements.json"

    # 调用第一个引擎（根据不同CLI使用不同命令）
    if [ "$ENGINE1" = "codex" ]; then
        codex exec "$PHASE1_PROMPT" > "$PHASE1_OUTPUT" 2>> "$LOG_FILE"
    elif [ "$ENGINE1" = "gemini" ]; then
        gemini -p "$PHASE1_PROMPT" > "$PHASE1_OUTPUT" 2>> "$LOG_FILE"
    else
        echo "$PHASE1_PROMPT" | $ENGINE1 > "$PHASE1_OUTPUT" 2>> "$LOG_FILE"
    fi

    if [ ! -s "$PHASE1_OUTPUT" ]; then
        error "阶段1失败: $ENGINE1 未生成需求分析"
    fi

    log "阶段1完成，需求分析已保存到: $PHASE1_OUTPUT"

    # ==================== 阶段2: 代码生成（Codex） ====================
    log "阶段2: 使用 $ENGINE2 生成代码..."
    PHASE2_PROMPT="请根据以下需求分析生成完整代码：

$(cat "$PHASE1_OUTPUT")

要求：
1. 严格按照需求分析的技术栈
2. 完整实现所有核心功能
3. 代码规范、有注释
4. 包含必要的错误处理

请直接输出代码，每个文件用markdown代码块标记。"

    PHASE2_OUTPUT="$OUTPUT_DIR/phase2_code.md"

    # 调用第二个引擎（根据不同CLI使用不同命令）
    if [ "$ENGINE2" = "codex" ]; then
        codex exec "$PHASE2_PROMPT" > "$PHASE2_OUTPUT" 2>> "$LOG_FILE"
    elif [ "$ENGINE2" = "gemini" ]; then
        gemini -p "$PHASE2_PROMPT" > "$PHASE2_OUTPUT" 2>> "$LOG_FILE"
    else
        echo "$PHASE2_PROMPT" | $ENGINE2 > "$PHASE2_OUTPUT" 2>> "$LOG_FILE"
    fi

    if [ ! -s "$PHASE2_OUTPUT" ]; then
        error "阶段2失败: $ENGINE2 未生成代码"
    fi

    log "阶段2完成，代码已保存到: $PHASE2_OUTPUT"

    # ==================== 阶段3: 代码审查（Gemini） ====================
    log "阶段3: 使用 $ENGINE3 进行代码审查..."
    PHASE3_PROMPT="请审查以下代码，并提出优化建议：

原始需求：
$(cat "$PHASE1_OUTPUT")

生成的代码：
$(cat "$PHASE2_OUTPUT")

请评估：
1. 代码质量（可读性、规范性）
2. 功能完整性（是否满足需求）
3. 潜在问题（bug、性能、安全）
4. 优化建议（具体可执行的改进）

请以markdown格式输出审查报告。"

    PHASE3_OUTPUT="$OUTPUT_DIR/phase3_review.md"

    # 调用第三个引擎（根据不同CLI使用不同命令）
    if [ "$ENGINE3" = "codex" ]; then
        codex exec "$PHASE3_PROMPT" > "$PHASE3_OUTPUT" 2>> "$LOG_FILE"
    elif [ "$ENGINE3" = "gemini" ]; then
        gemini -p "$PHASE3_PROMPT" > "$PHASE3_OUTPUT" 2>> "$LOG_FILE"
    else
        echo "$PHASE3_PROMPT" | $ENGINE3 > "$PHASE3_OUTPUT" 2>> "$LOG_FILE"
    fi

    if [ ! -s "$PHASE3_OUTPUT" ]; then
        error "阶段3失败: $ENGINE3 未生成审查报告"
    fi

    log "阶段3完成，审查报告已保存到: $PHASE3_OUTPUT"

    # ==================== 阶段4: 生成最终报告 ====================
    log "生成最终报告..."

    cat > "$RESULT_FILE" <<EOF
# AI多引擎编排结果

**任务描述**: $TASK_DESC
**编排引擎**: $ENGINE1 → $ENGINE2 → $ENGINE3
**完成时间**: $(date '+%Y-%m-%d %H:%M:%S')

---

## 📋 阶段1: 需求分析（$ENGINE1）

\`\`\`json
$(cat "$PHASE1_OUTPUT")
\`\`\`

---

## 💻 阶段2: 代码生成（$ENGINE2）

$(cat "$PHASE2_OUTPUT")

---

## ✅ 阶段3: 代码审查（$ENGINE3）

$(cat "$PHASE3_OUTPUT")

---

## 📊 执行日志

详细日志请查看: \`$LOG_FILE\`

EOF

    log "========================================="
    log "AI多引擎编排完成！"
    log "最终报告: $RESULT_FILE"
    log "========================================="

    # 自动打开结果文件
    if command -v code &> /dev/null; then
        code "$RESULT_FILE"
    elif command -v open &> /dev/null; then
        open "$RESULT_FILE"
    fi
}

# 运行主流程
main
