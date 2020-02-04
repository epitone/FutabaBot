const { Command } = require('discord.js-commando');
const YouTube = require("discord-youtube-api");
const config = require('../../config.json');
const stringUtils = require('../../utils/string-utils');
const discordUtils = require ('../../utils/discord-utils');

const SongInfo = require(`./modules/songinfo`);
let musicplayer = require(`./modules/musicplayer`);

module.exports = class RepeatSongCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'repeatsong',
			group: 'music', //the command group the command is a part of.
			memberName: 'repeatsong', //the name of the command within the group (this can be different from the name).
			description: 'Toggles repeat of current song.',
        });
	}

	async run(message) {
        const { voiceChannel } = message.member;
        if(!voiceChannel) {
            let response = `You need to be in a voice channel on this server to run this command.`;
            console.log(`${message.author.tag} attempted to run a music command without being in a voice channel.`);
            discordUtils.embedResponse(message, {
                'color': `RED`,
                'description': response
            });
            return;
        } else {
            if(musicplayer.toggleRepeatSong()) {
                let current_song = musicplayer.queue.current();
                discordUtils.embedResponse(message, {
                    'author' : `🔂 Repeating track`,
                    'title' : current_song.title,
                    'url' : current_song.url,
                    'color' : 'ORANGE',
                    'footer' : `${songInfo.total_time} | ${songInfo.provider} | ${songInfo.requester}`
                })
            } else {
                discordUtils.embedResponse(message, {
                    'author' : `🔂 Current track repeat stopped`,
                    'color' : 'ORANGE'
                })
            }
            let response = `Playback stopped.`;
            console.log(`${message.author.tag} stopped music playback.`);
            discordUtils.embedResponse(message, {
                'color': `ORANGE`,
                'description': response
            });
        }
    }
}