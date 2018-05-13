"use strict"

/**
 * Get phrase of spaces.
 * @param {number} spaces The number of spaces
 * @returns {string} The phrase
 */
function getPhrase(spaces) {
    switch (spaces) {
        case 0:
            return "no spaces"
        case 1:
            return "1 space"
        default:
            return `${spaces} spaces`
    }
}

module.exports = {
    meta: {
        docs: {
            description:
                "enforce unified spacing in micro-template interpolation/evaluate(s). (ex. :+1: `<%= prop %>`, :-1: `<%=prop%>`)",
            category: "recommended",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.0.1/docs/rules/template-tag-spacing.md",
        },
        fixable: "whitespace",
        schema: [
            {
                enum: ["always", "never"],
            },
        ],
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }
        const options = context.options[0] || "always"
        const microTemplateService = context.parserServices.getMicroTemplateService()

        /**
         * process micro-template node
         * @param {ASTNode} node The AST node.
         * @returns {void} undefined.
         */
        function processNode(node) {
            const openBrace = node.expressionStart
            const closeBrace = node.expressionEnd

            const interpolate = node.code

            const entity = interpolate.trim()
            if (!entity) {
                return
            }
            const firstCharIndex =
                openBrace.range[1] + interpolate.indexOf(entity)
            const lastCharIndex = firstCharIndex + entity.length
            const actualOpenSpaces = firstCharIndex - openBrace.range[1]
            const actualCloseSpaces = closeBrace.range[0] - lastCharIndex
            const expectedSpaces = options === "always" ? 1 : 0
            if (expectedSpaces !== actualOpenSpaces) {
                context.report({
                    node: openBrace,
                    message:
                        "Expected {{expected}} after '{{chars}}', but {{actual}} found.",
                    data: {
                        chars: openBrace.chars,
                        expected: getPhrase(expectedSpaces),
                        actual: getPhrase(actualOpenSpaces),
                    },
                    fix(fixer) {
                        const range = [openBrace.range[1], firstCharIndex]
                        const text = " ".repeat(expectedSpaces)
                        return fixer.replaceTextRange(range, text)
                    },
                })
            }
            if (expectedSpaces !== actualCloseSpaces) {
                context.report({
                    node: closeBrace,
                    message:
                        "Expected {{expected}} before '{{chars}}', but {{actual}} found.",
                    data: {
                        chars: closeBrace.chars,
                        expected: getPhrase(expectedSpaces),
                        actual: getPhrase(actualCloseSpaces),
                    },
                    fix(fixer) {
                        const range = [lastCharIndex, closeBrace.range[0]]
                        const text = " ".repeat(expectedSpaces)
                        return fixer.replaceTextRange(range, text)
                    },
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
