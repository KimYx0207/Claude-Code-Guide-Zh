# Skills开发完整指南

**文档版本**: 2.0.0（深度扩充版）
**适用版本**: Claude Code 1.0+
**更新日期**: 2025-12-11
**预计阅读时间**: 90分钟
**文档字数**: 约13,000字

---

## 📚 文档导航

本文档分为六大章节，从入门到精通全面覆盖Skills开发：

- **第一章**: 高级开发技术（多步骤工作流、状态管理、错误恢复）
- **第二章**: Scripts集成（Python开发规范、参数传递、结果解析）
- **第三章**: 领域Skill设计（技术写作、代码审查、数据分析）
- **第四章**: 项目脚本分析（20个核心脚本深度剖析）
- **第五章**: 调试、优化与发布（故障排查、性能优化、发布规范）
- **第六章**: 完整实战案例（从零到一的真实项目案例）

---

## 第一章 高级开发技术

### 1.1 多步骤工作流设计

复杂的Skill通常需要编排多个步骤形成完整的工作流。本节介绍如何设计和实现多步骤工作流。

**工作流设计原则**:

1. **单一职责**: 每个步骤只做一件事
2. **明确输入输出**: 步骤间数据传递清晰
3. **可断点恢复**: 失败后可以从断点继续
4. **可观测**: 每个步骤都有状态反馈

**工作流定义模式**:

```yaml
# 在skill.yaml中定义工作流
workflows:
  write_article:
    name: "文章写作流程"
    steps:
      - id: "topic_filter"
        name: "选题过滤"
        script: "scripts/topic_filter.py"
        input: "{topic}"
        output: "filter_result"

      - id: "research"
        name: "深度Research"
        depends_on: ["topic_filter"]
        condition: "filter_result.worth_writing == true"
        tools: ["WebSearch", "exa", "context7"]
        output: "research_data"

      - id: "generate"
        name: "内容生成"
        depends_on: ["research"]
        prompt: "prompts/laojin-style-v6-natural.md"
        output: "article_content"

      - id: "title_gen"
        name: "标题生成"
        depends_on: ["generate"]
        script: "scripts/title_generator.py"
        args: ["{topic}", "--full"]
        output: "titles"

      - id: "quality_check"
        name: "质量检测"
        depends_on: ["generate"]
        script: "scripts/quality_detector.py"
        input: "article_content"
        output: "quality_score"

      - id: "save"
        name: "保存文章"
        depends_on: ["title_gen", "quality_check"]
        condition: "quality_score.is_passed == true"
        output: "file_path"
```

**实际案例: /write命令的8步工作流**:

```markdown
# 01-write.md 工作流定义

## 执行流程(完全自动)

当用户输入 `/write {主题}` 后,必须**按顺序自动完成**以下步骤:

### 步骤0: 选题过滤(V7.2新增)
1. 检查是否为核心工具类(品牌词匹配)
2. 检查时效性(热点期 vs 常青期)
3. 如涉及具体新产品: 用WebSearch确认发布时间

### 步骤1: 读取爆款规律文档(必须执行)
```
Read(".claude/skills/gongzhonghao-writer/prompts/baokuan-rules.md")
```

### 步骤2: 智能判断(必须执行)
分析主题,判断是否需要research

### 步骤3: 深度Research(如需要)
- 调用至少3个MCP工具
- 找到5个以上实战案例
- 收集3组以上权威数据对比

### 步骤4: 自动创作文章(必须执行)
基于research结果 + 老金风格V6规范

### 步骤5: 自动生成爆款标题(必须执行)
```bash
python title_generator.py "{主题}" --full
```

### 步骤6: 自动保存(必须执行)
文件命名: `YYYY-MM-DD_{主题关键词}_老金风格.md`

### 步骤7: 自动质量检测(必须执行)
```bash
python quality_detector.py "{文章路径}"
```

### 步骤8: 发文前检查清单(必须执行)
5维度检查全部打勾才发布
```

**步骤间依赖管理**:

```
步骤0(选题过滤)
       |
       | worth_writing?
       |
       +---> No ---> 结束,给出建议
       |
       v Yes
步骤1(读取规范)
       |
       v
步骤2(智能判断)
       |
       | need_research?
       |
   +---+---+
   |       |
   v       v
步骤3    跳过
(Research)
   |       |
   +---+---+
       |
       v
步骤4(创作文章)
       |
   +---+---+
   |       |
   v       v
步骤5   步骤7
(标题)  (质量检测)
   |       |
   +---+---+
       |
       v
步骤6(保存) <--- 条件: 质量检测通过
       |
       v
步骤8(发文前检查)
```

### 1.2 状态管理机制

复杂工作流需要在步骤间传递状态,同时支持断点恢复。

**状态类型**:

1. **临时状态**: 仅在当前工作流中有效
2. **持久状态**: 保存到文件,可跨会话使用
3. **全局状态**: 影响整个Skill的行为

**状态存储模式**:

```python
# state_manager.py

import json
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import Dict, Any, Optional
from datetime import datetime


@dataclass
class WorkflowState:
    """工作流状态"""
    workflow_id: str
    current_step: str
    started_at: str
    updated_at: str
    step_results: Dict[str, Any]
    is_completed: bool = False
    error: Optional[str] = None


class StateManager:
    """状态管理器"""

    def __init__(self, state_dir: str = ".claude/skills/cache"):
        self.state_dir = Path(state_dir)
        self.state_dir.mkdir(parents=True, exist_ok=True)

    def create_workflow(self, workflow_id: str) -> WorkflowState:
        """创建新的工作流状态"""
        state = WorkflowState(
            workflow_id=workflow_id,
            current_step="init",
            started_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat(),
            step_results={}
        )
        self._save_state(state)
        return state

    def update_step(
        self,
        workflow_id: str,
        step_id: str,
        result: Any
    ) -> WorkflowState:
        """更新步骤结果"""
        state = self._load_state(workflow_id)
        state.current_step = step_id
        state.updated_at = datetime.now().isoformat()
        state.step_results[step_id] = result
        self._save_state(state)
        return state

    def mark_completed(self, workflow_id: str) -> WorkflowState:
        """标记工作流完成"""
        state = self._load_state(workflow_id)
        state.is_completed = True
        state.updated_at = datetime.now().isoformat()
        self._save_state(state)
        return state

    def mark_failed(self, workflow_id: str, error: str) -> WorkflowState:
        """标记工作流失败"""
        state = self._load_state(workflow_id)
        state.error = error
        state.updated_at = datetime.now().isoformat()
        self._save_state(state)
        return state

    def get_state(self, workflow_id: str) -> Optional[WorkflowState]:
        """获取工作流状态"""
        return self._load_state(workflow_id)

    def can_resume(self, workflow_id: str) -> bool:
        """检查是否可以恢复"""
        state = self._load_state(workflow_id)
        return state is not None and not state.is_completed

    def _state_file(self, workflow_id: str) -> Path:
        return self.state_dir / f"{workflow_id}.json"

    def _save_state(self, state: WorkflowState):
        with open(self._state_file(state.workflow_id), 'w') as f:
            json.dump(asdict(state), f, indent=2, ensure_ascii=False)

    def _load_state(self, workflow_id: str) -> Optional[WorkflowState]:
        path = self._state_file(workflow_id)
        if not path.exists():
            return None
        with open(path) as f:
            data = json.load(f)
            return WorkflowState(**data)
```

**在工作流中使用状态管理**:

```python
# workflow_executor.py

class WorkflowExecutor:
    """工作流执行器"""

    def __init__(self, state_manager: StateManager):
        self.state_manager = state_manager

    def execute(self, workflow_id: str, steps: List[Step], resume: bool = True):
        """执行工作流"""

        # 检查是否可以恢复
        if resume:
            state = self.state_manager.get_state(workflow_id)
            if state and not state.is_completed:
                # 从断点恢复
                start_index = self._find_step_index(
                    steps,
                    state.current_step
                )
                print(f"从步骤 {state.current_step} 恢复执行")
            else:
                state = self.state_manager.create_workflow(workflow_id)
                start_index = 0
        else:
            state = self.state_manager.create_workflow(workflow_id)
            start_index = 0

        # 执行步骤
        for i, step in enumerate(steps[start_index:], start_index):
            try:
                # 检查依赖
                if not self._check_dependencies(step, state):
                    print(f"步骤 {step.id} 依赖未满足,跳过")
                    continue

                # 检查条件
                if not self._check_condition(step, state):
                    print(f"步骤 {step.id} 条件不满足,跳过")
                    continue

                # 执行步骤
                print(f"执行步骤: {step.name}")
                result = step.execute(state.step_results)

                # 更新状态
                state = self.state_manager.update_step(
                    workflow_id,
                    step.id,
                    result
                )

            except Exception as e:
                self.state_manager.mark_failed(workflow_id, str(e))
                raise

        # 标记完成
        self.state_manager.mark_completed(workflow_id)
        return state
```

### 1.3 错误恢复策略

健壮的Skill需要优雅地处理各种错误情况。

**错误分类**:

| 错误类型 | 示例 | 处理策略 |
|---------|------|---------|
| 可恢复错误 | 网络超时 | 自动重试 |
| 可替代错误 | MCP不可用 | 降级到替代方案 |
| 需人工干预 | 配置错误 | 暂停并提示 |
| 致命错误 | 数据损坏 | 终止并报告 |

**重试机制实现**:

```python
# retry.py

import time
from functools import wraps
from typing import Callable, TypeVar, Any

T = TypeVar('T')


def retry(
    max_attempts: int = 3,
    delay: float = 1.0,
    backoff: float = 2.0,
    exceptions: tuple = (Exception,)
) -> Callable:
    """
    重试装饰器

    Args:
        max_attempts: 最大重试次数
        delay: 初始延迟(秒)
        backoff: 退避倍数
        exceptions: 需要重试的异常类型
    """
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        def wrapper(*args, **kwargs) -> T:
            last_exception = None
            current_delay = delay

            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    if attempt < max_attempts - 1:
                        print(f"尝试 {attempt + 1} 失败: {e}")
                        print(f"等待 {current_delay}秒 后重试...")
                        time.sleep(current_delay)
                        current_delay *= backoff

            raise last_exception
        return wrapper
    return decorator


# 使用示例
@retry(max_attempts=3, delay=1.0, exceptions=(TimeoutError, ConnectionError))
def fetch_web_data(url: str) -> dict:
    """获取网页数据,带重试"""
    # 实际的网络请求...
    pass
```

**降级策略实现**:

```python
# fallback.py

from typing import Callable, TypeVar, List, Any

T = TypeVar('T')


class FallbackChain:
    """降级链"""

    def __init__(self):
        self.strategies: List[Callable[..., T]] = []

    def add(self, strategy: Callable[..., T]) -> 'FallbackChain':
        """添加降级策略"""
        self.strategies.append(strategy)
        return self

    def execute(self, *args, **kwargs) -> T:
        """
        执行降级链
        按顺序尝试每个策略,直到成功
        """
        last_exception = None

        for i, strategy in enumerate(self.strategies):
            try:
                print(f"尝试策略 {i + 1}: {strategy.__name__}")
                result = strategy(*args, **kwargs)
                print(f"策略 {strategy.__name__} 成功")
                return result
            except Exception as e:
                last_exception = e
                print(f"策略 {strategy.__name__} 失败: {e}")

        raise RuntimeError(
            f"所有策略都失败,最后错误: {last_exception}"
        )


# 使用示例
def search_with_mcp(query: str) -> dict:
    """使用MCP搜索"""
    # mcp__exa__web_search_exa(query=query)
    pass

def search_with_builtin(query: str) -> dict:
    """使用内置WebSearch"""
    # WebSearch(query=query)
    pass

def search_with_manual(query: str) -> dict:
    """提示用户手动搜索"""
    return {
        "message": f"请手动搜索: {query}",
        "manual": True
    }

# 构建降级链
search_chain = FallbackChain()
search_chain.add(search_with_mcp)
search_chain.add(search_with_builtin)
search_chain.add(search_with_manual)

# 执行
result = search_chain.execute("Claude Code教程")
```

