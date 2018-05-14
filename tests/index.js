"use strict"

const assert = require("assert")
const path = require("path")
const eslint = require("eslint")
const fs = require("fs-extra")

const CLIEngine = eslint.CLIEngine

const ORIGINAL_FIXTURE_DIR = path.join(__dirname, "fixtures")
const FIXTURE_DIR = path.join(__dirname, "temp")
const CONFIG_PATH = path.join(ORIGINAL_FIXTURE_DIR, "test.eslintrc.js")

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
        expected2.push(expected[i] ? Object.assign({}, actual[i], expected[i]) : expected[i])
    }

    assert.deepEqual(actual, expected2)
    assert.strictEqual(actual.length, expected.length)
}


describe("Basic tests", () => {
    beforeEach(() => {
        fs.emptyDirSync(FIXTURE_DIR)
        for (const fileName of fs.readdirSync(ORIGINAL_FIXTURE_DIR)) {
            const src = path.join(ORIGINAL_FIXTURE_DIR, fileName)
            const dst = path.join(FIXTURE_DIR, fileName)

            if (fs.statSync(src).isFile()) {
                fs.copySync(src, dst)
            }
        }
    })
    afterEach(() => {
        fs.removeSync(FIXTURE_DIR)
    })


    describe("About fixtures/hello.html", () => {
        it("should notify errors", () => {
            const cli = new CLIEngine({
                cwd: FIXTURE_DIR,
                configFile: CONFIG_PATH,
                useEslintrc: false,
            })
            const report = cli.executeOnFiles(["hello.html"])
            const messages = report.results[0].messages

            assertMessages(messages, [
                {
                    ruleId: "local/template-tag-spacing",
                    message: "Expected 1 space after '<%', but no spaces found.",
                    column: 5,
                    endColumn: 7,
                    endLine: 4,
                    line: 4,
                },
                {
                    ruleId: "comma-spacing",
                    message: "A space is required after ','.",
                    column: 22,
                    endColumn: 23,
                    endLine: 4,
                    line: 4,
                },
                {
                    ruleId: "arrow-spacing",
                    message: "Missing space before =>.",
                    column: 28,
                    endColumn: 29,
                    endLine: 4,
                    line: 4,
                },
                {
                    ruleId: "arrow-spacing",
                    message: "Missing space after =>.",
                    line: 4,
                    endLine: 4,
                    column: 31,
                    endColumn: 32,
                },
                {
                    ruleId: "local/template-tag-spacing",
                    message: "Expected 1 space before '%>', but no spaces found.",
                    line: 5,
                    endLine: 5,
                    column: 21,
                    endColumn: 23,
                },
                {
                    column: 11,
                    endColumn: 13,
                    endLine: 6,
                    line: 6,
                    message: "Expected 1 space before '%>', but no spaces found.",
                    ruleId: "local/template-tag-spacing",
                },
                {
                    column: 20,
                    endColumn: 23,
                    endLine: 10,
                    line: 10,
                    message: "Expected 1 space after '<%-', but no spaces found.",
                    ruleId: "local/template-tag-spacing",
                },
                {
                    column: 27,
                    endColumn: 29,
                    endLine: 10,
                    line: 10,
                    message: "Expected 1 space before '%>', but no spaces found.",
                    ruleId: "local/template-tag-spacing",
                },
                {
                    column: 15,
                    endColumn: 18,
                    endLine: 11,
                    line: 11,
                    message: "Expected 1 space after '<%-', but no spaces found.",
                    ruleId: "local/template-tag-spacing",
                },
                {
                    column: 25,
                    endColumn: 27,
                    endLine: 11,
                    line: 11,
                    message: "Expected 1 space before '%>', but no spaces found.",
                    ruleId: "local/template-tag-spacing",
                },
                {
                    column: 45,
                    endColumn: 48,
                    endLine: 11,
                    line: 11,
                    message: "Expected 1 space after '<%-', but no spaces found.",
                    ruleId: "local/template-tag-spacing",
                },
                {
                    column: 58,
                    endColumn: 60,
                    endLine: 11,
                    line: 11,
                    message: "Expected 1 space before '%>', but no spaces found.",
                    ruleId: "local/template-tag-spacing",
                },
                {
                    column: 10,
                    endColumn: 52,
                    endLine: 14,
                    line: 14,
                    message: "Unexpected string concatenation.",
                    ruleId: "prefer-template",
                },
            ])
        })

        it("should fix errors with --fix option", () => {
            const cli = new CLIEngine({
                cwd: FIXTURE_DIR,
                fix: true,
                configFile: CONFIG_PATH,
                useEslintrc: false,
            })
            CLIEngine.outputFixes(cli.executeOnFiles(["hello.html"]))

            const actual = fs.readFileSync(path.join(FIXTURE_DIR, "hello.html"), "utf8")
            const expected = fs.readFileSync(path.join(FIXTURE_DIR, "hello.html.fixed.html"), "utf8")

            assert.deepEqual(actual.trim(), expected.trim())
        })
    })
    describe("About fixtures/comment-directive.html", () => {
        it("should no errors", () => {
            const cli = new CLIEngine({
                cwd: FIXTURE_DIR,
                configFile: CONFIG_PATH,
                useEslintrc: false,
            })
            const report = cli.executeOnFiles(["comment-directive.html"])
            const messages = report.results[0].messages

            assertMessages(messages, [])
        })
    })
    describe("About fixtures/no-error", () => {
        const result = fs.readdirSync(ORIGINAL_FIXTURE_DIR)
        for (const name of result.filter(s => s.indexOf("no-error-") === 0)) {
            it(`should no errors /${name}`, () => {
                const cli = new CLIEngine({
                    cwd: FIXTURE_DIR,
                    configFile: CONFIG_PATH,
                    useEslintrc: false,
                })
                const report = cli.executeOnFiles([name])
                const messages = report.results[0].messages

                assertMessages(messages, [])
            })
        }
    })
})
