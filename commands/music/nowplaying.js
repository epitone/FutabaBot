const { Command } = require('discord.js-commando');
const stringUtils = require('../../utils/string-utils');
const discordUtils = require ('../../utils/discord-utils');

const SongInfo = require(`./modules/songinfo`);
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

	async run(message) {
        if(musicplayer == null) {
            discordUtils.embedResponse(message, {
                color : 'RED',
                description: `The music player is not active.`
            });
        } else {
            let song = musicplayer.current();
            if(song == null) {
                discordUtils.embedResponse(message, {
                    color : 'RED',
                    description: `Nothing is currently playing.`
                });
            } else {
                discordUtils.embedResponse(message, {
                    author : `Now Playing`,
                    title : song.title,
                    url : song.url,
                    color : 'ORANGE'
                });
            }
        }
    }
}