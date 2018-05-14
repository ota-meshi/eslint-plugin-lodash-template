"use strict"

/**
 * Normalize options.
 * @param {number|string|undefined} type The type of indentation.
 * @param {object} options Other options.
 * @returns {object} Normalized options.
 */
function parseOptions(type, options) {
    const ret = {
        indentChar: " ",
        indentSize: 2,
        attribute: 1,
        closeBracket: 0,
    }

    if (Number.isSafeInteger(type)) {
        ret.indentSize = type
    } else if (type === "tab") {
        ret.indentChar = "\t"
        ret.indentSize = 1
    }
    if (Number.isSafeInteger(options.attribute)) {
        ret.attribute = options.attribute
    }
    if (Number.isSafeInteger(options.closeBracket)) {
        ret.closeBracket = options.closeBracket
    }

    return ret
}

module.exports = {
    meta: {
        docs: {
            description: "enforce consistent HTML indentation",
            category: "recommended",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.0.4/docs/rules/html-indent.md",
        },
        fixable: "whitespace",
        schema: [
            {
                anyOf: [{ type: "integer", minimum: 1 }, { enum: ["tab"] }],
            },
            {
                type: "object",
                properties: {
                    attribute: { type: "integer", minimum: 0 },
                    closeBracket: { type: "integer", minimum: 0 },
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

        const options = parseOptions(
            context.options[0],
            context.options[1] || {}
        )
        const unit = options.indentChar === "\t" ? "tab" : "space"

        /**
         * Get number of indentation of the given indentText.
         * @param {string} indentText The indent text.
         * @returns {number} Number of indentation.
         */
        function getNumberOfIndent(indentText) {
            let indent = 0
            let wkIndentText = ""
            while (wkIndentText !== indentText) {
                indent++
                wkIndentText += options.indentChar
                if (wkIndentText.length > indentText.length) {
                    return NaN
                }
            }

            return indent
        }

        /**
         * Calculate correct indentation of the line of the given offset and baseToken.
         * @param {number} offset The offset of the tokens.
         * @param {Token} baseToken The token of the base offset.
         * @returns {number} Correct indentation. If it failed to calculate then `Number.MAX_SAFE_INTEGER`.
         */
        function getExpectedIndent(offset, baseToken) {
            const baseIndentText = getIndentText(baseToken)
            const baseIndent = getNumberOfIndent(baseIndentText)

            return baseIndent + offset
        }

        /**
         * Get the text of the before part of the line which the given token is on.
         * @param {Token} token The token.
         * @returns {string} The text of before part.
         */
        function getBeforeTextInLine(token) {
            const line = token.loc.line
            const startIndex = sourceCode.getIndexFromLoc({ line, column: 1 })
            const text = sourceCode.text

            return text.slice(startIndex, token.range[0])
        }

        /**
         * Get the text of the indentation part of the line which the given token is on.
         * @param {Token} token The token.
         * @returns {string} The text of indentation part.
         */
        function getIndentText(token) {
            const before = getBeforeTextInLine(token)
            for (let i = 0; i < before.length; i++) {
                if (before[i].trim()) {
                    return before.slice(0, i)
                }
            }
            return before
        }

        /**
         * Validate offset to the given tokens.
         * @param {Token|Token[]} token The token to set.
         * @param {number} offset The offset of the tokens.
         * @param {Token} baseToken The token of the base offset.
         * @returns {void}
         */
        function validateOffset(token, offset, baseToken) {
            if (Array.isArray(token)) {
                for (const t of token) {
                    validateOffset(t, offset, baseToken)
                }
                return
            }
            if (baseToken.loc.start.line >= token.loc.start.line) {
                return
            }
            const actualText = getBeforeTextInLine(token)
            if (actualText.trim()) {
                return
            }
            const line = token.loc.start.line

            for (let i = 0; i < actualText.length; ++i) {
                if (actualText[i] !== options.indentChar) {
                    context.report({
                        loc: {
                            start: { line, column: i },
                            end: { line, column: i + 1 },
                        },
                        message:
                            "Expected {{expected}} character, but found {{actual}} character.",
                        data: {
                            expected: JSON.stringify(options.indentChar),
                            actual: JSON.stringify(actualText[i]),
                        },
                        fix(fixer) {
                            const expectedIndent = getExpectedIndent(
                                offset,
                                baseToken
                            )
                            if (isNaN(expectedIndent)) {
                                return undefined
                            }
                            const range = [
                                token.range[0] - actualText.length,
                                token.range[0],
                            ]
                            const indent = options.indentChar.repeat(
                                expectedIndent
                            )
                            return fixer.replaceTextRange(range, indent)
                        },
                    })
                    return
                }
            }
            const expectedIndent = getExpectedIndent(offset, baseToken)
            if (isNaN(expectedIndent)) {
                return
            }

            const actualIndent = getNumberOfIndent(actualText)
            if (actualIndent !== expectedIndent) {
                context.report({
                    loc: {
                        start: { line, column: 0 },
                        end: { line, column: actualIndent },
                    },
                    message:
                        "Expected indentation of {{expectedIndent}} {{unit}}{{expectedIndentPlural}} but found {{actualIndent}} {{unit}}{{actualIndentPlural}}.",
                    data: {
                        expectedIndent,
                        actualIndent,
                        unit,
                        expectedIndentPlural: expectedIndent === 1 ? "" : "s",
                        actualIndentPlural: actualIndent === 1 ? "" : "s",
                    },
                    fix(fixer) {
                        const range = [
                            token.range[0] - actualText.length,
                            token.range[0],
                        ]
                        const indent = options.indentChar.repeat(expectedIndent)
                        return fixer.replaceTextRange(range, indent)
                    },
                })
            }
        }

        const microTemplateService = context.parserServices.getMicroTemplateService()

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLElement(node) {
                        if (node.name !== "pre") {
                            validateOffset(node.children, 1, node.startTag)
                        }
                        if (node.endTag) {
                            validateOffset(node.endTag, 0, node.startTag)
                        }
                    },
                    HTMLStartTag(node) {
                        validateOffset(node.attributes, options.attribute, node)

                        // if (
                        //     closeToken != null &&
                        //     closeToken.type.endsWith("TagClose")
                        // ) {
                        //     setOffset(
                        //         closeToken,
                        //         options.closeBracket,
                        //         openToken
                        //     )
                        // }
                    },
                })
            },
        }
    },
}
