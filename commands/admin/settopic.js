const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')

module.exports = class setTopicCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'settopic',
      aliases: ['st'],
      group: 'admin',
      memberName: 'settopic',
      description: 'Sets (or changes) the topic of the current channel.',
      args: [
        {
          key: 'new_topic',
          prompt: 'What is the new topic?',
          type: 'string'
        }
      ]
    })
  }

  async run (message, { new_topic: newTopic }) {
    const currentChannel = message.channel

    currentChannel.setTopic(newTopic)
      .then(updatedChannel => {
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          description: `Successfully changed topic to “${updatedChannel.topic}”.`
        })
        console.debug(`Successfully changed topic to “${updatedChannel.topic}”`)
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
