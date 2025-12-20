# Claude Code 完整安装指南：从零开始到成功运行

> **课程信息**
>
> - **预计学时**：6-8小时
> - **难度等级**：⭐ 零基础入门
> - **更新日期**：2025年12月
> - **适用版本**：Claude Code v2.0+

---

## 📚 本课学习目标

完成本课学习后，你将能够：

1. **理解Claude Code的核心价值**：掌握Claude Code与传统AI编程工具的本质区别
2. **搭建完整开发环境**：在任意操作系统上成功安装Node.js运行时
3. **配置Anthropic服务**：获取并正确配置API密钥
4. **完成Claude Code安装**：掌握npm/yarn/pnpm三种安装方式
5. **集成到主流IDE**：VS Code、Cursor、JetBrains等编辑器配置
6. **验证环境可用性**：通过Hello World测试确认所有组件正常工作
7. **掌握故障排查技能**：独立解决90%的常见安装问题

---

## 🗺️ 学习路径导航（先看这里！）

> 💡 **根据你的情况选择学习路径**：这是一篇3000+行的长教程，不用全看！根据你的目标选择路径。

### 路径A：快速上手（⏱️ 60分钟）

**适合人群**：急着体验Claude Code，想快速跑起来

**只看这些章节**（其他跳过）：

```
✅ 术语表（5分钟） - 快速了解关键概念
✅ 第3部分：Node.js安装（20分钟） - 只看你的操作系统对应小节
✅ 第4部分：API Key配置（10分钟）
✅ 第5部分：Claude Code安装（10分钟）
✅ 第6部分：启动与验证（15分钟）
```

**60分钟后你能达到**：成功启动Claude Code，运行Hello World示例

---

### 路径B：完整学习（⏱️ 6-8小时）

**适合人群**：想深入理解每个细节，掌握所有功能

**学习顺序**：从头到尾所有章节

**建议分段学习**：
- 第1天（2小时）：第1-5部分（理解+安装）
- 第2天（2小时）：第6-7部分（验证+IDE集成）
- 第3天（2小时）：第8-10部分（测试+故障排查+FAQ）

---

### 路径C：问题排查（⏱️ 10分钟）

**适合人群**：安装过程遇到问题，需要快速解决

**直接跳到这些章节**：

```
🔧 第8部分：故障排查 - 按错误类型查找解决方案
🔧 第10部分：FAQ - 学员最常问的20个问题
```

**使用方法**：
1. 按 `Ctrl + F` 搜索你的错误信息关键词
2. 找到对应的Q&A
3. 按步骤解决

---

### 路径D：专项学习（⏱️ 30-60分钟/主题）

**适合人群**：已经装好Claude Code，想学习某个特定功能

| 想学什么 | 看哪几节 | 预计时间 |
|----------|---------|---------|
| **IDE集成** | 第7部分 | 30分钟 |
| **权限配置** | 第6.5.2节（危险参数）+ 第7.3节 | 20分钟 |
| **故障排查** | 第9部分 + 第9部分FAQ | 1小时 |

---

## 术语表（小白必读）

在开始之前，先了解这些关键术语：

| 术语                    | 英文全称                          | 通俗解释                                                           |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------ |
| **CLI**           | Command Line Interface            | 命令行界面，就是那个黑色/白色的文字输入窗口，通过打字来操作电脑    |
| **Node.js**       | -                                 | JavaScript的运行环境，让JavaScript能在电脑上运行（不只是浏览器里） |
| **npm**           | Node Package Manager              | Node.js的包管理器，类似手机的应用商店，用来安装各种工具            |
| **LTS**           | Long Term Support                 | 长期支持版本，稳定、bug少、官方持续维护，适合正式使用              |
| **API**           | Application Programming Interface | 应用程序接口，软件之间"对话"的方式                                 |
| **API Key**       | -                                 | API密钥，类似"通行证"，证明你有权使用某个服务                      |
| **Token**         | -                                 | 计费单位，AI处理文字的最小单元，约等于0.75个英文单词或1-2个汉字    |
| **环境变量**      | Environment Variable              | 操作系统级别的配置项，程序可以读取但不会写在代码里                 |
| **PATH**          | -                                 | 系统环境变量之一，告诉电脑去哪里找可执行程序                       |
| **终端/Terminal** | -                                 | 运行命令行的程序窗口                                               |
| **全局安装**      | Global Install                    | 安装后在电脑任何位置都能使用的安装方式                             |

---

## 第一部分：Claude Code 简介

### 1.1 什么是 Claude Code

Claude Code 是 Anthropic 公司开发的**命令行AI编程助手**。与传统代码编辑器插件不同，它是一个独立运行的CLI工具，通过终端与开发者交互。

**核心特征：**

- **本地优先架构**：代码在你的电脑上处理，不上传到云端
- **全能AI助手**：基于Claude模型，理解复杂技术需求
- **工具整合能力**：可调用文件操作、终端命令、Web搜索等工具
- **对话式开发**：用自然语言描述需求，AI帮你生成和修改代码

**简单理解：**

把Claude Code想象成一个24小时在线的高级程序员。你用中文或英文告诉他需求，他能帮你写代码、改bug、搜资料、运行测试。**最大特点是通过命令行工作**，可以直接操作你的代码文件、运行系统命令，完全脚本化和自动化。

### 1.2 核心优势：为什么值得学习

#### 优势1：隐私与安全

传统在线AI工具需要你把代码上传到服务器分析。Claude Code不同：

- ✅ 代码文件留在本地，AI只读取你授权的文件
- ✅ 可在企业内网环境使用（配合私有Claude部署）
- ✅ 敏感项目（如金融、医疗系统）也能安全使用

#### 优势2：真正的编程助手

**实际案例：**

```
你：帮我把项目中所有console.log改成更规范的日志系统

Claude Code：
1. [扫描] 找到37个console.log调用
2. [询问] 是否使用Winston日志库？
3. [执行] 安装依赖、创建配置、批量替换代码
4. [验证] 运行测试确认改动正确
```

#### 优势3：多语言多框架支持

不限于特定技术栈：

- **前端**：React、Vue、Next.js
- **后端**：Node.js、Python、Go
- **移动端**：React Native、Flutter
- **基础设施**：Docker、Kubernetes配置

### 1.3 与主流工具对比

**CLI工具 vs IDE集成工具对比：**

| 对比项               | Claude Code（CLI）  | Cursor（IDE集成） |
| -------------------- | ------------------- | ----------------- |
| **运行方式**   | 命令行独立运行      | VS Code编辑器内置 |
| **文件操作**   | ✅ 直接读写         | ✅ 直接读写       |
| **项目理解**   | ✅ 全项目上下文     | ✅ 全项目上下文   |
| **脚本自动化** | ✅ 完美支持         | ⚠️ 有限         |
| **CI/CD集成**  | ✅ 原生支持         | ❌ 困难           |
| **远程服务器** | ✅ 完美支持         | ❌ 需要图形界面   |
| **隐私性**     | ✅ 本地优先         | ⚠️ 云端处理     |
| **学习曲线**   | 中等（需要CLI基础） | 低（图形界面）    |

**推荐使用场景：**

**选Claude Code（CLI）适合：**

- ✅ 重构遗留项目、批量代码处理
- ✅ CI/CD自动化、脚本集成
- ✅ 远程服务器开发、无图形界面环境
- ✅ 企业级开发（私有部署、安全要求高）
- ✅ 高级开发者（熟悉命令行、需要自动化）

**选Cursor（IDE集成）适合：**

- ✅ 日常开发、快速原型
- ✅ 学习新框架、初学者友好
- ✅ 需要图形界面和可视化
- ✅ 实时代码补全和建议

### 1.4 适合谁学习

**强烈推荐：**

1. **有1年+编程经验的开发者**：能充分利用AI加速工作流
2. **技术Leader/架构师**：需要快速审查和重构代码
3. **独立开发者**：一个人维护多个项目，需要AI协作
4. **开源贡献者**：快速理解陌生代码库

**需要慎重考虑：**

1. **编程零基础**：建议先学基础语法和终端操作（建议学习时长：3-6个月）
2. **只用图形界面**：Claude Code需要熟悉命令行
3. **网络受限**：需要访问Anthropic API（国内需代理）

---

## 课前准备检查清单

在开始安装前,请确认以下内容已完成(来自前置课程):

| 检查项                      | 状态            | 如果未完成                   |
| --------------------------- | --------------- | ---------------------------- |
| **Node.js v22+**      | [ ] 已安装      | 参考第三部分进行安装         |
| **npm 10.0+**         | [ ] 已安装      | 随Node.js一起安装,同上       |
| **ANTHROPIC_API_KEY** | [ ] 已配置      | 中转站或官网获取(见第四部分) |
| **磁盘空间**          | [ ] 至少3GB可用 | 清理磁盘空间                 |

**如果所有项都已完成,让我们开始吧!**

---

## 第二部分：系统要求快速检查

> 💡 **本节目的**：快速确认你的电脑能不能运行Claude Code，3分钟搞定！

### 2.1 快速检查清单（核心3项）

在开始安装前，确认以下3项**核心要求**：

| 检查项 | 最低要求 | 如何检查 | 不符合怎么办 |
|--------|---------|---------|-------------|
| **操作系统** | Windows 10 / macOS 10.15+ / Linux | 查看系统版本 | 升级系统或换电脑 |
| **内存** | 4GB RAM | 右键"此电脑"→属性 | 不足4GB无法运行 |
| **网络** | 能访问外网 | 打开 google.com 试试 | 国内用户需要配置代理（见附录B） |

**快速验证命令：**

**所有平台通用：**
```bash
# 检查能否访问Anthropic API
ping api.anthropic.com
# 能ping通 → ✅ 网络OK
# ping不通 → ⚠️ 需要配置代理
```

**如果3项全部✅ → 恭喜，你的电脑满足要求，继续往下！**

**如果有❌ → 跳到附录A查看详细要求和解决方案。**

---

### 2.2 详细要求说明（可选阅读）

> ⚠️ **小白注意**：这部分是详细技术说明，如果上面快速检查都通过了，可以跳过直接看第三部分！

**操作系统详细兼容性：**

| 操作系统 | 最低版本 | 推荐版本 | 说明 |
|---------|---------|---------|------|
| Windows | Windows 10 | Windows 11 | 64位系统 |
| macOS | 10.15 Catalina | macOS 13+ | Intel/Apple Silicon都支持 |
| Linux | 内核3.10+ | 5.x+ | Ubuntu/Debian/Fedora等主流发行版 |

**硬件推荐（非强制）：**
- **CPU**：双核+（i3或同等性能即可）
- **内存**：8GB更佳（4GB也能用，大项目会慢点）
- **存储**：SSD更快（机械硬盘也行）

> 💡 **老金建议**：别被这些要求吓到！只要你电脑能正常开发写代码，就肯定能跑Claude Code。这些是"推荐配置"不是"必需配置"。
>
> **详细性能对比和配置建议** → 见附录A

---

## 第三部分：Node.js 环境准备（核心重点）

> 💡 **本节目的**：安装Node.js运行环境（Claude Code的必需基础）
> ⏱️ **预计时间**：Windows 40分钟 / Mac 30分钟 / Linux 20分钟

### 🗺️ 平台导航：我该看哪一节？

> ⚠️ **重要**：这部分包含Windows/Mac/Linux三个平台的安装步骤，**只看你的操作系统对应的小节，其他跳过！**

