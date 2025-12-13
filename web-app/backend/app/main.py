# -*- coding: utf-8 -*-
"""
FastAPI后端 - 公众号写作助手Web版
V1.0 MVP

功能：封装现有Python脚本为REST API
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import sys
from pathlib import Path

# 添加脚本目录到Python路径
project_root = Path(__file__).parent.parent.parent.parent
scripts_dir = project_root / '.claude/skills/gongzhonghao-writer/scripts'
sys.path.insert(0, str(scripts_dir))

# 导入现有脚本
try:
    from core.title_generator import TitleGenerator
    from core.quality_detector import QualityDetector
    from core.topic_filter import TopicFilterV3
    from config.brands import CORE_BRANDS, DATA_VERSION
    SCRIPTS_AVAILABLE = True
except ImportError as e:
    print(f"Warning: 脚本导入失败，使用Mock数据: {e}")
    SCRIPTS_AVAILABLE = False
    CORE_BRANDS = {}
    DATA_VERSION = {"version": "V7.2"}

app = FastAPI(
    title="公众号写作助手API",
    version="1.0.0",
    description="基于老金爆款公式的AI写作API"
)

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js开发服务器
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# 数据模型
# ============================================================

class TitleRequest(BaseModel):
    topic: str
    count: int = 5

class QualityCheckRequest(BaseModel):
    content: str
    file_path: str = None

class TopicFilterRequest(BaseModel):
    topic: str

# ============================================================
# API路由
# ============================================================

@app.get("/")
async def root():
    """API根路径"""
    return {
        "name": "公众号写作助手API",
        "version": "1.0.0",
        "data_version": DATA_VERSION,
        "endpoints": [
            "/api/title/generate",
            "/api/quality/check",
            "/api/topic/filter",
            "/api/config/brands"
        ]
    }

@app.post("/api/title/generate")
async def generate_titles(request: TitleRequest) -> Dict[str, Any]:
    """
    生成爆款标题

    复用：title_generator.py
    """
    try:
        if not SCRIPTS_AVAILABLE:
            # Mock数据
            return {
                "success": True,
                "data": {
                    "titles": [
                        {
                            "title": f"放弃{request.topic.split()[0] if request.topic else 'XX'}，我全面转向Claude Code",
                            "formula": "品牌动作型",
                            "seo_score": 75,
                            "baokuan_index": 4.2,
                            "reason": "包含品牌词和强动作词"
                        }
                    ]
                }
            }

        # TODO: 调用实际脚本
        # generator = TitleGenerator(request.topic)
        # result = generator.generate_with_reasons()
        return {
            "success": True,
            "data": {"titles": []}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/quality/check")
async def check_quality(request: QualityCheckRequest) -> Dict[str, Any]:
    """
    质量检测

    复用：quality_detector.py
    """
    try:
        detector = QualityDetector(request.content)
        result = detector.comprehensive_check()
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/topic/filter")
async def filter_topic(request: TopicFilterRequest) -> Dict[str, Any]:
    """
    选题过滤

    复用：topic_filter.py
    """
    try:
        filter_instance = TopicFilterV3(request.topic)
        result = filter_instance.evaluate()
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/config/brands")
async def get_brands() -> Dict[str, Any]:
    """
    获取品牌词库配置

    复用：config/brands.py
    """
    return {
        "success": True,
        "data": {
            "core_brands": CORE_BRANDS,
            "data_version": DATA_VERSION
        }
    }

# ============================================================
# 健康检查
# ============================================================

@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
