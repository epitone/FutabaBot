const ytdl = require('ytdl-core-discord');
const MusicQueue = require('./musicqueue');
const discordUtils = require ('../../../utils/discord-utils');

class MusicPlayer {
    constructor() {
        this.repeat_playlist = false;
        this.queue = new MusicQueue(); // this is the persistent queue for the server
        this.dispatcher = null;
        this.volume = 1;
        this.stopped = false;
        this.repeat_current_song = false;
        this.auto_delete = false;
        this.manual_index = false;
    }

    async play(connection, message) {
        this.data = this.queue.current();
        let stream = await ytdl(this.data.song.url, { filter: `audioonly`});

        this.dispatcher = connection.play(stream, {
            volume: this.volume,
            type: 'opus'
        });
        this.stopped = false;
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
                stopped: this.stopped,
                current_index: this.queue.current_index,
            }
            if(!playerState.stopped) {
                if(this.auto_delete && !this.repeat_current_song && !this.repeat_playlist && this.data != null) {
                    this.queue.removeSong(this.data.song);
                }
                if(this.repeat_current_song) {
                    this.play(connection, message);
                }
                else if(playerState.queue_length - 1 == this.data.index && !this.repeat_playlist) {
                    console.log("stopping playback because repeat playlist is disabled.");
                    this.stop();
                } else {
                    this.queue.next();
                    this.play(connection, message);
                }
            }
        });
    }

    enqueue(song) {
        if(song != null) {
            this.queue.add(song);
            return this.queue.length - 1;
        }
        else return -1;

    }

    enqueueNext(song) {
        if(song != null) {
            let return_index = this.queue.addNext(song);
            if(this.stopped) {
                this.setIndex(return_index);
            }
            return return_index;
        } else {
            return -1;
        }
    }

    setIndex(index) {
        if(index < 0) throw new RangeError(`${index} is out of bounds`);
        if(this.auto_delete && index >= this.queue.current_index && index > 0) index--;
        this.queue.current_index = index;
        this.manual_index = true;
        this.stopped = false;
    }

    skip(skip_count = 1) {
        if(!this.stopped) {
            if(!this.repeat_playlist && this.queue.isLast()) {
                this.stop();
                return;
            } else this.queue.next(skip_count - 1);
        } else this.queue.current_index = 0;
        
        this.stopped = false;
        this.dispatcher.end();
    }

    stop() {
        this.stopped = true;

        if(this.dispatcher) this.dispatcher.destroy()
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
    toggleRepeatSong() {
        return this.repeat_current_song = !this.repeat_current_song;
    }
    toggleSongAutodelete() {
        return this.auto_delete = !this.auto_delete;
    }
}
module.exports = new MusicPlayer()