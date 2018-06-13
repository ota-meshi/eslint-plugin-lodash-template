/**
 * @author Yosuke Ota
 */
"use strict"

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/html-content-newline")

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("html-content-newline", rule, {
    valid: [
        "<body><div class=\"panel\">content</div></body>",
        `
      <body>
        <div class="panel">
          content
        </div>
      </body>`,
        `
      <body>
        <div
          class="panel"
        >
          content
        </div>
      </body>`,
        {
            code: `
        <body><div class="panel">
          content
        </div></body>
      `,
            options: [{
                singleline: "always",
                multiline: "never",
            }],
        },
        {
            code: `
        <body><div
            class="panel"
          >content</div></body>
        `,
            options: [{
                singleline: "always",
                multiline: "never",
            }],
        },
        // empty
        "<body><div class=\"panel\"></div></body>",
        {
            code: `<body><div
      class="panel"></div></body>`,
            options: [{
                singleline: "never",
                multiline: "never",
            }],
        },
        // self closing
        {
            code: `
        <body>
          <self-closing />
        </body>`,
            options: [{
                singleline: "always",
                multiline: "never",
            }],
        },
        // ignores
        {
            code: `
        <body>
          <pre>content</pre>
          <pre
            id="test-pre"
          >content</pre>
          <pre><div>content</div></pre>
          <textarea>content</textarea>
          <textarea
            id="test-textarea"
          >content</textarea>
        </body>`,
            options: [{
                singleline: "always",
                multiline: "always",
            }],
        },
        {
            code: `
        <body>
          <ignore-tag>content</ignore-tag>
          <ignore-tag
            id="test-pre"
          >content</ignore-tag>
          <ignore-tag><div>content</div></ignore-tag>
        </body>`,
            options: [{
                singleline: "always",
                multiline: "always",
                ignoreNames: ["ignore-tag"],
            }],
        },
        // multiline contents
        `
      <body>
        <div>
          <div>
            content
            content
          </div>
        </div>
      </body>
    `,
        // Ignore if no closing brackets
        `
      <body>
        <div
          id=
          ""
    `,
    ],
    invalid: [
        {
            code: `
        <body>
          <div
            class="panel"
          >content</div>
        </body>
      `,
            output: `
        <body>
          <div
            class="panel"
          >
content
</div>
        </body>
      `,
            errors: [
                {
                    message: "Expected 1 line break after closing bracket of the \"div\" element, but no line breaks found.",
                    line: 5,
                    column: 12,
                    nodeType: "HTMLTagClose",
                    endLine: 5,
                    endColumn: 12,
                },
                {
                    message: "Expected 1 line break before opening bracket of the \"div\" element, but no line breaks found.",
                    line: 5,
                    column: 19,
                    nodeType: "HTMLEndTagOpen",
                    endLine: 5,
                    endColumn: 19,
                },
            ],
        },
        {
            code: `
        <body>
          <div class="panel">content</div>
        </body>
      `,
            options: [{
                singleline: "always",
                multiline: "never",
            }],
            output: `
        <body>
          <div class="panel">
content
</div>
        </body>
      `,
            errors: [
                {
                    message: "Expected 1 line break after closing bracket of the \"div\" element, but no line breaks found.",
                    line: 3,
                    column: 30,
                    nodeType: "HTMLTagClose",
                    endLine: 3,
                    endColumn: 30,
                },
                {
                    message: "Expected 1 line break before opening bracket of the \"div\" element, but no line breaks found.",
                    line: 3,
                    column: 37,
                    nodeType: "HTMLEndTagOpen",
                    endLine: 3,
                    endColumn: 37,
                },
            ],
        },
        {
            code: `
        <body><div
            class="panel"
          >
            content
          </div></body>
      `,
            options: [{
                singleline: "always",
                multiline: "never",
            }],
            output: `
        <body><div
            class="panel"
          >content</div></body>
      `,
            errors: [
                {
                    message: "Expected no line breaks after closing bracket of the \"div\" element, but 1 line break found.",
                    line: 4,
                    column: 12,
                    nodeType: "HTMLTagClose",
                    endLine: 5,
                    endColumn: 13,
                },
                {
                    message: "Expected no line breaks before opening bracket of the \"div\" element, but 1 line break found.",
                    line: 5,
                    column: 20,
                    nodeType: "HTMLEndTagOpen",
                    endLine: 6,
                    endColumn: 11,
                },
            ],
        },
        // comments
        {
            code: `
        <body>
          <div><!--comment--></div>
        </body>
      `,
            options: [{
                singleline: "always",
            }],
            output: `
        <body>
          <div>
<!--comment-->
</div>
        </body>
      `,
            errors: [
                {
                    message: "Expected 1 line break after closing bracket of the \"div\" element, but no line breaks found.",
                    line: 3,
                    column: 16,
                },
                {
                    message: "Expected 1 line break before opening bracket of the \"div\" element, but no line breaks found.",
                    line: 3,
                    column: 30,
                },
            ],
        },
        {
            code: `
        <body>
          <div>
          <!--comment-->
          </div>
        </body>
      `,
            options: [{
                singleline: "never",
            }],
            output: `
        <body>
          <div><!--comment--></div>
        </body>
      `,
            errors: [
                {
                    message: "Expected no line breaks after closing bracket of the \"div\" element, but 1 line break found.",
                    line: 3,
                    column: 16,

                },
                {
                    message: "Expected no line breaks before opening bracket of the \"div\" element, but 1 line break found.",
                    line: 4,
                    column: 25,

                },
            ],
        },
        // one error
        {
            code: `
        <body>
          <div>content
          </div>
        </body>
      `,
            options: [{
                singleline: "always",
            }],
            output: `
        <body>
          <div>
content
          </div>
        </body>
      `,
            errors: [
                {
                    message: "Expected 1 line break after closing bracket of the \"div\" element, but no line breaks found.",
                    line: 3,
                    column: 16,
                },
            ],
        },
        {
            code: `
        <body>
          <div>
          content</div>
        </body>
      `,
            options: [{
                singleline: "always",
            }],
            output: `
        <body>
          <div>
          content
</div>
        </body>
      `,
            errors: [
                {
                    message: "Expected 1 line break before opening bracket of the \"div\" element, but no line breaks found.",
                    line: 4,
                    column: 18,
                },
            ],
        },
        {
            code: `
        <body><div>content
          </div></body>
      `,
            options: [{
                singleline: "never",
                multiline: "ignore",
            }],
            output: `
        <body><div>content</div></body>
      `,
            errors: [{
                message: "Expected no line breaks before opening bracket of the \"div\" element, but 1 line break found.",
                line: 2,
                column: 27,
            }],
        },
        {
            code: `
        <body><div>
          content</div></body>
      `,
            options: [{
                singleline: "never",
                multiline: "ignore",
            }],
            output: `
        <body><div>content</div></body>
      `,
            errors: [{
                message: "Expected no line breaks after closing bracket of the \"div\" element, but 1 line break found.",
                line: 2,
                column: 20,
            }],
        },
        // multiline content
        {
            code: `
        <body><div>content<div>content
        content</div>content</div></body>
      `,
            options: [{
                singleline: "never",
            }],
            output: `
        <body>
<div>
content<div>
content
        content
</div>content
</div>
</body>
      `,
            errors: [
                {
                    message: "Expected 1 line break after closing bracket of the \"body\" element, but no line breaks found.",
                    line: 2,
                    column: 15,
                },
                {
                    message: "Expected 1 line break after closing bracket of the \"div\" element, but no line breaks found.",
                    line: 2,
                    column: 20,
                },
                {
                    message: "Expected 1 line break after closing bracket of the \"div\" element, but no line breaks found.",
                    line: 2,
                    column: 32,
                },
                {
                    message: "Expected 1 line break before opening bracket of the \"div\" element, but no line breaks found.",
                    line: 3,
                    column: 16,
                },
                {
                    message: "Expected 1 line break before opening bracket of the \"div\" element, but no line breaks found.",
                    line: 3,
                    column: 29,
                },
                {
                    message: "Expected 1 line break before opening bracket of the \"body\" element, but no line breaks found.",
                    line: 3,
                    column: 35,
                },
            ],
        },
        // empty
        {
            code: `
        <body>
          <div></div>
        </body>
      `,
            options: [{
                singleline: "always",
            }],
            output: `
        <body>
          <div>
</div>
        </body>
      `,
            errors: [
                {
                    message: "Expected 1 line break after closing bracket of the \"div\" element, but no line breaks found.",
                    line: 3,
                    column: 16,
                },
                {
                    message: "Expected 1 line break before opening bracket of the \"div\" element, but no line breaks found.",
                    line: 3,
                    column: 16,
                },
            ],
        },
        {
            code: `
        <body><div>
        </div></body>
      `,
            options: [{
                singleline: "never",
                multiline: "ignore",
            }],
            output: `
        <body><div></div></body>
      `,
            errors: [
                {
                    message: "Expected no line breaks after closing bracket of the \"div\" element, but 1 line break found.",
                    line: 2,
                    column: 20,
                },
                {
                    message: "Expected no line breaks before opening bracket of the \"div\" element, but 1 line break found.",
                    line: 2,
                    column: 20,

                },
            ],
        },
        // multi line breaks
        {
            code: `
        <body>
          <div>

            content

          </div>
        </body>
      `,
            options: [{
                singleline: "always",
            }],
            output: `
        <body>
          <div>
content
</div>
        </body>
      `,
            errors: [
                {
                    message: "Expected 1 line break after closing bracket of the \"div\" element, but 2 line breaks found.",
                    line: 3,
                    column: 16,
                },
                {
                    message: "Expected 1 line break before opening bracket of the \"div\" element, but 2 line breaks found.",
                    line: 5,
                    column: 20,
                },
            ],
        },
        // mustache
        {
            code: `
        <body>
          <div>{{content}}</div>
        </body>
      `,
            options: [{
                singleline: "always",
            }],
            output: `
        <body>
          <div>
{{content}}
</div>
        </body>
      `,
            errors: [
                {
                    message: "Expected 1 line break after closing bracket of the \"div\" element, but no line breaks found.",
                    line: 3,
                    column: 16,
                },
                {
                    message: "Expected 1 line break before opening bracket of the \"div\" element, but no line breaks found.",
                    line: 3,
                    column: 27,
                },
            ],
        },
        // multiline end tag
        {
            code: `
        <body>
          <div>content</div
          >
        </body>
      `,
            output: `
        <body>
          <div>
content
</div
          >
        </body>
      `,
            errors: [
                {
                    message: "Expected 1 line break after closing bracket of the \"div\" element, but no line breaks found.",
                    line: 3,
                    column: 16,
                },
                {
                    message: "Expected 1 line break before opening bracket of the \"div\" element, but no line breaks found.",
                    line: 3,
                    column: 23,
                }],
        },
    ],
})
