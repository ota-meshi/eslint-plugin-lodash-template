"use strict"

/**
 * Get the messageId for before tag open
 * @param  {number} expectedSpaces The number of expected spaces
 * @param  {number} actualSpaces   The number of actual spaces
 * @returns {string} The messageId
 */
function getMessageIdForTagOpen(expectedSpaces, actualSpaces) {
    if (expectedSpaces === 0) {
        if (actualSpaces === 1) {
            return "unexpectedAfterTagOpen"
        }
        return "expectedNoSpacesAfterTagOpenButNSpaces"
    }
    if (actualSpaces === 0) {
        return "missingAfterTagOpen"
    }
    return "expectedOneSpaceAfterTagOpenButNSpaces"
}

/**
 * Get the messageId for after tag close
 * @param  {number} expectedSpaces The number of expected spaces
 * @param  {number} actualSpaces   The number of actual spaces
 * @returns {string} The messageId
 */
function getMessageIdForTagClose(expectedSpaces, actualSpaces) {
    if (expectedSpaces === 0) {
        if (actualSpaces === 1) {
            return "unexpectedBeforeTagClose"
        }
        return "expectedNoSpacesBeforeTagCloseButNSpaces"
    }
    if (actualSpaces === 0) {
        return "missingBeforeTagClose"
    }
    return "expectedOneSpaceBeforeTagCloseButNSpaces"
}

module.exports = {
    meta: {
        docs: {
            description:
                "enforce unified spacing in micro-template tag. (ex. :ok: `<%= prop %>`, :ng: `<%=prop%>`)",
            category: "recommended",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.13.0/docs/rules/template-tag-spacing.md",
        },
        fixable: "whitespace",
        messages: {
            unexpectedAfterTagOpen:
                "Expected no spaces after `{{chars}}`, but 1 space found.",
            expectedNoSpacesAfterTagOpenButNSpaces:
                "Expected no spaces after `{{chars}}`, but {{n}} spaces found.",
            missingAfterTagOpen:
                "Expected 1 space after `{{chars}}`, but no spaces found.",
            expectedOneSpaceAfterTagOpenButNSpaces:
                "Expected 1 space after `{{chars}}`, but {{n}} spaces found.",
            unexpectedBeforeTagClose:
                "Expected no spaces before `{{chars}}`, but 1 space found.",
            expectedNoSpacesBeforeTagCloseButNSpaces:
                "Expected no spaces before `{{chars}}`, but {{n}} spaces found.",
            missingBeforeTagClose:
                "Expected 1 space before `{{chars}}`, but no spaces found.",
            expectedOneSpaceBeforeTagCloseButNSpaces:
                "Expected 1 space before `{{chars}}`, but {{n}} spaces found.",
        },
        schema: [
            {
                enum: ["always", "never"],
            },
        ],
        type: "layout",
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
                    messageId: getMessageIdForTagOpen(
                        expectedSpaces,
                        actualOpenSpaces
                    ),
                    data: {
                        chars: openBrace.chars,
                        n: actualOpenSpaces,
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
                    messageId: getMessageIdForTagClose(
                        expectedSpaces,
                        actualCloseSpaces
                    ),
                    data: {
                        chars: closeBrace.chars,
                        n: actualCloseSpaces,
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
