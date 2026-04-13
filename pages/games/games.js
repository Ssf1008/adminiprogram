const { request } = require('../../utils/request')

Page({
  data: {
    games: []
  },

  onShow() {
    this.loadGames()
  },

  async loadGames() {
    try {
      const res = await request({ url: '/api/game/list' })
      if (res.success) {
        this.setData({ games: res.data })
      }
    } catch (e) {
      wx.showToast({ title: '游戏加载失败', icon: 'none' })
    }
  },

  goGame(e) {
    const code = e.currentTarget.dataset.code
    const mapping = {
      memory_number: '/pages/game-memory/game-memory',
      logic_shape: '/pages/game-logic/game-logic',
      calc_quick: '/pages/game-calc/game-calc'
    }
    wx.navigateTo({ url: mapping[code] })
  }
})

