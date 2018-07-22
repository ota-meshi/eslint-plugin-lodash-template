"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-warning-html-comments")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("no-warning-html-comments", rule, {
    valid: [
        {
            code: "",
            filename: "test.html",
        },
        "<!--comment-->",
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
            code: "<!-- before TODO -->",
            options: [{
                location: "start",
            }],
            filename: "test.html",
        },
        "<!-- eslint-disable-line lodash-template/no-warning-html-comments TODO -->",
    ],
    invalid: [
        {
            code: "<!--TODO-->",
            output: null,
            errors: [
                {
                    message: "Unexpected 'todo' comment.",
                    line: 1,
                    column: 1,
                    nodeType: "HTMLComment",
                    source: "<!--TODO-->",
                    endLine: 1,
                    endColumn: 12,
                },
            ],
            filename: "test.html",
        },
        {
            code: "<!-- before TODO -->",
            output: null,
            errors: [
                "Unexpected 'todo' comment.",
            ],
            filename: "test.html",
        },
        {
            code: "<!-- %T -->",
            options: [{ terms: ["%t"] }],
            output: null,
            errors: [
                "Unexpected '%t' comment.",
            ],
            filename: "test.html",
        },
        {
            code: "<!-- %% -->",
            options: [{ terms: ["%%"] }],
            output: null,
            errors: [
                "Unexpected '%%' comment.",
            ],
            filename: "test.html",
        },


    ],
})
