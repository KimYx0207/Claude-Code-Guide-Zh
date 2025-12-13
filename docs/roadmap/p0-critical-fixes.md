# P0级关键修复清单

**优先级**: 🔴 最高 - 必须在2周内完成
**更新日期**: 2025-12-13
**来源**: 多专家并行评估报告

---

## 执行原则

1. **立即行动**：P0问题直接影响产品可用性和数据可靠性，不能拖延
2. **验收标准**：每个任务必须有明确的完成标准和测试方法
3. **风险控制**：改动前先备份，改动后立即测试
4. **进度汇报**：每完成1项立即更新此文档

---

## P0-1: 停止使用"工具推荐型5.25x"作为硬性指导 ⚠️

**提出专家**: 数据分析师
**问题严重性**: ⭐⭐⭐⭐⭐ 致命数据风险

### 问题描述
"工具推荐型5.25x"基于n=1的单样本（唯一命中文章阅读6599），统计上不可信，可能是噪声而非真实效应。继续使用会误导决策。

### 改进方案
1. 在`prompts/baokuan-rules.md`添加警告标注
2. 更新`scripts/title_generator.py`注释
3. 命令输出添加"样本量警告"

### 具体执行步骤

**Step 1**: 更新规范文档
```markdown
# prompts/baokuan-rules.md (修改)

## 工具推荐型公式 ⚠️ 待验证假设

- **effectiveness**: 5.25x
- **样本量**: ⚠️ **仅1次命中** - 统计上不可靠
- **状态**: 待验证假设（需≥10篇样本后再正式纳入）
- **警告**: 当前效果基于单样本，可能是噪声
```

**Step 2**: 更新脚本注释
```python
# scripts/title_generator.py (修改)

class TitleFormula:
    # 工具推荐型公式
    # ⚠️ 警告: 当前基于n=1样本，统计不可靠
    # 需要积累≥10篇命中样本后再验证
    effectiveness = 5.25  # 待验证
```

**Step 3**: 命令输出添加警告
```python
# 在生成标题时输出警告
if formula.name == "工具推荐型":
    print("⚠️ 注意: 该公式基于少量样本(n=1)，建议谨慎使用")
```

### 验收标准
- [ ] `prompts/baokuan-rules.md`已添加警告标注
- [ ] `scripts/title_generator.py`已更新注释
- [ ] 运行`/title-gen`命令时输出警告信息
- [ ] Git commit: "refactor: 标记工具推荐型公式为待验证假设 (P0-1)"

### 预期收益
避免虚假确定性误导决策，为后续数据积累提供明确方向

---

## P0-2: 开发Web GUI界面 🖥️

**提出专家**: 产品经理、内容运营专家
**问题严重性**: ⭐⭐⭐⭐⭐ 致命易用性缺陷

### 问题描述
命令行+Python+Git Bash门槛拦截99%公众号创作者，实际使用率<1%（仅3篇文章产出）

### 改进方案
使用Streamlit/Gradio构建本地Web界面，隐藏命令行复杂度

### 具体执行步骤

**Step 1**: 技术选型
```bash
# 方案A: Streamlit (推荐)
pip install streamlit

# 方案B: Gradio
pip install gradio
```

**Step 2**: 创建Web应用入口
```python
# web-app/app.py (新建)
import streamlit as st
from pathlib import Path

st.set_page_config(
    page_title="公众号写作助手",
    page_icon="✍️",
    layout="wide"
)

st.title("✍️ 公众号写作助手")
st.markdown("---")

# 核心3功能
tab1, tab2, tab3 = st.tabs(["📋 选题过滤", "✍️ 一键写作", "✅ 质量检测"])

with tab1:
    st.header("选题过滤器 V3双轨制")
    topic = st.text_input("输入你的选题", placeholder="例如：Claude更新新功能")
    if st.button("判断可行性"):
        # 调用 topic_filter.py
        pass

with tab2:
    st.header("一键写作")
    topic = st.text_input("输入主题", placeholder="例如：Cursor新功能体验")
    if st.button("开始创作"):
        # 调用 write命令
        with st.spinner("正在创作中..."):
            pass

with tab3:
    st.header("质量检测")
    article_file = st.file_uploader("上传文章Markdown文件", type=['md'])
    if st.button("开始检测"):
        # 调用 quality_detector.py
        pass
```

