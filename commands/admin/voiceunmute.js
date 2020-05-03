const { Command } = require('discord.js-commando');

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
        const muteRole = message.guild.roles.find('name', 'voice muted');
        if(!muteRole) {
            let response = `Looks like the voice mute role hasn't been created yet! Have you muted anyone?`;
            console.log(response);
            discordUtils.embedResponse(message, {
                'color': 'ORANGE',
                'description': response
            });
        } else {
            if(!user.roles.some(userRole => userRole === muteRole)) {
                let response = `This user has not been muted, please try again.`;
                console.log(response);
                discordUtils.embedResponse(message, {
                    'color': 'ORANGE',
                    'description': response
                });
            } else {
                user.removeRole(muteRole)
                .then(updatedUser => {
                    let response = `Successfully unmuted “${updatedUser.displayName}”`
                    console.log(response);
                    discordUtils.embedResponse(message, {
                        'color': 'ORANGE',
                        'description': response
                    });
                })
            }
        }
    }
}  