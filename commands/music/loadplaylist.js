const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')
const YouTube = require('discord-youtube-api')
const config = require('../../config.json')
const SongInfo = require('./../../modules/music/songinfo')

module.exports = class LoadPlaylistCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'loadpl',
      group: 'music', // the command group the command is a part of.
      memberName: 'loadpl', // the name of the command within the group (this can be different from the name).
      description: 'Loads a playlist via its ID. Use `.spl` to show playlists and `.save` to save playlists.',
      args: [
        {
          key: 'playlist_id',
          prompt: 'What is the ID of the playlist you\'d like to load?',
          type: 'integer'
          // TODO: should we validate and make sure the playlist is in range?
        }
      ]
    })
  }

  async run (message, { playlist_id: playlistID }) {
    // This should not overwrite the current playlist, just tack it on the end
    const { voice: voiceState } = message.member
    if (!discordUtils.inVoiceChannel(voiceState, message)) {
      console.warn(`${message.author.tag} attempted to use a music command without being in a voice channel.`)
      return
    }

    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)

    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: 'Attempting to load the playlist...'
    })
    const playlistSongs = await musicService.LoadPlaylist(message.guild.id, playlistID)

    if (!(playlistSongs !== 'undefined') && !(playlistSongs.length > 0)) {
      console.error('There was an error trying to load a playlist from the database')
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: `**${message.author.tag}** there was an error loading the playlist!`
      })
      return
    }
    // TODO should we build a song info object or ping the API?
    const youtube = new YouTube(config.yt_api)
    for (const song of playlistSongs) {
      const songInfo = new SongInfo(await youtube.getVideo(song.uri), message)
      musicplayer.Enqueue(songInfo)
    }

    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: `**${message.author.tag}** playlist load successful.`
    })
  }
}