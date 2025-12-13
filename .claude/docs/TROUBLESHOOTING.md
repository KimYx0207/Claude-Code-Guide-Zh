# Claude Code故障排查指南

**版本**：V1.0
**更新日期**：2025-12-12
**适用范围**：公众号写作助手项目

---

## 按问题类型分类

### 一、安装配置问题

#### 问题1：命令找不到

**症状**：
```
/write → 提示"Unknown command"
```

**原因**：
- Commands目录重组后路径变化
- 命令文件不存在

**解决方案**：
```bash
# 1. 检查命令文件是否存在
ls .claude/commands/core/01-write.md

# 2. 运行/help查看所有可用命令

# 3. 检查settings.json配置
cat .claude/settings.json
```

---

#### 问题2：Hook执行失败

**症状**：
```
Hook failed: python .claude/hooks/pre_tool_use_validator.py
```

**原因**：
- Python不在PATH中
- 脚本没有执行权限

**解决方案**：
```bash
# 1. 检查Python
python --version  # 应显示Python 3.x

# 2. 添加执行权限（Linux/Mac）
chmod +x .claude/hooks/*.py

# 3. 测试Hook脚本
echo '{}' | python .claude/hooks/pre_tool_use_validator.py
```

---

#### 问题3：MCP工具不可用

**症状**：
```
mcp__mcp-router__search not found
```

**解决方案**：
```bash
# 1. 运行诊断命令
/test-mcp

# 2. 检查.mcp.json配置
cat .mcp.json

# 3. 重启Claude Code
/exit
claude
```

---

### 二、执行问题

#### 问题4：脚本导入错误

**症状**：
```
ModuleNotFoundError: No module named 'config.brands'
```

**原因**：
- Scripts目录重组后导入路径变化
- 缺少__init__.py

**解决方案**：
```bash
# 1. 检查config目录
ls .claude/skills/gongzhonghao-writer/config/

# 2. 确保__init__.py存在
ls .claude/skills/gongzhonghao-writer/config/__init__.py

# 3. 测试导入
cd .claude/skills/gongzhonghao-writer
python -c "from config.brands import CORE_BRANDS; print(len(CORE_BRANDS))"
```

---

#### 问题5：文件路径错误

**症状**：
```
FileNotFoundError: articles/xxx.md
```

**原因**：
- 相对路径问题
- 工作目录不正确

**解决方案**：
```bash
# 1. 检查当前目录
pwd

# 2. 确保在项目根目录
cd /path/to/公众号写作助手

# 3. 使用绝对路径
```

---

### 三、性能问题

#### 问题6：执行速度慢

**症状**：
- `/write`命令执行超过15秒

**可能原因**：
- 上下文过长
- MCP工具响应慢
- 网络问题

**解决方案**：
```bash
# 1. 清空会话上下文
/clear

# 2. 检查MCP工具
/test-mcp

# 3. 检查网络
ping api.anthropic.com

# 4. 使用更快的模型（如果适用）
```

---

#### 问题7：Token消耗过多

**症状**：
- 单次写作消耗>30000 tokens

**解决方案**：
- 已优化：精简了Prompt文档
- 使用/clear定期清理上下文
- 避免重复加载大文件

---

### 四、质量问题

#### 问题8：质量检测不通过

**症状**：
```
AI腔检测：35分（阈值<20）
```

**解决方案**：
```bash
# 1. 查看详细报告
cd .claude/skills/gongzhonghao-writer/scripts/core
python quality_detector.py "articles/文章.md"

# 2. 根据建议修改

# 3. 重新检测
python quality_detector.py "articles/文章.md"
```

---

#### 问题9：标题评分低

**症状**：
```
SEO评分：45分（建议>70）
```

**解决方案**：
```bash
# 1. 重新生成标题
/title-gen [主题]

# 2. 评分多个标题
/title-score [标题1]
/title-score [标题2]

# 3. 选择评分最高的
```

---

## 按症状快速查找

| 症状关键词 | 相关问题 |
|-----------|---------|
| Unknown command | 问题1 |
| Hook failed | 问题2 |
| ModuleNotFoundError | 问题4 |
| FileNotFoundError | 问题5 |
| 执行慢 | 问题6 |
| Token多 | 问题7 |
| 质量不通过 | 问题8 |

---

## 紧急救援

```bash
# 1. 重启Claude Code
/exit
claude

# 2. 清空所有缓存
/clear

# 3. 检查配置
cat .claude/settings.json

# 4. 运行诊断
/test-mcp
```

---

**故障排查版本**：V1.0
**最后更新**：2025-12-12
