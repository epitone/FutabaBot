const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class DeleteVoiceChan extends Command {
  constructor (client) {
    super(client, {
      name: 'delvoicechan',
      aliases: ['dvch'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'delvoicechan', // the name of the command within the group (this can be different from the name).
      description: 'Deletes a voice channel with a given name.',
      guildOnly: true,
      args: [
        {
          key: 'voice_channel',
          prompt: 'What is the name of the voice channel you\'d like to delete?',
          type: 'voice-channel'
        }
      ]
    })
  }

  run (message, { voice_channel: voiceChannel }) {
    const server = message.guild
    const channel = server.channels.find(result => result.name === voiceChannel)
    if (channel && channel.type === 'voice' && channel.deletable) {
      channel.delete()
        .then(deletedChannel => {
          const response = `Deleted “#${deletedChannel.name}”`
          winston.info(response)
          discordUtils.embedResponse(message, {
            color: 'ORANGE',
            description: response
          })
        })
        .catch(error => {
          winston.error(error)
          discordUtils.embedResponse(message, {
            color: 'RED',
            description: 'Oops! Something went wrong!'
          })
        })
    } else {
      const response = 'Sorry I couldn\'t find that channel, or the channel cannot be deleted!'
      winston.info(response)
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: response
      })
    }
  }
}
