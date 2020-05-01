// Utility functions for stripping datetime from strings

exports.validTime = (time_string) => {
    const regex = /((\d{1,2}h\s?)?(\d{1,2}m\s?)?(\d{1,2}s\s?)?)/g;
    let isNumeric = /^\d*$/.test(time_string)
    
    if(!isNumeric) { // if string contains non-numeric characters
        return time_string.match(regex);
    }
    return false;
};


/**
 * JavaScript function to match (and return) the video Id
 * of any valid Youtube Url, given as input string.
 * @author: Stephan Schmitz <eyecatchup@gmail.com>
 * @url: https://stackoverflow.com/a/10315969/624466
 * 
 * Addendum: added support for mobile youtube urls, see:
 * https://stackoverflow.com/a/30534640/2467270
 */
exports.validYTUrl = (url_string) => {
    var re_weburl = new RegExp(/(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/);
    return re_weburl.test(url_string);
}

exports.validYTID = (id_string) => {
  const regex = /[a-zA-Z0-9_-]{11}/g;
  return id_string.match(regex);
}

exports.fancy_time = (time_seconds) => {
    // Hours, minutes and seconds
    var hrs = ~~(time_seconds / 3600); // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators for ~~ meaning (it's double bitwise NOT)
    var mins = ~~((time_seconds % 3600) / 60);
    var secs = ~~time_seconds % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}