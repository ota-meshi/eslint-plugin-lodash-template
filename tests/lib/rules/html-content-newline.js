"use strict";

const RuleTester = require("../../eslint-compat").RuleTester;
const rule = require("../../../lib/rules/html-content-newline");

const tester = new RuleTester({
    languageOptions: {
        parser: require("../../../lib/parser/micro-template-eslint-parser"),
        ecmaVersion: 2015,
    },
});

tester.run("html-content-newline", rule, {
    valid: [
        {
            filename: "test.html",
            code: '<body><div class="panel">content</div></body>',
        },
        {
            filename: "test.html",
            code: `
      <body>
        <div class="panel">
          content
        </div>
      </body>`,
        },
        {
            filename: "test.html",
            code: `
      <body>
        <div
          class="panel"
        >
          content
        </div>
      </body>`,
        },
        {
            filename: "test.html",
            code: `
        <body><div class="panel">
          content
        </div></body>
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
        <body><div
            class="panel"
          >content</div></body>
        `,
            options: [
                {
                    singleline: "always",
                    multiline: "never",
                },
            ],
        },
        // empty
        {
            filename: "test.html",
            code: '<body><div class="panel"></div></body>',
        },
        {
            filename: "test.html",
            code: `<body><div
      class="panel"></div></body>`,
            options: [
                {
                    singleline: "never",
                    multiline: "never",
                },
            ],
        },
        // self closing
        {
            filename: "test.html",
            code: `
        <body>
          <self-closing />
        </body>`,
            options: [
                {
                    singleline: "always",
                    multiline: "never",
                },
            ],
        },
        // ignores
        {
            filename: "test.html",
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
            options: [
                {
                    singleline: "always",
                    multiline: "always",
                },
            ],
        },
        {
            filename: "test.html",
            code: `
        <body>
          <ignore-tag>content</ignore-tag>
          <ignore-tag
            id="test-pre"
          >content</ignore-tag>
          <ignore-tag><div>content</div></ignore-tag>
        </body>`,
            options: [
                {
                    singleline: "always",
                    multiline: "always",
                    ignoreNames: ["ignore-tag"],
                },
            ],
        },
        // multiline contents
        {
            filename: "test.html",
            code: `
      <body>
        <div>
          <div>
            content
            content
          </div>
        </div>
      </body>
    `,
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
        // nothing end tag
        {
            filename: "test.html",
            code: `
          <div>content
        `,
        },
    ],
    invalid: [
        {
            filename: "test.html",
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
                    message:
                        'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
                    line: 5,
                    column: 12,
                    endLine: 5,
                    endColumn: 12,
                },
                {
                    message:
                        'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
                    line: 5,
                    column: 19,
                    endLine: 5,
                    endColumn: 19,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
        <body>
          <div class="panel">content</div>
        </body>
      `,
            output: `
        <body>
          <div class="panel">
content
</div>
        </body>
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
                        'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
                    line: 3,
                    column: 30,
                    endLine: 3,
                    endColumn: 30,
                },
                {
                    message:
                        'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
                    line: 3,
                    column: 37,
                    endLine: 3,
                    endColumn: 37,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
        <body><div
            class="panel"
          >
            content
          </div></body>
      `,
            output: `
        <body><div
            class="panel"
          >content</div></body>
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
                        'Expected no line breaks after closing bracket of the "div" element, but 1 line break found.',
                    line: 4,
                    column: 12,
                    endLine: 5,
                    endColumn: 13,
                },
                {
                    message:
                        'Expected no line breaks before opening bracket of the "div" element, but 1 line break found.',
                    line: 5,
                    column: 20,
                    endLine: 6,
                    endColumn: 11,
                },
            ],
        },
        // comments
        {
            filename: "test.html",
            code: `
        <body>
          <div><!--comment--></div>
        </body>
      `,
            output: `
        <body>
          <div>
<!--comment-->
</div>
        </body>
      `,
            options: [
                {
                    singleline: "always",
                },
            ],
            errors: [
                {
                    message:
                        'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
                    line: 3,
                    column: 16,
                },
                {
                    message:
                        'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
                    line: 3,
                    column: 30,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
        <body>
          <div>
          <!--comment-->
          </div>
        </body>
      `,
            output: `
        <body>
          <div><!--comment--></div>
        </body>
      `,
            options: [
                {
                    singleline: "never",
                },
            ],
            errors: [
                {
                    message:
                        'Expected no line breaks after closing bracket of the "div" element, but 1 line break found.',
                    line: 3,
                    column: 16,
                },
                {
                    message:
                        'Expected no line breaks before opening bracket of the "div" element, but 1 line break found.',
                    line: 4,
                    column: 25,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
        <body>
          <div>

          <!--comment-->

          </div>
        </body>
      `,
            output: `
        <body>
          <div><!--comment--></div>
        </body>
      `,
            options: [
                {
                    singleline: "never",
                },
            ],
            errors: [
                'Expected no line breaks after closing bracket of the "div" element, but 2 line breaks found.',
                'Expected no line breaks before opening bracket of the "div" element, but 2 line breaks found.',
            ],
        },
        // one error
        {
            filename: "test.html",
            code: `
        <body>
          <div>content
          </div>
        </body>
      `,
            output: `
        <body>
          <div>
content
          </div>
        </body>
      `,
            options: [
                {
                    singleline: "always",
                },
            ],
            errors: [
                {
                    message:
                        'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
                    line: 3,
                    column: 16,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
        <body>
          <div>
          content</div>
        </body>
      `,
            output: `
        <body>
          <div>
          content
</div>
        </body>
      `,
            options: [
                {
                    singleline: "always",
                },
            ],
            errors: [
                {
                    message:
                        'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
                    line: 4,
                    column: 18,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
        <body><div>content
          </div></body>
      `,
            output: `
        <body><div>content</div></body>
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
                        'Expected no line breaks before opening bracket of the "div" element, but 1 line break found.',
                    line: 2,
                    column: 27,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
        <body><div>
          content</div></body>
      `,
            output: `
        <body><div>content</div></body>
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
                        'Expected no line breaks after closing bracket of the "div" element, but 1 line break found.',
                    line: 2,
                    column: 20,
                },
            ],
        },
        // multiline content
        {
            filename: "test.html",
            code: `
        <body><div>content<div>content
        content</div>content</div></body>
      `,
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
            options: [
                {
                    singleline: "never",
                },
            ],
            errors: [
                {
                    message:
                        'Expected 1 line break after closing bracket of the "body" element, but no line breaks found.',
                    line: 2,
                    column: 15,
                },
                {
                    message:
                        'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
                    line: 2,
                    column: 20,
                },
                {
                    message:
                        'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
                    line: 2,
                    column: 32,
                },
                {
                    message:
                        'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
                    line: 3,
                    column: 16,
                },
                {
                    message:
                        'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
                    line: 3,
                    column: 29,
                },
                {
                    message:
                        'Expected 1 line break before opening bracket of the "body" element, but no line breaks found.',
                    line: 3,
                    column: 35,
                },
            ],
        },
        // empty
        {
            filename: "test.html",
            code: `
        <body>
          <div></div>
        </body>
      `,
            output: `
        <body>
          <div>
</div>
        </body>
      `,
            options: [
                {
                    singleline: "always",
                },
            ],
            errors: [
                {
                    message:
                        'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
                    line: 3,
                    column: 16,
                },
            ],
        },
        {
            filename: "test.html",
            code: `
        <body><div>
        </div></body>
      `,
            output: `
        <body><div></div></body>
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
                        'Expected no line breaks after closing bracket of the "div" element, but 1 line break found.',
                    line: 2,
                    column: 20,
                },
            ],
        },
        // multi line breaks
        {
            filename: "test.html",
            code: `
        <body>
          <div>

            content

          </div>
        </body>
      `,
            output: `
        <body>
          <div>
content
</div>
        </body>
      `,
            options: [
                {
                    singleline: "always",
                },
            ],
            errors: [
                {
                    message:
                        'Expected 1 line break after closing bracket of the "div" element, but 2 line breaks found.',
                    line: 3,
                    column: 16,
                },
                {
                    message:
                        'Expected 1 line break before opening bracket of the "div" element, but 2 line breaks found.',
                    line: 5,
                    column: 20,
                },
            ],
        },
        // mustache
        {
            filename: "test.html",
            code: `
        <body>
          <div>{{content}}</div>
        </body>
      `,
            output: `
        <body>
          <div>
{{content}}
</div>
        </body>
      `,
            options: [
                {
                    singleline: "always",
                },
            ],
            errors: [
                {
                    message:
                        'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
                    line: 3,
                    column: 16,
                },
                {
                    message:
                        'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
                    line: 3,
                    column: 27,
                },
            ],
        },
        // multiline end tag
        {
            filename: "test.html",
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
                    message:
                        'Expected 1 line break after closing bracket of the "div" element, but no line breaks found.',
                    line: 3,
                    column: 16,
                },
                {
                    message:
                        'Expected 1 line break before opening bracket of the "div" element, but no line breaks found.',
                    line: 3,
                    column: 23,
                },
            ],
        },
    ],
});
