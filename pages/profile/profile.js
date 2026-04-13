const { request } = require('../../utils/request')
const app = getApp()

Page({
  data: {
    form: {
      userId: null,
      nickname: '',
      avatar: '',
      gender: 0,
      age: '',
      phone: '',
      medicalHistory: '',
      familyHistory: ''
    }
  },

  onShow() {
    const user = app.globalData.userInfo || wx.getStorageSync('userInfo')
    if (!user) {
      wx.reLaunch({ url: '/pages/login/login' })
      return
    }
    this.setData({
      form: {
        userId: user.id,
        nickname: user.nickname || '',
        avatar: user.avatar || '',
        gender: user.gender || 0,
        age: user.age || '',
        phone: user.phone || '',
        medicalHistory: user.medicalHistory || '',
        familyHistory: user.familyHistory || ''
      }
    })
  },

  updateField(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ [`form.${key}`]: e.detail.value })
  },

  async save() {
    try {
      const res = await request({
        url: '/api/user/update',
        method: 'POST',
        data: this.data.form
      })
      if (res.success) {
        app.globalData.userInfo = res.data
        wx.setStorageSync('userInfo', res.data)
        wx.showToast({ title: '保存成功', icon: 'success' })
      }
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' })
    }
  },

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '退出后将清除本地登录状态，需要重新登录。',
      success: (res) => {
        if (!res.confirm) {
          return
        }
        app.globalData.userInfo = null
        app.globalData.token = ''
        app.globalData.tokenExpireAt = 0
        wx.removeStorageSync('userInfo')
        wx.removeStorageSync('token')
        wx.removeStorageSync('tokenExpireAt')
        wx.reLaunch({ url: '/pages/login/login' })
      }
    })
  }
})