**错误恢复的Command设计**:

```markdown
# 在Command中处理错误恢复

### 步骤3: 深度Research(如需要)

**必须自动调用的工具(优先级排序)**:

#### 优先级1: MCP Router搜索
```
mcp__mcp-router__search(query="{主题}")
```

#### 优先级2: Exa深度搜索
```
如果优先级1失败,使用:
mcp__exa__web_search_exa(query="{主题}")
```

#### 优先级3: 内置工具(备选)
```
如果MCP工具报错或不可用,使用Claude内置工具:
WebSearch(query="{主题}")
```

**⚠️ 重要**:
- 必须真正调用工具,不是展示代码!
- 调用后等待结果返回
- 至少成功调用2个不同的工具
- 如果全部失败,告知用户并询问是否继续
```

### 1.4 工作流编排最佳实践

**1. 使用DAG(有向无环图)表示依赖**

```python
# dag_workflow.py

from dataclasses import dataclass
from typing import Dict, List, Set, Any, Callable


@dataclass
class WorkflowNode:
    """工作流节点"""
    id: str
    name: str
    handler: Callable
    dependencies: List[str] = None

    def __post_init__(self):
        if self.dependencies is None:
            self.dependencies = []


class DAGWorkflow:
    """DAG工作流"""

    def __init__(self):
        self.nodes: Dict[str, WorkflowNode] = {}

    def add_node(self, node: WorkflowNode) -> 'DAGWorkflow':
        self.nodes[node.id] = node
        return self

    def validate(self) -> bool:
        """验证DAG有效性(无环检测)"""
        visited = set()
        rec_stack = set()

        def has_cycle(node_id: str) -> bool:
            visited.add(node_id)
            rec_stack.add(node_id)

            node = self.nodes.get(node_id)
            if node:
                for dep in node.dependencies:
                    if dep not in visited:
                        if has_cycle(dep):
                            return True
                    elif dep in rec_stack:
                        return True

            rec_stack.remove(node_id)
            return False

        for node_id in self.nodes:
            if node_id not in visited:
                if has_cycle(node_id):
                    return False
        return True

    def get_execution_order(self) -> List[str]:
        """获取拓扑排序的执行顺序"""
        in_degree = {node_id: 0 for node_id in self.nodes}

        for node in self.nodes.values():
            for dep in node.dependencies:
                if dep in in_degree:
                    in_degree[node.id] += 1

        queue = [n for n, d in in_degree.items() if d == 0]
        result = []

        while queue:
            node_id = queue.pop(0)
            result.append(node_id)

            for other_id, other_node in self.nodes.items():
                if node_id in other_node.dependencies:
                    in_degree[other_id] -= 1
                    if in_degree[other_id] == 0:
                        queue.append(other_id)

        return result
```

**2. 并行执行优化**

```python
# parallel_executor.py

import asyncio
from typing import List, Dict, Any


async def execute_parallel(
    tasks: List[Dict[str, Any]],
    max_concurrency: int = 3
) -> List[Any]:
    """
    并行执行任务

    Args:
        tasks: 任务列表,每个任务包含handler和args
        max_concurrency: 最大并发数
    """
    semaphore = asyncio.Semaphore(max_concurrency)

    async def run_task(task: Dict[str, Any]) -> Any:
        async with semaphore:
            handler = task['handler']
            args = task.get('args', [])
            kwargs = task.get('kwargs', {})

            if asyncio.iscoroutinefunction(handler):
                return await handler(*args, **kwargs)
            else:
                return handler(*args, **kwargs)

    return await asyncio.gather(*[run_task(t) for t in tasks])
```

### 1.5 工作流可视化与监控

在复杂的多步骤工作流中，实时监控执行状态至关重要。

**执行日志记录器**:

```python
# workflow_logger.py

import json
import time
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any
from enum import Enum


class StepStatus(Enum):
    """步骤状态"""
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    SKIPPED = "skipped"


class WorkflowLogger:
    """工作流执行日志记录器"""

    def __init__(self, workflow_id: str, log_dir: str = ".claude/skills/logs"):
        self.workflow_id = workflow_id
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)

        self.log_file = self.log_dir / f"{workflow_id}_{datetime.now():%Y%m%d_%H%M%S}.json"
        self.execution_log = {
            "workflow_id": workflow_id,
            "started_at": datetime.now().isoformat(),
            "steps": [],
            "status": "running",
            "total_duration": 0
        }

    def log_step_start(self, step_id: str, step_name: str):
        """记录步骤开始"""
        step_log = {
            "step_id": step_id,
            "step_name": step_name,
            "status": StepStatus.RUNNING.value,
            "started_at": datetime.now().isoformat(),
            "ended_at": None,
            "duration": 0,
            "output": None,
            "error": None
        }
        self.execution_log["steps"].append(step_log)
        self._save_log()

    def log_step_end(self, step_id: str, status: StepStatus, output: Any = None, error: str = None):
        """记录步骤结束"""
        for step in self.execution_log["steps"]:
            if step["step_id"] == step_id:
                step["status"] = status.value
                step["ended_at"] = datetime.now().isoformat()

                # 计算持续时间
                start_time = datetime.fromisoformat(step["started_at"])
                end_time = datetime.fromisoformat(step["ended_at"])
                step["duration"] = (end_time - start_time).total_seconds()

                step["output"] = output
                step["error"] = error
                break

        self._save_log()

    def finalize_log(self, final_status: str):
        """完成日志记录"""
        self.execution_log["status"] = final_status
        self.execution_log["ended_at"] = datetime.now().isoformat()

        # 计算总持续时间
        start_time = datetime.fromisoformat(self.execution_log["started_at"])
        end_time = datetime.fromisoformat(self.execution_log["ended_at"])
        self.execution_log["total_duration"] = (end_time - start_time).total_seconds()

        self._save_log()

    def _save_log(self):
        """保存日志到文件"""
        with open(self.log_file, 'w', encoding='utf-8') as f:
            json.dump(self.execution_log, f, indent=2, ensure_ascii=False)

    def generate_summary(self) -> str:
        """生成执行摘要"""
        lines = [
            "=" * 80,
            f"工作流执行报告: {self.workflow_id}",
            "=" * 80,
            "",
            f"开始时间: {self.execution_log['started_at']}",
            f"结束时间: {self.execution_log.get('ended_at', '进行中')}",
            f"总耗时: {self.execution_log['total_duration']:.2f}秒",
            f"状态: {self.execution_log['status']}",
            "",
            "-" * 80,
            "步骤详情:",
            "-" * 80,
        ]

        for i, step in enumerate(self.execution_log["steps"], 1):
            status_icon = {
                "pending": "⏳",
                "running": "🔄",
                "success": "✅",
                "failed": "❌",
                "skipped": "⏭️"
            }.get(step["status"], "❓")

            lines.append(f"{i}. {status_icon} {step['step_name']} ({step['step_id']})")
            lines.append(f"   状态: {step['status']}")
            lines.append(f"   耗时: {step['duration']:.2f}秒")

            if step.get('error'):
                lines.append(f"   错误: {step['error']}")

            lines.append("")

        lines.extend(["", "=" * 80])
        return "\n".join(lines)


# 使用示例
logger = WorkflowLogger("write-article-001")

# 步骤1开始
logger.log_step_start("filter", "选题过滤")
time.sleep(2)  # 模拟执行
logger.log_step_end("filter", StepStatus.SUCCESS, output={"worth_writing": True})

# 步骤2开始
logger.log_step_start("research", "深度Research")
time.sleep(5)  # 模拟执行
logger.log_step_end("research", StepStatus.SUCCESS, output={"sources": 10})

# 完成
logger.finalize_log("completed")
print(logger.generate_summary())
```

📸 **截图位置1**: 显示工作流执行日志的JSON文件结构，展示每个步骤的详细记录。

---

## 第二章 Scripts集成

### 2.1 Python脚本开发规范

Python是Skills脚本开发的首选语言,本节介绍完整的开发规范。

**脚本模板**:

```python
# -*- coding: utf-8 -*-
"""
脚本名称 V版本号 - 简短描述

详细功能说明...

版本历史:
- V1.0.0 (2025-01-01): 初始版本
- V1.1.0 (2025-01-15): 新增XX功能

数据版本: rule_validation_report.json V7.1 (日期)
"""

import sys
import io
import json
import re
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field, asdict
from enum import Enum


# ==================================================
# 数据类定义
# ==================================================

class ResultStatus(Enum):
    """结果状态枚举"""
    SUCCESS = "success"
    PARTIAL = "partial"
    FAILED = "failed"


@dataclass
class ProcessResult:
    """处理结果数据类"""
    status: ResultStatus
    data: Dict[str, Any] = field(default_factory=dict)
    message: str = ""
    errors: List[str] = field(default_factory=list)


# ==================================================
# 核心处理类
# ==================================================

class Processor:
    """
    处理器类

    负责XX功能的核心实现
    """

    # 类级常量
    DEFAULT_CONFIG = {
        "threshold": 0.8,
        "max_items": 10
    }

    def __init__(self, config_path: Optional[str] = None):
        """
        初始化处理器

        Args:
            config_path: 配置文件路径,None则使用默认配置
        """
        self.config = self._load_config(config_path)

    def _load_config(self, config_path: Optional[str]) -> Dict:
        """加载配置"""
        if config_path and Path(config_path).exists():
            with open(config_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return self.DEFAULT_CONFIG.copy()

    def process(self, input_data: str) -> ProcessResult:
        """
        处理输入数据

        Args:
            input_data: 输入数据

        Returns:
            ProcessResult: 处理结果
        """
        try:
            # 1. 验证输入
            if not input_data or not input_data.strip():
                return ProcessResult(
                    status=ResultStatus.FAILED,
                    message="输入数据为空"
                )

            # 2. 核心处理逻辑
            result_data = self._core_process(input_data)

            # 3. 返回成功结果
            return ProcessResult(
                status=ResultStatus.SUCCESS,
                data=result_data,
                message="处理成功"
            )

        except Exception as e:
            return ProcessResult(
                status=ResultStatus.FAILED,
                message=f"处理失败: {str(e)}",
                errors=[str(e)]
            )

    def _core_process(self, data: str) -> Dict:
        """核心处理逻辑(子类可覆盖)"""
        # 实现具体逻辑...
        return {"processed": data}

    def generate_report(self, result: ProcessResult) -> str:
        """
        生成可读报告

        Args:
            result: 处理结果

        Returns:
            str: 格式化的报告字符串
        """
        lines = [
            "=" * 60,
            "处理报告",
            "=" * 60,
            "",
            f"状态: {result.status.value}",
            f"消息: {result.message}",
            "",
        ]

        if result.data:
            lines.append("-" * 60)
            lines.append("处理结果:")
            lines.append("-" * 60)
            for key, value in result.data.items():
                lines.append(f"  {key}: {value}")

        if result.errors:
            lines.append("")
            lines.append("-" * 60)
            lines.append("错误信息:")
            lines.append("-" * 60)
            for error in result.errors:
                lines.append(f"  - {error}")

        lines.extend(["", "=" * 60])
        return "\n".join(lines)


# ==================================================
# 命令行入口
# ==================================================

def main():
    """命令行入口函数"""
    # 设置UTF-8输出(Windows兼容)
    sys.stdout = io.TextIOWrapper(
        sys.stdout.buffer,
        encoding='utf-8'
    )

    # 参数验证
    if len(sys.argv) < 2:
        print("用法: python script.py <input> [options]")
        print("")
        print("参数:")
        print("  input    必需,输入数据")
        print("  --config 可选,配置文件路径")
        print("  --json   可选,输出JSON格式")
        print("")
        print("示例:")
        print("  python script.py 'test input'")
        print("  python script.py 'test' --config config.json")
        sys.exit(1)

    # 解析参数
    input_data = sys.argv[1]
    config_path = None
    output_json = False

    for i, arg in enumerate(sys.argv[2:], 2):
        if arg == "--config" and i + 1 < len(sys.argv):
            config_path = sys.argv[i + 1]
        elif arg == "--json":
            output_json = True

    # 执行处理
    processor = Processor(config_path)
    result = processor.process(input_data)

    # 输出结果
    if output_json:
        print(json.dumps(asdict(result), ensure_ascii=False, indent=2))
    else:
        print(processor.generate_report(result))

    # 返回状态码
    sys.exit(0 if result.status == ResultStatus.SUCCESS else 1)


if __name__ == "__main__":
    main()
```

