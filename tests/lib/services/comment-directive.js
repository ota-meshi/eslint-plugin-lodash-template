"use strict";

const assert = require("assert");
const { ESLint } = require("../../eslint-compat");
const testUtils = require("../../test-utils");

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
                : expected[i]
        );
    }

    assert.deepStrictEqual(actual, expected2);
    assert.strictEqual(actual.length, expected.length);
}

describe("comment-directive test", () => {
    it("has description", async () => {
        const cli = new ESLint({
            cwd: __dirname,
            baseConfig: {
                extends: ["plugin:lodash-template/base"],
                parserOptions: {
                    sourceType: "script",
                    ecmaVersion: 2020,
                },
                rules: {
                    semi: ["error", "never"],
                    "no-unused-vars": "error",
                },
            },
            useEslintrc: false,
        });
        const report = await cli.lintText(
            `
        <div>
          <!-- eslint-disable-next-line semi, no-unused-vars -->
          <% const a = 1; %>
          <!-- eslint-disable-next-line semi -- no-unused-vars -->
          <% const b = 1; %>
        </div>
        `,
            { filePath: "test.html" }
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
