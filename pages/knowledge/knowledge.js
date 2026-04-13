const { request } = require('../../utils/request')

Page({
  data: {
    list: []
  },

  onShow() {
    this.loadList()
  },

  async loadList() {
    try {
      const res = await request({ url: '/api/knowledge/list' })
      if (res.success) {
        this.setData({ list: res.data })
      }
    } catch (e) {
      wx.showToast({ title: '知识加载失败', icon: 'none' })
    }
  }
})

