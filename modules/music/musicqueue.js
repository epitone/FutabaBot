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

    Current() {
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

    Add(songInfo) {
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

    AddNext(songInfo) {
        let current_song = this.Current().song;
        if(!current_song) {
            this.Add(songInfo);
            return this.length;
        }
        let index = 0;
        let walk_node = this.head;
        while(index < this.current_index) {
            walk_node = walk_node.next;
            index++;
        }
        let new_node = new Node(songInfo);
        new_node.next = walk_node.next;
        walk_node.next = new_node;
        this.length++;
        return this.current_index + 1; // return the index to play next
    }

    IsLast() {
        return this.current_index == this.length - 1;
    }

    RemoveAt(index) {
        if(index < 0 || index > this.length) {
            throw new RangeError(`${index} is out of bounds`);
        } else {
            let current = this.head;
            let previous = null;
            let counter = 0;
            let removedNode = null;

            if(counter === index) {
                removedNode = this.head;
                this.head = current.next;
                if(this.length <= 2) this.tail = this.head; // update tail if we are going to end up with 1 or less items
            } else {
                while(counter < index) {
                    previous = current;
                    current = current.next;
                    counter++;
                }
                removedNode = current;
                previous.next = current.next;
                if(counter === (this.length--)) this.tail = previous
            }
            this.length--;
            return removedNode;
        }
    }

    SwapNodes(indexOne, indexTwo) {
        let node1 = null;
        let node2 = null;
        let iterator = this.head;
        let counter = 0;

        while(iterator != null) {
            if(counter == indexOne)
                node1 = iterator
            else if(counter == indexTwo)
                node2 = iterator
            counter++;
            iterator = iterator.next;
        }

        // swap the data for each node instead of swapping the individual nodes
        if(node1 && node2) {
            let tempData = node1.data;
            node1.data = node2.data;
            node2.data = tempData;
        } else {
            return;
        }
        
        return { node1, node2 }; // remember the nodes have their data swapped
    }

    RemoveSong(song) {
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
            his.length--;
            return;
        }
    }

    Next(skip_count = 1) {
        this.current_index += skip_count;
    }
    
    Count() {
        return this.length
    }

    Reset() {
        this.head = null;
        this.tail = null;
        this.length = 0;
        this._current_index = 0;
    }
}