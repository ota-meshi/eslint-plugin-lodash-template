"use strict"

const EventEmitter = require("events")
const esquery = require("esquery")
const parseHtml = require("./html-parser")
const Traverser = require("./traverser")
const commentDirective = require("./comment-directive")
const BranchedHTMLStore = require("./BranchedHTMLStore")

/**
 * Parses a raw selector string, and throws a useful error if parsing fails.
 * @param {string} rawSelector A raw AST selector
 * @returns {Selector} An object (from esquery) describing the matching behavior of this selector
 * @throws An error if the selector is invalid
 */
function tryParseSelector(rawSelector) {
    try {
        return esquery.parse(rawSelector.replace(/:exit$/u, ""))
    } catch (err) {
        if (typeof err.offset === "number") {
            throw new Error(
                `Syntax error in selector "${rawSelector}" at position ${err.offset}: ${err.message}`
            )
        }
        throw err
    }
}

/**
 * Parses a raw selector string, and returns the parsed selector along with specificity and type information.
 * @param {string} rawSelector A raw AST selector
 * @returns {ASTSelector} A selector descriptor
 */
function parseSelector(rawSelector) {
    const parsedSelector = tryParseSelector(rawSelector)

    return {
        rawSelector,
        isExit: rawSelector.endsWith(":exit"),
        parsedSelector,
    }
}

/**
 * NodeEventGenerator
 */
class NodeEventGenerator {
    /**
     * constructor
     * @param {object} visitor The visitor.
     * @returns {NodeEventGenerator} NodeEventGenerator.
     */
    constructor(visitor) {
        const emitter = (this.emitter = new EventEmitter())
        this.currentAncestry = []
        this.anyTypeEnterSelectors = []
        this.anyTypeExitSelectors = []

        for (const rawSelector of Object.keys(visitor)) {
            if (typeof rawSelector === "symbol") {
                continue
            }
            emitter.on(rawSelector, visitor[rawSelector])
            const selector = parseSelector(rawSelector)
            ;(selector.isExit
                ? this.anyTypeExitSelectors
                : this.anyTypeEnterSelectors
            ).push(selector)
        }
    }

    /**
     * Checks a selector against a node, and emits it if it matches
     * @param {Token} node The node to check
     * @param {Selector} selector An AST selector descriptor
     * @returns {void}
     */
    applySelector(node, selector) {
        if (
            esquery.matches(node, selector.parsedSelector, this.currentAncestry)
        ) {
            this.emitter.emit(selector.rawSelector, node)
        }
    }

    /**
     * Applies all appropriate selectors to a node, in specificity order
     * @param {Token} node The node to check
     * @param {boolean} isExit `false` if the node is currently being entered, `true` if it's currently being exited
     * @returns {void}
     */
    applySelectors(node, isExit) {
        const anyTypeSelectors = isExit
            ? this.anyTypeExitSelectors
            : this.anyTypeEnterSelectors
        let anyTypeSelectorsIndex = 0
        while (anyTypeSelectorsIndex < anyTypeSelectors.length) {
            this.applySelector(node, anyTypeSelectors[anyTypeSelectorsIndex++])
        }
    }

    /**
     * Emits an event of entering AST node.
     * @param {Token} node - A node which was entered.
     * @returns {void}
     */
    enterNode(node) {
        if (node.parent) {
            this.currentAncestry.unshift(node.parent)
        }
        this.applySelectors(node, false)
    }

    /**
     * Emits an event of leaving AST node.
     * @param {Token} node - A node which was left.
     * @returns {void}
     */
    leaveNode(node) {
        this.applySelectors(node, true)
        this.currentAncestry.shift()
    }
}

/**
 * Traverse the given tokens.
 * @param {Token|Token[]} tokens tokens.
 * @param {object} options The option object.
 * @returns {void}
 */
function traverse(tokens, options) {
    const traverser = new Traverser()
    const nodes = Array.isArray(tokens) ? tokens : [tokens]
    for (const node of nodes) {
        traverser.traverse(node, options)
        if (traverser.isBroken()) {
            return
        }
    }
}

