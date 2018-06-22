"use strict"

/**
 * Check whether the given node is a multiline
 * @param {object} contentFirstLoc The comment content first location.
 * @param {object} contentLastLoc The comment content last location.
 * @returns {boolean} `true` if the node is a multiline.
 */
function isMultiline(contentFirstLoc, contentLastLoc) {
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
            singleline: "never",
            multiline: "always",
        },
        options
    )
}

/**
 * Get the message phrase
 * @param  {number} lineBreaks The number of line breaks
 * @returns {string} The message phrase
 */
function getPhrase(lineBreaks) {
    switch (lineBreaks) {
        case 0:
            return "no line breaks"
        case 1:
            return "1 line break"
        default:
            return `${lineBreaks} line breaks`
    }
}

module.exports = {
    meta: {
        docs: {
            description:
                "require or disallow a line break before and after HTML comment contents",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.8.2/docs/rules/html-comment-content-newline.md",
        },
        fixable: "whitespace",
        schema: [
            {
                type: "object",
                properties: {
                    singleline: { enum: ["ignore", "always", "never"] },
                    multiline: { enum: ["ignore", "always", "never"] },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }

        const sourceCode = context.getSourceCode()
        const microTemplateService = context.parserServices.getMicroTemplateService()

        const options = parseOptions(context.options[0])

        /**
         * Get the comments locations.
         * @param {ASTNode} node The HTML comment.
         * @returns {object} The comments locations.
         */
        function getCommentLocatuons(node) {
            const contentStartIndex = node.commentOpen
                ? node.commentOpen.range[1]
                : node.range[0]
            const contentEndIndex = node.commentClose
                ? node.commentClose.range[0]
                : node.range[1]
            const contentText = sourceCode.text.slice(
                contentStartIndex,
                contentEndIndex
            )
            const contentFirstIndex = (() => {
                const index = contentText.search(/\S/)
                if (index >= 0) {
                    return index + contentStartIndex
                }
                return contentEndIndex
            })()
            const contentLastIndex = (() => {
                const index = contentText.search(/\S\s*$/g)
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
                    HTMLComment(node) {
                        const commentLocs = getCommentLocatuons(node)

                        const type = isMultiline(
                            commentLocs.first.loc,
                            commentLocs.last.loc
                        )
                            ? options.multiline
                            : options.singleline
                        if (type === "ignore") {
                            // 'ignore' option
                            return
                        }
                        const beforeLineBreaks =
                            commentLocs.first.loc.line -
                            node.commentOpen.loc.end.line
                        const afterLineBreaks =
                            node.commentClose.loc.start.line -
                            commentLocs.last.loc.line
                        const expectedLineBreaks = type === "always" ? 1 : 0
                        if (expectedLineBreaks !== beforeLineBreaks) {
                            context.report({
                                loc: {
                                    start: node.commentOpen.loc.end,
                                    end: commentLocs.first.loc,
                                },
                                message:
                                    "Expected {{expected}} after `<!--`, but {{actual}} found.",
                                data: {
                                    expected: getPhrase(expectedLineBreaks),
                                    actual: getPhrase(beforeLineBreaks),
                                },
                                fix(fixer) {
                                    const range = [
                                        node.commentOpen.range[1],
                                        commentLocs.first.index,
                                    ]
                                    const text = "\n".repeat(expectedLineBreaks)
                                    return fixer.replaceTextRange(range, text)
                                },
                            })
                        }

                        if (expectedLineBreaks !== afterLineBreaks) {
                            context.report({
                                loc: {
                                    start: commentLocs.last.loc,
                                    end: node.commentClose.loc.start,
                                },
                                message:
                                    "Expected {{expected}} before `-->`, but {{actual}} found.",
                                data: {
                                    expected: getPhrase(expectedLineBreaks),
                                    actual: getPhrase(afterLineBreaks),
                                },
                                fix(fixer) {
                                    const range = [
                                        commentLocs.last.index,
                                        node.commentClose.range[0],
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
