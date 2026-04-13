App({
  globalData: {
    baseUrl: 'http://127.0.0.1:8082',
    userInfo: null,
    token: '',
    tokenExpireAt: 0
  },
  onLaunch() {
    const userInfo = wx.getStorageSync('userInfo') || null
    const token = wx.getStorageSync('token') || ''
    const tokenExpireAt = Number(wx.getStorageSync('tokenExpireAt') || 0)

    if (token && tokenExpireAt > Date.now() && userInfo) {
      this.globalData.userInfo = userInfo
      this.globalData.token = token
      this.globalData.tokenExpireAt = tokenExpireAt
    } else {
      wx.removeStorageSync('userInfo')
      wx.removeStorageSync('token')
      wx.removeStorageSync('tokenExpireAt')
    }
  }
})

