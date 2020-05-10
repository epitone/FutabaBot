const { Command } = require(`discord.js-commando`);
const DiscordUtils = require(`../../utils/discord-utils`);
module.exports = class DefVolCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'defvol',
            aliases: ['dv'],
			group: 'music', //the command group the command is a part of.
			memberName: 'defvol', //the name of the command within the group (this can be different from the name).
            description: 'Sets the default playback volume for the music player. This level persists through restarts.',
            args: [
                {
                    key: 'volume_level',
                    prompt: 'What would you like to set the volume to?',
                    type: 'integer',
                    validate: volume_level => volume_level >= 0 && volume_level <= 100
                }
            ]
        });
    }

    async run(message, { volume_level }) {
        
        let musicService = require(`./../../FutabaBot`).getMusicService();
        let musicPlayer = musicService.GetMusicPlayer(message.guild);
        let isVolumeSet = await musicService.SetDefaultVolume(message.guild, volume_level/ 100);

        if(isVolumeSet) musicPlayer.SetVolume(volume_level);
        let response = isVolumeSet ? `**${message.author.tag}** I set the player's default volume to ${volume_level}%. This will persist through bot restarts as well!.` : `Oops! Something went wrong!`;
        DiscordUtils.embedResponse(message, {
            'color': isVolumeSet ? `ORANGE` : `RED`,
            'description': response
        });
    }
}