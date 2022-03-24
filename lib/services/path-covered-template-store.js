"use strict"

const {
    getConditionsForTruthy,
    getConditionsForFalsy,
} = require("./conditions")
const Traverser = require("./traverser")

/**
 * @typedef {import('./micro-template-service')} MicroTemplateService
 * @typedef {import('estree').Node} Node
 * @typedef {import('estree').Token} Token
 * @typedef {import('eslint').AST.Program} Program
 * @typedef {import('estree').IfStatement} IfStatement
 * @typedef {import('estree').SwitchStatement} SwitchStatement
 * @typedef {import('estree').SwitchCase} SwitchCase
 * @typedef {import('./conditions').Condition} Condition
 */

/**
 * Traverse the given node.
 * @param {object} visitorKeys The visitorKeys.
 * @param {Node} node The node to traverse.
 * @param {object} visitor Visitor.
 * @returns {void}
 */
function traverseAst(visitorKeys, node, visitor) {
    Traverser.traverse(node, {
        visitorKeys,
        enter(n) {
            if (visitor[n.type]) {
                visitor[n.type](n)
            }
        },
    })
}

/**
 * Checks whether given statement node has branch nor not
 * @param {IfStatement | SwitchStatement} node
 */
function hasBranch(node) {
    return node.type === "IfStatement" ? node.alternate : node.cases.length >= 2
}

/**
 * Path covered template
 */
class PathCoveredTemplate {
    /**
     * constructor
     * @param {string} template The template.
     */
    constructor(template) {
        this.template = template
        /** @type {[number, number][]} The striped ranges  */
        this._stripedRanges = []
        this._stripedRangesSorted = false
    }

    get stripedRanges() {
        if (!this._stripedRangesSorted) {
            this._stripedRanges.sort((a, b) => a[0] - b[0] || a[1] - b[1])
            this._stripedRangesSorted = true
        }
        return this._stripedRanges
    }

    /**
     * Checks whether targetIndex is hold or not
     * @param {number} targetIndex The target index.
     * @returns {boolean} `true` if targetNode is hold
     */
    isHoldTarget(targetIndex) {
        for (const range of this.stripedRanges) {
            if (range[0] <= targetIndex && targetIndex < range[1]) {
                return false
            }
        }
        return true
    }

    /**
     * Strip template  of range.
     * @param  {number} start The start index of range.
     * @param  {number} end The end index of range.
     * @returns {void}
     */
    strip(start, end) {
        const before = this.template.slice(0, start)
        const target = this.template.slice(start, end)
        const after = this.template.slice(end)
        this.template = before + target.replace(/\S/gu, " ") + after
        this._stripedRanges.push([start, end])
        this._stripedRangesSorted = false
    }
}

/**
 * Branch context
 */
class BranchContext {
    /**
     * constructor
     * @param {Program} ast The script ast
     * @param {object} visitorKeys The visitorKeys.
     * @param {MicroTemplateService} templateService The template service
     */
    constructor(ast, visitorKeys, templateService) {
        /** @type {IfStatement[]} */
        const ifStatements = []
        /** @type {SwitchStatement[]} */
        const switchStatements = []
        traverseAst(visitorKeys, ast, {
            /** @param {IfStatement} node */
            IfStatement(node) {
                ifStatements.push(node)
            },
            /** @param {SwitchStatement} node */
            SwitchStatement(node) {
                switchStatements.push(node)
            },
        })
        this._ifStatements = ifStatements
        this._switchStatements = switchStatements
        this._templateService = templateService
    }

    /**
     * Check if have a branch statement
     * @returns {boolean} `true` if have a branch statement
     */
    hasBranchStatements() {
        return (
            this._ifStatements.some(hasBranch) ||
            this._switchStatements.some(hasBranch)
        )
    }

    /**
     * Get template with alternate statements striped.
     * @param {number} targetIndex The target index of path.
     * @returns {PathCoveredTemplate} path covered template
     */
    createPathCoveredTemplate(targetIndex) {
        const pathCoveredTemplate = new PathCoveredTemplate(
            this._templateService.template,
        )

        this.stripIfBlockOnUnusedBranches(pathCoveredTemplate, targetIndex)
        this.stripSwitchCaseOnUnusedBranches(pathCoveredTemplate, targetIndex)

        return pathCoveredTemplate
    }

