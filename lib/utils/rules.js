"use strict"

const baseRules = [
    {
        rule: require("../rules/html-indent"),
        ruleName: "html-indent",
        ruleId: "lodash-template/html-indent",
    },
    {
        rule: require("../rules/no-empty-template-tag"),
        ruleName: "no-empty-template-tag",
        ruleId: "lodash-template/no-empty-template-tag",
    },
    {
        rule: require("../rules/no-html-comments"),
        ruleName: "no-html-comments",
        ruleId: "lodash-template/no-html-comments",
    },
    {
        rule: require("../rules/no-warning-html-comments"),
        ruleName: "no-warning-html-comments",
        ruleId: "lodash-template/no-warning-html-comments",
    },
    {
        rule: require("../rules/plugin-option"),
        ruleName: "plugin-option",
        ruleId: "lodash-template/plugin-option",
    },
    {
        rule: require("../rules/prefer-escape-template-interpolations"),
        ruleName: "prefer-escape-template-interpolations",
        ruleId: "lodash-template/prefer-escape-template-interpolations",
    },
    {
        rule: require("../rules/script-indent"),
        ruleName: "script-indent",
        ruleId: "lodash-template/script-indent",
    },
    {
        rule: require("../rules/template-tag-spacing"),
        ruleName: "template-tag-spacing",
        ruleId: "lodash-template/template-tag-spacing",
    },
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
