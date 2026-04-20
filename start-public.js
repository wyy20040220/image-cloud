#!/usr/bin/env node

const { spawn } = require('child_process');
const http = require('http');

console.log('🌐 图云 - 公网访问启动器\n');

// 颜色输出
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`
};

// 等待服务器启动
function waitForServer(url, callback, retries = 30) {
  http.get(url, (res) => {
    callback(true);
  }).on('error', () => {
    if (retries > 0) {
      setTimeout(() => waitForServer(url, callback, retries - 1), 1000);
    } else {
      callback(false);
    }
  });
}

// 启动服务器
console.log(colors.yellow('📦 正在启动本地服务器...'));
const server = spawn('node', ['server.js'], {
  stdio: 'pipe',
  cwd: __dirname
});

server.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('服务器运行')) {
    console.log(colors.green('✅ 本地服务器已启动: http://localhost:3000\n'));
    
    // 等待服务器完全就绪
    setTimeout(() => {
      startTunnel();
    }, 2000);
  }
});

server.stderr.on('data', (data) => {
  console.error(colors.red('服务器错误:'), data.toString());
});

// 启动内网穿透
function startTunnel() {
  console.log(colors.yellow('🌐 正在启动公网隧道...'));
  console.log(colors.cyan('   使用 localtunnel（无需注册）\n'));
  
  const tunnel = spawn('npx', ['localtunnel', '--port', '3000'], {
    stdio: 'pipe',
    cwd: __dirname
  });

  let publicUrl = null;

  tunnel.stdout.on('data', (data) => {
    const output = data.toString();
    
    // 提取公网地址
    const match = output.match(/(https?:\/\/[^\s]+\.loca\.lt)/);
    if (match && !publicUrl) {
      publicUrl = match[1];
      console.log(colors.green('🎉 公网访问地址:'));
      console.log(colors.cyan(`   ${publicUrl}`));
      console.log('');
      console.log(colors.yellow('📱 小程序配置:'));
      console.log(`   修改 mini-program/app.js`);
      console.log(`   apiBaseUrl: '${publicUrl}'`);
      console.log('');
      console.log(colors.yellow('🖼️  图片URL格式:'));
      console.log(`   ${publicUrl}/uploads/xxx.jpg`);
      console.log('');
      console.log(colors.yellow('⚠️  提示: 免费版域名重启后会变化，如需固定请使用 Railway/Render 部署'));
      console.log('');
    }
  });

  tunnel.stderr.on('data', (data) => {
    const output = data.toString();
    // 忽略 npm warn
    if (!output.includes('npm warn')) {
      console.error(colors.red('隧道错误:'), output);
    }
  });

  tunnel.on('close', (code) => {
    console.log(colors.red('\n❌ 公网隧道已关闭'));
    server.kill();
    process.exit(0);
  });
}

// 优雅退出
process.on('SIGINT', () => {
  console.log(colors.yellow('\n\n👋 正在关闭服务...'));
  server.kill();
  process.exit(0);
});

console.log(colors.cyan('按 Ctrl+C 停止服务\n'));
