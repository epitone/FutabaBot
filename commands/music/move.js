const { Command } = require('discord.js-commando')
const DiscordUtils = require('../../utils/discord-utils')
const winston = require('winston')

module.exports = class MoveCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'move',
      aliases: ['mv'],
      group: 'music', // the command group the command is a part of.
      memberName: 'move', // the name of the command within the group (this can be different from the name).
      description: 'Moves the bot to your voice channel. (works only if music is already playing)'
    })
  }

  async run (message) {
    const { voice: voiceState } = message.member
    const { voice: botVoiceState } = message.guild.me

    // make sure the bot and user aren't in the same voice channel
    if (!DiscordUtils.inVoiceChannel(voiceState, message)) {
      return
    } else if (botVoiceState.id === voiceState.id) {
      console.warn(`${message.author.tag} tried to move the bot but they're in the same voice channel.`)
      DiscordUtils.embedResponse(message, {
        color: 'RED',
        description: `${message.author.tag} you're in the same channel as the bot!`
      })
      return
    }

    const musicService = require('./../../FutabaBot').getMusicService()
    const musicPlayer = musicService.GetMusicPlayer(message.guild)

    const song = musicPlayer.current().song

    // make sure the bot is playing music
    if (!song || musicPlayer.stopped) {
      DiscordUtils.embedResponse(message, {
        color: 'RED',
        description: `${message.author.tag} there is no song currently playing so I can't move!`
      })
      return
    }

    const userVoiceChannel = voiceState.channel
    userVoiceChannel.join().then(_ => {
      const response = `**${message.author.tag}** moved me to ${userVoiceChannel.name}!`
      DiscordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: response
      })
      winston.info(`${message.author.tag} moved me to ${userVoiceChannel.name}.`)
    })
  }
}
