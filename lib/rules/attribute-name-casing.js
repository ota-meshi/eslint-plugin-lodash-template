"use strict"

const casing = require("../utils/casing")

const converter = casing.getConverter("kebab-case")

module.exports = {
    meta: {
        docs: {
            description:
                "enforce attribute name casing. (ex. :ok: `<div foo-bar>` :ng: `<div fooBar>` `<div FOO-BAR>`)",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.4.0/docs/rules/attribute-name-casing.md",
        },
        fixable: "code",
        schema: [],
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }

        const microTemplateService = context.parserServices.getMicroTemplateService()

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLAttribute(node) {
                        const keyToken = node.keyToken
                        const actualKey = keyToken.htmlValue.trim()
                        const expectKey = converter(actualKey)

                        if (expectKey !== keyToken.htmlValue) {
                            context.report({
                                node: keyToken,
                                message:
                                    "Attribute `{{text}}` must be 'kebab-case'.",
                                data: {
                                    text: actualKey,
                                },
                                fix:
                                    keyToken.htmlValue === keyToken.value &&
                                    keyToken.htmlValue.toLowerCase() ===
                                        expectKey
                                        ? fixer =>
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
