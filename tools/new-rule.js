"use strict";

const fs = require("fs");
const path = require("path");
const logger = console;

// main
((ruleId) => {
    if (ruleId == null) {
        logger.error("Usage: npm run new <RuleID>");
        process.exitCode = 1;
        return;
    }
    if (!/^[\w-]+$/u.test(ruleId)) {
        logger.error("Invalid RuleID '%s'.", ruleId);
        process.exitCode = 1;
        return;
    }

    const ruleFile = path.resolve(__dirname, `../lib/rules/${ruleId}.js`);
    const testFile = path.resolve(__dirname, `../tests/lib/rules/${ruleId}.js`);
    const docFile = path.resolve(__dirname, `../docs/rules/${ruleId}.md`);

    fs.writeFileSync(
        ruleFile,
        `"use strict"

module.exports = {
    meta: {
        docs: {
            description: "",
            category: "",
            url: "",
        },
        fixable: null,
        schema: [],
    },
    create(context) {
        return {}
    },
}
`
    );
    fs.writeFileSync(
        testFile,
        `"use strict"

const RuleTester = require("eslint").RuleTester
const rule = require("../../../lib/rules/${ruleId}.js")

const tester = new RuleTester({
    parser: require.resolve("../../../lib/parser/micro-template-eslint-parser"),
    parserOptions: {
        ecmaVersion: 2015,
    },
})

tester.run("${ruleId}", rule, {
    valid: [],
    invalid: [],
})
`
    );
    fs.writeFileSync(
        docFile,
        `#  (lodash-template/${ruleId})

## Rule Details

This rule reports ??? as errors.

:-1: Examples of **incorrect** code for this rule:

\`\`\`js
\`\`\`

:+1: Examples of **correct** code for this rule:

\`\`\`js
\`\`\`

`
    );
})(process.argv[2]);
