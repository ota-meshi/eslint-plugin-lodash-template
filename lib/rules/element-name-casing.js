"use strict"

const utils = require("../utils")
const casing = require("../utils/casing")

const converter = casing.getConverter("kebab-case")

module.exports = {
    meta: {
        docs: {
            description:
                "enforce HTML element name casing. (ex. :ok: `<xxx-element>` :ng: `<xxxElement>` `<DIV>`)",
            category: "recommended-with-html",
            url:
                "https://ota-meshi.github.io/eslint-plugin-lodash-template/rules/element-name-casing.html",
        },
        fixable: "code",
        messages: {
            unexpected: "Element name `{{name}}` must be 'kebab-case'.",
        },
        schema: [],
        type: "suggestion",
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }
        if (!utils.isHtmlFile(context.getFilename())) {
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
                                messageId: "unexpected",
                                data: {
                                    name: isStartTag
                                        ? `<${name}>`
                                        : `</${name}>`,
                                },
                                fix:
                                    name.toLowerCase() === expectName
                                        ? (fixer) =>
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
