"use strict"

class Condition {
    /**
     * @param {Expression} node
     * @param {string} scriptText
     * @returns {Condition}
     */
    static create(node, scriptText) {
        if (node.type === "UnaryExpression" && node.operator === "!") {
            const not = Condition.create(node.argument, scriptText)
            return not.not
        }
        // eslint-disable-next-line no-use-before-define -- ignore
        return new ConditionForNode(node, scriptText)
    }

    /**
     * @param {string} text
     * @param {Condition | ((c: Condition) => string)} not
     */
    constructor(text, not) {
        this.text = text
        if (typeof not === "function") {
            this._getNotText = not
        } else {
            this._not = not
        }
    }

    get not() {
        if (this._not) {
            return this._not
        }
        return (this._not = new Condition(this._getNotText(this), this))
    }
}
class ConditionForNode extends Condition {
    /**
     * @param {Expression} node
     * @param {string} scriptText
     * @returns {Condition}
     */
    constructor(node, scriptText) {
        super(getTextFromNode(node), (condition) => {
            if (node.type === "BinaryExpression") {
                const op =
                    node.operator === "!=" || node.operator === "!=="
                        ? `=${node.operator.slice(1)}`
                        : node.operator === "==" || node.operator === "==="
                        ? `!${node.operator.slice(1)}`
                        : node.operator === "<"
                        ? ">="
                        : node.operator === "<="
                        ? ">"
                        : node.operator === ">="
                        ? "<"
                        : node.operator === ">"
                        ? "<="
                        : null
                if (op) {
                    return `${getTextFromNode(node.left)}${op}${getTextFromNode(
                        node.right,
                    )}`
                }
            }

            return `!(${condition.text})`
        })

        /**
         * Get text from node
         */
        function getTextFromNode(n) {
            return scriptText.slice(...n.range).replace(/\s/gu, "")
        }
    }
}

module.exports = { Condition, getConditionsForTruthy, getConditionsForFalsy }

const cacheConditions = new WeakMap()

/**
 * @param {Expression} node
 * @param {string} scriptText
 * @returns {Condition[]}
 */
function getConditionsForTruthy(node, scriptText) {
    let cache = cacheConditions.get(node)
    if (!cache) {
        cache = {}
        cacheConditions.set(node, cache)
    }
    if (cache.truthy) {
        return cache.truthy
    }

    const tokens = [...getConditionsForTruthyWithoutCache(node, scriptText)]
    cache.truthy = tokens
    return tokens
}

/**
 * @param {Expression} node
 * @param {string} scriptText
 * @returns {Condition[]}
 */
function getConditionsForFalsy(node, scriptText) {
    let cache = cacheConditions.get(node)
    if (!cache) {
        cache = {}
        cacheConditions.set(node, cache)
    }
    if (cache.falsy) {
        return cache.falsy
    }

    const tokens = [...getConditionsForFalsyWithoutCache(node, scriptText)]
    cache.falsy = tokens
    return tokens
}

/**
 * @param {Expression} node
 * @param {string} scriptText
 * @returns {Iterable<Condition>}
 */
function getConditionsForTruthyWithoutCache(node, scriptText) {
    return getConditions0(node, {
        scriptText,
        logicalOperator: "&&",
        getConditionsFromNode: (n) => getConditionsForTruthy(n, scriptText),
        getConditionsFromNodeForNot: (n) =>
            getConditionsForFalsy(n, scriptText),
    })
}

/**
 * @param {Expression} node
 * @param {string} scriptText
 * @returns {Iterable<Condition>}
 */
function getConditionsForFalsyWithoutCache(node, scriptText) {
    return getConditions0(node, {
        scriptText,
        logicalOperator: "||",
        getConditionsFromNode: (n) => getConditionsForFalsy(n, scriptText),
        getConditionsFromNodeForNot: (n) =>
            getConditionsForTruthy(n, scriptText),
    })
}

/**
 * @returns {Iterable<Condition>}
 */
function* getConditions0(
    node,
    {
        scriptText,
        logicalOperator,
        getConditionsFromNode,
        getConditionsFromNodeForNot,
    },
) {
    if (node.type === "LogicalExpression") {
        if (node.operator === logicalOperator) {
            yield* getConditionsFromNode(node.left)
            yield* getConditionsFromNode(node.right)
            return
        }
    } else if (node.type === "UnaryExpression") {
        if (node.operator === "!") {
            // Normalize
            for (const condition of getConditionsFromNodeForNot(
                node.argument,
            )) {
                yield condition.not
            }
            return
        }
    } else if (node.type === "CallExpression") {
        if (
            node.callee.type === "Identifier" &&
            node.callee.name === "Boolean" &&
            node.arguments.length === 1 &&
            node.arguments[0]
        ) {
            // Normalize
            yield* getConditionsFromNode(node.arguments[0])
            return
        }
    }
    yield Condition.create(node, scriptText)
}
