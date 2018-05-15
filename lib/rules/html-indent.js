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
            // category: "recommended",
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
        const ignoreRanges = []

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
         * Set offset to the given line.
         * @param {number} line The line to set.
         * @param {number} offset The offset of the tokens.
         * @param {number} baseline The line of the base offset.
         * @returns {void}
         */
        function setOffsetFromLine(line, offset, baseline) {
            if (baseline >= line) {
                return
            }
            let startIndex = sourceCode.getIndexFromLoc({ line, column: 1 })
            let actualText = ""
            const text = sourceCode.text
            for (let i = startIndex; i < text.length; i++) {
                const c = text[i]
                if (/\s/.test(c)) {
                    actualText += c
                    startIndex = i
                } else {
                    break
                }
            }
            offsets.set(line, {
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
         * Set root line offset to the given line.
         * @param {number} line The line to set.
         * @returns {void}
         */
        function setOffsetRootLineIndexFromLine(line) {
            let startIndex = sourceCode.getIndexFromLoc({ line, column: 1 })
            let actualText = ""
            const text = sourceCode.text
            for (let i = startIndex; i < text.length; i++) {
                const c = text[i]
                if (/\s/.test(c)) {
                    actualText += c
                    startIndex = i
                } else {
                    break
                }
            }
            offsets.set(line, {
                startIndex,
                actualText,
                baseline: -1,
                offset: 0,
                expectedIndent: undefined,
            })
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
         * Check whether the line start is in ignore range.
         * @param {number} line The line.
         * @returns {boolean} `true` if the line start is in ignore range.
         */
        function inIgnore(line) {
            const index = sourceCode.getIndexFromLoc({
                line,
                column: 0,
            })
            return ignoreRanges.find(
                range => range[0] <= index && index < range[1]
            )
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
                if (inIgnore(line)) {
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

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLElement(node) {
                        if (!node.startTag) {
                            return
                        }
                        setOffsetRootLineIndex(node.startTag.range[0])
                        if (node.name === "pre" || node.name === "script") {
                            if (node.endTag)
                                ignoreRanges.push([
                                    node.startTag.range[1],
                                    node.endTag.range[0],
                                ])
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
                        const textHTML = sourceCode.text.slice(
                            node.range[0],
                            node.range[1]
                        )
                        for (const i of genWordStartIndices(textHTML)) {
                            setOffsetRootLineIndex(node.range[0] + i)
                        }
                    },
                    HTMLComment(node) {
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
                const evaluates = microTemplateService
                    .getMicroTemplateTokens()
                    .filter(t => t.type === "MicroTemplateEvaluate")
                    .sort((a, b) => a.range[0] - b.range[0])
                evaluates.forEach((evaluate, index) => {
                    if (index === 0) {
                        return
                    }
                    const m = evaluate.code.match(/^\s*([)}\]])/)
                    if (!m) {
                        return
                    }
                    const open = m[1] === ")" ? "(" : m[1] === "}" ? "{" : "\\["
                    const preEval = evaluates[index - 1]
                    const re = new RegExp(`[${open}]\\s*$`)
                    if (!re.test(preEval.code)) {
                        return
                    }
                    const closeOnly = !getBeforeTextInLine(
                        evaluate.range[0]
                    ).trim()

                    const baseLineNo = preEval.loc.end.line
                    let baseLineOffset = offsets.get(baseLineNo)
                    if (!baseLineOffset) {
                        setOffsetRootLineIndexFromLine(baseLineNo)
                        baseLineOffset = offsets.get(baseLineNo)
                    }
                    const endLineNo = closeOnly
                        ? evaluate.loc.start.line - 1
                        : evaluate.loc.start.line
                    for (
                        let lineNo = baseLineNo + 1;
                        lineNo <= endLineNo;
                        lineNo++
                    ) {
                        const offset = offsets.get(lineNo)
                        if (offset) {
                            if (
                                offset.baseline === baseLineOffset.baseline &&
                                offset.offset === baseLineOffset.offset
                            ) {
                                offset.baseline = baseLineNo
                                offset.offset = 1
                            }
                        } else {
                            setOffsetFromLine(lineNo, 1, baseLineNo)
                        }
                    }
                })
                validateIndent()
            },
        }
    },
}
