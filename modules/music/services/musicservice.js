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
  SavePlaylist (guild, playlistName, guildMember) {
    const authorId = guildMember.id
    const authorName = guildMember.user.tag

    const insert = this.database.prepare('INSERT INTO playlists (guild, author, author_id, name) VALUES (?, ?, ?, ?);')
    const result = insert.run(guild.id, authorName, authorId, playlistName)
    console.log(result.changes)

    if (result.lastInsertRowid) {
      const { playlistID, songsAdded } = this.SavePlaylistSong(result.lastInsertRowid)
      return { playlistName, playlistID, songsAdded}
    }
  }

  SavePlaylistSong (playlistID) {
    const playlistArray = this.musicplayer.QueueArray().songs
    const songsInfo = playlistArray.map(song => {
      const songObj = {}
      songObj.id = playlistID
      songObj.provider = song.provider
      songObj.query = song.query
      songObj.title = song.title
      songObj.url = song.url
      return songObj
    })
    let songsAdded = 0

    const insertStatement = this.database.prepare(`
    INSERT INTO playlist_song(music_playlist_id, provider, query, title, uri) 
    VALUES(@id, @provider, @query, @title, @url)`)

    const transaction = this.database.transaction((songs) => {
      console.log('BEGIN TRANSACTION')
      for (const song of songs) {
        songsAdded += insertStatement.run(song).changes
      }
      console.log('END TRANSACTION')
    })

    transaction(songsInfo)

    return { playlistID, songsAdded }
  }

  LoadPlaylist (guild, playlistID) {
    const statement = this.database.prepare(SQL`
    SELECT pls.provider AS provider, pls.query AS query_msg, pls.title AS title, pls.uri AS uri, 
    playlists.id AS id, playlists.name AS playlist_name, playlists.author_id AS author_id
    FROM playlist_song AS pls
    LEFT JOIN playlists
    ON pls.music_playlist_id = playlists.id
    WHERE playlists.id = ?
    AND playlists.guild = ?;`)

    return statement.all(playlistID, guild)
  }

  // TODO check if we need to force an order by for this query
  LoadPlaylistSongs (guild, playlistID) {
    const statement = this.database.prepare(`
    SELECT pls.provider AS provider, pls.title AS title, pls.uri AS uri, playlists.name AS playlist_name, playlists.author_id AS author_id
    FROM playlist_song AS pls
    LEFT JOIN playlists
    ON pls.music_playlist_id = playlists.id
    WHERE playlists.id = ?
    AND playlists.guild = ?;`)

    return statement.all(playlistID, guild)
  }

  LoadAllPlaylists (guild) {
    const statement = this.database.prepare(`
    SELECT p.id, p.name AS name, p.author_id AS author_id,
    COUNT(*) AS total_songs
    FROM playlists AS p
    LEFT JOIN playlist_song AS pls
    ON p.id = pls.music_playlist_id
    WHERE guild = ?
    GROUP BY p.id`)

    return statement.all(guild)
  }

  // async DeletePlaylist (guild, playlistID) {
  //   const deletedPlaylist = await this.database.run('BEGIN TRANSACTION')
  // }
}
module.exports = MusicService
