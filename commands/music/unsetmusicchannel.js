const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')
module.exports = class UnsetMusicChannelCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'unsetmusicchannel',
      aliases: ['usmch'],
      group: 'music',
      memberName: 'unsetmusicchannel',
      description: 'Bot will output playing, finished, paused and removed songs to the channel where the song was first queued in.'
    })
  }

  run (message) {
    const musicService = require('./../../FutabaBot').getMusicService()

    let musicChannel = musicService.getMusicChannel()
    if (!musicChannel) {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: `**${message.author.tag}** there is no music channel set!`
      })
    } else {
      musicChannel = musicService.setMusicChannel(null)
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: `**${message.author.tag}** I will output playing, finished, paused and removed songs to the channel where the song was first queued in.`
      })
    }
  }
}
