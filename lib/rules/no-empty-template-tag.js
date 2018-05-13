"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                "disallow empty micro-template interpolation/evaluate(s). (ex. :ng: `<% %>`)",
            category: "best-practices",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.0.3/docs/rules/no-empty-template-tag.md",
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
            const interpolate = node.code

            const entity = interpolate.trim()
            if (!entity) {
                context.report({
                    node,
                    message: "Empty micro-template interpolation/evaluate.",
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
