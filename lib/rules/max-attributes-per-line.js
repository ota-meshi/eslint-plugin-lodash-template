"use strict"

/**
 * Normalize options.
 * @param {object} options The options user configured.
 * @returns {object} The normalized options.
 */
function parseOptions(options) {
    const defaults = {
        singleline: 1,
        multiline: 1,
        allowFirstLine: false,
    }

    if (options) {
        if (typeof options.singleline === "number") {
            defaults.singleline = options.singleline
        } else if (options.singleline && options.singleline.max) {
            defaults.singleline = options.singleline.max
        }

        if (options.multiline) {
            if (typeof options.multiline === "number") {
                defaults.multiline = options.multiline
            } else if (typeof options.multiline === "object") {
                if (options.multiline.max) {
                    defaults.multiline = options.multiline.max
                }

                if (options.multiline.allowFirstLine) {
                    defaults.allowFirstLine = options.multiline.allowFirstLine
                }
            }
        }
    }

    return defaults
}

/**
 * Check whether the node is declared in a single line or not.
 * @param {ASTNode} node The startTag node
 * @returns {boolean} `true` if the node is declared in a single line
 */
function isSingleLine(node) {
    return node.loc.start.line === node.loc.end.line
}

module.exports = {
    meta: {
        docs: {
            description: "enforce the maximum number of attributes per line",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.3.0/docs/rules/max-attributes-per-line.md",
        },
        fixable: "whitespace",
        schema: [
            {
                type: "object",
                properties: {
                    singleline: {
                        anyOf: [
                            {
                                type: "number",
                                minimum: 1,
                            },
                            {
                                type: "object",
                                properties: {
                                    max: {
                                        type: "number",
                                        minimum: 1,
                                    },
                                },
                                additionalProperties: false,
                            },
                        ],
                    },
                    multiline: {
                        anyOf: [
                            {
                                type: "number",
                                minimum: 1,
                            },
                            {
                                type: "object",
                                properties: {
                                    max: {
                                        type: "number",
                                        minimum: 1,
                                    },
                                    allowFirstLine: {
                                        type: "boolean",
                                    },
                                },
                                additionalProperties: false,
                            },
                        ],
                    },
                },
            },
        ],
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }

        const microTemplateService = context.parserServices.getMicroTemplateService()

        const configuration = parseOptions(context.options[0])
        const multilineMaximum = configuration.multiline
        const singlelinemMaximum = configuration.singleline
        const canHaveFirstLine = configuration.allowFirstLine

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLStartTag(node) {
                        const numberOfAttributes = node.attributes.length

                        if (!numberOfAttributes) return

                        if (isSingleLine(node)) {
                            if (numberOfAttributes > singlelinemMaximum) {
                                report(
                                    node.attributes.slice(singlelinemMaximum)
                                )
                            }
                        } else {
                            if (
                                !canHaveFirstLine &&
                                node.attributes[0].loc.start.line ===
                                    node.loc.start.line
                            ) {
                                report([node.attributes[0]])
                            }

                            const errorAttrLines = groupAttrsByLine(
                                node.attributes
                            ).filter(attrs => attrs.length > multilineMaximum)

                            for (const attrs of errorAttrLines) {
                                report(attrs.splice(multilineMaximum))
                            }
                        }
                    },
                })
            },
        }

        /**
         * Report warning the given attribute nodes.
         * @param  {Array} attributes The attribute nodes
         * @returns {void}
         */
        function report(attributes) {
            attributes.forEach((prop, i) => {
                context.report({
                    node: prop,
                    loc: prop.loc,
                    message:
                        'Attribute "{{propName}}" should be on a new line.',
                    data: {
                        propName: prop.key,
                    },
                    fix:
                        i === 0
                            ? fixer => fixer.insertTextBefore(prop, "\n")
                            : undefined,
                })
            })
        }

        /**
         * Grouping attribute lists line by line
         * @param  {Array} attributes The attribute nodes
         * @returns {Array} The group attribute nodes
         */
        function groupAttrsByLine(attributes) {
            const propsPerLine = [[attributes[0]]]

            attributes.reduce((previous, current) => {
                if (previous.loc.end.line === current.loc.start.line) {
                    propsPerLine[propsPerLine.length - 1].push(current)
                } else {
                    propsPerLine.push([current])
                }
                return current
            })

            return propsPerLine
        }
    },
}
