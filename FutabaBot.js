//TODO: make prefix a var and salt token
const Commando = require('discord.js-commando');
const path = require('path');
const config = require('./config.json');
const sqlite = require('sqlite');

const client = new Commando.Client({
	commandPrefix: '!',
	owner: '94705001439436800'
});

client.setProvider(
    sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error);

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['admin', 'Administrative commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
	client.user.setActivity('with Commando');
});
client.on('error', console.error);

client.login(config.token);