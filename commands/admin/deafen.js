module.exports = {
	name: 'deafen',
    cooldown: 5,
    description: 'Deafens mentioned user or users.',
    args: true,
	execute(message) {
        const taggedMembers = message.mentions.members;
        taggedMembers.forEach(member => {
            if(!member.deaf) {
                member.setDeaf(true)
                .then(() => {
                    message.channel.send(`Deafened ${member.displayName}`);
                })
                .catch(() => {
                    messaage.channel.send('Oops! Something went wrong!');
                    console.log(error);
                });
            }
            else {
                message.channel.send(`Attempted to deafen ${member.displayName} but they are already defeaned.`);
            }
        });
	},
};