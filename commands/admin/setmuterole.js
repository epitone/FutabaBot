const { Command } = require('discord.js-commando')
const { Permissions } = require('discord.js')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')
module.exports = class SetMuteRoleCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setmuterole',
      aliases: ['smr'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'setmuterole', // the name of the command within the group (this can be different from the name).
      description: 'Sets a name of the role which will be assigned to people who should be muted. Default is futaba-mute.',
      args: [
        {
          key: 'mute_role',
          prompt: 'What role would you like to assign? (Leave blank to disable this feature)',
          type: 'role', // this prevents us having to check if the role is valid
          default: 'futaba-mute' // if no argument is given, this is the default
        }
      ]
    })
  }

  async run (message, { mute_role: muteRole }) {
    const guild = message.guild
    let defaultMuteRole
    const mutedPermissions = new Permissions(67175424) // double check this to make the permissions are proper
    const adminService = require('../../FutabaBot').getAdminService()

    if (guild.roles.cache.has(muteRole)) {
      if (adminService.getDefaultMuteRole(guild) === muteRole.id) { // nothing to do
        winston.warn(`${muteRole} is already the default mute role`)
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: `**${message.author.tag}** ${muteRole} is already the default mute role`
        })
      } else {
        const updatedRole = await adminService.setDefaultMuteRole(guild, muteRole)
        const successfulMsg = `**${message.author.tag}** I successfully set the default mute role to ${muteRole}`
        discordUtils.embedResponse(message, {
          color: updatedRole === muteRole.id ? 'ORANGE' : 'RED',
          description: updatedRole === muteRole.id ? successfulMsg : 'Oops! Something went wrong!'
        })
      }
    } else {
      if (muteRole === 'futaba-mute') {
        // create the role and set it as the default
        defaultMuteRole = await guild.roles.create({
          data: {
            name: muteRole,
            color: 'GREY',
            permissions: mutedPermissions,
            position: 0 // should override all other permissions
          }
        })
        const settingsMuteRole = adminService.setDefaultMuteRole(guild, defaultMuteRole)
        const successfulMsg = `**${message.author.tag}** I successfully set the default mute role to ${defaultMuteRole}`
        discordUtils.embedResponse(message, {
          color: settingsMuteRole === defaultMuteRole.id ? 'ORANGE' : 'RED',
          description: settingsMuteRole === defaultMuteRole.id ? successfulMsg : 'Oops! Something went wrong!'
        })
      } else { // the role hasn't been made, return an error message
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: `**${message.author.tag}** that role doesn't exist, have you created it yet?`
        })
      }
    }
  }
}
