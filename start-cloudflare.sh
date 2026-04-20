#!/bin/bash
echo "🚀 启动 Cloudflare Tunnel..."
echo ""
echo "你的服务将通过 Cloudflare 网络暴露到公网"
echo "按 Ctrl+C 停止"
echo ""
cloudflared tunnel run image-cloud
