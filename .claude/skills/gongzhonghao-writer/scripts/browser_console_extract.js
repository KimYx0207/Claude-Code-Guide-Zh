/**
 * 在微信公众号后台浏览器控制台中运行此脚本
 * 用于提取"发表记录"页面的文章数据
 *
 * 使用方法：
 * 1. 在Chrome中打开微信公众号后台 > 发表记录
 * 2. 按F12打开开发者工具
 * 3. 切换到Console标签
 * 4. 粘贴此脚本并按Enter运行
 * 5. 复制输出结果
 */

(function extractWeChatArticles() {
  console.log('开始提取微信公众号文章数据...\n');

  const articles = [];

  // 查找所有文章项
  const articleItems = document.querySelectorAll('.appmsg-item, .media-item, [class*="article"], [class*="freepublish"]');

  console.log(`找到 ${articleItems.length} 个可能的文章元素\n`);

  articleItems.forEach((item, index) => {
    try {
      // 提取发布时间
      const timeEl = item.querySelector('[class*="time"], .publish-time, .create-time');
      const publishTime = timeEl ? timeEl.textContent.trim() : '';

      // 提取标题
      const titleEl = item.querySelector('[class*="title"], .appmsg-title, h3, h4');
      const title = titleEl ? titleEl.textContent.trim() : '';

      // 提取阅读数
      const readEl = item.querySelector('[class*="read"], [class*="view"]');
      const readCount = readEl ? parseInt(readEl.textContent.replace(/[^0-9]/g, '') || '0') : 0;

      // 提取点赞数
      const likeEl = item.querySelector('[class*="like"], [class*="praise"]');
      const likeCount = likeEl ? parseInt(likeEl.textContent.replace(/[^0-9]/g, '') || '0') : 0;

      // 提取在看数
      const lookEl = item.querySelector('[class*="look"], [class*="share"]');
      const lookCount = lookEl ? parseInt(lookEl.textContent.replace(/[^0-9]/g, '') || '0') : 0;

      if (title && publishTime) {
        const article = {
          publishTime,
          title,
          readCount,
          likeCount,
          lookCount
        };

        articles.push(article);

        console.log(`[${index + 1}] ${publishTime}`);
        console.log(`    ${title}`);
        console.log(`    阅读:${readCount} 点赞:${likeCount} 在看:${lookCount}\n`);
      }
    } catch (e) {
      console.warn(`解析第${index + 1}个元素失败:`, e.message);
    }
  });

  console.log(`\n总计提取 ${articles.length} 篇文章\n`);
  console.log('=' .repeat(60));
  console.log('以下是格式化输出（可直接复制）:');
  console.log('=' .repeat(60) + '\n');

  // 生成简化文本格式（与Python解析器兼容）
  let output = '';
  articles.forEach(article => {
    output += `${article.publishTime}\n`;
    output += `已发表\n`;
    output += `${article.title}\n`;
    output += `原创\n`;
    output += `${article.readCount} ${article.likeCount} ${article.lookCount} 0 0 0 ¥0.00 0\n`;
    output += `\n`;
  });

  console.log(output);
  console.log('=' .repeat(60));

  // 复制到剪贴板
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(output).then(() => {
      console.log('\n✅ 数据已自动复制到剪贴板！');
      console.log('请直接粘贴到 data/temp/page1_snapshot.txt');
    }).catch(err => {
      console.warn('\n⚠️ 自动复制失败，请手动复制上面的输出');
    });
  } else {
    console.log('\n请手动复制上面的输出');
  }

  return articles;
})();
