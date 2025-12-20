# 拯救AI编程乱码显示！老金一招教你完全避免！

## 每个AI编程的使用者都遇到过

被软件修改后，文件变成乱码的情况。

Claude Code、Codex、Cursor，一个都跑不了。

老金我测试了网上的N种办法。

找到了最有效直接的。

下载1个软件就搞定！

---

## 问题不在AI工具，而在终端

这些工具生成代码时，都是通过终端执行命令来写入文件。

关键在于PowerShell的编码。

不是显示的问题！

---

## 老金我实测了一下

**配置前**：
```python
# ��ǰʱ�䣺2024-10-30
print("����һ�����")
```

**配置后**：
```python
# 当前时间：2024-10-30
print("处理第一个订单")
```

---

## 四步彻底解决

### 第一步：检查PowerShell版本

**Windows用户**：
1、按 `Win + R`，输入 `powershell`，回车

**Mac用户**：
1、按 `Cmd + 空格`，输入 `terminal`，回车

在终端输入：
```powershell
$PSVersionTable.PSVersion
```

如果显示5.x，说明需要升级。

### 第二步：安装PowerShell 7

去微软官网下载PowerShell 7。

> PowerShell 7官方下载：https://github.com/PowerShell/PowerShell/releases

记住下载的是**pwsh.exe**，不是powershell.exe。

安装后检查：
```powershell
$PSVersionTable.PSVersion
```

显示7.x就对了。

### 第三步：配置UTF-8编码

在PowerShell 7里输入：
```powershell
$PROFILE
```

会显示配置文件路径。

然后添加这些内容：
```powershell
# 强制UTF-8编码
chcp 65001 | Out-Null
[Console]::InputEncoding = [System.Text.UTF8Encoding]::new()
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$OutputEncoding = [System.Text.UTF8Encoding]::new()

# 默认文件编码
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'
$PSDefaultParameterValues['Set-Content:Encoding'] = 'utf8'
$PSDefaultParameterValues['Add-Content:Encoding'] = 'utf8'
```

保存后重启PowerShell。

### 第四步：设置VS Code使用PowerShell 7

按 `Ctrl+Shift+P`，搜索"Terminal: Select Default Profile"。

选择"PowerShell"。

然后在VS Code设置中添加：
```json
{
    "files.encoding": "utf8",
    "files.autoGuessEncoding": true,
    "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

---

## 技术原理详解

当你在Windows系统中使用CLI且不在WSL中时：

在PowerShell中输入：
```powershell
[Console]::OutputEncoding
```

如果出现：
```
BodyName     : gb2312/us-ascii
EncodingName : Chinese Simplified (GB2312)
CodePage     : 936
```

说明你的控制台是GB2312编码，而CLI默认是UTF-8管道输出，此时就会出现乱码。

---

## 方案一：修改系统区域设置

如果你不想安装PowerShell 7，可以修改系统编码：

1、打开设置，搜索"语言设置"
2、点击"管理语言设置"
3、点击"管理"
4、点击"更改系统区域设置"
5、勾选"Beta版：使用Unicode UTF-8提供全球语言支持"
6、确定并重启电脑

---

## 方案二：安装PowerShell 7 + Windows Terminal（推荐）

命令行安装PowerShell 7：
```bash
winget install --id Microsoft.Powershell --source winget
```

如果你是Windows 10系统，推荐同时安装Windows Terminal，方便管理命令行。

---

## 社区反馈

**Cursor社区反馈**：

> PowerShell 5.1 + Cursor = 中文乱码重灾区
> 升级PowerShell 7后，所有编码问题都解决了
>
> 来源：https://github.com/getcursor/cursor/discussions/985

---

## 老金我给的建议

如果你也遇到AI编程助手中文乱码问题：

**首选PowerShell 7方案**，因为：
1、不影响系统其他程序
2、一劳永逸解决所有编码问题
3、获得更好的终端体验

**10分钟搞定，省心省力**。

---

## 简单粗暴，就是最好的解决方案

因为时间有限，创意无限。

别让编码问题，耽误了你改变世界的速度。

---

关注老金，AI工具不迷路，咱们下回再接着扒！

---

## 引用来源（供验证，不发布）

1、Claude Code官方终端配置文档 https://docs.anthropic.com/en/docs/claude-code/terminal-configuration
2、PowerShell 7官方下载 https://github.com/PowerShell/PowerShell/releases
3、Cursor社区讨论 https://github.com/getcursor/cursor/discussions/985
4、Claude Code中文网 https://www.claude-cn.org