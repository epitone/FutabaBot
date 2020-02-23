//TODO: salt token
const Commando = require('discord.js-commando');
const path = require('path');
const token = require('./config.json').token;
const sqlite = require('sqlite');

const client = new Commando.Client({
	commandPrefix: '.',
	owner: '94705001439436800'
});

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

client.setProvider(
    sqlite.open(path.join(__dirname, 'database.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

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