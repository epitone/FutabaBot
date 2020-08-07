/*
Author: epitone
logserver.js (c) 2020
Desc: Enables/disables all logging events for a server - when enabled, all log events will output to the channel the command was executed in.
Created:  2020-07-11T15:41:34.002Z
Modified: 2020-08-07T21:35:15.970Z
*/

const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')
const winston = require('winston')

module.exports = class LogServerCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'logserver',
      group: 'admin',
      memberName: 'logserver',
      description: 'Enables/disables all logging events for a server - when enabled, all log events will output to the channel the command was executed in.',
      ownerOnly: true,
      args: [
        {
          key: 'toggle',
          prompt: 'Would you like to enable or disable server-wide logging?',
          type: 'string',
          oneOf: ['enable', 'disable']
        }
      ]
    })
  }

  run (message, { toggle }) {
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
    if (toggle === 'enable') {
      const result = logService.setLogServerChannel(message.guild, message.channel)
      if (result.changes < 1) {
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: constants.get('ERR_GENERIC')
        })
        return
      }
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: constants.get('LOG_SERVER_SET')
      })
    } else {
      const result = logService.setLogServerChannel(message.guild, null)
      if (result.changes < 1) {
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: constants.get('ERR_GENERIC')
        })
        return
      }
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: constants.get('LOG_SERVER_DISABLED')
      })
    }
  }
}
