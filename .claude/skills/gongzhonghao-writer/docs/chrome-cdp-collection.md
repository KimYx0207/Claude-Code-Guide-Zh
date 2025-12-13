# Chrome CDP 连接收集方案

## 问题说明

**原问题**：Playwright 每次都会新开一个 Chrome 浏览器，无法使用现有浏览器中的登录状态（Cookie）。

**解决方案**：使用 Chrome DevTools Protocol (CDP) 连接到用户正在使用的 Chrome 浏览器。

## 快速开始

### 方法1：启动支持远程调试的Chrome（推荐）

#### Windows 用户：

1. **关闭所有 Chrome 窗口**

2. **启动支持远程调试的 Chrome**：
   ```bash
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\chrome-debug-profile"
   ```

   说明：
   - `--remote-debugging-port=9222`：启用远程调试端口
   - `--user-data-dir`：使用独立的配置文件夹（避免与正常Chrome冲突）

3. **在新打开的 Chrome 中**：
   - 登录微信公众号后台
   - 打开"发表记录"页面

4. **运行收集脚本**：
   ```bash
   cd .claude/skills/gongzhonghao-writer/scripts
   node connect_existing_chrome.js
   ```

#### Mac 用户：

1. **关闭所有 Chrome 窗口**

2. **启动支持远程调试的 Chrome**：
   ```bash
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="/tmp/chrome-debug-profile"
   ```

3. **后续步骤同 Windows**

### 方法2：连接到已运行的Chrome（高级）

如果你不想关闭现有的 Chrome 窗口：

#### Windows：

1. **找到 Chrome 快捷方式**（桌面或开始菜单）

2. **右键 > 属性 > 目标**，修改为：
   ```
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
   ```

3. **重启 Chrome**（必须完全关闭后再打开）

#### Mac：

创建启动脚本 `~/chrome-debug.sh`：
```bash
#!/bin/bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 &
```

运行：
```bash
chmod +x ~/chrome-debug.sh
./chrome-debug.sh
```

## 工作流程

```
用户操作                          脚本操作
┌──────────────────┐
│ 1. 启动调试模式  │
│    Chrome        │
└────────┬─────────┘
         │
┌────────▼─────────┐
│ 2. 登录微信公众 │
│    号后台        │
└────────┬─────────┘
         │
┌────────▼─────────┐
│ 3. 打开"发表记录"│
│    页面          │
└────────┬─────────┘
         │
         │          ┌──────────────────┐
         └─────────>│ 4. 连接Chrome    │
                    │    (CDP端口9222) │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ 5. 查找公众号页面│
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ 6. 获取页面快照  │
                    │    (Accessibility)│
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ 7. 保存到temp/   │
                    │    page1_snapshot │
                    └────────┬─────────┘
                             │
用户手动翻页                  │
┌──────────────────┐         │
│ 8. 点击"下一页"  │         │
└────────┬─────────┘         │
         │                   │
         └──────────────────>│ 9. 按Enter继续   │
                             │    收集下一页    │
                             └──────────────────┘
```

## 优势对比

| 特性 | 原方案（新开浏览器） | CDP方案（连接现有浏览器） |
|------|---------------------|-------------------------|
| 需要登录 | ✅ 每次都需要 | ❌ 无需登录 |
| Cookie | ❌ 无 | ✅ 使用现有Cookie |
| 多标签页 | ❌ 不支持 | ✅ 支持 |
| 浏览器资源 | ❌ 多个实例 | ✅ 单个实例 |
| 用户体验 | ⚠️ 需切换窗口 | ✅ 无需切换 |

## 注意事项

### 安全性

- CDP 端口（9222）仅监听本地（localhost），外部无法访问
- 使用完毕后可关闭 Chrome 停止调试模式
- 不建议长期开启调试模式使用

### 兼容性

- ✅ Chrome/Chromium（完全支持）
- ✅ Edge（基于Chromium，完全支持）
- ❌ Firefox（不支持CDP）
- ❌ Safari（不支持CDP）

### 常见问题

#### Q1: 提示"无法连接到Chrome浏览器"

**A**: 检查以下几点：
1. Chrome 是否使用 `--remote-debugging-port=9222` 启动
2. 端口 9222 是否被占用（尝试其他端口如 9223）
3. 防火墙是否阻止了本地连接

#### Q2: 找不到"发表记录"页面

**A**: 确保在 Chrome 中打开了以下URL格式的页面：
```
https://mp.weixin.qq.com/cgi-bin/freepublish?...
```

#### Q3: 能否同时使用正常Chrome？

**A**: 可以，但需要使用不同的 `--user-data-dir`：
- 调试Chrome：`--user-data-dir="C:\chrome-debug-profile"`
- 正常Chrome：不加参数（使用默认配置）

## 后续步骤

收集完数据后：

```bash
# 解析收集的数据
cd .claude/skills/gongzhonghao-writer/scripts
python collect_incremental.py

# 查看报告
cat ../data/wechat_report.txt
```

## 技术细节

### CDP 连接代码

```javascript
const { chromium } = require('playwright');

// 连接到现有Chrome实例
const browser = await chromium.connectOverCDP('http://localhost:9222');

// 获取所有标签页
const contexts = browser.contexts();
const pages = contexts[0].pages();

// 查找目标页面
const wechatPage = pages.find(page =>
  page.url().includes('mp.weixin.qq.com') &&
  page.url().includes('freepublish')
);
```

### Accessibility Snapshot 格式

脚本使用 Accessibility API 获取页面结构，比DOM更简洁：

```
StaticText "今天 17:29"
StaticText "已发表"
StaticText "香港2亿AI诈骗案细节曝光，视频会议里只有你是真人"
StaticText "673"
StaticText "13"
StaticText "48"
```

Python 解析器 (`parse_simple_text()`) 可直接处理此格式。

## 未来改进

- [ ] 自动翻页收集（监听"下一页"按钮）
- [ ] 支持多页批量收集
- [ ] 自动检测重复停止
- [ ] 图形化进度显示