**Step 3**: 集成后端脚本
```python
# web-app/backend/api.py (新建)
from scripts.core.topic_filter import TopicFilter
from scripts.core.title_generator import TitleGenerator
from scripts.core.quality_detector import QualityDetector

def filter_topic(topic: str):
    filter = TopicFilter()
    return filter.filter(topic)

def generate_article(topic: str):
    # 调用完整写作流程
    pass

def check_quality(article_path: str):
    detector = QualityDetector()
    return detector.detect(article_path)
```

**Step 4**: 启动脚本
```bash
# scripts/start_webapp.sh (新建)
#!/bin/bash
cd web-app
streamlit run app.py --server.port 8501
```

### 验收标准
- [ ] Web界面可正常访问（`http://localhost:8501`）
- [ ] 核心3功能（选题过滤/写作/质检）可正常使用
- [ ] 用户无需手动运行Python命令，全程点按钮完成
- [ ] 新用户5分钟内完成首次创作
- [ ] Git commit: "feat: 开发Web GUI界面核心3功能 (P0-2)"

### 预期收益
用户量从<1%扩展到20%有意愿创作者，降低99%的技术门槛

---

## P0-3: 真正使用共享配置 🔧

**提出专家**: 技术架构师
**问题严重性**: ⭐⭐⭐⭐ 严重技术债务

### 问题描述
`config/brands.py`已创建但未被任何脚本引用，品牌词库在4处重复定义（`title_generator.py`、`title_scorer.py`、`topic_filter.py`、`pre_publish_checker.py`）

### 改进方案
所有脚本统一引用`config/brands.py`，删除重复定义

### 具体执行步骤

**Step 1**: 检查当前重复情况
```bash
# 检查重复定义
grep -r "BRAND_WORDS\|CORE_BRANDS\|ACTION_WORDS" scripts/core/*.py
# 预期输出: 14处重复定义
```

**Step 2**: 重构`title_generator.py`
```python
# scripts/core/title_generator.py (修改)

# 删除这些重复定义
# BRAND_WORDS = {...}
# ACTION_WORDS = {...}

# 改为引用共享配置
from config.brands import CORE_BRANDS, ACTION_WORDS

class TitleGenerator:
    def _detect_brand(self, topic: str):
        for brand_name, brand_data in CORE_BRANDS.items():
            if any(kw in topic.lower() for kw in brand_data['keywords']):
                return brand_name
        return None
```

**Step 3**: 重构其他3个脚本
```python
# scripts/core/title_scorer.py (修改)
from config.brands import CORE_BRANDS

# scripts/core/topic_filter.py (修改)
from config.brands import CORE_BRANDS, HOTSPOT_SIGNALS

# scripts/core/pre_publish_checker.py (修改)
from config.brands import CORE_BRANDS
```

**Step 4**: 添加单元测试
```python
# tests/test_config_sync.py (新建)
import pytest
from config.brands import CORE_BRANDS
from scripts.core.title_generator import TitleGenerator

def test_brands_config_used():
    """测试所有脚本都使用共享配置"""
    generator = TitleGenerator()
    # 验证generator使用的品牌词来自CORE_BRANDS
    assert generator.brands == CORE_BRANDS

def test_no_duplicate_definitions():
    """测试脚本中不存在重复定义"""
    import subprocess
    result = subprocess.run(
        ['grep', '-r', 'BRAND_WORDS = {', 'scripts/core/'],
        capture_output=True
    )
    # 不应该找到任何重复定义
    assert result.stdout == b''
```

### 验收标准
- [ ] 运行检查脚本，确认0处重复定义
  ```bash
  grep -r "BRAND_WORDS = {" scripts/core/*.py | wc -l
  # 输出: 0
  ```
- [ ] 单元测试通过
  ```bash
  pytest tests/test_config_sync.py -v
  ```
- [ ] 所有命令正常运行（`/title-gen`、`/title-score`、`/topic-filter`）
- [ ] Git commit: "refactor: 统一使用共享配置，删除4处重复定义 (P0-3)"

### 预期收益
品牌词库只需维护1处（现在4处），数据更新后自动同步，避免不一致

---

## P0-4: 实现会话上下文自动传递 🔗

**提出专家**: UX设计师
**问题严重性**: ⭐⭐⭐⭐ 严重易用性障碍

### 问题描述
跨命令需要手动传递文件路径，例如`/write`生成文章后，运行`/pre-check`必须手动复制粘贴长文件名

### 改进方案
使用环境变量`$LAST_ARTICLE_PATH`自动传递文件路径

### 具体执行步骤

