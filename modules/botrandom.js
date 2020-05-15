class BotRandom {
  constructor () {
    this.crypto = require('random-number-csprng')
  }

  async next () {
    return Math.abs(this.crypto(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
  }

  async nextMax (maxValue) {
    const randomNumber = await this.crypto(-maxValue, maxValue)
    return Math.abs(randomNumber)
  }

  async nextRange (minValue, maxValue) {
    return Math.abs(this.crypto(minValue, maxValue))
  }
}
module.exports = BotRandom
