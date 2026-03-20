// ================================================
// 公司网页后端服务器
// 技术栈: Node.js + Express
// ================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

// ================================================
// 初始化Express应用
// ================================================

const app = express();
const PORT = process.env.PORT || 3000;

// ================================================
// 中间件配置
// ================================================

// CORS配置 - 允许前端跨域请求
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5500', // Live Server默认端口
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5500',
        // 部署后添加您的域名
        // 'https://yourdomain.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// 解析JSON请求体
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 提供静态文件（前端文件）
app.use(express.static(path.join(__dirname)));

// ================================================
// 内存数据存储（用于演示）
// 生产环境应使用数据库如MongoDB或PostgreSQL
// ================================================

const contactMessages = [];
const newsletter = [];

// ================================================
// API路由
// ================================================

/**
 * 健康检查端点 - 验证服务器是否运行
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: '服务器运行正常',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

/**
 * POST /api/contact - 处理联系表单提交
 */
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // ===== 数据验证 =====
        const errors = {};

        // 验证名字
        if (!name || name.trim().length === 0) {
            errors.name = '名字不能为空';
        } else if (name.trim().length < 2) {
            errors.name = '名字至少需要2个字符';
        }

        // 验证邮箱
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || email.trim().length === 0) {
            errors.email = '邮箱不能为空';
        } else if (!emailRegex.test(email)) {
            errors.email = '邮箱格式不正确';
        }

        // 验证主题
        if (!subject || subject.trim().length === 0) {
            errors.subject = '主题不能为空';
        } else if (subject.trim().length < 5) {
            errors.subject = '主题至少需要5个字符';
        }

        // 验证留言
        if (!message || message.trim().length === 0) {
            errors.message = '留言不能为空';
        } else if (message.trim().length < 10) {
            errors.message = '留言至少需要10个字符';
        }

        // 如果有验证错误，返回400
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                success: false,
                message: '表单验证失败',
                errors: errors
            });
        }

        // ===== 保存消息 =====
        const messageData = {
            id: uuidv4(),
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
            timestamp: new Date().toISOString(),
            ipAddress: req.ip,
            status: 'unread'
        };

        contactMessages.push(messageData);

        // ===== 发送邮件（可选）=====
        // 如果配置了SMTP服务，可以在这里发送邮件通知
        // 详见下面的sendEmail函数

        console.log('✓ 新消息已收到:', {
            id: messageData.id,
            from: messageData.name,
            email: messageData.email
        });

        // ===== 返回成功响应 =====
        res.status(201).json({
            success: true,
            message: '✓ 您的消息已成功提交！我们会尽快与您联系。',
            messageId: messageData.id,
            timestamp: messageData.timestamp
        });

    } catch (error) {
        console.error('❌ 处理联系表单时出错:', error);
        res.status(500).json({
            success: false,
            message: '服务器出错，请稍后重试',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

/**
 * GET /api/contact - 获取所有联系消息（管理员接口）
 */
app.get('/api/contact', (req, res) => {
    // 在生产环境中需要添加身份验证
    const adminToken = req.headers['x-admin-token'];
    
    if (adminToken !== 'your-secret-admin-token') {
        return res.status(401).json({
            success: false,
            message: '未授权的访问'
        });
    }

    res.json({
        success: true,
        total: contactMessages.length,
        messages: contactMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    });
});

/**
 * GET /api/contact/:id - 获取单条消息
 */
app.get('/api/contact/:id', (req, res) => {
    const adminToken = req.headers['x-admin-token'];
    
    if (adminToken !== 'your-secret-admin-token') {
        return res.status(401).json({
            success: false,
            message: '未授权的访问'
        });
    }

    const message = contactMessages.find(m => m.id === req.params.id);
    
    if (!message) {
        return res.status(404).json({
            success: false,
            message: '消息未找到'
        });
    }

    res.json({
        success: true,
        message: message
    });
});

/**
 * PUT /api/contact/:id/status - 更新消息状态
 */
app.put('/api/contact/:id/status', (req, res) => {
    const adminToken = req.headers['x-admin-token'];
    
    if (adminToken !== 'your-secret-admin-token') {
        return res.status(401).json({
            success: false,
            message: '未授权的访问'
        });
    }

    const { status } = req.body;
    const message = contactMessages.find(m => m.id === req.params.id);
    
    if (!message) {
        return res.status(404).json({
            success: false,
            message: '消息未找到'
        });
    }

    message.status = status || 'read';
    
    res.json({
        success: true,
        message: '状态已更新',
        data: message
    });
});

/**
 * DELETE /api/contact/:id - 删除消息
 */
app.delete('/api/contact/:id', (req, res) => {
    const adminToken = req.headers['x-admin-token'];
    
    if (adminToken !== 'your-secret-admin-token') {
        return res.status(401).json({
            success: false,
            message: '未授权的访问'
        });
    }

    const index = contactMessages.findIndex(m => m.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: '消息未找到'
        });
    }

    const deleted = contactMessages.splice(index, 1);
    
    res.json({
        success: true,
        message: '消息已删除',
        deleted: deleted[0]
    });
});

/**
 * POST /api/newsletter - 订阅新闻通讯
 */
app.post('/api/newsletter', (req, res) => {
    try {
        const { email } = req.body;

        // 验证邮箱
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: '邮箱格式不正确'
            });
        }

        // 检查是否已存在
        if (newsletter.some(item => item.email === email.trim())) {
            return res.status(400).json({
                success: false,
                message: '该邮箱已订阅'
            });
        }

        // 添加订阅
        newsletter.push({
            id: uuidv4(),
            email: email.trim(),
            subscribedAt: new Date().toISOString(),
            status: 'active'
        });

        res.status(201).json({
            success: true,
            message: '✓ 订阅成功！感谢您的关注。'
        });

    } catch (error) {
        console.error('❌ 处理订阅时出错:', error);
        res.status(500).json({
            success: false,
            message: '服务器出错，请稍后重试'
        });
    }
});

