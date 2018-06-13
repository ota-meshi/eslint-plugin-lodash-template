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
                "enforce unified spacing in micro-template tag. (ex. :ok: `<%= prop %>`, :ng: `<%=prop%>`)",
            category: "recommended",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.5.0/docs/rules/template-tag-spacing.md",
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
        const sourceCode = context.getSourceCode()

        /**
         * Check whether the line numbers in the given indices are equal.
         * @param  {number} index1 The index
         * @param  {number} index2 The index
         * @returns {boolean} `true` if the line numbers in the indices are equal.
         */
        function equalLine(index1, index2) {
            return (
                sourceCode.getLocFromIndex(index1).line ===
                sourceCode.getLocFromIndex(index2).line
            )
        }

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
            if (
                expectedSpaces !== actualOpenSpaces &&
                equalLine(openBrace.range[1], firstCharIndex)
            ) {
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
            if (
                expectedSpaces !== actualCloseSpaces &&
                equalLine(lastCharIndex, closeBrace.range[0])
            ) {
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
