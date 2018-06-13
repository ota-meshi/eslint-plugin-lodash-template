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
                        const expectKey = converter(node.rawKey)

                        if (expectKey !== node.rawKey) {
                            context.report({
                                node: node.keyToken,
                                message:
                                    "Attribute `{{text}}` must be 'kebab-case'.",
                                data: {
                                    text: node.rawKey,
                                },
                                fix:
                                    node.rawKey.toLowerCase() === expectKey
                                        ? fixer =>
                                              fixer.replaceText(
                                                  node.keyToken,
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
