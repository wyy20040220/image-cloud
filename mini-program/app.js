App({
  globalData: {
    // 公网访问地址（localtunnel）
    // ⚠️ 注意：localtunnel 地址每次重启会变，需要更新此处
    apiBaseUrl: 'https://wicked-games-kiss.loca.lt'
    
    // 本地开发地址
    // apiBaseUrl: 'http://localhost:3000'
  },
  
  onLaunch() {
    console.log('图云小程序启动');
    console.log('当前API地址:', this.globalData.apiBaseUrl);
  }
});
