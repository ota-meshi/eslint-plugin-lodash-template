"use strict"

const path = require("path")
const fs = require("fs")

/**
 * Get the all rules
 * @returns {Array} The all rules
 */
function readRules() {
    const rulesRoot = path.resolve(__dirname, "../rules")
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
