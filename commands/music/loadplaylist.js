const { Command } = require('discord.js-commando')

module.exports = class LoadPlaylistCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'load',
      group: 'music', // the command group the command is a part of.
      memberName: 'load', // the name of the command within the group (this can be different from the name).
      description: 'Loads a playlist via its ID. Use `.spl` to show playlists and `.save` to save playlists.',
      args: [
        {
          key: 'paylist_id',
          prompt: 'What is the ID of the playlist you\'d like to load?',
          type: 'integer'
          // TODO: should we validate and make sure the playlist is in range?
        }
      ]
    })
  }

  async run (message, { playlist_id: playlistID }) {
    // This should not overwrite hte current playlist, just tack it on the end
  }
}
