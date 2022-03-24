// @ts-check
"use strict"

/**
 * @typedef {import('estree').Expression} Expression
 * @typedef {import('estree').BinaryExpression} BinaryExpression
 */

/**
 * @type {Record<BinaryExpression['operator'], BinaryExpression['operator'] | undefined>}
 */
const NOT_OPS = {
    "!=": "==",
    "!==": "===",
    "===": "!==",
    "==": "!=",
    "<": ">=",
    "<=": ">",
    ">": "<=",
    ">=": "<",
}

/**
 * @type {Record<BinaryExpression['operator'], BinaryExpression['operator'] | undefined>}
 */
const REVERSE_OPS = {
    "==": "==",
    "===": "===",
    "!==": "!==",
    "!=": "!=",
    "<": ">",
    "<=": ">=",
    ">": "<",
    ">=": "<=",
    "*": "*",
    "+": "+",
}
/**
 * Expression condition
 */
class Condition {
    /**
     * Creates the Condition instance
     * @param {Expression} node
     * @param {string} scriptText
     */
    static create(node, scriptText) {
        if (node.type === "UnaryExpression" && node.operator === "!") {
            const not = Condition.create(node.argument, scriptText)
            return not.not
        }
        if (node.type === "BinaryExpression") {
            // eslint-disable-next-line no-use-before-define -- ignore
            return new ConditionForBinaryExpression(node, scriptText)
        }

        return new Condition([getExpressionText(node, scriptText)])
    }

    /**
     * constructor
     * @param {string[]} [expressions]
     */
    constructor(expressions) {
        this._expressions = expressions
    }

    /**
     * Returns an array of the text of the expression. For example, `a === b` also includes` b === a`.
     * @returns {string[]}
     */
    get expressions() {
        if (this._expressions) {
            return this._expressions
        }
        return (this._expressions = [...this.getExpressionsInternal()])
    }

    /**
     * Returns the `Not` condition.
     * @returns {Condition}
     */
    get not() {
        if (this._not) {
            return this._not
        }
        // eslint-disable-next-line no-use-before-define -- ignore
        return (this._not = new NotCondition(this))
    }
}

class NotCondition extends Condition {
    /**
     * constructor
     * @param {Condition} condition
     */
    constructor(condition) {
        super()
        this.condition = condition
    }

    /**
     * @returns {Iterable<string>}
     */
    *getExpressionsInternal() {
        yield* this.condition.expressions.map((e) => `!(${e})`)
    }

    /**
     * @returns {Condition}
     */
    get not() {
        return this.condition
    }
}

class ConditionForBinaryExpression extends Condition {
    /**
     * constructor
     * @param {BinaryExpression} node
     * @param {string} scriptText
     */
    constructor(node, scriptText) {
        super()
        this.node = node
        this.scriptText = scriptText
    }

    /**
     * @returns {Iterable<string>}
     */
    *getExpressionsInternal() {
        const { node, scriptText } = this
        const left = getExpressionText(node.left, scriptText)
        const right = getExpressionText(node.right, scriptText)
        yield `(${right})${node.operator}(${left})`
        const reverseOp = REVERSE_OPS[node.operator]
        if (!reverseOp) {
            return
        }
        yield `(${right})${reverseOp}(${left})`
    }

    get not() {
        if (this._not) {
            return this._not
        }
        // eslint-disable-next-line no-use-before-define -- ignore
        return (this._not = new NotConditionForBinaryExpression(this))
    }
}

class NotConditionForBinaryExpression extends NotCondition {
    /**
     * constructor
     * @param {ConditionForBinaryExpression} condition
     */
    constructor(condition) {
        super()
        this.condition = condition
    }

    /**
     * @returns {Iterable<string>}
     */
    *getExpressionsInternal() {
        const { node, scriptText } = this.condition
        const op = NOT_OPS[node.operator]
        if (!op) {
            yield* super.getExpressionsInternal()
            return
        }
        const left = getExpressionText(node.left, scriptText)
        const right = getExpressionText(node.right, scriptText)
        yield `(${left})${op}(${right})`
        const reverseOp = REVERSE_OPS[op]
        if (!reverseOp) {
            return
        }
        yield `(${right})${reverseOp}(${left})`
    }
}

module.exports = { Condition }

/**
 * Get expression text from node
 */
function getExpressionText(node, scriptText) {
    return scriptText.slice(...node.range).replace(/\s/gu, "")
}
