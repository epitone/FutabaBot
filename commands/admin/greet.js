const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
module.exports = class GreetCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'greet',
      group: 'admin', // the command group the command is a part of.
      memberName: 'greet', // the name of the command within the group (this can be different from the name).
      description: 'Toggles anouncements on the current channel when someone joins the server.'
    })
  }

  run (message) {
    const channel = message.channel
    const adminService = require('./../../FutabaBot').getAdminService()
    if (adminService.getGreetingChannel(message.guild) !== null) {
      adminService.setGreetingChannel(message.guild, null)
    } else {
      adminService.setGreetingChannel(message.guild, channel)
    }
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: `Server join announcements ${adminService.getGreetingChannel(message.guild) === null ? 'disabled' : 'enabled'}.`
    })
  }
}
