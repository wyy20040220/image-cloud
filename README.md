# 图云 - 免费图片存储服务

一个完全免费的图片上传、下载服务，支持网页端和小程序访问。

## 功能特点

- 免费开源，无需付费
- 支持图片上传（拖拽/点击）
- 支持图片下载和删除
- 响应式设计，适配手机和电脑
- 微信小程序支持
- 跨域配置，支持多端访问

## 技术栈

- 后端：Node.js + Express + Multer
- 前端：原生 HTML/CSS/JavaScript
- 小程序：微信小程序原生框架

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务器

```bash
npm start
```

服务器将在 http://localhost:3000 运行

### 3. 访问网站

打开浏览器访问 http://localhost:3000

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/images` | GET | 获取所有图片列表 |
| `/api/upload` | POST | 上传图片 |
| `/api/images/:filename` | DELETE | 删除图片 |
| `/api/download/:filename` | GET | 下载图片 |
| `/uploads/:filename` | GET | 直接访问图片 |

## 小程序配置

1. 下载微信开发者工具
2. 导入 `mini-program` 文件夹
3. 修改 `app.js` 中的 `apiBaseUrl` 为你的服务器地址

```javascript
// 本地测试
apiBaseUrl: 'http://localhost:3000'

// 局域网测试（手机真机调试）
apiBaseUrl: 'http://192.168.x.x:3000'

// 生产环境（需要HTTPS）
apiBaseUrl: 'https://your-domain.com'
```

## 免费部署方案

### 方案1：本地运行（开发测试）

直接在本地运行，局域网内设备可访问。

### 方案2：内网穿透（免费）

使用 ngrok 或花生壳进行内网穿透：

```bash
# 安装 ngrok
npm install -g ngrok

# 暴露本地服务
ngrok http 3000
```

### 方案3：免费云服务器

- Railway (railway.app) - 免费额度足够
- Render (render.com) - 免费部署
- Vercel + Serverless Functions

## 项目结构

```
图云/
├── server.js           # 后端服务
├── package.json        # 项目配置
├── public/             # 前端网站
│   └── index.html
├── uploads/            # 上传的图片（自动创建）
└── mini-program/       # 微信小程序
    ├── app.js
    ├── app.json
    ├── pages/
    │   └── index/
    │       ├── index.js
    │       ├── index.wxml
    │       ├── index.wxss
    │       └── index.json
```

## 注意事项

1. 图片默认保存在 `uploads` 文件夹
2. 单文件最大限制 10MB
3. 支持格式：JPG、PNG、GIF、WebP
4. 生产环境建议添加身份验证
5. 定期备份 `uploads` 文件夹

## 许可证

MIT License - 完全免费使用
