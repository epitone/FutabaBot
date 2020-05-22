const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')

module.exports = class SetMusicChannelCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setmusicchannel',
      aliases: ['smch'],
      group: 'music',
      memberName: 'setmusicchannel',
      description: 'Sets the current channel as the default music output channel. This will output playing, finished, paused and removed songs to that channel instead of the channel where the first song was queued in.'
    })
  }

  run (message) {
    const textChannel = message.channel
    const musicService = require('./../../FutabaBot').getMusicService()

    const musicChanSet = musicService.setMusicChannel(textChannel)
    if (musicChanSet) {
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: `**${message.author.tag}** successfuly set the music channel to ${textChannel}. All played, finished, paused and removed songs will be output to this channel.`
      })
      return
    }
    discordUtils.embedResponse(message, {
      color: 'RED',
      description: 'Oops! Something went wrong!'
    })
  }
}
