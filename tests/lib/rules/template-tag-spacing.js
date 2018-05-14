"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/template-tag-spacing")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("template-tag-spacing", rule, {
    valid: [
        {
            code: "<body></body>",
            filename: "test.html",
        },
        {
            code: "<body><div></div></body>",
            filename: "test.html",
        },
        {
            code:
                "<body>             <div id=\"               \"></div>         </body>",
            filename: "test.html",
        },
        {
            code:
                "<body> <div :style=\"  \" :class=\"       foo      \" v-if=foo   ></div>      </body>",
            filename: "test.html",
        },
        {
            code: "<body><div><%= text %></div></body>",
            filename: "test.html",
        },
        {
            code: "<body><div><%= %></div></body>",
            filename: "test.html",
        },
        {
            code: "<body><div><%= %></div></body>",
            options: ["always"],
            filename: "test.html",
        },
        {
            code: "<body><div><%=%></div></body>",
            options: ["never"],
            filename: "test.html",
        },
        {
            code: "<body><div><%=text%></div></body>",
            options: ["never"],
            filename: "test.html",
        },
        {
            code: "<body><div><%= text %></div></body>",
            options: ["always"],
            filename: "test.html",
        },
        {
            code: "<body><div><%=         %></div></body>",
            options: ["always"],
            filename: "test.html",
        },
        {
            code: "<body><div><%=         %></div></body>",
            options: ["never"],
            filename: "test.html",
        },
    ],

    invalid: [
        {
            code: "<body><div><%= text%></div></body>",
            output: "<body><div><%= text %></div></body>",
            options: ["always"],
            errors: ["Expected 1 space before '%>', but no spaces found."],
            filename: "test.html",
        },
        {
            code: "<body><div><%=text %></div></body>",
            output: "<body><div><%= text %></div></body>",
            options: ["always"],
            errors: ["Expected 1 space after '<%=', but no spaces found."],
            filename: "test.html",
        },
        {
            code: "<body><div><%= text%></div></body>",
            output: "<body><div><%=text%></div></body>",
            options: ["never"],
            errors: ["Expected no spaces after '<%=', but 1 space found."],
            filename: "test.html",
        },
        {
            code: "<body><div><%=text %></div></body>",
            output: "<body><div><%=text%></div></body>",
            options: ["never"],
            errors: ["Expected no spaces before '%>', but 1 space found."],
            filename: "test.html",
        },
        {
            code: "<body><div><%=text%></div></body>",
            output: "<body><div><%= text %></div></body>",
            options: ["always"],
            errors: [
                "Expected 1 space after '<%=', but no spaces found.",
                "Expected 1 space before '%>', but no spaces found.",
            ],
            filename: "test.html",
        },
        {
            code: "<body><div><%=  text  %></div></body>",
            output: "<body><div><%= text %></div></body>",
            options: ["always"],
            errors: [
                "Expected 1 space after '<%=', but 2 spaces found.",
                "Expected 1 space before '%>', but 2 spaces found.",
            ],
            filename: "test.html",
        },
        {
            code: "<body><div><%= text %></div></body>",
            output: "<body><div><%=text%></div></body>",
            options: ["never"],
            errors: [
                "Expected no spaces after '<%=', but 1 space found.",
                "Expected no spaces before '%>', but 1 space found.",
            ],
            filename: "test.html",
        },
        {
            code: "<body><div><%=   text   %></div></body>",
            output: "<body><div><%=text%></div></body>",
            options: ["never"],
            errors: [
                "Expected no spaces after '<%=', but 3 spaces found.",
                "Expected no spaces before '%>', but 3 spaces found.",
            ],
            filename: "test.html",
        },
        {
            code: "<body><div><%=   text   %><%=   text   %></div></body>",
            output: "<body><div><%=text%><%=text%></div></body>",
            options: ["never"],
            errors: [
                "Expected no spaces after '<%=', but 3 spaces found.",
                "Expected no spaces before '%>', but 3 spaces found.",
                "Expected no spaces after '<%=', but 3 spaces found.",
                "Expected no spaces before '%>', but 3 spaces found.",
            ],
            filename: "test.html",
        },
        {
            code: "<div>{{text}}</div>",
            output: "<div>{{ text }}</div>",
            errors: [
                {
                    message: "Expected 1 space after '{{', but no spaces found.",
                    line: 1,
                    column: 6,
                    endLine: 1,
                    endColumn: 8,
                },
                {
                    message: "Expected 1 space before '}}', but no spaces found.",
                    line: 1,
                    column: 12,
                    endLine: 1,
                    endColumn: 14,
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
            code: "<@-inner@><%=inner%>",
            output: "<@- inner @><%= inner %>",
            errors: [
                "Expected 1 space after '<@-', but no spaces found.",
                "Expected 1 space before '@>', but no spaces found.",
                "Expected 1 space after '<%=', but no spaces found.",
                "Expected 1 space before '%>', but no spaces found.",
            ],
            parserOptions: {
                ecmaVersion: 2015,
                templateSettings: {
                    interpolate: "<[%@][=|-]([\\s\\S]+?)[%@]>",
                },
            },
            filename: "test.html",
        },
    ],
})
