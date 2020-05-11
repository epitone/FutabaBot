const { Command } = require('discord.js-commando')
const DiscordUtils = require('../../utils/discord-utils')
module.exports = class AutoDCCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'autodisconnect',
      aliases: ['autodc'],
      group: 'music', // the command group the command is a part of.
      memberName: 'autodisconnect', // the name of the command within the group (this can be different from the name).
      description: 'Toggles whether the bot should disconnect from the voice channel upon finishing playback of all songs in the queue.'
    })
  }

  async run (message) {
    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)
    const autodcEnabled = musicplayer.ToggleAutoDC()
    const response = autodcEnabled ? `**${message.author.tag}** I will disconnect from the voice channel when there are no more songs to play.`
      : `**${message.author.tag}** I will no longer disconnect from the voice channel when there are no more songs to play.`
    DiscordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: response
    })
  }
}
