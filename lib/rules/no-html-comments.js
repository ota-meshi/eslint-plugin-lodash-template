"use strict"

module.exports = {
    meta: {
        docs: {
            description:
                "disallow HTML comments. (ex. :ng: `<!-- comment -->`)",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.13.0/docs/rules/no-html-comments.md",
        },
        messages: {
            unexpected: "HTML comment are forbidden.",
        },
        schema: [],
        type: "suggestion",
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
                            messageId: "unexpected",
                        })
                    },
                })
            },
        }
    },
}
