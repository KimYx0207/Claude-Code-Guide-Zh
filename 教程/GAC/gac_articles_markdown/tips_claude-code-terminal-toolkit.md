# Claude Code 终端工具箱配置

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 实战技巧
**标签**: #Claude Code #终端技巧 #工具配置 #效率提升

---

### Claude专属工具箱配置

我们平时用.bashrc或者.zshrc来定制自己的终端环境，其实给Claude也可以整一套专属工具集。

#### 创建工具集文件

在项目根目录创建一个.claude_env文件：

```bash
# .claude_env - Claude的专属工具集

# 代码搜索神器，比grep快多了
alias search='rg --hidden --no-ignore --color=always'

# 跑关键测试就行，全跑太慢了
alias fasttest='npm test -- --watch=false --coverage=false'

# 快速看看有哪些分支
alias branches='git branch -a --sort=-committerdate | head -10'

# 检查某个用户的权限配置
check_user_perms() {
  echo "查询用户 $1 的权限..."
  ./scripts/check-permissions.sh $1
}
```

#### 启动时加载

```bash
source .claude_env && claude
```

#### 在CLAUDE.md中说明

```bash
# 我给你准备的工具

- 搜代码用: search "关键词"
- 快速测试用: fasttest
- 看分支列表用: branches
- 查权限用: check_user_perms "用户名"
```

这样一来，Claude就有了自己熟悉的工作台，不容易出问题。

#### 扩展工具集

你还可以根据项目需要添加更多工具：

```bash
# Docker相关
alias dcup='docker-compose up -d'
alias dcdown='docker-compose down'
alias dps='docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'

# 日志查看
alias applog='tail -f logs/app.log'
alias errorlog='tail -f logs/error.log | grep -i error'

# 数据库操作
alias dbconnect='mysql -h localhost -u root -p'
alias dbbackup='mysqldump -h localhost -u root -p dbname > backup.sql'
```

#### 项目特定工具

针对不同类型的项目，可以配置专门的工具集：

```bash
alias dev='npm run dev'
alias build='npm run build'
alias lint='npm run lint --fix'
```

```bash
alias runserver='python manage.py runserver'
alias migrate='python manage.py migrate'
alias collectstatic='python manage.py collectstatic --noinput'
```

通过这种方式，Claude能够使用你预定义的工具集，大大提高操作效率。
