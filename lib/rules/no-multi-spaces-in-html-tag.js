"use strict"

const utils = require("../utils")

module.exports = {
    meta: {
        docs: {
            description:
                'disallow multiple spaces in HTML tags. (ex. :ng: `<input···type="text">`)',
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.17.0/docs/rules/no-multi-spaces-in-html-tag.md",
        },
        fixable: "whitespace",
        messages: {
            unexpected: "Multiple spaces found before `{{displayValue}}`.",
        },
        schema: [],
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
        const microTemplateService = context.parserServices.getMicroTemplateService()

        /**
         * Convert start tag to Tokens array
         * @param  {HTMLStartTag} startTag The start tag
         * @returns {Array} Then tokens
         */
        function startTagToTokens(startTag) {
            const tokens = [startTag.tagOpen]

            for (const attr of startTag.attributes) {
                tokens.push(attr)
            }

            tokens.push(startTag.tagClose)

            return tokens
                .filter((t) => Boolean(t))
                .sort((a, b) => a.range[0] - b.range[0])
        }

        /**
         * Convert end tag to Tokens array
         * @param  {HTMLEndTag} endTag The end tag
         * @returns {Array} Then tokens
         */
        function endTagToTokens(endTag) {
            const tokens = [endTag.tagOpen, endTag.tagClose]

            return tokens
                .filter((t) => Boolean(t))
                .sort((a, b) => a.range[0] - b.range[0])
        }

        /**
         * Define the function which fixes the problem.
         * @param {number} start The spaces location start.
         * @param {number} end The spaces location end.
         * @returns {function} The defined function.
         */
        function defineFix(start, end) {
            return (fixer) => fixer.replaceTextRange([start, end], " ")
        }

        /**
         * Get the location intersection in template tags.
         * @param {number} start The location start.
         * @param {number} end The location end.
         * @returns {Array} the location intersection in template tags.
         */
        function getIntersectionTemplateTags(start, end) {
            return microTemplateService
                .getMicroTemplateTokens()
                .filter(
                    (token) =>
                        Math.max(start, token.range[0]) <=
                        Math.min(end, token.range[1])
                )
                .sort((a, b) => a.range[0] - b.range[0])
        }

        /**
         * Generate target tokens iterator
         * @param {Array} tokens The html tokens
         * @returns {object} The tokens data
         */
        function* genTargetTokens(tokens) {
            let prevToken = tokens.shift()
            for (const token of tokens) {
                const start = prevToken.range[1]
                const end = token.range[0]
                const tags = getIntersectionTemplateTags(start, end)
                for (const tag of tags) {
                    yield {
                        prevToken,
                        token: tag,
                    }
                    prevToken = tag
                }
                yield {
                    prevToken,
                    token,
                }
                prevToken = token
            }
        }

        /**
         * Process tokens.
         * @param {Array} tokens The tokens.
         * @returns {void}
         */
        function processTokens(tokens) {
            for (const tokenInfo of genTargetTokens(tokens)) {
                const prevToken = tokenInfo.prevToken
                const token = tokenInfo.token

                const start = prevToken.range[1]
                const end = token.range[0]
                const spaces = end - start
                if (
                    spaces > 1 &&
                    token.loc.start.line === prevToken.loc.start.line &&
                    !sourceCode.text.slice(start, end).trim()
                ) {
                    context.report({
                        node: token,
                        loc: {
                            start: prevToken.loc.end,
                            end: token.loc.start,
                        },
                        messageId: "unexpected",
                        fix: defineFix(start, end),
                        data: {
                            displayValue: formatReportedHTMLToken(token),
                        },
                    })
                }
            }
        }

        /**
         * Formats value of given token for error message by first line.
         * @param {Token} token The token
         * @returns {string} formatted value
         * @private
         */
        function formatReportedHTMLToken(token) {
            const valueLines = sourceCode.getText(token).split("\n")
            const value = valueLines[0]
            return value
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLStartTag(node) {
                        const tokens = startTagToTokens(node)
                        processTokens(tokens)
                    },
                    HTMLEndTag(node) {
                        const tokens = endTagToTokens(node)
                        processTokens(tokens)
                    },
                })
            },
        }
    },
}
