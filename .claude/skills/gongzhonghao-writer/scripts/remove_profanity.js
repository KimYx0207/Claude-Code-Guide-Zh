const fs = require('fs');
const path = require('path');

/**
 * 自动检测并移除文章中的脏话
 * 用法：node remove_profanity.js [文章路径]
 */

// 脏话检测规则（零容忍）
const PROFANITY_PATTERNS = [
  { regex: /\btm\b/gi, replacement: '真的' },           // tm → 真的
  { regex: /艹/g, replacement: '真是' },                // 艹 → 真是
  { regex: /乖乖/g, replacement: '真是' },              // 乖乖 → 真是
  { regex: /操(?!控|作)/g, replacement: '' },          // 操（非"操控"/"操作"）→ 删除
  { regex: /煞笔|傻笔/g, replacement: '' },             // 煞笔/傻笔 → 删除
  { regex: /憨批/g, replacement: '' },                 // 憨批 → 删除
  { regex: /\bSB\b|\bsb\b/g, replacement: '' },        // SB/sb → 删除
  { regex: /妈的|他妈|尼玛|你妈/g, replacement: '' },    // 各种"妈" → 删除
  { regex: /卧槽|我擦|我靠/g, replacement: '真是' },     // 轻微脏话 → 真是
];

// 读取文章内容
function readArticle(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(`❌ 读取文件失败: ${error.message}`);
    process.exit(1);
  }
}

// 检测脏话
function detectProfanity(content) {
  const results = [];
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    PROFANITY_PATTERNS.forEach(({ regex }) => {
      const matches = line.match(regex);
      if (matches) {
        results.push({
          line: index + 1,
          content: line.trim(),
          matches: matches,
        });
      }
    });
  });

  return results;
}

// 移除脏话
function removeProfanity(content) {
  let cleaned = content;
  let totalReplacements = 0;

  PROFANITY_PATTERNS.forEach(({ regex, replacement }) => {
    const matches = cleaned.match(regex);
    if (matches) {
      totalReplacements += matches.length;
      cleaned = cleaned.replace(regex, replacement);

      console.log(`  ✓ 替换 "${matches[0]}" → "${replacement}" (${matches.length}处)`);
    }
  });

  // 清理多余空格
  cleaned = cleaned.replace(/\s{2,}/g, ' ');

  return { cleaned, totalReplacements };
}

// 主函数
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('❌ 请提供文章路径');
    console.error('用法: node remove_profanity.js [文章路径]');
    process.exit(1);
  }

  const filePath = args[0];

  if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在: ${filePath}`);
    process.exit(1);
  }

  console.log(`\n========================================`);
  console.log(`脏话检测与移除工具`);
  console.log(`========================================\n`);
  console.log(`文章路径: ${filePath}\n`);

  // 读取文章
  const content = readArticle(filePath);

  // 检测脏话
  console.log(`【1/3】检测脏话...\n`);
  const detections = detectProfanity(content);

  if (detections.length === 0) {
    console.log('✅ 未检测到脏话，文章符合规范！');
    console.log(`\n========================================\n`);
    process.exit(0);
  }

  // 输出检测结果
  console.log(`❌ 检测到 ${detections.length} 处脏话:\n`);
  detections.forEach((detection) => {
    console.log(`  第 ${detection.line} 行: ${detection.content}`);
    console.log(`  匹配: ${detection.matches.join(', ')}\n`);
  });

  // 移除脏话
  console.log(`【2/3】自动移除脏话...\n`);
  const { cleaned, totalReplacements } = removeProfanity(content);

  console.log(`\n✓ 共替换 ${totalReplacements} 处脏话\n`);

  // 保存修改后的文章
  console.log(`【3/3】保存修改后的文章...\n`);

  try {
    fs.writeFileSync(filePath, cleaned, 'utf-8');
    console.log(`✅ 文章已保存: ${filePath}`);
    console.log(`\n========================================`);
    console.log(`脏话清理完成！`);
    console.log(`========================================\n`);
  } catch (error) {
    console.error(`❌ 保存文件失败: ${error.message}`);
    process.exit(1);
  }
}

main();
