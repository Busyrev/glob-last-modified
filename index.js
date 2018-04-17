let fs = require('fs');
let glob = require('glob');


module.exports = {
    lastModified,
    getModifiedSince
}

/**
 * Walks through specified glob pattert or array of patterns and returns last change date of all matched files or directories. Tecnically it is the newest modified or created date of all items in pecified glob pattern
 * @param {string|Array.<string>} pattern - glob pattern or array of patterns
 * @param {string|Array.<string>} exclude - glob pattern or array of patterns to exclude files
 * @return {number} - fractional number of unix timestamp in MILLISECONDS, 0 if no files matched
 */
function lastModified(pattern, exclude) {
    if (!Array.isArray(pattern)) {
        pattern = [pattern];
    }
    let latestModifiedDate = 0;
    
    for (let patternItem of pattern) {
        let paths = glob.sync(patternItem, {ignore:exclude});
        
        for (let candidate of paths) {
            let stats = fs.statSync(candidate);
            latestModifiedDate = Math.max(latestModifiedDate, stats.mtimeMs, stats.ctimeMs, stats.birthtimeMs);
        }
    }
    
    return latestModifiedDate;
}

/**
 * Walks through specified glob pattert or array of patterns and returns files or directories that modified since specified date.
 * @param {number} since - unix timestamp in milliseconds
 * @param {string|Array.<string>} pattern - glob pattern or array of patterns
 * @param {string|Array.<string>} exclude - glob pattern or array of patterns to exclude files
 * @return {number} - fractional number of unix timestamp in MILLISECONDS, 0 if no files matched
 */
function getModifiedSince(since, pattern, exclude) {
    if (!Array.isArray(pattern)) {
        pattern = [pattern];
    }
    let modified = [];
    
    for (let patternItem of pattern) {
        let paths = glob.sync(patternItem, {ignore:exclude});
        
        for (let candidate of paths) {
            let stats = fs.statSync(candidate);
            let latestModifiedDate = Math.max(stats.mtimeMs, stats.ctimeMs, stats.birthtimeMs);
            if (latestModifiedDate > since) {
                modified.push(candidate);
            }
        }
    }
    
    return modified;
}