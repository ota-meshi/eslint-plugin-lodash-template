"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                "disallow the semicolon at the end of expression in micro template interpolation.(ex. :ok: `<%= text %>` :ng: `<%= text; %>`)",
            category: "best-practices",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.12.0/docs/rules/no-semi-in-template-interpolation.md",
        },
        fixable: "code",
        type: "problem",
        schema: [],
        messages: {
            unexpected: "Unnecessary semicolon.",
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
                return
            }
            const statement = microTemplateService.getMicroTemplateExpressionStatement(
                node,
                sourceCode
            )
            if (!statement) {
                return
            }

            const innerLast = innerTokens[innerTokens.length - 1]
            if (innerLast.value === ";") {
                context.report({
                    node: innerLast,
                    messageId: "unexpected",
                    fix: fixer => fixer.remove(innerLast),
                })
            }
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
