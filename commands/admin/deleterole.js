module.exports = {
	name: 'deleterole',
    description: 'Deletes a role with a given name.',
    args: true,
    guildOnly: true,
	execute(message, args) {
        const server = message.guild;
        
        if(!server.available) {
            console.log(`${server.name} is not available.`);
            return;
        }

        const role = server.roles.find(role => role.name === args.join(' '));

        if(role) {
            role.delete()
            .then((deleted) => {
                let response = `Deleted “${deleted.name}” role`;
                console.log(response);
                message.channel.send(response);
            })
            .catch(() => {
                message.channel.send(`Oops! Something went wrong!`);
                console.error;            
            });
        } else {
            let response = `Huh, I couldn't find a role with that name.`;
            message.channel.send(response);
        }
	},
};