const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')

module.exports = class RepeatPlaylistCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'repeatplaylist',
      aliases: ['rpl'],
      group: 'music',
      memberName: 'repeatplaylist',
      description: 'Toggles repeat of the current playlist on or off.'
    })
  }

  async run (message) {
    const { voice: voiceState } = message.member
    if (!discordUtils.inVoiceChannel(voiceState, message)) {
      console.log(`${message.author.tag} attempted to run a music command without being in a voice channel.`)
      return
    }

    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)

    const toggleEnabled = musicplayer.toggleRepeatPlaylist()
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      author: `🔁 Repeat Playlist ${(toggleEnabled ? 'Enabled' : 'Disabled')}`
    })
  }
}
