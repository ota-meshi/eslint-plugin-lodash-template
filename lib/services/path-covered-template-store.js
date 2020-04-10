"use strict"

/**
 * Traverse the given node.
 * @param {object} visitorKeys The visitorKeys.
 * @param {object} node The node to traverse.
 * @param {object} parent The parent node.
 * @param {object} visitor Visitor.
 * @returns {void}
 */
function traverseAst(visitorKeys, node, parent, visitor) {
    if (visitor[node.type]) {
        visitor[node.type](node, parent)
    }

    const keys = visitorKeys[node.type]
    for (const key of keys) {
        const child = node[key]

        if (Array.isArray(child)) {
            for (const c of child) {
                if (c) {
                    traverseAst(visitorKeys, c, node, visitor)
                }
            }
        } else if (child) {
            traverseAst(visitorKeys, child, node, visitor)
        }
    }
}

/**
 * path covered Template
 */
class PathCoveredTemplate {
    /**
     * constructor
     * @param {string} template The template.
     * @param {[number, number][]} stripedRanges The striped ranges
     */
    constructor(template, stripedRanges) {
        this.template = template
        this.stripedRanges = stripedRanges
    }

    /**
     * Checks whether targetIndex is held or not
     * @param {number} targetIndex The target index.
     * @returns {boolean} `true` if targetNode is held
     */
    isHeldTarget(targetIndex) {
        for (const range of this.stripedRanges) {
            if (range[0] <= targetIndex && targetIndex < range[1]) {
                return false
            }
        }
        return true
    }
}

/**
 * Get template with alternate statements striped.
 * @param {string} baseTemplate The template part
 * @param {Array} branchStatements The branch statements
 * @param {number} targetIndex The target index of path.
 * @returns {PathCoveredTemplate} path covered template
 */
function createPathCoveredTemplate(
    baseTemplate,
    branchStatements,
    targetIndex
) {
    let template = baseTemplate
    const stripedRanges = []

    /**
     * Strip template  of range.
     * @param  {number} start The start index of range.
     * @param  {number} end The end index of range.
     * @returns {void}
     */
    function strip(start, end) {
        const before = template.slice(0, start)
        const target = template.slice(start, end)
        const after = template.slice(end)
        template = before + target.replace(/\S/gu, " ") + after
        stripedRanges.push([start, end])
    }

    /**
     * Check whether the given node has a `break`.
     * @param {Token} node The node to check
     * @returns {boolean} `true` if the given node has a `break`.
     */
    function hasBreak(caseNode) {
        return caseNode.consequent.some((n) => n.type === "BreakStatement")
    }

    const visitor = {
        IfStatement(node) {
            if (
                node.alternate.range[0] <= targetIndex &&
                targetIndex < node.alternate.range[1]
            ) {
                strip(node.consequent.range[0], node.consequent.range[1])
            } else {
                strip(node.alternate.range[0], node.alternate.range[1])
            }
        },
        SwitchStatement(node) {
            let casesStack = []
            const fallthroughGroups = []
            for (const n of node.cases) {
                casesStack.push(n)
                if (hasBreak(n)) {
                    fallthroughGroups.push(casesStack)
                    casesStack = []
                }
            }
            if (casesStack.length) {
                fallthroughGroups.push(casesStack)
            }

            let groupIndex = fallthroughGroups.findIndex((cur, index) => {
                const next = fallthroughGroups[index + 1]
                const endIndex = next ? next[0].range[0] : node.range[1]
                return cur[0].range[0] <= targetIndex && targetIndex < endIndex
            })
            if (groupIndex < 0) {
                groupIndex = 0
            }

            fallthroughGroups.forEach((cur, index) => {
                if (index === groupIndex) {
                    return
                }
                const next = fallthroughGroups[index + 1]
                const endIndex = next ? next[0].range[0] : node.range[1]
                strip(cur[0].range[0], endIndex)
            })
        },
    }
    for (const node of branchStatements) {
        visitor[node.type](node)
    }

    return new PathCoveredTemplate(template, stripedRanges)
}

module.exports = class PathCoveredTemplateStore {
    /**
     * constructor
     * @param {Program} ast The script ast
     * @param {object} visitorKeys The visitorKeys.
     * @param {string} template The template part
     */
    constructor(ast, visitorKeys, template) {
        const branchStatements = []
        traverseAst(visitorKeys, ast, null, {
            IfStatement(node) {
                if (node.alternate) {
                    branchStatements.push(node)
                }
            },
            SwitchStatement(node) {
                if (node.cases.length >= 2) {
                    branchStatements.push(node)
                }
            },
        })
        this._branchStatements = branchStatements
        this._template = template
        this._store = []
    }

    /**
     * Check if have a branch statement
     * @returns {boolean} `true` if have a branch statement
     */
    hasBranchStatements() {
        return Boolean(this._branchStatements.length)
    }

    /**
     * Get the template that covers the path that reaches the given targetIndex.
     * @param {number} targetIndex The target index.
     * @returns {PathCoveredTemplate} The template with path covering targetIndex
     */
    getPathCoveredTemplate(targetIndex) {
        for (const pathCovered of this._store) {
            if (pathCovered.isHeldTarget(targetIndex)) {
                return pathCovered
            }
        }
        const pathCovered = createPathCoveredTemplate(
            this._template,
            this._branchStatements,
            targetIndex
        )
        this._store.push(pathCovered)
        return pathCovered
    }

    /**
     * Get all templates that cover all paths.
     * @returns {PathCoveredTemplate[]} all templates that cover all paths.
     */
    getAllTemplates() {
        const map = new Map()
        let index = 0
        while (this._template.length > index) {
            const template = this.getPathCoveredTemplate(index)
            map.set(template.template, template)
            const findTargetIndex = index
            const nextStripedRange = template.stripedRanges.find(
                (stripedRange) => stripedRange[0] > findTargetIndex
            )
            if (nextStripedRange) {
                index = nextStripedRange[0]
            } else {
                break
            }
        }
        return Array.from(map.values())
    }
}
