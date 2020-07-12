const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class CreateVoiceChan extends Command {
  constructor (client) {
    super(client, {
      name: 'createvoicechan',
      aliases: ['cvch'],
      group: 'admin',
      memberName: 'createvoicechan',
      description: 'Creates a voice channel with a given name.',
      args: [
        {
          key: 'voice_channel',
          prompt: 'What is the name of the voice channel you’d like to create?',
          type: 'string'
        }
      ]
    })
  }

  run (message, { voice_channel: voiceChannel }) {
    const server = message.guild
    server.createChannel(voiceChannel, { type: 'voice' })
      .then((newVoiceChannel) => {
        const response = `Created “#${newVoiceChannel.name}”`
        winston.info(response)
        discordUtils.embedResponse(message, response, false)
      })
      .catch(error => {
        winston.error(error)
        discordUtils.embedResponse(message, 'Oops! Something went wrong', true)
      })
  }
}
