"use strict"


const fs = require("fs")
const path = require("path")
const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/script-indent")


const FIXTURE_ROOT = path.resolve(__dirname, "../../fixtures/script-indent/")

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
    const valid = fs
        .readdirSync(FIXTURE_ROOT)
        .map(filename => {
            const code0 = fs.readFileSync(path.join(FIXTURE_ROOT, filename), "utf8")
            const code = code0.replace(/^<!--(.+?)-->/, `<!--${filename}-->`)
            const baseObj = JSON.parse(/^<!--(.+?)-->/.exec(code0)[1])
            return Object.assign(baseObj, { code, filename })
        })
    const invalid = valid
        .map(pattern => {
            const kind = ((pattern.options && pattern.options[0]) === "tab") ? "tab" : "space"
            const output = pattern.code
            const lines = output
                .split("\n")
                .map((text, number) => ({
                    number,
                    text,
                    indentSize: (/^[ \t]+/.exec(text) || [""])[0].length,
                }))
            const code = lines
                .map(line => line.text.replace(/^[ \t]+/, ""))
                .join("\n")
            const errors = lines
                .map(line =>
                    line.indentSize === 0
                        ? null
                        : { message: `Expected indentation of ${line.indentSize} ${kind}${line.indentSize === 1 ? "" : "s"} but found 0 ${kind}s.`, line: line.number + 1 })
                .filter(Boolean)

            return Object.assign({}, pattern, { code, output, errors })
        })
        .filter(Boolean)

    return {
        valid: valid.concat(additionalValid),
        invalid: invalid.concat(additionalInvalid),
    }
}

/**
 * Prevents leading spaces in a multiline template literal from appearing in the resulting string
 * @param {string[]} strings The strings in the template literal
 * @returns {string} The template literal, with spaces removed from all lines
 */
function unIndent(strings) {
    const templateValue = strings[0]
    const lines = templateValue.replace(/^\n/, "").replace(/\n\s*$/, "").split("\n")
    const lineIndents = lines.filter(line => line.trim()).map(line => line.match(/ */)[0].length)
    const minLineIndent = Math.min.apply(null, lineIndents)

    return lines.map(line => line.slice(minLineIndent)).join("\n")
}


const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        parser: "babel-eslint",
        sourceType: "module",
        ecmaVersion: 2017,
    },
})

