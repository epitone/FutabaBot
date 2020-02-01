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
        this.is_stopped;
    }

    async play(connection, message) {
        let song = this.queue.current();
        let stream = ytdl(song.url, { filter: `audioonly`});

        this.dispatcher = connection.playStream(stream, {
            volume: this.volume,
        });
        this.is_stopped = false;
        console.log(`now playing: “${song.title}”`);
        discordUtils.embedResponse(message, {
            'author' : `Playing song #${this.queue.current_index + 1}`,
            'title' : song.title,
            'url' : song.url,
            'color' : 'ORANGE',
            'footer' : `${song.total_time} | ${song.requester}`
        })

        this.dispatcher.on('end', () => { // on song finish (or skip)
            if(this.queue.isLast()) {
                this.connection.disconnect;
            } else {
                this.queue.next();
                this.play(connection, message);
            }
        })
    }

    skip(skip_count) {
        if(this.dispatcher) {
            this.queue.next(skip_count);
            this.dispatcher.end();
        }
    }

    stop() {
        this.is_stopped = true;

    }

    pause() {
        if(this.dispatcher) this.dispatcher.pause();
    }
    
    resume() {
        if(this.dispatcher && this.dispatcher.paused) this.dispatcher.resume();
    }

    setVolume(volume_level) {
        this.volume = volume_level / 100;
        if(this.dispatcher) {
            this.dispatcher.setVolume(this.volume);
        }
    }
}
module.exports = new MusicPlayer()