const { Command } = require('discord.js-commando');
const YouTube = require("discord-youtube-api");
const config = require('../../config.json');
const stringUtils = require('../../utils/string-utils');
const discordUtils = require ('../../utils/discord-utils');

const SongInfo = require(`./modules/songinfo`);
let musicplayer = require(`./modules/musicplayer`);

module.exports = class VolumeCommand extends Command {
	constructor(client) {
		super(client, {
            name: 'volume',
            aliases: ['vol'],
			group: 'music', //the command group the command is a part of.
			memberName: 'volume',
			description: 'Sets the music playback volume (0-100%)',
			args: [
				{
					key: 'volume_level',
					prompt: 'What would you like to set the volume to?',
                    type: 'integer',
                    validate: volume_level => {
                        let volume_int = parseInt(volume_level)
                        return volume_int >= 0 && volume_int <= 100 // between 0 - 100
                    },
                }
			]
        });
	}

	async run(message, { volume_level }) {
        const { voiceChannel } = message.member;
        if(!voiceChannel) {
            let response = `You need to be in a voice channel to run this command.`
            console.log(response);

            discordUtils.embedResponse(message, {
                'color': 'RED',
                'description' : response
            });
            return;
        }

        musicplayer.setVolume(volume_level);
        let response = `**${message.author.tag}** set volume to ${volume_level}%`
        discordUtils.embedResponse(message, {
            'color': 'ORANGE',
            'description' : response
        });
    }
}