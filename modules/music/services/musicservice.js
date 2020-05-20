const MusicPlayer = require('./../musicplayer')
const YouTube = require('discord-youtube-api')
const config = require('../../../config.json')
const MusicMetadata = require('music-metadata')
const SongInfo = require('../songinfo')
const stringUtils = require('../../../utils/string-utils')
const discordUtils = require('./../../../utils/discord-utils')
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
  SavePlaylist (guild, playlistName, member) {
    const authorId = member.id
    const authorName = member.tag

    const insert = this.database.prepare('INSERT INTO playlists (guild, author, author_id, name) VALUES (?, ?, ?, ?);')
    const result = insert.run(guild.id, authorName, authorId, playlistName)
    console.log(result.changes)

    if (result.lastInsertRowid) {
      const { playlistID, songsAdded } = this.SavePlaylistSong(result.lastInsertRowid)
      return { playlistName, playlistID, songsAdded }
    }
  }

  SavePlaylistSong (playlistID) {
    const playlistArray = this.musicplayer.queueArray().songs
    const songsInfo = playlistArray.map(song => {
      const songObj = {}
      songObj.id = playlistID
      songObj.provider = song.provider
      songObj.query = song.query
      songObj.title = song.title
      songObj.url = song.provider === 'Local' ? `file://${song.url}` : song.url
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
    const statement = this.database.prepare(`
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

  DeletePlaylist (guildID, playlistID, memberID, botOwner = false) {
    let deleteStatement = null
    let result = null

    const selectStatement = this.database.prepare(`
      SELECT id, name FROM playlists
      WHERE guild = ?
      AND id = ?
    `)

    const selectedPlaylist = selectStatement.get(guildID, playlistID)

    if (!botOwner) {
      deleteStatement = this.database.prepare(`
      DELETE FROM playlists
      WHERE guild = ?
      AND id = ?
      AND author_id = ?`)
      result = deleteStatement.run(guildID, playlistID, memberID)
    } else {
      // TODO: if a user is not a bot owner and didn't create the original playlist, we should return a specific error
      deleteStatement = this.database.prepare(`
      DELETE FROM playlists
      WHERE guild = ?
      AND id = ?`)
      result = deleteStatement.run(guildID, playlistID)
    }

    return {
      successfulDelete: result.lastInsertRowid === selectedPlaylist.id,
      playlistInfo: selectedPlaylist
    }
  }

  // async buildPlaylist (playlistSongs, message) {
  //   const youtube = new YouTube(config.yt_api)
  //   const builtPlaylist = []
  //   const playlistTitle = playlistSongs[0].playlist_name
  //   for (const song of playlistSongs) {
  //     if (song.provider === 'Local') {
  //       try {
  //         const path = song.uri.slice(7)
  //         const metadata = await MusicMetadata.parseFile(path, { mimeType: 'audio/mpeg' })
  //         const streamObject = {
  //           provider: song.provider,
  //           title: song.title,
  //           url: path,
  //           durationSeconds: metadata.format.duration,
  //           length: metadata.format.duration ? stringUtils.FancyTime(metadata.format.duration) : '?:??'
  //         }
  //         const songInfo = new SongInfo(streamObject, message)
  //         builtPlaylist.push(songInfo)
  //       } catch (err) {
  //         // TODO: set a variable to alert the user to an error
  //         builtPlaylist.push(null)
  //         console.error(err)
  //       }
  //     } else {
  //       const songInfo = new SongInfo(await youtube.getVideo(song.uri), message)
  //       builtPlaylist.push(songInfo)
  //     }
  //     // musicplayer.enqueue(songInfo)
  //     return { playlistTitle, builtPlaylist }
  //   }
  // }

  async buildLocalFile (path, message) {
    let songInfo = null
    try {
      const metadata = await MusicMetadata.parseFile(path, { mimeType: 'audio/mpeg' })
      const streamObject = {
        provider: 'Local',
        title: metadata.common.title,
        url: path, // TODO: sanitize this input
        durationSeconds: metadata.format.duration,
        length: metadata.format.duration ? stringUtils.FancyTime(metadata.format.duration) : '?:??'
      }
      songInfo = new SongInfo(streamObject, message)
    } catch (err) {
      console.error(err)
      if (err.code === 'ENOENT') {
        songInfo = err.code
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: `**${message.author.tag}** that file was not found - are you sure you entered the right path?`
        })
      } else {
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: 'Oops! Something went wrong!'
        })
      }
    }
    return songInfo
  }
}
module.exports = MusicService