| 你的操作系统 | 看哪几节 | 预计时间 |
|-------------|---------|---------|
| **Windows 10/11** | 3.1 + 3.2 + 3.3（Windows安装） | 40分钟 |
| **macOS** | 3.1 + 3.2 + 3.4（macOS安装） | 30分钟 |
| **Linux** | 3.1 + 3.2 + 3.5（Linux安装） | 20分钟 |

**快速跳转：**
- 👉 [Windows安装](#33-windows-平台安装详解)
- 👉 [macOS安装](#34-macos-平台安装详解)
- 👉 [Linux安装](#35-linux-平台安装详解)

---

### 3.1 为什么需要 Node.js

**Node.js是什么？**

Node.js是一个JavaScript运行时环境。简单理解：

- **运行时**：让JavaScript能在服务器或本地电脑上运行（不只是浏览器）
- **环境**：提供文件操作、网络请求等能力

**为什么Claude Code需要它？**

1. Claude Code本身用JavaScript/TypeScript编写
2. 需要npm（Node Package Manager）来安装和更新
3. 许多现代开发工具都依赖Node.js生态

**类比理解：**

就像Windows程序需要.NET Framework，Java程序需要JRE，Claude Code需要Node.js才能运行。

### 3.2 Node.js 版本选择（2025年推荐）

**LTS版本是什么？**

LTS = Long Term Support（长期支持版本）

- ✅ 稳定性高，bug少
- ✅ 安全更新持续3年
- ✅ 企业级项目推荐

**2025年版本策略：**

| 版本           | 状态         | 推荐度     | 说明                             |
| -------------- | ------------ | ---------- | -------------------------------- |
| Node.js 22.x   | 🟢 维护期LTS | ⭐⭐⭐⭐⭐ | **兼容性最好，本课程推荐** |
| Node.js 24.x   | 🟢 活跃LTS   | ⭐⭐⭐⭐   | 最新功能，但部分工具可能不兼容   |
| Node.js 20.x   | 🟡 维护期    | ⭐⭐⭐     | 稳定但会逐步过时                 |
| Node.js 奇数版 | 🔵 开发版    | ⭐⭐       | 不稳定，开发者尝鲜用             |

> **本课程统一使用：Node.js 22.x LTS**（兼容性最好）

**如何确认已安装的版本？**

打开终端，输入：

```bash
node -v
```

如果显示 `v22.11.0` 或 `v22.x.x`，说明版本正确。

### 3.3 Windows 平台安装详解

#### 步骤1：下载安装包

**官方下载地址：**

```
https://nodejs.org/zh-cn/
```

**操作步骤：**

1. 打开浏览器访问上述网址
2. 点击绿色按钮"下载Node.js (LTS)"
3. 会自动下载 `node-v22.x.x-x64.msi` 文件（约50MB）

**下载慢怎么办？**

使用国内镜像站（清华大学镜像）：

```
https://mirrors.tuna.tsinghua.edu.cn/nodejs-release/v22.11.0/
```

选择 `node-v22.11.0-x64.msi` 下载。

#### 步骤2：运行安装程序

**详细安装步骤：**

1. **双击** `node-v22.x.x-x64.msi` 文件

   - 如果出现"Windows已保护你的电脑"，点击"更多信息" → "仍要运行"
2. **欢迎界面**：点击"Next"（下一步）
3. **许可协议**：

   - 勾选"I accept the terms in the License Agreement"
   - 点击"Next"
4. **安装路径选择** ⚠️ 重要

   - 默认路径：`C:\Program Files\nodejs\`
   - 建议使用默认路径（避免权限问题）
   - 如果C盘空间不足，可改为 `D:\nodejs\`（但路径中不要有中文）
5. **自定义安装组件**（保持默认全选）：

   - ✅ Node.js runtime（运行时）
   - ✅ npm package manager（包管理器）
   - ✅ Online documentation shortcuts（在线文档）
   - ✅ **Add to PATH（添加到环境变量）← 必须勾选！**

   > **关键说明**："Add to PATH"作用是让你能在任意文件夹打开命令行时使用 `node` 和 `npm` 命令。如果不勾选，后续需要手动配置环境变量（较复杂）。
   >
6. **工具安装（可选）**：

   - 出现"Tools for Native Modules"选项
   - **建议不勾选**（会自动安装Python和Visual Studio构建工具，占用5GB+空间）
   - 如果后续需要编译C++扩展，可通过 `npm install --global windows-build-tools` 单独安装
7. **开始安装**：

   - 点击"Install"
   - 等待3-5分钟（取决于电脑性能）
   - 如果弹出用户账户控制(UAC)，点击"是"
8. **完成安装**：

   - 看到"Completed"界面
   - 点击"Finish"

#### 步骤3：验证安装

**打开命令提示符：**

- 按 `Win + R` 键
- 输入 `cmd`，按回车
- 出现黑色窗口

**执行验证命令：**

```bash
# 检查Node.js版本
node -v
# 预期输出：v22.11.0（版本号可能略有不同）

# 检查npm版本
npm -v
# 预期输出：10.9.0
```

**如果出现错误：**

```
'node' 不是内部或外部命令,也不是可运行的程序或批处理文件。
```

**解决方案：**

1. 重启电脑（让环境变量生效）
2. 如果重启后仍有问题，跳到"故障排查"章节的"环境变量手动配置"

#### 步骤4：配置npm国内镜像（可选但推荐）

**为什么需要镜像？**

npm默认从国外服务器下载包，国内访问很慢（几KB/s）。使用淘宝镜像可提速到MB/s级别。

**镜像源对比：**

| 镜像源   | 地址                                   | 速度(中国) | 同步延迟 |
| -------- | -------------------------------------- | ---------- | -------- |
| npm官方  | https://registry.npmjs.org             | 慢/超时    | 实时     |
| 淘宝镜像 | https://registry.npmmirror.com         | 快         | 10分钟   |
| 腾讯云   | https://mirrors.cloud.tencent.com/npm/ | 快         | 1小时    |

**推荐**：使用淘宝镜像（同步最快，稳定性好）

**配置方法：**

```bash
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 验证配置
npm config get registry
# 应显示：https://registry.npmmirror.com/

# 测试安装速度
npm install -g npm-check
# 如果几秒内完成,说明镜像配置成功
```

### 3.4 macOS 平台安装详解

macOS用户有两种安装方式：**Homebrew（推荐）** 和 **官方安装包**。

#### 方法1：Homebrew安装（推荐）

**什么是Homebrew？**

macOS的包管理器，类似App Store，但用于安装开发工具。许多专业开发者使用。

**优势：**

- ✅ 一行命令安装
- ✅ 自动配置环境变量
- ✅ 方便管理多个版本
- ✅ 更新简单（`brew upgrade node`）

**前置条件：安装Homebrew**

打开"终端"应用（Spotlight搜索"Terminal"）：

```bash
# 检查是否已安装Homebrew
brew -v

# 如果显示版本号,跳过此步骤
# 如果提示"command not found",运行以下命令安装：
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装过程约5-10分钟,需要输入电脑密码
```

**安装Node.js：**

```bash
# 安装最新LTS版本
brew install node@22

# 链接到系统路径
brew link node@22

# 验证安装
node -v  # 应显示v22.x.x
npm -v   # 应显示10.x.x
```

**常见问题：**

```bash
# 问题1：提示权限不足
sudo chown -R $(whoami) /usr/local/Homebrew

# 问题2：brew命令找不到
# Intel芯片Mac：
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# M1/M2芯片Mac：
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### 方法2：官方安装包

**适用场景：**

- 不想使用Homebrew
- 需要固定版本（不自动更新）

**步骤：**

1. 访问：https://nodejs.org/zh-cn/
2. 点击"下载Node.js (LTS)"
3. 下载 `.pkg` 文件
4. 双击运行，按提示点击"继续"
5. 可能需要输入Mac密码

**验证安装：**

```bash
# 打开终端
node -v
npm -v
```

**macOS特有配置：**

```bash
# 创建全局包目录
mkdir -p ~/.npm-global

# 配置npm使用该目录
npm config set prefix '~/.npm-global'

# 添加到PATH
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

> **为什么需要这样配置？** macOS的系统目录 `/usr/local` 受保护，直接安装全局包可能需要 `sudo`。使用独立目录更安全。

### 3.5 Linux 平台安装详解

#### 方法1：Ubuntu/Debian系统（apt包管理器）

**适用系统：** Ubuntu 20.04/22.04/24.04、Debian 11/12、Linux Mint

```bash
# 1. 更新包索引
sudo apt update

# 2. 安装Node.js 22.x官方源
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# 3. 安装Node.js和npm
sudo apt install -y nodejs

# 4. 验证安装
node -v   # v22.x.x
npm -v    # 10.x.x

# 5. 安装构建工具（编译原生模块时需要）
sudo apt install -y build-essential
```

**国内用户加速：**

```bash
# 使用清华大学镜像源
curl -fsSL https://mirrors.tuna.tsinghua.edu.cn/nodesource/deb_22.x/setup | sudo -E bash -
sudo apt install -y nodejs
```

#### 方法2：nvm方式（推荐高级用户）

**什么是nvm？**

Node Version Manager，可以在同一台电脑安装多个Node.js版本，随时切换。

**优势：**

- ✅ 多版本管理（项目A用Node 18，项目B用Node 22）
- ✅ 不需要sudo权限
- ✅ 适合测试不同版本

**安装nvm：**

```bash
# 下载并安装nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 重启终端或运行
source ~/.bashrc

# 验证nvm安装
nvm -v
```

**使用nvm安装Node.js：**

```bash
# 查看可用的LTS版本
nvm ls-remote --lts

# 安装Node.js 22 LTS
nvm install 22

# 设为默认版本
nvm alias default 22

# 验证
node -v

# 切换版本示例
nvm install 20
nvm use 20    # 切换到Node 20
nvm use 22    # 切换回Node 22
```

#### 其他Linux发行版

**CentOS/RHEL/Fedora：**

```bash
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo yum install -y nodejs
```

**Arch Linux：**

```bash
sudo pacman -S nodejs npm
```

---

## 第四部分：Anthropic 账号准备

> **💡 为什么现在就要准备API Key？**
>
> **小白常见疑问**："我还没装Claude Code，为什么先要API Key？"
>
> **答案很简单**：
> 1. Claude Code是AI助手，需要连接Anthropic的AI服务才能工作
> 2. API Key就像"通行证"，证明你有权使用AI服务
> 3. **提前准备好Key的好处**：装完Claude Code立即就能用，不用再等待
>
> **生活类比**：
> - Claude Code = 你新买的手机
> - API Key = SIM卡
> - 先办好SIM卡，手机到手插卡就能用！

> **💡 选择提示**：可选择使用**中转站**（更便宜、更稳定），或官方账号。
>
> - **中转站优势**：价格低（约官方1/3-1/2）、无需科学上网、支付方便
> - **官方账号优势**：更稳定、有免费额度、支持订阅
>
> 本课程同时讲解两种方式的配置方法。

### 4.1 注册 Anthropic 账号

**注册流程：**

1. **访问注册页面**：https://console.anthropic.com/
2. **点击"Sign Up"（注册）**
3. **选择注册方式**（三种任选其一）：

   - Google账号登录（推荐，最快）
   - 邮箱+密码注册
   - GitHub账号登录
4. **完善账号信息**：

   - 姓名：真实姓名或开发者昵称
   - 使用场景：选择"Personal Use"（个人使用）或"Business"（商业）
   - 主要编程语言：可多选
5. **手机验证（可能需要）**：

   - 支持中国大陆号码（+86）
   - 会收到6位数验证码短信
   - 如果未收到，可选择语音验证

> **注意**：国内手机号注册成功率约80%。如果多次失败，可尝试使用Google Voice虚拟号码、香港/台湾号码，或联系Anthropic支持。

### 4.2 API Key 获取步骤

**什么是API Key？**

API Key是一串密钥，作用类似密码，用于：

- 证明你有权使用Claude AI服务
- 追踪API调用次数（计费依据）
- 控制访问权限

**格式示例：**

```
sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**获取步骤：**

1. **进入API Keys页面**

   登录后点击左侧菜单：`Settings → API Keys`

   或直接访问：https://console.anthropic.com/settings/keys
2. **创建新Key**

   点击"Create Key"按钮，填写：

   - Key名称：例如"claude-code-laptop"（方便区分多个key）
   - 权限：选择"Full Access"（完全访问）
3. **复制并保存Key**

   ⚠️ **关键警告**：

   - Key只显示一次！关闭窗口后无法再看到
   - 必须立即复制并保存到安全位置
   - 不要分享给任何人

   **保存方法**：

   1. 创建文本文件 `anthropic-key.txt`
   2. 粘贴完整key
   3. 保存到电脑安全位置（如Documents文件夹）
4. **验证Key有效性**

   ```bash
   # macOS/Linux
   curl https://api.anthropic.com/v1/messages \
     -H "x-api-key: 你的API_KEY" \
     -H "anthropic-version: 2023-06-01" \
     -H "content-type: application/json" \
     -d '{
       "model": "claude-sonnet-4-20250514",
       "max_tokens": 1024,
       "messages": [{"role": "user", "content": "Hello"}]
     }'

   # 如果返回JSON响应(而不是错误),说明Key有效
   ```

   **Windows PowerShell测试：**

   ```powershell
   $headers = @{
       "x-api-key" = "你的API_KEY"
       "anthropic-version" = "2023-06-01"
       "content-type" = "application/json"
   }
   $body = '{"model":"claude-sonnet-4-20250514","max_tokens":1024,"messages":[{"role":"user","content":"Hello"}]}'
   Invoke-RestMethod -Uri "https://api.anthropic.com/v1/messages" -Method POST -Headers $headers -Body $body
   ```

### 4.3 环境变量配置

**什么是环境变量？**

环境变量是操作系统级别的配置，让程序可以读取敏感信息（如API Key），而不需要写在代码里。

**好处：**

- ✅ 安全：不会意外提交到GitHub
- ✅ 灵活：不同电脑可用不同Key
- ✅ 标准：所有开发工具都支持

#### Windows配置方法

**推荐方法：PowerShell 7（最佳选择）**

```powershell
# 永久添加用户环境变量（PowerShell 7）
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_API_KEY', 'sk-ant-api03-你的key', 'User')

# 验证配置
$env:ANTHROPIC_API_KEY

# 重启PowerShell后生效
```

**临时配置（仅当前终端有效）：**

```powershell
# PowerShell（包括PowerShell 5和7）
$env:ANTHROPIC_API_KEY="sk-ant-api03-你的key"

# CMD（不推荐，功能有限）
set ANTHROPIC_API_KEY=sk-ant-api03-你的key
```

**永久配置方法2：通过图形界面**

1. 右键"此电脑" → 属性
2. 点击"高级系统设置"
3. 点击"环境变量"
4. 在"用户变量"区域点击"新建"
5. 变量名：`ANTHROPIC_API_KEY`
6. 变量值：`sk-ant-api03-你的完整key`
7. 点击"确定"保存
8. **重启所有终端窗口**

> **提示**：图形界面方法适合不熟悉命令行的用户，但PowerShell 7方法更快捷。

#### macOS/Linux配置方法

```bash
# 确定使用的Shell
echo $SHELL

# 如果是bash,编辑~/.bashrc
# 如果是zsh(macOS默认),编辑~/.zshrc

# 添加以下行（替换为真实Key）
export ANTHROPIC_API_KEY="sk-ant-api03-你的key"

# 保存后重新加载
source ~/.zshrc  # 或 source ~/.bashrc

# 验证
echo $ANTHROPIC_API_KEY
```

**使用nano编辑器示例：**

```bash
# 打开配置文件
nano ~/.zshrc

# 添加Key配置
export ANTHROPIC_API_KEY="sk-ant-api03-xxxxx"

# 保存：Ctrl+O → 回车 → Ctrl+X退出
```

#### 安全注意事项

**✅ 正确做法：**

- 只在本地配置环境变量
- 不要提交 `.env` 文件到Git
- 定期轮换API Key

**❌ 错误做法：**

- 把Key直接写在代码里：`const key = "sk-ant-..."`
- 在GitHub Issues/论坛公开Key
- 与他人共享Key

**泄露后的处理：**

1. 立即到Console删除泄露的Key
2. 创建新Key
3. 更新环境变量
4. 检查API使用记录是否异常

### 4.4 计费与订阅

**Claude Code需要付费吗？**

两层计费：

1. **Claude Code工具本身**

   - ✅ 免费开源
   - 无需购买License
2. **Claude API使用费**

   - ⚠️ 按调用量计费
   - 类似手机话费（用多少付多少）

**Token是什么？**

Token是AI处理文本的最小单位，用于计费：

- 1 token ≈ 0.75个英文单词
- 1 token ≈ 1-2个汉字
- 1000 tokens ≈ 750字短文

> 💡 **成本说明**：
>
> Claude Code的使用成本取决于你的API调用量。具体计费方式和价格请查看：
> - **官方价格页面**：https://www.anthropic.com/pricing
> - **Console账单页面**：https://console.anthropic.com/ → Settings → Billing
>
> 建议在实际使用中监控自己的消耗情况，根据需求调整使用频率。

---

## 第五部分：Claude Code 安装

### 5.1 三种安装方式对比

| 对比维度           | npm全局安装   | yarn/pnpm         | npx临时运行  |
| ------------------ | ------------- | ----------------- | ------------ |
| **安装速度** | 中等(30-60秒) | 快/很快           | 慢(每次下载) |
| **磁盘占用** | ~100MB        | ~60-100MB         | 临时缓存     |
| **更新方式** | npm update -g | yarn/pnpm upgrade | 自动最新     |
| **适合新手** | ⭐⭐⭐⭐⭐    | ⭐⭐⭐            | ⭐⭐⭐⭐     |
| **企业环境** | ⭐⭐⭐⭐      | ⭐⭐⭐⭐⭐        | ⭐⭐         |
| **CI/CD**    | ⭐⭐⭐        | ⭐⭐⭐⭐          | ⭐⭐⭐⭐⭐   |

**场景推荐：**

- **个人学习开发** → npm全局安装（最推荐）
- **企业团队开发** → yarn/pnpm全局安装
- **临时试用/CI环境** → npx临时运行

### 5.2 方式1：npm全局安装（推荐新手）

这是最常用、最稳定的安装方式，适合90%的用户。

#### Windows系统安装步骤

**步骤1：打开管理员命令提示符**

1. 按下 `Win` 键
2. 输入 `cmd`（不要按回车）
3. 在搜索结果中找到"命令提示符"
4. 右键点击"命令提示符"
5. 选择"以管理员身份运行"
6. 看到用户账户控制提示，点击"是"

**截图位置提示：**

```
┌─────────────────────────────┐
│ 搜索框: cmd                  │
├─────────────────────────────┤
│ 最佳匹配                     │
│ 📁 命令提示符               │ ← 右键这里
│   → 以管理员身份运行        │ ← 点击这个选项
│   → 打开文件位置            │
│   → 固定到任务栏            │
└─────────────────────────────┘
```

**验证管理员权限：**

命令提示符窗口标题栏应该显示"**管理员: 命令提示符**"

或者输入命令验证：

```bash
whoami /groups | find "High Mandatory Level"
# 如果有输出，说明是管理员权限
```

> **为什么必须管理员权限？** npm全局安装会写入 `C:\Program Files\nodejs\` 目录，普通用户权限无法写入，会报错：`EACCES: permission denied`

**步骤2：配置npm镜像源（中国大陆用户强烈推荐）**

```bash
# 查看当前镜像源
npm config get registry

# 永久切换到淘宝镜像（推荐）
npm config set registry https://registry.npmmirror.com

# 验证镜像源已切换
npm config get registry
# 应该输出：https://registry.npmmirror.com
```

**步骤3：执行安装命令**

```bash
npm install -g @anthropic-ai/claude-code
```

**命令拆解说明：**

| 部分               | 含义                                         |
| ------------------ | -------------------------------------------- |
| `npm install`    | npm的安装子命令                              |
| `-g`             | global（全局），让claude命令在任何目录都能用 |
| `@anthropic-ai/` | npm组织作用域，表示这是Anthropic公司的包     |
| `claude-code`    | 包名                                         |

**安装过程输出详解：**

```
C:\Windows\system32>npm install -g @anthropic-ai/claude-code

# 阶段1：解析依赖(10-15秒)
npm WARN deprecated inflight@1.0.6: This module is not supported
# ↑ WARN是警告,不是错误,可以忽略

# 阶段2：下载包(20-40秒,取决于网络)
added 1 package in 25s

# 阶段3：安装依赖(5-10秒)
added 123 packages in 30s

# 阶段4：审计安全(2-5秒)
found 0 vulnerabilities
# ↑ 显示没有安全漏洞
```

**安装成功的标志：**

- ✓ 看到 "added XXX packages in XXXs"
- ✓ 没有 "ERR!" 字样
- ✓ 最后一行不是错误信息

**步骤4：验证安装成功**

```bash
# 验证1：检查版本号
claude --version
# 预期输出：Claude Code v2.0.71 (npm)

# 验证2：检查安装位置
where claude
# 预期输出：C:\Users\你的用户名\AppData\Roaming\npm\claude.cmd

# 验证3：检查帮助信息
claude --help
# 应该显示完整的帮助文档
```

#### Windows常见错误及解决方案

**错误1：EACCES: permission denied**

```
npm ERR! code EACCES
npm ERR! syscall mkdir
npm ERR! path C:\Program Files\nodejs\node_modules\@anthropic-ai
npm ERR! errno -4048
npm ERR! Error: EACCES: permission denied
```

**原因**：没有管理员权限

**解决方案：**

```bash
# 方案1：以管理员身份重新打开CMD（推荐）
# 步骤：Win键 → 输入cmd → 右键 → 以管理员身份运行

# 方案2：修改npm全局目录到用户目录（一劳永逸）
mkdir %USERPROFILE%\npm-global
npm config set prefix %USERPROFILE%\npm-global
# 添加到系统PATH：Win+R → sysdm.cpl → 高级 → 环境变量
# 用户变量的Path中添加：%USERPROFILE%\npm-global

# 重启CMD后再安装
npm install -g @anthropic-ai/claude-code
```

**错误2：ETIMEDOUT network timeout**

```
npm ERR! code ETIMEDOUT
npm ERR! syscall connect
npm ERR! errno ETIMEDOUT
npm ERR! network request to https://registry.npmjs.org failed
```

**原因**：网络无法访问npm官方源

**解决方案：**

```bash
# 方案1：使用国内镜像（推荐）
npm install -g @anthropic-ai/claude-code --registry=https://registry.npmmirror.com

# 方案2：配置代理（如果有代理工具）
# PowerShell 7（推荐）
$env:HTTP_PROXY="http://127.0.0.1:7890"
$env:HTTPS_PROXY="http://127.0.0.1:7890"
npm install -g @anthropic-ai/claude-code

# CMD（不推荐）
set HTTP_PROXY=http://127.0.0.1:7890
set HTTPS_PROXY=http://127.0.0.1:7890
npm install -g @anthropic-ai/claude-code

# 方案3：增加超时时间
npm install -g @anthropic-ai/claude-code --timeout=60000
```

**错误3：ENOTFOUND registry.npmjs.org**

```
npm ERR! code ENOTFOUND
npm ERR! syscall getaddrinfo
npm ERR! errno ENOTFOUND
npm ERR! network getaddrinfo ENOTFOUND registry.npmjs.org
```

**原因**：DNS解析失败

**解决方案：**

```bash
# 方案1：使用国内镜像（推荐）
npm config set registry https://registry.npmmirror.com

# 方案2：修改DNS服务器
# 控制面板 → 网络和共享中心 → 更改适配器设置
# 右键网卡 → 属性 → IPv4 → 使用下面的DNS服务器地址
# 首选：8.8.8.8 (Google)
# 备用：114.114.114.114 (国内)

# 方案3：刷新DNS缓存
ipconfig /flushdns
```

**错误4：'node' is not recognized**

```
'node' 不是内部或外部命令,也不是可运行的程序或批处理文件。
```

**原因**：Node.js未安装或PATH未配置

**解决方案：**

```bash
# 检查Node.js是否安装
where node
# 如果没有输出,说明未安装或PATH有问题

# 解决步骤：
# 1. 确认Node.js已安装
# 2. 手动添加Node.js到PATH
# Win+R → sysdm.cpl → 高级 → 环境变量
# 系统变量的Path中添加：C:\Program Files\nodejs\

# 3. 重启CMD验证
node --version
npm --version
```

#### macOS系统安装步骤

**步骤1：打开终端**

```bash
# 方法1：使用Spotlight
按 Command(⌘) + 空格
输入 "Terminal" 或 "终端"
按回车

# 方法2：使用Finder
应用程序 → 实用工具 → 终端
```

**步骤2：安装Claude Code**

```bash
npm install -g @anthropic-ai/claude-code
```

**如果遇到权限错误：**

```bash
# 错误信息示例
npm ERR! code EACCES
npm ERR! syscall mkdir
npm ERR! path /usr/local/lib/node_modules/@anthropic-ai
npm ERR! errno -13

# 方案1：使用sudo（最简单但不推荐长期）
sudo npm install -g @anthropic-ai/claude-code
# 会要求输入macOS用户密码

# 方案2：修改npm全局目录权限（推荐，一劳永逸）
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# 对于zsh用户（macOS Catalina及以后）
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc

# 对于bash用户（较老的macOS）
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bash_profile
source ~/.bash_profile

# 现在可以不用sudo安装了
npm install -g @anthropic-ai/claude-code
```

**步骤3：验证安装**

```bash
# 检查版本
claude --version
# 输出：Claude Code v2.0.71 (npm)

# 检查安装位置
which claude
# 输出：/Users/你的用户名/.npm-global/bin/claude

# 测试运行
claude --help
```

#### Linux系统安装步骤

**Ubuntu/Debian系列：**

```bash
# 步骤1：更新包索引
sudo apt update

# 步骤2：确认Node.js已安装
node --version
npm --version

# 步骤3：安装Claude Code
npm install -g @anthropic-ai/claude-code

# 步骤4：验证
claude --version
```

**如果遇到EACCES错误：**

```bash
# 配置用户级全局目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 重新安装
npm install -g @anthropic-ai/claude-code
```

### 5.3 方式2：yarn/pnpm全局安装

**yarn的优势：**

- 速度更快（并行下载）
- 离线缓存
- Workspaces支持

**pnpm的优势：**

- 磁盘空间节省（硬链接机制）
- 安装速度最快
- 严格的依赖管理

#### 使用yarn安装

```bash
# 步骤1：安装yarn（如果还没有）
npm install -g yarn

# 验证yarn安装
yarn --version

# 步骤2：使用yarn安装Claude Code
yarn global add @anthropic-ai/claude-code

# 步骤3：配置PATH（如果需要）
yarn global bin
# 输出yarn的全局bin目录

# 添加到PATH
echo 'export PATH="$(yarn global bin):$PATH"' >> ~/.zshrc
source ~/.zshrc

# 步骤4：验证
claude --version
```

#### 使用pnpm安装

```bash
# 步骤1：安装pnpm（如果还没有）
npm install -g pnpm

# 或使用官方安装脚本（推荐）
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Windows用户使用PowerShell：
iwr https://get.pnpm.io/install.ps1 -useb | iex

# 验证pnpm安装
pnpm --version

# 步骤2：使用pnpm安装Claude Code
pnpm add -g @anthropic-ai/claude-code

# 步骤3：验证
claude --version
```

### 5.4 方式3：npx临时运行

npx是npm 5.2+自带的工具，可以直接运行npm包而无需安装。

```bash
# 直接运行Claude Code
npx @anthropic-ai/claude-code

# 第一次运行会看到：
# Need to install the following packages:
#   @anthropic-ai/claude-code@2.0.71
# Ok to proceed? (y)
# 输入 y 并回车
```

**npx的优缺点：**

| 优点              | 缺点              |
| ----------------- | ----------------- |
| ✓ 不污染全局环境 | ✗ 首次启动慢     |
| ✓ 总是最新版本   | ✗ 需要网络连接   |
| ✓ 适合CI/CD      | ✗ 无法使用短命令 |
| ✓ 无需维护       | ✗ 启动有延迟     |

**高级用法：**

```bash
# 指定特定版本运行
npx @anthropic-ai/claude-code@2.0.70

# 强制使用最新版本（忽略缓存）
npx --yes @anthropic-ai/claude-code
```

**创建别名简化npx使用：**

```bash
# bash/zsh用户
echo 'alias claude="npx @anthropic-ai/claude-code"' >> ~/.zshrc
source ~/.zshrc

# Windows PowerShell用户
# 编辑配置文件：notepad $PROFILE
# 添加：
function claude { npx @anthropic-ai/claude-code @args }
```

---

## 第六部分：首次启动配置

### 6.1 启动 Claude Code 的三种方式

**方式1：标准交互模式（最常用）**

```bash
# 在任意目录启动
claude

# 启动流程：
# 1. 检测当前目录
# 2. 加载CLAUDE.md（如果存在）
# 3. 进入交互式对话界面
```

**方式2：单次命令模式**

```bash
# 执行单个命令后退出
claude "你的问题或指令"

# 示例：
claude "What is 2 + 2?"
claude "List files in current directory"
claude "Explain this code: app.js"
```

**方式3：打印模式（脚本友好）**

```bash
# 只输出AI响应,不显示格式
claude -p "你的问题"

# 示例：
claude -p "hello" > output.txt
echo "分析这段代码" | claude -p
```

### 6.2 首次启动的初始化流程

当你第一次运行 `claude` 时，会经历一个交互式配置向导。

**配置步骤1：选择主题**

```
? Choose your theme:
  ❯ Light (浅色主题,适合白天)
    Dark (深色主题,适合夜晚)
    System (跟随系统设置,推荐)
```

使用 ↑/↓ 箭头键选择，按回车确认。

**主题说明：**

| 主题   | 特点               | 适用场景         |
| ------ | ------------------ | ---------------- |
| Light  | 浅色背景，深色文字 | 光线充足的环境   |
| Dark   | 深色背景，浅色文字 | 长时间编程，护眼 |
| System | 自动跟随系统       | 推荐选择         |

**配置步骤2：安全须知确认**

```
╭─────────────────────────────────────────────────────────╮
│                     Safety Notice                       │
├─────────────────────────────────────────────────────────┤
│  Claude Code will operate in the current directory:    │
│  /Users/yourname/projects/my-app                        │
│                                                         │
│  This means Claude can:                                 │
│  ✓ Read files in this directory and subdirectories     │
│  ✓ Create new files                                    │
│  ✓ Modify existing files (with your confirmation)      │
│  ✓ Run commands (with your confirmation)               │
│                                                         │
│  Claude will NOT:                                       │
│  ✗ Access files outside this directory                 │
│  ✗ Access your personal data                           │
│  ✗ Execute commands without permission                 │
╰─────────────────────────────────────────────────────────╯

? Do you understand and accept these conditions?
  ❯ Yes, I understand and accept
    No, exit and reconsider
```

**重要理解 - Claude Code的权限模型：**

1. **沙盒隔离** - 只能访问当前目录
2. **确认机制** - 危险操作需要你确认
3. **只读优先** - 默认只读，修改需授权
4. **审计日志** - 所有操作都有记录

**配置步骤3：目录信任确认**

```
? Trust this directory?
  /Users/yourname/projects/my-app

  ❯ Yes, trust this directory
    No, exit
    Trust this directory and all parent directories
```

**不要信任以下目录：**

- ✗ 下载目录（可能有恶意代码）
- ✗ 临时目录（不需要持久访问）
- ✗ 系统目录（危险！）
- ✗ 不明来源的代码目录

**配置步骤4：认证方式选择**

```
? How would you like to authenticate?

  ❯ API Key (recommended for API users)
    Use environment variable: ANTHROPIC_API_KEY
    Most flexible and secure

    Claude App Login (for Pro/Max subscribers)
    Login via browser
    Uses your subscription quota

    Manual Entry
    Enter API key now
    Stored in config file
```

**认证方式对比：**

| 方式     | 优点               | 缺点            | 推荐度     |
| -------- | ------------------ | --------------- | ---------- |
| 环境变量 | 最安全，跨项目共享 | 需要提前配置    | ⭐⭐⭐⭐⭐ |
| App登录  | 使用订阅配额       | 需要Pro/Max订阅 | ⭐⭐⭐⭐   |
| 手动输入 | 方便               | 不安全，易泄露  | ⭐⭐       |

**配置步骤5：完成初始化**

```
╭─────────────────────────────────────────────────────────╮
│            Setup Complete! 🎉                           │
├─────────────────────────────────────────────────────────┤
│  Configuration summary:                                 │
│  ✓ Theme: System                                        │
│  ✓ Authentication: API Key (environment variable)      │
│  ✓ Trusted directory: /Users/yourname/projects/my-app  │
│  ✓ Model: claude-sonnet-4 (default)                    │
│                                                         │
│  Quick start:                                           │
│  • Type your message to chat with Claude               │
│  • Use /help to see available commands                 │
│  • Use /exit to quit                                    │
╰─────────────────────────────────────────────────────────╯

Claude Code v2.0.71
Working directory: /Users/yourname/projects/my-app

You: █
```

### 6.3 配置文件结构

Claude Code的配置分为**全局**和**项目**两级：

```
~/.claude/                      ← 全局配置目录
├── config.json                 ← 全局配置文件
├── auth-token.json             ← 认证令牌
├── trusted-directories.json    ← 信任的目录列表
├── cache/                      ← 缓存目录
└── logs/                       ← 日志目录

项目目录/.claude/              ← 项目级配置
├── config.json                 ← 项目配置（覆盖全局）
├── commands/                   ← 自定义命令
├── skills/                     ← 自定义技能
└── hooks/                      ← 自定义钩子
```

---

## 第6.5部分：Claude Code启动方式详解

> 💡 **本节重点**：掌握2种启动Claude Code的方式，理解权限参数的作用

### 6.5.1 启动方式概览

Claude Code有**2种启动方式**：

| 启动方式               | 适用场景            | 优点                 | 缺点         |
| ---------------------- | ------------------- | -------------------- | ------------ |
| **终端命令启动** | 独立使用Claude Code | 快速、灵活、支持参数 | 需要记命令   |
| **IDE扩展启动**  | 在编辑器内使用      | 可视化、方便         | 需要安装扩展 |

> 💡 **推荐**：初学者先学终端启动，掌握后再用IDE扩展（更灵活）

---

### 6.5.2 方式一：终端命令启动（基础必学）

**这是什么？**
在命令行（终端）里输入 `claude` 命令，直接启动Claude Code的对话界面。

**为什么要学这个？**

- ✅ 最基础的启动方式，适用所有场景
- ✅ 可以添加参数控制行为
- ✅ 支持脚本自动化

#### 基础启动命令

**最简单的启动方式：**

```bash
# 在任意目录下运行
claude
```

**运行后会看到：**

```
╭─────────────────────────────────────────────────────────╮
│                                                         │
│  Welcome to Claude Code v2.0                           │
│                                                         │
│  • Type /help to see available commands                │
│  • Use /exit to quit                                    │
╰─────────────────────────────────────────────────────────╯

Claude Code v2.0.71
Working directory: /你的当前目录

You: █
```

看到这个界面 → ✅ 启动成功！

#### 带参数的启动命令

**常用启动参数：**

| 参数                                      | 作用                   | 什么时候用           |
| ----------------------------------------- | ---------------------- | -------------------- |
| `claude`                                | 默认启动（会询问权限） | 日常使用             |
| `claude --dangerously-skip-permissions` | 跳过权限询问           | 信任的项目，快速开发 |
| `claude -p "你的问题"`                  | 直接提问模式           | 快速查询，不需要对话 |
| `claude --headless`                     | 无界面模式             | 脚本自动化           |

#### --dangerously-skip-permissions 详解（重要！）

**这是什么？**
这个参数会让Claude Code跳过权限询问，直接执行所有操作（读文件、写文件、运行命令）。Anthropic官方称之为**"Safe YOLO mode"**（You Only Live Once模式）。

**为什么叫"dangerously"（危险）？**

因为Claude Code是AI助手，它可能会：
- 修改你的代码文件
- 删除文件
- 运行系统命令
- 安装/卸载软件包

如果跳过权限询问，AI做错了你可能来不及阻止！

**真实风险数据（eesel AI研究）：**

> 🚨 **震惊数据**：
> - **32%的开发者**使用此参数时遇到过**文件误修改**
> - **9%遇到过数据损失或损坏**
>
> **数据来源**：https://www.ksred.com/claude-code-dangerously-skip-permissions

**生活类比：**
- 不加参数 = 保姆做事前都问你"这样行吗？"（安全）
- 加这个参数 = 保姆直接干，不问你（快但危险）

**什么时候该用？**

✅ **推荐使用场景：**
- 你自己的个人项目（信任的代码）
- 快速开发，频繁修改（避免反复确认）
- 只读操作（查询、分析，不修改代码）
- 你已经很熟悉Claude Code的行为

❌ **绝对不要用：**
- 公司项目、开源项目（不是你一个人的代码）
- 第一次用Claude Code（还不了解它会干什么）
- 生产环境代码（一个错误可能造成事故）
- 包含敏感数据的项目（财务、用户隐私）

**安全使用建议（Anthropic官方）：**

1. **容器隔离**：在Docker容器中使用（无网络访问）
2. **白名单限制**：配置 `.claude/config.json`
   ```json
   {
     "allowedTools": [
       "Read",
       "Grep",
       "Glob",
       "Bash(npm test)",
       "Bash(git status)"
     ]
   }
   ```
3. **Git保护**：确保代码已提交，随时可回滚

**使用示例：**

```bash
# ✅ 场景1：只读查询（安全）
claude --dangerously-skip-permissions -p "分析这个项目的依赖关系"

# ⚠️ 场景2：信任的个人项目（谨慎）
cd ~/my-toy-project
claude --dangerously-skip-permissions

# ❌ 场景3：公司项目（绝对不要）
cd ~/company-critical-project
claude --dangerously-skip-permissions  # 💀 别这么干！
```

> ⚠️ **老金的血泪建议**：
>
> **新手阶段（前1个月）**：**绝对不要加这个参数**！让AI每次操作都问你，你能学到它在做什么，还能避免误操作。
>
> **熟练阶段（1个月后）**：自己的学习项目可以加，但：
> - ✅ 代码先提交到Git
> - ✅ 不包含重要数据
> - ✅ 随时能删重来
>
> **专业阶段**：公司项目、开源项目**永远别加**！老金我见过太多人用这个参数把项目搞炸了，数据来源可不是瞎说的（32%误修改率）！
>
> **参考**：
> - 官方最佳实践：https://www.anthropic.com/engineering/claude-code-best-practices
> - 风险分析：https://claudelog.com/mechanics/dangerous-skip-permissions

#### 启动验证清单

启动成功后，确认以下内容：

```
□ 看到Claude Code的欢迎界面
□ 显示正确的工作目录路径
□ 显示版本号（v2.0+）
□ 能看到 "You: █" 光标闪烁
□ 输入 /help 能看到帮助信息
```

全部打勾 → 🎉 启动成功！

---

### 6.5.3 方式二：IDE扩展启动（进阶）

**这是什么？**
在VS Code或Cursor编辑器内安装扩展/插件，通过点击按钮或快捷键启动Claude Code，不用手敲命令。

**为什么要用这个方式？**

- ✅ 可视化界面，更直观
- ✅ 和编辑器深度集成
- ✅ 不用切换窗口

**适用工具：**

- VS Code（需要安装Claude Code扩展）
- Cursor（可以通过Tasks集成，见第7章）

#### VS Code扩展安装（官方扩展已发布）

> ✅ **2025年12月最新**：Claude Code官方VS Code扩展已正式发布（Beta版）！

**扩展信息：**
- **名称**：Claude Code for VS Code
- **发布者**：Anthropic
- **要求**：VS Code 1.98.0+
- **市场地址**：https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code

**安装步骤：**

1. **打开扩展市场**
   - 按 `Ctrl/Cmd + Shift + X`

2. **搜索并安装**
   - 搜索：`Claude Code`
   - 找到Anthropic官方扩展
   - 点击"Install"

3. **验证安装**
   - 左侧活动栏出现 **⚡火花图标**
   - 点击图标打开Claude Code面板

**扩展功能（vs 终端CLI）：**
- ✅ 侧边栏专用面板（代码和对话分离）
- ✅ 实时内联差异显示（修改高亮）
- ✅ Checkpoint自动保存（按Esc两次回滚）
- ✅ @提及文件/函数（智能引用）

**参考文档**：https://code.claude.com/docs/en/vs-code

#### Cursor集成方式（需要手动安装）

**重要提示**：Cursor虽然基于VS Code，但Claude Code扩展**不能自动检测**Cursor为兼容IDE。

**解决方案（社区验证100%成功）：手动安装VSIX文件**

**步骤：**

1. **找到VSIX文件**
   - 位置：本地Claude Code安装目录
   - 或从VS Code Marketplace下载VSIX

2. **手动安装到Cursor**
   ```bash
   # 方法1：命令行安装
   cursor --install-extension /path/to/claude-code.vsix

   # 方法2：拖拽安装
   # 把VSIX文件拖到Cursor的扩展面板
   ```

3. **验证安装**
   - 重启Cursor
   - 左侧应出现Claude Code图标

**详细教程**：https://www.cursor-ide.com/blog/claude-code-cursor-extension-guide

**替代方案：Tasks集成（推荐新手）**

如果扩展安装失败，可以用Tasks方式（见第7.1节配置）：
1. 配置 `tasks.json`
2. 通过命令面板运行任务
3. 效果类似但更稳定

---

### 6.5.4 启动方式选择建议

| 你的情况       | 推荐方式         | 原因           |
| -------------- | ---------------- | -------------- |
| 刚开始学习     | 终端命令启动     | 理解基础，灵活 |
| 熟悉后日常使用 | 终端 + IDE快捷键 | 效率最高       |
| 只想快速体验   | 终端命令启动     | 最简单         |
| 需要自动化     | 终端 + 参数      | 支持脚本       |

**老金的建议：**
先用终端命令启动，等你熟悉了Claude Code的行为，再配置IDE快捷键。这样基础扎实，以后遇到问题好排查！

---

### 6.6 Hello World 快速验证

> 💡 **重要**：启动成功后，立即做这个快速验证，确保Claude Code能正常工作！这样后面配置IDE时心里有底。

#### 6.6.1 基础功能测试（5分钟）

**快速7项测试，确认核心功能正常：**

```bash
# 测试1：版本检查
claude --version
# 预期输出：Claude Code v2.0.71 (npm)

# 测试2：简单问答
claude -p "What is 2 + 2?"
# 预期输出：4

# 测试3：中文支持
claude -p "你好,请用一句话介绍你自己"
# 预期输出：中文回复（确认中文正常）

# 测试4：帮助命令
claude --help
# 预期输出：显示所有可用命令
```

**如果以上4项全部成功 → ✅ Claude Code工作正常，继续往下！**

**如果有失败 → ⚠️ 跳到第8部分故障排查**

---

#### 6.6.2 Hello World 项目实战（15分钟）

**这是什么？**
创建一个完整的小项目，测试Claude Code的文件操作、代码生成、测试生成等核心功能。

**为什么要做？**
快速测试能发现99%的配置问题，避免后续出错。

**操作步骤：**

```bash
# 步骤1：创建项目目录
mkdir ~/claude-hello-world
cd ~/claude-hello-world

# 步骤2：初始化Git仓库
git init

# 步骤3：让Claude创建项目结构
claude -p "请创建一个Python Hello World项目，包含：
1. hello.py - 打印 'Hello, Claude Code!'
2. README.md - 项目说明
3. .gitignore - Python标准忽略文件"

# 步骤4：验证文件是否创建
ls -la
# 预期看到：hello.py, README.md, .gitignore

# 步骤5：运行程序
python hello.py
# 预期输出：Hello, Claude Code!
```

**预期项目结构：**
```
claude-hello-world/
├── .git/
├── .gitignore
├── hello.py
└── README.md
```

**验证成功标志：**
- ✅ 文件自动创建成功
- ✅ Python程序能正常运行
- ✅ Claude理解你的中文指令

---

#### 6.6.3 完整验证清单

启动和验证都成功后，最后确认：

| 验证项 | 命令 | 预期结果 | 状态 |
|--------|------|----------|------|
| 版本信息 | `claude --version` | v2.0.71+ | [ ] |
| 帮助文档 | `claude --help` | 显示命令列表 | [ ] |
| Node.js | `node --version` | v22.x.x | [ ] |
| API Key | `echo $ANTHROPIC_API_KEY` | 显示完整Key | [ ] |
| 网络连通 | `ping api.anthropic.com` | 有响应 | [ ] |
| 文件操作 | Hello World项目 | 成功创建文件 | [ ] |
| 代码执行 | `python hello.py` | 正常输出 | [ ] |

**全部打勾 → 🎉 恭喜！Claude Code安装和配置完全成功！**

**现在你可以：**
- ✅ 继续学习第7部分（IDE集成配置）
- ✅ 跳过第7部分，直接开始用Claude Code写项目
- ✅ 查看第9部分FAQ了解更多技巧

---

## 第七部分：进阶配置 - IDE集成

> ⚠️ **重要提示**：这部分是**可选的高级配置**！
>
> **前置条件**：第6部分的Hello World验证必须成功，否则别急着配置IDE！
>
> **适合人群**：
> - ✅ 已经成功启动Claude Code并完成Hello World测试
> - ✅ 想在VS Code/Cursor里更方便地使用Claude Code
> - ✅ 愿意花30分钟配置快捷键和任务
>
> **如果你只想用终端命令**：可以跳过这部分，直接用 `claude` 命令就够了！

### 7.1 VS Code 完整集成方案

> 💡 **这一节讲什么**：配置VS Code/Cursor编辑器，让它能完美运行Claude Code命令。配置后你就能在编辑器里一键调用AI助手了。

#### 步骤1：VS Code基础配置

首先确保VS Code已安装最新版本：

```bash
# 检查VS Code版本
code --version

# 如果未安装，访问：https://code.visualstudio.com/
```

> ⚠️ **Cursor用户注意**：Cursor是基于VS Code魔改的编辑器，所有VS Code的配置在Cursor里都能用！如果你用Cursor，把下面的"VS Code"理解成"Cursor"就行。

#### 步骤2：配置集成终端

**这是什么？**
"集成终端"就是编辑器下方那个黑框框（或白框框），用来运行命令的地方。配置它就是告诉编辑器："用哪个翻译器来执行我的命令"。

**为什么要配置？**
不配置的话，编辑器可能用错误的"翻译器"（Shell），导致命令运行失败或报错。

**操作方法：**
打开设置（`Ctrl/Cmd + ,`），点击右上角"打开设置(JSON)"，添加：

```json
{
  // ==========================================
  // 终端配置（告诉编辑器用哪个"翻译器"）
  // ==========================================

  // Windows用户 → 用PowerShell（Windows推荐的命令行工具）
  "terminal.integrated.defaultProfile.windows": "PowerShell",

  // Mac用户 → 用zsh（Mac 2019年后的默认Shell，比bash更现代）
  "terminal.integrated.defaultProfile.osx": "zsh",

  // Linux用户 → 用bash（Linux通用Shell）
  "terminal.integrated.defaultProfile.linux": "bash",

  // ==========================================
  // PowerShell 7配置（Windows推荐）
  // ==========================================
  // 指定用PowerShell 7而不是老版PowerShell 5.1
  // PowerShell 7功能更强大，跨平台，推荐使用
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "icon": "terminal-powershell",
      "path": "pwsh.exe"  // pwsh.exe = PowerShell 7
    }
  },

  // ==========================================
  // 终端外观配置（让终端更好看）
  // ==========================================
  "terminal.integrated.fontFamily": "Menlo, Monaco, 'Courier New', monospace",
  "terminal.integrated.fontSize": 13,  // 13号字体，比默认稍大，更舒适

  // ==========================================
  // Claude Code专用配置
  // ==========================================
  // 让CLAUDE.md文件有Markdown语法高亮
  "files.associations": {
    "CLAUDE.md": "markdown"
  },

  // ==========================================
  // 自动保存（强烈推荐！）
  // ==========================================
  "files.autoSave": "afterDelay",  // 编辑后自动保存，不怕忘记保存丢失改动
  "files.autoSaveDelay": 1000      // 延迟1秒（1000毫秒）保存
}
```

> 💡 **配置说明（小白版）**：
>
> | 配置项                     | 人话翻译            | 为啥要配               |
> | -------------------------- | ------------------- | ---------------------- |
> | `defaultProfile.windows` | Windows用PowerShell | 确保命令能正常运行     |
> | `defaultProfile.osx`     | Mac用zsh            | Mac最新系统的默认Shell |
> | `defaultProfile.linux`   | Linux用bash         | Linux通用Shell         |
> | `profiles.windows`       | 用PowerShell 7      | 比老版更强大           |
> | `fontSize: 13`           | 终端字体13号        | 比默认大一点，看着舒服 |
> | `CLAUDE.md`              | 识别Claude配置文件  | 有语法高亮，好编辑     |
> | `autoSave`               | 自动保存            | 不怕忘记保存丢失改动   |
>
> **生活类比**：把电脑想象成一家国际餐厅
>
> - **中文服务员** = zsh（Mac专用）
> - **英文服务员** = PowerShell（Windows专用）
> - **通用服务员** = bash（大家都能用）
>
> 这个配置就是在告诉餐厅："我需要中文服务员/英文服务员来服务"。

**验证配置是否生效：**

1. 按 ``Ctrl + ` ``（Esc键下面那个键）打开终端
2. 运行验证命令：

**Windows用户：**

```powershell
# 查看PowerShell版本
$PSVersionTable.PSVersion
# 预期输出：显示版本号，比如 7.4.0
```

**Mac/Linux用户：**

```bash
# 查看当前Shell类型
echo $SHELL
# 预期输出Mac：/bin/zsh
# 预期输出Linux：/bin/bash
```

如果显示正确 → ✅ 配置成功！

#### 步骤3：创建VS Code任务（可选但推荐）

**这是什么？**
"任务（Task）"就是把常用命令做成一键按钮。比如"启动Claude Code"、"审查当前文件"这些操作，不用每次手敲命令，点一下就能执行。

**为什么要创建？**
类比：不用任务 = 每次都要手动打开微信；用任务 = 桌面有微信图标，一键打开。

**操作方法：**
在项目根目录创建 `.vscode/tasks.json`：

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Claude Code: 启动交互模式",
      "type": "shell",
      "command": "claude",
      "problemMatcher": [],
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "dedicated",
        "clear": true
      }
    },
    {
      "label": "Claude Code: 审查当前文件",
      "type": "shell",
      "command": "claude \"Review ${relativeFile} and suggest improvements\"",
      "problemMatcher": []
    },
    {
      "label": "Claude Code: 解释当前文件",
      "type": "shell",
      "command": "claude \"Explain what ${relativeFile} does\"",
      "problemMatcher": []
    },
    {
      "label": "Claude Code: 生成测试",
      "type": "shell",
      "command": "claude \"Generate unit tests for ${relativeFile}\"",
      "problemMatcher": []
    }
  ]
}
```

**使用任务：**

**方法1：命令面板（推荐）**

1. 按 `Ctrl/Cmd + Shift + P`（打开命令面板）
2. 输入：`Tasks: Run Task`
3. 选择你要运行的任务，比如"Claude Code: 启动交互模式"

**方法2：菜单操作**
点击菜单 `Terminal → Run Task...`

> 💡 **任务说明**：
>
> | 任务名称     | 作用                 | 使用场景         |
> | ------------ | -------------------- | ---------------- |
> | 启动交互模式 | 一键启动Claude Code  | 开始编程前       |
> | 审查当前文件 | 让Claude检查代码质量 | 写完代码想优化时 |
> | 解释当前文件 | 让Claude解释代码逻辑 | 看不懂别人代码时 |
> | 生成测试     | 自动生成单元测试     | 需要写测试时     |

#### 步骤4：配置快捷键（可选）

**这是什么？**
给刚才创建的"任务"绑定键盘快捷键，比如按 `Ctrl+Shift+C` 就能启动Claude Code，连菜单都不用点。

**为什么要配置？**
更快！按一个键盘快捷键 vs 打开菜单找任务，哪个快？当然是快捷键！

**操作方法：**
创建或编辑 `.vscode/keybindings.json`：

```json
[
  {
    "key": "ctrl+shift+c",  // 快捷键：Ctrl+Shift+C
    "command": "workbench.action.tasks.runTask",
    "args": "Claude Code: 启动交互模式"  // 执行哪个任务
  },
  {
    "key": "ctrl+shift+r",  // 快捷键：Ctrl+Shift+R
    "command": "workbench.action.tasks.runTask",
    "args": "Claude Code: 审查当前文件"
  },
  {
    "key": "ctrl+shift+e",  // 快捷键：Ctrl+Shift+E
    "command": "workbench.action.tasks.runTask",
    "args": "Claude Code: 解释当前文件"
  }
]
```

> 💡 **快捷键说明**：
>
> | 快捷键           | 执行任务        | 记忆方法    |
> | ---------------- | --------------- | ----------- |
> | `Ctrl+Shift+C` | 启动Claude Code | C = Claude  |
> | `Ctrl+Shift+R` | 审查当前文件    | R = Review  |
> | `Ctrl+Shift+E` | 解释当前文件    | E = Explain |
>
> ⚠️ **Mac用户**：把 `ctrl` 改成 `cmd` 即可

### 7.2 Cursor 编辑器集成

**Cursor是什么？**
Cursor是基于VS Code魔改的AI编辑器，自带AI助手。和Claude Code配合使用，效果更好！

**Cursor独特优势：**

- ✓ 内置AI对话面板（不用切换工具）
- ✓ AI代码补全（边写边提示）
- ✓ 与Claude Code互补而非冲突（两个AI工具不打架）

> 💡 **重要提示**：Cursor的所有配置和VS Code**完全相同**！上面第7.1节的配置，在Cursor里一字不差地照搬就行。

**唯一不同：打开设置文件的方法**

Cursor界面和VS Code略有不同，打开设置JSON文件的方法如下：

#### 方法 A：用命令面板打开（最推荐）

**步骤：**

1. 在 Cursor 按 `Ctrl + Shift + P`（打开命令面板）
2. 输入：`open user settings`（不区分大小写）
3. 选择：**Preferences: Open User Settings (JSON)** 或中文：**首选项: 打开用户设置(JSON)**
4. 自动打开 `settings.json` 文件

**打开快捷键配置同理：**

- 输入：`open keyboard shortcuts`
- 选择：**Preferences: Open Keyboard Shortcuts (JSON)** 或中文：**首选项: 打开键盘快捷方式(JSON)**

---

#### 方法 B：直接打开文件路径（万能方法）

如果方法A找不到菜单（Cursor版本不同可能有差异），用这个方法**100%有效**：

**步骤：**

1. 在 Cursor 按 `Ctrl + P`（快速打开文件）
2. 粘贴下面对应你系统的路径，按回车：

**Windows系统：**

```
C:\Users\你的用户名\AppData\Roaming\Cursor\User\settings.json
```

**Mac系统：**

```
~/Library/Application Support/Cursor/User/settings.json
```

> ⚠️ **注意**：把"你的用户名"改成你电脑的实际用户名！比如你的用户名是 `admin`，路径就是 `C:\Users\admin\AppData\...`

---

**配置完成后，Cursor就能完美运行Claude Code了！**

Cursor的配置与VS Code完全相同，如果上面VSCode中配置过，可以直接复用上面的配置：

```bash
# 将VS Code配置复制到Cursor
# macOS/Linux:
cp -r ~/project/.vscode ~/project/.cursor

