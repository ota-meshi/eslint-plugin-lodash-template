"use strict"

/**
 * Normalize options.
 * @param {object} options The options user configured.
 * @returns {object} The normalized options.
 */
function parseOptions(options) {
    return Object.assign(
        {
            startTag: "never",
            endTag: "never",
            selfClosingTag: "always",

            detectType(node) {
                const openType = node.tagOpen
                const closeType = node.tagClose

                if (
                    openType === "HTMLEndTagOpen" &&
                    closeType === "HTMLTagClose"
                ) {
                    return this.endTag
                }
                if (
                    openType === "HTMLTagOpen" &&
                    closeType === "HTMLTagClose"
                ) {
                    return this.startTag
                }
                if (
                    openType === "HTMLTagOpen" &&
                    closeType === "HTMLSelfClosingTagClose"
                ) {
                    return this.selfClosingTag
                }
                return null
            },
        },
        options
    )
}

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description:
                "require or disallow a space before tag's closing brackets",
            category: undefined,
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.2.0/docs/rules/html-closing-bracket-spacing.md",
        },
        schema: [
            {
                type: "object",
                properties: {
                    startTag: { enum: ["always", "never"] },
                    endTag: { enum: ["always", "never"] },
                    selfClosingTag: { enum: ["always", "never"] },
                },
                additionalProperties: false,
            },
        ],
        fixable: "whitespace",
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }

        const sourceCode = context.getSourceCode()
        const options = parseOptions(context.options[0])
        const microTemplateService = context.parserServices.getMicroTemplateService()

        /**
         * Get last location
         * @param {ASTNode} node The node
         * @returns {object} The last location
         */
        function getLastLocationInTag(node) {
            const tagClose = node.tagClose
            const text = sourceCode.text.slice(node.range[0], tagClose.range[0])
            const index = text.search(/\S\s*$/)
            return {
                end: index + 1,
                loc: sourceCode.getLocFromIndex(index + 1),
            }
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    "HTMLStartTag, HTMLEndTag"(node) {
                        const type = options.detectType(node)
                        const lastToken = node.tagClose
                        const lastLoc = getLastLocationInTag(node)

                        // Skip if EOF exists in the tag or linebreak exists before `>`.
                        if (
                            type == null ||
                            lastLoc.loc.line !== lastToken.loc.start.line
                        ) {
                            return
                        }

                        // Check and report.
                        const hasSpace = lastLoc.end !== lastToken.range[0]
                        if (type === "always" && !hasSpace) {
                            context.report({
                                node,
                                loc: lastToken.loc,
                                message:
                                    "Expected a space before '{{bracket}}', but not found.",
                                data: {
                                    bracket: sourceCode.getText(lastToken),
                                },
                                fix: fixer =>
                                    fixer.insertTextBefore(lastToken, " "),
                            })
                        } else if (type === "never" && hasSpace) {
                            context.report({
                                node,
                                loc: {
                                    start: lastLoc.loc,
                                    end: lastToken.loc.end,
                                },
                                message:
                                    "Expected no space before '{{bracket}}', but found.",
                                data: {
                                    bracket: sourceCode.getText(lastToken),
                                },
                                fix: fixer =>
                                    fixer.removeRange([
                                        lastLoc.end,
                                        lastToken.range[0],
                                    ]),
                            })
                        }
                    },
                })
            },
        }
    },
}
