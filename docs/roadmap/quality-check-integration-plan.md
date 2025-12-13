# 写作流程质检缺失问题分析报告

**分析日期**: 2025-12-13
**问题提出者**: 用户
**分析者**: Claude Opus 4.5（老金）

---

## 问题描述

用户发现两个问题：
1. **写作流程中没有质检步骤**（Web GUI）
2. **首页文章列表缺少"一键质检全部"功能**

---

## 📊 现状分析

### ✅ CLI命令（/write）- 有质检

从`01-write.md`文件分析：

**完整流程（8步）**：
```
步骤0：选题过滤（推荐执行）
步骤1：读取爆款规律文档
步骤2：智能判断是否需要research
步骤3：深度Research（如需要）
步骤4：自动创作文章
步骤5：自动生成爆款标题
步骤6：自动保存
步骤7：✅ 自动质量检测（必须执行） ← 有质检！
步骤8：后续优化建议
```

**步骤7质量检测内容**：
```bash
cd ".claude/skills/gongzhonghao-writer/scripts" && python quality_detector.py "{文章路径}"
```

**输出9维度报告**：
- AI腔检测、自然度、真诚度、啰嗦度、重复度、可读性、人味儿指数、情感真实性、脏话检测

**结论**：CLI命令有完整质检，且是强制步骤

---

### ❌ Web GUI（/write页面）- 缺少质检

从`web-app/frontend/app/write/page.tsx`分析：

**当前流程（仅3步）**：
```
1. 输入主题（write/page.tsx）
2. 选择标题（write/select-title）
3. 编辑文章（write/editor）
```

**缺失内容**：
- ❌ 没有步骤4：质量检测
- ❌ 没有自动调用quality_detector.py
- ❌ 没有9维度评分展示

**结论**：Web GUI写作流程**确实缺少质检步骤**！

---

### ❌ 首页文章管理 - 缺少批量质检

从`web-app/frontend/app/page.tsx`的`ArticlesView`分析：

**当前功能**：
```tsx
function ArticlesView() {
  return (
    <div>
      <h2>文章管理</h2>
      {[1, 2, 3].map((i) => (
        <div key={i} className="card p-6">
          <h3>文章标题 {i}</h3>
          <p>草稿 · 2025-12-12 · 3200字</p>
        </div>
      ))}
    </div>
  );
}
```

**缺失功能**：
- ❌ 没有"一键质检全部"按钮
- ❌ 没有单篇文章的"质检"操作按钮
- ❌ 没有质检结果展示（通过/不通过）
- ❌ 没有批量操作选择框

**结论**：首页文章管理**确实缺少批量质检功能**！

---

## 🎯 改进方案设计

### 方案1：写作流程增加第4步质检

**目标**：写作→标题→编辑→**质检**→保存发布

**界面设计**：
```
步骤流程指示器：
[1.输入主题] → [2.选择标题] → [3.编辑文章] → [4.质量检测] → [保存发布]
```

**实现要点**：
1. 创建`write/quality-check`页面
2. 编辑完成后自动跳转到质检
3. 质检通过后显示"保存发布"按钮
4. 质检不通过则显示"返回编辑"按钮

---

### 方案2：首页增加批量质检功能

**目标**：文章列表一键批量质检

**界面设计**：
```
┌─────────────────────────────────────┐
│ 📚 文章管理                          │
│ [全选] [一键质检全部] [导出]        │
├─────────────────────────────────────┤
│ □ 2025-12-12_核心_热点_Cursor...    │
│   草稿 · 3200字 · [编辑][质检][删除]│
│   质检状态: ⚠️ 未检测              │
├─────────────────────────────────────┤
│ □ 2025-12-09_核心_常青_Claude...    │
│   已发布 · 2800字 · [查看][质检]    │
│   质检状态: ✅ 通过（82分）         │
└─────────────────────────────────────┘
```

