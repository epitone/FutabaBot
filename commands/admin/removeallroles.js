const { Command } = require('discord.js-commando')
const { Permissions } = require('discord.js')
const discordUtils = require('../../utils/discord-utils')

module.exports = class RemoveAllRolesCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'removeallroles',
      aliases: ['rar'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'removeallroles', // the name of the command within the group (this can be different from the name).
      description: 'Removes all roles from a mentioned user.',
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
    const updatedMember = await member.roles.remove(member.roles.cache)
    if (updatedMember.roles.cache.size === 1) { // note: all users have the @everyone role - so the default role cache size is 1
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: constants.get('REMOVE_ROLES_SUCCESS', member.user)
      })
    }
  }
}
