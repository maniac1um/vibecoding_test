# TechCorp 后端API文档

## 📌 基础信息

- **基础URL**: `https://your-domain.com` (部署后) 或 `http://localhost:3000` (本地)
- **API前缀**: `/api`
- **数据格式**: JSON
- **认证**: 使用Header中的 `x-admin-token`

---

## 🔐 认证

管理接口需要在HTTP Header中提供管理员token：

```bash
x-admin-token: your-secret-admin-token
```

### 获取Token
编辑 `.env` 文件中的 `ADMIN_TOKEN` 变量，设置一个安全的密钥。

---

## 📚 API端点详细文档

### 1. 健康检查 - Health Check

**端点**: `GET /api/health`

**描述**: 检查服务器是否运行正常

**请求示例**:
```bash
curl http://localhost:3000/api/health
```

**响应示例**:
```json
{
  "status": "ok",
  "message": "服务器运行正常",
  "timestamp": "2026-03-19T10:30:45.123Z",
  "uptime": 3600.5
}
```

**HTTP状态码**: 
- `200` - 服务器正常运行

---

### 2. 提交联系表单 - Submit Contact Form

**端点**: `POST /api/contact`

**描述**: 用户提交联系表单

**请求头**:
```
Content-Type: application/json
```

**请求体**:
```json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "subject": "咨询关于您的服务",
  "message": "我想了解更多关于您的产品和服务的信息。"
}
```

**请求示例** (JavaScript):
```javascript
fetch('http://localhost:3000/api/contact', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: '张三',
    email: 'zhangsan@example.com',
    subject: '咨询服务',
    message: '我想了解您的产品'
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

**请求示例** (curl):
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "email": "zhangsan@example.com",
    "subject": "咨询服务",
    "message": "我想了解您的产品"
  }'
```

**成功响应** (201):
```json
{
  "success": true,
  "message": "✓ 您的消息已成功提交！我们会尽快与您联系。",
  "messageId": "123e4567-e89b-12d3-a456-426614174000",
  "timestamp": "2026-03-19T10:30:45.123Z"
}
```

**验证错误响应** (400):
```json
{
  "success": false,
  "message": "表单验证失败",
  "errors": {
    "email": "邮箱格式不正确",
    "message": "留言至少需要10个字符"
  }
}
```

**字段验证规则**:
| 字段 | 类型 | 要求 | 示例 |
|------|------|------|------|
| name | string | 2-100字符 | "张三" |
| email | string | 有效邮箱格式 | "user@example.com" |
| subject | string | 5-200字符 | "咨询服务" |
| message | string | 10-5000字符 | "这是我的详细留言..." |

---

### 3. 获取所有联系消息 - Get All Contacts

**端点**: `GET /api/contact`

**描述**: 获取所有用户提交的联系记录（需要管理员权限）

**认证**: ✓ 需要

**请求示例**:
```bash
curl -H "x-admin-token: your-secret-token" \
  http://localhost:3000/api/contact
```

**响应示例**:
```json
{
  "success": true,
  "total": 5,
  "messages": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "张三",
      "email": "zhangsan@example.com",
      "subject": "咨询服务",
      "message": "我想了解您的产品...",
      "timestamp": "2026-03-19T10:30:45.123Z",
      "ipAddress": "192.168.1.1",
      "status": "unread"
    }
  ]
}
```

**HTTP状态码**:
- `200` - 成功
- `401` - 无效的token

---

### 4. 获取单条消息 - Get Single Message

**端点**: `GET /api/contact/:id`

**描述**: 获取指定ID的消息详情

**认证**: ✓ 需要

**请求示例**:
```bash
curl -H "x-admin-token: your-secret-token" \
  http://localhost:3000/api/contact/123e4567-e89b-12d3-a456-426614174000
```

**响应示例**:
```json
{
  "success": true,
  "message": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "张三",
    "email": "zhangsan@example.com",
    "subject": "咨询服务",
    "message": "我想了解您的产品...",
    "timestamp": "2026-03-19T10:30:45.123Z",
    "ipAddress": "192.168.1.1",
    "status": "unread"
  }
}
```

---

### 5. 更新消息状态 - Update Message Status

**端点**: `PUT /api/contact/:id/status`

**描述**: 更新消息状态（如标记为已读）

**认证**: ✓ 需要

**请求体**:
```json
{
  "status": "read"
}
```

**请求示例**:
```bash
curl -X PUT -H "x-admin-token: your-secret-token" \
  -H "Content-Type: application/json" \
  -d '{"status":"read"}' \
  http://localhost:3000/api/contact/123e4567-e89b-12d3-a456-426614174000
```

**响应示例**:
```json
{
  "success": true,
  "message": "状态已更新",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "read",
    ...
  }
}
```

---