/**
 * GET /api/newsletter - 获取所有订阅者（管理员接口）
 */
app.get('/api/newsletter', (req, res) => {
    const adminToken = req.headers['x-admin-token'];
    
    if (adminToken !== 'your-secret-admin-token') {
        return res.status(401).json({
            success: false,
            message: '未授权的访问'
        });
    }

    res.json({
        success: true,
        total: newsletter.length,
        subscribers: newsletter.sort((a, b) => new Date(b.subscribedAt) - new Date(a.subscribedAt))
    });
});

/**
 * GET /api/stats - 获取网站统计信息
 */
app.get('/api/stats', (req, res) => {
    const adminToken = req.headers['x-admin-token'];
    
    if (adminToken !== 'your-secret-admin-token') {
        return res.status(401).json({
            success: false,
            message: '未授权的访问'
        });
    }

    res.json({
        success: true,
        stats: {
            totalMessages: contactMessages.length,
            unreadMessages: contactMessages.filter(m => m.status === 'unread').length,
            totalSubscribers: newsletter.length,
            serverUptime: Math.floor(process.uptime()),
            lastMessage: contactMessages[contactMessages.length - 1] || null
        }
    });
});

// ================================================
// 前端路由 - 返回index.html用于SPA
// ================================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ================================================
// 404处理
// ================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '请求的资源不存在',
        path: req.path
    });
});

// ================================================
// 错误处理中间件
// ================================================

app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ================================================
// 启动服务器
// ================================================

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   TechCorp 公司网页后端服务已启动         ║
╚════════════════════════════════════════════╝

🌐 服务器运行地址: http://localhost:${PORT}
🔧 开发模式: ${process.env.NODE_ENV || 'development'}
📝 API文档: http://localhost:${PORT}/api

📌 可用的API端点:
   GET  /api/health                - 健康检查
   POST /api/contact               - 提交联系表单
   GET  /api/contact               - 获取所有消息(需要admin token)
   POST /api/newsletter            - 订阅新闻通讯
   GET  /api/newsletter            - 获取所有订阅者(需要admin token)
   GET  /api/stats                 - 获取统计信息(需要admin token)

⚠️  注意: 目前使用内存存储，服务器重启后数据会丢失
   生产环境需要配置真实数据库(MongoDB / PostgreSQL)

按 Ctrl+C 停止服务器
    `);
});

// ================================================
// 优雅关闭
// ================================================

process.on('SIGTERM', () => {
    console.log('📢 收到SIGTERM信号，服务器即将关闭...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\n📢 服务器已停止');
    process.exit(0);
});

module.exports = app;
