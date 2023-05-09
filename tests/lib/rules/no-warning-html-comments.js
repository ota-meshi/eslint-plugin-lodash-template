"use strict";

const RuleTester = require("eslint").RuleTester;
const rule = require("../../../lib/rules/no-warning-html-comments");

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
});

tester.run("no-warning-html-comments", rule, {
    valid: [
        {
            filename: "test.html",
            code: "",
        },
        "<!--comment-->",
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
            code: "<!-- before TODO -->",
            options: [
                {
                    location: "start",
                },
            ],
        },
        "<!-- eslint-disable-line lodash-template/no-warning-html-comments TODO -->",
    ],
    invalid: [
        {
            filename: "test.html",
            code: "<!--TODO-->",
            output: null,
            errors: [
                {
                    message: "Unexpected 'todo' comment.",
                    line: 1,
                    column: 1,
                    type: "HTMLComment",
                    endLine: 1,
                    endColumn: 12,
                },
            ],
        },
        {
            filename: "test.html",
            code: "<!-- before TODO -->",
            output: null,
            errors: ["Unexpected 'todo' comment."],
        },
        {
            filename: "test.html",
            code: "<!-- %T -->",
            output: null,
            options: [{ terms: ["%t"] }],
            errors: ["Unexpected '%t' comment."],
        },
        {
            filename: "test.html",
            code: "<!-- %% -->",
            output: null,
            options: [{ terms: ["%%"] }],
            errors: ["Unexpected '%%' comment."],
        },
    ],
});