### 2.2 参数传递机制

脚本与Claude Code之间的参数传递是关键环节。

**参数传递方式**:

| 方式 | 适用场景 | 示例 |
|------|---------|------|
| 命令行参数 | 简单参数 | `python script.py "topic"` |
| 标准输入 | 大量文本 | `echo "content" \| python script.py` |
| 文件传递 | 复杂数据 | `python script.py --input file.json` |
| 环境变量 | 配置信息 | `API_KEY=xxx python script.py` |

**命令行参数解析**:

```python
# args_parser.py

import argparse
from typing import Dict, Any


def parse_args() -> Dict[str, Any]:
    """解析命令行参数"""
    parser = argparse.ArgumentParser(
        description="脚本描述",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  python script.py "主题" --full
  python script.py "主题" --count 5 --output json
        """
    )

    # 位置参数
    parser.add_argument(
        "topic",
        type=str,
        help="主题关键词"
    )

    # 可选参数
    parser.add_argument(
        "--count", "-c",
        type=int,
        default=5,
        help="生成数量(默认5)"
    )

    parser.add_argument(
        "--full", "-f",
        action="store_true",
        help="输出完整报告"
    )

    parser.add_argument(
        "--output", "-o",
        choices=["text", "json", "markdown"],
        default="text",
        help="输出格式"
    )

    parser.add_argument(
        "--config",
        type=str,
        default=None,
        help="配置文件路径"
    )

    args = parser.parse_args()
    return vars(args)


# 使用示例
if __name__ == "__main__":
    args = parse_args()
    print(f"主题: {args['topic']}")
    print(f"数量: {args['count']}")
    print(f"完整报告: {args['full']}")
```

**在Command中调用脚本**:

```markdown
# 01-write.md

### 步骤5: 自动生成爆款标题(必须执行)

**调用标题生成器脚本**(V7.2模块化):

```bash
cd ".claude/skills/gongzhonghao-writer/scripts" && python title_generator.py "{主题关键词}" --full
```

**脚本说明**:
- `title_generator.py` 是统一的标题生成模块
- `--full` 参数输出完整报告(含评分、星级、推荐理由)
- 自动检测品牌词、场景类型,应用最优公式

**参数说明**:
| 参数 | 类型 | 说明 |
|------|------|------|
| topic | 必需 | 主题关键词 |
| --full | 可选 | 完整报告模式 |
| --count N | 可选 | 生成N个标题,默认5 |
```

### 2.3 结果解析与处理

脚本输出需要被Claude Code正确解析和使用。

**结构化输出设计**:

```python
# structured_output.py

import json
from dataclasses import dataclass, asdict
from typing import List, Dict, Any, Optional


@dataclass
class TitleResult:
    """标题生成结果"""
    title: str
    formula: str
    score: int
    star_rating: str
    reason: str
    recommended: bool


@dataclass
class GenerationReport:
    """生成报告"""
    topic: str
    generated_at: str
    titles: List[TitleResult]
    best_title_index: int
    summary: str

    def to_json(self) -> str:
        """输出JSON格式"""
        return json.dumps(
            asdict(self),
            ensure_ascii=False,
            indent=2
        )

    def to_markdown(self) -> str:
        """输出Markdown格式"""
        lines = [
            "=" * 60,
            f"📌 爆款标题生成报告: {self.topic}",
            "=" * 60,
            "",
        ]

        for i, t in enumerate(self.titles, 1):
            rec_mark = " <- 推荐" if t.recommended else ""
            lines.extend([
                f"【推荐标题{i}】{t.title}{rec_mark}",
                f"公式: {t.formula}",
                f"SEO评分: {t.score}分",
                f"爆款指数: {t.star_rating}",
                "",
            ])

        lines.extend([
            "-" * 60,
            f"**老金推荐使用: 标题{self.best_title_index + 1}**",
            f"推荐理由: {self.titles[self.best_title_index].reason}",
            "-" * 60,
        ])

        return "\n".join(lines)

    def to_text(self) -> str:
        """输出纯文本格式"""
        return self.to_markdown()  # 复用Markdown格式
```

**Claude Code解析脚本输出**:

```markdown
# Command中解析脚本输出的模式

当脚本执行完成后,解析输出:

1. **检查执行状态**
   - 如果返回码为0: 执行成功
   - 如果返回码非0: 执行失败,查看错误信息

2. **解析结构化输出**
   ```
   输出通常包含:
   - 标题列表(按评分排序)
   - 推荐标题及理由
   - 评分说明
   ```

3. **提取关键信息**
   - 找到带"<- 推荐"标记的标题
   - 提取推荐理由
   - 获取所有备选标题

4. **应用到后续步骤**
   - 使用推荐标题作为文章标题
   - 将备选标题保存到文章中
```

### 2.4 调试与日志

良好的调试支持是脚本开发的关键。

**日志配置**:

```python
# logging_config.py

import logging
import sys
from pathlib import Path
from datetime import datetime


def setup_logging(
    name: str,
    level: int = logging.INFO,
    log_file: bool = False,
    log_dir: str = "logs"
) -> logging.Logger:
    """
    配置日志

    Args:
        name: 日志名称
        level: 日志级别
        log_file: 是否写入文件
        log_dir: 日志目录
    """
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # 格式化器
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # 控制台处理器
    console_handler = logging.StreamHandler(sys.stderr)
    console_handler.setLevel(level)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # 文件处理器(可选)
    if log_file:
        log_path = Path(log_dir)
        log_path.mkdir(exist_ok=True)

        file_handler = logging.FileHandler(
            log_path / f"{name}_{datetime.now():%Y%m%d}.log",
            encoding='utf-8'
        )
        file_handler.setLevel(level)
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)

    return logger


# 使用示例
logger = setup_logging("title_generator", log_file=True)

logger.info("开始生成标题")
logger.debug(f"输入主题: {topic}")
logger.warning("未找到品牌词,使用默认值")
logger.error(f"生成失败: {error}")
```

**调试模式实现**:

```python
# debug_mode.py

import os
from functools import wraps
from typing import Callable, TypeVar

T = TypeVar('T')

# 环境变量控制调试模式
DEBUG = os.environ.get('DEBUG', 'false').lower() == 'true'


def debug_trace(func: Callable[..., T]) -> Callable[..., T]:
    """调试跟踪装饰器"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        if DEBUG:
            print(f"[DEBUG] 进入: {func.__name__}")
            print(f"[DEBUG] 参数: args={args}, kwargs={kwargs}")

        result = func(*args, **kwargs)

        if DEBUG:
            print(f"[DEBUG] 退出: {func.__name__}")
            print(f"[DEBUG] 返回: {result}")

        return result
    return wrapper


# 使用示例
@debug_trace
def process_title(topic: str) -> str:
    # 处理逻辑...
    return f"处理后的标题: {topic}"
```

### 2.5 脚本与Claude Code的交互协议

脚本与Claude Code之间通过标准输入输出(stdin/stdout)和退出码(exit codes)进行通信。

**交互协议规范**:

| 通道 | 用途 | 格式 | 示例 |
|------|------|------|------|
| stdin | 输入数据 | 文本/JSON | `echo '{"topic": "AI"}' \| python script.py` |
| stdout | 正常输出 | 文本/JSON | `print(json.dumps(result))` |
| stderr | 日志/错误 | 文本 | `logger.error("处理失败")` |
| exit code | 执行状态 | 0=成功,非0=失败 | `sys.exit(1)` |

**完整的交互示例**:

```python
# interactive_script.py - 完整的输入输出示例

import sys
import io
import json
import logging
from typing import Dict, Any

# 1. 配置日志到stderr（不污染stdout）
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    stream=sys.stderr  # 日志输出到stderr
)
logger = logging.getLogger(__name__)


def read_input_from_stdin() -> str:
    """从标准输入读取数据"""
    logger.info("等待从stdin读取输入...")

    if not sys.stdin.isatty():
        # 管道输入
        input_data = sys.stdin.read().strip()
        logger.info(f"从管道读取了 {len(input_data)} 字节")
        return input_data
    else:
        # 交互式输入
        logger.info("请输入数据（按Ctrl+D结束）:")
        return sys.stdin.read().strip()


def parse_input(raw_input: str) -> Dict[str, Any]:
    """解析输入数据（支持文本和JSON）"""
    try:
        # 尝试JSON解析
        data = json.loads(raw_input)
        logger.info("输入解析为JSON格式")
        return data
    except json.JSONDecodeError:
        # 纯文本输入
        logger.info("输入解析为纯文本格式")
        return {"text": raw_input}


def process_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """处理数据的核心逻辑"""
    logger.info("开始处理数据...")

    # 模拟处理
    result = {
        "success": True,
        "processed_at": "2025-12-11",
        "input_length": len(str(data)),
        "output": f"处理结果: {data}"
    }

    logger.info("数据处理完成")
    return result


def output_result(result: Dict[str, Any], format_type: str = "json"):
    """输出结果到stdout"""
    if format_type == "json":
        # JSON格式（机器可读）
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        # 文本格式（人类可读）
        print("=" * 60)
        print("处理结果:")
        print("=" * 60)
        for key, value in result.items():
            print(f"{key}: {value}")
        print("=" * 60)


def main():
    """主函数"""
    # 设置UTF-8输出（Windows兼容）
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    try:
        # 步骤1: 读取输入
        raw_input = read_input_from_stdin()

        if not raw_input:
            logger.error("输入为空")
            sys.exit(1)

        # 步骤2: 解析输入
        data = parse_input(raw_input)

        # 步骤3: 处理数据
        result = process_data(data)

        # 步骤4: 输出结果
        output_format = "json" if "--json" in sys.argv else "text"
        output_result(result, output_format)

        # 成功退出
        logger.info("脚本执行成功")
        sys.exit(0)

    except KeyboardInterrupt:
        logger.warning("用户中断")
        sys.exit(130)  # SIGINT标准退出码

    except Exception as e:
        logger.error(f"执行失败: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    main()
```

**在Command中调用交互式脚本**:

```markdown
# 01-write.md 示例

### 步骤4: 调用交互式脚本

**方式1: 命令行参数**
```bash
python scripts/process.py "主题关键词" --json
```

**方式2: 管道输入**
```bash
echo '{"topic": "Claude Code", "type": "tutorial"}' | python scripts/process.py --json
```

**方式3: 文件输入**
```bash
cat input.json | python scripts/process.py --json
```

**解析输出**:
- 检查退出码（$?或%ERRORLEVEL%）
- 从stdout读取JSON结果
- 从stderr读取日志信息
```

📸 **截图位置2**: 显示脚本执行时的详细日志输出（stderr）和结果输出（stdout）的区别。

### 2.6 脚本性能优化技巧

在处理大量数据或复杂计算时，脚本性能优化至关重要。

**优化技巧汇总**:

| 优化点 | 优化前 | 优化后 | 性能提升 |
|--------|--------|--------|----------|
| 正则编译 | 每次re.findall() | re.compile()复用 | 3-5x |
| 文件读取 | 逐行读取 | 批量读取+迭代器 | 2-3x |
| 字符串拼接 | 循环中使用+ | join()方法 | 10x+ |
| 列表推导 | for循环append | [x for x in ...] | 1.5-2x |
| 缓存结果 | 重复计算 | @lru_cache装饰器 | 10x+ |

