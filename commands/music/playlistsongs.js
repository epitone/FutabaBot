const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const ITEMS_PER_PAGE = 20

module.exports = class PlaylistSongsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'playlistsongs',
      aliases: ['plsongs'],
      group: 'music',
      memberName: 'playlistsongs',
      description: 'Shows the songs within a saved playlist',
      args: [
        {
          key: 'playlist_id',
          prompt: 'What is the ID of the playlist you’d like  to view?',
          type: 'integer'
        }
      ],
      validate: playlistID => (playlistID > 0)
    })
  }

  async run (message, { playlist_id: playlistID }) {
    const musicService = require('./../../FutabaBot').getMusicService()
    const playlistSongs = await musicService.LoadPlaylistSongs(message.guild.id, playlistID)
    const prefix = this.client.commandPrefix

    if (playlistSongs.length === 0) {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: `**${message.author.tag}** no playlist exists with that ID. You can use \`${prefix}pls\` to see a list of all saved playlists by ID.`
      })
      return
    }

    // Build the song list
    this.embedBuilder(message, playlistSongs)
  }

  async embedBuilder (message, songsArray) {
    const pages = Math.floor(songsArray.length / ITEMS_PER_PAGE)
    const maxPages = pages + 1 || 1
    const playlistTitle = `${songsArray[0].playlist_name}`
    const author = await message.guild.members.fetch(`${songsArray[0].author_id}`)
    let startIndex = 0

    let currentPage = 1
    let listNumber = 1

    do {
      let songList = ''
      const pagedSongs = songsArray.slice(startIndex, startIndex + ITEMS_PER_PAGE)
      for (const song of pagedSongs) {
        songList += `${listNumber}. [${song.title}](${song.uri}) \`${song.provider}\`\n`
        listNumber++
      }
      const listTitle = `**“${playlistTitle}” by ${author.displayName}**`
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: songList,
        title: listTitle,
        footer: `${currentPage} / ${maxPages}`
      })
      currentPage++
      startIndex += ITEMS_PER_PAGE
    } while (startIndex <= songsArray.length)
  }
}
