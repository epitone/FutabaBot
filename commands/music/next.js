const { Command } = require('discord.js-commando');
const discordUtils = require ('../../utils/discord-utils');

let musicplayer = require(`./modules/musicplayer`);

module.exports = class NextCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'next',
			group: 'music', //the command group the command is a part of.
			memberName: 'next', //the name of the command within the group (this can be different from the name).
			description: 'Goes to the next song in the queue, you have to be in the same voice channel as the bot for this to work. You can skip multiple songs but that song will not play if repeatplaylist or repeatsong is enabled.',
			args: [
				{
					key: 'skip_amount',
					prompt: 'What are you trying to do? (You can provide an integer to jump to a specific song, or a search query to add a song to the queue)',
					type: 'integer',
                    default: '', // if no argument is given, this is the default
                }
			]
		});
	}

	async run(message, { skip_amount }) {
        const { voiceChannel } = message.member;
        if(!voiceChannel) {
            let response = `You need to be in a voice channel on this server to run this command.`;
            console.log(response);
            discordUtils.embedResponse(message, response, true);
            return;
        }

        if(!skip_amount) {  // if there is no skip argument, advance the queue by 1
            console.log('skipped song');
            musicplayer.skip();
        }
        else {
            // TODO: move skip_amount through the list
        }
    }
}