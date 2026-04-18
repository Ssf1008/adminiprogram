const { request } = require('../../utils/request')

Page({
  data: {
    detail: null
  },

  onLoad(options) {
    if (options && options.id) {
      this.loadDetail(options.id)
    }
  },

  async loadDetail(id) {
    try {
      const res = await request({ url: `/api/knowledge/detail/${id}` })
      if (res.success) {
        this.setData({ detail: res.data })
        wx.setNavigationBarTitle({ title: res.data.title || '知识详情' })
      } else {
        wx.showToast({ title: res.message || '详情加载失败', icon: 'none' })
      }
    } catch (e) {
      wx.showToast({ title: '详情加载失败', icon: 'none' })
    }
  }
})

