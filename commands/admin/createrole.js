const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class CreateRole extends Command {
  constructor (client) {
    super(client, {
      name: 'createrole',
      aliases: ['cr'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'createrole', // the name of the command within the group (this can be different from the name).
      description: 'Creates a role with a given name.',
      guildOnly: true,
      args: [
        {
          key: 'role',
          prompt: 'What is the name of the role you’d like to create?',
          type: 'string'
        }
      ]
    })
  }

  run (message, { role }) {
    // TODO: check if role doesn't already exist?
    const server = message.guild
    server.createRole({ name: role })
      .then((role) => {
        const response = `Created new role with name “${role.name}”`
        winston.info(response)
        discordUtils.embedResponse(message, response, false)
      })
      .catch((error) => {
        winston.error(error)
        discordUtils.embedResponse(message, 'Oops! Something went wrong', true)
      })
  }
}
