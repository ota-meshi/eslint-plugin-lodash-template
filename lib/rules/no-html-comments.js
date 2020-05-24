"use strict"

const utils = require("../utils")

module.exports = {
    meta: {
        docs: {
            description:
                "disallow HTML comments. (ex. :ng: `<!-- comment -->`)",
            category: "recommended-with-html",
            url:
                "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/no-html-comments.html",
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
