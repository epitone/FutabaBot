const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')

module.exports = class DestroyCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'destroy',
      group: 'music', // the command group the command is a part of.
      memberName: 'destroy', // the name of the command within the group (this can be different from the name).
      description: 'Stops music playback and removes the bot from all voice channels. May cause weird behavior.'
    })
  }

  async run (message) {
    const { voice: voiceState } = message.member
    if (!discordUtils.inVoiceChannel(voiceState, message)) {
      return
    }

    const musicService = require('./../../FutabaBot').getMusicService()
    const musicPlayer = musicService.GetMusicPlayer(message.guild)
    musicPlayer.destroy()
  }
}
