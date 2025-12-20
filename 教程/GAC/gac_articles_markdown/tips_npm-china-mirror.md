# NPM 中国加速配置指南

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 环境配置
**标签**: #NPM #镜像源 #网络加速 #开发环境

---

由于网络环境原因，国内开发者使用 NPM 官方源下载包时经常遇到速度慢或连接失败的问题。本指南提供完整的 NPM 中国加速配置方案。

### 目录导览

- 快速配置
- 推荐镜像源
- 配置方法
- 多镜像管理
- 企业内网配置
- 常见问题

### 快速配置

#### 方法一：淘宝镜像（推荐）

```bash
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 验证配置
npm config get registry
```

#### 方法二：使用 cnpm

```bash
# 安装 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com

# 使用 cnpm 替代 npm
cnpm install package-name
```

### 推荐镜像源

### 配置方法

#### 全局配置

```bash
# 查看当前配置
npm config list

# 设置镜像源
npm config set registry https://registry.npmmirror.com

# 恢复官方源
npm config set registry https://registry.npmjs.org

# 删除镜像配置
npm config delete registry
```

#### 项目级配置

在项目根目录创建 .npmrc 文件：

```bash
# .npmrc
registry=https://registry.npmmirror.com
```

#### 临时使用

```bash
# 临时指定镜像源
npm install --registry https://registry.npmmirror.com

# 安装单个包时指定镜像源
npm install package-name --registry https://registry.npmmirror.com
```

### 多镜像管理

#### 使用 nrm 工具

```bash
# 安装 nrm
npm install -g nrm

# 查看可用镜像源
nrm ls

# 切换到淘宝镜像
nrm use taobao

# 添加自定义镜像源
nrm add custom https://custom.registry.com

# 测试镜像源速度
nrm test
```

#### 手动管理多镜像

```bash
# 保存当前配置
npm config get registry > current-registry.txt
```

创建切换镜像脚本：

```bash
#!/bin/bash
# switch-npm-registry.sh

case $1 in
  "taobao")
    npm config set registry https://registry.npmmirror.com
    echo "已切换到淘宝镜像"
    ;;
  "official")
    npm config set registry https://registry.npmjs.org
    echo "已切换到官方镜像"
    ;;
  "tencent")
    npm config set registry https://mirrors.cloud.tencent.com/npm/
    echo "已切换到腾讯云镜像"
    ;;
  *)
    echo "用法: $0 {taobao|official|tencent}"
    ;;
esac
```

### 企业内网配置

#### 配置企业私有源

```bash
# 设置企业私有源
npm config set registry http://npm.company.com

# 配置认证信息
npm config set _auth "base64-encoded-credentials"

# 或使用 token 认证
npm config set //npm.company.com/:_authToken "your-auth-token"
```

#### 混合源配置

```bash
# .npmrc
registry=https://registry.npmmirror.com

# 企业私有包使用内网源
@company:registry=http://npm.company.com
//npm.company.com/:_authToken="your-auth-token"

# 特定包使用官方源
@babel:registry=https://registry.npmjs.org
```

#### 代理配置

```bash
# 设置 HTTP 代理
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# 设置不走代理的地址
npm config set no-proxy "localhost,127.0.0.1,company.com"

# 删除代理配置
npm config delete proxy
npm config delete https-proxy
```

### 包管理器对比

#### NPM vs CNPM vs PNPM vs YARN

#### PNPM 镜像配置

```bash
# 设置 PNPM 镜像
pnpm config set registry https://registry.npmmirror.com

# 查看配置
pnpm config get registry
```

#### YARN 镜像配置

```bash
# 设置 YARN 镜像
yarn config set registry https://registry.npmmirror.com

# 查看配置
yarn config get registry
```

### 高级配置

#### 缓存管理

```bash
# 查看缓存目录
npm config get cache

# 清理缓存
npm cache clean --force

# 设置缓存目录
npm config set cache /path/to/cache
```

#### 超时设置

```bash
# 设置连接超时（毫秒）
npm config set timeout 60000

# 设置重试次数
npm config set fetch-retries 3

# 设置重试间隔
npm config set fetch-retry-mintimeout 10000
```

#### SSL 配置

```bash
# 禁用 SSL 验证（不推荐用于生产环境）
npm config set strict-ssl false

# 设置 CA 证书
npm config set ca /path/to/ca-cert.pem

# 设置客户端证书
npm config set cert /path/to/client-cert.pem
npm config set key /path/to/client-key.pem
```

### 常见问题

#### 1. 镜像源设置后仍然很慢

- 镜像源同步延迟
- 网络环境问题
- DNS 解析问题

```bash
# 尝试不同镜像源
nrm test

# 清理 DNS 缓存（Windows）
ipconfig /flushdns

# 清理 DNS 缓存（macOS）
sudo dscacheutil -flushcache
```

#### 2. 某些包无法下载

- 镜像源未同步该包
- 包名拼写错误
- 版本号问题

```bash
# 临时切换到官方源
npm install package-name --registry https://registry.npmjs.org

# 检查包名和版本
npm search package-name
```

#### 3. 企业网络下配置问题

- 防火墙阻拦
- 代理配置错误
- 证书问题

```bash
# 检查网络连通性
curl -I https://registry.npmmirror.com

# 配置代理
npm config set proxy http://proxy:port
npm config set https-proxy http://proxy:port

# 忽略 SSL 证书（临时方案）
npm config set strict-ssl false
```

#### 4. 权限问题

- 全局包安装权限不足
- npm 目录权限问题

```bash
# macOS/Linux：修改 npm 全局目录权限
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# 或使用 nvm 管理 Node.js 版本
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### 配置检查清单

- 设置了合适的镜像源
- 配置了项目级 .npmrc 文件
- 安装了镜像源管理工具（nrm）
- 配置了企业内网代理（如需要）
- 测试了包安装速度
- 备份了配置文件

### 推荐工作流

项目初始化时：
创建 .npmrc 文件设置镜像源

团队协作时：
统一镜像源配置，避免依赖版本不一致

CI/CD 环境：
使用稳定的镜像源，设置合理的超时时间

开发调试时：
使用 nrm 快速切换镜像源进行对比测试

### 相关资源

- NPM 官方文档
- 淘宝 NPM 镜像
- NRM 工具
- 企业级 NPM 管理

通过合理配置 NPM 镜像源，可以显著提升国内开发环境下的包管理效率。建议根据实际网络环境选择最适合的镜像源，并做好配置备份。

### 技术支持

配置过程中如遇问题：

- 联系客服微信：iweico

### 相关文档

- Claude Code 安装指南 - 开发环境配置
- Claude Code 配置 - 系统配置选项
- 安装指南 - 完整环境配置
- 中继选择 - 网络连接优化
