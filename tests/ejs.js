"use strict"

const assert = require("assert")
const path = require("path")
const eslint = require("eslint")
const semver = require("semver")
const eslintVersion = require("eslint/package").version
const fs = require("fs")
const testUtils = require("./test-utils")

const CLIEngine = eslint.CLIEngine

const FIXTURE_DIR = path.join(__dirname, "../tests_fixtures/ejs")

/**
 * Assert the messages
 * @param {Array} actual The actual messages
 * @param {Array} expected The expected messages
 * @returns {void}
 */
function assertMessages(actual, expected) {
    const length = Math.max(actual.length, expected.length)
    const expected2 = []
    for (let i = 0; i < length; i++) {
        expected2.push(
            expected[i]
                ? Object.assign({}, actual[i], expected[i])
                : expected[i]
        )
    }

    assert.deepStrictEqual(actual, expected2)
    assert.strictEqual(actual.length, expected.length)
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
                return undefined
            }
            return value
        },
        2
    )
}

describe("ejs test", () => {
    if (semver.satisfies(eslintVersion, ">=7.0.0-rc")) {
        describe("should notify errors", () => {
            for (const name of testUtils
                .listupFiles(FIXTURE_DIR)
                .filter((s) => s.endsWith(".ejs"))) {
                it(name, () => {
                    const cli = new CLIEngine({
                        cwd: FIXTURE_DIR,
                    })
                    const report = cli.executeOnFiles([name])
                    const messages = testUtils.sortMessages(
                        report.results[0].messages
                    )

                    const expectFilepath = path.join(
                        FIXTURE_DIR,
                        `${name}.json`
                    )
                    try {
                        assertMessages(
                            messages,
                            JSON.parse(fs.readFileSync(expectFilepath, "utf8"))
                        )
                    } catch (e) {
                        testUtils.writeFile(
                            expectFilepath,
                            stringifyMessages(messages)
                        )
                        throw e
                    }
                })
            }
        })
    }
})
