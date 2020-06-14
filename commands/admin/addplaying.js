const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
module.exports = class AddPlayingCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'addplaying',
      aliases: ['addpl'],
      group: 'admin',
      memberName: 'addplaying',
      description: 'Adds a specified string to the list of playing strings to rotate. You must pick either “Playing”, “Watching” or “Listening” as the first parameter.',
      ownerOnly: true,
      args: [
        {
          key: 'playing_type',
          prompt: 'What type of playing status is it? (must be one of: Playing, Watching or Listening)',
          type: 'string',
          oneOf: ['playing', 'watching', 'listening']
        },
        {
          key: 'playing_status',
          prompt: 'What is the status string you’d like to use?',
          type: 'string'
        }
      ]
    })
  }

  run (message, { playing_type: playingType, playing_status: playingStatus }) {
    // TODO: add winston logs
    const adminService = require('../../FutabaBot').getAdminService()
    const result = adminService.addPlayingStatus(message.guild, playingType, playingStatus)
    if (result === 1) {
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: `**${message.author.tag}** I successfully added the string.`
      })
    } else {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: 'Oops! Something went wrong!'
      })
    }

  }
}