**批量质检流程**：
1. 用户点击"全选"勾选所有文章
2. 点击"一键质检全部"按钮
3. 显示进度：正在检测 1/10...
4. 检测完成后显示汇总报告：
   - ✅ 通过：8篇
   - ⚠️ 警告：1篇（啰嗦度25分）
   - ❌ 不通过：1篇（AI腔35分）
5. 点击每篇文章查看详细9维度报告

---

## 🛠️ 技术实现计划

### 任务1：创建质检API接口

**文件**：`web-app/backend/api/quality/check.ts`

**功能**：
- 接收文章内容或文件路径
- 调用Python脚本`quality_detector.py`
- 返回9维度评分+建议

**接口设计**：
```typescript
POST /api/quality/check
Body: {
  content?: string,  // 文章内容（直接检测）
  filePath?: string  // 或文件路径（读取后检测）
}

Response: {
  success: boolean,
  data: {
    scores: {
      ai_tone: number,      // AI腔检测
      naturalness: number,  // 自然度
      sincerity: number,    // 真诚度
      verbosity: number,    // 啰嗦度
      repetition: number,   // 重复度
      readability: number,  // 可读性
      humanity: number,     // 人味儿指数
      emotion: number,      // 情感真实性
      profanity: number     // 脏话检测
    },
    totalScore: number,
    isPassed: boolean,
    suggestions: string[]
  }
}
```

---

### 任务2：实现写作页面第4步质检

**文件**：`web-app/frontend/app/write/quality-check/page.tsx`（新建）

**功能**：
- 从URL参数读取文章内容
- 自动调用质检API
- 显示9维度评分表
- 通过/不通过判断

**页面结构**：
```tsx
export default function QualityCheckPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 自动检测
    checkQuality(articleContent);
  }, []);

  return (
    <div>
      <h1>第4步：质量检测</h1>

      {loading && <Spinner />}

      {result && (
        <>
          <ScoreCard scores={result.scores} />

          {result.isPassed ? (
            <Button onClick={saveAndPublish}>
              ✅ 质检通过，保存发布
            </Button>
          ) : (
            <>
              <Alert variant="warning">
                ⚠️ 质检未通过，建议修改后再发布
              </Alert>
              <Button onClick={backToEdit}>
                返回编辑
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
}
```

---

### 任务3：实现首页批量质检功能

**文件**：`web-app/frontend/app/page.tsx`（修改ArticlesView）

**新增功能**：
1. 文章列表增加复选框
2. 顶部增加"全选"和"一键质检全部"按钮
3. 每篇文章显示质检状态
4. 批量质检进度条
5. 汇总报告弹窗

**代码框架**：
```tsx
function ArticlesView() {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [batchCheckProgress, setBatchCheckProgress] = useState(0);

  const handleBatchCheck = async () => {
    const selectedArticles = Array.from(selected);
    let checked = 0;

    for (const articleId of selectedArticles) {
      await checkArticle(articleId);
      checked++;
      setBatchCheckProgress((checked / selectedArticles.length) * 100);
    }

    showSummaryDialog();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Checkbox onChange={handleSelectAll}>全选</Checkbox>
        <Button onClick={handleBatchCheck} disabled={selected.size === 0}>
          一键质检全部（{selected.size}篇）
        </Button>
      </div>

      {/* 文章列表 */}
      {articles.map(article => (
        <ArticleCard
          article={article}
          selected={selected.has(article.id)}
          onSelect={(id) => toggleSelect(id)}
          onCheck={() => checkSingleArticle(article.id)}
        />
      ))}

      {/* 批量质检进度 */}
      {batchCheckProgress > 0 && (
        <ProgressBar value={batchCheckProgress} />
      )}
    </div>
  );
}
```

---

## 📋 详细任务清单

### ✅ 已完成
- [x] 分析当前写作流程质检集成情况
- [x] 发现问题：CLI有质检，Web GUI缺失

### 🔄 进行中
- [ ] 设计写作流程质检集成方案（本报告）
- [ ] 设计首页批量质检功能（本报告）

