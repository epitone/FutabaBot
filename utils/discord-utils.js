const { RichEmbed } = require('discord.js');

exports.embedResponse = (message, responseString, isError) => {
    const embed = new RichEmbed()
        .setColor(isError ? 0xff0000 : 0xd29846)
        .setDescription(responseString);
    message.embed(embed);
}