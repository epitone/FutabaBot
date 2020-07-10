/*
Author: secondubly
byedel.js (c) 2020
Desc: byedel sets the time it takes (in seconds) for goodbye messages to be auto-deleted. Set to 0 to disable automatic deletion
Created:  2020-07-10T02:24:05.808Z
Modified: 2020-07-10T02:43:16.497Z
*/

const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class ByeDelCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'byedel',
      group: 'admin', // the command group the command is a part of.
      memberName: 'byedel', // the name of the command within the group (this can be different from the name).
      description: 'Sets the time it takes (in seconds) for goodbye messages to be auto-deleted. Set it to 0 to disable automatic deletion.',
      args: [
        {
          key: 'timeout',
          prompt: 'How long should goodbye messages stay available for? (In seconds)',
          type: 'integer',
          validate: timeout => timeout === 0 || (timeout > 0 && timeout < Number.MAX_SAFE_INTEGER)
        }
      ]
    })
  }

  run (message, { timeout }) {
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

    const adminService = require('./../../FutabaBot').getAdminService()
    adminService.setGoodbyeTimeout(message.guild, timeout * 1000) // timeout must be in milliseconds
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: constants.get('GOODBYE_TIMEOUT_MSG', adminService.getGoodbyeTimeout(message.guild) / 1000)
    })
  }
}
