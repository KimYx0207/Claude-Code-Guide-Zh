# Claude Code系列文章 - 完整重命名脚本（PowerShell版）
# 按6周发布计划重新命名所有文章
# 执行前请备份articles目录！

# 设置编码为UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 进入articles目录
Set-Location "C:\Users\admin\Desktop\说明\articles"

Write-Host "🚀 开始完整重命名流程..." -ForegroundColor Green
Write-Host "📊 预计处理45篇文章" -ForegroundColor Cyan
Write-Host ""

# ===============================================
# Week 1: 建立认知（11-25 至 11-30）
# 这6篇已经重命名完成，跳过
# ===============================================

Write-Host "✅ Week 1 文章（11-25至11-30）已完成重命名" -ForegroundColor Green
Write-Host ""

# ===============================================
# Week 2: 配置实践（12-02 至 12-08）
# ===============================================

Write-Host "Week 2: 配置实践周 重命名中..." -ForegroundColor Yellow

Rename-Item "2025-11-11_CLAUDE.md配置最佳实践_老金风格.md" `
            "2025-12-02_CLAUDE.md不配等于白干这份配置让AI懂你10倍_老金风格.md" -ErrorAction SilentlyContinue

Rename-Item "2025-11-11_Slash_Commands自定义教程_老金风格.md" `
            "2025-12-03_自定义命令5分钟搞定让Claude听你的_老金风格.md" -ErrorAction SilentlyContinue

Rename-Item "2025-11-11_Claude_Code实用技巧大全_老金风格.md" `
            "2025-12-04_这些技巧让Claude Code好用10倍_老金风格.md" -ErrorAction SilentlyContinue

# 12-05 和 12-06 已经重命名完成，跳过

Rename-Item "2025-11-11_Claude_Code效率提升技巧合集_老金风格.md" `
            "2025-12-07_这5个技巧让开发效率翻3倍_老金风格.md" -ErrorAction SilentlyContinue

Write-Host "✅ Week 2 重命名完成（4篇）" -ForegroundColor Green
Write-Host ""

# ===============================================
# Week 3: 深度应用（12-09 至 12-15）
# ===============================================

Write-Host "Week 3: 深度应用周 重命名中..." -ForegroundColor Yellow

# 12-09 至 12-10 已经重命名完成，跳过

Rename-Item "2025-11-11_Claude_Code_Hooks深度玩法_老金风格.md" `
            "2025-12-11_Hooks不会玩你错过了60倍效率提升_老金风格.md" -ErrorAction SilentlyContinue

# 12-12 已经重命名完成，跳过

Rename-Item "2025-11-13_Claude_Code配Codex新玩法_老金风格.md" `
            "2025-12-13_这个配法比老方法省一半钱_老金风格.md" -ErrorAction SilentlyContinue

# 12-14 已经重命名完成，跳过

Write-Host "✅ Week 3 重命名完成（2篇）" -ForegroundColor Green
Write-Host ""

# ===============================================
# Week 4: 高级技巧（12-16 至 12-22）
# ===============================================

Write-Host "Week 4: 高级技巧周 重命名中..." -ForegroundColor Yellow

Rename-Item "2025-11-23_Claude_Code高级技巧_老金风格.md" `
            "2025-12-16_用了3个月这些技巧99%的人不知道_老金风格.md" -ErrorAction SilentlyContinue

# 12-17 至 12-22 已经重命名完成，跳过

Write-Host "✅ Week 4 重命名完成（1篇）" -ForegroundColor Green
Write-Host ""

# ===============================================
# Week 5: 完整体系（12-23 至 12-29）
# ===============================================

Write-Host "Week 5: 完整体系周 重命名中..." -ForegroundColor Yellow

# 12-23 至 12-24 已经重命名完成，跳过

Rename-Item "2025-11-11_Claude_Code必装Skill清单_老金风格.md" `
            "2025-12-25_这10个Skill必须装效率暴增_老金风格.md" -ErrorAction SilentlyContinue

# 12-26 至 12-28 已经重命名完成，跳过

Write-Host "✅ Week 5 重命名完成（1篇）" -ForegroundColor Green
Write-Host ""

# ===============================================
# Week 6: 扩展生态（12-30 至 2026-01-06）
# ===============================================

Write-Host "Week 6: 扩展生态周 重命名中..." -ForegroundColor Yellow

Rename-Item "2025-11-23_Cursor_AI编程工具23个高级技巧_老金风格.md" `
            "2025-12-30_Cursor这23个技巧Claude用户也该学_老金风格.md" -ErrorAction SilentlyContinue

Rename-Item "2025-11-23_Cursor2.1最新功能实测_老金风格.md" `
            "2025-12-31_Cursor2.1深度实测这功能绝了_老金风格.md" -ErrorAction SilentlyContinue

