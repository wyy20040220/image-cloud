#!/bin/bash

echo "🚀 启动内网穿透服务..."
echo ""
echo "正在获取公网地址，请稍候..."
echo ""

# 使用 ngrok 暴露 3000 端口
npx ngrok http 3000
