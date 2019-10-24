module.exports = {
	name: 'undeafen',
    cooldown: 5,
    description: 'Undeafens mentioned user or users.',
    args: true,
	execute(message) {
        const taggedMembers = message.mentions.members;
        let response = ``;
        taggedMembers.forEach(member => {
            if(member.deaf) {
                member.setDeaf(false)
                .then(() => {
                    response = `Undeafened ${member.displayName}`;
                    console.log(response);
                })
                .catch(console.error);
            } else {
                response = `Attempted to undeafen ${member.displayName} but they are not defeaned.`;
                console.log(response);
            }
        });
        message.channel.send(response);
	},
};