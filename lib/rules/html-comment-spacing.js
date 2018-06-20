"use strict"

/**
 * Get phrase of spaces.
 * @param {number} spaces The number of spaces
 * @returns {string} The phrase
 */
function getPhrase(spaces) {
    switch (spaces) {
        case 0:
            return "no spaces"
        case 1:
            return "1 space"
        default:
            return `${spaces} spaces`
    }
}

module.exports = {
    meta: {
        docs: {
            description:
                "enforce unified spacing in HTML comment. (ex. :ok: `<!-- comment -->`, :ng: `<!--comment-->`)",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.8.0/docs/rules/html-comment-spacing.md",
        },
        fixable: "whitespace",
        schema: [
            {
                enum: ["always", "never"],
            },
        ],
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }

        const sourceCode = context.getSourceCode()
        const microTemplateService = context.parserServices.getMicroTemplateService()

        const options = context.options[0] || "always"

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
                        const commentOpen = node.commentOpen
                        const commentClose = node.commentClose
                        if (!commentOpen || !commentClose) {
                            return
                        }

                        const commentLocs = getCommentLocatuons(node)

                        const content = sourceCode.text.slice(
                            commentLocs.first.index,
                            commentLocs.last.index
                        )

                        if (!content.trim()) {
                            return
                        }

                        const actualOpenSpaces =
                            commentLocs.first.index - commentOpen.range[1]
                        const actualCloseSpaces =
                            commentClose.range[0] - commentLocs.last.index
                        const expectedSpaces = options === "always" ? 1 : 0

                        if (
                            expectedSpaces !== actualOpenSpaces &&
                            commentOpen.loc.end.line ===
                                commentLocs.first.loc.line
                        ) {
                            context.report({
                                node: commentOpen,
                                message:
                                    "Expected {{expected}} after '<!--', but {{actual}} found.",
                                data: {
                                    expected: getPhrase(expectedSpaces),
                                    actual: getPhrase(actualOpenSpaces),
                                },
                                fix(fixer) {
                                    const range = [
                                        commentOpen.range[1],
                                        commentLocs.first.index,
                                    ]
                                    const text = " ".repeat(expectedSpaces)
                                    return fixer.replaceTextRange(range, text)
                                },
                            })
                        }

                        if (
                            expectedSpaces !== actualCloseSpaces &&
                            commentLocs.last.loc.line ===
                                commentClose.loc.start.line
                        ) {
                            context.report({
                                node: commentClose,
                                message:
                                    "Expected {{expected}} before '-->', but {{actual}} found.",
                                data: {
                                    expected: getPhrase(expectedSpaces),
                                    actual: getPhrase(actualCloseSpaces),
                                },
                                fix(fixer) {
                                    const range = [
                                        commentLocs.last.index,
                                        commentClose.range[0],
                                    ]
                                    const text = " ".repeat(expectedSpaces)
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
