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
        this._current_index = 0;
    }

    get current_index() { return this._current_index; }

    set current_index(value) {
        if(this.length == 0) this._current_index = 0
        else { this._current_index = value %= this.length }
    }
    current() {
        let walkNode = this.head;
        let walk = 0;
        while(walk < this.current_index) {
            if(walkNode.next == null) {
                walkNode = this.head;
            } else {
                walkNode = walkNode.next;
            }
            walk++;
        }
        // console.log('returning data: ', walkNode ? walkNode.data : null);
        if(walkNode) {
            return {
                index: walk,
                song: walkNode.data,
            };
        } else {
            return {
                index: -1,
                song: null,
            };
        }
    }

    add(songInfo) {
        let node = new Node(songInfo);
        if(!this.head) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            this.tail = node; 
        }
        this.length++;
    }

    isLast() {
        return this.current_index == this.length - 1;
    }

    // Should we return this node?
    removeAt(index) {
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

    removeSong(song) {
        if(this.head == null) return false;
        
        let walk_node = this.head;
        if(walk_node.data == song) {
            if(this.head == this.tail) {
                this.head, this.tail = null;
                this.length--;
            } else {
                this.head = this.head.next;
                this.length--;
            }
            return;
        }
        while(walk_node != null && walk_node.next.data != song)
            walk_node = walk_node.next
        if(walk_node.next != null) {
            if(walk_node.next == this.tail)
                this.tail = walk_node;
            walk_node.next = walk_node.next.next;
            this.length--;
            return;
        }
    }

    next(skip_count = 1) {
        this.current_index += skip_count;
    }
    
    count() {
        return this.length
    }
}