# 配图规则

## 一、自动判断是否需要配图（AUTOMATED）

根据文章字数自动判断：

```javascript
// 自动判断逻辑
if (wordCount < 1500) {
  requiredImages = 1-2;
} else if (wordCount < 3000) {
  requiredImages = 2-3;
} else {
  requiredImages = 3-5;
}
```

**触发条件**：
- 文章保存后自动检测字数
- 自动计算需要多少张配图
- 自动运行图片搜索脚本

---

## 二、搜索图片（3种方法）

### 方法1：Google图片搜索自动化（推荐）⭐

使用Playwright自动化搜索Google图片并智能选择：

**核心优势**：
- 自动化搜索多个关键词
- 智能评分筛选最佳图片
- 高质量、无水印、主题相关
- 完全自动化，无需手动操作

**完整脚本**（保存为`simple_google_images.js`）：

```javascript
const { chromium } = require('playwright');
const fs = require('fs');

async function simpleGoogleImages() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // 多角度关键词（中英文混合）
  const keywords = [
    'deepfake AI fraud detection high quality',
    'artificial intelligence cybersecurity threat professional',
    'face recognition security danger technology'
  ];

  const allImages = [];

  for (const keyword of keywords) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&tbm=isch&tbs=isz:l`;
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // 滚动加载更多图片
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await page.waitForTimeout(800);
    }

    // 从页面源代码提取图片URL
    const pageContent = await page.content();
    const urlMatches = pageContent.match(/https:\/\/[^"'\s<>]+\.(jpg|jpeg|png|webp)/gi);

    if (urlMatches) {
      const filtered = urlMatches
        .filter(url =>
          !url.includes('google.com') &&
          !url.includes('gstatic.com') &&
          !url.includes('encrypted-tbn') &&
          !url.includes('_thumb') &&
          url.length > 50
        )
        .filter((url, index, self) => self.indexOf(url) === index);

      filtered.slice(0, 10).forEach(url => {
        allImages.push({ src: url, keyword: keyword });
      });
    }
  }

  await browser.close();

  // 去重
  const uniqueImages = Array.from(new Map(allImages.map(img => [img.src, img])).values());

  // 智能评分
  const scored = uniqueImages.map(img => {
    let score = 50;
    const url = img.src.toLowerCase();

    // 来源评分
    if (url.includes('medium.com') || url.includes('forbes.com')) score += 20;
    else if (url.includes('cdn') || url.includes('cloudfront')) score += 15;

    // 主题相关性
    if (img.keyword.includes('deepfake')) score += 15;
    if (img.keyword.includes('security')) score += 10;

    // URL质量
    if (url.length > 100) score += 10;

    return { ...img, score };
  });

  // 返回前3张
  const best = scored.sort((a, b) => b.score - a.score).slice(0, 3);

  fs.writeFileSync('selected_images.json', JSON.stringify(best, null, 2));
  return best;
}

simpleGoogleImages();
```

**使用方法**：
```bash
node simple_google_images.js
```

**优点**：
- 图片质量高（搜索限制大尺寸）
- 主题精准匹配
- 来源可靠（CDN、专业网站）
- 完全自动化

---

### 方法2：中文图片搜索（如需纯图片或中文）⭐

使用Playwright专门搜索中文配图或纯视觉化图片：

**核心优势**：
- 优先搜索中文关键词
- 避免英文文字图片
- 专注纯视觉化内容
- 完全自动化

**完整脚本**（保存为`search_chinese_images.js`）：

```javascript
const { chromium } = require('playwright');
const fs = require('fs');

