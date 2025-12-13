---
name: 91-test-mcp
description: 🧪 测试MCP工具可用性 - 实际调用MCP工具验证连接
---

# 🧪 MCP工具实战测试

**通过实际调用验证MCP工具是否正常工作**

---

## 🚀 使用方法

```
/test-mcp-tools
```

---

## 🤖 AI执行步骤

### 步骤1：列出当前可用的MCP服务器

```
请列出当前Claude Code连接的MCP服务器
```

预期输出：
```
当前可用的MCP服务器：
1. task-master-ai
2. mcp-router
3. exa
4. context7
5. playwright
6. filesystem
7. github
```

### 步骤2：测试核心搜索工具

#### 2.1 测试Brave搜索（mcp-router）

```
请使用Brave搜索（通过mcp__mcp-router__brave_web_search）搜索：
"Claude Code 2025最新功能"

限制：只返回前3个结果的标题和URL
```

**验证标准**：
- ✅ 成功返回搜索结果
- ✅ 结果包含标题、URL、摘要
- ❌ 如果返回401/403 → API密钥错误
- ❌ 如果工具不存在 → MCP服务器未配置

#### 2.2 测试Exa深度搜索

```
请使用Exa搜索（通过mcp__exa__web_search_exa）搜索：
"Python异步编程最佳实践"

参数：
- num_results: 3
- type: "neural"

只返回前3个结果的标题和URL
```

**验证标准**：
- ✅ 成功返回深度内容
- ✅ 结果质量高于普通搜索
- ❌ 如果返回错误 → API密钥问题或MCP未配置

#### 2.3 测试Context7技术文档查询

```
请使用Context7（通过mcp__context7__resolve_library_uri）：
查询 "FastAPI" 库的ID

然后使用 mcp__context7__search_library_docs 搜索：
"WebSocket" 相关文档
```

**验证标准**：
- ✅ 成功解析库ID
- ✅ 返回技术文档摘要
- ❌ 如果失败 → Context7 MCP未配置

### 步骤3：测试Task Master AI

```
请使用Task Master AI工具：
mcp__taskmaster-ai__get_tasks(projectRoot="C:\\Users\\admin\\Desktop\\说明")

只返回任务总数和状态统计
```

**验证标准**：
- ✅ 成功返回任务列表
- ✅ 显示任务数量和状态
- ❌ 如果失败 → Task Master未初始化或配置错误

### 步骤4：测试文件系统访问

```
请使用filesystem工具：
列出项目根目录下的所有Markdown文件（*.md）

只返回文件名列表
```

**验证标准**：
- ✅ 成功列出文件
- ✅ 路径正确
- ❌ 如果失败 → filesystem MCP配置错误或路径问题

### 步骤5：生成测试报告

根据以上测试结果，生成综合报告：

```markdown
## 🧪 MCP工具测试报告

**测试时间**：[当前时间]

### 测试结果概览

| 工具 | 状态 | 说明 |
|------|------|------|
| Brave搜索 | ✅/❌ | ... |
| Exa搜索 | ✅/❌ | ... |
| Context7 | ✅/❌ | ... |
| Task Master | ✅/❌ | ... |
| Filesystem | ✅/❌ | ... |

### 功能可用性

**可用功能**：
- ✅ /gongzhonghao - 公众号文章创作
- ✅ /hotspot - 热点扫描
- ❌ /auto-baokuan - 缺少Brave搜索

**不可用功能及原因**：
1. [功能名] - [原因]

### 修复建议

[如果有失败项，提供具体修复步骤]

### 总结

- 测试通过: X/5
- 测试失败: X/5
- 整体状态: [健康/需要修复/严重问题]
```

---

## 📊 测试输出示例

### 全部通过

```
🧪 MCP工具测试报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

测试时间：2025-12-02 14:30:25

✅ 测试1：Brave搜索
   搜索结果：
   1. Claude Code 2025新功能介绍 - https://...
   2. AI编程助手对比评测 - https://...
   3. Claude Code使用指南 - https://...
   状态：成功

✅ 测试2：Exa深度搜索
   搜索结果：
   1. Python异步编程完全指南 - https://...
   2. asyncio最佳实践 - https://...
   3. 协程性能优化技巧 - https://...
   状态：成功

✅ 测试3：Context7文档查询
   库ID：/tiangolo/fastapi
   搜索结果：FastAPI WebSocket支持
   状态：成功

✅ 测试4：Task Master AI
   总任务：15
   - pending: 5
   - in-progress: 2
   - done: 8
   状态：成功

✅ 测试5：文件系统访问
   找到文件：
   - CLAUDE.md
   - README.md
   - docs/MCP服务器配置指南.md
   状态：成功

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
测试通过: 5/5 ✅
整体状态: 健康

所有MCP工具正常工作！可以使用全部功能。
```

### 有失败项

```
🧪 MCP工具测试报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

测试时间：2025-12-02 14:30:25

❌ 测试1：Brave搜索
   错误：MCP工具不存在
   原因：mcp-router MCP服务器未配置
   状态：失败

❌ 测试2：Exa深度搜索
   错误：401 Unauthorized
   原因：EXA_API_KEY未设置或无效
   状态：失败

✅ 测试3：Context7文档查询
   状态：成功

✅ 测试4：Task Master AI
   状态：成功

❌ 测试5：文件系统访问
   错误：路径不存在
   原因：filesystem MCP配置路径错误
   状态：失败

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
测试通过: 2/5 ❌
整体状态: 需要修复

🔧 修复建议：

1. 配置mcp-router MCP服务器
   编辑 .cursor/mcp.json，添加：
   {
     "mcp-router": {
       "command": "npx",
       "args": ["-y", "@modelcontextprotocol/server-brave-search"],
       "env": { "BRAVE_API_KEY": "YOUR_KEY" }
     }
   }

2. 设置EXA_API_KEY
   在 .env 文件中添加：
   EXA_API_KEY="your_exa_api_key_here"

3. 修复filesystem路径
   检查 .cursor/mcp.json 中的路径是否正确

修复后运行：
• /check-mcp - 验证配置
• /test-mcp-tools - 重新测试
```

---

## 🔧 快速修复

如果测试失败，按以下步骤修复：

### 步骤1：检查配置
```
/check-mcp
```

### 步骤2：阅读配置指南
打开 `docs/MCP服务器配置指南.md`

### 步骤3：修复问题
根据报告中的建议修复

### 步骤4：重启IDE
完全关闭并重新打开IDE

### 步骤5：重新测试
```
/test-mcp-tools
```

---

## 📚 相关命令

- `/check-mcp` - 检查MCP依赖和配置
- `/gongzhonghao` - 测试完整的文章创作流程
- `/hotspot` - 测试热点扫描功能

---

## ⚠️ 注意事项

1. **API配额限制**
   - Brave搜索：免费层2000次/月
   - Exa搜索：免费层1000次/月
   - 测试会消耗配额

2. **网络连接**
   - 确保能访问API服务器
   - 某些地区可能需要代理

3. **API密钥安全**
   - 不要在报告中显示完整密钥
   - 定期轮换密钥

---

**版本**：1.0.0
**更新日期**：2025-12-02
