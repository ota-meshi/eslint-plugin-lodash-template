// @ts-check
"use strict";

const { getLegacyESLint, getESLint } = require("eslint-compat-utils/eslint");
const { getRuleTester } = require("eslint-compat-utils/rule-tester");
const { getLinter } = require("eslint-compat-utils/linter");

module.exports = {
    LegacyESLint: getLegacyESLint(),
    ESLint: getESLint(),
    RuleTester: getRuleTester(),
    Linter: getLinter(),
};
