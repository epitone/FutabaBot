const ytdl = require('ytdl-core');
const MusicQueue = require('./musicqueue');
const discordUtils = require ('../../../utils/discord-utils');

class MusicPlayer {
    constructor() {
        this.repeat_playlist = false;
        this.queue = new MusicQueue(); // this is the persistent queue for the server
        this.dispatcher = null;
        this.volume = 1;
        this.is_stopped;
        this.repeat_current_song = false;
        this.autoplay = false;
        this.current_song = null;
    }

    async play(connection, message) {
        this.current_song = this.queue.current();
        let stream = ytdl(this.current_song.url, { filter: `audioonly`});

        this.dispatcher = connection.playStream(stream, {
            volume: this.volume,
        });
        this.is_stopped = false;
        console.log(`now playing: “${this.current_song.title}”`);
        discordUtils.embedResponse(message, {
            'author' : `Playing song #${this.queue.current_index + 1}`,
            'title' : this.current_song.title,
            'url' : this.current_song.url,
            'color' : 'ORANGE',
            'footer' : `${this.current_song.total_time} | ${this.current_song.requester}`
        })

        this.dispatcher.on('end', () => {
            if(!this.is_stopped) {
                if(this.repeat_current_song) {
                    this.play(connection, message);
                }
                else if(this.queue.isLast() && !this.repeat_playlist && !this.autoplay) {
                    connection.disconnect;
                } else {
                    this.queue.next();
                    this.play(connection, message);
                }
            }
        })
    }

    skip(skip_count = 1) {
        if(this.dispatcher) {
            this.queue.next(skip_count - 1);
            this.dispatcher.end();
        }
    }

    stop() {
        this.is_stopped = true;
        this.autoplay = false;

        if(this.dispatcher) this.dispatcher.end()
        else return;
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
    current() {
        return this.current_song;
    }
    toggleAutoplay() {
        return this.autoplay = !this.autoplay;
    }
    
    toggleRepeatSong() {
        return this.repeat_current_song = !this.repeat_current_song;
    }
}
module.exports = new MusicPlayer()