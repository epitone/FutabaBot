module.exports = {
    name: 'createvoicechan',
    description: 'Creates a voice channel with a given name.',
    args: true,
    guildOnly: true,
    execute(message, args) {
        const server = message.guild;
        const channel = args.join('-');
        server.createChannel(channel, { type : 'voice'})
        .then(() => {
            message.channel.send(`Successfully created #${channel} channel.`);
        })
        .catch(() => {
            message.channel.send("Oops! Something went wrong!");
            console.log(error);
        });
    }
}