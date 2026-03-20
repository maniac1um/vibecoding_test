#!/bin/bash
# =========================================================
# TechCorp 公司网页 - 快速启动脚本 (Mac/Linux)
# =========================================================

echo ""
echo "===================================================="
echo "  TechCorp 公司网页 - 快速启动"
echo "===================================================="
echo ""

# 检查Node.js是否已安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到Node.js"
    echo "请从 https://nodejs.org 下载安装"
    exit 1
fi

echo "✓ 检测到Node.js"
node --version

# 检查依赖是否已安装
if [ ! -d "node_modules" ]; then
    echo ""
    echo "正在安装依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 错误: npm install 失败"
        exit 1
    fi
fi

echo ""
echo "===================================================="
echo "   启动服务..."
echo "===================================================="
echo ""
echo "🌐 前端访问: http://localhost:3000"
echo "👨‍💼 管理后台: http://localhost:3000/admin.html"
echo ""
echo "按 Ctrl+C 可停止服务"
echo ""

# 启动服务
npm run dev

if [ $? -ne 0 ]; then
    echo "❌ 错误: 启动失败"
    exit 1
fi
