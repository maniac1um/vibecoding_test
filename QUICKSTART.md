# 🚀 快速启动指南

## 📋 项目结构概览

```
techcorp-website/
├── README.md                    # 项目总文档
├── DEPLOYMENT.md               # 部署指南（Vercel/Heroku等）
├── API_DOCUMENTATION.md        # API详细文档
├── QUICKSTART.md              # 本文件 - 快速启动
├── package.json               # Node依赖配置
├── server.js                  # ✓ 后端Express服务器（新增）
├── .env.example               # ✓ 环境变量示例
├── vercel.json                # ✓ Vercel部署配置
├── index.html                 # ✓ 前端HTML（已更新）
├── admin.html                 # ✓ 管理后台（新增）
├── css/
│   └── style.css             # 前端样式
├── js/
│   └── script.js             # ✓ 前端脚本（已更新，真实调用API）
└── images/                   # 图像资源
```

---

## ⚡ 3分钟快速启动（本地开发）

### 步骤1: 安装Node.js
- 下载: https://nodejs.org (推荐LTS版本)
- 验证安装: 
  ```bash
  node --version
  npm --version
  ```

### 步骤2: 安装依赖
打开终端/命令行，进入项目目录：

```bash
# 进入项目目录
cd d:\Code

# 安装所有依赖包
npm install
```

输出示例：
```
npm notice created a lockfile as package-lock.json
added 50 packages in 8s
```

### 步骤3: 启动后端服务器

```bash
# 开发模式（监听文件变化自动重启）
npm run dev

# 或普通启动
npm start
```

您应该看到：
```
╔════════════════════════════════════════════╗
║   TechCorp 公司网页后端服务已启动         ║
╚════════════════════════════════════════════╝

🌐 服务器运行地址: http://localhost:3000
```

### 步骤4: 在浏览器中打开

1. 打开浏览器
2. 访问 http://localhost:3000
3. 您会看到完整的公司网页
4. 滚动到"联系方式"部分，填写表单并提交
5. 检查浏览器console，应该看到成功响应

### 步骤5: 查看管理后台

1. 访问 http://localhost:3000/admin.html
2. 获取Admin Token：
   - 当前默认值是 `your-secret-admin-token`
   - 在发出的消息记录中应该能看到
3. 输入token并登录
4. 查看所有表单提交的消息

---

## 🔧 后端功能说明

### Express服务器做什么？

后端服务器（server.js）提供以下功能：

✓ **提供前端文件** - 自动服务所有HTML/CSS/JS文件
✓ **表单API** - 接收和验证前端表单数据
✓ **消息管理** - 存储用户联系消息
✓ **API文档** - 自动CORS支持跨域请求
✓ **管理接口** - 权限验证的消息查看/删除接口

### API端点

一旦启动，您就可以使用这些API：

```bash
# 检查服务器健康状态
curl http://localhost:3000/api/health

# 提交表单（前端自动调用）
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","subject":"Hi","message":"Testing"}'

# 查看所有消息（需要token）
curl -H "x-admin-token: your-secret-admin-token" \
  http://localhost:3000/api/contact

# 详见 API_DOCUMENTATION.md
```

---

## 📝 修改配置

### 修改管理员Token

编辑 `server.js`，找到以下行：

```javascript
if (adminToken !== 'your-secret-admin-token') {
```

改为：

```javascript
if (adminToken !== 'your-new-secure-token-12345') {
```

然后在管理后台使用新token登录。

### 修改服务器端口

编辑 `server.js`：

```javascript
const PORT = process.env.PORT || 3000;  // 改为另一个端口如3001
```

或通过环境变量：

```bash
PORT=3001 npm start
```

### 添加新API端点

在 `server.js` 中添加：

```javascript
/**
 * 您的新API
 */
app.post('/api/my-feature', (req, res) => {
    const data = req.body;
    // 您的业务逻辑
    res.json({ success: true, data: data });
});
```

然后从前端调用：

```javascript
fetch('http://localhost:3000/api/my-feature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ /* 您的数据 */ })
})
```

---

## 🧪 测试表单提交

### 方法1: 直接通过网页界面（推荐）

1. 访问 http://localhost:3000
2. 滚动到"联系方式"
3. 填写邮箱、名字、主题、留言
4. 点击"发送消息"
5. 看到成功提示即表示成功

### 方法2: 使用curl命令

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Zhang San",
    "email": "zhangsan@example.com",
    "subject": "Test subject today",
    "message": "This is a test message from terminal."
  }'
