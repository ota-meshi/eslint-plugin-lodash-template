"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-empty-template-tag")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("no-empty-template-tag", rule, {
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
            errors: ["Empty micro-template tag."],
            filename: "test.html",
        },
        {
            code: "<%%>",
            output: null,
            errors: ["Empty micro-template tag."],
            filename: "test.html",
        },
        {
            code: `<%
%>`,
            output: null,
            errors: [
                {
                    message: "Empty micro-template tag.",
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
            parserOptions: {
                ecmaVersion: 2015,
                templateSettings: {
                    interpolate: ["{{", "}}"],
                },
            },
            errors: [
                {
                    message: "Empty micro-template tag.",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 5,
                },
            ],
            filename: "test.html",
        },
        {
            code: "{{}}",
            output: null,
            parserOptions: {
                ecmaVersion: 2015,
                templateSettings: {
                    interpolate: "{{([\\s\\S]+?)}}",
                },
            },
            errors: ["Empty micro-template tag."],
            filename: "test.html",
        },
        {
            code: "{{}}",
            output: null,
            parserOptions: {
                ecmaVersion: 2015,
                templateSettings: {
                    interpolate: "{{([\\s\\S]*?)}}",
                },
            },
            errors: ["Empty micro-template tag."],
            filename: "test.html",
        },
        {
            code: "{{}}",
            output: null,
            parserOptions: {
                ecmaVersion: 2015,
                templateSettings: {
                    interpolate: "{{([\\S\\s]+?)}}",
                },
            },
            errors: ["Empty micro-template tag."],
            filename: "test.html",
        },
        {
            code: "{{}}",
            output: null,
            parserOptions: {
                ecmaVersion: 2015,
                templateSettings: {
                    interpolate: "{{([\\S\\s]*?)}}",
                },
            },
            errors: ["Empty micro-template tag."],
            filename: "test.html",
        },
        {
            code: "<%  %>",
            output: null,
            parserOptions: {
                ecmaVersion: 2015,
                templateSettings: {
                    interpolate: "{{(unknown)}}",
                },
            },
            errors: ["Empty micro-template tag."],
            filename: "test.html",
        },
    ],
})
