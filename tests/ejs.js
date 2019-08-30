"use strict"

const assert = require("assert")
const path = require("path")
const eslint = require("eslint")
const semver = require("semver")
const eslintVersion = require("eslint/package").version
const fs = require("fs")

const CLIEngine = eslint.CLIEngine

const ORIGINAL_FIXTURE_DIR = path.join(__dirname, "fixtures/ejs")
const FIXTURE_DIR = path.join(__dirname, "temp")
const CONFIG_PATH = path.join(ORIGINAL_FIXTURE_DIR, ".eslintrc.js")

/**
 * Remove dir
 * @param {string} dirPath dir path
 * @returns {void}
 */
function removeDirSync(dirPath) {
    if (fs.existsSync(dirPath)) {
        for (const file of fs.readdirSync(dirPath)) {
            const curPath = `${dirPath}/${file}`
            if (fs.lstatSync(curPath).isDirectory()) {
                removeDirSync(curPath)
            } else {
                fs.unlinkSync(curPath)
            }
        }
        fs.rmdirSync(dirPath)
    }
}

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

describe("ejs test", () => {
    beforeEach(() => {
        removeDirSync(FIXTURE_DIR)
        fs.mkdirSync(FIXTURE_DIR)
        for (const fileName of fs.readdirSync(ORIGINAL_FIXTURE_DIR)) {
            const src = path.join(ORIGINAL_FIXTURE_DIR, fileName)
            const dst = path.join(FIXTURE_DIR, fileName)

            if (fs.statSync(src).isFile()) {
                fs.writeFileSync(dst, fs.readFileSync(src))
            }
        }
    })
    afterEach(() => {
        removeDirSync(FIXTURE_DIR)
    })
    if (semver.satisfies(eslintVersion, ">=6.2.0")) {
        it("should notify errors", () => {
            const cli = new CLIEngine({
                cwd: FIXTURE_DIR,
                configFile: CONFIG_PATH,
                useEslintrc: false,
            })
            const report = cli.executeOnFiles(["hello.ejs"])
            const messages = report.results[0].messages

            assertMessages(messages, [
                {
                    ruleId: "no-undef",
                    message: "'_' is not defined.",
                    line: 4,
                    column: 7,
                    messageId: "undef",
                    endLine: 4,
                    endColumn: 8,
                },
                {
                    ruleId: "comma-spacing",
                    message: "A space is required after ','.",
                    line: 4,
                    column: 22,
                    messageId: "missing",
                    endLine: 4,
                    endColumn: 23,
                },
                {
                    ruleId: "function-call-argument-newline",
                    message:
                        "There should be a line break after this argument.",
                    line: 4,
                    column: 23,
                    messageId: "missingLineBreak",
                    endLine: 4,
                    endColumn: 23,
                },
                {
                    ruleId: "arrow-spacing",
                    message: "Missing space before =>.",
                    line: 4,
                    column: 28,
                    messageId: "expectedBefore",
                    endLine: 4,
                    endColumn: 29,
                },
                {
                    ruleId: "arrow-spacing",
                    message: "Missing space after =>.",
                    line: 4,
                    column: 31,
                    messageId: "expectedAfter",
                    endLine: 4,
                    endColumn: 32,
                },
                {
                    ruleId: "no-undef",
                    message: "'name' is not defined.",
                    line: 10,
                    column: 23,
                    messageId: "undef",
                    endLine: 10,
                    endColumn: 27,
                },
                {
                    ruleId: "prefer-template",
                    message: "Unexpected string concatenation.",
                    line: 14,
                    column: 10,
                    endLine: 14,
                    endColumn: 52,
                },
            ])
        })
    }
})
