"use strict"

/**
 * Traverse the given node.
 * @param {SourceCode} sourceCode The source code.
 * @param {object} node The node to traverse.
 * @param {object} parent The parent node.
 * @param {object} visitor Visitor.
 * @returns {void}
 */
function traverseAst(sourceCode, node, parent, visitor) {
    if (visitor[node.type]) {
        visitor[node.type](node, parent)
    }

    const keys = sourceCode.visitorKeys[node.type]
    for (const key of keys) {
        const child = node[key]

        if (Array.isArray(child)) {
            for (const c of child) {
                if (c) {
                    traverseAst(sourceCode, c, node, visitor)
                }
            }
        } else if (child) {
            traverseAst(sourceCode, child, node, visitor)
        }
    }
}

/**
 * Branch-processed HTML
 */
class BranchedHTML {
    /**
     * constructor
     * @param {string} html The html.
     * @param {HTMLDocument} doc The html document
     * @param {Array} stripedRanges The striped ranges
     */
    constructor(html, doc, stripedRanges) {
        this.html = html
        this.doc = doc
        this.stripedRanges = stripedRanges
    }

    /**
     * Checks whether targetNode is held or not
     * @param {ASTNode} targetNode The target node.
     * @returns {boolean} `true` if targetNode is held
     */
    isHeldTarget(targetNode) {
        for (const range of this.stripedRanges) {
            if (
                range[0] <= targetNode.range[0] &&
                targetNode.range[0] < range[1]
            ) {
                return false
            }
        }
        return true
    }
}

/**
 * Get HTML with alternate statements striped.
 * @param {MicroTemplateService} service The MicroTemplateService
 * @param {Array} branchStatements The branch statements
 * @param {ASTNode} targetNode The target node.
 * @returns {BranchedHTML} Branch-processed HTML
 */
function createBranchedHTML(service, branchStatements, targetNode) {
    let template = service.template
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

    const visitor = {
        IfStatement(node) {
            if (
                node.alternate.range[0] <= targetNode.range[0] &&
                targetNode.range[0] < node.alternate.range[1]
            ) {
                strip(node.consequent.range[0], node.consequent.range[1])
            } else {
                strip(node.alternate.range[0], node.alternate.range[1])
            }
        },
        SwitchStatement(node) {
            let nodeCaseIndex = node.cases.findIndex((cur, index) => {
                const next = node.cases[index + 1]
                const endIndex = next ? next.range[0] : node.range[1]
                return (
                    cur.range[0] <= targetNode.range[0] &&
                    targetNode.range[0] < endIndex
                )
            })
            if (nodeCaseIndex < 0) {
                nodeCaseIndex = 0
            }
            node.cases.forEach((cur, index) => {
                if (index === nodeCaseIndex) {
                    return
                }
                const next = node.cases[index + 1]
                const endIndex = next ? next.range[0] : node.range[1]
                strip(cur.range[0], endIndex)
            })
        },
    }
    for (const node of branchStatements) {
        visitor[node.type](node)
    }

    return new BranchedHTML(
        template,
        service.parseHtml(template),
        stripedRanges
    )
}

module.exports = class BranchedHTMLStore {
    /**
     * constructor
     * @param {SourceCode} sourceCode The source code.
     * @param {MicroTemplateService} service The MicroTemplateService
     */
    constructor(sourceCode, service) {
        const branchStatements = []
        traverseAst(sourceCode, sourceCode.ast, null, {
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
        this._service = service
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
     * Get branch-processed HTML document holding targetNode
     * @param {ASTNode} targetNode The target node.
     * @returns {BranchedHTML} Branch-processed HTML
     */
    getBranchProcessedHtmlDocument(targetNode) {
        for (const branchedHtml of this._store) {
            if (branchedHtml.isHeldTarget(targetNode)) {
                return branchedHtml.doc
            }
        }
        const branchedHtml = createBranchedHTML(
            this._service,
            this._branchStatements,
            targetNode
        )
        this._store.push(branchedHtml)
        return branchedHtml.doc
    }
}
