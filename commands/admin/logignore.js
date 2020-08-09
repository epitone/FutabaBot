/*
Author: epitone
logignore.js (c) 2020
Desc: Toggles whether the logserver command ignores this channel.
Created:  2020-07-11T16:08:27.739Z
Modified: 2020-08-09T01:00:32.690Z
*/

const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')
const winston = require('winston')

module.exports = class LogIgnoreCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'logignore',
      group: 'admin', // the command group the command is a part of.
      memberName: 'logignore', // the name of the command within the group (this can be different from the name).
      description: 'Toggles whether the logserver command ignores this channel.',
      ownerOnly: true
    })
  }

  run (message) {
    const constants = require('../../FutabaBot').getConstants()
    if (!discordUtils.hasPerms(message.member, 'ADMINISTRATOR')) {
      winston.warn(`${message.member} tried to execute ${this.name} command without proper authority`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('INSUFFICIENT_PERMISSIONS', message.author)
      })
      return
    }

    if (!discordUtils.hasPerms(message.guild.me, 'ADMINISTRATOR')) {
      winston.warn(`${this.client.user.tag} does not have the \`ADMINISTRATOR\` permission`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_MISSING_BOT_PERMS', message.author, 'ADMINISTRATOR')
      })
      return
    }

    const logService = require('./../../FutabaBot').getLogService()
    const result = logService.logIgnore(message.guild, message.channel)
    if (result) {
      if (Array.isArray(result)) { // row was deleted
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          description: constants.get('LOG_CHANNEL_REMOVED', message.channel)
        })
      } else { // channel was removed
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          description: constants.get('LOG_CHANNEL_ADDED', message.channel)
        })
      }
    }
  }
}
