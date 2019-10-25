"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/html-closing-bracket-newline")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("html-closing-bracket-newline", rule, {
    valid: [
        { filename: "test.html", code: "<body><div></div></body>" },
        {
            filename: "test.html",
            code: `
          <body>
            <div
              id="">
            </div>
          </body>
        `,
        },
        {
            filename: "test.html",
            code: "<body><div></div></body>",
            options: [
                {
                    singleline: "never",
                    multiline: "never",
                },
            ],
        },
        {
            filename: "test.html",
            code: `
              <body>
                <div
                  id="">
                </div>
              </body>
            `,
            options: [
                {
                    singleline: "never",
                    multiline: "never",
                },
            ],
        },
        {
            filename: "test.html",
            code: `
              <body>
                <div
                  id=""
                  >
                </div>
              </body>
            `,
            options: [
                {
                    singleline: "never",
                    multiline: "always",
                },
            ],
        },
        {
            filename: "test.html",
            code: `
              <body>
                <div id="">
                </div>
              </body>
            `,
            options: [
                {
                    singleline: "never",
                    multiline: "always",
                },
            ],
        },
        {
            filename: "test.html",
            code: `
              <body
              >
                <div
                  id="">
                </div
                >
              </body
              >
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
              <body
              >
                <div id=""
                >
                </div
                >
              </body
              >
            `,
            options: [
                {
                    singleline: "always",
                    multiline: "never",
                },
            ],
        },

        // Ignore if no closing brackets
        {
            filename: "test.html",
            code: `
          <body>
            <div
              id=
              ""
        `,
        },
    ],
    invalid: [
        {
            filename: "test.html",
            code: `
              <body>
                <div
                ></div

                >
              </body>
            `,
            output: `
              <body>
                <div></div>
              </body>
            `,
            errors: [
                "Expected no line breaks before closing bracket, but 1 line break found.",
                "Expected no line breaks before closing bracket, but 2 line breaks found.",
            ],
        },
        {
            filename: "test.html",
            code: `
              <body>
                <div
                  id=""
                  >
                </div>
              </body>
            `,
            output: `
              <body>
                <div
                  id="">
                </div>
              </body>
            `,
            errors: [
                "Expected no line breaks before closing bracket, but 1 line break found.",
            ],
        },
        {
            filename: "test.html",
            code: `
              <body>
                <div
                ></div

                >
              </body>
            `,
            output: `
              <body>
                <div></div>
              </body>
            `,
            options: [
                {
                    singleline: "never",
                    multiline: "never",
                },
            ],
            errors: [
                "Expected no line breaks before closing bracket, but 1 line break found.",
                "Expected no line breaks before closing bracket, but 2 line breaks found.",
            ],
        },
        {
            filename: "test.html",
            code: `
              <body>
                <div
                  id=""
                  >
                </div>
              </body>
            `,
            output: `
              <body>
                <div
                  id="">
                </div>
              </body>
            `,
            options: [
                {
                    singleline: "never",
                    multiline: "never",
                },
            ],
            errors: [
                "Expected no line breaks before closing bracket, but 1 line break found.",
            ],
        },
        {
            filename: "test.html",
            code: `
              <body>
                <div
                  id="">
                </div>
              </body>
            `,
            output: `
              <body>
                <div
                  id=""
>
                </div>
              </body>
            `,
            options: [
                {
                    singleline: "never",
                    multiline: "always",
                },
            ],
            errors: [
                "Expected 1 line break before closing bracket, but no line breaks found.",
            ],
        },
        {
            filename: "test.html",
            code: `
              <body>
                <div id=""
                >
                </div
                >
              </body>
            `,
            output: `
              <body>
                <div id="">
                </div>
              </body>
            `,
            options: [
                {
                    singleline: "never",
                    multiline: "always",
                },
            ],
            errors: [
                "Expected no line breaks before closing bracket, but 1 line break found.",
                "Expected no line breaks before closing bracket, but 1 line break found.",
            ],
        },
        {
            filename: "test.html",
            code: `
              <body
              >
                <div
                  id=""
                  >
                </div>
              </body
              >
            `,
            output: `
              <body
              >
                <div
                  id="">
                </div
>
              </body
              >
            `,
            options: [
                {
                    singleline: "always",
                    multiline: "never",
                },
            ],
            errors: [
                "Expected no line breaks before closing bracket, but 1 line break found.",
                "Expected 1 line break before closing bracket, but no line breaks found.",
            ],
        },
        {
            filename: "test.html",
            code: `
              <body
              >
                <div id="">
                </div>
              </body
              >
            `,
            output: `
              <body
              >
                <div id=""
>
                </div
>
              </body
              >
            `,
            options: [
                {
                    singleline: "always",
                    multiline: "never",
                },
            ],
            errors: [
                "Expected 1 line break before closing bracket, but no line breaks found.",
                "Expected 1 line break before closing bracket, but no line breaks found.",
            ],
        },
        {
            filename: "test.html",
            code: `
              <div id=""

              >
              </div

              >
            `,
            output: `
              <div id=""
>
              </div
>
            `,
            options: [
                {
                    singleline: "always",
                    multiline: "always",
                },
            ],
            errors: [
                "Expected 1 line break before closing bracket, but 2 line breaks found.",
                "Expected 1 line break before closing bracket, but 2 line breaks found.",
            ],
        },
    ],
})
