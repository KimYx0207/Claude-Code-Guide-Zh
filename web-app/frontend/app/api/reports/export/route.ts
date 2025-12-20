/**
 * 导出报告API - 批量质检结果导出
 * 支持Markdown格式导出
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { summary } = await request.json();

    if (!summary) {
      return NextResponse.json({
        success: false,
        error: '请提供汇总数据'
      }, { status: 400 });
    }

    // 生成Markdown格式报告
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const fileName = `批量质检报告_${timestamp}.md`;

    const markdown = `# 批量质检汇总报告

**生成时间**：${new Date().toLocaleString('zh-CN')}

---

## 📊 统计概览

| 指标 | 数值 |
|------|------|
| 总文章数 | ${summary.total}篇 |
| ✅ 通过 | ${summary.passed}篇 (${Math.round(summary.passed / summary.total * 100)}%) |
| ⚠️ 警告 | ${summary.warning}篇 (${Math.round(summary.warning / summary.total * 100)}%) |
| ❌ 不通过 | ${summary.failed}篇 (${Math.round(summary.failed / summary.total * 100)}%) |

---

## 🔴 优先修改建议

${summary.priorityFixes && summary.priorityFixes.length > 0
  ? summary.priorityFixes.map((article: any, idx: number) => `
### ${idx + 1}. ${article.title}

- **评分**：${article.totalScore}分
- **状态**：${article.status === 'failed' ? '❌ 不通过' : '⚠️ 警告'}
- **关键问题**：${article.criticalIssues.length > 0 ? article.criticalIssues.join('、') : '需要改进'}
`).join('\n')
  : '暂无需要优先修改的文章'
}

---

## 📋 详细质检结果

${summary.results && summary.results.length > 0
  ? summary.results.map((article: any, idx: number) => `
### ${idx + 1}. ${article.title}

- **评分**：${article.totalScore}分
- **状态**：${article.isPassed ? '✅ 通过' : article.status === 'warning' ? '⚠️ 警告' : '❌ 不通过'}
- **问题**：${article.criticalIssues.length > 0 ? article.criticalIssues.join('、') : '无'}
`).join('\n')
  : '无数据'
}

---

## 💡 改进建议

${summary.failed > 0 || summary.warning > 0
  ? `
1. **优先修改不通过的${summary.failed}篇文章**
2. **注意警告文章的${summary.warning}篇，建议优化后再发布**
3. **重点关注**：AI腔过高、内容啰嗦、重复内容等问题
`
  : '所有文章质量良好，可以直接发布！'
}

---

**报告说明**：
- 通过标准：总分 ≥ 70分
- 警告标准：60分 ≤ 总分 < 70分
- 不通过：总分 < 60分

**生成工具**：公众号写作助手 Web版 V9.0
`;

    return NextResponse.json({
      success: true,
      message: '报告生成成功',
      data: {
        fileName,
        content: markdown,
        format: 'markdown',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('导出报告API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message || '导出报告失败'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: false,
    error: '请使用POST方法并提供汇总数据'
  }, { status: 405 });
}
