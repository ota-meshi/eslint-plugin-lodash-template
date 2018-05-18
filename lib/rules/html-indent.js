"use strict"

const IGNORE_INDENT_ELEMENT_NAMES = ["pre", "script", "style"]

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

/**
 * Check whether the given token is a left parenthesis.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left parenthesis.
 */
function isLeftParen(token) {
    return token != null && token.type === "Punctuator" && token.value === "("
}

/**
 * Check whether the given token is a right parenthesis.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right parenthesis.
 */
function isRightParen(token) {
    return token != null && token.type === "Punctuator" && token.value === ")"
}

/**
 * Check whether the given token is a left brace.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left brace.
 */
function isLeftBrace(token) {
    return token != null && token.type === "Punctuator" && token.value === "{"
}

/**
 * Check whether the given token is a right brace.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right brace.
 */
function isRightBrace(token) {
    return token != null && token.type === "Punctuator" && token.value === "}"
}

/**
 * Check whether the given token is a left bracket.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left bracket.
 */
function isLeftBracket(token) {
    return token != null && token.type === "Punctuator" && token.value === "["
}

/**
 * Check whether the given token is a right bracket.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right bracket.
 */
function isRightBracket(token) {
    return token != null && token.type === "Punctuator" && token.value === "]"
}

/**
 * Check whether the given token is a left indentation start punctuators.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left indentation start punctuators.
 */
function isIndentationStartPunctuator(token) {
    return isLeftParen(token) || isLeftBrace(token) || isLeftBracket(token)
}

/**
 * Check whether the given token is a right indentation end punctuators.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right indentation end punctuators.
 */
function isIndentationEndPunctuator(token) {
    return isRightParen(token) || isRightBrace(token) || isRightBracket(token)
}

