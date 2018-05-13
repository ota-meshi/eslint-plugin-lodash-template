"use strict"

const path = require("path")
const fs = require("fs")
const eslint = require("eslint")

/**
 * Get the all rules
 * @returns {Array} The all rules
 */
function readRules() {
    const rulesRoot = path.resolve(__dirname, "../lib/rules")
    const result = fs.readdirSync(rulesRoot)
    const rules = []
    for (const name of result) {
        const ruleName = name.replace(/\.js$/, "")
        const ruleId = `lodash-template/${ruleName}`

        const rule = require(path.join(rulesRoot, name))
        rule.meta.docs.ruleId = ruleId
        rule.meta.docs.ruleName = ruleName
        rules.push(rule)
    }
    return rules
}

const rules = readRules()

const content = `
"use strict"

const baseRules = [
    ${rules
        .map(
            rule => `{
    rule: require("../rules/${rule.meta.docs.ruleName}"),
    ruleName: "${rule.meta.docs.ruleName}",
    ruleId: "${rule.meta.docs.ruleId}",
    },
    `
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
        if (!category || rule.meta.docs.category === category) {
            obj[rule.meta.docs.ruleId] = "error"
        }
        return obj
    }, {})
}

module.exports = { rules, collectRules }
`

const filePath = path.resolve(__dirname, "../lib/utils/rules.js")

// Update file.
fs.writeFileSync(filePath, content)

// Format files.
const linter = new eslint.CLIEngine({ fix: true })
const report = linter.executeOnFiles([filePath])
eslint.CLIEngine.outputFixes(report)
