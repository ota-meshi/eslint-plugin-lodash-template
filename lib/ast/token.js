"use strict";

const HasLocation = require("./locations").HasLocation;
/**
 * The token
 */
class Token extends HasLocation {
    /**
     * constructor.
     * @param  {string} type The token type.
     * @param  {number} startIndex The start index of range.
     * @param  {number} endIndex  The end index of range.
     * @param  {SourceCodeStore} sourceCodeStore The sourceCodeStore.
     * @param  {object} optProps  The optional property.
     * @returns {void}
     */
    constructor(type, startIndex, endIndex, sourceCodeStore, optProps) {
        super(startIndex, endIndex, sourceCodeStore);
        this.type = type;
        this.parent = optProps && optProps.parent;
        this.value = this.getText();
    }
}

module.exports = Token;
