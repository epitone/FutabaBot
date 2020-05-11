const { Command } = require('discord.js-commando');
const discordUtils = require ('../../utils/discord-utils');

module.exports = class PauseCommannd extends Command {
	constructor(client) {
		super(client, {
            name: 'pause',
            aliases: ['p'],
			group: 'music', //the command group the command is a part of.
			memberName: 'pause', //the name of the command within the group (this can be different from the name).
			description: 'Pauses or unpauses the currently playing song',
        });
	}

	async run(message) {
        const { voice: voiceState } = message.member;
        if(!discordUtils.inVoiceChannel(voiceState, message)) {
            console.log(`${message.author.tag} attempted to pause music without being in a voice channel.`);
            return;
        }

        let musicService = require(`./../../FutabaBot`).getMusicService();
        let musicplayer = musicService.GetMusicPlayer(message.guild);

        // FIXME we're repeating code here, probably should simplify this
        if(musicplayer.paused) {
            musicplayer.togglePause();
            console.log(`${message.author.tag} resumed playback.`);
            discordUtils.embedResponse(message, {
                'color': `ORANGE`,
                'description': `Playback resumed.`
            });
        } else {
            musicplayer.TogglePause();
            console.log(`${message.author.tag} paused playback.`);
            discordUtils.embedResponse(message, {
                'color': `ORANGE`,
                'description': `Playback paused.`
            });
        }
    }
}