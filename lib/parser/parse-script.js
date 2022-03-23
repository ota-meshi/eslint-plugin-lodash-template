"use strict"

const path = require("path")
const { createRequire } = require("./create-require")

module.exports = parseScript

/**
 * Parse the given script source code.
 * @param {string} code The script source code to parse.
 * @param {object} parserOptions The parser options.
 * @returns {object} The parsing result.
 */
function parseScript(code, parserOptions) {
    const parser = loadParser(parserOptions.parser)
    const parserOptionsWithoutParser = Object.assign({}, parserOptions)
    delete parserOptionsWithoutParser.parser
    const scriptParserOptions = Object.assign(
        {},
        parserOptionsWithoutParser,
        parserOptions.parserOptions,
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

/** Load parser */
function loadParser(parser) {
    if (parser && parser !== "espree") {
        try {
            const cwd = process.cwd()
            const relativeTo = path.join(cwd, "__placeholder__.js")
            return createRequire(relativeTo)(parser)
        } catch (_e) {
            return require(parser)
        }
    }
    // eslint-disable-next-line node/no-unpublished-require -- default
    return require("espree")
}
