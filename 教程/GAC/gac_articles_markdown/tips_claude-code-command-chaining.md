# Claude Code 命令串联技巧

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 实战技巧
**标签**: #Claude Code #命令行 #Git技巧 #效率提升

---

### Claude命令串联技巧

会用单个命令算啥，真正的效率是把命令串起来一气呵成。在CLAUDE.md里预设这些命令组合模板：

#### Git追踪技巧合集

```bash
# Git 追踪技巧合集

- **追查某个函数是谁写的:**
  "用 grep 找到行号，再用 git blame 揪出作者"
  示例: `grep -n "functionName" src/app.js | head -1 | cut -d: -f1 | xargs -I {} git blame -L {},+5 src/app.js`

- **挖出最近新增的路由定义:**
  "git log 找提交，grep 筛选新增的路由代码"
  示例: `git log --since="30 days ago" --pretty=format: --name-only | sort -u | xargs grep -l "router\..*(" 2>/dev/null`

- **看看我改了哪些文件的 TODO 标记:**
  "先 diff 出改动的文件，然后在这些文件里搜 TODO"
  示例: `git diff --name-only HEAD~1 | xargs grep -n "TODO" 2>/dev/null | head -20`

- **统计某个作者最近提交次数:**
  "按作者过滤 git log，然后数行数"
  示例: `git log --author="张三" --since="1 week ago" --oneline | wc -l`
```

#### 系统监控组合

```bash
# 系统监控命令组合

- **查看系统资源占用Top10进程:**
  `ps aux --sort=-%cpu | head -11 && echo "=== 内存占用 ===" && ps aux --sort=-%mem | head -11`

- **检查磁盘空间使用情况:**
  `df -h && echo "=== 大文件检查 ===" && find . -type f -size +100M 2>/dev/null | head -10`

- **实时监控网络连接:**
  `netstat -an | grep ESTABLISHED | wc -l && echo "=== 监听端口 ===" && netstat -tlnp | grep LISTEN`
```

#### 日志分析组合

```bash
# 日志分析技巧

- **统计错误类型分布:**
  `grep -i error app.log | cut -d' ' -f4- | sort | uniq -c | sort -rn | head -10`

- **查找特定时间段内的异常:**
  `grep "2024-01-10" app.log | grep -i -E "(error|exception|fail)" | tail -20`

- **分析API调用统计:**
  `grep "POST /api" access.log | awk '{print $7}' | sort | uniq -c | sort -rn | head -10`
```

#### 文件操作组合

```bash
# 文件处理技巧

- **批量重命名文件:**
  `ls *.txt | while read f; do mv "$f" "${f%.txt}.bak"; done`

- **查找并删除重复文件:**
  `find . -type f -exec md5sum {} \; | sort | uniq -d -w32 | cut -d' ' -f3- | xargs rm`

- **统计代码行数:**
  `find . -name "*.py" -o -name "*.js" | xargs wc -l | tail -1`
```

有了这些预设的命令组合，你直接问：“找找最近一个月谁提交的API接口最多”，Claude立马就懂该咋干。

#### 自定义命令模板

你也可以根据项目需求创建自定义模板：

```bash
# 项目特定命令

- **重启所有服务:**
  `docker-compose down && docker-compose up -d && sleep 10 && docker-compose ps`

- **数据库备份恢复:**
  `mysqldump -u root -p dbname > backup.sql && mysql -u root -p new_dbname < backup.sql`

- **批量处理图片:**
  `for img in *.jpg; do convert "$img" -resize 800x600 "processed_$img"; done`
```

这样Claude就能按照预设的模式，快速完成复杂的操作序列。
