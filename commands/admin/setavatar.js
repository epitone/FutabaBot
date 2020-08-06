const { Command } = require('discord.js-commando')
const validUrl = require('valid-url')
const { extname } = require('path')
const discordUtils = require('./../../utils/discord-utils')
const stringUtils = require('./../../utils/string-utils')
const { stat } = require('fs').promises
const getBuffer = require('bent')('buffer')
const winston = require('winston')
module.exports = class TemplateCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setavatar',
      group: 'admin',
      memberName: 'setavatar',
      description: 'Sets a new avatar image for the bot. The image can be a full filepath to a local file or a URL.',
      ownerOnly: true,
      args: [
        {
          key: 'avatar',
          prompt: 'Where is the image for the bot? (Can be a full filepath or a URL)',
          type: 'string'
        }
      ]
    })
  }

  async run (message, { avatar }) {
    const constants = require('./../../FutabaBot').getConstants()
    let stats = null
    try {
      stats = await stat(avatar).isFile()
    } catch (error) {
      stats = false
    }
    const oldAvatar = this.client.user.avatar
    let updatedBot = null
    if (stats && stringUtils.imageExtensions.includes(extname(avatar).slice(1).toLowerCase())) {
      // valid image file found
      updatedBot = await this.client.user.setAvatar(avatar)
    } else if (validUrl.isUri(avatar)) {
      try {
        const imageBuffer = await getBuffer(avatar)
        updatedBot = await this.client.user.setAvatar(imageBuffer)
      } catch (error) {
        winston.error(error)
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: constants.get('INVALID_PATH')
        })
        return
      }
    }

    if (updatedBot.avatar !== oldAvatar) {
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: constants.get('AVATAR_SET_SUCCESS')
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