# Windows:
xcopy /E /I %USERPROFILE%\project\.vscode %USERPROFILE%\project\.cursor
```

**推荐工作流：**

| 场景         | 使用工具     | 原因             |
| ------------ | ------------ | ---------------- |
| 快速代码补全 | Cursor内置AI | 快速，无需切换   |
| 复杂逻辑重构 | Claude Code  | 更强推理能力     |
| 代码审查     | Claude Code  | 更全面上下文理解 |
| 生成测试     | Claude Code  | 更完整测试覆盖   |

### 7.3 JetBrains IDEs 集成

适用于WebStorm、PyCharm、IntelliJ IDEA等。

#### 步骤1：配置External Tools

1. 打开设置：

   - Windows/Linux: `File → Settings → Tools → External Tools`
   - macOS: `Preferences → Tools → External Tools`
2. 点击 `+` 添加新工具：

**Tool 1：Claude Code交互模式**

| 字段              | 值                   |
| ----------------- | -------------------- |
| Name              | Claude Code          |
| Program           | claude               |
| Arguments         | （留空）             |
| Working directory | `$ProjectFileDir$` |

**Tool 2：审查当前文件**

| 字段              | 值                                               |
| ----------------- | ------------------------------------------------ |
| Name              | Claude: Review File                              |
| Program           | claude                                           |
| Arguments         | `"Review $FilePath$ and suggest improvements"` |
| Working directory | `$ProjectFileDir$`                             |

#### 步骤2：配置快捷键

1. `Settings → Keymap`
2. 搜索 `External Tools`
3. 右键 → `Add Keyboard Shortcut`
4. 设置快捷键（如 `Ctrl+Shift+C`）

---

## 第八部分：故障排查

### 8.1 平台特定问题

#### Windows平台

**问题1：PowerShell执行策略限制**

```powershell
# 错误信息
claude : 无法加载文件 C:\Users\...\npm\claude.ps1，因为在此系统上禁止运行脚本。
```

**原因**：Windows默认安全策略禁止运行未签名脚本

**解决方案：**

```powershell
# 方法1：修改执行策略（管理员PowerShell）- 推荐
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# 方法2：使用CMD而不是PowerShell
# Win+R → cmd