tester.run("script-indent", rule, loadPatterns(
    // Valid
    [
        unIndent``,
        unIndent`
        <% for (
            let i = 0;
            i < arr.length;
            i++
          ) { %>
          <div class="<%= arr[i] %>"></div>
        <% } %>
        `,
        {
            options: [2, { startIndent: 0 }],
            code: unIndent`
            <% for (
              let i = 0;
              i < arr.length;
              i++
            ) { %>
              <div class="<%= arr[i] %>"></div>
            <% } %>
            `,
        },
        {
            options: [2, { startIndent: 2 }],
            code: unIndent`
            <% for (
                  let i = 0;
                  i < arr.length;
                  i++
                ) { %>
              <div class="<%= arr[i] %>"></div>
            <% } %>
            `,
        },
        unIndent`
        <div>
            <% for (
                let i = 0;
                i < arr.length;
                i++
              ) { %>
              <div class="<%= arr[i] %>"></div>
            <% } %>
        </div>
        `,
        unIndent`
        <div>
            <%
              for (
                let i = 0;
                i < arr.length;
                i++
              ) { %>
              <div class="<%= arr[i] %>"></div>
        <%
              }
            %>
        </div>
        `,
        unIndent`
        <div>
        \t<% for (
        \t    let i = 0;
        \t    i < arr.length;
        \t    i++
        \t  ) { %>
        \t  <div class="<%= arr[i] %>"></div>
        \t<% } %>
        </div>
        `,
    ],

    // Invalid
    [
        {
            options: [2, { startIndent: 2 }],
            code: unIndent`
            <% for (
                  let i = 0;
                i < arr.length;
              i++
                ) { %>
              <div class="<%= arr[i] %>"></div>
            <% } %>
            `,
            errors: [
                {
                    message: "Expected indentation of 6 spaces but found 4 spaces.",
                    line: 3,
                },
                {
                    message: "Expected indentation of 6 spaces but found 2 spaces.",
                    line: 4,
                },
            ],
            output: unIndent`
            <% for (
                  let i = 0;
                  i < arr.length;
                  i++
                ) { %>
              <div class="<%= arr[i] %>"></div>
            <% } %>
            `,
        },
        {
            options: [2, { startIndent: 2 }],
            code: unIndent`
            <% for (
            \t\t\tlet i = 0;
                  i < arr.length;
                  i++
                ) { %>
              <div class="<%= arr[i] %>"></div>
            <% } %>
            `,
            errors: [
                {
                    message: "Expected \" \" character, but found \"\\t\" character.",
                    line: 2,
                },
            ],
            output: unIndent`
            <% for (
                  let i = 0;
                  i < arr.length;
                  i++
                ) { %>
              <div class="<%= arr[i] %>"></div>
            <% } %>
            `,
        },
        {
            code: unIndent`
                <div>
                \t<% for (
                     let i = 0;
                i < arr.length;
                \t    i++
                \t  ) { %>
                \t  <div class="<%= arr[i] %>"></div>
                \t<% } %>
                </div>
                `,
            errors: [
                {
                    message: "Expected base point indentation of \"\\t\", but found \" \".",
                    line: 3,
                    column: 1,
                    endLine: 3,
                    endColumn: 6,
                },
                {
                    message: "Expected base point indentation of \"\\t\", but not found.",
                    line: 4,
                    column: 1,
                    endLine: 4,
                    endColumn: 1,
                },
            ],
            output: unIndent`
                <div>
                \t<% for (
                \t    let i = 0;
                \t    i < arr.length;
                \t    i++
                \t  ) { %>
                \t  <div class="<%= arr[i] %>"></div>
                \t<% } %>
                </div>
                `,
        },
        {
            code: unIndent`
                <div>
                \t<% for (
                \t  let i = 0;
                \t  i < arr.length;
                \t i++
                \t) { %>
                \t  <div class="<%= arr[i] %>"></div>
                \t<% } %>
                </div>
                `,
            errors: [
                {
                    message: "Expected relative indentation of 4 spaces but found 2 spaces.",
                    line: 3,
                    column: 2,
                    endLine: 3,
                    endColumn: 4,
                },
                "Expected relative indentation of 4 spaces but found 2 spaces.",
                "Expected relative indentation of 4 spaces but found 1 space.",
                "Expected relative indentation of 2 spaces but found 0 spaces.",
            ],
            output: unIndent`
                <div>
                \t<% for (
                \t    let i = 0;
                \t    i < arr.length;
                \t    i++
                \t  ) { %>
                \t  <div class="<%= arr[i] %>"></div>
                \t<% } %>
                </div>
                `,
        },

        {
            code: unIndent`
                <%
                // comment
                var a = b;
                /* comment */
                %>
                <div>
                    <%
                    // comment
                    var a = b;
                    /* comment */
                    %>
                </div>
                `,
            errors: [
                "Expected indentation of 2 spaces but found 0 spaces.",
                "Expected indentation of 2 spaces but found 0 spaces.",
                "Expected indentation of 2 spaces but found 0 spaces.",
                "Expected relative indentation of 2 spaces but found 0 spaces.",
                "Expected relative indentation of 2 spaces but found 0 spaces.",
                "Expected relative indentation of 2 spaces but found 0 spaces.",
            ],
            output: unIndent`
                <%
                  // comment
                  var a = b;
                  /* comment */
                %>
                <div>
                    <%
                      // comment
                      var a = b;
                      /* comment */
                    %>
                </div>
                `,
        },
    ]
))
