const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class StopCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'stop',
      group: 'music', // the command group the command is a part of.
      memberName: 'stop', // the name of the command within the group (this can be different from the name).
      description: 'Stops the music and preserves the current song index. Stays in the channel.'
    })
  }

  async run (message) {
    const { voice: voiceState } = message.member

    if (!discordUtils.inVoiceChannel(voiceState, message)) return

    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)

    musicplayer.stop()
    const response = 'Playback stopped.'
    winston.info(`${message.author.tag} stopped music playback.`)
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: response
    })
  }
}
