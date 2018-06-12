
"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-duplicate-attributes")


const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("no-duplicate-attributes", rule, {
    valid: [
        {
            filename: "test.html",
            code: "",
        },
        {
            filename: "test.html",
            code: "<body><div><div foo bar baz></div></div></body>",
        },
        {
            filename: "test.html",
            code: "<body><div><div onclick=\"foo\"></div></div></body>",
        },
        {
            filename: "test.html",
            code: "<body><div><div class style></div></div></body>",
        },
        {
            filename: "test.html",
            code: "<body><div><div style class></div></div></body>",
        },
    ],
    invalid: [
        {
            filename: "test.html",
            code: `
            <body>
              <div>
                <div
                  foo
                  foo
                  foo
                >
                </div>
              </div>
            </body>`,
            errors: [
                {
                    message: "Duplicate attribute 'foo'.",
                    line: 5,
                    column: 19,
                    nodeType: "HTMLAttribute",
                    endLine: 5,
                    endColumn: 22,
                },
                {
                    message: "Duplicate attribute 'foo'.",
                    line: 6,
                    column: 19,
                    nodeType: "HTMLAttribute",
                    endLine: 6,
                    endColumn: 22,
                },
                {
                    message: "Duplicate attribute 'foo'.",
                    line: 7,
                    column: 19,
                    nodeType: "HTMLAttribute",
                    endLine: 7,
                    endColumn: 22,
                },
            ]
            ,
        },
        {
            filename: "test.html",
            code: "<body><div><div foo : foo : ></div></div></body>",
            errors: [
                "Duplicate attribute 'foo'.",
                "Duplicate attribute ':'.",
                "Duplicate attribute 'foo'.",
                "Duplicate attribute ':'.",
            ],
        },
        {
            filename: "test.html",
            code: "<body><div><div foo foo></div></div></body>",
            errors: [
                "Duplicate attribute 'foo'.",
                "Duplicate attribute 'foo'.",
            ],
        },
    ],
})
