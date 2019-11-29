// Utility functions for stripping datetime from strings

exports.validTime = (timeString) => {

    let validPattern = new RegExp("((\\d{1,2}h\s?)?(\\d{1,2}m\s?)?(\\d{1,2}s\\s?)?)", "g")
    return validPattern.test(timeString);
};