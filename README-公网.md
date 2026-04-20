# 🌐 公网访问配置

## 快速开始（推荐方案）

### 方案一：LocalTunnel（无需注册，即时可用）

```bash
# 1. 确保服务器在运行（新开终端）
npm start

# 2. 另开终端运行（无需注册）
npx localtunnel --port 3000
```

运行后会显示：
```
your url is: https://xxxx.loca.lt
```

**公网地址**：`https://xxxx.loca.lt`

**小程序配置** (`mini-program/app.js`)：
```javascript
apiBaseUrl: 'https://xxxx.loca.lt'
```

---

### 方案二：Cloudflare Tunnel（稳定，免费）

```bash
# 安装 cloudflared（Mac）
brew install cloudflared

# 运行隧道
cloudflared tunnel --url http://localhost:3000
```

---

### 方案三：Ngrok（最流行，需注册）

1. 注册：https://dashboard.ngrok.com/signup
2. 获取 token：https://dashboard.ngrok.com/get-started/your-authtoken
3. 安装并配置：
```bash
npx ngrok config add-authtoken YOUR_TOKEN
npx ngrok http 3000
```

---

## 自动脚本

创建 `start-public.sh`：
```bash
#!/bin/bash
echo "🚀 启动公网访问..."
echo ""
echo "本地服务: http://localhost:3000"
echo ""
npx localtunnel --port 3000
```

使用方法：
```bash
chmod +x start-public.sh
./start-public.sh
```

---

## 小程序配置步骤

### 1. 修改 app.js

```javascript
App({
  globalData: {
    // 填你的公网地址
    apiBaseUrl: 'https://xxxx.loca.lt'
  },
  ...
});
```

### 2. 配置服务器域名（真机需要）

登录 [微信公众平台](https://mp.weixin.qq.com) → 开发 → 开发设置 → 服务器域名

添加：
- request 域名：`https://xxxx.loca.lt`
- downloadFile 域名：`https://xxxx.loca.lt`

---

## 常见问题

### 1. localtunnel 提示输入 IP
有些版本会要求输入 IP 确认，看到提示时按说明操作即可。

### 2. 域名每次变怎么办？
免费版域名每次重启会变，如需固定域名：
- 使用 Ngrok 付费版
- 或部署到 Railway/Render 免费云服务器

### 3. 手机访问不了？
- 检查手机和电脑是否在同一 WiFi
- 检查防火墙设置
- 使用公网穿透方案

---

## 永久免费部署（推荐生产环境）

### Railway 部署

1. Fork 本项目到 GitHub
2. 访问 https://railway.app
3. New Project → Deploy from GitHub repo
4. 选择本项目，自动部署
5. 获得永久域名如 `https://image-cloud.up.railway.app`

### Render 部署

1. 访问 https://render.com
2. 创建 Web Service
3. 连接 GitHub 仓库
4. Build Command: `npm install`
5. Start Command: `npm start`
6. 免费部署完成

---

## 总结

| 方案 | 难度 | 稳定性 | 推荐场景 |
|------|------|--------|----------|
| localtunnel | ⭐ 简单 | ⭐⭐ 一般 | 临时测试 |
| cloudflared | ⭐⭐ 中等 | ⭐⭐⭐ 好 | 短期使用 |
| ngrok | ⭐⭐ 中等 | ⭐⭐⭐ 好 | 开发调试 |
| Railway | ⭐⭐⭐ 较复杂 | ⭐⭐⭐⭐⭐ 很好 | 长期部署 |
| Render | ⭐⭐⭐ 较复杂 | ⭐⭐⭐⭐⭐ 很好 | 长期部署 |

**快速测试选 localtunnel，长期使用选 Railway/Render**
