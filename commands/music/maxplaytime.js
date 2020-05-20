const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')

module.exports = class MaxPlaytimeCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setmaxplaytime',
      aliases: ['smp'],
      group: 'music', // the command group the command is a part of.
      memberName: 'setmaxplaytime', // the name of the command within the group (this can be different from the name).
      description: 'Sets a maximum number of seconds (>14) a song can run before being skipped automatically. Set 0 to have no limit.', // TODO should this persist between sessions?
      args: [
        {
          key: 'max_length',
          prompt: 'How long (in seconds) can a song run before being auto-skipped?',
          type: 'integer',
          validate: maxLength => maxLength === 0 || (maxLength > 14 && maxLength < Number.MAX_SAFE_INTEGER),
          default: 0
        }
      ]
    })
  }

  async run (message, { max_length: maxLength }) {
    const musicService = require('./../../FutabaBot').getMusicService()
    const musicPlayer = musicService.GetMusicPlayer(message.guild)

    const queueSizeSet = musicPlayer.setMaxPlaytime(maxLength)
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: `**${message.author.tag}** I successfully set the max playtime to ${queueSizeSet} seconds.`
    })
  }
}
