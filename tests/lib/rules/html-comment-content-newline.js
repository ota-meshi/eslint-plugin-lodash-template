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
        "<!-- comment -->",
        `
          <!--
            comment
            comment
          -->
        `,
        {
            code: `
            <!--
              comment
            -->
            `,
            options: [{
                singleline: "always",
                multiline: "never",
            }],
        },
        {
            code: `
            <!-- comment
              comment -->
            `,
            options: [{
                singleline: "always",
                multiline: "never",
            }],
        },
        {
            code: `
            <!--
              comment
            -->
            <!-- comment
              comment -->
            `,
            options: [{
                singleline: "ignore",
                multiline: "ignore",
            }],
        },
        // empty
        "<!---->",
        {
            code: "<!---->",
            options: [{
                singleline: "never",
                multiline: "never",
            }],
        },
    ],
    invalid: [
        {
            code: `
            <!--
              comment
            -->
            `,
            output: `
            <!--comment-->
            `,
            errors: ["Expected no line breaks after `<!--`, but 1 line break found.", "Expected no line breaks before `-->`, but 1 line break found.",
            ],
        },
        {
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
                    message: "Expected 1 line break after `<!--`, but no line breaks found.",
                    line: 2,
                    column: 17,
                    endLine: 2,
                    endColumn: 17,
                },
                {
                    message: "Expected 1 line break before `-->`, but no line breaks found.",
                    line: 3,
                    column: 22,
                    endLine: 3,
                    endColumn: 22,
                },
            ],
        },
        {
            code: `
            <!--comment-->
            `,
            options: [{
                singleline: "always",
                multiline: "never",
            }],
            output: `
            <!--
comment
-->
            `,
            errors: [
                {
                    message: "Expected 1 line break after `<!--`, but no line breaks found.",
                    line: 2,
                    column: 17,
                    endLine: 2,
                    endColumn: 17,
                },
                {
                    message: "Expected 1 line break before `-->`, but no line breaks found.",
                    line: 2,
                    column: 24,
                    endLine: 2,
                    endColumn: 24,
                },

            ],
        },
        {
            code: `
            <!--
              comment
              comment
            -->
            `,
            options: [{
                singleline: "always",
                multiline: "never",
            }],
            output: `
            <!--comment
              comment-->
            `,
            errors: [
                {
                    message: "Expected no line breaks after `<!--`, but 1 line break found.",
                    line: 2,
                    column: 17,
                    endLine: 3,
                    endColumn: 15,
                },
                {
                    message: "Expected no line breaks before `-->`, but 1 line break found.",
                    line: 4,
                    column: 22,
                    endLine: 5,
                    endColumn: 13,
                },
            ],
        },
        // one error
        {
            code: `
            <!--comment
            -->
            `,
            options: [{
                singleline: "always",
            }],
            output: `
            <!--
comment
            -->
            `,
            errors: [
                {
                    message: "Expected 1 line break after `<!--`, but no line breaks found.",
                    line: 2,
                    column: 17,
                },
            ],
        },
        {
            code: `
            <!--
            comment-->
            `,
            options: [{
                singleline: "always",
            }],
            output: `
            <!--
            comment
-->
            `,
            errors: [
                {
                    message: "Expected 1 line break before `-->`, but no line breaks found.",
                    line: 3,
                    column: 20,
                },
            ],
        },
        {
            code: `
            <!--comment
            -->
            `,
            options: [{
                singleline: "never",
                multiline: "ignore",
            }],
            output: `
            <!--comment-->
            `,
            errors: [{
                message: "Expected no line breaks before `-->`, but 1 line break found.",
                line: 2,
                column: 24,
            }],
        },
        {
            code: `
            <!--
            comment-->
            `,
            options: [{
                singleline: "never",
                multiline: "ignore",
            }],
            output: `
            <!--comment-->
            `,
            errors: [{
                message: "Expected no line breaks after `<!--`, but 1 line break found.",
                line: 2,
                column: 17,
            }],
        },
        // empty
        {
            code: `
            <!---->
            `,
            options: [{
                singleline: "always",
            }],
            output: `
            <!--
-->
            `,
            errors: [
                {
                    message: "Expected 1 line break after `<!--`, but no line breaks found.",
                    line: 2,
                    column: 17,
                },
                {
                    message: "Expected 1 line break before `-->`, but no line breaks found.",
                    line: 2,
                    column: 17,
                },
            ],
        },
        {
            code: `
            <!--
            -->
            `,
            options: [{
                singleline: "never",
                multiline: "ignore",
            }],
            output: `
            <!---->
            `,
            errors: [
                {
                    message: "Expected no line breaks after `<!--`, but 1 line break found.",
                    line: 2,
                    column: 17,
                },
                {
                    message: "Expected no line breaks before `-->`, but 1 line break found.",
                    line: 2,
                    column: 17,

                },
            ],
        },
        // multi line breaks
        {
            code: `
            <!--

              comment

            -->
            `,
            options: [{
                singleline: "always",
            }],
            output: `
            <!--
comment
-->
            `,
            errors: [
                {
                    message: "Expected 1 line break after `<!--`, but 2 line breaks found.",
                    line: 2,
                    column: 17,
                },
                {
                    message: "Expected 1 line break before `-->`, but 2 line breaks found.",
                    line: 4,
                    column: 22,
                },
            ],
        },
    ],
})
