// ================================================
// 公司网页交互脚本
// 功能: 菜单操作、表单验证、平滑滚动、动画效果
// ================================================

// ================================================
// 1. DOM元素选择
// ================================================

const hamburger = document.querySelector('.hamburger');
const navbarMenu = document.querySelector('.navbar-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const ctaButton = document.querySelector('.cta-button');

// ================================================
// 2. 汉堡菜单功能 (移动端)
// ================================================

/**
 * 切换移动菜单显示/隐藏
 */
function toggleMenu() {
    hamburger.classList.toggle('active');
    navbarMenu.classList.toggle('active');
}

/**
 * 关闭移动菜单
 */
function closeMenu() {
    hamburger.classList.remove('active');
    navbarMenu.classList.remove('active');
}

// 汉堡菜单点击事件
hamburger.addEventListener('click', toggleMenu);

// 导航链接点击时关闭菜单
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// ================================================
// 3. 表单验证
// ================================================

/**
 * 验证邮箱格式
 * @param {string} email - 要验证的邮箱
 * @returns {boolean} 邮箱是否有效
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 验证表单数据
 * @param {object} formData - 表单数据对象
 * @returns {object} 验证结果 {valid: boolean, errors: {}}
 */
function validateForm(formData) {
    const errors = {};

    // 验证名字
    if (!formData.name.trim()) {
        errors.name = '请输入您的名字';
    } else if (formData.name.trim().length < 2) {
        errors.name = '名字至少需要2个字符';
    }

    // 验证邮箱
    if (!formData.email.trim()) {
        errors.email = '请输入您的邮箱';
    } else if (!validateEmail(formData.email)) {
        errors.email = '邮箱格式不正确';
    }

    // 验证主题
    if (!formData.subject.trim()) {
        errors.subject = '请输入主题';
    } else if (formData.subject.trim().length < 5) {
        errors.subject = '主题至少需要5个字符';
    }

    // 验证留言
    if (!formData.message.trim()) {
        errors.message = '请输入您的留言';
    } else if (formData.message.trim().length < 10) {
        errors.message = '留言至少需要10个字符';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors: errors
    };
}

/**
 * 处理表单提交
 * @param {Event} event - 表单提交事件
 */
function handleFormSubmit(event) {
    event.preventDefault();

    // 获取表单数据
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // 验证表单（前端验证）
    const validation = validateForm(formData);

    if (!validation.valid) {
        console.log('表单验证失败:', validation.errors);
        showFormErrors(validation.errors);
        return;
    }

    // 显示加载状态
    showLoadingState(true);
    clearFormErrors();

    // 发送数据到后端API
    submitFormToBackend(formData);
}

/**
 * 发送表单数据到后端API
 * @param {object} formData - 表单数据
 */
function submitFormToBackend(formData) {
    // 确定API地址
    const apiUrl = getApiUrl() + '/api/contact';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        // 允许跨域请求包含凭证
        credentials: 'include'
    })
    .then(response => {
        // 一定要先检查响应状态
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.message || `HTTP ${response.status}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('✓ 服务器响应:', data);
        
        if (data.success) {
            showSuccessMessage(data.message);
            contactForm.reset();
            clearFormErrors();
        } else {
            showFormErrors(data.errors || {});
            showErrorMessage(data.message);
        }
    })
    .catch((error) => {
        console.error('❌ 提交失败:', error);
        showErrorMessage(`提交失败: ${error.message}`);
    })
    .finally(() => {
        // 隐藏加载状态
        showLoadingState(false);
    });
}

/**
 * 获取API服务器地址
 * @returns {string} API基础URL
 */
function getApiUrl() {
    // 优先从localStorage读取自定义API地址
    const customApi = localStorage.getItem('apiUrl');
    if (customApi) return customApi;

    // 开发环境
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `http://${window.location.hostname}:3000`;
    }

    // 生产环境 - 使用相同的域名
    return window.location.origin;
}

/**
 * 显示/隐藏加载状态
 * @param {boolean} isLoading - 是否显示加载状态
 */
function showLoadingState(isLoading) {
    const submitBtn = contactForm.querySelector('.submit-button');
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '发送中... ⏳';
        submitBtn.style.opacity = '0.7';
    } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '发送消息';
        submitBtn.style.opacity = '1';
    }
}

/**
 * 显示表单错误信息
 * @param {object} errors - 错误对象
 */
function showFormErrors(errors) {
    clearFormErrors();
    
    Object.keys(errors).forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.style.borderColor = '#e74c3c';
            const errorMsg = document.createElement('small');
            errorMsg.style.color = '#e74c3c';
            errorMsg.textContent = errors[field];
            errorMsg.className = 'error-message';
            input.parentElement.appendChild(errorMsg);
        }
    });
}

/**
 * 清除表单错误信息
 */
function clearFormErrors() {
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    document.querySelectorAll('input, textarea').forEach(input => {
        input.style.borderColor = '';
    });
}

/**
 * 显示成功提示信息
 * @param {string} message - 提示信息
 */
function showSuccessMessage(message = '✓ 您的消息已提交成功！\n我们会尽快与您联系。') {
    // 可以改为显示toast提示而非alert
    alert(message);
}

/**
 * 显示错误提示信息
 * @param {string} message - 错误信息
 */
function showErrorMessage(message = '✗ 提交失败，请稍后重试。') {
    alert(message);
}

// 表单提交事件监听
contactForm.addEventListener('submit', handleFormSubmit);

// ================================================
// 4. Call-to-Action按钮功能
// ================================================

/**
 * CTA按钮点击事件 - 滚动到关于我们部分
 */
ctaButton.addEventListener('click', () => {
    const aboutSection = document.getElementById('about');
    aboutSection.scrollIntoView({ behavior: 'smooth' });
});

// ================================================
// 5. 平滑滚动优化
// ================================================

/**
 * 监听所有导航链接的点击事件，实现平滑滚动
 * (HTML中已设置 scroll-behavior: smooth，但为了兼容性添加此处理)
 */
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            event.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ================================================
// 6. 页面加载动画
// ================================================

/**
 * 当页面加载完成时，加载内容方式平滑过渡
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成');
    // 可在此处添加额外的初始化逻辑
});

// ================================================
// 7. 滚动效果 - 导航栏动态效果
// ================================================

let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

/**
 * 监听滚动事件，实现导航栏的动态效果
 */
window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 简单的滚动深度检测
    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ================================================
// 8. 响应式窗口尺寸变化处理
// ================================================

/**
 * 监听窗口尺寸变化，确保菜单状态正确
 */
window.addEventListener('resize', () => {
    // 当窗口宽度超过768px时，关闭移动菜单
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navbarMenu.classList.remove('active');
    }
});

// ================================================
// 9. 辅助工具函数
// ================================================

/**
 * 日志输出函数 (用于调试)
 * @param {string} message - 日志消息
 * @param {*} data - 要记录的数据
 */
function log(message, data = null) {
    console.log(`[TechCorp] ${message}`, data || '');
}

/**
 * 获取当前视口高度
 * @returns {number} 视口高度
 */
function getViewportHeight() {
    return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
}

/**
 * 检查元素是否在视口内
 * @param {Element} element - 要检查的元素
 * @returns {boolean} 元素是否可见
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ================================================
// 10. 页面加载完成 - 初始化日志
// ================================================

log('脚本加载成功');
log('欢迎来到TechCorp网页！');