**性能优化实战示例**:

```python
# performance_optimization.py

import re
import functools
from typing import List, Dict
import time


# ❌ 优化前：每次都编译正则
def find_patterns_slow(content: str, pattern: str) -> List[str]:
    """未优化的模式匹配"""
    results = []
    for line in content.split('\n'):
        matches = re.findall(pattern, line)
        results.extend(matches)
    return results


# ✅ 优化后：预编译正则
class PatternMatcher:
    """优化的模式匹配器"""

    def __init__(self):
        # 预编译常用正则模式
        self.patterns = {
            'brand': re.compile(r'(Claude|GPT|Gemini|Kimi)'),
            'version': re.compile(r'v?\d+\.\d+(\.\d+)?'),
            'url': re.compile(r'https?://[^\s]+')
        }

    def find_patterns(self, content: str, pattern_name: str) -> List[str]:
        """使用预编译的正则匹配"""
        pattern = self.patterns.get(pattern_name)
        if not pattern:
            raise ValueError(f"未知模式: {pattern_name}")

        return pattern.findall(content)


# ❌ 优化前：字符串拼接
def build_report_slow(data: List[Dict]) -> str:
    """未优化的字符串拼接"""
    report = ""
    for item in data:
        report += f"标题: {item['title']}\n"
        report += f"评分: {item['score']}\n"
        report += "-" * 40 + "\n"
    return report


# ✅ 优化后：join方法
def build_report_fast(data: List[Dict]) -> str:
    """优化的字符串拼接"""
    lines = []
    for item in data:
        lines.append(f"标题: {item['title']}")
        lines.append(f"评分: {item['score']}")
        lines.append("-" * 40)
    return "\n".join(lines)


# ❌ 优化前：重复计算
def calculate_score_slow(title: str) -> int:
    """未优化：每次都计算"""
    score = 0
    score += len([w for w in ['AI', 'Claude', 'GPT'] if w in title]) * 10
    score += len([w for w in ['教程', '指南', '攻略'] if w in title]) * 5
    # 复杂的计算...
    time.sleep(0.1)  # 模拟耗时计算
    return score


# ✅ 优化后：使用缓存
@functools.lru_cache(maxsize=1000)
def calculate_score_fast(title: str) -> int:
    """优化：缓存结果"""
    score = 0
    score += len([w for w in ['AI', 'Claude', 'GPT'] if w in title]) * 10
    score += len([w for w in ['教程', '指南', '攻略'] if w in title]) * 5
    # 复杂的计算...
    time.sleep(0.1)  # 模拟耗时计算
    return score


# 性能对比基准测试
def benchmark():
    """性能基准测试"""
    import time

    test_data = [{"title": f"标题{i}", "score": i} for i in range(1000)]

    # 测试字符串拼接
    start = time.time()
    report_slow = build_report_slow(test_data)
    slow_time = time.time() - start

    start = time.time()
    report_fast = build_report_fast(test_data)
    fast_time = time.time() - start

    print(f"字符串拼接优化效果:")
    print(f"  优化前: {slow_time:.4f}秒")
    print(f"  优化后: {fast_time:.4f}秒")
    print(f"  提升: {slow_time / fast_time:.2f}x")
    print()

    # 测试缓存
    test_titles = [f"Claude教程{i % 10}" for i in range(100)]

    start = time.time()
    for title in test_titles:
        calculate_score_slow(title)
    slow_time = time.time() - start

    start = time.time()
    for title in test_titles:
        calculate_score_fast(title)
    fast_time = time.time() - start

    print(f"缓存优化效果:")
    print(f"  优化前: {slow_time:.4f}秒")
    print(f"  优化后: {fast_time:.4f}秒")
    print(f"  提升: {slow_time / fast_time:.2f}x")


if __name__ == "__main__":
    benchmark()
```

**输出示例**:
```
字符串拼接优化效果:
  优化前: 0.1234秒
  优化后: 0.0012秒
  提升: 102.83x

缓存优化效果:
  优化前: 10.1234秒
  优化后: 1.0123秒
  提升: 10.00x
```

📸 **截图位置3**: 显示性能基准测试的完整输出，展示优化前后的对比数据。

---

## 第三章 领域Skill设计

### 3.1 技术写作Skill

为技术博客、文档编写设计的Skill。

**目录结构**:

```
.claude/skills/tech-writer/
├── skill.yaml
├── prompts/
│   ├── tech-style.md          # 技术写作风格
│   ├── code-examples.md       # 代码示例规范
│   ├── api-docs.md            # API文档模板
│   └── tutorial-structure.md  # 教程结构指南
├── scripts/
│   ├── code_formatter.py      # 代码格式化
│   ├── link_checker.py        # 链接检查
│   └── toc_generator.py       # 目录生成
└── templates/
    ├── blog-post.md           # 博客模板
    ├── api-reference.md       # API参考模板
    └── tutorial.md            # 教程模板
```

**skill.yaml配置**:

```yaml
name: "技术写作助手"
description: "专业的技术文档和博客写作系统"
version: "1.0.0"

triggers:
  keywords:
    - "技术博客"
    - "文档"
    - "API文档"
    - "教程"
    - "/tech-write"

commands:
  - name: "blog"
    code: "blog-post"
    description: "写一篇技术博客"

  - name: "api-doc"
    code: "api-doc"
    description: "生成API文档"

  - name: "tutorial"
    code: "tutorial"
    description: "创建教程"

capabilities:
  - name: "代码高亮规范"
    description: "支持50+编程语言的语法高亮"

  - name: "自动目录生成"
    description: "基于标题结构自动生成目录"
    script: "scripts/toc_generator.py"

  - name: "链接有效性检查"
    description: "检查文档中所有链接是否有效"
    script: "scripts/link_checker.py"

quality_standards:
  - "代码示例必须可运行"
  - "每个概念必须有示例"
  - "专业术语必须解释"
  - "步骤必须可重现"
```

**tech-style.md 提示词**:

```markdown
# 技术写作风格指南

## 核心原则

1. **准确性第一**: 技术细节必须100%准确
2. **可验证性**: 所有代码必须可运行
3. **渐进式复杂度**: 从简单到复杂逐步展开
4. **读者导向**: 为目标读者水平调整内容

## 写作规范

### 标题规范
- H1: 文章主标题(唯一)
- H2: 主要章节
- H3: 子章节
- H4: 细分内容
- 避免跳级(H2直接到H4)

### 代码规范
- 所有代码块必须标注语言
- 长代码(>20行)必须有注释
- 提供完整可运行的示例
- 标注依赖和环境要求

### 示例格式
```python
# 示例: 使用requests发送HTTP请求
# 依赖: pip install requests
# Python版本: 3.8+

import requests

response = requests.get('https://api.example.com/data')
print(response.json())
```

### 术语处理
- 首次出现的术语必须解释
- 提供术语表(Glossary)
- 使用一致的术语翻译

## 文章结构模板

### 教程类
1. 概述(这是什么,为什么重要)
2. 前置要求(环境、依赖、知识)
3. 快速开始(最简示例)
4. 详细步骤(完整流程)
5. 常见问题(FAQ)
6. 延伸阅读(相关资源)

### 概念解释类
1. 定义(一句话说清楚)
2. 类比(用熟悉的事物解释)
3. 工作原理(技术细节)
4. 使用场景(何时使用)
5. 优缺点(客观分析)
6. 代码示例(实际应用)
```

### 3.2 代码审查Skill

自动化代码审查和最佳实践检查。

**skill.yaml配置**:

```yaml
name: "代码审查助手"
description: "自动化代码审查,发现问题,提供改进建议"
version: "1.0.0"

triggers:
  keywords:
    - "代码审查"
    - "code review"
    - "审查代码"
    - "/review"

commands:
  - name: "review"
    code: "code-review"
    description: "审查代码"

  - name: "security"
    code: "security-check"
    description: "安全检查"

capabilities:
  - name: "多语言支持"
    description: "支持Python/JS/Go/Java等主流语言"

  - name: "安全漏洞检测"
    description: "检测常见安全问题"
    script: "scripts/security_scanner.py"

  - name: "性能问题识别"
    description: "识别潜在性能问题"

  - name: "最佳实践检查"
    description: "检查是否遵循最佳实践"

review_dimensions:
  - name: "正确性"
    weight: 30
    checks:
      - "逻辑错误"
      - "边界条件"
      - "异常处理"

  - name: "可读性"
    weight: 25
    checks:
      - "命名规范"
      - "注释质量"
      - "代码结构"

  - name: "性能"
    weight: 20
    checks:
      - "算法复杂度"
      - "内存使用"
      - "I/O效率"

  - name: "安全性"
    weight: 15
    checks:
      - "输入验证"
      - "敏感数据"
      - "权限控制"

  - name: "可维护性"
    weight: 10
    checks:
      - "模块化"
      - "测试覆盖"
      - "文档完整"
```

**审查脚本核心逻辑**:

```python
# code_reviewer.py

from dataclasses import dataclass
from typing import List, Dict
from enum import Enum


class Severity(Enum):
    """问题严重程度"""
    CRITICAL = "critical"    # 必须修复
    MAJOR = "major"          # 强烈建议修复
    MINOR = "minor"          # 建议修复
    INFO = "info"            # 信息提示


@dataclass
class ReviewIssue:
    """审查问题"""
    severity: Severity
    category: str
    line: int
    message: str
    suggestion: str


class CodeReviewer:
    """代码审查器"""

    def __init__(self, language: str):
        self.language = language
        self.rules = self._load_rules(language)

    def review(self, code: str) -> List[ReviewIssue]:
        """执行代码审查"""
        issues = []

        # 1. 静态分析
        issues.extend(self._static_analysis(code))

        # 2. 规范检查
        issues.extend(self._style_check(code))

        # 3. 安全检查
        issues.extend(self._security_check(code))

        # 4. 性能检查
        issues.extend(self._performance_check(code))

        return sorted(issues, key=lambda x: x.severity.value)

    def generate_report(self, issues: List[ReviewIssue]) -> str:
        """生成审查报告"""
        lines = [
            "=" * 60,
            "代码审查报告",
            "=" * 60,
            "",
            f"发现问题: {len(issues)} 个",
            f"  - 严重: {sum(1 for i in issues if i.severity == Severity.CRITICAL)}",
            f"  - 主要: {sum(1 for i in issues if i.severity == Severity.MAJOR)}",
            f"  - 次要: {sum(1 for i in issues if i.severity == Severity.MINOR)}",
            "",
            "-" * 60,
            "问题详情:",
            "-" * 60,
        ]

        for issue in issues:
            icon = {
                Severity.CRITICAL: "🔴",
                Severity.MAJOR: "🟠",
                Severity.MINOR: "🟡",
                Severity.INFO: "🔵"
            }[issue.severity]

            lines.extend([
                f"{icon} [{issue.category}] 第{issue.line}行",
                f"   问题: {issue.message}",
                f"   建议: {issue.suggestion}",
                ""
            ])

        return "\n".join(lines)
```

### 3.3 数据分析Skill

数据分析和报告生成的专业Skill。

**skill.yaml配置**:

```yaml
name: "数据分析助手"
description: "数据分析、可视化和报告生成"
version: "1.0.0"

triggers:
  keywords:
    - "数据分析"
    - "分析数据"
    - "生成报告"
    - "/analyze"

commands:
  - name: "analyze"
    code: "data-analyze"
    description: "分析数据集"

  - name: "visualize"
    code: "data-visualize"
    description: "生成可视化"

  - name: "report"
    code: "data-report"
    description: "生成分析报告"

capabilities:
  - name: "统计分析"
    description: "描述性统计、假设检验"

  - name: "趋势识别"
    description: "识别数据趋势和模式"

  - name: "异常检测"
    description: "发现数据异常点"
    script: "scripts/anomaly_detector.py"

  - name: "报告生成"
    description: "生成专业分析报告"
    script: "scripts/report_generator.py"

analysis_templates:
  - name: "描述性分析"
    sections:
      - "数据概览"
      - "基本统计量"
      - "分布特征"
      - "关键发现"

  - name: "对比分析"
    sections:
      - "对比维度"
      - "差异分析"
      - "显著性检验"
      - "结论建议"
```