# 方法3：每次临时允许执行
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

**问题2：路径包含空格或中文**

```bash
# 错误示例
npm ERR! path C:\Program Files\nodejs\中文目录\claude
```

**解决方案：**

```bash
# 1. 不要在中文路径下安装Node.js
# 2. 修改npm全局目录到无空格路径：
npm config set prefix C:\npm-global
# 添加C:\npm-global到系统PATH
```

**问题3：Windows Defender误报**

```bash
# 症状：安装过程中文件被删除
# 原因：Windows Defender将node.exe识别为潜在威胁

# 解决方案
# 1. 添加npm目录到排除列表
#    Windows安全 → 病毒和威胁防护 → 排除项
#    添加：C:\Users\<用户名>\AppData\Roaming\npm

# 2. 临时禁用实时保护（不推荐）
```

#### macOS平台

**问题1：命令找不到但已安装**

```bash
# 症状
claude: command not found
# 但 npm list -g 显示已安装

# 原因：PATH未更新

# 解决方案
# 检查npm全局bin路径
npm config get prefix
# 通常是 /usr/local 或 ~/.npm-global

# 添加到PATH
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# 或重启终端
```

**问题2：macOS Gatekeeper阻止**

```bash
# 症状
"claude" cannot be opened because the developer cannot be verified

# 解决方案
# 方法1：允许此应用（不推荐）
sudo xattr -r -d com.apple.quarantine /usr/local/bin/claude

# 方法2：在安全偏好设置中允许
# 系统偏好设置 → 安全性与隐私 → 通用 → 点击"仍要打开"

# 方法3：通过npm安装通常不会触发此问题
```

