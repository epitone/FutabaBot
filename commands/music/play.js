const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const YouTube = require("discord-youtube-api");
const config = require('../../config.json');
const stringUtils = require('../../utils/string-utils');
const discordUtils = require ('../../utils/discord-utils');

const SongInfo = require(`./modules/songinfo`);
const MusicPlayer = require(`./modules/musicplayer`);

let musicplayer = new MusicPlayer();

module.exports = class PlayCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'play',
			group: 'music', //the command group the command is a part of.
			memberName: 'play', //the name of the command within the group (this can be different from the name).
			description: 'If no parameters are specified, acts as .next 1 command. If you specify a song number, it will jump to that song. If you specify a search query, acts as a .q commandcommand description',
			args: [
				{
					key: 'play_argument',
					prompt: 'What are you trying to do? (You can provide an integer to jump to a specific song, or a search query to add a song to the queue)',
					type: 'string',
                    default: '', // if no argument is given, this is the default
                }
			]
		});
	}

	async run(message, { play_argument }) {
        const { voiceChannel } = message.member;
        if(!voiceChannel) {
            let response = `You need to be in a voice channel on this server to run this command.`;
            console.log(response);
            discordUtils.embedResponse(message, response, true);
            return;
        }

        if(!play_argument) {  // if there is no play argument, advance the queue
            // TODO: music  player skip
        }
        else if(!isNaN(play_argument)) { // if play_argument is a number
            let songIndex = parseInt(play_argument);
            while(songIndex != 0) {

            }
        } else { // we have a url or a search query
            let youtube = new YouTube(config.yt_api);
            let streamObject = stringUtils.validUrl(play_argument) ? await youtube.getVideo(play_argument) : await youtube.searchVideos(play_argument);
            if(streamObject) {
                let songInfo = new SongInfo(streamObject, message);
                
                musicplayer.queue.add(songInfo); // add song to the player queue
                console.log(`added “${songInfo.title}” to queue position ${musicplayer.queue.length}`);
                
                if(!message.guild.voiceConnection) { // if we're not in a voice channel, join one
                    voiceChannel.join().then(connection => {
                        musicplayer.play(connection, message) // start playing
                    });
                }
            } else {
                discordUtils.embedResponse(message, `I couldn't find that song!`, true);
            }
        }
    }
}