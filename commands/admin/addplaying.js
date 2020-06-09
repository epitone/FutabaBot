const { Command } = require('discord.js-commando')

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
          prompt: 'What type of playing status is it? (options: Playing, Watching or Listening)',
          type: 'string',
          oneOf: ['Playing', 'Watching', 'Listening']
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
  }
}
