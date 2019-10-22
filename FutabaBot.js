const fs = require('fs');
const Discord = require('discord.js');
const glob = require('glob');

//TODO: make prefix a var and salt token
const { prefix, token } = require("./config.json"); // see: object destructuring
const client = new Discord.Client();

client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

const commandFiles = glob.sync('commands/**/*.js');

for (const path of commandFiles) {
	const command = require(`./${path}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}



// fires off when client is ready
client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    // if (!message.content.startsWith(prefix) || message.author.bot) return;
	// if (!message.channel.permissionsFor(client.user).has('SEND_MESSAGES')) return; // if logged-in user cannnot send messages

    // const botPerms = ['MANAGE_MESSAGES', 'KICK_MEMBERS', 'MANAGE_ROLES', 'MANAGE_CHANNELS'];

    // if (!message.guild.me.permissions.has(botPerms)) { //if bot does not have appropriate permissions
	// 	return message.reply(`I need the permissions ${botPerms.join(', ')} for this demonstration to work properly`); // if bot does not have proper permissions
	// }

	const args = message.content.slice(prefix.length).split(/ +/); // grab command arguments if any
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)); // get equivalent command from the list

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if(command.usage) {
            reply += `The proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) { // check if command has cooldown
        cooldowns.set(command.name, new Discord.Collection()); // if so, put it in the cooldowns Collection
    }

    const now = Date.now(); // current DateTime
    const timestamps = cooldowns.get(command.name); 
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) { // if the command cooldown hasn't expired
            const timeLeft = (expirationTime - now) / 1000; // calculate the time left (in seconds)
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    } else {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

// login with app token
client.login(token);