**问题3：权限问题（使用sudo安装后）**

```bash
# 症状
claude: permission denied

# 原因：使用sudo安装，文件属于root

# 解决方案
# 修复npm全局目录权限
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# 或重新安装（不使用sudo）
npm uninstall -g @anthropic-ai/claude-code
npm install -g @anthropic-ai/claude-code
```

---

### 8.2 Node.js 安装问题

**问题1：安装后命令无法识别**

```
node -v
# 输出：'node' 不是内部或外部命令
```

**原因**：环境变量PATH未正确配置

**解决方法（Windows）：**

1. 找到Node.js安装路径（默认 `C:\Program Files\nodejs\`）
2. 右键"此电脑" → 属性 → 高级系统设置 → 环境变量
3. 在"系统变量"中找到"Path"，双击编辑
4. 点击"新建"，粘贴Node.js路径
5. 确定保存
6. **重启所有终端窗口**

**问题2：权限错误（macOS/Linux）**

```bash
npm install -g some-package
# Error: EACCES: permission denied
```

**解决方法：**

```bash
# 不要使用sudo！改用用户目录
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 重新尝试安装
npm install -g @anthropic-ai/claude-code
```

**问题3：版本冲突**

```bash
node -v
# v18.20.0  # 不是期望的v22.x
```

**解决方法：**

```bash
# Windows：卸载旧版本
# 控制面板 → 程序和功能 → 卸载Node.js → 重新安装v22

