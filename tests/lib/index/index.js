"use strict";

const assert = require("assert");
const path = require("path");
const { ESLint, Linter } = require("../..//eslint-compat");
const semver = require("semver");
const eslintVersion = require("eslint/package.json").version;
const fs = require("fs");
const plugin = require("../../..");
const rule = require("../../../lib/rules/no-empty-template-tag");

const FIXTURE_DIR = path.join(__dirname, "../../../tests_fixtures/index");
const CONFIG_PATH = path.join(FIXTURE_DIR, ".eslintrc.js");

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

describe("index test", () => {
    it("processor extension should be html", () => {
        assert(Object.keys(plugin.processors).length, 1);
        assert.ok(Boolean(plugin.processors[".html"]), "don't have html");
    });
    it("If it passes through the processor, it must be processed by the parser.", () => {
        const linter = new Linter();
        const config = {
            parser: "micro-template-eslint-parser",
            parserOptions: { ecmaVersion: 2015 },
            rules: {
                "no-empty-template-tag": "error",
            },
        };
        const options = {
            preprocess(code) {
                return plugin.processors.base.preprocess(code, "test.ejs");
            },
            postprocess(messages) {
                return plugin.processors.base.postprocess(messages, "test.ejs");
            },
        };
        linter.defineParser(
            "micro-template-eslint-parser",
            require("../../../lib/parser/micro-template-eslint-parser")
        );
        linter.defineRule("no-empty-template-tag", rule);
        const messagesEjs = linter.verify("'use strict'<%%>", config, {
            filename: "test.ejs",
            ...options,
        });

        assert.strictEqual(messagesEjs[0].ruleId, "no-empty-template-tag");
    });
    it("If it does not pass through the processor, it will not be processed by the parser.", () => {
        const linter = new Linter();
        const config = {
            parser: "micro-template-eslint-parser",
            parserOptions: { ecmaVersion: 2015 },
            rules: {
                "no-empty-template-tag": "error",
            },
        };
        linter.defineParser(
            "micro-template-eslint-parser",
            require("../../../lib/parser/micro-template-eslint-parser")
        );
        linter.defineRule("no-empty-template-tag", rule);
        const messagesEjs = linter.verify("'use strict'<%%>", config, {
            filename: "test.ejs",
        });

        assert.strictEqual(messagesEjs[0].ruleId, null); // parse error

        const messagesEjb = linter.verify("'use strict'<%%>", config, {
            filename: "test.ejb",
        });

        assert.strictEqual(messagesEjb[0].ruleId, null); // parse error
    });
});

describe("Basic tests", () => {
    if (semver.satisfies(eslintVersion, ">=7.0.0-rc")) {
        describe("About fixtures/hello.html", () => {
            it("should notify errors", async () => {
                const cli = new ESLint({
                    cwd: FIXTURE_DIR,
                    overrideConfigFile: CONFIG_PATH,
                    useEslintrc: false,
                });
                const reportResults = await cli.lintFiles(["hello.html"]);
                const messages = reportResults[0].messages;

                assertMessages(messages, [
                    {
                        ruleId: "lodash-template/template-tag-spacing",
                        message:
                            "Expected 1 space after `<%`, but no spaces found.",
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
                        ruleId: "function-call-argument-newline",
                        line: 4,
                        column: 23,
                        messageId: "missingLineBreak",
                        endLine: 4,
                        endColumn: 23,
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
                        ruleId: "lodash-template/template-tag-spacing",
                        message:
                            "Expected 1 space before `%>`, but no spaces found.",
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
                        message:
                            "Expected 1 space before `%>`, but no spaces found.",
                        ruleId: "lodash-template/template-tag-spacing",
                    },
                    {
                        column: 20,
                        endColumn: 23,
                        endLine: 10,
                        line: 10,
                        message:
                            "Expected 1 space after `<%-`, but no spaces found.",
                        ruleId: "lodash-template/template-tag-spacing",
                    },
                    {
                        column: 27,
                        endColumn: 29,
                        endLine: 10,
                        line: 10,
                        message:
                            "Expected 1 space before `%>`, but no spaces found.",
                        ruleId: "lodash-template/template-tag-spacing",
                    },
                    {
                        column: 15,
                        endColumn: 18,
                        endLine: 11,
                        line: 11,
                        message:
                            "Expected 1 space after `<%-`, but no spaces found.",
                        ruleId: "lodash-template/template-tag-spacing",
                    },
                    {
                        column: 25,
                        endColumn: 27,
                        endLine: 11,
                        line: 11,
                        message:
                            "Expected 1 space before `%>`, but no spaces found.",
                        ruleId: "lodash-template/template-tag-spacing",
                    },
                    {
                        column: 45,
                        endColumn: 48,
                        endLine: 11,
                        line: 11,
                        message:
                            "Expected 1 space after `<%-`, but no spaces found.",
                        ruleId: "lodash-template/template-tag-spacing",
                    },
                    {
                        column: 58,
                        endColumn: 60,
                        endLine: 11,
                        line: 11,
                        message:
                            "Expected 1 space before `%>`, but no spaces found.",
                        ruleId: "lodash-template/template-tag-spacing",
                    },
                    {
                        column: 63,
                        line: 11,
                        message: "Irregular whitespace '\\u3000' not allowed.",
                        ruleId: "lodash-template/no-irregular-whitespace",
                    },
                    {
                        column: 10,
                        endColumn: 52,
                        endLine: 14,
                        line: 14,
                        message: "Unexpected string concatenation.",
                        ruleId: "prefer-template",
                    },
                ]);
            });

            if (semver.satisfies(eslintVersion, ">=7.0.0-rc")) {
                it("should fix errors with --fix option", async () => {
                    const baseFilepath = path.join(FIXTURE_DIR, "hello.html");
                    const testFilepath = path.join(
                        FIXTURE_DIR,
                        "hello.html.fixtarget.html"
                    );
                    // copy
                    fs.copyFileSync(baseFilepath, testFilepath);

                    const cli = new ESLint({
                        cwd: FIXTURE_DIR,
                        fix: true,
                        overrideConfigFile: CONFIG_PATH,
                        useEslintrc: false,
                    });
                    await ESLint.outputFixes(
                        await cli.lintFiles(["hello.html.fixtarget.html"])
                    );

                    const actual = fs.readFileSync(testFilepath, "utf8");
                    fs.unlinkSync(testFilepath);
                    const expected = fs.readFileSync(
                        path.join(FIXTURE_DIR, "hello.html.fixed.html"),
                        "utf8"
                    );

                    assert.deepStrictEqual(actual.trim(), expected.trim());
                });
            }
        });
    }
    describe("About fixtures/comment-directive.html", () => {
        it("should no errors", async () => {
            const cli = new ESLint({
                cwd: FIXTURE_DIR,
                overrideConfigFile: CONFIG_PATH,
                useEslintrc: false,
            });
            const report = await cli.lintFiles(["comment-directive.html"]);
            const messages = report[0].messages;

            assertMessages(messages, []);
        });
    });
    describe("About fixtures/no-error", () => {
        for (const name of fs
            .readdirSync(FIXTURE_DIR)
            .filter((s) => s.indexOf("no-error-") === 0)) {
            it(`should no errors /${name}`, async () => {
                const cli = new ESLint({
                    cwd: FIXTURE_DIR,
                    overrideConfigFile: CONFIG_PATH,
                    useEslintrc: false,
                });
                const report = await cli.lintFiles([name]);
                const messages = report[0].messages;

                assertMessages(messages, []);
            });
        }
    });
});
