"use strict"

/**
 * Check whether the given node is a multiline
 * @param {ASTNode} node The element node.
 * @param {object} contentFirstLoc The content first location.
 * @param {object} contentLastLoc The content last location.
 * @returns {boolean} `true` if the node is a multiline.
 */
function isMultiline(node, contentFirstLoc, contentLastLoc) {
    if (
        node.startTag.loc.start.line !== node.startTag.loc.end.line ||
        node.endTag.loc.start.line !== node.endTag.loc.end.line
    ) {
        // multiline tag
        return true
    }
    if (contentFirstLoc.line < contentLastLoc.line) {
        // multiline contents
        return true
    }
    return false
}

/**
 * Normalize options.
 * @param {object} options The options user configured.
 * @returns {object} The normalized options.
 */
function parseOptions(options) {
    return Object.assign(
        {
            singleline: "ignore",
            multiline: "always",
            ignoreNames: ["pre", "textarea"],
        },
        options
    )
}

/**
 * Get the message phrase
 * @param  {number} lineBreaks The number of line breaks
 * @returns {string} The message phrase
 */
function getPhrase(lineBreaks) {
    switch (lineBreaks) {
        case 0:
            return "no line breaks"
        case 1:
            return "1 line break"
        default:
            return `${lineBreaks} line breaks`
    }
}

module.exports = {
    meta: {
        docs: {
            description:
                "require or disallow a line break before and after HTML contents",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.8.0/docs/rules/html-content-newline.md",
        },
        fixable: "whitespace",
        schema: [
            {
                type: "object",
                properties: {
                    singleline: { enum: ["ignore", "always", "never"] },
                    multiline: { enum: ["ignore", "always", "never"] },
                    ignoreNames: {
                        type: "array",
                        items: { type: "string" },
                        uniqueItems: true,
                        additionalItems: false,
                    },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }

        const sourceCode = context.getSourceCode()
        const microTemplateService = context.parserServices.getMicroTemplateService()

        const options = parseOptions(context.options[0])

        /**
         * Check whether the given node is in ignore.
         * @param {ASTNode} node The element node.
         * @returns {boolean} `true` if the given node is in ignore.
         */
        function isIgnore(node) {
            let target = node
            while (target.type === "HTMLElement") {
                if (options.ignoreNames.indexOf(target.name) >= 0) {
                    // ignore element name
                    return true
                }
                target = target.parent
            }
            return false
        }

        /**
         * Get the contents locations.
         * @param {ASTNode} node The element node.
         * @returns {object} The contents locations.
         */
        function getContentLocatuons(node) {
            const contentStartIndex = node.startTag
                ? node.startTag.range[1]
                : node.range[0]
            const contentEndIndex = node.endTag
                ? node.endTag.range[0]
                : node.range[1]
            const contentText = sourceCode.text.slice(
                contentStartIndex,
                contentEndIndex
            )
            const contentFirstIndex = (() => {
                const index = contentText.search(/\S/)
                if (index >= 0) {
                    return index + contentStartIndex
                }
                return contentEndIndex
            })()
            const contentLastIndex = (() => {
                const index = contentText.search(/\S\s*$/g)
                if (index >= 0) {
                    return index + contentStartIndex + 1
                }
                return contentStartIndex
            })()

            return {
                first: {
                    index: contentFirstIndex,
                    loc: sourceCode.getLocFromIndex(contentFirstIndex),
                },
                last: {
                    index: contentLastIndex,
                    loc: sourceCode.getLocFromIndex(contentLastIndex),
                },
            }
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLElement(node) {
                        if (
                            !node.startTag ||
                            node.startTag.selfClosing ||
                            !node.endTag
                        ) {
                            // self closing
                            return
                        }
                        if (isIgnore(node)) {
                            return
                        }

                        const contentsLocs = getContentLocatuons(node)

                        const type = isMultiline(
                            node,
                            contentsLocs.first.loc,
                            contentsLocs.last.loc
                        )
                            ? options.multiline
                            : options.singleline
                        if (type === "ignore") {
                            // 'ignore' option
                            return
                        }
                        const beforeLineBreaks =
                            contentsLocs.first.loc.line -
                            node.startTag.loc.end.line
                        const afterLineBreaks =
                            node.endTag.loc.start.line -
                            contentsLocs.last.loc.line
                        const expectedLineBreaks = type === "always" ? 1 : 0
                        if (expectedLineBreaks !== beforeLineBreaks) {
                            context.report({
                                loc: {
                                    start: node.startTag.loc.end,
                                    end: contentsLocs.first.loc,
                                },
                                message: `Expected {{expected}} after closing bracket of the "{{name}}" element, but {{actual}} found.`,
                                data: {
                                    name: node.name,
                                    expected: getPhrase(expectedLineBreaks),
                                    actual: getPhrase(beforeLineBreaks),
                                },
                                fix(fixer) {
                                    const range = [
                                        node.startTag.range[1],
                                        contentsLocs.first.index,
                                    ]
                                    const text = "\n".repeat(expectedLineBreaks)
                                    return fixer.replaceTextRange(range, text)
                                },
                            })
                        }

                        if (expectedLineBreaks !== afterLineBreaks) {
                            context.report({
                                loc: {
                                    start: contentsLocs.last.loc,
                                    end: node.endTag.loc.start,
                                },
                                message:
                                    'Expected {{expected}} before opening bracket of the "{{name}}" element, but {{actual}} found.',
                                data: {
                                    name: node.name,
                                    expected: getPhrase(expectedLineBreaks),
                                    actual: getPhrase(afterLineBreaks),
                                },
                                fix(fixer) {
                                    const range = [
                                        contentsLocs.last.index,
                                        node.endTag.range[0],
                                    ]
                                    const text = "\n".repeat(expectedLineBreaks)
                                    return fixer.replaceTextRange(range, text)
                                },
                            })
                        }
                    },
                })
            },
        }
    },
}
