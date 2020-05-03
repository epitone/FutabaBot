const { MessageEmbed } = require('discord.js');

exports.embedResponse = (message, embed_options) => {
    const embed = new MessageEmbed()
    if(embed_options.color) embed.setColor(embed_options.color);
    if(embed_options.title) embed.setTitle(embed_options.title);
    if(embed_options.description) embed.setDescription(embed_options.description);
    if(embed_options.url) embed.setURL(embed_options.url);
    if(embed_options.author) embed.setAuthor(embed_options.author);
    if(embed_options.footer) embed.setFooter(embed_options.footer)
    message.embed(embed);
}

exports.inVoiceChannel = (voiceState, message) => {
    if(!voiceState.channel) {
        let response = `You need to be in a voice channel on this server to run this command.`;
        console.log(`${message.author.tag} attempted to play music without being in a voice channel.`);
        this.embedResponse(message, {
            'color': `RED`,
            'description': response
        });
        return false;
    }
    return true;
}