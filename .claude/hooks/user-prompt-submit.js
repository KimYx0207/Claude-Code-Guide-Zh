#!/usr/bin/env node
/**
 * 提示词自动优化Hook - 跨平台版本 (Node.js)
 *
 * 支持 Windows/Mac/Linux，无需额外依赖
 *
 * 工作流程：
 * 1. 用户输入提示词
 * 2. Hook优化
 * 3. 返回优化后的提示词给Claude
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// 跨平台临时目录
const LOG_FILE = path.join(os.tmpdir(), 'hook-prompt-optimizer.log');

/**
 * 记录日志
 */
function log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    try {
        fs.appendFileSync(LOG_FILE, logEntry);
    } catch (e) {
        // 忽略日志错误
    }
}

/**
 * 读取优化提示词模板
 */
function readOptimizerTemplate() {
    // 获取脚本目录并找到模板
    const scriptDir = __dirname;
    const claudeDir = path.dirname(scriptDir);
    const templatePath = path.join(claudeDir, 'prompt-optimizer-meta.md');

    // 备选：检查用户主目录
    const homeTemplatePath = path.join(os.homedir(), '.claude', 'prompt-optimizer-meta.md');

    if (fs.existsSync(templatePath)) {
        return fs.readFileSync(templatePath, 'utf8');
    } else if (fs.existsSync(homeTemplatePath)) {
        log(`模板文件未在 ${templatePath} 找到，使用主目录版本`);
        return fs.readFileSync(homeTemplatePath, 'utf8');
    } else {
        log(`错误：模板文件未找到：${templatePath} 或 ${homeTemplatePath}`);
        return null;
    }
}

/**
 * 检查输入是否应该被过滤（不优化）
 */
function shouldFilter(input) {
    // 简单交互式回复 - 不需要优化
    const simpleResponses = [
        '好的', '是的', '继续', '谢谢', 'ok', 'OK', 'yes', 'YES',
        'no', 'NO', '确认', '取消', '好', '行', '可以', '不', '嗯',
        'y', 'n', 'Y', 'N'
    ];

    const trimmed = input.trim();

    // 精确匹配简单回复
    if (simpleResponses.includes(trimmed)) {
        log('检测到简单回复，跳过优化');
        return true;
    }

    // 太短（< 10字符）
    if (trimmed.length < 10) {
        log(`输入太短 (${trimmed.length} < 10)，跳过优化`);
        return true;
    }

    // 斜杠命令 - 不优化
    if (trimmed.startsWith('/')) {
        log('检测到斜杠命令，跳过优化');
        return true;
    }

    return false;
}

/**
 * 构建优化请求
 */
function buildOptimizationRequest(template, userInput) {
    return `${template}

---

## 用户原始输入

${userInput}

---

请严格按照格式输出优化结果，最后必须包含完整的优化后提示词。

**重要**：输出优化结果后，立即执行"优化后的完整提示词"中描述的任务，不要等待用户确认。`;
}

/**
 * 主函数
 */
async function main() {
    log('========================================');
    log('Hook执行开始');

    // 从stdin读取输入
    let userInput = '';

    // 检查是否通过参数运行
    if (process.argv.length > 2) {
        userInput = process.argv.slice(2).join(' ');
    } else {
        // 从stdin读取
        userInput = fs.readFileSync(0, 'utf8');
    }

    userInput = userInput.trim();
    log(`用户输入: ${userInput.substring(0, 100)}...`);
    log(`输入长度: ${userInput.length}`);

    // 检查是否需要过滤
    if (shouldFilter(userInput)) {
        process.stdout.write(userInput);
        return;
    }

    log('通过过滤，开始优化...');

    // 读取模板
    const template = readOptimizerTemplate();
    if (!template) {
        log('模板未找到，返回原始输入');
        process.stdout.write(userInput);
        return;
    }

    // 构建并输出优化请求
    const optimizationRequest = buildOptimizationRequest(template, userInput);

    log('优化请求已构建，输出中...');
    process.stdout.write(optimizationRequest);
}

// 运行
main().catch(err => {
    // 出错时返回原始输入
    const fs = require('fs');
    const input = process.argv.length > 2
        ? process.argv.slice(2).join(' ')
        : fs.readFileSync(0, 'utf8');
    process.stdout.write(input.trim());
});