### ⏳ 待执行
1. **后端开发**（6小时）：
   - [ ] 创建`/api/quality/check`接口
   - [ ] 集成Python脚本`quality_detector.py`
   - [ ] 测试9维度评分返回

2. **前端开发 - 写作流程**（4小时）：
   - [ ] 创建`write/quality-check/page.tsx`
   - [ ] 修改`write/editor/page.tsx`，添加"下一步：质检"按钮
   - [ ] 实现自动跳转到质检页面
   - [ ] 实现质检结果展示（9维度评分卡）

3. **前端开发 - 首页批量质检**（8小时）：
   - [ ] 修改`ArticlesView`，添加复选框
   - [ ] 实现"全选"/"反选"功能
   - [ ] 实现"一键质检全部"按钮
   - [ ] 实现批量质检进度条
   - [ ] 实现汇总报告弹窗
   - [ ] 每篇文章显示质检状态标签

4. **测试验证**（2小时）：
   - [ ] 完整写作流程测试（输入→标题→编辑→质检→发布）
   - [ ] 批量质检测试（选择5篇文章一键质检）
   - [ ] 边界情况测试（质检不通过、API失败）

5. **文档更新**（1小时）：
   - [ ] 更新README，添加质检功能说明
   - [ ] 更新P0修复清单，添加质检集成任务
   - [ ] 生成用户使用指南

---

## 🎯 优先级建议

**立即执行（P0级）**：
- 任务1：创建质检API接口（写作流程和批量质检都需要）
- 任务2：实现写作页面第4步质检（解决用户问题1）

**本周执行（P0级）**：
- 任务3：实现首页批量质检（解决用户问题2）
- 任务4：测试验证

**本周完成（P1级）**：
- 任务5：文档更新

---

## 💡 设计亮点

### 亮点1：智能质检流程

**写作流程自动质检**：
1. 用户在编辑器完成文章
2. 点击"下一步"自动跳转质检页面
3. 质检自动执行（无需手动触发）
4. 质检通过→显示"保存发布"按钮
5. 质检不通过→显示"返回编辑"按钮+改进建议

**优势**：
- 强制质检，避免低质量文章发布
- 自动化流程，无需手动操作
- 改进建议明确，用户知道如何修改

---

### 亮点2：批量质检汇总报告

**批量质检完成后显示**：
```
╔════════════════════════════════════╗
║  批量质检汇总报告（10篇文章）       ║
╠════════════════════════════════════╣
║  ✅ 通过：8篇（80%）               ║
║  ⚠️  警告：1篇（啰嗦度25分）       ║
║  ❌ 不通过：1篇（AI腔35分）        ║
╠════════════════════════════════════╣
║  建议优先修改：                    ║
║  1. 文章X - AI腔过高（35分>20分） ║
║  2. 文章Y - 啰嗦度警告（25分）    ║
╚════════════════════════════════════╝

[查看详细报告] [导出Excel]
```

**优势**：
- 一目了然看到所有文章质量状况
- 优先级排序，先修改问题最严重的
- 支持导出Excel，方便团队协作

---

### 亮点3：质检状态实时显示

**文章列表每篇显示质检标签**：
```
┌─────────────────────────────────────┐
│ □ 2025-12-12_核心_热点_Cursor...    │
│   草稿 · 3200字 · [编辑][质检][删除]│
│   📊 质检: ⚠️ 未检测              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ □ 2025-12-09_核心_常青_Claude...    │
│   已发布 · 2800字 · [查看][质检]    │
│   📊 质检: ✅ 通过（82分）         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ □ 2025-12-08_泛AI_常青_AI...       │
│   草稿 · 1500字 · [编辑][质检][删除]│
│   📊 质检: ❌ 不通过（AI腔35分）   │
└─────────────────────────────────────┘
```

**优势**：
- 一眼看出哪些文章需要修改
- 历史文章也可以重新质检
- 质检结果持久化存储

---

## 📊 数据库设计（支持质检结果存储）

**新增表：article_quality_checks**

