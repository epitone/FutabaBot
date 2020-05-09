const { Command } = require('discord.js-commando');
const musicplayer = require(`./modules/musicplayer`);
const discordUtils = require ('../../utils/discord-utils');

module.exports = class MoveSongCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'movesong',
            aliases: [`ms`],
			group: 'music', //the command group the command is a part of.
			memberName: 'movesong', //the name of the command within the group (this can be different from the name).
            description: 'Moves a song from one position to another.',
            args: [
                {
                    key: 'position1',
                    prompt: 'What is the position of the item you\'d like to move?',
                    type: 'integer',
                    validate: position1 => {
                        position1 = parseInt(position1);
                        return position1 >= 1 && position1 <= musicplayer.QueueCount();
                    }
                },
                {
                    key: 'position2',
                    prompt: 'Where would you like to move it to?',
                    type: 'integer',
                    validate: position2 => {
                        position2 = parseInt(position2);
                        return position2 >= 1 && position2 <= musicplayer.QueueCount();
                    }
                }
            ]
        });
    }

    async run(message, { position1, position2 }) {
        let { node1, node2 } = musicplayer.MoveSong(position1-1, position2-1);
        let response = node1 && node2 ? `**${message.author.tag}** I have successfully moved ${node2.data.prettyName} from position ${position1} to ${position2}.` :
        `Something went wrong! Please try again.`
        if(node1 && node2) {
            discordUtils.embedResponse(message, {
                'color': node1 && node2 ? `ORANGE` : `RED`,
                'description': response
            })
        }
    }
}