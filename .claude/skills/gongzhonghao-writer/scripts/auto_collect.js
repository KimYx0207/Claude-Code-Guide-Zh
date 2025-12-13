/**
 * 全自动数据收集脚本
 * 通过 Playwright 直接从当前浏览器页面提取数据
 *
 * 使用方法：
 * 1. 用户在浏览器中打开微信公众号"发表记录"页面
 * 2. Claude Code 运行此脚本自动提取数据
 * 3. 无需任何手动操作！
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function autoCollect(options = {}) {
  const {
    cdpUrl = 'http://localhost:9222',
    days = 7,
    maxPages = 3,
    outputDir = path.resolve(__dirname, '../../../../data/temp')
  } = options;

  let browser;

  try {
    console.log('\n' + '='.repeat(60));
    console.log('全自动数据收集开始');
    console.log('='.repeat(60));

    // 连接到现有浏览器（CDP）
    console.log('\n[Step 1] 连接到浏览器...');

    try {
      browser = await chromium.connectOverCDP(cdpUrl);
      console.log('[OK] 成功连接到浏览器');
    } catch (error) {
      console.error('[ERROR] 无法连接到浏览器');
      console.error('请确保浏览器已启动远程调试模式');
      console.error('启动命令：');
      console.error('  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222');
      return { success: false, error: '浏览器连接失败' };
    }

    // 查找微信公众号页面
    console.log('\n[Step 2] 查找微信公众号页面...');
    const contexts = browser.contexts();
    if (contexts.length === 0) {
      throw new Error('没有浏览器上下文');
    }

    const pages = contexts[0].pages();
    let wechatPage = null;

    for (const page of pages) {
      const url = page.url();
      if (url.includes('mp.weixin.qq.com') && url.includes('freepublish')) {
        wechatPage = page;
        console.log('[OK] 找到微信公众号页面');
        console.log(`     URL: ${url}`);
        break;
      }
    }

    if (!wechatPage) {
      throw new Error('未找到微信公众号"发表记录"页面，请先在浏览器中打开');
    }

    // 创建输出目录
    const tempDir = path.resolve(__dirname, outputDir);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // 提取当前页面数据
    console.log('\n[Step 3] 提取页面数据...');

    const extractedData = await wechatPage.evaluate(() => {
      const articles = [];

      // 查找所有文章项
      const items = document.querySelectorAll('[class*="appmsg"], [class*="freepublish"]');

      items.forEach(item => {
        try {
          // 提取文本内容
          const text = item.innerText || item.textContent;
          if (text && text.trim()) {
            articles.push(text.trim());
          }
        } catch (e) {
          // 跳过错误项
        }
      });

      return articles;
    });

    console.log(`[OK] 提取到 ${extractedData.length} 个数据项`);

    // 获取页面快照（accessibility tree）
    console.log('\n[Step 4] 获取页面结构快照...');

    const snapshot = await wechatPage.accessibility.snapshot();

    // 将 snapshot 转换为文本格式
    function snapshotToText(node, indent = 0) {
      let text = '';

      if (node.role && node.name) {
        text += ' '.repeat(indent * 2);
        text += `${node.role} "${node.name}"\n`;
      }

      if (node.children) {
        for (const child of node.children) {
          text += snapshotToText(child, indent + 1);
        }
      }

      return text;
    }

    const snapshotText = snapshotToText(snapshot);

    // 保存快照到文件
    const outputFile = path.join(tempDir, 'page1_snapshot.txt');
    fs.writeFileSync(outputFile, snapshotText, 'utf-8');

    console.log(`[OK] 快照已保存: ${outputFile}`);
    console.log(`[OK] 文件大小: ${(snapshotText.length / 1024).toFixed(2)} KB`);

    // 简单解析验证
    const lines = snapshotText.split('\n');
    const titleLines = lines.filter(line =>
      line.includes('StaticText') &&
      line.length > 50 &&
      !line.includes('已发表') &&
      !line.includes('原创')
    );

    console.log(`[OK] 检测到约 ${titleLines.length} 篇文章标题`);

    await browser.close();

    console.log('\n' + '='.repeat(60));
    console.log('[SUCCESS] 全自动数据收集完成！');
    console.log('='.repeat(60));
    console.log(`\n下一步：运行 Python 脚本解析数据`);
    console.log(`cd .claude/skills/gongzhonghao-writer/scripts`);
    console.log(`python collect_time_range.py --days=${days}`);
    console.log('');

    return {
      success: true,
      outputFile,
      articleCount: titleLines.length
    };

  } catch (error) {
    console.error('\n[ERROR] 收集失败:', error.message);

    if (browser) {
      await browser.close();
    }

    return {
      success: false,
      error: error.message
    };
  }
}

// 命令行运行
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};

  // 解析命令行参数
  args.forEach(arg => {
    if (arg.startsWith('--days=')) {
      options.days = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--max-pages=')) {
      options.maxPages = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--cdp=')) {
      options.cdpUrl = arg.split('=')[1];
    }
  });

  autoCollect(options).then(result => {
    if (!result.success) {
      process.exit(1);
    }
  });
}

module.exports = { autoCollect };
