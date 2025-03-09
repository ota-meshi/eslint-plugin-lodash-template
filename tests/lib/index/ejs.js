"use strict";

const assert = require("node:assert");
const path = require("node:path");
const { ESLint } = require("../../eslint-compat");
const fs = require("node:fs");
const testUtils = require("../../test-utils");

const FIXTURE_DIR = path.join(__dirname, "../../../tests_fixtures/ejs");

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

/**
 * stringify
 * @param {*} node
 */
function stringifyMessages(messages) {
    return JSON.stringify(
        messages,
        (key, value) => {
            if (["severity", "nodeType", "messageId", "fix"].includes(key)) {
                return undefined;
            }
            return value;
        },
        2,
    );
}

describe("ejs test", () => {
    describe("should notify errors", () => {
        for (const name of testUtils
            .listupFiles(FIXTURE_DIR)
            .filter((s) => s.endsWith(".ejs"))) {
            it(name, async () => {
                const eslint = new ESLint({
                    cwd: path.join(FIXTURE_DIR, path.dirname(name)),
                });
                const reportResults = await eslint.lintFiles([
                    path.basename(name),
                ]);
                const messages = testUtils.sortMessages(
                    reportResults[0].messages,
                );

                const expectFilepath = path.join(FIXTURE_DIR, `${name}.json`);
                try {
                    assertMessages(
                        messages,
                        JSON.parse(fs.readFileSync(expectFilepath, "utf8")),
                    );
                } catch (error) {
                    testUtils.writeFile(
                        expectFilepath,
                        stringifyMessages(messages),
                    );
                    throw error;
                }
            });
        }
    });
});
