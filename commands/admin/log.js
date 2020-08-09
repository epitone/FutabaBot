/*
Author: Hello (World)
log.js (c) 2020
Desc: Toggles a logging event for the entire server. Disables it if it is active and enables it if it isn't active. Logs will output to the  channel this command is used in unless logserver has been enabled. Use logevents to see a list of subscribable events.
Created:  2020-07-12T14:25:51.687Z
Modified: 2020-08-09T01:51:08.391Z
*/

const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')
const winston = require('winston')

module.exports = class LogCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'log',
      group: 'admin', // the command group the command is a part of.
      memberName: 'log', // the name of the command within the group (this can be different from the name).
      description: `Toggles a logging event for the entire server. Disables it if it is active and enables it if it isn’t active. Logs will output to the channel this command is used in unless \`${client.commandPrefix}logserver\` has been enabled. Use \`${client.commandPrefix}logevents\` to see a list of subscribable events.`,
      ownerOnly: true,
      args: [
        {
          key: 'log_event',
          prompt: 'What log event would you like to subscribe to?',
          type: 'string',
          oneOf: ['channelcreated', 'channeldeleted', 'channelupdated', 'messagedeleted', 'messageupdated', 'userbanned', 'userjoined', 'userleft', 'usermuted', 'userpresence', 'userunbanned', 'userupdated', 'voicepresence']
        }
      ]
    })
  }

  run (message, { log_event: logEvent }) {
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

    // otherwise add current channel to log for database
    const logService = require('./../../FutabaBot').getLogService(message.guild)
    const logSymbol = logService.logEvents.getEvent(logEvent)

    if (!logSymbol) {
      // TODO: error log
    }
    const result = logService.setLogEvent(message.guild, message.channel, logSymbol.description)
    if (result.changes < 1) {
      // TODO: error handling
    }

    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: constants.get('LOG_EVENT_SET', logEvent)
    })
  }
}
