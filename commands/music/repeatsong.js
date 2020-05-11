const { Command } = require('discord.js-commando');
const YouTube = require("discord-youtube-api");
const discordUtils = require ('../../utils/discord-utils');

const SongInfo = require(`./../../modules/music/songinfo`);

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
        const { voice: voiceState } = message.member;
        if(!discordUtils.inVoiceChannel(voiceState, message)) {
            console.log(`${message.author.tag} attempted to run a music command without being in a voice channel.`);
            return;
        }
        
        let musicService = require(`./../../FutabaBot`).getMusicService();
        let musicplayer = musicService.GetMusicPlayer(message.guild);

        if(musicplayer.current()) {
            if(!musicplayer.stopped) {
                if(musicplayer.toggleRepeatSong()) {
                    let current_song = musicplayer.current().song;
                    discordUtils.embedResponse(message, {
                        'author' : `🔂 Repeating track`,
                        'title' : current_song.title,
                        'url' : current_song.url,
                        'color' : 'ORANGE',
                        'footer' : `${current_song.total_time} | ${current_song.provider} | ${current_song.requester}`
                    });
                } else {
                    discordUtils.embedResponse(message, {
                        'author' : `🔂 Current track repeat disabled`,
                        'color' : 'ORANGE'
                    });
                }
            } else {
                let repeatSongEnabled = musicplayer.toggleRepeatSong();
                discordUtils.embedResponse(message, {
                    'author' : `🔂 Current track repeat ${(repeatSongEnabled ? `enabled` : `disabled`)}`,
                    'color' : 'ORANGE'
                });
            }
        } else {
            let response = `The music player is not currently active.`;
            discordUtils.embedResponse(message, {
                'color': `RED`,
                'description': response
            });
        }
    }
}