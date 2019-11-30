const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const moment = require('moment');
const timeUtils = require('../../utils/time-utils');

// TODO: check edge cases for this command

module.exports = class MuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            group: 'admin',
            memberName: 'mute',
            description: 'Mutes a mentioned user from both speaking and chatting. you can also specify how long the user is muted for.',
            args: [
                {
                    key: 'user',
                    prompt: 'What user would you like to mute?',
                    type: 'member', 
                },
                {
                    // TODO: add a validator to make sure the value is appropriate
                    key: 'timeout',
                    prompt: 'How long would you like to time them out for? (Format examples: 1h30m, 90m, 2h, 24h, 30s)',
                    type: 'string',
                    default: '',
                }
            ]
        });
    }

    async run(message, { user, timeout }) {
        //check if timeout value was given
        const muteRole = message.guild.roles.find('name', 'muted');
        if(timeout && !timeUtils.validTime(timeout)) {
            console.log("invalid duration");
            const embed = new RichEmbed()
                .setColor(0xd29846)
                .setDescription(`You provided an invalid duration, please try again.`);
            message.embed(embed);
            return;
        }
        if(!timeout) {
            user.addRole(muteRole)
                .then((muted) => {
                    let response = `Successfully muted “${muted.displayName}”`;
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
        } else {
            user.addRole(muteRole)
            .then((muted) => {
                timeout = timeout.replace(/\s+/g, '');
                let duration = moment.duration("PT" + timeout.toUpperCase()).asMilliseconds();
                console.log("time", timeout);
                console.log("duration in milliseconds", duration);
                console.log("user", muted)

                setTimeout(() => {
                    muted.removeRole(muteRole);
                    console.log(`successfully unmuted “${user.displayName}”`);
                }, duration)                
            })
            .catch(error => {
                console.log(error)
                const embed = new RichEmbed()
                    .setColor(0xd29846)
                    .setDescription(`Oops! Something went wrong!`);
                message.embed(embed);
            });
        }
    }
}  