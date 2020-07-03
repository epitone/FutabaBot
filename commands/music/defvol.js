const { Command } = require('discord.js-commando')
const DiscordUtils = require('../../utils/discord-utils')
module.exports = class DefVolCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'defvol',
      aliases: ['dv'],
      group: 'music', // the command group the command is a part of.
      memberName: 'defvol', // the name of the command within the group (this can be different from the name).
      description: 'Sets the default playback volume for the music player. This level persists through restarts.',
      args: [
        {
          key: 'volume_level',
          prompt: 'What would you like to set the volume to?',
          type: 'integer',
          validate: volumeLevel => volumeLevel >= 0 && volumeLevel <= 100
        }
      ]
    })
  }

  async run (message, { volume_level: volumeLevel }) {
    const musicService = require('./../../FutabaBot').getMusicService()
    const musicPlayer = musicService.GetMusicPlayer(message.guild)
    const isVolumeSet = await musicService.SetDefaultVolume(message.guild, volumeLevel / 100)

    if (isVolumeSet) musicPlayer.setVolume(volumeLevel)
    // TODO: move this string to constants file
    const response = isVolumeSet ? `**${message.author.tag}** I set the player's default volume to ${volumeLevel}%. This will persist through bot restarts as well.` : 'Oops! Something went wrong!'
    DiscordUtils.embedResponse(message, {
      color: isVolumeSet ? 'ORANGE' : 'RED',
      description: response
    })
  }
}
