const { Command } = require('discord.js-commando');
const discordUtils = require ('../../utils/discord-utils');

let musicplayer = require(`./modules/musicplayer`);

module.exports = class NowPlayingCommand extends Command {
	constructor(client) {
		super(client, {
            name: 'nowplaying',
            aliases: ['np'],
            group: 'music', //the command group the command is a part of.
			memberName: 'nowplaying', //the name of the command within the group (this can be different from the name).
			description: 'Shows the song that the bot is currently playing.'
        });
	}

    // TODO: if player is paused, still list the song but put [PAUSED] next to it
	async run(message) {
        if(musicplayer == null) {
            discordUtils.embedResponse(message, {
                color : 'RED',
                description: `The music player is not active.`
            });
        } else {
            let song = musicplayer.current().song;
            if(song == null || musicplayer.stopped) {
                discordUtils.embedResponse(message, {
                    color : 'RED',
                    description: `Nothing is currently playing.`
                });
            } else {
                // TODO: add footer data
                discordUtils.embedResponse(message, {
                    author : musicplayer.paused ? `⏸ Now Playing` : `▶ Now Playing`,
                    title : song.title,
                    url : song.url,
                    color : 'ORANGE'
                });
            }
        }
    }
}