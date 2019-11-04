const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class TemplateCommand extends Command {
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
					prompt: 'What ',
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
                    deafenedStatus.splice(index, 0, true);
                    index++;
                })
                .catch(error => {
                    console.log(error)
                    const embed = new RichEmbed()
                        .setColor(0xd29846)
                        .setDescription(`Oops! Something went wrong!`);
                    message.embed(embed);
                })
            } else {
                deafenedStatus.splice(index, 0, false);
                index++;
            }
        }
        let response = '';

        // TODO: check which members were successfully deafened and then respond accordingly, if a member could not be defeaned, then return that user's name in the response
	}
}

// module.exports = {
// 	name: 'deafen',
//     cooldown: 5,
//     description: 'Deafens mentioned user or users.',
//     args: true,
// 	execute(message) {
//         const taggedMembers = message.mentions.members;
//         for (let [, member] of taggedMembers) {
//             if(!member.deaf) {
//                 member.setDeaf(true)
//                 .then(member => {
//                     let response = 
//                     console.log(`Deafened ${member.displayName}`)
//                 })
//                 .catch(console.error);
//             } else {
//                 message.channel.send(`Attempted to deafen ${member.displayName} but they are already defeaned.`);
//             }
//         }
// 	},
// };