```

### 方法3: 使用Postman

1. 打开Postman
2. 新建POST请求
3. URL: `http://localhost:3000/api/contact`
4. Body > raw > JSON，输入：
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "subject": "Hello",
  "message": "This is a test message from Postman."
}
```
5. 点击Send

### 方法4: 使用VS Code REST Client

在项目根目录创建 `test.http` 文件：

```http
### 提交测试表单
POST http://localhost:3000/api/contact
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "subject": "Test Subject",
  "message": "This is a test message content here"
}

### 获取所有消息
GET http://localhost:3000/api/contact
x-admin-token: your-secret-admin-token

### 健康检查
GET http://localhost:3000/api/health
```

点击代码上方的"Send Request"按钮。

---

## 🔍 调试技巧

### 查看服务器日志

在服务器输出中，您会看到：

```
✓ 新消息已收到: {
  id: '550e8400-e29b-41d4-a716-446655440000',
  from: 'Zhang San',
  email: 'zhangsan@example.com'
}
```

这表示消息已被接收。

### 在浏览器中调试

1. 打开网页 http://localhost:3000
2. 按 `F12` 打开开发者工具
3. 选择"Network"标签
4. 提交表单
5. 查看HTTP请求和响应

您应该看到：
- 请求: POST /api/contact
- 状态: 201 Created
- 响应: `{"success": true, "message": "..."}`

### 查看存储的消息

访问管理后台：
1. http://localhost:3000/admin.html
2. 输入token: `your-secret-admin-token`
3. 点击"登录"
4. 查看所有提交的消息

---

## 🌐 从开发到部署

### 本地测试完成✓

现在您有：
- ✓ 完整的前端网页
- ✓ 工作的后端服务器
- ✓ 表单验证和提交功能
- ✓ 管理后台查看消息

### 准备上线部署

遵循 **DEPLOYMENT.md** 中的步骤，将代码部署到：

- 🚀 **Vercel** (推荐，最简单) - 5分钟内上线
- 🚀 **Heroku** - 需要信用卡但免费层有限
- 🚀 **Railway** - 简单快速
- 🚀 **自己的服务器** - 完全控制

每种方案都在DEPLOYMENT.md中有详细说明。

---

## 📦 生产部署前清单

上线前请检查：

### 代码修改
- [ ] 修改了所有公司信息（名字、邮箱、地址）
- [ ] 更新了联系表单字段（如需要）
- [ ] 修改了管理员token为安全的值
- [ ] 图片已替换为真实资源

### 功能测试
- [ ] 表单提交成功
- [ ] 管理后台可访问
- [ ] 健康检查端点正常
- [ ] 在不同浏览器测试过
- [ ] 在移动设备上测试过

### 部署准备
- [ ] 选择了部署平台
- [ ] vercel.json配置正确
- [ ] .env文件已配置
- [ ] 自定义域名已购买（可选）
- [ ] DNS配置准备好

### 上线检查
- [ ] 所有链接都能正确打开
- [ ] 表单在生产环境可提交
- [ ] 邮件通知已配置（可选）
- [ ] 监控告警已设置（可选）
- [ ] 备份计划已定制

---

## 🆘 常见问题

### Q: npm install 失败怎么办？

**A**: 尝试以下步骤：

```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules和package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### Q: 表单提交后没有反应

**A**: 检查以下几点：

1. 打开浏览器F12，查看Network标签
2. 检查API请求是否发送
3. 查看Response中的错误信息
4. 确保后端服务器运行中（看console输出）

### Q: 如何修改表单字段？

**A**: 编辑以下两处：

1. **前端** - 编辑 `index.html` 的contact section
2. **后端** - 编辑 `server.js` 的验证逻辑

### Q: 数据会保存吗？

**A**: 当前不会。数据存储在内存中，服务器重启会丢失。

要保存数据，需要配置数据库（MongoDB/PostgreSQL）。详见API_DOCUMENTATION.md。

### Q: 如何发送邮件通知？

**A**: 编辑 `server.js`，对接SMTP服务：

```javascript
const nodemailer = require('nodemailer');
// 详见server.js中的注释
```

### Q: 如何部署到自己的服务器？

**A**: 参考 DEPLOYMENT.md 中的 "Docker部署" 部分。

---

## 📚 更多资源

- [Express.js文档](https://expressjs.com/)
- [Node.js官网](https://nodejs.org/)
- [部署指南](./DEPLOYMENT.md)
- [API文档](./API_DOCUMENTATION.md)
- [项目README](./README.md)

---

## 🎉 就这样！

现在您拥有一个完整的、可生产的公司网页系统！

**我了！** ✨

- 本地开发: npm run dev
- 查看网页: http://localhost:3000
- 查看后台: http://localhost:3000/admin.html
- 部署上线: 按照DEPLOYMENT.md操作

任何问题都在各个指南文档中有详细说明。祝您使用愉快！🚀