---

## 第四章 项目脚本分析

### 4.1 脚本清单概览

公众号写作助手项目包含20个核心脚本:

| 脚本 | 行数 | 功能 | 调用命令 |
|------|------|------|---------|
| quality_detector.py | 643 | 9维度质量检测 | /write, /write-auto |
| title_generator.py | 626 | 5公式标题生成 | /write, /title-gen |
| title_scorer.py | 480 | 7维度标题评分 | /title-score |
| topic_filter.py | 409 | V3双轨选题过滤 | /topic-filter |
| pre_publish_checker.py | 477 | 8维度发文检查 | /pre-check |
| infographic_generator.py | 815 | 信息图生成 | /infographic |
| rule_validator.py | - | 规则有效性验证 | /data-analyze |
| check_data_sync.py | - | 数据同步检查 | 内部 |
| collect_wechat_data.py | - | 微信数据收集 | /data-collect |
| analyze_wechat_data.py | - | 数据分析 | /data-analyze |
| database.py | - | 数据库操作 | 内部 |
| time_utils.py | - | 时间工具 | 内部 |
| written_article_detector.py | - | 已写文章检测 | 内部 |
| fix_article_format.py | - | 格式修复 | 内部 |
| migrate_to_database.py | - | 数据迁移 | 内部 |
| collect_all_pages.py | - | 全量采集 | /data-collect |
| collect_incremental.py | - | 增量采集 | /data-collect |
| collect_time_range.py | - | 时间范围采集 | /data-collect |
| browser_console_extract.js | - | 浏览器提取 | 内部 |
| remove_profanity.js | - | 脏话过滤 | 内部 |

### 4.2 quality_detector.py 深度分析

这是项目中最复杂的脚本之一,实现了9维度质量检测系统。

**架构设计**:

```
quality_detector.py
├── QualityScore (数据类)
│   ├── 9个评分维度
│   └── is_passed() 方法
├── QualityDetector (检测器类)
│   ├── 配置加载
│   ├── 关键词/模式定义
│   └── 9个检测方法
└── 报告生成
```

**核心检测逻辑**:

```python
# 1. AI腔检测
def _detect_ai_tone(self, content: str) -> float:
    """
    检测AI腔程度(0-100分,越低越好)

    检测维度:
    - AI腔关键词: 赋能、降本增效、闭环等
    - 机械化表达模式: 列表式开头、符号标记
    - 过度结构化: 连续的列表项
    """
    score = 0.0

    # 关键词检测
    for keyword in self.AI_TONE_KEYWORDS:
        count = content.count(keyword)
        score += count * 10  # 每出现一次扣10分

    # 模式检测
    for pattern in self.MECHANICAL_PATTERNS:
        matches = re.findall(pattern, content, re.MULTILINE)
        score += len(matches) * 5

    return min(100, score)

# 2. 自然度检测
def _detect_naturalness(self, content: str) -> float:
    """
    检测自然度(0-100分,越高越好)

    检测维度:
    - 句子长度变化(方差)
    - 段落呼吸感(空行)
    - 口语化表达
    """
    score = 100.0

    sentences = re.split(r'[。！？]', content)
    if sentences:
        lengths = [len(s) for s in sentences if s.strip()]
        variance = sum((l - avg) ** 2 for l in lengths) / len(lengths)
        if variance < 50:
            score -= 20  # 句子长度太统一

    return max(0, min(100, score))

# 3. 脏话检测(V6严格要求)
def _detect_profanity(self, content: str) -> float:
    """
    检测脏话和不当用词(计数,必须为0)

    特殊处理:
    - 区分技术术语(tm、TM)和脏话
    - 上下文判断
    """
    profanity_count = 0

    # 直接词汇检测
    for word in self.PROFANITY_WORDS:
        count = content.count(word)
        profanity_count += count

    # tm特殊处理
    pattern = r'(?<![a-zA-Z0-9_.])tm(?![a-zA-Z0-9_])'
    tm_matches = re.findall(pattern, content, re.IGNORECASE)

    for match in tm_matches:
        # 获取上下文
        pos = content.lower().find(match.lower())
        context = content[max(0, pos-15):pos+15].lower()

        # 排除技术术语
        tech_keywords = ['autopilot', 'tesla', '.tmp', 'html']
        if not any(tech in context for tech in tech_keywords):
            profanity_count += 1

    return float(profanity_count)
```

### 4.3 title_scorer.py 评分系统

标题评分器基于82篇文章数据验证,实现了7维度评分系统。

**评分维度与权重**:

| 维度 | 最高分 | 有效性(effectiveness) |
|------|--------|----------------------|
| 品牌词 | 35 | 1.59x |
| 动作词 | 15 | 1.95x |
| 效率词 | 10 | 1.68x |
| 工具推荐公式 | 20 | 5.25x |
| 问题解决 | 10 | 1.65x |
| 数字/版本 | 10 | 1.42x |
| 长度 | 5 | (反向:短标题负相关) |

**数据驱动的规则更新**:

```python
# V7.1重大更新: 基于数据删除无效规则

# 删除情绪词评分(effectiveness=0.32x,负相关!)
def _score_emotion(self, title: str) -> ScoreItem:
    """情绪词检测 - V7.1更新: 不再正向评分"""
    matched = []
    negative_emotions = ["惊了", "麻了", "吓到", "慌了", "懵了"]

    for word in negative_emotions:
        if word in title:
            matched.append(f"{word}(⚠️无效)")

    return ScoreItem(
        dimension="情绪词",
        score=0,  # V7.1: 不再给正分
        max_score=0,
        matched=matched,
        suggestion="⚠️ V7.1数据显示情绪词效果有限"
    )

# 新增工具推荐公式检测(effectiveness=5.25x,最强!)
def _score_tool_formula(self, title: str) -> ScoreItem:
    """工具推荐公式评分"""
    matched = []
    score = 0

    patterns = [
        r"用.{1,10}(才知道|才发现)",  # "用了半年才知道"
        r"一直(少|没|缺)",  # "一直少装了"
    ]

    for pattern in patterns:
        if re.search(pattern, title):
            matched.append("工具推荐公式")
            score = 20  # 高分,因为5.25x效果
            break

    return ScoreItem(
        dimension="工具推荐公式",
        score=score,
        max_score=20,
        matched=matched,
        suggestion="💡 推荐使用'用了X才知道+神器'公式"
    )
```

### 4.4 数据驱动工作流

项目的核心特色是数据驱动:从历史数据中学习规律,持续优化规则。

**数据依赖链**:

```
data/rule_validation_report.json  <- 数据源
         |
         v
prompts/baokuan-rules.md          <- 规范文档
         |
         v
scripts/*.py                      <- 脚本实现
         |
         v
commands/*.md                     <- 命令调用
```

**数据同步检查脚本**:

```python
# check_data_sync.py

"""
数据同步检查器
确保数据源和依赖文件版本一致
"""

import json
import re
from pathlib import Path


def check_data_sync():
    """检查数据同步状态"""

    # 1. 读取数据源版本
    data_file = Path("data/rule_validation_report.json")
    with open(data_file) as f:
        data = json.load(f)
    data_version = data.get("version", "unknown")

    # 2. 检查依赖文件
    dependent_files = [
        "prompts/baokuan-rules.md",
        "scripts/title_scorer.py",
        "scripts/title_generator.py",
    ]

    results = []
    for file_path in dependent_files:
        content = Path(file_path).read_text(encoding='utf-8')

        # 查找版本标注
        match = re.search(
            r'data_version.*?V(\d+\.\d+)',
            content
        )

        if match:
            file_version = match.group(1)
            synced = file_version == data_version
        else:
            file_version = "未标注"
            synced = False

        results.append({
            "file": file_path,
            "version": file_version,
            "synced": synced
        })

    # 3. 生成报告
    print("=" * 60)
    print("数据同步检查报告")
    print("=" * 60)
    print(f"数据源版本: {data_version}")
    print()

    all_synced = True
    for r in results:
        status = "✅" if r["synced"] else "❌"
        print(f"{status} {r['file']}: {r['version']}")
        if not r["synced"]:
            all_synced = False

    print()
    if all_synced:
        print("✅ 所有文件已同步")
    else:
        print("❌ 存在版本不一致,请运行数据同步")
```

---

## 第五章 练习与实践

### 5.1 基础练习: 创建简单脚本

**目标**: 创建一个Markdown标题检查器

**要求**:
1. 检查标题层级是否正确(不跳级)
2. 检查是否有重复的H1
3. 输出检查报告

**参考结构**:
```python
@dataclass
class HeadingIssue:
    line: int
    level: int
    text: str
    issue: str

class HeadingChecker:
    def check(self, content: str) -> List[HeadingIssue]:
        pass
    def generate_report(self, issues: List[HeadingIssue]) -> str:
        pass
```

### 5.2 进阶练习: 实现工作流

**目标**: 实现一个简化版的写作工作流

**步骤**:
1. 选题验证
2. 大纲生成
3. 内容生成
4. 质量检查

### 5.3 挑战练习: 设计领域Skill

**目标**: 为你的工作领域设计一个完整的Skill

**要求**:
1. 完整的目录结构
2. skill.yaml配置
3. 至少2个提示词文件
4. 至少1个可执行脚本
5. 工作流定义

---

## 总结

通过本章的学习,你应该掌握了:

1. **多步骤工作流**: DAG依赖管理、并行执行、状态管理
2. **错误恢复**: 重试机制、降级策略、断点恢复
3. **脚本开发**: Python规范、参数传递、结果解析
4. **领域Skill设计**: 技术写作、代码审查、数据分析
5. **项目脚本分析**: 质量检测、标题评分、数据驱动

**关键要点**:

1. **模块化设计**: 每个脚本单一职责,通过组合实现复杂功能
2. **数据驱动**: 从数据中学习规律,持续优化规则
3. **健壮性**: 完善的错误处理和恢复机制
4. **可观测性**: 清晰的日志和调试支持

**下一步建议**:
1. 动手实现练习中的脚本
2. 为你的项目创建专属Skill
3. 研究更多开源Skills实现
4. 建立个人的Skill库

---

## 第五章 调试、优化与发布

### 5.1 常见问题排查表

Skills开发过程中常遇到的10大问题及解决方案。

#### 问题1: Skill未被激活

**症状**: 发送关键词后，Skill没有响应，Claude Code像往常一样回复。

**原因分析**:
1. skill.yaml中的triggers关键词配置错误
2. skill.yaml文件YAML语法错误（缩进、特殊字符）
3. Skill目录结构不正确
4. .claude/settings.json未启用该Skill

**排查步骤**:

```bash
# 步骤1: 检查skill.yaml语法
python -c "import yaml; yaml.safe_load(open('.claude/skills/my-skill/skill.yaml'))"
# 如果有语法错误，会直接报错

# 步骤2: 验证目录结构
find .claude/skills/my-skill -type f
# 应该至少包含 skill.yaml

# 步骤3: 检查关键词配置
grep -A 5 "triggers:" .claude/skills/my-skill/skill.yaml
# 确认关键词列表正确

# 步骤4: 查看Claude Code配置
cat .claude/settings.json | grep -A 10 "skills"
```

**解决方案**:

