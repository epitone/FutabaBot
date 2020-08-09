const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')
const { Permissions } = require('discord.js')

module.exports = class WarnCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'warn',
      group: 'admin',
      memberName: 'warn', // the name of the command within the group (this can be different from the name).
      description: 'Warns a user.',
      args: [
        {
          key: 'user',
          prompt: 'What user would you like to warn?',
          type: 'member'
        },
        {
          key: 'reason',
          prompt: 'What reason do you have to warn them? (This can be left blank)',
          type: 'string',
          default: ''
        }
      ]
    })
  }

  run (message, { member, reason }) {
    /// do stuff here
    const constants = require('./../../FutabaBot').getConstants()
    if (!discordUtils.hasPerms(message.member, Permissions.FLAGS.BAN_MEMBERS)) {
      winston.warn(`${message.member} tried to execute ${this.name} command without proper authority`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('INSUFFICIENT_PERMISSIONS', message.author)
      })
      return
    }

    if (!discordUtils.hasPerms(message.guild.me, Permissions.FLAGS.BAN_MEMBERS)) {
      winston.warn(`${this.client.user.tag} does not have the \`${Permissions.FLAGS.BAN_MEMBERS}\` permission`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_MISSING_BOT_PERMS', message.author, 'MANAGE_GUILD')
      })
      return
    }

    // otherwise add a warning
    
  }
}
