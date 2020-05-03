// const { Command } = require('discord.js-commando');
// const { RichEmbed } = require('discord.js');

// module.exports = class Prune extends Command {
//     constructor(client) {
//         super(client, {
//             name: 'prune',
//             group: 'admin',
//             memberName: 'prune',
//             description: 'Removes all of the bot\'s messages within the last 100 messages of the channel. ' +
//             `.prune x removes the last “x” number of messages (max 100). .prune @username removes their last 100 messages. ` + 
//             `.prune false only removes that aren\'t pinned. A full command may look like: “!prune 200 @username false'`,
//             args: [
//                 {
//                     key: 'messagesAmount',
//                     prompt: 'How many messages would you like to delete?',
//                     type: 'integer',
//                     default: 100,
//                     validate: messagesAmount => messagesAmount < 101,
//                 },
//                 {
//                     key: 'user',
//                     prompt: 'Whose messages would you like to prune?',
//                     type: 'member',
//                     default: ''
//                 },
//                 {
//                     key: 'removePinned',
//                     prompt: 'Would you like to remove pinned messages?',
//                     type: 'boolean',
//                     default: true
//                 }
//             ]
//         });
//     }

//     async run(message, { messagesAmount, user, removePinned }) {
//         message.channel.fetchMessages({ limit: messagesAmount })
//             .then(messages => {
//                 console.log(`Retrieved ${messages.size} messages`);
//                 const userMessages = messages.filterArray(msg => {
//                     if(user) {
//                         if (!removePinned) return !msg.pinned && msg.author.id == user.id;
//                         else return msg.author.id === user.id;
//                     } else {
//                         if (!removePinned) {
//                             console.log(`message content and author: ${msg.content} by ${msg.author.username}`);
//                             return !msg.pinned && msg.author.bot;
//                         } 
//                         else {
//                             console.log(`message content and author: ${msg.content} by ${msg.author.username}`)
//                             return msg.author.bot;
//                         }
//                     }
//                 });
//                 let messagesDeleted = userMessages.length; // number of messages to delete
//                 console.log(`Messages to Delete: ${userMessages}`)
//                 if (messagesDeleted.length > 1) {
//                     message.channel.bulkDelete(userMessages, true)
//                     .then(deleted => {
//                         let response = `Successfully deleted ${deleted.size} messages.`;
//                         console.log(response);
//                         const embed = new RichEmbed()
//                             .setColor(0xd29846)
//                             .setDescription(response);
//                         message.embed(embed);
//                     })
//                 } else {
//                     userMessages[0].delete();
//                     let response = `Successfully deleted ${messagesDeleted} messages.`;
//                     console.log(response);
//                     const embed = new RichEmbed()
//                         .setColor(0xd29846)
//                         .setDescription(response);
//                     message.embed(embed);
//                 }
//             })
//             .catch(error => {
//                 console.error(error)
//                 const embed = new RichEmbed()
//                     .setColor(0xd29846)
//                     .setDescription(`Oops! Something went wrong!`);
//                 message.embed(embed);
//             });
//     }
// }