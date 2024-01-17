"use strict";

const RuleTester = require("../../eslint-compat").RuleTester;
const rule = require("../../../lib/rules/no-empty-template-tag");

const tester = new RuleTester({
    languageOptions: {
        parser: require("../../../lib/parser/micro-template-eslint-parser"),
        ecmaVersion: 2015,
    },
});

tester.run("no-empty-template-tag", rule, {
    valid: [
        { filename: "test.html", code: "<% inter %>" },
        {
            filename: "test.html",
            code: `
            <div>
                <% arr.forEach((a)=>{ %>
                    <%= a %>
                    <%- a %>
                <% }) %>
            </div>`,
        },
    ],
    invalid: [
        {
            filename: "test.html",
            code: "<%    %>",
            output: null,
            errors: ["Empty micro-template tag."],
        },
        {
            filename: "test.html",
            code: "<%%>",
            output: null,
            errors: ["Empty micro-template tag."],
        },
        {
            filename: "test.html",
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
        },
        // templateSettings
        {
            filename: "test.html",
            code: "{{}}",
            output: null,
            errors: [
                {
                    message: "Empty micro-template tag.",
                    line: 1,
                    column: 1,
                    endLine: 1,
                    endColumn: 5,
                },
            ],
            languageOptions: {
                ecmaVersion: 2015,
                parserOptions: {
                    templateSettings: {
                        interpolate: ["{{", "}}"],
                    },
                },
            },
        },
        {
            filename: "test.html",
            code: "{{}}",
            output: null,
            errors: ["Empty micro-template tag."],
            languageOptions: {
                ecmaVersion: 2015,
                parserOptions: {
                    templateSettings: {
                        interpolate: "\\{\\{([\\s\\S]+?)\\}\\}",
                    },
                },
            },
        },
        {
            filename: "test.html",
            code: "{{}}",
            output: null,
            errors: ["Empty micro-template tag."],
            languageOptions: {
                ecmaVersion: 2015,
                parserOptions: {
                    templateSettings: {
                        interpolate: "\\{\\{([\\s\\S]*?)\\}\\}",
                    },
                },
            },
        },
        {
            filename: "test.html",
            code: "{{}}",
            output: null,
            errors: ["Empty micro-template tag."],
            languageOptions: {
                ecmaVersion: 2015,
                parserOptions: {
                    templateSettings: {
                        interpolate: "\\{\\{([\\S\\s]+?)\\}\\}",
                    },
                },
            },
        },
        {
            filename: "test.html",
            code: "{{}}",
            output: null,
            errors: ["Empty micro-template tag."],
            languageOptions: {
                ecmaVersion: 2015,
                parserOptions: {
                    templateSettings: {
                        interpolate: "\\{\\{([\\S\\s]*?)\\}\\}",
                    },
                },
            },
        },
        {
            filename: "test.html",
            code: "<%  %>",
            output: null,
            errors: ["Empty micro-template tag."],
            languageOptions: {
                ecmaVersion: 2015,
                parserOptions: {
                    templateSettings: {
                        interpolate: "\\{\\{(unknown)\\}\\}",
                    },
                },
            },
        },
    ],
});
