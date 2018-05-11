"use strict"

const Linter = require("eslint").Linter
const rules = require("../lib/utils/rules").rules

describe("Don't crash even if without micro-template-eslint-parser.", () => {
    const code = "<body><div>TEST</div></body>"

    for (const rule of rules) {
        const ruleId = rule.meta.docs.ruleId

        it(ruleId, () => {
            const linter = new Linter()
            const config = {
                parser: "babel-eslint",
                parserOptions: { ecmaVersion: 2015 },
                rules: {
                    [ruleId]: "error",
                },
            }
            linter.defineRule(ruleId, rule)
            linter.verifyAndFix(code, config, "test.html")
        })
    }
})
