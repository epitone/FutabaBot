let MusicPlayer = require(`../../../commands/music/modules/musicplayer`);

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
}
module.exports = MusicService