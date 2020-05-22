const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')
const YouTube = require('discord-youtube-api')
require('dotenv').config()
const SongInfo = require('./../../modules/music/songinfo')
const MusicMetadata = require('music-metadata')
const stringUtils = require('./../../utils/string-utils')
const winston = require('winston')

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
      return
    }

    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)

    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: 'Attempting to load the playlist...'
    })
    const playlistSongs = musicService.LoadPlaylist(message.guild.id, playlistID)

    if (!(playlistSongs !== 'undefined') || playlistSongs.length === 0) {
      winston.error('There was an error trying to load a playlist from the database')
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: `**${message.author.tag}** there was an error loading the playlist!`
      })
      return
    }
    // TODO should we build a song info object ourselves or ping the API?
    // TODO we should make this a separate function - it's cleaner
    const youtube = new YouTube(process.env.YT_API)
    for (const song of playlistSongs) {
      let songInfo = null
      if (song.provider === 'Local') {
        try {
          const path = song.uri.slice(7)
          const metadata = await MusicMetadata.parseFile(path, { mimeType: 'audio/mpeg' })
          const streamObject = {
            provider: song.provider,
            title: song.title,
            url: path,
            durationSeconds: metadata.format.duration,
            length: metadata.format.duration ? stringUtils.FancyTime(metadata.format.duration) : '?:??'
          }
          songInfo = new SongInfo(streamObject, message)
        } catch (err) {
          // TODO: set a variable to alert the user to an error
          winston.error(err)
        }
      } else {
        songInfo = new SongInfo(await youtube.getVideo(song.uri), message)
      }
      musicplayer.enqueue(songInfo)
    }

    // TODO display the name of the playlist that was loaded so the user can confirm
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: `**${message.author.tag}** playlist load successful.`
    })
  }
}
