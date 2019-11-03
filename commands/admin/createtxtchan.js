module.exports = {
    name: 'createtxtchan',
    description: 'Creates a text channel with a given name.',
    args: true, // this is not required, if not used, it's safe to delete (will default to false)
    guildOnly: true, // this is not required, if not used, it's safe to delete (will default to false)
    execute(message, args) {
        const server = message.guild;
        const channel = args.join(' ');
        server.createChannel(channel, { type : 'text'})
        .then(() => {
            message.channel.send(`Successfully created “#${channel}” channel.`);
        })
        .catch(() => {
            message.channel.send("Oops! Something went wrong!");
            console.log(error);
        });
    }
}