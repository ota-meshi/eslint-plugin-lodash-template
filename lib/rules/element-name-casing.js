"use strict"

const casing = require("../utils/casing")

const converter = casing.getConverter("kebab-case")

module.exports = {
    meta: {
        docs: {
            description:
                "enforce element name casing. (ex. :ok: `<xxx-element>` :ng: `<xxxElement>` `<DIV>`)",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.4.0/docs/rules/element-name-casing.md",
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
                    "HTMLStartTag, HTMLEndTag"(node) {
                        const tagOpen = node.tagOpen
                        const isStartTag = tagOpen.type === "HTMLTagOpen"
                        const name = tagOpen.htmlValue.slice(isStartTag ? 1 : 2)
                        const expectName = converter(name)

                        if (expectName !== name) {
                            context.report({
                                node: tagOpen,
                                message:
                                    "Element name `{{name}}` must be 'kebab-case'.",
                                data: {
                                    name: isStartTag
                                        ? `<${name}>`
                                        : `</${name}>`,
                                },
                                fix:
                                    name.toLowerCase() === expectName
                                        ? fixer =>
                                              fixer.replaceText(
                                                  tagOpen,
                                                  isStartTag
                                                      ? `<${expectName}`
                                                      : `</${expectName}`
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
