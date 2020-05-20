const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const ITEMS_PER_PAGE = 20

module.exports = class PlaylistSongsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'playlists',
      aliases: ['pls'],
      group: 'music',
      memberName: 'playlists',
      description: 'Lists all playlists in paginated format, shows 20 per page.'
    })
  }

  async run (message) {
    const musicService = require('./../../FutabaBot').getMusicService()
    const playlists = musicService.LoadAllPlaylists(message.guild.id)

    const prefix = this.client.commandPrefix
    if (playlists.length === 0) {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: `**${message.author.tag}** there are no saved playlists. To save a playlist, use the \`${prefix}save\` command.`
      })
      return
    }
    // Build the song list
    this.embedBuilder(message, playlists)
  }

  async embedBuilder (message, playlists) {
    const pages = Math.floor(playlists.length / ITEMS_PER_PAGE)
    const maxPages = pages + 1 || 1
    let startIndex = 0

    let currentPage = 1

    do {
      let playlistList = ''
      const pagedPlaylists = playlists.slice(startIndex, startIndex + ITEMS_PER_PAGE)
      for (const playlist of pagedPlaylists) {
        const author = await message.guild.members.fetch(`${playlist.author_id}`)
        playlistList += `\`#${playlist.id}\`: **“${playlist.name}”** by _${author.displayName}_ (${playlist.total_songs > 1 ? `${playlist.total_songs} songs` : `${playlist.total_songs} song`})\n`
      }
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: playlistList,
        author: `Page ${currentPage}/${maxPages} of Saved Playlists`
      })
      currentPage++
      startIndex += ITEMS_PER_PAGE
    } while (startIndex <= playlists.length)
  }
}
