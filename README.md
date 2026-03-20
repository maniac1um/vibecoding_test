# 公司网页项目

## 项目概述

一个现代化的公司官方网页，展示公司信息、产品/服务、团队介绍和联系方式。该项目采用响应式设计，可在桌面、平板和手机设备上完美呈现。

## 技术栈

### 前端技术
- **HTML5** - 语义化标记语言，提供网页结构
- **CSS3** - 现代样式表，包含Flexbox布局和媒体查询响应式设计
- **JavaScript (Vanilla)** - 原生JavaScript，无框架依赖，提供交互功能
- **Responsive Design** - 移动优先响应式设计理念

### 开发工具
- VS Code（推荐编辑器）
- Live Server（实时预览）
- Git（版本管理）

## 项目结构

```
company-website/
├── README.md                 # 项目文档
├── index.html                # 主页面（单页应用）
├── css/
│   └── style.css            # 全局样式表（包含响应式CSS）
├── js/
│   └── script.js            # 交互脚本
└── images/                  # 图像资源目录
    ├── logo.png             # 公司Logo
    ├── banner.jpg           # 顶部横幅
    └── team/                # 团队头像
```

## 功能特性

### 1. 导航栏
- 固定顶部导航栏
- 响应式菜单（移动端汉堡菜单）
- 快速导航锚点

### 2. 主要模块
- **首屏区** (Hero Section) - 醒目的品牌展示
- **公司介绍** - 公司使命和价值观
- **产品/服务** - 卡片式展示
- **团队介绍** - 成员卡片展示
- **客户案例** - 合作客户展示
- **联系方式** - 表单和地址信息
- **页脚** - 版权和快速链接

### 3. 交互功能
- 平滑滚动导航
- 移动菜单切换
- 表单验证
- 动画效果（CSS过渡）

## 页面设计规范

### 色彩方案
- 主色: `#007bff` (蓝色)
- 副色: `#6c757d` (灰色)
- 背景: `#ffffff` (白色)
- 文本: `#333333` (深灰)

### 字体
- 标题: 'Segoe UI', 'Microsoft YaHei'
- 正文: 'Segoe UI', 'Helvetica Neue', Arial

### 响应式断点
- 手机: max-width: 576px
- 平板: max-width: 768px
- 桌面: max-width: 1200px

## 快速开始

### 1. 环境准备
```bash
# 克隆或下载项目
git clone <repository-url>
cd company-website

# 或直接打开index.html
```

### 2. 本地开发
```bash
# 使用VS Code Live Server
# 右击 index.html -> Open with Live Server
```

### 3. 浏览
在浏览器中访问 `http://localhost:5500` (Live Server默认端口)

## 文件说明

### index.html
- 包含完整的页面结构
- 使用语义化HTML5标签
- 分为多个Section，便于维护
- 支持SEO优化

### css/style.css
- 使用层叠和继承实现样式管理
- 实现移动优先的响应式设计
- 包含动画和过渡效果
- 注释清晰，易于维护

### js/script.js
- 轻量级交互脚本
- 菜单导航功能
- 表单验证
- 平滑滚动
- 事件监听和DOM操作

## 浏览器兼容性

| 浏览器 | 最低版本 | 支持情况 |
|--------|---------|---------|
| Chrome | 90+ | 完全支持 |
| Firefox | 88+ | 完全支持 |
| Safari | 14+ | 完全支持 |
| Edge | 90+ | 完全支持 |
| IE | 11 | 部分支持(不推荐) |

## 内容管理

### 如何修改内容

1. **公司信息** - 编辑 index.html 中的相应section
2. **样式调整** - 修改 css/style.css
3. **功能增强** - 扩展 js/script.js

### 推荐的修改步骤
1. 打开 index.html
2. 查找对应的 section 标签
3. 修改文本、图片或样式
4. 在浏览器实时预览

## 优化建议

### 性能优化
- 压缩CSS和JavaScript文件
- 图片优化（WebP格式）
- 懒加载实现
- CDN加速

### SEO优化
- 添加Meta标签
- 使用结构化数据 (Schema.org)
- 优化页面标题和描述
- 添加sitemap.xml

### 安全性
- 表单数据验证
- XSS防护
- CSRF令牌（如使用表单提交）

## 后续开发方向

1. **数据动态化** - 整合后端API
2. **内容管理系统** - 使用CMS平台
3. **页面专题** - 添加产品详情页
4. **多语言** - 国际化支持
5. **PWA** - 渐进式Web App
6. **分析统计** - Google Analytics

## 部署

### 静态托管平台
- **GitHub Pages** - 免费，支持自定义域名
- **Netlify** - 自动部署，支持CI/CD
- **Vercel** - 优化的网站托管
- **阿里云OSS** - 国内加速

### 部署步骤示例（GitHub Pages）
```bash
git add .
git commit -m "Initial commit"
git push origin main
# 在GitHub项目设置中启用GitHub Pages
```

## 维护和更新

- 定期检查链接有效性
- 更新内容和图片
- 监测性能指标
- 安全补丁更新

## 许可证

MIT License - 可自由使用和修改

## 联系方式

如有问题或建议，请联系开发团队。

---

最后更新: 2026年3月19日
