const { RichEmbed } = require('discord.js');

exports.embedResponse = (message, embed_options) => {
    const embed = new RichEmbed()
        // .setColor(embed_options.get('color') ? embed_options.get('color') : undefined)
        // .setDescription(embed_options.get('description') ? embed_options.get('description') : undefined)
        // .setURL(embed_options.get('url') ? embed_options.get('url') : undefined)
        // .setFooter('footer text here');
    if(embed_options.color) embed.setColor(embed_options.color);
    if(embed_options.title) embed.setTitle(embed_options.title);
    if(embed_options.description) embed.setDescription(embed_options.description);
    if(embed_options.url) embed.setURL(embed_options.url);
    if(embed_options.author) embed.setAuthor(embed_options.author);
    message.embed(embed);
}