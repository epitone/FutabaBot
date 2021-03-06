const { Command } = require('discord.js-commando')
const { Permissions } = require('discord.js')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

// TODO: check edge cases for this command

module.exports = class ChatMute extends Command {
  constructor (client) {
    super(client, {
      name: 'chatmute',
      group: 'admin',
      memberName: 'chatmute',
      description: 'Prevents a mentioned user from chatting in text channels.',
      args: [
        {
          key: 'user',
          prompt: 'What user would you like to mute?',
          type: 'member'
        }
      ]
    })
  }

  async run (message, { user }) {
    const muteRole = message.guild.roles.find('name', 'chat muted')
    if (!muteRole) {
      const chatMutedPermissions = new Permissions(70321152) // only allows read message history, change nickname and view channels and connection to voice chat
      message.guild.createRole({
        name: 'chat muted',
        permissions: chatMutedPermissions
      })
        .then((role) => {
          for (const [, channel] of message.guild.channels) {
            if (channel.type === 'text') {
              channel.overwritePermissions(role, {
                SEND_MESSAGES: false
              })
                .then(updated => winston.info(`new permissions for #${updated.name}: ${JSON.stringify(updated.permissionsFor(role))}`))
            }
          }
          winston.info(`created role with name ${role.name}`)
          user.addRole(role)
            .then((muted) => {
              const response = `Successfully muted “${muted.displayName}”`
              winston.info(response)
              discordUtils.embedResponse(message, response)
            })
        })
        .catch(error => {
          winston.error(error)
          discordUtils.embedResponse(message, 'Oops! Something went wrong')
        })
    } else {
      user.addRole(muteRole)
        .then(updated => {
          const response = `Successfully muted “${updated.displayName}”`
          winston.info(response)
          discordUtils.embedResponse(message, response)
        })
        .catch(error => {
          winston.error(error)
          discordUtils.embedResponse(message, 'Oops! Something went wrong')
        })
    }
  }
}
