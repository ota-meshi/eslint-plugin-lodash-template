"use strict";

const RuleTester = require("eslint").RuleTester;
const rule = require("../../../lib/rules/prefer-escape-template-interpolations");

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
});

tester.run("prefer-escape-template-interpolations", rule, {
    valid: [
        "<% test %>",
        "<%- test %>",
        `<div>
        <% arr.forEach((a)=>{ %>
            <%- a %>
        <% }) %>
        </div>`,
    ],
    invalid: [
        {
            filename: "test.html",
            code: "<%= test %>",
            output: null,
            errors: [
                {
                    message:
                        "The escape micro-template interpolation is preferable.",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 12,
                },
            ],
        },
    ],
});
