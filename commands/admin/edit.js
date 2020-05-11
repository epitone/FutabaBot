const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')

// TODO: add support for embed messages

module.exports = class EditCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'edit',
      group: 'admin',
      memberName: 'edit',
      description: 'Edit a bot message. You must provide a messsage ID and new text.',
      args: [
        {
          key: 'msg_id',
          prompt: 'What is the ID of the message?',
          type: 'string'
        },
        {
          key: 'new_msg',
          prompt: 'What is the new message?',
          type: 'string'
        }
      ]
    })
  }

  async run (message, { msg_id: messageID, new_msg: newMessage }) {
    const server = message.guild

    const channels = server.channels.cache

    for (const [, channel] of channels) {
      if (channel.type === 'text') {
        channel.messages.fetch(messageID).then(oldMessage => {
          oldMessage.edit(newMessage)
            .then(editedMessage => {
              discordUtils.embedResponse(message, {
                color: 'ORANGE',
                description: `Message with ID “${messageID}” successfully edited`
              })
              console.debug(`Successfully edited message (id: ${editedMessage.id})`)
            })
        })
      }
    }
    discordUtils.embedResponse(message, {
      color: 'RED',
      description: 'Could not find a message with that ID.'
    })
  }
}
