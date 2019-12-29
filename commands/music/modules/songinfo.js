module.exports = class SongInfo {
    constructor (streamObject, message) {
        this.provider = "";
        this.query = message.content;
        this.title = streamObject.title;
        this.url = streamObject.url;
        this.thumbnail = streamObject.thumbnail;
        this.totalTime = new Date(streamObject.durationSeconds * 1000).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
    }
}