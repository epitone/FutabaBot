const { Command } = require('discord.js-commando')
const YouTube = require('discord-youtube-api')
require('dotenv').config()
const stringUtils = require('../../utils/string-utils')
const discordUtils = require('../../utils/discord-utils')
const winston = require('winston')
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
    const constants = require('./../../FutabaBot').getConstants()
    winston.info(constants.getLang())
    if (!discordUtils.inVoiceChannel(voiceState, message, constants.get('NOT_IN_VOICE_CHANNEL'))) {
      return
    }

    const youtube = new YouTube(process.env.YT_API)
    let streamObject = null
    const userVoiceChannel = voiceState.channel
    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)

    try {
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
    } catch (err) {
      winston.error(`error fetching youtube stream object: ${err}`)
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: `**${message.author.tag}** ${constants.get('ERR_SONG_NOT_FOUND')}`
      })
      return
    }
    if (streamObject) {
      streamObject.provider = 'YouTube'
      const songInfo = new SongInfo(streamObject, message)
      const musicChannel = musicService.musicChannel
      const songIndex = musicplayer.enqueue(songInfo) // add song to the player queue
      if (songIndex !== -1) {
        discordUtils.embedResponse(message, {
          author: `Queued Song #${songIndex + 1}`,
          title: songInfo.title,
          url: songInfo.url,
          color: 'ORANGE'
        }, musicChannel)
        winston.info(`added “${songInfo.title}” to queue position ${songIndex}`)
        if (musicplayer.stopped) {
          const prefix = this.client.commandPrefix
          discordUtils.embedResponse(message, {
            color: 'RED',
            description: constants.get('SONG_ADDED_NO_PLAYBACK', prefix)
          })
        } else {
          if (!message.guild.voice) {
            userVoiceChannel.join().then(connection => {
              musicplayer.play(connection, message) // start playing
            })
          }
        }
      }
    }
  }
}
