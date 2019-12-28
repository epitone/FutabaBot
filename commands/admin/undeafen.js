const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class Deafen extends Command {
	constructor(client) {
		super(client, {
			name: 'undeafen',
			aliases: ['undef'],
			group: 'admin', //the command group the command is a part of.
            memberName: 'undeafen', //the name of the command within the group (this can be different from the name).
            guildOnly: true,
			description: 'Undeafens mentioned user or users.',
			args: [
				{
					key: 'users',
					prompt: 'Which member(s) would you like to undeafen?',
					type: 'member',
                    infinite: true,
				}
			]
		});
    }
    
    run(message, { users }) {
        let undeafenedStatus = [];
        let index = 0;
        
        // TODO: check which members were successfully deafened and then respond accordingly, if a member could not be defeaned, then return that user's name in the response
        for(let member of users) {
            if(member.deaf) {
                member.setDeaf(false)
                .then(undeafenedUser => {
                    console.log(`Successfully deafened ${undeafenedUser.displayName}`)
                    undeafenedStatus.push(undeafenedUser);
                    index++;
                    if(index == users.length || undeafenedStatus.length == users.length) {
                        let response = `Successfully undeafened ${undeafenedStatus.length} out of ${users.length} members`;
                        const embed = new RichEmbed()
                            .setColor(0xd29846)
                            .setDescription(response);
                        message.embed(embed);
                    }
                })
                .catch(error => {
                    console.log(error)
                    const embed = new RichEmbed()
                        .setColor(0xd29846)
                        .setDescription(`Oops! Something went wrong!`);
                    message.embed(embed);
                })
            } else {
                undeafenedStatus.splice(index, 0, false);
                index++;
            }
        }
    }
}