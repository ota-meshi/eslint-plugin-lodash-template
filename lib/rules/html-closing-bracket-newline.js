"use strict"

/**
 * Get the message phrase
 * @param  {number} lineBreaks The number of line breaks
 * @returns {string} The message phrase
 */
function getPhrase(lineBreaks) {
    switch (lineBreaks) {
        case 0:
            return "no line breaks"
        case 1:
            return "1 line break"
        default:
            return `${lineBreaks} line breaks`
    }
}

module.exports = {
    meta: {
        docs: {
            description:
                "require or disallow a line break before tag's closing brackets",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.5.0/docs/rules/html-closing-bracket-newline.md",
        },
        fixable: "whitespace",
        schema: [
            {
                type: "object",
                properties: {
                    singleline: { enum: ["always", "never"] },
                    multiline: { enum: ["always", "never"] },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }

        const sourceCode = context.getSourceCode()
        const options = context.options[0] || {}
        const microTemplateService = context.parserServices.getMicroTemplateService()

        /**
         * Get last location
         * @param {ASTNode} node The node
         * @returns {object} The last location
         */
        function getLastLocationInTag(node) {
            const tagClose = node.tagClose
            const text = sourceCode.text.slice(node.range[0], tagClose.range[0])
            const index = text.search(/\S\s*$/g) + node.range[0] + 1
            return {
                index,
                loc: sourceCode.getLocFromIndex(index),
            }
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    "HTMLStartTag, HTMLEndTag"(node) {
                        const closingBracketToken = node.tagClose
                        const lastLoc = getLastLocationInTag(node)

                        const type =
                            node.loc.start.line === lastLoc.loc.line
                                ? "singleline"
                                : "multiline"
                        const expectedLineBreaks =
                            options[type] === "always" ? 1 : 0
                        const actualLineBreaks =
                            closingBracketToken.loc.start.line -
                            lastLoc.loc.line

                        if (actualLineBreaks !== expectedLineBreaks) {
                            context.report({
                                node,
                                loc: {
                                    start: lastLoc.loc,
                                    end: closingBracketToken.loc.start,
                                },
                                message:
                                    "Expected {{expected}} before closing bracket, but {{actual}} found.",
                                data: {
                                    expected: getPhrase(expectedLineBreaks),
                                    actual: getPhrase(actualLineBreaks),
                                },
                                fix(fixer) {
                                    const range = [
                                        lastLoc.index,
                                        closingBracketToken.range[0],
                                    ]
                                    const text = "\n".repeat(expectedLineBreaks)
                                    return fixer.replaceTextRange(range, text)
                                },
                            })
                        }
                    },
                })
            },
        }
    },
}
