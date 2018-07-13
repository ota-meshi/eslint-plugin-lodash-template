"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                'disallow spacing around equal signs in attribute. (ex. :ok: `<div class="item">` :ng: `<div class = "item">`)',
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.10.2/docs/rules/no-space-attribute-equal-sign.md",
        },
        fixable: "whitespace",
        schema: [],
        messages: {
            unexpected: "Equal signs in must not be spaced.",
        },
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }

        const microTemplateService = context.parserServices.getMicroTemplateService()

        /**
         * Reports an AST node as a rule violation
         * @param {ASTNode} node - The node to report
         * @returns {void}
         */
        function report(node) {
            const eqToken = node.eqToken
            const keyToken = node.keyToken
            const valueToken = node.valueToken
            context.report({
                node: eqToken,
                messageId: "unexpected",
                fix(fixer) {
                    const range = [
                        keyToken.range[1],
                        valueToken ? valueToken.range[0] : eqToken.range[1],
                    ]
                    return fixer.replaceTextRange(range, "=")
                },
            })
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLAttribute(node) {
                        const eqToken = node.eqToken
                        if (!eqToken) {
                            return
                        }
                        const keyToken = node.keyToken

                        if (keyToken.range[1] < eqToken.range[0]) {
                            report(node)
                            return
                        }
                        const valueToken = node.valueToken
                        if (eqToken.range[1] < valueToken.range[0]) {
                            report(node)
                        }
                    },
                })
            },
        }
    },
}
