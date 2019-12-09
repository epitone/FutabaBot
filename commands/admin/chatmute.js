const { Command } = require('discord.js-commando');
const { RichEmbed, Permissions } = require('discord.js');
const moment = require('moment');
const timeUtils = require('../../utils/time-utils');

// TODO: check edge cases for this command

module.exports = class MuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'chatmute',
            group: 'admin',
            memberName: 'chatmute',
            description: 'Prevents a mentioned user from chatting in text channels.',
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
        const muteRole = message.guild.roles.find('name', 'chat muted');
        if(!muteRole) {
            const chatMutedPermissions = new Permissions(70321152); // only allows read message history, change nickname and view channels and connection to voice chat
            message.guild.createRole({
                name: 'chat muted',
                permissions: chatMutedPermissions
            })
            .then((role) => {
                for(let [,channel] of message.guild.channels) {
                    if(channel.type === 'text') {
                        channel.overwritePermissions(role, {
                            SEND_MESSAGES: false
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