

"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-empty-template-interpolation")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("no-empty-template-interpolation", rule, {
    valid: [
        "<% inter %>",
        `<div>
        <% arr.forEach((a)=>{ %>
            <%= a %>
            <%- a %>
        <% }) %>
        </div>`,
    ],
    invalid: [
        {
            code: "<%    %>",
            output: null,
            errors: ["Empty micro-template interpolation.",
            ],
            filename: "test.html",
        },
        {
            code: "<%%>",
            output: null,
            errors: ["Empty micro-template interpolation.",
            ],
            filename: "test.html",
        },
        {
            code: `<%
%>`,
            output: null,
            errors: [
                {
                    message: "Empty micro-template interpolation.",
                    line: 1,
                    column: 1,
                    endLine: 2,
                    endColumn: 3,
                },
            ],
            filename: "test.html",
        },
        // templateSettings
        {
            code: "{{}}",
            output: null,
            errors: [
                {
                    message: "Empty micro-template interpolation.",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 5,
                },
            ],
            parserOptions: {
                ecmaVersion: 2015,
                templateSettings: {
                    interpolate: ["{{", "}}"],
                },
            },
            filename: "test.html",
        },
        {
            code: "{{}}",
            output: null,
            errors: ["Empty micro-template interpolation."],
            parserOptions: {
                ecmaVersion: 2015,
                templateSettings: {
                    interpolate: "{{([\\s\\S]+?)}}",
                },
            },
            filename: "test.html",
        },
        {
            code: "{{}}",
            output: null,
            errors: ["Empty micro-template interpolation."],
            parserOptions: {
                ecmaVersion: 2015,
                templateSettings: {
                    interpolate: "{{([\\s\\S]*?)}}",
                },
            },
            filename: "test.html",
        },
        {
            code: "{{}}",
            output: null,
            errors: ["Empty micro-template interpolation."],
            parserOptions: {
                ecmaVersion: 2015,
                templateSettings: {
                    interpolate: "{{([\\S\\s]+?)}}",
                },
            },
            filename: "test.html",
        },
        {
            code: "{{}}",
            output: null,
            errors: ["Empty micro-template interpolation."],
            parserOptions: {
                ecmaVersion: 2015,
                templateSettings: {
                    interpolate: "{{([\\S\\s]*?)}}",
                },
            },
            filename: "test.html",
        },
        {
            code: "<%  %>",
            output: null,
            errors: ["Empty micro-template interpolation."],
            parserOptions: {
                ecmaVersion: 2015,
                templateSettings: {
                    interpolate: "{{(unknown)}}",
                },
            },
            filename: "test.html",
        },
    ],
})
