const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class GreetDelCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'greetdel',
      group: 'admin', // the command group the command is a part of.
      memberName: 'greetdel', // the name of the command within the group (this can be different from the name).
      description: 'Sets the time it takes (in seconds) for greet messages to be auto-deleted. Set it to 0 to disable automatic deletion.',
      args: [
        {
          key: 'timeout',
          prompt: 'How long should greet messages stay available for? (In seconds)',
          type: 'integer',
          validate: timeout => timeout === 0 || (timeout > 0 && timeout < Number.MAX_SAFE_INTEGER),
          default: 0
        }
      ]
    })
  }

  run (message, { timeout }) {
    const constants = require('./../../FutabaBot').getConstants()
    if (!discordUtils.hasPerms(message.member, 'MANAGE_SERVER')) {
      winston.warn(`${message.member} tried to execute ${this.name} command without proper authority`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('INSUFFICIENT_PERMISSIONS', message.author)
      })
      return
    }

    if (!discordUtils.hasPerms(message.guild.me, 'MANAGE_SERVER')) {
      winston.warn(`${this.client.user.tag} does not have the \`MANAGE_SERVER\` permission`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_MISSING_BOT_PERMS', message.author, 'MANAGE_SERVER')
      })
      return
    }

    const adminService = require('./../../FutabaBot').getAdminService()
    adminService.setGreetingTimeout(message.guild, timeout * 1000) // timeout must be in milliseconds
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: constants.get('GREETING_TIMEOUT_MSG', adminService.getGreetingTimeout(message.guild) / 1000)
    })
  }
}
