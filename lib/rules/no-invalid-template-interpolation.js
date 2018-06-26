"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                "disallow other than expression in micro-template interpolation. (ex. :ng: `<%= if (test) { %>`)",
            category: "best-practices",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.9.0/docs/rules/no-invalid-template-interpolation.md",
        },
        fixable: null,
        schema: [],
        messages: {
            missingStatement: "Empty statement.",
            unexpected: "Expected an expression, but a not expressions.",
        },
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
                    messageId: "missingStatement",
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
                messageId: "unexpected",
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
