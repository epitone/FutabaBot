const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class CreateVoiceChan extends Command {
	constructor(client) {
		super(client, {
			name: 'createvoicechan',
			aliases: ['cvch'],
			group: 'admin', //the command group the command is a part of.
			memberName: 'createvoicechan', //the name of the command within the group (this can be different from the name).
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
            const embed = new RichEmbed()
                .setColor(0xd29846)
                .setDescription(response);
            message.embed(embed);
        })
        .catch(error => {
            console.log(error)
            const embed = new RichEmbed()
                .setColor(0xd29846)
                .setDescription(`Oops! Something went wrong!`);
            message.embed(embed);
        });
	}
}