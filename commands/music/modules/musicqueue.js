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
        this.currentIndex = 0;
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
        return this.length == 0;
    }

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
}