const { MessageEmbed } = require('discord.js')

exports.embedResponse = (message, embedOptions) => {
  const embed = new MessageEmbed()
  if (embedOptions.color) embed.setColor(embedOptions.color)
  if (embedOptions.title) embed.setTitle(embedOptions.title)
  if (embedOptions.description) embed.setDescription(embedOptions.description)
  if (embedOptions.url) embed.setURL(embedOptions.url)
  if (embedOptions.author) embed.setAuthor(embedOptions.author)
  if (embedOptions.footer) embed.setFooter(embedOptions.footer)
  message.embed(embed)
}

exports.inVoiceChannel = (voiceState, message, response = null) => {
  if (!voiceState.channel) {
    this.embedResponse(message, {
      color: 'RED',
      description: response === null ? 'You need to be in a voice channel to use this command.' : response
    })
    console.log(`${message.author.tag} attempted to run a music command without being in a voice channel.`)
    return false
  }
  return true
}
