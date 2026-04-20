const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { put, list, del } = require('@vercel/blob');

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

  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: '只允许上传图片文件 (JPEG, PNG, GIF, WebP)' });
  }

  try {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = req.file.originalname.split('.').pop();
    const filename = `${uniqueSuffix}.${ext}`;

    // 上传到 Vercel Blob
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

// 导出 app（用于 Vercel）
module.exports = app;
