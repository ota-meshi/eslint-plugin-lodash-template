"use strict"

const parseHtml = require("./html-parser")
const Traverser = require("./traverser")
const commentDirective = require("./comment-directive")

/**
 * Traverse the given AST tree.
 * @param {object} node Root node to traverse.
 * @param {object} visitor Visitor.
 * @returns {void}
 */
function traverseNodes(node, visitor) {
    Traverser.traverse(node, {
        enter(child, parent) {
            const sel = child.type
            if (visitor[sel]) {
                visitor[sel](child, parent)
            }
        },

        leave(child, parent) {
            const sel = `${child.type}:exit`
            if (visitor[sel]) {
                visitor[sel](child, parent)
            }
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
     * @param {int} index Range index of the desired node.
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
