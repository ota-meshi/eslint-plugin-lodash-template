// @ts-check
"use strict";

const { getESLint } = require("eslint-compat-utils/eslint");
const { getRuleTester } = require("eslint-compat-utils/rule-tester");
const { getLinter } = require("eslint-compat-utils/linter");

// We are currently only supporting ESLint v9. But, we preserve this structure
// for future-proofing, perhaps for ESLint v10.
module.exports = {
    ESLint: getESLint(),
    RuleTester: getRuleTester(),
    Linter: getLinter(),
};
