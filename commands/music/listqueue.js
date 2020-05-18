const { Command } = require('discord.js-commando')
const discordUtils = require('../../utils/discord-utils')
const stringUtils = require('../../utils/string-utils')
const ITEMS_PER_PAGE = 10

module.exports = class ListQueue extends Command {
  constructor (client) {
    super(client, {
      name: 'listqueue',
      aliases: ['lq'],
      group: 'music', // the command group the command is a part of.
      memberName: 'listqueue', // the name of the command within the group (this can be different from the name).
      description: 'Displays a paginated list of songs in the queue. There are 10 songs per page. The default page is whatever page the current song is playing from.',
      args: [
        {
          key: 'page_number',
          prompt: 'What page number would you like to view?',
          type: 'integer',
          default: 0
        }
      ]
    })
  }

  async run (message, { page_number: pageNumber }) {
    const musicService = require('./../../FutabaBot').getMusicService()
    const musicplayer = musicService.GetMusicPlayer(message.guild)
    const { current: currentIndex, songs: queueArray } = musicplayer.queueArray()

    if (typeof queueArray === 'undefined' || queueArray.length === 0) {
      discordUtils.embedResponse(message, {
        // TODO make a string constants file so I'm not repeating all these messages
        author: 'It doesn\'t look like there are any songs in the queue.',
        color: 'ORANGE'
      })
      return
    }

    // if we're using the default value then we need to get the page of the currently playing song
    if (--pageNumber === -1) {
      pageNumber = parseInt(currentIndex / ITEMS_PER_PAGE)
    }

    const totalPlaytimeSeconds = musicplayer.totalPlaytime()
    const totalFancyTime = stringUtils.FancyTime(totalPlaytimeSeconds)

    this.embedBuilder(message, pageNumber, currentIndex, queueArray, totalFancyTime)
  }

  embedBuilder (message, currentPage, currentIndex, songsArray, durationTime) {
    const startAt = ITEMS_PER_PAGE * currentPage
    let listNumber = 0 + startAt
    let queueList = ''
    let skipCounter = 0
    const pages = Math.floor(songsArray.length / ITEMS_PER_PAGE)
    const maxPages = pages + 1 || 1
    if (currentPage > maxPages) {
      discordUtils.embedResponse(message, {
        color: 'RED',
        description: `**${message.author.tag}** That page number is invalid!`
      })
      return
    }

    while (skipCounter < startAt) {
      skipCounter++
    }
    const songsSliced = songsArray.slice(skipCounter, (skipCounter + ITEMS_PER_PAGE))
    for (const song of songsSliced) {
      queueList += (listNumber++ === currentIndex) ? `▶ ${listNumber}. ${song.prettyFullName} \n` : `${listNumber}. ${song.prettyFullName} \n`
    }
    queueList = `🔊 ${songsArray[currentIndex].prettyName}\n\n` + queueList

    const queueTitle = `Player Queue - Page ${(currentPage + 1)}/${maxPages} \n\n`
    const footer = `${songsArray.length} ${songsArray.length > 1 ? 'tracks' : 'track'} | ${durationTime}`

    discordUtils.embedResponse(message, {
      color: 'ORANGE',
      description: queueList,
      author: queueTitle,
      footer: footer
    })
  }
}
