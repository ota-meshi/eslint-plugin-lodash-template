"use strict"

const embedInterpolations = require("./embed-interpolations")
const parseScript = require("../parse-script")
const { traverseNodes } = require("./traverse")
const ParseError = require("./parse-error")

module.exports = parseTemplateScript

/**
 * Parse the given branched template
 * @param {BranchedTemplate} branchedTemplate The branched template with script source code to parse.
 * @param {string} code The script source code to parse.
 * @param {object} parserOptions The parser options.
 * @param {MicroTemplateService} microTemplateService microTemplateService
 * @returns {object} The parsing result.
 */
function parseTemplateScript(
    { template, stripedRanges },
    code,
    parserOptions,
    microTemplateService
) {
    const { locationCalculator, code: scriptCode } = embedInterpolations(
        template,
        code,
        microTemplateService,
        stripedRanges
    )
    try {
        const result = parseScript(scriptCode, parserOptions)
        postprocess(result, locationCalculator)
        return result
    } catch (err) {
        const perr = ParseError.normalize(err)
        if (perr) {
            locationCalculator.fixErrorLocation(perr)

            const emptyResult = parseScript(
                scriptCode.replace(/[^ \r\n\t\f\u2028\u2029]/gu, " "),
                parserOptions
            )

            emptyResult.services = Object.assign(emptyResult.services || {}, {
                getMicroTemplateScriptParseError() {
                    return perr
                },
            })
            return emptyResult
        }
        throw err
    }
}

/**
 * Do post-process of parsing an expression.
 *
 * 1. Set `node.parent`.
 * 2. Fix `node.range` and `node.loc` for HTML entities.
 *
 * @param result The parsing result to modify.
 * @param locationCalculator The location calculator to modify.
 */
function postprocess(result, locationCalculator) {
    // There are cases which the same node instance appears twice in the tree.
    // E.g. `let {a} = {}` // This `a` appears twice at `Property#key` and `Property#value`.
    const traversed = new Set()

    traverseNodes(result.ast, {
        visitorKeys: result.visitorKeys,

        enterNode(node, parent) {
            if (!traversed.has(node)) {
                traversed.add(node)
                node.parent = parent

                // `babel-eslint@8` has shared `Node#range` with multiple nodes.
                // See also: https://github.com/vuejs/eslint-plugin-vue/issues/208
                if (!traversed.has(node.range)) {
                    traversed.add(node.range)
                    locationCalculator.fixLocation(node)
                }
            }
        },

        leaveNode() {
            // Do nothing.
        },
    })

    for (const token of result.ast.tokens || []) {
        locationCalculator.fixLocation(token)
    }
    for (const comment of result.ast.comments || []) {
        locationCalculator.fixLocation(comment)
    }
}
