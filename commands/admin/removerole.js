const { Command } = require('discord.js-commando')
const { Permissions } = require('discord.js')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class RemoveRoleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'removerole',
      group: 'admin',
      memberName: 'removerole',
      description: 'Rmoves a role from a user.',
      args: [
        {
          key: 'member',
          prompt: 'What member would you like to remove a role from?',
          type: 'member'
        },
        {
          key: 'role',
          prompt: 'What role would you like to remove?',
          type: 'role'
        }
      ]
    })
  }

  async run (message, { member, role }) {
    const constants = require('./../../FutabaBot').getConstants()
    if (!discordUtils.isAdminOrHasPerms(message.guild.me, Permissions.FLAGS.MANAGE_ROLES)) {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_MISSING_BOT_PERMS', message.author.tag, 'MANAGE_ROLES')
      })
      return
    }
    const user = member.user
    if (!member.roles.cache.has(role.id)) { // check if user already has the role
      winston.error(`${message.author.tag} does not have the role: ${role.name}`)
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: `**${message.author.tag}** ${constants.get('MISSING_ROLE', user)}`
      })
      return
    }

    winston.info(`Remove ${role.name} from ${user.tag}`)
    const updatedMember = await member.roles.remove(role)
    if (!updatedMember.roles.cache.has(role.id)) {
      winston.info(`Successfully removed role ${role.name} from ${user.tag}`)
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: `**${message.author.tag}** ${constants.get('REMOVED_ROLE', user, role)}`
      })
    } else {
      winston.error('Something went wrong with the setrole command')
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_GENERIC')
      })
    }

  }
}
