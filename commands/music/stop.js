const { Command } = require('discord.js-commando');
const discordUtils = require ('../../utils/discord-utils');

let musicplayer = require(`./modules/musicplayer`);

module.exports = class StopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'stop',
			group: 'music', //the command group the command is a part of.
			memberName: 'stop', //the name of the command within the group (this can be different from the name).
			description: 'Stops the music and preserves the current song index. Stays in the channel.',
        });
	}

	async run(message) {
        const { voice: voiceState } = message.member;
        if(!voiceState) {
            let response = `You need to be in a voice channel on this server to run this command.`;
            console.log(`${message.author.tag} attempted to stop music without being in a voice channel.`);
            discordUtils.embedResponse(message, {
                'color': `RED`,
                'description': response
            });
            return;
        } else {
            musicplayer.stop();
            let response = `Playback stopped.`;
            console.log(`${message.author.tag} stopped music playback.`);
            discordUtils.embedResponse(message, {
                'color': `ORANGE`,
                'description': response
            });
        }
    }
}