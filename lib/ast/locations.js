"use strict"

/**
 * Objects which have their location.
 */
class HasLocation {
    /**
     * constructor.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @returns {void}
     */
    constructor(startIndex, endIndex, sourceCodeStore) {
        this.range = [startIndex, endIndex]
        this.start = startIndex
        this.end = endIndex
        this._sourceCodeStore = sourceCodeStore
        this._loc = {
            start: sourceCodeStore.getLocFromIndex(startIndex),
            end: sourceCodeStore.getLocFromIndex(endIndex),
        }
    }

    /**
     * Get the source code store
     * @returns {SourceCodeStore} source code store
     */
    get sourceCodeStore() {
        return this._sourceCodeStore
    }

    /**
     * Get the location info
     * @returns {object} The location info
     */
    get loc() {
        return this._loc
    }

    /**
     * Get text of range.
     * @returns {string} The text of range.
     */
    getText() {
        return this.sourceCodeStore.text.slice(this.range[0], this.range[1])
    }
}

module.exports.HasLocation = HasLocation
