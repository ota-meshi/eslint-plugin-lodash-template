"use strict";

const RuleTester = require("../../eslint-compat").RuleTester;
const rule = require("../../../lib/rules/no-semi-in-template-interpolation.js");

const tester = new RuleTester({
    languageOptions: {
        parser: require(
            "../../../lib/parser/micro-template-eslint-parser",
        ),
        ecmaVersion: 2015,
    },
});

tester.run("no-semi-in-template-interpolation", rule, {
    valid: [
        "",
        `
        <% if (a) { %>
          <div>
        <% } %>
        `,
        `
        <% const a = 123; %>
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
        <div><%= /**/ %></div>
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
        <div><%= a/*comment*/ %></div>
        `,
        `
        <div><%= a %></div>
        `,
        `
        <%= if (a) { %>
          <div>
        <% } %>
        `,
    ],
    invalid: [
        {
            code: `
            <div><%= a;/*comment*/ %></div>
            `,
            output: `
            <div><%= a/*comment*/ %></div>
            `,
            errors: [
                {
                    message: "Unnecessary semicolon.",
                    line: 2,
                    column: 23,
                    endLine: 2,
                    endColumn: 24,
                },
            ],
        },
        {
            code: `
            <div><%= a; %></div>
            `,
            output: `
            <div><%= a %></div>
            `,
            errors: ["Unnecessary semicolon."],
        },
    ],
});