/**
 * Traverse the given AST tree.
 * @param {object} nodes Root node to traverse.
 * @param {object} visitor Visitor.
 * @returns {void}
 */
function traverseNodes(nodes, visitor) {
    const ne = new NodeEventGenerator(visitor)
    traverse(nodes, {
        enter(child) {
            ne.enterNode(child)
        },

        leave(child) {
            ne.leaveNode(child)
        },
    })
}

/**
 * Find for the token that hit on the given test.
 * @param {object} node Root node to traverse.
 * @param {function} test test.
 * @returns {Token|null} The token that hit on the given test
 */
function findToken(node, test) {
    let find = null
    traverse(node, {
        enter(child) {
            if (test(child)) {
                find = child
                this.break()
            }
        },
    })
    return find
}

/**
 * Check whether the location is in range location.
 * @param {object} loc The location.
 * @param {object} start The start location.
 * @param {object} end The end location.
 * @returns {boolean} `true` if the location is in range location.
 */
function locationInRangeLoc(loc, start, end) {
    if (loc.line < start.line || end.line < loc.line) {
        return false
    }
    if (loc.line === start.line) {
        if (start.column > loc.column) {
            return false
        }
    }
    if (loc.line === end.line) {
        if (loc.column >= end.column) {
            return false
        }
    }
    return true
}

/**
 * Check whether the location is in token.
 * @param {object|number} loc The location or index.
 * @param {object} token The token.
 * @returns {boolean} `true` if the location is in token.
 */
function inToken(loc, token) {
    if (typeof loc === "number") {
        return token.range[0] <= loc && loc < token.range[1]
    }
    return locationInRangeLoc(loc, token.loc.start, token.loc.end)
}

/**
 * The traverser class to traverse cache tokens.
 * @param {object} tokens The tokens.
 */
class FlattenTraverser {
    /**
     * constructor
     * @param {object} tokens The tokens.
     */
    constructor(tokens) {
        if (Array.isArray(tokens)) {
            this.tokens = tokens
        } else {
            this.tokens = [tokens]
        }
    }

    /**
     * Traverse the given tokens.
     * @param {object} visitor Visitor.
     * @returns {void}
     */
    traverseTokens(visitor) {
        const ne = new NodeEventGenerator(visitor)
        if (this._flatten) {
            for (const n of this._flatten) {
                ne[n.name](n.node)
            }
            return
        }
        const flatten = (this._flatten = [])
        traverse(this.tokens, {
            enter(child) {
                ne.enterNode(child)
                flatten.push({
                    name: "enterNode",
                    node: child,
                })
            },

            leave(child) {
                ne.leaveNode(child)
                flatten.push({
                    name: "leaveNode",
                    node: child,
                })
            },
        })
    }
}

/**
 * The parser service
 * @param {object} options The constructor option.
 */
class MicroTemplateService {
    /**
     * constructor
     * @param {object} options The constructor option.
     */
    constructor(options) {
        this.sourceCodeText = options.code
        this.template = options.template
        this.script = options.script
        this._microTemplateTokens = options.microTemplateTokens
        this._sourceCodeStore = options.sourceCodeStore
        this._ast = options.ast
    }

    /**
     * Get the code text.
     * @returns {string} The code text.
     */
    get text() {
        return this.sourceCodeText
    }

    /**
     * Get the micro-template tokens.
     * @returns {Array} The micro-template tokens.
     */
    getMicroTemplateTokens() {
        return this._microTemplateTokens
    }

    /**
     * Get the html ast.
     * @returns {object} The html ast.
     */
    getDocument() {
        return this._doc || (this._doc = this.parseHtml(this.template))
    }

    /**
     * Parse the given html.
     * @param {string} html The html source code to parse.
     * @returns {object} The parsing result.
     */
    parseHtml(html) {
        return parseHtml(html, this._sourceCodeStore)
    }

