const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class TemplateCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'createtxtchan',
			aliases: ['ctch'],
			group: 'admin', //the command group the command is a part of.
            memberName: 'createtextchan', //the name of the command within the group (this can be different from the name).
            guildOnly: true,
			description: 'Creates a text channel with a given name.',
			args: [
				{
					key: 'text_channel',
					prompt: 'What is the name of the text channel you\'d like to create?',
					type: 'string',
				}
			]
		});
	}

	run(message, { text_channel }) {
        /// do stuff here
        const server = message.guild;
        server.createChannel(text_channel, { type : 'text'})
        .then(newChannel => {
            let response = `Successfully created “#${newChannel.name}”`;
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
    }
}