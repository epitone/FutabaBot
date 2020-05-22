const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class DeleteRole extends Command {
  constructor (client) {
    super(client, {
      name: 'deleterole',
      aliases: ['dr'],
      group: 'admin', // the command group the command is a part of.
      memberName: 'deleterole', // the name of the command within the group (this can be different from the name).
      description: 'Deletes a role with a given name.',
      guildOnly: true,
      args: [
        {
          key: 'role',
          prompt: 'What is the name of the role you\'d like to delete?',
          type: 'string'
        }
      ]
    })
  }

  run (message, { role }) {
    /// do stuff here
    const server = message.guild
    const foundRole = server.roles.find(searchedRole => searchedRole.name === role)

    if (foundRole) {
      foundRole.delete()
        .then((deleted) => {
          const response = `Deleted “${deleted.name}” role`
          winston.info(response)
          discordUtils.embedResponse(message, {
            color: 'ORANGE',
            description: response
          })
        })
        .catch((error) => {
          winston.error(error)
          discordUtils.embedResponse(message, {
            color: 'RED',
            description: 'Oops! Something went wrong!'
          })
        })
    } else {
      const response = 'I couldn\'t find a role with that name.'
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: response
      })
    }
  }
}
