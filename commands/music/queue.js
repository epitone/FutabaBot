const { Command } = require('discord.js-commando');
const YouTube = require("discord-youtube-api");
const config = require('../../config.json');
const stringUtils = require('../../utils/string-utils');
const discordUtils = require ('../../utils/discord-utils');

const SongInfo = require(`./modules/songinfo`);
let musicplayer = require(`./modules/musicplayer`);

module.exports = class QueueCommand extends Command {
	constructor(client) {
		super(client, {
            name: 'queue',
            aliases: ['q'],
			group: 'music', //the command group the command is a part of.
			memberName: 'queue', //the name of the command within the group (this can be different from the name).
			description: 'Queue a song using keywords or a link. Bot will join your voice channel. You must be in a voice channel.',
			args: [
				{
					key: 'query_string',
					prompt: 'What are you trying to do? (You can provide an integer to jump to a specific song, or a search query to add a song to the queue)',
					type: 'string',
                }
			]
		});
	}

	async run(message, { query_string }) {
        const { voiceChannel } = message.member;
        if(!voiceChannel) {
            let response = `You need to be in a voice channel on this server to run this command.`
            console.log(`${message.author.tag} attempted to queue up a song without being in a voice channel.`);

            discordUtils.embedResponse(message, {
                'color': `RED`,
                'description': response
            });
            return;
        }
        let youtube = new YouTube(config.yt_api);
        let streamObject = null;
        switch(query_string) {
            case stringUtils.validUrl(query_string):
                streamObject = await youtube.getVideo(query_string);
                break;
            case stringUtils.validYTID(query_string):
                streamObject = await youtube.getVideoByID(query_string);
                break;
            default:
                streamObject = await youtube.searchVideos(query_string);
        }
        if(streamObject) {
            let songInfo = new SongInfo(streamObject, message);
            
            musicplayer.queue.add(songInfo); // add song to the player queue
            discordUtils.embedResponse(message, {
                author : `Queued Song #${musicplayer.queue.length}`,
                title : songInfo.title,
                url : songInfo.url,
                color : 'ORANGE'
            })
            console.log(`added “${songInfo.title}” to queue position ${musicplayer.queue.length}`);
            if(musicplayer.is_stopped) {
                discordUtils.embedResponse(message, {
                    color : 'RED',
                    description: `A song has been queued but the player is stopped. To start playback use the \`.play\` command.`
                })  
            } else {
                if(!message.guild.voiceConnection) {
                    voiceChannel.join().then(connection => {
                        musicplayer.play(connection, message) // start playing
                    });
                }
            }
        } else {
            discordUtils.embedResponse(message, `I couldn't find that song!`, true);
        }
    }
}