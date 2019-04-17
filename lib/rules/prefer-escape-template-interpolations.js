"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                "prefer escape micro-template interpolations. (ex. :ok: `<%- ... %>`, :ng: `<%= ... %>`)",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.13.0/docs/rules/prefer-escape-template-interpolations.md",
        },
        fixable: null,
        type: "suggestion",
        schema: [],
        messages: {
            preferEscape:
                "The escape micro-template interpolation is preferable.",
        },
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }
        const microTemplateService = context.parserServices.getMicroTemplateService()

        return {
            "Program:exit"() {
                microTemplateService.traverseMicroTemplates({
                    MicroTemplateInterpolate(node) {
                        context.report({
                            node,
                            messageId: "preferEscape",
                        })
                    },
                })
            },
        }
    },
}