**Step 1**: 创建上下文管理器
```python
# utils/context.py (新建)
import os
from pathlib import Path

class SessionContext:
    """会话上下文管理器"""

    @staticmethod
    def set_last_article(file_path: str):
        """保存最后一篇文章路径"""
        os.environ['LAST_ARTICLE_PATH'] = file_path
        # 同时保存到临时文件
        context_file = Path.home() / '.claude' / 'context.txt'
        context_file.parent.mkdir(exist_ok=True)
        context_file.write_text(file_path)

    @staticmethod
    def get_last_article() -> str:
        """获取最后一篇文章路径"""
        # 优先从环境变量读取
        if 'LAST_ARTICLE_PATH' in os.environ:
            return os.environ['LAST_ARTICLE_PATH']
        # 降级从临时文件读取
        context_file = Path.home() / '.claude' / 'context.txt'
        if context_file.exists():
            return context_file.read_text().strip()
        return None
```

**Step 2**: 修改`/write`命令保存时设置上下文
```python
# commands/core/01-write.md (修改伪代码)

# 步骤8: 保存文章
article_path = save_article(content, title, date)
print(f"✅ 文章已保存: {article_path}")

# 新增: 保存到会话上下文
from utils.context import SessionContext
SessionContext.set_last_article(article_path)

print("\n💡 下一步建议:")
print("  运行 /pre-check 检查是否满足爆款条件")
print("  运行 /image 添加配图")
```

**Step 3**: 修改`/pre-check`命令自动读取上下文
```python
# commands/quality/23-pre-check.md (修改)

# 参数处理
from utils.context import SessionContext

if len(sys.argv) > 1:
    article_path = sys.argv[1]
else:
    # 自动读取上下文
    article_path = SessionContext.get_last_article()
    if not article_path:
        print("❌ 错误: 请先运行 /write 创作文章，或手动指定文章路径")
        sys.exit(1)
    print(f"📂 使用上次创作的文章: {article_path}")
```

### 验收标准
- [ ] 运行`/write [主题]`后，环境变量`$LAST_ARTICLE_PATH`已设置
- [ ] 运行`/pre-check`（无参数）自动读取上下文
- [ ] 跨命令工作流测试通过:
  ```bash
  /write "测试主题"
  /pre-check  # 无需手动输入文件路径
  /image      # 无需手动输入文件路径
  ```
- [ ] Git commit: "feat: 实现会话上下文自动传递文件路径 (P0-4)"

### 预期收益
减少70%手动输入，工作流流畅度提升至85/100

---

## P0-5: 创建交互式新手引导 🚀

**提出专家**: 产品经理
**问题严重性**: ⭐⭐⭐⭐ 严重学习门槛

### 问题描述
新用户面对23个命令、344行文档容易迷失，学习成本1-2小时

### 改进方案
创建`/onboarding`命令，场景选择+首次演示+速记卡

### 具体执行步骤

**Step 1**: 创建引导命令
```markdown
# .claude/commands/00-onboarding.md (新建)

你是新手引导助手，帮助用户快速上手公众号写作助手。

## 执行步骤

### 第1步: 欢迎界面

👋 **欢迎使用公众号写作助手！**

这是一个AI驱动的内容创作工具，帮你：
- ✅ 数据驱动选题（核心工具类平均阅读1798 vs 泛AI话题908）
- ✅ 自动生成爆款标题（5大公式，82篇数据验证）
- ✅ 质量检测（9维度，确保人味儿>70分）

---

### 第2步: 场景选择

请选择你的需求（输入序号）：

1. 💡 **我想快速追热点**
   - 推荐流程：/hotspot → /write-auto
   - 适合：看到热点想立即产出

2. 📝 **我有明确主题想写**
   - 推荐流程：/topic-filter → /write → /pre-check
   - 适合：有清晰选题，想打磨质量

3. ✏️ **我想优化已有文章**
   - 推荐流程：/write-rewrite
   - 适合：内容已有，想提升阅读量

请输入数字选择（1-3）: _____

---

### 第3步: 首次执行演示

根据用户选择，自动运行一次完整流程，生成示例文章。

例如用户选择1（快速追热点）：
1. 运行 `/hotspot` 扫描今日AI热点
2. 选择一个热点，运行 `/write-auto [热点]`
3. 展示生成的文章，解释每个步骤

---

### 第4步: 核心规则速记卡

📋 **速记卡：3分钟掌握核心规则**

**爆款3要素**（必须满足至少2个）：
1. 品牌词：Claude/Cursor/Gemini等核心工具（1.59x）
2. 教程词：手把手/一步步/保姆级（1.95x）
3. 痛点解决：解决明确问题（1.65x）

**9维度质量标准**（必须全部通过）：
- AI腔<20、自然度>80、真诚度>75
- 啰嗦度<25、重复度<15%、可读性>85
- 人味儿>70、情感真实性>75、脏话=0

**双轨制选题**：
- 核心工具类：稳定流量（平均1798）
- 泛AI话题类：破圈潜力（平均908）

---

### 第5步: 下一步行动

✅ **你已经完成首次创作！**

**继续探索**：
- 查看所有命令：/help
- 生成标题：/title-gen [主题]
- 数据分析：/data-collect → /data-analyze

**快捷键**（收藏备用）：
- /w = /write（快速写作）
- /hs = /hotspot（热点扫描）
- /pc = /pre-check（质检）

💡 遇到问题？运行 /help 查看详细指南
```

