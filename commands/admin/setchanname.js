const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')

module.exports = class SetChannelNameCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setchanname',
      aliases: ['schn'],
      group: 'admin',
      memberName: 'setchanname',
      description: 'Changes the name of the current channel.',
      args: [
        {
          key: 'new_channel_name',
          prompt: 'What is the new channel name?',
          type: 'string'
        }
      ]
    })
  }

  async run (message, { new_channel_name: newChannelName }) {
    const currentChannel = message.channel
    const oldChannelName = message.channel.name

    currentChannel.setName(newChannelName)
      .then(updatedChannel => {
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          description: `Successfully changed “#${oldChannelName}” to “#${updatedChannel.name}”.`
        })
        console.debug(`Successfully changed “#${oldChannelName}” to “#${updatedChannel.name}”`)
      })
      .catch((err) => {
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: 'Oops! Something went wrong!'
        })
        console.error(err)
      })
  }
}