```yaml
# skill.yaml 正确示例

name: "我的Skill"
triggers:
  keywords:
    - "触发词1"
    - "触发词2"
    - "/command"  # 斜杠命令格式

# ⚠️ 常见错误
triggers:
  keywords:  触发词  # ❌ 错误：缺少列表格式
  keywords:
    触发词1  # ❌ 错误：缺少连字符
```

📸 **截图位置4**: 显示YAML验证工具检测到语法错误的输出。

---

#### 问题2: 脚本执行失败

**症状**: 调用脚本时显示"脚本错误"或"执行失败"。

**原因分析**:
1. Python脚本语法错误
2. 缺少依赖库（import失败）
3. 文件权限问题（Unix/Linux）
4. 路径错误（相对路径 vs 绝对路径）
5. 编码问题（UTF-8 vs GBK）

**排查步骤**:

```bash
# 步骤1: 手动运行脚本检查错误
cd ".claude/skills/my-skill/scripts"
python script.py "test input"
# 查看完整错误堆栈

# 步骤2: 检查Python环境
which python  # Unix/Linux/Mac
where python  # Windows

python --version  # 确认版本（建议Python 3.8+）

# 步骤3: 验证依赖库
python -c "import sys; print('\n'.join(sys.path))"  # 查看搜索路径
pip list  # 查看已安装的库

# 步骤4: 检查文件权限（Unix/Linux）
ls -la script.py
chmod +x script.py  # 添加执行权限

# 步骤5: 测试编码
file -I script.py  # 应该显示 charset=utf-8
```

**解决方案**:

```python
# script.py 健壮的错误处理模板

import sys
import io
import traceback

# 1. 确保UTF-8输出（Windows兼容）
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# 2. 捕获并记录所有错误
def main():
    try:
        # 你的脚本逻辑
        result = process()
        print(json.dumps(result, ensure_ascii=False))
        sys.exit(0)

    except ImportError as e:
        # 缺少依赖库
        print(f"❌ 缺少依赖库: {e}", file=sys.stderr)
        print("解决方案: pip install [库名]", file=sys.stderr)
        sys.exit(2)

    except FileNotFoundError as e:
        # 文件不存在
        print(f"❌ 文件未找到: {e}", file=sys.stderr)
        sys.exit(3)

    except Exception as e:
        # 其他错误
        print(f"❌ 执行失败: {e}", file=sys.stderr)
        print("完整堆栈:", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
```

---

#### 问题3: Prompts未加载

**症状**: Skill响应不符合预期风格，像是没读取提示词文件。

**原因分析**:
1. prompt_files路径配置错误
2. Markdown文件编码问题
3. 提示词文件为空或格式错误
4. 条件加载逻辑错误

**排查步骤**:

```bash
# 步骤1: 检查提示词文件存在
ls -la .claude/skills/my-skill/prompts/*.md

# 步骤2: 验证文件内容
cat .claude/skills/my-skill/prompts/style.md | head -20

# 步骤3: 检查skill.yaml配置
grep -A 10 "prompt_files:" .claude/skills/my-skill/skill.yaml

# 步骤4: 测试文件编码
file -I .claude/skills/my-skill/prompts/*.md
```

**解决方案**:

```yaml
# skill.yaml 正确配置

prompt_files:
  # 相对于skill.yaml的路径
  - "prompts/style.md"
  - "prompts/rules.md"

# ⚠️ 常见错误
prompt_files:
  - "/prompts/style.md"  # ❌ 不要用绝对路径
  - "prompt/style.md"    # ❌ 路径拼写错误
  - prompts/style.md     # ❌ 缺少引号
```

---

#### 问题4: 状态未保存

**症状**: 每次重启Claude Code后，之前保存的状态丢失。

**原因分析**:
1. 状态目录不存在或权限不足
2. 状态文件保存路径错误
3. 会话ID不一致
4. 状态文件被.gitignore排除后丢失

**排查步骤**:

```bash
# 步骤1: 检查状态目录
ls -la .claude/skills/state/

# 步骤2: 验证文件权限
ls -la .claude/skills/state/*.json

# 步骤3: 查看状态文件内容
cat .claude/skills/state/my-skill.json | jq .

# 步骤4: 检查.gitignore
grep "state" .gitignore
```

**解决方案**:

```python
# state_manager.py 健壮的状态管理

from pathlib import Path
import json

class StateManager:
    def __init__(self, skill_name: str):
        self.skill_name = skill_name

        # 确保状态目录存在
        self.state_dir = Path(".claude/skills/state")
        self.state_dir.mkdir(parents=True, exist_ok=True)

        self.state_file = self.state_dir / f"{skill_name}.json"

    def save_state(self, key: str, value: any):
        """保存状态（原子操作）"""
        try:
            # 读取现有状态
            if self.state_file.exists():
                with open(self.state_file, 'r', encoding='utf-8') as f:
                    state = json.load(f)
            else:
                state = {}

            # 更新状态
            state[key] = value

            # 原子写入（先写临时文件，再重命名）
            temp_file = self.state_file.with_suffix('.tmp')
            with open(temp_file, 'w', encoding='utf-8') as f:
                json.dump(state, f, indent=2, ensure_ascii=False)

            # 重命名（原子操作）
            temp_file.replace(self.state_file)

        except Exception as e:
            print(f"⚠️ 状态保存失败: {e}", file=sys.stderr)

    def load_state(self, key: str, default=None):
        """加载状态"""
        try:
            if not self.state_file.exists():
                return default

            with open(self.state_file, 'r', encoding='utf-8') as f:
                state = json.load(f)

            return state.get(key, default)

        except Exception as e:
            print(f"⚠️ 状态加载失败: {e}", file=sys.stderr)
            return default
```

---

#### 问题5-10: 快速排查表

| 问题 | 症状 | 快速检查命令 | 解决方案 |
|------|------|--------------|----------|
| **依赖缺失** | ImportError | `pip list` | `pip install [库名]` |
| **路径错误** | FileNotFoundError | `ls -R .claude/skills/` | 修正skill.yaml中的路径 |
| **编码问题** | UnicodeDecodeError | `file -I *.py` | 确保文件为UTF-8 |
| **权限问题** | Permission denied | `ls -la` | `chmod +x script.py` |
| **JSON解析失败** | JSONDecodeError | `python -m json.tool` | 检查JSON格式 |
| **YAML语法错误** | YAMLError | `python -c "import yaml"` | 使用YAML验证器 |

### 5.2 性能优化最佳实践

以下是5个真实案例，展示如何优化Skill性能。

#### 案例1: 缓存策略优化（减少重复计算）

**场景**: 标题评分器每次都重新计算品牌词列表，即使输入相同。

**优化前**:
```python
def score_brand(title: str) -> int:
    brands = ["Claude", "GPT", "Gemini", "Kimi", "Cursor"]  # 每次都创建
    score = 0
    for brand in brands:
        if brand in title:
            score += 10
    return score

# 1000次调用耗时: 0.5秒
```

**优化后**:
```python
# 方案1: 类级常量
class TitleScorer:
    BRANDS = ["Claude", "GPT", "Gemini", "Kimi", "Cursor"]  # 只创建一次

    def score_brand(self, title: str) -> int:
        score = 0
        for brand in self.BRANDS:
            if brand in title:
                score += 10
        return score

# 方案2: 使用lru_cache
from functools import lru_cache

@lru_cache(maxsize=1000)
def score_brand_cached(title: str) -> int:
    brands = ["Claude", "GPT", "Gemini", "Kimi", "Cursor"]
    score = 0
    for brand in brands:
        if brand in title:
            score += 10
    return score

# 1000次调用耗时: 0.05秒（提升10x）
```

---

#### 案例2: Prompts动态加载（按需加载）

**场景**: Skill同时加载10个prompts文件（共50KB），但每次只用1-2个。

**优化前**:
```yaml
# skill.yaml
prompt_files:
  - "prompts/style.md"
  - "prompts/rules.md"
  - "prompts/examples.md"
  - "prompts/templates.md"
  - "prompts/qa.md"
  - "prompts/edge-cases.md"
  - "prompts/advanced.md"
  - "prompts/debug.md"
  - "prompts/perf.md"
  - "prompts/security.md"

# 启动耗时: 2秒
# 内存占用: 5MB
```

**优化后**:
```yaml
# skill.yaml - 按场景分组
prompt_files:
  base:
    - "prompts/style.md"
    - "prompts/rules.md"

  advanced:
    - "prompts/advanced.md"
    - "prompts/perf.md"

  debug:
    - "prompts/debug.md"
    - "prompts/edge-cases.md"

# 条件加载逻辑
load_strategy: "lazy"  # 延迟加载
```

```python
# prompt_loader.py
class PromptLoader:
    def __init__(self):
        self.loaded_prompts = {}

    def load_on_demand(self, scene: str):
        """按需加载"""
        if scene not in self.loaded_prompts:
            prompt_file = f"prompts/{scene}.md"
            with open(prompt_file) as f:
                self.loaded_prompts[scene] = f.read()
        return self.loaded_prompts[scene]

# 启动耗时: 0.3秒（提升6x）
# 内存占用: 1MB（减少80%）
```

---

#### 案例3: 脚本异步执行（并发处理）

**场景**: 质量检测需要调用3个独立的检测脚本，顺序执行耗时长。

**优化前**:
```python
# sequential_check.py
def quality_check(article_path: str):
    # 顺序执行
    ai_score = subprocess.run(["python", "ai_detector.py", article_path])  # 3秒
    natural_score = subprocess.run(["python", "natural_detector.py", article_path])  # 2秒
    profanity_count = subprocess.run(["python", "profanity_detector.py", article_path])  # 1秒

    return {
        "ai_score": ai_score,
        "natural_score": natural_score,
        "profanity_count": profanity_count
    }

# 总耗时: 6秒
```

**优化后**:
```python
# parallel_check.py
import asyncio
import subprocess

async def run_async(cmd):
    """异步运行子进程"""
    proc = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await proc.communicate()
    return stdout.decode()

async def quality_check_async(article_path: str):
    """并发执行"""
    tasks = [
        run_async(["python", "ai_detector.py", article_path]),
        run_async(["python", "natural_detector.py", article_path]),
        run_async(["python", "profanity_detector.py", article_path])
    ]

    results = await asyncio.gather(*tasks)

    return {
        "ai_score": results[0],
        "natural_score": results[1],
        "profanity_count": results[2]
    }

# 总耗时: 3秒（提升2x，取决于最慢的脚本）
```

---

#### 案例4: 状态清理机制（定期清理过期状态）

**场景**: 状态文件不断增长，包含大量过期数据。

**优化前**:
```python
# state_manager.py（无清理机制）
def save_state(key, value):
    state = load_all_state()
    state[key] = {
        "value": value,
        "timestamp": datetime.now().isoformat()
    }
    save_all_state(state)

# 状态文件大小: 10MB（包含1年的历史数据）
# 加载耗时: 1秒
```

**优化后**:
```python
# state_manager.py（带过期清理）
from datetime import datetime, timedelta

def save_state(key, value, ttl_days=30):
    """保存状态，自动清理过期数据"""
    state = load_all_state()

    # 清理过期数据
    now = datetime.now()
    expired_keys = []

    for k, v in state.items():
        timestamp = datetime.fromisoformat(v["timestamp"])
        if (now - timestamp).days > ttl_days:
            expired_keys.append(k)

    for k in expired_keys:
        del state[k]

    # 保存新数据
    state[key] = {
        "value": value,
        "timestamp": now.isoformat()
    }

    save_all_state(state)

# 状态文件大小: 500KB（只保留30天数据）
# 加载耗时: 0.05秒（提升20x）
```

---

#### 案例5: 日志分级记录（只记录必要日志）

**场景**: 生产环境记录DEBUG级别日志，日志文件快速增长。

**优化前**:
```python
# logger_config.py
logging.basicConfig(
    level=logging.DEBUG,  # 记录所有日志
    filename="skill.log"
)

# 日志文件增长: 1GB/天
# 性能影响: I/O阻塞，脚本变慢
```

