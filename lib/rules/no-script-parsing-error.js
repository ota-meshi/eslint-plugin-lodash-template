"use strict"

module.exports = {
    meta: {
        docs: {
            description: "disallow parsing errors in template",
            category: "base",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.13.0/docs/rules/no-script-parsing-error.md",
        },
        fixable: null,
        schema: [],
        type: "problem",
    },
    create(context) {
        if (!context.parserServices.getMicroTemplateScriptParseError) {
            return {}
        }

        const error = context.parserServices.getMicroTemplateScriptParseError()
        return {
            Program(node) {
                context.report({
                    node,
                    loc: { line: error.lineNumber, column: error.column },
                    message: "Parsing error: {{message}}.",
                    data: {
                        message: error.message.endsWith(".")
                            ? error.message.slice(0, -1)
                            : error.message,
                    },
                })
            },
        }
    },
}
