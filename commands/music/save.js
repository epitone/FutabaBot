const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')

module.exports = class SaveCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'save',
      group: 'music', // the command group the command is a part of.
      memberName: 'save', // the name of the command within the group (this can be different from the name).
      description: 'Saves the current queue as a playlist under a certain name. Playlist names cannot contain dashes.',
      args: [
        {
          key: 'playlist_name',
          prompt: 'What would you like to name the playlist?',
          type: 'string',
          validate: playlistName => { return !playlistName.includes('-') }
        }
      ]
    })
  }

  async run (message, { playlist_name: playlistName }) {
    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)

    if (musicplayer.QueueCount() < 1) {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: `**${message.author.tag}** there are no songs in the queue!`
      })
      return
    }

    // FIXME: message.member will return bad values if the message author isn't a part of the server anymore
    const result = await musicService.SavePlaylist(message.guild, playlistName, message.member)
    if (!Array.isArray(result) || !result.length) {
      console.error('There was an error inserting into the database.')
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: `**${message.author.tag}** Oops! Something went wrong!`
      })
    } else {
      if (!result.includes(undefined)) {
        // TODO: return the playlist id and name to the user
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          description: `**${message.author.tag}** I successfully saved the songs under the “${playlistName}” playlist.`
        })
      } else {
        // TODO report which songs were not saved successfully
      }
    }
  }
}