### 验收标准
- [ ] 运行`/onboarding`命令正常执行
- [ ] 3个场景选择都可正常演示
- [ ] 生成示例文章（演示用）
- [ ] 速记卡内容准确（与最新数据验证结果一致）
- [ ] 用户反馈：新用户15分钟内完成首次创作
- [ ] Git commit: "feat: 创建交互式新手引导 /onboarding (P0-5)"

### 预期收益
新用户15分钟完成首次创作，留存率提升30%+

---

## P0-6: Web GUI质检集成 ✅（2025-12-13已完成）

**提出者**: 用户反馈
**问题严重性**: ⭐⭐⭐⭐ 核心质量保障缺失

### 问题描述
1. Web GUI写作流程只有3步，缺少第4步质检
2. 首页文章管理没有"一键质检全部"功能

### 改进方案
1. 写作流程增加第4步：质量检测
2. 首页增加批量质检功能

### 已完成内容

**后端API（2个文件）**：
- ✅ `web-app/backend/api/quality/check.ts` - 单篇质检API
- ✅ `web-app/backend/api/quality/batch-check.ts` - 批量质检API

**前端页面（2个修改）**：
- ✅ `web-app/frontend/app/write/quality-check/page.tsx` - 质检结果页面
  - 9维度评分卡
  - 总分展示
  - 通过/不通过判断
  - 改进建议列表
- ✅ `web-app/frontend/app/write/editor/page.tsx` - 编辑器跳转逻辑
  - 添加"下一步：质量检测"按钮
  - 更新步骤指示器（显示第4步）
- ✅ `web-app/frontend/app/page.tsx` - 首页批量质检
  - 文章列表复选框
  - "全选"/"一键质检全部"按钮
  - 质检状态标签（未检测/通过/警告/不通过）
  - 批量质检汇总弹窗

### 验收标准
- [x] 写作流程包含4步（输入→标题→编辑→**质检**）
- [x] 编辑完成后可跳转质检页面
- [x] 质检页面显示9维度评分
- [x] 首页有"一键质检全部"按钮
- [x] 批量质检显示汇总报告（通过/警告/不通过）
- [x] 每篇文章显示质检状态标签

### 预期收益
- 质量保障体系Web GUI化，降低使用门槛
- 批量质检效率提升10倍+
- 用户体验从30/100提升至65/100

---

## 进度追踪

| 任务 | 状态 | 开始日期 | 完成日期 | 负责人 | 备注 |
|------|------|---------|---------|--------|------|
| P0-1: 标记5.25x为待验证假设 | ⏳ 进行中 | 2025-12-13 | - | - | - |
| P0-2: 开发Web GUI界面 | ⏳ 进行中 | 2025-12-13 | - | - | - |
| P0-3: 真正使用共享配置 | ⏳ 进行中 | 2025-12-13 | - | - | - |
| P0-4: 会话上下文自动传递 | ⏳ 待开始 | - | - | - | - |
| P0-5: 交互式新手引导 | ⏳ 待开始 | - | - | - | - |
| **P0-6: Web GUI质检集成** | **✅ 已完成** | **2025-12-13** | **2025-12-13** | **Claude Opus 4.5** | **3个API+3个页面** |

---

## 风险提示

1. **回归风险**：改动核心脚本可能导致现有功能失效
   - 缓解措施：改动前先跑完整测试，改动后立即验证

2. **数据同步风险**：多处修改可能导致不一致
   - 缓解措施：P0-3先执行，建立单一数据源

3. **用户迁移风险**：Web GUI推出后，CLI用户可能不适应
   - 缓解措施：保留CLI功能，Web GUI作为可选项

---

**更新频率**：每完成1项任务立即更新此文档
**下次复盘**：2025-12-20（1周后检查P0执行进度）
