const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class UnmuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            group: 'admin',
            memberName: 'unmute',
            description: 'Unmutes a mentioned user previously muted with the .mute command.',
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