const { Command } = require('discord.js-commando')
const { Permissions } = require('discord.js')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')
module.exports = class RemoveAllRolesCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'removeallroles',
      aliases: ['rar'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'removeallroles', // the name of the command within the group (this can be different from the name).
      description: 'Removes all roles which are lower than your highest role in the role hierarchy from the user you specify.',
      args: [
        {
          key: 'user',
          prompt: 'What user would you like to remove all roles from?',
          type: 'member'
        }
      ]
    })
  }

  async run (message, { user: member }) {
    const constants = require('./../../FutabaBot').getConstants()

    if (!discordUtils.hasPerms(message.guild.me, Permissions.FLAGS.MANAGE_ROLES)) {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_MISSING_BOT_PERMS', message.author, 'MANAGE_ROLES')
      })
      return
    }
    const botHighestRole = message.guild.me.roles.highest
    const totalRolesCount = member.roles.cache.size

    const rolesToRemove = member.roles.cache.filter(role => botHighestRole.comparePositionTo(role) > 0)
    const updatedMember = await member.roles.remove(rolesToRemove)
    if (updatedMember.roles.cache.size < totalRolesCount) { // note: all users have the @everyone role - so the default role cache size is 1
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: constants.get('REMOVE_ROLES_SUCCESS', member.user)
      })
    } else {
      winston.error(`Something went wrong while executing ${this.name}`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_GENERIC')
      })
    }
  }
}
