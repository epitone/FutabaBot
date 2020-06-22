const { Command } = require('discord.js-commando')
const { Permissions } = require('discord.js')
const discordUtils = require('../../utils/discord-utils')

module.exports = class RoleHoistCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rolehoist',
      aliases: ['rh'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'rolehoist', // the name of the command within the group (this can be different from the name).
      description: 'Toggle whether members within this role are displayed separately from online members in the sidebar.',
      args: [
        {
          key: 'role',
          prompt: 'What role would you like to hoist?',
          type: 'role'
        }
      ]
    })
  }

  async run (message, { role }) {
    const constants = require('./../../FutabaBot').getConstants()
    const bot = message.guild.me
    if (!discordUtils.hasPerms(bot, Permissions.FLAGS.MANAGE_ROLES)) {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_MISSING_BOT_PERMS', message.author.tag, 'MANAGE_ROLES')
      })
      return
    }

    if (bot.roles.highest.comparePositionTo(role) <= 0) {
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: constants.get('ROLE_HIERARCHY_ERROR')
      })
    }

    const newRole = await role.setHoist(!role.hoist)
    if (newRole) {
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: constants.get('ROLE_HOIST', newRole.hoist)
      })
    } else {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_GENERIC')
      })
    }
  }
}
