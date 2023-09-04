"use strict";

/**
 * Check whether the given value has acorn style location information.
 * @param x The value to check.
 * @returns `true` if the value has acorn style location information.
 */
function isAcornStyleParseError(x) {
    return (
        typeof x.message === "string" &&
        typeof x.pos === "number" &&
        typeof x.loc === "object" &&
        x.loc !== null &&
        typeof x.loc.line === "number" &&
        typeof x.loc.column === "number"
    );
}

/**
 * Parse errors.
 */
module.exports = class ParseError extends SyntaxError {
    /**
     * Create new parser error object.
     * @param code The error code. See also: https://html.spec.whatwg.org/multipage/parsing.html#parse-errors
     * @param offset The offset number of this error.
     * @param line The line number of this error.
     * @param column The column number of this error.
     */
    static fromCode(code, offset, line, column) {
        return new ParseError(code, code, offset, line, column);
    }

    /**
     * Normalize the error object.
     * @param x The error object to normalize.
     */
    static normalize(x) {
        if (ParseError.isParseError(x)) {
            return x;
        }
        if (isAcornStyleParseError(x)) {
            return new ParseError(
                x.message,
                undefined,
                x.pos,
                x.loc.line,
                x.loc.column,
            );
        }
        return null;
    }

    /**
     * Initialize this ParseError instance.
     * @param message The error message.
     * @param code The error code. See also: https://html.spec.whatwg.org/multipage/parsing.html#parse-errors
     * @param offset The offset number of this error.
     * @param line The line number of this error.
     * @param column The column number of this error.
     */
    constructor(message, code, offset, line, column) {
        super(message);
        this.code = code;
        this.index = offset;
        this.lineNumber = line;
        this.column = column;
    }

    /**
     * Type guard for ParseError.
     * @param x The value to check.
     * @returns `true` if the value has `message`, `pos`, `loc` properties.
     */
    static isParseError(x) {
        return (
            x instanceof ParseError ||
            (typeof x.message === "string" &&
                typeof x.index === "number" &&
                typeof x.lineNumber === "number" &&
                typeof x.column === "number")
        );
    }
};
