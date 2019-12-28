// Utility functions for stripping datetime from strings

exports.validTime = (timeString) => {
    const regex = /((\d{1,2}h\s?)?(\d{1,2}m\s?)?(\d{1,2}s\s?)?)/g;
    let isNumeric = /^\d*$/.test(timeString)
    
    if(!isNumeric) { // if string contains non-numeric characters
        return timeString.match(regex);
    }
    return false;
};