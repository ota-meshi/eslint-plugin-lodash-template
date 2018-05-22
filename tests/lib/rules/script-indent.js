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
    ]
))