# macOS（Homebrew）：
brew uninstall node@18
brew install node@22
brew link node@22 --force

# Linux（nvm）：
nvm install 22
nvm use 22
nvm alias default 22
```

### 8.3 网络连接问题

**问题：无法访问api.anthropic.com**

```bash
ping api.anthropic.com
# 请求超时
```

**解决方案：**

```bash
# 方案1：使用国内镜像
npm config set registry https://registry.npmmirror.com

# 方案2：配置代理
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890

# 方案3：修改DNS
# Windows：设置DNS为8.8.8.8或114.114.114.114
# macOS/Linux：编辑/etc/resolv.conf添加nameserver 8.8.8.8
```

**问题3：SSL证书错误**

**症状：**

```bash
npm install
# Error: unable to verify the first certificate
```

**临时解决（不推荐长期使用）：**

```bash
npm config set strict-ssl false
```

**正确解决：**

```powershell
# PowerShell 7 - 更新系统根证书
# Windows：通过Windows Update自动更新

# 手动检查更新
Start-Process ms-settings:windowsupdate

# macOS：系统自动维护，无需手动更新

# Linux：
sudo apt update && sudo apt upgrade ca-certificates
```

### 8.4 API Key 配置问题

**问题：环境变量未生效**

```bash
echo $ANTHROPIC_API_KEY
# 显示为空
```

**解决方案：**

```bash
# macOS/Linux：确认配置文件
cat ~/.zshrc | grep ANTHROPIC
# 应该看到：export ANTHROPIC_API_KEY="sk-ant-..."

