"use strict"

/**
 * _.sortedLastIndex
 *
 * @param {Array} array The sorted array to inspect.
 * @param {*} value The value to evaluate.
 * @returns {number} Returns the index at which `value` should be inserted
 *  into `array`.
 */
function sortedLastIndexForNum(array, value) {
    let low = 0
    let high = array == null ? low : array.length

    while (low < high) {
        const mid = (low + high) >>> 1
        const computed = array[mid]
        if (computed <= value) {
            low = mid + 1
        } else {
            high = mid
        }
    }
    return high
}

module.exports = class SourceCodeStore {
    /**
     * constructor
     * @param {string} code The source code.
     */
    constructor(code) {
        const lineStartIndices = [0]

        let match = undefined
        const lineEndingPattern = /\r\n|[\r\n\u2028\u2029]/gu
        while ((match = lineEndingPattern.exec(code))) {
            lineStartIndices.push(match.index + match[0].length)
        }

        this.text = code
        this._lineStartIndices = lineStartIndices
    }

    /**
     * Converts a source text index into a (line, column) pair.
     * @param {number} index The index of a character in a file
     * @returns {object} A {line, column} location object with a 0-indexed column
     */
    getLocFromIndex(index) {
        const code = this.text
        const lineStartIndices = this._lineStartIndices
        if (index === code.length) {
            return {
                line: lineStartIndices.length,
                column: index - lineStartIndices[lineStartIndices.length - 1],
            }
        }
        const lineNumber = sortedLastIndexForNum(lineStartIndices, index)

        return {
            line: lineNumber,
            column: index - lineStartIndices[lineNumber - 1],
        }
    }

    /**
     * Get a character string extracted only the template part from the whole source code.
     * @returns {string} The template.
     */
    get template() {
        return this._template
    }

    /**
     * Set a character string extracted only the template part from the whole source code.
     * @param  {string} template  The template
     * @returns {void}
     */
    set template(template) {
        this._template = template
    }

    /**
     * Get a character string extracted only the script part from the whole source code.
     * @returns {string} The script.
     */
    get script() {
        return this._script
    }

    /**
     * Set a character string extracted only the script part from the whole source code.
     * @param  {string} script  The script
     * @returns {void}
     */
    set script(script) {
        this._script = script
    }
}
