# Claude Code 管道和重定向技巧

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 实战技巧
**标签**: #Claude Code #管道操作 #重定向 #进程替换 #数据处理

---

### 管道和重定向技巧

管道|大家都会用，但<(command)这个进程替换你试过没？它能把命令输出伪装成临时文件，贼方便。

#### 进程替换基础用法

对比两个版本的差异：

```bash
claude -p "这两个版本主要改了啥?" <(git show HEAD:config.json) <(git show HEAD~1:config.json)
```

实时分析系统日志里的异常：

```bash
claude -p "帮我看看这些异常是啥原因" <(dmesg | grep -i error | tail -50)
```

查看某个服务最近的崩溃信息：

```bash
claude -p "分析下为啥老崩溃" <(systemctl status nginx --no-pager | grep -A 10 "failed")
```

#### 远程配置对比

对比两台服务器的配置差异：

```bash
claude -p "两台服务器配置哪里不一样?" \
  <(ssh server1 "cat /etc/nginx/nginx.conf") \
  <(ssh server2 "cat /etc/nginx/nginx.conf")
```

对比生产环境和测试环境的数据库配置：

```bash
claude -p "生产库和测试库配置有啥区别?" \
  <(ssh prod-db "mysqldump --no-data dbname") \
  <(ssh test-db "mysqldump --no-data dbname")
```

#### 日志分析技巧

实时分析错误日志：

```bash
claude -p "这些错误是啥原因造成的?" <(tail -100 /var/log/app.log | grep ERROR)
```

分析访问日志的IP分布：

```bash
claude -p "分析访问IP的地理分布" <(awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -20)
```

#### 文件内容处理

比较两个目录的文件差异：

```bash
claude -p "这两个目录的文件有啥不一样?" \
  <(find dir1 -type f -exec md5sum {} \; | sort) \
  <(find dir2 -type f -exec md5sum {} \; | sort)
```

分析代码变更：

```bash
claude -p "我这次提交主要改了啥功能?" \
  <(git show --stat HEAD) \
  <(git diff HEAD~1 HEAD --name-only)
```

#### 实时监控组合

监控多个日志文件：

```bash
claude -p "监控系统整体状况" \
  <(tail -f /var/log/nginx/access.log) \
  <(tail -f /var/log/nginx/error.log) \
  <(tail -f /var/log/mysql/mysql.log)
```

监控容器状态：

```bash
claude -p "容器运行状况如何?" \
  <(docker stats --no-stream) \
  <(docker ps --format "table {{.Names}}\t{{.Status}}")
```

#### 数据处理管道

复杂的数据处理流程：

```bash
claude -p "分析这个数据报告" \
  <(cat sales_data.csv | awk -F',' '{sum+=$3} count++} END {print "平均:", sum/count, "总数:", count}' \
     | sort -rn | head -10)
```

处理日志提取关键信息：

```bash
claude -p "提取API调用的关键指标" \
  <(grep "POST /api" access.log | awk '{print $4,$7,$9}' | sed 's/\[//g' | sort)
```

#### 实用技巧总结

在CLAUDE.md里预设这些模板：

```bash
# 管道和重定向技巧

## 对比文件差异
- 比较配置文件: `claude -p "对比差异" <(cat file1) <(cat file2)`
- 比较目录内容: `claude -p "文件差异" <(ls -la dir1) <(ls -la dir2)`

## 日志分析
- 实时错误分析: `claude -p "错误原因" <(tail -100 error.log)`
- 访问统计: `claude -p "访问分析" <(awk '{print $1}' access.log | sort | uniq -c)`

## 远程操作
- 配置对比: `claude -p "配置差异" <(ssh server "cat config") <(cat local_config)`
- 批量命令: `claude -p "执行结果" <(ssh server "cmd1 && cmd2")`
```

进程替换的好处是不用建临时文件，直接把命令输出喂给Claude，干净利落。
