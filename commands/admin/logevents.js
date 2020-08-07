/*
Author: Hello (World)
logevents.js (c) 2020
Desc: Shows a list of all log events you can subscribe to with the log command.
Created:  2020-07-12T03:39:04.844Z
Modified: 2020-08-06T21:38:48.453Z
*/

const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')
const winston = require('winston')

module.exports = class TemplateCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'logevents',
      group: 'admin', // the command group the command is a part of.
      memberName: 'logevents', // the name of the command within the group (this can be different from the name).
      description: `Shows a list of all log events you can subscribe to with \`${client.commandPrefix}log\``,
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

    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      title: 'Log Events',
      fields: [
        { name: 'ChannelCreated', value: 'When a channel is created.' },
        { name: 'ChannelDeleted', value: 'When a channel is deleted.' },
        { name: 'ChannelUpdated', value: 'When a channel is updated.' },
        { name: 'MessageDeleted', value: 'When a message is deleted.' },
        { name: 'MessageUpdated', value: 'When a message is updated.' },
        { name: 'UserBanned', value: 'When a user is banned from the server.' },
        { name: 'UserJoined', value: 'When a new user joins the server.' },
        { name: 'UserLeft', value: 'When a user leaves the server.' },
        { name: 'UserMuted', value: 'When a user is muted' },
        { name: 'UserPresence', value: 'When a user’s status or activity changes.' },
        { name: 'UserUnbanned', value: 'When a user’s ban is removed.' },
        { name: 'UserUpdated', value: 'When a user’s information has been updated.' },
        { name: 'VoicePresence', value: 'When a user’s voice status changes.' }
      ]
    })
  }
}
