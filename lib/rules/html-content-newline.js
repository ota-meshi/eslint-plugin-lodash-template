"use strict"

const utils = require("../utils")

/**
 * Check whether the given node is a multiline
 * @param {ASTNode} node The element node.
 * @param {object} contentFirstLoc The content first location.
 * @param {object} contentLastLoc The content last location.
 * @returns {boolean} `true` if the node is a multiline.
 */
function isMultiline(node, contentFirstLoc, contentLastLoc) {
    if (
        node.startTag.loc.start.line !== node.startTag.loc.end.line ||
        node.endTag.loc.start.line !== node.endTag.loc.end.line
    ) {
        // multiline tag
        return true
    }
    if (contentFirstLoc.line < contentLastLoc.line) {
        // multiline contents
        return true
    }
    return false
}

/**
 * Normalize options.
 * @param {object} options The options user configured.
 * @returns {object} The normalized options.
 */
function parseOptions(options) {
    return Object.assign(
        {
            singleline: "ignore",
            multiline: "always",
            ignoreNames: ["pre", "textarea"],
        },
        options,
    )
}

/**
 * Get the messageId for after closing bracket
 * @param  {number} expectedLineBreaks The number of expected line breaks
 * @param  {number} actualLineBreaks   The number of actual line breaks
 * @returns {string} The messageId
 */
function getMessageIdForClosingBracket(expectedLineBreaks, actualLineBreaks) {
    if (expectedLineBreaks === 0) {
        if (actualLineBreaks === 1) {
            return "unexpectedAfterClosingBracket"
        }
        return "expectedNoLineBreaksAfterClosingBracketButNLineBreaks"
    }
    if (actualLineBreaks === 0) {
        return "missingAfterClosingBracket"
    }
    return "expectedOneLineBreakAfterClosingBracketButNLineBreaks"
}

/**
 * Get the messageId for before opening bracket
 * @param  {number} expectedLineBreaks The number of expected line breaks
 * @param  {number} actualLineBreaks   The number of actual line breaks
 * @returns {string} The messageId
 */
function getMessageIdForOpeningBracket(expectedLineBreaks, actualLineBreaks) {
    if (expectedLineBreaks === 0) {
        if (actualLineBreaks === 1) {
            return "unexpectedBeforeOpeningBracket"
        }
        return "expectedNoLineBreaksBeforeOpeningBracketButNLineBreaks"
    }
    if (actualLineBreaks === 0) {
        return "missingBeforeOpeningBracket"
    }
    return "expectedOneLineBreakBeforeOpeningBracketButNLineBreaks"
}

