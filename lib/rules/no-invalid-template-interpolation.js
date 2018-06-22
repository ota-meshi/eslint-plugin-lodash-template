"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                "disallow other than expression in micro-template interpolation. (ex. :ng: `<%= if (test) { %>`)",
            category: "best-practices",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.8.2/docs/rules/no-invalid-template-interpolation.md",
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }
        const sourceCode = context.getSourceCode()
        const microTemplateService = context.parserServices.getMicroTemplateService()

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
            const innerTokens = microTemplateService.getMicroTemplateTokensInfo(
                node
            ).innerTokens
            if (!innerTokens.length) {
                context.report({
                    node,
                    message: "Empty statement.",
                })
                return
            }
            const statement = microTemplateService.getMicroTemplateExpressionStatement(
                node,
                sourceCode
            )
            if (statement) {
                return
            }
            context.report({
                node,
                message: "Expected an expression, but a not expressions.",
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
