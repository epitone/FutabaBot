const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class DeleteRole extends Command {
	constructor(client) {
		super(client, {
			name: 'deleterole',
			aliases: ['dr'],
			group: 'admin', //the command group the command is a part of.
			memberName: 'deleterole', //the name of the command within the group (this can be different from the name).
			description: 'Deletes a role with a given name.',
			guildOnly: true,
			args: [
				{
					key: 'role',
					prompt: 'What is the name of the role you\'d like to delete?',
					type: 'string'
				}
			]
		});
	}

	run(message, { role }) {
        /// do stuff here
        const server = message.guild;
        const foundRole = server.roles.find(searchedRole => searchedRole.name === role);

        if(foundRole) {
            foundRole.delete()
            .then((deleted) => {
                let response = `Deleted “${deleted.name}” role`;
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
            const response = `Huh, I couldn't find a role with that name.`;
            const embed = new RichEmbed()
                .setColor(0xd29846)
                .setDescription(response);
            message.embed(embed);
        }
    }
};