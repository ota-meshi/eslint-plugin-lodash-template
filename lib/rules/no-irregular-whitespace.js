"use strict"

const ALL_IRREGULARS =
    /[\v\f\u0085\u00a0\u1680\u180e\u2000-\u200b\u2028\u2029\u202f\u205f\u3000\ufeff]/u
const IRREGULAR_WHITESPACE =
    /[\v\f\u0085\u00a0\u1680\u180e\u2000-\u200b\u202f\u205f\u3000\ufeff]+/gu
const IRREGULAR_LINE_TERMINATORS = /[\u2028\u2029]/gu

module.exports = {
    meta: {
        docs: {
            description:
                "disallow irregular whitespace outside the template tags.",
            category: "recommended",
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/no-irregular-whitespace.html",
        },
        fixable: "whitespace",
        messages: {
            unexpected: "Irregular whitespace '\\u{{code}}' not allowed.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    skipComments: {
                        type: "boolean",
                    },
                    skipAttrValues: {
                        type: "boolean",
                    },
                    skipText: {
                        type: "boolean",
                    },
                },
                additionalProperties: false,
            },
        ],
        type: "problem",
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }
        const sourceCode = context.getSourceCode()
        if (!ALL_IRREGULARS.test(sourceCode.getText())) {
            return {}
        }

        const options = context.options[0] || {}
        const skipComments = Boolean(options.skipComments)
        const skipAttrValues = Boolean(options.skipAttrValues)
        const skipText = Boolean(options.skipText)

        const microTemplateService =
            context.parserServices.getMicroTemplateService()
        const templateTokens = microTemplateService.getMicroTemplateTokens()

        return {
            "Program:exit"(pgNode) {
                if (!skipComments && !skipAttrValues && !skipText) {
                    checkForIrregularWhitespace(pgNode, [])
                    return
                }

                microTemplateService.traverseDocumentNodes({
                    HTMLStartTag(node) {
                        const ignoreTokens = getStartTagIgnoreTokens(node)
                        checkForIrregularWhitespace(node, ignoreTokens)
                    },
                    HTMLEndTag(node) {
                        checkForIrregularWhitespace(node, [])
                    },
                    HTMLComment(node) {
                        if (skipComments) {
                            return
                        }
                        checkForIrregularWhitespace(node, [])
                    },
                    HTMLText(node) {
                        if (skipText) {
                            return
                        }
                        checkForIrregularWhitespace(node, [])
                    },
                })
            },
        }

        /**
         * Get the start tag ignore tokens array
         * @param  {HTMLStartTag} startTag The start tag
         * @returns {Array} Then tokens
         */
        function getStartTagIgnoreTokens(startTag) {
            if (!skipAttrValues) {
                return []
            }
            const tokens = []

            for (const attr of startTag.attributes) {
                tokens.push(attr.valueToken)
            }
            for (const attr of startTag.ignoredAttributes) {
                tokens.push(attr.valueToken)
            }

            return tokens.filter((t) => Boolean(t))
        }

        /**
         * Define the function which fixes the problem.
         * @param {number} index The index location start.
         * @returns {function} The defined function.
         */
        function defineWhitespaceFix(index) {
            return (fixer) => fixer.replaceTextRange([index, index + 1], " ")
        }

        /**
         * Define the function which fixes the problem.
         * @param {number} index The index location start.
         * @returns {function} The defined function.
         */
        function defineLineTerminatorsFix(index) {
            return (fixer) => fixer.replaceTextRange([index, index + 1], "\n")
        }

        /**
         * Checks the source for irregular whitespace
         * @param {ASTNode} node The tag node
         * @param {Token[]} ignoreTokens The ignore location tokens
         * @returns {void}
         */
        function checkForIrregularWhitespace(node, ignoreTokens) {
            const text = sourceCode.text.slice(node.range[0], node.range[1])
            let match = undefined

            /**
             * Check whether the index is in ignore location.
             * @param {number} index The index.
             * @returns {boolean} `true` if the index is in ignore location.
             */
            function isIgnoreLocation(index) {
                return (
                    ignoreTokens.find(
                        (t) => t.range[0] <= index && index < t.range[1],
                    ) ||
                    templateTokens.find(
                        (t) => t.range[0] <= index && index < t.range[1],
                    )
                )
            }

            while ((match = IRREGULAR_WHITESPACE.exec(text)) !== null) {
                const index = node.range[0] + match.index

                if (isIgnoreLocation(index)) {
                    continue
                }

                const code = `0000${sourceCode.text[index]
                    .charCodeAt(0)
                    .toString(16)}`
                    .slice(-4)
                    .toUpperCase()
                context.report({
                    loc: sourceCode.getLocFromIndex(index),
                    messageId: "unexpected",
                    data: { code },
                    fix: defineWhitespaceFix(index),
                })
            }

            while ((match = IRREGULAR_LINE_TERMINATORS.exec(text)) !== null) {
                const index = node.range[0] + match.index

                if (isIgnoreLocation(index)) {
                    continue
                }

                const code = `0000${sourceCode.text[index]
                    .charCodeAt(0)
                    .toString(16)}`
                    .slice(-4)
                    .toUpperCase()
                context.report({
                    loc: sourceCode.getLocFromIndex(index),
                    messageId: "unexpected",
                    data: { code },
                    fix: defineLineTerminatorsFix(index),
                })
            }
        }
    },
}
