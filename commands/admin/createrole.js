module.exports = {
    name: 'createrole',
    description: 'Creates a role with a given name.',
    args: true,
    guildOnly: true,
    execute(message, args) {
        if (!message.guild.available) { // TODO: should this be a while loop? should we use mutex locking?
            console.log(`Server is unavailable.`);
            return;
        }
        const server = message.guild;
        const role = args.join(' ');

        server.createRole({ name: role })
            .then((role) => {
                let response = `Created new role with name “${role.name}”`
                message.channel.send(response);
                console.log(response);
            })
            .catch(() => {
                message.channel.send('Oops! Something went wrong!');
                console.error;
            });
    }
};