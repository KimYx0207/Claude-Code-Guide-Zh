const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * 连接到用户现有的Chrome浏览器进行数据收集
 *
 * 前置条件：
 * 1. 用户已在Chrome中登录微信公众号后台
 * 2. 用户已打开"发表记录"页面
 * 3. Chrome已启用远程调试（详见说明）
 *
 * 启动Chrome远程调试的方法：
 * Windows:
 *   "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
 *
 * Mac:
 *   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
 */

async function main() {
  let browser;

  try {
    console.log('\n' + '='.repeat(60));
    console.log('连接到现有Chrome浏览器');
    console.log('='.repeat(60));

    // 连接到现有Chrome实例
    console.log('\n[Step 1] 尝试连接到 Chrome (localhost:9222)...');

    try {
      browser = await chromium.connectOverCDP('http://localhost:9222');
      console.log('[OK] 成功连接到Chrome浏览器');
    } catch (error) {
      console.error('\n[ERROR] 无法连接到Chrome浏览器');
      console.error('错误信息:', error.message);
      console.log('\n请按以下步骤操作：');
      console.log('1. 关闭所有Chrome窗口');
      console.log('2. 在命令行运行以下命令启动Chrome：');
      console.log('   Windows:');
      console.log('   "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222');
      console.log('\n   Mac:');
      console.log('   /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222');
      console.log('\n3. 在Chrome中登录微信公众号后台');
      console.log('4. 打开"发表记录"页面');
      console.log('5. 重新运行此脚本');
      process.exit(1);
    }

    // 获取所有上下文和页面
    const contexts = browser.contexts();
    console.log(`[OK] 找到 ${contexts.length} 个浏览器上下文`);

    if (contexts.length === 0) {
      console.error('[ERROR] 没有浏览器上下文');
      process.exit(1);
    }

    const pages = contexts[0].pages();
    console.log(`[OK] 找到 ${pages.length} 个标签页\n`);

    // 查找公众号页面
    let wechatPage = null;
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const url = page.url();
      const title = await page.title();

      console.log(`页面 ${i + 1}:`);
      console.log(`  标题: ${title}`);
      console.log(`  URL: ${url}`);

      if (url.includes('mp.weixin.qq.com') && url.includes('freepublish')) {
        wechatPage = page;
        console.log(`  [找到公众号页面]`);
      }
      console.log('');
    }

    if (!wechatPage) {
      console.error('[ERROR] 未找到微信公众号"发表记录"页面');
      console.error('请在Chrome中打开微信公众号后台 > 发表记录页面');
      process.exit(1);
    }

    console.log('[Step 2] 开始收集数据...\n');

    // 等待页面加载
    await wechatPage.waitForTimeout(2000);

    // 获取当前页面的accessibility snapshot
    const snapshot = await wechatPage.accessibility.snapshot();

    // 保存snapshot到文件
    const tempDir = path.join(__dirname, '../../../../data/temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const snapshotFile = path.join(tempDir, 'page1_snapshot.txt');

    // 将snapshot转换为文本
    function snapshotToText(node, indent = 0) {
      let text = '';
      if (node.role && node.name) {
        text += ' '.repeat(indent) + `${node.role} "${node.name}"\n`;
      }
      if (node.children) {
        for (const child of node.children) {
          text += snapshotToText(child, indent + 2);
        }
      }
      return text;
    }

    const snapshotText = snapshotToText(snapshot);
    fs.writeFileSync(snapshotFile, snapshotText, 'utf-8');

    console.log(`[OK] 已保存第1页数据到: ${snapshotFile}`);
    console.log(`[OK] 数据大小: ${(snapshotText.length / 1024).toFixed(2)} KB\n`);

    console.log('[Step 3] 询问是否继续收集下一页...\n');
    console.log('请选择操作：');
    console.log('1. 手动点击"下一页"，然后按Enter继续收集');
    console.log('2. 按Ctrl+C结束收集\n');

    // 等待用户操作
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', async (key) => {
      if (key[0] === 3) { // Ctrl+C
        console.log('\n[STOP] 用户终止收集');
        await browser.close();
        process.exit(0);
      } else if (key[0] === 13) { // Enter
        console.log('\n[INFO] 收集下一页功能已由MCP自动实现');
        console.log('[INFO] 请使用 /data-collect 命令进行自动收集');
        await browser.close();
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('[ERROR] 发生错误:', error.message);
    console.error(error.stack);

    if (browser) {
      await browser.close();
    }
    process.exit(1);
  }
}

main();
