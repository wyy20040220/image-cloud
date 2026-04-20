App({
  globalData: {
    // 公网访问地址（localtunnel 自动生成）
    // 注意：每次重启会变化，如需固定请用 Railway/Render 部署
    apiBaseUrl: 'https://major-taxes-wonder.loca.lt'
  },
  
  onLaunch() {
    console.log('图云小程序启动');
  }
});
