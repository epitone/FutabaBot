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
      const { playlistID, songAdded } = await this.SavePlaylistSong(response)
      return { playlistName, playlistID, songAdded }
    }
  }

  async SavePlaylistSong (playlist) {
    const playlistID = playlist.lastID
    const playlistArray = this.musicplayer.QueueArray().songs
    // TODO: should we save the user who requested the song?
    const songsInfo = playlistArray.map(song => [playlistID, song.provider, song.query, song.title, song.url])
    const songAdded = []

    await this.database.run('BEGIN;')
    for (const song of songsInfo) {
      songAdded.push(await this.database.run(`INSERT INTO playlist_song(music_playlist_id, provider, query, title, uri) 
            VALUES(${song[0]}, "${song[1]}", "${song[2]}", "${song[3]}", "${song[4]}");`))
    }
    await this.database.run('END;')
    return { playlistID, songAdded }
  }

  async LoadPlaylist (guild, playlistID) {
    const playlist = await this.database.all(SQL`
    SELECT pls.provider AS provider, pls.query AS query_msg, pls.title AS title, pls.uri AS uri, 
    playlists.id AS id, playlists.name AS playlist_name, playlists.author_id AS author_id
    FROM playlist_song AS pls
    LEFT JOIN playlists
    ON pls.music_playlist_id = playlists.id
    WHERE playlists.id = ${playlistID}
    AND playlists.guild = ${guild};`)
    return playlist
  }

  // TODO check if we need to force an order by for this query
  async LoadPlaylistSongs (guild, playlistID) {
    console.log(`SELECT pls.provider AS provider, pls.title AS title, pls.uri AS uri, 
    playlists.name AS playlist_name, playlists.author_id AS author_id
    FROM playlist_song AS pls
    LEFT JOIN playlists
    ON pls.music_playlist_id = playlists.id
    WHERE playlists.id = ${playlistID}
    AND playlists.guild = ${guild}`)
    const playlistSongs = await this.database.all(SQL`
    SELECT pls.provider AS provider, pls.title AS title, pls.uri AS uri, 
    playlists.name AS playlist_name, playlists.author_id AS author_id
    FROM playlist_song AS pls
    LEFT JOIN playlists
    ON pls.music_playlist_id = playlists.id
    WHERE playlists.id = ${playlistID}
    AND playlists.guild = ${guild}`)
    return playlistSongs
  }

  async LoadAllPlaylists (guild) {
    const playlists = await this.database.all(SQL`
    SELECT p.id, p.name AS name, p.author_id AS author_id,
    COUNT(*) AS total_songs
    FROM playlists AS p
    LEFT JOIN playlist_song AS pls
    ON p.id = pls.music_playlist_id
    WHERE guild = ${guild}
    GROUP BY p.id`)
    return playlists
  }
}
module.exports = MusicService
