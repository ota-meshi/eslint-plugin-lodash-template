"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/html-comment-spacing")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("html-comment-spacing", rule, {
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
                '<body>             <div id="               "></div>         </body>',
            filename: "test.html",
        },
        {
            code:
                '<body> <div style="  " class="       foo      " attr=foo   ></div>      </body>',
            filename: "test.html",
        },
        {
            code: "<body><div><!-- text --></div></body>",
            filename: "test.html",
        },
        {
            code: "<body><div><!-- --></div></body>",
            filename: "test.html",
        },
        {
            code: "<body><div><!-- --></div></body>",
            options: ["always"],
            filename: "test.html",
        },
        {
            code: "<body><div><!----></div></body>",
            options: ["never"],
            filename: "test.html",
        },
        {
            code: "<body><div><!--text--></div></body>",
            options: ["never"],
            filename: "test.html",
        },
        {
            code: "<body><div><!-- text --></div></body>",
            options: ["always"],
            filename: "test.html",
        },
        {
            code: "<body><div><!--         --></div></body>",
            options: ["always"],
            filename: "test.html",
        },
        {
            code: "<body><div><!--         --></div></body>",
            options: ["never"],
            filename: "test.html",
        },
        {
            code: `<!--
            always
            -->`,
            options: ["always"],
            filename: "test.html",
        },
        {
            code: `<!--
            never
            -->`,
            options: ["never"],
            filename: "test.html",
        },
        {
            code: "<!comment>",
            filename: "test.html",
        },
    ],

    invalid: [
        {
            code: "<body><div><!-- text--></div></body>",
            output: "<body><div><!-- text --></div></body>",
            options: ["always"],
            errors: ["Expected 1 space before `-->`, but no spaces found."],
            filename: "test.html",
        },
        {
            code: "<body><div><!--text --></div></body>",
            output: "<body><div><!-- text --></div></body>",
            options: ["always"],
            errors: ["Expected 1 space after `<!--`, but no spaces found."],
            filename: "test.html",
        },
        {
            code: "<body><div><!-- text--></div></body>",
            output: "<body><div><!--text--></div></body>",
            options: ["never"],
            errors: ["Expected no spaces after `<!--`, but 1 space found."],
            filename: "test.html",
        },
        {
            code: "<body><div><!--text --></div></body>",
            output: "<body><div><!--text--></div></body>",
            options: ["never"],
            errors: ["Expected no spaces before `-->`, but 1 space found."],
            filename: "test.html",
        },
        {
            code: "<body><div><!--text--></div></body>",
            output: "<body><div><!-- text --></div></body>",
            options: ["always"],
            errors: [
                "Expected 1 space after `<!--`, but no spaces found.",
                "Expected 1 space before `-->`, but no spaces found.",
            ],
            filename: "test.html",
        },
        {
            code: "<body><div><!--  text  --></div></body>",
            output: "<body><div><!-- text --></div></body>",
            options: ["always"],
            errors: [
                "Expected 1 space after `<!--`, but 2 spaces found.",
                "Expected 1 space before `-->`, but 2 spaces found.",
            ],
            filename: "test.html",
        },
        {
            code: "<body><div><!-- text --></div></body>",
            output: "<body><div><!--text--></div></body>",
            options: ["never"],
            errors: [
                "Expected no spaces after `<!--`, but 1 space found.",
                "Expected no spaces before `-->`, but 1 space found.",
            ],
            filename: "test.html",
        },
        {
            code: "<body><div><!--   text   --></div></body>",
            output: "<body><div><!--text--></div></body>",
            options: ["never"],
            errors: [
                "Expected no spaces after `<!--`, but 3 spaces found.",
                "Expected no spaces before `-->`, but 3 spaces found.",
            ],
            filename: "test.html",
        },
        {
            code: "<body><div><!--   text   --><!--   text   --></div></body>",
            output: "<body><div><!--text--><!--text--></div></body>",
            options: ["never"],
            errors: [
                "Expected no spaces after `<!--`, but 3 spaces found.",
                "Expected no spaces before `-->`, but 3 spaces found.",
                "Expected no spaces after `<!--`, but 3 spaces found.",
                "Expected no spaces before `-->`, but 3 spaces found.",
            ],
            filename: "test.html",
        },
    ],
})
