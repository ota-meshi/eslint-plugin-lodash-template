"use strict"

const assert = require("assert")
const path = require("path")
const eslint = require("eslint")
const semver = require("semver")
const eslintVersion = require("eslint/package").version
const fs = require("fs")
const testUtils = require("../../test-utils")

const CLIEngine = eslint.CLIEngine

const FIXTURE_DIR = path.join(
    __dirname,
    "../../../tests_fixtures/script-processor"
)
const ALL_RULES_CONFIG_PATH = path.join(FIXTURE_DIR, "all-rules.eslintrc.js")

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
        const e = expected[i]
        if (e && e.message.includes("Parsing error")) {
            e.message = e.message.split(/\r\n|[\r\n]/u)[0]
        }
        const a = actual[i]
        if (a && a.message.includes("Parsing error")) {
            a.message = a.message.split(/\r\n|[\r\n]/u)[0]
        }
        expected2.push(e ? Object.assign({}, a, e) : e)
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

describe("script test", () => {
    describe("should notify errors", () => {
        for (const relPath of testUtils
            .listupFiles(FIXTURE_DIR)
            .filter(s => s.endsWith(".test"))) {
            const name = relPath.replace(/\.(test)$/u, "")
            describe(name, () => {
                const filepath = path.join(FIXTURE_DIR, name)
                const contents = fs.readFileSync(
                    path.join(FIXTURE_DIR, relPath),
                    "utf8"
                )
                if (testUtils.existsPath(`${filepath}.target.json`)) {
                    const tarrgetVar = JSON.parse(
                        fs.readFileSync(`${filepath}.target.json`, "utf8")
                    )
                    if (!semver.satisfies(eslintVersion, tarrgetVar)) {
                        return
                    }
                }

                // write for sample
                fs.writeFileSync(`${filepath}.js`, contents, "utf8")
                // write for autofix
                fs.writeFileSync(`${filepath}.fixed.js`, contents, "utf8")

                let parsingErrorJson = null
                if (testUtils.existsPath(`${filepath}.parsing_error.json`)) {
                    parsingErrorJson = JSON.parse(
                        fs.readFileSync(
                            `${filepath}.parsing_error.json`,
                            "utf8"
                        )
                    )
                }
                const parsingErrorOnly =
                    parsingErrorJson && parsingErrorJson.length === 1

                it("lint", () => {
                    const cli = new CLIEngine({
                        cwd: FIXTURE_DIR,
                    })
                    const report = cli.executeOnFiles([`${name}.js`])
                    const messages = testUtils.sortMessages(
                        report.results[0].messages
                    )

                    const expectFilepath = path.join(
                        FIXTURE_DIR,
                        `${name}.json`
                    )
                    if (!parsingErrorOnly) {
                        try {
                            assertMessages(
                                messages,
                                parsingErrorJson ||
                                    JSON.parse(
                                        fs.readFileSync(expectFilepath, "utf8")
                                    )
                            )
                        } catch (e) {
                            if (!parsingErrorJson) {
                                testUtils.writeFile(
                                    expectFilepath,
                                    stringifyMessages(messages)
                                )
                            } else {
                                testUtils.writeFile(
                                    `${filepath}.parsing_error.json`,
                                    stringifyMessages(messages)
                                )
                            }
                            throw e
                        }
                        if (!parsingErrorJson) {
                            assert.ok(
                                !stringifyMessages(messages).includes(
                                    "Parsing error"
                                ),
                                "No Parsing error"
                            )
                        }
                    } else {
                        assert.ok(
                            stringifyMessages(messages).includes(
                                "Parsing error"
                            ),
                            "Has Parsing error"
                        )
                        assertMessages(messages, parsingErrorJson)
                    }
                })

                if (!parsingErrorOnly) {
                    if (semver.satisfies(eslintVersion, ">=6.4.0")) {
                        it("autofix", () => {
                            const cli = new CLIEngine({
                                cwd: FIXTURE_DIR,
                                fix: true,
                            })
                            CLIEngine.outputFixes(
                                cli.executeOnFiles([`${name}.fixed.js`])
                            )
                            const report = cli.executeOnFiles([
                                `${name}.fixed.js`,
                            ])
                            const messages = testUtils.sortMessages(
                                report.results[0].messages
                            )

                            const expectFilepath = path.join(
                                FIXTURE_DIR,
                                `${name}.fixed.json`
                            )
                            try {
                                assertMessages(
                                    messages,
                                    JSON.parse(
                                        fs.readFileSync(expectFilepath, "utf8")
                                    )
                                )
                            } catch (e) {
                                testUtils.writeFile(
                                    expectFilepath,
                                    stringifyMessages(messages)
                                )
                                throw e
                            }
                            if (!parsingErrorJson) {
                                assert.ok(
                                    !stringifyMessages(messages).includes(
                                        "Parsing error"
                                    ),
                                    "No Parsing error"
                                )
                            }
                        })
                    }

                    const allConfigTestDirPath = path.join(
                        filepath,
                        "../all-rules-test"
                    )
                    if (
                        semver.satisfies(eslintVersion, ">=6.4.0") &&
                        testUtils.existsPath(allConfigTestDirPath)
                    ) {
                        const basename = path.basename(name)

                        // write for lint for all-rules
                        fs.writeFileSync(
                            path.join(
                                allConfigTestDirPath,
                                `${basename}.lint.js`
                            ),
                            contents,
                            "utf8"
                        )
                        // write for autofix for all-rules
                        fs.writeFileSync(
                            path.join(
                                allConfigTestDirPath,
                                `${basename}.fixed.js`
                            ),
                            contents,
                            "utf8"
                        )
                        // write for autofix for all-rules
                        fs.writeFileSync(
                            path.join(allConfigTestDirPath, ".eslintrc.js"),
                            fs.readFileSync(ALL_RULES_CONFIG_PATH, "utf8"),
                            "utf8"
                        )

                        it("all-rules-test lint", () => {
                            const cli = new CLIEngine({
                                cwd: allConfigTestDirPath,
                            })
                            const report = cli.executeOnFiles([
                                `${basename}.lint.js`,
                            ])
                            const messages = testUtils.sortMessages(
                                report.results[0].messages
                            )

                            const expectFilepath = path.join(
                                allConfigTestDirPath,
                                `${basename}.lint.json`
                            )
                            try {
                                assertMessages(
                                    messages,
                                    JSON.parse(
                                        fs.readFileSync(expectFilepath, "utf8")
                                    )
                                )
                            } catch (e) {
                                testUtils.writeFile(
                                    expectFilepath,
                                    stringifyMessages(messages)
                                )
                                throw e
                            }
                            assert.ok(
                                !stringifyMessages(messages).includes(
                                    "Parsing error"
                                ),
                                "No Parsing error"
                            )
                        })
                        it("all-rules-test autofix", () => {
                            const cli = new CLIEngine({
                                cwd: allConfigTestDirPath,
                                fix: true,
                            })
                            CLIEngine.outputFixes(
                                cli.executeOnFiles([`${basename}.fixed.js`])
                            )
                            const report = cli.executeOnFiles([
                                `${basename}.fixed.js`,
                            ])
                            const messages = testUtils.sortMessages(
                                report.results[0].messages
                            )

                            const expectFilepath = path.join(
                                allConfigTestDirPath,
                                `${basename}.fixed.json`
                            )
                            try {
                                assertMessages(
                                    messages,
                                    JSON.parse(
                                        fs.readFileSync(expectFilepath, "utf8")
                                    )
                                )
                            } catch (e) {
                                testUtils.writeFile(
                                    expectFilepath,
                                    stringifyMessages(messages)
                                )
                                throw e
                            }
                            assert.ok(
                                !stringifyMessages(messages).includes(
                                    "Parsing error"
                                ),
                                "No Parsing error"
                            )
                        })
                    }
                }
            })
        }
    })
})
