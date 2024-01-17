"use strict";

const RuleTester = require("../../eslint-compat").RuleTester;
const rule = require("../../../lib/rules/no-script-parsing-error.js");

const tester = new RuleTester({
    languageOptions: {
        parser: require("../../../lib/parser/micro-template-eslint-parser"),
        ecmaVersion: 2015,
    },
});

tester.run("no-script-parsing-error", rule, {
    valid: [],
    invalid: [],
});
