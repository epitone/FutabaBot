const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')

module.exports = class VolumeCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'volume',
      aliases: ['vol'],
      group: 'music', // the command group the command is a part of.
      memberName: 'volume',
      description: 'Sets the music playback volume (0-100%)',
      args: [
        {
          key: 'volume_level',
          prompt: 'What would you like to set the volume to?',
          type: 'integer',
          validate: volumeLevel => {
            const volumeInt = parseInt(volumeLevel)
            return volumeInt >= 0 && volumeInt <= 100 // between 0 - 100
          }
        }
      ]
    })
  }

  async run (message, { volume_level: volumeLevel }) {
    const { voice: voiceState } = message.member
    if (!discordUtils.inVoiceChannel(voiceState, message, 'You need to be in a voice channel on this server to run this command.')) {
      return
    }

    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)
    musicplayer.SetVolume(volumeLevel)
    const response = `**${message.author.tag}** set volume to ${volumeLevel}%`
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: response
    })
  }
}
