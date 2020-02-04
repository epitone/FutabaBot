const string_utils = require(`../../../utils/string-utils`)

module.exports = class SongInfo {
    constructor (streamObject, message) {
        this.provider = "YouTube"; // TODO: eventually add support for SoundCloud
        this.query = message.content;
        this.title = streamObject.title;
        this.url = streamObject.url;
        this.thumbnail = streamObject.thumbnail;
        this.total_time = streamObject.length
        this.requester = message.author.tag
    }
}