async function searchChineseImages() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // 关键词（优先中文，或者视觉化的英文词）
  const keywords = [
    'AI换脸 诈骗',
    '人脸识别 安全',
    '网络诈骗 防范',
    'deepfake visualization',
    'AI face swap security',
    'cyber fraud prevention',
    'facial recognition danger'
  ];

  const allImages = [];

  for (const keyword of keywords) {
    try {
      console.log(`\n正在搜索: "${keyword}"`);

      // Google图片搜索，限制大尺寸
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&tbm=isch&tbs=isz:l`;
      await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(3000);

      // 滚动加载更多
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await page.waitForTimeout(800);
      }

      // 提取图片URL
      const pageContent = await page.content();
      const urlMatches = pageContent.match(/https:\/\/[^"'\s<>]+\.(jpg|jpeg|png|webp)/gi);

      if (urlMatches) {
        const filtered = urlMatches
          .filter(url => {
            const urlLower = url.toLowerCase();
            return !urlLower.includes('google.com') &&
                   !urlLower.includes('gstatic.com') &&
                   !urlLower.includes('encrypted-tbn') &&
                   !urlLower.includes('_thumb') &&
                   !urlLower.includes('logo') &&
                   !urlLower.includes('icon') &&
                   !urlLower.includes('avatar') &&
                   !urlLower.includes('96x96') &&
                   !urlLower.includes('text') &&  // 排除明显的文字图
                   !urlLower.includes('title') &&
                   url.length > 50;
          })
          .filter((url, index, self) => self.indexOf(url) === index);

        console.log(`找到 ${filtered.length} 个有效URL`);

        filtered.slice(0, 15).forEach((url, i) => {
          allImages.push({ src: url, keyword: keyword });
          if (i < 5) {
            console.log(`  ${i + 1}. ${url.substring(0, 80)}...`);
          }
        });
      }

    } catch (error) {
      console.log(`✗ 搜索失败: ${error.message}`);
    }

    await page.waitForTimeout(2000);
  }

  await browser.close();

  // 去重
  const uniqueImages = Array.from(new Map(allImages.map(img => [img.src, img])).values());

  console.log(`\n\n========================================`);
  console.log(`总共提取 ${uniqueImages.length} 张去重后的图片`);
  console.log(`========================================`);

  // 智能评分（优先纯图片）
  const scored = uniqueImages.map(img => {
    let score = 60;  // 基础分
    const url = img.src.toLowerCase();
    const keyword = img.keyword;

    // 中文关键词加分（更可能是中文图片或纯视觉图片）
    if (/[\u4e00-\u9fa5]/.test(keyword)) {
      score += 20;
    }

    // 来源评分
    if (url.includes('cdn') || url.includes('cloudfront') || url.includes('cloudinary')) {
      score += 15;
    }
    if (url.includes('static') || url.includes('assets')) {
      score += 10;
    }

    // 主题相关性
    if (keyword.includes('AI') || keyword.includes('换脸')) score += 15;
    if (keyword.includes('诈骗') || keyword.includes('fraud')) score += 10;
    if (keyword.includes('安全') || keyword.includes('security')) score += 10;

    // URL质量
    if (url.length > 100) score += 10;

    // 避免明显的英文网站（可能有英文文字）
    if (url.includes('medium.com') || url.includes('forbes.com')) score -= 5;
    if (url.includes('blog') || url.includes('article')) score -= 5;

    return { ...img, score };
  });

  // 按分数排序
  scored.sort((a, b) => b.score - a.score);

  // 取前10张
  const best = scored.slice(0, 10);

  console.log(`\n\n推荐使用（前10张）：`);
  best.forEach((img, i) => {
    console.log(`\n${i + 1}. ${img.src}`);
    console.log(`   关键词: ${img.keyword}`);
    console.log(`   得分: ${img.score}`);
  });

  fs.writeFileSync('chinese_images.json', JSON.stringify(best, null, 2));
  console.log(`\n\n结果已保存到 chinese_images.json`);

  return best;
}

searchChineseImages().catch(console.error);
```

**使用方法**：
```bash
node search_chinese_images.js
```

**优点**：
- 优先中文关键词（AI换脸、人脸识别等）
- 过滤英文文字图片
- 专注纯视觉化内容
- 评分系统优先中文网站

---

### 方法3：从新闻网站爬取真实配图

使用Playwright爬取参考来源网站的配图：

async function scrapeNewsImages(urls) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const allImages = [];

  for (const url of urls) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

      const images = await page.$$eval('img', imgs =>
        imgs
          .map(img => img.src)
          .filter(src =>
            src &&
            !src.includes('logo') &&
            !src.includes('icon') &&
            !src.includes('avatar') &&
            (src.includes('.jpg') || src.includes('.png') || src.includes('.webp'))
          )
      );

      allImages.push(...images);
      if (allImages.length >= 3) break;
    } catch (error) {
      console.log(`爬取失败: ${error.message}`);
    }
  }

  await browser.close();
  return [...new Set(allImages)].slice(0, 3);
}
```

**优点**：
- 图片与文章主题完全匹配
- 真实新闻配图，可信度高
- 无版权问题（新闻图片）

### 方法3：搜索Unsplash（备选）

```python
mcp__mcp-router__search_images(query="英文关键词", per_page=5, orientation="landscape")
```

**关键词技巧**：
- 用英文：`workflow automation` 比 `工作流自动化` 效果好
- 抽象化：`technology abstract` / `digital innovation`
- 组合词：`developer coding laptop`

**注意**：如果工具不可用，优先使用方法1（Playwright爬取）

## 二、处理URL

### Unsplash图片URL（如果使用方法2）

**输入**（搜索返回的原始URL）：
```
https://images.unsplash.com/photo-{ID}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=xxx...&w=1080
```

**输出**（处理后的干净URL）：
```
https://images.unsplash.com/photo-{ID}?w=800
```

**规则**：保留 `photo-{ID}`，删除 `?` 后所有参数，只加 `?w=800`

### 新闻网站图片URL（如果使用方法1）

**直接使用爬取到的URL，无需处理**

例如：
```
https://s.secrss.com/anquanneican/30917dde027b9077496aadef1fea8cd4.jpg
```

## 三、Markdown格式

```markdown
![](URL)
```

**规则**：
- alt文字留空（方括号内不写字）
- 不加图片说明/署名
- 图片上下各空一行

## 四、数量

| 文章字数 | 配图数量 |
|---------|---------|
| <1500字 | 1-2张 |
| 1500-3000字 | 2-3张 |
| >3000字 | 3-5张 |

## 五、位置

- 标题后（封面）
- 章节开头
- 对比/数据段落

## 六、完整示例

**搜索**：
```python
mcp__mcp-router__search_images(query="workflow automation platform", per_page=5, orientation="landscape")
```

**返回结果提取**：
```
🔗 Image URL: https://images.unsplash.com/photo-1505238680356-667803448bb6?crop=entropy&cs=tinysrgb...
```

**处理成干净URL**：
```
https://images.unsplash.com/photo-1505238680356-667803448bb6?w=800
```

**插入文章**：
```markdown
## 章节标题

