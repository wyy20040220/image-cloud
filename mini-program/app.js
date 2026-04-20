App({
  globalData: {
    // ✅ Vercel 部署的固定域名
    apiBaseUrl: 'https://image-cloud.vercel.app'
    
    // 备用地址（如果上面的不行，可以尝试以下地址）：
    // apiBaseUrl: 'https://image-cloud-git-master-wyys-projects-f4a43e08.vercel.app'
    // apiBaseUrl: 'https://image-cloud-ibv804zub-wyys-projects-f4a43e08.vercel.app'
    
    // 本地开发地址
    // apiBaseUrl: 'http://localhost:3000'
  },
  
  onLaunch() {
    console.log('图云小程序启动');
    console.log('当前API地址:', this.globalData.apiBaseUrl);
  }
});
