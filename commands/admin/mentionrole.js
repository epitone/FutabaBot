const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')
const winston = require('winston/lib/winston/config')
module.exports = class MentionRoleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'mentionrole',
      aliases: ['mr'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'mentionrole', // the name of the command within the group (this can be different from the name).
      description: 'Mentions a role. If the role is not mentionable, bot will make it mentionable for the duration of the command.',
      args: [
        {
          key: 'role',
          prompt: 'if no args provided, prompt the user with this message',
          type: 'role',
          default: '' // if no argument is given, this is the default value
        }
      ]
    })
  }

  async run (message, { role }) {
    const bot = message.guild.me
    const constants = require('./../../FutabaBot').getConstants()
    if (!discordUtils.hasPerms(message.member, 'MENTION_EVERYONE')) {
      winston.warn(`${message.member} tried to execute ${this.name} command without proper authority`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('INSUFFICIENT_PERMISSIONS', message.author)
      })
      return
    }

    if (!discordUtils.hasPerms(bot, 'MENTION_EVERYONE')) {
      discordUtils.embedResponse(message, {
        description: constants.get('ERR_MISSING_BOT_PERMS', message.author, 'MENTION_EVERYONE')
      })
      return
    }

    if (role.mentionable) {
      winston.info(`${bot}: ${role}`)
      message.send(`${role}`)
    } else {
      winston.info('role is not mentionable, setting as mentionable...')
      let updatedRole = await role.setMentionable(true, 'mentionrole requires role be mentionable')
      if (updatedRole.mentionable) {
        winston.info(`${updatedRole} mention status set to true successfully.`)
        winston.info(`${bot}: ${updatedRole}`)
        message.send(`${updatedRole}`)
        updatedRole = updatedRole.setMentionable(false, 'mentionrole executed successfully, returning role to default mention state')
        winston.info(`${updatedRole} mention status reset to orignal value.`)
      }
    }
  }
}
