const { request } = require('../../utils/request')
const app = getApp()

Page({
  data: {
    records: [],
    stats: null,
    analysis: null,
    analysisLoading: false,
    analysisTip: '点击上方按钮，可结合近期训练记录生成大模型分析建议。'
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
  },

  async generateAnalysis() {
    const user = app.globalData.userInfo || wx.getStorageSync('userInfo')
    if (!user || this.data.analysisLoading) {
      return
    }
    this.setData({
      analysisLoading: true,
      analysisTip: this.data.analysis ? '正在基于最新训练记录重新生成建议，请稍候...' : '正在分析近期训练表现，请稍候...'
    })
    try {
      const res = await request({ url: `/api/record/analysis?userId=${user.id}` })
      if (res.success) {
        this.setData({
          analysis: res.data,
          analysisTip: '已生成最新 AI 建议。'
        })
      } else {
        wx.showToast({ title: res.message || '生成失败', icon: 'none' })
      }
    } catch (e) {
      wx.showToast({ title: 'AI 分析失败', icon: 'none' })
    } finally {
      this.setData({ analysisLoading: false })
    }
  }
})

