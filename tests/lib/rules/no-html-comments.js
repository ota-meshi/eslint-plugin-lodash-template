"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-html-comments")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("no-html-comments", rule, {
    valid: [
        {
            code: "",
            filename: "test.html",
        },
        "(function() {})()",
        "<% inter %>",
        {
            code: "<div></div>",
            filename: "test.html",
        },
        `<div>
        <% arr.forEach((a)=>{ %>
            <%= a %>
            <%- a %>
        <% }) %>
        </div>`,
        {
            code: "<br>",
            filename: "test.html",
        },
        {
            code:
            `
            <!DOCTYPE html>
            <html>
            <body>
                <h1>My First Heading</h1>
                <p>My first paragraph.</p>
            </body>
            </html>
            `,
            filename: "test.html",
        },
    ],
    invalid: [
        {
            code: "<!-- comment -->",
            output: null,
            errors: [
                {
                    message: "HTML comment are forbidden.",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 17,
                },
            ],
            filename: "test.html",
        },
        {
            code: "<div><!-- comment --></div>",
            output: null,
            errors: ["HTML comment are forbidden."],
            filename: "test.html",
        },
    ],
})
