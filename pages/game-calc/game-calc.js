const { request } = require('../../utils/request')
const app = getApp()

function nextQuestion() {
  const a = Math.ceil(Math.random() * 20)
  const b = Math.ceil(Math.random() * 20)
  const op = Math.random() > 0.5 ? '+' : '-'
  return {
    a,
    b,
    op,
    answer: op === '+' ? a + b : a - b
  }
}

Page({
  data: {
    round: 1,
    score: 0,
    current: {},
    inputValue: '',
    startAt: 0
  },

  onLoad() {
    this.loadQuestion()
  },

  loadQuestion() {
    this.setData({
      current: nextQuestion(),
      inputValue: '',
      startAt: Date.now()
    })
  },

  onInput(e) {
    this.setData({ inputValue: e.detail.value })
  },

  async submit() {
    const correct = Number(this.data.inputValue) === this.data.current.answer
    const score = correct ? this.data.score + 20 : this.data.score
    if (this.data.round >= 5) {
      await this.finish(score, correct)
      return
    }
    wx.showToast({ title: correct ? '回答正确' : '已进入下一题', icon: 'none' })
    this.setData({ round: this.data.round + 1, score })
    this.loadQuestion()
  },

  async finish(score, correct) {
    const duration = Math.round((Date.now() - this.data.startAt) / 1000) + this.data.round * 3
    const user = app.globalData.userInfo || wx.getStorageSync('userInfo')
    try {
      await request({
        url: '/api/record/submit',
        method: 'POST',
        data: {
          userId: user.id,
          gameCode: 'calc_quick',
          gameName: '快速计算',
          score,
          duration,
          completionRate: 100,
          accuracyRate: correct ? 100 : 80,
          difficultyLevel: 1
        }
      })
    } catch (e) {}
    wx.showModal({
      title: '训练完成',
      content: `计算训练得分：${score} 分`,
      showCancel: false,
      success: () => wx.navigateBack()
    })
  }
})

