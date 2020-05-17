const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
// const BotRandom = require('BotRandom')

module.exports = class ShuffleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'shuffle',
      aliases: ['shf'],
      group: 'music', // the command group the command is a part of.
      memberName: 'shuffle', // the name of the command within the group (this can be different from the name).
      description: 'Disables/enables shuffling in the music player.'
    })
  }

  async run (message) {
    const { voice: voiceState } = message.member
    if (!discordUtils.inVoiceChannel(voiceState, message)) {
      return
    }

    const musicService = require('./../../FutabaBot').getMusicService()
    const musicPlayer = musicService.GetMusicPlayer(message.guild)

    const shuffleEnabled = musicPlayer.ToggleShuffle()
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: `**${message.author.tag}** ${shuffleEnabled ? 'enabled' : 'disabled'} shuffle playback.`
    })
  }
}
