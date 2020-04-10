"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                "disallow multiple spaces in scriptlet. (ex. :ng: `<% if···(test)···{ %>`)",
            category: "recommended",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.15.0/docs/rules/no-multi-spaces-in-scriptlet.md",
        },
        fixable: "whitespace",
        messages: {
            unexpected: "Multiple spaces found before `{{displayValue}}`.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    exceptions: {
                        type: "object",
                        patternProperties: {
                            "^([A-Z][a-z]*)+$": {
                                type: "boolean",
                            },
                        },
                        additionalProperties: false,
                    },
                    ignoreEOLComments: {
                        type: "boolean",
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

        const sourceCode = context.getSourceCode()

        const options = context.options[0] || {}
        const ignoreEOLComments = options.ignoreEOLComments
        const exceptions = Object.assign({ Property: true }, options.exceptions)
        const hasExceptions =
            Object.keys(exceptions).filter((key) => exceptions[key]).length > 0

        const microTemplateService = context.parserServices.getMicroTemplateService()

        /**
         * Formats value of given comment token for error message by truncating its length.
         * @param {Token} token comment token
         * @returns {string} formatted value
         * @private
         */
        function formatReportedCommentValue(token) {
            const valueLines = token.value.split("\n")
            const value = valueLines[0]
            const formattedValue = `${value.slice(0, 12)}...`

            return valueLines.length === 1 && value.length <= 12
                ? value
                : formattedValue
        }

        /**
         * Get the template tag token containing a script.
         * @param {Token} token The script token.
         * @returns {Token} The token if found or null if not found.
         */
        function getTemplateTagByToken(token) {
            return microTemplateService
                .getMicroTemplateTokens()
                .find(
                    (t) =>
                        t.expressionStart.range[1] <= token.range[0] &&
                        token.range[0] < t.expressionEnd.range[0]
                )
        }

        /**
         * Checks if the given token is a comment token or not.
         *
         * @param {Token} token - The token to check.
         * @returns {boolean} `true` if the token is a comment token.
         */
        function isCommentToken(token) {
            return (
                token.type === "Line" ||
                token.type === "Block" ||
                token.type === "Shebang"
            )
        }

        /**
         * Checks if the given token is ignore or not.
         *
         * @param {Token} leftToken - The token to check.
         * @param {number} leftIndex - The index of left token.
         * @param {Token} rightToken - The token to check.
         * @returns {boolean} `true` if the token is ignore.
         */
        function isIgnores(leftToken, leftIndex, rightToken) {
            const tokensAndComments = sourceCode.tokensAndComments
            const leftTemplateTag = getTemplateTagByToken(leftToken)
            const rightTemplateTag = getTemplateTagByToken(rightToken)
            if (!leftTemplateTag || !rightTemplateTag) {
                return true
            }

            // Ignore if token is the first token of the template tag script
            if (
                !sourceCode.text
                    .slice(
                        rightTemplateTag.expressionStart.range[1],
                        rightToken.range[0]
                    )
                    .trim()
            ) {
                return true
            }

            // Ignore comments that are the last token on their line if `ignoreEOLComments` is active.
            if (
                ignoreEOLComments &&
                isCommentToken(rightToken) &&
                (leftIndex === tokensAndComments.length - 2 ||
                    rightToken.loc.end.line <
                        tokensAndComments[leftIndex + 2].loc.start.line)
            ) {
                return true
            }

            // Ignore tokens that are in a node in the "exceptions" object
            if (hasExceptions) {
                const parentNode = sourceCode.getNodeByRangeIndex(
                    rightToken.range[0] - 1
                )

                if (parentNode && exceptions[parentNode.type]) {
                    return true
                }
            }
            return false
        }

        return {
            "Program:exit"() {
                sourceCode.tokensAndComments.forEach(
                    (leftToken, leftIndex, tokensAndComments) => {
                        if (leftIndex === tokensAndComments.length - 1) {
                            return
                        }
                        const rightToken = tokensAndComments[leftIndex + 1]

                        // Ignore tokens that don't have 2 spaces between them or are on different lines
                        if (
                            !sourceCode.text
                                .slice(leftToken.range[1], rightToken.range[0])
                                .includes("  ") ||
                            leftToken.loc.end.line < rightToken.loc.start.line
                        ) {
                            return
                        }

                        if (isIgnores(leftToken, leftIndex, rightToken)) {
                            return
                        }

                        let displayValue = undefined

                        if (rightToken.type === "Block") {
                            displayValue = `/*${formatReportedCommentValue(
                                rightToken
                            )}*/`
                        } else if (rightToken.type === "Line") {
                            displayValue = `//${formatReportedCommentValue(
                                rightToken
                            )}`
                        } else {
                            displayValue = rightToken.value
                        }

                        context.report({
                            node: rightToken,
                            loc: {
                                start: leftToken.loc.end,
                                end: rightToken.loc.start,
                            },
                            messageId: "unexpected",
                            data: { displayValue },
                            fix: (fixer) =>
                                fixer.replaceTextRange(
                                    [leftToken.range[1], rightToken.range[0]],
                                    " "
                                ),
                        })
                    }
                )
            },
        }
    },
}
