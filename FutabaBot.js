// TODO salt token
const Commando = require('discord.js-commando');
const path = require('path');
const { token } = require('./config.json');
const sqlite = require('sqlite');
const MusicService = require(`./modules/music/services/musicservice`);

let musicService;

const client = new Commando.Client({
	commandPrefix: '.',
	owner: '94705001439436800'
});

client.setProvider(
    sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('debug', console.log)
    .on('ready', () => {
        console.log(`Client ready; logged in as ${client.user.tag}! (${client.user.id})`);
        client.user.setActivity('with Commando');
    })
    .on('disconnect', () => { console.warn('Disconnected!'); })
    .on('reconnecting', () => { console.warn('Reconnecting...'); })
    .on('commandError', (cmd, err) => {
        if(err instanceof Commando.FriendlyError) return;
        console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    })
    .on('providerReady', () => {
        //setup music service
        musicService = new MusicService(client.provider.db, client);

        // setup tables if necessary
        client.provider.db.exec(`
        CREATE TABLE IF NOT EXISTS "playlists" (
            "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            "guild"	INTEGER,
            "author"	TEXT,
            "author_id"	INTEGER,
            "name"	TEXT,
            FOREIGN KEY("guild") REFERENCES "playlists"("guild")
        );
        CREATE TABLE IF NOT EXISTS "playlist_song"(
            "id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
            "music_playlist_id" INTEGER NOT NULL,
            "provider" TEXT,
            "query" TEXT,
            "title" TEXT,
            "uri" TEXT,
            FOREIGN KEY("id") REFERENCES "playlist_song"("music_playlist_id")
        );`);
    });

function getMusicService() {
    if(!musicService) {
        musicService = new MusicService(client.provider.db, client);
    }
    return musicService;
}

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['admin', 'Administrative commands'],
        ['music', 'Music-related commands']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.login(token);

process.on('unhandledRejection', error => console.error('Uncaught Promise Rejection', error));

module.exports = { getMusicService };