module.exports = {
    meta: {
        docs: {
            description:
                "require or disallow a line break before and after HTML contents",
            category: "recommended-with-html",
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/html-content-newline.html",
        },
        fixable: "whitespace",
        messages: {
            unexpectedAfterClosingBracket:
                'Expected no line breaks after closing bracket of the "{{name}}" element, but 1 line break found.',
            expectedNoLineBreaksAfterClosingBracketButNLineBreaks:
                'Expected no line breaks after closing bracket of the "{{name}}" element, but {{n}} line breaks found.',
            missingAfterClosingBracket:
                'Expected 1 line break after closing bracket of the "{{name}}" element, but no line breaks found.',
            expectedOneLineBreakAfterClosingBracketButNLineBreaks:
                'Expected 1 line break after closing bracket of the "{{name}}" element, but {{n}} line breaks found.',
            unexpectedBeforeOpeningBracket:
                'Expected no line breaks before opening bracket of the "{{name}}" element, but 1 line break found.',
            expectedNoLineBreaksBeforeOpeningBracketButNLineBreaks:
                'Expected no line breaks before opening bracket of the "{{name}}" element, but {{n}} line breaks found.',
            missingBeforeOpeningBracket:
                'Expected 1 line break before opening bracket of the "{{name}}" element, but no line breaks found.',
            expectedOneLineBreakBeforeOpeningBracketButNLineBreaks:
                'Expected 1 line break before opening bracket of the "{{name}}" element, but {{n}} line breaks found.',
        },
        schema: [
            {
                type: "object",
                properties: {
                    singleline: { enum: ["ignore", "always", "never"] },
                    multiline: { enum: ["ignore", "always", "never"] },
                    ignoreNames: {
                        type: "array",
                        items: { type: "string" },
                        uniqueItems: true,
                        additionalItems: false,
                    },
                },
                additionalProperties: false,
            },
        ],
        type: "layout",
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }
        if (!utils.isHtmlFile(context.getFilename())) {
            return {}
        }

        const sourceCode = context.getSourceCode()
        const microTemplateService =
            context.parserServices.getMicroTemplateService()

        const options = parseOptions(context.options[0])

        /**
         * Check whether the given node is in ignore.
         * @param {ASTNode} node The element node.
         * @returns {boolean} `true` if the given node is in ignore.
         */
        function isIgnore(node) {
            let target = node
            while (target.type === "HTMLElement") {
                if (options.ignoreNames.indexOf(target.name) >= 0) {
                    // ignore element name
                    return true
                }
                target = target.parent
            }
            return false
        }

        /**
         * Get the contents locations.
         * @param {ASTNode} node The element node.
         * @returns {object} The contents locations.
         */
        function getContentLocations(node) {
            const contentStartIndex = node.startTag.range[1]
            const contentEndIndex = node.endTag.range[0]
            const contentText = sourceCode.text.slice(
                contentStartIndex,
                contentEndIndex,
            )
            const contentFirstIndex = (() => {
                const index = contentText.search(/\S/u)
                if (index >= 0) {
                    return index + contentStartIndex
                }
                return contentEndIndex
            })()
            const contentLastIndex = (() => {
                const index = contentText.search(/\S\s*$/gu)
                if (index >= 0) {
                    return index + contentStartIndex + 1
                }
                return contentStartIndex
            })()

            return {
                first: {
                    index: contentFirstIndex,
                    loc: sourceCode.getLocFromIndex(contentFirstIndex),
                },
                last: {
                    index: contentLastIndex,
                    loc: sourceCode.getLocFromIndex(contentLastIndex),
                },
            }
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLElement(node) {
                        if (
                            !node.startTag ||
                            node.startTag.selfClosing ||
                            !node.endTag
                        ) {
                            // self closing
                            return
                        }
                        if (isIgnore(node)) {
                            return
                        }

                        const contentsLocs = getContentLocations(node)

                        const type = isMultiline(
                            node,
                            contentsLocs.first.loc,
                            contentsLocs.last.loc,
                        )
                            ? options.multiline
                            : options.singleline
                        if (type === "ignore") {
                            // 'ignore' option
                            return
                        }
                        const beforeLineBreaks =
                            contentsLocs.first.loc.line -
                            node.startTag.loc.end.line
                        const afterLineBreaks =
                            node.endTag.loc.start.line -
                            contentsLocs.last.loc.line
                        const expectedLineBreaks = type === "always" ? 1 : 0
                        if (expectedLineBreaks !== beforeLineBreaks) {
                            context.report({
                                loc: {
                                    start: node.startTag.loc.end,
                                    end: contentsLocs.first.loc,
                                },
                                messageId: getMessageIdForClosingBracket(
                                    expectedLineBreaks,
                                    beforeLineBreaks,
                                ),
                                data: {
                                    name: node.name,
                                    n: beforeLineBreaks,
                                },
                                fix(fixer) {
                                    const range = [
                                        node.startTag.range[1],
                                        contentsLocs.first.index,
                                    ]
                                    const text = "\n".repeat(expectedLineBreaks)
                                    return fixer.replaceTextRange(range, text)
                                },
                            })
                        }

                        if (
                            node.startTag.range[1] === contentsLocs.last.index
                        ) {
                            return
                        }

                        if (expectedLineBreaks !== afterLineBreaks) {
                            context.report({
                                loc: {
                                    start: contentsLocs.last.loc,
                                    end: node.endTag.loc.start,
                                },
                                messageId: getMessageIdForOpeningBracket(
                                    expectedLineBreaks,
                                    afterLineBreaks,
                                ),
                                data: {
                                    name: node.name,
                                    n: afterLineBreaks,
                                },
                                fix(fixer) {
                                    const range = [
                                        contentsLocs.last.index,
                                        node.endTag.range[0],
                                    ]
                                    const text = "\n".repeat(expectedLineBreaks)
                                    return fixer.replaceTextRange(range, text)
                                },
                            })
                        }
                    },
                })
            },
        }
    },
}
