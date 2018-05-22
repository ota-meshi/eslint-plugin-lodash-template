"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                "prefer escape micro-template interpolations. (ex. :ok: `<%- ... %>`, :ng: `<%= ... %>`)",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.0.12/docs/rules/prefer-escape-template-interpolations.md",
        },
        fixable: null,
        schema: [],
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
                            message:
                                "Use no escape micro-template interpolation.",
                        })
                    },
                })
            },
        }
    },
}
