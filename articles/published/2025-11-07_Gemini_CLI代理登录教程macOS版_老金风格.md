# Gemini CLI 代理登录完整教程（macOS 版）

## 问题背景

在需要通过代理才能访问 Google 的网络环境下，使用 gemini CLI 进行 OAuth 网页登录时会遇到三个问题：

1、外部请求需要代理：访问 Google 登录页面必须经过代理（如 7890 端口）
2、回调被拦截：浏览器完成登录后回调到 localhost 时被代理拦截
3、令牌交换失败：gemini 在交换令牌时如果不走代理会失败（503 错误）

## 核心解决方案

只需配置环境变量，让 gemini 进程：
1、所有外部请求走代理（如 7890）
2、localhost 回调直连（不走代理）

---

## 方案一：一键命令（临时生效）

### 适用场景
1、偶尔使用 gemini
2、不想修改配置文件

### 操作方法

在终端中每次使用前执行这一行：

    HTTP_PROXY="http://127.0.0.1:7890" HTTPS_PROXY="http://127.0.0.1:7890" NO_PROXY="localhost,127.0.0.1,::1,.localhost" gemini

说明：
1、HTTP_PROXY / HTTPS_PROXY：指定代理地址（改成你的实际代理端口，Clash 默认 7890）
2、NO_PROXY：让 localhost 直连
3、这些变量只在当前命令中生效

---

## 方案二：Shell 函数（推荐，永久生效）

### 适用场景
1、经常使用 gemini
2、希望每次输入 gemini 就自动走代理
3、不影响系统其他软件
4、不影响 npm 升级

### 操作步骤

#### 步骤 1：确定你使用的 Shell

在终端执行：

    echo $SHELL

输出结果：
1、/bin/zsh 或 /usr/bin/zsh → 使用 zsh（macOS 默认）
2、/bin/bash 或 /usr/bin/bash → 使用 bash

#### 步骤 2：编辑配置文件

如果使用 zsh（macOS 默认）：

    nano ~/.zshrc

如果使用 bash：

    nano ~/.bash_profile

#### 步骤 3：在文件末尾添加以下内容

    # === Gemini CLI 自动代理配置 ===
    gemini() {
      # 代理地址（根据实际情况修改，Clash 默认 7890）
      local proxy="http://127.0.0.1:7890"
      
      # 备份当前环境变量
      local bak_http="$HTTP_PROXY"
      local bak_https="$HTTPS_PROXY"
      local bak_no="$NO_PROXY"
      
      # 设置代理（仅本次 gemini 进程）
      export HTTP_PROXY="$proxy"
      export HTTPS_PROXY="$proxy"
      export NO_PROXY="localhost,127.0.0.1,::1,.localhost"
      
      # 调用真实的 gemini 可执行文件
      command gemini "$@"
      
      # 恢复环境变量
      export HTTP_PROXY="$bak_http"
      export HTTPS_PROXY="$bak_https"
      export NO_PROXY="$bak_no"
    }

#### 步骤 4：保存并退出

1、按 Ctrl + O（保存）
2、按 Enter（确认）
3、按 Ctrl + X（退出）

#### 步骤 5：让配置立即生效

如果使用 zsh：

    source ~/.zshrc

如果使用 bash：

    source ~/.bash_profile

#### 步骤 6：以后直接使用

    gemini
    gemini --yolo
    gemini "你的问题"

### 工作原理

1、Shell 启动时会加载配置文件中的函数
2、当你输入 gemini 时，实际执行的是这个函数
3、函数会临时设置代理环境变量，然后调用真实的 gemini
4、gemini 进程结束后，环境变量自动恢复，不影响其他软件

### 优点

1、零侵入：不修改 npm 包，升级 gemini 不受影响
2、自动化：无需每次手动设置环境变量
3、隔离性：只影响 gemini，不影响系统其他软件
4、可撤销：随时可以删除函数恢复原状

---

## 方案三：Shell 脚本（双击启动）

### 适用场景
1、喜欢双击图标启动
2、不习惯命令行

### 操作步骤

#### 步骤 1：创建脚本文件

    nano ~/Desktop/gemini-proxy.sh

#### 步骤 2：添加以下内容

    #!/bin/bash
    
    # 设置代理（改成你的实际代理端口）
    export HTTP_PROXY="http://127.0.0.1:7890"
    export HTTPS_PROXY="http://127.0.0.1:7890"
    export NO_PROXY="localhost,127.0.0.1,::1,.localhost"
    
    # 启动 gemini
    gemini "$@"
    
    # 等待用户按键
    read -p "按任意键退出..."

#### 步骤 3：保存并退出

1、按 Ctrl + O（保存）
2、按 Enter（确认）
3、按 Ctrl + X（退出）

#### 步骤 4：添加执行权限

    chmod +x ~/Desktop/gemini-proxy.sh

#### 步骤 5：使用方法

1、双击运行：在 Finder 中双击 gemini-proxy.sh
2、命令行运行：~/Desktop/gemini-proxy.sh
3、带参数运行：~/Desktop/gemini-proxy.sh --yolo

注意：首次双击可能提示"无法打开"，需要：
1、右键点击脚本
2、选择"打开方式" → "终端"
3、或在"系统偏好设置" → "安全性与隐私"中允许

---

## 完整登录流程

步骤 1：启动 gemini

    gemini

步骤 2：复制登录链接

终端会打印类似内容（复制这个链接）：

    Code Assist login required.
    
    Attempting to open authentication page in your browser.
    Otherwise navigate to:
    
    https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=...

