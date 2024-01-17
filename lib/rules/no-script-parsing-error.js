"use strict";

const { getSourceCode } = require("eslint-compat-utils");

module.exports = {
    meta: {
        docs: {
            description: "disallow parsing errors in template",
            category: "base",
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/no-script-parsing-error.html",
        },
        fixable: null,
        messages: {
            parsingError: "Parsing error: {{message}}.",
        },
        schema: [],
        type: "problem",
    },
    create(context) {
        const sourceCode = getSourceCode(context);
        if (!sourceCode.parserServices.getMicroTemplateScriptParseError) {
            return {};
        }

        const error =
            sourceCode.parserServices.getMicroTemplateScriptParseError();
        return {
            Program(node) {
                context.report({
                    node,
                    loc: { line: error.lineNumber, column: error.column - 1 },
                    messageId: "parsingError",
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