# 如果没有，手动添加
echo 'export ANTHROPIC_API_KEY="你的key"' >> ~/.zshrc
source ~/.zshrc
```

**Windows：**

```powershell
# 检查是否配置
[System.Environment]::GetEnvironmentVariable('ANTHROPIC_API_KEY', 'User')

# 如果为空，重新配置
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_API_KEY', 'sk-ant-api03-你的key', 'User')

# 重启PowerShell
```

**问题：Key无效或过期**

```json
{
  "error": {
    "type": "authentication_error",
    "message": "invalid x-api-key"
  }
}
```

**解决方法：**

1. 登录 console.anthropic.com
2. Settings → API Keys
3. 检查Key是否被删除或禁用
4. 如果无效，创建新Key
5. 更新环境变量

**问题3：Key格式错误**

**症状**：Key看起来不完整或有空格

**正确格式检查（PowerShell 7）：**

```powershell
# Key应该满足：
# 1. 以"sk-ant-api03-"开头
# 2. 后面跟长串字母数字
# 3. 总长度约95字符
# 4. 无空格、无换行

# 验证长度
$env:ANTHROPIC_API_KEY.Length
# 应该输出：95左右

# 验证格式
$env:ANTHROPIC_API_KEY -match '^sk-ant-api03-[A-Za-z0-9_-]+$'
# 应该输出：True
```

**常见格式错误：**

```bash
❌ sk-ant-XXXXX （缺少api03）
❌ sk-XXXXX （缺少ant-api03）
❌ 有空格或换行符
❌ 复制时多复制/少复制字符
```

### 8.5 终端相关问题

**问题：中文乱码（Windows）**

```bash
# 临时切换到UTF-8
chcp 65001

# 永久设置
reg add HKCU\Console /v CodePage /t REG_DWORD /d 65001 /f
```

**PowerShell中文显示：**

```powershell
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

**问题3：复制粘贴不工作**

不同终端的复制粘贴快捷键不同：

**Windows Terminal：**

- 右键选中文本自动复制
- `Ctrl+Shift+C` 复制
- `Ctrl+Shift+V` 粘贴

**Windows CMD：**

- 右键 → 标记 → 选中文本 → 回车复制
- 右键粘贴

**macOS Terminal：**

- `Cmd+C` 复制
- `Cmd+V` 粘贴

**Linux终端：**

- `Ctrl+Shift+C` 复制
- `Ctrl+Shift+V` 粘贴
- 或鼠标中键粘贴（选中即复制）

**问题4：命令历史记录丢失**

**症状**：重启终端后之前输入的命令无法通过上下箭头找回

**PowerShell 7配置：**

```powershell
# PowerShell 7默认已配置历史记录
# 查看历史记录位置
$env:APPDATA\Microsoft\Windows\PowerShell\PSReadLine\

# 增强历史记录功能（编辑PowerShell配置文件）
notepad $PROFILE

# 添加以下内容：
Set-PSReadLineOption -HistorySearchCursorMovesToEnd
Set-PSReadLineOption -MaximumHistoryCount 10000
Set-PSReadLineKeyHandler -Key UpArrow -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward
```

**Bash/Zsh配置（macOS/Linux）：**

```bash
# 确认历史记录文件
echo $HISTFILE
# 应该是~/.bash_history或~/.zsh_history

# 如果为空，添加到配置
# Zsh用户（编辑~/.zshrc）：
echo 'export HISTFILE=~/.zsh_history' >> ~/.zshrc
echo 'export HISTSIZE=10000' >> ~/.zshrc
echo 'export SAVEHIST=10000' >> ~/.zshrc
source ~/.zshrc

# Bash用户（编辑~/.bashrc）：
echo 'export HISTFILE=~/.bash_history' >> ~/.bashrc
echo 'export HISTSIZE=10000' >> ~/.bashrc
echo 'export HISTFILESIZE=20000' >> ~/.bashrc
source ~/.bashrc
```

**验证历史记录：**

```powershell
# PowerShell 7
Get-History

# Bash/Zsh
history | tail -20
```

---

## 第九部分：学员常见问题FAQ

> 💡 **本节收录**：直播课程中学员最常问的20个问题，帮你避开90%的坑！

### 9.1 安装与配置类

#### Q1：运行 `code --version` 报错说找不到命令？

**A1：你可能在Cursor里运行的！**

- `code` 是 **VS Code** 的命令
- `cursor` 是 **Cursor** 的命令

**正确做法：**

- 在Cursor里运行：`cursor --version`
- 在VS Code里运行：`code --version`
- 查看Claude Code版本：`claude --version`

#### Q2：找不到settings.json文件在哪儿？

**A2：不同编辑器位置不同！**

**Cursor位置：**

