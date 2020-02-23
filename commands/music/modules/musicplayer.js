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
        this.auto_delete = false;
    }

    async play(connection, message) {
        this.data = this.queue.current();
        let stream = ytdl(this.data.song.url, { filter: `audioonly`});

        this.dispatcher = connection.playStream(stream, {
            volume: this.volume,
        });
        this.is_stopped = false;
        console.log(`now playing: “${this.data.song.title}”`);
        discordUtils.embedResponse(message, {
            'author' : `Playing song #${this.queue.current_index + 1}`,
            'title' : this.data.song.title,
            'url' : this.data.song.url,
            'color' : 'ORANGE',
            'footer' : `${this.data.song.total_time} | ${this.data.song.requester}`
        });

        this.dispatcher.on('end', () => {
            let playerState = {
                queue_length: this.queue.length,
                stopped: this.is_stopped,
                current_index: this.queue.current_index,
            }
            if(!playerState.stopped) {
                if(this.auto_delete && !this.repeat_urrent_song && !this.repeat_playlist && this.data != null) {
                    this.queue.removeSong(this.data.song);
                }
                if(this.repeat_current_song) {
                    this.play(connection, message);
                }
                else if(playerState.queue_length - 1 == this.data.index && !this.repeat_playlist && !this.autoplay) {
                    console.log("stopping playback because autoplay and repeat playlist are disabled.");
                    this.stop();
                } else {
                    this.queue.next();
                    this.play(connection, message);
                }
            }
        });
    }

    skip(skip_count = 1) {
        if(!this.is_stopped) {
            if(!this.repeat_playlist && !this.autoplay && this.queue.isLast()) {
                this.stop();
                return;
            } else this.queue.next(skip_count - 1);
        } else this.queue.current_index = 0;
        
        this.is_stopped = false;
        this.dispatcher.end();
    }

    stop() {
        this.is_stopped = true;
        this.autoplay = false;

        if(this.dispatcher) this.dispatcher.connection.disconnect
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
        return this.data;
    }
    toggleAutoplay() {
        this.autoplay = !this.autoplay;
        return this.autoplay;
    }
    
    toggleRepeatSong() {
        this.repeat_current_song = !this.repeat_current_song;
        return this.repeat_current_song;
    }
    toggleSongAutodelete() {
        this.auto_delete = !this.auto_delete;
        return this.auto_delete;
    }
}
module.exports = new MusicPlayer()