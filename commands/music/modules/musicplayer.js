const ytdl = require('ytdl-core');
const MusicQueue = require('./musicqueue');
const discordUtils = require ('../../../utils/discord-utils');

class MusicPlayer {
    constructor() {
        this.repeat_songs = false;
        this.queue = new MusicQueue(); // this is the persistent queue for the server
        this.dispatcher = null;
        this.connection = null; // store the voice channel connection so we can access it later
        this.volume = 1;
        this.auto_delete = false; // we do not autodelete songs unless told to
        this.is_stopped = true;
    }

    async play(connection, message) {
        let song = this.queue.current();
        let stream = ytdl(song.url, { filter: `audioonly`});

        this.dispatcher = connection.playStream(stream);
        this.is_stopped = false;
        console.log(`now playing: “${song.title}”`);
        discordUtils.embedResponse(message, {
            'author' : `Playing song #${this.queue.current_index + 1}`,
            'title' : song.title,
            'url' : song.url,
            'color' : 'ORANGE'
        })

        if(this.auto_delete) {
            this.queue.removeAt(this.queue.current_index);
        }
        this.queue.next()

        this.dispatcher.on('end', () => {
            if(!this.queue.isLast()) this.play(connection);
            else {
                this.is_stopped = true;
                this.connection.disconnect();
            }
        })
    }

    skip(skip_count) {
        if(this.dispatcher) {
            this.queue.next(skip_count);
            this.dispatcher.end();
        }
    }

    pause() {
        if(this.dispatcher) this.dispatcher.pause();
    }
    
    resume() {
        if(this.dispatcher && this.dispatcher.paused) this.dispatcher.resume();
    }
}
module.exports = new MusicPlayer()