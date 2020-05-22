const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')

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
    const musicService = require('../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)

    if (musicplayer.queueCount() < 1) {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: `**${message.author.tag}** there are no songs in the queue!`
      })
      return
    }

    const playlistInfo = musicService.SavePlaylist(message.guild, playlistName, message.author)
    if (playlistInfo.songsAdded < musicplayer.queueCount()) {
      winston.error('There was an error inserting into the database.')
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: `**${message.author.tag}** Oops! Something went wrong!`
      })
    } else {
      if (playlistInfo.songsAdded === musicplayer.queueCount()) {
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          title: '**Playlist Saved**',
          fields: [
            { name: 'Name', value: `${playlistInfo.playlistName}` },
            { name: 'ID', value: `${playlistInfo.playlistID}` }
          ]
        })
      } else {
        // TODO report which songs were not saved successfully
      }
    }
  }
}
