"use strict"

const path = require("path")
const fs = require("fs")
const isWin = require("os").platform().startsWith("win")
const { ESLint } = require("../tests/eslint-compat")
const rules = require("./lib/load-rules")

let content = `
"use strict"

const baseRules = [
    ${rules
        .map(
            (rule) => `{
    rule: require("../rules/${rule.meta.docs.ruleName}"),
    ruleName: "${rule.meta.docs.ruleName}",
    ruleId: "${rule.meta.docs.ruleId}",
    },
    `,
        )
        .join("")}
]

const rules = baseRules.map(obj => {
    const rule = obj.rule
    rule.meta.docs.ruleName = obj.ruleName
    rule.meta.docs.ruleId = obj.ruleId
    return rule
})

/**
 * Collect the rules
 * @param {string} category category
 * @returns {Array} rules
 */
function collectRules(category) {
    return rules.reduce((obj, rule) => {
        if (
            (!category || rule.meta.docs.category === category) &&
            !rule.meta.deprecated
        ) {
            obj[rule.meta.docs.ruleId] = "error"
        }
        return obj
    }, {})
}

module.exports = { rules, collectRules }
`

const filePath = path.resolve(__dirname, "../lib/utils/rules.js")

if (isWin) {
    content = content
        .replace(/\r?\n/gu, "\n")
        .replace(/\r/gu, "\n")
        .replace(/\n/gu, "\r\n")
}

// Update file.
fs.writeFileSync(filePath, content)

// Format files.
const linter = new ESLint({ fix: true })
linter.lintFiles([filePath]).then((report) => {
    ESLint.outputFixes(report)
})
