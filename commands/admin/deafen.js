module.exports = {
	name: 'deafen',
    cooldown: 5,
    description: 'Deafens mentioned user or users.',
    args: true,
	execute(message) {
        const taggedMembers = message.mentions.members;
        for (let [, member] of taggedMembers) {
            if(!member.deaf) {
                member.setDeaf(true)
                .then(member => {
                    let response = 
                    console.log(`Deafened ${member.displayName}`)
                })
                .catch(console.error);
            } else {
                message.channel.send(`Attempted to deafen ${member.displayName} but they are already defeaned.`);
            }
        }
	},
};