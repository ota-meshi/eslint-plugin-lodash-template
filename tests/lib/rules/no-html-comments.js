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
        "<div></div>",
        `<div>
        <% arr.forEach((a)=>{ %>
            <%= a %>
            <%- a %>
        <% }) %>
        </div>`,
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
    ],
})
