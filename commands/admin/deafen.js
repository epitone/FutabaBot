module.exports = {
	name: 'deafen',
    cooldown: 5,
    description: 'Deafens mentioned user or users.',
    args: true,
	execute(message) {
        const taggedMembers = message.mentions.members;

        for(const member of taggedMembers) {
            member.setDeaf(true)
                .then(() => console.log(`Deafened ${member.displayName}`))
                .catch(console.error);
        }
	},
};