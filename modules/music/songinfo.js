const { Util } = require('discord.js')

module.exports = class SongInfo {
  constructor (streamObject, message) {
    this.provider = streamObject.provider // TODO: eventually add support for SoundCloud
    this.query = message.content
    this.title = streamObject.title
    this.url = streamObject.url
    this.totalTime = streamObject.durationSeconds // time duration in seconds
    this.requester = Util.cleanContent(message.author.tag, message)

    // These variables are for display purposes
    // this.prettyName = `**[${stringUtils.escapeBraces(streamObject.title.substring(0, 65))}](${this.url})**`
    this.prettyName = this.provider !== 'Local' ? `**[${this.title}](${this.url})**` : `**${this.title}**`
    this.prettyTotalTime = streamObject.length
    this.prettyInfo = `${this.prettyTotalTime} | Youtube | ${this.requester}`
    this.prettyFullName = `${this.prettyName}\n\t\t\`${this.prettyTotalTime} | ${this.provider} | \
${this.requester.length <= 15 ? (this.requester) : (this.requester.substring(0, 15) + '...')}\``
  }
}
