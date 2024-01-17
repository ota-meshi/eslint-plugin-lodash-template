"use strict";

const assert = require("assert");
const Linter = require("../../eslint-compat").Linter;
const rules = require("../../../lib/utils/rules").rules;

describe("Don't crash even if without micro-template-eslint-parser.", () => {
    const code = "<body><div>TEST</div></body>";

    const plugin = {
        rules: Object.fromEntries(
            rules.map((rule) => [rule.meta.docs.ruleName, rule]),
        ),
    };

    for (const rule of rules) {
        const ruleId = rule.meta.docs.ruleId;

        it(ruleId, () => {
            const linter = new Linter();
            const config = {
                plugins: {
                    "lodash-template": plugin,
                },
                languageOptions: {
                    ecmaVersion: 2020,
                    parserOptions: {
                        ecmaFeatures: { jsx: true },
                    },
                },
                rules: {
                    [ruleId]: "error",
                },
                files: ["**"],
            };
            const res = linter.verifyAndFix(code, config, {
                filename: "test.html",
            });

            assert.deepStrictEqual(res.messages, []);
        });
    }
});
