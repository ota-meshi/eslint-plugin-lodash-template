"use strict";

const { getSourceCode } = require("eslint-compat-utils");

module.exports = {
    meta: {
        docs: {
            description:
                "prefer escape micro-template interpolations. (ex. :ok: `<%- ... %>`, :ng: `<%= ... %>`)",
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/prefer-escape-template-interpolations.html",
        },
        fixable: null,
        messages: {
            preferEscape:
                "The escape micro-template interpolation is preferable.",
        },
        schema: [],
        type: "suggestion",
    },

    create(context) {
        const sourceCode = getSourceCode(context);
        if (!sourceCode.parserServices.getMicroTemplateService) {
            return {};
        }
        const microTemplateService =
            sourceCode.parserServices.getMicroTemplateService();

        return {
            "Program:exit"() {
                microTemplateService.traverseMicroTemplates({
                    MicroTemplateInterpolate(node) {
                        context.report({
                            node,
                            messageId: "preferEscape",
                        });
                    },
                });
            },
        };
    },
};
