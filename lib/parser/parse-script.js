"use strict"

module.exports = parseScript

/**
 * Parse the given script source code.
 * @param {string} code The script source code to parse.
 * @param {object} parserOptions The parser options.
 * @returns {object} The parsing result.
 */
function parseScript(code, parserOptions) {
    const parser =
        parserOptions.parser === "espree" || !parserOptions.parser
            ? require("espree") // eslint-disable-line @mysticatea/node/no-extraneous-require
            : require(parserOptions.parser)
    const parserOptionsWithoutParser = Object.assign({}, parserOptions)
    delete parserOptionsWithoutParser.parser
    const scriptParserOptions = Object.assign(
        {},
        parserOptionsWithoutParser,
        parserOptions.parserOptions
    )
    const result =
        typeof parser.parseForESLint === "function"
            ? parser.parseForESLint(code, scriptParserOptions)
            : parser.parse(code, scriptParserOptions)
    if (result.ast) {
        return result
    }
    return {
        ast: result,
    }
}
