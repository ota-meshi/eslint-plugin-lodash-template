"use strict"

const COMMENT_DIRECTIVE_B = /^\s*(eslint-(?:en|dis)able)(?:\s+(\S|\S[\s\S]*\S))?\s*$/
const COMMENT_DIRECTIVE_L = /^\s*(eslint-disable(?:-next)?-line)(?:\s+(\S|\S[\s\S]*\S))?\s*$/

/**
 * The comment directive context
 */
class CommentDirectiveContext {
    /**
     * constructor
     */
    constructor() {
        this._directives = []
    }

    /**
     * Enable rules.
     * @param {{line:number,column:number}} loc The location information to enable.
     * @param {string} group The group to enable.
     * @param {string[]} rules The rule IDs to enable.
     * @returns {void}
     */
    enable(loc, group, rules) {
        this._directives.push({
            type: "enable",
            loc,
            group,
            rules,
        })
    }

    /**
     * Disable rules.
     * @param {{line:number,column:number}} loc The location information to disable.
     * @param {string} group The group to disable.
     * @param {string[]} rules The rule IDs to disable.
     * @returns {void}
     */
    disable(loc, group, rules) {
        this._directives.push({
            type: "disable",
            loc,
            group,
            rules,
        })
    }

    /**
     * The post-process.
     * @returns {void}
     */
    postprocess() {
        this._directives.sort((a, b) => {
            if (a.loc.line < b.loc.line) {
                return -1
            }
            if (b.loc.line < a.loc.line) {
                return 1
            }
            if (a.loc.column < b.loc.column) {
                return -1
            }
            if (b.loc.column < a.loc.column) {
                return 1
            }
            if (a.type !== b.type) {
                return a.type === "enable" ? -1 : 1
            }
            return 0
        })
        const state = {
            block: {
                disableAll: undefined,
                disableRules: new Map(),
            },
            line: {
                disableAll: undefined,
                disableRules: new Map(),
            },
        }
        const directiveLocations = []
        for (const directive of this._directives) {
            const rules = directive.rules
            const type = directive.type
            const group = directive.group
            const loc = directive.loc
            switch (type) {
                case "disable":
                    if (!rules.length) {
                        if (!state[group].disableAll) {
                            const obj = {
                                loc: {
                                    start: loc,
                                },
                            }
                            state[group].disableAll = obj
                            directiveLocations.push(obj)
                        }
                    } else {
                        for (const rule of rules) {
                            if (!state[group].disableRules.has(rule)) {
                                const obj = {
                                    rule,
                                    loc: {
                                        start: loc,
                                    },
                                }
                                state[group].disableRules.set(rule, obj)
                                directiveLocations.push(obj)
                            }
                        }
                    }
                    break
                case "enable":
                    if (!rules.length) {
                        const obj = state[group].disableAll
                        if (obj) {
                            obj.loc.end = loc
                            state[group].disableAll = undefined
                        }
                    } else {
                        for (const rule of rules) {
                            const obj = state[group].disableRules.get(rule)
                            if (obj) {
                                obj.loc.end = loc
                                state[group].disableRules.delete(rule)
                            }
                        }
                    }
                    break
                default:
                    break
            }
        }
        this.directiveLocations = directiveLocations
    }

    /**
     * Check whether the message is disable rule.
     * @param {object} message The message.
     * @returns {boolean} `true` if the message  is disable rule.
     */
    isDisableMessage(message) {
        if (!this.directiveLocations) {
            return false
        }
        for (const directiveLocation of this.directiveLocations) {
            if (
                !directiveLocation.rule ||
                directiveLocation.rule === message.ruleId
            ) {
                if (
                    messageWithinRange(
                        message,
                        directiveLocation.loc.start,
                        directiveLocation.loc.end || {
                            line: message.line,
                            column: message.column,
                        }
                    )
                ) {
                    return true
                }
            }
        }
        return false
    }
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
 * Parse a given comment.
 * @param {RegExp} pattern The RegExp pattern to parse.
 * @param {string} comment The comment value to parse.
 * @returns {({type:string,rules:string[]})|null} The parsing result.
 */
function parse(pattern, comment) {
    const match = pattern.exec(comment)
    if (match == null) {
        return null
    }

    const type = match[1]
    const rules = (match[2] || "")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)

    return { type, rules }
}

/**
 * Process a given comment token.
 * If the comment is `eslint-disable` or `eslint-enable` then it reports the comment.
 * @param {CommentDirectiveContext} context The comment directive context.
 * @param {Token} comment The comment token to process.
 * @returns {void}
 */
function processBlock(context, comment) {
    const parsed = parse(COMMENT_DIRECTIVE_B, comment.value)
    if (parsed != null) {
        if (parsed.type === "eslint-disable") {
            context.disable(comment.loc.start, "block", parsed.rules)
        } else {
            context.enable(comment.loc.end, "block", parsed.rules)
        }
    }
}

/**
 * Process a given comment token.
 * If the comment is `eslint-disable-line` or `eslint-disable-next-line` then it reports the comment.
 * @param {CommentDirectiveContext} context The comment directive context.
 * @param {Token} comment The comment token to process.
 * @returns {void}
 */
function processLine(context, comment) {
    const parsed = parse(COMMENT_DIRECTIVE_L, comment.value)
    if (parsed != null && comment.loc.start.line === comment.loc.end.line) {
        const line =
            comment.loc.start.line +
            (parsed.type === "eslint-disable-line" ? 0 : 1)
        const column = -1
        context.disable({ line, column }, "line", parsed.rules)
        context.enable({ line: line + 1, column }, "line", parsed.rules)
    }
}

module.exports = {
    /**
     * Create the comment directive context.
     *
     * @param {boolean} needCheck need check flg.
     * @param {string} html The html.
     * @param {MicroTemplateService} microTemplateService MicroTemplateService.
     * @returns {CommentDirectiveContext} The comment directive context.
     */
    createCommentDirectiveContext(needCheck, html, microTemplateService) {
        const context = new CommentDirectiveContext()
        if (needCheck) {
            if (html.indexOf("eslint-") < 0) {
                return context
            }
        }
        microTemplateService.traverseDocumentNodes({
            HTMLComment(comment) {
                processBlock(context, comment)
                processLine(context, comment)
            },
        })

        context.postprocess()
        return context
    },
}
