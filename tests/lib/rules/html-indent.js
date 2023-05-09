"use strict";

const fs = require("fs");
const path = require("path");
const RuleTester = require("eslint").RuleTester;
const rule = require("../../../lib/rules/html-indent");

const FIXTURE_ROOT = path.resolve(
    __dirname,
    "../../../tests_fixtures/html-indent/"
);

/**
 * Load test patterns from fixtures.
 *
 * - Valid tests:   All codes in FIXTURE_ROOT are valid code.
 * - Invalid tests: There is an invalid test for every valid test. It removes
 *                  all indentations from the valid test and checks whether
 *                  `html-indent` rule restores the removed indentations exactly.
 *
 * If a test has some ignored line, we can't use the mechanism.
 * So `additionalValid` and `additionalInvalid` exist for asymmetry test cases.
 *
 * @param {object[]} additionalValid The array of additional valid patterns.
 * @param {object[]} additionalInvalid The array of additional invalid patterns.
 * @returns {object} The loaded patterns.
 */
function loadPatterns(additionalValid, additionalInvalid) {
    const valid = fs.readdirSync(FIXTURE_ROOT).map((filename) => {
        const code0 = fs.readFileSync(
            path.join(FIXTURE_ROOT, filename),
            "utf8"
        );
        const code = code0.replace(/^<!--(.+?)-->/u, `<!--${filename}-->`);
        const baseObj = JSON.parse(/^<!--(.+?)-->/u.exec(code0)[1]);
        return Object.assign(baseObj, { code, filename });
    });
    const invalid = valid
        .map((pattern) => {
            const kind =
                (pattern.options && pattern.options[0]) === "tab"
                    ? "tab"
                    : "space";
            const output = pattern.code;
            const lines = output.split("\n").map((text, number) => ({
                number,
                text,
                indentSize: (/^[\t ]+/u.exec(text) || [""])[0].length,
            }));
            const code = lines
                .map((line) => line.text.replace(/^[\t ]+/u, ""))
                .join("\n");
            const errors = lines
                .map((line) =>
                    line.indentSize === 0
                        ? null
                        : {
                              message: `Expected indentation of ${
                                  line.indentSize
                              } ${kind}${
                                  line.indentSize === 1 ? "" : "s"
                              } but found 0 ${kind}s.`,
                              line: line.number + 1,
                          }
                )
                .filter(Boolean);

            return Object.assign({}, pattern, { code, output, errors });
        })
        .filter(Boolean);

    return {
        valid: valid.concat(additionalValid),
        invalid: invalid.concat(additionalInvalid),
    };
}

/**
 * Prevents leading spaces in a multiline template literal from appearing in the resulting string
 * @param {string[]} strings The strings in the template literal
 * @returns {string} The template literal, with spaces removed from all lines
 */
function unIndent(strings) {
    const templateValue = strings[0];
    const lines = templateValue
        .replace(/^\n/u, "")
        .replace(/\n\s*$/u, "")
        .split("\n");
    const lineIndents = lines
        .filter((line) => line.trim())
        .map((line) => line.match(/ */u)[0].length);
    const minLineIndent = Math.min.apply(null, lineIndents);

    return lines.map((line) => line.slice(minLineIndent)).join("\n");
}

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
});

