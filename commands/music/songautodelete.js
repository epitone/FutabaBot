const { Command } = require('discord.js-commando');
const discordUtils = require ('../../utils/discord-utils');

let musicplayer = require(`./modules/musicplayer`);

module.exports = class SongAutoDeleteCommand extends Command {
	constructor(client) {
		super(client, {
            name: 'songautodelete',
            aliases: ['sad'],
            group: 'music', //the command group the command is a part of.
			memberName: 'songautodelete', //the name of the command within the group (this can be different from the name).
			description: 'Toggles whether a song should be automatically removed from the music queue when it finishes playing.'
        });
	}

	async run(message) {
        const { voiceChannel } = message.member;
        const { voice: voiceState } = message.member;
        if(!discordUtils.inVoiceChannel(voiceState, message, `You need to be in a voice channel on this server to run this command.`)) {
            console.log(`${message.author.tag} attempted to use songautodelete without being in a voice channel.`);
            return;
        }
        var autodelete = musicplayer.toggleSongAutodelete();
        var response = `Song Auto-Delete is now ${autodelete ? "on" : "off"}`;
        discordUtils.embedResponse(message, {
            'color': `ORANGE`,
            'description': response
        });
    }
}