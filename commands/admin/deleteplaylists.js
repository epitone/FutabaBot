const { Command } = require('discord.js-commando')
const discordUtils = require('./../../utils/discord-utils')

module.exports = class DeletePlaylistsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'deleteplaylists',
      group: 'admin',
      memberName: 'deleteplaylists',
      description: 'Automaticaly assigns a specified role to every user who joins the server. Provide no parameters to disable.',
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
