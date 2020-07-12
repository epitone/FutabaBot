const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')

module.exports = class DeleteCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'deleteplaylist',
      aliases: ['delpls'],
      group: 'music', // the command group the command is a part of.
      memberName: 'deleteplaylist', // the name of the command within the group (this can be different from the name).
      description: 'Deletes a saved playlist using its ID. Works only if you made it or if you are the bot owner.',
      args: [
        {
          key: 'playlist_id',
          prompt: 'What is the ID of the playlist you’d like to delete?',
          type: 'integer',
          validate: playlistID => { return playlistID >= 1 }
        }
      ]
    })
  }

  async run (message, { playlist_id: playlistID }) {
    const musicService = require('../../FutabaBot').getMusicService()

    const possibleAuthorID = message.member.id
    const isBotOwner = this.client.isOwner(possibleAuthorID)
    const { successfulDelete, playlistInfo } = musicService.DeletePlaylist(message.guild.id, playlistID, possibleAuthorID, isBotOwner)
    if (successfulDelete && playlistID === playlistInfo.id) {
      discordUtils.embedResponse(message, {
        color: 'ORANGE',
        description: `**${message.author.tag}** I successfully deleted “${playlistInfo.name}”`
      })
    } else {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: 'Oops! Something went wrong!'
      })
    }
  }
}
