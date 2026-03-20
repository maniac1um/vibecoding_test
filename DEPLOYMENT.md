# ================================================
# 部署指南 - 快速上线
# ================================================

## 方案1: 使用Vercel部署（推荐✓ 最简单）

### 步骤1: 准备工作
1. 注册Vercel账号: https://vercel.com
2. 关联您的GitHub账号（或使用其他Git服务）
3. 将本项目上传到GitHub仓库

### 步骤2: 部署应用
1. 登录Vercel.com
2. 点击 "New Project"
3. 导入您的GitHub仓库
4. Vercel会自动读取 `vercel.json` 配置
5. 点击 "Deploy" 即可开始部署
6. 部署完成后，您会获得一个公网URL

### 步骤3: 配置环境变量
1. 进入项目的 Settings > Environment Variables
2. 添加以下变量:
   - `NODE_ENV`: production
   - `ADMIN_TOKEN`: 设置一个安全的token（如: your-super-secret-key-12345）

### 使用您的自定义域名
1. Settings > Domains
2. 添加您的域名
3. 按照说明配置DNS记录

---

## 方案2: 使用Heroku部署

### 前置条件
- 安装Git: https://git-scm.com
- 安装Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

### 部署步骤
1. 初始化Git仓库:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. 登录Heroku:
   ```bash
   heroku login
   ```

3. 创建Heroku应用:
   ```bash
   heroku create your-app-name
   ```

4. 配置环境变量:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set ADMIN_TOKEN=your-secure-token
   ```

5. 部署代码:
   ```bash
   git push heroku main
   ```

6. 查看日志（调试用）:
   ```bash
   heroku logs --tail
   ```

### 查看部署结果
- 您的应用会运行在: `https://your-app-name.herokuapp.com`
- 使用 `heroku open` 在浏览器中打开

---

## 方案3: 使用Railway部署

### 步骤
1. 访问 https://railway.app
2. 使用GitHub账号登录
3. 创建新项目，选择"Deploy from GitHub"
4. 授权并选择第一次部署后会自动配置
5. 在Project Settings中配置环境变量

---

## 方案4: 使用Docker + 云服务器部署

### 创建Dockerfile
在项目根目录创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### 本地构建和测试
```bash
# 构建Docker镜像
docker build -t techcorp-website .

# 运行容器
docker run -p 3000:3000 techcorp-website

# 访问 http://localhost:3000
```

### 上传到云服务器
1. 推送镜像到Docker Hub、阿里云镜像仓库等
2. 在云服务器上拉取并运行镜像
3. 配置Nginx反向代理

---

## 本地开发和测试

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
# 方式1: 普通启动
npm start

# 方式2: 监听文件变化自动重启(推荐开发环境)
npm run dev
```

### 访问应用
- 前端: http://localhost:3000
- 健康检查: http://localhost:3000/api/health
- API文档: http://localhost:3000/api

### 测试表单提交
1. 打开网页，滚动到联系方式
2. 填写表单并提交
3. 应能看到成功提示
4. 后台console会记录消息

---

## 部署后的常见配置

### 1. 自定义域名
- Vercel: Settings > Domains
- Heroku: heroku domains:add your-domain.com
- Railway: Settings > Custom Domain

### 2. SSL/HTTPS证书
- Vercel: 自动配置
- Heroku: 自动配置
- Railway: 自动配置
- 自建服务器: 使用Let's Encrypt

### 3. 数据库迁移
当前使用内存存储，需要数据持久化时:

```javascript
// 将来升级存储方案
// 1. MongoDB Atlas (云数据库)
const mongoose = require('mongoose');
// 2. PostgreSQL + Prisma
// 3. Firebase Firestore
```

### 4. 配置邮件通知
编辑 server.js 中的sendEmail函数，配置SMTP服务:

```javascript
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});
```

---

## 监控和维护

### 检查服务器状态
```bash
# 健康检查
curl https://your-domain.com/api/health

# 或在浏览器中访问
# https://your-domain.com/api/health
```

### 查看消息和订阅者
```bash
# 获取所有联系消息
curl -H "x-admin-token: your-token" https://your-domain.com/api/contact

# 获取所有订阅者
curl -H "x-admin-token: your-token" https://your-domain.com/api/newsletter

# 获取统计信息
curl -H "x-admin-token: your-token" https://your-domain.com/api/stats
```

### 日志和错误追踪
- Vercel: Deployments > 选择部署 > Logs
- Heroku: `heroku logs --tail`
- Railway: Dashboard > Logs

---

## 优化建议

### 生产环境优化
1. ✓ 启用GZIP压缩
2. ✓ 配置缓存头
3. ✓ 使用CDN加速静态资源
4. ✓ 实现速率限制防止滥用
5. ✓ 启用CORS安全验证
6. ✓ 定期备份数据库

### 安全建议
1. 更改ADMIN_TOKEN为复杂值
2. 启用HTTPS（所有部署平台默认启用）
3. 定期更新依赖包: `npm update`
4. 添加身份验证和授权机制
5. 监控异常流量和请求

---

## 故障排查

### 部署后无法访问
1. 检查部署状态（Build失败？）
2. 查看日志输出
3. 确认环境变量已配置
4. 检查防火墙/DNS设置

### 表单提交失败
1. 打开浏览器开发者工具 (F12)
2. 检查Network标签，查看API响应
3. 确保API地址配置正确
4. 检查CORS配置

### 邮件发送不工作
1. 验证SMTP配置
2. 查看服务器日志
3. 检查防火墙是否阻止了SMTP端口

---

## FAQ

**Q: 数据会保存吗？**
A: 当前使用内存存储，服务器重启后会丢失。需要配置真实数据库（MongoDB/PostgreSQL）以持久化数据。

**Q: 如何修改表单字段？**
A: 编辑 index.html 的contact section，然后在 server.js 的POST /api/contact端点中添加新的验证字段。

**Q: 支持多语言吗？**
A: 当前不支持。可以通过i18n库实现国际化。

**Q: 可以添加支付功能吗？**
A: 可以，集成Stripe、支付宝等第三方支付API即可。

---

需要帮助？请查看具体的部署平台文档或与我们联系。
