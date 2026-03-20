@echo off
REM =========================================================
REM TechCorp 公司网页 - Windows启动脚本
REM =========================================================

echo.
echo ====================================================
echo   TechCorp 公司网页 - 快速启动
echo ====================================================
echo.

REM 检查Node.js是否已安装
where node >nul 2>nul
if errorlevel 1 (
    echo 错误: 未检测到Node.js
    echo 请从 https://nodejs.org 下载安装
    pause
    exit /b 1
)

echo ✓ 检测到Node.js
node --version

REM 检查依赖是否已安装
if not exist node_modules (
    echo.
    echo 正在安装依赖包...
    call npm install
    if errorlevel 1 (
        echo 错误: npm install 失败
        pause
        exit /b 1
    )
)

echo.
echo ====================================================
echo   启动服务...
echo ====================================================
echo.
echo 🌐 前端访问: http://localhost:3000
echo 👨‍💼 管理后台: http://localhost:3000/admin.html
echo.
echo 按 Ctrl+C 可停止服务
echo.

REM 启动服务
npm run dev

if errorlevel 1 (
    echo 错误: 启动失败
    pause
    exit /b 1
)
