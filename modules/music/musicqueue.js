const BotRandom = require('./../../modules/botrandom')

class Node {
  constructor (songInfo) {
    this.data = songInfo // a SongInfo object
    this.next = null
  }
}

module.exports = class MusicQueue {
  constructor () {
    this.head = null
    this.tail = null
    this.length = 0
    this._currentIndex = 0
    this.maxQueueSize = -1
    this.shuffleArray = []
  }

  get currentIndex () { return this._currentIndex }

  set currentIndex (value) {
    if (this.length === 0) this._currentIndex = 0
    else { this._currentIndex = value %= this.length }
  }

  Current () {
    let walkNode = this.head
    let walk = 0
    while (walk < this.currentIndex) {
      if (walkNode.next == null) {
        walkNode = this.head
      } else {
        walkNode = walkNode.next
      }
      walk++
    }
    if (walkNode) {
      return {
        index: walk,
        song: walkNode.data
      }
    } else {
      return {
        index: -1,
        song: null
      }
    }
  }

  Add (songInfo) {
    // TODO: create a QueueFullError class
    if (this.maxQueueSize !== -1 && this.maxQueueSize >= this.length) { throw new RangeError('Queue is full, cannot add song.') }
    const node = new Node(songInfo)
    if (!this.head) {
      this.head = node
      this.tail = node
    } else {
      this.tail.next = node
      this.tail = node
    }
    this.length++
  }

  AddNext (songInfo) {
    if (this.maxQueueSize !== -1 && this.maxQueueSize >= this.length) { throw new RangeError('Queue is full, cannot add song.') }
    const currentSong = this.Current().song
    if (!currentSong) {
      this.Add(songInfo)
      return this.length
    }
    let index = 0
    let walkNode = this.head
    while (index < this.currentIndex) {
      walkNode = walkNode.next
      index++
    }
    const newNode = new Node(songInfo)
    newNode.next = walkNode.next
    walkNode.next = newNode
    this.length++
    return this.currentIndex + 1 // return the index to play next
  }

  IsLast () {
    return this.currentIndex === this.length - 1
  }

  RemoveAt (index) {
    if (index < 0 || index > this.length) {
      throw new RangeError(`${index} is out of bounds`)
    } else {
      let current = this.head
      let previous = null
      let counter = 0
      let removedNode = null

      if (counter === index) {
        removedNode = this.head
        this.head = current.next
        if (this.length <= 2) this.tail = this.head // update tail if we are going to end up with 1 or less items
      } else {
        while (counter < index) {
          previous = current
          current = current.next
          counter++
        }
        removedNode = current
        previous.next = current.next
        if (counter === (this.length--)) this.tail = previous
      }
      this.length--
      return removedNode
    }
  }

  SwapNodes (indexOne, indexTwo) {
    let node1 = null
    let node2 = null
    let iterator = this.head
    let counter = 0

    while (iterator != null) {
      if (counter === indexOne) { node1 = iterator } else if (counter === indexTwo) { node2 = iterator }
      counter++
      iterator = iterator.next
    }

    // swap the data for each node instead of swapping the individual nodes
    if (node1 && node2) {
      const tempData = node1.data
      node1.data = node2.data
      node2.data = tempData
    } else {
      return
    }

    return { node1, node2 } // remember the nodes have their data swapped
  }

  RemoveSong (song) {
    if (this.head == null) return false

    let walkNode = this.head
    if (walkNode.data === song) {
      if (this.head === this.tail) {
        this.head = null
        this.tail = null
        this.length--
      } else {
        this.head = this.head.next
        this.length--
      }
      return
    }
    while (walkNode !== null && walkNode.next.data !== song) { walkNode = walkNode.next }
    if (walkNode.next !== null) {
      if (walkNode.next === this.tail) { this.tail = walkNode }
      walkNode.next = walkNode.next.next
      this.length--
    }
  }

  Next (skipCount = 1) {
    this.currentIndex += skipCount
  }

  Count () {
    return this.length
  }

  Reset () {
    this.head = null
    this.tail = null
    this.length = 0
    this._currentIndex = 0
  }

  Random () {
    this.currentIndex = BotRandom.nextMax(this.length)
    while (this.shuffleArray.includes(this.currentIndex)) {
      this.currentIndex = BotRandom.next(this.length)
    }
    return this.currentIndex
  }
}
