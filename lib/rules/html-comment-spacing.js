"use strict"

/**
 * Get the messageId for before tag open
 * @param  {number} expectedSpaces The number of expected spaces
 * @param  {number} actualSpaces   The number of actual spaces
 * @returns {string} The messageId
 */
function getMessageIdForTagOpen(expectedSpaces, actualSpaces) {
    if (expectedSpaces === 0) {
        if (actualSpaces === 1) {
            return "unexpectedAfterTagOpen"
        }
        return "expectedNoSpacesAfterTagOpenButNSpaces"
    }
    if (actualSpaces === 0) {
        return "missingAfterTagOpen"
    }
    return "expectedOneSpaceAfterTagOpenButNSpaces"
}

/**
 * Get the messageId for after tag close
 * @param  {number} expectedSpaces The number of expected spaces
 * @param  {number} actualSpaces   The number of actual spaces
 * @returns {string} The messageId
 */
function getMessageIdForTagClose(expectedSpaces, actualSpaces) {
    if (expectedSpaces === 0) {
        if (actualSpaces === 1) {
            return "unexpectedBeforeTagClose"
        }
        return "expectedNoSpacesBeforeTagCloseButNSpaces"
    }
    if (actualSpaces === 0) {
        return "missingBeforeTagClose"
    }
    return "expectedOneSpaceBeforeTagCloseButNSpaces"
}

module.exports = {
    meta: {
        docs: {
            description:
                "enforce unified spacing in HTML comment. (ex. :ok: `<!-- comment -->`, :ng: `<!--comment-->`)",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.12.0/docs/rules/html-comment-spacing.md",
        },
        fixable: "whitespace",
        type: "layout",
        schema: [
            {
                enum: ["always", "never"],
            },
        ],
        messages: {
            unexpectedAfterTagOpen:
                "Expected no spaces after `<!--`, but 1 space found.",
            expectedNoSpacesAfterTagOpenButNSpaces:
                "Expected no spaces after `<!--`, but {{n}} spaces found.",
            missingAfterTagOpen:
                "Expected 1 space after `<!--`, but no spaces found.",
            expectedOneSpaceAfterTagOpenButNSpaces:
                "Expected 1 space after `<!--`, but {{n}} spaces found.",
            unexpectedBeforeTagClose:
                "Expected no spaces before `-->`, but 1 space found.",
            expectedNoSpacesBeforeTagCloseButNSpaces:
                "Expected no spaces before `-->`, but {{n}} spaces found.",
            missingBeforeTagClose:
                "Expected 1 space before `-->`, but no spaces found.",
            expectedOneSpaceBeforeTagCloseButNSpaces:
                "Expected 1 space before `-->`, but {{n}} spaces found.",
        },
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
            const contentStartIndex = node.commentOpen.range[1]
            const contentEndIndex = node.commentClose.range[0]
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
                                messageId: getMessageIdForTagOpen(
                                    expectedSpaces,
                                    actualOpenSpaces
                                ),
                                data: {
                                    n: actualOpenSpaces,
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
                                messageId: getMessageIdForTagClose(
                                    expectedSpaces,
                                    actualCloseSpaces
                                ),
                                data: {
                                    n: actualCloseSpaces,
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
