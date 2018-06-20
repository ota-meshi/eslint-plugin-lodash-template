"use strict"

/**
 * get the value info.
 * @param {Token} valueToken The value token.
 * @returns {object} the value info.
 */
function calcValueInfo(valueToken) {
    const text = valueToken.htmlValue
    const firstChar = text[0]
    const quote = firstChar === "'" || firstChar === '"' ? firstChar : undefined
    const content = quote ? text.slice(1, -1) : text
    return {
        quote,
        content,
    }
}

const QUOTE_CHAR_TESTS = {
    double(valueInfo) {
        return valueInfo.quote === '"'
    },
    single(valueInfo) {
        return valueInfo.quote === "'"
    },
    either(valueInfo) {
        return valueInfo.quote === '"' || valueInfo.quote === "'"
    },
    "prefer-double"(valueInfo) {
        if (valueInfo.content.indexOf('"') < 0) {
            return valueInfo.quote === '"'
        }
        return valueInfo.quote === "'"
    },
}

const GET_PHRASES = {
    double() {
        return "double quotes"
    },
    single() {
        return "single quotes"
    },
    either() {
        return "quotes"
    },
    "prefer-double"(valueInfo) {
        if (valueInfo.content.indexOf('"') < 0) {
            return "double quotes"
        }
        return "single quotes"
    },
}
const GET_FIX_QUOTE_CHARS = {
    double() {
        return '"'
    },
    single() {
        return "'"
    },
    either() {
        return '"'
    },
    "prefer-double"(valueInfo) {
        if (valueInfo.content.indexOf('"') < 0) {
            return '"'
        }
        return "'"
    },
}

module.exports = {
    meta: {
        docs: {
            description:
                "enforce quotes style of HTML attributes. (ex. :ok: `<div class=\"abc\">` :ng: `<div class='abc'>` `<div class=abc>`)",
            category: "recommended-with-html",
            url:
                "https://github.com/ota-meshi/eslint-plugin-lodash-template/blob/v0.8.1/docs/rules/attribute-value-quote.md",
        },
        fixable: "code",
        schema: [
            {
                enum: ["double", "single", "either", "prefer-double"],
            },
        ],
    },

    create(context) {
        if (!context.parserServices.getMicroTemplateService) {
            return {}
        }

        const microTemplateService = context.parserServices.getMicroTemplateService()
        const option = context.options[0] || "prefer-double"
        const quoteCharTest = QUOTE_CHAR_TESTS[option]

        /**
         * Define the function which fixes the problem.
         * @param {Token} valueToken The value token.
         * @param {object} valueInfo The value info.
         * @returns {function} The defined function.
         */
        function defineFix(valueToken, valueInfo) {
            const text = valueToken.htmlValue
            if (text !== valueToken.value) {
                // can not fix
                return undefined
            }
            const quoteChar = GET_FIX_QUOTE_CHARS[option](valueInfo)

            const quotePattern = quoteChar === '"' ? /"/g : /'/g
            const quoteEscaped = quoteChar === '"' ? "&quot;" : "&apos;"
            return fixer => {
                const replacement =
                    quoteChar +
                    valueInfo.content.replace(quotePattern, quoteEscaped) +
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
                        const valueInfo = calcValueInfo(valueToken)

                        if (!quoteCharTest(valueInfo)) {
                            context.report({
                                node: valueToken,
                                message:
                                    "Expected to be enclosed by {{phrase}}.",
                                data: {
                                    phrase: GET_PHRASES[option](valueInfo),
                                },
                                fix: defineFix(valueToken, valueInfo),
                            })
                        }
                    },
                })
            },
        }
    },
}