```sql
CREATE TABLE article_quality_checks (
    id INTEGER PRIMARY KEY,
    article_id TEXT,              -- 文章ID或文件名
    check_date DATETIME,          -- 检测时间
    ai_tone_score INTEGER,        -- AI腔检测
    naturalness_score INTEGER,    -- 自然度
    sincerity_score INTEGER,      -- 真诚度
    verbosity_score INTEGER,      -- 啰嗦度
    repetition_score INTEGER,     -- 重复度
    readability_score INTEGER,    -- 可读性
    humanity_score INTEGER,       -- 人味儿指数
    emotion_score INTEGER,        -- 情感真实性
    profanity_count INTEGER,      -- 脏话数量
    total_score INTEGER,          -- 总分
    is_passed BOOLEAN,            -- 是否通过
    suggestions TEXT              -- JSON格式改进建议
);
```

**索引**：
```sql
CREATE INDEX idx_article_id ON article_quality_checks(article_id);
CREATE INDEX idx_check_date ON article_quality_checks(check_date);
CREATE INDEX idx_is_passed ON article_quality_checks(is_passed);
```

---

## 🔧 技术实现细节

### API接口实现（后端）

**文件**：`web-app/backend/api/quality/check.ts`

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  const { content, filePath } = await request.json();

  try {
    // 调用Python脚本
    const scriptPath = path.join(
      process.cwd(),
      '..',
      '..',
      '.claude',
      'skills',
      'gongzhonghao-writer',
      'scripts',
      'core',
      'quality_detector.py'
    );

    const command = filePath
      ? `python "${scriptPath}" "${filePath}"`
      : `echo "${content}" | python "${scriptPath}" -`;

    const { stdout } = await execAsync(command);
    const result = JSON.parse(stdout);

    return Response.json({
      success: true,
      data: result
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

---

### 批量质检API

**文件**：`web-app/backend/api/quality/batch-check.ts`

```typescript
export async function POST(request: Request) {
  const { articleIds } = await request.json();

  const results = [];
  for (const articleId of articleIds) {
    const result = await checkArticleQuality(articleId);
    results.push({
      articleId,
      ...result
    });
  }

  // 生成汇总报告
  const summary = {
    total: results.length,
    passed: results.filter(r => r.isPassed).length,
    warning: results.filter(r => !r.isPassed && r.totalScore >= 60).length,
    failed: results.filter(r => r.totalScore < 60).length,
    results
  };

  return Response.json({
    success: true,
    data: summary
  });
}
```

---

## 📈 预期收益

| 改进项 | 改进前 | 改进后 | 提升幅度 |
|--------|--------|--------|---------|
| 写作流程完整性 | 3步（缺少质检） | 4步（包含质检） | +33% |
| 质量保障 | 手动运行CLI | 自动强制质检 | 100% |
| 批量处理效率 | 逐篇手动质检 | 一键批量质检 | 10倍+ |
| 用户体验 | 易遗漏质检步骤 | 强制质检+可视化反馈 | +80% |

---

## 🎯 验收标准

### 写作流程质检集成
- [ ] 编辑完成后自动跳转质检页面
- [ ] 质检自动执行，显示9维度评分
- [ ] 质检通过显示"保存发布"按钮
- [ ] 质检不通过显示改进建议
- [ ] 整个流程4步全部自动化

### 首页批量质检
- [ ] 文章列表有复选框
- [ ] "全选"/"反选"功能正常
- [ ] "一键质检全部"按钮可用
- [ ] 批量质检进度条实时更新
- [ ] 汇总报告准确（通过/警告/不通过数量）
- [ ] 点击文章查看详细9维度报告

---

**分析结论**：用户的发现完全正确！Web GUI确实缺少质检步骤，需要立即补充。

**优先级**：🔴 P0级（影响核心质量保障体系）

**建议**：立即开始执行任务1（创建质检API），然后并行执行任务2和任务3。

---

**报告版本**: V1.0
**分析日期**: 2025-12-13
**下一步**: 开始实现质检API接口
