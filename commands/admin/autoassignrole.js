const { Command } = require('discord.js-commando')
const { Permissions } = require('discord.js')
const discordUtils = require('./../../utils/discord-utils')
const winston = require('winston')

module.exports = class AutoAssignRoleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'autoassignrole',
      aliases: ['aar'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'autoassignrole', // the name of the command within the group (this can be different from the name).
      description: 'Automatically assigns a specified role to every user who joins the server. Provide no parameters to disable.',
      args: [
        {
          key: 'role',
          prompt: 'What role would you like to assign? (Leave blank to disable this feature)',
          type: 'role',
          default: '' // if no argument is given, this is the default
        }
      ]
    })
  }

  run (message, { role }) {
    const bot = message.guild.me
    const constants = require('./../../FutabaBot').getConstants()
    if (!discordUtils.hasPerms(message.member, 'MANAGE_ROLES')) {
      winston.warn(`${message.member} tried to execute ${this.name} command without proper authority`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('INSUFFICIENT_PERMISSIONS', message.author)
      })
      return
    }
    if (!discordUtils.hasPerms(bot, Permissions.FLAGS.MANAGE_ROLES)) {
      winston.warn(`${this.client.user.tag} does not have the ${Permissions.FLAGS.MANAGE_ROLES} permission`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_MISSING_BOT_PERMS', message.author, 'MANAGE_ROLES')
      })
      return
    }
    const adminService = require('./../../FutabaBot').getAdminService()
    const aarID = adminService.setAutoAssignRole(message.guild, role.id)
    if (aarID !== role.id) {
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: constants.get('AAR_SUCCESS', message.author, role)
      })
    }
  }
}
