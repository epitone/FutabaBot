const ytdl = require('ytdl-core-discord')
const MusicQueue = require('./musicqueue')
const discordUtils = require('./../../utils/discord-utils')

class MusicPlayer {
  constructor (volume) {
    this.repeatPlaylist = false
    this.queue = new MusicQueue() // this is the persistent queue for the server
    this.dispatcher = null
    this.volume = volume
    this.stopped = true
    this.paused = false
    this.repeatCurrentSong = false
    this.autoDelete = false
    this.manualIndex = false
    this.manualSkip = false
    this.autoDC = false
    this.shuffle = false
  }

  async play (connection, message) {
    if (this.shuffle) {
      console.info('Shuffle enabled. Picking random song.')
      await this.queue.Random()
    }
    this.data = this.queue.Current()
    const stream = await ytdl(this.data.song.url, { filter: 'audioonly' })

    this.dispatcher = connection.play(stream, {
      volume: this.volume,
      type: 'opus'
    })
    this.stopped = false
    this.paused = false
    console.info(`now playing: “${this.data.song.title} requested by ${this.data.song.requester}”`)
    discordUtils.embedResponse(message, {
      author: `Playing song #${this.queue.currentIndex + 1}`,
      title: this.data.song.title,
      url: this.data.song.url,
      color: 'ORANGE',
      footer: `${this.data.song.prettyTotalTime} | ${this.data.song.provider} | ${this.data.song.requester}`
    })

    this.dispatcher.on('finish', async () => {
      const playerState = {
        queue_length: this.queue.length,
        stopped: this.stopped,
        current_index: this.queue.currentIndex,
        current_song: this.current().song
      }

      discordUtils.embedResponse(message, {
        author: 'Finished song',
        title: playerState.current_song.title,
        url: playerState.current_song.url,
        color: 'ORANGE',
        footer: `${playerState.current_song.prettyTotalTime} | ${playerState.current_song.provider} | ${playerState.current_song.requester}`
      })

      if (!playerState.stopped) {
        if (!this.manualSkip && !this.manualIndex) { // if we have not moved to a specific song or skipped at all
          if (this.repeatCurrentSong) {
            this.play(connection, message)
          } else if (!this.shuffle && this.queue.IsLast() && this.repeatPlaylist) { // if we're at the end of the queue and repeat playlist enabled
            console.info('Repeatplaylist is enabled. We\'re at the end of the queue, starting from the beginning...')
            this.queue.currentIndex = 0
            this.play(connection, message)
          }
        }
        if (this.autoDelete && !this.repeatCurrentSong && !this.repeatPlaylist) { // if repeat track and repeat playlist is off and autodelete on
          console.info(`Autodelete enabled, removing ${this.queue.currentIndex().song.title} from queue.`)
          this.queue.RemoveSong(this.data.song)
        }
        if (!this.manualIndex && (!this.repeatCurrentSong || this.manualSkip)) {
          if (this.shuffle) {
            if (this.queue.shuffleArray.length !== this.QueueCount() - 1) { // check if we just played the last song
              this.queue.shuffleArray.push(playerState.current_index)
              this.play(connection, message)
            } else if (!this.repeatPlaylist) {
              console.info('Stopping because repeatplaylist is disabled.')
              this.stop()
            } else {
              console.info('Repeat playlist and shuffle enabled, end of queue reached, clearing cache and reshuffling queue')
              this.queue.shuffleArray.length = 0
              this.play(connection, message)
            }
          } else if (this.queue.IsLast() && !this.repeatPlaylist && !this.manualSkip) {
            console.info('Stopping because repeatplaylist is disabled.')
            this.stop()
          } else {
            console.info('Playing next song')
            this.queue.Next()
            this.play(connection, message)
          }
        }
      }
    })
  }

  Enqueue (song) {
    // TODO: make sure there is space in the queue to add another song
    if (song != null) {
      this.queue.Add(song)
      return this.queue.length - 1
    } else return -1
  }

  EnqueueNext (song) {
    if (song != null) {
      const returnIndex = this.queue.AddNext(song)
      if (this.stopped) {
        this.SetIndex(returnIndex)
      }
      return returnIndex
    } else {
      return -1
    }
  }

  SetIndex (index) {
    if (index < 0) throw new RangeError(`${index} is out of bounds`)
    if (this.autoDelete && index >= this.queue.currentIndex && index > 0) index--
    this.queue.currentIndex = index
    this.manualIndex = true
    this.stopped = false
  }

  removeAt (index) {
    return this.queue.RemoveAt(index)
  }

  reset () {
    this.stopped = true
    this.queue.Reset()
  }

  skip (skipCount = 1) {
    this.manualSkip = true
    if (!this.stopped) {
      if (!this.repeatPlaylist && this.queue.IsLast()) { // if it's the last song in the queue and repeat playlist is disabled
        this.stop()
        return
      } else {
        this.queue.Next(skipCount - 1)
      }
    } else {
      this.queue.currentIndex = 0
    }
    this.stopped = false
    if (this.dispatcher) this.dispatcher.end()
  }

  stop () {
    this.stopped = true
    if (this.dispatcher) this.dispatcher.destroy()
  }

  SetVolume (volumeLevel) {
    this.volume = volumeLevel / 100
    if (this.dispatcher) {
      this.dispatcher.setVolume(this.volume)
    }
  }

  current () {
    return this.data
  }

  TogglePause () {
    if (this.dispatcher) {
      if (!this.dispatcher.paused) {
        this.paused = true
        this.dispatcher.pause(true)
      } else {
        this.paused = false
        this.dispatcher.resume()
      }
    }
  }

  ToggleRepeatPlaylist () {
    this.repeatPlaylist = !this.repeatPlaylist
    return this.repeatPlaylist
  }

  ToggleRepeatSong () {
    this.repeatCurrentSong = !this.repeatCurrentSong
    return this.repeatCurrentSong
  }

  toggleSongAutodelete () {
    this.autoDelete = !this.autoDelete
    return this.autoDelete
  }

  ToggleAutoDC () {
    this.autoDC = !this.autoDC
    return this.autoDC
  }

  QueueArray () {
    let current = this.queue.head
    const queueArray = []
    while (current != null) {
      queueArray.push(current.data)
      current = current.next
    }
    return {
      current: this.queue.currentIndex,
      songs: queueArray
    }
  }

  QueueCount () {
    return this.queue.Count()
  }

  TotalPlaytime () {
    const songs = this.QueueArray().songs
    let totalPlaytimeSeconds = 0
    for (const song of songs) {
      totalPlaytimeSeconds += song.totalTime
    }
    return totalPlaytimeSeconds
  }

  MoveSong (position1, position2) {
    return this.queue.SwapNodes(position1, position2)
  }

  destroy () {
    this.dispatcher.disconnect()
    this.dispatcher = null // reset the dispatcher
  }

  SetMaxQueueSize (size) {
    if (size === -1 || this.maxQueueSize <= size) {
      this.queue.maxQueueSize = size
      return true
    }
    return false
  }

  ToggleShuffle () {
    this.shuffle = !this.shuffle
    return this.shuffle
  }
}
module.exports = MusicPlayer
