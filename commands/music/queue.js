const { Command } = require('discord.js-commando')
const YouTube = require('discord-youtube-api')
const config = require('../../config.json')
const stringUtils = require('../../utils/string-utils')
const discordUtils = require('../../utils/discord-utils')

const SongInfo = require('./../../modules/music/songinfo')

module.exports = class QueueCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'queue',
      aliases: ['q'],
      group: 'music', // the command group the command is a part of.
      memberName: 'queue', // the name of the command within the group (this can be different from the name).
      description: 'Queue a song using keywords or a link. Bot will join your voice channel. You must be in a voice channel.',
      args: [
        {
          key: 'query_string',
          prompt: 'What song would you like to add?',
          type: 'string'
        }
      ]
    })
  }

  async run (message, { query_string: queryString }) {
    const { voice: voiceState } = message.member
    if (!discordUtils.inVoiceChannel(voiceState, message, 'You need to be in a voice channel on this server to run this command.')) {
      console.log(`${message.author.tag} attempted to queue music without being in a voice channel.`)
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
      const songInfo = new SongInfo(streamObject, message)

      const songIndex = musicplayer.Enqueue(songInfo) // add song to the player queue
      if (songIndex !== -1) {
        discordUtils.embedResponse(message, {
          author: `Queued Song #${songIndex + 1}`,
          title: songInfo.title,
          url: songInfo.url,
          color: 'ORANGE'
        })
        console.log(`added “${songInfo.title}” to queue position ${songIndex}`)
        if (musicplayer.stopped) {
          discordUtils.embedResponse(message, {
            color: 'RED',
            description: 'A song has been queued but the player is stopped. To start playback use the `.play` command.'
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