tester.run(
    "html-indent",
    rule,
    loadPatterns(
        // Valid
        [
            {
                code: unIndent`
        <div>
          <% print(
            'value'
          ) %>
        </div>
        `,
                filename: "test.html",
            },
            {
                code: unIndent`
        <div>
          <% print(
        'value'
          ) %>
        </div>
        `,
                filename: "test.html",
            },
            {
                code: unIndent`
            <div>
              <pre>
                text
            text
              text
              </pre>
            </div>
            `,
                filename: "pre-test.html",
            },
            {
                code: unIndent`
        <% for ( var i = 0; i < users.length; i++ ) { %>
          <li><a href="<%= users[i].url %>"><%= users[i].name %></a></li>
        <% } %>
        `,
                filename: "test.html",
            },
            {
                code: unIndent`
<ul>
  <% for ( var i = 0; i < users.length; i++ ) { %>
    <li><a href="<%= users[i].url %>"><%= users[i].name %></a></li>

\u0020
\u0020\u0020
\u0020\u0020\u0020
\u0020\u0020\u0020\u0020
\u0020\u0020\u0020\u0020\u0020
\u0020\u0020\u0020\u0020\u0020\u0020
  <% } %>
</ul>
        `,
                filename: "test.html",
            },
            {
                code: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <title>title</title>
  </head>
  <body>
    <div id="a"></div>
  </body>
</html>
`,
                filename: "line-feed-at-last.html",
            },
            {
                code: `
<!DOCTYPE html>
<html>
  <head>
    <style
      type="text/css"
    >
        body {
            width: 100%;
        }
    </style>
    <script>
                // script
    </script>
  </head>
  <body>
    <pre
      id="a"
    >aaaaaaaaa
aaaaaaaaa
  aaaaaaaaa
      aaaaaaaaa
    </pre>
  </body>
</html>
`,
                filename: "ignore-elements.html",
            },
            {
                code: unIndent`
        <div
          attr="
                              <%= 'data'%>">
        </div>
        `,
                filename: "test.html",
            },
            {
                code: unIndent`
                <% if (a) {%>
                var a;
                a = <%= 'data'%>">
                <% } %>
                `,
                filename: "test.js",
            },
            {
                code: unIndent`
                <% for ( var i = 0; i < users.length; i++ ) { %><% } %>
                <li><a href="<%= users[i].url %>"><%= users[i].name %></a></li>
                `,
                filename: "script-indent-for3-no-in-punc.html",
            },
            {
                code: unIndent`
                <div></div>
                text
                <!-- comment -->
                <% print('value') %>
                text<div></div>
                <div></div><!-- comment --><div></div>`,
                filename: "root-indent1.html",
            },
        ],

        // Invalid
        [
            {
                code: unIndent`
                <div>
                <pre>
                    text
                text
                <!-- comment -->
                  text
                  </pre>
                </div>
            `,
                output: unIndent`
                <div>
                  <pre>
                    text
                text
                <!-- comment -->
                  text
                  </pre>
                </div>
            `,
                errors: [
                    {
                        message:
                            "Expected indentation of 2 spaces but found 0 spaces.",
                        line: 2,
                        column: 1,
                        endLine: 2,
                        endColumn: 1,
                    },
                ],
                filename: "pre-test.html",
            },
            {
                code: `
  <div></div>
  text
  <!-- comment -->
  <% print(
    'value') %>
`,
                output: `
<div></div>
text
<!-- comment -->
<% print(
    'value') %>
`,
                errors: [
                    "Expected indentation of 0 spaces but found 2 spaces.",
                    "Expected indentation of 0 spaces but found 2 spaces.",
                    "Expected indentation of 0 spaces but found 2 spaces.",
                    "Expected indentation of 0 spaces but found 2 spaces.",
                ],
                filename: "root-test.html",
            },
            {
                code: `
<div>
\ttext
</div>
`,
                output: `
<div>
  text
</div>
`,
                errors: ['Expected " " character, but found "\\t" character.'],
                filename: "tab.html",
            },
            {
                code: unIndent`
                <% for ( var i = 0; i < users.length; i++ ) { %>
                <li><a href="<%= users[i].url %>"><%= users[i].name %></a></li>
                <% } %>
            `,
                output: unIndent`
                <% for ( var i = 0; i < users.length; i++ ) { %>
                  <li><a href="<%= users[i].url %>"><%= users[i].name %></a></li>
                <% } %>
            `,
                errors: [
                    "Expected indentation of 2 spaces but found 0 spaces.",
                ],
                filename: "test.html",
            },
            {
                code: unIndent`
                  <% for ( var i = 0; i < users.length; i++ ) { %>
                    <li><a href="<%= users[i].url %>"><%= users[i].name %></a></li>
                <% } %>
            `,
                output: unIndent`
                <% for ( var i = 0; i < users.length; i++ ) { %>
                  <li><a href="<%= users[i].url %>"><%= users[i].name %></a></li>
                <% } %>
            `,
                errors: [
                    "Expected indentation of 0 spaces but found 2 spaces.",
                    "Expected indentation of 2 spaces but found 4 spaces.",
                ],
                filename: "test.html",
            },
        ]
    )
);
