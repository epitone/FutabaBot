const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class CreateTxtChanCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'createtxtchan',
      aliases: ['ctch'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'createtextchan', // the name of the command within the group (this can be different from the name).
      guildOnly: true,
      description: 'Creates a text channel with a given name.',
      args: [
        {
          key: 'text_channel',
          prompt: 'What is the name of the text channel you’d like to create?',
          type: 'string'
        }
      ]
    })
  }

  run (message, { text_channel: textChannel }) {
    // TODO make sure to check if a channel with the requested name doesn't already exist
    const server = message.guild
    server.channels.create(textChannel, { type: 'text' })
      .then(newChannel => {
        const response = `Successfully created “${newChannel}”`
        winston.info(response)
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          description: response
        })
      })
      .catch((error) => {
        winston.error(error)
        discordUtils.embedResponse(message, 'Oops! Something went wrong', true)
      })
  }
}
