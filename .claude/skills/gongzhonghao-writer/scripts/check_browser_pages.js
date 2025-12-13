const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const contexts = browser.contexts();

    if (contexts.length === 0) {
      console.log('没有浏览器上下文');
      await browser.close();
      return;
    }

    const pages = contexts[0].pages();
    console.log(`总共 ${pages.length} 个页面\n`);

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const url = page.url();
      const title = await page.title();
      console.log(`页面 ${i}:`);
      console.log(`  标题: ${title}`);
      console.log(`  URL: ${url}\n`);
    }

    await browser.close();
  } catch (error) {
    console.error('错误:', error.message);
  }
})();
