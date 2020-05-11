const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')

module.exports = class RepeatSongCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'repeatsong',
      group: 'music', // the command group the command is a part of.
      memberName: 'repeatsong', // the name of the command within the group (this can be different from the name).
      description: 'Toggles repeat of current song.'
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

    if (musicplayer.current()) {
      if (!musicplayer.stopped) {
        if (musicplayer.toggleRepeatSong()) {
          const currentSong = musicplayer.current().song
          discordUtils.embedResponse(message, {
            author: '🔂 Repeating track',
            title: currentSong.title,
            url: currentSong.url,
            color: 'ORANGE',
            footer: `${currentSong.total_time} | ${currentSong.provider} | ${currentSong.requester}`
          })
        } else {
          discordUtils.embedResponse(message, {
            author: '🔂 Current track repeat disabled',
            color: 'ORANGE'
          })
        }
      } else {
        const repeatSongEnabled = musicplayer.toggleRepeatSong()
        discordUtils.embedResponse(message, {
          author: `🔂 Current track repeat ${(repeatSongEnabled ? 'enabled' : 'disabled')}`,
          color: 'ORANGE'
        })
      }
    } else {
      const response = 'The music player is not currently active.'
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: response
      })
    }
  }
}
