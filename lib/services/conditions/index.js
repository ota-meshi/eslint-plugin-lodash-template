// @ts-check
"use strict";

/**
 * @typedef {import('estree').Expression} Expression
 */

const { Condition } = require("./condition");

module.exports = { Condition, getConditionsForTruthy, getConditionsForFalsy };

const cacheConditions = new WeakMap();

/**
 * @param {Expression} node
 * @param {string} scriptText
 * @returns {Condition[]}
 */
function getConditionsForTruthy(node, scriptText) {
    let cache = cacheConditions.get(node);
    if (!cache) {
        cache = {};
        cacheConditions.set(node, cache);
    }
    if (cache.truthy) {
        return cache.truthy;
    }

    const tokens = [...getConditionsForTruthyWithoutCache(node, scriptText)];
    cache.truthy = tokens;
    return tokens;
}

/**
 * @param {Expression} node
 * @param {string} scriptText
 * @returns {Condition[]}
 */
function getConditionsForFalsy(node, scriptText) {
    let cache = cacheConditions.get(node);
    if (!cache) {
        cache = {};
        cacheConditions.set(node, cache);
    }
    if (cache.falsy) {
        return cache.falsy;
    }

    const tokens = [...getConditionsForFalsyWithoutCache(node, scriptText)];
    cache.falsy = tokens;
    return tokens;
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
    });
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
    });
}

/**
 * @param {Expression} node
 * @param {object} o
 * @param {string} o.scriptText
 * @param {'&&' | '||'} o.logicalOperator
 * @param {(e: Expression) => Condition} o.getConditionsFromNode
 * @param {(e: Expression) => Condition} o.getConditionsFromNodeForNot
 * @returns {Iterable<Condition>}
 */
function* getConditions0(
    node,
    {
        scriptText,
        logicalOperator,
        getConditionsFromNode,
        getConditionsFromNodeForNot,
    }
) {
    if (node.type === "LogicalExpression") {
        if (node.operator === logicalOperator) {
            yield* getConditionsFromNode(node.left);
            yield* getConditionsFromNode(node.right);
            return;
        }
    } else if (node.type === "UnaryExpression") {
        if (node.operator === "!") {
            // Normalize
            for (const condition of getConditionsFromNodeForNot(
                node.argument
            )) {
                yield condition.not;
            }
            return;
        }
    } else if (node.type === "CallExpression") {
        if (
            node.callee.type === "Identifier" &&
            node.callee.name === "Boolean" &&
            node.arguments.length === 1 &&
            node.arguments[0]
        ) {
            // Normalize
            yield* getConditionsFromNode(node.arguments[0]);
            return;
        }
    }
    yield Condition.create(node, scriptText);
}
