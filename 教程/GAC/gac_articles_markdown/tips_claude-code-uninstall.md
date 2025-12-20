# Claude Code 完全卸载指南

**发布时间**: 📅 2025年1月4日
**作者**: ✍️ GAC Code Team
**分类**: 安装教程
**标签**: #Claude Code #卸载 #清理

---

本指南将帮助您彻底卸载 Claude Code，清理所有相关文件和配置。

### 检查安装方式

首先确定 Claude Code 的安装方式：

```bash
# 检查本地项目安装
npm ls @anthropic-ai/claude-code

# 检查全局安装
npm ls -g @anthropic-ai/claude-code
```

### 执行卸载操作

根据安装方式选择对应的卸载命令：

#### 卸载本地安装版本

```bash
npm uninstall @anthropic-ai/claude-code
```

#### 卸载全局安装版本

```bash
npm uninstall -g @anthropic-ai/claude-code
```

### 清理残留文件

#### 检查并删除本地残留目录

```bash
# 查看本地模块目录
ls -la node_modules/@anthropic-ai

# 删除残留目录（如果存在）
rm -rf node_modules/@anthropic-ai
```

#### 检查并删除全局残留目录

```bash
# 获取全局模块路径
npm root -g

# 删除全局残留目录（根据实际路径调整）
# 示例路径：/opt/homebrew/lib/node_modules/@anthropic-ai
rm -rf /opt/homebrew/lib/node_modules/@anthropic-ai
```

### 清理缓存

可选步骤，清理 npm 缓存：

```bash
npm cache clean --force
```

### 验证卸载结果

#### 检查依赖残留

```bash
# 本地依赖检查
npm ls @anthropic-ai/claude-code

# 全局依赖检查
npm ls -g @anthropic-ai/claude-code
```

#### 检查配置引用

```bash
# 查找用户目录中的配置引用
grep -r "@anthropic-ai/claude-code" ~/
```

#### 检查系统残留目录

```bash
# 查找系统中是否还有残留目录（较慢，可选操作）
sudo find / -name "claude-code" 2>/dev/null
```

### 确认卸载完成

卸载成功的标准：

- 本地依赖无残留
- 全局依赖无残留
- node_modules/@anthropic-ai 目录已删除
- npm 缓存已清理
- 配置文件中无相关引用

完成以上步骤后，Claude Code 已从您的系统中彻底清除。

### 重新安装

如需重新安装，请参考 Claude Code 安装指南。

### 技术支持

卸载过程中如遇问题：

- 联系客服微信：iweico
