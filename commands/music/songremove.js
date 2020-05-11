const { Command } = require('discord.js-commando');
const discordUtils = require('../../utils/discord-utils');

module.exports = class SongRemoveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'songremove',
            aliases: ['srm'],
            args: [
                {
                    key: 'songIndex',
                    prompt: 'Please provide the position of the song you\'d like to remove. (“all” will remove all songs from the queue)',
                    type: 'string',
                    validate: songIndex => !isNaN(songIndex) || songIndex.toLowerCase() === "all",
                },
            ],
            group: 'music',
            memberName: 'songremove',
            description: 'Removes the song at the given position. Use “all” to remove all songs in the queue.',
        });
    }

    async run(message, { songIndex }) {
        const { voice: voiceState } = message.member;
        if(!discordUtils.inVoiceChannel(voiceState, message)) {
            console.log(`${message.author.tag} attempted to run a music command without being in a voice channel.`);
            return;
        }

        // TODO: test individual song removal
        songIndex = +songIndex || songIndex.toLowerCase();

        let musicService = require(`./../../FutabaBot`).getMusicService();
        let musicplayer = musicService.GetMusicPlayer(message.guild);

        if(!isNaN(songIndex)) {
            let removedNode = musicplayer.removeAt(--songIndex);
            if(removedNode) {
                discordUtils.embedResponse(message, {
                    'color': 'ORANGE',
                    'description': `Successfully removed “${removedNode.data.title}” from the queue.`
                });
            } else {
                console.warn('Something went wrong when trying to remove a song. Please check the debug logs.');
                discordUtils.embedResponse(message, {
                    'color': 'RED',
                    'description': `Oops! Something went wrong!`
                });
            }
        } else { // reset the entire queue
            musicplayer.reset();
            discordUtils.embedResponse(message, {
                'color': 'ORANGE',
                'description': `Successfully removed all songs from the queue.`
            });
        }
    }
}