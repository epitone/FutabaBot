module.exports = {
	name: 'settopic',
	description: 'Sets the topic of the current channel',
	args: true, // does the command have arguments?
	guildOnly: true, // can this command be used outside of the discord channel?
	execute(message, args) {
        const server = message.guild;
        const topic = args.join(' ');
        const channel = message.channel;
        channel.setTopic(topic)
        .then(updated => {
            let response = `Channel's new topic is “${updated.topic}”`;
            message.channel.send(response);
            console.log(response);
        })
        .catch(() => {
            message.channel.send("Oops! Something went wrong!");
            console.log(error);
        });
	},
};