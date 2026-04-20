#!/bin/bash

echo "🚀 图云 - Railway 部署助手"
echo ""

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 检查 git
if ! command -v git &> /dev/null; then
    echo "❌ 请先安装 Git"
    exit 1
fi

# 初始化 git
if [ ! -d ".git" ]; then
    echo "${YELLOW}📦 初始化 Git 仓库...${NC}"
    git init
fi

# 添加文件
echo "${YELLOW}📦 添加文件到 Git...${NC}"
git add .

# 提交
echo "${YELLOW}💾 提交更改...${NC}"
git commit -m "Initial commit for Railway deployment" || echo "无更改需要提交"

echo ""
echo "${GREEN}✅ 本地准备完成！${NC}"
echo ""
echo "${CYAN}接下来请按以下步骤操作：${NC}"
echo ""
echo "1️⃣  创建 GitHub 仓库"
echo "   访问: https://github.com/new"
echo "   仓库名: image-cloud (或其他)"
echo ""
echo "2️⃣  连接并推送代码"
echo "   ${YELLOW}git remote add origin https://github.com/你的用户名/image-cloud.git${NC}"
echo "   ${YELLOW}git push -u origin main${NC}"
echo ""
echo "3️⃣  部署到 Railway"
echo "   访问: https://railway.app"
echo "   - 点击 'Start a New Project'"
echo "   - 选择 'Deploy from GitHub repo'"
echo "   - 选择你的 image-cloud 仓库"
echo "   - 点击 'Deploy Now'"
echo ""
echo "4️⃣  获取固定域名"
echo "   部署完成后，在 Railway 项目设置中点击 'Generate Domain'"
echo ""
echo "5️⃣  配置小程序"
echo "   修改 mini-program/app.js 中的 apiBaseUrl 为你的 Railway 域名"
echo ""
echo "${GREEN}🎉 完成后你就有固定域名了！${NC}"
