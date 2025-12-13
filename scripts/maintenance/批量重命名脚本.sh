#!/bin/bash
# Claude Code系列文章批量重命名脚本
# 按发布日期重新命名，使文件自动按发布顺序排列
# 执行前请备份articles目录！

cd "C:/Users/admin/Desktop/说明/articles" || exit

echo "开始批量重命名..."

# Week 1: 建立认知（11-25 至 11-30）
echo "Week 1: 重命名中..."

mv "2025-11-24_MCP官方服务器合集100多个现成工具_老金风格.md" \
   "2025-11-25_官方整理了100多个MCP工具拿来就用_老金风格.md"

mv "2025-11-24_awesome-claude-skills最全Claude技能合集_老金风格.md" \
   "2025-11-26_这个合集Claude的100多个技能都在这了_老金风格.md"

mv "2025-11-24_awesome-claude-code最全命令和扩展合集_老金风格.md" \
   "2025-11-27_这个合集Claude Code所有命令都在这了_老金风格.md"

mv "2025-11-24_claude-hooks全面Hooks合集强制代码规范_老金风格.md" \
   "2025-11-28_这个合集30多个Hook强制团队规范_老金风格.md"

mv "2025-11-24_claude-code-cheat-sheet终极技巧工作流_老金风格.md" \
   "2025-11-29_这个合集Claude Code所有技巧都在这了_老金风格.md"

mv "2025-11-24_commands-57个生产级命令多智能体编排_老金风格.md" \
   "2025-11-30_这个仓库57个命令让AI当团队了_老金风格.md"

# Week 2: 工具实践（12-02 至 12-12）
echo "Week 2: 重命名中..."

mv "2025-11-24_GitHub官方MCP服务器让AI直接操作你的代码仓库_老金风格.md" \
   "2025-12-02_昨晚才知道GitHub官方出神器了AI现在能直接改我代码_老金风格.md"

mv "2025-11-24_Context7让AI帮你查最新技术文档��神器_老金风格.md" \
   "2025-12-03_这个工具AI查技术文档比我还快_老金风格.md"

mv "2025-11-24_superpowers让Claude自动拥有20多个核心技能_老金风格.md" \
   "2025-12-05_装上这个Claude一下子会了20多种技能_老金风格.md"

mv "2025-11-24_playwright-skill让Claude自己会写测试代码_老金风格.md" \
   "2025-12-06_装了这个Skill Claude自己就会写测试了_老金风格.md"

mv "2025-11-24_Claude-Command-Suite十五个开箱即用的实用命令_老金风格.md" \
   "2025-12-08_这15个命令装上就能用_老金风格.md"

mv "2025-11-24_PlaywrightMCP微软官方浏览器自动化神器_老金风格.md" \
   "2025-12-09_微软官方出手了浏览器测试从2小时降到10分钟_老金风格.md"

mv "2025-11-24_PostgreSQL-MCP让AI直接操作数据库_老金风格.md" \
   "2025-12-10_这个MCP AI能直接改数据库了_老金风格.md"

mv "2025-11-24_Filesystem和Slack-MCP团队协作利器_老金风格.md" \
   "2025-12-12_这两个MCP团队协作效率翻倍_老金风格.md"

# Week 3: 深度应用（12-14 至 12-20）
echo "Week 3: 重命名中..."

mv "2025-11-24_claude-code-quality-hook-AI驱动代码质量修复_老金风格.md" \
   "2025-12-14_这个Hook代码质量问题自动修了_老金风格.md"

mv "2025-11-24_claude-code-prompt-improver让AI帮你优化提示词_老金风格.md" \
   "2025-12-15_用了这个Hook提示词质量提升3倍_老金风格.md"

mv "2025-11-24_claudekit智能守护和检查点系统_老金风格.md" \
   "2025-12-17_这个工具给AI装了安全护栏_老金风格.md"

mv "2025-11-24_claude-sessions开发会话跟踪记录_老金风格.md" \
   "2025-12-18_这个命令让AI对话不会丢了_老金风格.md"

mv "2025-11-24_claude-skills真实场景案例合集_老金风格.md" \
   "2025-12-19_看了这些案例才知道Skills能干这么多_老金风格.md"

mv "2025-11-24_claude-skills-collection官方和社区精选_老金风格.md" \
   "2025-12-20_官方推荐的Skills都在这个合集了_老金风格.md"

# Week 4: 系统提升（12-21 至 12-24）
echo "Week 4: 重命名中..."

mv "2025-11-24_claude-code-workflows自动化质量保证_老金风格.md" \
   "2025-12-21_用这个Workflow代码质量自动保证了_老金风格.md"

mv "2025-11-24_cc-sdd让AI自动写软件设计文档_老金风格.md" \
   "2025-12-22_这个命令设计文档自动生成了_老金风格.md"

mv "2025-11-24_claude-code-hooks-mastery从入门到精通_老金风格.md" \
   "2025-12-23_这套教程把Hooks从入门讲到精通了_老金风格.md"

mv "2025-11-24_claude-code-infrastructure-showcase完整开发环境搭建指南_老金风格.md" \
   "2025-12-24_这个仓库开发环境完整搭建全在这了_老金风格.md"

echo "重命名完成！共24篇文章已按发布日期排序。"
echo "文件现在按以下顺序排列："
echo "  2025-11-25 → 2025-12-24（共4周）"
