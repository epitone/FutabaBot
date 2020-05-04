const { Command } = require('discord.js-commando');
const discordUtils = require('../../utils/discord-utils')

module.exports = class PruneCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'prune',
            group: 'admin',
            memberName: 'prune',
            description: 'Removes all of the bot\'s messages within the last 100 messages of the current channel. ' +
                `.prune x removes the last “x” number of messages (max 100). \`.prune @username\` removes their last 100 messages. ` +
                `\`.prune false\` only removes that aren\'t pinned. A full command may look like: \`!prune 200 @username false\``,
            args: [
                {
                    key: 'messagesAmount',
                    prompt: 'How many messages would you like to delete?',
                    type: 'integer',
                    default: 100,
                    validate: messagesAmount => messagesAmount < 101,
                },
                {
                    key: 'user',
                    prompt: 'Whose messages would you like to prune?',
                    type: 'member',
                    default: ''
                },
                {
                    key: 'removePinned',
                    prompt: 'Would you like to remove pinned messages?',
                    type: 'boolean',
                    default: true
                }
            ]
        });
    }

    async run(message, { messagesAmount, user, removePinned }) {
        let channelMessages = message.channel.messages

        channelMessages.fetch({ limit: messagesAmount }) // get the last n number of messages in the channel
            .then(messages => {
                console.log(`Retrieved ${messages.size} messages`);
                let messagesToDelete = messages.filter(message => {
                    if (user) {
                        if (!removePinned) {
                            console.log(`found message: “${message}” by ${message.author.username}`)
                            return !message.pinned && message.author.id === user.id;
                        } else {
                            console.log(`found message: “${message}” by ${message.author.username}`)
                            return message.author.id === user.id
                        }
                    } else {
                        if (!removePinned) {
                            console.log(`found message: “${message}” by ${message.author.username}`)
                            return !message.pinned && message.author.bot && message.author.id === message.client.user.id;
                        } else {
                            console.log(`found message: “${message}” by ${message.author.username}`)
                            return message.author.bot && message.author.id === message.client.user.id
                        }
                    }
                });

                console.log(`Messages to Delete: ${messagesToDelete}`);
                let numMessagesToDelete = messagesToDelete.size;
                if (numMessagesToDelete > 1) {
                    message.channel.bulkDelete(messagesToDelete, false)
                        .then(deleted => {
                            let response = `Successfully deleted ${deleted.size} messages.`;
                            console.log(response);
                            discordUtils.embedResponse(message, {
                                'color': `ORANGE`,
                                'description': response
                            });
                        });
                }
                else {
                    messagesToDelete.first().delete();
                    let response = `Successfully deleted ${messagesToDelete.size} messages.`;
                    console.log(response);
                    discordUtils.embedResponse(message, {
                        'color': `ORANGE`,
                        'description': response
                    });
                }

            })
            .catch(error => {
                console.error(error)
                discordUtils.embedResponse(message, {
                    'color': `RED`,
                    'description': `Oops! Something went wrong!`
                });
            });
    }
}