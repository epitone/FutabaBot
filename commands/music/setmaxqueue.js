const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class SetMaxQueueCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setmaxqueue',
      aliases: ['smq'],
      group: 'music', // the command group the command is a part of.
      memberName: 'setmaxqueue', // the name of the command within the group (this can be different from the name).
      description: 'Sets the maximum queue size. Specify no parameters to have no limit.', // TODO should this persist between sessions?
      args: [
        {
          key: 'max_size',
          prompt: 'What would you like the max queue size to be?',
          type: 'integer',
          validate: maxSize => (maxSize >= 0 && maxSize < Number.MAX_SAFE_INTEGER) || maxSize === -1,
          default: -1
        }
      ]
    })
  }

  async run (message, { max_size: maxSize }) {
    const musicService = require('./../../FutabaBot').getMusicService()
    const musicPlayer = musicService.GetMusicPlayer(message.guild)

    const queueSizeSet = musicPlayer.setMaxQueueSize(maxSize)
    if (!queueSizeSet) {
      winston.error(`**${message.author.tag}** tried to set the max queue size to an incorrect value: ${maxSize}`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: `**${message.author.tag}** the size you entered was smaller than the current queue, please pick a large number.`
      })
      return
    }
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: `**${message.author.tag}** I successfully set the queue size to ${maxSize}.`
    })
  }
}
