/*
Author: Hello (World)
byemsg.js (c) 2020
Desc: Command that sets up a message when a user leaves the server
Created:  2020-07-09T17:24:09.816Z
Modified: 2020-07-09T18:01:21.624Z
*/

const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')
const winston = require('winston')

module.exports = class TemplateCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'byemsg',
      group: 'admin', // the command group the command is a part of.
      memberName: 'byemsg', // the name of the command within the group (this can be different from the name).
      description: 'Sets a new leaving announcement message which will be shown in the server\'s channel. Use `$user.mention$` in the message if you want to mention the leaving member. Using this with no arguments will show the current leaving message. To use an embed you can optionally add “true” as a second parameter to the command.',
      args: [
        {
          key: 'bye_msg',
          prompt: 'What message would you like to send when someone leaves the server?',
          type: 'string',
          default: ''
        },
        {
          key: 'embed_enabled',
          prompt: 'Should embeds be enabled?',
          type: 'boolean',
          default: false
        }
      ]
    })
  }

  run (message, { bye_msg: byeMsg, embed_enabled: embedEnabled }) {
    // do stuff here

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
    if (!byeMsg) {
      const { byeMsg: savedGoodbyeMsg, embed: embedEnabledSetting } = adminService.getLeavingMessage(message.guild)
      if (savedGoodbyeMsg) {
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          description: constants.get('LEAVING_MESSAGE_RESPONSE', savedGoodbyeMsg, embedEnabledSetting)
        })
      } else {
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          description: constants.get('LEAVING_MESSAGE_NOT_FOUND')
        })
      }
    } else {
      const { byeMsg: oldLeavingMsg, embed: oldEmbedEnabled } = adminService.getLeavingMessage(message.guild)
      if (oldLeavingMsg && oldLeavingMsg.toLocaleLowerCase().localeCompare(byeMsg.toLocaleLowerCase()) === 0 && oldEmbedEnabled === embedEnabled) {
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: constants.get('LEAVING_MESSAGE_ERR')
        })
      } else {
        adminService.setLeavingMessage(message.guild, byeMsg, embedEnabled)
        const { byeMsg: newLeavingMsg, embed: newEmbedEnabled } = adminService.getLeavingMessage(message.guild)
        if (byeMsg.toLocaleLowerCase().localeCompare(newLeavingMsg.toLocaleLowerCase()) === 0 && newEmbedEnabled === embedEnabled) {
          discordUtils.embedResponse(message, {
            color: 'ORANGE',
            description: constants.get('LEAVING_MESSAGE_RESPONSE', newLeavingMsg, newEmbedEnabled)
          })
        } else {
          winston.error(`Something went wrong while executing ${this.name}`)
          discordUtils.embedResponse(message, {
            color: 'RED',
            description: constants.get('ERR_GENERIC')
          })
        }
      }
    }
  }
}
