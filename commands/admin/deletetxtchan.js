const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')

module.exports = class DeleteTxtChan extends Command {
  constructor (client) {
    super(client, {
      name: 'deletetxtchan',
      aliases: ['dtch'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'deltxtchan', // the name of the command within the group (this can be different from the name).
      guildOnly: true,
      description: 'Deletes a text channel with a given name.',
      args: [
        {
          key: 'text_channel',
          prompt: 'What is the name of the text channel you\'d like to delete?',
          type: 'text-channel'
        }
      ]
    })
  }

  run (message, { text_channel: textChannel }) {
    const server = message.guild
    const channel = server.channels.find(result => result.name === textChannel)
    if (channel && channel.type === 'text' && channel.deletable) {
      channel.delete()
        .then(deletedChannel => {
          const response = `Successfully deleted “#${deletedChannel.name}”`
          console.log(response)
          discordUtils.embedResponse(message, {
            color: 'ORANGE',
            description: response
          })
        })
        .catch((error) => {
          console.error(error)
          discordUtils.embedResponse(message, {
            color: 'RED',
            description: 'Oops! Something went wrong!'
          })
        })
    } else {
      const response = 'Sorry I couldn\'t find that channel, or the channel cannot be deleted!'
      console.log(response)
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: response
      })
    }
  }
}
