"use strict";

const utils = require("../utils");
const { getSourceCode } = require("eslint-compat-utils");

/**
 * Get the messageId
 * @param  {number} expectedLineBreaks The number of expected line breaks
 * @param  {number} actualLineBreaks   The number of actual line breaks
 * @returns {string} The messageId
 */
function getMessageId(expectedLineBreaks, actualLineBreaks) {
    if (expectedLineBreaks === 0) {
        if (actualLineBreaks === 1) {
            return "unexpected";
        }
        return "expectedNoLineBreaksButNLineBreaks";
    }
    if (actualLineBreaks === 0) {
        return "missing";
    }
    return "expectedOneLineBreakButNLineBreaks";
}

module.exports = {
    meta: {
        docs: {
            description:
                "require or disallow a line break before tag's closing brackets",
            category: "recommended-with-html",
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/html-closing-bracket-newline.html",
        },
        fixable: "whitespace",
        messages: {
            unexpected:
                "Expected no line breaks before closing bracket, but 1 line break found.",
            expectedNoLineBreaksButNLineBreaks:
                "Expected no line breaks before closing bracket, but {{n}} line breaks found.",
            missing:
                "Expected 1 line break before closing bracket, but no line breaks found.",
            expectedOneLineBreakButNLineBreaks:
                "Expected 1 line break before closing bracket, but {{n}} line breaks found.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    singleline: { enum: ["always", "never"] },
                    multiline: { enum: ["always", "never"] },
                },
                additionalProperties: false,
            },
        ],
        type: "layout",
    },

    create(context) {
        const sourceCode = getSourceCode(context);
        if (!sourceCode.parserServices.getMicroTemplateService) {
            return {};
        }
        if (!utils.isHtmlFile(context.getFilename())) {
            return {};
        }

        const options = context.options[0] || {};
        const microTemplateService =
            sourceCode.parserServices.getMicroTemplateService();

        /**
         * Get last location
         * @param {ASTNode} node The node
         * @returns {object} The last location
         */
        function getLastLocationInTag(node) {
            const tagClose = node.tagClose;
            const text = sourceCode.text.slice(
                node.range[0],
                tagClose.range[0],
            );
            const index = text.search(/\S\s*$/gu) + node.range[0] + 1;
            return {
                index,
                loc: sourceCode.getLocFromIndex(index),
            };
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    "HTMLStartTag, HTMLEndTag"(node) {
                        const closingBracketToken = node.tagClose;
                        const lastLoc = getLastLocationInTag(node);

                        const type =
                            node.loc.start.line === lastLoc.loc.line
                                ? "singleline"
                                : "multiline";
                        const expectedLineBreaks =
                            options[type] === "always" ? 1 : 0;
                        const actualLineBreaks =
                            closingBracketToken.loc.start.line -
                            lastLoc.loc.line;

                        if (actualLineBreaks !== expectedLineBreaks) {
                            context.report({
                                node,
                                loc: {
                                    start: lastLoc.loc,
                                    end: closingBracketToken.loc.start,
                                },
                                messageId: getMessageId(
                                    expectedLineBreaks,
                                    actualLineBreaks,
                                ),
                                data: {
                                    n: actualLineBreaks,
                                },
                                fix(fixer) {
                                    const range = [
                                        lastLoc.index,
                                        closingBracketToken.range[0],
                                    ];
                                    const text = "\n".repeat(
                                        expectedLineBreaks,
                                    );
                                    return fixer.replaceTextRange(range, text);
                                },
                            });
                        }
                    },
                });
            },
        };
    },
};
