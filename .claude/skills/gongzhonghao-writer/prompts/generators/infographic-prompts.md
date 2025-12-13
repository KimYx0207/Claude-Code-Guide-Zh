# 信息图自动生成指南

## 一、信息图适用场景

### 什么时候生成信息图？

**必须生成**：
- 数据对比类文章（如：A vs B 对比测评）
- 技术参数类文章（如：配置参数说明）
- 步骤流程类文章（如：安装教程、工作流）
- 关键数据展示（如：性能提升百分比、成本节省数据）

**不需要生成**：
- 纯观点输出文章
- 故事叙述类文章
- 短文章（<1000字）
- 纯代码教程

---

## 二、信息图类型

### 类型1：对比表格

**适用场景**：产品对比、技术对比、方案对比

**HTML模板**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>对比信息图</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 800px;
            width: 100%;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            font-size: 28px;
            font-weight: 700;
        }
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .comparison-table th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 16px;
        }
        .comparison-table td {
            padding: 15px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 15px;
            color: #555;
        }
        .comparison-table tr:hover {
            background: #f5f7fa;
        }
        .highlight {
            color: #667eea;
            font-weight: 600;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #999;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>产品对比信息图</h1>
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>对比维度</th>
                    <th>产品A</th>
                    <th>产品B</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>价格</td>
                    <td class="highlight">$20/月</td>
                    <td>$30/月</td>
                </tr>
                <tr>
                    <td>功能数量</td>
                    <td>15个</td>
                    <td class="highlight">25个</td>
                </tr>
                <!-- 根据实际内容动态填充 -->
            </tbody>
        </table>
        <div class="footer">数据来源：老金实测 | 更新时间：2025-11</div>
    </div>
</body>
</html>
```

---

### 类型2：流程图

**适用场景**：步骤说明、工作流程、安装教程

**HTML模板**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>流程信息图</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 40px;
            min-height: 100vh;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 40px;
            font-size: 26px;
        }
        .step {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            position: relative;
        }
        .step-number {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            flex-shrink: 0;
            margin-right: 20px;
            box-shadow: 0 4px 15px rgba(245,87,108,0.3);
        }
        .step-content {
            flex: 1;
        }
        .step-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
        }
        .step-desc {
            font-size: 14px;
            color: #666;
            line-height: 1.6;
        }
        .step::after {
            content: '';
            position: absolute;
            left: 25px;
            top: 50px;
            width: 2px;
            height: calc(100% + 10px);
            background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
            opacity: 0.3;
        }
        .step:last-child::after {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>工作流程图</h1>
        <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
                <div class="step-title">步骤一标题</div>
                <div class="step-desc">步骤描述内容...</div>
            </div>
        </div>
        <!-- 根据实际步骤动态生成 -->
    </div>
</body>
</html>
```

---

### 类型3：数据卡片

**适用场景**：关键数据展示、核心指标、性能提升

**HTML模板**：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>数据信息图</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", sans-serif;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            padding: 40px;
            min-height: 100vh;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            color: white;
            margin-bottom: 40px;
            font-size: 32px;
            text-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }
        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }
        .card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
        }
        .card-number {
            font-size: 48px;
            font-weight: bold;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }
        .card-label {
            font-size: 16px;
            color: #666;
            margin-bottom: 5px;
        }
        .card-desc {
            font-size: 13px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>核心数据一览</h1>
        <div class="cards">
            <div class="card">
                <div class="card-number">90%</div>
                <div class="card-label">效率提升</div>
                <div class="card-desc">相比传统方式</div>
            </div>
            <!-- 根据实际数据动态生成 -->
        </div>
    </div>
</body>
</html>
```

---

## 三、信息图生成工作流

### 步骤1：检测文章类型

**判断逻辑**：
- 如果包含"对比"、"vs"、"比较" → 对比表格
- 如果包含"步骤"、"流程"、"教程" → 流程图
- 如果包含明显数据（百分比、数字、指标） → 数据卡片

### 步骤2：提取关键信息

**对比表格需要提取**：
- 对比维度（功能、价格、性能等）
- 对比对象（产品A、产品B）
- 具体数据或描述

**流程图需要提取**：
- 步骤标题
- 步骤描述
- 步骤顺序

**数据卡片需要提取**：
- 数据数值（如：90%、5倍、10分钟）
- 数据标签（如：效率提升、成本节省）
- 数据说明（如：相比传统方式）

### 步骤3：生成HTML文件

**执行步骤**：
1、选择合适的HTML模板
2、用提取的数据填充模板
3、保存为HTML文件（文件名格式：`infographic_主题_时间戳.html`）
4、保存位置：当前文章同目录下

### 步骤4：使用Playwright截图

**执行步骤**：
1、使用Playwright MCP打开HTML文件
   ```
   使用playwright打开 file:///C:/Users/.../infographic_xxx.html
   ```

2、调整浏览器窗口大小（可选）
   ```
   调整窗口为 800x600
   ```

3、截图保存
   ```
   截图保存为 infographic_xxx.png
   ```

### 步骤5：插入到文章

**插入位置**：
- 数据密集段落后
- 对比说明段落后
- 文章末尾（总结处）

**Markdown格式**：
```markdown
![信息图：主题描述](infographic_xxx.png)
```

---

## 四、信息图质量标准

### 视觉效果
- ✅ 色彩搭配和谐（使用渐变色）
- ✅ 字体清晰易读（16px以上）
- ✅ 布局简洁不拥挤
- ✅ 背景与内容对比度足够

### 信息呈现
- ✅ 数据准确无误
- ✅ 重点突出（用颜色或字重）
- ✅ 信息完整（包含数据来源和时间）
- ✅ 逻辑清晰（流程顺序、对比维度合理）

### 技术规范
- ✅ HTML代码规范
- ✅ CSS样式完整
- ✅ 响应式设计（适配不同屏幕）
- ✅ 截图清晰（分辨率足够）

---

## 五、信息图生成示例

### 示例1：Claude Code vs Cursor对比

**文章主题**：Claude Code vs Cursor 深度对比

**信息图类型**：对比表格

**提取数据**：
```
对比维度：价格、功能数量、AI模型、上手难度、适用场景
Claude Code：$20/月、15个、Claude 3.5、简单、快速开发
Cursor：$20/月、20个、GPT-4/Claude、中等、复杂项目
```

**生成HTML**：使用对比表格模板，填充数据

**Playwright截图**：保存为 `infographic_claude_vs_cursor.png`

**插入文章**：
```markdown
## 两者详细对比

经过老金我一周的深度使用，整理了这份对比表：

![Claude Code vs Cursor详细对比](infographic_claude_vs_cursor.png)

从表格能看出...
```

---

### 示例2：MCP配置流程

**文章主题**：Claude Code MCP服务器配置教程

**信息图类型**：流程图

**提取步骤**：
```
步骤1：获取API Key - 访问官网注册账号
步骤2：配置.mcp.json - 在项目根目录创建配置文件
步骤3：重启Claude Code - 使配置生效
步骤4：验证MCP - 输入/mcp查看已加载的服务器
```

**生成HTML**：使用流程图模板，填充步骤

**Playwright截图**：保存为 `infographic_mcp_setup_flow.png`

**插入文章**：
```markdown
## 配置流程

整个配置流程很简单，老金我画了个流程图：

![MCP配置流程图](infographic_mcp_setup_flow.png)

按照这4步走，10分钟搞定...
```

---

### 示例3：效率提升数据

**文章主题**：用Claude Code一周后的真实体验

**信息图类型**：数据卡片

**提取数据**：
```
效率提升：80% (相比手写代码)
时间节省：每天2小时
代码质量：提升40%
Bug减少：60%
```

**生成HTML**：使用数据卡片模板，填充数据

**Playwright截图**：保存为 `infographic_efficiency_data.png`

**插入文章**：
```markdown
## 真实数据说话

老金我统计了一周的使用数据，效果惊人：

![效率提升数据一览](infographic_efficiency_data.png)

这些数据不是吹的，是老金我实打实测出来的...
```

---

## 六、自动信息图执行指令

### 当接收到"生成信息图"指令时：

**执行步骤**：

1、**检测文章类型**
   - 读取文章内容
   - 判断是否适合生成信息图
   - 确定信息图类型（对比表格/流程图/数据卡片）

2、**提取关键信息**
   - 根据信息图类型提取对应数据
   - 验证数据完整性
   - 整理数据结构

3、**生成HTML文件**
   - 选择合适模板
   - 填充提取的数据
   - 保存HTML文件到文章同目录

4、**Playwright截图**
   - 打开HTML文件
   - 调整窗口大小（可选）
   - 截图保存为PNG

5、**插入到文章**
   - 确定插入位置
   - 使用Edit工具插入图片
   - Markdown格式：`![描述](图片路径)`

6、**输出信息图报告**
   - 信息图类型
   - HTML文件路径
   - PNG文件路径
   - 插入位置

---

## 七、常见问题处理

### Q1: 如何判断是否需要生成信息图？

**判断标准**：
- 文章包含明显的对比内容？
- 文章包含步骤流程？
- 文章包含关键数据？
- 文章字数 > 1000字？

**如果以上任一条件满足，建议生成信息图。**

### Q2: 信息图太大怎么办？

**解决方案**：
- 减少对比维度（只保留核心3-5个）
- 减少步骤数量（合并相似步骤）
- 减少数据卡片数量（只展示最关键的3-4个数据）

### Q3: Playwright截图失败怎么办？

**可能原因**：
1、HTML文件路径错误
2、浏览器未安装
3、文件权限问题

**解决方案**：
1、检查HTML文件路径是否正确（使用绝对路径）
2、安装Playwright浏览器：`npx playwright install chromium`
3、检查文件权限

### Q4: 如何确保信息图风格统一？

**方案**：
- 使用固定的3个模板
- 使用统一的配色方案（渐变色系列）
- 使用统一的字体和字号
- 使用统一的圆角和阴影效果

---

**记住：信息图的目的是让复杂信息一目了然，不是炫技！简洁、清晰、准确最重要！**