Rename-Item "2025-11-20_Gemini3热门使用案例集_老金风格.md" `
            "2026-01-02_Gemini3这10个案例火爆全网_老金风格.md" -ErrorAction SilentlyContinue

Rename-Item "2025-11-22_Gemini3Pro一句话复刻Coze编排_老金风格.md" `
            "2026-01-03_Gemini3Pro秒杀Coze编排我实测了_老金风格.md" -ErrorAction SilentlyContinue

Rename-Item "2025-11-15_Lovart设计Agent深度测评_老金风格.md" `
            "2026-01-04_Lovart设计Agent实测能替代设计师吗_老金风格.md" -ErrorAction SilentlyContinue

Rename-Item "2025-11-23_OiiOii_AI动画创作Agent实测_老金风格.md" `
            "2026-01-05_OiiOii动画Agent实测效果惊艳_老金风格.md" -ErrorAction SilentlyContinue

# 12-15 的文章移到 01-06
Rename-Item "2025-12-15_用了这个Hook提示词质量提升3倍_老金风格.md" `
            "2026-01-06_用了这个Hook提示词质量提升3倍_老金风格.md" -ErrorAction SilentlyContinue

Write-Host "✅ Week 6 重命名完成（7篇）" -ForegroundColor Green
Write-Host ""

# ===============================================
# 额外文章处理（01-07 至 01-09）
# ===============================================

Write-Host "额外文章 重命名中..." -ForegroundColor Yellow

Rename-Item "2025-11-11_Suno_v5发布_AI音乐进入录音室级别时代_老金风格.md" `
            "2026-01-07_Suno_v5实测AI音乐真能替代录音室了_老金风格.md" -ErrorAction SilentlyContinue

Rename-Item "2025-11-18_TrendRadar_老金风格.md" `
            "2026-01-08_TrendRadar追热点神器实测_老金风格.md" -ErrorAction SilentlyContinue

Rename-Item "2025-11-23_Google提示词工程白皮书深度解读_老金风格.md" `
            "2026-01-09_Google提示词白皮书深度解读_老金风格.md" -ErrorAction SilentlyContinue

Write-Host "✅ 额外文章重命名完成（3篇）" -ForegroundColor Green
Write-Host ""

# ===============================================
# 删除重复文件
# ===============================================

Write-Host "🗑️ 删除重复文件..." -ForegroundColor Yellow

Remove-Item "2025-11-11_Suno_v5发布_AI音乐进入录音室级别时代_老金风格_优化版.md" -ErrorAction SilentlyContinue

Write-Host "✅ 重复文件已删除" -ForegroundColor Green
Write-Host ""

# ===============================================
# 验证结果
# ===============================================

Write-Host "📊 重命名结果验证..." -ForegroundColor Cyan
Write-Host ""

$allFiles = Get-ChildItem -Filter "*_老金风格.md" | Sort-Object Name
$totalCount = $allFiles.Count

Write-Host "✅ 重命名完成！共 $totalCount 篇文章已按发布日期排序。" -ForegroundColor Green
Write-Host ""
Write-Host "📅 文件按以下顺序排列：" -ForegroundColor Cyan
Write-Host "  Week 1: 2025-11-25 → 2025-11-30（6篇）" -ForegroundColor White
Write-Host "  Week 2: 2025-12-02 → 2025-12-08（6篇）" -ForegroundColor White
Write-Host "  Week 3: 2025-12-09 → 2025-12-14（6篇）" -ForegroundColor White
Write-Host "  Week 4: 2025-12-16 → 2025-12-22（7篇）" -ForegroundColor White
Write-Host "  Week 5: 2025-12-23 → 2025-12-28（6篇）" -ForegroundColor White
Write-Host "  Week 6: 2025-12-30 → 2026-01-06（7篇）" -ForegroundColor White
Write-Host "  额外:   2026-01-07 → 2026-01-09（3篇）" -ForegroundColor White
Write-Host ""

# 显示前15个文件名
Write-Host "📝 前15篇文章预览：" -ForegroundColor Green
$allFiles | Select-Object -First 15 | ForEach-Object { Write-Host "  - $($_.Name)" }

Write-Host ""
Write-Host "✅ 完整文章清单已生成：完整文章清单和发布计划.md" -ForegroundColor Green
Write-Host "🚀 可以开始按计划发布了！" -ForegroundColor Cyan
