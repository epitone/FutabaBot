/*
Author: secondubly
discord-utils.js (c) 2020
Desc: Discord utilities used throughout the bot
Created:  2020-07-09T16:06:31.420Z
*/

const { MessageEmbed, Message, VoiceState, GuildMember, TextChannel } = require('discord.js') // eslint-disable-line

module.exports = {
  /**
   * Sends an embed message to a channel in a server. You can use either a message object or text channel to determine where to send the message.
   * @param {Message} message message to respond to
   * @param {Object} embedOptions Object containing embed fields and values, see https://discord.js.org/#/docs/main/stable/class/MessageEmbed for properties
   * @param {TextChannel} textChannel text channel to send response to
   * @param {Number} timeoutMilliseconds how long until message is auto-deleted
   */
  async embedResponse (message = null, embedOptions, textChannel = null, timeoutMilliseconds = 0) {
    const embed = new MessageEmbed()
    if (embedOptions.color) embed.setColor(embedOptions.color)
    if (embedOptions.title) embed.setTitle(embedOptions.title)
    if (embedOptions.description) embed.setDescription(embedOptions.description)
    if (embedOptions.url) embed.setURL(embedOptions.url)
    if (embedOptions.author) embed.setAuthor(embedOptions.author)
    if (embedOptions.footer) embed.setFooter(embedOptions.footer)
    if (embedOptions.fields) {
      for (const field of embedOptions.fields) {
        embed.addFields({
          name: field.name,
          value: field.value,
          inline: field.inline ? field.inline : false
        })
      }
    }
    if (textChannel) {
      const response = await textChannel.send(embed)
      if (timeoutMilliseconds !== 0) {
        response.delete({ timeout: timeoutMilliseconds })
      }
    } else {
      message.embed(embed)
      if (timeoutMilliseconds !== 0) {
        message.delete({ timeout: timeoutMilliseconds })
      }
    }
  },

  /**
   * Checks if user is in a voice channel currently
   * @param {VoiceState} voiceState the VoiceState of the member
   * @param {Message} message message that we're responding to
   * @param {string} response response to send
   */
  inVoiceChannel (voiceState, message, response = null) {
    if (!voiceState.channel) {
      this.embedResponse(message, {
        color: 'RED',
        description: response === null ? 'You need to be in a voice channel to use this command.' : response
      })
      console.warn(`${message.author.tag} attempted to run a music command without being in a voice channel.`)
      return false
    }
    return true
  },

  /**
   * Check whether member has permission
   * @param {GuildMember} user server member to check permissions for
   * @param {string} permissionRole role to checking
   * @param {boolean} adminOverride whether to allow admin permission override
   * @param {boolean} ownerOverride whether to allow guild ownership to override
   */
  hasPerms (user, permissionRole, adminOverride = true, ownerOverride = true) {
    return user.hasPermission(permissionRole, { checkAdmin: adminOverride, checkOwner: ownerOverride })
  }
}
