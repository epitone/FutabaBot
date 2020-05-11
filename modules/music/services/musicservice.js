let MusicPlayer = require(`../../../commands/music/modules/musicplayer`);
const SQL = require('sql-template-strings');

class MusicService {

    constructor(database, client) {
        console.log("setting up music service");
        this.musicplayer;
        this.client = client;
        this.database = database;
    }

    GetMusicPlayer(guild) {
        if(!this.musicplayer) {
            if(!this.client && !this.database) {
                throw new Error(`MusicService has not been configured.`);
            }
            // create the music player using the default volume if there is one - otherwise set to 100%
            let volume = this.client.provider.get(guild, "default_volume", 1);
            this.musicplayer = new MusicPlayer(volume);
        }
        return this.musicplayer;
    }

    async SetDefaultVolume(guild, volumeLevel) {
        let result = await this.client.provider.set(guild, "default_volume", volumeLevel);
        return result === volumeLevel;
    }

    // TODO: check whether these inputs are worth sanitizing
    async SavePlaylist(guild, playlistName, guildMember) {
        let authorId = guildMember.id;
        let authorName = guildMember.user.tag;

        let response = await this.database.run(SQL`INSERT INTO playlists(guild, author, author_id, name)
        VALUES(${guild.id}, ${authorName}, ${authorId}, ${playlistName});`);
        if(response) {
            return await this.SavePlaylistSong(response);
        } else return;
    }

    async SavePlaylistSong(playlist) {
        let playlistID = playlist.lastID;
        let playlistArray = this.musicplayer.QueueArray().songs;
        let songsInfo = playlistArray.map(song => [playlistID, song.provider, song.query, song.title, song.url]);
        let results = [];

        await this.database.run(`BEGIN;`);
        for(let song of songsInfo) {
            results.push(await this.database.run(`INSERT INTO playlist_song(music_playlist_id, provider, query, title, uri) 
            VALUES(${song[0]}, "${song[1]}", "${song[2]}", "${song[3]}", "${song[4]}");`));
        }
        await this.database.run(`END;`);
        return results;
    }
}
module.exports = MusicService