"use strict"

const utils = require("../utils")
const casing = require("../utils/casing")

const converter = casing.getConverter("kebab-case")

module.exports = {
    meta: {
        docs: {
            description:
                "enforce HTML attribute name casing. (ex. :ok: `<div foo-bar>` :ng: `<div fooBar>` `<div FOO-BAR>`)",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.15.0/docs/rules/attribute-name-casing.md",
        },
        fixable: "code",
        messages: {
            unexpected: "Attribute `{{text}}` must be 'kebab-case'.",
        },
        schema: [
            {
                type: "object",
                properties: {
                    ignore: {
                        type: "array",
                        items: {
                            allOf: [
                                { type: "string" },
                                { not: { type: "string", pattern: ":exit$" } },
                                { not: { type: "string", pattern: "^\\s*$" } },
                            ],
                        },
                        uniqueItems: true,
                        additionalItems: false,
                    },
                },
                additionalProperties: false,
            },
        ],
        type: "suggestion",
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }
        if (!utils.isHtmlFile(context.getFilename())) {
            return {}
        }
        const option = context.options[0] || {}
        const ignore = option.ignore || []

        const microTemplateService = context.parserServices.getMicroTemplateService()

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLAttribute(node) {
                        const keyToken = node.keyToken
                        const actualKey = keyToken.htmlValue.trim()
                        if (ignore.indexOf(actualKey) >= 0) {
                            return
                        }
                        const expectKey = converter(actualKey)

                        if (expectKey !== keyToken.htmlValue) {
                            context.report({
                                node: keyToken,
                                messageId: "unexpected",
                                data: {
                                    text: actualKey,
                                },
                                fix:
                                    keyToken.htmlValue === keyToken.value &&
                                    keyToken.htmlValue.toLowerCase() ===
                                        expectKey
                                        ? (fixer) =>
                                              fixer.replaceText(
                                                  keyToken,
                                                  expectKey
                                              )
                                        : undefined,
                            })
                        }
                    },
                })
            },
        }
    },
}
