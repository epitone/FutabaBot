module.exports = {
    name: 'edit',
    description: 'Edit one of the bot\'s messages',
    args: true, // does the command have arguments?
    guildOnly: true, // can this command be used outside of the discord channel?
    execute(message, args) {
        if (args.length < 2) {
            console.log("Insufficient arguments provided");
            return;
        }
        const server = message.guild;
        let id = args.shift();
        let newMessage = args.join(" ");
        
        let channels = server.channels;
        for (let [, channel] of channels) {
          if (channel.type === "text") {
            channel
              .fetchMessage(id)
              .then(oldMessage => {
                oldMessage.edit(newMessage).then(editedMessage => {
                    message.channel.send(`message succesfully edited.`);
                    console.log(`new message content: ${editedMessage}`);
                });
              })
              .catch(e => console.log("Not this channel"));
          }
        }
    },
};