"use strict";

const RuleTester = require("eslint").RuleTester;
const rule = require("../../../lib/rules/no-invalid-template-interpolation");

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
});

tester.run("no-invalid-template-interpolation", rule, {
    valid: [
        "",
        `
        <% if (a) { %>
          <div>
        <% } %>
        `,
        `
        <div><%= text %></div>
        `,
        `
        <li><%- user %></li>
        `,
        `
        <div><%=      %></div>
        `,
        `
        <div class="content"></div>

        <ul>
            <% _.forEach(users, (user) => { %>
                <li><%- user %></li>
            <% }); %>
        </ul>
        `,
        `
        <div><%= fn() %></div>
        `,
        `
        <div><%= 123+123 %></div>
        `,
        `
        <div><%= a?b:c %></div>
        `,
        `
        <div><%= a = b %></div>
        `,
        `
        <div><%= fn = function fn() {},fn() %></div>
        `,
        `
        <div><%= null %></div>
        `,
        `
        <div><%= 'str' %></div>
        `,
        `
        <div><%= a;/*comment*/ %></div>
        `,
        `
        <div><%= a; %></div>
        `,
    ],
    invalid: [
        {
            code: `
            <%= if (a) { %>
              <div>
            <% } %>
            `,
            output: null,
            errors: [
                {
                    message: "Expected an expression, but a not expressions.",
                    line: 2,
                    column: 13,
                    endLine: 2,
                    endColumn: 28,
                },
            ],
        },
        {
            code: `
            <div><%= /**/ %></div>
            `,
            output: null,
            errors: [
                {
                    message: "Empty statement.",
                    line: 2,
                    column: 18,
                    endLine: 2,
                    endColumn: 29,
                },
            ],
        },
        {
            code: `
            <%= if (a) { %>
              <div>
            <%- } %>
            `,
            output: null,
            errors: [
                "Expected an expression, but a not expressions.",
                "Expected an expression, but a not expressions.",
            ],
        },
        {
            code: `
            <%= (a// %>
            <%- ) %>
            `,
            output: null,
            errors: [
                "Expected an expression, but a not expressions.",
                "Expected an expression, but a not expressions.",
            ],
        },
        {
            code: `
            <div><%= a;; %></div>
            `,
            output: null,
            errors: ["Expected an expression, but a not expressions."],
        },
        {
            code: `
            <div><%= ;/**/ %></div>
            `,
            output: null,
            errors: ["Expected an expression, but a not expressions."],
        },
    ],
});
