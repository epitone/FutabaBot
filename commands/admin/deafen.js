module.exports = {
	name: 'deafen',
    cooldown: 5,
    description: 'Deafens mentioned user or users.',
    args: true,
	execute(message) {
        let response = ``;
        const taggedMembers = message.mentions.members;
        taggedMembers.forEach(member => {
            if(!member.deaf) {
                member.setDeaf(true)
                .then(() => {
                    response = `Deafened ${member.displayName}`;
                    console.log(response);
                })
                .catch(console.error);
            } else {
                response = `Attempted to deafen ${member.displayName} but they are already defeaned.`;
                console.log(response);
            }
        });
        message.channel.send(response);
	},
};