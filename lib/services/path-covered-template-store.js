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
                truthyConditions.push(...this.getConditionsForTruthy(node.test))
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
                falsyConditions.push(...this.getConditionsForFalsy(node.test))
                pathCoveredTemplate.strip(
                    node.consequent.range[0],
                    node.consequent.range[1],
                )
                continue
            }
            outsideStatements.push(node)
        }
        for (const node of outsideStatements) {
            const truthy = this.getConditionsForTruthy(node.test)
            if (
                !truthy.every((condition) => {
                    if (
                        falsyConditions.some((f) => f.text === condition.text)
                    ) {
                        // The `if` condition cannot be `true` because the condition contained in `falsyConditions` must be `false`.
                        return false
                    }
                    if (
                        truthyConditions.some(
                            (t) => t.not().text === condition.text,
                        )
                    ) {
                        // The `if` condition cannot be` true` if it matches a condition that is negative for `truthyConditions`.
                        return false
                    }
                    return true
                })
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
            truthyConditions.push(...truthy)
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
    getConditionsForTruthy(node) {
        const cacheConditions =
            this._cacheConditions || (this._cacheConditions = new Map())
        let cache = cacheConditions.get(node)
        if (!cache) {
            cache = {}
            cacheConditions.set(node, cache)
        }
        if (cache.truthy) {
            return cache.truthy
        }

        const tokens = [...this.getConditionsForTruthyWithoutCache(node)]
        cache.truthy = tokens
        return tokens
    }

    /**
     * @param {Expression} node test node
     */
    getConditionsForFalsy(node) {
        const cacheConditions =
            this._cacheConditions || (this._cacheConditions = new Map())
        let cache = cacheConditions.get(node)
        if (!cache) {
            cache = {}
            cacheConditions.set(node, cache)
        }
        if (cache.falsy) {
            return cache.falsy
        }

        const tokens = [...this.getConditionsForFalsyWithoutCache(node)]
        cache.falsy = tokens
        return tokens
    }

    /**
     * @param {Expression} node
     */
    getConditionsForTruthyWithoutCache(node) {
        return this.getConditionsWithoutCache(node, {
            logicalOperator: "&&",
            getConditionsFromNode: (n) => this.getConditionsForTruthy(n),
            getConditionsFromNodeForNot: (n) => this.getConditionsForFalsy(n),
        })
    }

    /**
     * @param {Expression} node
     */
    getConditionsForFalsyWithoutCache(node) {
        return this.getConditionsWithoutCache(node, {
            logicalOperator: "||",
            getConditionsFromNode: (n) => this.getConditionsForFalsy(n),
            getConditionsFromNodeForNot: (n) => this.getConditionsForTruthy(n),
        })
    }

    /**
     * @param {Expression} node
     */
    *getConditionsWithoutCache(
        node,
        { logicalOperator, getConditionsFromNode, getConditionsFromNodeForNot },
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
                    yield condition.not()
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
        yield this.getConditionFromNode(node)
    }

    /**
     * @param {Expression} node
     */
    getConditionFromNode(node) {
        let not
        const text = this.getTextFromNode(node)
        const getNotText = () => {
            if (text.startsWith("!")) {
                return text.slice(1)
            }
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
                    return `${this.getTextFromNode(
                        node.left,
                    )}${op}${this.getTextFromNode(node.right)}`
                }
            }

            return `!${text}`
        }
        const condition = {
            text,
            not: () => {
                if (not) {
                    return not
                }
                return (not = {
                    text: getNotText(),
                    not() {
                        return condition
                    },
                })
            },
        }
        return condition
    }

    getTextFromNode(node) {
        return this._templateService.script
            .slice(...node.range)
            .replace(/\s/gu, "")
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
