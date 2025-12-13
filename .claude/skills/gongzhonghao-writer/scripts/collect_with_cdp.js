/**
 * 使用CDP连接现有Chrome并收集微信公众号数据
 *
 * 前置条件：
 * 1. Chrome已启动调试模式 (--remote-debugging-port=9222)
 * 2. 已在Chrome中登录微信公众号后台
 * 3. 已打开"发表记录"页面
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function collectWithCDP() {
  let browser;

  try {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 通过CDP连接现有Chrome');
    console.log('='.repeat(60));

    // 连接到现有Chrome实例
    console.log('\n[Step 1] 连接到Chrome (端口9222)...');

    browser = await chromium.connectOverCDP('http://localhost:9222');
    console.log('[OK] 成功连接到Chrome');

    // 获取所有上下文和页面
    const contexts = browser.contexts();
    console.log(`[OK] 找到 ${contexts.length} 个浏览器上下文`);

    let wechatPage = null;

    // 遍历所有上下文查找微信公众号页面
    for (const context of contexts) {
      const pages = context.pages();

      for (const page of pages) {
        const url = page.url();
        console.log(`  检查页面: ${url.substring(0, 60)}...`);

        if (url.includes('mp.weixin.qq.com') && url.includes('appmsgpublish')) {
          wechatPage = page;
          console.log('[OK] ✅ 找到微信公众号"发表记录"页面');
          break;
        }
      }

      if (wechatPage) break;
    }

    if (!wechatPage) {
      console.error('\n[ERROR] 未找到微信公众号"发表记录"页面');
      console.error('请手动操作：');
      console.error('  1. 在Chrome中打开: https://mp.weixin.qq.com/cgi-bin/appmsgpublish?sub=list&begin=0&count=10');
      console.error('  2. 确保已登录并看到文章列表');
      console.error('  3. 然后重新运行此脚本');
      return { success: false, error: '未找到目标页面' };
    }

    // 提取页面可见文本
    console.log('\n[Step 2] 提取页面内容...');

    const pageText = await wechatPage.evaluate(() => {
      return document.body.innerText;
    });

    console.log(`[OK] 提取到 ${pageText.length} 个字符`);

    // 保存到临时文件
    const outputDir = path.resolve(__dirname, '../../../../data/temp');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.join(outputDir, 'page1_snapshot.txt');
    fs.writeFileSync(outputFile, pageText, 'utf-8');

    console.log(`[OK] 数据已保存: ${outputFile}`);
    console.log(`[OK] 文件大小: ${(pageText.length / 1024).toFixed(2)} KB`);

    // 简单验证数据
    const lines = pageText.split('\n');
    const titleLines = lines.filter(line =>
      line.length > 15 &&
      !line.includes('已发表') &&
      !line.includes('原创') &&
      !line.includes('Copyright')
    );

    console.log(`[OK] 检测到约 ${titleLines.length} 条可能的文章标题`);

    console.log('\n' + '='.repeat(60));
    console.log('✅ 数据收集完成！');
    console.log('='.repeat(60));
    console.log(`\n📁 数据文件: ${outputFile}`);
    console.log(`\n下一步: 运行Python脚本解析数据`);
    console.log(`  cd .claude/skills/gongzhonghao-writer/scripts`);
    console.log(`  python collect_time_range.py --days=7`);
    console.log('');

    return {
      success: true,
      outputFile,
      dataSize: pageText.length,
      estimatedArticles: titleLines.length
    };

  } catch (error) {
    console.error('\n[ERROR] 收集失败:', error.message);

    if (error.message.includes('connect ECONNREFUSED')) {
      console.error('\n原因: 无法连接到Chrome调试端口9222');
      console.error('解决方法:');
      console.error('  1. 运行: .claude/skills/gongzhonghao-writer/scripts/start_chrome_cdp.bat');
      console.error('  2. 或手动启动: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" --remote-debugging-port=9222');
    }

    return {
      success: false,
      error: error.message
    };
  } finally {
    // 注意: 不要关闭browser,因为这是用户的Chrome实例
    // if (browser) {
    //   await browser.close();
    // }
  }
}

// 命令行运行
if (require.main === module) {
  collectWithCDP().then(result => {
    if (!result.success) {
      process.exit(1);
    }
  });
}

module.exports = { collectWithCDP };
