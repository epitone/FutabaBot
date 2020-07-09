/*
Author: Hello (World)
bye.js (c) 2020
Desc: description
Created:  2020-07-09T18:05:32.834Z
Modified: 2020-07-09T18:41:30.551Z
*/

const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class ByeCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'bye',
      group: 'admin', // the command group the command is a part of.
      memberName: 'bye', // the name of the command within the group (this can be different from the name).
      description: 'Toggles anouncements on the current channel when someone leaves the server.'
    })
  }

  run (message) {
    const constants = require('./../../FutabaBot').getConstants()
    if (!discordUtils.hasPerms(message.member, 'MANAGE_GUILD')) {
      winston.warn(`${message.member} tried to execute ${this.name} command without proper authority`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('INSUFFICIENT_PERMISSIONS', message.author)
      })
      return
    }

    if (!discordUtils.hasPerms(message.guild.me, 'MANAGE_GUILD')) {
      winston.warn(`${this.client.user.tag} does not have the \`MANAGE_GUILD\` permission`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_MISSING_BOT_PERMS', message.author, 'MANAGE_GUILD')
      })
      return
    }

    const channel = message.channel
    const adminService = require('./../../FutabaBot').getAdminService()
    if (adminService.getLeavingChannel(message.guild) !== null) {
      adminService.setLeavingChannel(message.guild, null)
    } else {
      adminService.setLeavingChannel(message.guild, channel)
    }
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: `Server goodbye announcements ${adminService.getGreetingChannel(message.guild) === null ? 'disabled' : 'enabled'}.`
    })
  }
}
