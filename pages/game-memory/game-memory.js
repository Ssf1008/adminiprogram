const { request } = require('../../utils/request')
const app = getApp()

function randomDigits(length) {
  let result = ''
  for (let i = 0; i < length; i += 1) {
    result += Math.floor(Math.random() * 10)
  }
  return result
}

Page({
  data: {
    phase: 'show',
    round: 1,
    answer: '',
    displayNumber: '',
    hidden: false,
    userInput: '',
    score: 0,
    startTime: 0,
    tips: '请记住即将出现的数字'
  },

  onLoad() {
    this.startRound()
  },

  startRound() {
    const length = Math.min(3 + this.data.round - 1, 7)
    const answer = randomDigits(length)
    this.setData({
      phase: 'show',
      answer,
      displayNumber: answer,
      hidden: false,
      userInput: '',
      startTime: Date.now(),
      tips: '请默记数字，3 秒后会隐藏'
    })
    setTimeout(() => {
      this.setData({
        phase: 'input',
        hidden: true,
        displayNumber: '******',
        tips: '请输入刚才看到的数字'
      })
    }, 3000)
  },

  onInput(e) {
    this.setData({ userInput: e.detail.value })
  },

  async submitAnswer() {
    const correct = this.data.userInput === this.data.answer
    const nextScore = correct ? this.data.score + 20 : this.data.score
    if (this.data.round >= 3 || !correct) {
      await this.finishGame(correct, nextScore)
      return
    }
    wx.showToast({ title: '回答正确', icon: 'success' })
    this.setData({ score: nextScore, round: this.data.round + 1 })
    this.startRound()
  },

  async finishGame(correct, finalScore) {
    const duration = Math.round((Date.now() - this.data.startTime) / 1000) + this.data.round * 3
    const user = app.globalData.userInfo || wx.getStorageSync('userInfo')
    try {
      await request({
        url: '/api/record/submit',
        method: 'POST',
        data: {
          userId: user.id,
          gameCode: 'memory_number',
          gameName: '数字记忆',
          score: finalScore,
          duration,
          completionRate: correct ? 100 : 66.7,
          accuracyRate: correct ? 100 : 66.7,
          difficultyLevel: this.data.round
        }
      })
    } catch (e) {}
    wx.showModal({
      title: '训练完成',
      content: `本次得分：${finalScore} 分`,
      showCancel: false,
      success: () => {
        wx.navigateBack()
      }
    })
  }
})

