"use strict"

// TODO Deprecated in 0.14.x
module.exports = {
    meta: {
        deprecated: true,
        docs: {
            description: "support option",
            category: undefined,
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.14.0/docs/rules/plugin-option.md",
        },
        schema: [
            {
                type: "object",
                // additionalProperties: false,
            },
        ],
        type: "suggestion",
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
