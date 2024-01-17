"use strict";

const { getSourceCode } = require("eslint-compat-utils");

module.exports = {
    meta: {
        docs: {
            description:
                "disallow the semicolon at the end of expression in micro template interpolation.(ex. :ok: `<%= text %>` :ng: `<%= text; %>`)",
            category: "best-practices",
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/no-semi-in-template-interpolation.html",
        },
        fixable: "code",
        messages: {
            unexpected: "Unnecessary semicolon.",
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
                return;
            }
            const statement =
                microTemplateService.getMicroTemplateExpressionStatement(
                    node,
                    sourceCode,
                );
            if (!statement) {
                return;
            }

            const innerLast = innerTokens[innerTokens.length - 1];
            if (innerLast.value === ";") {
                context.report({
                    node: innerLast,
                    messageId: "unexpected",
                    fix: (fixer) => fixer.remove(innerLast),
                });
            }
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
