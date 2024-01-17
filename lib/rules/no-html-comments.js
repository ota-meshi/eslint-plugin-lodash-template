"use strict";

const utils = require("../utils");
const { getSourceCode } = require("eslint-compat-utils");

module.exports = {
    meta: {
        docs: {
            description:
                "disallow HTML comments. (ex. :ng: `<!-- comment -->`)",
            category: "recommended-with-html",
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/no-html-comments.html",
        },
        messages: {
            unexpected: "HTML comment are forbidden.",
        },
        schema: [],
        type: "suggestion",
    },
    create(context) {
        const sourceCode = getSourceCode(context);
        if (!sourceCode.parserServices.getMicroTemplateService) {
            return {};
        }
        if (!utils.isHtmlFile(context.getFilename())) {
            return {};
        }

        const microTemplateService =
            sourceCode.parserServices.getMicroTemplateService();

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLComment(node) {
                        context.report({
                            node,
                            messageId: "unexpected",
                        });
                    },
                });
            },
        };
    },
};
