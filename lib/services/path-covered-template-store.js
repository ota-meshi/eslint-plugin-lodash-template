"use strict"

/**
 * @typedef {import('./micro-template-service')} MicroTemplateService
 * @typedef {import('estree').Node} Node
 * @typedef {import('estree').Token} Token
 * @typedef {import('eslint').AST.Program} Program
 * @typedef {import('estree').IfStatement} IfStatement
 * @typedef {import('estree').SwitchStatement} SwitchStatement
 * @typedef {import('estree').SwitchCase} SwitchCase
 * @typedef {import('estree').Expression} Expression
 */
/**
 * @typedef {IfStatement & { alternate: NonNullable<IfStatement['alternate']> }} HasBranchIfStatement
 * @typedef {HasBranchIfStatement | SwitchStatement} HasBranchStatement
 */
/**
 * Traverse the given node.
 * @param {object} visitorKeys The visitorKeys.
 * @param {Node} node The node to traverse.
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
        this.stripedRanges = []
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
        this.stripedRanges.push([start, end])
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
        traverseAst(visitorKeys, ast, null, {
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
        const outsideStatements = []

        const truthyConditions = []
        const falsyConditions = []
        for (const node of this._ifStatements) {
            if (
                node.consequent.range[0] <= targetIndex &&
                targetIndex < node.consequent.range[1]
            ) {
                truthyConditions.push(...this.getConditionTokens(node.test))
                if (hasBranch(node)) {
                    pathCoveredTemplate.strip(
                        node.alternate.range[0],
                        node.alternate.range[1],
                    )
                }
                continue
            }
            if (!hasBranch(node)) {
                outsideStatements.push(node)
                continue
            }
            if (
                node.alternate.range[0] <= targetIndex &&
                targetIndex < node.alternate.range[1]
            ) {
                falsyConditions.push(...this.getConditionTokens(node.test))
                pathCoveredTemplate.strip(
                    node.consequent.range[0],
                    node.consequent.range[1],
                )
                continue
            }
            outsideStatements.push(node)
        }
        for (const node of outsideStatements) {
            const conditionTokens = this.getConditionTokens(node.test)
            if (
                conditionTokens.every((conditionToken) =>
                    falsyConditions.includes(conditionToken),
                )
                // conditionTokens.some(conditionToken=>useIfBlockNotConditions.)
            ) {
                pathCoveredTemplate.strip(
                    node.consequent.range[0],
                    node.consequent.range[1],
                )
            } else if (hasBranch(node)) {
                pathCoveredTemplate.strip(
                    node.alternate.range[0],
                    node.alternate.range[1],
                )
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

    /**
     * @param {Expression} node test node
     */
    getConditionTokens(node) {
        const cacheConditionTokens =
            this._cacheConditionTokens ||
            (this._cacheConditionTokens = new Map())
        let cache = cacheConditionTokens.get(node)
        if (cache) {
            return cache
        }

        const tokens = [...this.getConditionTokensWithoutCache(node)]
        cacheConditionTokens.set(node, tokens)
        return tokens
    }

    /**
     * @param {Expression} node
     */
    *getConditionTokensWithoutCache(node) {
        if (node.type === "LogicalExpression") {
            if (node.operator === "&&") {
                yield* this.getConditionTokens(node.left)
                yield* this.getConditionTokens(node.right)
                return
            }
        } else if (node.type === "UnaryExpression") {
            if (
                node.operator === "!" &&
                node.argument.type === "UnaryExpression" &&
                node.argument.operator === "!"
            ) {
                // Normalize
                yield* this.getConditionTokens(node.argument.argument)
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
                yield* this.getConditionTokens(node.arguments[0])
                return
            }
        }
        yield this.getTextFromNode(node)
    }

    getTextFromNode(node) {
        return this._templateService.script.slice(...node.range)
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