- Windows: `C:\Users\你的用户名\AppData\Roaming\Cursor\User\settings.json`
- Mac: `~/Library/Application Support/Cursor/User/settings.json`

**VS Code位置：**

- Windows: `C:\Users\你的用户名\AppData\Roaming\Code\User\settings.json`
- Mac: `~/Library/Application Support/Code/User/settings.json`

**快速打开方法：**

1. 按 `Ctrl/Cmd + Shift + P`
2. 输入：`open user settings json`
3. 选择：`Preferences: Open User Settings (JSON)`

#### Q3：配置后还是报错，怎么办？

**A3：按照这个检查清单逐项排查：**

```
□ settings.json文件保存了吗？（看文件名有没有*号）
□ JSON格式正确吗？（大括号、逗号、引号都对吗）
□ 重启了终端吗？（配置需要重启终端才生效）
□ 重启了编辑器吗？（有时需要完全重启）
```

**还是不行？** 把错误信息截图，群里问老金！

#### Q4：zsh、PowerShell、bash 有什么区别？我该用哪个？

**A4：它们都是Shell（命令行翻译器），选对应你系统的就行！**

| 操作系统          | 推荐Shell  | 为什么             |
| ----------------- | ---------- | ------------------ |
| **Windows** | PowerShell | 系统自带，功能强大 |
| **Mac**     | zsh        | 2019年后的系统默认 |
| **Linux**   | bash       | 通用标准           |

**你不用手动选**，按照第7.1节配置后，编辑器会自动选对的！

#### Q5：怎么知道我现在用的是哪个Shell？

**A5：打开终端运行这个命令：**

```bash
echo $SHELL
```

**看输出：**

- 显示 `/bin/zsh` → 你在用zsh
- 显示 `/bin/bash` → 你在用bash
- Windows显示 `powershell` → 你在用PowerShell

---

### 9.2 启动与使用类

#### Q6：怎么启动Claude Code？

**A6：有2种方式，推荐第1种！**

**方式1：终端命令启动（推荐）**

```bash
# 进入项目目录
cd /你的项目路径

# 启动Claude Code
claude
```

**方式2：IDE快捷键启动**

- 配置tasks.json（见第7.1节）
- 按 `Ctrl/Cmd + Shift + P` → 选 `Tasks: Run Task` → 选 `Claude Code: 启动交互模式`

#### Q7：启动后看到什么才算成功？

**A7：看到这个界面就成功了：**

```
╭─────────────────────────────────────────╮
│  Welcome to Claude Code v2.0           │
│  • Type /help to see available commands │
╰─────────────────────────────────────────╯

You: █
```

关键要素：

- ✅ 显示欢迎信息
- ✅ 显示版本号（v2.0+）
- ✅ 显示工作目录
- ✅ 有输入光标 `█`

#### Q8：`--dangerously-skip-permissions` 是什么？我该用吗？

**A8：这个参数跳过权限询问，新手别用！**

**通俗解释：**

- 不加参数 = AI做事前都问你"可以吗？"
- 加参数 = AI直接干，不问你

**老金建议：**

- 🟢 **新手（前2周）**：别加！让AI问你，你能学到它在做什么
- 🟡 **熟练后**：自己的小项目可以加，省时间
- 🔴 **重要项目**：永远别加！安全第一

详细说明见第6.5.2节。

#### Q9：启动Claude Code后怎么退出？

**A9：两种方法：**

**方法1：命令退出**

```bash
/exit
```

**方法2：快捷键退出**

- 按 `Ctrl + C` 两次
- 或 `Ctrl + D`

#### Q10：能同时打开多个Claude Code吗？

**A10：可以！每个终端窗口都能启动一个Claude Code实例。**

**使用场景：**

- 窗口1：处理前端代码
- 窗口2：处理后端代码
- 窗口3：运行测试

---

### 9.3 配置文件类

#### Q11：tasks.json文件放在哪里？

**A11：放在项目根目录的 `.vscode` 文件夹里！**

**完整路径示例：**

```
你的项目/
├── .vscode/
│   └── tasks.json  ← 放这里
├── src/
└── package.json
```

**创建步骤：**

1. 在项目根目录创建 `.vscode` 文件夹（如果没有）
2. 在 `.vscode` 里创建 `tasks.json` 文件
3. 复制第7.1节的配置粘贴进去
4. 保存

#### Q12：配置后快捷键不生效？

**A12：检查这些：**

```
□ keybindings.json保存了吗？
□ 快捷键有冲突吗？（换个组合试试）
□ 重启编辑器了吗？
```

**查看快捷键冲突：**

1. 按 `Ctrl/Cmd + K, Ctrl/Cmd + S`（打开快捷键设置）
2. 搜索你配置的快捷键
3. 看是否有其他命令占用

#### Q13：粘贴配置后报JSON错误？

**A13：99%是格式问题！**

**常见错误：**

| 错误                  | 原因          | 解决                         |
| --------------------- | ------------- | ---------------------------- |
| `Unexpected token`  | 多了/少了逗号 | 最后一项配置不要逗号         |
| `Invalid character` | 中文引号      | 把 `""` 改成 `""`        |
| `Unexpected end`    | 大括号不匹配  | 数数 `{` 和 `}` 是否相等 |

**快速检查：**

- 用在线工具检查JSON格式：https://jsonlint.com/
- 复制你的配置粘贴进去，它会告诉你哪里错了

---

### 9.4 权限与安全类

#### Q14：Claude Code会偷偷上传我的代码吗？

**A14：不会！Claude Code只上传你让它处理的内容。**

**工作原理：**

1. 你问问题 → Claude Code读取相关文件
2. 把文件内容发给Anthropic API处理
3. 收到AI回复后显示给你

**隐私保护：**

- ✅ 只上传你明确要求处理的文件
- ✅ 你可以通过权限控制它能访问什么
- ✅ 不会后台扫描或上传整个项目

#### Q15：我不想让Claude Code访问某些文件，怎么办？

**A15：用 `.gitignore` 或 `.claudeignore` 排除！**

**方法1：.gitignore（推荐）**
Claude Code默认会忽略 `.gitignore` 里的文件。

**方法2：.claudeignore**
在项目根目录创建 `.claudeignore` 文件：

```
# 不让Claude访问的文件
.env
*.key
secrets/
config/production.json
```

---

### 9.5 网络与性能类

#### Q16：Claude Code响应很慢，怎么优化？

**A16：检查网络和上下文大小！**

**网络检查：**

```bash
# 测试到Anthropic的延迟
ping api.anthropic.com
# 延迟<500ms = 正常，>1000ms = 慢
```

**优化方法：**

1. ✅ 使用代理（国内用户必需）
2. ✅ 减少上下文（不要让AI读太多文件）
3. ✅ 使用 `.claudeignore` 排除无关文件

#### Q17：国内网络访问Anthropic API很慢？

**A17：配置代理！**

**临时代理（当前终端生效）：**

```bash
# macOS/Linux
export HTTPS_PROXY=http://127.0.0.1:7890

# Windows PowerShell
$env:HTTPS_PROXY="http://127.0.0.1:7890"
```

**永久代理（推荐）：**
在 `~/.zshrc` 或 `~/.bashrc` 添加：

```bash
export HTTPS_PROXY=http://127.0.0.1:7890
export HTTP_PROXY=http://127.0.0.1:7890
```

---

### 9.6 错误信息类

#### Q18：启动时报错 `claude: command not found`？

**A18：Claude Code没安装或没加到PATH！**

**解决步骤：**

1. 检查是否安装：

   ```bash
   npm list -g @anthropic/claude-code
   ```
2. 如果没安装：

   ```bash
   npm install -g @anthropic/claude-code
   ```
3. 如果安装了但找不到命令：

   ```bash
   # macOS/Linux重新加载配置
   source ~/.zshrc  # 或 source ~/.bashrc

   # Windows重启终端
   ```

#### Q19：启动时报错 `API key not found`？

**A19：没配置ANTHROPIC_API_KEY环境变量！**

**快速检查：**

```bash
# 查看环境变量是否存在
echo $ANTHROPIC_API_KEY  # macOS/Linux
echo $env:ANTHROPIC_API_KEY  # Windows
```

**如果显示空 → 没配置，回到第四部分重新配置。**

#### Q20：我的问题不在这里，怎么办？

**A20：这样做：**

1. ✅ 运行 `claude --help` 查看官方帮助
2. ✅ 查看日志文件：`~/.claude/logs/` 找错误信息
3. ✅ 访问官方文档：https://docs.claude.ai/code
4. ✅ GitHub搜索类似问题：https://github.com/anthropics/claude-code/issues
5. ✅ 把错误信息截图，在学习群里问老金！

**提问时请提供：**

- 操作系统和版本
- Node.js版本（`node -v`）
- Claude Code版本（`claude --version`）
- 完整错误信息（截图或复制文字）
- 你做了什么操作

---

## 总结与检查清单

### 完成本课后，请确认以下所有项：

**环境安装：**

- [ ] Node.js 22.x安装成功
- [ ] npm命令可用
- [ ] 配置了npm国内镜像（国内用户）

**账号准备：**

- [ ] 注册了Anthropic账号（或使用中转站）
- [ ] 获取了API Key
- [ ] Key已保存到安全位置

**系统配置：**

- [ ] 环境变量ANTHROPIC_API_KEY已配置
- [ ] 终端能正确显示中文
- [ ] 网络能访问api.anthropic.com

**Claude Code安装：**

- [ ] Claude Code安装成功
- [ ] `claude --version` 显示正确版本
- [ ] `claude --help` 显示帮助信息

**功能验证：**

- [ ] 通过基础测试套件
- [ ] 完成Hello World项目
- [ ] IDE集成配置完成

**如果以上全部勾选，恭喜你已经完成准备工作！🎉**

---

## 附录

### A. 常用命令速查

```bash
# Node.js版本管理
node -v                    # 查看Node版本
npm -v                     # 查看npm版本
nvm list                   # 列出所有Node版本(nvm用户)

# npm配置
npm config list            # 查看所有配置
npm config get registry    # 查看镜像源
npm cache clean --force    # 清除缓存

# 环境变量查看
$env:ANTHROPIC_API_KEY     # PowerShell 7（推荐）
echo $ANTHROPIC_API_KEY    # macOS/Linux
echo %ANTHROPIC_API_KEY%   # Windows CMD（不推荐）

# 网络测试
ping api.anthropic.com     # 测试连通性
curl -I https://api.anthropic.com  # 测试HTTPS访问

# Claude Code操作
claude --version           # 查看版本
claude --help              # 查看帮助
claude /doctor             # 系统诊断
claude "问题"              # 单次提问
claude                     # 进入交互模式
```

### B. 推荐学习资源

**Node.js官方文档：**

- 英文：https://nodejs.org/docs/
- 中文：https://nodejs.cn/

**Anthropic API文档：**

- https://docs.anthropic.com/

**终端使用教程：**

- Windows Terminal：https://learn.microsoft.com/zh-cn/windows/terminal/
- macOS终端：https://support.apple.com/zh-cn/guide/terminal/

**社区支持：**

- Claude Discord：https://discord.gg/anthropic
- GitHub Discussions：https://github.com/anthropics/claude-code/discussions

---

**课程制作**：老金
**最后更新**：2025年12月
**版本**：v2.0
**许可**：本课程采用CC BY-NC-SA 4.0许可
