"use strict"


const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/no-space-attribute-equal-sign")


const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("no-space-attribute-equal-sign", rule, {

    valid: [
        "",
        "<div class=\"item\">",
        "<div class='item'>",
        "<div class=item>",
        "<div class>",
        "<div class=<%= aaa %>item>",
    ],

    invalid: [
        {
            code: "<div class = \"item\">",
            output: "<div class=\"item\">",
            errors: [{
                message: "Equal signs in must not be spaced.",
                type: "HTMLPunctuator",
                line: 1,
                column: 12,
            }],
        },
        {
            code: "<div class= \"item\">",
            output: "<div class=\"item\">",
            errors: [{
                message: "Equal signs in must not be spaced.",
                type: "HTMLPunctuator",
                line: 1,
                column: 11,
            }],
        },
        {
            code: "<div class =\"item\">",
            output: "<div class=\"item\">",
            errors: [{
                message: "Equal signs in must not be spaced.",
                type: "HTMLPunctuator",
                line: 1,
                column: 12,
            }],
        },
        {
            code: "<div class<%= aaa %> = <%= aaa %>item>",
            output: "<div class<%= aaa %>=<%= aaa %>item>",
            errors: ["Equal signs in must not be spaced."],
        },
    ],
})
