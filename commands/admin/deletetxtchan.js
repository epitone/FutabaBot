const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class DeleteTxtChan extends Command {
	constructor(client) {
		super(client, {
			name: 'deletetxtchan',
			aliases: ['dtch'],
			group: 'admin', //the command group the command is a part of.
            memberName: 'deltxtchan', //the name of the command within the group (this can be different from the name).
            guildOnly: true,
			description: 'Deletes a text channel with a given name.',
			args: [
				{
					key: 'text_channel',
					prompt: 'What is the name of the text channel you\'d like to delete?',
					type: 'string',
				}
			]
		});
	}

	run(message, { text_channel }) {
        const server = message.guild;
        const channel = server.channels.find(result => result.name === text_channel);
        if(channel && channel.type === 'text' && channel.deletable) {
            channel.delete()
                .then(deletedChannel => {
                    let response = `Successfully deleted “#${deletedChannel.name}”`;
                    console.log(response);
                    const embed = new RichEmbed()
                        .setColor(0xd29846)
                        .setDescription(response);
                    message.embed(embed);
                })
                .catch((error) => {
                    console.log(error)
                    const embed = new RichEmbed()
                        .setColor(0xd29846)
                        .setDescription(`Oops! Something went wrong!`);
                    message.embed(embed);
                });
        } else {
            let response = `Sorry I couldn't find that channel, or the channel cannot be deleted!`;
            console.log(response);
            const embed = new RichEmbed()
                .setColor(0xd29846)
                .setDescription(response);
            message.embed(embed);
        }
    }
}
