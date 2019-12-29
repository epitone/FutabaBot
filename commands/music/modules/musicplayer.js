const ytdl = require('ytdl-core-discord');
const MusicQueue = require('./musicqueue');

module.exports = class MusicPlayer {
    constructor() {
        this.repeatSongs = false;
        this.queue = new MusicQueue(); // this is the persistent queue for the server
        this.dispatcher = null;
    }

    async play(connection) {
        console.log('playing next track');
        this.dispatcher = connection.playOpusStream(await ytdl(this.queue.head.data.url))
        .on('end', () => {
            if(!this.queue.isLast()) this.play(connection);
            else connection.disconnect;
        })        
        this.queue.removeAt(0);
    }
}