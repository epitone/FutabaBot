const { Command } = require('discord.js-commando');
const discordUtils = require ('../../utils/discord-utils');

const SongInfo = require(`./modules/songinfo`);
let musicplayer = require(`./modules/musicplayer`);

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

	async run(message, { play_argument }) {
        const { voice: voiceState } = message.member;
        if(!discordUtils.inVoiceChannel(voiceState, message)) {
            console.log(`${message.author.tag} attempted to pause music without being in a voice channel.`);
            return;
        }

        let voiceChannel = voiceState.channel;

        if(musicplayer.paused) {
            musicplayer.resume();
            console.log(`${message.author.tag} resumed playback.`);
            discordUtils.embedResponse(message, {
                'color': `ORANGE`,
                'description': `Playback resumed.`
            });
        } else {
            musicplayer.pause();
            console.log(`${message.author.tag} paused playback.`);
            discordUtils.embedResponse(message, {
                'color': `ORANGE`,
                'description': `Playback paused.`
            });
        }
    }
}