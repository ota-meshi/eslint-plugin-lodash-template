"use strict"

const parseHtml = require("./html-parser")
const commentDirective = require("./comment-directive")

const KEYS = require("./visitor-keys.json")

/**
 * Traverse the given node.
 * @param {object} node The node to traverse.
 * @param {object} parent The parent node.
 * @param {object} visitor Visitor.
 * @returns {void}
 */
function traverse(node, parent, visitor) {
    visitor.enterNode(node, parent)

    const keys = KEYS[node.type]
    for (const key of keys) {
        const child = node[key]

        if (Array.isArray(child)) {
            for (const c of child) {
                if (c) {
                    traverse(c, node, visitor)
                }
            }
        } else if (child) {
            traverse(child, node, visitor)
        }
    }

    visitor.leaveNode(node, parent)
}

/**
 * Traverse the given AST tree.
 * @param {object} node Root node to traverse.
 * @param {object} visitor Visitor.
 * @returns {void}
 */
function traverseNodes(node, visitor) {
    traverse(node, null, {
        enterNode(child, parent) {
            const sel = child.type
            if (visitor[sel]) {
                visitor[sel](child, parent)
            }
        },

        leaveNode(child, parent) {
            const sel = `${child.type}:exit`
            if (visitor[sel]) {
                visitor[sel](child, parent)
            }
        },
    })
}

/**
 * Check whether the message within range location.
 * @param {object} message The message.
 * @param {object} start The start location.
 * @param {object} end The end location.
 * @returns {boolean} `true` if the message within range location.
 */
function messageWithinRange(message, start, end) {
    if (message.line < start.line || end.line < message.line) {
        return false
    }
    if (message.line === start.line) {
        return start.column <= message.column
    }
    if (message.line === end.line) {
        return message.column < end.column
    }
    return true
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
        return (
            this._doc ||
            (this._doc = parseHtml(this.template, this._tokenBuilder))
        )
    }

    /**
     * Traverse the given document tree.
     * @param {object} visitor Visitor.
     * @returns {void}
     */
    traverseDocumentNodes(visitor) {
        traverseNodes(this.getDocument(), visitor)
    }

    /**
     * Traverse the given micro-template tokens.
     * @param {object} visitor Visitor.
     * @returns {void}
     */
    traverseMicroTemplates(visitor) {
        for (const token of this.getMicroTemplateTokens()) {
            traverseNodes(token, visitor)
        }
    }

    /**
     * Check whether the message within template.
     * @param {object} message The message.
     * @returns {boolean} `true` if the message within template.
     */
    messageWithinTemplate(message) {
        let templateStart = { line: 0, column: 0 }
        for (const token of this.getMicroTemplateTokens()) {
            if (messageWithinRange(message, templateStart, token.loc.start)) {
                return true
            }
            templateStart = token.loc.end
        }
        return false
    }

    /**
     * Check whether the message within interpolate or escape.
     * @param {object} message The message.
     * @returns {boolean} `true` if the message within interpolate or escape.
     */
    messageWithinInterpolateOrEscape(message) {
        for (const token of this.getMicroTemplateTokens().filter(
            t =>
                t.type === "MicroTemplateEscape" ||
                t.type === "MicroTemplateInterpolate"
        )) {
            if (messageWithinRange(message, token.loc.start, token.loc.end)) {
                return true
            }
        }
        return false
    }

    /**
     * Check whether the message within delimiter marks.
     * @param {object} message The message.
     * @returns {boolean} `true` if the message within delimiter marks.
     */
    messageWithinDelimiterMarks(message) {
        for (const token of this.getMicroTemplateTokens()) {
            for (const delimiter of [
                token.expressionStart,
                token.expressionEnd,
            ]) {
                if (
                    messageWithinRange(
                        message,
                        delimiter.loc.start,
                        delimiter.loc.end
                    )
                ) {
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
                this
            )
        }
        return this._commentDirectiveContext.isDisableMessage(message)
    }
}

module.exports = MicroTemplateService
