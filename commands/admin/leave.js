const { Command } = require('discord.js-commando')
const winston = require('winston')
const discordUtils = require('../../utils/discord-utils')

module.exports = class LeaveCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'leave',
      group: 'admin',
      memberName: 'leave',
      description: 'Makes bot leave the server. Requires either server name or server ID.',
      ownerOnly: true,
      args: [
        {
          key: 'server_reference',
          prompt: 'What server would you like to leave? (Can either be a server ID or server name)',
          type: 'string'
        }
      ]
    })
  }

  run (message, { server_reference: serverReference }) {
    const guild = this.client.guilds.cache.has(serverReference) ? this.client.guilds.cache.get(serverReference) : this.client.guilds.cache.find(guild => guild.name === serverReference)
    const constants = require('./../../FutabaBot').getConstants()
    if (!guild) {
      winston.error(`Couldn't find a guild with the given parameters: ${serverReference}`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_GUILD_NOT_FOUND')
      })
      return
    }

    const adminService = require('./../../FutabaBot').getAdminService()
    adminService.leaveGuild(guild)
    guild.leave()
      .then(guild => winston.info(`Left guild ${guild}`))
      .catch(winston.error)
  }
}