**优化后**:
```python
# logger_config.py
import os
import logging
from logging.handlers import RotatingFileHandler

# 根据环境变量设置日志级别
log_level = os.getenv("LOG_LEVEL", "INFO")

logger = logging.getLogger(__name__)
logger.setLevel(getattr(logging, log_level))

# 使用轮转日志（限制文件大小）
handler = RotatingFileHandler(
    "skill.log",
    maxBytes=10*1024*1024,  # 10MB
    backupCount=5  # 保留5个备份
)

formatter = logging.Formatter(
    '%(asctime)s - %(levelname)s - %(message)s'
)
handler.setFormatter(formatter)
logger.addHandler(handler)

# 日志文件增长: 50MB/天（减少95%）
# 性能提升: 无明显I/O阻塞
```

**环境变量配置**:
```bash
# 开发环境
export LOG_LEVEL=DEBUG

# 生产环境
export LOG_LEVEL=WARNING
```

📸 **截图位置5**: 显示性能优化前后的对比图表（耗时、内存、文件大小等指标）。

### 5.3 发布与分享规范

当你的Skill开发完成后，按照以下规范进行发布。

#### 5.3.1 打包前检查清单

在发布Skill前，完成以下检查：

- [ ] **功能完整性**
  - [ ] 所有功能按预期工作
  - [ ] 边界条件测试通过
  - [ ] 错误处理健壮

- [ ] **文档完整性**
  - [ ] README.md包含安装步骤
  - [ ] 所有配置项有说明
  - [ ] 提供使用示例

- [ ] **代码质量**
  - [ ] 没有硬编码的路径
  - [ ] 没有敏感信息（API密钥等）
  - [ ] 代码有适当注释

- [ ] **文件结构**
  - [ ] skill.yaml语法正确
  - [ ] 所有引用的文件存在
  - [ ] .gitignore配置正确

- [ ] **兼容性**
  - [ ] 跨平台测试（Windows/Mac/Linux）
  - [ ] Python版本兼容性标注
  - [ ] 依赖库版本明确

#### 5.3.2 README模板

```markdown
# [Skill名称]

**版本**: 1.0.0
**作者**: [你的名字]
**适用**: Claude Code 1.0+
**协议**: MIT

## 📖 简介

[一句话描述Skill的核心功能]

[详细描述Skill能解决什么问题，适用场景]

## ✨ 特性

- ✅ 特性1：[描述]
- ✅ 特性2：[描述]
- ✅ 特性3：[描述]

## 📦 安装

### 方式1: 克隆仓库

\```bash
# 1. 克隆仓库到.claude/skills目录
cd [你的项目]/.claude/skills
git clone https://github.com/[你的用户名]/[仓库名] [skill名称]

# 2. 安装依赖（如果有）
cd [skill名称]
pip install -r requirements.txt
\```

### 方式2: 手动下载

1. 下载[最新版本](https://github.com/[你的用户名]/[仓库名]/releases)
2. 解压到 `.claude/skills/[skill名称]`
3. 安装依赖: `pip install -r requirements.txt`

## 🚀 快速开始

### 基本用法

\```
用户: [触发关键词] [参数]

Claude Code: [预期响应示例]
\```

### 完整示例

\```
用户: /write "Claude Code教程"

Claude Code:
[显示完整的交互示例]
\```

## ⚙️ 配置

### skill.yaml配置项

\```yaml
# 可选配置项说明
config:
  option1: "默认值"  # 说明：[用途]
  option2: 100       # 说明：[用途]
\```

### 环境变量

\```bash
# 可选的环境变量
export SKILL_API_KEY="your_key"  # 用途：[说明]
export SKILL_LOG_LEVEL="INFO"    # 用途：[说明]
\```

## 📚 使用文档

### 功能1: [功能名称]

**用途**: [描述]

**使用方法**:
\```
[命令示例]
\```

**参数说明**:
| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| param1 | string | ✅ | [说明] |
| param2 | number | ❌ | [说明] |

### 功能2: [功能名称]

[类似格式]

## 🔧 高级用法

### 自定义提示词

[如何修改prompts]

### 扩展脚本

[如何添加自定义脚本]

## 🐛 常见问题

### Q1: [问题描述]

**A**: [解决方案]

### Q2: [问题描述]

**A**: [解决方案]

## 📊 性能

| 操作 | 耗时 | 内存 |
|------|------|------|
| 功能1 | 0.5s | 10MB |
| 功能2 | 2.0s | 50MB |

## 🤝 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 开源协议

本项目采用 [MIT协议](LICENSE)

## 🙏 致谢

- [依赖库1](链接)
- [依赖库2](链接)
- [参考项目](链接)

## 📮 联系方式

- GitHub: [@[你的用户名]](https://github.com/[你的用户名])
- Email: [你的邮箱]
- 讨论区: [链接]
```

#### 5.3.3 开源协议选择指南

| 协议 | 特点 | 适用场景 |
|------|------|----------|
| **MIT** | 最宽松，允许商业使用，只需保留版权声明 | 希望最大化传播，不在意商业使用 |
| **Apache 2.0** | 允许商业使用，明确专利授权 | 涉及专利的项目 |
| **GPL v3** | 强制开源，衍生作品必须开源 | 希望保持开源生态 |
| **CC BY 4.0** | 适用于文档和数据，允许商业使用 | 纯文档/数据项目 |
| **私有协议** | 自定义条款 | 特殊需求 |

📸 **截图位置6**: 显示GitHub上发布的Skills仓库页面，包含README、License、Releases等。

---

## 第六章 完整实战案例

### 6.1 案例1: 从零构建"AI论文摘要生成器"Skill

**项目背景**: 为科研人员设计一个Skill，自动阅读AI领域论文PDF，生成结构化摘要。

**需求分析**:
1. 输入：arXiv论文链接或PDF文件
2. 输出：结构化摘要（问题/方法/结果/贡献）
3. 额外功能：关键术语提取、相关论文推荐

#### 步骤1: 项目结构设计

```
.claude/skills/paper-summarizer/
├── skill.yaml
├── README.md
├── requirements.txt
├── prompts/
│   ├── summary-template.md      # 摘要模板
│   ├── terminology-extractor.md # 术语提取
│   └── related-papers.md        # 相关论文
├── scripts/
│   ├── pdf_parser.py            # PDF解析
│   ├── summarizer.py            # 核心摘要生成
│   ├── term_extractor.py        # 术语提取
│   └── paper_recommender.py     # 论文推荐
└── tests/
    ├── test_parser.py
    └── sample_paper.pdf
```

#### 步骤2: skill.yaml配置

```yaml
name: "AI论文摘要生成器"
description: "自动分析AI领域论文，生成结构化摘要"
version: "1.0.0"
author: "Your Name"

triggers:
  keywords:
    - "论文摘要"
    - "paper summary"
    - "摘要论文"
    - "/summarize"

commands:
  - name: "summarize"
    code: "paper-summary"
    description: "生成论文摘要"
    usage: "/summarize <arXiv链接或PDF路径>"

  - name: "extract-terms"
    code: "term-extract"
    description: "提取关键术语"

  - name: "recommend"
    code: "paper-recommend"
    description: "推荐相关论文"

prompt_files:
  - "prompts/summary-template.md"
  - "prompts/terminology-extractor.md"
  - "prompts/related-papers.md"

dependencies:
  python_version: ">=3.8"
  packages:
    - "PyPDF2>=3.0.0"
    - "requests>=2.28.0"
    - "arxiv>=1.4.0"

capabilities:
  - name: "PDF解析"
    description: "支持多页PDF解析"
    script: "scripts/pdf_parser.py"

  - name: "结构化摘要"
    description: "生成问题-方法-结果-贡献四段式摘要"
    script: "scripts/summarizer.py"

  - name: "术语库构建"
    description: "自动积累AI领域术语"

config:
  max_pdf_size: 50  # MB
  summary_length: 500  # 字
  cache_papers: true
```

#### 步骤3: PDF解析脚本

```python
# scripts/pdf_parser.py - 完整实现

import sys
import io
import json
from pathlib import Path
from typing import Dict, List
import PyPDF2
import requests

def parse_pdf_from_file(pdf_path: str) -> Dict:
    """解析本地PDF文件"""
    try:
        with open(pdf_path, 'rb') as f:
            pdf_reader = PyPDF2.PdfReader(f)

            # 提取元数据
            metadata = pdf_reader.metadata or {}

            # 提取文本
            text_content = []
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text_content.append(page.extract_text())

            return {
                "success": True,
                "metadata": {
                    "title": metadata.get("/Title", "未知"),
                    "author": metadata.get("/Author", "未知"),
                    "pages": len(pdf_reader.pages)
                },
                "content": "\n\n".join(text_content),
                "source": "local_file"
            }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def parse_pdf_from_arxiv(arxiv_id: str) -> Dict:
    """从arXiv下载并解析论文"""
    try:
        import arxiv

        # 搜索论文
        search = arxiv.Search(id_list=[arxiv_id])
        paper = next(search.results())

        # 下载PDF
        pdf_path = paper.download_pdf(dirpath="/tmp")

        # 解析PDF
        result = parse_pdf_from_file(pdf_path)

        # 添加arXiv元数据
        if result["success"]:
            result["metadata"].update({
                "title": paper.title,
                "authors": [author.name for author in paper.authors],
                "published": paper.published.isoformat(),
                "arxiv_id": arxiv_id,
                "url": paper.entry_id
            })
            result["source"] = "arxiv"

        # 清理临时文件
        Path(pdf_path).unlink()

        return result

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def main():
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    if len(sys.argv) < 2:
        print(json.dumps({
            "success": False,
            "error": "用法: python pdf_parser.py <PDF路径或arXiv ID>"
        }, ensure_ascii=False))
        sys.exit(1)

    input_arg = sys.argv[1]

    # 判断输入类型
    if input_arg.startswith("http") and "arxiv.org" in input_arg:
        # 提取arXiv ID
        arxiv_id = input_arg.split("/")[-1].replace(".pdf", "")
        result = parse_pdf_from_arxiv(arxiv_id)
    elif Path(input_arg).exists():
        # 本地PDF文件
        result = parse_pdf_from_file(input_arg)
    else:
        # 假设是arXiv ID
        result = parse_pdf_from_arxiv(input_arg)

    print(json.dumps(result, ensure_ascii=False, indent=2))
    sys.exit(0 if result["success"] else 1)


if __name__ == "__main__":
    main()
```

#### 步骤4: 摘要生成提示词

```markdown
# prompts/summary-template.md

你是AI领域的资深科研人员，擅长阅读和总结学术论文。

## 摘要生成规范

请按照以下结构生成论文摘要：

### 1. 研究问题 (Problem)
- 作者要解决什么问题？
- 这个问题为什么重要？
- 现有方法的局限性是什么？

### 2. 提出方法 (Method)
- 作者提出的解决方案是什么？
- 核心技术创新点有哪些？
- 方法的关键步骤是什么？

### 3. 实验结果 (Results)
- 在哪些数据集上验证？
- 关键性能指标是多少？
- 与baseline的对比如何？

### 4. 主要贡献 (Contributions)
- 对领域的理论贡献
- 对实践的应用价值
- 未来可扩展的方向

## 输出格式

```json
{
  "title": "论文标题",
  "authors": ["作者1", "作者2"],
  "published": "2025-01",
  "summary": {
    "problem": "[问题描述]",
    "method": "[方法描述]",
    "results": "[结果描述]",
    "contributions": "[贡献描述]"
  },
  "key_terms": ["术语1", "术语2", "术语3"],
  "code_available": true/false,
  "code_url": "GitHub链接（如有）"
}
```

## 术语处理
- 首次出现的专业术语需要用中文解释
- 保留原英文术语在括号中
- 例如：注意力机制(Attention Mechanism)
```

#### 步骤5: 核心摘要脚本

