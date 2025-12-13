# Claude Code 配合 sshpass 远程自动化

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 实战技巧
**标签**: #Claude Code #sshpass #远程部署 #自动化运维 #服务器管理

---

### sshpass 远程自动化方案

sshpass是个啥？说白了，sshpass就是能让你在命令行里直接传密码的工具，不用每次都手动输。虽然安全性上有争议，但在开发测试环境真的超方便。

#### 安装sshpass

```bash
# macOS
brew install sshpass

# Ubuntu/Debian
apt-get install sshpass

# CentOS/RHEL
yum install sshpass
```

#### 配置Claude连接远程服务器

在CLAUDE.md里告诉Claude怎么连接服务器：

```bash
# 服务器连接配置

## 测试服务器
- 地址: 192.168.2.24
- 用户: root
- 密码: xxxx
- 连接命令: `sshpass -p 'xxxxx' ssh -o StrictHostKeyChecking=no root@192.168.2.24`

## 生产服务器
- 地址: 192.168.1.100
- 用户: deploy
- 使用SSH密钥连接: `ssh deploy@192.168.1.100`

## 常用操作模板
- 查看服务状态: `systemctl status 服务名`
- 查看日志: `journalctl -u 服务名 -n 100 --no-pager`
- 重启服务: `systemctl restart 服务名`
```

#### 远程部署服务

让Claude帮你部署新版本：

```bash
# 先让Claude构建本地代码
claude "帮我打个生产包"

# 然后让它推送到服务器并部署
claude "把dist目录通过scp传到192.168.2.24的/app/myapp目录"
```

Claude会执行类似这样的命令：

```bash
sshpass -p 'xxxxxxxx' scp -o StrictHostKeyChecking=no -r dist/* root@192.168.2.24:/app/myapp/
sshpass -p 'xxxxxxxx' ssh -o StrictHostKeyChecking=no root@192.168.2.24 "cd /app/myapp && systemctl restart myapp"
```

#### 远程排查服务器问题

半夜服务挂了，快速定位问题：

```bash
claude "帮我检查192.168.2.24服务器的kafka配置，看看监听地址配的对不对"
```

Claude会执行：

```bash
sshpass -p 'xxxxxxxx' ssh -o StrictHostKeyChecking=no root@192.168.2.24 \
  "cat /app/kafka_2.13-4.0.0/config/server.properties | grep -E '(listeners|advertised)'"
```

更全面的健康检查：

```bash
claude "全面检查一下192.168.2.24服务器，看看哪里有问题"
```

```bash
sshpass -p 'xxxxxxx' ssh -o StrictHostKeyChecking=no root@192.168.2.24 << 'EOF'
echo "=== 服务状态 ==="
systemctl status kafka --no-pager

echo -e "\n=== 最近的错误日志 ==="
journalctl -u kafka -n 50 --no-pager | grep -i error

echo -e "\n=== 磁盘空间 ==="
df -h

echo -e "\n=== 内存使用 ==="
free -h

echo -e "\n=== 端口监听 ==="
netstat -tulpn | grep -E '(9092|9093)'
EOF
```

#### 推送Docker镜像到服务器

构建本地镜像并推送到服务器：

```bash
# 让Claude构建本地镜像
claude "用当前代码构建一个Docker镜像，标签是myapp:v1.2.3"

# 保存镜像为文件
claude "把这个镜像导出成tar文件"

# 传到服务器并加载
claude "把镜像文件传到192.168.2.24并加载运行"
```

实际执行的命令：

```bash
# 构建镜像
docker build -t myapp:v1.2.3 .

# 导出镜像
docker save myapp:v1.2.3 | gzip > myapp-v1.2.3.tar.gz

# 传输到服务器
sshpass -p 'xxxnxxx' scp -o StrictHostKeyChecking=no \
  myapp-v1.2.3.tar.gz root@192.168.2.24:/tmp/

# 在服务器上加载并运行
sshpass -p 'xxxxxxN' ssh -o StrictHostKeyChecking=no root@192.168.2.24 << 'EOF'
docker load < /tmp/myapp-v1.2.3.tar.gz
docker stop myapp || true
docker rm myapp || true
docker run -d --name myapp -p 8080:8080 myapp:v1.2.3
rm /tmp/myapp-v1.2.3.tar.gz
EOF
```

#### 实时监控日志

实时看服务器日志：

```bash
claude "帮我实时监控192.168.2.24的kafka日志，过滤出ERROR和WARN级别的"
```

```bash
sshpass -p 'xxxxxx' ssh -o StrictHostKeyChecking=no root@192.168.2.24 \
  "journalctl -u kafka -f | grep -E '(ERROR|WARN)'"
```

或者直接看文本日志：

```bash
sshpass -p 'xxxxxxx' ssh -o StrictHostKeyChecking=no root@192.168.2.24 \
  "tail -f /app/kafka_2.13-4.0.0/logs/server.log | grep -E '(ERROR|WARN)'"
```

#### 实用运维命令模板

在CLAUDE.md里预设常用的运维命令：

```bash
# 常用运维命令模板(使用sshpass)

## 测试服务器快捷命令
SSH_CMD="sshpass -p 'xxxxx' ssh -o StrictHostKeyChecking=no root@192.168.2.24"

## 快速诊断
- 检查所有服务: `$SSH_CMD "systemctl list-units --type=service --state=running"`
- 查看系统负载: `$SSH_CMD "uptime && top -bn1 | head -20"`
- 检查磁盘IO: `$SSH_CMD "iostat -x 1 3"`

## 日志分析
- 统计错误数量: `$SSH_CMD "journalctl -u kafka --since '1 hour ago' | grep ERROR | wc -l"`
- 找最频繁的错误: `$SSH_CMD "journalctl -u kafka --since '1 day ago' | grep ERROR | sort | uniq -c | sort -rn | head -10"`

## Docker相关
- 清理无用镜像: `$SSH_CMD "docker image prune -af"`
- 查看容器资源: `$SSH_CMD "docker stats --no-stream"`
- 查看容器日志: `$SSH_CMD "docker logs --tail 100 容器名"`

## 文件传输
- 上传文件: `sshpass -p 'xxxxxxx' scp -o StrictHostKeyChecking=no 本地文件 root@192.168.2.24:/目标路径`
- 下载文件: `sshpass -p 'xxxxxxx' scp -o StrictHostKeyChecking=no root@192.168.2.24:/远程文件 ./本地路径`
```

#### 安全提醒

生产环境建议用SSH密钥认证，密码写在命令里确实不太安全。但在测试环境或者开发环境，sshpass真的是个效率神器。

通过这种方式，Claude能够自动完成远程服务器的部署、监控和故障排查，大大提升运维效率。
