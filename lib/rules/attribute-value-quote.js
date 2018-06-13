"use strict"

const QUOTE_CHAR_TESTS = {
    double(c) {
        return c === '"'
    },
    single(c) {
        return c === "'"
    },
    either(c) {
        return c === '"' || c === "'"
    },
}

const QUOTE_PHRASES = {
    double: "double quotes",
    single: "single quotes",
    either: "quotes",
}

module.exports = {
    meta: {
        docs: {
            description:
                "enforce quotes style of HTML attributes. (ex. :ok: `<div class=\"abc\">` :ng: `<div class='abc'>` `<div class=abc>`)",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.4.0/docs/rules/attribute-value-quote.md",
        },
        fixable: "code",
        schema: [
            {
                enum: ["double", "single", "either"],
            },
        ],
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }

        const microTemplateService = context.parserServices.getMicroTemplateService()
        const option = context.options[0] || "double"
        const quoteCharTest = QUOTE_CHAR_TESTS[option]
        const quotePhrase = QUOTE_PHRASES[option]
        const double = option !== "single"
        const quoteChar = double ? '"' : "'"
        const quotePattern = double ? /"/g : /'/g
        const quoteEscaped = double ? "&quot;" : "&apos;"

        /**
         * Define the function which fixes the problem.
         * @param {Token} valueToken The value token.
         * @returns {function} The defined function.
         */
        function defineFix(valueToken) {
            return fixer => {
                const text = valueToken.htmlValue
                const firstChar = text[0]
                if (text !== valueToken.value) {
                    // can not fix
                    return undefined
                }
                const contentText =
                    firstChar === "'" || firstChar === '"'
                        ? text.slice(1, -1)
                        : text
                const replacement =
                    quoteChar +
                    contentText.replace(quotePattern, quoteEscaped) +
                    quoteChar
                return fixer.replaceText(valueToken, replacement)
            }
        }

        return {
            "Program:exit"() {
                microTemplateService.traverseDocumentNodes({
                    HTMLAttribute(node) {
                        const valueToken = node.valueToken
                        if (!valueToken) {
                            return
                        }
                        const text = valueToken.htmlValue

                        if (!quoteCharTest(text[0])) {
                            context.report({
                                node: valueToken,
                                message:
                                    "Expected to be enclosed by {{phrase}}.",
                                data: {
                                    phrase: quotePhrase,
                                },
                                fix: defineFix(valueToken),
                            })
                        }
                    },
                })
            },
        }
    },
}