    /**
     * Traverse the document tree.
     * @param {object} visitor Visitor.
     * @returns {void}
     */
    traverseDocumentNodes(visitor) {
        if (!this._documentFlattenTraverser) {
            this._documentFlattenTraverser = new FlattenTraverser(
                this.getDocument()
            )
        }
        this._documentFlattenTraverser.traverseTokens(visitor)
    }

    /**
     * Traverse the micro-template tokens.
     * @param {object} visitor Visitor.
     * @returns {void}
     */
    traverseMicroTemplates(visitor) {
        if (!this._microTemplateFlattenTraverser) {
            this._microTemplateFlattenTraverser = new FlattenTraverser(
                this.getMicroTemplateTokens()
            )
        }
        this._microTemplateFlattenTraverser.traverseTokens(visitor)
    }

    /* eslint-disable class-methods-use-this */
    /**
     * Traverse the given tokens.
     * @param {Token|Token[]} tokens tokens.
     * @param {object} visitor Visitor.
     * @returns {void}
     */
    traverseTokens(tokens, visitor) {
        /* eslint-enable class-methods-use-this */
        traverseNodes(tokens, visitor)
    }

    /* eslint-disable class-methods-use-this */
    /**
     * Find for the token that hit on the given test.
     * @param {Token|Token[]} tokens tokens.
     * @param {function} test test.
     * @returns {Token|null} The token that hit on the given test
     */
    findToken(tokens, test) {
        /* eslint-enable class-methods-use-this */
        return findToken(tokens, test)
    }

    /**
     * Get the template tag token containing a range index.
     * @param {number} index Range index of the desired node.
     * @returns {Token} The token if found or null if not found.
     */
    getTemplateTagByRangeIndex(index) {
        return this.getMicroTemplateTokens().find(
            t => t.range[0] <= index && index < t.range[1]
        )
    }

    /**
     * Check whether the location is in template.
     * @param {object|index} loc The location or index.
     * @returns {boolean} `true` if the location is in template.
     */
    inTemplate(loc) {
        return !this.inTemplateTag(loc)
    }

    /**
     * Check whether the location is in template tag.
     * @param {object|index} loc The location or index.
     * @returns {boolean} `true` if the location is in template tag.
     */
    inTemplateTag(loc) {
        for (const token of this.getMicroTemplateTokens()) {
            if (inToken(loc, token)) {
                return true
            }
        }
        return false
    }

    /**
     * Check whether the location is in interpolate or escape.
     * @param {object|index} loc The location or index.
     * @returns {boolean} `true` if the location is in interpolate or escape.
     */
    inInterpolateOrEscape(loc) {
        for (const token of this.getMicroTemplateTokens().filter(
            t =>
                t.type === "MicroTemplateEscape" ||
                t.type === "MicroTemplateInterpolate"
        )) {
            if (inToken(loc, token)) {
                return true
            }
        }
        return false
    }

    /**
     * Check whether the location is in delimiter marks.
     * @param {object|index} loc The location or index.
     * @returns {boolean} `true` if the location is in delimiter marks.
     */
    inDelimiterMarks(loc) {
        for (const token of this.getMicroTemplateTokens()) {
            for (const delimiter of [
                token.expressionStart,
                token.expressionEnd,
            ]) {
                if (inToken(loc, delimiter)) {
                    return true
                }
            }
        }
        return false
    }

    /**
     * Check whether the message is disable rule.
     * @param {object} message The message.
     * @returns {boolean} `true` if the message  is disable rule.
     */
    isDisableMessage(message) {
        if (!this._commentDirectiveContext) {
            this._commentDirectiveContext = commentDirective.createCommentDirectiveContext(
                !this._doc,
                this.template,
                this
            )
        }
        return this._commentDirectiveContext.isDisableMessage(message)
    }

