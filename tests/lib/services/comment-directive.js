"use strict";

const assert = require("node:assert");
const stylisticJs = require("@stylistic/eslint-plugin-js");
const { ESLint } = require("../../eslint-compat");
const testUtils = require("../../test-utils");
const eslintPluginLodashTemplate = require("../../../lib");

/**
 * Assert the messages
 * @param {Array} actual The actual messages
 * @param {Array} expected The expected messages
 * @returns {void}
 */
function assertMessages(actual, expected) {
    const length = Math.max(actual.length, expected.length);
    const expected2 = [];
    for (let i = 0; i < length; i++) {
        expected2.push(
            expected[i]
                ? Object.assign({}, actual[i], expected[i])
                : expected[i],
        );
    }

    assert.deepStrictEqual(actual, expected2);
    assert.strictEqual(actual.length, expected.length);
}

describe("comment-directive test", () => {
    it("has description", async () => {
        const cli = new ESLint({
            cwd: __dirname,
            overrideConfigFile: true,
            overrideConfig: [
                {
                    files: ["*.html"],
                    ...eslintPluginLodashTemplate.configs.base,
                    processor: eslintPluginLodashTemplate.processors.html,
                },
                {
                    files: ["*.html"],
                    plugins: {
                        "@stylistic/js": stylisticJs,
                    },
                    languageOptions: {
                        parserOptions: {
                            sourceType: "script",
                            ecmaVersion: 2020,
                        },
                    },
                    rules: {
                        "@stylistic/js/semi": ["error", "never"],
                        "no-unused-vars": "error",
                    },
                },
            ],
        });
        const report = await cli.lintText(
            `
        <div>
          <!-- eslint-disable-next-line @stylistic/js/semi, no-unused-vars -->
          <% const a = 1; %>
          <!-- eslint-disable-next-line @stylistic/js/semi -- no-unused-vars -->
          <% const b = 1; %>
        </div>
        `,
            { filePath: "test.html" },
        );
        const messages = testUtils.sortMessages(report[0].messages);

        assertMessages(messages, [
            {
                message: "'b' is assigned a value but never used.",
                line: 6,
            },
        ]);
    });
});
