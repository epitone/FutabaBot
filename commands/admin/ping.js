const { Command } = require('discord.js-commando');

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            group: 'admin',
            memberName: 'ping',
            description: `A test command.`,
        });
    }

    async run(message) {
        message.channel.send(`Pong.`);
    }
}