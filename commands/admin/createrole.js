const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class CreateRole extends Command {
	constructor(client) {
		super(client, {
			name: 'createrole',
			aliases: ['cr'],
			group: 'admin', //the command group the command is a part of.
			memberName: 'createrole', //the name of the command within the group (this can be different from the name).
			description: 'Creates a role with a given name.',
			guildOnly: true,
			args: [
				{
					key: 'role',
					prompt: 'What is the name of the role you\'d like to create?',
					type: 'string'
				}
			]
		});
	}

	run(message, { role }) {
        /// do stuff here
        const server = message.guild;
        server.createRole({ name: role })
        .then((role) => {
			const embed = new RichEmbed()
				.setColor(0xd29846)
				.setDescription(`Created new role with name “${role.name}”`);
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