步骤 3：浏览器登录

1、浏览器会自动打开（或手动复制链接到浏览器）
2、完成 Google 账号登录
3、授权 Gemini CLI

步骤 4：自动回调

1、浏览器会跳转到 localhost 回调地址
2、gemini 自动完成令牌交换
3、登录成功

步骤 5：开始使用

    gemini "Hello, how are you?"
    gemini --yolo

---

## 常见问题

### 问题 1：浏览器显示"无法访问此网站"

原因：浏览器也走了全局代理，把 localhost 请求也转发到了代理服务器

解决方法：
1、确保代理软件（Clash/V2Ray 等）设置了"绕过本地地址"
2、Clash for Mac：设置 → 通用 → 绕过域名/IP → 添加 localhost,127.0.0.1
3、或使用临时浏览器启动命令

Chrome 临时启动命令：

    open -na "Google Chrome" --args --proxy-server="http=127.0.0.1:7890;https=127.0.0.1:7890" --proxy-bypass-list="localhost;127.0.0.1;*.localhost;<-loopback>" --user-data-dir="/tmp/ChromeGemini"

Safari 临时启动命令（Safari 使用系统代理，需要临时修改系统代理设置）：

    # 不推荐，建议使用 Chrome

### 问题 2：浏览器显示 HTTP ERROR 503

原因：gemini 在交换令牌时没有走代理

解决方法：检查环境变量是否正确设置

查看当前设置：

    echo $HTTP_PROXY
    echo $HTTPS_PROXY
    echo $NO_PROXY

应该输出：

    http://127.0.0.1:7890
    http://127.0.0.1:7890
    localhost,127.0.0.1,::1,.localhost

### 问题 3：出现 Error 400

原因：OAuth 令牌已过期（令牌是一次性的）

解决方法：
1、关闭浏览器标签页
2、重新运行 gemini
3、使用新生成的登录链接

### 问题 4：如何临时绕过代理函数

直接运行原始 gemini（不走代理）：

    command gemini --version

或者：

    /usr/local/bin/gemini --version

### 问题 5：如何移除自动代理配置

方案二的移除方法：

如果使用 zsh：

    nano ~/.zshrc

如果使用 bash：

    nano ~/.bash_profile

删除 gemini() { ... } 整段代码，保存后：

如果使用 zsh：

    source ~/.zshrc

如果使用 bash：

    source ~/.bash_profile

方案三的移除方法：

    rm ~/Desktop/gemini-proxy.sh

---

## 技术原理

### 为什么需要设置环境变量

HTTP_PROXY / HTTPS_PROXY：
1、Node.js 的 HTTP 客户端库会自动读取这些环境变量
2、gemini CLI 使用 Google 官方认证库，支持标准代理环境变量

NO_PROXY：
1、指定哪些地址不走代理，直接连接
2、确保 OAuth 回调能够直接到达 gemini 监听的本地服务器

为什么只影响当前进程：
1、环境变量的作用域是"当前进程及其子进程"
2、设置后只影响当前 Shell 会话和它启动的 gemini 进程
3、不会影响系统其他软件

### 工作流程

    1. 用户启动 gemini
    2. gemini 读取环境变量 HTTP_PROXY / HTTPS_PROXY
    3. gemini 打开浏览器访问 Google 登录页（走代理）
    4. 用户完成登录
    5. 浏览器跳转到 localhost（读取 NO_PROXY，直连）
    6. gemini 收到回调 code
    7. gemini 向 Google 交换 access_token（走代理）
    8. 登录成功

---

## macOS 特别说明

### 常见代理软件端口

1、Clash for Mac：默认 7890
2、V2rayU：默认 1087
3、Surge：默认 6152
4、Shadowsocks：默认 1080

请根据你使用的代理软件修改配置中的端口号。

### 查看代理软件端口

在代理软件中查看：
1、Clash for Mac：设置 → 端口 → HTTP 端口
2、V2rayU：偏好设置 → PAC 服务器 → 端口
3、Surge：设置 → 代理 → HTTP 代理端口

### Shell 配置文件说明

macOS 默认使用 zsh（从 Catalina 10.15 开始）：
1、配置文件：~/.zshrc
2、旧版本使用 bash：~/.bash_profile

可以同时配置两个文件以兼容不同 Shell。

---

## 注意事项

1、代理地址要正确：将 127.0.0.1:7890 改成你实际的代理地址和端口
2、代理软件必须运行：确保 Clash/V2Ray 等代理软件正在运行
3、不要设置全局代理：使用上述方案就够了
4、npm 升级不受影响：这些方案都不修改 npm 包本身

可以正常执行升级：

    npm update -g @google/gemini-cli

---

## 总结

推荐方案：方案二（Shell 函数）
1、一次配置，永久生效
2、自动化程度最高
3、不影响系统和升级
4、可随时撤销

适合新手：方案一（一键命令）
1、无需修改配置
2、理解原理后再选择其他方案

适合老手：根据习惯选择方案二或方案三

---

## 参考资料

Gemini CLI GitHub:
https://github.com/google-gemini/gemini-cli

Google Auth Library Proxy Support:
https://github.com/googleapis/google-auth-library-nodejs

Node.js HTTP Proxy 环境变量:
https://nodejs.org/api/http.html#httprequestoptions-callback

---

最后更新：2024-11-06
作者：老金
适用版本：Gemini CLI 0.12.0+
适用系统：macOS 10.15+

