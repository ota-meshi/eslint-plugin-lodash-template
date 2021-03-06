"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                "disallow empty micro-template tag. (ex. :ng: `<% %>`)",
            category: "best-practices",
            url:
                "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/no-empty-template-tag.html",
        },
        fixable: null,
        messages: {
            missing: "Empty micro-template tag.",
        },
        schema: [],
        type: "suggestion",
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
                    messageId: "missing",
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
