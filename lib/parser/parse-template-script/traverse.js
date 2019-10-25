"use strict"

// eslint-disable-next-line @mysticatea/node/no-unpublished-require
const visitorKeys = require("eslint-visitor-keys").KEYS

/**
 * Check that the given key should be traversed or not.
 * @this {Traversable}
 * @param key The key to check.
 * @returns `true` if the key should be traversed.
 */
function fallbackKeysFilter(key) {
    let value = null
    return (
        key !== "comments" &&
        key !== "leadingComments" &&
        key !== "loc" &&
        key !== "parent" &&
        key !== "range" &&
        key !== "tokens" &&
        key !== "trailingComments" &&
        (value = this[key]) !== null &&
        typeof value === "object" &&
        (typeof value.type === "string" || Array.isArray(value))
    )
}

/**
 * Get the keys of the given node to traverse it.
 * @param node The node to get.
 * @returns The keys to traverse.
 */
function getFallbackKeys(node) {
    return Object.keys(node).filter(fallbackKeysFilter, node)
}

/**
 * Check wheather a given value is a node.
 * @param x The value to check.
 * @returns `true` if the value is a node.
 */
function isNode(x) {
    return x !== null && typeof x === "object" && typeof x.type === "string"
}

/**
 * Traverse the given node.
 * @param node The node to traverse.
 * @param parent The parent node.
 * @param visitor The node visitor.
 */
function traverse(node, parent, visitor) {
    let i = 0
    let j = 0

    visitor.enterNode(node, parent)

    const keys =
        (visitor.visitorKeys || visitorKeys)[node.type] || getFallbackKeys(node)
    for (i = 0; i < keys.length; ++i) {
        const child = node[keys[i]]

        if (Array.isArray(child)) {
            for (j = 0; j < child.length; ++j) {
                if (isNode(child[j])) {
                    traverse(child[j], node, visitor)
                }
            }
        } else if (isNode(child)) {
            traverse(child, node, visitor)
        }
    }

    visitor.leaveNode(node, parent)
}

//------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------

/**
 * Traverse the given AST tree.
 * @param node Root node to traverse.
 * @param visitor Visitor.
 */
function traverseNodes(node, visitor) {
    traverse(node, null, visitor)
}

module.exports = {
    traverseNodes,
    getFallbackKeys,
}
