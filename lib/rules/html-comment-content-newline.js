"use strict";

const utils = require("../utils");

/**
 * Check whether the given node is a multiline
 * @param {object} contentFirstLoc The comment content first location.
 * @param {object} contentLastLoc The comment content last location.
 * @returns {boolean} `true` if the node is a multiline.
 */
function isMultiline(contentFirstLoc, contentLastLoc) {
    if (contentFirstLoc.line < contentLastLoc.line) {
        // multiline contents
        return true;
    }
    return false;
}

/**
 * Normalize options.
 * @param {object} options The options user configured.
 * @returns {object} The normalized options.
 */
function parseOptions(options) {
    return Object.assign(
        {
            singleline: "never",
            multiline: "always",
        },
        options,
    );
}

/**
 * Get the messageId for before tag open
 * @param  {number} expectedLineBreaks The number of expected line breaks
 * @param  {number} actualLineBreaks   The number of actual line breaks
 * @returns {string} The messageId
 */
function getMessageIdForTagOpen(expectedLineBreaks, actualLineBreaks) {
    if (expectedLineBreaks === 0) {
        if (actualLineBreaks === 1) {
            return "unexpectedAfterTagOpen";
        }
        return "expectedNoLineBreaksAfterTagOpenButNLineBreaks";
    }
    if (actualLineBreaks === 0) {
        return "missingAfterTagOpen";
    }
    return "expectedOneLineBreakAfterTagOpenButNLineBreaks";
}

/**
 * Get the messageId for after tag close
 * @param  {number} expectedLineBreaks The number of expected line breaks
 * @param  {number} actualLineBreaks   The number of actual line breaks
 * @returns {string} The messageId
 */
function getMessageIdForTagClose(expectedLineBreaks, actualLineBreaks) {
    if (expectedLineBreaks === 0) {
        if (actualLineBreaks === 1) {
            return "unexpectedBeforeTagClose";
        }
        return "expectedNoLineBreaksBeforeTagCloseButNLineBreaks";
    }
    if (actualLineBreaks === 0) {
        return "missingBeforeTagClose";
    }
    return "expectedOneLineBreakBeforeTagCloseButNLineBreaks";
}

module.exports = {
    meta: {
        docs: {
            description:
                "require or disallow a line break before and after HTML comment contents",
            category: "recommended-with-html",
            url: "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/html-comment-content-newline.html",
        },
        fixable: "whitespace",
        messages: {
            unexpectedAfterTagOpen:
                "Expected no line breaks after `<!--`, but 1 line break found.",
            expectedNoLineBreaksAfterTagOpenButNLineBreaks:
                "Expected no line breaks after `<!--`, but {{n}} line breaks found.",
            missingAfterTagOpen:
                "Expected 1 line break after `<!--`, but no line breaks found.",
            expectedOneLineBreakAfterTagOpenButNLineBreaks:
                "Expected 1 line break after `<!--`, but {{n}} line breaks found.",
            unexpectedBeforeTagClose:
                "Expected no line breaks before `-->`, but 1 line break found.",
            expectedNoLineBreaksBeforeTagCloseButNLineBreaks:
                "Expected no line breaks before `-->`, but {{n}} line breaks found.",
            missingBeforeTagClose:
                "Expected 1 line break before `-->`, but no line breaks found.",
            expectedOneLineBreakBeforeTagCloseButNLineBreaks:
                "Expected 1 line break before `-->`, but {{n}} line breaks found.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    singleline: { enum: ["ignore", "always", "never"] },
                    multiline: { enum: ["ignore", "always", "never"] },
                },
                additionalProperties: false,
            },
        ],
        type: "layout",
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {};
        }
        if (!utils.isHtmlFile(context.getFilename())) {
            return {};
        }

        const sourceCode = context.getSourceCode();
        const microTemplateService =
            context.parserServices.getMicroTemplateService();

        const options = parseOptions(context.options[0]);

        /**
         * Get the comments locations.
         * @param {ASTNode} node The HTML comment.
         * @returns {object} The comments locations.
         */
        function getCommentLocations(node) {
            const contentStartIndex = node.commentOpen.range[1];
            const contentEndIndex = node.commentClose.range[0];
            const contentText = sourceCode.text.slice(
                contentStartIndex,
                contentEndIndex,
            );
            const contentFirstIndex = (() => {
                const index = contentText.search(/\S/u);
                if (index >= 0) {
                    return index + contentStartIndex;
                }
                return contentEndIndex;
            })();
            const contentLastIndex = (() => {
                const index = contentText.search(/\S\s*$/gu);
                if (index >= 0) {
                    return index + contentStartIndex + 1;
                }
                return contentStartIndex;
            })();

            return {
                first: {
                    index: contentFirstIndex,
                    loc: sourceCode.getLocFromIndex(contentFirstIndex),
                },
                last: {
                    index: contentLastIndex,
                    loc: sourceCode.getLocFromIndex(contentLastIndex),
                },
            };
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLComment(node) {
                        const commentOpen = node.commentOpen;
                        const commentClose = node.commentClose;
                        if (!commentOpen || !commentClose) {
                            return;
                        }
                        const commentLocs = getCommentLocations(node);

                        const type = isMultiline(
                            commentLocs.first.loc,
                            commentLocs.last.loc,
                        )
                            ? options.multiline
                            : options.singleline;
                        if (type === "ignore") {
                            // 'ignore' option
                            return;
                        }
                        const beforeLineBreaks =
                            commentLocs.first.loc.line -
                            commentOpen.loc.end.line;
                        const afterLineBreaks =
                            commentClose.loc.start.line -
                            commentLocs.last.loc.line;
                        const expectedLineBreaks = type === "always" ? 1 : 0;
                        if (expectedLineBreaks !== beforeLineBreaks) {
                            context.report({
                                loc: {
                                    start: commentOpen.loc.end,
                                    end: commentLocs.first.loc,
                                },
                                messageId: getMessageIdForTagOpen(
                                    expectedLineBreaks,
                                    beforeLineBreaks,
                                ),
                                data: {
                                    n: beforeLineBreaks,
                                },
                                fix(fixer) {
                                    const range = [
                                        commentOpen.range[1],
                                        commentLocs.first.index,
                                    ];
                                    const text = "\n".repeat(
                                        expectedLineBreaks,
                                    );
                                    return fixer.replaceTextRange(range, text);
                                },
                            });
                        }

                        if (commentOpen.range[1] === commentLocs.last.index) {
                            return;
                        }

                        if (expectedLineBreaks !== afterLineBreaks) {
                            context.report({
                                loc: {
                                    start: commentLocs.last.loc,
                                    end: commentClose.loc.start,
                                },
                                messageId: getMessageIdForTagClose(
                                    expectedLineBreaks,
                                    afterLineBreaks,
                                ),
                                data: {
                                    n: afterLineBreaks,
                                },
                                fix(fixer) {
                                    const range = [
                                        commentLocs.last.index,
                                        commentClose.range[0],
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
