const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')
const winston = require('winston')
module.exports = class TemplateCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'greetmsg',
      group: 'admin', // the command group the command is a part of.
      memberName: 'greetmsg', // the name of the command within the group (this can be different from the name).
      description: 'Sets a new join announcement message which will be shown in the server\'s channel. Use `$user.mention$` in the message if you want to mention the new member. Using this with no arguments will show the current greeting message. To use an embed you can optionally add “true” as a second parameter to the command.',
      args: [
        {
          key: 'greeting_msg',
          prompt: 'What announcement message would you like to send? (You can use `$user.mention$` to mention the user in the announcement)',
          type: 'string',
          default: '' // if no argument is given, this is the default value
        },
        {
          key: 'embed',
          prompt: 'Would you like to use an embed?',
          type: 'boolean',
          default: false

        }
      ]
    })
  }

  run (message, { greeting_msg: greetingMsg, embed }) {
    const constants = require('../../FutabaBot').getConstants()
    if (!discordUtils.hasPerms(message.member, 'MANAGE_GUILD')) {
      winston.warn(`${message.member} tried to execute ${this.name} command without proper authority`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('INSUFFICIENT_PERMISSIONS', message.author)
      })
      return
    }

    if (!discordUtils.hasPerms(message.guild.me, 'MANAGE_GUILD')) {
      winston.warn(`${this.client.user.tag} does not have the \`MANAGE_GUILD\` permission`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: constants.get('ERR_MISSING_BOT_PERMS', message.author, 'MANAGE_GUILD')
      })
      return
    }

    const adminService = require('./../../FutabaBot').getAdminService()
    if (!greetingMsg) {
      const { greetingMsg: savedGreeting, embed: embedEnabled } = adminService.getGreetingMessage(message.guild)
      if (savedGreeting) {
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          description: constants.get('GREETING_MESSAGE_RESPONSE', savedGreeting, embedEnabled)
        })
      } else {
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          description: constants.get('GREETING_MESSAGE_NOT_FOUND')
        })
      }
    } else {
      const { greetingMsg: oldGreetingMsg, embed: oldEmbedEnabled } = adminService.getGreetingMessage(message.guild)
      if (oldGreetingMsg.toLocaleLowerCase().localeCompare(greetingMsg.toLocaleLowerCase()) === 0 && oldEmbedEnabled === embed) {
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: constants.get('GREETING_MESSAGE_ERR')
        })
      } else {
        adminService.setGreetingMessage(message.guild, greetingMsg, embed)
        const { greetingMsg: newGreetingMsg, embed: newEmbedEnabled } = adminService.getGreetingMessage(message.guild)
        if (greetingMsg.toLocaleLowerCase().localeCompare(newGreetingMsg.toLocaleLowerCase()) === 0 && newEmbedEnabled === embed) {
          discordUtils.embedResponse(message, {
            color: 'ORANGE',
            description: constants.get('GREETING_MESSAGE_RESPONSE', newGreetingMsg, newEmbedEnabled)
          })
        } else {
          winston.error(`Something went wrong while executing ${this.name}`)
          discordUtils.embedResponse(message, {
            color: 'ORANGE',
            description: constants.get('ERR_GENERIC')
          })
        }
      }
    }
  }
}
