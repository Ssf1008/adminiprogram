const { request } = require('../../utils/request')
const app = getApp()

function buildQuestion() {
  const sets = [
    { q: '○ △ ○ △ ?', options: ['□', '○', '△'], answer: '○' },
    { q: '★ ☆ ★ ☆ ?', options: ['★', '●', '△'], answer: '★' },
    { q: '▲ ▲ ● ▲ ▲ ?', options: ['●', '▲', '■'], answer: '●' }
  ]
  return sets[Math.floor(Math.random() * sets.length)]
}

Page({
  data: {
    current: {},
    round: 1,
    score: 0,
    startAt: 0
  },

  onLoad() {
    this.loadRound()
  },

  loadRound() {
    this.setData({
      current: buildQuestion(),
      startAt: Date.now()
    })
  },

  async choose(e) {
    const option = e.currentTarget.dataset.option
    const correct = option === this.data.current.answer
    const score = correct ? this.data.score + 20 : this.data.score
    if (this.data.round >= 3) {
      await this.finish(score, correct)
      return
    }
    this.setData({ round: this.data.round + 1, score })
    wx.showToast({ title: correct ? '正确' : '继续加油', icon: 'none' })
    this.loadRound()
  },

  async finish(score, correct) {
    const duration = Math.round((Date.now() - this.data.startAt) / 1000) + this.data.round * 4
    const user = app.globalData.userInfo || wx.getStorageSync('userInfo')
    try {
      await request({
        url: '/api/record/submit',
        method: 'POST',
        data: {
          userId: user.id,
          gameCode: 'logic_shape',
          gameName: '图形规律',
          score,
          duration,
          completionRate: 100,
          accuracyRate: correct ? 100 : 66.7,
          difficultyLevel: this.data.round
        }
      })
    } catch (e) {}
    wx.showModal({
      title: '训练完成',
      content: `逻辑训练得分：${score} 分`,
      showCancel: false,
      success: () => wx.navigateBack()
    })
  }
})

