"use strict"

/**
 * Objects which have their location.
 */
class HasLocation {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {object} sourceCode  The source code.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCode) {
        this.range = [startIndex, endIndex]
        this.start = startIndex
        this.end = endIndex
        this.loc = {
            start: sourceCode.getLocFromIndex(startIndex),
            end: sourceCode.getLocFromIndex(endIndex),
        }
        this._text = sourceCode.text.slice(startIndex, endIndex)
    }

    /**
     * Get text of range.
     * @returns {string} The text of range.
     */
    getText() {
        return this._text
    }
}

module.exports.HasLocation = HasLocation
