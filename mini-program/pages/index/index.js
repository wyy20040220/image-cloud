const app = getApp();

Page({
  data: {
    images: [],
    apiBaseUrl: ''
  },

  onLoad() {
    this.setData({
      apiBaseUrl: app.globalData.apiBaseUrl
    });
    this.loadImages();
  },

  onPullDownRefresh() {
    this.loadImages().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 加载图片列表
  async loadImages() {
    wx.showLoading({ title: '加载中' });
    
    try {
      const res = await wx.request({
        url: `${this.data.apiBaseUrl}/api/images`,
        method: 'GET'
      });

      if (res.statusCode === 200) {
        this.setData({
          images: res.data.images || []
        });
      } else {
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      }
    } catch (error) {
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 选择并上传图片
  chooseImage() {
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const files = res.tempFiles;
        this.uploadFiles(files);
      }
    });
  },

  // 上传文件
  async uploadFiles(files) {
    wx.showLoading({ title: '上传中...' });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        await wx.uploadFile({
          url: `${this.data.apiBaseUrl}/api/upload`,
          filePath: file.tempFilePath,
          name: 'image',
          success: (res) => {
            const data = JSON.parse(res.data);
            if (data.success) {
              wx.showToast({
                title: '上传成功',
                icon: 'success'
              });
            }
          },
          fail: () => {
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
          }
        });
      } catch (error) {
        console.error('上传错误:', error);
      }
    }

    wx.hideLoading();
    this.loadImages();
  },

  // 预览图片
  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    const urls = this.data.images.map(img => img.fullUrl);
    
    wx.previewImage({
      current: url,
      urls: urls
    });
  },

  // 保存图片到相册
  saveImage(e) {
    const url = e.currentTarget.dataset.url;
    
    wx.showLoading({ title: '下载中...' });
    
    wx.downloadFile({
      url: url,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              });
            },
            fail: () => {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              });
            }
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  // 删除图片
  deleteImage(e) {
    const filename = e.currentTarget.dataset.filename;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这张图片吗？',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: `${this.data.apiBaseUrl}/api/images/${filename}`,
            method: 'DELETE',
            success: (res) => {
              if (res.data.success) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                });
                this.loadImages();
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none'
                });
              }
            }
          });
        }
      }
    });
  }
});
