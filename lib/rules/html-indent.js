"use strict"

const LT_CHAR = /[\r\n\u2028\u2029]/

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
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.0.5/docs/rules/html-indent.md",
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
        const microTemplateService = context.parserServices.getMicroTemplateService()
        const options = parseOptions(
            context.options[0],
            context.options[1] || {}
        )
        const sourceCode = context.getSourceCode()
        const offsets = new Map()

        const unit = options.indentChar === "\t" ? "tab" : "space"

        /**
         * Set offset to the given tokens.
         * @param {Token|Token[]} token The token to set.
         * @param {number} offset The offset of the tokens.
         * @param {number} baseline The line of the base offset.
         * @returns {void}
         */
        function setOffset(token, offset, baseline) {
            if (Array.isArray(token)) {
                for (const t of token) {
                    setOffset(t, offset, baseline)
                }
                return
            }
            if (baseline >= token.loc.start.line) {
                return
            }
            const actualText = getBeforeTextInLine(token.range[0])
            if (actualText.trim()) {
                return
            }
            offsets.set(token.loc.start.line, {
                startIndex: token.range[0],
                actualText,
                baseline,
                offset,
                expectedIndent: undefined,
            })
        }

        /**
         * Set offset to the given index.
         * @param {number} startIndex The start index to set.
         * @param {number} offset The offset of the tokens.
         * @param {number} baseline The line of the base offset.
         * @returns {void}
         */
        function setOffsetFromIndex(startIndex, offset, baseline) {
            const loc = sourceCode.getLocFromIndex(startIndex)
            if (baseline >= loc.line) {
                return
            }
            const actualText = getBeforeTextInLine(startIndex)
            if (actualText.trim()) {
                return
            }
            offsets.set(loc.line, {
                startIndex,
                actualText,
                baseline,
                offset,
                expectedIndent: undefined,
            })
        }

        /**
         * Set root line offset to the given index.
         * @param {number} startIndex The start index to set.
         * @returns {void}
         */
        function setOffsetRootLineIndex(startIndex) {
            const loc = sourceCode.getLocFromIndex(startIndex)

            if (!offsets.has(loc.line)) {
                const actualText = getBeforeTextInLine(startIndex)
                if (actualText.trim()) {
                    return
                }
                offsets.set(loc.line, {
                    startIndex,
                    actualText,
                    baseline: -1,
                    offset: 0,
                    expectedIndent: undefined,
                })
            }
        }

        /**
         * Get the text of the before part of the line which the given startIndex is on.
         * @param {number} startIndex The start index.
         * @returns {string} The text of before part.
         */
        function getBeforeTextInLine(startIndex) {
            const text = sourceCode.text
            let i = startIndex - 1

            while (i >= 0 && !LT_CHAR.test(text[i])) {
                i -= 1
            }

            return text.slice(i + 1, startIndex)
        }

        /**
         * Calculate correct indentation of the line of the given line.
         * @param {number} line The number of line.
         * @returns {number} Correct indentation. If it failed to calculate then `NaN`.
         */
        function getExpectedIndent(line) {
            const offset = offsets.get(line)
            if (!offset) {
                return 0
            }
            if (offset.expectedIndent !== undefined) {
                return offset.expectedIndent
            }
            const baseIndent = getExpectedIndent(offset.baseline)

            return (offset.expectedIndent =
                baseIndent + offset.offset * options.indentSize)
        }

        /**
         * Define the function which fixes the problem.
         * @param {Array} range The fix range.
         * @param {number} expectedIndent The number of expected indentation.
         * @returns {function} The defined function.
         */
        function defineFix(range, expectedIndent) {
            return fixer => {
                const indent = options.indentChar.repeat(expectedIndent)
                return fixer.replaceTextRange(range, indent)
            }
        }

        /**
         * Check whether the line start is in template tag.
         * @param {number} line The line.
         * @returns {boolean} `true` if the line start is in template tag.
         */
        function inTemplateTag(line) {
            if (line <= 1) {
                return false
            }
            const lineStartIndex = sourceCode.getIndexFromLoc({
                line,
                column: 0,
            })
            return microTemplateService.inTemplateTag(lineStartIndex - 1)
        }

        /**
         * Validate indentation.
         * @returns {void}
         */
        function validateIndent() {
            offsets.forEach((value, line) => {
                if (inTemplateTag(line)) {
                    return
                }
                const actualText = value.actualText
                const expectedIndent = getExpectedIndent(line)

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
                            fix: defineFix(
                                [
                                    value.startIndex - actualText.length,
                                    value.startIndex,
                                ],
                                expectedIndent
                            ),
                        })
                        return
                    }
                }

                const actualIndent = actualText.length
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
                            expectedIndentPlural:
                                expectedIndent === 1 ? "" : "s",
                            actualIndentPlural: actualIndent === 1 ? "" : "s",
                        },
                        fix: defineFix(
                            [
                                value.startIndex - actualText.length,
                                value.startIndex,
                            ],
                            expectedIndent
                        ),
                    })
                }
            })
        }

        /**
         * Genetrate an iterator of the index where non whitespace appear
         * @param {string} text The text to set
         * @returns {number} The index
         */
        function* genWordStartIndices(text) {
            if (!text.trim()) {
                return
            }
            let preIsWhitespace = true
            let i = 0
            for (const c of text) {
                const isWhitespace = /\s/.test(c)
                if (preIsWhitespace && !isWhitespace) {
                    yield i
                }
                preIsWhitespace = isWhitespace
                i++
            }
        }

        /**
         * Check whether if node is in ignore elements.
         * @param {object} node The node.
         * @returns {boolean} `true` if node is in ignore elements.
         */
        function inIgnoreElement(node) {
            if (node.type === "HTMLElement") {
                if (node.name === "pre") {
                    return true
                }
            }
            let el = node.parent
            while (el) {
                if (el.name === "pre") {
                    return true
                }
                el = el.parent
            }
            return false
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLElement(node) {
                        if (!node.startTag) {
                            return
                        }
                        setOffsetRootLineIndex(node.startTag.range[0])
                        if (inIgnoreElement(node)) {
                            return
                        }
                        for (const n of node.children) {
                            if (n.type === "HTMLText") {
                                const textHTML = sourceCode.text.slice(
                                    n.range[0],
                                    n.range[1]
                                )
                                for (const i of genWordStartIndices(textHTML)) {
                                    setOffsetFromIndex(
                                        n.range[0] + i,
                                        1,
                                        node.startTag.loc.start.line
                                    )
                                }
                            } else {
                                setOffset(n, 1, node.startTag.loc.start.line)
                            }
                        }
                        if (node.endTag) {
                            setOffset(
                                node.endTag,
                                0,
                                node.startTag.loc.start.line
                            )
                        }
                    },
                    HTMLStartTag(node) {
                        setOffset(
                            node.attributes,
                            options.attribute,
                            node.loc.start.line
                        )

                        const closeBracket = sourceCode.text[node.range[1] - 1]
                        if (closeBracket === ">") {
                            let closeStartIndex = node.range[1] - 1
                            const slash = sourceCode.text[node.range[1] - 2]
                            if (slash === "/") {
                                closeStartIndex--
                            }
                            setOffsetFromIndex(
                                closeStartIndex,
                                options.closeBracket,
                                node.loc.start.line
                            )
                        }
                    },
                    HTMLEndTag(node) {
                        const closeBracket = sourceCode.text[node.range[1] - 1]
                        if (closeBracket === ">") {
                            setOffsetFromIndex(
                                node.range[1] - 1,
                                options.closeBracket,
                                node.loc.start.line
                            )
                        }
                    },
                    HTMLText(node) {
                        if (inIgnoreElement(node)) {
                            return
                        }
                        const textHTML = sourceCode.text.slice(
                            node.range[0],
                            node.range[1]
                        )
                        for (const i of genWordStartIndices(textHTML)) {
                            setOffsetRootLineIndex(node.range[0] + i)
                        }
                    },
                    HTMLComment(node) {
                        if (inIgnoreElement(node)) {
                            return
                        }
                        setOffsetRootLineIndex(node.range[0])

                        const commentStart = node.range[0] + 4
                        const commentEnd = node.range[1] - 3
                        const comment = sourceCode.text.slice(
                            commentStart,
                            commentEnd
                        )

                        for (const i of genWordStartIndices(comment)) {
                            setOffsetFromIndex(
                                commentStart + i,
                                1,
                                node.loc.start.line
                            )
                        }
                        setOffsetFromIndex(commentEnd, 0, node.loc.start.line)
                    },
                })
                validateIndent()
            },
        }
    },
}
