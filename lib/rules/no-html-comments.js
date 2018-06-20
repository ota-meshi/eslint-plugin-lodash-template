"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                "disallow HTML comments. (ex. :ng: `<!-- comment -->`)",
            category: "best-practices",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.8.0/docs/rules/no-html-comments.md",
        },
        schema: [],
    },
    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }

        const microTemplateService = context.parserServices.getMicroTemplateService()

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLComment(node) {
                        context.report({
                            node,
                            message: "HTML comment are forbidden.",
                        })
                    },
                })
            },
        }
    },
}