```python
# scripts/summarizer.py

import sys
import io
import json
from typing import Dict

def generate_summary(pdf_content: Dict) -> Dict:
    """
    生成结构化摘要

    注意：实际实现中，这部分逻辑由Claude Code的AI执行，
    脚本主要负责前处理和后处理。
    """
    if not pdf_content.get("success"):
        return {
            "success": False,
            "error": "PDF解析失败"
        }

    # 提取关键信息
    metadata = pdf_content.get("metadata", {})
    content = pdf_content.get("content", "")

    # 检查内容长度
    if len(content) < 500:
        return {
            "success": False,
            "error": "PDF内容过短，可能解析失败"
        }

    # 构建给Claude Code的提示
    prompt_data = {
        "paper_title": metadata.get("title", "未知"),
        "paper_authors": metadata.get("authors", ["未知"]),
        "paper_content": content[:10000],  # 只取前10000字符
        "task": "按照summary-template.md的规范生成摘要"
    }

    # 返回给Claude Code处理
    return {
        "success": True,
        "prompt_data": prompt_data,
        "message": "请根据以下内容生成摘要"
    }


def main():
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

    # 从stdin读取PDF解析结果
    if not sys.stdin.isatty():
        pdf_content = json.load(sys.stdin)
    else:
        print(json.dumps({
            "success": False,
            "error": "需要从stdin输入PDF解析结果"
        }, ensure_ascii=False))
        sys.exit(1)

    result = generate_summary(pdf_content)
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
```

#### 步骤6: Command集成

```markdown
# .claude/commands/summarize-paper.md

分析AI论文并生成结构化摘要。

用法：/summarize <arXiv链接或PDF路径>

## 执行流程

### 步骤1: 解析PDF
```bash
python .claude/skills/paper-summarizer/scripts/pdf_parser.py "{输入}" > /tmp/parsed.json
```

### 步骤2: 检查解析结果
- 如果解析失败，提示用户检查输入
- 如果解析成功，继续下一步

### 步骤3: 生成摘要
```bash
cat /tmp/parsed.json | python .claude/skills/paper-summarizer/scripts/summarizer.py
```

### 步骤4: AI摘要生成
- 读取summary-template.md提示词
- 根据论文内容生成结构化摘要
- 按JSON格式输出

### 步骤5: 保存结果
```bash
# 保存到 papers/summaries/
mkdir -p papers/summaries
cat result.json > papers/summaries/[论文标题]_summary.json
```

### 步骤6: 展示给用户
按照以下格式展示：

---
**论文标题**：[标题]
**作者**：[作者列表]
**发表时间**：[时间]

**📌 研究问题**
[问题描述]

**🔬 提出方法**
[方法描述]

**📊 实验结果**
[结果描述]

**✨ 主要贡献**
[贡献描述]

**🔑 关键术语**
- 术语1
- 术语2
- 术语3

**💻 代码**
[如有] GitHub链接

---
完整摘要已保存到: papers/summaries/[文件名]
```

#### 步骤7: 测试

```bash
# 测试1: 解析本地PDF
python .claude/skills/paper-summarizer/scripts/pdf_parser.py tests/sample_paper.pdf

# 测试2: 解析arXiv论文
python .claude/skills/paper-summarizer/scripts/pdf_parser.py "2103.00020"

# 测试3: 完整工作流
/summarize "https://arxiv.org/abs/2103.00020"
```

#### 步骤8: 发布

1. 创建GitHub仓库
2. 添加README（使用5.3.2的模板）
3. 添加LICENSE文件
4. 推送代码
5. 创建Release
6. 分享到社区

📸 **截图位置7**: 显示完整的论文摘要生成过程，从输入到输出的每个步骤。

### 6.2 案例2: 构建"代码规范检查器"Skill

**项目背景**: 为团队创建一个Skill，自动检查代码是否符合团队规范。

**需求分析**:
1. 支持Python/JavaScript/TypeScript
2. 检查命名规范、注释规范、代码结构
3. 生成改进建议报告

**实现要点**（简要说明，完整代码略）:

```python
# 核心检查器结构
class CodeStyleChecker:
    def __init__(self, language: str):
        self.language = language
        self.rules = self._load_rules()

    def check(self, code: str) -> List[Issue]:
        """执行所有检查"""
        issues = []
        issues.extend(self._check_naming(code))
        issues.extend(self._check_comments(code))
        issues.extend(self._check_complexity(code))
        return issues

    def _check_naming(self, code: str) -> List[Issue]:
        """检查命名规范"""
        # 变量命名（camelCase vs snake_case）
        # 类命名（PascalCase）
        # 常量命名（UPPER_SNAKE_CASE）
        pass

    def _check_comments(self, code: str) -> List[Issue]:
        """检查注释规范"""
        # 函数必须有文档字符串
        # 复杂逻辑必须有注释
        # 注释与代码比例
        pass

    def _check_complexity(self, code: str) -> List[Issue]:
        """检查代码复杂度"""
        # 圈复杂度
        # 嵌套层级
        # 函数长度
        pass
```

**关键实现细节**:

1. **多语言支持策略**: 为每种语言定义不同的规则集，使用策略模式实现。
2. **规则可配置化**: 通过JSON文件定义团队规范，支持自定义规则。
3. **增量检查**: 只检查Git diff中的改动代码，提升效率。
4. **IDE集成**: 提供VSCode扩展接口，实时检查代码。

---

## 总结

通过本指南的6个章节学习，你已经全面掌握了Skills开发的核心知识：

### 📚 知识体系回顾

| 章节 | 核心内容 | 关键技能 |
|------|---------|---------|
| **第一章** | 高级开发技术 | 多步骤工作流、状态管理、错误恢复、DAG依赖、并行执行 |
| **第二章** | Scripts集成 | Python规范、参数传递、stdin/stdout、性能优化、调试技巧 |
| **第三章** | 领域Skill设计 | 技术写作、代码审查、数据分析、模板化设计 |
| **第四章** | 项目脚本分析 | 20个脚本深度剖析、数据驱动、规则演进 |
| **第五章** | 调试与发布 | 10大问题排查、5大性能优化、发布规范 |
| **第六章** | 完整实战案例 | 论文摘要器、代码检查器、从零到一实战 |

### 🎯 核心开发原则

1. **模块化设计** - 每个脚本单一职责，通过组合实现复杂功能
2. **数据驱动** - 从历史数据中学习规律，持续优化规则
3. **健壮性优先** - 完善的错误处理和恢复机制
4. **可观测性** - 结构化日志、工作流追踪、性能监控

### 🛠️ 实战开发流程

1. **需求分析** → 明确问题、定义输入输出、识别风险
2. **架构设计** → 目录结构、数据流、依赖关系
3. **原型开发** → MVP实现、核心脚本、配置文件
4. **测试验证** → 单元测试、集成测试、边界测试
5. **优化迭代** → 性能基准、缓存优化、日志完善
6. **文档与发布** → README、示例、开源发布

### 📊 性能优化速查表

| 优化项 | 效果 | 适用场景 | 难度 |
|--------|------|----------|------|
| **缓存结果** | 10x+ | 重复计算 | ⭐ 简单 |
| **正则预编译** | 3-5x | 模式匹配 | ⭐ 简单 |
| **join拼接** | 10x+ | 字符串操作 | ⭐ 简单 |
| **并行执行** | 2-3x | 独立任务 | ⭐⭐ 中等 |
| **按需加载** | 5-10x | Prompts管理 | ⭐⭐ 中等 |

### 🚀 进阶学习建议

- **初级（0-3月）**: 从Python脚本模板开始，实现单功能Skill
- **中级（3-6月）**: 学习工作流编排，实现多步骤复杂Skill
- **高级（6月+）**: 研究数据驱动模式，构建可复用的Skill库

### 🎓 最佳实践清单

**设计阶段**: 明确职责、定义接口、识别依赖、规划错误处理
**开发阶段**: 统一模板、详细注释、参数验证、结构化日志
**测试阶段**: 单元测试、边界测试、兼容性验证、性能基准
**发布阶段**: 完整README、安装步骤、使用示例、开源协议

### 💡 未来发展方向

1. **AI增强** - 多模型协作、自动优化、智能修复
2. **协作能力** - Skills消息传递、共享状态、分布式执行
3. **可视化** - 工作流编辑器、监控面板、性能图表
4. **商业化** - Skills市场、订阅服务、企业定制

### 🌟 结语

Skills开发结合了编程、架构设计和AI提示词工程。记住三个核心原则：

1. **Keep it Simple** - 简单的设计最可靠
2. **Data Driven** - 用数据而非猜测
3. **User First** - 为用户体验优化

现在，是时候动手创建你的第一个Skill了！从一个小而美的功能开始，逐步迭代，最终构建出强大的AI辅助工具。

祝你开发顺利！🎉

---

## 附录A: 完整截图说明

本文档应包含7处关键截图：

1. **工作流执行日志** (1.5节) - JSON日志文件结构
2. **脚本输入输出** (2.5节) - stderr日志与stdout结果分离
3. **性能基准测试** (2.6节) - 优化前后对比数据
4. **YAML语法错误** (5.1节) - 验证器报错信息
5. **性能优化对比** (5.2节) - 5个案例的效果图表
6. **GitHub仓库页面** (5.3节) - README、License、Releases
7. **论文摘要流程** (6.1节) - 从输入到输出的完整过程

---

## 附录B: 术语表

| 术语 | 英文 | 解释 |
|------|------|------|
| Skill | Skill | Claude Code的功能扩展模块 |
| Prompt | Prompt | 给AI的指令或提示词 |
| 工作流 | Workflow | 多个步骤组成的自动化流程 |
| 状态管理 | State Management | 保存和恢复执行状态的机制 |
| DAG | Directed Acyclic Graph | 有向无环图，用于表示依赖关系 |
| 降级策略 | Fallback Strategy | 主方案失败后的备选方案 |
| 缓存 | Cache | 临时存储计算结果以提升性能 |
| 日志轮转 | Log Rotation | 限制日志文件大小的机制 |
| 原子操作 | Atomic Operation | 不可分割的操作，确保数据一致性 |

---

## 附录C: 快速参考卡片

```
┌─────────────────────────────────────────┐
│  Skills开发快速参考卡片                  │
├─────────────────────────────────────────┤
│  📁 目录结构                             │
│  .claude/skills/[skill-name]/          │
│  ├── skill.yaml                         │
│  ├── prompts/                           │
│  ├── scripts/                           │
│  └── README.md                          │
│                                         │
│  ⚙️ skill.yaml必需字段                  │
│  - name: "Skill名称"                    │
│  - triggers: {keywords: [...]}          │
│                                         │
│  🐍 脚本模板核心                        │
│  1. UTF-8输出配置                       │
│  2. 参数解析                            │
│  3. 错误处理                            │
│  4. JSON输出                            │
│  5. 退出码管理                          │
│                                         │
│  🔍 调试命令                            │
│  - python -m py_compile                │
│  - python -c "import yaml"             │
│  - pip list                            │
│                                         │
│  ⚡ 性能优化优先级                      │
│  1. @lru_cache缓存                     │
│  2. 预编译正则                          │
│  3. join()拼接                          │
│  4. 异步并发                            │
│  5. 按需加载                            │
│                                         │
│  ✅ 发布前检查                          │
│  □ 功能测试                             │
│  □ 跨平台兼容                          │
│  □ README完整                           │
│  □ 无硬编码                             │
│  □ 开源协议                             │
└─────────────────────────────────────────┘
```

---

**文档结束** 🎉

- **总字数**: 约13,000字
- **最后更新**: 2025-12-11
- **版本**: 2.0.0（深度扩充版）

**更新日志**:
- **V2.0.0 (2025-12-11)**: 深度扩充至13,000字，新增第五章、第六章，补充7处截图说明和3个附录
- **V1.0.0 (2025-12-11)**: 初始版本，3,753字
