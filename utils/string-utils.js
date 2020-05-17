// Utility functions for stripping datetime from strings

exports.validTime = (timeString) => {
  const regex = /((\d{1,2}h\s?)?(\d{1,2}m\s?)?(\d{1,2}s\s?)?)/g
  const isNumeric = /^\d*$/.test(timeString)

  if (!isNumeric) { // if string contains non-numeric characters
    return timeString.match(regex)
  }
  return false
}

/**
 * JavaScript function to match (and return) the video Id
 * of any valid Youtube Url, given as input string.
 * @author: Stephan Schmitz <eyecatchup@gmail.com>
 * @url: https://stackoverflow.com/a/10315969/624466
 *
 * Addendum: added support for mobile youtube urls, see:
 * https://stackoverflow.com/a/30534640/2467270
 */
exports.ValidYTUrl = (urlString) => {
  var reWebURL = new RegExp(/(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/)
  return reWebURL.test(urlString)
}

exports.ValidYTID = (idString) => {
  const regex = /[a-zA-Z0-9_-]{11}/g
  return idString.match(regex)
}

// Info on reduce: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
// See https://stackoverflow.com/a/45292588/2467270 for explanation
// Essentially it does (60 * ((60 * HHHH) + MM)) + SS
exports.DurationToSeconds = (duration) => {
  return +(duration.split(':').reduce((acc, time) => (60 * acc) + +time))
}

exports.FancyTime = (timeSeconds) => {
  // Hours, minutes and seconds
  var hrs = ~~(timeSeconds / 3600) // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators for ~~ meaning (it's double bitwise NOT)
  var mins = ~~((timeSeconds % 3600) / 60)
  var secs = ~~timeSeconds % 60

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var fancyTime = ''

  if (hrs > 0) {
    fancyTime += '' + hrs + ':' + (mins < 10 ? '0' : '')
  }

  fancyTime += '' + mins + ':' + (secs < 10 ? '0' : '')
  fancyTime += '' + secs
  return fancyTime
}

exports.escapeBraces = (string) => {
  if (!string.includes('[') || !string.includes(']')) {
    return string
  }
  return string.replace(/\[|\]/g, '\\$&')
}
