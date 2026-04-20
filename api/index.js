const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { put, list, del } = require('@vercel/blob');
const path = require('path');
const fs = require('fs');

const app = express();

// 启用CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// 解析 JSON
app.use(express.json());

// 内存存储（用于 multer）
const upload = multer({ storage: multer.memoryStorage() });

// 静态页面 HTML
const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>图云 - 免费图片存储服务</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        header { text-align: center; color: white; padding: 40px 0; }
        h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .subtitle { opacity: 0.9; font-size: 1.1rem; }
        .upload-section { background: white; border-radius: 16px; padding: 40px; margin-bottom: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .upload-area { border: 3px dashed #667eea; border-radius: 12px; padding: 60px 20px; text-align: center; cursor: pointer; transition: all 0.3s; background: #f8f9ff; }
        .upload-area:hover { background: #eef1ff; border-color: #764ba2; }
        .upload-area.dragover { background: #e0e5ff; border-color: #764ba2; }
        .upload-icon { font-size: 48px; margin-bottom: 15px; }
        .upload-text { color: #666; font-size: 1.1rem; margin-bottom: 10px; }
        .upload-hint { color: #999; font-size: 0.9rem; }
        input[type="file"] { display: none; }
        .gallery-section { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .section-title { font-size: 1.5rem; margin-bottom: 20px; color: #333; display: flex; justify-content: space-between; align-items: center; }
        .refresh-btn { background: #667eea; color: white; border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer; font-size: 0.9rem; transition: background 0.3s; }
        .refresh-btn:hover { background: #764ba2; }
        .image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .image-card { border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s; position: relative; background: #f5f5f5; }
        .image-card:hover { transform: translateY(-5px); }
        .image-card img { width: 100%; height: 200px; object-fit: cover; display: block; cursor: pointer; }
        .image-actions { display: flex; padding: 10px; gap: 10px; }
        .btn { flex: 1; padding: 8px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; transition: all 0.3s; }
        .btn-download { background: #667eea; color: white; }
        .btn-download:hover { background: #5a67d8; }
        .btn-delete { background: #ff6b6b; color: white; }
        .btn-delete:hover { background: #ff5252; }
        .empty-state { text-align: center; padding: 60px 20px; color: #999; }
        .empty-icon { font-size: 64px; margin-bottom: 20px; }
        .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: #333; color: white; padding: 12px 30px; border-radius: 25px; z-index: 1000; opacity: 0; transition: opacity 0.3s; }
        .toast.show { opacity: 1; }
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 2000; justify-content: center; align-items: center; padding: 20px; }
        .modal.show { display: flex; }
        .modal-content { background: white; border-radius: 16px; padding: 30px; max-width: 500px; width: 100%; }
        .modal-title { font-size: 1.3rem; margin-bottom: 20px; color: #333; }
        .url-box { background: #f5f5f5; border-radius: 8px; padding: 15px; margin-bottom: 20px; word-break: break-all; font-family: monospace; font-size: 0.9rem; color: #667eea; border: 1px solid #e0e0e0; }
        .modal-actions { display: flex; gap: 10px; }
        .modal-btn { flex: 1; padding: 12px; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }
        .btn-copy { background: #667eea; color: white; }
        .btn-close { background: #e0e0e0; color: #666; }
        @media (max-width: 600px) { h1 { font-size: 1.8rem; } .upload-section, .gallery-section { padding: 20px; } .image-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>图云</h1>
            <p class="subtitle">免费图片上传下载服务 | 支持小程序访问</p>
        </header>
        <div class="upload-section">
            <div class="upload-area" id="uploadArea">
                <div class="upload-icon">📤</div>
                <div class="upload-text">点击或拖拽上传图片</div>
                <div class="upload-hint">支持 JPG、PNG、GIF、WebP 格式，最大 10MB</div>
                <input type="file" id="fileInput" accept="image/*" multiple>
            </div>
        </div>
        <div class="gallery-section">
            <div class="section-title">
                <span>我的图片</span>
                <button class="refresh-btn" onclick="loadImages()">🔄 刷新</button>
            </div>
            <div class="image-grid" id="imageGrid">
                <div class="empty-state">
                    <div class="empty-icon">🖼️</div>
                    <p>暂无图片，快去上传吧！</p>
                </div>
            </div>
        </div>
    </div>
    <div class="toast" id="toast"></div>
    <div class="modal" id="urlModal">
        <div class="modal-content">
            <div class="modal-title">📋 图片 URL 地址</div>
            <div class="url-box" id="urlBox"></div>
            <div class="modal-actions">
                <button class="modal-btn btn-copy" onclick="copyUrl()">📄 复制链接</button>
                <button class="modal-btn btn-close" onclick="closeModal()">关闭</button>
            </div>
        </div>
    </div>
    <script>
        const API_BASE = '';
        let currentImageUrl = '';
        document.getElementById('uploadArea').addEventListener('click', () => document.getElementById('fileInput').click());
        document.getElementById('fileInput').addEventListener('change', (e) => { if (e.target.files.length > 0) uploadFiles(e.target.files); });
        async function uploadFiles(files) {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('image', files[i]);
                try {
                    const response = await fetch(\`/api/upload\`, { method: 'POST', body: formData });
                    const result = await response.json();
                    if (result.success) showToast(\`✅ \${files[i].name} 上传成功\`);
                } catch (error) { showToast('❌ 上传失败'); }
            }
            loadImages();
        }
        async function loadImages() {
            try {
                const response = await fetch(\`/api/images\`);
                const data = await response.json();
                const grid = document.getElementById('imageGrid');
                if (data.images.length === 0) { grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1;"><div class="empty-icon">🖼️</div><p>暂无图片，快去上传吧！</p></div>'; return; }
                grid.innerHTML = data.images.map(img => \`
                    <div class="image-card">
                        <img src="\${img.url}" onclick="showImageUrl('\${img.url}')">
                        <div class="image-actions">
                            <button class="btn btn-download" onclick="showImageUrl('\${img.url}')">查看URL</button>
                            <button class="btn btn-delete" onclick="deleteImage('\${img.filename}')">删除</button>
                        </div>
                    </div>
                \`).join('');
            } catch (error) { showToast('❌ 加载失败'); }
        }
        function showImageUrl(url) { currentImageUrl = url; document.getElementById('urlBox').textContent = url; document.getElementById('urlModal').classList.add('show'); }
        function closeModal() { document.getElementById('urlModal').classList.remove('show'); }
        async function copyUrl() { await navigator.clipboard.writeText(currentImageUrl); showToast('✅ 链接已复制'); }
        async function deleteImage(filename) {
            if (!confirm('确定删除?')) return;
            await fetch(\`/api/images/\${filename}\`, { method: 'DELETE' });
            loadImages();
        }
        function showToast(msg) { const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3000); }
        loadImages();
    </script>
</body>
</html>`;

// 首页 - 返回静态页面
app.get('/', (req, res) => {
  res.send(indexHtml);
});

// 获取所有图片列表
app.get('/api/images', async (req, res) => {
  try {
    const { blobs } = await list();
    const images = blobs
      .filter(blob => blob.pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      .map(blob => ({
        filename: blob.pathname,
        url: blob.url,
        fullUrl: blob.url,
        uploadedAt: blob.uploadedAt
      }));
    
    res.json({ images });
  } catch (error) {
    console.error('获取图片列表失败:', error);
    res.status(500).json({ error: '获取图片列表失败' });
  }
});

// 上传图片
app.post('/api/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有上传文件' });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: '只允许上传图片文件' });
  }

  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = req.file.originalname.split('.').pop();
    const filename = `${uniqueSuffix}.${ext}`;

    const blob = await put(filename, req.file.buffer, {
      contentType: req.file.mimetype,
      access: 'public',
    });

    res.json({
      success: true,
      message: '上传成功',
      file: {
        filename: filename,
        originalname: req.file.originalname,
        url: blob.url,
        fullUrl: blob.url
      }
    });
  } catch (error) {
    console.error('上传失败:', error);
    res.status(500).json({ error: '上传失败: ' + error.message });
  }
});

// 删除图片
app.delete('/api/images/:filename', async (req, res) => {
  const filename = req.params.filename;
  
  try {
    await del(filename);
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除失败:', error);
    res.status(500).json({ error: '删除失败' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Vercel Serverless Function 处理器
module.exports = (req, res) => {
  return app(req, res);
};
