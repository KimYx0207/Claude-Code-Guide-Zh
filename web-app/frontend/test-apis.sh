#!/bin/bash

# Web GUI API测试脚本
# 用法: ./test-apis.sh [port]
# 默认端口: 3000

PORT=${1:-3000}
BASE_URL="http://localhost:$PORT"

echo "========================================="
echo "Web GUI API测试脚本"
echo "========================================="
echo "测试地址: $BASE_URL"
echo ""

# 测试1: 热点扫描
echo "📌 测试1: 热点扫描API"
curl -s "$BASE_URL/api/hotspot/scan" | jq -r '.success' > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ /api/hotspot/scan - 成功"
  curl -s "$BASE_URL/api/hotspot/scan" | jq '.data.hotspots | length' | xargs echo "   找到热点数量:"
else
  echo "❌ /api/hotspot/scan - 失败"
fi
echo ""

# 测试2: 数据统计
echo "📌 测试2: 数据统计API"
curl -s "$BASE_URL/api/data/stats" | jq -r '.success' > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ /api/data/stats - 成功"
  curl -s "$BASE_URL/api/data/stats" | jq '.data.total' | xargs echo "   总文章数:"
  curl -s "$BASE_URL/api/data/stats" | jq '.data.formulas | length' | xargs echo "   公式数量:"
else
  echo "❌ /api/data/stats - 失败"
fi
echo ""

# 测试3: 文档树
echo "📌 测试3: 文档树API"
curl -s "$BASE_URL/api/docs/list" | jq -r '.success' > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ /api/docs/list - 成功"
  curl -s "$BASE_URL/api/docs/list" | jq '.data.tree | length' | xargs echo "   文档文件夹数:"
else
  echo "❌ /api/docs/list - 失败"
fi
echo ""

# 测试4: 文章列表
echo "📌 测试4: 文章列表API"
curl -s "$BASE_URL/api/articles/list" | jq -r '.success' > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ /api/articles/list - 成功"
  curl -s "$BASE_URL/api/articles/list" | jq '.data.articles | length' | xargs echo "   文章数量:"
else
  echo "❌ /api/articles/list - 失败"
fi
echo ""

echo "========================================="
echo "测试完成!"
echo "========================================="
echo ""
echo "访问Web GUI: $BASE_URL"
echo ""
