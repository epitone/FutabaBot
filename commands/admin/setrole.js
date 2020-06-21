const { Command } = require('discord.js-commando')
const { Permissions } = require('discord.js')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class AutoAssignRoleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setrole',
      aliases: ['sr'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'setrole', // the name of the command within the group (this can be different from the name).
      description: 'Sets a role for a given user',
      args: [
        {
          key: 'member',
          prompt: 'What user would you like to assign a role to?',
          type: 'member'
        },
        {
          key: 'role',
          prompt: 'What role would you like to assign to them?',
          type: 'role'
        }
      ]
    })
  }

  async run (message, { member, role }) {
    const constants = require('./../../FutabaBot').getConstants()

    if (!discordUtils.hasPerms(message.guild.me, Permissions.FLAGS.MANAGE_ROLES)) {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_MISSING_BOT_PERMS', message.author.tag, 'MANAGE_ROLES')
      })
      return
    }
    const user = member.user
    if (member.roles.cache.has(role.id)) { // check if user already has the role
      winston.error(`${member.author.tag} already has the role: ${role.name}`)
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: `**${message.author.tag}** ${user.tag} already has that role!`
      })
      return
    }

    winston.info(`Adding ${role.name} to ${user.tag}`)
    const updatedMember = await member.roles.add(role)
    if (updatedMember.roles.cache.has(role.id)) {
      winston.info(`Successfully added role ${role.name} to ${user.tag}`)
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: `**${message.author.tag}** Successfully added “${role.name}” to ${user.tag}`
      })
    } else {
      winston.error('Something went wrong with the setrole command')
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: 'Oops! Something went wrong!'
      })
    }
  }
}
