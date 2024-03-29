"use strict";

const { getSourceCode } = require("eslint-compat-utils");

module.exports = {
    meta: {
        docs: {
            description:
                "disallow other than expression in micro-template interpolation. (ex. :ng: `<%= if (test) { %>`)",
            category: "best-practices",
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/no-invalid-template-interpolation.html",
        },
        fixable: null,
        messages: {
            missingStatement: "Empty statement.",
            unexpected: "Expected an expression, but a not expressions.",
        },
        schema: [],
        type: "problem",
    },
    create(context) {
        const sourceCode = getSourceCode(context);
        if (!sourceCode.parserServices.getMicroTemplateService) {
            return {};
        }
        const microTemplateService =
            sourceCode.parserServices.getMicroTemplateService();

        /**
         * process micro-template interpolation node
         * @param {ASTNode} node The AST node.
         * @returns {void} undefined.
         */
        function processNode(node) {
            if (!node.code.trim()) {
                // empty
                return;
            }
            const innerTokens =
                microTemplateService.getMicroTemplateTokensInfo(
                    node,
                ).innerTokens;
            if (!innerTokens.length) {
                context.report({
                    node,
                    messageId: "missingStatement",
                });
                return;
            }
            const statement =
                microTemplateService.getMicroTemplateExpressionStatement(
                    node,
                    sourceCode,
                );
            if (statement) {
                return;
            }
            context.report({
                node,
                messageId: "unexpected",
            });
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseMicroTemplates({
                    MicroTemplateInterpolate: processNode,
                    MicroTemplateEscape: processNode,
                });
            },
        };
    },
};
