const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')
module.exports = class SetStatusCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setstatus',
      group: 'admin', // the command group the command is a part of.
      memberName: 'setstatus', // the name of the command within the group (this can be different from the name).
      description: 'Sets the bot’s status. Must be one of the following options: Online, Idle, Dnd, Invisible)',
      ownerOnly: true,
      args: [
        {
          key: 'status',
          prompt: 'What status are you giving the bot? Must be one of the following options: Online, Idle, Dnd, Invisible)',
          type: 'string',
          oneOf: ['online', 'idle', 'dnd', 'invisible']
        }
      ]
    })
  }

  async run (message, { status }) {
    const bot = this.client.user
    const constants = require('./../../FutabaBot').getConstants()
    const updatedPresence = await bot.setStatus(status === 'invisible' ? 'offline' : status)

    winston.info(`Changed bot status to: ${constants.get('UTILS').STATUS[updatedPresence.status]}`)
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: constants.get('BOT_STATUS_SUCCESS', constants.get('UTILS').STATUS[updatedPresence.status])
    })
  }
}
