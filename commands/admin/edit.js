const { Command } = require('discord.js-commando');
const discordUtils = require ('../../utils/discord-utils');

// TODO: add support for embed messages

module.exports = class EditCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'edit',
            group: 'admin',
            memberName: 'edit',
            description: `Edit a bot message. You must provide a messsage ID and new text.`,
            args: [
                {
                    key: 'msg_id',
                    prompt: 'What is the ID of the message?',
                    type: 'string', 
                },
                {
                  key: 'new_msg',
                  prompt: 'What is the new message?',
                  type: 'string'
                }
            ]
        });
    }

    async run(message, { msg_id: messageID, new_msg: newMessage }) {
      let server = message.guild;

      let channels = server.channels.cache

      for(let [, channel] of channels) {
        if(channel.type === 'text') {
          channel.messages.fetch(messageID).then(oldMessage => {
            oldMessage.edit(newMessage)
            .then(editedMessage => {
              discordUtils.embedResponse(message, {
                'color': 'ORANGE',
                'description': `Message with ID “${messageID} successfully edited”`
              });
              console.debug(`Successfully edited message (id: ${editedMessage.id})`);
            });
          });
        }
      }
    }
}

// module.exports = {
//     name: 'edit',
//     description: 'Edit one of the bot\'s messages',
//     args: true, // does the command have arguments?
//     guildOnly: true, // can this command be used outside of the discord channel?
//     execute(message, args) {
//         if (args.length < 2) {
//             console.log("Insufficient arguments provided");
//             return;
//         }
//         const server = message.guild;
//         let id = args.shift();
//         let newMessage = args.join(" ");
        
//         let channels = server.channels;
//         for (let [, channel] of channels) {
//           if (channel.type === "text") {
//             channel
//             .messages
//               .fetch(id)
//               .then(oldMessage => {
//                 oldMessage.edit(newMessage).then(editedMessage => {
//                     message.channel.send(`message succesfully edited.`);
//                     console.log(`new message content: ${editedMessage}`);
//                 });
//               })
//               .catch(e => console.log("Not this channel"));
//           }
//         }
//     },
// };