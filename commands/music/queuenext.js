const { Command } = require('discord.js-commando')
const YouTube = require('discord-youtube-api')
const config = require('../../config.json')
const stringUtils = require('../../utils/string-utils')
const discordUtils = require('../../utils/discord-utils')

const SongInfo = require('./../../modules/music/songinfo')

module.exports = class QueueNextCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'queuenext',
      aliases: ['qn'],
      group: 'music', // the command group the command is a part of.
      memberName: 'queuenext', // the name of the command within the group (this can be different from the name).
      description: 'Works the same as .queue command, except it enqueues the new song after the current one. You must be in a voice channel.',
      args: [
        {
          key: 'query_string',
          prompt: 'What song would you like to add? (Will play after the currently playing song)',
          type: 'string'
        }
      ]
    })
  }

  async run (message, { query_string: queryString }) {
    const { voice: voiceState } = message.member
    if (!discordUtils.inVoiceChannel(voiceState, message, 'You need to be in a voice channel on this server to run this command.')) {
      return
    }

    const youtube = new YouTube(config.yt_api)
    let streamObject = null
    const userVoiceChannel = voiceState.channel
    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)

    switch (queryString) {
      case stringUtils.ValidYTUrl(queryString):
        streamObject = await youtube.getVideo(queryString)
        break
      case stringUtils.ValidYTID(queryString):
        streamObject = await youtube.getVideoByID(queryString)
        break
      default:
        streamObject = await youtube.searchVideos(queryString)
    }
    if (streamObject) {
      streamObject.provider = 'YouTube'
      const songInfo = new SongInfo(streamObject, message)

      const songIndex = musicplayer.enqueueNext(songInfo)
      if (songIndex !== -1) {
        discordUtils.embedResponse(message, {
          author: `Queued Song #${songIndex + 1}`,
          title: songInfo.title,
          url: songInfo.url,
          color: 'ORANGE'
        })
        console.log(`added “${songInfo.title}” to queue position ${songIndex + 1}`)
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
    } else {
      discordUtils.embedResponse(message, 'I couldn\'t find that song!', true)
    }
  }
}
