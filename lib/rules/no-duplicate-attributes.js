"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                "disallow duplication of HTML attributes. (ex. :ng: `<div foo foo>`)",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.8.2/docs/rules/no-duplicate-attributes.md",
        },
        fixable: null,
        schema: [],
        messages: {
            duplicate: 'Duplicate attribute "{{name}}".',
        },
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }

        const microTemplateService = context.parserServices.getMicroTemplateService()

        /**
         * Report warning the given attribute node.
         * @param  {Node} node The attribute node
         * @returns {void}
         */
        function report(node) {
            const name = node.key
            context.report({
                node,
                loc: node.loc,
                messageId: "duplicate",
                data: { name },
            })
        }

        /**
         * Validate attribute nodes
         * @param  {Array} attrs The attribute nodes
         * @returns {void}
         */
        function validateAttrs(attrs) {
            const attributeNames = new Map()
            for (const node of attrs) {
                const name = node.key

                if (attributeNames.has(name)) {
                    const first = attributeNames.get(name)
                    if (first) {
                        report(first)
                        attributeNames.set(name, null)
                    }
                    report(node)
                } else {
                    attributeNames.set(name, node)
                }
            }
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLStartTag(node) {
                        validateAttrs(
                            node.attributes.concat(node.ignoredAttributes)
                        )
                    },
                })
            },
        }
    },
}
