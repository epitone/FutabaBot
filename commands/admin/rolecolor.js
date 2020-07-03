const { Command } = require('discord.js-commando')
const winston = require('winston')
const discordUtils = require('../../utils/discord-utils')

module.exports = class RoleColorCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'rolecolor',
      aliases: ['rc'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'rolecolor', // the name of the command within the group (this can be different from the name).
      description: 'Set a role’s color using its hex value. Provide no color in order to see the hex value of the color of the specified role. Changing the role color requires that the role be lower in the hierarchy than your highest role.',
      args: [
        {
          key: 'role',
          prompt: 'What role would you like to change/view the role color for?',
          type: 'role'
        },
        {
          key: 'color',
          prompt: 'What color would you like to change it to? (Leave blank to view the role color instead)',
          type: 'string',
          default: '' // if no argument is given, this is the default value
        }
      ]
    })
  }

  async run (message, { role, color }) {
    const constants = require('./../../FutabaBot').getConstants()
    if (!discordUtils.hasPerms(message.member, 'MANAGE_ROLES')) {
      winston.warn(`${message.member} tried to execute ${this.name} command without proper authority`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('INSUFFICIENT_PERMISSIONS', message.author)
      })
      return
    }

    if (color) {
      const botHighestRole = message.guild.me.roles.highest
      if (botHighestRole.comparePositionTo(role) <= 0) {
        winston.error(constants.get('ROLE_HIERARCHY_ERROR'))
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: constants.get('ROLE_HIERARCHY_ERROR')
        })
      } else if (!(/^[0-9A-F]{6}$/i.test(color))) {
        winston.error(`${message.member} entered an invalid hex code`)
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: constants.get('INVALID_COLOR')
        })
      } else {
        const updated = await role.setColor(`#${color}`)
        winston.info(`Set ${role} color to ${updated.color}`)
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          description: constants.get('ROLE_COLOR_UPDATE')
        })
      }
      return
    }
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: `${role} color is: ${role.hexColor}`
    })
  }
}
