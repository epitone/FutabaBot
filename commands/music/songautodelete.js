const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')

module.exports = class SongAutoDeleteCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'songautodelete',
      aliases: ['sad'],
      group: 'music', // the command group the command is a part of.
      memberName: 'songautodelete', // the name of the command within the group (this can be different from the name).
      description: 'Toggles whether a song should be automatically removed from the music queue when it finishes playing.'
    })
  }

  async run (message) {
    const { voice: voiceState } = message.member
    if (!discordUtils.inVoiceChannel(voiceState, message, 'You need to be in a voice channel on this server to run this command.')) {
      return
    }

    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)

    var autodelete = musicplayer.toggleSongAutodelete()
    var response = `Song Auto-Delete is now ${autodelete ? 'on' : 'off'}`
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: response
    })
  }
}
