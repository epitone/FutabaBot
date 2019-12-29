class Node {
    constructor(songInfo) {
        this.data = songInfo; // a SongInfo object
        this.next = null;
    }
}

module.exports = class MusicQueue {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
        this.current_index = 0;
    }

    // returns the song info of the currently now playing song
    current() {
        let walkNode = this.head;
        let walk;
        for(walk = 0; walk < this.currentIndex; walk++) {
            walkNode = walkNode.next;
        }
        return walkNode.data;
    }

    add(songInfo) {
        let node = new Node(songInfo);
        if(!this.head) {
            // this is our first node so we point head and tail to the same object
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            this.tail = node; 
        }
        this.length++;
    }

    isLast() {
        return this.current_index == this.length;
    }

    // Removes the node at the specified index
    // Should we return it?
    removeAt(index) { // removes node at a specified index
        if(index < 0 || index > this.length) {
            throw new RangeError(`${index} is out of bounds`);
        } else {
            let current = this.head;
            let previous = null;
            let counter = 0;
            if(counter === index) {
                this.head = current.next;
            } else {
                while(counter < index) {
                    previous = current;
                    current = current.next;
                    counter++;
                }
                previous = current.next;
            }
            this.length--;
        }
    }

    next(skip_count = 1) {
        this.current_index += skip_count; // move to the specified item in the queue
    }
}