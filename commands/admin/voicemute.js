const { Command } = require('discord.js-commando');
const { RichEmbed, Permissions } = require('discord.js');
const moment = require('moment');
const timeUtils = require('../../utils/time-utils');

// TODO: check edge cases for this command

module.exports = class VoiceMute extends Command {
    constructor(client) {
        super(client, {
            name: 'voicemute',
            group: 'admin',
            memberName: 'voicemute',
            description: 'Prevents a mentioned user from speaking in voice channels.',
            args: [
                {
                    key: 'user',
                    prompt: 'What user would you like to mute?',
                    type: 'member', 
                }
            ]
        });
    }

    async run(message, { user }) {
        // TODO: if a user is in a voice channel, should we kick them?
        const muteRole = message.guild.roles.find('name', 'voice muted');
        if(!muteRole) {
            const voiceMutedPermissions = new Permissions(67492928); // see https://discordapi.com/permissions.html#67492928
            message.guild.createRole({
                name: 'voice muted',
                permissions: voiceMutedPermissions
            })
            .then((role) => {
                for(let [,channel] of message.guild.channels) {
                    if(channel.type === 'voice') {
                        channel.overwritePermissions(role, {
                            CONNECT: false,
                            SPEAK: false
                        })
                        .then(updated => console.log(`new permissions for #${updated.name}: ${JSON.stringify(updated.permissionsFor(role))}`))
                        .catch(console.error);
                    }
                }
                console.log(`created role with name ${role.name}`)
                user.addRole(role)
                .then((muted) => {
                    let response = `Successfully muted “${muted.displayName}”`;
                    console.log(response);
                    const embed = new RichEmbed()
                        .setColor(0xd29846)
                        .setDescription(response);
                    message.embed(embed);
                })
            })
            .catch(error => {
                console.log(error)
                const embed = new RichEmbed()
                    .setColor(0xd29846)
                    .setDescription(`Oops! Something went wrong!`);
                message.embed(embed);
            })
        } else {
            user.addRole(muteRole)
            .then(updated => {
                let response = `Successfully muted “${updated.displayName}”`;
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
            })
        }
    }
}  