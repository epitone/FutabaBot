const { Command } = require('discord.js-commando');
const discordUtils = require('../../utils/discord-utils');

module.exports = class CreateTxtChanCommand extends Command {
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
            discordUtils.embedResponse(message, response, false);
        })
        .catch((error) => {
            console.log(error)
            discordUtils.embedResponse(message, `Oops! Something went wrong`, true);
        });
    }
}