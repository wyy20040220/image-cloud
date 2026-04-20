# Vercel 部署指南

## 方案特点

- 完全免费
- 固定域名（如 `your-project.vercel.app`）
- 全球 CDN 加速
- 使用 Vercel Blob 存储图片（免费额度足够个人使用）

---

## 部署步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 安装 Vercel CLI

```bash
npm i -g vercel
```

### 3. 登录 Vercel

```bash
vercel login
```

按提示完成登录（会打开浏览器验证）

### 4. 部署

```bash
vercel --prod
```

首次部署会提示配置：
- 项目名：可以使用默认或自定义
- 目录：使用当前目录 `.`

部署成功后，会显示访问地址，如：
```
🔍  Inspect: https://vercel.com/yourname/image-cloud/xxxxx
✅  Production: https://image-cloud-xxxx.vercel.app
```

---

## 配置 Blob 存储

Vercel Blob 需要配置读写权限。

### 方法1：通过 Vercel 控制台配置（推荐）

1. 访问 https://vercel.com/dashboard
2. 进入你的项目
3. 点击 "Storage" → "Create New" → "Blob"
4. 按提示创建 Blob store
5. 系统会自动配置环境变量

### 方法2：手动配置环境变量

在 Vercel 项目设置中添加：

```
BLOB_READ_WRITE_TOKEN=your_blob_token
```

---

## 更新小程序配置

部署成功后，更新小程序的 API 地址：

```javascript
// mini-program/app.js
App({
  globalData: {
    apiBaseUrl: 'https://你的项目名.vercel.app'
  }
});
```

---

## 重新部署

代码更新后，重新部署：

```bash
vercel --prod
```

---

## 免费额度

- **Vercel Hobby**: 免费，无限带宽
- **Vercel Blob**: 每月 1GB 存储，250MB 上传/天

对于个人使用完全足够！

---

## 常见问题

### 1. 部署失败提示 "BLOB_READ_WRITE_TOKEN" 未设置

需要在 Vercel 控制台配置 Blob 存储，参考上面的配置步骤。

### 2. 如何查看日志

```bash
vercel logs
```

或在 Vercel 控制台查看。

### 3. 如何绑定自定义域名

在 Vercel 项目设置 → Domains 中添加你的域名。

---

## 优势对比

| 方案 | 稳定性 | 域名 | 速度 | 配置难度 |
|------|--------|------|------|----------|
| localtunnel | 低 | 会变 | 慢 | 简单 |
| Vercel | 高 | 固定 | 快 | 中等 |
| 云服务器 | 高 | 固定 | 快 | 复杂 |

推荐长期使用 Vercel 方案！
