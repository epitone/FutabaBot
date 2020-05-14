class BotRandom {
  constructor () {
    this.crypto; // eslint-disable-line
    try {
      this.crypto = require('random-number-csprng')
    } catch (err) {
      console.log('crypto support is disabled!')
    }
  }

  async next () {
    return Math.abs(this.crypto(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
  }

  async nextMax (maxValue) {
    return Math.abs(this.crypto(-maxValue, maxValue))
  }

  async nextRange (minValue, maxValue) {
    return Math.abs(this.crypto(minValue, maxValue))
  }
}
module.exports = BotRandom
