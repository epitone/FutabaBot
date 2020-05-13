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
    this.autodcEnabled = false
  }

  async play (connection, message) {
    this.data = this.queue.Current()
    const stream = await ytdl(this.data.song.url, { filter: 'audioonly' })

    this.dispatcher = connection.play(stream, {
      volume: this.volume,
      type: 'opus'
    })
    this.stopped = false
    this.paused = false
    console.log(`now playing: “${this.data.song.title}”`)
    discordUtils.embedResponse(message, {
      author: `Playing song #${this.queue.currentIndex + 1}`,
      title: this.data.song.title,
      url: this.data.song.url,
      color: 'ORANGE',
      footer: `${this.data.song.prettyTotalTime} | ${this.data.song.requester}`
    })

    /* Order of Precedence (From most important to Least)
            1. Repeat Song
            2. Repeat Playlist
            3. Song Auto-Delete (remove song from queue) if the other two are disabled
            4. Stop playback if we're at the end of the queue and repeat_playlist is disabled
            5. Move to next song
        */
    this.dispatcher.on('finish', () => {
      const playerState = {
        queue_length: this.queue.length,
        stopped: this.stopped,
        current_index: this.queue.currentIndex
      }
      if (!playerState.stopped) {
        if (this.repeatCurrentSong) {
          this.play(connection, message)
        } else if (this.queue.IsLast() && this.repeatPlaylist) {
          this.queue.currentIndex = 0
          this.play(connection, message)
        } else if (this.queue.IsLast() && this.autodcEnabled) {
          connection.disconnect()
        } else if (this.autoDelete && !this.repeatCurrentSong && !this.repeatPlaylist && this.data != null) {
          this.queue.RemoveSong(this.data.song)
        } else if (playerState.queue_length - 1 === this.data.index && !this.repeatPlaylist) {
          console.log('stopping playback because repeat playlist is disabled.')
          this.stop()
        } else {
          this.queue.Next()
          this.play(connection, message)
        }
      }
    })
  }

  enqueue (song) {
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
    if (!this.stopped) {
      if (!this.repeatPlaylist && this.queue.IsLast()) {
        this.stop()
        return
      } else this.queue.Next(skipCount - 1)
    } else this.queue.currentIndex = 0

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
    this.autodcEnabled = !this.autodcEnabled
    return this.autodcEnabled
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
}
module.exports = MusicPlayer
