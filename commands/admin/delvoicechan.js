const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class DeleteVoiceChan extends Command {
	constructor(client) {
		super(client, {
			name: 'delvoicechan',
			aliases: ['dvch'],
			group: 'admin', //the command group the command is a part of.
			memberName: 'delvoicechan', //the name of the command within the group (this can be different from the name).
            description: 'Deletes a voice channel with a given name.',
            guildOnly: true,
			args: [
				{
					key: 'voice_channel',
					prompt: 'What is the name of the voice channel you\'d like to delete?',
					type: 'string'
				}
			]
		});
	}

	run(message, { voice_channel }) {
        const server = message.guild;
        const channel = server.channels.find(result => result.name === voice_channel);
		if (channel && channel.type === 'voice' && channel.deletable) {
            channel.delete()
                .then(deletedChannel => {
                    let response = `Deleted “#${deletedChannel.name}”`;
                    console.log(response);
                    discordUtils.embedResponse(message, {
                        'color': 'ORANGE',
                        'description': response
                    });
                })
                .catch(error => {
                    console.error(error)
                    discordUtils.embedResponse(message, {
                        'color': 'RED',
                        'description': 'Oops! Something went wrong!'
                    });
                });
        }
        else {
            let response = `Sorry I couldn't find that channel, or the channel cannot be deleted!`;
            console.log(response);
            discordUtils.embedResponse(message, {
                'color': 'ORANGE',
                'description': response
            });
        }
	}
}