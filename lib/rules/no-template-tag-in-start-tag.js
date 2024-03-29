"use strict";

const utils = require("../utils");
const { getSourceCode } = require("eslint-compat-utils");

module.exports = {
    meta: {
        docs: {
            description:
                "disallow template tag in start tag outside attribute values. (ex. :ng: `<input <%= 'disabled' %> >`)",
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/no-template-tag-in-start-tag.html",
        },
        fixable: null,
        messages: {
            unexpectedInterpolate:
                "The template interpolate tag in start tag outside attribute values are forbidden.",
            unexpectedEvaluate:
                "The template evaluate tag in start tag outside attribute values are forbidden.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    arrowInterpolateTag: { type: "boolean" },
                    arrowEvaluateTag: { type: "boolean" },
                },
                additionalProperties: false,
            },
        ],
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

        const options = context.options[0] || {};
        const arrowInterpolateTag = Boolean(options.arrowInterpolateTag);
        const arrowEvaluateTag = Boolean(options.arrowEvaluateTag);

        const microTemplateService =
            sourceCode.parserServices.getMicroTemplateService();

        /**
         * Gets all interpolation tokens that are contained to the given range.
         * @param {number} start - The start of range.
         * @param {number} end - The end of range.
         * @returns {Token[]} Array of objects representing tokens.
         */
        function getTemplateTags(start, end) {
            const results = [];
            for (const token of microTemplateService.getMicroTemplateTokens()) {
                if (token.range[1] <= start) {
                    continue;
                }
                if (end <= token.range[0]) {
                    break;
                }
                results.push(token);
            }
            return results;
        }

        /**
         * Validate template tags.
         * @param {Array} templateTags The template tags.
         * @param {Array} attrs The attributes nodes.
         * @returns {void}
         */
        function validate(templateTags, attrs) {
            const valueTokens = attrs
                .map((attr) => attr.valueToken)
                .filter((t) => Boolean(t));
            for (const templateTag of templateTags) {
                if (
                    valueTokens.some(
                        (valueToken) =>
                            valueToken.range[0] <= templateTag.range[0] &&
                            templateTag.range[1] <= valueToken.range[1],
                    )
                ) {
                    continue;
                }
                const isInterpolate =
                    templateTag.type === "MicroTemplateInterpolate" ||
                    templateTag.type === "MicroTemplateEscape";
                if (isInterpolate ? arrowInterpolateTag : arrowEvaluateTag) {
                    continue;
                }
                context.report({
                    node: templateTag,
                    messageId: isInterpolate
                        ? "unexpectedInterpolate"
                        : "unexpectedEvaluate",
                });
            }
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLStartTag(node) {
                        const templateTags = getTemplateTags(
                            node.range[0],
                            node.range[1],
                        );
                        const attrs = node.attributes.concat(
                            node.ignoredAttributes,
                        );
                        validate(templateTags, attrs);
                    },
                });
            },
        };
    },
};
