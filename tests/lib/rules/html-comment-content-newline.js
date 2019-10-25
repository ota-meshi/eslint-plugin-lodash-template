"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/html-comment-content-newline")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("html-comment-content-newline", rule, {
    valid: [
        { filename: "test.html", code: "<!-- comment -->" },
        {
            filename: "test.html",
            code: `
          <!--
            comment
            comment
          -->
        `,
        },
        {
            filename: "test.html",
            code: `
            <!--
              comment
            -->
            `,
            options: [
                {
                    singleline: "always",
                    multiline: "never",
                },
            ],
        },
        {
            filename: "test.html",
            code: `
            <!-- comment
              comment -->
            `,
            options: [
                {
                    singleline: "always",
                    multiline: "never",
                },
            ],
        },
        {
            filename: "test.html",
            code: `
            <!--
              comment
            -->
            <!-- comment
              comment -->
            `,
            options: [
                {
                    singleline: "ignore",
                    multiline: "ignore",
                },
            ],
        },
        // empty
        { filename: "test.html", code: "<!---->" },
        {
            filename: "test.html",
            code: "<!---->",
            options: [
                {
                    singleline: "never",
                    multiline: "never",
                },
            ],
        },
        // other
        {
            filename: "test.html",
            code: "<!DOCTYPE html>",
            options: [
                {
                    singleline: "always",
                    multiline: "always",
                },
            ],
        },
        {
            filename: "test.html",
            code: "<!illegal>",
            options: [
                {
                    singleline: "always",
                    multiline: "always",
                },
            ],
        },
    ],
    invalid: [
        {
            filename: "test.html",
            code: `
            <!--
              comment
            -->
            `,
            output: `
            <!--comment-->
            `,
            errors: [
                "Expected no line breaks after `<!--`, but 1 line break found.",
                "Expected no line breaks before `-->`, but 1 line break found.",
            ],
        },
        {
            filename: "test.html",
            code: `
            <!--comment
              comment-->
            `,
            output: `
            <!--
comment
              comment
-->
            `,
            errors: [
                {
                    message:
                        "Expected 1 line break after `<!--`, but no line breaks found.",
                    line: 2,
                    column: 17,
                    endLine: 2,
                    endColumn: 17,
                },
                {
                    message:
                        "Expected 1 line break before `-->`, but no line breaks found.",
                    line: 3,
                    column: 22,
                    endLine: 3,
                    endColumn: 22,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
            <!--comment-->
            `,
            output: `
            <!--
comment
-->
            `,
            options: [
                {
                    singleline: "always",
                    multiline: "never",
                },
            ],
            errors: [
                {
                    message:
                        "Expected 1 line break after `<!--`, but no line breaks found.",
                    line: 2,
                    column: 17,
                    endLine: 2,
                    endColumn: 17,
                },
                {
                    message:
                        "Expected 1 line break before `-->`, but no line breaks found.",
                    line: 2,
                    column: 24,
                    endLine: 2,
                    endColumn: 24,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
            <!--
              comment
              comment
            -->
            `,
            output: `
            <!--comment
              comment-->
            `,
            options: [
                {
                    singleline: "always",
                    multiline: "never",
                },
            ],
            errors: [
                {
                    message:
                        "Expected no line breaks after `<!--`, but 1 line break found.",
                    line: 2,
                    column: 17,
                    endLine: 3,
                    endColumn: 15,
                },
                {
                    message:
                        "Expected no line breaks before `-->`, but 1 line break found.",
                    line: 4,
                    column: 22,
                    endLine: 5,
                    endColumn: 13,
                },
            ],
        },
        // one error
        {
            filename: "test.html",
            code: `
            <!--comment
            -->
            `,
            output: `
            <!--
comment
            -->
            `,
            options: [
                {
                    singleline: "always",
                },
            ],
            errors: [
                {
                    message:
                        "Expected 1 line break after `<!--`, but no line breaks found.",
                    line: 2,
                    column: 17,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
            <!--
            comment-->
            `,
            output: `
            <!--
            comment
-->
            `,
            options: [
                {
                    singleline: "always",
                },
            ],
            errors: [
                {
                    message:
                        "Expected 1 line break before `-->`, but no line breaks found.",
                    line: 3,
                    column: 20,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
            <!--comment
            -->
            `,
            output: `
            <!--comment-->
            `,
            options: [
                {
                    singleline: "never",
                    multiline: "ignore",
                },
            ],
            errors: [
                {
                    message:
                        "Expected no line breaks before `-->`, but 1 line break found.",
                    line: 2,
                    column: 24,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
            <!--
            comment-->
            `,
            output: `
            <!--comment-->
            `,
            options: [
                {
                    singleline: "never",
                    multiline: "ignore",
                },
            ],
            errors: [
                {
                    message:
                        "Expected no line breaks after `<!--`, but 1 line break found.",
                    line: 2,
                    column: 17,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
            <!--

            comment

            -->
            `,
            output: `
            <!--comment-->
            `,
            options: [
                {
                    singleline: "never",
                    multiline: "never",
                },
            ],
            errors: [
                "Expected no line breaks after `<!--`, but 2 line breaks found.",
                "Expected no line breaks before `-->`, but 2 line breaks found.",
            ],
        },
        // empty
        {
            filename: "test.html",
            code: `
            <!---->
            `,
            output: `
            <!--
-->
            `,
            options: [
                {
                    singleline: "always",
                },
            ],
            errors: [
                {
                    message:
                        "Expected 1 line break after `<!--`, but no line breaks found.",
                    line: 2,
                    column: 17,
                },
                {
                    message:
                        "Expected 1 line break before `-->`, but no line breaks found.",
                    line: 2,
                    column: 17,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
            <!--
            -->
            `,
            output: `
            <!---->
            `,
            options: [
                {
                    singleline: "never",
                    multiline: "ignore",
                },
            ],
            errors: [
                {
                    message:
                        "Expected no line breaks after `<!--`, but 1 line break found.",
                    line: 2,
                    column: 17,
                },
                {
                    message:
                        "Expected no line breaks before `-->`, but 1 line break found.",
                    line: 2,
                    column: 17,
                },
            ],
        },
        // multi line breaks
        {
            filename: "test.html",
            code: `
            <!--

              comment

            -->
            `,
            output: `
            <!--
comment
-->
            `,
            options: [
                {
                    singleline: "always",
                },
            ],
            errors: [
                {
                    message:
                        "Expected 1 line break after `<!--`, but 2 line breaks found.",
                    line: 2,
                    column: 17,
                },
                {
                    message:
                        "Expected 1 line break before `-->`, but 2 line breaks found.",
                    line: 4,
                    column: 22,
                },
            ],
        },
    ],
})
