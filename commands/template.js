/* 
module.exports = {
	name: 'command-name',
	description: 'Information about the arguments provided.',
	args: true, // does the command have arguments?
	guildOnly: true, // can this command be used outside of the discord channel?
	execute(message, args) {
		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`First argument: ${args[0]}`);
	},
};
*/