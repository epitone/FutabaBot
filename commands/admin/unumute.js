const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class UnmuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            group: 'admin',
            memberName: 'mute',
            description: 'Mutes a mentioned user from both speaking and chatting. you can also specify how long the user is muted for.',
            args: [
                {
                    key: 'user',
                    prompt: 'What user would you like to unmute?',
                    type: 'member', 
                }
            ]
        });
    }

    async run(message, { user }) {
        // check if user is valid
        const muteRole = message.guild.roles.find('name', 'muted');
    }
}