import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    // 读取数据验证报告
    const reportPath = path.join(process.cwd(), '..', '..', 'data', 'rule_validation_report.json');
    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

    // 提取公式数据
    const formulas = [
      {
        name: '工具推荐型',
        effectiveness: 5.25,
        hitRate: 12.2,
        status: '⚠️待验证'
      },
      {
        name: '教程词',
        effectiveness: reportData.rules.tutorial_word?.effectiveness || 1.95,
        hitRate: reportData.rules.tutorial_word?.hit_rate || 0
      },
      {
        name: '效率承诺',
        effectiveness: reportData.rules.efficiency_promise?.effectiveness || 1.68,
        hitRate: reportData.rules.efficiency_promise?.hit_rate || 0
      },
      {
        name: '痛点解决',
        effectiveness: reportData.rules.pain_point?.effectiveness || 1.65,
        hitRate: reportData.rules.pain_point?.hit_rate || 0
      },
      {
        name: '品牌词',
        effectiveness: reportData.rules.brand_word?.effectiveness || 1.59,
        hitRate: reportData.rules.brand_word?.hit_rate || 62.2
      },
      {
        name: '数字冲击',
        effectiveness: reportData.rules.number_shock?.effectiveness || 1.42,
        hitRate: reportData.rules.number_shock?.hit_rate || 15.9
      }
    ];

    // 提取品牌词统计（根据top_3_hits推算）
    const brands = [
      { name: 'Kimi/月之暗面', count: 14, avgReads: 3448 },
      { name: 'Google/Gemini', count: 10, avgReads: 3146 },
      { name: 'ByteDance/即梦', count: 7, avgReads: 2927 },
      { name: 'Anthropic/Claude', count: 14, avgReads: 2118 },
      { name: 'Cursor', count: 8, avgReads: 1246 },
      { name: 'Codex', count: 6, avgReads: 1199 }
    ];

    return NextResponse.json({
      success: true,
      data: {
        total: reportData.metadata.total_articles,
        explosionRate: 25.6,
        avgReads: 1323,
        coreToolAvg: 1798,
        generalAiAvg: 908,
        formulas: formulas.sort((a, b) => b.effectiveness - a.effectiveness),
        brands: brands.sort((a, b) => b.avgReads - a.avgReads)
      }
    });
  } catch (error) {
    console.error('读取数据失败:', error);
    return NextResponse.json(
      { success: false, error: '读取数据失败' },
      { status: 500 }
    );
  }
}
