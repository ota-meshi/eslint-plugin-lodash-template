"use strict"

const EventEmitter = require("events")
const esquery = require("esquery")
const parseHtml = require("./html-parser")
const Traverser = require("./traverser")
const commentDirective = require("./comment-directive")

/**
 * Parses a raw selector string, and throws a useful error if parsing fails.
 * @param {string} rawSelector A raw AST selector
 * @returns {Selector} An object (from esquery) describing the matching behavior of this selector
 * @throws An error if the selector is invalid
 */
function tryParseSelector(rawSelector) {
    try {
        return esquery.parse(rawSelector.replace(/:exit$/, ""))
    } catch (err) {
        if (typeof err.offset === "number") {
            throw new Error(
                `Syntax error in selector "${rawSelector}" at position ${
                    err.offset
                }: ${err.message}`
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
 * Traverse the given AST tree.
 * @param {object} node Root node to traverse.
 * @param {object} visitor Visitor.
 * @returns {void}
 */
function traverseNodes(node, visitor) {
    const ne = new NodeEventGenerator(visitor)
    Traverser.traverse(node, {
        enter(child) {
            ne.enterNode(child)
        },

        leave(child) {
            ne.leaveNode(child)
        },
    })
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
        this._tokenBuilder = options.tokenBuilder
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
        return parseHtml(html, this._tokenBuilder)
    }

    /**
     * Traverse the document tree.
     * @param {object} visitor Visitor.
     * @returns {void}
     */
    traverseDocumentNodes(visitor) {
        this.traverseTokens(this.getDocument(), visitor)
    }

    /**
     * Traverse the micro-template tokens.
     * @param {object} visitor Visitor.
     * @returns {void}
     */
    traverseMicroTemplates(visitor) {
        this.traverseTokens(this.getMicroTemplateTokens(), visitor)
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
        if (Array.isArray(tokens)) {
            for (const token of tokens) {
                traverseNodes(token, visitor)
            }
        } else {
            traverseNodes(tokens, visitor)
        }
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
}

module.exports = MicroTemplateService
