"use strict"

module.exports = {
    meta: {
        docs: {
            description: "support option",
            category: "base",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.11.0/docs/rules/plugin-option.md",
        },
        schema: [
            {
                type: "object",
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        if (context.parserServices.getMicroTemplateService) {
            const microTemplateService = context.parserServices.getMicroTemplateService()
            microTemplateService.systemOption = Object.assign(
                {},
                context.options[0]
            )
        }
        return {}
    },
}