module.exports = {
    meta: {
        docs: {
            description: "enforce consistent HTML indentation.",
            // category: "recommended",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.0.7/docs/rules/html-indent.md",
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
         * Get line text from the given number of line.
         * @param {number} line The number of line.
         * @returns {string} The line text .
         */
        function getLineText(line) {
            return sourceCode.getLines()[line - 1]
        }

        /**
         * Set offset to the given location.
         * @param {Location} loc The start index to set.
         * @param {number} offset The offset of the tokens.
         * @param {number} baseline The line of the base offset.
         * @returns {void}
         */
        function setOffsetToLoc(loc, offset, baseline) {
            if (baseline >= loc.line) {
                return
            }
            const actualText = getBeforeTextInLine(loc)
            if (actualText.trim()) {
                return
            }
            offsets.set(loc.line, {
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
        function setOffsetToIndex(startIndex, offset, baseline) {
            const loc = sourceCode.getLocFromIndex(startIndex)
            setOffsetToLoc(loc, offset, baseline)
        }

        /**
         * Set offset to the given tokens.
         * @param {Token|Token[]} token The token to set.
         * @param {number} offset The offset of the tokens.
         * @param {number} baseline The line of the base offset.
         * @returns {void}
         */
        function setOffsetToToken(token, offset, baseline) {
            if (Array.isArray(token)) {
                for (const t of token) {
                    setOffsetToToken(t, offset, baseline)
                }
                return
            }
            setOffsetToLoc(token.loc.start, offset, baseline)
        }

        /**
         * Create offset data from the line no.
         * @param {number} line The line no to set.
         * @param {object} baseObject The baseObject.
         * @returns {object} The offset data.
         */
        function createOffsetDataFromLine(line, baseObject) {
            const text = getLineText(line)
            const index = text.search(/\S/)
            return Object.assign(
                {
                    actualText: index >= 0 ? text.slice(0, index) : text,
                    expectedIndent: undefined,
                },
                baseObject
            )
        }

        /**
         * Set offset to the given line.
         * @param {number} line The line to set.
         * @param {number} offset The offset of the tokens.
         * @param {number} baseline The line of the base offset.
         * @returns {void}
         */
        function setOffsetToLine(line, offset, baseline) {
            if (baseline >= line) {
                return
            }

            offsets.set(
                line,
                createOffsetDataFromLine(line, {
                    baseline,
                    offset,
                })
            )
        }

        /**
         * Set root line offset to the given index.
         * @param {number} startIndex The start index to set.
         * @returns {void}
         */
        function setOffsetRootToIndex(startIndex) {
            const loc = sourceCode.getLocFromIndex(startIndex)

            if (!offsets.has(loc.line)) {
                setOffsetToLoc(loc, 0, -1)
            }
        }

        /**
         * Set root line offset to the given line.
         * @param {number} line The line to set.
         * @returns {void}
         */
        function setOffsetRootToLine(line) {
            if (!offsets.has(line)) {
                offsets.set(
                    line,
                    createOffsetDataFromLine(line, {
                        baseline: -1,
                        offset: 0,
                    })
                )
            }
        }

        /**
         * Get the text of the before part of the line which the given loc is on.
         * @param {Location} loc The location.
         * @returns {string} The text of before part.
         */
        function getBeforeTextInLine(loc) {
            const lineText = getLineText(loc.line)
            return lineText.slice(0, loc.column)
        }

        /**
         * Process HTML indentation.
         * @returns {void}
         */
        function processHTML() {
            /**
             * Genetrate an iterator of the index where non whitespace appear
             * @param {string} text The text to set
             * @returns {number} The index
             */
            function* genWordStartIndices(text) {
                if (!text.trim()) {
                    return
                }
                const re = /\s/
                let preIsWhitespace = true
                let i = 0
                for (const c of text) {
                    const isWhitespace = re.test(c)
                    if (preIsWhitespace && !isWhitespace) {
                        yield i
                    }
                    preIsWhitespace = isWhitespace
                    i++
                }
            }

            /**
             * Check whether the given token is a dummy element.
             * @param {Token} node The token to check.
             * @returns {boolean} `true` if the token is a dummy element.
             */
            function isDummyElement(node) {
                return (
                    !node.startTag &&
                    (node.name === "body" ||
                        node.name === "head" ||
                        node.name === "html")
                )
            }

            microTemplateService.traverseDocumentNodes({
                HTMLElement(node) {
                    if (isDummyElement(node)) {
                        return
                    }
                    const startToken = node.startTag || node
                    setOffsetRootToIndex(startToken.range[0])
                    if (
                        IGNORE_INDENT_ELEMENT_NAMES.find(
                            name => name === node.name
                        )
                    ) {
                        ignoreRanges.push([
                            node.startTag
                                ? node.startTag.range[1]
                                : node.range[0],
                            node.endTag ? node.endTag.range[0] : node.range[1],
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
                                setOffsetToIndex(
                                    n.range[0] + i,
                                    1,
                                    startToken.loc.start.line
                                )
                            }
                        } else {
                            setOffsetToToken(n, 1, startToken.loc.start.line)
                        }
                    }
                    if (node.endTag) {
                        setOffsetToToken(
                            node.endTag,
                            0,
                            startToken.loc.start.line
                        )
                    }
                },
                HTMLStartTag(node) {
                    setOffsetToToken(
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
                        setOffsetToIndex(
                            closeStartIndex,
                            options.closeBracket,
                            node.loc.start.line
                        )
                    }
                },
                HTMLEndTag(node) {
                    const closeBracket = sourceCode.text[node.range[1] - 1]
                    if (closeBracket === ">") {
                        setOffsetToIndex(
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
                        setOffsetRootToIndex(node.range[0] + i)
                    }
                },
                HTMLComment(node) {
                    setOffsetRootToIndex(node.range[0])

                    const commentStart = node.range[0] + 4
                    const commentEnd = node.range[1] - 3
                    const comment = sourceCode.text.slice(
                        commentStart,
                        commentEnd
                    )

                    for (const i of genWordStartIndices(comment)) {
                        setOffsetToIndex(
                            commentStart + i,
                            1,
                            node.loc.start.line
                        )
                    }
                    setOffsetToIndex(commentEnd, 0, node.loc.start.line)
                },
            })
        }

        /**
         * Process micro-template evaluates indentation.
         * @returns {void}
         */
        function processEvaluates() {
            /**
             * Find indentation-start punctuator token, within micro-template evaluate.
             * @param {Node} evaluate The micro-template evaluate to set
             * @returns {Token} The indentation-start punctuator token.
             */
            function findIndentationStartPunctuator(evaluate) {
                const searchIndex = evaluate.code.search(/(\S)\s*$/)
                if (searchIndex < 0) {
                    return null
                }
                const charIndex =
                    evaluate.expressionStart.range[1] + searchIndex
                const node = sourceCode.getNodeByRangeIndex(charIndex)
                if (!node) {
                    // comment only
                    return null
                }
                const tokens = sourceCode
                    .getTokens(node)
                    .filter(
                        t =>
                            t.range[0] <= evaluate.range[1] &&
                            t.range[1] >= evaluate.range[0]
                    )

                let targetToken = tokens.find(
                    t => t.range[0] <= charIndex && charIndex < t.range[1]
                )
                if (!targetToken) {
                    targetToken = tokens
                        .reverse()
                        .find(t => t.range[1] <= charIndex)
                }
                let token = targetToken
                while (token) {
                    if (
                        token.range[0] > evaluate.range[1] ||
                        token.range[1] < evaluate.range[0]
                    ) {
                        return null
                    }
                    if (isIndentationStartPunctuator(token)) {
                        return token
                    }
                    if (isIndentationEndPunctuator(token)) {
                        // skip
                        const next = findPairOpenPunctuator(token)
                        token = sourceCode.getTokenBefore(next)
                        continue
                    }

                    token = sourceCode.getTokenBefore(token)
                }

                return null
            }

            /**
             * Find pair open punctuator token.
             * @param {Node} closeToken The close punctuator token
             * @returns {Token} The indentation-start punctuator token.
             */
            function findPairOpenPunctuator(closeToken) {
                const closePunctuatorText = closeToken.value

                const isPairOpenPunctuator =
                    closePunctuatorText === ")"
                        ? isLeftParen
                        : closePunctuatorText === "}"
                            ? isLeftBrace
                            : isLeftBracket
                let token = sourceCode.getTokenBefore(closeToken)
                while (token) {
                    if (isPairOpenPunctuator(token)) {
                        return token
                    }
                    if (isIndentationEndPunctuator(token)) {
                        // skip
                        const next = findPairOpenPunctuator(token)
                        token = sourceCode.getTokenBefore(next)
                        continue
                    }

                    token = sourceCode.getTokenBefore(token)
                }
                return null
            }

            /**
             * Find pair close punctuator token.
             * @param {Node} openToken The open punctuator token
             * @returns {Token} The indentation-end punctuator token.
             */
            function findPairClosePunctuator(openToken) {
                const openPunctuatorText = openToken.value

                const isPairClosePunctuator =
                    openPunctuatorText === "("
                        ? isRightParen
                        : openPunctuatorText === "{"
                            ? isRightBrace
                            : isRightBracket
                let token = sourceCode.getTokenAfter(openToken)
                while (token) {
                    if (isPairClosePunctuator(token)) {
                        return token
                    }
                    if (isIndentationStartPunctuator(token)) {
                        // skip
                        const next = findPairClosePunctuator(token)
                        token = sourceCode.getTokenAfter(next)
                        continue
                    }

                    token = sourceCode.getTokenAfter(token)
                }
                return null
            }

            /**
             * Set offset to the given evaluates blick.
             * @param {Token} startEvaluate The start micro-template evaluate to set.
             * @param {Token} endEvaluate The end micro-template evaluate to set.
             * @returns {void}
             */
            function setOffsetForIndentEvaluates(startEvaluate, endEvaluate) {
                const isCloseOnlyLine = !getBeforeTextInLine(
                    endEvaluate.loc.start
                ).trim()

                const baseLineNo = startEvaluate.loc.start.line
                let baseLineOffset = offsets.get(baseLineNo)
                if (!baseLineOffset) {
                    setOffsetRootToLine(baseLineNo)
                    baseLineOffset = offsets.get(baseLineNo)
                }
                const endLineNo = isCloseOnlyLine
                    ? endEvaluate.loc.start.line - 1
                    : endEvaluate.loc.start.line
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
                        } else if (
                            offset.baseline === baseLineNo &&
                            offset.offset < 1
                        ) {
                            offset.offset = 1
                        }
                    } else {
                        setOffsetToLine(lineNo, 1, baseLineNo)
                    }
                }
            }

            const evaluates = microTemplateService
                .getMicroTemplateTokens()
                .filter(t => t.type === "MicroTemplateEvaluate")
                .sort((a, b) => a.range[0] - b.range[0])

            const adjustLastEvaluates = new Map()
            for (const evaluate of evaluates) {
                const leftToken = findIndentationStartPunctuator(evaluate)
                if (!leftToken) {
                    continue
                }
                const rightToken = findPairClosePunctuator(leftToken)
                if (!rightToken) {
                    continue
                }

                const closeEvaluate = evaluates.find(
                    e =>
                        e.range[0] <= rightToken.range[0] &&
                        rightToken.range[0] < e.range[1]
                )
                if (!closeEvaluate) {
                    continue
                }
                setOffsetForIndentEvaluates(evaluate, closeEvaluate)
                const isCloseOnlyLine = !getBeforeTextInLine(
                    closeEvaluate.loc.start
                ).trim()
                if (isCloseOnlyLine) {
                    adjustLastEvaluates.set(closeEvaluate, evaluate)
                }
            }

            // 最後にscript閉じ括弧位置の調整
            adjustLastEvaluates.forEach((start, end) => {
                setOffsetToToken(end, 0, start.loc.start.line)
            })
        }

        /**
         * Validate indentation.
         * @returns {void}
         */
        function validateIndent() {
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
             * @param {number} line The number of line.
             * @param {number} actualIndent The number of actual indentation.
             * @param {number} expectedIndent The number of expected indentation.
             * @returns {function} The defined function.
             */
            function defineFix(line, actualIndent, expectedIndent) {
                return fixer => {
                    const start = sourceCode.getIndexFromLoc({
                        line,
                        column: 0,
                    })
                    const indent = options.indentChar.repeat(expectedIndent)
                    return fixer.replaceTextRange(
                        [start, start + actualIndent],
                        indent
                    )
                }
            }

            offsets.forEach((value, line) => {
                if (inTemplateTag(line)) {
                    return
                }
                if (inIgnore(line)) {
                    return
                }
                if (!sourceCode.getLines()[line - 1].trim()) {
                    // empty line
                    return
                }
                const actualText = value.actualText
                const actualIndent = actualText.length
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
                            fix: defineFix(line, actualIndent, expectedIndent),
                        })
                        return
                    }
                }

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
                        fix: defineFix(line, actualIndent, expectedIndent),
                    })
                }
            })
        }

        return {
            "Program:exit"() {
                processHTML()
                processEvaluates()
                validateIndent()
            },
        }
    },
}
