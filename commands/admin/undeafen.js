module.exports = {
	name: 'undeafen',
    cooldown: 5,
    description: 'Undeafens mentioned user or users.',
    args: true,
	execute(message) {
        const taggedMembers = message.mentions.members;
        taggedMembers.forEach(member => {
            if(member.deaf) {
                member.setDeaf(false)
                .then(() => {
                    message.channel.send(`Undeafened ${member.displayName}`);
                })
                .catch(() => {
                    messaage.channel.send('Oops! Something went wrong!');
                    console.error(error)
                });
            } else {
                message.channel.send(`Attempted to undeafen ${member.displayName} but they are not defeaned.`);
            }
        });
	},
};