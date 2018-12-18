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
                if (node.type === "HTMLStartTag") {
                    const closeType = node.tagClose.type
                    if (closeType === "HTMLSelfClosingTagClose") {
                        return this.selfClosingTag
                    }
                    return this.startTag
                }
                // HTMLEndTag
                return this.endTag
            },
        },
        options
    )
}

module.exports = {
    meta: {
        docs: {
            description:
                "require or disallow a space before tag's closing brackets. (ex. :ok: `<input>` `<input·/>` :ng: `<input·>` `<input/>`)",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.11.0/docs/rules/html-closing-bracket-spacing.md",
        },
        type: "layout",
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
        messages: {
            missing: "Expected a space before `{{bracket}}`, but not found.",
            unexpected: "Expected no space before `{{bracket}}`, but found.",
        },
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
                        const hasSpace = lastLoc.index !== lastToken.range[0]
                        if (type === "always" && !hasSpace) {
                            context.report({
                                node,
                                loc: lastToken.loc,
                                messageId: "missing",
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
                                messageId: "unexpected",
                                data: {
                                    bracket: sourceCode.getText(lastToken),
                                },
                                fix: fixer =>
                                    fixer.removeRange([
                                        lastLoc.index,
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
