const { Command } = require('discord.js-commando')
const winston = require('winston')

module.exports = class DieCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'die',
      group: 'admin', // the command group the command is a part of.
      memberName: 'die', // the name of the command within the group (this can be different from the name).
      description: 'Shuts down the bot gracefully. To force a shutdown add “true” as a parameter. A forced shutdown can cause unexpected problems.',
      ownerOnly: true,
      args: [
        {
          key: 'forced',
          prompt: 'Would you like to forcefully shut down the bot?',
          type: 'boolean',
          default: false // if no argument is given, this is the default value
        }
      ]
    })
  }

  run (message, { forced }) {
    if (!forced) {
      winston.info('Bot shutting down gracefully')
      this.client.destroy()
    } else {
      winston.warn('Bot shutting down forecfully')
      process.exit(1)
    }
  }
}
