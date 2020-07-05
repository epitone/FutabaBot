const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class SetPlayingStatusCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setplaying',
      group: 'admin',
      memberName: 'setplaying',
      description: 'Sets the bots game status to either Playing, Listening, or Watching.',
      ownerOnly: true,
      args: [
        {
          key: 'playing_type',
          prompt: 'What type of playing status is it? (must be one of: Playing, Watching or Listening)',
          type: 'string',
          oneOf: ['playing', 'watching', 'listening']
        },
        {
          key: 'playing_status',
          prompt: 'What is the status string you’d like to use?',
          type: 'string'
        }
      ]
    })
  }

  async run (message, { playing_type: playingType, playing_status: playingStatus }) {
    const oldPresence = this.client.user.presence.activities[0]
    const constants = require('../../FutabaBot').getConstants()
    if (oldPresence.name.localeCompare(playingStatus.toLocaleLowerCase()) === 0 && oldPresence.type.localeCompare(playingType.toLocaleUpperCase()) === 0) {
      winston.warn(`${message.author} tried to change bot status but the statuses were the same.`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('UPDATE_PLAYING_ERR')
      })
      return
    }

    const updatedPresence = await this.client.user.setActivity(playingStatus, { type: playingType.toUpperCase() })
    if (oldPresence.name.localeCompare(updatedPresence.activities[0].type.toLocaleLowerCase()) && oldPresence.type.localeCompare(updatedPresence.activities[0].type.toLocaleUpperCase() === 0)) {
      winston.info(`Updated bot status to: ${updatedPresence.activities[0].type.toLowerCase() + ' ' + updatedPresence.activities[0].name}`)
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: constants.get('UPDATE_PLAYING_SUCCESS', updatedPresence.activities[0].type.toLowerCase() + ' ' + updatedPresence.activities[0].name)
      })
    } else {
      winston.error(`Something went wrong while executing ${this.name}`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_GENERIC')
      })
    }
  }
}
