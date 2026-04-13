const { request } = require('../../utils/request')
const app = getApp()

Page({
  data: {
    nickname: '',
    avatarUrl: '',
    loading: false,
    checking: true,
    avatarReady: false
  },

  onLoad() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    const token = app.globalData.token || wx.getStorageSync('token')
    const tokenExpireAt = Number(app.globalData.tokenExpireAt || wx.getStorageSync('tokenExpireAt') || 0)

    if (userInfo && token && tokenExpireAt > Date.now()) {
      wx.reLaunch({ url: '/pages/home/home' })
      return
    }

    this.setData({ checking: false })
  },

  onChooseAvatar(e) {
    const avatarUrl = (e.detail && e.detail.avatarUrl) || ''
    this.setData({
      avatarUrl,
      avatarReady: !!avatarUrl
    })
  },

  onNicknameInput(e) {
    this.setData({ nickname: e.detail.value })
  },

  onNicknameBlur(e) {
    const value = (e.detail && e.detail.value) || ''
    if (value && value.trim() !== '') {
      this.setData({ nickname: value.trim() })
    }
  },

  handleWechatLogin() {
    if (this.data.loading) {
      return
    }

    this.setData({ loading: true })
    wx.login({
      success: async (loginRes) => {
        try {
          const res = await request({
            url: '/api/user/wx-login',
            method: 'POST',
            data: {
              code: loginRes.code || 'local-demo',
              nickname: this.data.nickname && this.data.nickname.trim() ? this.data.nickname.trim() : '微信用户',
              avatarUrl: this.data.avatarUrl || ''
            }
          })
          if (res.success) {
            const expiresIn = Number((res.data && res.data.expiresIn) || 28800)
            const tokenExpireAt = Date.now() + expiresIn * 1000
            app.globalData.userInfo = res.data.user
            app.globalData.token = res.data.token
            app.globalData.tokenExpireAt = tokenExpireAt
            wx.setStorageSync('userInfo', res.data.user)
            wx.setStorageSync('token', res.data.token)
            wx.setStorageSync('tokenExpireAt', tokenExpireAt)
            wx.reLaunch({ url: '/pages/home/home' })
          } else {
            wx.showToast({ title: res.message || '登录失败', icon: 'none' })
          }
        } catch (e) {
          wx.showToast({ title: '连接后端失败', icon: 'none' })
        } finally {
          this.setData({ loading: false })
        }
      },
      fail: () => {
        this.setData({ loading: false })
        wx.showToast({ title: '微信登录失败', icon: 'none' })
      }
    })
  }
})