    /**
     * Get branch-processed HTML document holding the targetNode
     * @param {ASTNode} targetNode The target node.
     * @param {SourceCode} sourceCode The source code.
     * @returns {BranchedHTML} Branch-processed HTML
     */
    getBranchProcessedHtmlDocument(targetNode, sourceCode) {
        if (!this._branchedHTMLStore) {
            this._branchedHTMLStore = new BranchedHTMLStore(sourceCode, this)
        }
        if (!this._branchedHTMLStore.hasBranchStatements()) {
            return this.getDocument()
        }
        return this._branchedHTMLStore.getBranchProcessedHtmlDocument(
            targetNode
        )
    }

    /**
     * Get a Node that matches the targetNode from the branch-processed HTML document holding the targetNode.
     * @param {ASTNode} targetNode The target node.
     * @param {SourceCode} sourceCode The source code.
     * @returns {BranchedHTML} Branch-processed HTML
     */
    getBranchProcessedHtmlNode(targetNode, sourceCode) {
        const doc = this.getBranchProcessedHtmlDocument(targetNode, sourceCode)
        return this.findToken(
            doc,
            n =>
                n.type === targetNode.type &&
                n.range[0] === targetNode.range[0] &&
                n.range[1] === targetNode.range[1]
        )
    }

    /**
     * Gets all script tokens that are contained to the micro-template given node.
     * @param {Node} node - The micro-template node.
     * @returns {object} The tokens infomation.
     */
    getMicroTemplateTokensInfo(node) {
        const scriptInfo = node._scriptInfo || (node._scriptInfo = {})
        if (scriptInfo.tokens) {
            return scriptInfo.tokens
        }

        const open = node.expressionStart
        const close = node.expressionEnd
        const innerTokens = this.getTokens(open.range[1], close.range[0])
        const tokens = this.getTokens(node.range[0], node.range[1])

        scriptInfo.tokens = {
            innerTokens,
            tokens,
        }

        return scriptInfo.tokens
    }

    /**
     * Get the ExpressionStatement of the given micro-template node.
     * @param {Node} node - The micro-template node.
     * @param {SourceCode} sourceCode The source code.
     * @returns {ExpressionStatement|null} The expression statement.
     */
    getMicroTemplateExpressionStatement(node, sourceCode) {
        const scriptInfo = node._scriptInfo || (node._scriptInfo = {})
        if (scriptInfo.statement !== undefined) {
            return scriptInfo.statement
        }

        /**
         * Find the ExpressionStatement of range.
         * @param {number} start - The start of range.
         * @param {numnber} end - The end of range.
         * @returns {ExpressionStatement} The expression statement.
         */
        function findExpressionStatement(start, end) {
            let target = sourceCode.getNodeByRangeIndex(start)
            while (
                target &&
                target.range[1] <= end &&
                start <= target.range[0]
            ) {
                if (
                    target.type === "ExpressionStatement" &&
                    start === target.range[0] &&
                    target.range[1] === end
                ) {
                    return target
                }
                target = target.parent
            }
            return null
        }

        const tokenInfo = this.getMicroTemplateTokensInfo(node)
        const tokens = tokenInfo.tokens

        const first = tokens[0]
        const last = tokens[tokens.length - 1]
        scriptInfo.statement =
            findExpressionStatement(first.range[0], last.range[1]) || null
        if (!scriptInfo.statement) {
            const innerTokens = tokenInfo.innerTokens
            const innerFirst = innerTokens[0]
            const innerLast = innerTokens[innerTokens.length - 1]
            if (last.value === ";" && innerLast.value === ";") {
                scriptInfo.statement =
                    findExpressionStatement(
                        innerFirst.range[0],
                        innerLast.range[1]
                    ) || null
            }
        }
        return scriptInfo.statement
    }

    /**
     * Gets all tokens that are contained to the given range.
     * @param {number} start - The start of range.
     * @param {number} end - The end of range.
     * @returns {Token[]} Array of objects representing tokens.
     */
    getTokens(start, end) {
        const results = []
        for (const token of this._ast.tokens) {
            if (token.range[1] <= start) {
                continue
            }
            if (end <= token.range[0]) {
                break
            }
            results.push(token)
        }
        return results
    }
}

module.exports = MicroTemplateService
