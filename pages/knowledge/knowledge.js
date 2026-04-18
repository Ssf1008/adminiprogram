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
  },

  openDetail(e) {
    const { id } = e.currentTarget.dataset
    if (!id) {
      return
    }
    wx.navigateTo({ url: `/pages/knowledge-detail/knowledge-detail?id=${id}` })
  }
})

