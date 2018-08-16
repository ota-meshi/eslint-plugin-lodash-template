"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/html-closing-bracket-spacing")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("html-closing-bracket-spacing", rule, {
    valid: [
        "",
        "<body><div></div><div /></body>",
        "<body><div foo></div><div foo /></body>",
        "<body><div foo=a></div><div foo=a /></body>",
        '<body><div foo="a"></div><div foo="a" /></body>',
        {
            code: "<body ><div ></div><div /></body>",
            options: [{ startTag: "always" }],
        },
        {
            code: "<body><div></div ><div /></body >",
            options: [{ endTag: "always" }],
        },
        {
            code: "<body><div></div><div/></body>",
            options: [{ selfClosingTag: "never" }],
        },
        "<body><div",
        "<body><div></div",
        {
            code: "<body><div",
            options: [{ startTag: "never", endTag: "never" }],
        },
        {
            code: "<body><div></div",
            options: [{ startTag: "never", endTag: "never" }],
        },
        `
        <div
        >
        </div
        >
        `,
    ],
    invalid: [
        {
            code: "<body>\n  <div >\n  </div >\n  <div/>\n</body>",
            output: "<body>\n  <div>\n  </div>\n  <div />\n</body>",
            errors: [
                {
                    message: "Expected no space before `>`, but found.",
                    line: 2,
                    column: 7,
                    endColumn: 9,
                },
                {
                    message: "Expected no space before `>`, but found.",
                    line: 3,
                    column: 8,
                    endColumn: 10,
                },
                {
                    message: "Expected a space before `/>`, but not found.",
                    line: 4,
                    column: 7,
                    endColumn: 9,
                },
            ],
        },
        {
            code: "<body>\n  <div foo ></div>\n  <div foo/>\n</body>",
            output: "<body>\n  <div foo></div>\n  <div foo />\n</body>",
            errors: [
                {
                    message: "Expected no space before `>`, but found.",
                    line: 2,
                    column: 11,
                    endColumn: 13,
                },
                {
                    message: "Expected a space before `/>`, but not found.",
                    line: 3,
                    column: 11,
                    endColumn: 13,
                },
            ],
        },
        {
            code: '<body>\n  <div foo="1" ></div>\n  <div foo="1"/>\n</body>',
            output: '<body>\n  <div foo="1"></div>\n  <div foo="1" />\n</body>',
            errors: [
                {
                    message: "Expected no space before `>`, but found.",
                    line: 2,
                    column: 15,
                    endColumn: 17,
                },
                {
                    message: "Expected a space before `/>`, but not found.",
                    line: 3,
                    column: 15,
                    endColumn: 17,
                },
            ],
        },
        {
            code: "<body >\n  <div>\n  </div>\n  <div />\n</body >",
            output: "<body >\n  <div >\n  </div >\n  <div/>\n</body >",
            options: [
                {
                    startTag: "always",
                    endTag: "always",
                    selfClosingTag: "never",
                },
            ],
            errors: [
                {
                    message: "Expected a space before `>`, but not found.",
                    line: 2,
                    column: 7,
                    endColumn: 8,
                },
                {
                    message: "Expected a space before `>`, but not found.",
                    line: 3,
                    column: 8,
                    endColumn: 9,
                },
                {
                    message: "Expected no space before `/>`, but found.",
                    line: 4,
                    column: 7,
                    endColumn: 10,
                },
            ],
        },
    ],
})