### 6. 删除消息 - Delete Message

**端点**: `DELETE /api/contact/:id`

**描述**: 删除指定的message

**认证**: ✓ 需要

**请求示例**:
```bash
curl -X DELETE -H "x-admin-token: your-secret-token" \
  http://localhost:3000/api/contact/123e4567-e89b-12d3-a456-426614174000
```

**响应示例**:
```json
{
  "success": true,
  "message": "消息已删除",
  "deleted": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    ...
  }
}
```

---

### 7. 订阅新闻通讯 - Newsletter Subscription

**端点**: `POST /api/newsletter`

**描述**: 用户订阅新闻通讯

**请求体**:
```json
{
  "email": "user@example.com"
}
```

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**成功响应** (201):
```json
{
  "success": true,
  "message": "✓ 订阅成功！感谢您的关注。"
}
```

**错误响应** (400):
```json
{
  "success": false,
  "message": "该邮箱已订阅"
}
```

---

### 8. 获取所有订阅者 - Get All Subscribers

**端点**: `GET /api/newsletter`

**描述**: 获取所有新闻通讯订阅者（需要管理员权限）

**认证**: ✓ 需要

**请求示例**:
```bash
curl -H "x-admin-token: your-secret-token" \
  http://localhost:3000/api/newsletter
```

**响应示例**:
```json
{
  "success": true,
  "total": 10,
  "subscribers": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "subscriber@example.com",
      "subscribedAt": "2026-03-19T10:30:45.123Z",
      "status": "active"
    }
  ]
}
```

---

### 9. 获取统计信息 - Get Statistics

**端点**: `GET /api/stats`

**描述**: 获取网站统计数据（需要管理员权限）

**认证**: ✓ 需要

**请求示例**:
```bash
curl -H "x-admin-token: your-secret-token" \
  http://localhost:3000/api/stats
```

**响应示例**:
```json
{
  "success": true,
  "stats": {
    "totalMessages": 45,
    "unreadMessages": 12,
    "totalSubscribers": 156,
    "serverUptime": 86400,
    "lastMessage": {
      "id": "...",
      "name": "最新消息提交者",
      ...
    }
  }
}
```

---

## 🧪 测试工具推荐

### 1. Postman
- 下载: https://www.postman.com/downloads/
- 用途: 测试API请求、项目文档生成
- 优势: 界面友好、功能强大

### 2. Insomnia
- 下载: https://insomnia.rest/
- 用途: REST API客户端
- 优势: 轻量级、快速

### 3. cURL
- 内置于系统
- 用途: 命令行API测试

### 4. VS Code REST Client
- 扩展: https://marketplace.visualstudio.com/items?itemName=humao.rest-client
- 用途: 在VS Code中直接测试API
- 优势: 无需额外工具

#### VS Code REST Client 示例 (rest.http):

```http
### 健康检查
GET http://localhost:3000/api/health

### 提交联系表单
POST http://localhost:3000/api/contact
Content-Type: application/json

{
  "name": "测试用户",
  "email": "test@example.com",
  "subject": "测试主题",
  "message": "这是一条测试消息内容"
}

### 获取所有消息 (需要token)
GET http://localhost:3000/api/contact
x-admin-token: your-secret-admin-token

### 订阅新闻通讯
POST http://localhost:3000/api/newsletter
Content-Type: application/json

{
  "email": "newsletter@example.com"
}
```

---

## ⚠️ 错误处理

### 常见HTTP状态码

| 状态码 | 含义 | 例子 |
|--------|------|------|
| `200` | 成功 | 获取数据成功 |
| `201` | 创建成功 | 表单提交成功 |
| `400` | 请求错误 | 验证失败 |
| `401` | 未授权 | Token无效 |
| `404` | 未找到 | 资源不存在 |
| `500` | 服务器错误 | 内部错误 |

### 错误响应示例

```json
{
  "success": false,
  "message": "错误描述信息",
  "errors": {
    "字段名": "字段特定错误信息"
  }
}
```

---

## 🚀 实施建议

### 开发阶段
1. 使用 `http://localhost:3000` 作为开发服务器
2. 在浏览器DevTools中测试API
3. 使用Postman导入示例请求

### 生产部署后
1. 更新所有API URL为实际域名
2. 修改 `ADMIN_TOKEN` 为强密码
3. 启用HTTPS（自动）
4. 配置CORS白名单

### 前端集成示例

```javascript
// 设置API基础URL
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// 发送表单
async function submitContact(data) {
  const response = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) throw new Error('提交失败');
  return response.json();
}
```

---

## 📞 支持

如遇到问题，请：
1. 查看服务器日志
2. 验证API端点是否正确
3. 检查token是否有效
4. 查询本文档和部署指南

---

**最后更新**: 2026-03-19
