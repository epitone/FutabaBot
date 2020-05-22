const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class PauseCommannd extends Command {
  constructor (client) {
    super(client, {
      name: 'pause',
      aliases: ['p'],
      group: 'music', // the command group the command is a part of.
      memberName: 'pause', // the name of the command within the group (this can be different from the name).
      description: 'Pauses or unpauses the currently playing song'
    })
  }

  async run (message) {
    const { voice: voiceState } = message.member
    if (!discordUtils.inVoiceChannel(voiceState, message)) {
      return
    }

    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)
    const musicChannel = musicService.musicChannel
    const current = musicplayer.current()

    // FIXME we're repeating code here, probably should simplify this
    if (musicplayer.paused) {
      musicplayer.togglePause()

      winston.info(`${message.author.tag} resumed playback.`)
      discordUtils.embedResponse(message, {
        author: `Resumed song #${current.index + 1}`,
        title: current.song.title,
        url: current.song.provider !== 'Local' ? current.song.url : undefined,
        color: 'ORANGE',
        footer: `${current.song.prettyTotalTime} | ${current.song.provider} | ${current.song.requester}`
      }, musicChannel)
    } else {
      musicplayer.togglePause()
      winston.info(`${message.author.tag} paused playback.`)
      discordUtils.embedResponse(message, {
        author: `Paused song #${current.index + 1}`,
        title: current.song.title,
        url: current.song.provider !== 'Local' ? current.song.url : undefined,
        color: 'ORANGE',
        footer: `${current.song.prettyTotalTime} | ${current.song.provider} | ${current.song.requester}`
      }, musicChannel)
    }
  }
}
