"use strict";

const RuleTester = require("../../eslint-compat").RuleTester;
const rule = require("../../../lib/rules/no-space-attribute-equal-sign");

const tester = new RuleTester({
    languageOptions: {
        parser: require(
            "../../../lib/parser/micro-template-eslint-parser",
        ),
        ecmaVersion: 2015,
    },
});

tester.run("no-space-attribute-equal-sign", rule, {
    valid: [
        { filename: "test.html", code: "" },
        { filename: "test.html", code: '<div class="item">' },
        { filename: "test.html", code: "<div class='item'>" },
        { filename: "test.html", code: "<div class=item>" },
        { filename: "test.html", code: "<div class>" },
        { filename: "test.html", code: "<div class=<%= aaa %>item>" },
        { filename: "test.html", code: "<div dup=<%= aaa %>a dup=<%= bbb %>>" },
    ],

    invalid: [
        {
            filename: "test.html",
            code: '<div class = "item">',
            output: '<div class="item">',
            errors: [
                {
                    message: "Equal signs in must not be spaced.",
                    type: "HTMLPunctuator",
                    line: 1,
                    column: 12,
                },
            ],
        },
        {
            filename: "test.html",
            code: '<div class= "item">',
            output: '<div class="item">',
            errors: [
                {
                    message: "Equal signs in must not be spaced.",
                    type: "HTMLPunctuator",
                    line: 1,
                    column: 11,
                },
            ],
        },
        {
            filename: "test.html",
            code: '<div class ="item">',
            output: '<div class="item">',
            errors: [
                {
                    message: "Equal signs in must not be spaced.",
                    type: "HTMLPunctuator",
                    line: 1,
                    column: 12,
                },
            ],
        },
        {
            filename: "test.html",
            code: "<div class<%= aaa %> = <%= aaa %>item>",
            output: "<div class<%= aaa %>=<%= aaa %>item>",
            errors: ["Equal signs in must not be spaced."],
        },
        {
            filename: "test.html",
            code: "<div class =>",
            output: "<div class=>",
            errors: ["Equal signs in must not be spaced."],
        },
    ],
});
