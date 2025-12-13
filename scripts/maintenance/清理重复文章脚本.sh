#!/bin/bash
# 清理12-16和12-17的重复文章
# 把Skills文章移到12-29和01-03

cd "/c/Users/admin/Desktop/说明/articles" || exit

echo "🧹 清理重复文章..."
echo ""

# 把"20多种技能"从12-16移到12-29
mv "2025-12-16_装上这个Claude一下子会了20多种技能_老金风格.md" \
   "2025-12-29_装上这个Claude一下子会了20多种技能_老金风格.md" 2>/dev/null

# 把"写测试Skill"从12-17移到01-03
mv "2025-12-17_装了这个Skill Claude自己就会写测试了_老金风格.md" \
   "2026-01-03_装了这个Skill Claude自己就会写测试了_老金风格.md" 2>/dev/null

echo "✅ 清理完成！"
echo ""
echo "📊 调整后的文章分布："
echo "  - 12-16: 用了3个月这些技巧99%的人不知道（保留）"
echo "  - 12-17: 这个工具给AI装了安全护栏（保留）"
echo "  - 12-29: 装上这个Claude一下子会了20多种技能（新位置）"
echo "  - 01-03: 装了这个Skill Claude自己就会写测试了（新位置）"
echo ""
