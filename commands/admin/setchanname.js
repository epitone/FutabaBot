module.exports = {
	name: 'setchanname',
	description: 'Sets the name of the current channel',
	args: true, // does the command have arguments?
	guildOnly: true, // can this command be used outside of the discord channel?
	execute(message, args) {
        const server = message.guild;
        const channelName = args.join('-');
        const channel = message.channel;
        channel.setName(channelName)
        .then(updated => {
            let response = `Channel's new name is “${updated.name}”`;
            message.channel.send(response);
            console.log(response);
        })
        .catch((err) => {
            message.channel.send("Oops! Something went wrong!");
            console.log(err);
        });
	},
};