![](https://images.unsplash.com/photo-1505238680356-667803448bb6?w=800)

正文内容...
```

## 七、搜索优先级（CRITICAL）⭐

**自动选择策略**：

1、**Google图片搜索**（默认首选）
   - 高质量、无水印
   - 适合：技术类、数据类、国际化主题

2、**中文图片搜索**（如需纯图或中文）
   - 优先中文关键词
   - 避免英文文字
   - 适合：中国本土事件、需要中文元素的主题

3、**新闻网站爬取**（备选）
   - 主题精准匹配
   - 需要检查水印

**自动判断逻辑**：
```javascript
// 根据文章主题自动选择
if (主题包含中文专有名词 || 需要避免英文) {
  优先使用: search_chinese_images.js
} else {
  优先使用: simple_google_images.js
}

// 如果前两种方法都失败
fallback: scrape_news_images.js
```

---

## 八、完整自动化流程（END-TO-END）

```
┌─────────────────────────────────────────┐
│ 1. 文章保存后，自动检测字数              │
├─────────────────────────────────────────┤
│ 2. 计算需要配图数量（1-5张）            │
├─────────────────────────────────────────┤
│ 3. 判断文章主题，选择搜索方法            │
│    - 中文主题 → search_chinese_images   │
│    - 国际主题 → simple_google_images    │
├─────────────────────────────────────────┤
│ 4. 运行自动化脚本，提取高分图片          │
├─────────────────────────────────────────┤
│ 5. 自动插入文章（封面+章节）            │
├─────────────────────────────────────────┤
│ 6. 验证图片质量（无水印、主题匹配）      │
└─────────────────────────────────────────┘
```

**零手动干预原则**：
- ✅ 自动检测字数
- ✅ 自动选择方法
- ✅ 自动搜索评分
- ✅ 自动插入文章
- ❌ 不需要用户手动选图
- ❌ 不需要用户替换图片

---

## 九、禁止事项

- ❌ `![描述文字](URL)` - alt会显示出来
- ❌ 图片下加 `Photo by xxx` - 多余
- ❌ URL带一堆参数 - 渲染会乱码
- ❌ 每段都配图 - 喧宾夺主
- ❌ 硬凑配图 - 宁缺毋滥
- ❌ **使用带水印的图片** - 必须过滤
- ❌ **手动选图** - 必须全自动化
