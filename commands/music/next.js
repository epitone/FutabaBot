const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')

module.exports = class NextCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'next',
      aliases: ['n'],
      group: 'music', // the command group the command is a part of.
      memberName: 'next', // the name of the command within the group (this can be different from the name).
      description: 'Goes to the next song in the queue, you have to be in the same voice channel as the bot for this to work. You can skip multiple songs but that song will not play if repeatplaylist or repeatsong is enabled.',
      args: [
        {
          key: 'skip_count',
          prompt: 'How many songs would you like to skip?',
          type: 'integer',
          default: 1
        }
      ]
    })
  }

  async run (message, { skip_count: skipCount }) {
    const { voice: voiceState } = message.member
    if (!discordUtils.inVoiceChannel(voiceState, message)) {
      console.log(`${message.author.tag} attempted to skip a song without being in a voice channel.`)
      return
    }

    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)

    const botVoiceChannelID = message.client.guilds.cache.get(message.guild.id).voice.channelID
    if (botVoiceChannelID !== voiceState.channelID) {
      console.warn(`${message.author.tag} attempted to skip a song but wasn't in the bot's voice channel.`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: 'You must be in the same voice channel as the bot to run this command.'
      })
      return
    }
    musicplayer.skip(skipCount)
  }
}
