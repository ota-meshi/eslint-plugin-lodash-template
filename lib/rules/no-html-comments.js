"use strict"

const utils = require("../utils")

module.exports = {
    meta: {
        docs: {
            description:
                "disallow HTML comments. (ex. :ng: `<!-- comment -->`)",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.15.0/docs/rules/no-html-comments.md",
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
        if (!utils.isHtmlFile(context.getFilename())) {
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
