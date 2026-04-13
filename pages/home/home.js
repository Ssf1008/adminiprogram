const { request } = require('../../utils/request')
const app = getApp()

Page({
  data: {
    userInfo: null,
    stats: {
      trainCount: 0,
      totalDuration: 0,
      avgScore: 0,
      avgAccuracy: 0
    },
    quickLinks: [
      { name: '开始训练', url: '/pages/games/games' },
      { name: '训练记录', url: '/pages/records/records' },
      { name: '健康知识', url: '/pages/knowledge/knowledge' },
      { name: '个人中心', url: '/pages/profile/profile' }
    ]
  },

  onLoad() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    const token = app.globalData.token || wx.getStorageSync('token')
    const tokenExpireAt = Number(app.globalData.tokenExpireAt || wx.getStorageSync('tokenExpireAt') || 0)

    if (!userInfo || !token || tokenExpireAt <= Date.now()) {
      wx.removeStorageSync('userInfo')
      wx.removeStorageSync('token')
      wx.removeStorageSync('tokenExpireAt')
      app.globalData.userInfo = null
      app.globalData.token = ''
      app.globalData.tokenExpireAt = 0
      wx.reLaunch({ url: '/pages/login/login' })
      return
    }

    this.setData({ userInfo })
    this.loadStats(userInfo.id)
  },

  onShow() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
      this.loadStats(userInfo.id)
    }
  },

  async loadStats(userId) {
    try {
      const res = await request({ url: `/api/record/statistics?userId=${userId}` })
      if (res.success) {
        this.setData({ stats: res.data })
      }
    } catch (e) {}
  },

  navigate(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.url })
  },

  onShareAppMessage() {
    return {
      title: '我正在使用脑力花园进行认知训练',
      path: '/pages/login/login'
    }
  }
})
