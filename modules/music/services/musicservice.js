const MusicPlayer = require('./../musicplayer')
const SQL = require('sql-template-strings')

class MusicService {
  constructor (database, client) {
    console.log('setting up music service')
    this.musicplayer = null
    this.client = client
    this.database = database
  }

  GetMusicPlayer (guild) {
    if (this.musicplayer === null) {
      if (!this.client && !this.database) {
        throw new Error('MusicService has not been configured.')
      }
      // create the music player using the default volume if there is one - otherwise set to 100%
      const volume = this.client.provider.get(guild, 'default_volume', 1)
      this.musicplayer = new MusicPlayer(volume)
    }
    return this.musicplayer
  }

  async SetDefaultVolume (guild, volumeLevel) {
    const result = await this.client.provider.set(guild, 'default_volume', volumeLevel)
    return result === volumeLevel
  }

  // TODO: check whether these inputs are worth sanitizing
  // FIXME: return the playlist name and ID if successful
  async SavePlaylist (guild, playlistName, guildMember) {
    const authorId = guildMember.id
    const authorName = guildMember.user.tag

    const response = await this.database.run(SQL`INSERT INTO playlists(guild, author, author_id, name)
        VALUES(${guild.id}, ${authorName}, ${authorId}, ${playlistName});`)
    if (response) {
      return this.SavePlaylistSong(response) // monitor this
    }
  }

  async SavePlaylistSong (playlist) {
    const playlistID = playlist.lastID
    const playlistArray = this.musicplayer.QueueArray().songs
    // TODO: should we save the user who requested the song?
    const songsInfo = playlistArray.map(song => [playlistID, song.provider, song.query, song.title, song.url])
    const results = []

    await this.database.run('BEGIN;')
    for (const song of songsInfo) {
      results.push(await this.database.run(`INSERT INTO playlist_song(music_playlist_id, provider, query, title, uri) 
            VALUES(${song[0]}, "${song[1]}", "${song[2]}", "${song[3]}", "${song[4]}");`))
    }
    await this.database.run('END;')
    return results
  }
}
module.exports = MusicService
