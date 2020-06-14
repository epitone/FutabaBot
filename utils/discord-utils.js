const { MessageEmbed, Permissions } = require('discord.js')

module.exports = {
  embedResponse (message, embedOptions, textChannel = null) {
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
      textChannel.send(embed)
      return
    }
    message.embed(embed)
  },

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

  isAdminOrHasPerms (user, permissionRole) {
    return user.hasPermisssion(Permissions.FLAGS.ADMINISTRATOR) || user.hasPermission(permissionRole)
  }
}