    /**
     * @param {PathCoveredTemplate} pathCoveredTemplate
     * @param {number} targetIndex
     */
    stripIfBlockOnUnusedBranches(pathCoveredTemplate, targetIndex) {
        const scriptText = this._templateService.script

        const falsyConditions = new Set()

        /**
         * @param {IfStatement} node
         */
        function useConsequent(node) {
            for (const condition of getConditionsForTruthy(
                node.test,
                scriptText,
            )) {
                condition.not.expressions.forEach((e) => falsyConditions.add(e))
            }
            if (hasBranch(node)) {
                pathCoveredTemplate.strip(
                    node.alternate.range[0],
                    node.alternate.range[1],
                )
            }
        }

        /**
         * @param {IfStatement} node
         */
        function useAlternate(node) {
            for (const condition of getConditionsForFalsy(
                node.test,
                scriptText,
            )) {
                condition.expressions.forEach((e) => falsyConditions.add(e))
            }
            pathCoveredTemplate.strip(
                node.consequent.range[0],
                node.consequent.range[1],
            )
        }

        const outsideStatements = []

        for (const node of this._ifStatements) {
            if (
                node.consequent.range[0] <= targetIndex &&
                targetIndex < node.consequent.range[1]
            ) {
                useConsequent(node)
                continue
            }
            if (
                hasBranch(node) &&
                node.alternate.range[0] <= targetIndex &&
                targetIndex < node.alternate.range[1]
            ) {
                useAlternate(node)
                continue
            }
            outsideStatements.push(node)
        }
        for (const node of outsideStatements) {
            const truthy = getConditionsForTruthy(node.test, scriptText)
            if (
                truthy.every((condition) => {
                    if (
                        condition.expressions.some((e) =>
                            falsyConditions.has(e),
                        )
                    ) {
                        // The `if` condition cannot be `true`
                        // because the condition contained in `falsyConditions` must be `false`.
                        return false
                    }
                    return true
                })
            ) {
                useConsequent(node)
            } else {
                useAlternate(node)
            }
        }
    }

    /**
     * @param {PathCoveredTemplate} pathCoveredTemplate
     * @param {number} targetIndex
     */
    stripSwitchCaseOnUnusedBranches(pathCoveredTemplate, targetIndex) {
        for (const node of this._switchStatements.filter(hasBranch)) {
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
                pathCoveredTemplate.strip(cur[0].range[0], endIndex)
            })
        }

        /**
         * Check whether the given node has a `break`.
         * @param {SwitchCase} caseNode The node to check
         * @returns {boolean} `true` if the given node has a `break`.
         */
        function hasBreak(caseNode) {
            return caseNode.consequent.some((n) => n.type === "BreakStatement")
        }
    }
}

module.exports = class PathCoveredTemplateStore {
    /**
     * constructor
     * @param {Program} ast The script ast
     * @param {object} visitorKeys The visitorKeys.
     * @param {MicroTemplateService} templateService The template service
     */
    constructor(ast, visitorKeys, templateService) {
        this._context = new BranchContext(ast, visitorKeys, templateService)
        this._template = templateService.template
        this._store = []
    }

    /**
     * Check if have a branch statement
     * @returns {boolean} `true` if have a branch statement
     */
    hasBranchStatements() {
        return this._context.hasBranchStatements()
    }

    /**
     * Get the template that covers the path that reaches the given targetIndex.
     * @param {number} targetIndex The target index.
     * @returns {PathCoveredTemplate} The template with path covering targetIndex
     */
    getPathCoveredTemplate(targetIndex) {
        for (const pathCovered of this._store) {
            if (pathCovered.isHoldTarget(targetIndex)) {
                return pathCovered
            }
        }
        const pathCovered = this._context.createPathCoveredTemplate(targetIndex)
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
                (stripedRange) => stripedRange[0] > findTargetIndex,
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
