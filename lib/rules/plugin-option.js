"use strict"

// TODO Deprecated in 0.14.x
module.exports = {
    meta: {
        deprecated: true,
        docs: {
            // eslint-disable-next-line eslint-plugin/require-meta-docs-description -- ignore
            description: "support option",
            category: undefined,
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/plugin-option.html",
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
            const microTemplateService =
                context.parserServices.getMicroTemplateService()
            microTemplateService.systemOption = Object.assign(
                {},
                context.options[0],
            )
        }
        return {}
    },
}
