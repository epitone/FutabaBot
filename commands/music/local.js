const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const stringUtils = require('./../../utils/string-utils')
const MusicMetadata = require('music-metadata')
const SongInfo = require('./../../modules/music/songinfo')

module.exports = class LocalCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'local',
      aliases: ['lo'],
      group: 'music',
      memberName: 'local',
      description: 'Queues a local file by specifying a full path.',
      args: [
        {
          key: 'path',
          prompt: 'Please provide a full path to the file',
          type: 'string'
        }
      ],
      ownerOnly: true
    })
  }

  async run (message, { path }) {
    const { voice: voiceState } = message.member
    if (!discordUtils.inVoiceChannel(voiceState, message)) {
      return
    }

    const userVoiceChannel = voiceState.channel
    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)

    try {
      // TODO: make this a utility function, we use it in multiple places
      const metadata = await MusicMetadata.parseFile(path, { mimeType: 'audio/mpeg' })
      const streamObject = {
        provider: 'Local',
        title: metadata.common.title,
        url: path, // TODO: sanitize this input
        durationSeconds: metadata.format.duration,
        length: metadata.format.duration ? stringUtils.FancyTime(metadata.format.duration) : '?:??'
      }

      const songInfo = new SongInfo(streamObject, message)
      const songIndex = musicplayer.enqueue(songInfo) // add song to the player queue
      if (songIndex !== -1) {
        discordUtils.embedResponse(message, {
          author: `Queued Song #${songIndex + 1}`,
          title: songInfo.title,
          url: songInfo.provider !== 'Local' ? songInfo.url : undefined,
          color: 'ORANGE'
        })
        console.info(`added “${songInfo.title}” to queue position ${songIndex}`)
        if (musicplayer.stopped) {
          const prefix = this.client.commandPrefix
          discordUtils.embedResponse(message, {
            color: 'RED',
            description: `A song has been queued but the player is stopped. To start playback use the \`${prefix}play\` command.`
          })
        } else {
          if (!message.guild.voice) {
            userVoiceChannel.join().then(connection => {
              musicplayer.play(connection, message) // start playing
            })
          }
        }
      }
    } catch (err) {
      console.error(err)
      if (err.code === 'ENOENT') {
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
  }
}
