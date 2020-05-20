const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const { lstatSync } = require('fs')
const listDirectory = require('./../../utils/fslist')

module.exports = class LocalPlaylistCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'localplaylist',
      aliases: ['lopl'],
      group: 'music',
      memberName: 'localplaylist',
      description: 'Queues all songs from a directory.',
      args: [
        {
          key: 'path',
          prompt: 'Please provide a full directory path',
          type: 'string',
          validate: path => { return lstatSync(path).isDirectory() }
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

    let numSongsAdded = 0

    const prefix = this.client.commandPrefix
    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: 'Adding songs to playlist...'
    })

    const musicFiles = await listDirectory(path, { matchWhat: 'ext', match: 'mp3' }) // TODO: good first issue - get support for multiple file types 🙂
    for (const file of musicFiles) {
      const songInfo = await musicService.buildLocalFile(file, message)
      if (musicplayer.enqueue(songInfo) !== -1) {
        numSongsAdded++
      }
    }

    // TODO: should we display what songs weren't added? This seems like a security flaw maybe?
    if (numSongsAdded < musicFiles.length) {
      if (musicplayer.stopped) {
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: `**${message.author.tag}** some songs could not be added to the playlist, but I tried my best! Use \`${prefix}play\` to start playback.`
        })
      } else {
        discordUtils.embedResponse(message, {
          color: 'RED',
          description: `**${message.author.tag}** some songs could not be added to the playlist, but I tried my best!`
        })
      }
    } else {
      if (musicplayer.stopped) {
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          description: `**${message.author.tag}** ${musicFiles.length > 1 ? 'songs were' : 'song was'} added to the playlist but the player is stopped. Use \`${prefix}play\` to start playback.`
        })
      } else {
        discordUtils.embedResponse(message, {
          color: 'ORANGE',
          description: `**${message.author.tag}** ${musicFiles.length > 1 ? 'songs were' : 'song was'} added to the playlist.`
        })
        if (!message.guild.voice) {
          userVoiceChannel.join().then(connection => {
            musicplayer.play(connection, message) // start playing
          })
        }
      }
    }
  }
}
