"use strict";

const utils = require("../utils");
const { getSourceCode } = require("eslint-compat-utils");

module.exports = {
    meta: {
        docs: {
            description:
                "disallow duplication of HTML attributes. (ex. :ng: `<div foo foo>`)",
            category: "recommended-with-html",
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/no-duplicate-attributes.html",
        },
        fixable: null,
        messages: {
            duplicate: 'Duplicate attribute "{{name}}".',
        },
        schema: [],
        type: "problem",
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

        /**
         * Report warning the given attribute node.
         * @param  {Node} node The attribute node
         * @returns {void}
         */
        function report(node) {
            const name = node.key;
            context.report({
                node,
                loc: node.loc,
                messageId: "duplicate",
                data: { name },
            });
        }

        /**
         * Group by attribute name
         * @param  {Array} attrs The attribute nodes
         * @returns {Map} The grouping Map
         */
        function groupByName(attrs) {
            const attributes = new Map();
            for (const node of attrs) {
                const name = node.key;
                const list =
                    attributes.get(name) ||
                    (() => {
                        const a = [];
                        attributes.set(name, a);
                        return a;
                    })();
                list.push(node);
            }
            return attributes;
        }

        /**
         * Check if the nodes equals.
         * @param  {Node} n1 The node
         * @param  {Node} n2 The node
         * @returns {boolean} `true` if the nodes equals.
         */
        function equalNode(n1, n2) {
            return (
                n1.type === n2.type &&
                n1.range[0] === n2.range[0] &&
                n1.range[1] === n2.range[1]
            );
        }

        /**
         * Validation by attribute name
         * @param  {Array} nodes The attribute nodes
         * @param  {string} _name The attribute name
         * @returns {void}
         */
        function validateNameGroup(nodes, _name) {
            if (nodes.length <= 1) {
                return;
            }
            for (const target of nodes) {
                const node =
                    microTemplateService.getPathCoveredHtmlNode(
                        target,
                        sourceCode,
                    ) || target;
                const startTag = node.parent;
                const hasDup = startTag.attributes
                    .concat(startTag.ignoredAttributes)
                    .filter((attr) => !equalNode(attr, node))
                    .some((attr) =>
                        microTemplateService.findToken(
                            nodes,
                            (n) =>
                                n.type === attr.type &&
                                n.range[0] === attr.range[0] &&
                                n.range[1] === attr.range[1],
                        ),
                    );
                if (hasDup) {
                    report(target);
                }
            }
        }

        /**
         * Validate attribute nodes
         * @param  {Array} attrs The attribute nodes
         * @returns {void}
         */
        function validateAttrs(attrs) {
            const attributes = groupByName(attrs);
            attributes.forEach((nodes, name) => {
                validateNameGroup(nodes, name);
            });
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLStartTag(node) {
                        validateAttrs(
                            node.attributes.concat(node.ignoredAttributes),
                        );
                    },
                });
            },
        };
    },
};
