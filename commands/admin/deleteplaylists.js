const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')

module.exports = class DeletePlaylistsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'deleteplaylists',
      group: 'admin',
      memberName: 'deleteplaylists',
      description: 'Deletes all music playlists.',
      ownerOnly: true
    })
  }

  run (message) {
    const musicService = require('./../../FutabaBot').getMusicService()
    const guildID = message.guild.id

    const { playlistCount, deleteResult } = musicService.deletePlaylists(guildID)
    if (playlistCount.total === deleteResult.changes) {
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: `**${message.author.tag}** I successfully deleted ${deleteResult.changes} ${deleteResult.changes > 1 ? 'playlists' : 'playlist'}`
      })
    } else {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: 'Oops! Something went wrong!'
      })
    }
  }
}
