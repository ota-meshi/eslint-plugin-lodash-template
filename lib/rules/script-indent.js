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
        startIndent: 1,
        switchCase: 0,
    }

    if (Number.isSafeInteger(type)) {
        ret.indentSize = type
    } else if (type === "tab") {
        ret.indentChar = "\t"
        ret.indentSize = 1
    }
    if (Number.isSafeInteger(options.switchCase)) {
        ret.switchCase = options.switchCase
    }
    if (Number.isSafeInteger(options.startIndent)) {
        ret.startIndent = options.startIndent
    }

    return ret
}

/**
 * Check whether the given token is an arrow.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is an arrow.
 */
function isArrow(token) {
    return token && token.type === "Punctuator" && token.value === "=>"
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
 * Check whether the given token is a left parenthesis.
 * @param {Token} token The token to check.
 * @returns {boolean} `false` if the token is a left parenthesis.
 */
function isNotLeftParen(token) {
    return token && (token.type !== "Punctuator" || token.value !== "(")
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
 * Check whether the given token is a right parenthesis.
 * @param {Token} token The token to check.
 * @returns {boolean} `false` if the token is a right parenthesis.
 */
function isNotRightParen(token) {
    return token && (token.type !== "Punctuator" || token.value !== ")")
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
 * Check whether the given token is a semicolon.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a semicolon.
 */
function isSemicolon(token) {
    return token && token.type === "Punctuator" && token.value === ";"
}

/**
 * Check whether the given token is a comma.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a comma.
 */
function isComma(token) {
    return token && token.type === "Punctuator" && token.value === ","
}

/**
 * Get the last element.
 * @param {Array} xs The array to get the last element.
 * @returns {any|undefined} The last element or undefined.
 */
function last(xs) {
    return xs.length === 0 ? undefined : xs[xs.length - 1]
}

module.exports = {
    meta: {
        docs: {
            description:
                "enforce consistent indentation to script in micro-template tag.",
            category: "recommended",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.13.0/docs/rules/script-indent.md",
        },
        fixable: "whitespace",
        type: "layout",
        schema: [
            {
                anyOf: [{ type: "integer", minimum: 1 }, { enum: ["tab"] }],
            },
            {
                type: "object",
                properties: {
                    startIndent: { type: "integer", minimum: 0 },
                    switchCase: { type: "integer", minimum: 0 },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            unexpectedIndentationCharacter:
                "Expected {{expected}} character, but found {{actual}} character.",
            unexpectedIndentation:
                "Expected indentation of {{expectedIndent}} {{unit}}{{expectedIndentPlural}} but found {{actualIndent}} {{unit}}{{actualIndentPlural}}.",
            unexpectedRelativeIndentation:
                "Expected relative indentation of {{expectedIndent}} {{unit}}{{expectedIndentPlural}} but found {{actualIndent}} {{unit}}{{actualIndentPlural}}.",
            unexpectedBaseIndentation:
                "Expected base point indentation of {{expected}}, but found {{actual}}.",
            missingBaseIndentation:
                "Expected base point indentation of {{expected}}, but not found.",
        },
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
        const actualLineIndentTexts = new Map()

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
         * Set offset to the given location.
         * @param {Location} loc The start index to set.
         * @param {number} offset The offset of the tokens.
         * @param {Token} baseToken The token of the base offset.
         * @returns {void}
         */
        function setOffsetToLoc(loc, offset, baseToken) {
            const baseline = baseToken.loc.start.line
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
         * Set offset to the given tokens.
         * @param {Token|Token[]} token The token to set.
         * @param {number} offset The offset of the tokens.
         * @param {Token} baseToken The token of the base offset.
         * @returns {void}
         */
        function setOffsetToToken(token, offset, baseToken) {
            if (Array.isArray(token)) {
                for (const t of token) {
                    setOffsetToToken(t, offset, baseToken)
                }
                return
            }
            setOffsetToLoc(token.loc.start, offset, baseToken)
        }

        /**
         * Expected indent data
         */
        class ExpectedIndent {
            /**
             * constructor
             * @param  {string} baseIndentText The base point indentation text.
             * @param  {number} indent The number of indent.
             * @returns {void}
             */
            constructor(baseIndentText, indent) {
                this.baseIndentText = baseIndentText
                this.indent = indent
            }

            /**
             * Get the expected indentation text.
             * @returns {string} The expected indentation text.
             */
            get indentText() {
                if (this._indentText === undefined) {
                    this._indentText =
                        this.baseIndentText +
                        options.indentChar.repeat(this.indent)
                }
                return this._indentText
            }
        }

        /**
         * Calculate correct indentation of the top level in the given template tag.
         * @param {Token} templateTag The template tag.
         * @returns {ExpectedIndent} Correct indentation.
         */
        function getTopLevelIndentByTemplateTag(templateTag) {
            const baseIndentText = getActualLineIndentText(
                templateTag.loc.start.line
            )
            return new ExpectedIndent(
                baseIndentText,
                options.indentSize * options.startIndent
            )
        }

        /**
         * Calculate correct indentation of the line of the given line.
         * @param {number} line The number of line.
         * @returns {ExpectedIndent} Correct indentation.
         */
        function getExpectedIndent(line) {
            const offset = offsets.get(line)
            if (!offset) {
                const index = sourceCode.getIndexFromLoc({ line, column: 0 })
                const templateTag = microTemplateService.getTemplateTagByRangeIndex(
                    index
                )
                return getTopLevelIndentByTemplateTag(templateTag)
            }
            if (offset.expectedIndent !== undefined) {
                return offset.expectedIndent
            }

            const baseLineTemplate = microTemplateService
                .getMicroTemplateTokens()
                .find(t => t.loc.start.line === offset.baseline)

            let baseIndent = undefined
            if (baseLineTemplate) {
                baseIndent = getTopLevelIndentByTemplateTag(baseLineTemplate)
            } else {
                baseIndent = getExpectedIndent(offset.baseline)
            }

            const expectedNumberOfIndent =
                baseIndent.indent + offset.offset * options.indentSize

            const expectedIndent = new ExpectedIndent(
                baseIndent.baseIndentText,
                expectedNumberOfIndent
            )
            offset.expectedIndent = expectedIndent
            return expectedIndent
        }

        /**
         * Find the head of chaining nodes.
         * @param {Node} node The start node to find the head.
         * @returns {Token} The head token of the chain.
         */
        function getChainHeadToken(node) {
            let target = node
            const type = target.type
            while (target.parent.type === type) {
                target = target.parent
            }
            return sourceCode.getFirstToken(target)
        }

        /**
         * Get the first and last tokens of the given node.
         * If the node is parenthesized, this gets the outermost parentheses.
         * @param {Node} node The node to get.
         * @param {number} [borderOffset] The least offset of the first token. Defailt is 0. This value is used to prevent false positive in the following case: `(a) => {}` The parentheses are enclosing the whole parameter part rather than the first parameter, but this offset parameter is needed to distinguish.
         * @returns {{firstToken:Token,lastToken:Token}} The gotten tokens.
         */
        function getFirstAndLastTokens(node, borderOffset) {
            borderOffset |= 0 // eslint-disable-line no-param-reassign

            let firstToken = sourceCode.getFirstToken(node)
            let lastToken = sourceCode.getLastToken(node)

            if (!firstToken || !lastToken) {
                return {
                    firstToken: firstToken || node,
                    lastToken: lastToken || node,
                }
            }

            // Get the outermost left parenthesis if it's parenthesized.
            let t = undefined
            let u = undefined
            while (
                (t = sourceCode.getTokenBefore(firstToken)) &&
                (u = sourceCode.getTokenAfter(lastToken)) &&
                isLeftParen(t) &&
                isRightParen(u) &&
                t.range[0] >= borderOffset
            ) {
                firstToken = t
                lastToken = u
            }

            return { firstToken, lastToken }
        }

        /**
         * Collect prefix tokens of the given property.
         * The prefix includes `async`, `get`, `set`, `static`, and `*`.
         * @param {Property|MethodDefinition} node The property node to collect prefix tokens.
         * @returns {Array} tokens
         */
        function getPrefixTokens(node) {
            const prefixes = []

            let token = sourceCode.getFirstToken(node)
            while (token != null && token.range[1] <= node.key.range[0]) {
                prefixes.push(token)
                token = sourceCode.getTokenAfter(token)
            }
            while (
                isLeftParen(last(prefixes)) ||
                isLeftBracket(last(prefixes))
            ) {
                prefixes.pop()
            }

            return prefixes
        }

        /**
         * Check whether a given token is the first token of:
         *
         * - ExpressionStatement
         * - A parameter of CallExpression/NewExpression
         * - An element of ArrayExpression
         * - An expression of SequenceExpression
         *
         * @param {Token} token The token to check.
         * @param {Node} belongingNode The node that the token is belonging to.
         * @returns {boolean} `true` if the token is the first token of an element.
         */
        function isBeginningOfElement(token, belongingNode) {
            let node = belongingNode

            while (node) {
                const parent = node.parent
                const type = (parent && parent.type) || ""
                if (
                    type.endsWith("Statement") ||
                    type.endsWith("Declaration")
                ) {
                    return parent.range[0] === token.range[0]
                }
                if (type === "CallExpression" || type === "NewExpression") {
                    const openParen = sourceCode.getTokenAfter(
                        parent.callee,
                        isNotRightParen
                    )
                    return parent.arguments.some(
                        param =>
                            getFirstAndLastTokens(param, openParen.range[1])
                                .firstToken.range[0] === token.range[0]
                    )
                }
                if (type === "ArrayExpression") {
                    return parent.elements.some(
                        element =>
                            element &&
                            getFirstAndLastTokens(element).firstToken
                                .range[0] === token.range[0]
                    )
                }
                if (type === "SequenceExpression") {
                    return parent.expressions.some(
                        expr =>
                            getFirstAndLastTokens(expr).firstToken.range[0] ===
                            token.range[0]
                    )
                }

                node = parent
            }

            return false
        }

        /**
         * Process the given node as body.
         * The body node maybe a block statement or an expression node.
         * @param {Node} node The body node to process.
         * @param {Token} baseToken The base token.
         * @returns {void}
         */
        function processMaybeBlock(node, baseToken) {
            const firstToken = getFirstAndLastTokens(node).firstToken
            setOffsetToToken(
                firstToken,
                isLeftBrace(firstToken) ? 0 : 1,
                baseToken
            )
        }

        /**
         * Collect nodeList.
         * @param {Node[]} nodeList The node to process.
         * @param {Node|null} leftToken The left parenthesis token.
         * @param {Node|null} rightToken The right parenthesis token.
         * @returns {void}
         */
        function* genCollectNodeList(nodeList, leftToken, rightToken) {
            let lastToken = leftToken

            /**
             * Collect related tokens.
             * Commas between this and the previous, and the first token of this node.
             * @param  {Token} firstToken The first token
             * @returns {Array} Collect related tokens.
             */
            function* genCollectTokens(firstToken) {
                if (lastToken) {
                    let t = lastToken
                    while (
                        (t = sourceCode.getTokenAfter(t, {
                            includeComments: true,
                        })) &&
                        t.range[1] <= firstToken.range[0]
                    ) {
                        yield t
                    }
                }
            }

            for (const node of nodeList) {
                if (!node) {
                    // Holes of an array.
                    continue
                }
                const elementTokens = getFirstAndLastTokens(
                    node,
                    lastToken ? lastToken.range[1] : 0
                )

                // Collect related tokens.
                // Commas between this and the previous, and the first token of this node.
                yield* genCollectTokens(elementTokens.firstToken)
                yield elementTokens.firstToken

                // Save the last token to find tokens between the next token.
                lastToken = elementTokens.lastToken
            }

            // Check trailing commas.
            if (rightToken) {
                yield* genCollectTokens(rightToken)
            }
        }

        /**
         * Set offset the given node list.
         * @param {Node[]} nodeList The node to process.
         * @param {Node|null} leftToken The left parenthesis token.
         * @param {number} offset The offset to set.
         * @param {Token} baseToken The token of the base offset.
         * @returns {void}
         */
        function setOffsetToNodeList(nodeList, leftToken, offset, baseToken) {
            for (const t of genCollectNodeList(nodeList, leftToken, null)) {
                setOffsetToToken(t, offset, baseToken)
            }
        }

        /**
         * Process the given node list.
         * The first node is offsetted from the given left token.
         * Rest nodes are adjusted to the first node.
         * @param {Node[]} nodeList The node to process.
         * @param {Node|null} leftToken The left parenthesis token.
         * @param {Node|null} rightToken The right parenthesis token.
         * @param {number} offset The offset to set.
         * @returns {void}
         */
        function processNodeList(nodeList, leftToken, rightToken, offset) {
            if (nodeList.length >= 1) {
                const alignTokens = Array.from(
                    genCollectNodeList(nodeList, leftToken, rightToken)
                )
                // Set offsets.
                const baseToken = alignTokens.shift()
                if (baseToken) {
                    // Set offset to the first token.
                    if (leftToken) {
                        setOffsetToToken(baseToken, offset, leftToken)
                        // Align tokens relatively to the left token.
                        setOffsetToToken(alignTokens, offset, leftToken)
                    } else {
                        // Align the rest tokens to the first token.
                        setOffsetToToken(alignTokens, 0, baseToken)
                    }
                }
            }

            if (rightToken) {
                setOffsetToToken(rightToken, 0, leftToken)
            }
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
             * Define the function which fixes the problem.
             * @param {number} line The number of line.
             * @param {string} actualText The actual indentation text.
             * @param {ExpectedIndent} expectedIndent The expected indentation info.
             * @returns {function} The defined function.
             */
            function defineFix(line, actualText, expectedIndent) {
                return fixer => {
                    const start = sourceCode.getIndexFromLoc({
                        line,
                        column: 0,
                    })
                    const indent = expectedIndent.indentText
                    return fixer.replaceTextRange(
                        [start, start + actualText.length],
                        indent
                    )
                }
            }

            /**
             * Validate base point indentation.
             * @param {number} line The number of line.
             * @param {string} actualText The actual indentation text.
             * @param {ExpectedIndent} expectedIndent The expected indent.
             * @returns {void}
             */
            function validateBaseIndent(line, actualText, expectedIndent) {
                const expectedBaseIndentText = expectedIndent.baseIndentText
                if (
                    expectedBaseIndentText &&
                    (actualText.length < expectedBaseIndentText.length ||
                        !actualText.startsWith(expectedBaseIndentText))
                ) {
                    context.report({
                        loc: {
                            start: { line, column: 0 },
                            end: {
                                line,
                                column: actualText.length,
                            },
                        },
                        messageId: actualText
                            ? "unexpectedBaseIndentation"
                            : "missingBaseIndentation",
                        data: {
                            expected: JSON.stringify(expectedBaseIndentText),
                            actual: actualText
                                ? JSON.stringify(
                                      actualText.slice(
                                          0,
                                          expectedBaseIndentText.length
                                      )
                                  )
                                : "",
                        },
                        fix: defineFix(line, actualText, expectedIndent),
                    })
                    return false
                }
                return true
            }

            offsets.forEach((value, line) => {
                if (!inTemplateTag(line)) {
                    return
                }
                if (!getLineText(line).trim()) {
                    // empty line
                    return
                }
                const actualText = value.actualText
                const expectedIndent = getExpectedIndent(line)
                if (!expectedIndent) {
                    return
                }
                if (!validateBaseIndent(line, actualText, expectedIndent)) {
                    return
                }
                const expectedBaseIndent = expectedIndent.baseIndentText.length

                const actualRelativeText = actualText.slice(expectedBaseIndent)

                for (let i = 0; i < actualRelativeText.length; ++i) {
                    if (actualRelativeText[i] !== options.indentChar) {
                        context.report({
                            loc: {
                                start: { line, column: expectedBaseIndent + i },
                                end: {
                                    line,
                                    column: expectedBaseIndent + i + 1,
                                },
                            },
                            messageId: "unexpectedIndentationCharacter",
                            data: {
                                expected: JSON.stringify(options.indentChar),
                                actual: JSON.stringify(actualRelativeText[i]),
                            },
                            fix: defineFix(line, actualText, expectedIndent),
                        })
                        return
                    }
                }

                const actualRelativeIndent = actualRelativeText.length

                if (actualRelativeIndent !== expectedIndent.indent) {
                    context.report({
                        loc: {
                            start: { line, column: expectedBaseIndent },
                            end: { line, column: actualText.length },
                        },
                        messageId: expectedBaseIndent
                            ? "unexpectedRelativeIndentation"
                            : "unexpectedIndentation",
                        data: {
                            expectedIndent: expectedIndent.indent,
                            actualIndent: actualRelativeIndent,
                            unit,
                            expectedIndentPlural:
                                expectedIndent.indent === 1 ? "" : "s",
                            actualIndentPlural:
                                actualRelativeIndent === 1 ? "" : "s",
                        },
                        fix: defineFix(line, actualText, expectedIndent),
                    })
                }
            })
        }

        return {
            "ArrayExpression, ArrayPattern"(node) {
                processNodeList(
                    node.elements,
                    sourceCode.getFirstToken(node),
                    sourceCode.getLastToken(node),
                    1
                )
            },
            ArrowFunctionExpression(node) {
                const firstToken = sourceCode.getFirstToken(node)
                const secondToken = sourceCode.getTokenAfter(firstToken)
                const leftToken = node.async ? secondToken : firstToken
                const arrowToken = sourceCode.getTokenBefore(node.body, isArrow)

                if (node.async) {
                    // `async`
                    setOffsetToToken(secondToken, 1, firstToken)
                }
                if (isLeftParen(leftToken)) {
                    const rightToken = sourceCode.getTokenAfter(
                        last(node.params) || leftToken,
                        isRightParen
                    )
                    // `(param1, param2)`
                    processNodeList(node.params, leftToken, rightToken, 1)
                }

                // `=>`
                setOffsetToToken(arrowToken, 1, firstToken)
                // body
                processMaybeBlock(node.body, firstToken)
            },
            "AssignmentExpression, AssignmentPattern, BinaryExpression, LogicalExpression"(
                node
            ) {
                const leftToken = getChainHeadToken(node)
                const opToken = sourceCode.getTokenAfter(
                    node.left,
                    isNotRightParen
                )
                const rightToken = sourceCode.getTokenAfter(opToken)
                const prevToken = sourceCode.getTokenBefore(leftToken)
                const shouldIndent =
                    !prevToken ||
                    prevToken.loc.end.line === leftToken.loc.start.line ||
                    isBeginningOfElement(leftToken, node)

                setOffsetToToken(
                    // `= right`
                    [opToken, rightToken],
                    shouldIndent ? 1 : 0,
                    leftToken
                )
            },

            "AwaitExpression, RestElement, SpreadElement, UnaryExpression"(
                node
            ) {
                const firstToken = sourceCode.getFirstToken(node)
                const nextToken = sourceCode.getTokenAfter(firstToken)

                setOffsetToToken(nextToken, 1, firstToken)
            },

            "BlockStatement, ClassBody"(node) {
                processNodeList(
                    node.body,
                    sourceCode.getFirstToken(node),
                    sourceCode.getLastToken(node),
                    1
                )
            },

            "BreakStatement, ContinueStatement, ReturnStatement, ThrowStatement"(
                node
            ) {
                if (node.argument || node.label) {
                    const firstToken = sourceCode.getFirstToken(node)
                    const nextToken = sourceCode.getTokenAfter(firstToken)

                    setOffsetToToken(nextToken, 1, firstToken)
                }
            },

            CallExpression(node) {
                const firstToken = sourceCode.getFirstToken(node)
                const rightToken = sourceCode.getLastToken(node)
                const leftToken = sourceCode.getTokenAfter(
                    node.callee,
                    isLeftParen
                )

                // `(`
                setOffsetToToken(leftToken, 1, firstToken)
                // `(param1, param2)`
                processNodeList(node.arguments, leftToken, rightToken, 1)
            },

            CatchClause(node) {
                const firstToken = sourceCode.getFirstToken(node)
                const bodyToken = sourceCode.getFirstToken(node.body)

                if (node.param) {
                    const leftToken = sourceCode.getTokenAfter(firstToken)
                    const rightToken = sourceCode.getTokenAfter(node.param)

                    setOffsetToToken(leftToken, 1, firstToken)
                    processNodeList([node.param], leftToken, rightToken, 1)
                }
                setOffsetToToken(bodyToken, 0, firstToken)
            },

            "ClassDeclaration, ClassExpression"(node) {
                const firstToken = sourceCode.getFirstToken(node)
                const bodyToken = sourceCode.getFirstToken(node.body)

                if (node.id) {
                    setOffsetToToken(
                        sourceCode.getFirstToken(node.id),
                        1,
                        firstToken
                    )
                }
                if (node.superClass) {
                    const extendsToken = sourceCode.getTokenAfter(
                        node.id || firstToken
                    )
                    const superClassToken = sourceCode.getTokenAfter(
                        extendsToken
                    )
                    setOffsetToToken(extendsToken, 1, firstToken)
                    setOffsetToToken(superClassToken, 1, extendsToken)
                }
                setOffsetToToken(bodyToken, 0, firstToken)
            },

            ConditionalExpression(node) {
                const firstToken = sourceCode.getFirstToken(node)
                const questionToken = sourceCode.getTokenAfter(
                    node.test,
                    isNotRightParen
                )
                const consequentToken = sourceCode.getTokenAfter(questionToken)
                const colonToken = sourceCode.getTokenAfter(
                    node.consequent,
                    isNotRightParen
                )
                const alternateToken = sourceCode.getTokenAfter(colonToken)
                const isFlat =
                    node.test.loc.end.line === node.consequent.loc.start.line

                if (isFlat) {
                    setOffsetToToken(
                        [
                            questionToken,
                            consequentToken,
                            colonToken,
                            alternateToken,
                        ],
                        0,
                        firstToken
                    )
                } else {
                    setOffsetToToken([questionToken, colonToken], 1, firstToken)
                    setOffsetToToken(
                        [consequentToken, alternateToken],
                        1,
                        questionToken
                    )
                }
            },

            DoWhileStatement(node) {
                const doToken = sourceCode.getFirstToken(node)
                const whileToken = sourceCode.getTokenAfter(
                    node.body,
                    isNotRightParen
                )
                const leftToken = sourceCode.getTokenAfter(whileToken)
                const testToken = sourceCode.getTokenAfter(leftToken)
                const lastToken = sourceCode.getLastToken(node)
                const rightToken = isSemicolon(lastToken)
                    ? sourceCode.getTokenBefore(lastToken)
                    : lastToken

                processMaybeBlock(node.body, doToken)
                setOffsetToToken(whileToken, 0, doToken)
                setOffsetToToken(leftToken, 1, whileToken)
                setOffsetToToken(testToken, 1, leftToken)
                setOffsetToToken(rightToken, 0, leftToken)
            },

            ExportAllDeclaration(node) {
                const tokens = sourceCode.getTokens(node)
                const firstToken = tokens.shift()
                if (isSemicolon(last(tokens))) {
                    tokens.pop()
                }
                setOffsetToToken(tokens, 1, firstToken)
            },

            ExportDefaultDeclaration(node) {
                const exportToken = sourceCode.getFirstToken(node)
                const defaultToken = sourceCode.getFirstToken(node, 1)
                const declarationToken = getFirstAndLastTokens(node.declaration)
                    .firstToken
                setOffsetToToken(
                    [defaultToken, declarationToken],
                    1,
                    exportToken
                )
            },

            ExportNamedDeclaration(node) {
                const exportToken = sourceCode.getFirstToken(node)
                if (node.declaration) {
                    // export var foo = 1;
                    const declarationToken = sourceCode.getFirstToken(node, 1)
                    setOffsetToToken(declarationToken, 1, exportToken)
                } else {
                    // export {foo, bar}; or export {foo, bar} from "mod";
                    const leftParenToken = sourceCode.getFirstToken(node, 1)
                    const rightParenToken = sourceCode.getLastToken(
                        node,
                        isRightBrace
                    )
                    setOffsetToToken(leftParenToken, 0, exportToken)
                    processNodeList(
                        node.specifiers,
                        leftParenToken,
                        rightParenToken,
                        1
                    )

                    const maybeFromToken = sourceCode.getTokenAfter(
                        rightParenToken
                    )
                    if (
                        maybeFromToken &&
                        sourceCode.getText(maybeFromToken) === "from"
                    ) {
                        const fromToken = maybeFromToken
                        const nameToken = sourceCode.getTokenAfter(fromToken)
                        setOffsetToToken([fromToken, nameToken], 1, exportToken)
                    }
                }
            },

            ExportSpecifier(node) {
                const tokens = sourceCode.getTokens(node)
                const firstToken = tokens.shift()
                setOffsetToToken(tokens, 1, firstToken)
            },

            "ForInStatement, ForOfStatement"(node) {
                const forToken = sourceCode.getFirstToken(node)
                const leftParenToken = sourceCode.getTokenAfter(forToken)
                const leftToken = sourceCode.getTokenAfter(leftParenToken)
                const inToken = sourceCode.getTokenAfter(
                    leftToken,
                    isNotRightParen
                )
                const rightToken = sourceCode.getTokenAfter(inToken)
                const rightParenToken = sourceCode.getTokenBefore(
                    node.body,
                    isNotLeftParen
                )
                // `(`
                setOffsetToToken(leftParenToken, 1, forToken)
                // `const e`
                setOffsetToToken(leftToken, 1, leftParenToken)
                // `in` or `of`
                setOffsetToToken(inToken, 1, leftToken)
                // `array`
                setOffsetToToken(rightToken, 1, leftToken)
                // `)`
                setOffsetToToken(rightParenToken, 0, leftParenToken)
                processMaybeBlock(node.body, forToken)
            },

            ForStatement(node) {
                const forToken = sourceCode.getFirstToken(node)
                const leftParenToken = sourceCode.getTokenAfter(forToken)
                const rightParenToken = sourceCode.getTokenBefore(
                    node.body,
                    isNotLeftParen
                )

                // `(`
                setOffsetToToken(leftParenToken, 1, forToken)
                processNodeList(
                    // `let i = 0` `i < length` `i++`
                    [node.init, node.test, node.update],
                    // `(`
                    leftParenToken,
                    // `)`
                    rightParenToken,
                    1
                )
                setOffsetToToken(rightParenToken, 0, leftParenToken)
                processMaybeBlock(node.body, forToken)
            },

            "FunctionDeclaration, FunctionExpression"(node) {
                const firstToken = sourceCode.getFirstToken(node)
                if (isLeftParen(firstToken)) {
                    // Methods.
                    const leftToken = firstToken
                    const rightToken = sourceCode.getTokenAfter(
                        last(node.params) || leftToken,
                        isRightParen
                    )
                    const bodyToken = sourceCode.getFirstToken(node.body)

                    processNodeList(node.params, leftToken, rightToken, 1)
                    setOffsetToToken(
                        bodyToken,
                        0,
                        sourceCode.getFirstToken(node.parent)
                    )
                } else {
                    // Normal functions.
                    const functionToken = node.async
                        ? sourceCode.getTokenAfter(firstToken)
                        : firstToken
                    const starToken = node.generator
                        ? sourceCode.getTokenAfter(functionToken)
                        : null
                    const idToken = node.id && sourceCode.getFirstToken(node.id)
                    const leftToken = sourceCode.getTokenAfter(
                        idToken || starToken || functionToken
                    )
                    const rightToken = sourceCode.getTokenAfter(
                        last(node.params) || leftToken,
                        isRightParen
                    )
                    const bodyToken = sourceCode.getFirstToken(node.body)

                    if (node.async) {
                        setOffsetToToken(functionToken, 0, firstToken)
                    }
                    if (node.generator) {
                        setOffsetToToken(starToken, 1, firstToken)
                    }
                    if (node.id) {
                        setOffsetToToken(idToken, 1, firstToken)
                    }
                    setOffsetToToken(leftToken, 1, firstToken)
                    processNodeList(node.params, leftToken, rightToken, 1)
                    setOffsetToToken(bodyToken, 0, firstToken)
                }
            },

            IfStatement(node) {
                const ifToken = sourceCode.getFirstToken(node)
                const ifLeftParenToken = sourceCode.getTokenAfter(ifToken)
                const ifRightParenToken = sourceCode.getTokenBefore(
                    node.consequent,
                    isRightParen
                )

                // `(`
                setOffsetToToken(ifLeftParenToken, 1, ifToken)
                // `)`
                setOffsetToToken(ifRightParenToken, 0, ifLeftParenToken)
                processMaybeBlock(node.consequent, ifToken)

                if (node.alternate) {
                    // `else`
                    const elseToken = sourceCode.getTokenAfter(
                        node.consequent,
                        isNotRightParen
                    )

                    setOffsetToToken(elseToken, 0, ifToken)
                    processMaybeBlock(node.alternate, elseToken)
                }
            },

            ImportDeclaration(node) {
                const firstSpecifier = node.specifiers[0]
                const secondSpecifier = node.specifiers[1]
                const importToken = sourceCode.getFirstToken(node)
                const hasSemi = sourceCode.getLastToken(node).value === ";"
                const tokens = [] // tokens to one indent

                /**
                 * Process when the specifier does not exist
                 * @returns {void}
                 */
                function processNonSpecifier() {
                    const secondToken = sourceCode.getFirstToken(node, 1)
                    if (isLeftBrace(secondToken)) {
                        setOffsetToToken(
                            [
                                secondToken,
                                sourceCode.getTokenAfter(secondToken),
                            ],
                            0,
                            importToken
                        )
                        tokens.push(
                            sourceCode.getLastToken(node, hasSemi ? 2 : 1), // from
                            sourceCode.getLastToken(node, hasSemi ? 1 : 0) // "foo"
                        )
                    } else {
                        tokens.push(
                            sourceCode.getLastToken(node, hasSemi ? 1 : 0)
                        )
                    }
                }

                /**
                 * Process when the specifier is ImportDefaultSpecifier
                 * @returns {void}
                 */
                function processImportDefaultSpecifier() {
                    if (
                        secondSpecifier &&
                        secondSpecifier.type === "ImportNamespaceSpecifier"
                    ) {
                        // There is a pattern:
                        //     import Foo, * as foo from "foo"
                        tokens.push(
                            sourceCode.getFirstToken(firstSpecifier), // Foo
                            sourceCode.getTokenAfter(firstSpecifier), // comma
                            sourceCode.getFirstToken(secondSpecifier), // *
                            sourceCode.getLastToken(node, hasSemi ? 2 : 1), // from
                            sourceCode.getLastToken(node, hasSemi ? 1 : 0) // "foo"
                        )
                    } else {
                        // There are 3 patterns:
                        //     import Foo from "foo"
                        //     import Foo, {} from "foo"
                        //     import Foo, {a} from "foo"
                        const idToken = sourceCode.getFirstToken(firstSpecifier)
                        const nextToken = sourceCode.getTokenAfter(
                            firstSpecifier
                        )
                        if (isComma(nextToken)) {
                            const leftBrace = sourceCode.getTokenAfter(
                                nextToken
                            )
                            const rightBrace = sourceCode.getLastToken(
                                node,
                                hasSemi ? 3 : 2
                            )
                            setOffsetToToken(
                                [idToken, nextToken],
                                1,
                                importToken
                            )
                            setOffsetToToken(leftBrace, 0, idToken)
                            processNodeList(
                                node.specifiers.slice(1),
                                leftBrace,
                                rightBrace,
                                1
                            )
                            tokens.push(
                                sourceCode.getLastToken(node, hasSemi ? 2 : 1), // from
                                sourceCode.getLastToken(node, hasSemi ? 1 : 0) // "foo"
                            )
                        } else {
                            tokens.push(
                                idToken,
                                nextToken, // from
                                sourceCode.getTokenAfter(nextToken) // "foo"
                            )
                        }
                    }
                }

                /**
                 * Process when the specifier is ImportNamespaceSpecifier
                 * @returns {void}
                 */
                function processImportNamespaceSpecifier() {
                    tokens.push(
                        sourceCode.getFirstToken(firstSpecifier), // *
                        sourceCode.getLastToken(node, hasSemi ? 2 : 1), // from
                        sourceCode.getLastToken(node, hasSemi ? 1 : 0) // "foo"
                    )
                }

                /**
                 * Process when the specifier is other
                 * @returns {void}
                 */
                function processOtherSpecifier() {
                    const leftBrace = sourceCode.getFirstToken(node, 1)
                    const rightBrace = sourceCode.getLastToken(
                        node,
                        hasSemi ? 3 : 2
                    )
                    setOffsetToToken(leftBrace, 0, importToken)
                    processNodeList(node.specifiers, leftBrace, rightBrace, 1)
                    tokens.push(
                        sourceCode.getLastToken(node, hasSemi ? 2 : 1), // from
                        sourceCode.getLastToken(node, hasSemi ? 1 : 0) // "foo"
                    )
                }

                if (!firstSpecifier) {
                    // There are 2 patterns:
                    //     import "foo"
                    //     import {} from "foo"
                    processNonSpecifier()
                } else if (firstSpecifier.type === "ImportDefaultSpecifier") {
                    processImportDefaultSpecifier()
                } else if (firstSpecifier.type === "ImportNamespaceSpecifier") {
                    // There is a pattern:
                    //     import * as foo from "foo"
                    processImportNamespaceSpecifier()
                } else {
                    // There is a pattern:
                    //     import {a} from "foo"
                    processOtherSpecifier()
                }

                setOffsetToToken(tokens, 1, importToken)
            },

            ImportSpecifier(node) {
                if (node.local.range[0] !== node.imported.range[0]) {
                    const tokens = sourceCode.getTokens(node)
                    const firstToken = tokens.shift()
                    setOffsetToToken(tokens, 1, firstToken)
                }
            },

            ImportNamespaceSpecifier(node) {
                const tokens = sourceCode.getTokens(node)
                const firstToken = tokens.shift()
                setOffsetToToken(tokens, 1, firstToken)
            },

            LabeledStatement(node) {
                const labelToken = sourceCode.getFirstToken(node)
                const colonToken = sourceCode.getTokenAfter(labelToken)
                const bodyToken = sourceCode.getTokenAfter(colonToken)

                setOffsetToToken([colonToken, bodyToken], 1, labelToken)
            },

            "MemberExpression, MetaProperty"(node) {
                const objectToken = sourceCode.getFirstToken(node)
                if (node.computed) {
                    const leftBracketToken = sourceCode.getTokenBefore(
                        node.property,
                        isLeftBracket
                    )
                    const propertyToken = sourceCode.getTokenAfter(
                        leftBracketToken
                    )
                    const rightBracketToken = sourceCode.getTokenAfter(
                        node.property,
                        isRightBracket
                    )

                    setOffsetToToken(leftBracketToken, 1, objectToken)
                    setOffsetToToken(propertyToken, 1, leftBracketToken)
                    setOffsetToToken(rightBracketToken, 0, leftBracketToken)
                } else {
                    const dotToken = sourceCode.getTokenBefore(node.property)
                    const propertyToken = sourceCode.getTokenAfter(dotToken)

                    setOffsetToToken([dotToken, propertyToken], 1, objectToken)
                }
            },

            "MethodDefinition, Property"(node) {
                const isMethod =
                    node.type === "MethodDefinition" || node.method === true
                const prefixTokens = getPrefixTokens(node)
                const hasPrefix = prefixTokens.length >= 1

                for (let i = 1; i < prefixTokens.length; ++i) {
                    setOffsetToToken(prefixTokens[i], 0, prefixTokens[i - 1])
                }

                let lastKeyToken = null
                if (node.computed) {
                    const keyLeftToken = sourceCode.getFirstToken(
                        node,
                        isLeftBracket
                    )
                    const keyToken = sourceCode.getTokenAfter(keyLeftToken)
                    const keyRightToken = (lastKeyToken = sourceCode.getTokenAfter(
                        node.key,
                        isRightBracket
                    ))

                    if (hasPrefix) {
                        setOffsetToToken(keyLeftToken, 0, last(prefixTokens))
                    }
                    setOffsetToToken(keyToken, 1, keyLeftToken)
                    setOffsetToToken(keyRightToken, 0, keyLeftToken)
                } else {
                    const idToken = (lastKeyToken = sourceCode.getFirstToken(
                        node.key
                    ))

                    if (hasPrefix) {
                        setOffsetToToken(idToken, 0, last(prefixTokens))
                    }
                }

                if (isMethod) {
                    const leftParenToken = sourceCode.getTokenAfter(
                        lastKeyToken
                    )

                    setOffsetToToken(leftParenToken, 1, lastKeyToken)
                } else if (!node.shorthand) {
                    const colonToken = sourceCode.getTokenAfter(lastKeyToken)
                    const valueToken = sourceCode.getTokenAfter(colonToken)

                    setOffsetToToken([colonToken, valueToken], 1, lastKeyToken)
                }
            },

            NewExpression(node) {
                const newToken = sourceCode.getFirstToken(node)
                const calleeToken = sourceCode.getTokenAfter(newToken)
                const rightToken = sourceCode.getLastToken(node)
                const leftToken = isRightParen(rightToken)
                    ? sourceCode.getFirstTokenBetween(
                          node.callee,
                          rightToken,
                          isLeftParen
                      )
                    : null

                setOffsetToToken(calleeToken, 1, newToken)
                if (leftToken) {
                    setOffsetToToken(leftToken, 1, calleeToken)
                    processNodeList(node.arguments, leftToken, rightToken, 1)
                }
            },

            "ObjectExpression, ObjectPattern"(node) {
                processNodeList(
                    node.properties,
                    sourceCode.getFirstToken(node),
                    sourceCode.getLastToken(node),
                    1
                )
            },

            SequenceExpression(node) {
                processNodeList(node.expressions, null, null, 0)
            },

            SwitchCase(node) {
                const caseToken = sourceCode.getFirstToken(node)

                let colonToken = undefined
                if (node.test) {
                    const testToken = sourceCode.getTokenAfter(caseToken)
                    colonToken = sourceCode.getTokenAfter(
                        node.test,
                        isNotRightParen
                    )

                    setOffsetToToken([testToken, colonToken], 1, caseToken)
                } else {
                    colonToken = sourceCode.getTokenAfter(caseToken)

                    setOffsetToToken(colonToken, 1, caseToken)
                }

                if (
                    node.consequent.length === 1 &&
                    node.consequent[0].type === "BlockStatement"
                ) {
                    setOffsetToToken(
                        sourceCode.getFirstToken(node.consequent[0]),
                        0,
                        caseToken
                    )
                } else if (node.consequent.length >= 1) {
                    // setOffsetToToken(
                    //     sourceCode.getFirstToken(node.consequent[0]),
                    //     1,
                    //     caseToken
                    // )
                    // processNodeList(node.consequent, null, null, 0)
                    setOffsetToNodeList(
                        node.consequent,
                        colonToken,
                        1,
                        caseToken
                    )
                }
            },

            SwitchStatement(node) {
                const switchToken = sourceCode.getFirstToken(node)
                const leftParenToken = sourceCode.getTokenAfter(switchToken)
                const discriminantToken = sourceCode.getTokenAfter(
                    leftParenToken
                )
                const leftBraceToken = sourceCode.getTokenAfter(
                    node.discriminant,
                    isLeftBrace
                )
                const rightParenToken = sourceCode.getTokenBefore(
                    leftBraceToken
                )
                const rightBraceToken = sourceCode.getLastToken(node)

                setOffsetToToken(leftParenToken, 1, switchToken)
                setOffsetToToken(discriminantToken, 1, leftParenToken)
                setOffsetToToken(rightParenToken, 0, leftParenToken)
                setOffsetToToken(leftBraceToken, 0, switchToken)
                processNodeList(
                    node.cases,
                    leftBraceToken,
                    rightBraceToken,
                    options.switchCase
                )
            },

            TaggedTemplateExpression(node) {
                const tagTokens = getFirstAndLastTokens(node.tag, node.range[0])
                const quasiToken = sourceCode.getTokenAfter(tagTokens.lastToken)

                setOffsetToToken(quasiToken, 1, tagTokens.firstToken)
            },

            TemplateLiteral(node) {
                const firstToken = sourceCode.getFirstToken(node)
                const quasiTokens = node.quasis
                    .slice(1)
                    .map(n => sourceCode.getFirstToken(n))
                const expressionToken = node.quasis
                    .slice(0, -1)
                    .map(n => sourceCode.getTokenAfter(n))

                setOffsetToToken(quasiTokens, 0, firstToken)
                setOffsetToToken(expressionToken, 1, firstToken)
            },

            TryStatement(node) {
                const tryToken = sourceCode.getFirstToken(node)
                const tryBlockToken = sourceCode.getFirstToken(node.block)

                setOffsetToToken(tryBlockToken, 0, tryToken)

                if (node.handler) {
                    const catchToken = sourceCode.getFirstToken(node.handler)

                    setOffsetToToken(catchToken, 0, tryToken)
                }

                if (node.finalizer) {
                    const finallyToken = sourceCode.getTokenBefore(
                        node.finalizer
                    )
                    const finallyBlockToken = sourceCode.getFirstToken(
                        node.finalizer
                    )

                    setOffsetToToken(
                        [finallyToken, finallyBlockToken],
                        0,
                        tryToken
                    )
                }
            },

            UpdateExpression(node) {
                const firstToken = sourceCode.getFirstToken(node)
                const nextToken = sourceCode.getTokenAfter(firstToken)

                setOffsetToToken(nextToken, 1, firstToken)
            },

            VariableDeclaration(node) {
                processNodeList(
                    node.declarations,
                    sourceCode.getFirstToken(node),
                    null,
                    1
                )
            },

            VariableDeclarator(node) {
                if (node.init) {
                    const idToken = sourceCode.getFirstToken(node)
                    const eqToken = sourceCode.getTokenAfter(node.id)
                    const initToken = sourceCode.getTokenAfter(eqToken)

                    setOffsetToToken([eqToken, initToken], 1, idToken)
                }
            },

            "WhileStatement, WithStatement"(node) {
                const firstToken = sourceCode.getFirstToken(node)
                const leftParenToken = sourceCode.getTokenAfter(firstToken)
                const rightParenToken = sourceCode.getTokenBefore(
                    node.body,
                    isRightParen
                )

                setOffsetToToken(leftParenToken, 1, firstToken)
                setOffsetToToken(rightParenToken, 0, leftParenToken)
                processMaybeBlock(node.body, firstToken)
            },

            YieldExpression(node) {
                if (node.argument) {
                    const yieldToken = sourceCode.getFirstToken(node)

                    setOffsetToToken(
                        sourceCode.getTokenAfter(yieldToken),
                        1,
                        yieldToken
                    )
                    if (node.delegate) {
                        setOffsetToToken(
                            sourceCode.getTokenAfter(yieldToken, 1),
                            1,
                            yieldToken
                        )
                    }
                }
            },

            // Process semicolons.
            ":statement"(node) {
                const firstToken = sourceCode.getFirstToken(node)
                const lastToken = sourceCode.getLastToken(node)
                if (isSemicolon(lastToken) && firstToken !== lastToken) {
                    setOffsetToToken(lastToken, 0, firstToken)
                }

                // Set to the semicolon of the previous token for semicolon-free style.
                // E.g.,
                //   foo
                //   ;[1,2,3].forEach(f)
                const info = offsets.get(firstToken)
                const prevToken = sourceCode.getTokenBefore(firstToken)
                if (
                    info &&
                    isSemicolon(prevToken) &&
                    prevToken.loc.end.line === firstToken.loc.start.line
                ) {
                    offsets.set(prevToken, info)
                }
            },

            // Process parentheses.
            // `:expression` does not match with MetaProperty and TemplateLiteral as a bug: https://github.com/estools/esquery/pull/59
            ":expression, MetaProperty, TemplateLiteral"(node) {
                let leftToken = sourceCode.getTokenBefore(node)
                let rightToken = sourceCode.getTokenAfter(node)
                let firstToken = sourceCode.getFirstToken(node)

                while (isLeftParen(leftToken) && isRightParen(rightToken)) {
                    setOffsetToToken(firstToken, 1, leftToken)
                    setOffsetToToken(rightToken, 0, leftToken)

                    firstToken = leftToken
                    leftToken = sourceCode.getTokenBefore(leftToken)
                    rightToken = sourceCode.getTokenAfter(rightToken)
                }
            },
            "Program:exit"(node) {
                // process template tops
                for (const token of microTemplateService.getMicroTemplateTokens()) {
                    if (!token.code.trim()) {
                        return
                    }
                    const charIndex = token.code.search(/\S/u)
                    const index = token.expressionStart.range[1] + charIndex
                    const loc = sourceCode.getLocFromIndex(index)
                    if (!offsets.has(loc.line)) {
                        setOffsetToLoc(loc, 0, token)
                    }
                }

                // Top-level process.
                if (node.body.length) {
                    const nodeList = [].concat(node.body)
                    const firstToken = sourceCode.getFirstToken(node.body[0])
                    const lastToken = sourceCode.getLastToken(
                        node.body[node.body.length - 1]
                    )
                    let before = sourceCode.getTokenBefore(firstToken, {
                        includeComments: true,
                    })
                    while (before) {
                        nodeList.unshift(before)
                        before = sourceCode.getTokenBefore(before, {
                            includeComments: true,
                        })
                    }
                    let after = sourceCode.getTokenAfter(lastToken, {
                        includeComments: true,
                    })
                    while (after) {
                        nodeList.push(after)
                        after = sourceCode.getTokenAfter(after, {
                            includeComments: true,
                        })
                    }
                    const tokens = Array.from(
                        genCollectNodeList(nodeList, null, null)
                    )

                    let baseToken = tokens.shift()
                    for (const token of tokens) {
                        if (!offsets.has(token.loc.start.line)) {
                            setOffsetToToken(token, 0, baseToken)
                        }
                        baseToken = token
                    }
                }

                // validate
                validateIndent()
            },
        }
    },
}
