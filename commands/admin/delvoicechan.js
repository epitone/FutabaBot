module.exports = {
	name: 'delvoicechan',
	description: 'Deletes a voice channel with a given name.',
	args: true, // this is not required, if not used, it's safe to delete (will default to false)
	guildOnly: true, // this is not required, if not used, it's safe to delete (will default to false)
	execute(message, args) {
        const server = message.guild;
        const channel = server.channels.find(result => result.name === args.join(' '));
		if (channel && channel.type === 'voice' && channel.deletable) {
            channel.delete()
                .then(deletedChannel => {
                    message.channel.send(`Successfully deleted ${deletedChannel.name}`);
                })
                .catch(() => {
                    messaage.channel.send('Oops! Something went wrong!');
                    console.log(error);
                });
        }
        else {
            message.channel.send('Sorry, I couldn\'t find that channel\!');
        }
	}
};