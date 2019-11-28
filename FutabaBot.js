//TODO: make prefix a var and salt token
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const config = require('./config.json');

const client = new CommandoClient({
	commandPrefix: '!',
	owner: '94705001439436800'
});

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