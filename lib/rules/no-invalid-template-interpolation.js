"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                "disallow other than expression in micro-template interpolation. (ex. :ng: `<%= if (test) { %>`)",
            category: "best-practices",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.7.0/docs/rules/no-invalid-template-interpolation.md",
        },
        fixable: "code",
        schema: [
            {
                type: "object",
                properties: {
                    allowSemi: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
    },
    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }
        const option = context.options[0] || {}
        const allowSemi = Boolean(option.allowSemi)

        const sourceCode = context.getSourceCode()
        const microTemplateService = context.parserServices.getMicroTemplateService()

        const allTokens = sourceCode.ast.tokens

        /**
         * Gets all tokens that are contained to the given range.
         * @param {number} start - The start of range.
         * @param {numnber} end - The end of range.
         * @returns {Token[]} Array of objects representing tokens.
         */
        function getTokens(start, end) {
            const results = []
            for (const token of allTokens) {
                if (token.range[1] <= start) {
                    continue
                }
                if (end <= token.range[0]) {
                    break
                }
                results.push(token)
            }
            return results
        }

        /**
         * Check whether the range is ExpressionStatement.
         * @param {number} start - The start of range.
         * @param {numnber} end - The end of range.
         * @returns {boolean} `true` if the range is ExpressionStatement.
         */
        function isExpressionStatement(start, end) {
            let target = sourceCode.getNodeByRangeIndex(start)
            while (
                target &&
                target.range[1] <= end &&
                start <= target.range[0]
            ) {
                if (
                    target.type === "ExpressionStatement" &&
                    start === target.range[0] &&
                    target.range[1] === end
                ) {
                    return true
                }
                target = target.parent
            }
            return false
        }

        /**
         * process micro-template interpolation node
         * @param {ASTNode} node The AST node.
         * @returns {void} undefined.
         */
        function processNode(node) {
            if (!node.code.trim()) {
                // empty
                return
            }
            const open = node.expressionStart
            const close = node.expressionEnd
            const innerTokens = getTokens(open.range[1], close.range[0])
            if (!innerTokens.length) {
                context.report({
                    node,
                    message: "Empty statement.",
                })
                return
            }
            const tokens = getTokens(node.range[0], node.range[1])

            const first = tokens[0]
            const last = tokens[tokens.length - 1]
            if (isExpressionStatement(first.range[0], last.range[1])) {
                return
            }
            let fix = undefined
            const innerFirst = innerTokens[0]
            const innerLast = innerTokens[innerTokens.length - 1]
            if (
                last.value === ";" &&
                innerLast.value === ";" &&
                isExpressionStatement(innerFirst.range[0], innerLast.range[1])
            ) {
                if (allowSemi) {
                    return
                }
                fix = fixer => fixer.remove(innerLast)
            }
            context.report({
                node,
                message: "Expected an expression, but a not expressions.",
                fix,
            })
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseMicroTemplates({
                    MicroTemplateInterpolate: processNode,
                    MicroTemplateEscape: processNode,
                })
            },
        }
    },
}
