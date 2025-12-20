# 初始化 Memory Service 会话

初始化当前 Claude Code 会话的 Memory Service 上下文。

## 执行步骤

1. **存储会话信息**
   - 记录会话开始时间
   - 保存当前工作目录
   - 标记会话标识

2. **检查数据库状态**
   - 验证 Memory Service 可用性
   - 显示当前记忆统计

## 自动执行

```javascript
// 存储会话启动信息
mcp__mcp-router__store_memory({
  content: `Claude Code 会话启动 - ${new Date().toISOString()} - 工作目录: ${process.cwd()}`,
  tags: ["会话", "启动", "系统"],
  memory_type: "note"
})

// 检查数据库健康状态
mcp__mcp-router__check_database_health()
```

## 预期输出

- ✅ 会话信息已存储
- 📊 数据库健康状态报告
- 💾 当前记忆统计
