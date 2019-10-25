"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-script-parsing-error.js")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("no-script-parsing-error", rule, {
    valid: [],
    invalid: [],
})
