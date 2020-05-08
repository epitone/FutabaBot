const { Util } = require(`discord.js`);

module.exports = class SongInfo {
    constructor (streamObject, message) {
        this.provider = "YouTube"; // TODO: eventually add support for SoundCloud
        this.query = message.content;
        this.title = streamObject.title;
        this.url = streamObject.url;
        this.thumbnail = streamObject.thumbnail;
        this.totalTime = streamObject.durationSeconds; // time duration in seconds
        this.requester = Util.cleanContent(message.author.tag, message);

        // These variables are for display purposes
        this.prettyName = `**[${streamObject.title.substring(0, 65)}](${this.url})**`;
        this.prettyTotalTime = streamObject.length;
        this.prettyInfo = `${this.prettyTotalTime} | Youtube | ${this.requester}`;
        this.prettyFullName = `${this.prettyName}\n\t\t\`${this.prettyTotalTime} | Youtube | ${this.requester.length > 15 ? (this.requester) : (this.requester.substring(0, 15) + "...")}\``;
    }
}