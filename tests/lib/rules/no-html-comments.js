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
            filename: "test.html",
            code: "",
        },
        "(function() {})()",
        "<% inter %>",
        {
            filename: "test.html",
            code: "<div></div>",
        },
        `<div>
        <% arr.forEach((a)=>{ %>
            <%= a %>
            <%- a %>
        <% }) %>
        </div>`,
        {
            filename: "test.html",
            code: "<br>",
        },
        {
            filename: "test.html",
            code: `
            <!DOCTYPE html>
            <html>
            <body>
                <h1>My First Heading</h1>
                <p>My first paragraph.</p>
            </body>
            </html>
            `,
        },
    ],
    invalid: [
        {
            filename: "test.html",
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
        },
        {
            filename: "test.html",
            code: "<div><!-- comment --></div>",
            output: null,
            errors: ["HTML comment are forbidden."],
        },
    ],
})
