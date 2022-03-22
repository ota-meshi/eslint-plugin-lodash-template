"use strict"

const assert = require("assert")
const Linter = require("eslint").Linter
const rules = require("../../../lib/utils/rules").rules

describe("Don't crash even if without micro-template-eslint-parser.", () => {
    const code = "<body><div>TEST</div></body>"

    for (const rule of rules) {
        const ruleId = rule.meta.docs.ruleId

        it(ruleId, () => {
            const linter = new Linter()
            const config = {
                parserOptions: {
                    ecmaVersion: 2020,
                    ecmaFeatures: { jsx: true },
                },
                rules: {
                    [ruleId]: "error",
                },
            }
            linter.defineRule(ruleId, rule)
            const res = linter.verifyAndFix(code, config, {
                filename: "test.html",
            })

            assert.strictEqual(res.messages.length, 0)
        })
    }
})
