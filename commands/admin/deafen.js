const { Command } = require('discord.js-commando');
const discordUtils = require(`../../utils/discord-utils`)

module.exports = class Deafen extends Command {
	constructor(client) {
		super(client, {
			name: 'deafen',
			aliases: ['deaf'],
			group: 'admin', //the command group the command is a part of.
            memberName: 'deafen', //the name of the command within the group (this can be different from the name).
            guildOnly: true,
			description: 'Deafens mentioned user or users.',
			args: [
				{
					key: 'users',
					prompt: 'Which member(s) would you like to deafen?',
					type: 'member',
                    infinite: true,
				}
			]
		});
	}

	run(message, { users }) {
        let deafenedStatus = [];
        let index = 0;
        for(let member of users) {
            if(!member.deaf) {
                member.setDeaf(true)
                .then(deafenedUser => {
                    console.log(`Successfully deafened ${deafenedUser.displayName}`)
                    deafenedStatus.push(deafenedUser);
                    index++;
                    if(index == users.length || deafenedStatus.length == users.length) {
                        let response = `Successfully deafened ${deafenedStatus.length} out of ${users.length} members`;
                        discordUtils.embedResponse(message, {
                            'color': 'ORANGE',
                            'description': response
                        });
                    }
                })
                .catch(error => {
                    console.error(error)
                    discordUtils.embedResponse(messagee, `Oops! Something went wrong`, true)
                })
            }
        }
        // TODO: check which members were successfully deafened and then respond accordingly, if a member could not be defeaned, then return that user's name in the response
	}
}