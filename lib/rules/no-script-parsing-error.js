"use strict";

module.exports = {
    meta: {
        docs: {
            description: "disallow parsing errors in template",
            category: "base",
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/no-script-parsing-error.html",
        },
        fixable: null,
        schema: [],
        type: "problem",
    },
    create(context) {
        if (!context.parserServices.getMicroTemplateScriptParseError) {
            return {};
        }

        const error = context.parserServices.getMicroTemplateScriptParseError();
        return {
            Program(node) {
                context.report({
                    node,
                    loc: { line: error.lineNumber, column: error.column - 1 },
                    message: "Parsing error: {{message}}.",
                    data: {
                        message: error.message.endsWith(".")
                            ? error.message.slice(0, -1)
                            : error.message,
                    },
                });
            },
        };
    },
};
