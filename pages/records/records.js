const { request } = require('../../utils/request')
const app = getApp()

Page({
  data: {
    records: [],
    stats: null
  },

  onShow() {
    const user = app.globalData.userInfo || wx.getStorageSync('userInfo')
    if (!user) {
      return
    }
    this.loadData(user.id)
  },

  async loadData(userId) {
    try {
      const [listRes, statRes] = await Promise.all([
        request({ url: `/api/record/list?userId=${userId}` }),
        request({ url: `/api/record/statistics?userId=${userId}` })
      ])
      this.setData({
        records: listRes.data || [],
        stats: statRes.data || null
      })
    } catch (e) {
      wx.showToast({ title: '记录加载失败', icon: 'none' })
    }
  }
})

