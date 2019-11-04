// module.exports = {
// 	name: 'delvoicechan',
// 	description: 'Deletes a voice channel with a given name.',
// 	args: true, // this is not required, if not used, it's safe to delete (will default to false)
// 	guildOnly: true, // this is not required, if not used, it's safe to delete (will default to false)
// 	execute(message, args) {
//         const server = message.guild;
//         const channel = server.channels.find(result => result.name === args.join(' '));
// 		if (channel && channel.type === 'voice' && channel.deletable) {
//             channel.delete()
//                 .then(deletedChannel => {
//                     message.channel.send(`Successfully deleted ${deletedChannel.name}`);
//                 })
//                 .catch(() => {
//                     messaage.channel.send('Oops! Something went wrong!');
//                     console.log(error);
//                 });
//         }
//         else {
//             message.channel.send('Sorry, I couldn\'t find that channel\!');
//         }
// 	}
// };

const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class TemplateCommand extends Command {
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
        else {
            let response = `Sorry I couldn't find that channel, or the channel cannot be deleted!`;
            console.log(response);
            const embed = new RichEmbed()
                .setColor(0xd29846)
                .setDescription(response);
            message.embed(embed);
        }
	}
}