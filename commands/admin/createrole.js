module.exports = {
	name: 'createrole',
    description: 'Creates a role with a given name.',
    args: true,
    guildOnly: true,
	execute(message, args) {
        if(args.length === 2) {
            message.guild.createRole({
                name: args[0],
                color: args[1]
            })
                .then(role => console.log(`Created new role with name ${role.name} and ${role.color}`))
                .catch(console.error);
        } else {
            message.guild.createRole({
                name: args[0]
            })
                .then(role => console.log(`Created new role with name ${role.name}`))
                .catch(console.error);
        }
	},
};