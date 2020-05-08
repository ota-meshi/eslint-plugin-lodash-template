"use strict"

const utils = require("../utils")

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
    return token && token.type === "Punctuator" && token.value === "("
}

/**
 * Check whether the given token is a right parenthesis.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right parenthesis.
 */
function isRightParen(token) {
    return token && token.type === "Punctuator" && token.value === ")"
}

/**
 * Check whether the given token is a left brace.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left brace.
 */
function isLeftBrace(token) {
    return token && token.type === "Punctuator" && token.value === "{"
}

/**
 * Check whether the given token is a right brace.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right brace.
 */
function isRightBrace(token) {
    return token && token.type === "Punctuator" && token.value === "}"
}

/**
 * Check whether the given token is a left bracket.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left bracket.
 */
function isLeftBracket(token) {
    return token && token.type === "Punctuator" && token.value === "["
}

/**
 * Check whether the given token is a right bracket.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right bracket.
 */
function isRightBracket(token) {
    return token && token.type === "Punctuator" && token.value === "]"
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

/**
 * Check whether the given tokens is a equals range.
 * @param  {Token} a The token
 * @param  {Token} b The token
 * @returns {boolean}  `true` if the given tokens is a equals range.
 */
function equalsLocation(a, b) {
    return a.range[0] === b.range[0] && a.range[1] === b.range[1]
}

module.exports = {
    meta: {
        docs: {
            description: "enforce consistent HTML indentation.",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.17.0/docs/rules/html-indent.md",
        },
        fixable: "whitespace",
        messages: {
            unexpectedIndentationCharacter:
                "Expected {{expected}} character, but found {{actual}} character.",
            unexpectedIndentation:
                "Expected indentation of {{expectedIndent}} {{unit}}{{expectedIndentPlural}} but found {{actualIndent}} {{unit}}{{actualIndentPlural}}.",
        },
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
        type: "layout",
    },
    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }
        if (!utils.isHtmlFile(context.getFilename())) {
            return {}
        }
        const microTemplateService = context.parserServices.getMicroTemplateService()
        const options = parseOptions(
            context.options[0],
            context.options[1] || {}
        )
        const sourceCode = context.getSourceCode()
        const offsets = new Map()
        const actualLineIndentTexts = new Map()
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
         * Get the actual indent text of the line which the given line is on.
         * @param {number} line The line no.
         * @returns {string} The text of actual indent.
         */
        function getActualLineIndentText(line) {
            let actualText = actualLineIndentTexts.get(line)
            if (actualText === undefined) {
                const lineText = getLineText(line)
                const index = lineText.search(/\S/u)
                if (index >= 0) {
                    actualText = lineText.slice(0, index)
                } else {
                    actualText = lineText
                }
                actualLineIndentTexts.set(line, actualText)
            }
            return actualText
        }

        /**
         * Check whether the given location is a line start location.
         * @param {Location} loc The location to check.
         * @returns {boolean} `true` if the location is a line start location.
         */
        function isLineStart(loc) {
            const actualText = getActualLineIndentText(loc.line)
            return actualText.length === loc.column
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
            const actualText = getActualLineIndentText(loc.line)
            if (actualText.length !== loc.column) {
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
            const actualText = getActualLineIndentText(line)

            offsets.set(line, {
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
        function setOffsetRootToIndex(startIndex) {
            const loc = sourceCode.getLocFromIndex(startIndex)

            if (!offsets.has(loc.line)) {
                setOffsetToLoc(loc, 0, -1)
            }
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

            const expectedIndent =
                baseIndent + offset.offset * options.indentSize

            offset.expectedIndent = expectedIndent
            return expectedIndent
        }

        //------------------------------------------------------------------------------
        // Process HTML(step 1)
        //------------------------------------------------------------------------------
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
                const re = /\s/u
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

            /**
             * Get the start token of Element
             * @param  {Node} elementNode The element node
             * @returns {Token} The start token
             */
            function getStartToken(elementNode) {
                if (!elementNode) {
                    return null
                }
                if (elementNode.type !== "HTMLElement") {
                    return null
                }
                if (isDummyElement(elementNode)) {
                    return null
                }
                return elementNode.startTag || elementNode
            }

            microTemplateService.traverseDocumentNodes({
                HTMLElement(node) {
                    if (isDummyElement(node)) {
                        return
                    }
                    const elementNode =
                        microTemplateService.getPathCoveredHtmlNode(
                            node,
                            sourceCode
                        ) || node
                    const startToken = getStartToken(elementNode)
                    const parentStartToken = getStartToken(elementNode.parent)
                    if (parentStartToken) {
                        // self indent
                        setOffsetToToken(
                            startToken,
                            1,
                            parentStartToken.loc.start.line
                        )
                    } else {
                        setOffsetRootToIndex(startToken.range[0])
                    }
                    if (
                        IGNORE_INDENT_ELEMENT_NAMES.find(
                            (name) => name === elementNode.name
                        )
                    ) {
                        ignoreRanges.push([
                            elementNode.startTag
                                ? elementNode.startTag.range[1]
                                : elementNode.range[0],
                            elementNode.endTag
                                ? elementNode.endTag.range[0]
                                : elementNode.range[1],
                        ])
                    }
                },
                HTMLStartTag(node) {
                    const attrs = node.attributes.concat(node.ignoredAttributes)
                    setOffsetToToken(
                        attrs,
                        options.attribute,
                        node.loc.start.line
                    )
                    const start = node.tagOpen
                        ? node.tagOpen.range[1]
                        : node.range[0]
                    const end = node.tagClose
                        ? node.tagClose.range[0]
                        : node.range[1]
                    const attrTemplateTokens = microTemplateService
                        .getMicroTemplateTokens()
                        .filter((token) => {
                            if (
                                token.range[0] < start ||
                                end < token.range[1]
                            ) {
                                return false
                            }
                            return !attrs.some(
                                (n) =>
                                    token.range[0] < n.range[1] &&
                                    n.range[0] < token.range[1]
                            )
                        })
                    setOffsetToToken(
                        attrTemplateTokens,
                        options.attribute,
                        node.loc.start.line
                    )

                    if (node.tagClose) {
                        setOffsetToToken(
                            node.tagClose,
                            options.closeBracket,
                            node.loc.start.line
                        )
                    }
                },
                HTMLEndTag(node) {
                    const endTag =
                        microTemplateService.getPathCoveredHtmlNode(
                            node,
                            sourceCode
                        ) || node
                    const startToken = getStartToken(endTag.parent)
                    if (startToken) {
                        // self indent
                        setOffsetToToken(endTag, 0, startToken.loc.start.line)
                    }

                    if (endTag.tagClose) {
                        setOffsetToToken(
                            endTag.tagClose,
                            options.closeBracket,
                            endTag.loc.start.line
                        )
                    }
                },
                HTMLText(node) {
                    const textNode =
                        microTemplateService.getPathCoveredHtmlNode(
                            node,
                            sourceCode
                        ) || node

                    const textHTML = sourceCode.text.slice(
                        textNode.range[0],
                        textNode.range[1]
                    )
                    const startToken = getStartToken(textNode.parent)
                    if (startToken) {
                        // self indent
                        for (const i of genWordStartIndices(textHTML)) {
                            setOffsetToIndex(
                                textNode.range[0] + i,
                                1,
                                startToken.loc.start.line
                            )
                        }
                    } else {
                        for (const i of genWordStartIndices(textHTML)) {
                            setOffsetRootToIndex(textNode.range[0] + i)
                        }
                    }
                },
                HTMLComment(node) {
                    const commentNode =
                        microTemplateService.getPathCoveredHtmlNode(
                            node,
                            sourceCode
                        ) || node
                    const startToken = getStartToken(commentNode.parent)
                    if (startToken) {
                        // self indent
                        setOffsetToToken(
                            commentNode,
                            1,
                            startToken.loc.start.line
                        )
                    } else {
                        setOffsetRootToIndex(commentNode.range[0])
                    }

                    const commentStart = commentNode.range[0] + 4
                    const commentEnd = commentNode.range[1] - 3
                    const comment = sourceCode.text.slice(
                        commentStart,
                        commentEnd
                    )

                    for (const i of genWordStartIndices(comment)) {
                        setOffsetToIndex(
                            commentStart + i,
                            1,
                            commentNode.loc.start.line
                        )
                    }
                    setOffsetToIndex(commentEnd, 0, commentNode.loc.start.line)
                },
            })
        }

        //------------------------------------------------------------------------------
        // Process micro-template evaluates(step 2)
        //------------------------------------------------------------------------------
        /**
         * Process micro-template evaluates indentation.
         * @returns {void}
         */
        function processEvaluates() {
            const evaluates = microTemplateService
                .getMicroTemplateTokens()
                .filter((t) => t.type === "MicroTemplateEvaluate")
                .sort((a, b) => a.range[0] - b.range[0])

            /**
             * Find indentation-start punctuator token, within micro-template evaluate.
             * @param {Node} evaluate The micro-template evaluate to set
             * @returns {Token} The indentation-start punctuator token.
             */
            function findIndentationStartPunctuator(evaluate) {
                const searchIndex = evaluate.code.search(/(\S)\s*$/u)
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
                        (t) =>
                            t.range[0] <= evaluate.range[1] &&
                            t.range[1] >= evaluate.range[0]
                    )

                let targetToken = tokens.find(
                    (t) => t.range[0] <= charIndex && charIndex < t.range[1]
                )
                if (!targetToken) {
                    targetToken = tokens
                        .reverse()
                        .find((t) => t.range[1] <= charIndex)
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
             * Set offset to the given range line blick.
             * @param {number} baseAndStartLine The start line no to set.
             * @param {number} endLine The end line no to set.
             * @returns {void}
             */
            function setOffsetToRangeLines(baseAndStartLine, endLine) {
                const baseLine = baseAndStartLine
                for (let lineNo = baseLine + 1; lineNo <= endLine; lineNo++) {
                    const offset = offsets.get(lineNo)
                    if (offset) {
                        if (offset.baseline <= baseLine) {
                            offset.baseline = baseLine
                            offset.offset = 1
                        }
                    } else {
                        setOffsetToLine(lineNo, 1, baseLine)
                    }
                }
            }

            /**
             * Set offset to the given range line blick.
             * @param {number} baseAndStartLine The start line no to set.
             * @param {number} endLine The end line no to set.
             * @param {ASTNode} switchStatementNode The node of SwitchStatement.
             * @returns {void}
             */
            function setOffsetToRangeLinesForSwitch(
                baseAndStartLine,
                endLine,
                switchStatementNode
            ) {
                /**
                 * Find evaluate token of SwitchCase body from the given line.
                 * @param {number} line The line no to set.
                 * @returns {Token} The evaluate token of SwitchCase.
                 */
                function findSwitchCaseBodyInfoAtLineStart(line) {
                    const index = sourceCode.getIndexFromLoc({
                        line,
                        column: 0,
                    })

                    let switchCaseNode = sourceCode.getNodeByRangeIndex(index)
                    if (
                        !switchCaseNode ||
                        switchCaseNode.type === "SwitchStatement"
                    ) {
                        switchCaseNode = switchStatementNode.cases.find(
                            (_token, i) => {
                                const next = switchStatementNode.cases[i + 1]
                                if (!next || index < next.range[0]) {
                                    return true
                                }
                                return false
                            }
                        )
                    }
                    if (
                        !switchCaseNode ||
                        switchCaseNode.type !== "SwitchCase"
                    ) {
                        // not SwitchCase
                        return null
                    }

                    if (switchCaseNode.test) {
                        if (index < switchCaseNode.test.range[1]) {
                            // not body
                            return null
                        }
                    } else {
                        // default:
                        const fToken = sourceCode.getFirstToken(switchCaseNode)
                        const colon = sourceCode.getTokenAfter(
                            fToken,
                            (t) => t.type === "Punctuator" && t.value === ":"
                        )
                        if (index < colon.range[1]) {
                            // not body
                            return null
                        }
                    }
                    if (
                        !equalsLocation(
                            switchCaseNode.parent,
                            switchStatementNode
                        )
                    ) {
                        // not target
                        return null
                    }
                    const casesIndex = switchStatementNode.cases.findIndex(
                        (c) => equalsLocation(c, switchCaseNode)
                    )
                    const evaluate = evaluates.find(
                        (e) =>
                            e.range[0] <= switchCaseNode.range[0] &&
                            switchCaseNode.range[0] < e.range[1]
                    )
                    return {
                        evaluate,
                        casesIndex,
                        node: switchCaseNode,
                    }
                }

                const switchStatementLine = baseAndStartLine
                // const switchStatementLineOffset = getBaseLineOffset(
                //     switchStatementLine
                // )

                for (
                    let lineNo = baseAndStartLine + 1;
                    lineNo <= endLine;
                    lineNo++
                ) {
                    const switchCaseInfo = findSwitchCaseBodyInfoAtLineStart(
                        lineNo
                    )
                    if (!switchCaseInfo) {
                        continue
                    }
                    const baseLine = switchCaseInfo.evaluate.loc.start.line

                    const offset = offsets.get(lineNo)
                    if (offset) {
                        if (offset.baseline <= baseLine) {
                            offset.baseline = switchStatementLine
                            offset.offset = 1
                        }
                    } else {
                        setOffsetToLine(lineNo, 1, switchStatementLine)
                    }
                }
            }

            const closeEvaluateOffsets = new Map()
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
                    (e) =>
                        e.range[0] <= rightToken.range[0] &&
                        rightToken.range[0] < e.range[1]
                )
                if (!closeEvaluate) {
                    continue
                }

                const closingStartIsBaseIndent =
                    isLineStart(closeEvaluate.loc.start) &&
                    closeEvaluate.loc.start.line === rightToken.loc.start.line
                const endLine = closingStartIsBaseIndent
                    ? closeEvaluate.loc.start.line - 1
                    : closeEvaluate.loc.start.line
                setOffsetToRangeLines(leftToken.loc.start.line, endLine)

                const startAstNode = sourceCode.getNodeByRangeIndex(
                    leftToken.range[0]
                )
                const isSwitchStatement =
                    startAstNode && startAstNode.type === "SwitchStatement"
                if (isSwitchStatement) {
                    setOffsetToRangeLinesForSwitch(
                        leftToken.loc.start.line,
                        endLine,
                        startAstNode
                    )
                }
                closeEvaluateOffsets.set(closeEvaluate, {
                    baseline: leftToken.loc.start.line,
                    startLine: endLine + 1,
                })
            }

            // 最後にscript閉じ括弧位置の調整
            closeEvaluateOffsets.forEach((info, closeEvaluate) => {
                const baseline = info.baseline
                // 実際は開始位置しかインデントされない。
                // 後続で正しいインデント位置を知るためにマークをつけている。
                for (
                    let line = info.startLine;
                    line <= closeEvaluate.loc.end.line;
                    line++
                ) {
                    setOffsetToLine(line, 0, baseline)
                }
            })
        }

        //------------------------------------------------------------------------------
        // Validate(step 3)
        //------------------------------------------------------------------------------
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
                    (range) => range[0] <= index && index < range[1]
                )
            }

            /**
             * Define the function which fixes the problem.
             * @param {number} line The number of line.
             * @param {number} actualIndent The number of actual indentation.
             * @param {number} expectedIndent The number of expected indentation.
             * @returns {function} The defined function.
             */
            function defineFix(line, actualIndent, expectedIndent) {
                return (fixer) => {
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
                if (!getLineText(line).trim()) {
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
                            messageId: "unexpectedIndentationCharacter",
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
                        messageId: "unexpectedIndentation",
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
