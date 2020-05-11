const { Command } = require('discord.js-commando');
const YouTube = require("discord-youtube-api");
const config = require('../../config.json');
const stringUtils = require('../../utils/string-utils');
const discordUtils = require ('../../utils/discord-utils');

const SongInfo = require(`./../../modules/music/songinfo`);

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
        const { voice: voiceState } = message.member;
        if(!discordUtils.inVoiceChannel(voiceState, message)) {
            console.log(`${message.author.tag} attempted to play music without being in a voice channel.`);
            return;
        }

        let voiceChannel = voiceState.channel;
        let musicService = require(`./../../FutabaBot`).getMusicService();
        let musicplayer = musicService.GetMusicPlayer(message.guild);
        
        if(!play_argument) {
            if(musicplayer.QueueCount() == 0) {
                discordUtils.embedResponse(message, {
                    'author' : `It doesn't look like there are any songs in the queue.`,
                    'color' : 'ORANGE',
                })
            } else {
                musicplayer.skip(1);
                let connection = message.guild.voiceChannel
                if(connection) {
                    musicplayer.play(connection, message)
                } else { // join voice chat and start playback
                    voiceChannel.join().then(connection => {
                        musicplayer.play(connection, message)
                    });
                }
            }
        }
        else if(!isNaN(play_argument)) {
            let songIndex = parseInt(play_argument);
            musicplayer.skip(songIndex);
        } else {
            let youtube = new YouTube(config.yt_api);
            let streamObject = null;
            switch(play_argument) {
                case stringUtils.ValidYTUrl(play_argument):
                    streamObject = await youtube.getVideo(play_argument);
                    break;
                case stringUtils.ValidYTID(play_argument):
                    streamObject = await youtube.getVideoByID(play_argument);
                    break;
                default:
                    streamObject = await youtube.searchVideos(play_argument);
            }
            if(streamObject) {
                let songInfo = new SongInfo(streamObject, message);
            
                musicplayer.Enqueue(songInfo);
                console.log(`${message.author.tag} added “${songInfo.title}” to queue position ${musicplayer.QueueCount()}`);

                discordUtils.embedResponse(message, {
                    'author' : `Queued song #${musicplayer.QueueCount()}`,
                    'title' : songInfo.title,
                    'url' : songInfo.url,
                    'color' : 'ORANGE',
                    'footer' : `${songInfo.total_time} | ${songInfo.requester}`
                })
                if(musicplayer.is_stopped) {
                    discordUtils.embedResponse(message, {
                        color : 'RED',
                        description: `A song has been queued but the player is stopped. To start playback use the \`.play\` command.`
                    });
                } else if (!message.guild.voiceConnection) {
                    voiceChannel.join().then(connection => {
                        musicplayer.play(connection, message)
                    });
                }
            } else {
                discordUtils.embedResponse(message, {
                    'color': `RED`,
                    'description': 'I couldn\'t find that song!'
                });
            }
        }
    }
}