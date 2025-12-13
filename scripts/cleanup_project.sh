#!/usr/bin/env bash
# 项目清理脚本
# 用途：清理临时文件、冗余目录，优化项目结构
# 作者：Claude Code
# 日期：2025-12-02

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 项目清理工具 V1.0${NC}"
echo "============================================"
echo ""

# 获取项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "📂 项目路径: $PROJECT_ROOT"
echo ""

# 统计当前状态
BEFORE_FILES=$(find . -type f | wc -l)
BEFORE_SIZE=$(du -sh . 2>/dev/null | cut -f1)

echo "📊 清理前状态:"
echo "   文件数: $BEFORE_FILES"
echo "   总大小: $BEFORE_SIZE"
echo ""

# 确认清理
echo -e "${YELLOW}⚠️  即将清理以下内容:${NC}"
echo "   1. node_modules/ (根目录，约318M)"
echo "   2. __pycache__/ (Python缓存)"
echo "   3. scripts/temp/ (临时图片文件)"
echo "   4. test_feishu_minimal.md (测试文件)"
echo "   5. .DS_Store (系统文件)"
echo ""

read -p "确认清理？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ 已取消清理${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 开始清理...${NC}"
echo ""

# ============================================
# 阶段1：安全删除
# ============================================
echo "📦 阶段1: 删除冗余文件..."

# 1. 删除根目录node_modules
if [ -d "node_modules" ]; then
    echo "   删除 node_modules/ ..."
    rm -rf node_modules/
    echo -e "   ${GREEN}✓${NC} node_modules/ 已删除"
else
    echo "   ℹ️  node_modules/ 不存在，跳过"
fi

# 2. 删除Python缓存
echo "   清理 __pycache__/ ..."
PYCACHE_COUNT=$(find . -type d -name "__pycache__" 2>/dev/null | wc -l)
if [ "$PYCACHE_COUNT" -gt 0 ]; then
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    echo -e "   ${GREEN}✓${NC} 已删除 $PYCACHE_COUNT 个 __pycache__ 目录"
else
    echo "   ℹ️  无 __pycache__ 目录"
fi

# 3. 删除测试文件
if [ -f "test_feishu_minimal.md" ]; then
    rm -f test_feishu_minimal.md
    echo -e "   ${GREEN}✓${NC} test_feishu_minimal.md 已删除"
fi

# 4. 删除scripts/temp/
if [ -d "scripts/temp" ]; then
    rm -rf scripts/temp/
    echo -e "   ${GREEN}✓${NC} scripts/temp/ 已删除"
fi

# 5. 删除系统文件
DS_STORE_COUNT=$(find . -name ".DS_Store" 2>/dev/null | wc -l)
if [ "$DS_STORE_COUNT" -gt 0 ]; then
    find . -name ".DS_Store" -delete 2>/dev/null || true
    echo -e "   ${GREEN}✓${NC} 已删除 $DS_STORE_COUNT 个 .DS_Store 文件"
fi

echo -e "${GREEN}✅ 阶段1完成${NC}"
echo ""

# ============================================
# 阶段2：整理归档
# ============================================
echo "📂 阶段2: 整理归档..."

# 创建目录
mkdir -p scripts/maintenance
mkdir -p docs/archive
mkdir -p archive

# 1. 移动根目录Python脚本
MOVED_PY=0
for script in check_*.py find_*.py; do
    if [ -f "$script" ]; then
        mv "$script" scripts/maintenance/
        ((MOVED_PY++))
    fi
done

if [ $MOVED_PY -gt 0 ]; then
    echo -e "   ${GREEN}✓${NC} 已移动 $MOVED_PY 个Python脚本到 scripts/maintenance/"
else
    echo "   ℹ️  无需移动的Python脚本"
fi

# 2. 归档Markdown文件
MOVED_MD=0
for md in fix_plan.md fix_verification_report.md; do
    if [ -f "$md" ]; then
        mv "$md" docs/archive/
        ((MOVED_MD++))
    fi
done

if [ $MOVED_MD -gt 0 ]; then
    echo -e "   ${GREEN}✓${NC} 已移动 $MOVED_MD 个Markdown文件到 docs/archive/"
fi

# 3. 移动可疑目录
if [ -d "gac_articles_markdown" ]; then
    BACKUP_NAME="gac_articles_markdown_backup_$(date +%Y%m%d)"
    mv gac_articles_markdown "archive/$BACKUP_NAME"
    echo -e "   ${GREEN}✓${NC} gac_articles_markdown 已移至 archive/$BACKUP_NAME"
fi

echo -e "${GREEN}✅ 阶段2完成${NC}"
echo ""

# ============================================
# 统计清理结果
# ============================================
echo "📊 清理结果统计..."
echo ""

AFTER_FILES=$(find . -type f | wc -l)
AFTER_SIZE=$(du -sh . 2>/dev/null | cut -f1)

FILES_REMOVED=$((BEFORE_FILES - AFTER_FILES))

echo "┌─────────────────────────────────────────┐"
echo "│           清理前 → 清理后                │"
echo "├─────────────────────────────────────────┤"
echo "│  文件数: $BEFORE_FILES → $AFTER_FILES (删除 $FILES_REMOVED 个)"
echo "│  总大小: $BEFORE_SIZE → $AFTER_SIZE"
echo "└─────────────────────────────────────────┘"
echo ""

# ============================================
# 生成清理报告
# ============================================
REPORT_FILE="docs/清理报告_$(date +%Y%m%d_%H%M%S).md"

cat > "$REPORT_FILE" << EOF
# 项目清理报告

**清理时间**：$(date '+%Y-%m-%d %H:%M:%S')
**执行脚本**：scripts/cleanup_project.sh

## 清理前后对比

| 指标 | 清理前 | 清理后 | 变化 |
|------|--------|--------|------|
| 文件数 | $BEFORE_FILES | $AFTER_FILES | -$FILES_REMOVED |
| 总大小 | $BEFORE_SIZE | $AFTER_SIZE | - |

## 已清理内容

### 删除的文件/目录
- node_modules/ (根目录)
- __pycache__/ ($PYCACHE_COUNT 个目录)
- scripts/temp/
- test_feishu_minimal.md
- .DS_Store ($DS_STORE_COUNT 个文件)

### 移动的文件
- Python脚本 ($MOVED_PY 个) → scripts/maintenance/
- Markdown文件 ($MOVED_MD 个) → docs/archive/
- gac_articles_markdown → archive/

## 建议后续操作

1. 更新 .gitignore 文件
2. 验证项目功能正常
3. 提交清理后的项目

---

**清理成功！**
EOF

echo -e "${GREEN}✅ 项目清理完成！${NC}"
echo ""
echo "📄 清理报告已保存: $REPORT_FILE"
echo ""
echo -e "${YELLOW}💡 后续建议:${NC}"
echo "   1. 检查项目功能: 运行 /gongzhonghao 测试"
echo "   2. 更新 .gitignore: 防止临时文件再次提交"
echo "   3. 提交更改: git add . && git commit -m 'chore: 清理项目临时文件'"
echo ""
