"use strict"

const EventEmitter = require("events")
const esquery = require("esquery")
const parseHtml = require("./html-parser")
const Traverser = require("./traverser")
const commentDirective = require("./comment-directive")

/**
 * Creates an array of unique values.
 *
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 */
function union() {
    const set = new Set()
    for (const arr of arguments) {
        for (const e of arr) {
            set.add(e)
        }
    }
    return Array.from(set.values())
}

/**
 * Creates an array of unique values that are included in all given arrays.
 *
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 *
 * intersection([2, 1], [2, 3])
 * // => [2]
 */
function intersection() {
    if (!arguments.length) {
        return []
    }
    const intersectionSet = new Set(arguments[0])
    for (const arr of arguments) {
        const set = new Set(arr)
        for (const e of intersectionSet) {
            if (!set.has(e)) {
                intersectionSet.delete(e)
            }
        }
    }
    return Array.from(intersectionSet.values())
}

/**
 * Compares the specificity of two selector objects, with CSS-like rules.
 * @param {Selector} selectorA An AST selector descriptor
 * @param {Selector} selectorB Another AST selector descriptor
 * @returns {number}
 * a value less than 0 if selectorA is less specific than selectorB
 * a value greater than 0 if selectorA is more specific than selectorB
 * a value less than 0 if selectorA and selectorB have the same specificity, and selectorA <= selectorB alphabetically
 * a value greater than 0 if selectorA and selectorB have the same specificity, and selectorA > selectorB alphabetically
 */
function compareSpecificity(selectorA, selectorB) {
    return (
        selectorA.attributeCount - selectorB.attributeCount ||
        selectorA.identifierCount - selectorB.identifierCount ||
        (selectorA.rawSelector <= selectorB.rawSelector ? -1 : 1)
    )
}

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
 * Counts the number of class, pseudo-class, and attribute queries in this selector
 * @param {Selector} parsedSelector An object (from esquery) describing the selector's matching behavior
 * @returns {number} The number of class, pseudo-class, and attribute queries in this selector
 */
function countClassAttributes(parsedSelector) {
    switch (parsedSelector.type) {
        case "child":
        case "descendant":
        case "sibling":
        case "adjacent":
            return (
                countClassAttributes(parsedSelector.left) +
                countClassAttributes(parsedSelector.right)
            )

        case "compound":
        case "not":
        case "matches":
            return parsedSelector.selectors.reduce(
                (sum, childSelector) =>
                    sum + countClassAttributes(childSelector),
                0
            )

        case "attribute":
        case "field":
        case "nth-child":
        case "nth-last-child":
            return 1

        default:
            return 0
    }
}

/**
 * Counts the number of identifier queries in this selector
 * @param {Selector} parsedSelector An object (from esquery) describing the selector's matching behavior
 * @returns {number} The number of identifier queries
 */
function countIdentifiers(parsedSelector) {
    switch (parsedSelector.type) {
        case "child":
        case "descendant":
        case "sibling":
        case "adjacent":
            return (
                countIdentifiers(parsedSelector.left) +
                countIdentifiers(parsedSelector.right)
            )

        case "compound":
        case "not":
        case "matches":
            return parsedSelector.selectors.reduce(
                (sum, childSelector) => sum + countIdentifiers(childSelector),
                0
            )

        case "identifier":
            return 1

        default:
            return 0
    }
}

/**
 * Gets the possible types of a selector
 * @param {Selector} parsedSelector An object (from esquery) describing the matching behavior of the selector
 * @returns {string[]} The node types that could possibly trigger this selector, or `null` if all node types could trigger it
 */
function getPossibleTypes(parsedSelector) {
    switch (parsedSelector.type) {
        case "identifier":
            return [parsedSelector.value]

        case "matches": {
            const typesForComponents = parsedSelector.selectors.map(
                getPossibleTypes
            )

            if (typesForComponents.every(Boolean)) {
                return union.apply(null, typesForComponents)
            }
            return null
        }

        case "compound": {
            const typesForComponents = parsedSelector.selectors
                .map(getPossibleTypes)
                .filter(typesForComponent => typesForComponent)

            // If all of the components could match any type, then the compound could also match any type.
            if (!typesForComponents.length) {
                return null
            }

            // If at least one of the components could only match a particular type, the compound could only match
            // the intersection of those types.
            return intersection.apply(null, typesForComponents)
        }

        case "child":
        case "descendant":
        case "sibling":
        case "adjacent":
            return getPossibleTypes(parsedSelector.right)

        default:
            return null
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
        listenerTypes: getPossibleTypes(parsedSelector),
        attributeCount: countClassAttributes(parsedSelector),
        identifierCount: countIdentifiers(parsedSelector),
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
        this.enterSelectorsByNodeType = new Map()
        this.exitSelectorsByNodeType = new Map()
        this.anyTypeEnterSelectors = []
        this.anyTypeExitSelectors = []

        for (const rawSelector of Object.keys(visitor)) {
            if (typeof rawSelector === "symbol") {
                continue
            }
            emitter.on(rawSelector, visitor[rawSelector])
            const selector = parseSelector(rawSelector)

            if (selector.listenerTypes) {
                for (const nodeType of selector.listenerTypes) {
                    const typeMap = selector.isExit
                        ? this.exitSelectorsByNodeType
                        : this.enterSelectorsByNodeType

                    let selectors = typeMap.get(nodeType)
                    if (selectors == null) {
                        typeMap.set(nodeType, (selectors = []))
                    }
                    selectors.push(selector)
                }
            } else {
                ;(selector.isExit
                    ? this.anyTypeExitSelectors
                    : this.anyTypeEnterSelectors
                ).push(selector)
            }
        }

        this.anyTypeEnterSelectors.sort(compareSpecificity)
        this.anyTypeExitSelectors.sort(compareSpecificity)
        for (const selectorList of this.enterSelectorsByNodeType.values()) {
            selectorList.sort(compareSpecificity)
        }
        for (const selectorList of this.exitSelectorsByNodeType.values()) {
            selectorList.sort(compareSpecificity)
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
        const selectorsByNodeType =
            (isExit
                ? this.exitSelectorsByNodeType
                : this.enterSelectorsByNodeType
            ).get(node.type) || []
        const anyTypeSelectors = isExit
            ? this.anyTypeExitSelectors
            : this.anyTypeEnterSelectors
        let selectorsByTypeIndex = 0
        let anyTypeSelectorsIndex = 0
        while (
            selectorsByTypeIndex < selectorsByNodeType.length ||
            anyTypeSelectorsIndex < anyTypeSelectors.length
        ) {
            if (
                selectorsByTypeIndex >= selectorsByNodeType.length ||
                (anyTypeSelectorsIndex < anyTypeSelectors.length &&
                    compareSpecificity(
                        anyTypeSelectors[anyTypeSelectorsIndex],
                        selectorsByNodeType[selectorsByTypeIndex]
                    ) < 0)
            ) {
                this.applySelector(
                    node,
                    anyTypeSelectors[anyTypeSelectorsIndex++]
                )
            } else {
                this.applySelector(
                    node,
                    selectorsByNodeType[selectorsByTypeIndex++]
                )
            }
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
