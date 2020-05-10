const ytdl = require('ytdl-core-discord');
const MusicQueue = require('./musicqueue');
const discordUtils = require ('../../../utils/discord-utils');

class MusicPlayer {
    constructor(volume) {
        this.repeat_playlist = false;
        this.queue = new MusicQueue(); // this is the persistent queue for the server
        this.dispatcher = null;
        this.volume = volume;
        this.stopped = true;
        this.paused = false;
        this.repeat_current_song = false;
        this.auto_delete = false;
        this.manual_index = false;
        this.autodcEnabled = false;
    }

    async play(connection, message) {
        this.data = this.queue.Current();
        let stream = await ytdl(this.data.song.url, { filter: `audioonly`});

        this.dispatcher = connection.play(stream, {
            volume: this.volume,
            type: 'opus'
        });
        this.stopped = false;
        this.paused = false;
        console.log(`now playing: “${this.data.song.title}”`);
        discordUtils.embedResponse(message, {
            'author' : `Playing song #${this.queue.current_index + 1}`,
            'title' : this.data.song.title,
            'url' : this.data.song.url,
            'color' : 'ORANGE',
            'footer' : `${this.data.song.prettyTotalTime} | ${this.data.song.requester}`
        });

        /* Order of Precedence (From most important to Least)
            1. Repeat Song
            2. Repeat Playlist
            3. Song Auto-Delete (remove song from queue) if the other two are disabled
            4. Stop playback if we're at the end of the queue and repeat_playlist is disabled
            5. Move to next song
        */
        this.dispatcher.on('finish', () => {
            let playerState = {
                queue_length: this.queue.length,
                stopped: this.stopped,
                current_index: this.queue.current_index,
            }
            if(!playerState.stopped) {
                if(this.repeat_current_song) {
                    this.play(connection, message);
                } else if(this.queue.IsLast() && this.repeat_playlist) {
                    this.queue.current_index = 0;
                    this.play(connection, message);
                } else if(this.queue.IsLast() && this.autodcEnabled) {
                    connection.disconnect();
                } else if(this.auto_delete && !this.repeat_current_song && !this.repeat_playlist && this.data != null) {
                    this.queue.RemoveSong(this.data.song);
                } else if(playerState.queue_length - 1 == this.data.index && !this.repeat_playlist) {
                    console.log("stopping playback because repeat playlist is disabled.");
                    this.stop();
                } else {
                    this.queue.Next();
                    this.play(connection, message);
                }
            }
        });
    }

    Enqueue(song) {
        if(song != null) {
            this.queue.Add(song);
            return this.queue.length - 1;
        }
        else return -1;

    }

    enqueueNext(song) {
        if(song != null) {
            let return_index = this.queue.AddNext(song);
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

    removeAt(index) {
        return this.queue.RemoveAt(index);
    }

    reset() {
        this.stopped = true;
        this.queue.Reset();
    }

    skip(skip_count = 1) {
        if(!this.stopped) {
            if(!this.repeat_playlist && this.queue.IsLast()) {
                this.stop();
                return;
            } else this.queue.Next(skip_count - 1);
        } else this.queue.current_index = 0;
        
        this.stopped = false;
        if(this.dispatcher) this.dispatcher.end();
    }

    stop() {
        this.stopped = true;

        if(this.dispatcher) this.dispatcher.destroy();
        else return;
    }

    SetVolume(volume_level) {
        this.volume = volume_level / 100;
        if(this.dispatcher) {
            this.dispatcher.setVolume(this.volume);
        }
    }
    current() {
        return this.data;
    }

    togglePause() {
        if(this.dispatcher) {
            if(!this.dispatcher.paused) {
                this.paused = true;
                this.dispatcher.pause(true);
            } else {
                this.paused = false;
                this.dispatcher.resume();
            }
            return;
        }
    }
    toggleRepeatPlaylist() {
        return this.repeat_playlist = !this.repeat_playlist;
    }

    toggleRepeatSong() {
        return this.repeat_current_song = !this.repeat_current_song;
    }

    toggleSongAutodelete() {
        return this.auto_delete = !this.auto_delete;
    }

    ToggleAutoDC() {
        return this.autodcEnabled = !this.autodcEnabled;
    }

    QueueArray() {
        let current = this.queue.head;
        let queueArray = [];
        while(current != null) {
            queueArray.push(current.data);
            current = current.next;
        }
        return {
            current: this.queue.current_index,
            songs: queueArray
        };
    }

    QueueCount() {
        return this.queue.Count();
    }

    TotalPlaytime() {
        let songs = this.QueueArray().songs;
        let totalPlaytimeSeconds = 0;
        for(const song of songs) {
            totalPlaytimeSeconds += song.totalTime;
        }
        return totalPlaytimeSeconds;
    }

    MoveSong(position1, position2) {
        return this.queue.SwapNodes(position1, position2);
    }
}
module.exports = MusicPlayer