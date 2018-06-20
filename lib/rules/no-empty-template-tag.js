"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                "disallow empty micro-template tag. (ex. :ng: `<% %>`)",
            category: "best-practices",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.8.0/docs/rules/no-empty-template-tag.md",
        },
        fixable: null,
        schema: [],
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }
        const microTemplateService = context.parserServices.getMicroTemplateService()

        /**
         * process micro-template node
         * @param {ASTNode} node The AST node.
         * @returns {void} undefined.
         */
        function processNode(node) {
            const entity = node.code.trim()
            if (!entity) {
                context.report({
                    node,
                    message: "Empty micro-template tag.",
                })
            }
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseMicroTemplates({
                    MicroTemplateEscape: processNode,
                    MicroTemplateInterpolate: processNode,
                    MicroTemplateEvaluate: processNode,
                })
            },
        }
    },
}
