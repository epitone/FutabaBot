const { Command } = require('discord.js-commando');
const { RichEmbed, Permissions } = require('discord.js');
const moment = require('moment');
const timeUtils = require('../../utils/time-utils');

// TODO: check edge cases for this command

module.exports = class VoiceUnmute extends Command {
    constructor(client) {
        super(client, {
            name: 'voiceunmute',
            group: 'admin',
            memberName: 'voiceunmute',
            description: 'Unmutes a mentioned user previously muted with the .voicemute command.',
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
        // TODO: if a user is in a voice channel, should we kick them?
        const muteRole = message.guild.roles.find('name', 'voice muted');
        if(!muteRole) {
            let response = `Looks like the voice mute role hasn't been created yet! Have you muted anyone?`;
            console.log(response);
            const embed = new RichEmbed()
                .setColor(0xd29846)
                .setDescription(response);
            message.embed(embed);
        } else {
            if(!user.roles.some(userRole => userRole === muteRole)) {
                let response = `This user has not been muted, please try again.`;
                console.log(response);
                const embed = new RichEmbed()
                    .setColor(0xd29846)
                    .setDescription(response);
                message.embed(embed);
            } else {
                user.removeRole(muteRole)
                .then(updatedUser => {
                    let response = `Successfully unmuted “${updatedUser.displayName}”`
                    console.log(response);
                    const embed = new RichEmbed()
                        .setColor(0xd29846)
                        .setDescription(response);
                    message.embed(embed);
                })
            }
        }
    }
}  