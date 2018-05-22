"use strict"

const KEYS = require("./visitor-keys.json")

/**
 * Do nothing.
 * @returns {void}
 */
function noop() {
    // do nothing.
}

/**
 * Check whether the given value is an ASTNode or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if the value is an ASTNode.
 */
function isNode(x) {
    return x !== null && typeof x === "object" && typeof x.type === "string"
}

/**
 * Get the visitor keys of a given node.
 * @param {object} visitorKeys The map of visitor keys.
 * @param {ASTNode} node The node to get their visitor keys.
 * @returns {string[]} The visitor keys of the node.
 */
function getVisitorKeys(visitorKeys, node) {
    const keys = visitorKeys[node.type]

    // if (!keys) {
    //     keys = vk.getKeys(node);
    //     debug("Unknown node type \"%s\": Estimated visitor keys %j", node.type, keys);
    // }

    return keys
}

/**
 * The traverser class to traverse AST trees.
 */
class Traverser {
    /**
     * constructor
     * @returns {void}
     */
    constructor() {
        this._current = null
        this._parents = []
        this._skipped = false
        this._broken = false
        this._visitorKeys = null
        this._enter = null
        this._leave = null
    }

    /**
     * @returns {ASTNode} The current node.
     */
    current() {
        return this._current
    }

    /**
     * @returns {ASTNode[]} The ancestor nodes.
     */
    parents() {
        return this._parents.slice(0)
    }

    /**
     * Break the current traversal.
     * @returns {void}
     */
    break() {
        this._broken = true
    }

    /**
     * Skip child nodes for the current traversal.
     * @returns {void}
     */
    skip() {
        this._skipped = true
    }

    /**
     * Traverse the given AST tree.
     * @param {ASTNode} node The root node to traverse.
     * @param {object} options The option object.
     * @returns {void}
     */
    traverse(node, options) {
        this._current = null
        this._parents = []
        this._skipped = false
        this._broken = false
        this._visitorKeys = options.visitorKeys || KEYS
        this._enter = options.enter || noop
        this._leave = options.leave || noop
        this._traverse(node, null)
    }

    /**
     * Traverse the given AST tree recursively.
     * @param {ASTNode} node The current node.
     * @param {ASTNode|null} parent The parent node.
     * @returns {void}
     * @private
     */
    _traverse(node, parent) {
        if (!isNode(node)) {
            return
        }

        this._current = node
        this._skipped = false
        this._enter(node, parent)

        if (!this._skipped && !this._broken) {
            const keys = getVisitorKeys(this._visitorKeys, node)

            if (keys.length >= 1) {
                this._parents.push(node)
                for (let i = 0; i < keys.length && !this._broken; ++i) {
                    const child = node[keys[i]]

                    if (Array.isArray(child)) {
                        for (
                            let j = 0;
                            j < child.length && !this._broken;
                            ++j
                        ) {
                            this._traverse(child[j], node)
                        }
                    } else {
                        this._traverse(child, node)
                    }
                }
                this._parents.pop()
            }
        }

        if (!this._broken) {
            this._leave(node, parent)
        }

        this._current = parent
    }

    /**
     * Traverse the given AST tree.
     * @param {ASTNode} node The root node to traverse.
     * @param {object} options The option object.
     * @returns {void}
     */
    static traverse(node, options) {
        new Traverser().traverse(node, options)
    }
}

module.exports = Traverser
