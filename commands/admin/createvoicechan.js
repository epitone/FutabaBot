const { Command } = require('discord.js-commando');
const discordUtils = require(`../../utils/discord-utils`)

module.exports = class CreateVoiceChan extends Command {
	constructor(client) {
		super(client, {
			name: 'createvoicechan',
			aliases: ['cvch'],
			group: 'admin', 
			memberName: 'createvoicechan', 
			description: 'Creates a voice channel with a given name.',
			args: [
				{
					key: 'voice_channel',
					prompt: 'What is the name of the voice channel you\'d like to create?',
					type: 'string'
				}
			]
		});
	}

	run(message, { voice_channel }) {
        const server = message.guild;
        server.createChannel(voice_channel, { type : 'voice'})
        .then((newVoiceChannel) => {
            let response = `Created “#${newVoiceChannel.name}”`;
			console.log(response);
			discordUtils.embedResponse(messagee, response, false)
        })
        .catch(error => {
			console.error(error)
			discordUtils.embedResponse(messagee, `Oops! Something went wrong`, true)
        });
	}
}