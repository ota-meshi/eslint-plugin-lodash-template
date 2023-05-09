"use strict";

const RuleTester = require("eslint").RuleTester;
const rule = require("../../../lib/rules/no-template-tag-in-start-tag.js");

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
});

tester.run("no-template-tag-in-start-tag", rule, {
    valid: [
        { filename: "test.html", code: "<input disabled >" },
        { filename: "test.html", code: '<input class="<%= classList %>" >' },
        { filename: "test.html", code: "<input class=<%= classList %> >" },
        {
            filename: "test.html",
            code: `
            <input
              <% if (disabled) { %>
              disabled
              <% } %>
            >`,
            options: [{ arrowEvaluateTag: true }],
        },
    ],
    invalid: [
        {
            filename: "test.html",
            code: "<input <%= 'disabled' %> >",
            errors: [
                {
                    message:
                        "The template interpolate tag in start tag outside attribute values are forbidden.",
                    type: "MicroTemplateInterpolate",
                    line: 1,
                    column: 8,
                },
            ],
        },
        {
            filename: "test.html",
            code: "<input <%= disabled ? 'disabled' : '' %> >",
            errors: [
                {
                    message:
                        "The template interpolate tag in start tag outside attribute values are forbidden.",
                    type: "MicroTemplateInterpolate",
                    line: 1,
                    column: 8,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
            <input
              <% if (disabled) { %>
              disabled
              <% } %>
            >`,
            errors: [
                {
                    message:
                        "The template evaluate tag in start tag outside attribute values are forbidden.",
                    line: 3,
                    column: 15,
                    type: "MicroTemplateEvaluate",
                    endLine: 3,
                    endColumn: 36,
                },
                {
                    message:
                        "The template evaluate tag in start tag outside attribute values are forbidden.",
                    line: 5,
                    column: 15,
                    type: "MicroTemplateEvaluate",
                    endLine: 5,
                    endColumn: 22,
                },
            ],
        },
        {
            filename: "test.html",
            code: "<input <%- 'disabled' %> >",
            errors: [
                "The template interpolate tag in start tag outside attribute values are forbidden.",
            ],
        },
        {
            filename: "test.html",
            code: "<input <%- disabled ? 'disabled' : '' %> >",
            errors: [
                "The template interpolate tag in start tag outside attribute values are forbidden.",
            ],
        },
        {
            filename: "test.html",
            code: "<input disabled <%= 'class=' + c  %> >",
            errors: [
                "The template interpolate tag in start tag outside attribute values are forbidden.",
            ],
        },
    ],
});
