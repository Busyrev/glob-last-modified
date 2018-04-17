let fs = require('fs');
let glob = require('glob');

/**
 * Walks through specified glob pattert or array of patterns and returns last change date of all matched files or directories. Tecnically it is the newest modified or created date of all items in pecified glob pattern
 * @param {string|Array.<string>} pattern - glob pattern
 * @param {string|Array.<string>} exclude - glob pattern to exclude files
 * @return {number} - fractional number of unix timestamp in MILLISECONDS, 0 if no files matched
 */
module.exports = function recursiveLastModified(pattern, exclude) {
    let paths = glob.sync(pattern, {ignore:exclude});
    let latestModifiedDate = 0;
    
    for (let candidate of paths) {
        let stats = fs.statSync(candidate);
        latestModifiedDate = Math.max(latestModifiedDate, stats.mtimeMs, stats.ctimeMs, stats.birthtimeMs);
    }
    
    return latestModifiedDate;
}