const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')
module.exports = class GreetCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'greet',
      group: 'admin', // the command group the command is a part of.
      memberName: 'greet', // the name of the command within the group (this can be different from the name).
      description: 'Toggles anouncements on the current channel when someone joins the server.'
    })
  }

  run (message) {
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

    const channel = message.channel
    const adminService = require('./../../FutabaBot').getAdminService()
    if (adminService.getGreetingChannel(message.guild) !== null) {
      adminService.setGreetingChannel(message.guild, null)
    } else {
      adminService.setGreetingChannel(message.guild, channel)
    }
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: `Server join announcements ${adminService.getGreetingChannel(message.guild) === null ? 'disabled' : 'enabled'}.`
    })
  }
}
